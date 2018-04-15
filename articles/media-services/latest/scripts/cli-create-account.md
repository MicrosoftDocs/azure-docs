---
title: Azure CLI Script Example - Create a Azure Media Services account | Microsoft Docs
description: Use the Azure CLI script to create a Azure Media Services account.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: 

ms.assetid:
ms.service: media-services
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/15/2018
ms.author: juliako
---

# CLI example: Create a Azure Media Services account

This script creates an Azure Media Services account.

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Example script

[!code-azurecli-interactive[main](../../../../cli_scripts/media-services/media-services-create-account/media-services-create-account.sh "Create Account")]

## Clean up deployment

Run the following command to remove the
resource group and all resources associated with it.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az_storage_account_create) | Creates a storage account. |
| **az ams account create** | Creates the Media Services account. |
| **az ams account sp create** | Creates a service principal with password and configures its access to an Azure Media Services account. |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
