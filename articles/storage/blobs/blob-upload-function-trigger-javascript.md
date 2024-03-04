---
title: Upload and analyze a file with Azure Functions (JavaScript) and Blob Storage
description: With JavaScript, learn how to upload an image to Azure Blob Storage and analyze its content using Azure Functions and Azure AI services
author: diberry
ms.author: diberry
ms.service: azure-storage
ms.topic: tutorial
ms.date: 07/06/2023
ms.devlang: javascript
ms.custom: devx-track-js, devx-track-azurecli, engagement
---

# JavaScript Tutorial: Upload and analyze a file with Azure Functions and Blob Storage

In this tutorial, you'll learn how to upload an image to Azure Blob Storage and process it using Azure Functions, Computer Vision, and Cosmos DB. You'll also learn how to implement Azure Function triggers and bindings as part of this process.  Together, these services analyze an uploaded image that contains text, extract the text out of it, and then store the text in a database row for later analysis or other purposes.

Azure Blob Storage is Microsoft's massively scalable object storage solution for the cloud. Blob Storage is designed for storing images and documents, streaming media files, managing backup and archive data, and much more.  You can read more about Blob Storage on the [overview page](./storage-blobs-introduction.md). 

> [!WARNING]
> This tutorial uses publicly accessible storage to simplify the process to finish this tutorial. Anonymous public access presents a security risk. [Learn how to remediate this risk.](/azure/storage/blobs/anonymous-read-access-overview)

Azure Cosmos DB is a fully managed NoSQL and relational database for modern app development. 

Azure Functions is a serverless computer solution that allows you to write and run small blocks of code as highly scalable, serverless, event driven functions. You can read more about Azure Functions on the [overview page](../../azure-functions/functions-overview.md).


In this tutorial, learn how to:

> [!div class="checklist"]
> * Upload images and files to Blob Storage
> * Use an Azure Function event trigger to process data uploaded to Blob Storage
> * Use Azure AI services to analyze an image
> * Write data to Cosmos DB using Azure Function output bindings

