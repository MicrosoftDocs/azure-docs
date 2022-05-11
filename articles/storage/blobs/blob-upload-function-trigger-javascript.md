---
title: Upload and analyze a file with Azure Functions (JavaScript) and Blob Storage
description: With JavaScript, learn how to upload an image to Azure Blob Storage and analyze its content using Azure Functions and Cognitive Services
author: diberry
ms.author: diberry
ms.service: storage
ms.topic: tutorial
ms.date: 3/11/2022
ms.custom: devx-track-js
---

# JavaScript Tutorial: Upload and analyze a file with Azure Functions and Blob Storage

In this tutorial, you'll learn how to upload an image to Azure Blob Storage and process it using Azure Functions and Computer Vision. You'll also learn how to implement Azure Function triggers and bindings as part of this process.  Together, these services will analyze an uploaded image that contains text, extract the text out of it, and then store the text in a database row for later analysis or other purposes.

Azure Blob Storage is Microsoft's massively scalable object storage solution for the cloud. Blob Storage is designed for storing images and documents, streaming media files, managing backup and archive data, and much more.  You can read more about Blob Storage on the [overview page](./storage-blobs-introduction.md).

Azure Functions is a serverless computer solution that allows you to write and run small blocks of code as highly scalable, serverless, event driven functions. You can read more about Azure Functions on the [overview page](../../azure-functions/functions-overview.md).


In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Upload images and files to Blob Storage
> * Use an Azure Function event trigger to process data uploaded to Blob Storage
> * Use Cognitive Services to analyze an image
> * Write data to Table Storage using Azure Function output bindings


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio Code](https://code.visualstudio.com/) installed.
    - [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to deploy and configure the Function App.
    - [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)
    - [Azure Resources extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)

## Create the storage account and container
The first step is to create the storage account that will hold the uploaded blob data, which in this scenario will be images that contain text. A storage account offers several different services, but this tutorial utilizes Blob Storage and Table Storage.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.StorageAccount).

1) In the search bar at the top of the portal, search for *Storage* and select the result labeled **Storage accounts**.

2) On the **Storage accounts** page, select **+ Create** in the top left.

3) On the **Create a storage account** page, enter the following values:

 - **Subscription**: Choose your desired subscription.
 - **Resource Group**: Select **Create new** and enter a name of `msdocs-storage-function`, and then choose **OK**.
 - **Storage account name**: Enter a value of `msdocsstoragefunction`. The Storage account name must be unique across Azure, so you may need to add numbers after the name, such as `msdocsstoragefunction123`.
 - **Region**: Select the region that is closest to you.
 - **Performance**: Choose **Standard**.
 - **Redundancy**: Leave the default value selected.
 
:::image type="content" source="./media/blob-upload-storage-function/portal-storage-create-small.png" alt-text="A screenshot showing how create a storage account in Azure."  lightbox="media/blob-upload-storage-function/portal-storage-create.png":::
 
4) Select **Review + Create** at the bottom and Azure will validate the information you entered.  Once the  settings are validated, choose **Create** and Azure will begin provisioning the storage account, which might take a moment.

### Create the container
1) After the storage account is provisioned, select **Go to Resource**. The next step is to create a storage container inside of the account to hold uploaded images for analysis. 

2) On the navigation panel, choose **Containers**.

3) On the **Containers** page, select **+ Container** at the top. In the slide out panel, enter a **Name** of *imageanalysis*, and make sure the **Public access level** is set to **Blob (anonymous read access for blobs only**.  Then select **Create**.

:::image type="content" source="./media/blob-upload-storage-function/portal-container-create-small.png" alt-text="A screenshot showing how to create a new storage container." lightbox="media/blob-upload-storage-function/portal-container-create.png":::

You should see your new container appear in the list of containers.

### Retrieve the connection string

The last step is to retrieve our connection string for the storage account. 

1) On the left navigation panel, select **Access Keys**.

2) On the **Access Keys page**, select **Show keys**.  Copy the value of the **Connection String** under the **key1** section and paste this somewhere to use for later.  You'll also want to make a note of the storage account name `msdocsstoragefunction` for later as well.

:::image type="content" source="./media/blob-upload-storage-function/storage-account-access-small.png" alt-text="A screenshot showing how to access the storage container." lightbox="media/blob-upload-storage-function/storage-account-access.png":::

These values will be necessary when we need to connect our Azure Function to this storage account.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

To create the storage account and container, we can run the CLI commands seen below.

```azurecli-interactive
az group create --location eastus --name msdocs-storage-function \

az storage account create --name msdocsstorageaccount --resource-group msdocs-storage-function -l eastus --sku Standard_LRS \

az storage container create --name imageanalysis --account-name msdocsstorageaccount --resource-group msdocs-storage-function
```

