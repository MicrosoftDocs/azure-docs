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
ms.date: 02/03/2017
ms.author: tomfitz

---
# Resource policy overview
Resource policies enable you to establish conventions for resources in your organization. By defining conventions, you can control costs and more easily manage your resources. For example, you can specify that only certain types of virtual machines are allowed, or you can require that all resources have a particular tag.  

To implement a policy, you must perform three steps:

1. Define the policy with JSON. This topic describes the structure and syntax of the JSON for defining a policy. 
2. Create a policy definition in your subscription from the JSON you created in the preceding step. This step makes the policy available for assignment but does not apply the rules to your subscription.
3. Assign the policy to a scope (such as a subscription or resource group). The rules of the policy are now enforced.

Azure provides some pre-defined policies that may reduce the number of policies you have to define. If a pre-defined policy works for your scenario, skip the first two steps and simply assign the pre-defined policy to a scope.

Policies are inherited by all child resources. So, if a policy is applied to a resource group, it is applicable to all the resources in that resource group.

Policies are evaluated only when resources are deployed.

> [!NOTE]
> Currently, policy does not evaluate resource types that do not support tags, kind, and location, such as the Microsoft.Resources/deployments resource type. This support will be added at a future time. To avoid backward compatibility issues, you should explicitly specify type when authoring policies. For example, a tag policy that does not specify types is applied for all types. In that case, a template deployment may fail if there is a nested resource that doesn't support tags, and the deployment resource type has been added to policy evaluation. 
> 
> 

