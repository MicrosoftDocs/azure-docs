---
title: Details of the policy definition structure policy rules
description: Describes how policy definition policy rules are used to establish conventions for Azure resources in your organization.
ms.date: 04/25/2024
ms.topic: conceptual
---

# Azure Policy definition structure policy rule

The policy rule consists of `if` and `then` blocks. In the `if` block, you define one or more conditions that specify when the policy is enforced. You can apply logical operators to these conditions to precisely define the scenario for a policy.

For complete details on each effect, order of evaluation, properties, and examples, see [Azure Policy definitions effect basics](effect-basics.md).

In the `then` block, you define the effect that happens when the `if` conditions are fulfilled.

```json
{
  "if": {
      <condition> | <logical operator>
  },
  "then": {
    "effect": "deny | audit | modify | denyAction | append | auditIfNotExists | deployIfNotExists | disabled"
  }
}
```

For more information about _policyRule_, go to the [policy definition schema](https://schema.management.azure.com/schemas/2020-10-01/policyDefinition.json).

## Logical operators

Supported logical operators are:

- `"not": {condition  or operator}`
- `"allOf": [{condition or operator},{condition or operator}]`
- `"anyOf": [{condition or operator},{condition or operator}]`

The `not` syntax inverts the result of the condition. The `allOf` syntax (similar to the logical `and` operation) requires all conditions to be true. The `anyOf` syntax (similar to the logical `or` operation) requires one or more conditions to be true.

You can nest logical operators. The following example shows a `not` operation that is nested within an `allOf` operation.

```json
"if": {
  "allOf": [
    {
      "not": {
        "field": "tags",
        "containsKey": "application"
      }
    },
    {
      "field": "type",
      "equals": "Microsoft.Storage/storageAccounts"
    }
  ]
},
```

## Conditions

A condition evaluates whether a value meets certain criteria. The supported conditions are:

- `"equals": "stringValue"`
- `"notEquals": "stringValue"`
- `"like": "stringValue"`
- `"notLike": "stringValue"`
- `"match": "stringValue"`
- `"matchInsensitively": "stringValue"`
- `"notMatch": "stringValue"`
- `"notMatchInsensitively": "stringValue"`
- `"contains": "stringValue"`
- `"notContains": "stringValue"`
- `"in": ["stringValue1","stringValue2"]`
- `"notIn": ["stringValue1","stringValue2"]`
- `"containsKey": "keyName"`
- `"notContainsKey": "keyName"`
- `"less": "dateValue"` | `"less": "stringValue"` | `"less": intValue`
- `"lessOrEquals": "dateValue"` | `"lessOrEquals": "stringValue"` | `"lessOrEquals": intValue`
- `"greater": "dateValue"` | `"greater": "stringValue"` | `"greater": intValue`
- `"greaterOrEquals": "dateValue"` | `"greaterOrEquals": "stringValue"` |
  `"greaterOrEquals": intValue`
- `"exists": "bool"`

For `less`, `lessOrEquals`, `greater`, and `greaterOrEquals`, if the property type doesn't match the condition type, an error is thrown. String comparisons are made using `InvariantCultureIgnoreCase`.

When using the `like` and `notLike` conditions, you provide a wildcard character (`*`) in the value. The value shouldn't have more than one wildcard character.

When using the `match` and `notMatch` conditions, provide a hashtag (`#`) to match a digit, question mark (`?`) for a letter, and a dot  (`.`) to match any character, and any other character to match that actual character. While `match` and `notMatch` are case-sensitive, all other conditions that evaluate a `stringValue` are case-insensitive. Case-insensitive alternatives are available in `matchInsensitively` and `notMatchInsensitively`.

## Fields

Conditions that evaluate whether the values of properties in the resource request payload meet certain criteria can be formed using a `field` expression. The following fields are supported:

- `name`
- `fullName`
  - Returns the full name of the resource. The full name of a resource is the resource name prepended by any parent resource names (for example `myServer/myDatabase`).
- `kind`
- `type`
- `location`
  - Location fields are normalized to support various formats. For example, `East US 2` is considered equal to `eastus2`.
  - Use **global** for resources that are location agnostic.
- `id`
  - Returns the resource ID of the resource that is being evaluated.
  - Example: `/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/myRG/providers/Microsoft.KeyVault/vaults/myVault`
- `identity.type`
  - Returns the type of
    [managed identity](../../../active-directory/managed-identities-azure-resources/overview.md)
    enabled on the resource.
- `tags`
- `tags['<tagName>']`
  - This bracket syntax supports tag names that have punctuation such as a hyphen, period, or space.
  - Where `tagName` is the name of the tag to validate the condition for.
  - Examples: `tags['Acct.CostCenter']` where `Acct.CostCenter` is the name of the tag.
- `tags['''<tagName>''']`
  - This bracket syntax supports tag names that have apostrophes in it by escaping with double apostrophes.
  - Where `tagName` is the name of the tag to validate the condition for.
  - Example: `tags['''My.Apostrophe.Tag''']` where `'My.Apostrophe.Tag'` is the name of the tag.

  > [!NOTE]
  > `tags.<tagName>`, `tags[tagName]`, and `tags[tag.with.dots]` are still acceptable ways of
  > declaring a tags field. However, the preferred expressions are those listed above.
- property aliases - for a list, see [Aliases](./definition-structure-alias.md).
  > [!NOTE]
  > In `field` expressions referring to array alias `[*]` each element in the array is evaluated
  > individually with logical `and` between elements. For more information, see
  > [Referencing array resource properties](../how-to/author-policies-for-arrays.md#referencing-array-resource-properties).


Conditions that use `field` expressions can replace the legacy policy definition syntax `"source": "action"`, which used to work for write operations. For example, this is no longer supported:

```json
{
  "source": "action",
  "like": "Microsoft.Network/publicIPAddresses/*"
}
```

But the desired behavior can be achieved using `field` logic:
```json
{
  "field": "type",
  "equals": "Microsoft.Network/publicIPAddresses"
}
```

### Use tags with parameters

A parameter value can be passed to a tag field. Passing a parameter to a tag field increases the flexibility of the policy definition during policy assignment.

In the following example, `concat` is used to create a tags field lookup for the tag named the value of the `tagName` parameter. If that tag doesn't exist, the `modify` effect is used to add the tag using the value of the same named tag set on the audited resources parent resource group by using the `resourcegroup()` lookup function.

```json
{
  "if": {
    "field": "[concat('tags[', parameters('tagName'), ']')]",
    "exists": "false"
  },
  "then": {
    "effect": "modify",
    "details": {
      "operations": [
        {
          "operation": "add",
          "field": "[concat('tags[', parameters('tagName'), ']')]",
          "value": "[resourcegroup().tags[parameters('tagName')]]"
        }
      ],
      "roleDefinitionIds": [
        "/providers/microsoft.authorization/roleDefinitions/4a9ae827-6dc8-4573-8ac7-8239d42aa03f"
      ]
    }
  }
}
```

## Value

Conditions that evaluate whether a value meets certain criteria can be formed using a `value` expression. Values can be literals, the values of [parameters](./definition-structure-parameters.md), or the returned values of any [supported template functions](#policy-functions).

> [!WARNING]
> If the result of a _template function_ is an error, policy evaluation fails. A failed evaluation
> is an implicit `deny`. For more information, see
> [avoiding template failures](#avoiding-template-failures). Use
> [enforcementMode](./assignment-structure.md#enforcement-mode) of `doNotEnforce` to prevent
> impact of a failed evaluation on new or updated resources while testing and validating a new
> policy definition.

### Value examples

This policy rule example uses `value` to compare the result of the `resourceGroup()` function and the returned `name` property to a `like` condition of `*netrg`. The rule denies any resource not of the `Microsoft.Network/*` `type` in any resource group whose name ends in `*netrg`.

```json
{
  "if": {
    "allOf": [
      {
        "value": "[resourceGroup().name]",
        "like": "*netrg"
      },
      {
        "field": "type",
        "notLike": "Microsoft.Network/*"
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
```

This policy rule example uses `value` to check if the result of multiple nested functions `equals` `true`. The rule denies any resource that doesn't have at least three tags.

```json
{
  "mode": "indexed",
  "policyRule": {
    "if": {
      "value": "[less(length(field('tags')), 3)]",
      "equals": "true"
    },
    "then": {
      "effect": "deny"
    }
  }
}
```

### Avoiding template failures

The use of _template functions_ in `value` allows for many complex nested functions. If the result of a _template function_ is an error, policy evaluation fails. A failed evaluation is an implicit `deny`. An example of a `value` that fails in certain scenarios:

```json
{
  "policyRule": {
    "if": {
      "value": "[substring(field('name'), 0, 3)]",
      "equals": "abc"
    },
    "then": {
      "effect": "audit"
    }
  }
}
```

The example policy rule above uses [substring()](../../../azure-resource-manager/templates/template-functions-string.md#substring) to compare the first three characters of `name` to `abc`. If `name` is shorter than three characters, the `substring()` function results in an error. This error causes the policy to become a `deny` effect.

Instead, use the [if()](../../../azure-resource-manager/templates/template-functions-logical.md#if) function to check if the first three characters of `name` equal `abc` without allowing a `name` shorter than three characters to cause an error:

```json
{
  "policyRule": {
    "if": {
      "value": "[if(greaterOrEquals(length(field('name')), 3), substring(field('name'), 0, 3), 'not starting with abc')]",
      "equals": "abc"
    },
    "then": {
      "effect": "audit"
    }
  }
}
```

With the revised policy rule, `if()` checks the length of `name` before trying to get a `substring()` on a value with fewer than three characters. If `name` is too short, the value "not starting with abc" is returned instead and compared to `abc`. A resource with a short name that doesn't begin with `abc` still fails the policy rule, but no longer causes an error during evaluation.

## Count

Conditions that count how many members of an array meet certain criteria can be formed using a `count` expression. Common scenarios are checking whether 'at least one of', 'exactly one of', 'all of', or 'none of' the array members satisfy a condition. The `count` evaluates each array member for a condition expression and sums the _true_ results, which is then compared to the expression operator.

### Field count

Count how many members of an array in the request payload satisfy a condition expression. The structure of `field count` expressions is:

```json
{
  "count": {
    "field": "<[*] alias>",
    "where": {
      /* condition expression */
    }
  },
  "<condition>": "<compare the count of true condition expression array members to this value>"
}
```

The following properties are used with `field count`:

- `count.field` (required): Contains the path to the array and must be an array alias.
- `count.where` (optional): The condition expression to individually evaluate for each [array alias](./definition-structure-alias.md#understanding-the-array-alias) array member of `count.field`. If this property isn't provided, all array members with the path of 'field' are evaluated to _true_. Any [condition](#conditions) can be used inside this property. [Logical operators](#logical-operators) can be used inside this property to create complex evaluation requirements.
- `condition` (required): The value is compared to the number of items that met the
  `count.where` condition expression. A numeric [condition](#conditions) should be used.

For more details on how to work with array properties in Azure Policy, including detailed explanation on how the `field count` expression is evaluated, see [Referencing array resource properties](../how-to/author-policies-for-arrays.md#referencing-array-resource-properties).

### Value count

Count how many members of an array satisfy a condition. The array can be a literal array or a [reference to array parameter](./definition-structure-parameters.md#using-a-parameter-value). The structure of `value count` expressions is:

```json
{
  "count": {
    "value": "<literal array | array parameter reference>",
    "name": "<index name>",
    "where": {
      /* condition expression */
    }
  },
  "<condition>": "<compare the count of true condition expression array members to this value>"
}
```

The following properties are used with `value count`:

- `count.value` (required): The array to evaluate.
- `count.name` (required): The index name, composed of English letters and digits. Defines a name for the value of the array member evaluated in the current iteration. The name is used for referencing the current value inside the `count.where` condition. Optional when the `count` expression isn't in a child of another `count` expression. When not provided, the index name is  implicitly set to `"default"`.
- `count.where` (optional): The condition expression to individually evaluate for each array member of `count.value`. If this property isn't provided, all array members are evaluated to _true_. Any [condition](#conditions) can be used inside this  property. [Logical operators](#logical-operators) can be used inside this property to create complex evaluation requirements. The value of the currently enumerated array member can be accessed by calling the [current](#the-current-function) function.
- `condition` (required): The value is compared to the number of items that met the `count.where` condition expression. A numeric [condition](#conditions) should be used.

### The current function

The `current()` function is only available inside the `count.where` condition. It returns the value of the array member that is currently enumerated by the `count` expression evaluation.

**Value count usage**

- `current(<index name defined in count.name>)`. For example: `current('arrayMember')`.
- `current()`. Allowed only when the `value count` expression isn't a child of another `count` expression. Returns the same value as above.

If the value returned by the call is an object, property accessors are supported. For example: `current('objectArrayMember').property`.

**Field count usage**

- `current(<the array alias defined in count.field>)`. For example,
  `current('Microsoft.Test/resource/enumeratedArray[*]')`.
- `current()`. Allowed only when the `field count` expression isn't a child of another `count` expression. Returns the same value as above.
- `current(<alias of a property of the array member>)`. For example,
  `current('Microsoft.Test/resource/enumeratedArray[*].property')`.

### Field count examples

Example 1: Check if an array is empty

```json
{
  "count": {
    "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]"
  },
  "equals": 0
}
```

Example 2: Check for only one array member to meet the condition expression

```json
{
  "count": {
    "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
    "where": {
      "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].description",
      "equals": "My unique description"
    }
  },
  "equals": 1
}
```

Example 3: Check for at least one array member to meet the condition expression

```json
{
  "count": {
    "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
    "where": {
      "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].description",
      "equals": "My common description"
    }
  },
  "greaterOrEquals": 1
}
```

Example 4: Check that all object array members meet the condition expression

```json
{
  "count": {
    "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
    "where": {
      "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].description",
      "equals": "description"
    }
  },
  "equals": "[length(field('Microsoft.Network/networkSecurityGroups/securityRules[*]'))]"
}
```

Example 5: Check that at least one array member matches multiple properties in the condition expression

```json
{
  "count": {
    "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
    "where": {
      "allOf": [
        {
          "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].direction",
          "equals": "Inbound"
        },
        {
          "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].access",
          "equals": "Allow"
        },
        {
          "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].destinationPortRange",
          "equals": "3389"
        }
      ]
    }
  },
  "greater": 0
}
```

Example 6: Use `current()` function inside the `where` conditions to access the value of the currently enumerated array member in a template function. This condition checks whether a virtual network contains an address prefix that isn't under the 10.0.0.0/24 CIDR range.

```json
{
  "count": {
    "field": "Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]",
    "where": {
      "value": "[ipRangeContains('10.0.0.0/24', current('Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]'))]",
      "equals": false
    }
  },
  "greater": 0
}
```

Example 7: Use `field()` function inside the `where` conditions to access the value of the currently enumerated array member. This condition checks whether a virtual network contains an address prefix that isn't under the 10.0.0.0/24 CIDR range.

```json
{
  "count": {
    "field": "Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]",
    "where": {
      "value": "[ipRangeContains('10.0.0.0/24', first(field(('Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]')))]",
      "equals": false
    }
  },
  "greater": 0
}
```

### Value count examples

Example 1: Check if resource name matches any of the given name patterns.

```json
{
  "count": {
    "value": [
      "prefix1_*",
      "prefix2_*"
    ],
    "name": "pattern",
    "where": {
      "field": "name",
      "like": "[current('pattern')]"
    }
  },
  "greater": 0
}
```

Example 2: Check if resource name matches any of the given name patterns. The `current()` function doesn't specify an index name. The outcome is the same as the previous example.

```json
{
  "count": {
    "value": [
      "prefix1_*",
      "prefix2_*"
    ],
    "where": {
      "field": "name",
      "like": "[current()]"
    }
  },
  "greater": 0
}
```

Example 3: Check if resource name matches any of the given name patterns provided by an array parameter.

```json
{
  "count": {
    "value": "[parameters('namePatterns')]",
    "name": "pattern",
    "where": {
      "field": "name",
      "like": "[current('pattern')]"
    }
  },
  "greater": 0
}
```

Example 4: Check if any of the virtual network address prefixes isn't under the list of approved prefixes.

```json
{
  "count": {
    "field": "Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]",
    "where": {
      "count": {
        "value": "[parameters('approvedPrefixes')]",
        "name": "approvedPrefix",
        "where": {
          "value": "[ipRangeContains(current('approvedPrefix'), current('Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]'))]",
          "equals": true
        },
      },
      "equals": 0
    }
  },
  "greater": 0
}
```

Example 5: Check that all the reserved NSG rules are defined in an NSG. The properties of the reserved NSG rules are defined in an array parameter containing objects.

Parameter value:

```json
[
  {
    "priority": 101,
    "access": "deny",
    "direction": "inbound",
    "destinationPortRange": 22
  },
  {
    "priority": 102,
    "access": "deny",
    "direction": "inbound",
    "destinationPortRange": 3389
  }
]
```

Policy:

```json
{
  "count": {
    "value": "[parameters('reservedNsgRules')]",
    "name": "reservedNsgRule",
    "where": {
      "count": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
        "where": {
          "allOf": [
            {
              "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].priority",
              "equals": "[current('reservedNsgRule').priority]"
            },
            {
              "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].access",
              "equals": "[current('reservedNsgRule').access]"
            },
            {
              "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].direction",
              "equals": "[current('reservedNsgRule').direction]"
            },
            {
              "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].destinationPortRange",
              "equals": "[current('reservedNsgRule').destinationPortRange]"
            }
          ]
        }
      },
      "equals": 1
    }
  },
  "equals": "[length(parameters('reservedNsgRules'))]"
}
```

## Policy functions

Functions can be used to introduce additional logic into a policy rule. They are resolved within the policy rule of a policy definition and within [parameter values assigned to policy definitions in an initiative](initiative-definition-structure.md#passing-a-parameter-value-to-a-policy-definition).

All [Resource Manager template functions](../../../azure-resource-manager/templates/template-functions.md) are available to use within a policy rule, except the following functions and user-defined functions:

- `copyIndex()`
- `dateTimeAdd()`
- `dateTimeFromEpoch`
- `dateTimeToEpoch`
- `deployment()`
- `environment()`
- `extensionResourceId()`
- `lambda()` For more information, go to [lambda](../../../azure-resource-manager/templates/template-functions-lambda.md)
- `listAccountSas()`
- `listKeys()`
- `listSecrets()`
- `list*`
- `managementGroup()`
- `newGuid()`
- `pickZones()`
- `providers()`
- `reference()`
- `resourceId()`
- `subscriptionResourceId()`
- `tenantResourceId()`
- `tenant()`
- `variables()`

> [!NOTE]
> These functions are still available within the `details.deployment.properties.template` portion of
> the template deployment in a `deployIfNotExists` policy definition.

The following function is available to use in a policy rule, but differs from use in an Azure Resource Manager template (ARM template):

- `utcNow()` - Unlike an ARM template, this property can be used outside _defaultValue_.
  - Returns a string that is set to the current date and time in Universal ISO 8601 DateTime format `yyyy-MM-ddTHH:mm:ss.fffffffZ`.

The following functions are only available in policy rules:

- `addDays(dateTime, numberOfDaysToAdd)`
  - `dateTime`: [Required] string - String in the Universal ISO 8601 DateTime format 'yyyy-MM-ddTHH:mm:ss.FFFFFFFZ'
  - `numberOfDaysToAdd`: [Required] integer - Number of days to add

- `field(fieldName)`
  - `fieldName`: [Required] string - Name of the [field](./definition-structure-policy-rule.md#fields) to retrieve
  - Returns the value of that field from the resource that is being evaluated by the If condition.
  - `field` is primarily used with `auditIfNotExists` and `deployIfNotExists` to reference fields on the resource that are being evaluated. An example of this use can be seen in the [DeployIfNotExists example](effects.md#deployifnotexists-example).

- `requestContext().apiVersion`
  - Returns the API version of the request that triggered policy evaluation (example: `2021-09-01`). This value is the API version that was used in the PUT/PATCH request for evaluations on resource creation/update. The latest API version is always used during compliance evaluation on existing resources.

- `policy()`
  - Returns the following information about the policy that is being evaluated. Properties can be accessed from the returned object (example: `[policy().assignmentId]`).

    ```json
    {
      "assignmentId": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/policyAssignments/myAssignment",
      "definitionId": "/providers/Microsoft.Authorization/policyDefinitions/34c877ad-507e-4c82-993e-3452a6e0ad3c",
      "setDefinitionId": "/providers/Microsoft.Authorization/policySetDefinitions/42a694ed-f65e-42b2-aa9e-8052e9740a92",
      "definitionReferenceId": "StorageAccountNetworkACLs"
    }
    ```

- `ipRangeContains(range, targetRange)`
  - `range`: [Required] string - String specifying a range of IP addresses to check if the _targetRange_ is within.
  - `targetRange`: [Required] string - String specifying a range of IP addresses to validate as included within the _range_.
  - Returns a _boolean_ for whether the _range_ IP address range contains the _targetRange_ IP address range. Empty ranges, or mixing between IP families isn't allowed and results in evaluation failure.

  Supported formats:
  - Single IP address (examples: `10.0.0.0`, `2001:0DB8::3:FFFE`)
  - CIDR range (examples: `10.0.0.0/24`, `2001:0DB8::/110`)
  - Range defined by start and end IP addresses (examples: `192.168.0.1-192.168.0.9`, `2001:0DB8::-2001:0DB8::3:FFFF`)

- `current(indexName)`
  - Special function that may only be used inside [count expressions](./definition-structure-policy-rule.md#count).

### Policy function example

This policy rule example uses the `resourceGroup` resource function to get the `name` property, combined with the `concat` array and object function to build a `like` condition that enforces the resource name to start with the resource group name.

```json
{
  "if": {
    "not": {
      "field": "name",
      "like": "[concat(resourceGroup().name,'*')]"
    }
  },
  "then": {
    "effect": "deny"
  }
}
```

## Policy rule limits

### Limits enforced during authoring

Limits to the structure of policy rules are enforced during the authoring or assignment of a policy. Attempts to create or assign policy definitions that exceed these limits will fail.

| Limit | Value | Additional details |
|:---|:---|:---|
| Condition expressions in the `if` condition | 4096 | |
| Condition expressions in the `then` block | 128 | Applies to the `existenceCondition` of `auditIfNotExists` and `deployIfNotExists` policies |
| Policy functions per policy rule | 2048 | |
| Policy function number of parameters | 128 | Example: `[function('parameter1', 'parameter2', ...)]` |
| Nested policy functions depth | 64 | Example: `[function(nested1(nested2(...)))]` |
| Policy functions expression string length | 81920 | Example: the length of `"[function(....)]"` |
| `Field count` expressions per array | 5 | |
| `Value count` expressions per policy rule | 10 | |
| `Value count` expression iteration count | 100 | For nested `Value count` expressions, this also includes the iteration count of the parent expression |

### Limits enforced during evaluation

Limits to the size of objects that are processed by policy functions during policy evaluation. These limits can't always be enforced during authoring since they depend on the evaluated content. For example:

```json
{
  "field": "name",
  "equals": "[concat(field('stringPropertyA'), field('stringPropertyB'))]"
}
```

The length of the string created by the `concat()` function depends on the value of properties in the evaluated resource.

| Limit | Value | Example |
|:---|:---|:---|
| Length of string returned by a function | 131072 | `[concat(field('longString1'), field('longString2'))]`|
| Depth of complex objects provided as a parameter to, or returned by a function | 128 | `[union(field('largeObject1'), field('largeObject2'))]` |
| Number of nodes of complex objects provided as a parameter to, or returned by a function | 32768 | `[concat(field('largeArray1'), field('largeArray2'))]` |

> [!WARNING]
> Policy that exceed the above limits during evaluation will effectively become a `deny` policy and can block incoming requests.
> When writing policies with complex functions, be mindful of these limits and test your policies against resources that have the potential to exceed them.

## Next steps

- For more information about policy definition structure, go to [basics](./definition-structure-basics.md), [parameters](./definition-structure-parameters.md), and [alias](./definition-structure-alias.md).
- For initiatives, go to [initiative definition structure](./initiative-definition-structure.md).
- Review examples at [Azure Policy samples](../samples/index.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
