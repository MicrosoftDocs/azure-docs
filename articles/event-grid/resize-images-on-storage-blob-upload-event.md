---
title: 'Tutorial: Use Azure Event Grid to automate resizing uploaded images'
description: 'Tutorial: Azure Event Grid can trigger on blob uploads in Azure Storage. You can use this to send image files uploaded to Azure Storage to other services, such as Azure Functions, for resizing and other improvements.'
ms.topic: tutorial
ms.date: 07/07/2020
---

# Tutorial: Automate resizing uploaded images using Event Grid

[Azure Event Grid](overview.md) is an eventing service for the cloud. Event Grid enables you to create subscriptions to events raised by Azure services or third-party resources.  

This tutorial is part two of a series of Storage tutorials. It extends the [previous Storage tutorial][previous-tutorial] to add serverless automatic thumbnail generation using Azure Event Grid and Azure Functions. Event Grid enables [Azure Functions](../azure-functions/functions-overview.md) to respond to [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md) events and generate thumbnails of uploaded images. An event subscription is created against the Blob storage create event. When a blob is added to a specific Blob storage container, a function endpoint is called. Data passed to the function binding from Event Grid is used to access the blob and generate the thumbnail image.

You use the Azure CLI and the Azure portal to add the resizing functionality to an existing image upload app.

# [\.NET v12 SDK](#tab/dotnet)

![Screenshot that shows a published web app in a browser for the \.NET v12 SDK.](./media/resize-images-on-storage-blob-upload-event/tutorial-completed.png)

# [Node.js V10 SDK](#tab/nodejsv10)

![Screenshot that shows a published web app in a browser for the \.NET v10 SDK.](./media/resize-images-on-storage-blob-upload-event/upload-app-nodejs-thumb.png)

---

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Storage account
> * Deploy serverless code using Azure Functions
> * Create a Blob storage event subscription in Event Grid

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To complete this tutorial:

You must have completed the previous Blob storage tutorial: [Upload image data in the cloud with Azure Storage][previous-tutorial].

You need an [Azure subscription](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing). This tutorial doesn't work with the **free** subscription. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires the Azure CLI version 2.0.14 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

If you are not using Cloud Shell, you must first sign in using `az login`.

If you've not previously registered the Event Grid resource provider in your subscription, make sure it's registered.

```bash
az provider register --namespace Microsoft.EventGrid
```

```powershell
az provider register --namespace Microsoft.EventGrid
```

## Create an Azure Storage account

Azure Functions requires a general storage account. In addition to the Blob storage account you created in the previous tutorial, create a separate general storage account in the resource group by using the [az storage account create](/cli/azure/storage/account) command. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.

1. Set a variable to hold the name of the resource group that you created in the previous tutorial.

    ```bash
    resourceGroupName="myResourceGroup"
    ```

    ```powershell
    $resourceGroupName="myResourceGroup"
    ```

1. Set a variable to hold the location for resources to be created. 

    ```bash
    location="eastus"
    ```

    ```powershell
    $location="eastus"
    ```

1. Set a variable for the name of the new storage account that Azure Functions requires.

    ```bash
    functionstorage="<name of the storage account to be used by the function>"
    ```

    ```powershell
    $functionstorage="<name of the storage account to be used by the function>"
    ```

1. Create the storage account for the Azure function.

    ```bash
    az storage account create --name $functionstorage --location $location \
    --resource-group $resourceGroupName --sku Standard_LRS --kind StorageV2
    ```

    ```powershell
    az storage account create --name $functionstorage --location $location `
    --resource-group $resourceGroupName --sku Standard_LRS --kind StorageV2
    ```

## Create a function app  

You must have a function app to host the execution of your function. The function app provides an environment for serverless execution of your function code. Create a function app by using the [az functionapp create](/cli/azure/functionapp) command.

In the following command, provide your own unique function app name. The function app name is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure.

1. Specify a name for the function app that's to be created.

    ```bash
    functionapp="<name of the function app>"
    ```

    ```powershell
    $functionapp="<name of the function app>"
    ```

1. Create the Azure function.

    ```bash
    az functionapp create --name $functionapp --storage-account $functionstorage \
      --resource-group $resourceGroupName --consumption-plan-location $location \
      --functions-version 2
    ```

    ```powershell
    az functionapp create --name $functionapp --storage-account $functionstorage `
      --resource-group $resourceGroupName --consumption-plan-location $location `
      --functions-version 2
    ```

Now configure the function app to connect to the Blob storage account you created in the [previous tutorial][previous-tutorial].

## Configure the function app

The function needs credentials for the Blob storage account, which are added to the application settings of the function app using the [az functionapp config appsettings set](/cli/azure/functionapp/config/appsettings) command.

# [\.NET v12 SDK](#tab/dotnet)

```bash
storageConnectionString=$(az storage account show-connection-string --resource-group $resourceGroupName \
  --name $blobStorageAccount --query connectionString --output tsv)

