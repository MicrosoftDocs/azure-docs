---
title: How to submit custom text classification tasks
titleSuffix: Azure Cognitive Services
description: Learn about sending a request for custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/15/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# Deploy a model and classify text using the runtime API

After you're satisfied with your model, and made any necessary improvements, you can deploy it and start classifying text. Deploying a model makes it available for use through the runtime API.

## Prerequisites

* [A custom text classification project](create-project.md) with a configured Azure blob storage account,
* Text data that has [been uploaded](create-project.md#prepare-training-data) to your storage account.
* [Tagged data](tag-data.md) and successfully [trained model](train-model.md)
* Reviewed the [model evaluation details](view-model-evaluation.md) to determine how your model is performing.
* (optional) [Made improvements](improve-model.md) to your model if its performance isn't satisfactory. 

See the [application development lifecycle](../overview.md#project-development-lifecycle) for more information.

## Deploy your model

Deploying a model hosts it and makes it available for predictions through an endpoint.



When a model is deployed, you will be able to test the model directly in the portal or by calling the API associated with it.

> [!NOTE]
> You can only have ten deployment names.

[!INCLUDE [Deploy a model using Language Studio](../includes/deploy-model-language-studio.md)]
   
### Delete deployment

To delete a deployment, select the deployment you want to delete and click **Delete deployment**

> [!TIP]
> You can [test your model in Language Studio](../quickstart.md?pivots=language-studio#test-your-model) by sending samples of text for it to classify. 

## Send a text classification request to your model

# [Using Language Studio](#tab/language-studio)

### Using Language studio

1. After the deployment is completed, select the model you want to use and from the top menu click on **Get prediction URL** and copy the URL and body.

    :::image type="content" source="../media/get-prediction-url-1.png" alt-text="run-inference" lightbox="../media/get-prediction-url-1.png":::

2. In the window that appears, under the **Submit** pivot, copy the sample request into your command line

3. Replace `<YOUR_DOCUMENT_HERE>` with the actual text you want to classify.

    :::image type="content" source="../media/get-prediction-url-2.png" alt-text="run-inference-2" lightbox="../media/get-prediction-url-2.png":::

4. Submit the request

5. In the response header you receive extract `jobId` from `operation-location`, which has the format: `{YOUR-ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<jobId}>`

6. Copy the retrieve request and replace `<OPERATION-ID>` with `jobId` received from the last step and submit the request.

    :::image type="content" source="../media/get-prediction-url-3.png" alt-text="run-inference-3" lightbox="../media/get-prediction-url-3.png":::

You will need to use the REST API. Click on the **REST API** tab above for more information.

# [Using the API](#tab/rest-api)

### Using the REST API

First you will need to get your resource key and endpoint

1. Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../media/get-endpoint-azure.png":::

### Submit a custom text classification task

[!INCLUDE [submit a text classification task using the REST API](../includes/rest-api/text-classification-task.md)]

### Get the results for a custom text classification task

[!INCLUDE [Get results for a text classification task using the REST API](../includes/rest-api/get-results.md)]

# [Using the client libraries (Azure SDK)](#tab/client)

## Use the client libraries

1. Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home)

2. From the menu on the left side, select **Keys and Endpoint**. Use endpoint for the API requests and you will need the key for `Ocp-Apim-Subscription-Key` header.

    :::image type="content" source="../../custom-classification/media/get-endpoint-azure.png" alt-text="Get the Azure endpoint" lightbox="../../custom-classification/media/get-endpoint-azure.png":::

3. Download and install the client library package for your language of choice:
    
    |Language  |Package version  |
    |---------|---------|
    |.NET     | [5.2.0-beta.2](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0-beta.2)        |
    |Java     | [5.2.0-beta.2](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0-beta.2)        |
    |JavaScript     |  [5.2.0-beta.2](https://www.npmjs.com/package/@azure/ai-text-analytics/v/5.2.0-beta.2)       |
    |Python     | [5.2.0b2](https://pypi.org/project/azure-ai-textanalytics/5.2.0b2/)         |
    
4. After you've installed the client library, use the following samples on GitHub to start calling the API.
    
    Single label classification:
    * [C#](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample10_SingleCategoryClassify.md)
    * [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/ClassifyDocumentSingleCategory.java)
    * [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js)
    * [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_single_category_classify.py)
    
    Multi label classification:
    * [C#](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample11_MultiCategoryClassify.md)
    * [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/ClassifyDocumentMultiCategory.java)
    * [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js)
    * [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_multi_category_classify.py)

5. See the following reference documentation for more information on the client, and return object:
    
    * [C#](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)
    * [Java](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)
    * [JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)
    * [Python](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?view=azure-python-preview&preserve-view=true)
---

