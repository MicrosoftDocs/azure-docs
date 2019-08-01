---
title: Author policies for array properties on Azure resources
description: Learn to create array parameters, create rules for array language expressions, evaluate the [*] alias, and to append elements to an existing array with Azure Policy definition rules.
author: DCtheGeek
ms.author: dacoulte
ms.date: 03/06/2019
ms.topic: conceptual
ms.service: azure-policy
manager: carmonm
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
  alias](../concepts/definition-structure.md#understanding-the--alias) to evaluate specific
  scenarios such as **None**, **Any**, or **All**
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
  [az policy assignment create](/cli/azure/policy/assignment?view=azure-cli-latest#az-policy-assignment-create)
  with parameter **params**
- Azure PowerShell: Cmdlet [New-AzPolicyAssignment](/powershell/module/az.resources/New-Azpolicyassignment)
  with parameter **PolicyParameter**
- REST API: In the _PUT_ [create](/rest/api/resources/policyassignments/create) operation as part of
  the Request Body as the value of the **properties.parameters** property

## Policy rules and arrays

### Array conditions

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

### Evaluating the [*] alias

Aliases that have **[\*]** attached to their name indicate the **type** is an _array_. Instead of
evaluating the value of the entire array, **[\*]** makes it possible to evaluate each element of the
array. There are three scenarios this per item evaluation is useful in: None, Any, and All.

The policy engine triggers the **effect** in **then** only when the **if** rule evaluates as true.
This fact is important to understand in context of the way **[\*]** evaluates each individual
element of the array.

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

For each condition example below, replace `<field>` with `"field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].value"`.

The following outcomes are the result of the combination of the condition and the example policy
rule and array of existing values above:

|Condition |Outcome |Explanation |
|-|-|-|
|`{<field>,"notEquals":"127.0.0.1"}` |Nothing |One array element evaluates as false (127.0.0.1 != 127.0.0.1) and one as true (127.0.0.1 != 192.168.1.1), so the **notEquals** condition is _false_ and the effect isn't triggered. |
|`{<field>,"notEquals":"10.0.4.1"}` |Policy effect |Both array elements evaluate as true (10.0.4.1 != 127.0.0.1 and 10.0.4.1 != 192.168.1.1), so the **notEquals** condition is _true_ and the effect is triggered. |
|`"not":{<field>,"Equals":"127.0.0.1"}` |Policy effect |One array element evaluates as true (127.0.0.1 == 127.0.0.1) and one as false (127.0.0.1 == 192.168.1.1), so the **Equals** condition is _false_. The logical operator evaluates as true (**not** _false_), so the effect is triggered. |
|`"not":{<field>,"Equals":"10.0.4.1"}` |Policy effect |Both array elements evaluate as false (10.0.4.1 == 127.0.0.1 and 10.0.4.1 == 192.168.1.1), so the **Equals** condition is _false_. The logical operator evaluates as true (**not** _false_), so the effect is triggered. |
|`"not":{<field>,"notEquals":"127.0.0.1" }` |Policy effect |One array element evaluates as false (127.0.0.1 != 127.0.0.1) and one as true (127.0.0.1 != 192.168.1.1), so the **notEquals** condition is _false_. The logical operator evaluates as true (**not** _false_), so the effect is triggered. |
|`"not":{<field>,"notEquals":"10.0.4.1"}` |Nothing |Both array elements evaluate as true (10.0.4.1 != 127.0.0.1 and 10.0.4.1 != 192.168.1.1), so the **notEquals** condition is _true_. The logical operator evaluates as false (**not** _true_), so the effect isn't triggered. |
|`{<field>,"Equals":"127.0.0.1"}` |Nothing |One array element evaluates as true (127.0.0.1 == 127.0.0.1) and one as false (127.0.0.1 == 192.168.1.1), so the **Equals** condition is _false_ and the effect isn't triggered. |
|`{<field>,"Equals":"10.0.4.1"}` |Nothing |Both array elements evaluate as false (10.0.4.1 == 127.0.0.1 and 10.0.4.1 == 192.168.1.1), so the **Equals** condition is _false_ and the effect isn't triggered. |

## The append effect and arrays

The [append effect](../concepts/effects.md#append) behaves differently depending on if the
**details.field** is a **[\*]** alias or not.

- When not a **[\*]** alias, append replaces the entire array with the **value** property
- When a **[\*]** alias, append adds the **value** property to the existing array or creates the new
  array

For more information, see the [append examples](../concepts/effects.md#append-examples).

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [remediate non-compliant resources](remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).