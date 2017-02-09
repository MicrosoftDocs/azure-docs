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
Resource policies enable you to establish conventions for resources in your organization. By defining conventions, you can control costs and more easily manage your resources. For example, you can specify that only certain types of virtual machines are allowed, or you can require that all resources have a particular tag.  

To implement a policy, you must perform three steps:

1. Define the policy with JSON. This topic describes the structure and syntax of the JSON for defining a policy. 
2. Create a policy definition in your subscription from the JSON you created in the preceding step. This step makes the policy available for assignment but does not apply the rules to your subscription.
3. Assign the policy to a scope (such as a subscription or resource group). The rules of the policy are now enforced.

Azure provides some pre-defined policies that may reduce the number of policies you have to define. If a pre-defined policy works for your scenario, skip the first two steps and assign the pre-defined policy to a scope.

Policies are inherited by all child resources. So, if a policy is applied to a resource group, it is applicable to all the resources in that resource group.

Policies are evaluated only when resources are deployed.

> [!NOTE]
> Currently, policy does not evaluate resource types that do not support tags, kind, and location, such as the Microsoft.Resources/deployments resource type. This support will be added at a future time. To avoid backward compatibility issues, you should explicitly specify type when authoring policies. For example, a tag policy that does not specify types is applied for all types. In that case, a template deployment may fail if there is a nested resource that doesn't support tags, and the deployment resource type has been added to policy evaluation. 
> 
> 

## How is it different from RBAC?
There are a few key differences between policy and role-based access control (RBAC). RBAC focuses on **user** actions at different scopes. For example, you are added to the contributor role for a resource group at the desired scope, so you can make changes to that resource group. Policy focuses on **resource** properties during deployment. For example, through policies, you can control the types of resources that can be provisioned or restrict the locations in which the resources can be provisioned. Unlike RBAC, policy is a default allow and explicit deny system. 

To use policies, you must be authenticated through RBAC. Specifically, your account needs the `Microsoft.Authorization/policydefinitions/write` permission to define a policy, and the `Microsoft.Authorization/policyassignments/write` permission to assign a policy. These permissions are not included in the **Contributor** role.

## Policy definition structure
Policy definition is created using JSON. It consists of one or more conditions/logical operators that define the actions, and an effect that tells what happens when the conditions are fulfilled. The schema is published at [http://schema.management.azure.com/schemas/2015-10-01-preview/policyDefinition.json](http://schema.management.azure.com/schemas/2015-10-01-preview/policyDefinition.json). 

The following example shows a policy you can use to limit where resources are deployed:

```json
{
  "properties": {
    "parameters": {
      "listOfAllowedLocations": {
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
          "in": "[parameters('listOfAllowedLocations')]"
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

In the policy rule, you can reference the parameters similar to what you do in templates. For example: 

```json
{ 
    "field": "location",
    "in": "[parameters('allowedLocations')]"
}
```

## Policy rules

**Condition/Logical operators:** a set of conditions that can be manipulated through a set of logical operators.

**Effect:** what happens when the condition is satisfied – deny, audit, or append. An audit effect emits a warning event service log. For example, an administrator can create a policy that causes an audit event if anyone creates a large VM. The administrator can review the logs later.

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

The following fields and sources are supported:

Fields: **name**, **kind**, **type**, **location**, **tags**, **tags.***, and **property alias**. 

### Property aliases
Property alias is a name that can be used in a policy definition to access the resource type specific properties, such as settings, and SKUs. It works across all API versions where the property exists. You can retrieve aliases through the REST API (Powershell support will be added in the future):

```HTTP
GET /subscriptions/{id}/providers?$expand=resourceTypes/aliases&api-version=2015-11-01
```

The following example shows a definition of an alias. As you can see, an alias defines paths in different API versions, even when there is a property name change. 

```json
"aliases": [
    {
      "name": "Microsoft.Storage/storageAccounts/sku.name",
      "paths": [
        {
          "path": "properties.accountType",
          "apiVersions": [
            "2015-06-15",
            "2015-05-01-preview"
          ]
        },
        {
          "path": "sku.name",
          "apiVersions": [
            "2016-01-01"
          ]
        }
      ]
    }
]
```

Currently, the supported aliases are:

| Alias name | Description |
| --- | --- |
| {resourceType}/sku.name |Supported resource types are: Microsoft.Compute/virtualMachines,<br />Microsoft.Storage/storageAccounts,<br />Microsoft.Web/serverFarms,<br /> Microsoft.Scheduler/jobcollections,<br />Microsoft.DocumentDB/databaseAccounts,<br />Microsoft.Cache/Redis,<br />Microsoft.CDN/profiles |
| {resourceType}/sku.family |Supported resource type is Microsoft.Cache/Redis |
| {resourceType}/sku.capacity |Supported resource type is Microsoft.Cache/Redis |
| Microsoft.Compute/virtualMachines/imagePublisher | |
| Microsoft.Compute/virtualMachines/imageOffer | |
| Microsoft.Compute/virtualMachines/imageSku | |
| Microsoft.Compute/virtualMachines/imageVersion | |
| Microsoft.Storage/storageAccounts/accessTier | |
| Microsoft.Storage/storageAccounts/enableBlobEncryption | |
| Microsoft.Cache/Redis/enableNonSslPort | |
| Microsoft.Cache/Redis/shardCount | |
| Microsoft.SQL/servers/version | |
| Microsoft.SQL/servers/databases/requestedServiceObjectiveId | |
| Microsoft.SQL/servers/databases/requestedServiceObjectiveName | |
| Microsoft.SQL/servers/databases/edition | |
| Microsoft.SQL/servers/databases/elasticPoolName | |
| Microsoft.SQL/servers/elasticPools/dtu | |
| Microsoft.SQL/servers/elasticPools/edition | |


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

## Examples

## Allowed resource locations
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

## Restrict resource types
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
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

