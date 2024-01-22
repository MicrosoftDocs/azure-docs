---
title: Send a Named Entity Recognition (NER) request to your custom model
description: Learn how to send requests for custom NER.
titleSuffix: Azure AI services
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: aahi
ms.devlang: csharp
# ms.devlang: csharp, python
ms.custom: language-service-custom-ner, event-tier1-build-2022
---

# Query your custom model

After the deployment is added successfully, you can query the deployment to extract entities from your text based on the model you assigned to the deployment.
You can query the deployment programmatically using the [Prediction API](https://aka.ms/ct-runtime-api) or through the client libraries (Azure SDK). 

## Test deployed model

You can use Language Studio to submit the custom entity recognition task and visualize the results. 

[!INCLUDE [Test model](../../includes/custom/language-studio/test-model.md)]

:::image type="content" source="../media/test-model-results.png" alt-text="A screenshot showing the model test results." lightbox="../media/test-model-results.png":::


## Send an entity recognition request to your model

# [Language Studio](#tab/language-studio)

[!INCLUDE [Get prediction URL](../../includes/custom/language-studio/get-prediction-url.md)]

# [REST API](#tab/rest-api)

First you need to get your resource key and endpoint:

[!INCLUDE [Get keys and endpoint Azure Portal](../../includes/key-endpoint-page-azure-portal.md)]


### Submit a custom NER task

[!INCLUDE [submit a custom NER task using the REST API](../includes/rest-api/submit-task.md)]

### Get task results

[!INCLUDE [get custom NER task results](../includes/rest-api/get-results.md)]

# [Client libraries (Azure SDK)](#tab/client)

First you need to get your resource key and endpoint:

[!INCLUDE [Get keys and endpoint Azure Portal](../../includes/get-key-endpoint.md)]

3. Download and install the client library package for your language of choice:
    
    |Language  |Package version  |
    |---------|---------|
    |.NET     | [5.2.0-beta.3](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0-beta.3)        |
    |Java     | [5.2.0-beta.3](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0-beta.3)        |
    |JavaScript     |  [6.0.0-beta.1](https://www.npmjs.com/package/@azure/ai-text-analytics/v/6.0.0-beta.1)       |
    |Python     | [5.2.0b4](https://pypi.org/project/azure-ai-textanalytics/5.2.0b4/)         |
    
4. After you've installed the client library, use the following samples on GitHub to start calling the API.
    
    * [C#](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples/Sample8_RecognizeCustomEntities.md)
    * [Java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/src/samples/java/com/azure/ai/textanalytics/lro/RecognizeCustomEntities.java)
    * [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-text-analytics_6.0.0-beta.1/sdk/textanalytics/ai-text-analytics/samples/v5/javascript/customText.js)
    * [Python](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/samples/sample_recognize_custom_entities.py)
    
5. See the following reference documentation for more information on the client, and return object:
    
    * [C#](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)
    * [Java](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)
    * [JavaScript](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)
    * [Python](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?view=azure-python-preview&preserve-view=true)
    
---

## Next steps

* [Frequently asked questions](../faq.md)
