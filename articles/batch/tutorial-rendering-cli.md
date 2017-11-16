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

Create a standard storage account in your resource group with the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command. In this tutorial, you use the storage account to store input 3ds Max scenes and the rendered output.

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
## Upload 3ds Max scenes to storage

Download sample 3ds Max scene files from [here](TBD) to a working directory on your local computer. 

Export environment variables to access the Azure storage account. The first bash shell command uses the [az storage account keys list](/cli/azure/storage/account/keys#az_storage_account_keys_list) command to get the first account key.

```azurecli-interactive
# Get first key
export AZURE_STORAGE_KEY=$(az storage account keys list --account-name myStorageAccount --resource-group myResourceGroup -o tsv --query [0].value)

export AZURE_STORAGE_ACCOUNT=myStorageAccount
```

Create a blob container in the storage account for the scene file data. The following example uses the [az storage container create](/cli/azure/storage/container#az_storage_container_create) command to create a blob container named *scenefiles* that allows public read access.

```azurecli-interactive
az storage container create --public-access blob --name scenefiles
```

Now upload the scene files from your local working folder to the blob container, using the [az storage blob upload-batch](/cli/azure/storage/blob#az_storage_blob_upload_batch) command:

```azurecli-interactive
az storage blob upload-batch --destination scenefiles --source .
```


## Create a Batch pool

Create a Batch pool for rendering using the [az batch pool create](/cli/azure/batch/pool#az_batch_pool_create) command. In this example, you use a local JSON file with the pool settings.

Create a local JSON file named *mypool.json* with the following content. The pool specified consists of a single low priority compute node running a Windows Server rendering image licensed to the Batch Rendering service for 3ds Max and Arnold. 

```JSON
{
  "id": "myrenderpool",
  "vmSize": "standard_d1_v2",
  "virtualMachineConfiguration": {
    "imageReference": {
      "publisher": "batch",
      "offer": "rendering-windows2016",
      "sku": "rendering",
      "version": "latest"
    },
    "nodeAgentSKUId": "batch.node.windows amd64"
  },
  "targetDedicatedComputeNodes": 0,
  "targetLowPriorityComputeNodes": 1,
  "enableAutoScale": false,
  "applicationLicenses":[
         "3dsmax",
         "arnold"
      ],
  "enableInterNodeCommunication": false 
}
```

Create the pool by passing the JSON file to the `az batch pool create` command:

```azurecli-interactive
az batch pool create --json-file mypool.json
``` 

##





In this tutorial, you learned about  how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

