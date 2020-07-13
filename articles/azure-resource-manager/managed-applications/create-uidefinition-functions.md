---
title: Create UI definition functions
description: Describes the functions to use when constructing UI definitions for Azure Managed Applications
author: tfitzmac

ms.topic: conceptual
ms.date: 07/13/2020
ms.author: tomfitz

---
# CreateUiDefinition functions

This section contains the signatures for all supported functions of a CreateUiDefinition.

To use a function, surround the invocation with square brackets. For example:

```json
"[function()]"
```

Strings and other functions can be referenced as parameters for a function, but strings must be surrounded in single quotes. For example:

```json
"[fn1(fn2(), 'demo text')]"
```

Where applicable, you can reference properties of the output of a function by using the dot operator. For example:

```json
"[func().prop1]"
```

## Referencing functions

* [basics](create-uidefinition-referencing-functions.md#basics)
* [location](create-uidefinition-referencing-functions.md#location)
* [resourceGroup](create-uidefinition-referencing-functions.md#resourceGroup)
* [steps](create-uidefinition-referencing-functions.md#steps)
* [subscription](create-uidefinition-referencing-functions.md#subscription)

## String functions

* [concat](create-uidefinition-string-functions.md#concat)
* [endsWith](create-uidefinition-string-functions.md#endsWith)
* [guid](create-uidefinition-string-functions.md#guid)
* [indexOf](create-uidefinition-string-functions.md#indexOf)
* [lastIndexOf](create-uidefinition-string-functions.md#lastIndexOf)
* [replace](create-uidefinition-string-functions.md#replace)
* [startsWith](create-uidefinition-string-functions.md#startsWith)
* [substring](create-uidefinition-string-functions.md#substring)
* [toLower](create-uidefinition-string-functions.md#toLower)
* [toUpper](create-uidefinition-string-functions.md#toUpper)

## Collection functions

These functions can be used with collections, like JSON strings, arrays and objects.

* [contains](create-uidefinition-collection-functions.md#contains)
* [empty](create-uidefinition-collection-functions.md#empty)
* [first](create-uidefinition-collection-functions.md#first)
* [last](create-uidefinition-collection-functions.md#last)
* [length](create-uidefinition-collection-functions.md#length)
* [skip](create-uidefinition-collection-functions.md#skip)
* [take](create-uidefinition-collection-functions.md#take)

## Logical functions

These functions can be used in conditionals. Some functions may not support all JSON data types.

* [and](create-uidefinition-logical-functions.md#and)
* [coalesce](create-uidefinition-logical-functions.md#coalesce)
* [equals](create-uidefinition-logical-functions.md#equals)
* [greater](create-uidefinition-logical-functions.md#greater)
* [greaterOrEquals](create-uidefinition-logical-functions.md#greaterOrEquals)
* [less](create-uidefinition-logical-functions.md#less)
* [lessOrEquals](create-uidefinition-logical-functions.md#lessOrEquals)
* [not](create-uidefinition-logical-functions.md#not)
* [or](create-uidefinition-logical-functions.md#or)

## Conversion functions

These functions can be used to convert values between JSON data types and encodings.

* [bool](create-uidefinition-conversion-functions.md#bool)
* [decodeBase64](create-uidefinition-conversion-functions.md#decodeBase64)
* [decodeUriComponent](create-uidefinition-conversion-functions.md#decodeUriComponent)
* [encodeBase64](create-uidefinition-conversion-functions.md#encodeBase64)
* [encodeUriComponent](create-uidefinition-conversion-functions.md#encodeUriComponent)
* [float](create-uidefinition-conversion-functions.md#float)
* [int](create-uidefinition-conversion-functions.md#int)
* [parse](create-uidefinition-conversion-functions.md#parse)
* [string](create-uidefinition-conversion-functions.md#string)

## Math functions

* [add](create-uidefinition-math-functions.md#add)
* [ceil](create-uidefinition-math-functions.md#ceil)
* [div](create-uidefinition-math-functions.md#div)
* [floor](create-uidefinition-math-functions.md#floor)
* [max](create-uidefinition-math-functions.md#max)
* [min](create-uidefinition-math-functions.md#min)
* [mod](create-uidefinition-math-functions.md#mod)
* [mul](create-uidefinition-math-functions.md#mul)
* [rand](create-uidefinition-math-functions.md#rand)
* [range](create-uidefinition-math-functions.md#range)
* [sub](create-uidefinition-math-functions.md#sub)


## Date functions

* [addHours](create-uidefinition-date-functions.md#addHours)
* [addMinutes](create-uidefinition-date-functions.md#addMinutes)
* [addSeconds](create-uidefinition-date-functions.md#addSeconds)
* [utcNow](create-uidefinition-date-functions.md#utcNow)

## Next steps

* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../management/overview.md).
