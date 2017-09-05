import { createStreamMiddleware, RunFunction } from "./streamMiddleware";
import xs, { Stream, Producer } from "xstream";
import flattenConcurrently from "xstream/extra/flattenConcurrently";
import dropRepeats from "xstream/extra/dropRepeats";
import { Todo } from "./todo";
import { Action } from "redux";
import { initializeApp, User } from "firebase";


export namespace Firebase {
    export namespace actions {
        export const logged = "Firebase/logged";
        export const loginError = "Firebase/loginError";
        export const saved = "Firebase/saved";
    }
}

interface UserProducer extends Producer<User | null>{
    unsub: () => void;
}

export const middleware = createStreamMiddleware(( action$, state$ ) => {



    const app = initializeApp({
        apiKey: "AIzaSyD9EBOUVJJ_ZQvWGv2k7pxacPbBGQJLN18",
        authDomain: "ts-todo.firebaseapp.com",
        databaseURL: "https://ts-todo.firebaseio.com",
        projectId: "ts-todo",
        storageBucket: "ts-todo.appspot.com",
        messagingSenderId: "542661836093"
    });

    const database = app.database();
    const auth = app.auth();

    
    const user$ = <Stream<User>>xs
        .create(<UserProducer>{
            start ( listener ) {
                this.unsub = auth.onAuthStateChanged(
                    user => listener.next(user),
                    error => listener.error(error)
                );
            },
            stop() {
                this.unsub();
            },
        })
        .map( user => {

            const deferredUser = user === null ?
                auth.signInAnonymously():
                Promise.resolve(user)

            return xs.fromPromise(deferredUser);
        } )
        .compose(flattenConcurrently)
        .take(1);


    // will emit at most once,
    // no retry mechanism
    const userLogged$ = user$
        .take(1)
        .map( user => {
            return {
                type: Firebase.actions.logged,
                data: user
            };
        } )
        .replaceError( error => {
            return xs.of({
                type: Firebase.actions.loginError,
                data: error
            });
        } );
;

    const todoSelector = (state: any) => state.todo;

    const save$: Stream<Action> = xs.combine(
        user$,
        <Stream<any>>state$.compose(dropRepeats()),
        action$
        .filter( action => action.type === Todo.added )
    )
        .map(([ user, state, action ]) => {

            return database.ref("todos/" + user.uid)
                .set(todoSelector(state).toJS());

        })
        .map(xs.fromPromise)
        .map(() => {

            return {
                type: Firebase.actions.saved
            };

        });


    const load$ = user$
        .map( user => database.ref("todos/" + user.uid).once("value") )
        .map( xs.fromPromise )
        .flatten()
        .map( snap => {
            const data = snap.val();
            if ( data ) {

                const actions = Object.keys(data)
                    .map( id => ({
                        type: Todo.add,
                        data: Todo.of(data[id])
                    }) );

                return xs.fromArray(actions);

            } else {

                return xs.empty();

            }



        } )
        .flatten();

    return xs.merge(
        userLogged$,
        save$,
        load$
    );
});
