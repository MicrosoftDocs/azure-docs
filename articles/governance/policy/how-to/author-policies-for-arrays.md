---
title: Author policies for array properties on resources
description: Learn to work with array parameters and array language expressions, evaluate the [*] alias, and to append elements with Azure Policy definition rules.
ms.date: 10/22/2020
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
- Part of a policy rule that evaluates the [\[\*\]
  alias](../concepts/definition-structure.md#understanding-the--alias) to evaluate:
  - Scenarios such as **None**, **Any**, or **All**
  - Complex scenarios with **count**
- In the [append effect](../concepts/effects.md#append) to replace or add to an existing array

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
- REST API: In the _PUT_ [create](/rest/api/resources/policyassignments/create) operation as part of
  the Request Body as the value of the **properties.parameters** property

## Array conditions

The policy rule [conditions](../concepts/definition-structure.md#conditions) that an _array_
**type** of parameter may be used with is limited to `in` and `notIn`. Take the following policy
definition with condition `equals` as an example:

```json
{
  "policyRule": {
    "if": {
      "not": {
        "field": "location",
        "equals": "[parameters('allowedLocations')]"
      }
    },
    "then": {
      "effect": "audit"
    }
  },
  "parameters": {
    "allowedLocations": {
      "type": "Array",
      "metadata": {
        "description": "The list of allowed locations for resources.",
        "displayName": "Allowed locations",
        "strongType": "location"
      }
    }
  }
}
```

Attempting to create this policy definition through the Azure portal leads to an error such as this
error message:

- "The policy '{GUID}' could not be parameterized because of validation errors. Please check if
  policy parameters are properly defined. The inner exception 'Evaluation result of language
  expression '[parameters('allowedLocations')]' is type 'Array', expected type is 'String'.'."

The expected **type** of condition `equals` is _string_. Since **allowedLocations** is defined as
**type** _array_, the policy engine evaluates the language expression and throws the error. With the
`in` and `notIn` condition, the policy engine expects the **type** _array_ in the language
expression. To resolve this error message, change `equals` to either `in` or `notIn`.

## Referencing array resource properties

Many use cases require working with array properties in the evaluated resource. Some scenarios require referencing an entire array (for example, checking its length). Others require applying a condition to each individual array member (for example, ensure that all firewall rule block access from the internet). Understanding the different ways Azure Policy can reference resource properties, and how these references behave when they refer to array properties is the key for writing conditions that cover these scenarios.

### Referencing resource properties
Resource properties can be referenced by Azure Policy using [aliases](../concepts/definition-structure.md#aliases) There are two ways to reference the values of a resource property within Azure Policy:

- Use [field](../concepts/definition-structure.md#fields) condition to check whether **all** selected resource properties meet a condition. Example:

  ```json
  {
    "field" : "Microsoft.Test/resourceType/property",
    "equals": "value"
  }
  ```

- Use `field()` function to access the **literal** value of a property. Example:

  ```json
  {
    "value": "[take(field('Microsoft.Test/resourceType/property'), 7)]",
    "equals": "prefix_"
  }
  ```

The field condition has an implicit "all of" behavior. If the alias represents a collection of values, it checks whether all individual values meet the condition. The `field()` function returns the values represented by the alias as-is, which can then be manipulated by other template functions.

### Referencing array fields

Array resource properties are usually represented by two different types of aliases. One 'normal' alias and [array aliases](../concepts/definition-structure.md#understanding-the--alias) that have `[*]` attached to it:

- `Microsoft.Test/resourceType/stringArray`
- `Microsoft.Test/resourceType/stringArray[*]`

#### Referencing the array

The first alias represents a single value, the value of `stringArray` property from the request content. Since the value of that property is an array, it isn't very useful in policy conditions. For example:

```json
{
  "field": "Microsoft.Test/resourceType/stringArray",
  "equals": "..."
}
```

This condition compares the entire `stringArray` array to a single string value. Most conditions, including `equals`, only accept string values, so there's not much use in comparing an array to a string. The main scenario where referencing the array property is useful is when checking whether it exists:

```json
{
  "field": "Microsoft.Test/resourceType/stringArray",
  "exists": "true"
}
```

With the `field()` function, the returned value is the array from the request content, which can then be used with any of the [supported template functions](../concepts/definition-structure.md#policy-functions) that accept array arguments. For example, the following condition checks whether the length of `stringArray` is greater than 0:

```json
{
  "value": "[length(field('Microsoft.Test/resourceType/stringArray'))]",
  "greater": 0
}
```

#### Referencing the array members collection

Aliases that use the `[*]` syntax represent a **collection of property values selected from an array property**, which is different than selecting the array property itself. In the case of `Microsoft.Test/resourceType/stringArray[*]`, it returns a collection that has all of the members of `stringArray`. As mentioned previously, a `field` condition checks that all selected resource properties meet the condition, therefore the following condition is true only if **all** the members of `stringArray` are equal to '"value"'.

```json
{
  "field": "Microsoft.Test/resourceType/stringArray[*]",
  "equals": "value"
}
```

If the array contains objects, a `[*]` alias can be used to select the value of a specific property from each array member. Example:

```json
{
  "field": "Microsoft.Test/resourceType/objectArray[*].property",
  "equals": "value"
}
```

This condition is true if the values of all `property` properties in `objectArray` are equal to `"value"`.

When using the `field()` function to reference an array alias, the returned value is an array of all the selected values. This behavior means that the common use case of the `field()` function, the ability to apply template functions to resource property values, is very limited. The only template functions that can be used in this case are the ones that accept array arguments. For example, it's possible to get the length of the array with `[length(field('Microsoft.Test/resourceType/objectArray[*].property'))]`. However, more complex scenarios like applying template function to each array members and comparing it to a desired value are only possible when using the `count` expression. For more information, see [Count expression](#count-expressions).

To summarize, see the following example resource content and the selected values returned by various aliases:

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

## Count expressions

[Count](../concepts/definition-structure.md#count) expressions count how many array members meet a condition and compare the count to a target value. They are more intuitive and versatile tool for evaluating arrays compared to field conditions. The syntax is:

```json
{
  "count": {
    "field": <[*] alias>,
    "where": <optional policy condition expression>
  },
  "equals|greater|less|any other operator": <target value>
}
```

When used without a 'where' condition, `count` simply returns the length of an array. With the example resource content from the previous section, the following `count` expression is evaluated to `true` since `stringArray` has three members:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/stringArray[*]"
  },
  "equals": 3
}
```

This behavior also works with nested arrays. For example, the following `count` expression is evaluated to `true` since there there are four array members in the `nestedArray` arrays:

```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/objectArray[*].nestedArray[*]"
  },
  "greaterOrEquals": 4
}
```

The power of `count` is in the `where` condition. When it's specified, Azure Policy enumerates the array members and evaluate each against the condition, counting how many array members evaluated to `true`. Specifically, in each iteration of the `where` condition evaluation, Azure Policy selects a single array member ***i*** and evaluate the resource content against the `where` condition **as if ***i*** is the only member of the array**. Having only one array member available in each iteration provides a way to apply complex conditions on each individual array member.

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
In order to evaluate the `count` expression, Azure Policy evaluates the `where` condition 3 times, once for each member of `stringArray`, counting how many times it was evaluated to `true`. When the `where` condition refers the the `Microsoft.Test/resourceType/stringArray[*]` array members, instead of selecting all the members of `stringArray`, it will only select a single array member every time:

| Iteration | Selected `Microsoft.Test/resourceType/stringArray[*]` values | `where` Evaluation result |
|:---|:---|:---|
| 1 | `"a"` | `true` |
| 2 | `"b"` | `false` |
| 3 | `"c"` | `false` |

And thus the `count` will return `1`.

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
1 | `Microsoft.Test/resourceType/objectArray[*].property` => `"value1"` </br> `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `1`, `2` | `false` |
2 | `Microsoft.Test/resourceType/objectArray[*].property` => `"value2"` </br> `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `3`, `4`| `true` |

And thus the `count` returns `1`.

The fact that the `where` expression is evaluated against the **entire** request content (with changes only to the array member that is currently being enumerated) means that the `where` condition can also refer to fields outside the array:
```json
{
  "count": {
    "field": "Microsoft.Test/resourceType/objectArray[*]",
    "where": {
      "field": "tags.env",
      "equals": "prod"
    }
  }
}
```

| Iteration | Selected values | `where` Evaluation result |
|:---|:---|:---|
| 1 | `tags.env` => `"prod"` | `true` |
| 2 | `tags.env` => `"prod"` | `true` |

Nested count expressions are also allowed:
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
          "count": {
            "field": "Microsoft.Test/resourceType/objectArray[*].nestedArray[*]",
            "where": {
              "field": "Microsoft.Test/resourceType/objectArray[*].nestedArray[*]",
              "equals": 3
            },
            "greater": 0
          }
        }
      ]
    }
  }
}
```
 
| Outer Loop Iteration | Selected values | Inner Loop Iteration | Selected values |
|:---|:---|:---|:---|
| 1 | `Microsoft.Test/resourceType/objectArray[*].property` => `"value1`</br> `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `1`, `2` | 1 | `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `1` |
| 1 | `Microsoft.Test/resourceType/objectArray[*].property` => `"value1`</br> `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `1`, `2` | 2 | `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `2` |
| 2 | `Microsoft.Test/resourceType/objectArray[*].property` => `"value2`</br> `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `3`, `4` | 1 | `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `3` |
| 2 | `Microsoft.Test/resourceType/objectArray[*].property` => `"value2`</br> `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `3`, `4` | 2 | `Microsoft.Test/resourceType/objectArray[*].nestedArray[*]` => `4` |

### The `field()` function inside `where` conditions

The way `field()` functions behave when inside a `where` condition is based on the following concepts:
1. Array aliases are resolved into a collection of values selected from all array members.
1. `field()` functions referencing array aliases return an array with the selected values.
1. Referencing the counted array alias inside the `where` condition returns a collection with a single value selected from the array member that is evaluated in the current iteration.

This behavior means that when referring to the counted array member with a `field()` function inside the `where` condition, **it returns an array with a single member**. While this may not be intuitive, it's consistent with the idea that array aliases always return a collection of selected properties. Here's an example:

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

Therefore, when there's a need to access the value of the counted array alias with a `field()` function, the way to do so is to wrap the it with a `first()` template function:

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

For useful examples, see [Count examples](../concepts/definition-structure.md#count-examples).

## Modifying arrays

The [append](../concepts/effects.md#append) and [modify](../concepts/effects.md#modify) alter properties on a resource during creation or update. When working with array properties, the behavior of these effects depends on whether the operation is trying to modify the  **\[\*\]** alias or not:

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

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [remediate non-compliant resources](remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
