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
ms.date: 08/21/2017
ms.author: glenga
ms.custom: mvc
---
# Automate the resizing of uploaded images using Event Grid

Azure Event Grid is an eventing service for the cloud. Event Grid lets you send events raised by Azure services or third-party resources to an endpoint that can respond to the event. Resources that raise events are called _topics_, which are subscribed to by consuming endpoints with _event subscriptions_. In this article, you use Event Grid to have Azure Functions subscribe to Azure Blob storage events to support thumbnail generation for images uploaded from a sample app. You use the Azure CLI to create and configure the application topology. 

> [!WARNING]
> This tutorial requires Event Grid functionality that is currently in a reduced-access preview. To be able to successfully complete this topic, you must first [request access to Blob storage events](#request-storage-access).  
>
>After access is granted, an email is sent to the primary email address on your subscription. If you don't have access to that email account, you can also [check your approval status](#check-access-status) from the Azure CLI.  
>
>After you have confirmed that your subscription has been granted access to Blob storage events, you can [complete the rest of this tutorial](#create-rg). 


![Published web app in Edge browser](./media/resize-images-on-storage-blob-upload-event/tutorial-completed.png) 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create Azure Storage accounts
> * Define blob containers in Blob storage
> * Deploy serverless code using Azure Functions
> * Create a Blob storage event subscription in Event Grid
> * Deploy a web app to Azure
> * Enable a CORS origin in Storage

## Prerequisites

To complete this tutorial:

+ You must have an active Azure subscription.
+ You must apply for and have been granted access to the Blob storage events functionality. [Request access to Blob storage events](#request-storage-access) before continuing with the other steps in the topic.  

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

If you are not using Cloud Shell, you must first sign in using `az login`.

## <a name="request-storage-access"></a>Request access to Blob storage events

At this time, you must request access to the Blob storage events feature. You request access with the `az feature register` command.

> [!IMPORTANT]  
> You will experience a delay in being granted access to Blob storage events. We are not able to provide estimates on how long you must wait for approval. However, as of `August, 22 2017` there are `XX` accounts waiting for approval. Access was granted to `YY` accounts in the past week.

```azurecli-interactive
az feature register --name storageEventSubscriptions --namespace Microsoft.EventGrid
```

## <a name="check-access-status"></a>Check your approval status

You will receive an email from Microsoft notifying you that you have been granted access to Blob storage events. You can verify the status of your access request at any time with the `az feature show` command.

```azurecli-interactive
az feature show --name storageEventSubscriptions --namespace Microsoft.EventGrid --query properties.state
```
This command returns a `Registered` value after you have been granted access to the Blob storage events feature. 
 
After you are registered, you can continue with this tutorial.

## <a name="create-rg"></a>Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources like topics and subscriptions, function apps, and storage accounts are deployed and managed.

The following example creates a resource group named `myResourceGroup`.  

```azurecli-interactive
az group create --name myResourceGroup --location westcentralus
```

## Create Azure Storage accounts

The sample uploads images to a blob container in an Azure Storage account. Create a storage account in the resource group you created by using the [az storage account create](/cli/azure/storage/account#create) command.

Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. 

> [!IMPORTANT]
> Event subscriptions for blob storage are currently only supported for Blob storage accounts. Because of this, you must create two accounts: a Blob storage account used by the sample app to store images and thumbnails, and a general storage account required by Azure Functions.  
>You are also restricted to Blob storage accounts in the West Central US and 

In the following command, substitute your own globally unique name for the Blob storage account where you see the `<blob_storage_account>` placeholder. 

```azurecli-interactive
az storage account create --name <blob_storage_account> \
--location westcentralus --resource-group myResourceGroup \
--sku Standard_LRS --kind blobstorage --access-tier hot
```
In the following command, substitute your own globally unique name for the general storage account where you see the `<general_storage_account>` placeholder. 

```azurecli-interactive
az storage account create --name <general_storage_account> \
--location westcentralus --resource-group myResourceGroup \
--sku Standard_LRS --kind storage
```
## Create blob storage containers

The app uses two containers in the Blob storage account. The _images_ container is where  the app uploads full-resolution images. The function uploads resized image thumbnails to the _thumbs_ container. Get the storage account key by using the [storage account keys list](/cli/azure/storage/account/keys#list) command. You then use this key to create two containers using the [az storage container create](/cli/azure/storage/container#create) command. 

In this case, `<blob_storage_account>` is the name of the Blob storage account you created.

```azurecli-interactive
blobStorageAccount=<blob_storage_account>

blobStorageAccountKey=$(az storage account keys list -g myResourceGroup \
-n $blobStorageAccount --query [0].value --output tsv)

az storage container create -n images --account-name $blobStorageAccount \
--account-key $blobStorageAccountKey

az storage container create -n thumbs --account-name $blobStorageAccount \
--account-key $blobStorageAccountKey

echo "Make a note of your blob storage account key..."
echo $blobStorageAccountKey
```
Make a note of your blob storage account name and key. The sample app uses these settings to connect to the storage account to upload images.

## Create a function app  

You must have a function app to host the execution of your functions. The function app provides an environment for serverless execution of your function code. Create a function app by using the [az functionapp create](/cli/azure/functionapp#create) command. 

In the following command, substitute your own unique function app name where you see the `<function_app_name>` placeholder. The `<function_app>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. In this case, `<general_storage_account>` is the name of the general storage account you created.  

```azurecli-interactive
az functionapp create --name <function_app> --storage-account  <general_storage_account>  \
--resource-group myResourceGroup --consumption-plan-location westcentralus
```

Now you must configure the function app to connect to blob storage. 

## Configure the function app

The function needs the connection string to connect to the blob storage account. In this case, `<blob_storage_account>` is the name of the Blob storage account you created. Get the connection string with the [az storage account show-connection-string](/cli/azure/storage/account#show-connection-string) command. Add this connection string to the application setting in the function app with the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings#set) command.

```azurecli-interactive
storageConnectionString=$(az storage account show-connection-string \
--resource-group myResourceGroup --name <blob_storage_account> \
--query connectionString --output tsv)

az functionapp config appsettings set --name <function_app> \
--resource-group myResourceGroup \
--settings BLOB_STORAGE_CONNECTION=$storageConnectionString 
```

You can now deploy a function code project to this function app.

## Deploy the function code 

The C# function that performs image resizing is available in a public GitHub repo: <https://github.com/Azure-Samples/function-image-upload-resize>. Deploy to the function app by using the [az functionapp deployment source config](/cli/azure/functionapp/deployment/source#config) command. 

In the following command, `<function_app>` is the same function app you created in the previous script.

```azurecli-interactive
az functionapp deployment source config --name <function_app> \
--resource-group myResourceGroup --branch master --manual-integration \
--repo-url https://github.com/Azure-Samples/function-image-upload-resize
```

The function code is deployed directly from the public sample repo. To learn more about deployment options for Azure Functions, see [Continuous deployment for Azure Functions](../azure-functions/functions-continuous-deployment.md).

## Create an event subscription in Event Grid

An event subscription tells Event Grid which events you want to send to your function. Create an event subscription by using the `az eventgrid resource event-subscription create` command. In the following command, `<function_app>` is the function app you created and `<blob_storage_account>` is your storage account. 

```azurecli-interactive
az eventgrid resource event-subscription create -g myResourceGroup \
--provider-namespace Microsoft.Storage --resource-type storageAccounts \
--resource-name <blob_storage_account> --name myFuncSub  \
--included-event-types Microsoft.Storage.BlobCreated \
--subject-begins-with /blobServices/default/containers/images/blobs/ \
--endpoint https://<function_app>.azurewebsites.net/api/imageresizefunc 
```

The prefix filter value `/blobServices/default/containers/images/blobs/` filters storage events to only those on the **images** container.  

Now that the backend services are configured, you publish the sample web app to Azure. 

## Create an App Service plan

An [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md) specifies the location, size, and features of the web server farm that hosts your app.
Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#create) command.

The following example creates an App Service plan named `myAppServicePlan` in the **Free** pricing tier:

```azurecli-interactive
az appservice plan create --name myAppServicePlan  --resource-group myResourceGroup --sku FREE
```

## Create a web app

The web app provides a hosting space for the sample app code that is deployed from the GitHub sample repository. Create a [web app](../app-service-web/app-service-web-overview.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp#create) command. 

In the following command, replace *\<app_name>* with a unique name (valid characters are `a-z`, `0-9`, and `-`). If `<web_app>` is not unique, you get the error message: _Website with given name <web_app> already exists._ The default URL of the web app is `https://<web_app>.azurewebsites.net`. 

```azurecli-interactive
az webapp create --name <web_app> --resource-group myResourceGroup --plan myAppServicePlan
```

## Deploy the sample app from the GitHub repository

App Service supports several ways to deploy content to a web app. In this tutorial, you  deploy the web app from a public GitHub sample repository: <https://github.com/Azure-Samples/integration-image-upload-resize-storage-functions>. Configure GitHub deployment to the web app with the [az webapp deployment source config](/cli/azure/webapp/deployment/source#config) command. 

```azurecli-interactive
az webapp deployment source config --name <web_app>  
--resource-group myResourceGroup --branch master --manual-integration \
--repo-url https://github.com/Azure-Samples/integration-image-upload-resize-storage-functions
```

## Configure web app settings

The sample web app uses the Azure Storage SDK to request access tokens, which are used to upload images. The storage account credentials used by the Storage SDK are set in the application settings for the web app. Add application settings to the deployed app with the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#set) command.

In the following command, `<blob_storage_account>` is the name of your Blob storage account and `<blob_storage_key>` is the associated key. 

```azurecli-interactive
az webapp config appsettings set --name <web_app> --resource-group myResourceGroup \
--settings AzureStorageConfig__AccountName=<blob_storage_account> \
AzureStorageConfig__ImageContainer=images  \
AzureStorageConfig__ThumbnailContainer=thumbs \
AzureStorageConfig__AccountKey=<blob_storage_key> 
```
After the web app is deployed and configured, you can test the entire image upload and resizing functionality in the app.  

## Enable CORS access from the web app

The web app requests images from a private storage container using shared access signatures. To enable requests from the app, you must add a cross-origin resource sharing (CORS) exception for the web app. Add an origin with the [az storage cors add](/cli/azure/storage/cors#add) command.

In the following command, `<blob_storage_account>` is the name of your Blob storage account.

```azurecli-interactive
az storage cors add --methods {GET} --exposed-headers content-length \
--allowed-headers "*" --origins "*.azurewebsites.net" --services b \
--account-name <blob_storage_account> 
```
## Test the sample app

To test the web app, browse to the URL of your published app. The default URL of the web app is `https://<web_app>.azurewebsites.net>`.

Click the **Upload photos** region to select and upload a file. 

Notice that a thumbnail copy of the uploaded image is displayed in the **Generated thumbnails** carousel. 

![Published web app in Edge browser](./media/resize-images-on-storage-blob-upload-event/tutorial-completed.png) 

## Next Steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create Azure Storage accounts
> * Define blob containers in Blob storage
> * Deploy serverless code using Azure Functions
> * Create a Blob storage event subscription in Event Grid
> * Deploy a web app to Azure
> * Enable a CORS origin in Storage

Advance to the next tutorial to learn how to do something even better.

> [!div class="nextstepaction"]
> 