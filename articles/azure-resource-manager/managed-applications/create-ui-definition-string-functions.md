---
title: Create UI definition string functions
description: Describes the string functions to use when constructing UI definitions for Azure Managed Applications
ms.topic: conceptual
ms.date: 07/13/2020
---

# CreateUiDefinition string functions

These functions to use with JSON strings.

## concat

Concatenates one or more strings.

For example, if the output value of `element1` if `"Contoso"`, then this example returns the string `"Demo Contoso app"`:

```json
"[concat('Demo ', steps('step1').element1, ' app')]"
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

The following example returns `"Contoso.com web app"`:

```json
"[replace('Contoso.net web app', '.net', '.com')]"
```

## startsWith

Determines whether a string starts with a value.

The following sample returns true.

```json
"[startsWith('abcdefg', 'ab')]"
```

## substring

Returns the substring of the specified string. The substring starts at the specified index and has the specified length.

The following example returns `"web"`:

```json
"[substring('Contoso.com web app', 12, 3)]"
```

## toLower

Returns a string converted to lowercase.

The following example returns `"contoso"`:

```json
"[toLower('CONTOSO')]"
```

## toUpper

Returns a string converted to uppercase.

The following example returns `"CONTOSO"`:

```json
"[toUpper('contoso')]"
```

## Next steps

* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../management/overview.md).
