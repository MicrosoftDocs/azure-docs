---
title: Assign and manage Azure resource policies | Microsoft Docs
description: Describes how to apply Azure resource policies to subscriptions and resource groups, and how to view resource policies. 
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/29/2017
ms.author: tomfitz

---
# Assign and manage resource policies

To implement a policy, you must perform these steps:

1. Check policy definitions (including built-in policies provided by Azure) to see if one already exists in your subscription that fulfills your requirements.
2. If one exists, get its name.
3. If one does not exist, define the policy rule with JSON, and add it as a policy definition in your subscription. This step makes the policy available for assignment but does not apply the rules to your subscription.
4. For either case, assign the policy to a scope (such as a subscription or resource group). The rules of the policy are now enforced.

This article focuses on the steps to create a policy definition and assign that definition to a scope through REST API, PowerShell, or Azure CLI. If you prefer to use the portal to assign policies, see [Use Azure portal to assign and manage resource policies](resource-manager-policy-portal.md). This article does not focus on the syntax for creating the policy definition. For information about policy syntax, see [Resource policy overview](resource-manager-policy.md).

## REST API

### Create policy definition

You can create a policy with the [REST API for Policy Definitions](/rest/api/resources/policydefinitions). The REST API enables you to create and delete policy definitions, and get information about existing definitions.

To create a policy definition, run:

```HTTP
PUT https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.authorization/policydefinitions/{policyDefinitionName}?api-version={api-version}
```

Include a request body similar to the following example:

```json
{
  "properties": {
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

### Assign policy

You can apply the policy definition at the desired scope through the [REST API for policy assignments](/rest/api/resources/policyassignments). The REST API enables you to create and delete policy assignments, and get information about existing assignments.

To create a policy assignment, run:

```HTTP
PUT https://management.azure.com /subscriptions/{subscription-id}/providers/Microsoft.authorization/policyassignments/{policyAssignmentName}?api-version={api-version}
```

The {policy-assignment} is the name of the policy assignment.

Include a request body similar to the following example:

```json
{
  "properties":{
    "displayName":"West US only policy assignment on the subscription ",
    "description":"Resources can only be provisioned in West US regions",
    "parameters": {
      "allowedLocations": { "value": ["northeurope", "westus"] }
     },
    "policyDefinitionId":"/subscriptions/{subscription-id}/providers/Microsoft.Authorization/policyDefinitions/{definition-name}",
      "scope":"/subscriptions/{subscription-id}"
  },
}
```

### View policy
To get a policy, use the [Get policy definition](https://docs.microsoft.com/rest/api/resources/policydefinitions#PolicyDefinitions_Get) operation.

### Get aliases
You can retrieve aliases through the REST API:

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

## PowerShell

Before proceeding with the PowerShell examples, make sure you have [installed the latest version](/powershell/azure/install-azurerm-ps) of Azure PowerShell. Policy parameters were added in version 3.6.0. If you have an earlier version, the examples return an error indicating the parameter cannot be found.

### View policy definitions
To see all policy definitions in your subscription, use the following command:

```powershell
Get-AzureRmPolicyDefinition
```

It returns all available policy definitions, including built-in policies. Each policy is returned in the following format:

```powershell
Name               : e56962a6-4747-49cd-b67b-bf8b01975c4c
ResourceId         : /providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c
ResourceName       : e56962a6-4747-49cd-b67b-bf8b01975c4c
ResourceType       : Microsoft.Authorization/policyDefinitions
Properties         : @{displayName=Allowed locations; policyType=BuiltIn; description=This policy enables you to
                     restrict the locations your organization can specify when deploying resources. Use to enforce
                     your geo-compliance requirements.; parameters=; policyRule=}
