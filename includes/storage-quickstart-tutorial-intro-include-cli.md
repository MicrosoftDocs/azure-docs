---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
## Create a resource group

Create an Azure resource group with the [az group create](/cli/azure/group) command. A resource group is a logical container into which Azure resources are deployed and managed.

```azurecli-interactive
az group create \
    --name myResourceGroup \
    --location eastus
```

## Create a storage account

Create a general-purpose storage account with the [az storage account create](/cli/azure/storage/account) command. The general-purpose storage account can be used for all four services: blobs, files, tables, and queues. 

```azurecli-interactive
az storage account create \
    --name mystorageaccount \
    --resource-group myResourceGroup \
    --location eastus \
    --sku Standard_LRS \
    --encryption blob
```

## Specify storage account credentials

The Azure CLI needs your storage account credentials for most of the commands in this tutorial. While there are several options for doing so, one of the easiest ways to provide them is to set `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_KEY` environment variables.

First, display your storage account keys by using the [az storage account keys list](/cli/azure/storage/account/keys) command:

```azurecli-interactive
az storage account keys list \
    --account-name mystorageaccount \
    --resource-group myResourceGroup \
    --output table
```

Now, set the `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_KEY` environment variables. You can do this in the Bash shell by using the `export` command:

```bash
export AZURE_STORAGE_ACCOUNT="mystorageaccountname"
export AZURE_STORAGE_KEY="myStorageAccountKey"
```
