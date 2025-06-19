---
title: Bicep functions - flow control
description: Describes the functions that incluence execution flow.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 03/25/2025
---

# Flow control functions for Bicep

Bicep provides the `fail` function for influencing execution flow.

The `fail` function is primarily used for enforcing constraints and terminating evaluation based on logical conditions. It usually works within short-circuiting expressions like [?? (coalesce operator)](./operators-logical.md#coalesce-) and [?: (ternary operator)](./operators-logical.md#conditional-expression--). For more information, see [Logical operators](./operators-logical.md).

## fail

`fail(arg1)`

The `fail` function is useful for enforcing constraints in expressions, but it can only be used within short-circuiting functions—operations that stop execution as soon as the outcome is determined.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string|A descriptive error message that explains why the failure occurred.|

### Examples

The following example shows how to use `fail`.

```bicep
anObjectParameter.?name ?? anObjectParameter.?id ?? fail('Expected anObjectParameter to have either a .name or a .id property')
```

Here, the coalesce operator (??) ensures that if **.name** exists, execution stops immediately. If **.name** is null or undefined, **.id** is checked. If both are missing, `fail` is triggered, preventing further execution.

```bicep
x != 0 ? y / x : fail('x cannot be zero because it will be used as a divisor')
```

In this case, the ternary operator (? :) checks if **x** is nonzero before performing division. If **x** is **0**, `fail` is invoked, stopping execution before an invalid operation occurs.

## Next steps

* For other actions involving logical values, see [logical operators](./operators-logical.md).
