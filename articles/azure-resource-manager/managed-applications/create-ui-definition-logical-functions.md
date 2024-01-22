---
title: Create UI definition logical functions
description: Describes the functions to perform logical operations.
ms.topic: conceptual
ms.date: 07/13/2020
---

# CreateUiDefinition logical functions

These functions can be used in conditional expressions. Some functions may not support all JSON data types.

## and

Returns `true` if all the parameters evaluate to `true`. This function supports two or more parameters only of type boolean.

The following example returns `true`:

```json
"[and(equals(0, 0), equals('web', 'web'), less(1, 2))]"
```

The following example returns `false`:

```json
"[and(equals(0, 0), greater(1, 2))]"
```

## coalesce

Returns the value of the first non-null parameter. This function supports all JSON data types.

Assume `element1` and `element2` are undefined. The following example returns `"Contoso"`:

```json
"[coalesce(steps('demoStep').element1, steps('demoStep').element2, 'Contoso')]"
```

This function is especially useful in the context of optional invocation that happens due to user action after the page loads. An example is if the constraints placed on one field in the UI depend on the currently selected value of another, **initially non-visible** field. In this case, `coalesce()` can be used to allow the function to be syntactically valid at page load time while having the desired effect when the user interacts with the field.

Consider this `DropDown`, which allows the user to choose from several different database types:

```
{
    "name": "databaseType",
    "type": "Microsoft.Common.DropDown",
    "label": "Choose database type",
    "toolTip": "Choose database type",
    "defaultValue": "Oracle Database",
    "visible": "[bool(steps('section_database').connectToDatabase)]"
    "constraints": {
        "allowedValues": [
            {
                "label": "Azure Database for PostgreSQL",
                "value": "postgresql"
            },
            {
                "label": "Oracle Database",
                "value": "oracle"
            },
            {
                "label": "Azure SQL",
                "value": "sqlserver"
            }
        ],
        "required": true
    },
```

To condition the action of another field on the current chosen value of this field, use `coalesce()`, as shown here:

```
"regex": "[concat('^jdbc:', coalesce(steps('section_database').databaseConnectionInfo.databaseType, ''), '.*$')]",
```

This is necessary because the `databaseType` is initially not visible and therefore does not have a value. This causes the entire expression to not evaluate correctly.

## equals

Returns `true` if both parameters have the same type and value. This function supports all JSON data types.

The following example returns `true`:

```json
"[equals(0, 0)]"
```

The following example returns `true`:

```json
"[equals('web', 'web')]"
```

The following example returns `false`:

```json
"[equals('abc', ['a', 'b', 'c'])]"
```

## greater

Returns `true` if the first parameter is strictly greater than the second parameter. This function supports parameters only of type number and string.

The following example returns `false`:

```json
"[greater(1, 2)]"
```

The following example returns `true`:

```json
"[greater('9', '10')]"
```

## greaterOrEquals

Returns `true` if the first parameter is greater than or equal to the second parameter. This function supports parameters only of type number and string.

The following example returns `true`:

```json
"[greaterOrEquals(2, 2)]"
```

## if

Returns a value based on whether a condition is true or false. The first parameter is the condition to test. The second parameter is the value to return if the condition is true. The third parameter is the value to return if the condition is false.

The following sample returns `yes`.

```json
"[if(equals(42, mul(6, 7)), 'yes', 'no')]"
```

## less

Returns `true` if the first parameter is strictly less than the second parameter. This function supports parameters only of type number and string.

The following example returns `true`:

```json
"[less(1, 2)]"
```

The following example returns `false`:

```json
"[less('9', '10')]"
```

## lessOrEquals

Returns `true` if the first parameter is less than or equal to the second parameter. This function supports parameters only of type number and string.

The following example returns `true`:

```json
"[lessOrEquals(2, 2)]"
```

## not

Returns `true` if the parameter evaluates to `false`. This function supports parameters only of type Boolean.

The following example returns `true`:

```json
"[not(false)]"
```

The following example returns `false`:

```json
"[not(equals(0, 0))]"
```

## or

Returns `true` if at least one of the parameters evaluates to `true`. This function supports two or more parameters only of type Boolean.

The following example returns `true`:

```json
"[or(equals(0, 0), equals('web', 'web'), less(1, 2))]"
```

The following example returns `true`:

```json
"[or(equals(0, 0), greater(1, 2))]"
```

## Next steps

* For an introduction to Azure Resource Manager, see [Azure Resource Manager overview](../management/overview.md).
