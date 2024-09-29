---
title: Linter rule - Use the safe access (.?) operator
description: Use the safe access (.?) operator instead of checking object contents with the 'contains' function.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 07/19/2024
---

# Linter rule - use the safe access operator

This rule looks for the use of the [`contains()`](./bicep-functions-object.md#contains) function for checking property existence before access and provides a simpler automatic replacement. It serves to recommend and introduce users to a simplified equivalent syntax without introducing any functional code changes. For more information, see [Safe dereference operator](./operator-safe-dereference.md).

The specific patterns it's looking for are:

- Ternary operator to check for property access:

    ```bicep
    contains(<object>, '<property>') ? <object>.<property> : <default-value>
    ```

    The following replacement is suggested:

    ```bicep
    <object>.?<property> ?? <default-value>
    ```

- Ternary operator to check for variable-named property access:

    ```bicep
    contains(<object>, <property-name>) ? foo[<property-name>] : <default-value>
    ```

    The following replacement is suggested:

    ```bicep
    <object>[?<property-name>] ?? <default-value>
    ```

## Linter rule code

To customize rule settings, use the following value in the [Bicep configuration file](./bicep-config-linter.md):

`use-safe-access`

## Solution

Accept the editor code action to automatically perform the refactor.

## Examples

### Named Property Access

The following example triggers the rule:

```bicep
param foo object
var test = contains(foo, 'bar') ? foo.bar : 'baz'
```

Accepting the code action results in the following Bicep:

```bicep
param foo object
var test = foo.?bar ?? 'baz'
```

### Variable Property Access

The following example triggers the rule:

```bicep
param foo object
param target string
var test = contains(foo, target) ? foo[target] : 'baz'
```

Accepting the code action results in the following Bicep:

```bicep
param foo object
param target string
var test = foo[?target] ?? 'baz'
```

### Non-issues

The following examples don't trigger the rule:

Difference between the property being checked and accessed:

```bicep
param foo object
var test = contains(foo, 'bar') ? foo.baz : 'baz'
```

Difference between the variable property being checked and accessed:

```bicep
param foo object
param target string
param notTarget string
var test = contains(foo, target) ? bar[notTarget] : 'baz'
```

## Next steps

For more information about the linter, see [Use Bicep linter](./linter.md).