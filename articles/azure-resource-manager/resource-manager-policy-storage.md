---
title: Azure resource policies for storage accounts | Microsoft Docs
description: Describes Azure Resource Manager policies for managing the deployment of storage accounts.
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
ms.date: 02/08/2017
ms.author: tomfitz

---
# Apply resource policies to storage accounts
This topic shows several [resource policies](resource-manager-policy.md) you can apply to Azure storage accounts. These policies ensure consistency for the storage accounts deployed in your organization. 

## Define permitted storage account types

The following policy restricts which [storage account types](../storage/storage-redundancy.md) can be deployed:

```json
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Storage/storageAccounts"
      },
      {
        "not": {
          "field": "Microsoft.Storage/storageAccounts/sku.name",
          "in": [
            "Standard_LRS",
            "Standard_GRS"
          ]
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
```

## Define permitted access tier

The following policy specifies the type of [access tier](../storage/storage-blob-storage-tiers.md) that can be specified for storage accounts:

```json
{
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
}
```

## Ensure encryption is enabled

The following policy requires all storage accounts to enable [Storage service encryption](../storage/storage-service-encryption.md):

```json
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Storage/storageAccounts"
      },
      {
        "not": {
          "field": "Microsoft.Storage/storageAccounts/enableBlobEncryption",
          "equals": "true"
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
```

## Create and assign policies

After defining a policy rule (as shown in the preceding examples), you need to create the policy and assign it to a scope. The scope can be a subscription, resource group, or resource. For examples on creating and assigning policies, see [Create and assign a policy](resource-manager-policy.md#create-and-assign-a-policy). 

## Next steps
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

