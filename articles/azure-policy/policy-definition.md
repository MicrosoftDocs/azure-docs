---
title: Azure Policy definition structure | Microsoft Docs
description: Describes how resource policy definition is used by Azure Policy to establish conventions for resources in your organization by describing when the policy is enforced and what action to take.
services: azure-policy
keywords:
author: bandersmsft
ms.author: banders
ms.date: 01/17/2018
ms.topic: article
ms.service: azure-policy
ms.custom:
---

# Azure Policy definition structure

Resource policy definition used by Azure Policy enables you to establish conventions for resources in your organization by describing when the policy is enforced and what action to take. By defining conventions, you can control costs and more easily manage your resources. For example, you can specify that only certain types of virtual machines are allowed. Or, you can require that all resources have a particular tag. Policies are inherited by all child resources. So, if a policy is applied to a resource group, it is applicable to all the resources in that resource group.

You use JSON to create a policy definition. The policy definition contains elements for:

* mode
* parameters
* display name
* description
* policy rule
  * logical evaluation
  * effect

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

All Azure Policy template samples are at [Templates for Azure Policy](json-samples.md).

## Mode

The **mode** determines which resource types will be evaluated for a policy. The supported modes are:
* `all`: evaluate resource groups and all resource types 
* `indexed`: only evaluate resource types that support tags and location

We recommend that you set **mode** to `all` in most cases. All policy definitions created through the portal use the `all` mode. If you use PowerShell or Azure CLI, you need to specify the **mode** parameter manually. If the policy definition does not contain a **mode** value it defaults to `indexed` for backwards compatibility.

`indexed` should be used when creating policies that will enforce tags or locations. This isn't required but it will prevent resources that don't support tags and locations from showing up as non-compliant in the compliance results. The one exception to this is **resource groups**. Policies that are attempting to enforce location or tags on a resource group should set **mode** to `all` and specifically target the `Microsoft.Resources/subscriptions/resourceGroup` type. For an example, see [Enforce resource group tags](scripts/enforce-tag-rg.md).

## Parameters

Parameters help simplify your policy management by reducing the number of policy definitions. Think of parameters like the fields on a form – `name`, `address`, `city`, `state`. These parameters always stay the same, however their values change based on the individual filling out the form. Parameters work the same way when building policies. By including parameters in a policy definition, you can reuse that policy for different scenarios by using different values.

For example, you could define a policy for a resource property to limit the locations where resources can be deployed. In this case, you would declare the following parameters when you create your policy:


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

The type of a parameter can be either string or array. The metadata property is used for tools like the Azure portal to display user-friendly information.

Within the metadata property you can use **strongType** to provide a multi-select list of options within the Azure portal.  Allowed values for **strongType** currently include:

* `"location"`
* `"resourceTypes"`
* `"storageSkus"`
* `"vmSKUs"`
* `"existingResourceGroups"`
* `"omsWorkspace"`

In the policy rule, you reference parameters with the following syntax:

```json
{
    "field": "location",
    "in": "[parameters('allowedLocations')]"
}
```

## Display name and description

You can use **displayName** and **description** to identify the policy definition, and provide context for when it is used.

## Policy rule

The policy rule consists of **If** and **Then** blocks. In the **If** block, you define one or more conditions that specify when the policy is enforced. You can apply logical operators to these conditions to precisely define the scenario for a policy.

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

* `"not": {condition  or operator}`
* `"allOf": [{condition or operator},{condition or operator}]`
* `"anyOf": [{condition or operator},{condition or operator}]`

The **not** syntax inverts the result of the condition. The **allOf** syntax (similar to the logical **And** operation) requires all conditions to be true. The **anyOf** syntax (similar to the logical **Or** operation) requires one or more conditions to be true.

You can nest logical operators. The following example shows a **not** operation that is nested within an **allOf** operation.

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

### Conditions

A condition evaluates whether a **field** meets certain criteria. The supported conditions are:

* `"equals": "value"`
* `"notEquals": "value"`
* `"like": "value"`
* `"notLike": "value"`
* `"match": "value"`
* `"notMatch": "value"`
* `"contains": "value"`
* `"notContains": "value"`
* `"in": ["value1","value2"]`
* `"notIn": ["value1","value2"]`
* `"containsKey": "keyName"`
* `"notContainsKey": "keyName"`
* `"exists": "bool"`

