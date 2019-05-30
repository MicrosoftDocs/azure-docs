---
title: Azure CLI Script Sample - Calculate blob container size | Microsoft Docs
description: Calculate the size of a container in Azure Blob storage by totaling the size of the blobs in the container.
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
ms.date: 06/28/2017
ms.author: tamram
---

# Calculate the size of a Blob storage container

This script calculates the size of a container in Azure Blob storage by totaling the size of the blobs in the container.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

> [!IMPORTANT]
> This CLI script provides an estimated size for the container and should not be used for billing calculations.

## Sample script

[!code-azurecli[main](../../../cli_scripts/storage/calculate-container-size/calculate-container-size.sh?highlight=2-3 "Calculate container size")]

## Clean up deployment 

Run the following command to remove the resource group, container, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to calculate the size of the Blob storage container. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az storage blob upload](/cli/azure/storage/account) | Uploads local files to an Azure Blob storage container. |
| [az storage blob list](/cli/azure/storage/account/keys) | Lists the blobs in an Azure Blob storage container. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional storage CLI script samples can be found in the [Azure CLI samples for Azure Blob storage](../blobs/storage-samples-blobs-cli.md).
