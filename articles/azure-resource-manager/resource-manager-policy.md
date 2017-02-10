---
title: Azure resource policies | Microsoft Docs
description: Describes how to use Azure Resource Manager policies to ensure consistent resource properties are set during deployment. Policies can be applied at the subscription or resource groups.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: abde0f73-c0fe-4e6d-a1ee-32a6fce52a2d
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/09/2017
ms.author: tomfitz

---
# Resource policy overview
Resource policies enable you to establish conventions for resources in your organization. By defining conventions, you can control costs and more easily manage your resources. For example, you can specify that only certain types of virtual machines are allowed, or you can require that all resources have a particular tag. Policies are inherited by all child resources. So, if a policy is applied to a resource group, it is applicable to all the resources in that resource group.

There are two concepts to understand about policies:

* policy definition - you describe when the policy is enforced and what action to take
* policy assignment - you apply the policy definition to a scope (subscription or resource group)

Azure provides some built-in policy definitions that may reduce the number of policies you have to define. If a built-in policy definition works for your scenario, use that definition when assigning to a scope.

Policies are evaluated when creating and updating resources (PUT and PATCH operations).

> [!NOTE]
> Currently, policy does not evaluate resource types that do not support tags, kind, and location, such as the Microsoft.Resources/deployments resource type. This support will be added at a future time. To avoid backward compatibility issues, you should explicitly specify type when authoring policies. For example, a tag policy that does not specify types is applied for all types. In that case, a template deployment may fail if there is a nested resource that doesn't support tags, and the deployment resource type has been added to policy evaluation. 
> 
> 

## How is it different from RBAC?
There are a few key differences between policy and role-based access control (RBAC). RBAC focuses on **user** actions at different scopes. For example, you are added to the contributor role for a resource group at the desired scope, so you can make changes to that resource group. Policy focuses on **resource** properties during deployment. For example, through policies, you can control the types of resources that can be provisioned or restrict the locations in which the resources can be provisioned. Unlike RBAC, policy is a default allow and explicit deny system. 

To use policies, you must be authenticated through RBAC. Specifically, your account needs the:

* `Microsoft.Authorization/policydefinitions/write` permission to define a policy
* `Microsoft.Authorization/policyassignments/write` permission to assign a policy 

These permissions are not included in the **Contributor** role.

## Policy definition structure
You use JSON to create a policy definition. The policy definition contains sections for:

* parameters
* displayName
* description
* policyRule
  * logical evaluation
  * effect

The following example shows a policy that limits where resources are deployed:

