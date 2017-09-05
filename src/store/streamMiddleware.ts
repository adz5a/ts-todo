import xs, { Stream } from "xstream";
import delay from "xstream/extra/delay";
import { Action, Middleware } from "redux";



export interface RunFunction {
    <S> ( action$: Stream<Action>, state$: Stream<S> ): Stream<Action>
}


export type middlewareName = null | string;


const noop = () => {};

/*
 * This helper is supposed like this :
 * A run function returns a Stream<Action>. This stream is subscribed to and
 * each value received is dispatched to *all* the other middleware using the
 * middleware api.
 *
 *
 */
export function createStreamMiddleware  ( run: RunFunction, name: null | string = null ): Middleware {


    // TODO : add multiple signature interface for RunFunction


    return function middleware ( api ) {

        // "source" stream. Models the flow of actions
        // in the application
        // this stream will be used as a subject with
        // the *shamefullySendNext* operator
        const rawActions$ = xs.create() as Stream<Action>;
        // "sink" stream, returned by the run function,
        // a subscription will be added on this stream, and
        // it will be time shifted to allow for correct initialization
        let action$: Stream<Action>;
        if ( run.length > 1 ) {

            const state$ = rawActions$
                .map(api.getState)
                .remember();


            action$ = run(rawActions$, state$);

        } else {

            action$ = run(rawActions$, xs.never());

        }

        action$
            .compose(delay(1))
            .addListener({
                // dispatch the returned action
                next: api.dispatch,
                error ( error ) {

                    console.error("terminal error in middleware", error);

                },
                complete () {

                    if ( name ) {

                        console.info("this middleware just terminated : " + name);

                    }

                }
            });

        return next => action => {
            // processes the next dispatch function
            const returnValue = next(action);


            // this is the actual side effect
            // it is implemented with recompose 
            // createEventHandler but other implementation
            // with Subjects ( Rx ) or Stream.imitate 
            // ( xstream ) are valid too and probably more
            // "correct"
            rawActions$.shamefullySendNext(action);
            return returnValue;
        };
    };

}
