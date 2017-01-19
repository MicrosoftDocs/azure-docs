---
title: Azure Resource Manager policies for storage | Microsoft Docs
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
ms.date: 01/18/2017
ms.author: tomfitz

---
# Apply resource policies to Azure storage accounts
Azure Resource Manager enables you to control access through custom policies. With policies, you can prevent users in your organization from breaking conventions that are needed to manage your organization's resources. 

## Ensure storage account type

For more information about the storge account types, see [Azure Storage replication](../storage/storage-redundancy.md).

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
          "allof": [
            {
              "field": "Microsoft.Storage/storageAccounts/sku.name",
              "in": [
                "Standard_LRS",
                "Standard_GRS"
              ]
            }
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

## Ensure access tier

For more information about access tiers, see [Azure Blob Storage: Hot and cool storage tiers](../storage/storage-blob-storage-tiers.md).

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
          "allof": [
            {
              "field": "Microsoft.Storage/storageAccounts/accessTier",
              "equals": "cool"
            }
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

Or, you can use a parameter to pass in permitted values.

```json
{
  "properties": {
    "parameters": {
      "accessTier": {
        "type": "string"
      }
    },
    "policyRule": {
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
              "equals": "[parameters('accessTier')]"
            }
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    }
  }
}
```

## Ensure encryption is on

For more information about encryption and storage accounts, see [Azure Storage Service Encryption for Data at Rest](../storage/storage-service-encryption.md).

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
          "allof": [
            {
              "field": "Microsoft.Storage/storageAccounts/enableBlobEncryption",
              "equals": "true"
            }
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

## Next steps
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

