# hash-me

Hash-me is a  node.js module for hash-based collections.

Currently hash uses a small native node.js module using official v8 API for getting a hash for objects. Hash function of non-object values (e.g. primitives) is the value itself converted to string. The hash is combination of ``typeof()`` result and the value and it is not guaranteed to be unique. It'll only guarantee that if you call hash multiple time for the same object, it will return the same value. However hash clashes are very rarely to inspect.

Most of the time the ``Map`` and the ``Set`` described here ressembles the specification of [Harmony simple map and set](http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets). However current map and set are written in mind to both keep the speed and space the same order of magnitude and provide functionality to be useful. Harmony map and set require support for iterator (and more specifically - yield keyword). This map and set work correctly (in general case tested) in ES5.

## Usage
Simple usage: ``Map`` and ``Set`` work like their harmony twins, ...
```javascript
> var hashme = require('hash-me');
> var m = hash.Map();
> var s = hash.Set();
> m.add(process, 10);
> m.get(process);
10
> m.get(process.toString());
> m.has(process)
true
> m.delete(process)
true
> m.has(process)
false
> s.add(process)
> s.has(process)
true
> s.delete(process)
true
s.has(process)
false
```
... but now they can be iterated. The iteration works in O(n) time and the interface is similar to ``Array.prototype`` methods.
```javascript
> var length = 0;
> m.set([2, 5], 10);
> m.forEach(function(val, key) {length += key.length + val});
> length
12
> m.some(function(va))
```

For sets __union__, __intersection__ and __difference__ can be calculated, but it works in O(n) time so it can be slow for large sets. Multiple maps can be merged, but this feature is still experimental.