az functionapp config appsettings set --name $functionapp --resource-group $resourceGroupName \
  --settings AzureWebJobsStorage=$storageConnectionString THUMBNAIL_CONTAINER_NAME=thumbnails \
  THUMBNAIL_WIDTH=100 FUNCTIONS_EXTENSION_VERSION=~2
```

```powershell
$storageConnectionString=$(az storage account show-connection-string --resource-group $resourceGroupName `
  --name $blobStorageAccount --query connectionString --output tsv)

az functionapp config appsettings set --name $functionapp --resource-group $resourceGroupName `
  --settings AzureWebJobsStorage=$storageConnectionString THUMBNAIL_CONTAINER_NAME=thumbnails `
  THUMBNAIL_WIDTH=100 FUNCTIONS_EXTENSION_VERSION=~2
```

# [Node.js V10 SDK](#tab/nodejsv10)

```bash
blobStorageAccountKey=$(az storage account keys list -g $resourceGroupName \
  -n $blobStorageAccount --query [0].value --output tsv)

storageConnectionString=$(az storage account show-connection-string --resource-group $resourceGroupName \
  --name $blobStorageAccount --query connectionString --output tsv)

az functionapp config appsettings set --name $functionapp --resource-group $resourceGroupName \
  --settings FUNCTIONS_EXTENSION_VERSION=~2 BLOB_CONTAINER_NAME=thumbnails \
  AZURE_STORAGE_ACCOUNT_NAME=$blobStorageAccount \
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY=$blobStorageAccountKey \
  AZURE_STORAGE_CONNECTION_STRING=$storageConnectionString
```

```powershell
$blobStorageAccountKey=$(az storage account keys list -g $resourceGroupName `
  -n $blobStorageAccount --query [0].value --output tsv)