```json
{
  "properties": {
    "parameters": {
      "allowedLocations": {
        "type": "array",
        "metadata": {
          "description": "An array of permitted locations for resources.",
          "strongType": "location",
          "displayName": "List of locations"
        }
      }
    },
    "displayName": "Allowed locations policy template",
    "description": "This policy enables you to restrict the locations your organization can specify when deploying resources. Use to enforce your geo-compliance requirements.",
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

## Parameters
Using parameters helps simplify your policy management by reducing the number of policy definitions. You define a policy for a resource property (such as limiting the locations where resources can be deployed), and include parameters in the definition. Then, you reuse that policy definition for different scenarios by passing in different values (such as specifying one set of locations for a subscription) when assigning the policy.

You declare parameters when you create policy definitions.

```json
"parameters": {
  "allowedLocations": {
    "type": "array",
    "metadata": {
      "description": "The list of allowed locations for resources.",
      "displayName": "Allowed locations"
    }
  }
}
```

The type of a parameter can be either string or array. The metadata property is used for tools like Azure portal to display user-friendly information. 

In the policy rule, you reference parameters with the following syntax: 

```json
{ 
    "field": "location",
    "in": "[parameters('allowedLocations')]"
}
```

## displayName and description

You use the `displayName` and `description` to identify the policy definition, and provide context for when it is used.

## Policy rule

The policy rule consists of one or more conditions/logical operators that define the actions, and an effect that tells what happens when the conditions are fulfilled.

**Condition/Logical operators:** a set of conditions that can be manipulated through a set of logical operators.

**Effect:** what happens when the condition is satisfied – deny, audit, or append. An audit effect emits a warning event service log. For example, you can create a policy that causes an audit event if someone in your organization creates a large VM. You can review the logs later.

```json
{
  "if": {
    <condition> | <logical operator>
  },
  "then": {
    "effect": "deny | audit | append"
  }
}
```

### Logical operators
The supported logical operators along with the syntax are:

| Operator Name | Syntax |
|:--- |:--- |
| Not |"not": {&lt;condition  or operator &gt;} |
| And |"allOf": [ {&lt;condition or operator &gt;},{&lt;condition or operator &gt;}] |
| Or |"anyOf": [ {&lt;condition or operator &gt;},{&lt;condition or operator &gt;}] |

Resource Manager enables you to specify complex logic in your policy through nested operators. For example, you can deny resource creation in a particular location for a specified resource type. An example of nested operators is in this topic.

### Conditions
A condition evaluates whether a **field** or **source** meets certain criteria. The supported condition names and syntax are:

| Condition Name | Syntax |
|:--- |:--- |
| Equals |"equals": "&lt;value&gt;" |
| Like |"like": "&lt;value&gt;" |
| Contains |"contains": "&lt;value&gt;" |
| In |"in": ["&lt;value1&gt;","&lt;value2&gt;"] |
| ContainsKey |"containsKey": "&lt;keyName&gt;" |
| Exists |"exists": "&lt;bool&gt;" |

### Fields
Conditions are formed by using fields and sources. A field represents properties in the resource request payload that is used to describe the state of the resource. A source represents characteristics of the request itself. 

The following fields are supported:

* `name`
* `kind`
* `type`
* `location`
* `tags`
* `tags.*` 
* property aliases

  You use property aliases to access specific properties for a resource type.  

  Currently, the supported aliases are:

  * Microsoft.CDN/profiles/sku.name
  * Microsoft.Compute/virtualMachines/imageOffer
  * Microsoft.Compute/virtualMachines/imagePublisher
  * Microsoft.Compute/virtualMachines/sku.name
  * Microsoft.Compute/virtualMachines/imageSku 
  * Microsoft.Compute/virtualMachines/imageVersion
  * Microsoft.SQL/servers/databases/edition
  * Microsoft.SQL/servers/databases/elasticPoolName
  * Microsoft.SQL/servers/databases/requestedServiceObjectiveId
  * Microsoft.SQL/servers/databases/requestedServiceObjectiveName
  * Microsoft.SQL/servers/elasticPools/dtu
  * Microsoft.SQL/servers/elasticPools/edition
  * Microsoft.SQL/servers/version
  * Microsoft.Storage/storageAccounts/accessTier
  * Microsoft.Storage/storageAccounts/enableBlobEncryption
  * Microsoft.Storage/storageAccounts/sku.name
  * Microsoft.Web/serverFarms/sku.name

### Effect
Policy supports three types of effect - **deny**, **audit**, and **append**. 

* Deny generates an event in the audit log and fails the request
* Audit generates an event in audit log but does not fail the request
* Append adds the defined set of fields to the request 

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

## Common examples

### Allowed resource locations
To specify which locations are allowed, use the built-in policy with the resource ID `/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c`.

The built-in policy contains a rule similar to:

```json
{
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
```

To specify which locations are not allowed, use the following policy:

```json
{
  "if": {
    "field": "location",
    "in": "[parameters('notAllowedLocations')]"
  },
  "then": {
    "effect": "deny"
  }
}
```

### Allowed resource types
The following example shows a policy that permits deployments for only on the `Microsoft.Resources/*`, `Microsoft.Compute/*`, `Microsoft.Storage/*`, `Microsoft.Network/*` resource types. All others are denied:

```json
{
  "if": {
    "not": {
      "anyOf": [
        {
          "field": "type",
          "like": "Microsoft.Resources/*"
        },
        {
          "field": "type",
          "like": "Microsoft.Compute/*"
        },
        {
          "field": "type",
          "like": "Microsoft.Storage/*"
        },
        {
          "field": "type",
          "like": "Microsoft.Network/*"
        }
      ]
    }
  },
  "then": {
    "effect": "deny"
  }
}
```

### Set naming convention
The following example shows the use of wildcard, which is supported by the **like** condition. The condition states that if the name does match the mentioned pattern (namePrefix\*nameSuffix) then deny the request:

```json
{
  "if": {
    "not": {
      "field": "name",
      "like": "namePrefix*nameSuffix"
    }
  },
  "then": {
    "effect": "deny"
  }
}
```

## Next steps
* For examples of tag polices, see [Apply resource policies for tags](resource-manager-policy-tags.md).
* For examples of storage policies, see [Apply resource policies to storage accounts](resource-manager-policy-storage.md).
* For examples of virtual machine policies, see [Apply resource policies to Linux VMs](../virtual-machines/virtual-machines-linux-policy.md?toc=%2fazure%2fazure-resource-manager%2ftoc.json) and [Apply resource policies to Windows VMs](../virtual-machines/virtual-machines-windows-policy.md?toc=%2fazure%2fazure-resource-manager%2ftoc.json)
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).
* The policy schema is published at [http://schema.management.azure.com/schemas/2015-10-01-preview/policyDefinition.json](http://schema.management.azure.com/schemas/2015-10-01-preview/policyDefinition.json). 

