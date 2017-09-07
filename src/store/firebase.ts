import { createMiddleware, Run, Action$ } from "xstream-redux-observable";
import xs, { Stream, Producer } from "xstream";
import flattenConcurrently from "xstream/extra/flattenConcurrently";
import dropRepeats from "xstream/extra/dropRepeats";
import { Todo } from "./todo";
import { Action, MiddlewareAPI, Middleware } from "redux";
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

const run = <S>( action$: Action$, api: MiddlewareAPI<S> ) => {



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

    const todoSelector = (state: any) => state.todo;

    const save$ = user$.take(1)
        .map(user => action$
            .filter( action => action.type === Todo.added )
            .map(( action: Todo.Added ) => {

                const todo = action.data;
                return database.ref("todos/" + user.uid + "/" + todo.get("_id") )
                    .set(todo.toJS());

            })
            .map(xs.fromPromise)
            .map(() => {

                return {
                    type: Firebase.actions.saved
                };

            }))
        .flatten();



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
    ) as Action$;
}
export const middleware = createMiddleware(run as Run);
