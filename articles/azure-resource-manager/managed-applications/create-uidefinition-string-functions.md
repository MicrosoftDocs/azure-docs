---
title: Create UI definition string functions
description: Describes the string functions to use when constructing UI definitions for Azure Managed Applications
author: tfitzmac

ms.topic: conceptual
ms.date: 07/10/2020
ms.author: tomfitz

---
# CreateUiDefinition string functions

These functions to use with JSON strings.

## concat

Concatenates one or more strings.

For example, if the output value of `element1` if `"bar"`, then this example returns the string `"foobar!"`:

```json
"[concat('foo', steps('step1').element1, '!')]"
```

## endsWith

Determines whether a string ends with a value.

The following sample returns true.

```json
"[endsWith('tuvwxyz', 'xyz')]"
```

## guid

Generates a globally unique string (GUID).

The following example returns a value like `"c7bc8bdc-7252-4a82-ba53-7c468679a511"`:

```json
"[guid()]"
```

## indexOf

Returns the first position of a value within a string or -1 if not found.

The following sample returns 2.

```json
"[indexOf('abcdef', 'cd')]"
```

## lastIndexOf

Returns the last position of a value in a string or -1 if not found.

The following sample returns 3.

```json
"[lastIndexOf('test', 't')]" 
```

## replace

Returns a string in which all occurrences of the specified string in the current string are replaced with another string.

The following example returns `"Everything is awesome!"`:

```json
"[replace('Everything is terrible!', 'terrible', 'awesome')]"
```

## startsWith

Determines whether a string starts with a value.

The following sample returns true.

```json
"[startsWith('abcdefg', 'ab')]"
```

## substring

Returns the substring of the specified string. The substring starts at the specified index and has the specified length.

The following example returns `"ftw"`:

```json
"[substring('azure-ftw!!!1one', 6, 3)]"
```

## toLower

Returns a string converted to lowercase.

The following example returns `"foobar"`:

```json
"[toLower('FOOBAR')]"
```

## toUpper

Returns a string converted to uppercase.

The following example returns `"FOOBAR"`:

```json
"[toUpper('foobar')]"
```

 



 

## Next steps

* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../management/overview.md).

