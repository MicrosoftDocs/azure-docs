---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Intent and product brand in a unique string of 43-59 chars including spaces - do not include site identifier (it is auto-generated.)
description: 115-145 characters including spaces. Edit the intro para describing article intent to fit here. This abstract displays in the search result.
services: service-name-with-dashes-AZURE-ONLY
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: github-alias
ms.author: MSFT-alias-person-or-DL
ms.date: 12/22/2017
ms.topic: quickstart
ms.service: service-name-from-white-list


# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: mvc
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---

# H1 article title
Introductory paragraph

Install CLI
Get CLI context
Create share
Create directory
Upload file
List files
Copy files

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a storage account

Create an Azure storage account with [az storage account create](/cli/azure/storage/account#create) to store the actual files.

    To create a storage account named mystorageaccount by using the Standard_LRS storage SKU, use the following example:

    ```azurecli
    az storage account create --resource-group myResourceGroup \
        --name mystorageaccount \
        --location westus \
        --sku Standard_LRS
    ```

## Get the storage account keys.

    View the storage account keys with the [az storage account keys list](/cli/azure/storage/account/keys#list). The storage account keys for the named `mystorageaccount` are listed in the following example:

    ```azurecli
    az storage account keys list --resource-group myResourceGroup \
        --account-name mystorageaccount
    ```

    To extract a single key, use the `--query` flag. The following example extracts the first key (`[0]`):

    ```azurecli
    az storage account keys list --resource-group myResourceGroup \
        --account-name mystorageaccount \
        --query '[0].{Key:value}' --output tsv
    ```

## Create a file share.

    The File storage share contains the SMB share with [az storage share create](/cli/azure/storage/share#create). The quota is always expressed in gigabytes (GB). Pass in one of the keys from the preceding `az storage account keys list` command. Create a share named mystorageshare with a 10-GB quota by using the following example:

    ```azurecli
    az storage share create --name mystorageshare \
        --quota 10 \
        --account-name mystorageaccount \
        --account-key nPOgPR<--snip-->4Q==
    ```

## Create directory


## Upload a file

To upload a file,  use [az storage file upload](/cli/azure/storage/file#az_storage_file_upload).

To upload a batch of files, use [az storage file upload-batch](/cli/azure/storage/file#az_storage_file_upload-batch)

## List files

[az storage file list](/cli/azure/storage/file#az_storage_file_list).


## Copy files

{az storage file copy}(/cli/azure/storage/file/copy)

## Clean up resources
Add the steps to avoid additional costs

## Next steps
A brief sentence with a link surrounded by the blue box

Advance to the next article to learn more
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