You may need to wait a few moments for Azure to provision these resources.

After the commands complete, we also need to retrieve the connection string for the storage account.  The connection string will be used later to connect our Azure Function to the storage account.

```azurecli-interactive
az storage account show-connection-string -g msdocs-storage-function -n msdocsstorageaccount
```

Copy the value of the `connectionString` property and paste it somewhere to use for later. You'll also want to make a note of the storage account name `msdocsstoragefunction` for later as well. 

---

## Create the Computer Vision service
Next, create the Computer Vision service account that will process our uploaded files.  Computer Vision is part of Azure Cognitive Services and offers a variety of features for extracting data out of images.  You can learn more about Computer Vision on the [overview page](/azure/cognitive-services/computer-vision/overview).

### [Azure portal](#tab/azure-portal)

1) In the search bar at the top of the portal, search for *Computer* and select the result labeled **Computer vision**.

2) On the **Computer vision** page, select **+ Create**.

3) On the **Create Computer Vision** page, enter the following values:

- **Subscription**: Choose your desired Subscription.
- **Resource Group**: Use the `msdocs-storage-function` resource group you created earlier.
- **Region**: Select the region that is closest to you.
- **Name**: Enter in a name of `msdocscomputervision`.
- **Pricing Tier**: Choose **Free** if it is available, otherwise choose **Standard S1**.
- Check the **Responsible AI Notice** box if you agree to the terms

:::image type="content" lightbox="./media/blob-upload-storage-function/computer-vision-create.png" source="./media/blob-upload-storage-function/computer-vision-create-small.png" alt-text="A screenshot showing how to create a new Computer Vision service." :::
 
4) Select **Review + Create** at the bottom. Azure will take a moment validate the information you entered.  Once the settings are validated, choose **Create** and Azure will begin provisioning the Computer Vision service, which might take a moment.

5) When the operation has completed, select **Go to Resource**.

### Retrieve the keys

Next, we need to find the secret key and endpoint URL for the Computer Vision service to use in our Azure Function app. 

1) On the **Computer Vision** overview page, select **Keys and Endpoint**.

2) On the **Keys and EndPoint** page, copy the **Key 1** value and the **EndPoint** values and paste them somewhere to use for later.

:::image type="content" source="./media/blob-upload-storage-function/computer-vision-endpoints.png" alt-text="A screenshot showing how to retrieve the Keys and URL Endpoint for a Computer Vision service." :::

### [Azure CLI](#tab/azure-cli)

To create the Computer Vision service, we can run the CLI command below.

```azurecli-interactive
az cognitiveservices account create \
    --name msdocs-process-image \
    --resource-group msdocs-storage-function \
    --kind ComputerVision \
    --sku F1 \
    --location eastus2 \
    --yes
```

You may need to wait a few moments for Azure to provision these resources.

Once the Computer Vision service is created, you can retrieve the secret keys and URL endpoint using the commands below.

```azurelci-interactive
    az cognitiveservices account keys list \
    --name msdocs-process-image \
    --resource-group msdocs-storage-function  \ 

    az cognitiveservices account list \
    --name msdocs-process-image \
     --resource-group msdocs-storage-function --query "[].properties.endpoint"   
```

---
 

