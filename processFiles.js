"use strict";

/*
 * Example athttps://github.com/facebook/jest/blob/master/examples/typescript 
 *
 */
const tsc = require("typescript");
const tsConfig = require("./tsconfig.json");


const { compilerOptions } = require("./tsconfig.json");
const newCompilerOptions = Object.assign(compilerOptions, {
    module: "commonjs"
});


module.exports = {
    process ( src, path ) {
        if ( path.endsWith(".ts") || path.endsWith(".ts") ) {

            return tsc.transpile(
                src,
                newCompilerOptions,
                path, 
                []
            );

        } else return src;
    }
};
