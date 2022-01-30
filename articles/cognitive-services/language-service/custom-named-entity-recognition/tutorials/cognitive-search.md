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
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021
---

# Tutorial: Enrich a Cognitive Search index with custom entities from your data

In enterprise, having an abundance of electronic documents can mean that searching through them is a time-consuming and expensive task. [Azure Cognitive Search](../../../../search/search-create-service-portal.md) can help with searching through your files, based on their indices. Custom NER can help by extracting relevant entities from your files, and enriching the process of indexing these files.

In this tutorial, you learn how to:

* Create a Custom Named Entity Recognition project.
* Publish Azure Function.
* Add an index to Azure Cognitive Search.

## Prerequisites

* [An Azure Language resource connected to an Azure blob storage account](../how-to/create-project.md).
    * We recommend following the instructions for creating a resource using the Azure portal, for easier setup. 
* [An Azure Cognitive Search service](../../../../search/search-create-service-portal.md) in your current subscription
    * You can use any tier, and any region for this service.
* An [Azure function app](../../../../azure-functions/functions-create-function-app-portal.md)
* Download this [sample data](https://go.microsoft.com/fwlink/?linkid=2175226).

## Create a custom NER project through Language studio

1. Login through the [Language studio portal](https://aka.ms/LanguageStudio) and select **Custom entity extraction**.

2. Select your Language resource. Make sure you have [enabled identity management](../how-to/create-project.md#enable-identity-management-for-your-resource) and roles for your resource and storage account.

3. From the top of the projects screen, select **Create new project**. If requested, choose your storage account from the menu that appears.

    :::image type="content" source="../media/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../media/create-project.png":::

4. Enter the information for your project:

    | Key | Description |
    |--|--|
    | Name | The name of your project. You will not be able to rename your project after you create it. |
    | Description | A description of your project |
    | Language | The language of the files in your project.|

    > [!NOTE]
    > If your documents will be in multiple languages, select the **multiple languages** option in project creation, and set the **language** option to the language of the majority of your documents.

5. For this tutorial, use an **existing tags file** and select the tags file you downloaded from the sample data.

## Train your model

1. Select **Train** from the left side menu.

2. To train a new model, select **Train a new model** and type in the model name in the text box below.

    :::image type="content" source="../media/train-model.png" alt-text="Create a new model" lightbox="../media/train-model.png":::

3. Select the **Train** button at the bottom of the page.

4. After training is completed, you can [view the model's evaluation details](../how-to/view-model-evaluation.md) and [improve the model](../how-to/improve-model.md)

## Deploy your model

1. Select **Deploy model** from the left side menu.

2. Select the model you want to deploy and from the top menu click on **Deploy model**. You can only see models that have completed training successfully.

## Prepare your secrets for the Azure function

Next you will need to prepare your secrets for your Azure function. Your project secrets are your: 
* Endpoint
* Resource key
* Deployment name

### Get your custom NER project secrets

* You will need your **Project name**, Project names are case sensitive.

* You will also need the deployment name. 
   * If you have deployed your model via Language Studio, your deployment slot will be `prod` by default. 
   * If you have deployed your model programmatically, using the API, this is the deployment name you assigned in your request.

### Get your resource keys endpoint

1. Navigate to your resource in the [Azure portal](https://ms.portal.azure.com/#home).

2. From the menu on the left side, select **Keys and Endpoint**. You will need the endpoint and one of the keys for the API requests.

    :::image type="content" source="../../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint screen in the Azure portal" lightbox="../../media/azure-portal-resource-credentials.png":::
   
## Edit and deploy your Azure Function

1. Download and use the [provided sample function](https://aka.ms/ct-cognitive-search-integration-tool).

2. After you download the sample function, open the *program.cs* file and enter your app secrets.

3. [Publish the function to Azure](../../../../azure-functions/functions-develop-vs.md?tabs=in-process#publish-to-azure).

## Use the integration tool

In the following sections, you will use the [Cognitive Search Integration tool](https://aka.ms/ct-cognitive-search-integration-tool) to integrate your project with Azure Cognitive Search. Download this repo now. 

### Prepare configuration file

1. In the folder you just download, and find the [sample configuration file](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/dev/CustomTextAnalytics.CognitiveSearch/Samples/configs.json). Open it in a text editor. 

2. Get your storage account connection string by:
    1. Navigating to your storage account overview page in the [Azure portal](https://ms.portal.azure.com/#home).
    2. In the top section of the screen, copy your container name to the `containerName` field in the configuration file, under `blobStorage`.  
    3. In the **Access Keys** section in the menu to the left of the screen, copy your **Connection string** to the `connectionString` field in the configuration file, under `blobStorage`.

1. Get your cognitive search endpoint and keys by:
    1. Navigating to your resource overview page in the [Azure portal](https://ms.portal.azure.com/#home).
    2. Copy the **Url** at the top-right section of the page to the `endpointUrl` field within `cognitiveSearch`.
    3. Go to the **Keys** section in the menu to the left of the screen. Copy your **Primary admin key** to the `apiKey` field within `cognitiveSearch`.

3. Get Azure Function endpoint and keys
    
    1. To get your Azure Function endpoint and keys, go to your function overview page in the [Azure portal](https://ms.portal.azure.com/#home).
    2. Go to **Functions** menu on the left of the screen, and click on the function you created.
    3. From the top menu, click **Get Function Url**. The URL will be formatted like this: `YOUR-ENDPOINT-URL?code=YOUR-API-KEY`. 
    4. Copy `YOUR-ENDPOINT-URL` to the `endpointUrl` field in the configuration file, under `azureFunction`. 
    5. Copy `YOUR-API-KEY` to the `apiKey` field in the configuration file, under `azureFunction`. 

### Prepare schema file

In the folder you downloaded earlier, find the [sample schema file](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/dev/CustomTextAnalytics.CognitiveSearch/Samples/app-schema.json). Open it in a text editor. 

The entries in the `entityNames` array will be the entity names you have assigned while creating your project. You can copy and paste them from your project in [Language Studio](https://aka.ms/custom-extraction), or 

### Run the `Index` command

After you have completed your configuration and schema file, you can index your project. Place your configuration file in the same path of the CLI tool, and run the following command:

```cli
    indexer index --schema <path/to/your/schema> --index-name <name-your-index-here>
```

Replace `name-your-index-here` with the index name that appears in your Cognitive Search instance.

## Next steps

* [Search your app with with the Cognitive Search SDK](../../../../search/search-howto-dotnet-sdk.md#run-queries)
