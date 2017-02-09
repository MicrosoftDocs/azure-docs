---
title: Common resource policies for Azure resource types | Microsoft Docs
description: Provides examples of commonly-used resource policies. These examples apply to most resource types. 
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
ms.date: 02/03/2017
ms.author: tomfitz

---
# Common Azure resource policies 

This topic provides common policies you can apply to most resource types.

## Require tags
The following policy denies requests that don't have a tag containing "costCenter" key:

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

The following policy appends costCenter tag with a predefined value when no tags are present:

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

The following policy appends costCenter tag with a predefined value when the costCenter tag is not present, but other tags are present:

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

## Require tags for a resource type
The following example shows how to nest logical operators to require an application tag for only a specified resource type.

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

## Allowed resource locations
To specify which locations are allowed, use the built-in policy with the resource ID `/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c`.

The built-in policy contains a rule similar to:

```json
{
  "if" : {
    "not" : {
      "field" : "location",
      "in" : "[parameters('allowedLocations')]"
    }
  },
  "then" : {
    "effect" : "deny"
  }
}
```

To specify which locations are not allowed, use the following policy:

```json
{
  "if" : {
    "field" : "location",
    "in" : "[parameters('notAllowedLocations')]"
  },
  "then" : {
    "effect" : "deny"
  }
}
```

## Restrict resource types
The following example shows a policy that permits deployments for only on the `Microsoft.Resources/*`, `Microsoft.Compute/*`, `Microsoft.Storage/*`, `Microsoft.Network/*` resource types. All others are denied:

```json
{
  "if" : {
    "not" : {
      "anyOf" : [
        {
          "field" : "type",
          "like" : "Microsoft.Resources/*"
        },
        {
          "field" : "type",
          "like" : "Microsoft.Compute/*"
        },
        {
          "field" : "type",
          "like" : "Microsoft.Storage/*"
        },
        {
          "field" : "type",
          "like" : "Microsoft.Network/*"
        }
      ]
    }
  },
  "then" : {
    "effect" : "deny"
  }
}
```

### Set naming convention
The following example shows the use of wildcard, which is supported by the **like** condition. The condition states that if the name does match the mentioned pattern (namePrefix\*nameSuffix) then deny the request:

```json
{
  "if" : {
    "not" : {
      "field" : "name",
      "like" : "namePrefix*nameSuffix"
    }
  },
  "then" : {
    "effect" : "deny"
  }
}
```

## Next steps
* For an introduction to resource policies, see [Resource policy overview](resource-manager-policy.md).
* For storage policies, see [Resource policies for storage accounts](resource-manager-policy-storage.md).
* For Linux VM policies, see [Apply security and policies to Linux VMs with Azure Resource Manager](../virtual-machines/virtual-machines-linux-policy.md?toc=%2fazure%2fazure-resource-manager%2ftoc.json).
* For Windows VM policies, see [Apply security and policies to Windows VMs with Azure Resource Manager](../virtual-machines/virtual-machines-windows-policy.md?toc=%2fazure%2fazure-resource-manager%2ftoc.json.)
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

