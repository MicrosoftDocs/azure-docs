---
title: Create UI definition collection functions
description: Describes the functions to use when working with collections, like arrays and objects.
ms.topic: conceptual
ms.date: 07/13/2020
---

# CreateUiDefinition collection functions

These functions can be used with collections, like JSON strings, arrays and objects.

## contains

Returns `true` if a string contains the specified substring, an array contains the specified value, or an object contains the specified key.

### Example: string contains

The following example returns `true`:

```json
"[contains('webapp', 'web')]"
```

### Example: array contains

Assume `element1` returns `[1, 2, 3]`. The following example returns `false`:

```json
"[contains(steps('demoStep').element1, 4)]"
```

### Example: object contains

Assume `element1` returns:

```json
{
  "key1": "Linux",
  "key2": "Windows"
}
```

The following example returns `true`:

```json
"[contains(steps('demoStep').element1, 'key1')]"
```

## empty

Returns `true` if the string, array, or object is null or empty.

### Example: string empty

The following example returns `true`:

```json
"[empty('')]"
```

### Example: array empty

Assume `element1` returns `[1, 2, 3]`. The following example returns `false`:

```json
"[empty(steps('demoStep').element1)]"
```

### Example: object empty

Assume `element1` returns:

```json
{
  "key1": "Linux",
  "key2": "Windows"
}
```

The following example returns `false`:

```json
"[empty(steps('demoStep').element1)]"
```

### Example: null and undefined

Assume `element1` is `null` or undefined. The following example returns `true`:

```json
"[empty(steps('demoStep').element1)]"
```

## filter

Returns a new array after applying the filtering logic provided as a lambda function. The first parameter is the array to use for filtering. The second parameter is the lambda function that specifies the filtering logic.

The following sample returns the array `[ { "name": "abc" } ]`.

```json
"[filter(parse('[{\"name\":\"abc\"},{\"name\":\"xyz\"}]'), (item) => contains(item.name, 'abc'))]"
```

## first

Returns the first character of the specified string; first value of the specified array; or the first key and value of the specified object.

### Example: string first

The following example returns `"c"`:

```json
"[first('contoso')]"
```

### Example: array first

Assume `element1` returns `[1, 2, 3]`. The following example returns `1`:

```json
"[first(steps('demoStep').element1)]"
```

#### Example: object first

Assume `element1` returns:

```json
{
  "key1": "Linux",
  "key2": "Windows"
}
```

The following example returns `{"key1": "Linux"}`:

```json
"[first(steps('demoStep').element1)]"
```

## last

Returns the last character of the specified string, the last value of the specified array, or the last key and value of the specified object.

### Example: string last

The following example returns `"o"`:

```json
"[last('contoso')]"
```

### Example: array last

Assume `element1` returns `[1, 2, 3]`. The following example returns `3`:

```json
"[last(steps('demoStep').element1)]"
```

### Example: object last

Assume `element1` returns:

```json
{
  "key1": "Linux",
  "key2": "Windows"
}
```

The following example returns `{"key2": "Windows"}`:

```json
"[last(steps('demoStep').element1)]"
```

## length

Returns the number of characters in a string, the number of values in an array, or the number of keys in an object.

### Example: string length

The following example returns `7`:

```json
"[length('Contoso')]"
```

### Example: array length

Assume `element1` returns `[1, 2, 3]`. The following example returns `3`:

```json
"[length(steps('demoStep').element1)]"
```

### Example: object length

Assume `element1` returns:

```json
{
  "key1": "Linux",
  "key2": "Windows"
}
```

The following example returns `2`:

```json
"[length(steps('demoStep').element1)]"
```

## map

Returns a new array after calling a lambda function on a provided array. The first parameter is the array to use for the lambda function. The second parameter is the lambda function.

The following sample returns a new array with every value doubled. The result is `[2, 4, 6]`.

```json
"[map(parse('[1, 2, 3]'), (item) => mul(2, item))]"
```

The following sample returns a new array `["abc", "xyz"]`.

```json
"[map(parse('[{\"name\":\"abc\"},{\"name\":\"xyz\"}]'), (item) => item.name)]"
```

## skip

Bypasses a specified number of elements in a collection, and then returns the remaining elements.

### Example: string skip

The following example returns `"app"`:

```json
"[skip('webapp', 3)]"
```

### Example: array skip

Assume `element1` returns `[1, 2, 3]`. The following example returns `[3]`:

```json
"[skip(steps('demoStep').element1, 2)]"
```

### Example: object skip

Assume `element1` returns:

```json
{
  "key1": "Linux",
  "key2": "Windows"
}
```
The following example returns `{"key2": "Windows"}`:

```json
"[skip(steps('demoStep').element1, 1)]"
```

## split

Returns an array of strings containing the substrings of the input delimited by the separator.

The following sample returns the array `[ "555", "867", "5309" ]`.

```json
"[split('555-867-5309', '-')]"
```

## take

Returns a specified number of contiguous characters from the start of the string, a specified number of contiguous values from the start of the array, or a specified number of contiguous keys and values from the start of the object.

### Example: string take

The following example returns `"web"`:

```json
"[take('webapp', 3)]"
```

### Example: array take

Assume `element1` returns `[1, 2, 3]`. The following example returns `[1, 2]`:

```json
"[take(steps('demoStep').element1, 2)]"
```

### Example: object take

Assume `element1` returns:

```json
{
  "key1": "Linux",
  "key2": "Windows"
}
```

The following example returns `{"key1": "Linux"}`:

```json
"[take(steps('demoStep').element1, 1)]"
```

## Next steps

* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../management/overview.md).
