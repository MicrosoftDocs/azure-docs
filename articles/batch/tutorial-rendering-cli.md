---
title: Render a scene with Arnold - Azure Batch CLI | Microsoft Docs
description: Tutorial - Step by step instructions to render an Autodesk 3ds Max scene with Arnold using the Batch Rendering Service and Azure CLI
services: batch
documentationcenter: 
author: dlepow
manager: jeconnoc
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: 
ms.topic: tutorial
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 11/15/2017
ms.author: danlep
ms.custom: mvc
---

# Render a 3ds Max scene with Arnold using the Batch Rendering service

Azure Batch provides cloud-scale rendering capabilities on a pay-per-use basis. The Batch Rendering service supports Autodesk Maya, 3ds Max, Arnold, and V-Ray. This tutorial shows you the steps to render a 3ds Max scene with Batch using the Arnold ray-tracing renderer. You learn how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z


## Prerequisites

This tutorial requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create a Batch account

If you haven't already done so, you need to create a resource group, a storage account, and a Batch account in your subscription. 

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Create a standard storage acccount in your resource group with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command. In this tutorial, you use the storage account to store input 3ds Max scenes and the rendered output.

```azurecli-interactive
az storage account create --resource-group myResourceGroup --name myStorageAccount --location eastus --sku Standard_LRS
```
Create a Batch account with the [az batch account create](/cli/azure/batch/account#az_batch_account_create) command. The following example creates a Batch account named *myBatchAccount* in *myResourceGroup*, and links the storage account you created.  

```azurecli-interactive 
az batch account create --name myBatchAccount --storage-account myStorageAccount --resource-group myResourceGroup --location eastus
```

Log in to the account with the [az batch account login](/cli/azure/batch/account#az_batch_account_login) command. This example uses shared key authentication, based on the Batch account key. After you log in, you create and manage compute pools and rendering jobs in that account.

```azurecli-interactive 
az batch account login --name myBatchAccount --resource-group myResourceGroup --shared-key-auth
```
## Upload 3ds Max scenes

Download sample 3ds Max scene data from [here](TBD) to your local computer.

Export environment variables to access Azure storage account

```azurecli-interactive
# Get first key
export AZURE_STORAGE_KEY=$(az storage account keys list     --account-name danlep1110     --resource-group danlep1110 -o tsv    --query [0].value)

export AZURE_STORAGE_ACCOUNT=danlep1110
```

# Create blob container
# This container allows public read access for blobs



az storage container create --public-access blob --name maxfile

## Create a Batch pool

##





In this tutorial, you learned about  how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

