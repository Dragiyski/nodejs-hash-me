# hash-me

Hash-me is a  node.js module for hash-based collections.

## <a name="collection-types">Types of collections</a>

The library separate collections into two types - [storage](#type.storage) and [mapping](#type.mapping).

| Storage                     | Mapping                         |
|-----------------------------|---------------------------------|
| [Set](#class:Set)           | [Map](#class:Map)               |
| [Relation](#class:Relation) | [Connection](#class:Connection) |
| [Graph](#class:Graph)       | [Network](#class:Network)       |

The first row present the basic collection __Map__ and __Set__. This collections are the basics and only one which use 
the hash function directly. The rest, more complex, collections are built using __Map__ and __Set__.

The second row present collections using pair values for index. This collections are used to define some correlation 
between values. The __Relation__ present pure correlation, while the __Connection__ present additional value describing 
the correlation.

The third row present collections using its corresponding first and second rows collection. The __Graph__ is a __Set__ 
of values called _nodes_ with some __Relation__ between the nodes, called _edges_. The __Graph__ just stores both 
values and their correlation, while the __Network__ maps additional value to each value and correlation, describing it.

__Warning:__ While the __Set__, __Map__, __Relation__ posses linear ordering. While element order cannot be controlled 
by the interface, elements inside can be ordered along a line. In fact the __forEach__ method will call the callback 
sequentially by the internal order of elements. The __Graph__ is mathematical object of second order, its elements 
cannot be ordered along a line. However it consist of linearly ordered edges and linearly ordered nodes. If taking both 
edges and nodes, we can "order" them along two dimensional grid with some elements of the grid are empty. Because of 
that _two_ dimensional ordering, the __Graph__ is called _second_ order collection. It means it cannot be iterated 
linearly.

## <a name="reference">Reference</a>

__Note:__ Reference consist interface definition code with following syntax:

    function(arg1:type, arg2:type1|type2):returnType throws exceptionType
    
Where the __arg1__ and __arg2__ are the name of arguments and __type__ is the type expected of list of type joined with 
a pipe symbol (|) to show alternatives. After the brackets of the argument list, the function definition is followed by 
a colon symbol (:) and the __returnType__ is one or more types expected function to return. Optionally this may be 
followed by ___throws___ and __exceptionType__ that gives one or more possible exceptions. Detail description of each 
of the arguments, return type and expected exception is given below the function signature. A special type __\*__ is 
used to represents no type restriction. An ellipsis (...) after the name of arguments tells that more argument of the 
same type can be specified, e.g. it is variable arguments function. Ellipsis should be used on last argument only.

The library consist entirely of collection classes.

* [Set](#class:Set)
* [Map](#class:Map)
* [Relation](#class:Relation)
* [Connection](#class:Connection)
* [Graph](#class:Graph)
* [Network](#class:Network)

### <a name="class:Set">Set</a>

The class store values without repetition. Adding, removing and finding a value from the set is O(1) time, but from the 
programming point of view it may be a little slower due to imperfect hash function. However hash clashes occurs rarely.

* [add](#method:Set.add)
* [delete](#method:Set.delete)
* [equals](#method:Set.equals)
* [every](#method:Set.every)
* [filter](#method:Set.filter)
* [find](#method:Set.find)
* [forEach](#method:Set.forEach)
* [has](#method:Set.has)
* [intersection](#method:Set.intersection)
* [isEmpty](#method:Set.isEmpty)
* [length](#method:Set.length)
* [reduce](#method:Set.reduce)
* [some](#method:Set.some)
* [subsetOf](#method:Set.subsetOf)
* [subtract](#method:Set.subtract)
* [union](#method:Set.union)
* [values](#method:Set.values)

#### <a name="method:Set.add">Set.add</a>

Add any value to the set if the set has no value strictly equals to the given one.

```
function add(value:*):boolean
```

##### Arguments

1. value - Any value to insert into the set.

##### Return

Returns whether the set has been changed by the operation.

#### <a name="method:Set.delete">Set.delete</a>

Remove a value from the set if the set does contain a value strictly equals to the given one.

```
function delete(value:*):boolean
```

##### Arguments

1. value - Any value to be removed from the set.

##### Return

Returns whether the set has been changed by the operation.

#### <a name="method:Set.equals">Set.equals</a>

Compares two instances of __Set__ class for equality. Two such instances are equal only if they have the same values. 
Unfortunately this currently works in linear time.

```
function equals(other:Set):boolean throws TypeError
```

##### Arguments

1. other - A __Set__ object to compare to.

##### Return

Returns __true__ if the both object are instances of __Set__ and contain the same values, or __false__ otherwise.

##### Exception

* __TypeError__: If the __other__ arguments is not instance of __Set__ class.

#### <a name="method:Set.every">Set.every</a>

Test if all values in the set satisfies a callback function. This function has iteration optimization - it may process 
only part of the elements and returns early if the return result is known.

```
function every(callback:Function, this:*):boolean throws TypeError
```

```
function callback(value:*, set:Set):boolean
```

##### Arguments

1. callback - A function to be called for each of the elements of the set.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback returned __true__ for all elements of the __Set__, then __true__ is returned. Otherwise __false__ is 
returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Set.filter">Set.filter</a>

Creates a new __Set__ object, filling it with all elements from this __Set__ which satisfies a callback function.

```
function filter(callback:Function, this:*):Set throws TypeError
```

```
function callback(value:*, set:Set):boolean
```

##### Arguments

1. callback - A function to be called for each of the elements of the set.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns a __Set__ that satisfies __Set.subsetOf__ this set.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Set.find">Set.find</a>

Search through the values of the set and returns the first value that satisfies a callback function.

```
function find(callback:Function, this:*):* throws TypeError
```

```
function callback(value:*, set:Set):boolean
```

##### Arguments

1. callback - A function to be called for each of the elements of the set.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns the first value that satisfies the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Set.forEach">Set.forEach</a>

Unconditionally call a callback function for every element in the set.

```
function forEach(callback:Function, this:*):* throws TypeError
```

```
function callback(value:*, set:Set):boolean
```

##### Arguments

1. callback - A function to be called for each of the elements of the set.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

The current __Set__ object.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Set.has">Set.has</a>

Check if a value is stored in the set.

```
function has(value:*):boolean
```

##### Arguments

1. value - Any javascript value to be checked.

##### Return

Returns __true__ if specified value is in the set, __false__ otherwise.

#### <a name="method:Set.intersection">Set.intersection</a>

Create a new set containing all values that are contained in both __this__ and __other__ set.

```
function intersection(other:Set):Set throws TypeError
```

##### Arguments

1. other - An instance of __Set__ class.

##### Return

Returns newly created __Set__ object, containing elements that are contained in both current set and __other__ set.

##### Exception

* __TypeError__: If the __other__ is not a set.

#### <a name="method:Set.isEmpty">Set.isEmpty</a>

Checks whether the set is empty, e.g. contains no values. Unlike length, this works in O(1), not in O(n) time.

```
function isEmpty():boolean
```

##### Return

Returns __true__ is the set contains no values.

#### <a name="method:Set.length">Set.length</a>

Counts the number of elements in the set. This works on O(n) time so it is expensive operation, however this is 
preferred than having additional number value for each set, since length operation is expected to be used rarely.

```
get length():number
```

##### Getter

Returns the number of elements in the set.

#### <a name="method:Set.reduce">Set.reduce</a>

Reduces the set to single value based on callback function.

```
function reduce(callback:Function, initialValue:*, this:*):*
```

```
function callback(previousValue:*, currentValue:*, set:Set):*
```

##### Arguments

1. callback - A function to be called for each value in the set. On the first call for __previousValue__ is given the 
value of __initialValue__ and for any subsequent calls - the value returned by the __callback__ from previous call.
2. initialValue - The value to start the reduction.
3. this - A value to be bound to __this__ keyword in the callback.

##### Return

The reduce method returns the value returned from the last call of the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Set.some">Set.some</a>

Test if there is element in the set that satisfies a callback function. This function has iteration optimization - it 
may process only part of the elements and returns early if the return result is known.

```
function some(callback:Function, this:*):boolean throws TypeError
```

```
function callback(value:*, set:Set):boolean
```

##### Arguments

1. callback - A function to be called for each of the elements of the set.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback returned __true__ for at least one element of the __Set__, then __true__ is returned. Otherwise 
__false__ is returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Set.subsetOf">Set.subsetOf</a>

Checks if current set is subset of __other__ set, e.g. if all elements of the current set are contained in the 
__other__ set.

```
function subsetOf(other:Set):boolean throws TypeError
```

##### Arguments

1. other - An instance of __Set__ class.

##### Return

If element in current set that is missing from __other__ set is found - __false__ is returned, otherwise __true__ is 
returned.

##### Exception

* __TypeError__: If the __other__ is not a set.

#### <a name="method:Set.subtract">Set.subtract</a>

Creates a new set with all elements of current set, that are missing from an __other__ set.

```
function subtract(other:Set):Set throws TypeError
```

##### Arguments

1. other - An instance of __Set__ class.

##### Return

Returns a __Set__ object with all elements from current set, not contained in the __other__ set.

##### Exception

* __TypeError__: If the __other__ is not a set.

#### <a name="method:Set.union">Set.union</a>

Creates a new set with elements of __this__ and __other__ sets combined.

```
function union(other:Set):Set throws TypeError
```

##### Arguments

1. other - An instance of __Set__ class.

##### Return

Returns a __Set__ object combined values.

##### Exception

* __TypeError__: If the __other__ is not a set.

#### <a name="method:Set.values">Set.values</a>

Creates an array containing all elements of the set. The order of elements in the array is implementation specific.

```
function values():Array
```

##### Return

A javascript __Array__ object containing all values in the set, once for each value.

### <a name="class:Map">Map</a>

The __Map__ class stores mappings of keys to values similarly to javascript __Object__ class. However the keys can be 
any type of javascript value - __undefined__, __null__, __boolean__, __string__, __number__, __object__, __function__ 
and so on. Just like javascript object or dictionaries, it does not allow keys to be repeated. The map compares the 
keys by strict equality.

* [delete](#method:Map.delete)
* [every](#method:Map.every)
* [filter](#method:Map.filter)
* [find](#method:Map.find)
* [findKey](#method:Map.findKey)
* [forEach](#method:Map.forEach)
* [get](#method:Map.get)
* [has](#method:Map.has)
* [isEmpty](#method:Map.isEmpty)
* [keys](#method:Map.keys)
* [length](#method:Map.length)
* [merge](#method:Map.merge)
* [reduce](#method:Map.reduce)
* [set](#method:Map.set)
* [some](#method:Map.some)
* [values](#method:Map.values)

#### <a name="method:Map.delete">Map.delete</a>

Removes a mapping from the __Map__ based on the "key" value. If there is no such key, no operation is done.

```
function delete(key:*):boolean
```

##### Arguments

1. key - The key to find the mapping to be removed.

##### Return

Returns whether the map has been changed by the operation.

#### <a name="method:Map.every">Map.every</a>

Test if all mappings in the map satisfies a callback function. This function has iteration optimization - it may process 
only part of the mappings and returns early if the return result is known.

```
function every(callback:Function, this:*):boolean throws TypeError
```

```
function callback(value:*, key:*, map:Map):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the map.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback returned __true__ for all mappings of the __Map__, then __true__ is returned. Otherwise __false__ is 
returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Map.filter">Map.filter</a>

Creates a new __Map__ object, filling it with all mappings from this __Map__ which satisfy a callback function.

```
function filter(callback:Function, this:*):Map throws TypeError
```

```
function callback(value:*, key:*, map:Map):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the map.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns a new __Map__ that have some of the mappings from the original map.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Map.find">Map.find</a>

Search through the mappings of the map and returns the first value of the mapping that satisfies a callback function.

```
function find(callback:Function, this:*):* throws TypeError
```

```
function callback(value:*, key:*, map:Map):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the map.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns the value of first mapping that satisfies the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Map.findKey">Map.findKey</a>

Search through the mappings of the map and returns the first key of the mapping that satisfies a callback function.

```
function find(callback:Function, this:*):* throws TypeError
```

```
function callback(value:*, key:*, map:Map):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the map.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns the key of the first mapping that satisfies the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Map.forEach">Map.forEach</a>

Unconditionally call a callback function for every mapping in the map.

```
function forEach(callback:Function, this:*):* throws TypeError
```

```
function callback(value:*, key:*, map:Map):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the map.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

The current __Map__ object.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Map.get">Map.get</a>

Get a mapped value for the given key.

```
function get(key:*):*
```

##### Arguments

1. key - The key to find a mapping.

##### Return

Returns the mapped value at this key or __undefined__ if key is not in the map.

#### <a name="method:Map.has">Map.has</a>

Check if the _Map_ have a mapping for the given key.

```
function has(key:*):boolean
```

##### Arguments

1. key - The key to find a mapping.

##### Return

Returns __true__ if mapping is found, __false__ otherwise.

#### <a name="method:Map.isEmpty">Map.isEmpty</a>

Checks whether the map have no mappings. Unlike _length_, this works in O(1), not in O(n) time.

```
function isEmpty():boolean
```

##### Return

Returns __true__ is the map contains no mappings.

#### <a name="method:Map.keys">Map.keys</a>

Creates an array containing all keys in the map. The order of elements returned is implementation specific.

```
function keys():Array
```

##### Return

A javascript __Array__ object containing all keys from all mappings of the map.

#### <a name="method:Map.length">Map.length</a>

Counts the number of mappings in the map. This works on O(n) time so it is expensive operation, however this is 
preferred than having additional number value for each map, since length operation is expected to be used rarely.

```
get length():number
```

##### Getter

Returns the number of mappings in the map.

#### <a name="method:Map.merge">Map.merge</a>

Merges the current map with one or more other maps. The merging creates a copy of the current map and iterates the 
specified maps one by one. If a key for mapping from the iterated map does not exists in merged map, then it is added, 
otherwise the value for that key is overridden. The value from the first argument override the values in the current 
map, the value from the second argument override both the values from the current map and the first argument and so on.

```
function merge(maps...:Map):Map throws TypeError
```

##### Arguments

1. maps... - One or more maps to be merged with current map.

##### Return

Returns new __Map__ containing merged values from all maps.

##### Exception

* __TypeError__: If no arguments specified or if any of the arguments specified is not an instance of __Map__.

#### <a name="method:Map.reduce">Map.reduce</a>

Reduces the map to single value based on callback function.

```
function reduce(callback:Function, initialValue:*, this:*):*
```

```
function callback(previousValue:*, currentValue:*, currentKey:*, map:Map):*
```

##### Arguments

1. callback - A function to be called for each mapping in the map. On the first call for __previousValue__ is given the 
value of __initialValue__ and for any subsequent calls - the value returned by the __callback__ from previous call.
2. initialValue - The value to start the reduction.
3. this - A value to be bound to __this__ keyword in the callback.

##### Return

The reduce method returns the value returned from the last call of the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Map.set">Map.set</a>

Sets a value for specific key. If the map does not contain such key, it is added and it is mapped to value specified, 
otherwise the found key's mapped value is replaced by the current value.

```
function set(key:*, value:*):boolean
```

##### Arguments

1. key - The key to find a mapping.
2. value - The value to become the mapped value for the __key__.

##### Return

Returns whether the length of the map has been changed by the operation.

#### <a name="method:Map.some">Map.some</a>

Test if there is mapping in the map that satisfies a callback function. This function has iteration optimization - it 
may process only part of the mappings and returns early if the return result is known.

```
function some(callback:Function, this:*):boolean throws TypeError
```

```
function callback(value:*, key:*, map:Map):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the map.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback returned __true__ for at least one mapping of the __Map__, then __true__ is returned. Otherwise 
__false__ is returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Map.values">Map.values</a>

Creates an array containing all values in the map. The order of elements returned is implementation specific. The 
returned array has the same order as __keys__ method. A values in the returned array may be repeated.

```
function values():Array
```

##### Return

A javascript __Array__ object containing all values from all mappings of the map.

### <a name="class:Relation">Relation</a>

The relation store a pair a values without repetition. It can be viewed not as a pair of values, but as connection 
between values. Effectively this is a __Set__ consisting of connection between values or subset of cartesian product of 
the set of all javascript values. Adding, removing and finding a connection in the relation is O(1) time.

* [add](#method:Relation.add)
* [delete](#method:Relation.delete)
* [equals](#method:Relation.equals)
* [every](#method:Relation.every)
* [filter](#method:Relation.filter)
* [find](#method:Relation.find)
* [forEach](#method:Relation.forEach)
* [has](#method:Relation.has)
* [intersection](#method:Relation.intersection)
* [isEmpty](#method:Relation.isEmpty)
* [leftOf](#method:Relation.leftOf)
* [length](#method:Relation.length)
* [reduce](#method:Relation.reduce)
* [rightOf](#method:Relation.rightOf)
* [some](#method:Relation.some)
* [subsetOf](#method:Relation.subsetOf)
* [subtract](#method:Relation.subtract)
* [union](#method:Relation.union)
* [values](#method:Relation.values)

#### <a name="method:Relation.add">Relation.add</a>

Add a pair of values to the relation if such pair doesn't exists in the relation, yet.

```
function add(leftValue:*, rightValue:*):boolean
```

##### Arguments

1. leftValue - A value from the left/start set.
2. rightValue - A value from the right/end set.

##### Return

Returns whether the relation has been changed by the operation.

#### <a name="method:Relation.delete">Relation.delete</a>

Remove a pair of values from the relation.

```
function delete(leftValue:*, rightValue:*):boolean
```

##### Arguments

1. leftValue - A value from the left/start set.
2. rightValue - A value from the right/end set.

##### Return

Returns whether the relation has been changed by the operation.

#### <a name="method:Relation.equals">Relation.equals</a>

Check if the relation contains the same pairs of values as other relation.

```
function equals(other:Relation):boolean throws TypeError
```

##### Arguments

1. other - A __Relation__ object to compare to.

##### Return

Returns __true__ if the both object are instances of __Relation__ and contain the same pairs of values, or __false__ otherwise.

##### Exception

* __TypeError__: If the __other__ arguments is not instance of __Relation__ class.

#### <a name="method:Relation.every">Relation.every</a>

Test if all pairs of values in the relation satisfies a callback function. This function has iteration optimization - 
it may process only part of the pairs and returns early if the return result is known.

```
function every(callback:Function, this:*):boolean throws TypeError
```

```
function callback(leftValue:*, rightValue:*, relation:Relation):boolean
```

##### Arguments

1. callback - A function to be called for each of the pairs of the relation.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback returned __true__ for all pairs of the __Relation__, then __true__ is returned. Otherwise __false__ is 
returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Relation.filter">Relation.filter</a>

Creates a new __Relation__ object, filling it with all pairs from this __Relation__ which satisfies a callback function.

```
function filter(callback:Function, this:*):Relation throws TypeError
```

```
function callback(leftValue:*, rightValue:*, relation:Relation):boolean
```

##### Arguments

1. callback - A function to be called for each of the elements of the relation.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns a __Relation__ that satisfies __Relation.subsetOf__ this relation.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Relation.find">Relation.find</a>

Search through the pairs of the relation and returns the first pair that satisfies a callback function.

```
function find(callback:Function, this:*):* throws TypeError
```

```
function callback(leftValue:*, rightValue:*, relation:Relation):boolean
```

##### Arguments

1. callback - A function to be called for each of the elements of the relation.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback function is satisfied, an __Array__ is returned with two indexes: 0 - for the __leftValue__ and 1 - for 
the __rightValue__. If no element satisfies the callback - __undefined__ is returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Relation.forEach">Relation.forEach</a>

Unconditionally call a callback function for every pair in the relation.

```
function forEach(callback:Function, this:*):* throws TypeError
```

```
function callback(leftValue:*, rightValue:*, relation:Relation):boolean
```

##### Arguments

1. callback - A function to be called for each of the elements of the relation.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

The current __Relation__ object.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Relation.has">Relation.has</a>

Check if a pair is stored in the relation.

```
function has(value:*):boolean
```

##### Arguments

1. value - Any javascript value to be checked.

##### Return

Returns __true__ if specified value is in the relation, __false__ otherwise.

#### <a name="method:Relation.intersection">Relation.intersection</a>

Create a new relation containing all pairs that are contained in both __this__ and __other__ relation.

```
function intersection(other:Relation):Relation throws TypeError
```

##### Arguments

1. other - An instance of __Relation__ class.

##### Return

Returns newly created __Relation__ object, containing all pairs that are contained in both current relation and 
__other__ relation.

##### Exception

* __TypeError__: If the __other__ is not a relation.

#### <a name="method:Relation.isEmpty">Relation.isEmpty</a>

Checks if the relation contains no pairs. Unlike length, this works in O(1), not in O(n) time.

```
function isEmpty():boolean
```

##### Return

Returns __true__ is the relation contains no pairs.

#### <a name="method:Relation.leftOf">Relation.leftOf</a>

Extracts a __Set__ containing the left values of all pairs whose right value matches the specified one.

```
function leftOf(rightValue:*):Set
```

##### Arguments

1. rightValue - The value to search in the right set.

##### Return

A __Set__ containing all values from the left set to which there is a pair whose right value matches __rightValue__ 
argument. If no such pairs are found, then __Set.isEmpty__ for the returned result is __true__.

#### <a name="method:Relation.length">Relation.length</a>

Counts the number of pairs in the relation. This works on O(n) time so it is expensive operation, however this is 
preferred than having additional number value for each relation, since length operation is expected to be used rarely.

```
get length():number
```

##### Getter

Returns the number of elements in the relation.

#### <a name="method:Relation.reduce">Relation.reduce</a>

Reduces the relation to single value based on callback function.

```
function reduce(callback:Function, initialValue:*, this:*):*
```

```
function callback(previousValue:*, leftValue:*, rightValue:*, relation:Relation):*
```

##### Arguments

1. callback - A function to be called for each pair in the relation. On the first call for __previousValue__ is given 
the value of __initialValue__ and for any subsequent calls - the value returned by the __callback__ from previous call.
2. initialValue - The value to start the reduction.
3. this - A value to be bound to __this__ keyword in the callback.

##### Return

The reduce method returns the value returned from the last call of the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Relation.rightOf">Relation.rightOf</a>

Extracts a __Set__ containing the right values of all pairs whose left value matches the specified one.

```
function rightOf(leftValue:*):Set
```

##### Arguments

1. leftValue - The value to search in the left set.

##### Return

A __Set__ containing all values from the right set to which there is a pair whose left value matches __leftValue__ 
argument. If no such pairs are found, then __Set.isEmpty__ for the returned result is __true__.

#### <a name="method:Relation.some">Relation.some</a>

Test if there is pair in the relation that satisfies a callback function. This function has iteration optimization - it 
may process only part of the pairs and returns early if the return result is known.

```
function some(callback:Function, this:*):boolean throws TypeError
```

```
function callback(leftValue:*, rightValue:*, relation:Relation):boolean
```

##### Arguments

1. callback - A function to be called for each of the pairs of the relation.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback returned __true__ for at least one pair of the __Relation__, then __true__ is returned. Otherwise 
__false__ is returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Relation.subsetOf">Relation.subsetOf</a>

Checks if current relation is subset of __other__ relation, e.g. if all pairs of the current relation are contained in 
the __other__ relation.

```
function subsetOf(other:Relation):boolean throws TypeError
```

##### Arguments

1. other - An instance of __Relation__ class.

##### Return

If element in current relation, that is missing from __other__ relation, is found - __false__ is returned, otherwise 
__true__ is returned.

##### Exception

* __TypeError__: If the __other__ is not a relation.

#### <a name="method:Relation.subtract">Relation.subtract</a>

Creates a new __Relation__ with all pairs of current relation, that are missing from an __other__ relation.

```
function subtract(other:Relation):Relation throws TypeError
```

##### Arguments

1. other - An instance of __Relation__ class.

##### Return

Returns a __Relation__ object with all pairs from current relation, not contained in the __other__ relation.

##### Exception

* __TypeError__: If the __other__ is not a relation.

#### <a name="method:Relation.union">Relation.union</a>

Creates a new relation with pairs of __this__ and __other__ relations combined.

```
function union(other:Relation):Relation throws TypeError
```

##### Arguments

1. other - An instance of __Relation__ class.

##### Return

Returns a __Relation__ object combined values.

##### Exception

* __TypeError__: If the __other__ is not a relation.

#### <a name="method:Relation.values">Relation.values</a>

Creates an array containing all pairs of the relation. The order of pairs in the array is implementation specific.

```
function values():Array
```

##### Return

A javascript __Array__ object containing all pairs in the relation. Each pairs is also a javascript __Array__ with 
index 0 being the __leftValue__ and index 1 - the __rightValue__.

### <a name="class:Connection">Connection</a>

The __Connection__ class similarly to __Relation__ class, stores connection between any javascript values, but like the 
__Map__ class it allows mapping a javascript value to each connection.

* [delete](#method:Connection.delete)
* [every](#method:Connection.every)
* [filter](#method:Connection.filter)
* [find](#method:Connection.find)
* [findKey](#method:Connection.findKey)
* [forEach](#method:Connection.forEach)
* [get](#method:Connection.get)
* [has](#method:Connection.has)
* [isEmpty](#method:Connection.isEmpty)
* [keys](#method:Connection.keys)
* [length](#method:Connection.length)
* [merge](#method:Connection.merge)
* [reduce](#method:Connection.reduce)
* [set](#method:Connection.set)
* [some](#method:Connection.some)
* [values](#method:Connection.values)

#### <a name="method:Connection.delete">Connection.delete</a>

Removes a mapping from the __Connection__ based on the pair of keys. If there is no such pair, no operation is done.

```
function delete(leftKey:*, rightKey:*):boolean
```

##### Arguments

1. leftKey - The first value of the pair of keys.
2. rightKey - The second value of the pair of keys.

##### Return

Returns whether the connection has been changed by the operation.

#### <a name="method:Connection.every">Connection.every</a>

Test if all mappings in the connection satisfies a callback function. This function has iteration optimization - it may 
process only part of the mappings and returns early if the return result is known.

```
function every(callback:Function, this:*):boolean throws TypeError
```

```
function callback(value:*, leftKey:*, rightKey:*, connection:Connection):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the connection.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback returned __true__ for all mapping of the __Connection__, then __true__ is returned. Otherwise __false__ 
is returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Connection.filter">Connection.filter</a>

Creates a new __Connection__ object, filling it with all mappings from this __Connection__ which satisfy a callback 
function.

```
function filter(callback:Function, this:*):Connection throws TypeError
```

```
function callback(value:*, leftKey:*, rightKey:*, connection:Connection):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the connection.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns a new __Connection__ that have some of the mappings from the original connection.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Connection.find">Connection.find</a>

Search through the mappings of the connection and returns the first value of the mapping that satisfies a callback 
function.

```
function find(callback:Function, this:*):* throws TypeError
```

```
function callback(value:*, leftKey:*, rightKey:*, connection:Connection):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the connection.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns the value of first mapping that satisfies the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Connection.findKey">Connection.findKey</a>

Search through the mappings of the connection and returns the first pair of keys of the first mapping that satisfies a 
callback function.

```
function findKey(callback:Function, this:*):* throws TypeError
```

```
function callback(value:*, leftKey:*, rightKey:*, connection:Connection):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the connection.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

Returns the pair of keys of the first mapping that satisfies the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Connection.forEach">Connection.forEach</a>

Unconditionally call a callback function for every mapping in the connection.

```
function forEach(callback:Function, this:*):* throws TypeError
```

```
function callback(value:*, leftKey:*, rightKey:*, connection:Connection):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the connection.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

The current __Connection__ object.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Connection.get">Connection.get</a>

Get a mapped value for the given pair of keys.

```
function get(leftKey:*, rightKey:*):*
```

##### Arguments

1. leftKey - The first value of the pair of keys.
2. rightKey - The second value of the pair of keys.

##### Return

Returns the mapped value at this pair of keys or __undefined__ if key is not in the connection.

#### <a name="method:Connection.has">Connection.has</a>

Check if the _Connection_ have a mapping for the given pair of keys.

```
function has(leftKey:*, rightKey:*):boolean
```

##### Arguments

1. leftKey - The first value of the pair of keys.
2. rightKey - The second value of the pair of keys.

##### Return

Returns __true__ if mapping is found, __false__ otherwise.

#### <a name="method:Connection.isEmpty">Connection.isEmpty</a>

Checks whether the connection have no mappings. Unlike _length_, this works in O(1), not in O(n) time.

```
function isEmpty():boolean
```

##### Return

Returns __true__ is the connection contains no mappings.

#### <a name="method:Connection.keys">Connection.keys</a>

Creates an array containing all pair of keys in the connection. The order of elements returned is implementation 
specific.

```
function keys():Array
```

##### Return

A javascript __Array__ object containing all pair of keys from all mappings of the connection. The pair of keys is also 
a javascript __Array__ containing __leftKey__ at index 0 and __rightKey__ at index 1.

#### <a name="method:Connection.length">Connection.length</a>

Counts the number of mappings in the connection. This works on O(n) time so it is expensive operation, however this is 
preferred than having additional number value for each connection, since length operation is expected to be used rarely.

```
get length():number
```

##### Getter

Returns the number of mappings in the connection.

#### <a name="method:Connection.merge">Connection.merge</a>

Merges the current connection with one or more other connection. The merging creates a copy of the current connection 
and iterates the specified connections one by one. If a pair of keys for mapping from the iterated connection does not 
exists in merged connection, then it is added, otherwise the value for that pair of keys is overridden. The value from 
the first argument override the values in the current connection, the value from the second argument override both the 
values from the current connection and the first argument and so on.

```
function merge(connections...:Connection):Connection throws TypeError
```

##### Arguments

1. maps... - One or more maps to be merged with current Connection.

##### Return

Returns new __Connection__ containing merged values from all connection.

##### Exception

* __TypeError__: If no arguments specified or if any of the arguments specified is not an instance of __Connection__.

#### <a name="method:Connection.reduce">Connection.reduce</a>

Reduces the connection to single value based on callback function.

```
function reduce(callback:Function, initialValue:*, this:*):*
```

```
function callback(previousValue:*, currentValue:*, leftKey:*, rightKey:*, connection:Connection):*
```

##### Arguments

1. callback - A function to be called for each mapping in the connection. On the first call for __previousValue__ is 
given the value of __initialValue__ and for any subsequent calls - the value returned by the __callback__ from previous 
call.
2. initialValue - The value to start the reduction.
3. this - A value to be bound to __this__ keyword in the callback.

##### Return

The reduce method returns the value returned from the last call of the __callback__ function.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Connection.set">Connection.set</a>

Sets a value for specific pair of keys. If the connection does not contain such pair, it is added and it is mapped to 
value specified, otherwise the found pair's mapped value is replaced by the current value.

```
function set(leftKey:*, rightKey:*, value:*):boolean
```

##### Arguments

1. leftKey - The first value of the pair of keys.
2. rightKey - The second value of the pair of keys.
2. value - The value to become the mapped value for the pair of keys.

##### Return

Returns whether the length of the connection has been changed by the operation.

#### <a name="method:Connection.some">Connection.some</a>

Test if there is mapping in the connection that satisfies a callback function. This function has iteration optimization 
- it may process only part of the mappings and returns early if the return result is known.

```
function some(callback:Function, this:*):boolean throws TypeError
```

```
function callback(value:*, leftKey:*, rightKey:*, connection:Connection):boolean
```

##### Arguments

1. callback - A function to be called for each of the mappings of the connection.
2. this - A value to be bound to __this__ keyword in the callback.

##### Return

If the callback returned __true__ for at least one mapping of the __Connection__, then __true__ is returned. Otherwise 
__false__ is returned.

##### Exception

* __TypeError__: If the __callback__ argument given is not a function.

#### <a name="method:Connection.values">Connection.values</a>

Creates an array containing all values in the connection. The order of elements returned is implementation specific. 
The returned array has the same order as __keys__ method. A values in the returned array may be repeated.

```
function values():Array
```

##### Return

A javascript __Array__ object containing all values from all mappings of the connection.

### <a name="class:Graph">Graph</a>

The graph is used to store both javascript values and connection between those values. Unlike the __Relation__, the 
__Graph__ collection allow some values to be disconnected (and still be in the graph). The javascript values stored in 
the graph are called _nodes_ and the connection between the values are called _edges_. The edges are not allowed to 
lead to nowhere or to lead to javascript values not in the graph.

The __Graph__ class is still beta, more operations expected to be added.

* [addEdge](#method:Graph.addEdge)
* [addNode](#method:Graph.addNode)
* [childNodes](#method:Graph.childNodes)
* [deleteEdge](#method:Graph.deleteEdge)
* [deleteNode](#method:Graph.deleteNode)
* [hasEdge](#method:Graph.hasEdge)
* [hasNode](#method:Graph.hasNode)
* [incomingEdges](#method:Graph.incomingEdges)
* [isEmpty](#method:Graph.isEmpty)
* [outgoingEdges](#method:Graph.outgoingEdges)
* [parentNodes](#method:Graph.parentNodes)

#### <a name="method:Graph.addEdge">Graph.addEdge</a>

Adds an edge connecting two nodes. If the nodes are not in the graph, they are added. Adding an edge is the same as 
adding a connection between two values in context of current object (exactly like the __Relation__ do). The direction 
for the edge is from __parent__ towards the __child__.

```
function addEdge(parent:*, child:*):Array
```

##### Arguments

1. parent - The value to be used as parentNode.
2. child - The value to be used as childNode.

##### Return

Return an array with two indexes:
* At index 0 is the number of nodes added to the graph.
* At index 1 is the number of edges added to the graph.

#### <a name="method:Graph.addNode">Graph.addNode</a>

Adds a node to the graph. A node is a single value that is not required to have any edges in and out of the graph. 
Adding a node is similar to adding a value in a __Set__ and if a value is already in the graph, no new nodes are added.

```
function addNode(value:*):boolean
```

##### Arguments

1. value - The value to be added as node to the graph.

##### Return

Whether the value is actually added to the graph, e.g. if the number of nodes in the graph has changed.

#### <a name="method:Graph.childNodes">Graph.childNodes</a>

Get all nodes which are the child of the specified node. If the value is not in the graph, empty __Set__ is returned. 
If the  node has no outgoing connections, empty __Set__ is returned. User should check the value with __hasNode__ to 
find out which result occurred.

```
function childNodes(parent:*):Set
```

##### Arguments

1. parent - The parent value to find all children.

##### Return

A object instance of __Set__ containing all children values of the specified __parent__.

#### <a name="method:Graph.deleteEdge">Graph.deleteEdge</a>

Removes an edge from the graph, leaving its __parent__-__child__ nodes disconnected (in that direction).

```
function deleteEdge(parent:*, child:*):boolean
```

##### Arguments

1. parent - The value where the edge points from.
2. child - The value where the edge points to.

##### Return

Whether the edge was actually removed from the graph.

#### <a name="method:Graph.deleteNode">Graph.deleteNode</a>

Removes a node from the graph. If node is connected to or from other nodes, just removing the node will leave some 
edges in invalid state - that is they are not coming or going to the graph node. So the method also remove all edges 
connected to that node. If the value is not in the graph, nothing is removed.

```
function deleteNode(value:*):Array
```

##### Arguments

1. value - The value to be removed from the graph.

##### Return

Return an array with following indexes:
* At index 0 is the number of nodes removed from the graph.
* At index 1 is the number of edges removed from the graph.

#### <a name="method:Graph.hasEdge">Graph.hasEdge</a>

Check if the is edge from __parent__ to the __child__ in the graph.

```
function hasEdge(parent:*, child:*):boolean
```

##### Arguments

1. parent - Where the should should come from.
2. child - Where the edge should go to.

##### Return

Returns __true__ if such an edge is found, __false__ otherwise.

#### <a name="method:Graph.hasNode">Graph.hasNode</a>

Check if the __value__ is in the graph.

```
function hasNode(value:*):boolean
```

##### Arguments

1. value - The value to be checked.

##### Return

Returns __true__ if the __value__ is found in the graph, __false__ otherwise.

#### <a name="method:Graph.incomingEdges">Graph.incomingEdges</a>

Gets all edges pointing toward the specified child node. The edges are stored in __Relation__ object. If the child is 
not in the graph or has no incoming edges - empty __Relation__ is returned. Use __hasNode__ method to check which case 
is it.

```
function incomingEdges(child:*):Relation
```

##### Arguments

1. child - A value to search all edges which pointing toward it.

##### Return

Return __Relation__ object with all edges from the graph whose right key is always the specified __child__ node.

#### <a name="method:Graph.isEmpty">Graph.isEmpty</a>

Check if the graph is empty, e.g. it has no nodes.

```
function isEmpty():boolean
```

##### Return

Returns __true__ if the graph has no nodes. In that case it cannot have any edges either.

#### <a name="method:Graph.outgoingEdges">Graph.outgoingEdges</a>

Gets all edges starting from the specified parent node. The edges are stored in __Relation__ object. If the parent is 
not in the graph or has no outgoing edges - empty __Relation__ is returned. Use __hasNode__ method to check which case 
is it.

```
function outgoingEdges(parent:*):Relation
```

##### Arguments

1. parent - A value to search all edges which starting from it.

##### Return

Return __Relation__ object with all edges from the graph whose left key is always the specified __parent__ node.

#### <a name="method:Graph.parentNodes">Graph.parentNodes</a>

Get all nodes which are the parent of the specified node. If the value is not in the graph, empty __Set__ is returned. 
If the  node has no incoming connections, empty __Set__ is returned. User should check the value with __hasNode__ to 
find out which result occurred.

```
function childNodes(child:*):Set
```

##### Arguments

1. child - The child value to find all parents.

##### Return

A object instance of __Set__ containing all parents values of the specified __child__.

### <a name="class:Network">Network</a>

The __Network__ class is similar to __Graph__ class, but unlike it, it doesn't just store the values and connections 
between them. It uses both values and connections to map javascript values to them. While this is similar to __Map__ 
(which maps values to values) and __Connection__ (which maps connections to values), this class combines them. This 
class can be viewed as in-memory graph database, since the graph databases are graphs where each node and each edge can 
contain a value. Unlike the graph databases, the object can store any javascript value (including functions) and can 
use a single value in many nodes and connections.

The __Network__ class is still beta, more operations expected to be added.

_Naming conventions:_ While __Relation__ and __Graph__ are mathematical terms, its corresponding mappers required 
alternative names. Since the world network is a graph (including not only internet, but also intranet networks), it was 
a good idea to call something similar to graph. In the computer networks nodes are not just indistinguishable objects, 
they are complex machines with individual characteristics. The connection between those machines also varies in 
characteristics. Since the __Connection__ and __Network__ classes can represents characteristics about the connections 
and about the network itself, their names are chosen fairly.

* [addEdge](#method:Network.addEdge)
* [addNode](#method:Network.addNode)
* [childNodes](#method:Network.childNodes)
* [deleteEdge](#method:Network.deleteEdge)
* [deleteNode](#method:Network.deleteNode)
* [hasEdge](#method:Network.hasEdge)
* [hasNode](#method:Network.hasNode)
* [incomingEdges](#method:Network.incomingEdges)
* [isEmpty](#method:Network.isEmpty)
* [outgoingEdges](#method:Network.outgoingEdges)
* [parentNodes](#method:Network.parentNodes)

#### <a name="method:Network.addEdge">Network.addEdge</a>

Adds a connection between nodes in the network. If the values specified is not nodes in the network, they are added 
with mapped value for individual nodes set to __undefined__.

```
function addEdge(parent:*, child:*, value:*):Array
```

##### Arguments

1. parent - The value to be used as parent node.
2. child - The value to be used as child node.
3. value - The value mapped to the edge.

##### Return

Return an array with two indexes:
* At index 0 is the number of nodes added to the network.
* At index 1 is the number of edges added to the network.

#### <a name="method:Network.addNode">Network.addNode</a>

Maps a value to a node of the network. Node is added if it is not in the network.

```
function addNode(node:*, value:*):boolean
```

##### Arguments

1. node - The node to which data should be added/replaced.
1. value - The data value to be mapped to the node.

##### Return

Whether a new node was added to the graph.

#### <a name="method:Graph.childNodes">Graph.childNodes</a>

Get all nodes which are the child of the specified node. If the value is not in the network, empty __Map__ is returned. 
If the  node has no outgoing connections, empty __Map__ is returned. User should check the value with __hasNode__ to 
find out which result occurred.

```
function childNodes(parent:*):Map
```

##### Arguments

1. parent - The parent value to find all children.

##### Return

A object instance of __Map__ containing all children mapping of the specified __parent__.

#### <a name="method:Network.deleteEdge">Network.deleteEdge</a>

Removes an edge from the network, leaving its __parent__-__child__ nodes disconnected (in that direction).

```
function deleteEdge(parent:*, child:*):boolean
```

##### Arguments

1. parent - The value where the edge points from.
2. child - The value where the edge points to.

##### Return

Whether the edge was actually removed from the network.

#### <a name="method:Network.deleteNode">Network.deleteNode</a>

Removes a node from the network. If node is connected to or from other nodes, just removing the node will leave some 
edges in invalid state - that is they are not coming or going to the network node. So the method also remove all edges 
connected to that node. If the value is not in the network, nothing is removed.

```
function deleteNode(node:*):Array
```

##### Arguments

1. node - The value to be removed from the graph.

##### Return

Return an array with following indexes:
* At index 0 is the number of nodes removed from the graph.
* At index 1 is the number of edges removed from the graph.

#### <a name="method:Network.hasEdge">Network.hasEdge</a>

Check if the is edge from __parent__ to the __child__ in the network.

```
function hasEdge(parent:*, child:*):boolean
```

##### Arguments

1. parent - Where the should should come from.
2. child - Where the edge should go to.

##### Return

Returns __true__ if such an edge is found, __false__ otherwise.

#### <a name="method:Network.hasNode">Network.hasNode</a>

Check if the __node__ is in the network.

```
function hasNode(node:*):boolean
```

##### Arguments

1. node - The value to be checked.

##### Return

Returns __true__ if the __value__ is found in the network, __false__ otherwise.

#### <a name="method:Network.incomingEdges">Network.incomingEdges</a>

Gets all edges pointing toward the specified child node. The edges are stored in __Connection__ object. If the child is 
not in the network or has no incoming edges - empty __Connection__ is returned. Use __hasNode__ method to check which 
case is it.

```
function incomingEdges(child:*):Connection
```

##### Arguments

1. child - A value to search all edges which pointing toward it.

##### Return

Return __Connection__ object with all edges from the network whose right key is always the specified __child__ node.

#### <a name="method:Network.isEmpty">Network.isEmpty</a>

Check if the network is empty, e.g. it has no nodes.

```
function isEmpty():boolean
```

##### Return

Returns __true__ if the network has no nodes. In that case it cannot have any edges either.

#### <a name="method:Network.outgoingEdges">Network.outgoingEdges</a>

Gets all edges starting from the specified parent node. The edges are stored in __Connection__ object. If the parent is 
not in the network or has no outgoing edges - empty __Connection__ is returned. Use __hasNode__ method to check which 
case is it.

```
function outgoingEdges(parent:*):Connection
```

##### Arguments

1. parent - A value to search all edges which starting from it.

##### Return

Return __Connection__ object with all edges from the network whose left key is always the specified __parent__ node.

#### <a name="method:Network.parentNodes">Network.parentNodes</a>

Get all nodes which are the parent of the specified node. If the value is not in the network, empty __Map__ is returned. 
If the node has no incoming connections, empty __Map__ is returned. User should check the value with __hasNode__ to 
find out which result occurred.

```
function childNodes(child:*):Map
```

##### Arguments

1. child - The child value to find all parents.

##### Return

A object instance of __Map__ containing all parents values of the specified __child__.