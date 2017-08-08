---
title: Automate the resizing of uploaded images using Event Grid | Microsoft Docs
description: Azure Event Grid can trigger on blob uploads in Azure Storage. You can use this to send uploaded image files to other services, such as Azure Functions, for resizing and other improvements.
services: event-grid
author: ggailey777
manager: cfowler
editor: ''

ms.service: event-grid
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/21/2017
ms.author: glenga
ms.custom: mvc
---
# Automate the resizing of uploaded images using Event Grid

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Storage account
> * Create blob containers in Azure Storage
> * Create a serverless function in Azure Functions
> * Create an Event Grid 
> * Deploy a web app to Azure


## Prerequisites

To complete this quickstart:
* [Install Git](https://git-scm.com/)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Download the sample app locally

In a terminal window, run the following commands. This will clone the sample application to your local machine and navigate to the directory containing the sample code.

```bash
git clone https://github.com/Azure-Samples/integration-image-upload-resize-storage-functions
cd integration-image-upload-resize-storage-functions
```
## Create an Azure Storage account

Images are uploaded to blob containers in an Azure Storage account.   Create a storage account in the resource group you created by using the [az storage account create](/cli/azure/storage/account#create) command.

In the following command, substitute your own globally unique storage account name where you see the `<storage_name>` placeholder. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.

```azurecli-interactive
az storage account create --name <storage_name> --location westeurope --resource-group myResourceGroup --sku Standard_LRS
```
After the storage account is created, the Azure CLI shows information similar to the following example:

```json
{
  "creationTime": "2017-04-15T17:14:39.320307+00:00",
  "id": "/subscriptions/bbbef702-e769-477b-9f16-bc4d3aa97387/resourceGroups/myresourcegroup/...",
  "kind": "Storage",
  "location": "westeurope",
  "name": "myfunctionappstorage",
  "primaryEndpoints": {
    "blob": "https://myfunctionappstorage.blob.core.windows.net/",
    "file": "https://myfunctionappstorage.file.core.windows.net/",
    "queue": "https://myfunctionappstorage.queue.core.windows.net/",
    "table": "https://myfunctionappstorage.table.core.windows.net/"
  },
     ....
    // Remaining output has been truncated for readability.
}
```
## Configure storage

Get the key for the storage account. This shared key is used by the app to access the storage account. 

```azurecli-interactive
az storage account keys list -g MyResourceGroup -n <storage_name>
```

```azurecli-interactive
z storage container create -n images --account-name glengateststorage --account-key KIdx3k/GrOlRZrPXAFxdiLvjBmM3EJN+obcYibYU2w4bfKuECIRgdEpHxCMqx1/pH2segbcZjUw/o6ceBpa42g==H
```
```json
{
  "created": true
}
```

## Configure the sample app

In the sample app you downloaded, open the appsettings.json file. Set AzureStorageConfig.AccountName and AzureStorageConfig.AccountKey to the name of the storage account and the key.  

## Create the event grid

## Create the function



## Test the sample app locally

## Deploy to Azure

## Test the sample app in Azure