PolicyDefinitionId : /providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c
```

Before proceeding to create a policy definition, look at the built-in policies. If you find a built-in policy that applies the limits you need, you can skip creating a policy definition. Instead, assign the built-in policy to the desired scope.

### Create policy definition
You can create a policy definition using the `New-AzureRmPolicyDefinition` cmdlet.

```powershell
$policy = New-AzureRmPolicyDefinition -Name coolAccessTier -Description "Policy to specify access tier." -Policy '{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Storage/storageAccounts"
      },
      {
        "field": "kind",
        "equals": "BlobStorage"
      },
      {
        "not": {
          "field": "Microsoft.Storage/storageAccounts/accessTier",
          "equals": "cool"
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}'
```            

The output is stored in a `$policy` object, which is used during policy assignment. 

Rather than specifying the JSON as a parameter, you can provide the path to a .json file containing the policy rule.

```powershell
$policy = New-AzureRmPolicyDefinition -Name coolAccessTier -Description "Policy to specify access tier." -Policy "c:\policies\coolAccessTier.json"
```

### Assign policy

You apply the policy at the desired scope by using the `New-AzureRmPolicyAssignment` cmdlet. The following example assigns the policy to a resource group.

```powershell
$rg = Get-AzureRmResourceGroup -Name "ExampleGroup"
New-AzureRMPolicyAssignment -Name accessTierAssignment -Scope $rg.ResourceId -PolicyDefinition $policy
```

To assign a policy that requires parameters, create and object with those values. The following example retrieves a built-in policy and passes in parameters values:

```powershell
$rg = Get-AzureRmResourceGroup -Name "ExampleGroup"
$policy = Get-AzureRmPolicyDefinition -Id /providers/Microsoft.Authorization/policyDefinitions/e5662a6-4747-49cd-b67b-bf8b01975c4c
$array = @("West US", "West US 2")
$param = @{"listOfAllowedLocations"=$array}
New-AzureRMPolicyAssignment -Name locationAssignment -Scope $rg.ResourceId -PolicyDefinition $policy -PolicyParameterObject $param
```

### View policy assignment

To get a specific policy assignment, use:

```powershell
$rg = Get-AzureRmResourceGroup -Name "ExampleGroup"
(Get-AzureRmPolicyAssignment -Name accessTierAssignment -Scope $rg.ResourceId
```

To view the policy rule for a policy definition, use:

```powershell
(Get-AzureRmPolicyDefinition -Name coolAccessTier).Properties.policyRule | ConvertTo-Json
```

### Remove policy assignment 

To remove a policy assignment, use:

```powershell
Remove-AzureRmPolicyAssignment -Name regionPolicyAssignment -Scope /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}
```

## Azure CLI

### View policy definitions
To see all policy definitions in your subscription, use the following command:

```azurecli
az policy definition list
```

It returns all available policy definitions, including built-in policies. Each policy is returned in the following format:

```azurecli
{                                                            
  "description": "This policy enables you to restrict the locations your organization can specify when deploying resources. Use to enforce your geo-compliance requirements.",                      
  "displayName": "Allowed locations",                                                                                                                "id": "/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c",                                                 "name": "e56962a6-4747-49cd-b67b-bf8b01975c4c",                                                                                                    "policyRule": {                                                                                                                                      "if": {                                                                                                                                              "not": {                                                                                                                                             "field": "location",                                                                                                                               "in": "[parameters('listOfAllowedLocations')]"                                                                                                   }                                                                                                                                                },                                                                                                                                                 "then": {                                                                                                                                            "effect": "Deny"                                                                                                                                 }                                                                                                                                                },                                                                                                                                                 "policyType": "BuiltIn"
}
```

Before proceeding to create a policy definition, look at the built-in policies. If you find a built-in policy that applies the limits you need, you can skip creating a policy definition. Instead, assign the built-in policy to the desired scope.

### Create policy definition

You can create a policy definition using Azure CLI with the policy definition command.

```azurecli
az policy definition create --name coolAccessTier --description "Policy to specify access tier." --rules '{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Storage/storageAccounts"
      },
      {
        "field": "kind",
        "equals": "BlobStorage"
      },
      {
        "not": {
          "field": "Microsoft.Storage/storageAccounts/accessTier",
          "equals": "cool"
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}'    
```

### Assign policy

You can apply the policy to the desired scope by using the policy assignment command. The following example assigns a policy to a resource group.

```azurecli
az policy assignment create --name coolAccessTierAssignment --policy coolAccessTier --scope /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}
```

### View policy assignment

To view a policy assignment, provide the policy assignment name and the scope:

```azurecli
az policy assignment show --name coolAccessTierAssignment --scope "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}"
```

### Remove policy assignment 

To remove a policy assignment, use:

```azurecli
az policy assignment delete --name coolAccessTier --scope /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}
```

## Next steps
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

