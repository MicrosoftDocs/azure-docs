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
ms.date: 08/11/2017
ms.author: glenga
ms.custom: mvc
---
# Automate the resizing of uploaded images using Event Grid

>intro here

![Published web app in Edge browser](./media/resize-images-on-storage-blob-upload-event/tutorial-completed.png) 
In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Storage account
> * Define blob containers in Azure Storage
> * Deploy serverless function code using Azure Functions
> * Create a custom Event Grid topic 
> * Subscribe to a topic
> * Deploy a web app to Azure

## Prerequisites

To complete this quickstart:
* Install [Visual Studio 2017 version 15.3](https://www.visualstudio.com/downloads/), or a later version, with the following workloads:
    - **ASP.NET and web development**
    - **Azure development**
    ![ASP.NET and web development and Azure development (under Web & Cloud)](media/resize-images-on-storage-blob-upload-event/workloads.png)

* Install [Git](https://git-scm.com/). You also need a [GitHub](https://github.com) account.


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Download the sample app locally

In a terminal window, run the following commands. These commands clone the sample application to your local machine and navigate to the directory that contains the sample.

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

## Configure storage

The app uses two blob containers: _images_ for uploaded images, and _thumbs_ for resized thumbnail images. The following commands get a shared key for the storage account and uses it to create the two containers. 

```azurecli-interactive
storageaccount=<storage_name>

storageAccountKey=$(az storage account keys list -g myResourceGroup \
-n $storageaccount --query [0].value --output tsv)

az storage container create -n images --account-name $storageaccount \ 
--account-key $storageAccountKey

az storage container create -n thumbs --account-name $storageaccount \ 
--account-key $storageAccountKey

echo "Make a note of your storage account key..."
echo $storageaccountkey
```
After the blob containers are created, you configure the sample app to connect to your storage account. 

## Create a function app  

You must have a function app to host the execution of your functions. The function app provides an environment for serverless execution of your function code. Create a function app by using the [az functionapp create](/cli/azure/functionapp#create) command. 

In the following command, substitute your own unique function app name where you see the `<function_app_name>` placeholder. The `<function_app>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. `<storage_name>` is the storage account name variable defined in the previous command.  

```azurecli-interactive
az functionapp create --name <function_app> --storage-account  <storage_name>  \
--resource-group myResourceGroup --consumption-plan-location westeurope
```
You can now use Git to deploy a function to this function app.

## Deploy the function code 

The function code that performs image resizing is available in a public GitHub repo: <https://github.com/Azure-Samples/function-image-upload-resize>. In the following command, `<function_app>` is the same function app created in the previous script.

```azurecli-interactive
az functionapp deployment source config --name <function_app> \
 --resource-group myResourceGroup \
 --repo-url https://github.com/Azure-Samples/function-image-upload-resize \
 --branch master \
 --manual-integration
```

The function code is deployed directly from the public sample repo. To learn more about deployment options for Azure Functions, see [Continuous deployment for Azure Functions](../azure-functions/functions-continuous-deployment.md).

## Create a custom topic

An Event Grid topic provides an endpoint that you post your events to. You create the topic in your resource group. The topic name must be unique.

```azurecli-interactive
az eventgrid topic create --topic-name <-topic-name> -l westus2 -g gridResourceGroup
```

## Subscribe to a topic

You subscribe to a topic to tell Event Grid which events you want to track. The following example subscribes to the topic you created. It passes the URL from RequestBin as the endpoint for event notification.

```azurecli-interactive
az eventgrid topic event-subscription create --name <unique-event-subscription-name> \
  --endpoint <your-webhook-url> \
  -g gridResourceGroup 
  --topic-name <your-topic-name>
```

## Deploy the sample app to Azure
# Create an App Service plan in `FREE` tier.
az appservice plan create --name $webappname --resource-group myResourceGroup --sku FREE

# Create a web app.
az webapp create --name $webappname --resource-group myResourceGroup --plan $webappname

# Deploy code from a public GitHub repository. 
az webapp deployment source config --name $webappname --resource-group myResourceGroup \
--repo-url $gitrepo --branch master --manual-integration


Create a web app.

    az webapp create --name $webAppName \
                        --resource-group myResourceGroup \
                        --plan $webAppName
    
Deploy webapp code from the sample GitHub repository. 

    az webapp deployment source config --name $webAppName \
        --resource-group myResourceGroup --repo-url $webappGitrepo \
                                       
                                       --branch master \
                                       --manual-integration
    
Configure app settings

    az webapp config appsettings set --name $webAppName \
    --resource-group myResourceGroup \
    --settings AzureStorageConfig__AccountName=$storageName AzureStorageConfig__AccountKey=$storageAccountKey AzureStorageConfig__QueueName=$queueName AzureStorageConfig__ImageContainer=$imagesContainerName AzureStorageConfig__ThumbnailContainer=$thumbnailsContainerName
    
## Test the sample app

