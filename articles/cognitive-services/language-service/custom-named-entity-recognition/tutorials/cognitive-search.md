---
title: Enrich a Cognitive Search index with custom entities
titleSuffix: Azure Cognitive Services
description: Improve your cognitive search indices using custom Named Entity Recognition (NER)
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: tutorial
ms.date: 04/26/2022
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021, event-tier1-build-2022
---

# Tutorial: Enrich a Cognitive Search index with custom entities from your data

In enterprise, having an abundance of electronic documents can mean that searching through them is a time-consuming and expensive task. [Azure Cognitive Search](../../../../search/search-create-service-portal.md) can help with searching through your files, based on their indices. Custom named entity recognition can help by extracting relevant entities from your files, and enriching the process of indexing these files.

In this tutorial, you learn how to:

* Create a custom named entity recognition project.
* Publish Azure function.
* Add an index to Azure Cognitive Search.

## Prerequisites

* [An Azure Language resource connected to an Azure blob storage account](../how-to/create-project.md).
    * We recommend following the instructions for creating a resource using the Azure portal, for easier setup. 
* [An Azure Cognitive Search service](../../../../search/search-create-service-portal.md) in your current subscription
    * You can use any tier, and any region for this service.
* An [Azure function app](../../../../azure-functions/functions-create-function-app-portal.md)

## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom NER](../includes/quickstarts/blob-storage-upload.md)]

# [Language Studio](#tab/Language-studio)

## Create a custom named entity recognition project

Once your resource and storage account are configured, create a new custom NER project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

[!INCLUDE [Create custom NER project](../includes/language-studio/create-project.md)]

## Train your model

Typically after you create a project, you go ahead and start [tagging the documents](../how-to/tag-data.md) you have in the container connected to your project. For this tutorial, you have imported a sample tagged dataset and initialized your project with the sample JSON tags file.

[!INCLUDE [Train a model using Language Studio](../includes/language-studio/train-model.md)]

## Deploy your model

Generally after training a model you would review its [evaluation details](../how-to/view-model-evaluation.md) and [make improvements](../how-to/view-model-evaluation.md) if necessary. In this quickstart, you will just deploy your model, and make it available for you to try in Language Studio, or you can call the [prediction API](https://aka.ms/ct-runtime-swagger).

[!INCLUDE [Deploy a model using Language Studio](../includes/language-studio/deploy-model.md)]

# [REST APIs](#tab/REST-APIs)

### Get your resource keys and endpoint

[!INCLUDE [Get keys and endpoint Azure Portal](../includes/get-keys-endpoint-azure.md)]

## Create a custom NER project

Once your resource and storage account are configured, create a new custom NER project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

Use the tags file you downloaded from the [sample data](https://github.com/Azure-Samples/cognitive-services-sample-data-files) in the previous step and add it to the body of the following request. 

### Trigger import project job 

[!INCLUDE [Import a project using the REST API](../includes/rest-api/import-project.md)]

### Get import job status

 [!INCLUDE [get import project status](../includes/rest-api/get-import-status.md)]

## Train your model

Typically after you create a project, you go ahead and start [tagging the documents](../how-to/tag-data.md) you have in the container connected to your project. For this tutorial, you have imported a sample tagged dataset and initialized your project with the sample JSON tags file.

### Start training job

After your project has been imported, you can start training your model. 

[!INCLUDE [train model](../includes/rest-api/train-model.md)]

### Get training job status

Training could take sometime between 10 and 30 minutes for this sample dataset. You can use the following request to keep polling the status of the training job until it's successfully completed.

 [!INCLUDE [get training model status](../includes/rest-api/get-training-status.md)]

## Deploy your model

Generally after training a model you would review its [evaluation details](../how-to/view-model-evaluation.md) and [make improvements](../how-to/view-model-evaluation.md) if necessary. In this tutorial, you will just deploy your model, and make it available for you to try in Language Studio, or you can call the [prediction API](https://aka.ms/ct-runtime-swagger).

### Start deployment job

[!INCLUDE [deploy model](../includes/rest-api/deploy-model.md)]

### Get deployment job status

[!INCLUDE [get deployment status](../includes/rest-api/get-deployment-status.md)]

---

## Use CogSvc language utilities tool for Cognitive search integration
 
### Publish your Azure Function

1. Download and use the [provided sample function](https://aka.ms/CustomTextAzureFunction).

2. After you download the sample function, open the *program.cs* file in Visual Studio and [publish the function to Azure](../../../../azure-functions/functions-develop-vs.md?tabs=in-process#publish-to-azure).

### Prepare configuration file

1. Download [sample configuration file](https://aka.ms/CognitiveSearchIntegrationToolAssets) and open it in a text editor. 

2. Get your storage account connection string by:
    
    1. Navigating to your storage account overview page in the [Azure portal](https://portal.azure.com/#home). 
    2. In the **Access Keys** section in the menu to the left of the screen, copy your **Connection string** to the `connectionString` field in the configuration file, under `blobStorage`.
    3. Go to the container where you have the files you want to index and copy container name to the `containerName` field in the configuration file, under `blobStorage`. 

3. Get your cognitive search endpoint and keys by:
    
    1. Navigating to your resource overview page in the [Azure portal](https://portal.azure.com/#home).
    2. Copy the **Url** at the top-right section of the page to the `endpointUrl` field within `cognitiveSearch`.
    3. Go to the **Keys** section in the menu to the left of the screen. Copy your **Primary admin key** to the `apiKey` field within `cognitiveSearch`.

4. Get Azure Function endpoint and keys
   
    1. To get your Azure Function endpoint and keys, go to your function overview page in the [Azure portal](https://portal.azure.com/#home).
    2. Go to **Functions** menu on the left of the screen, and select on the function you created.
    3. From the top menu, select **Get Function Url**. The URL will be formatted like this: `YOUR-ENDPOINT-URL?code=YOUR-API-KEY`. 
    4. Copy `YOUR-ENDPOINT-URL` to the `endpointUrl` field in the configuration file, under `azureFunction`. 
    5. Copy `YOUR-API-KEY` to the `apiKey` field in the configuration file, under `azureFunction`. 

5. Get your resource keys endpoint

   [!INCLUDE [Get resource keys and endpoint](../includes/get-keys-endpoint-azure.md)]

6. Get your custom NER project secrets

    1. You will need your **project-name**, project names are case-sensitive. Project names can be found in **project settings** page.

    2. You will also need the **deployment-name**. Deployment names can be found in **Deploying a model** page.

### Run the indexer command

After you've published your Azure function and prepared your configs file, you can run the indexer command.
```cli
    indexer index --index-name <name-your-index-here> --configs <absolute-path-to-configs-file>
```

Replace `name-your-index-here` with the index name that appears in your Cognitive Search instance.

## Next steps

* [Search your app with with the Cognitive Search SDK](../../../../search/search-howto-dotnet-sdk.md#run-queries)
