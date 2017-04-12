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
ms.date: 03/30/2017
ms.author: tomfitz

---
# Apply resource policies for tags

This topic provides common policy rules you can apply to ensure consistent use of tags on resources.

Applying a tag policy to a resource group or subscription with existing resources does not retroactively apply the policy to those resources. To enforce the policies on those resources, trigger an update to the existing resources, as shown in [Trigger updates to existing resources](#trigger-updates-to-existing-resources).

## Ensure all resources in a resource group have a tag/value

A common requirement is that all resources in a resource group have a particular tag and value. This requirement is often needed to track costs by department. The following conditions must be met:

* The required tag and value are appended to new and updated resources that do not have any existing tags.
* The required tag and value are appended to new and updated resources that have other tags, but not the required tag and value.
* The required tag and value cannot be removed from any existing resources.

You accomplish this requirement by applying to a resource group the following three policies:

* [Append tag](#append-tag) 
* [Append tag with other tags](#append-tag-with-other-tags)
* [Require tag and value](#require-tag-and-value)

### Append tag

The following policy rule appends costCenter tag with a predefined value when no tags are present:

```json
{
  "if": {
    "field": "tags",
    "exists": "false"
  },
  "then": {
    "effect": "append",
    "details": [
      {
        "field": "tags",
        "value": {"costCenter":"myDepartment" }
      }
    ]
  }
}
```

### Append tag with other tags

The following policy rule appends costCenter tag with a predefined value when tags are present, but the costCenter tag is not defined:

```json
{
  "if": {
    "allOf": [
      {
        "field": "tags",
        "exists": "true"
      },
      {
        "field": "tags.costCenter",
        "exists": "false"
      }
    ]
  },
  "then": {
    "effect": "append",
    "details": [
      {
        "field": "tags.costCenter",
        "value": "myDepartment"
      }
    ]
  }
}
```

### Require tag and value

The following policy rule denies update or creation of resources that do not have the costCenter tag assigned to the predefined value.

```json
{
  "if": {
    "not": {
      "field": "tags.costCenter",
      "equals": "myDepartment"
    }
  },
  "then": {
    "effect": "deny"
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

## Trigger updates to existing resources

The following PowerShell script triggers an update to existing resources to enforce tag policies you have added.

```powershell
$group = Get-AzureRmResourceGroup -Name "ExampleGroup" 

$resources = Find-AzureRmResource -ResourceGroupName $group.ResourceGroupName 

foreach($r in $resources)
{
    try{
        $r | Set-AzureRmResource -Tags ($a=if($_.Tags -eq $NULL) { @{}} else {$_.Tags}) -Force -UsePatchSemantics
    }
    catch{
        Write-Host  $r.ResourceId + "can't be updated"
    }
}
```

## Next steps
* After defining a policy rule (as shown in the preceding examples), you need to create the policy definition and assign it to a scope. The scope can be a subscription, resource group, or resource. To assign policies through the portal, see [Use Azure portal to assign and manage resource policies](resource-manager-policy-portal.md). To assign policies through REST API, PowerShell or Azure CLI, see [Assign and manage policies through script](resource-manager-policy-create-assign.md).
* For an introduction to resource policies, see [Resource policy overview](resource-manager-policy.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

