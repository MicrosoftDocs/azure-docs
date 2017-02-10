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
ms.date: 02/09/2017
ms.author: tomfitz

---
# Assign and manage resource policies

To implement a policy, you must perform three steps:

1. Define the policy rule with JSON. This topic describes the structure and syntax of the JSON for defining a policy. 
2. Create a policy definition in your subscription from the JSON you created in the preceding step. This step makes the policy available for assignment but does not apply the rules to your subscription.
3. Assign the policy to a scope (such as a subscription or resource group). The rules of the policy are now enforced.

Azure provides some pre-defined policies that may reduce the number of policies you have to define. If a pre-defined policy works for your scenario, skip the first two steps and assign the pre-defined policy to a scope.

## REST API

You can create a policy with the [REST API for Policy Definitions](https://docs.microsoft.com/rest/api/resources/policydefinitions). The REST API enables you to create and delete policy definitions, and get information about existing definitions.

To create a policy, run:

```HTTP
PUT https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.authorization/policydefinitions/{policyDefinitionName}?api-version={api-version}
```

For api-version, use `2016-12-01`. Include a request body similar to the following example:

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

The {policy-assignment} is the name of the policy assignment. For api-version use `2016-12-01` (for parameters). 

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

### Get aliases
You can retrieve aliases through the REST API (Powershell support will be added in the future):

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

### View policy

To get a policy, use the following cmdlet:

```powershell
(Get-AzureRmPolicyAssignment -Id "/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/{definition-name}").Properties.policyRule | ConvertTo-Json
```

Which returns the JSON for the policy definition.


## Azure CLI 2.0 (Preview)

## Azure CLI 1.0

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

### View policy
To get a policy, use the following command:

```azurecli
azure policy definition show {definition-name} --json
```

## Next steps
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

