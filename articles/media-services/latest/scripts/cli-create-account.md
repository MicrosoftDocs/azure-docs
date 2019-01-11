---
title: Create a Azure Media Services account - Azure CLI| Microsoft Docs
description: Use the Azure CLI script to create a Azure Media Services account.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: 

ms.assetid:
ms.service: media-services
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/11/2018
ms.author: juliako
---

# CLI example: Create an Azure Media Services account

The Azure CLI script in this topic shows how to create an Azure Media Services account.

## Prerequisites 

Install and use the CLI locally, this article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

Currently, not all [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) commands work in the Azure Cloud Shell. It is recommended to use the CLI locally.

## Example script

[!code-azurecli-interactive[main](../../../../cli_scripts/media-services/media-services-create-account/Create-Account.sh "Create Account")]

## Clean up deployment

Run the following command to remove the
resource group and all resources associated with it.

```azurecli
az group delete --name amsResourceGroup
```

## Script explanation

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az storage account create](/cli/azure/storage/account#az-storage-account-create) | Creates a storage account. |
| [az ams account create](https://docs.microsoft.com/cli/azure/ams/account?view=azure-cli-latest#az-ams-account-create) | Creates a Media Services account. |
| [az ams account sp create](https://docs.microsoft.com/cli/azure/ams/account/sp?view=azure-cli-latest#az-ams-account-sp-create) | Creates a service principal with password and configures its access to an Azure Media Services account. 
| [az group delete](/cli/azure/group#az-group-delete) | Deletes a resource group including all nested resources. |


## Next steps

For more examples, see [Azure CLI samples](../cli-samples.md).