:::image type="content" source="./media/blob-upload-storage-function/functions-storage-database-architectural-diagram.png" alt-text="Architectural diagram showing an image blob is added to Blob Storage, then analyzed by an Azure Function, with the analysis inserted into a Cosmos DB.":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio Code](https://code.visualstudio.com/) installed.
    - [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) to deploy and configure the Function App.
    - [Azure Storage extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestorage)
    - [Azure Databases extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
    - [Azure Resources extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)


## Create the storage account and container
The first step is to create the storage account that will hold the uploaded blob data, which in this scenario will be images that contain text. A storage account offers several different services, but this tutorial utilizes Blob Storage only.

### [Visual Studio Code](#tab/storage-resource-visual-studio-code)

1. In Visual Studio Code, select <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open the command palette.
1. Search for **Azure Storage: Create Storage Account (Advanced)**.
1. Use the following table to create the Storage resource.

    |Setting|Value|   
    |--|--|
    |**Name**| Enter *msdocsstoragefunction* or something similar.|
    |**Resource Group**|Create the `msdocs-storage-function` resource group you created earlier.|
    |**Static web hosting**|No.|

1. In Visual Studio Code, select <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd> to open the **Azure** Explorer.
1. Expand the **Storage** section, expand your subscription node and wait for the resource to be created. 

### Create the container in Visual Studio Code

1. Still in the Azure Explorer with your new Storage resource found, expand the resource to see the nodes.
1. Right-click on **Blob Containers** and select **Create Blob Container**.
1. Enter the name `images`. This creates a private container. 

### Change from private to public container in Azure portal

This procedure expects a public container. To change that configuration, make the change in the Azure portal.

1. Right-click on the Storage Resource in the Azure Explorer and select **Open in Portal**. 
1. In the **Data Storage** section, select **Containers**.
1. Find your container, `images`, and select the `...` (ellipse) at the end of the line. 
1. Select **Change access level**.
1. Select **Blob (anonymous read access for blobs only** then select **Ok**.
1. Return to Visual Studio Code.

### Retrieve the connection string in Visual Studio Code

1. In Visual Studio Code, select <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd> to open the **Azure** Explorer.
1. Right-click on your storage resource and select **Copy Connection String**.
1. paste this somewhere to use later.  
1. Also make note of the storage account name `msdocsstoragefunction` to use later.

### [Azure portal](#tab/storage-resource-azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount).

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

3) On the **Containers** page, select **+ Container** at the top. In the slide out panel, enter a **Name** of *images*, and make sure the **Public access level** is set to **Blob (anonymous read access for blobs only**.  Then select **Create**.

    :::image type="content" source="./media/blob-upload-storage-function/portal-container-create-small.png" alt-text="A screenshot showing how to create a new storage container." lightbox="media/blob-upload-storage-function/portal-container-create.png":::
    
You should see your new container appear in the list of containers.

### Retrieve the connection string

The last step is to retrieve our connection string for the storage account. 

1) On the left navigation panel, select **Access Keys**.

2) On the **Access Keys page**, select **Show keys**.  Copy the value of the **Connection String** under the **key1** section and paste this somewhere to use later.  You'll also want to make a note of the storage account name `msdocsstoragefunction` for later as well.

    :::image type="content" source="./media/blob-upload-storage-function/storage-account-access-small.png" alt-text="A screenshot showing how to access the storage container." lightbox="media/blob-upload-storage-function/storage-account-access.png":::
    
These values are necessary when we need to connect our Azure Function to this storage account.

### [Azure CLI](#tab/storage-resource-azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

1. To create the storage account and container, we can run the CLI commands seen below.

    ```azurecli-interactive
    az group create --location eastus2 --name msdocs-storage-function \
    
    az storage account create --name msdocsstorageaccount --resource-group msdocs-storage-function -l eastus2 --sku Standard_LRS \
    
    az storage container create --name images --account-name msdocsstorageaccount --resource-group msdocs-storage-function
    ```

    You may need to wait a few moments for Azure to provision these resources.

2. After the commands complete, we also need to retrieve the connection string for the storage account.  The connection string is used later to connect our Azure Function to the storage account.

    ```azurecli-interactive
    az storage account show-connection-string -g msdocs-storage-function -n msdocsstorageaccount
    ```

    Copy the value of the `connectionString` property and paste it somewhere to use later. You'll also want to make a note of the storage account name `msdocsstoragefunction` to use later. 

---

## Create the Azure AI Vision service

Next, create the Azure AI Vision service account that will process our uploaded files. Vision is part of Azure AI services and offers various features for extracting data out of images.  You can learn more about Azure AI Vision on the [overview page](../../ai-services/computer-vision/overview.md).

### [Azure portal](#tab/computer-vision-azure-portal)

1) In the search bar at the top of the portal, search for *Computer* and select the result labeled **Computer vision**.

2) On the **Computer vision** page, select **+ Create**.

3) On the **Create Computer Vision** page, enter the following values:

   - **Subscription**: Choose your desired Subscription.
   - **Resource Group**: Use the `msdocs-storage-function` resource group you created earlier.
   - **Region**: Select the region that is closest to you.
   - **Name**: Enter in a name of `msdocscomputervision`.
   - **Pricing Tier**: Choose **Free** if it's available, otherwise choose **Standard S1**.
   - Check the **Responsible AI Notice** box if you agree to the terms

    :::image type="content" lightbox="./media/blob-upload-storage-function/computer-vision-create.png" source="./media/blob-upload-storage-function/computer-vision-create-small.png" alt-text="A screenshot showing how to create a new Computer Vision service." :::
     
4) Select **Review + Create** at the bottom. Azure takes a moment to validate the information you entered.  Once the settings are validated, choose **Create** and Azure will begin provisioning the Computer Vision service, which might take a moment.

