---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 11/06/2019
ms.author: tamram
---

## Create a resource group

Create an Azure resource group with the [az group create](/cli/azure/group) command. A resource group is a logical container into which Azure resources are deployed and managed.

Remember to replace placeholder values in angle brackets with your own values:

```azurecli-interactive
az group create \
    --name <resource-group-name> \
    --location <location>
```

## Create a storage account

Create a general-purpose storage account with the [az storage account create](/cli/azure/storage/account) command. The general-purpose storage account can be used for all four services: blobs, files, tables, and queues.

Remember to replace placeholder values in angle brackets with your own values:

```azurecli-interactive
az storage account create \
    --name <account-name> \
    --resource-group <resource-group-name> \
    --location <location> \
    --sku Standard_ZRS \
    --encryption blob
```

## Specify storage account credentials

The Azure CLI needs your storage account credentials for most of the commands in this tutorial. While there are several options for doing so, one of the easiest ways to provide them is to set `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_KEY` environment variables.

> [!NOTE]
> This article shows how to set environment variables using Bash. Other environments may require syntax modifications.

First, display your storage account keys by using the [az storage account keys list](/cli/azure/storage/account/keys) command. Remember to replace placeholder values in angle brackets with your own values:

```azurecli-interactive
az storage account keys list \
    --account-name <account-name> \
    --resource-group <resource-group-name> \
    --output table
```

Now, set the `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_KEY` environment variables. You can do this in the Bash shell by using the `export` command. Remember to replace placeholder values in angle brackets with your own values:

```bash
export AZURE_STORAGE_ACCOUNT="<account-name>"
export AZURE_STORAGE_KEY="<account-key>"
```

For more information on how to retrieve the account access keys using the Azure portal, see [Manage storage account access keys](../articles/storage/common/storage-account-keys-manage.md).