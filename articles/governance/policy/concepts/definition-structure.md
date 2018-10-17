---
title: Azure Policy definition structure
description: Describes how resource policy definition is used by Azure Policy to establish conventions for resources in your organization by describing when the policy is enforced and what effect to take.
services: azure-policy
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: azure-policy
manager: carmonm
---
# Azure Policy definition structure

Resource policy definition used by Azure Policy enables you to establish conventions for resources
in your organization by describing when the policy is enforced and what effect to take. By defining
conventions, you can control costs and more easily manage your resources. For example, you can
specify that only certain types of virtual machines are allowed. Or, you can require that all
resources have a particular tag. Policies are inherited by all child resources. So, if a policy is
applied to a resource group, it is applicable to all the resources in that resource group.

The schema used by Azure Policy can be found here: [https://schema.management.azure.com/schemas/2018-05-01/policyDefinition.json](https://schema.management.azure.com/schemas/2018-05-01/policyDefinition.json)

You use JSON to create a policy definition. The policy definition contains elements for:

- mode
- parameters
- display name
- description
- policy rule
  - logical evaluation
  - effect

For example, the following JSON shows a policy that limits where resources are deployed:

```json
{
    "properties": {
        "mode": "all",
        "parameters": {
            "allowedLocations": {
                "type": "array",
                "metadata": {
                    "description": "The list of locations that can be specified when deploying resources",
                    "strongType": "location",
                    "displayName": "Allowed locations"
                }
            }
        },
        "displayName": "Allowed locations",
        "description": "This policy enables you to restrict the locations your organization can specify when deploying resources.",
        "policyRule": {
            "if": {
                "not": {
                    "field": "location",
                    "in": "[parameters('allowedLocations')]"
                }
            },
            "then": {
                "effect": "deny"
            }
        }
    }
}
```

All Azure Policy samples are at [Policy samples](../samples/index.md).

## Mode

The **mode** determines which resource types will be evaluated for a policy. The supported modes
are:

- `all`: evaluate resource groups and all resource types
- `indexed`: only evaluate resource types that support tags and location

We recommend that you set **mode** to `all` in most cases. All policy definitions created through
the portal use the `all` mode. If you use PowerShell or Azure CLI, you can specify the **mode**
parameter manually. If the policy definition does not contain a **mode** value it defaults to `all`
in Azure PowerShell and to `null` in Azure CLI, which is equivalent to `indexed`, for backwards
compatibility.

`indexed` should be used when creating policies that will enforce tags or locations. This isn't
required but it will prevent resources that don't support tags and locations from showing up as
non-compliant in the compliance results. The one exception to this is **resource groups**. Policies
that are attempting to enforce location or tags on a resource group should set **mode** to `all`
and specifically target the `Microsoft.Resources/subscriptions/resourceGroup` type. For an example,
see [Enforce resource group tags](../samples/enforce-tag-rg.md).

## Parameters

Parameters help simplify your policy management by reducing the number of policy definitions. Think
of parameters like the fields on a form – `name`, `address`, `city`, `state`. These parameters
always stay the same, however their values change based on the individual filling out the form.
Parameters work the same way when building policies. By including parameters in a policy
definition, you can reuse that policy for different scenarios by using different values.

> [!NOTE]
> The parameters definition for a policy or initiative definition can only be configured during the
> initial creation of the policy or initiative. The parameters definition can't be changed later.
> This prevents existing assignments of the policy or initiative from indirectly being made invalid.

For example, you could define a policy for a resource property to limit the locations where
resources can be deployed. In this case, you would declare the following parameters when you create
your policy:

```json
"parameters": {
    "allowedLocations": {
        "type": "array",
        "metadata": {
            "description": "The list of allowed locations for resources.",
            "displayName": "Allowed locations",
            "strongType": "location"
        }
    }
}
```

The type of a parameter can be either string or array. The metadata property is used for tools like
the Azure portal to display user-friendly information.

Within the metadata property, you can use **strongType** to provide a multi-select list of options
within the Azure portal. Allowed values for **strongType** currently include:

- `"location"`
- `"resourceTypes"`
- `"storageSkus"`
- `"vmSKUs"`
- `"existingResourceGroups"`
- `"omsWorkspace"`

In the policy rule, you reference parameters with the following `parameters` deployment value
function syntax:

```json
{
    "field": "location",
    "in": "[parameters('allowedLocations')]"
}
```

## Definition location

While creating an initiative or policy definition, it is important that you specify the definition
location.

The definition location determines the scope to which the initiative or policy definition can be
assigned to. The location can be specified as a management group or a subscription.

> [!NOTE]
> If you plan to apply this policy definition to multiple subscriptions, the location must be a management group that contains the subscriptions you will assign the initiative or policy to.

## Display name and description

You can use **displayName** and **description** to identify the policy definition and provide
context for when it is used.

## Policy rule

The policy rule consists of **If** and **Then** blocks. In the **If** block, you define one or more
conditions that specify when the policy is enforced. You can apply logical operators to these
conditions to precisely define the scenario for a policy.

In the **Then** block, you define the effect that happens when the **If** conditions are fulfilled.

```json
{
    "if": {
        <condition> | <logical operator>
    },
    "then": {
        "effect": "deny | audit | append | auditIfNotExists | deployIfNotExists"
    }
}
```

### Logical operators

Supported logical operators are:

- `"not": {condition  or operator}`
- `"allOf": [{condition or operator},{condition or operator}]`
- `"anyOf": [{condition or operator},{condition or operator}]`

The **not** syntax inverts the result of the condition. The **allOf** syntax (similar to the
logical **And** operation) requires all conditions to be true. The **anyOf** syntax (similar to the
logical **Or** operation) requires one or more conditions to be true.

You can nest logical operators. The following example shows a **not** operation that is nested
within an **allOf** operation.

```json
"if": {
    "allOf": [{
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

### Conditions

A condition evaluates whether a **field** meets certain criteria. The supported conditions are:

- `"equals": "value"`
- `"notEquals": "value"`
- `"like": "value"`
- `"notLike": "value"`
- `"match": "value"`
- `"notMatch": "value"`
- `"contains": "value"`
- `"notContains": "value"`
- `"in": ["value1","value2"]`
- `"notIn": ["value1","value2"]`
- `"containsKey": "keyName"`
- `"notContainsKey": "keyName"`
- `"exists": "bool"`

When using the **like** and **notLike** conditions, you can provide a wildcard `*` in the value.
The value should not contain more than one wildcard `*`.

When using the **match** and **notMatch** conditions, provide `#` to represent a digit, `?` for a
letter, and any other character to represent that actual character. For examples, see [Allow
multiple name patterns](../samples/allow-multiple-name-patterns.md).

### Fields

Conditions are formed by using fields. A field represents properties in the resource request
payload that is used to describe the state of the resource.

The following fields are supported:

- `name`
- `fullName`
  - Returns the full name of the resource. The full name of a resource is the resource name prepended by any parent resource names (for example "myServer/myDatabase").
- `kind`
- `type`
- `location`
- `tags`
- `tags.<tagName>`
  - Where **\<tagName\>** is the name of the tag to validate the condition for.
  - Example: `tags.CostCenter` where **CostCenter** is the name of the tag.
- `tags[<tagName>]`
  - This bracket syntax supports tag names that contain periods.
  - Where **\<tagName\>** is the name of the tag to validate the condition for.
  - Example: `tags[Acct.CostCenter]` where **Acct.CostCenter** is the name of the tag.
- property aliases - for a list, see [Aliases](#aliases).

### Effect

Policy supports the following types of effect:

- **Deny**: generates an event in the audit log and fails the request
- **Audit**: generates a warning event in audit log but does not fail the request
- **Append**: adds the defined set of fields to the request
- **AuditIfNotExists**: enables auditing if a resource does not exist
- **DeployIfNotExists**: deploys a resource if it does not already exist.

For **append**, you must provide the following details:

```json
"effect": "append",
"details": [{
    "field": "field name",
    "value": "value of the field"
}]
```

The value can be either a string or a JSON format object.

With **AuditIfNotExists** and **DeployIfNotExists** you can evaluate the existence of a related
resource and apply a rule and a corresponding effect when that resource does not exist. For
example, you can require that a network watcher is deployed for all virtual networks. For an
example of auditing when a virtual machine extension is not deployed, see [Audit if extension does
not exist](../samples/audit-ext-not-exist.md).

For complete details on each effect, order of evaluation, properties, and examples, see
[Understanding Policy Effects](effects.md).

### Policy functions

A subset of [Resource Manager template
functions](../../../azure-resource-manager/resource-group-template-functions.md) are available to use
within a policy rule. The functions currently supported are:

- [parameters](../../../azure-resource-manager/resource-group-template-functions-deployment.md#parameters)
- [concat](../../../azure-resource-manager/resource-group-template-functions-array.md#concat)
- [resourceGroup](../../../azure-resource-manager/resource-group-template-functions-resource.md#resourcegroup)
- [subscription](../../../azure-resource-manager/resource-group-template-functions-resource.md#subscription)

Additionally, the `field` function is available to policy rules. This function is primarily for use
with **AuditIfNotExists** and **DeployIfNotExists** to reference fields on the resource that is
being evaluated. An example of this can be seen on the [DeployIfNotExists example](effects.md#deployifnotexists-example).

#### Policy function examples

This policy rule example uses the `resourceGroup` resource function to get the **name** property,
combined with the `concat` array and object function to build a `like` condition that enforces the
resource name to start with the resource group name.

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

This policy rule example uses the `resourceGroup` resource function to get the **tags** property
array value of the **CostCenter** tag on the resource group and append it to the **CostCenter** tag
on the new resource.

```json
{
    "if": {
        "field": "tags.CostCenter",
        "exists": "false"
    },
    "then": {
        "effect": "append",
        "details": [{
            "field": "tags.CostCenter",
            "value": "[resourceGroup().tags.CostCenter]"
        }]
    }
}
```

## Aliases

You use property aliases to access specific properties for a resource type. Aliases enable you to
restrict what values or conditions are permitted for a property on a resource. Each alias maps to
paths in different API versions for a given resource type. During policy evaluation, the policy
engine gets the property path for that API version.

The list of aliases is always growing. To discover what aliases are currently supported by Azure
Policy, use one of the following methods:

- Azure PowerShell

  ```azurepowershell-interactive
  # Login first with Connect-AzureRmAccount if not using Cloud Shell

  # Use Get-AzureRmPolicyAlias to list available providers
  Get-AzureRmPolicyAlias -ListAvailable

  # Use Get-AzureRmPolicyAlias to list aliases for a Namespace (such as Azure Automation -- Microsoft.Automation)
  Get-AzureRmPolicyAlias -NamespaceMatch 'automation'
  ```

- Azure CLI

  ```azurecli-interactive
  # Login first with az login if not using Cloud Shell

  # List namespaces
  az provider list --query [*].namespace

  # Get Azure Policy aliases for a specific Namespace (such as Azure Automation -- Microsoft.Automation)
  az provider show --namespace Microsoft.Automation --expand "resourceTypes/aliases" --query "resourceTypes[].aliases[].name"
  ```

- REST API / ARMClient

  ```http
  GET https://management.azure.com/providers/?api-version=2017-08-01&$expand=resourceTypes/aliases
  ```

### Understanding the [*] alias

Several of the aliases that are available have a version that appears as a 'normal' name and
another that has **[\*]** attached to it. For example:

- `Microsoft.Storage/storageAccounts/networkAcls.ipRules`
- `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]`

The first example is used to evaluate the entire array, where the **[\*]** alias evaluates each
element of the array.

Let's look at a policy rule as an example. This policy will **Deny** a storage account which has
ipRules configured and if **none** of the ipRules have a value of "127.0.0.1".

```json
"policyRule": {
    "if": {
        "allOf": [{
                "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules",
                "exists": "true"
            },
            {
                "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].value",
                "notEquals": "127.0.0.1"
            }
        ]
    },
    "then": {
        "effect": "deny",
    }
}
```

The **ipRules** array is as follows for the example:

```json
"ipRules": [{
        "value": "127.0.0.1",
        "action": "Allow"
    },
    {
        "value": "192.168.1.1",
        "action": "Allow"
    }
]
```

Here's how this example is processed:

- `networkAcls.ipRules` - Check that the array is non-null. It evaluates true, so evaluation continues.

  ```json
  {
    "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules",
    "exists": "true"
  }
  ```

- `networkAcls.ipRules[*].value` - Checks each _value_ property in the **ipRules** array.

  ```json
  {
    "field": "Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].value",
    "notEquals": "127.0.0.1"
  }
  ```

  - As an array, each element will be processed.

    - "127.0.0.1" != "127.0.0.1" evaluates as false.
    - "127.0.0.1" != "192.168.1.1" evaluates as true.
    - At least one _value_ property in the **ipRules** array evaluated as false, so the evaluation will stop.

As a condition evaluated to false, the **Deny** effect is not triggered.

## Initiatives

Initiatives enable you to group several related policy definitions to simplify assignments and
management because you work with a group as a single item. For example, you can group all related
tagging policy definitions in a single initiative. Rather than assigning each policy individually,
you apply the initiative.

The following example illustrates how to create an initiative for handling two tags: `costCenter`
and `productName`. It uses two built-in policies to apply the default tag value.

```json
{
    "properties": {
        "displayName": "Billing Tags Policy",
        "policyType": "Custom",
        "description": "Specify cost Center tag and product name tag",
        "parameters": {
            "costCenterValue": {
                "type": "String",
                "metadata": {
                    "description": "required value for Cost Center tag"
                }
            },
            "productNameValue": {
                "type": "String",
                "metadata": {
                    "description": "required value for product Name tag"
                }
            }
        },
        "policyDefinitions": [{
                "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/1e30110a-5ceb-460c-a204-c1c3969c6d62",
                "parameters": {
                    "tagName": {
                        "value": "costCenter"
                    },
                    "tagValue": {
                        "value": "[parameters('costCenterValue')]"
                    }
                }
            },
            {
                "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498",
                "parameters": {
                    "tagName": {
                        "value": "costCenter"
                    },
                    "tagValue": {
                        "value": "[parameters('costCenterValue')]"
                    }
                }
            },
            {
                "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/1e30110a-5ceb-460c-a204-c1c3969c6d62",
                "parameters": {
                    "tagName": {
                        "value": "productName"
                    },
                    "tagValue": {
                        "value": "[parameters('productNameValue')]"
                    }
                }
            },
            {
                "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498",
                "parameters": {
                    "tagName": {
                        "value": "productName"
                    },
                    "tagValue": {
                        "value": "[parameters('productNameValue')]"
                    }
                }
            }
        ]
    },
    "id": "/subscriptions/<subscription-id>/providers/Microsoft.Authorization/policySetDefinitions/billingTagsPolicy",
    "type": "Microsoft.Authorization/policySetDefinitions",
    "name": "billingTagsPolicy"
}
```

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md)
- Review [Understanding policy effects](effects.md)
- Understand how to [programmatically create policies](../how-to/programmatically-create.md)
- Learn how to [get compliance data](../how-to/getting-compliance-data.md)
- Discover how to [remediate non-compliant resources](../how-to/remediate-resources.md)
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md)
