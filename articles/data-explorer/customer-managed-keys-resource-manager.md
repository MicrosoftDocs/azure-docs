---
title: Configure customer-managed-keys in Azure Data Explorer using the Azure Resource Manager template
description: This article describes how to configure customer-managed keys encryption on your data in Azure Data Explorer using the Azure Resource Manager template.
author: saguiitay
ms.author: itsagui
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/06/2020
---

# Configure customer-managed-keys using the Azure Resource Manager template

> [!div class="op_single_selector"]
> * [C#](customer-managed-keys-csharp.md)
> * [Azure Resource Manager template](customer-managed-keys-resource-manager.md)

[!INCLUDE [data-explorer-configure-customer-managed-keys](../../includes/data-explorer-configure-customer-managed-keys.md)]

## Configure encryption with customer-managed keys

In this section, you configure customer-managed keys using Azure Resource Manager templates. By default, Azure Data Explorer encryption uses Microsoft-managed keys. In this step, configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

You can deploy the Azure Resource Manager template by using the Azure portal or using PowerShell.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "type": "string",
      "defaultValue": "[concat('kusto', uniqueString(resourceGroup().id))]",
      "metadata": {
        "description": "Name of the cluster to create"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    }
  },
  "variables": {},
  "resources": [
    {
      "name": "[parameters('clusterName')]",
      "type": "Microsoft.Kusto/clusters",
      "sku": {
        "name": "Standard_D13_v2",
        "tier": "Standard",
        "capacity": 2
      },
      "apiVersion": "2019-09-07",
      "location": "[parameters('location')]",
      "properties": {
        "keyVaultProperties": {
          "keyVaultUri": "<keyVaultUri>",
          "keyName": "<keyName>",
          "keyVersion": "<keyVersion"
        }
      }
    }
  ]
}
```

## Update the key version

When you create a new version of a key, you'll need to update the cluster to use the new version. First, call `Get-AzKeyVaultKey` to get the latest version of the key. Then update the cluster's key vault properties to use the new version of the key, as shown in [Configure encryption with customer-managed keys](#configure-encryption-with-customer-managed-keys).

## Next steps

* [Secure Azure Data Explorer clusters in Azure](security.md)
* [Configure managed identities for your Azure Data Explorer cluster](managed-identities.md)
* [Secure your cluster in Azure Data Explorer - Azure portal](manage-cluster-security.md) by enabling encryption at rest.
* [Configure customer-managed-keys using C#](customer-managed-keys-csharp.md)

