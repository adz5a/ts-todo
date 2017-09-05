import { createStreamMiddleware, RunFunction } from "./streamMiddleware";
import xs, { Stream, Producer } from "xstream";
import flattenConcurrently from "xstream/extra/flattenConcurrently";
import { Todo } from "./todo";
import { Action } from "redux";
import { initializeApp, User } from "firebase";


export namespace Firebase {
    export namespace actions {

    }
}

interface UserProducer extends Producer<User | null>{
    unsub: () => void;
}

export const middleware = createStreamMiddleware(action$ => {



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

    
    const user$ = <Stream<User | null>>xs.create(<UserProducer>{
        start ( listener ) {
            this.unsub = auth.onAuthStateChanged(
                user => listener.next(user),
                error => listener.error(error)
            );
        },
        stop() {
            this.unsub();
        },
    });


    const userLogged$ = user$
        .take(1)
        .map( user => {
            const deferredUser = user === null ?
                auth.signInAnonymously():
                Promise.resolve(user)

            return xs.fromPromise(deferredUser);
        } )
        .compose(flattenConcurrently)

    return action$;
});