## How is it different from RBAC?
There are a few key differences between policy and role-based access control (RBAC). RBAC focuses on the actions **users** can perform at different scopes. For example, a particular user is added to the contributor role for a resource group at the desired scope, so the user can make changes to that resource group. Policy focuses on **resource** properties during deployment. For example, through policies, you can control the types of resources that can be provisioned or restrict the locations in which the resources can be provisioned. Unlike RBAC, policy is a default allow and explicit deny system. 

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
    "field" : "location",
    "in" : "[parameters('allowedLocations')]"
}
```

## Policy rules

**Condition/Logical operators:** a set of conditions that can be manipulated through a set of logical operators.

**Effect:** what happens when the condition is satisfied – deny, audit, or append. An audit effect emits a warning event service log. For example, an administrator can create a policy that causes an audit event if anyone creates a large VM. The administrator can review the logs later.

```json
{
  "if" : {
      <condition> | <logical operator>
  },
  "then" : {
      "effect" : "deny | audit | append"
  }
}
```

### Logical operators
The supported logical operators along with the syntax are:

| Operator Name | Syntax |
|:--- |:--- |
| Not |"not" : {&lt;condition  or operator &gt;} |
| And |"allOf" : [ {&lt;condition or operator &gt;},{&lt;condition or operator &gt;}] |
| Or |"anyOf" : [ {&lt;condition or operator &gt;},{&lt;condition or operator &gt;}] |

Resource Manager enables you to specify complex logic in your policy through nested operators. For example, you can deny resource creation in a particular location for a specified resource type. An example of nested operators is in this topic.

### Conditions
A condition evaluates whether a **field** or **source** meets certain criteria. The supported condition names and syntax are:

| Condition Name | Syntax |
|:--- |:--- |
| Equals |"equals" : "&lt;value&gt;" |
| Like |"like" : "&lt;value&gt;" |
| Contains |"contains" : "&lt;value&gt;" |
| In |"in" : ["&lt;value1&gt;","&lt;value2&gt;"] |
| ContainsKey |"containsKey" : "&lt;keyName&gt;" |
| Exists |"exists" : "&lt;bool&gt;" |

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

## Manage policies with REST API

You can create a policy with the [REST API for Policy Definitions](https://docs.microsoft.com/rest/api/resources/policydefinitions). The REST API enables you to create and delete policy definitions, and get information about existing definitions.

To create a policy, run:

```HTTP
PUT https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.authorization/policydefinitions/{policyDefinitionName}?api-version={api-version}
```

For api-version, use *2016-04-01* or *2016-12-01*. Include a request body similar to the following example:

```json
{
  "properties": {
    "parameters": {
      "listOfAllowedLocations": {
        "type": "array",
        "metadata": {
          "description": "An array of permitted locations for resources.",
          "strongType": "location",
          "displayName": "List Of Locations"
        }
      }
    },
    "displayName": "Geo-compliance policy template",
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

You can apply the policy definition at the desired scope through the [REST API for policy assignments](https://docs.microsoft.com/rest/api/resources/policyassignments). The REST API enables you to create and delete policy assignments, and get information about existing assignments.

To create a policy assignment, run:

```HTTP
PUT https://management.azure.com /subscriptions/{subscription-id}/providers/Microsoft.authorization/policyassignments/{policyAssignmentName}?api-version={api-version}
```

The {policy-assignment} is the name of the policy assignment. For api-version use *2016-04-01* or *2016-12-01* (for parameters). 

With a request body similar to the following example:

```json
{
  "properties":{
    "displayName":"West US only policy assignment on the subscription ",
    "description":"Resources can only be provisioned in West US regions",
    "parameters": {
      "listOfAllowedLocations": { "value": ["West US", "West US 2"] }
     },
    "policyDefinitionId":"/subscriptions/{subscription-id}/providers/Microsoft.Authorization/policyDefinitions/{definition-name}",
      "scope":"/subscriptions/{subscription-id}"
  },
}
```

### View policy
To get a policy, use the [Get policy definition](https://docs.microsoft.com/rest/api/resources/policydefinitions#PolicyDefinitions_Get) operation.


## Manage policies with PowerShell

You can create a policy definition using the `New-AzureRmPolicyDefinition` cmdlet. The following example creates a policy for allowing resources only in North Europe and West Europe.

```powershell
$policy = New-AzureRmPolicyDefinition -Name regionPolicyDefinition -Description "Policy to allow resource creation only in certain regions" -Policy '{    
  "if" : {
    "not" : {
      "field" : "location",
      "in" : ["northeurope" , "westeurope"]
    }
  },
  "then" : {
    "effect" : "deny"
  }
}'
```            

The output of execution is stored in `$policy` object, and can be used later during policy assignment. For the policy parameter, the path to a .json file containing the policy can also be provided instead of specifying the policy inline.

```powershell
New-AzureRmPolicyDefinition -Name regionPolicyDefinition -Description "Policy to allow resource creation only in certain regions" -Policy "c:\policies\storageskupolicy.json"
```

You apply the policy at the desired scope by using the `New-AzureRmPolicyAssignment` cmdlet:

```powershell
New-AzureRmPolicyAssignment -Name regionPolicyAssignment -PolicyDefinition $policy -Scope /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}
```

To remove a policy assignment, use:

```powershell
Remove-AzureRmPolicyAssignment -Name regionPolicyAssignment -Scope /subscriptions/########-####-####-####-############/resourceGroups/<resource-group-name>
```

You can get, change, or remove policy definitions through Get-AzureRmPolicyDefinition, Set-AzureRmPolicyDefinition, and Remove-AzureRmPolicyDefinition cmdlets respectively.

Similarly, you can get, change, or remove policy assignments through the Get-AzureRmPolicyAssignment, Set-AzureRmPolicyAssignment, and Remove-AzureRmPolicyAssignment cmdlets respectively.

### View policy events in activity log
To view all events that related to deny effect, you can use the following PowerShell command:

```powershell
Get-AzureRmLog | where {$_.OperationName -eq "Microsoft.Authorization/policies/deny/action"} 
```

To view all events related to audit effect, you can use the following command:

```powershell
Get-AzureRmLog | where {$_.OperationName -eq "Microsoft.Authorization/policies/audit/action"} 
```

### View policy

To get a policy, use the following cmdlet:

```powershell
(Get-AzureRmPolicyAssignment -Id "/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/{definition-name}").Properties.policyRule | ConvertTo-Json
```

Which returns the JSON for the policy definition.


## Manage policies with Azure CLI 2.0 (Preview)

## Manage policies with Azure CLI 1.0

You can create a policy definition using the Azure CLI with the policy definition command. The following example creates a policy for allowing resources only in North Europe and West Europe.

```azurecli
azure policy definition create --name regionPolicyDefinition --description "Policy to allow resource creation only in certain regions" --policy-string '{    
  "if" : {
    "not" : {
      "field" : "location",
      "in" : ["northeurope" , "westeurope"]
    }
  },
  "then" : {
    "effect" : "deny"
  }
}'    
```

It is possible to specify the path to a .json file containing the policy instead of specifying the policy inline.

```azurecli
azure policy definition create --name regionPolicyDefinition --description "Policy to allow resource creation only in certain regions" --policy "path-to-policy-json-on-disk"
```

You can apply the policy to the desired scope by using the policy assignment command:

```azurecli
azure policy assignment create --name regionPolicyAssignment --policy-definition-id /subscriptions/########-####-####-####-############/providers/Microsoft.Authorization/policyDefinitions/<policy-name> --scope    /subscriptions/########-####-####-####-############/resourceGroups/<resource-group-name>
```

The scope here is the name of the resource group you specify. If the value of the parameter policy-definition-id is unknown, it is possible to obtain it through the Azure CLI. 

```azurecli
azure policy definition show <policy-name>
```

To remove a policy assignment, use:

```azurecli
azure policy assignment delete --name regionPolicyAssignment --scope /subscriptions/########-####-####-####-############/resourceGroups/<resource-group-name>
```

You can get, change, or remove policy definitions through policy definition show, set, and delete commands respectively.

Similarly, you can get, change, or remove policy assignments through the policy assignment show and delete commands respectively.

### View policy events in activity log
To view all events from a resource group that related to deny effect, you can use the following CLI command:

```azurecli
azure group log show ExampleGroup --json | jq ".[] | select(.operationName.value == \"Microsoft.Authorization/policies/deny/action\")"
```

To view all events related to audit effect, you can use the following CLI command:

```azurecli
azure group log show ExampleGroup --json | jq ".[] | select(.operationName.value == \"Microsoft.Authorization/policies/audit/action\")"
```

### View policy
To get a policy, use the following command:

```azurecli
azure policy definition show {definition-name} --json
```

## Next steps
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

