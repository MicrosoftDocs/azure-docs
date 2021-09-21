---
title: Enrich a Cognitive Search index with custom entities
titleSuffix: Azure Cognitive Services
description: Improve your cognitive search indices using custom Named Entity Recognition (NER)
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: tutorial
ms.date: 09/21/2021
ms.author: aahi
---

# Tutorial: Enrich a Cognitive Search index with custom entities from your data

In enterprise, having an abundance of electronic documents can mean that searching through them is a time-consuming and expensive task. [Azure Cognitive Search](/azure/search/search-create-service-portal) can help with searching through your files, based on their indices. Custom NER can help by extracting relevant entities from your files, and enriching the process of indexing these files.

In this tutorial, you learn how to:

* Create a Custom Named Entity Recognition project.
* Publish Azure Function.
* Add an index to Azure Cognitive Search.

## Prerequisites

* An Azure Language [resource connected to an Azure blob storage account](../custom-classification/how-to/use-azure-resources.md).
    * we recommend following the instructions for creating a resource using the Azure portal, for easier setup. 
* [An Azure Cognitive Search service](/azure/search/search-create-service-portal) in your current subscription
    * You can use any tier, and any region any region for this service.
* An [Azure function app](/azure/azure-functions/functions-create-function-app-portal)
* Download this sample data

## Create Custom NER project through Language studio

1. Login through the [Language studio portal](https://language.azure.com/) and select **Custom entity extraction**.

2. Select your Language resource. Make sure you have [enabled identity management](../custom-classification/how-to/use-azure-resources.md#identity-management-for-your-language-services-resource) and roles for your resource and storage account.

3. From the top of the projects screen, select **Create new project**. If requested, choose your storage account from the menu that appears.

    :::image type="content" source="../media/create-project.png" alt-text="A screenshot of the project creation page." lightbox="../media/create-project.png":::

4. Enter the information for your project:

    | Key | Description |
    | -- | -- |
    | Name | The name of your project. You will not be able to rename your project after you create it. |
    | Description | A description of your project |
    | Language | The language of the files in your project.|

> [!NOTE]
> If your documents will be in multiple languages, select the **multiple languages** option in project creation, and set the **language** option to the language of the majority of your documents.

## Train your model

1. Select **Train** from the left side menu.
2. Enter a new model name or select an existing model from the **Model name** dropdown.

        >[!NOTE]
        > You can only have up to 10 models per project.
   
    :::image type="content" source="../media/train-model.png" alt-text="Select the model you want to train" lightbox="../media/train-model.png":::
     
3. Click on the **Train** button at the bottom of the page.

4. If the model you selected is already trained, a pop up will appear to confirm overwriting the last model state.

    >[!NOTE]
    > Training can take up to few hours.
    
5. After training is completed, you can [view the model's evaluation details](how-to/view-model-evaluation.md) and [improve the model](how-to/improve-model.md)

## Deploy your model

1. Select **Deploy model** from the left side menu.

2. Select the model you want to deploy and from the top menu click on **Deploy model**. You can only see models that have completed training successfully.

3. After you deploy your model, you will see a **Model ID** next to it. Save this ID for later.

## Prepare your secrets for the Azure function

Next you will need to prepare your secrets for your Azure function. Your project secrets are your **Endpoint**, **resource key** and **model ID**.

### Get your custom NER project secrets

1. Select **Deploy model** from the left side menu.

2. If your model is deployed, you will see a **Model ID**.

### Get your resource keys endpoint

1. Navigate to your resource in the [Azure portal](https://ms.portal.azure.com/#home).

2. From the menu on the left side, select **Keys and Endpoint**. You will need the endpoint and one of the keys for the API requests.

    :::image type="content" source="../../media/azure-portal-resource-credentials.png" alt-text="Select the model you want to train" lightbox="../../azure-portal-resource-credentials.png":::
   
## Edit and deploy your Azure Function

1. You can download and use the Sample function provided [here]().

* After download is complete, go to t [Program.cs]() file to enter the app secrets.

* Refer to this [guide](https://docs.microsoft.com/azure/azure-functions/functions-develop-vs?tabs=in-process#publish-to-azure) to deploy your azure function.

## Use Integration tool

You can use the [Cognitive Search Integration](https://aka.ms/ct-cognitive-search-integration-tool) tool from [Cognitive Services Language Utilities](https://aka.ms/CognitiveServicesLanguageUtilities)

### Prepare configs file

* Download sample configs file from [here](https://aka.ms/CognitiveSearchIntegrationToolAssets)

* Refer to the following sections to gather the required information for this step

#### Get storage account connection string

* Go to your storage account overview page in the [Azure Portal](https://ms.portal.azure.com/#home)

* Go to **Access Keys** blade on the left-nav bar, copy your `Connection string`.

#### Get cognitive search endpoint and keys

* Go to your resource overview page in the [Azure Portal](https://ms.portal.azure.com/#home)

* Copy the `Url` from the top right section of the page,

* Go to **Keys** blade on the left-nav bar, copy your `Primary admin key`.

#### Get Azure Function endpoint and keys

* Go to your function overview page in the [Azure Portal](https://ms.portal.azure.com/#home)

* Go to **Functions** blade on the left-nav bar and click on the function you created.

* From the top menu click on **Get Function Url**

* The url will be formted like this `{YOUR-ENDPOINT-URL}?code={YOUR-API-KEY}`, copy the relevant parts (`{YOUR-ENDPOINT-URL}` and `{YOUR-API-KEY}`)only to your configs file.

### Prepare schema file

* Download sample schema file from [here](https://aka.ms/CognitiveSearchIntegrationToolAssets)

* The entries of `entityNames` array are the entity names you have assigned while creating your project.

* You can either copy paste them from your project in [Language Studio](https://language.azure.com/customText/projects/extraction) or you can get them from the tags file directly.

### Run `Index` command

After you have completed your configs and schema file. Place your configs file in the same path of the CLI tool and run the following command.

```cli
    indexer index --schema <path/to/your/schema> --index-name <name-your-index-here>
```

`name-your-index-here` is the index name that appears in your cognitive search.