5) When the operation has completed, select **Go to Resource**.

### Retrieve the Computer Vision keys

Next, we need to find the secret key and endpoint URL for the Computer Vision service to use in our Azure Function app. 

1) On the **Computer Vision** overview page, select **Keys and Endpoint**.

2) On the **Keys and EndPoint** page, copy the **Key 1** value and the **EndPoint** values and paste them somewhere to use later. The endpoint should be in the format of `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com/`

:::image type="content" source="./media/blob-upload-storage-function/computer-vision-endpoints.png" alt-text="A screenshot showing how to retrieve the Keys and URL Endpoint for a Computer Vision service." :::

### [Azure CLI](#tab/computer-vision-azure-cli)

1. To create the Computer Vision service, we can run the CLI command below.

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

2. Once the Computer Vision service is created, you can retrieve the secret keys and URL endpoint using the commands below.

    ```azurelci-interactive
    az cognitiveservices account keys list \
        --name msdocs-process-image \
        --resource-group msdocs-storage-function  
    
    az cognitiveservices account list \
        --name msdocs-process-image \
        --resource-group msdocs-storage-function --query "[].properties.endpoint"   
    ```

---
 
## Create a Cosmos DB service account

Create the Cosmos DB service account to store the analysis of files.  Azure Cosmos DB is a fully managed NoSQL and relational database for modern app development.  You can learn more about Cosmos DB and its support [APIs for several different industry databases](/azure/cosmos-db/choose-api). 

While this tutorial specifies an API when you create your resource, the Azure Function bindings for Cosmos DB are configured in the same way for all Cosmos DB APIs.

### [Azure portal](#tab/cosmos-db-azure-portal)

1) In the search bar at the top of the portal, search for *Azure Cosmos DB* and select the result.

2) On the **Azure Cosmos DB** page, select **+ Create**. Select **Azure Cosmos DB for NoSQL** from the list of API choices.

3) On the **Create Cosmos DB** page, enter the following values:

   - **Subscription**: Choose your desired Subscription.
   - **Resource Group**: Use the `msdocs-storage-function` resource group you created earlier.
   - **Region**: Select the same region as your resource group.
   - **Name**: Enter in a name of `msdocscosmosdb`.
   - **Pricing Tier**: Choose **Free** if it's available, otherwise choose **Standard S1**.
    
4) Select **Review + Create** at the bottom. Azure will take a moment validate the information you entered.  Once the settings are validated, choose **Create** and Azure will begin provisioning the Computer Vision service, which might take a moment.

5) When the operation has completed, select **Go to Resource**.

6) Select **Data Explorer** then select **New Container**. 

7) Create a new database and container with the following settings:

    - Create new **database id**: `StorageTutorial`.
    - Enter the new **container id**: `analysis`.
    - Enter the **partition key**: `/type`.

8) Leave the rest of the default settings and select **OK**.

### Get the Cosmos DB connection string

Get the connection string for the Cosmos DB service account to use in our Azure Function app. 

1) On the **Cosmos DB** overview page, select **Keys**.

2) On the **Keys** page, copy the **Primary Connection String** to use later. 

### [Azure CLI](#tab/cosmos-db-azure-cli)

