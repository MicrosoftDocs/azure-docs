---
title: Azure Policy definitions modify effect
description: Azure Policy definitions modify effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions modify effect

The `modify` effect is used to add, update, or remove properties or tags on a subscription or resource during creation or update. A common example is updating tags on resources such as costCenter. Existing non-compliant resources can be remediated with a [remediation task](../how-to/remediate-resources.md). A single Modify rule can have any number of operations. Policy assignments with effect set as Modify require a [managed identity](../how-to/remediate-resources.md) to do remediation.

The `modify` effect supports the following operations:

- Add, replace, or remove resource tags. For tags, a Modify policy should have [mode](./definition-structure.md#resource-manager-modes) set to `indexed` unless the target resource is a resource group.
- Add or replace the value of managed identity type (`identity.type`) of virtual machines and Virtual Machine Scale Sets. You can only modify the `identity.type` for virtual machines or Virtual Machine Scale Sets.
- Add or replace the values of certain aliases.
  - Use `Get-AzPolicyAlias | Select-Object -ExpandProperty 'Aliases' | Where-Object { $_.DefaultMetadata.Attributes -eq 'Modifiable' }` in Azure PowerShell **4.6.0** or higher to get a list of aliases that can be used with `modify`.

> [!IMPORTANT]
> If you're managing tags, it's recommended to use Modify instead of Append as Modify provides
> more operation types and the ability to remediate existing resources. However, Append is
> recommended if you aren't able to create a managed identity or Modify doesn't yet support the
> alias for the resource property.

## Modify evaluation

Modify evaluates before the request gets processed by a Resource Provider during the creation or updating of a resource. The `modify` operations are applied to the request content when the `if` condition of the policy rule is met. Each `modify` operation can specify a condition that determines when it's applied. Operations with _false_ condition evaluations are skipped.

When an alias is specified, the more checks are performed to ensure that the `modify` operation doesn't change the request content in a way that causes the resource provider to reject it:

- The property the alias maps to is marked as **Modifiable** in the request's API version.
- The token type in the `modify` operation matches the expected token type for the property in the request's API version.

If either of these checks fail, the policy evaluation falls back to the specified `conflictEffect`.

> [!IMPORTANT]
> It's recommended that Modify definitions that include aliases use the _audit_ **conflict effect**
> to avoid failing requests using API versions where the mapped property isn't 'Modifiable'. If the
> same alias behaves differently between API versions, conditional modify operations can be used to
> determine the `modify` operation used for each API version.

When a policy definition using the `modify` effect is run as part of an evaluation cycle, it doesn't make changes to resources that already exist. Instead, it marks any resource that meets the `if` condition as non-compliant.

## Modify properties

The `details` property of the `modify` effect has all the subproperties that define the permissions needed for remediation and the `operations` used to add, update, or remove tag values.

- `roleDefinitionIds` (required)
  - This property must include an array of strings that match role-based access control role ID accessible by the subscription. For more information, see [remediation - configure the policy definition](../how-to/remediate-resources.md#configure-the-policy-definition).
  - The role defined must include all operations granted to the [Contributor](../../../role-based-access-control/built-in-roles.md#contributor) role.
- `conflictEffect` (optional)
  - Determines which policy definition "wins" if more than one policy definition modifies the same
    property or when the `modify` operation doesn't work on the specified alias.
    - For new or updated resources, the policy definition with _deny_ takes precedence. Policy definitions with _audit_ skip all `operations`. If more than one policy definition has the effect _deny_, the request is denied as a conflict. If all policy definitions have _audit_, then none of the `operations` of the conflicting policy definitions are processed.
    - For existing resources, if more than one policy definition has the effect _deny_, the compliance status is _Conflict_. If one or fewer policy definitions have the effect _deny_, each assignment returns a compliance status of _Non-compliant_.
  - Available values: _audit_, _deny_, _disabled_.
  - Default value is _deny_.
- `operations` (required)
  - An array of all tag operations to be completed on matching resources.
  - Properties:
    - `operation` (required)
      - Defines what action to take on a matching resource. Options are: _addOrReplace_, _Add_, _Remove_. _Add_ behaves similar to the [append](./effect-append.md) effect.
    - `field` (required)
      - The tag to add, replace, or remove. Tag names must adhere to the same naming convention for other [fields](./definition-structure-policy-rule.md#fields).
    - `value` (optional)
      - The value to set the tag to.
      - This property is required if `operation` is _addOrReplace_ or _Add_.
    - `condition` (optional)
      - A string containing an Azure Policy language expression with [Policy functions](./definition-structure.md#policy-functions) that evaluates to _true_ or _false_.
      - Doesn't support the following Policy functions: `field()`, `resourceGroup()`,
        `subscription()`.

## Modify operations

The `operations` property array makes it possible to alter several tags in different ways from a single policy definition. Each operation is made up of `operation`, `field`, and `value` properties. The `operation` determines what the remediation task does to the tags, `field` determines which tag is altered, and `value` defines the new setting for that tag. The following example makes the following tag changes:

- Sets the `environment` tag to "Test" even if it already exists with a different value.
- Removes the tag `TempResource`.
- Sets the `Dept` tag to the policy parameter _DeptName_ configured on the policy assignment.

```json
"details": {
  ...
  "operations": [
    {
      "operation": "addOrReplace",
      "field": "tags['environment']",
      "value": "Test"
    },
    {
      "operation": "Remove",
      "field": "tags['TempResource']",
    },
    {
      "operation": "addOrReplace",
      "field": "tags['Dept']",
      "value": "[parameters('DeptName')]"
    }
  ]
}
```

The `operation` property has the following options:

|Operation |Description |
|-|-|
| `addOrReplace` | Adds the defined property or tag and value to the resource, even if the property or tag already exists with a different value. |
| `add` | Adds the defined property or tag and value to the resource. |
| `remove` | Removes the defined property or tag from the resource. |

## Modify examples

Example 1: Add the `environment` tag and replace existing `environment` tags with "Test":

```json
"then": {
  "effect": "modify",
  "details": {
    "roleDefinitionIds": [
      "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
    ],
    "operations": [
      {
        "operation": "addOrReplace",
        "field": "tags['environment']",
        "value": "Test"
      }
    ]
  }
}
```

Example 2: Remove the `env` tag and add the `environment` tag or replace existing `environment` tags with a parameterized value:

```json
"then": {
  "effect": "modify",
  "details": {
    "roleDefinitionIds": [
      "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
    ],
    "conflictEffect": "deny",
    "operations": [
      {
        "operation": "Remove",
        "field": "tags['env']"
      },
      {
        "operation": "addOrReplace",
        "field": "tags['environment']",
        "value": "[parameters('tagValue')]"
      }
    ]
  }
}
```

Example 3: Ensure that a storage account doesn't allow blob public access, the `modify` operation is applied only when evaluating requests with API version greater or equals to `2019-04-01`:

```json
"then": {
  "effect": "modify",
  "details": {
    "roleDefinitionIds": [
      "/providers/microsoft.authorization/roleDefinitions/17d1049b-9a84-46fb-8f53-869881c3d3ab"
    ],
    "conflictEffect": "audit",
    "operations": [
      {
        "condition": "[greaterOrEquals(requestContext().apiVersion, '2019-04-01')]",
        "operation": "addOrReplace",
        "field": "Microsoft.Storage/storageAccounts/allowBlobPublicAccess",
        "value": false
      }
    ]
  }
}
```

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
