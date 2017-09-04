import { createEventHandler } from "components/recompose";
import xs from "xstream";
import delay from "xstream/extra/delay";


export function createStreamMiddleware ( creator, name = null ) {

    return function middleware ( store ) {

        const { stream, handler: onNext } = createEventHandler();


        const rawActions$ = xs.fromObservable(stream);
        let action$;
        if ( creator.length > 1 ) {

            const state$ = rawActions$
                .map( () => store.getState() )
                .remember();
            // need to startup the stream
            state$.subscribe({
                next: () => {}, // noop
                error ( error ) {

                    console.error("terminal error in middleware (state)", error);

                },
                complete () {

                    if ( name ) {

                        console.info("this middleware just terminated (state): " + name);

                    }

                }
            });
            action$ = creator(rawActions$, state$);

        } else {

            action$ = creator(xs.fromObservable(stream));

        }


        action$
            .compose(delay(1))
            .addListener({
                next: store.dispatch,
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

            const returnValue = next(action);


            // this is the actual side effect
            // it is implemented with recompose 
            // createEventHandler but other implementation
            // with Subjects ( Rx ) or Stream.imitate 
            // ( xstream ) are valid too and probably more
            // "correct"
            onNext(action);
            return returnValue;

        };

    };

}

/*
 * Example :
 * see db middleware
 *
 */
