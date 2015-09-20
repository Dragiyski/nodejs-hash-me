# Feature source

Feature code test for various features. The source folder provides those test in easy to use NodeJS module format. Each 
file exports a function that returns true if feature works as expected or false if not. Some features like reflection 
will be folders with multiple file for testing each individual method.

# Feature expectation

Feature should work as expected by native. Sometimes there are shims or polyfills that cover the feature. If all 
aspects of the feature works as expected, library will accept that feature is supported. If however the feature is 
provided by sham, not all aspects will work. Feature detector will deny shams and any type of polyfill that requires 
different code from native one. Some language features like symbols and generators has some aspects that cannot be 
emulated, like:

```javascript
typeof mySymbol === 'symbol'
```

There is no way to override how ``typeof`` operator works, therefore that check will always fail for a library trying 
to emulate symbols.

# Files

Those files are provded only for development. They help to keep the system testable and maintainable. The function 
bodies will be extracted to separate source files (partial files). Partials can be used to aggregate the code required 
to build this library.

# Library structure

The library code will be dynamic and include tests. Library code would run synchronously after included - executed by 
browsers or required by NodeJS. Synchronous library code will:

1. Detect the environment: is there ``module.exports``, ``global``, ``window``, etc.
2. Build the test functions using ``Function`` constructor.
3. Run the code builder with already available test functions.
4. Code builder will generate code for the main classes and assign them to either ``module.exports`` or ``window``. 
This would be compatible with both AMD interface (no matter where it has been used NodeJS or browser), CommonJS and 
will always fallback to globals. (In ES6 there is export keyword, which if it is working, will be used).

The final code will be mix of container code, generator code implementation code. The container code ensures classes 
are exported to the detected environment. The detection of environment has several stages, but general idea is:

1. If ``module`` and ``exports`` are available and ``module.exports === exports``, use ``module.exports`` for namespace 
storage.
2. If ``define`` is function, use AMD interface as defined by RequireJS.
3. If none of the above is available get the global using ``new Function`` trick: ``new Function`` unlike ``eval`` 
creates a function from string into global (ignoring closures) and therefore ignoring current scope strict mode. While 
in non-strict mode calling a function as a function (not as a method) sets ``this`` to be the global object.

The generator code and implementation code should be independent of current environment. However the generator should 
depend on closure vairable ``feature`` that will provide information about available platform and language features.

The implementation code should be implementation centric and does not depend on generator and environment. After 
library initialization, generator code will be destroyed (e.g. ``feature`` variable will be deleted). The assignments 
to the namespace made by generator will be results of ``new Function`` compiled generated code that would be the only 
thing available after library initialization.
