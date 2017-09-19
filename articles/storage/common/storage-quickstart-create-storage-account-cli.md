---
title: Azure Quickstart - Create a storage account using the Azure CLI | Microsoft Docs
description: Quickly learn to create a new storage account using the Azure CLI.
services: storage
documentationcenter: na
author: mmacy
manager: timlt
editor: tysonn

ms.assetid:
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 06/28/2017
ms.author: marsma
---

# Create a storage account using the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This Quickstart details using the Azure CLI to create an Azure Storage account.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Create resource group

Create an Azure resource group with the [az group create](/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed. This example creates a resource group named *myResourceGroup* in the *eastus* region.

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location eastus
```

If you're unsure which region to specify for the `--location` parameter, you can retrieve a list of supported regions for your subscription with the [az account list-locations](/cli/azure/account#list) command.

```azurecli-interactive
az account list-locations \
    --query "[].{Region:name}" \
    --out table
```

## Create a general-purpose standard storage account

There are several types of storage accounts appropriate for different usage scenarios, each of which supports one or more of the storage services (blobs, files, tables, or queues). The following table details the available storage account types.

|**Type of storage account**|**General-purpose Standard**|**General-purpose Premium**|**Blob storage, hot and cool access tiers**|
|-----|-----|-----|-----|
|**Services supported**| Blob, File, Table, Queue services | Blob service | Blob service|
|**Types of blobs supported**|Block blobs, page blobs, append blobs | Page blobs | Block blobs and append blobs|

Create a general-purpose standard storage account with the [az storage account create](/cli/azure/storage/account#create) command.

```azurecli-interactive
az storage account create \
    --name mystorageaccount \
    --resource-group myResourceGroup \
    --location eastus \
    --sku Standard_LRS \
    --encryption blob
```

## Clean up resources

If you no longer need any of the resources in your resource group, including the storage account you created in this Quickstart, delete the resource group with the [az group delete](/cli/azure/group#delete) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this Quickstart, you created a resource group and a general-purpose standard storage account. To learn how to transfer data to and from your storage account, continue to the Blob storage Quickstart.

> [!div class="nextstepaction"]
> [Work with blobs](../blobs/storage-quickstart-blobs-cli.md)