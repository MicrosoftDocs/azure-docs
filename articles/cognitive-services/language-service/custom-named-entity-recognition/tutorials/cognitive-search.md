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
ms.date: 02/04/2022
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
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
* Download this [sample data](https://go.microsoft.com/fwlink/?linkid=2175226).

## Create a custom NER project through Language studio

[!INCLUDE [Create custom NER project](../includes/create-project.md)]

Select the container where you’ve uploaded your data. For this tutorial we’ll use the tags file you downloaded from the sample data. Review the data you entered and select **Create Project**.

## Train your model

[!INCLUDE [Train a model using Language Studio](../includes/train-model-language-studio.md)]

## Deploy your model

[!INCLUDE [Deploy a model using Language Studio](../includes/deploy-model-language-studio.md)]

If you deploy your model through Language Studio, your `deployment-name` will be `prod`.

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

    1. Navigate to your resource in the [Azure portal](https://portal.azure.com/#home).
    2. From the menu on the left side, select **Keys and Endpoint**. You’ll need the endpoint and one of the keys for the API requests.

        :::image type="content" source="../../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint screen in the Azure portal" lightbox="../../media/azure-portal-resource-credentials.png":::

6. Get your custom NER project secrets

    1. You’ll need your **project-name**, project names are case-sensitive.

    2. You’ll also need the **deployment-name**. 
        * If you’ve deployed your model via Language Studio, your deployment name will be `prod` by default. 
        * If you’ve deployed your model programmatically, using the API, this is the deployment name you assigned in your request.

### Run the indexer command

After you’ve published your Azure function and prepared your configs file, you can run the indexer command.
```cli
    indexer index --index-name <name-your-index-here> --configs <absolute-path-to-configs-file>
```

Replace `name-your-index-here` with the index name that appears in your Cognitive Search instance.

## Next steps

* [Search your app with with the Cognitive Search SDK](../../../../search/search-howto-dotnet-sdk.md#run-queries)