1. To [create the Cosmos DB account](/cli/azure/cosmosdb/service#az-cosmosdb-service-create) named `msdocscosmosdb`.

    ```azurecli-interactive
    az cosmosdb create 
        --name msdocscosmosdb 
        --kind GlobalDocumentDB 
        --resource-group msdocs-storage-function
    ```

1. Create a database named `StorageTutorial` in the Cosmos DB account.

    ```azurecli-interactive
    az cosmosdb sql database create 
        --account-name msdocscosmosdb 
        --name StorageTutorial 
        --resource-group msdocs-storage-function
    ```
    
    You may need to wait a few moments for Azure to provision the database.
    
2. Once the database is created, create a container named `analysis` with a partition key of `/type`.

    ```azurecli-interactive
    az cosmosdb sql container create 
        --account-name msdocscosmosdb 
        --database-name StorageTutorial 
        --resource-group msdocs-storage-function 
        --name 'analysis' 
        --partition-key-path '/type'
    ```
    
3. Get the connection string using the command below for later use in the tutorial.

    ```azurecli-interactive
    az cosmosdb list-connection-strings 
        --name msdocscosmosdb 
        --resource-group msdocs-storage-function
    ```

    This returns a JSON array of two read-write connection strings, and two read-only connection strings.

4. Copy the **Primary SQL Connection String** to use later. 
---

## Download and configure the sample project

The code for the Azure Function used in this tutorial can be found in [this GitHub repository](https://github.com/Azure-Samples/msdocs-storage-bind-function-service/tree/main/javascript-v4), in the `JavaScript-v4` subdirectory. You can also clone the project using the command below.

```terminal
git clone https://github.com/Azure-Samples/msdocs-storage-bind-function-service.git \
cd msdocs-storage-bind-function-service/javascript-v4 \
code .
```

The sample project accomplishes the following tasks:

- Retrieves environment variables to connect to the storage account, Computer Vision, and Cosmos DB service
- Accepts the uploaded file as a blob parameter
- Analyzes the blob using the Computer Vision service
- Inserts the analyzed image text, as a JSON object, into Cosmos DB using output bindings

Once you've downloaded and opened the project, there are a few essential concepts to understand:

|Concept|Purpose|
|--|--|
|Function|The Azure Function is defined by both the function code and the bindings. These are in [./src/functions/process-blobs.js](https://github.com/Azure-Samples/msdocs-storage-bind-function-service/blob/main/javascript-v4/src/functions/process-blob.js). |
|Triggers and bindings|The triggers and bindings indicate that data, which is expected into or out of the function and which service is going to send or receive that data. 

Triggers and bindings used in this tutorial to expediate the development process by removing the need to write code to connect to services. 

### Input Storage Blob trigger

The code, which specifies that the function is triggered when a blob is uploaded to the **images** container follows. The function is triggered on any blob name including hierarchical folders.

```javascript

// ...preceding code removed for brevity

app.storageBlob('process-blob-image', { 
    path: 'images/{name}',                // Storage container name: images, Blob name: {name}
    connection: 'StorageConnection',      // Storage account connection string
    handler: async (blob, context) => {

// ... function code removed for brevity
```

* **app.storageBlob** - The **Storage Blob** input trigger is used to bind the function to the upload event in Blob Storage. The trigger has two required parameters:
    * `path`: The path the trigger watches for events. The path includes the container name,`images`, and the variable substitution for the blob name. This blob name is retrieved from the `name` property. 
    * `{name}`: The name of the blob uploaded. The use of the `blob` is the parameter name for the blob coming into the function. Don't change the value `blob`. 
    * `connection`: The **connection string** of the storage account. The value `StorageConnection` matches the name in the `local.settings.json` file when developing locally.

### Output Cosmos DB trigger

When the function finishes, the function uses the returned object as the data to insert into Cosmos DB. 

```javascript

// ... function definition ojbect
app.storageBlob('process-blob-image', { 
    
        // removed for brevity    
        
        // Data to insert into Cosmos DB
        const id = uuidv4().toString();
        const analysis = await analyzeImage(blobUrl);
        
        // `type` is the partition key 
        const dataToInsertToDatabase = {
                id,
                type: 'image',
                blobUrl,
                blobSize: blob.length,
                analysis,
                trigger: context.triggerMetadata
            }

        return dataToInsertToDatabase;
    }),

    // Output binding for Cosmos DB
    return: output.cosmosDB({
        connection: 'CosmosDBConnection',
        databaseName:'StorageTutorial',
        containerName:'analysis'
    })
});
```

For the container in this article, the following required properties are:
* `id`: the ID required for Cosmos DB to create a new row. 
* `/type`: the partition key specified with the container was created.

* **output.cosmosDB** - The **Cosmos DB** output trigger is used to insert the result of the function to Cosmos DB.  
    * `connection`: The **connection string** of the storage account. The value `StorageConnection` matches the name in the `local.settings.json` file.
    * `databaseName`: The Cosmos DB database to connect to. 
    * `containerName`: The name of the table to write the parsed image text value returned by the function. The table must already exist. 

## Azure Function code

The following is the full function code.

:::code language="javascript" source="~/msdocs-storage-bind-function-service/javascript-v4/src/functions/process-blob.js":::

This code also retrieves essential configuration values from environment variables, such as the Blob Storage connection string and Computer Vision key. These environment variables are added to the Azure Function environment after it's deployed.

The default function also uses a second method called `AnalyzeImage`. This code uses the URL Endpoint and Key of the Computer Vision account to make a request to Computer Vision to process the image.  The request returns all of the text discovered in the image. This text is written to Cosmos DB, using the outbound binding.

### Configure local settings

To run the project locally, enter the environment variables in the `./local.settings.json` file. Fill in the placeholder values with the values you saved earlier when creating the Azure resources.

Although the Azure Function code runs locally, it connects to the cloud-based services for Storage, rather than using any local emulators.

```
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "AzureWebJobsStorage": "",
    "StorageConnection": "STORAGE-CONNECTION-STRING",
    "StorageAccountName": "STORAGE-ACCOUNT-NAME",
    "StorageContainerName": "STORAGE-CONTAINER-NAME",
    "ComputerVisionKey": "COMPUTER-VISION-KEY",
    "ComputerVisionEndPoint":  "COMPUTER-VISION-ENDPOINT",
    "CosmosDBConnection": "COSMOS-DB-CONNECTION-STRING"
  }
}
```

## Create Azure Functions app

You're now ready to deploy the application to Azure using a Visual Studio Code extension.  

1. In Visual Studio Code, select <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd> to open the **Azure** explorer.
1. In the **Functions** section, find and right-click the subscription, and select **Create Function App in Azure (Advanced)**.
1. Use the following table to create the Function resource.

    |Setting|Value|   
    |--|--|
    |**Name**| Enter *msdocsprocessimage* or something similar.|
    |**Runtime stack**| Select a **Node.js LTS** version. |
    |**Programming model**| Select **v4**.|
    |**OS**| Select **Linux**. |
    |**Resource Group**|Choose the `msdocs-storage-function` resource group you created earlier.|
    |**Location**|Select the same region as your resource group.|
    |**Plan Type**|Select **Consumption**.|
    |**Azure Storage**| Select the storage account you created earlier.|
    |**Application Insights**| Skip for now.|

1. Azure provisions the requested resources, which will take a few moments to complete.

## Deploy Azure Functions app

1. When the previous resource creation process finishes, right-click the new resource in the **Functions** section of the Azure explorer, and select **Deploy to Function App**.
1. If asked **Are you sure you want to deploy...**, select **Deploy**.
1. When the process completes, a notification appears which a choice, which includes **Upload settings**. Select that option. This copies the values from your local.settings.json file into your Azure Function app. If the notification disappeared before you could select it, continue to the next section. 


## Add app settings for Storage and Computer Vision
If you selected **Upload settings** in the notification, skip this section.

The Azure Function was deployed successfully, but it can't connect to our Storage account and Computer Vision services yet. The correct keys and connection strings must first be added to the configuration settings of the Azure Functions app.

1. Find your resource in the **Functions** section of the Azure explorer, right-click **Application Settings**, and select **Add New Setting**.
1. Enter a new app setting for the following secrets. Copy and paste your secret values from your local project in the `local.settings.json` file.

    |Setting|
    |--|
    |StorageConnection|
    |StorageAccountName|
    |StorageContainerName|
    |ComputerVisionKey|
    |ComputerVisionEndPoint|
    |CosmosDBConnection|


All of the required environment variables to connect our Azure function to different services are now in place.


## Upload an image to Blob Storage

You're now ready to test out our application! You can upload a blob to the container, and then verify that the text in the image was saved to Cosmos DB.

1. In the Azure explorer in Visual Studio Code, find and expand your Storage resource in the **Storage** section.
1. Expand **Blob Containers** and right-click your container name, `images`, then select **Upload files**.
1. You can find a few sample images included in the **images** folder at the root of the downloadable sample project, or you can use one of your own.
1. For the **Destination directory**, accept the default value, `/`. 
1. Wait until the files are uploaded and listed in the container.

## View text analysis of image

Next, you can verify that the upload triggered the Azure Function, and that the text in the image was analyzed and saved to Cosmos DB properly.

1. In Visual Studio Code, in the Azure Explorer, under the Azure Cosmos DB node, select your resource, and expand it to find your database, **StorageTutorial**.
1. Expand the database node.
1. An **analysis** container should now be available.  Select on the container's **Documents** node to preview the data inside.  You should see an entry for the processed image text of an uploaded file.  

    ```json
    {
        "id": "3cf7d6f0-a362-421e-9482-3020d7d1e689",
        "type": "image",
        "blobUrl": "https://msdocsstoragefunction.blob.core.windows.net/images/presentation.png",
        "blobSize": 1383614,
        "analysis": {  ... details removed for brevity ...
            "categories": [],
            "adult": {},
            "imageType": {},
            "tags": [],
            "description": {},
            "faces": [],
            "objects": [],
            "requestId": "eead3d60-9905-499c-99c5-23d084d9cac2",
            "metadata": {},
            "modelVersion": "2021-05-01"
        },
        "trigger": { 
            "blobTrigger": "images/presentation.png",
            "uri": "https://msdocsstorageaccount.blob.core.windows.net/images/presentation.png",
            "properties": {
                "lastModified": "2023-07-07T15:32:38+00:00",
                "createdOn": "2023-07-07T15:32:38+00:00",
                "metadata": {},
                ... removed for brevity ...
                "contentLength": 1383614,
                "contentType": "image/png",
                "accessTier": "Hot",
                "accessTierInferred": true,
            },
            "metadata": {},
            "name": "presentation.png"
        },
        "_rid": "YN1FAKcZojEFAAAAAAAAAA==",
        "_self": "dbs/YN1FAA==/colls/YN1FAKcZojE=/docs/YN1FAKcZojEFAAAAAAAAAA==/",
        "_etag": "\"7d00f2d3-0000-0700-0000-64a830210000\"",
        "_attachments": "attachments/",
        "_ts": 1688743969
    }
    ```

Congratulations! You succeeded in processing an image that was uploaded to Blob Storage using Azure Functions and Computer Vision.

## Troubleshooting

Use the following table to help troubleshoot issues during this procedure.

|Issue|Resolution|
|--|--|
|`await computerVisionClient.read(url);` errors with `Only absolute URLs are supported`|Make sure your `ComputerVisionEndPoint` endpoint is in the format of `https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com/`.|

## Clean up resources

If you're not going to continue to use this application, you can delete the resources you created by removing the resource group.

1. Select **Resource groups** from the Azure explorer
1. Find and right-click the `msdocs-storage-function` resource group from the list.
1. Select **Delete**. The process to delete the resource group may take a few minutes to complete.


## Sample code

* [Azure Functions sample code](https://github.com/Azure-Samples/msdocs-storage-bind-function-service/blob/main/javascript-v4)

## Next steps

* [Create a function app that connects to Azure services using identities instead of secrets](/azure/azure-functions/functions-identity-based-connections-tutorial)
* [Remediating anonymous public read access for blob data](/azure/storage/blobs/anonymous-read-access-overview)