When using the **like** and **notLike** conditions, you can provide a wildcard (*) in the value.

When using the **match** and **notMatch** conditions, provide `#` to represent a digit, `?` for a letter, and any other character to represent that actual character. For examples, see [Approved VM images](scripts/allowed-custom-images.md).

### Fields
Conditions are formed by using fields. A field represents properties in the resource request payload that is used to describe the state of the resource.  

The following fields are supported:

* `name`
* `fullName`
  * Returns the full name of the resource, including any parents (e.g. "myServer/myDatabase")
* `kind`
* `type`
* `location`
* `tags`
* `tags.tagName`
* `tags[tagName]`
  * This bracket syntax supports tag names that contain periods
* property aliases - for a list, see [Aliases](#aliases).

### Alternative Accessors
**Field** is the primary accessor used in policy rules. It directly inspects the resource that is being evaluated. However, policy supports one other accessor, **source**.

```json
"source": "action",
"equals": "Microsoft.Compute/virtualMachines/write"
```

**Source** only supports one value, **action**. Action returns the authorization action of the request that is being evaluated. Authorization actions are exposed in the authorization section of the [Activity Log](../monitoring-and-diagnostics/monitoring-activity-log-schema.md).

When policy is evaluating existing resources in the background it sets **action** to a `/write` authorization action on the resource's type.

### Effect
Policy supports the following types of effect:

* **Deny**: generates an event in the audit log and fails the request
* **Audit**: generates a warning event in audit log but does not fail the request
* **Append**: adds the defined set of fields to the request
* **AuditIfNotExists**: enables auditing if a resource does not exist
* **DeployIfNotExists**: deploys a resource if it does not already exist. Currently, this effect is only supported through built-in policies.

For **append**, you must provide the following details:

```json
"effect": "append",
"details": [
  {
    "field": "field name",
    "value": "value of the field"
  }
]
```

The value can be either a string or a JSON format object.

With **AuditIfNotExists** and **DeployIfNotExists** you can evaluate the existence of a related resource and apply a rule and a corresponding effect when that resource does not exist. For example, you can require that a network watcher is deployed for all virtual networks.
For an example of auditing when a virtual machine extension is not deployed, see [Audit if extension does not exist](scripts/audit-ext-not-exist.md).


## Aliases

You use property aliases to access specific properties for a resource type. Aliases enable you to restrict what values or conditions are permitted for a property on a resource. Each alias maps to paths in different API versions for a given resource type. During policy evaluation, the policy engine gets the property path for that API version.

**Microsoft.Cache/Redis**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Cache/Redis/enableNonSslPort | Set whether the non-ssl Redis server port (6379) is enabled. |
| Microsoft.Cache/Redis/shardCount | Set the number of shards to be created on a Premium Cluster Cache.  |
| Microsoft.Cache/Redis/sku.capacity | Set the size of the Redis cache to deploy.  |
| Microsoft.Cache/Redis/sku.family | Set the SKU family to use. |
| Microsoft.Cache/Redis/sku.name | Set the type of Redis Cache to deploy. |

**Microsoft.Cdn/profiles**

| Alias | Description |
| ----- | ----------- |
| Microsoft.CDN/profiles/sku.name | Set the name of the pricing tier. |

**Microsoft.Compute/disks**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Compute/imageOffer | Set the offer of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imagePublisher | Set the publisher of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imageSku | Set the SKU of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imageVersion | Set the version of the platform image or marketplace image used to create the virtual machine. |


**Microsoft.Compute/virtualMachines**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Compute/imageId | Set the identifier of the image used to create the virtual machine. |
| Microsoft.Compute/imageOffer | Set the offer of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imagePublisher | Set the publisher of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imageSku | Set the SKU of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imageVersion | Set the version of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/licenseType | Set that the image or disk is licensed on-premises. This value is only used for images that contain the Windows Server operating system.  |
| Microsoft.Compute/virtualMachines/imageOffer | Set the offer of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/virtualMachines/imagePublisher | Set the publisher of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/virtualMachines/imageSku | Set the SKU of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/virtualMachines/imageVersion | Set the version of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/virtualMachines/osDisk.Uri | Set the vhd URI. |
| Microsoft.Compute/virtualMachines/sku.name | Set the size of the virtual machine. |
| Microsoft.Compute/virtualMachines/availabilitySet.id | Sets the availability set id for the virtual machine. |

**Microsoft.Compute/virtualMachines/extensions**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Compute/virtualMachines/extensions/publisher | Set the name of the extension’s publisher. |
| Microsoft.Compute/virtualMachines/extensions/type | Set the type of extension. |
| Microsoft.Compute/virtualMachines/extensions/typeHandlerVersion | Set the version of the extension. |

**Microsoft.Compute/virtualMachineScaleSets**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Compute/imageId | Set the identifier of the image used to create the virtual machine. |
| Microsoft.Compute/imageOffer | Set the offer of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imagePublisher | Set the publisher of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imageSku | Set the SKU of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/imageVersion | Set the version of the platform image or marketplace image used to create the virtual machine. |
| Microsoft.Compute/licenseType | Set that the image or disk is licensed on-premises. This value is only used for images that contain the Windows Server operating system. |
| Microsoft.Compute/VirtualMachineScaleSets/computerNamePrefix | Set the computer name prefix for all  the virtual machines in the scale set. |
| Microsoft.Compute/VirtualMachineScaleSets/osdisk.imageUrl | Set the blob URI for user image. |
| Microsoft.Compute/VirtualMachineScaleSets/osdisk.vhdContainers | Set the container URLs that are used to store operating system disks for the scale set. |
| Microsoft.Compute/VirtualMachineScaleSets/sku.name | Set the size of virtual machines in a scale set. |
| Microsoft.Compute/VirtualMachineScaleSets/sku.tier | Set the tier of virtual machines in a scale set. |

**Microsoft.Network/applicationGateways**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Network/applicationGateways/sku.name | Set the size of the gateway. |

**Microsoft.Network/virtualNetworkGateways**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Network/virtualNetworkGateways/gatewayType | Set the type of this virtual network gateway. |
| Microsoft.Network/virtualNetworkGateways/sku.name | Set the gateway SKU name. |

**Microsoft.Sql/servers**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Sql/servers/version | Set the version of the server. |

**Microsoft.Sql/databases**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Sql/servers/databases/edition | Set the edition of the database. |
| Microsoft.Sql/servers/databases/elasticPoolName | Set the name of the elastic pool the database is in. |
| Microsoft.Sql/servers/databases/requestedServiceObjectiveId | Set the configured service level objective ID of the database. |
| Microsoft.Sql/servers/databases/requestedServiceObjectiveName | Set the name of the configured service level objective of the database.  |

**Microsoft.Sql/elasticpools**

| Alias | Description |
| ----- | ----------- |
| servers/elasticpools | Microsoft.Sql/servers/elasticPools/dtu | Set the total shared DTU for the database elastic pool. |
| servers/elasticpools | Microsoft.Sql/servers/elasticPools/edition | Set the edition of the elastic pool. |

**Microsoft.Storage/storageAccounts**

| Alias | Description |
| ----- | ----------- |
| Microsoft.Storage/storageAccounts/accessTier | Set the access tier used for billing. |
| Microsoft.Storage/storageAccounts/accountType | Set the SKU name. |
| Microsoft.Storage/storageAccounts/enableBlobEncryption | Set whether the service encrypts the data as it is stored in the blob storage service. |
| Microsoft.Storage/storageAccounts/enableFileEncryption | Set whether the service encrypts the data as it is stored in the file storage service. |
| Microsoft.Storage/storageAccounts/sku.name | Set the SKU name. |
| Microsoft.Storage/storageAccounts/supportsHttpsTrafficOnly | Set to allow only https traffic to storage service. |
| Microsoft.Storage/storageAccounts/networkAcls.virtualNetworkRules[*].id | Check whether Virtual Network Service Endpoint is enabled. |

## Initiatives

Initiatives enable you group several related policy definitions to simplify assignments and management because you work with a group as a single item. For example, you can group all related tagging policy definitions in a single initiative. Rather than assigning each policy individually, you apply the initiative.

The following example illustrates how to create an initiative for handling two tags: `costCenter` and `productName`. It uses two built-in policies to apply the default tag value.


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
        "policyDefinitions": [
            {
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

- Review the Azure Policy template samples at [Templates for Azure Policy](json-samples.md).