## Download and configure the sample project
The code for the Azure Function used in this tutorial can be found in [this GitHub repository](https://github.com/Azure-Samples/msdocs-storage-bind-function-service/tree/main/javascript). You can also clone the project using the command below.

```terminal
git clone https://github.com/Azure-Samples/msdocs-storage-bind-function-service.git \
cd msdocs-storage-bind-function-service/javascript
```

The sample project accomplishes the following tasks:

- Retrieves environment variables to connect to the storage account and Computer Vision service
- Accepts the uploaded file as a blob parameter
- Analyzes the blob using the Computer Vision service
- Sends the analyzed image text to a new table row using output bindings

Once you have downloaded and opened the project, there are a few essential concepts to understand:

|Concept|Purpose|
|--|--|
|Function|The Azure Function is defined by both the function code and the bindings. The function code is in [./ProcessImageUpload/index.js](https://github.com/Azure-Samples/msdocs-storage-bind-function-service/blob/main/javascript/ProcessImageUpload/index.js). |
|Triggers and bindings|The triggers and bindings indicate that data is expected into or out of the function and which service is going to send or receive that data. The trigger and binding for this function is in [./ProcessImageUpload/function.json](https://github.com/Azure-Samples/msdocs-storage-bind-function-service/blob/main/javascript/ProcessImageUpload/function.json).|

### Triggers and bindings
The following [function.json](https://github.com/Azure-Samples/msdocs-storage-bind-function-service/blob/main/javascript/ProcessImageUpload/function.json) file defines the triggers and bindings for this function:

:::code language="JSON" source="~/msdocs-storage-bind-function-service/javascript/ProcessImageUpload/function.json" :::

* **Data In** - The **BlobTrigger** (`"type": "blobTrigger"`) is used to bind the function to the upload event in Blob Storage. The trigger has two required parameters:
    * `name`: The name of the blob **container** to monitor for uploads. 
    * `connection`: The **connection string** of the storage account.

* **Data Out** - The **TableBinding** (`"type": "table"`) is used to bind the outbound data to a Storage table.  
    * `tableName`: The name of the table to write the parsed image text value returned by the function. 
    * `connection`: The Table Storage connection string from the environment variable so that the Azure function has access to it. 

:::code language="javascript" source="~/msdocs-storage-bind-function-service/javascript/ProcessImageUpload/index.js" highlight="36-60":::

This code also retrieves essential configuration values from environment variables, such as the Blob Storage connection string and Computer Vision key. These environment variables are added to the Azure Function environment after it's deployed.

The default function also utilizes a second method called `AnalyzeImage`. This code uses the URL Endpoint and Key of the Computer Vision account to make a request to Computer Vision to process the image.  The request returns all of the text discovered in the image. This text is written to Table Storage, using the outbound binding.

### Running locally

To run the project locally, enter the environment variables in the `./local.settings.json` file. Fill in the placeholder values with the values you saved earlier when creating the Azure resources.

Although the Azure Function code runs locally, it connects to the cloud-based services for Storage, rather than using any local emulators.

:::code language="json" source="~/msdocs-storage-bind-function-service/javascript/local.settings.json" highlight="6-10":::

## Create Azure Functions app

You are now ready to deploy the application to Azure using a Visual Studio Code extension.  

1. In Visual Studio Code, select <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd> to open the **Azure** sidebar.
1. In the **Functions** section, find and right-click the subscription, and select **Create Function App in Azure (Advanced)**.
1. Use the following table to create the Function resource.

    |Setting|Value|   
    |--|--|
    |**Name**| Enter *msdocsprocessimage* or something similar.|
    |**Runtime stack**| Select a **Node.js LTS** version. |
    |**OS**| Select **Linux**. |
    |**Resource Group**|Choose the `msdocs-storage-function` resource group you created earlier.|
    |**Location**|Choose the region closest to you.|
    |**Plan Type**|Select **Consumption**.|
    |**Azure Storage**| Select the storage account you created earlier.|
    |**Application Insights**| Skip for now.|

1. Azure provisions the requested resources, which will take a few moments to complete.

## Deploy Azure Functions app

1. When the previous resource creation process finishes, right-click the new resource in the **Functions** section of the Azure sidebar, and select **Deploy to Function App**.
1. If asked **Are you sure you want to deploy...**, select **Deploy**.

## Add app settings for Storage and Computer Vision

The Azure Function was deployed successfully, but it cannot connect to our Storage account and Computer Vision services yet. The correct keys and connection strings must first be added to the configuration settings of the Azure Functions app.

1. Find your resource in the **Functions** section of the Azure sidebar, right-click **Application Settings**, and select **Add New Setting**.
1. Enter a new app setting for the following secrets. Copy and paste your secret values from your local project in the `local.settings.json` file.

    |Setting|
    |--|
    |StorageConnection|
    |StorageAccountName|
    |StorageContainerName|
    |ComputerVisionKey|
    |ComputerVisionEndPoint|


All of the required environment variables to connect our Azure function to different services are now in place.


## Upload an image to Blob Storage

You are now ready to test out our application! You can upload a blob to the container, and then verify that the text in the image was saved to Table Storage.

1. In the Azure sidebar in Visual Studio Code, find and expand your Storage resource in the **Storage** section.
1. Expand **Blob Containers** and right-click your container name, then select **Upload files**.
1. You can find a few sample images included in the **images** folder at the root of the downloadable sample project, or you can use one of your own. 
1. Wait until the files are uploaded and listed in the container.

## View text analysis of image

Next, you can verify that the upload triggered the Azure Function, and that the text in the image was analyzed and saved to Table Storage properly.

1. Under the same Storage resource, expand **Tables** to find your resource. 
1. An **ImageText** table should now be available.  Click on the table to preview the data rows inside of it.  You should see an entry for the processed image text of an uploaded file.  You can verify this using either the Timestamp, or by viewing the content of the **Text** column.

Congratulations! You succeeded in processing an image that was uploaded to Blob Storage using Azure Functions and Computer Vision.

## Clean up resources

If you're not going to continue to use this application, you can delete the resources you created by removing the resource group.

1. Select **Resource groups** from the Azure sidebar
1. Find and right-click the `msdocs-storage-function` resource group from the list.
1. Select **Delete**. The process to delete the resource group may take a few minutes to complete.
