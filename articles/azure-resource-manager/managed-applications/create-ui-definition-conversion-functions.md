---
title: Create UI definition conversion functions
description: Describes the functions to use when converting values between data types and encodings.
ms.topic: conceptual
ms.date: 07/13/2020
---

# CreateUiDefinition conversion functions

These functions can be used to convert values between JSON data types and encodings.

## bool

Converts the parameter to a boolean. This function supports parameters of type number, string, and Boolean. Similar to booleans in JavaScript, any value except `0` or `'false'` returns `true`.

The following example returns `true`:

```json
"[bool(1)]"
```

The following example returns `false`:

```json
"[bool(0)]"
```

The following example returns `true`:

```json
"[bool(true)]"
```

The following example returns `true`:

```json
"[bool('true')]"
```

## decodeBase64

Decodes the parameter from a base-64 encoded string. This function supports parameters only of type string.

The following example returns `"Contoso"`:

```json
"[decodeBase64('Q29udG9zbw==')]"
```

## decodeUriComponent

Decodes the parameter from a URL encoded string. This function supports parameters only of type string.

The following example returns `"https://portal.azure.com/"`:

```json
"[decodeUriComponent('https%3A%2F%2Fportal.azure.com%2F')]"
```

## encodeBase64

Encodes the parameter to a base-64 encoded string. This function supports parameters only of type string.

The following example returns `"Q29udG9zbw=="`:

```json
"[encodeBase64('Contoso')]"
```

## encodeUriComponent

Encodes the parameter to a URL encoded string. This function supports parameters only of type string.

The following example returns `"https%3A%2F%2Fportal.azure.com%2F"`:

```json
"[encodeUriComponent('https://portal.azure.com/')]"
```

## float

Converts the parameter to a floating-point. This function supports parameters of type number and string.

The following example returns `1.0`:

```json
"[float('1.0')]"
```

The following example returns `2.9`:

```json
"[float(2.9)]"
```

## int

Converts the parameter to an integer. This function supports parameters of type number and string.

The following example returns `1`:

```json
"[int('1')]"
```

The following example returns `2`:

```json
"[int(2.9)]"
```

## parse

Converts the parameter to a native type. In other words, this function is the inverse of `string()`. This function supports parameters only of type string.

The following example returns `1`:

```json
"[parse('1')]"
```

The following example returns `true`:

```json
"[parse('true')]"
```

The following example returns `[1,2,3]`:

```json
"[parse('[1,2,3]')]"
```

The following example returns `{"type":"webapp"}`:

```json
"[parse('{\"type\":\"webapp\"}')]"
```

## string

Converts the parameter to a string. This function supports parameters of all JSON data types.

The following example returns `"1"`:

```json
"[string(1)]"
```

The following example returns `"2.9"`:

```json
"[string(2.9)]"
```

The following example returns `"[1,2,3]"`:

```json
"[string([1,2,3])]"
```

The following example returns `"{"type":"webapp"}"`:

```json
"[string({\"type\":\"webapp\"})]"
```

## Next steps

* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../management/overview.md).
