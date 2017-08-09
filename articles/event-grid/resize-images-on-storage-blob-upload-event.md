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
ms.date: 08/09/2017
ms.author: glenga
ms.custom: mvc
---
# Automate the resizing of uploaded images using Event Grid

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Storage account
> * Define blob containers in Azure Storage
> * Deploy serverless function code using Azure Functions
> * Configure Event Grid 
> * Deploy a web app to Azure


## Prerequisites

To complete this quickstart:
* [Install Git](https://git-scm.com/).
* You need an active [GitHub](https://github.com) account.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Download the sample app locally

In a terminal window, run the following commands. This clones the sample application to your local machine and navigates to the directory that contains the sample.

```bash
git clone https://github.com/Azure-Samples/integration-image-upload-resize-storage-functions
cd integration-image-upload-resize-storage-functions
```
## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources like topics and subscriptions, function apps, and storage accounts are deployed and managed.

The following example creates a resource group named `myResourceGroup`.  
If you are not using Cloud Shell, you must first sign in using `az login`.

```azurecli-interactive
az group create --name myResourceGroup --location westeurope
```

## Create an Azure Storage account

The sample uploads images to a blob container in an Azure Storage account. Create a storage account in the resource group you created by using the [az storage account create](/cli/azure/storage/account#create) command.

In the following command, substitute your own globally unique storage account name where you see the `<storage_name>` placeholder. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.

```azurecli-interactive
az storage account create --name <storage_name> \
--location westeurope --resource-group myResourceGroup \
--sku Standard_LRS
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

The app uses two blob containers: _images_ for uploaded images, and _thumbs_ for resized thumbnail images. The following commands get the first shared key for the storage account and use it to create the two containers. 

```azurecli-interactive
storageaccount=<storage_name>

storageAccountKey=$(az storage account keys list -g myResourceGroup \
-n $storageaccount --query [0].value --output tsv)

az storage container create -n images --account-name $storageaccount \ 
--account-key $storageAccountKey

az storage container create -n thumbs --account-name $storageaccount \ 
--account-key $storageAccountKey


```
After the blob containers are created, you can configure the sample app to connect to your storage account.

## Configure the sample app

In the sample app you downloaded, open the appsettings.json file. Set AzureStorageConfig.AccountName and AzureStorageConfig.AccountKey to the name of the storage account and the key.  

## Create a function app  

You must have a function app to host the execution of your functions. The function app provides an environment for serverless execution of your function code. Create a function app by using the [az functionapp create](/cli/azure/functionapp#create) command. 

In the following command, substitute your own unique function app name where you see the `<app_name>` placeholder. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. $storageaccount is the storage account name variable defined in the previous command.  

```azurecli-interactive
$functionapp=<app_name>

az functionapp create --name $functionapp --storage-account  $storageaccount  \
--resource-group myResourceGroup --consumption-plan-location westeurope
```
You can now use Git to deploy your function code to this function app.

## Deploy the image resizing function code 

The function code that performs image resizing is available in a public GitHub repo: <https://github.com/Azure-Samples/function-image-upload-resize>. In the following command, $functionapp is the same function app name variable defined in the previous script.

```azurecli-interactive
az functionapp deployment source config --name $functionapp \
 --resource-group myResourceGroup \
 --repo-url https://github.com/Azure-Samples/function-image-upload-resize \
 --branch master \
 --manual-integration
```

The function code is deployed directly from the public sample repo. To learn more about deployment options for Azure Functions, see [Continuous deployment for Azure Functions](../azure-functions/functions-continuous-deployment.md).

## Configure function app settings

## Configure the event grid

## Test the sample app locally

## Deploy to Azure

## Test the sample app in Azure