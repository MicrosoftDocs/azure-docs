---
title: Author policies for array properties on resources
description: Learn to work with array parameters and array language expressions, evaluate the [*] alias, and to append elements with Azure Policy definition rules.
ms.date: 08/17/2021
ms.topic: how-to
---
# Author policies for array properties on Azure resources

Azure Resource Manager properties are commonly defined as strings and booleans. When a one-to-many
relationship exists, complex properties are instead defined as arrays. In Azure Policy, arrays are
used in several different ways:

- The type of a [definition parameter](../concepts/definition-structure.md#parameters), to provide
  multiple options
- Part of a [policy rule](../concepts/definition-structure.md#policy-rule) using the conditions
  **in** or **notIn**
- Part of a policy rule that counts how many array members satisfy a condition
- In the [append](../concepts/effects.md#append) and [modify](../concepts/effects.md#modify) effects
  to update an existing array

This article covers each use by Azure Policy and provides several example definitions.

## Parameter arrays

### Define a parameter array

Defining a parameter as an array allows the policy flexibility when more than one value is needed.
This policy definition allows any single location for the parameter **allowedLocations** and
defaults to _eastus2_:

```json
"parameters": {
    "allowedLocations": {
        "type": "string",
        "metadata": {
            "description": "The list of allowed locations for resources.",
            "displayName": "Allowed locations",
            "strongType": "location"
        },
        "defaultValue": "eastus2"
    }
}
```

As **type** was _string_, only one value can be set when assigning the policy. If this policy is
assigned, resources in scope are only allowed within a single Azure region. Most policies
definitions need to allow for a list of approved options, such as allowing _eastus2_, _eastus_, and
_westus2_.

To create the policy definition to allow multiple options, use the _array_ **type**. The same policy
can be rewritten as follows:

```json
"parameters": {
    "allowedLocations": {
        "type": "array",
        "metadata": {
            "description": "The list of allowed locations for resources.",
            "displayName": "Allowed locations",
            "strongType": "location"
        },
        "defaultValue": "eastus2",
        "allowedValues": [
            "eastus2",
            "eastus",
            "westus2"
        ]

    }
}
```

> [!NOTE]
> Once a policy definition is saved, the **type** property on a parameter can't be changed.

This new parameter definition takes more than one value during policy assignment. With the array
property **allowedValues** defined, the values available during assignment are further limited to
the predefined list of choices. Use of **allowedValues** is optional.

### Pass values to a parameter array during assignment

When assigning the policy through the Azure portal, a parameter of **type** _array_ is displayed as
a single textbox. The hint says "Use ; to separate values. (e.g. London;New York)". To pass the
allowed location values of _eastus2_, _eastus_, and _westus2_ to the parameter, use the following
string:

`eastus2;eastus;westus2`

The format for the parameter value is different when using Azure CLI, Azure PowerShell, or the REST
API. The values are passed through a JSON string that also includes the name of the parameter.

```json
{
    "allowedLocations": {
        "value": [
            "eastus2",
            "eastus",
            "westus2"
        ]
    }
}
```

To use this string with each SDK, use the following commands:

- Azure CLI: Command
  [az policy assignment create](/cli/azure/policy/assignment#az-policy-assignment-create) with
  parameter **params**
- Azure PowerShell: Cmdlet [New-AzPolicyAssignment](/powershell/module/az.resources/New-Azpolicyassignment)
  with parameter **PolicyParameter**
- REST API: In the _PUT_ [create](/rest/api/policy/policyassignments/create) operation as part of
  the Request Body as the value of the **properties.parameters** property

## Using arrays in conditions

### In and notIn

The `in` and `notIn` conditions only work with array values. They check the existence of a value in
an array. The array can be a literal JSON array or a reference to an array parameter. For example:

```json
{
      "field": "tags.environment",
      "in": [ "dev", "test" ]
}
```

```json
{
      "field": "location",
      "notIn": "[parameters('allowedLocations')]"
}
```

### Value count

The [value count](../concepts/definition-structure.md#value-count) expression count how many array
members meet a condition. It provides a way to evaluate the same condition multiple times, using
different values on each iteration. For example, the following condition checks whether the resource
name matches any pattern from an array of patterns:

```json
{
    "count": {
        "value": [ "test*", "dev*", "prod*" ],
        "name": "pattern",
        "where": {
            "field": "name",
            "like": "[current('pattern')]"
        }
    },
    "greater": 0
}
```

In order to evaluate the expression, Azure Policy evaluates the `where` condition three times, once
for each member of `[ "test*", "dev*", "prod*" ]`, counting how many times it was evaluated to
`true`. On every iteration, the value of the current array member is paired with the `pattern` index
name defined by `count.name`. This value can then be referenced inside the `where` condition by
calling a special template function: `current('pattern')`.

| Iteration | `current('pattern')` returned value |
|:---|:---|
| 1 | `"test*"` |
| 2 | `"dev*"` |
| 3 | `"prod*"` |

The condition is true only if the resulted count is greater than 0.

To make the condition above more generic, use parameter reference instead of a literal array:

```json
{
    "count": {
        "value": "[parameters('patterns')]",
        "name": "pattern",
        "where": {
            "field": "name",
            "like": "[current('pattern')]"
        }
    },
    "greater": 0
}
```

When the **value count** expression isn't under any other **count** expression, `count.name` is
optional and the `current()` function can be used without any arguments:

```json
{
    "count": {
        "value": "[parameters('patterns')]",
        "where": {
            "field": "name",
            "like": "[current()]"
        }
    },
    "greater": 0
}
```

**Value count** also support arrays of complex objects, allowing for more complex conditions. For
example, the following condition defines a desired tag value for each name pattern and checks
whether the resource name matches the pattern, but doesn't have the required tag value:

```json
{
    "count": {
        "value": [
            { "pattern": "test*", "envTag": "dev" },
            { "pattern": "dev*", "envTag": "dev" },
            { "pattern": "prod*", "envTag": "prod" },
        ],
        "name": "namePatternRequiredTag",
        "where": {
            "allOf": [
                {
                    "field": "name",
                    "like": "[current('namePatternRequiredTag').pattern]"
                },
                {
                    "field": "tags.env",
                    "notEquals": "[current('namePatternRequiredTag').envTag]"
                }
            ]
        }
    },
    "greater": 0
}
```

For useful examples, see
[value count examples](../concepts/definition-structure.md#value-count-examples).

## Referencing array resource properties

Many use cases require working with array properties in the evaluated resource. Some scenarios
require referencing an entire array (for example, checking its length). Others require applying a
condition to each individual array member (for example, ensure that all firewall rule block access
from the internet). Understanding the different ways Azure Policy can reference resource properties,
and how these references behave when they refer to array properties is the key for writing
conditions that cover these scenarios.

### Referencing resource properties

Resource properties can be referenced by Azure Policy using
[aliases](../concepts/definition-structure.md#aliases) There are two ways to reference the values of
a resource property within Azure Policy:

- Use [field](../concepts/definition-structure.md#fields) condition to check whether **all**
  selected resource properties meet a condition. Example:

  ```json
  {
    "field" : "Microsoft.Test/resourceType/property",
    "equals": "value"
  }
  ```

- Use `field()` function to access the value of a property. Example:

  ```json
  {
    "value": "[take(field('Microsoft.Test/resourceType/property'), 7)]",
    "equals": "prefix_"
  }
  ```

The field condition has an implicit "all of" behavior. If the alias represents a collection of
values, it checks whether all individual values meet the condition. The `field()` function returns
the values represented by the alias as-is, which can then be manipulated by other template
functions.

### Referencing array fields

Array resource properties are represented by two different types of aliases. One 'normal' alias and
[array aliases](../concepts/definition-structure.md#understanding-the--alias) that have `[*]`
attached to it:

- `Microsoft.Test/resourceType/stringArray`
- `Microsoft.Test/resourceType/stringArray[*]`

#### Referencing the array

The first alias represents a single value, the value of `stringArray` property from the request
content. Since the value of that property is an array, it isn't useful in policy conditions. For
example:

```json
{
  "field": "Microsoft.Test/resourceType/stringArray",
  "equals": "..."
}
```

This condition compares the entire `stringArray` array to a single string value. Most conditions,
including `equals`, only accept string values, so there's not much use in comparing an array to a
string. The main scenario where referencing the array property is useful is when checking whether it
exists:

```json
{
  "field": "Microsoft.Test/resourceType/stringArray",
  "exists": "true"
}
```

With the `field()` function, the returned value is the array from the request content, which can
then be used with any of the
[supported template functions](../concepts/definition-structure.md#policy-functions) that accept
array arguments. For example, the following condition checks whether the length of `stringArray` is
greater than 0:

```json
{
  "value": "[length(field('Microsoft.Test/resourceType/stringArray'))]",
  "greater": 0
}
```

#### Referencing the array members collection

Aliases that use the `[*]` syntax represent a **collection of property values selected from an array
property**, which is different than selecting the array property itself. In the case of
`Microsoft.Test/resourceType/stringArray[*]`, it returns a collection that has all of the members of
`stringArray`. As mentioned previously, a `field` condition checks that all selected resource
properties meet the condition, therefore the following condition is true only if **all** the members
of `stringArray` are equal to '"value"'.

```json
{
  "field": "Microsoft.Test/resourceType/stringArray[*]",
  "equals": "value"
}
```

If the array is empty, the condition will evaluate to true because no member of the array is in violation. In this scenario, it is recommended to use the [count expression](../concepts/definition-structure.md#count) instead. If the array contains objects, a `[*]` alias can be used to select the value of a specific property
from each array member. Example:

```json
{
  "field": "Microsoft.Test/resourceType/objectArray[*].property",
  "equals": "value"
}
```

This condition is true if the values of all `property` properties in `objectArray` are equal to
`"value"`. For more examples, see [Additional \[\*\] alias
examples](#additional--alias-examples).

When using the `field()` function to reference an array alias, the returned value is an array of all
the selected values. This behavior means that the common use case of the `field()` function, the
ability to apply template functions to resource property values, is limited. The only template
functions that can be used in this case are the ones that accept array arguments. For example, it's
possible to get the length of the array with
`[length(field('Microsoft.Test/resourceType/objectArray[*].property'))]`. However, more complex
scenarios like applying template function to each array member and comparing it to a desired value
are only possible when using the `count` expression. For more information, see
[Field count expression](#field-count-expressions).

To summarize, see the following example resource content and the selected values returned by various
aliases:

```json
{
  "tags": {
    "env": "prod"
  },
  "properties":
  {
    "stringArray": [ "a", "b", "c" ],
    "objectArray": [
      {
        "property": "value1",
        "nestedArray": [ 1, 2 ]
      },
      {
        "property": "value2",
        "nestedArray": [ 3, 4 ]
      }
    ]
  }
}
```

When using the field condition on the example resource content, the results are as follows:

| Alias | Selected values |
|:--- |:---|
| `Microsoft.Test/resourceType/missingArray` | `null` |
| `Microsoft.Test/resourceType/missingArray[*]` | An empty collection of values. |
| `Microsoft.Test/resourceType/missingArray[*].property` | An empty collection of values. |
| `Microsoft.Test/resourceType/stringArray` | `["a", "b", "c"]` |
| `Microsoft.Test/resourceType/stringArray[*]` | `"a"`, `"b"`, `"c"` |
| `Microsoft.Test/resourceType/objectArray[*]` |  `{ "property": "value1", "nestedArray": [ 1, 2 ] }`,<br/>`{ "property": "value2", "nestedArray": [ 3, 4 ] }`|
| `Microsoft.Test/resourceType/objectArray[*].property` | `"value1"`, `"value2"` |
| `Microsoft.Test/resourceType/objectArray[*].nestedArray` | `[ 1, 2 ]`, `[ 3, 4 ]` |
| `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` | `1`, `2`, `3`, `4` |

When using the `field()` function on the example resource content, the results are as follows:

| Expression | Returned Value |
|:--- |:---|
| `[field('Microsoft.Test/resourceType/missingArray')]` | `""` |
| `[field('Microsoft.Test/resourceType/missingArray[*]')]` | `[]` |
| `[field('Microsoft.Test/resourceType/missingArray[*].property')]` | `[]` |
| `[field('Microsoft.Test/resourceType/stringArray')]` | `["a", "b", "c"]` |
| `[field('Microsoft.Test/resourceType/stringArray[*]')]` | `["a", "b", "c"]` |
| `[field('Microsoft.Test/resourceType/objectArray[*]')]` |  `[{ "property": "value1", "nestedArray": [ 1, 2 ] }, { "property": "value2", "nestedArray": [ 3, 4 ] }]`|
| `[field('Microsoft.Test/resourceType/objectArray[*].property')]` | `["value1", "value2"]` |
| `[field('Microsoft.Test/resourceType/objectArray[*].nestedArray')]` | `[[ 1, 2 ], [ 3, 4 ]]` |
| `[field('Microsoft.Test/resourceType/objectArray[*].nestedArray[*]')]` | `[1, 2, 3, 4]` |

### Field count expressions

[Field count](../concepts/definition-structure.md#field-count) expressions count how many array
members meet a condition and compare the count to a target value. `Count` is more intuitive and
versatile for evaluating arrays compared to `field` conditions. The syntax is:

```json
{
  "count": {
    "field": <[*] alias>,
    "where": <optional policy condition expression>
  },
  "equals|greater|less|any other operator": <target value>
}
```

When used without a `where` condition, `count` simply returns the length of an array. With the
example resource content from the previous section, the following `count` expression is evaluated to
`true` since `stringArray` has three members:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/stringArray[*]"
  },
  "equals": 3
}
```

This behavior also works with nested arrays. For example, the following `count` expression is
evaluated to `true` since there are four array members in the `nestedArray` arrays:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/objectArray[*].nestedArray[*]"
  },
  "greaterOrEquals": 4
}
```

The power of `count` is in the `where` condition. When it's specified, Azure Policy enumerates the
array members and evaluates each against the condition, counting how many array members evaluated to
`true`. Specifically, in each iteration of the `where` condition evaluation, Azure Policy selects a
single array member ***i*** and evaluate the resource content against the `where` condition **as if
***i*** is the only member of the array**. Having only one array member available in each iteration
provides a way to apply complex conditions on each individual array member.

Example:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/stringArray[*]",
    "where": {
      "field": "Microsoft.Test/resourceType/stringArray[*]",
      "equals": "a"
    }
  },
  "equals": 1
}
```

In order to evaluate the `count` expression, Azure Policy evaluates the `where` condition three
times, once for each member of `stringArray`, counting how many times it was evaluated to `true`.
When the `where` condition refers to the `Microsoft.Test/resourceType/stringArray[*]` array members,
instead of selecting all the members of `stringArray`, it will only select a single array member
every time:

| Iteration | Selected `Microsoft.Test/resourceType/stringArray[*]` values | `where` Evaluation result |
|:---|:---|:---|
| 1 | `"a"` | `true` |
| 2 | `"b"` | `false` |
| 3 | `"c"` | `false` |

The `count` returns `1`.

Here's a more complex expression:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/objectArray[*]",
    "where": {
      "allOf": [
        {
          "field": "Microsoft.Test/resourceType/objectArray[*].property",
          "equals": "value2"
        },
        {
          "field": "Microsoft.Test/resourceType/objectArray[*].nestedArray[*]",
          "greater": 2
        }
      ]
    }
  },
  "equals": 1
}
```

| Iteration | Selected values | `where` Evaluation result |
|:---|:---|:---|
| 1 | `Microsoft.Test/resourceType/objectArray[*].property` => `"value1"` </br> `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `1`, `2` | `false` |
| 2 | `Microsoft.Test/resourceType/objectArray[*].property` => `"value2"` </br> `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `3`, `4`| `true` |

The `count` returns `1`.

The fact that the `where` expression is evaluated against the **entire** request content (with
changes only to the array member that is currently being enumerated) means that the `where`
condition can also refer to fields outside the array:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/objectArray[*]",
    "where": {
      "field": "tags.env",
      "equals": "prod"
    }
  },
  "equals": 0
}
```

| Iteration | Selected values | `where` Evaluation result |
|:---|:---|:---|
| 1 | `tags.env` => `"prod"` | `true` |
| 2 | `tags.env` => `"prod"` | `true` |

Nested count expressions can be used to apply conditions to nested array fields. For example, the
following condition checks that the `objectArray[*]` array has exactly two members with
`nestedArray[*]` that contains one or more members:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/objectArray[*]",
    "where": {
      "count": {
        "field": "Microsoft.Test/resourceType/objectArray[*].nestedArray[*]"
      },
      "greaterOrEquals": 1
    }
  },
  "equals": 2
}
```

| Iteration | Selected values | Nested count evaluation result |
|:---|:---|:---|
| 1 | `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `1`, `2` | `nestedArray[*]` has 2 members => `true` |
| 2 | `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `3`, `4` | `nestedArray[*]` has 2 members => `true` |

Since both members of `objectArray[*]` have a child array `nestedArray[*]` with two members, the
outer count expression returns `2`.

More complex example: check that the `objectArray[*]` array has exactly two members with
`nestedArray[*]` with any members equal to `2` or `3`:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/objectArray[*]",
    "where": {
      "count": {
        "field": "Microsoft.Test/resourceType/objectArray[*].nestedArray[*]",
        "where": {
            "field": "Microsoft.Test/resourceType/objectArray[*].nestedArray[*]",
            "in": [ 2, 3 ]
        }
      },
      "greaterOrEquals": 1
    }
  },
  "equals": 2
}
```

| Iteration | Selected values | Nested count evaluation result
|:---|:---|:---|
| 1 | `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `1`, `2` | `nestedArray[*]` contains `2` => `true` |
| 2 | `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `3`, `4` | `nestedArray[*]` contains `3` => `true` |

Since both members of `objectArray[*]` have a child array `nestedArray[*]` that contains either `2`
or `3`, the outer count expression returns `2`.

> [!NOTE]
> Nested field count expressions can only refer to nested arrays. For example, count expression
> referring to `Microsoft.Test/resourceType/objectArray[*]` can have a nested count targeting the
> nested array `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]`, but it can't have a
> nested count expression targeting `Microsoft.Test/resourceType/stringArray[*]`.

#### Accessing current array member with template functions

When using template functions, use the `current()` function to access the value of the current array
member or the values of any of its properties. To access the value of the current array member, pass
the alias defined in `count.field` or any of its child aliases as an argument to the `current()`
function. For example:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/objectArray[*]",
    "where": {
        "value": "[current('Microsoft.Test/resourceType/objectArray[*].property')]",
        "like": "value*"
    }
  },
  "equals": 2
}

```

| Iteration | `current()` returned value | `where` Evaluation result |
|:---|:---|:---|
| 1 | The value of `property` in the first member of `objectArray[*]`: `value1` | `true` |
| 2 | The value of `property` in the first member of `objectArray[*]`: `value2` | `true` |

#### The field function inside where conditions

The `field()` function can also be used to access the value of the current array member as long as
the **count** expression isn't inside an **existence condition** (`field()` function always refer to
the resource evaluated in the **if** condition). The behavior of `field()` when referring to the
evaluated array is based on the following concepts:

1. Array aliases are resolved into a collection of values selected from all array members.
1. `field()` functions referencing array aliases return an array with the selected values.
1. Referencing the counted array alias inside the `where` condition returns a collection with a
   single value selected from the array member that is evaluated in the current iteration.

This behavior means that when referring to the counted array member with a `field()` function inside
the `where` condition, **it returns an array with a single member**. While this behavior may not be
intuitive, it's consistent with the idea that array aliases always return a collection of selected
properties. Here's an example:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/stringArray[*]",
    "where": {
      "field": "Microsoft.Test/resourceType/stringArray[*]",
      "equals": "[field('Microsoft.Test/resourceType/stringArray[*]')]"
    }
  },
  "equals": 0
}
```

| Iteration | Expression values | `where` Evaluation result |
|:---|:---|:---|
| 1 | `Microsoft.Test/resourceType/stringArray[*]` => `"a"` </br>  `[field('Microsoft.Test/resourceType/stringArray[*]')]` => `[ "a" ]` | `false` |
| 2 | `Microsoft.Test/resourceType/stringArray[*]` => `"b"` </br>  `[field('Microsoft.Test/resourceType/stringArray[*]')]` => `[ "b" ]` | `false` |
| 3 | `Microsoft.Test/resourceType/stringArray[*]` => `"c"` </br>  `[field('Microsoft.Test/resourceType/stringArray[*]')]` => `[ "c" ]` | `false` |

Therefore, when there's a need to access the value of the counted array alias with a `field()`
function, the way to do so is to wrap it with a `first()` template function:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/stringArray[*]",
    "where": {
      "field": "Microsoft.Test/resourceType/stringArray[*]",
      "equals": "[first(field('Microsoft.Test/resourceType/stringArray[*]'))]"
    }
  }
}
```

| Iteration | Expression values | `where` Evaluation result |
|:---|:---|:---|
| 1 | `Microsoft.Test/resourceType/stringArray[*]` => `"a"` </br>  `[first(field('Microsoft.Test/resourceType/stringArray[*]'))]` => `"a"` | `true` |
| 2 | `Microsoft.Test/resourceType/stringArray[*]` => `"b"` </br>  `[first(field('Microsoft.Test/resourceType/stringArray[*]'))]` => `"b"` | `true` |
| 3 | `Microsoft.Test/resourceType/stringArray[*]` => `"c"` </br>  `[first(field('Microsoft.Test/resourceType/stringArray[*]'))]` => `"c"` | `true` |

For useful examples, see
[Field count examples](../concepts/definition-structure.md#field-count-examples).

## Modifying arrays

The [append](../concepts/effects.md#append) and [modify](../concepts/effects.md#modify) alter
properties on a resource during creation or update. When working with array properties, the behavior
of these effects depends on whether the operation is trying to modify the **\[\*\]** alias or not:

> [!NOTE]
> Using the `modify` effect with aliases is currently in **preview**.

|Alias |Effect | Outcome |
|-|-|-|
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules` | `append` | Azure Policy appends the entire array specified in the effect details if missing. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules` | `modify` with `add` operation | Azure Policy appends the entire array specified in the effect details if missing. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules` | `modify` with `addOrReplace` operation | Azure Policy appends the entire array specified in the effect details if missing or replaces the existing array. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]` | `append` | Azure Policy appends the array member specified in the effect details. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]` | `modify` with `add` operation | Azure Policy appends the array member specified in the effect details. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]` | `modify` with `addOrReplace` operation | Azure Policy removes all existing array members and appends the array member specified in the effect details. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].action` | `append` | Azure Policy appends a value to the `action` property of each array member. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].action` | `modify` with `add` operation | Azure Policy appends a value to the `action` property of each array member. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].action` | `modify` with `addOrReplace` operation | Azure Policy appends or replaces the existing `action` property of each array member. |

For more information, see the [append examples](../concepts/effects.md#append-examples).

## Additional [*] alias examples

It's recommended to use the [field count expressions](#field-count-expressions) to check whether
'all of' or 'any of' the members of an array in the request content meet a condition. However, for
some simple conditions it's possible to achieve the same result by using a field accessor with an
array alias as described in
[Referencing the array members collection](#referencing-the-array-members-collection). This pattern
can be useful in policy rules that exceed the limit of allowed **count** expressions. Here are
examples for common use cases:

The example policy rule for the scenario table below:

```json
"policyRule": {
    "if": {
        "allOf": [
            {
                "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules",
                "exists": "true"
            },
            <-- Condition (see table below) -->
        ]
    },
    "then": {
        "effect": "[parameters('effectType')]"
    }
}
```

The **ipRules** array is as follows for the scenario table below:

```json
"ipRules": [
    {
        "value": "127.0.0.1",
        "action": "Allow"
    },
    {
        "value": "192.168.1.1",
        "action": "Allow"
    }
]
```

For each condition example below, replace `<field>` with
`"field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].value"`.

The following outcomes are the result of the combination of the condition and the example policy
rule and array of existing values above:

|Condition |Outcome | Scenario |Explanation |
|-|-|-|-|
|`{<field>,"notEquals":"127.0.0.1"}` |Nothing |None match |One array element evaluates as false (127.0.0.1 != 127.0.0.1) and one as true (127.0.0.1 != 192.168.1.1), so the **notEquals** condition is _false_ and the effect isn't triggered. |
|`{<field>,"notEquals":"10.0.4.1"}` |Policy effect |None match |Both array elements evaluate as true (10.0.4.1 != 127.0.0.1 and 10.0.4.1 != 192.168.1.1), so the **notEquals** condition is _true_ and the effect is triggered. |
|`"not":{<field>,"notEquals":"127.0.0.1" }` |Policy effect |One or more match |One array element evaluates as false (127.0.0.1 != 127.0.0.1) and one as true (127.0.0.1 != 192.168.1.1), so the **notEquals** condition is _false_. The logical operator evaluates as true (**not** _false_), so the effect is triggered. |
|`"not":{<field>,"notEquals":"10.0.4.1"}` |Nothing |One or more match |Both array elements evaluate as true (10.0.4.1 != 127.0.0.1 and 10.0.4.1 != 192.168.1.1), so the **notEquals** condition is _true_. The logical operator evaluates as false (**not** _true_), so the effect isn't triggered. |
|`"not":{<field>,"Equals":"127.0.0.1"}` |Policy effect |Not all match |One array element evaluates as true (127.0.0.1 == 127.0.0.1) and one as false (127.0.0.1 == 192.168.1.1), so the **Equals** condition is _false_. The logical operator evaluates as true (**not** _false_), so the effect is triggered. |
|`"not":{<field>,"Equals":"10.0.4.1"}` |Policy effect |Not all match |Both array elements evaluate as false (10.0.4.1 == 127.0.0.1 and 10.0.4.1 == 192.168.1.1), so the **Equals** condition is _false_. The logical operator evaluates as true (**not** _false_), so the effect is triggered. |
|`{<field>,"Equals":"127.0.0.1"}` |Nothing |All match |One array element evaluates as true (127.0.0.1 == 127.0.0.1) and one as false (127.0.0.1 == 192.168.1.1), so the **Equals** condition is _false_ and the effect isn't triggered. |
|`{<field>,"Equals":"10.0.4.1"}` |Nothing |All match |Both array elements evaluate as false (10.0.4.1 == 127.0.0.1 and 10.0.4.1 == 192.168.1.1), so the **Equals** condition is _false_ and the effect isn't triggered. |

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [remediate non-compliant resources](remediate-resources.md).
- Review what a management group is with
  [Organize your resources with Azure management groups](../../management-groups/overview.md).