$storageConnectionString=$(az storage account show-connection-string --resource-group $resourceGroupName `
  --name $blobStorageAccount --query connectionString --output tsv)

az functionapp config appsettings set --name $functionapp --resource-group $resourceGroupName `
  --settings FUNCTIONS_EXTENSION_VERSION=~2 BLOB_CONTAINER_NAME=thumbnails `
  AZURE_STORAGE_ACCOUNT_NAME=$blobStorageAccount `
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY=$blobStorageAccountKey `
  AZURE_STORAGE_CONNECTION_STRING=$storageConnectionString
```

---

The `FUNCTIONS_EXTENSION_VERSION=~2` setting makes the function app run on version 2.x of the Azure Functions runtime.

You can now deploy a function code project to this function app.

## Deploy the function code 

# [\.NET v12 SDK](#tab/dotnet)

The sample C# resize function is available on [GitHub](https://github.com/Azure-Samples/function-image-upload-resize). Deploy this code project to the function app by using the [az functionapp deployment source config](/cli/azure/functionapp/deployment/source) command.

```bash
az functionapp deployment source config --name $functionapp --resource-group $resourceGroupName \
  --branch master --manual-integration \
  --repo-url https://github.com/Azure-Samples/function-image-upload-resize
```

```powershell
az functionapp deployment source config --name $functionapp --resource-group $resourceGroupName `
  --branch master --manual-integration `
  --repo-url https://github.com/Azure-Samples/function-image-upload-resize
```

# [Node.js V10 SDK](#tab/nodejsv10)

The sample Node.js resize function is available on [GitHub](https://github.com/Azure-Samples/storage-blob-resize-function-node-v10). Deploy this Functions code project to the function app by using the [az functionapp deployment source config](/cli/azure/functionapp/deployment/source) command.

```bash
az functionapp deployment source config --name $functionapp \
  --resource-group $resourceGroupName --branch master --manual-integration \
  --repo-url https://github.com/Azure-Samples/storage-blob-resize-function-node-v10
```

```powershell
az functionapp deployment source config --name $functionapp `
  --resource-group $resourceGroupName --branch master --manual-integration `
  --repo-url https://github.com/Azure-Samples/storage-blob-resize-function-node-v10
```

---

The image resize function is triggered by HTTP requests sent to it from the Event Grid service. You tell Event Grid that you want to get these notifications at your function's URL by creating an event subscription. For this tutorial you subscribe to blob-created events.

The data passed to the function from the Event Grid notification includes the URL of the blob. That URL is in turn passed to the input binding to obtain the uploaded image from Blob storage. The function generates a thumbnail image and writes the resulting stream to a separate container in Blob storage.

This project uses `EventGridTrigger` for the trigger type. Using the Event Grid trigger is recommended over generic HTTP triggers. Event Grid automatically validates Event Grid Function triggers. With generic HTTP triggers, you must implement the [validation response](security-authentication.md).

# [\.NET v12 SDK](#tab/dotnet)

To learn more about this function, see the [function.json and run.csx files](https://github.com/Azure-Samples/function-image-upload-resize/tree/master/ImageFunctions).

# [Node.js V10 SDK](#tab/nodejsv10)

To learn more about this function, see the [function.json and index.js files](https://github.com/Azure-Samples/storage-blob-resize-function-node-v10/tree/master/Thumbnail).

---

The function project code is deployed directly from the public sample repository. To learn more about deployment options for Azure Functions, see [Continuous deployment for Azure Functions](../azure-functions/functions-continuous-deployment.md).

## Create an event subscription

An event subscription indicates which provider-generated events you want sent to a specific endpoint. In this case, the endpoint is exposed by your function. Use the following steps to create an event subscription that sends notifications to your function in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), at the top of the page search for and select `Function App` and choose the function app that you just created. Select **Functions** and choose the **Thumbnail** function.

    :::image type="content" source="media/resize-images-on-storage-blob-upload-event/choose-thumbnail-function.png" alt-text="Choose the Thumbnail function in the portal":::

1.  Select select **Integration** then choose the **Event Grid Trigger** and select **Create Event Grid subscription**.

    :::image type="content" source="./media/resize-images-on-storage-blob-upload-event/add-event-subscription.png" alt-text="Navigate to Add Event Grid subscription in the Azure portal" :::

1. Use the event subscription settings as specified in the table.
    
    ![Create event subscription from the function in the Azure portal](./media/resize-images-on-storage-blob-upload-event/event-subscription-create.png)

    | Setting      | Suggested value  | Description                                        |
    | ------------ | ---------------- | -------------------------------------------------- |
    | **Name** | imageresizersub | Name that identifies your new event subscription. |
    | **Topic type** | Storage accounts | Choose the Storage account event provider. |
    | **Subscription** | Your Azure subscription | By default, your current Azure subscription is selected. |
    | **Resource group** | myResourceGroup | Select **Use existing** and choose the resource group you have been using in this tutorial. |
    | **Resource** | Your Blob storage account | Choose the Blob storage account you created. |
    | **System Topic Name** | imagestoragesystopic | Specify a name for the system topic. To learn about system topics, see [System topics overview](system-topics.md). |    
    | **Event types** | Blob created | Uncheck all types other than **Blob created**. Only event types of `Microsoft.Storage.BlobCreated` are passed to the function. |
    | **Endpoint type** | autogenerated | Pre-defined as **Azure Function**. |
    | **Endpoint** | autogenerated | Name of the function. In this case, it's **Thumbnail**. |

1. Switch to the **Filters** tab, and do the following actions:
    1. Select **Enable subject filtering** option.
    1. For **Subject begins with**, enter the following value : **/blobServices/default/containers/images/**.

        ![Specify filter for the event subscription](./media/resize-images-on-storage-blob-upload-event/event-subscription-filter.png)

1. Select **Create** to add the event subscription. This creates an event subscription that triggers the `Thumbnail` function when a blob is added to the `images` container. The function resizes the images and adds them to the `thumbnails` container.

Now that the backend services are configured, you test the image resize functionality in the sample web app.

## Test the sample app

To test image resizing in the web app, browse to the URL of your published app. The default URL of the web app is `https://<web_app>.azurewebsites.net`.

# [\.NET v12 SDK](#tab/dotnet)

Click the **Upload photos** region to select and upload a file. You can also drag a photo to this region.

Notice that after the uploaded image disappears, a copy of the uploaded image is displayed in the **Generated Thumbnails** carousel. This image was resized by the function, added to the *thumbnails* container, and downloaded by the web client.

![Screenshot that shows a published web app titled "ImageResizer" in a browser for the \.NET v12 SDK.](./media/resize-images-on-storage-blob-upload-event/tutorial-completed.png)

# [Node.js V10 SDK](#tab/nodejsv10)

Click **Choose File** to select a file, then click **Upload Image**. When the upload is successful, the browser navigates to a success page. Click the link to return to the home page. A copy of the uploaded image is displayed in the **Generated Thumbnails** area. (If the image doesn't appear at first, try reloading the page.) This image was resized by the function, added to the *thumbnails* container, and downloaded by the web client.

![Published web app in browser](./media/resize-images-on-storage-blob-upload-event/upload-app-nodejs-thumb.png)

---

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a general Azure Storage account
> * Deploy serverless code using Azure Functions
> * Create a Blob storage event subscription in Event Grid

Advance to part three of the Storage tutorial series to learn how to secure access to the storage account.

> [!div class="nextstepaction"]
> [Secure access to an applications data in the cloud](../storage/blobs/storage-secure-access-application.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

+ To learn more about Event Grid, see [An introduction to Azure Event Grid](overview.md).
+ To try another tutorial that features Azure Functions, see [Create a function that integrates with Azure Logic Apps](../azure-functions/functions-twitter-email.md).

[previous-tutorial]: ../storage/blobs/storage-upload-process-images.md

