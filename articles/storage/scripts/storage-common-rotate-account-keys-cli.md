---
title: Azure CLI Script Sample - Rotate storage account access keys | Microsoft Docs
description: Create an Azure Storage account, then retrieve and rotate its account access keys.
services: storage
documentationcenter: na
author: tamram
manager: timlt
editor: tysonn

ms.assetid:
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: sample
ms.date: 06/22/2017
ms.author: tamram
---

# Create a storage account and rotate its account access keys

This script creates an Azure Storage account, displays the new storage account's access keys, then renews (rotates) the keys.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/storage/rotate-storage-account-keys/rotate-storage-account-keys.sh "Rotate storage account keys")]

## Clean up deployment 

Run the following command to remove the resource group, storage account, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create the storage account and retrieve and rotate its access keys. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account) | Creates an Azure Storage account in the specified resource group. |
| [az storage account keys list](/cli/azure/storage/account/keys) | Displays the storage account access keys for the specified account. |
| [az storage account keys renew](/cli/azure/storage/account/keys) | Regenerates the primary or secondary storage account access key. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional storage CLI script samples can be found in the [Azure CLI samples for Azure Blob storage](../blobs/storage-samples-blobs-cli.md).
