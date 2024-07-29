---
title: Details of the policy definition structure parameters
description: Describes how policy definition parameters are used to establish conventions for Azure resources in your organization.
ms.date: 04/01/2024
ms.topic: conceptual
---

# Azure Policy definition structure parameters

Parameters help simplify your policy management by reducing the number of policy definitions. Think of parameters like the fields on a form: `name`, `address`, `city`, `state`. These parameters always stay the same but their values change based on the individual filling out the form. Parameters work the same way when building policies. By including parameters in a policy definition, you can reuse that policy for different scenarios by using different values.

## Adding or removing parameters

Parameters might be added to an existing and assigned definition. The new parameter must include the `defaultValue` property. This property prevents existing assignments of the policy or initiative from indirectly being made invalid.

Parameters can't be removed from a policy definition because there might be an assignment that sets the parameter value, and that reference would become broken. Some built-in policy definitions deprecate parameters using metadata `"deprecated": true`, which hides the parameter when assigning the definition in Azure portal. While this method isn't supported for custom policy definitions, another option is to duplicate and create a new custom policy definition without the parameter.

## Parameter properties

A parameter uses the following properties in a policy definition:

- `name`: The name of your parameter. Used by the `parameters` deployment function within the policy rule. For more information, see [using a parameter value](#using-a-parameter-value).
- `type`: Determines if the parameter is a `string`, `array`, `object`, `boolean`,  `integer`, `float`, or `dateTime`.
- `metadata`: Defines subproperties primarily used by the Azure portal to display user-friendly information:
  - `description`: The explanation of what the parameter is used for. Can be used to provide examples of acceptable values.
  - `displayName`: The friendly name shown in the portal for the parameter.
  - `strongType`: (Optional) Used when assigning the policy definition through the portal. Provides a context aware list. For more information, see [strongType](#strongtype).
  - `assignPermissions`: (Optional) Set as _true_ to have Azure portal create role assignments during policy assignment. This property is useful in case you wish to assign permissions outside the assignment scope. There's one role assignment per role definition in the policy (or per role definition in all of the initiative's policies). The parameter value must be a valid resource or scope.
  - `deprecated`: A boolean flag to indicate whether a parameter is deprecated in a built-in definition.
- `defaultValue`: (Optional) Sets the value of the parameter in an assignment if no value is given. Required when updating an existing policy definition that is assigned. For oject-type parameters, the value must match the appropriate schema.
- `allowedValues`: (Optional) Provides an array of values that the parameter accepts during assignment.
  - Case sensitivity: Allowed value comparisons are case-sensitive when assigning a policy, meaning that the selected parameter values in the assignment must match the casing of values in the `allowedValues` array in the definition. However, once values are selected for the assignment, evaluation of string comparisons might be case insensitive depending on the [condition](./definition-structure-policy-rule.md#conditions) used. For example, if the parameter specifies `Dev` as an allowed tag value in an assignment, and this value is compared to an input string using the `equals` condition, then Azure Policy would later evaluate a tag value of `dev` as a match even though it's lowercase because `notEquals` is case insensitive.
  - For object-type parameters, the values must match the appropriate schema.
- `schema`: (Optional) Provides validation of parameter inputs during assignment using a self-defined JSON schema. This property is only supported for object-type parameters and follows the [Json.NET Schema](https://www.newtonsoft.com/jsonschema) 2019-09 implementation. You can learn more about using schemas at https://json-schema.org/ and test draft schemas at https://www.jsonschemavalidator.net/.

## Sample parameters

### Example 1

As an example, you could define a policy definition to limit the locations where resources can be deployed. A parameter for that policy definition could be `allowedLocations` and used by each assignment of the policy definition to limit the accepted values. The use of `strongType` provides an enhanced experience when completing the assignment through the portal:

```json
"parameters": {
  "allowedLocations": {
    "type": "array",
    "metadata": {
      "description": "The list of allowed locations for resources.",
      "displayName": "Allowed locations",
      "strongType": "location"
    },
    "defaultValue": [
      "westus2"
    ],
    "allowedValues": [
      "eastus2",
      "westus2",
      "westus"
    ]
  }
}
```

A sample input for this array-type parameter (without `strongType`) at assignment time might be `["westus", "eastus2"]`.

### Example 2

In a more advanced scenario, you could define a policy that requires Kubernetes cluster pods to use specified labels. A parameter for that policy definition could be `labelSelector` and used by each assignment of the policy definition to specify Kubernetes resources in question based on label keys and values:

```json
"parameters": {
  "labelSelector": {
    "type": "Object",
    "metadata": {
      "displayName": "Kubernetes label selector",
      "description": "Label query to select Kubernetes resources for policy evaluation. An empty label selector matches all Kubernetes resources."
    },
    "defaultValue": {},
    "schema": {
      "description": "A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all resources.",
      "type": "object",
      "properties": {
        "matchLabels": {
          "description": "matchLabels is a map of {key,value} pairs.",
          "type": "object",
          "additionalProperties": {
            "type": "string"
          },
          "minProperties": 1
        },
        "matchExpressions": {
          "description": "matchExpressions is a list of values, a key, and an operator.",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "key": {
                "description": "key is the label key that the selector applies to.",
                "type": "string"
              },
              "operator": {
                "description": "operator represents a key's relationship to a set of values.",
                "type": "string",
                "enum": [
                  "In",
                  "NotIn",
                  "Exists",
                  "DoesNotExist"
                ]
              },
              "values": {
                "description": "values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty.",
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": [
              "key",
              "operator"
            ],
            "additionalProperties": false
          },
          "minItems": 1
        }
      },
      "additionalProperties": false
    }
  },
}
```

A sample input for this object-type parameter at assignment time would be in JSON format, validated by the specified schema, and might be:

```json
{
  "matchLabels": {
    "poolID": "abc123",
    "nodeGroup": "Group1",
    "region": "southcentralus"
  },
  "matchExpressions": [
    {
      "key": "name",
      "operator": "In",
      "values": [
        "payroll",
        "web"
      ]
    },
    {
      "key": "environment",
      "operator": "NotIn",
      "values": [
        "dev"
      ]
    }
  ]
}
```

## Using a parameter value

In the policy rule, you reference parameters with the following `parameters` function syntax:

```json
{
  "field": "location",
  "in": "[parameters('allowedLocations')]"
}
```

This sample references the `allowedLocations` parameter that was demonstrated in [parameter properties](#parameter-properties).

## strongType

Within the `metadata` property, you can use `strongType` to provide a multiselect list of options within the Azure portal. `strongType` can be a supported _resource type_ or an allowed value. To determine whether a _resource type_ is valid for `strongType`, use [Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider). The format for a _resource type_ `strongType` is `<Resource Provider>/<Resource Type>`. For example, `Microsoft.Network/virtualNetworks/subnets`.

Some _resource types_ not returned by `Get-AzResourceProvider` are supported. Those types are:

- `Microsoft.RecoveryServices/vaults/backupPolicies`

The non _resource type_ allowed values for `strongType` are:

- `location`
- `resourceTypes`
- `storageSkus`
- `vmSKUs`
- `existingResourceGroups`

## Next steps

- For more information about policy definition structure, go to [basics](./definition-structure-basics.md), [policy rule](./definition-structure-policy-rule.md), and [alias](./definition-structure-alias.md).
- For initiatives, go to [initiative definition structure](./initiative-definition-structure.md).
- Review examples at [Azure Policy samples](../samples/index.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
