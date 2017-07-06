---
title: Azure resource policies for tags | Microsoft Docs
description: Provides examples of resource policies for managing tags on resources
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
ms.date: 07/05/2017
ms.author: tomfitz

---
# Apply resource policies for tags

This topic provides common policy rules you can apply to ensure consistent use of tags on resources.

Applying a tag policy to a resource group or subscription with existing resources does not retroactively apply the policy to those resources. To enforce the policies on those resources, trigger an update to the existing resources, as shown in [Trigger updates to existing resources](#trigger-updates-to-existing-resources).

## Ensure all resources in a resource group have a tag/value

A common requirement is that all resources in a resource group have a particular tag and value. This requirement is often needed to track costs by department. The following conditions must be met:

* The required tag and value are appended to new and updated resources that do not have the tag.
* The required tag and value cannot be removed from any existing resources.

You accomplish this requirement by applying two built-in policies to a resource group.

| ID | Description |
| ---- | ---- |
| 2a0e14a6-b0a6-4fab-991a-187a4f81c498 | Applies a required tag and its default value when it is not specified by the user. |
| 1e30110a-5ceb-460c-a204-c1c3969c6d62 | Enforces a required tag and its value. |

### PowerShell

The following PowerShell script assigns the two built-in policy definitions to a resource group. Before running the script, assign all required tags to the resource group. Each tag on the resource group is required for the resources in the group. To assign to all resource groups in your subscription, do not provide the `-Name` parameter when getting the resource groups.

```powershell
$appendpolicy = Get-AzureRmPolicyDefinition | Where-Object {$_.Name -eq '2a0e14a6-b0a6-4fab-991a-187a4f81c498'}
$denypolicy = Get-AzureRmPolicyDefinition | Where-Object {$_.Name -eq '1e30110a-5ceb-460c-a204-c1c3969c6d62'}

$rgs = Get-AzureRMResourceGroup -Name ExampleGroup

foreach($rg in $rgs)
{
    $tags = $rg.Tags
    foreach($key in $tags.Keys){
        $key 
        $tags[$key]
        New-AzureRmPolicyAssignment -Name ("append"+$key+"tag") -PolicyDefinition $appendpolicy -Scope $rg.ResourceId -tagName $key -tagValue  $tags[$key]
        New-AzureRmPolicyAssignment -Name ("denywithout"+$key+"tag") -PolicyDefinition $denypolicy -Scope $rg.ResourceId -tagName $key -tagValue  $tags[$key]
    }
}
```

After assigning the policies, you can trigger an update to all existing resources to enforce the tag policies you have added. The following script retains any other tags that existed on the resources:

```powershell
$group = Get-AzureRmResourceGroup -Name "ExampleGroup" 

$resources = Find-AzureRmResource -ResourceGroupName $group.ResourceGroupName 

foreach($r in $resources)
{
    try{
        $r | Set-AzureRmResource -Tags ($a=if($r.Tags -eq $NULL) { @{}} else {$r.Tags}) -Force -UsePatchSemantics
    }
    catch{
        Write-Host  $r.ResourceId + "can't be updated"
    }
}
```

## Require tags for a resource type
The following example shows how to nest logical operators to require an application tag for only a specified resource type (in this case, storage accounts).

```json
{
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
    "then": {
        "effect": "audit"
    }
}
```

## Require tag
The following policy denies requests that don't have a tag containing "costCenter" key (any value can be applied):

```json
{
  "if": {
    "not" : {
      "field" : "tags",
      "containsKey" : "costCenter"
    }
  },
  "then" : {
    "effect" : "deny"
  }
}
```

## Next steps
* After defining a policy rule (as shown in the preceding examples), you need to create the policy definition and assign it to a scope. The scope can be a subscription, resource group, or resource. To assign policies through the portal, see [Use Azure portal to assign and manage resource policies](resource-manager-policy-portal.md). To assign policies through REST API, PowerShell or Azure CLI, see [Assign and manage policies through script](resource-manager-policy-create-assign.md).
* For an introduction to resource policies, see [Resource policy overview](resource-manager-policy.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

