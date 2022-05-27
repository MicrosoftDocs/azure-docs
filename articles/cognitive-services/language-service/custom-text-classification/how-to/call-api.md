---
title: Send a text classification request to your model
description: Learn how to send a request for custom text classification.
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/15/2022
ms.author: aahi
ms.devlang: csharp, python
ms.custom: language-service-clu, ignite-fall-2021, event-tier1-build-2022
---

# Query deployment to classify text

After the deployment is added successfully, you can query the deployment to classify text based on the model you assigned to the deployment.
You can query the deployment programmatically [Prediction API](https://aka.ms/ct-runtime-api) or through the [client libraries (Azure SDK)](#get-task-results). 

## Test deployed model

You can use the Language Studio to submit the custom text classification task and visualize the results. 

[!INCLUDE [Test model](../includes/language-studio/test-model.md)]

---

## Send a text classification request to your model

> [!TIP]
> You can [test your model in Language Studio](../quickstart.md?pivots=language-studio#test-your-model) by sending sample text to classify it.

# [Language Studio](#tab/language-studio)

[!INCLUDE [Get pred URL](../includes/language-studio/get-prediction-url.md)]

# [REST API](#tab/rest-api)

First you will need to get your resource key and endpoint:

[!INCLUDE [Get keys and endpoint Azure Portal](../includes/get-keys-endpoint-azure.md)]

### Submit a custom text classification task

[!INCLUDE [submit a text classification task using the REST API](../includes/rest-api/submit-task.md)]


### Get task results

[!INCLUDE [get custom NER task results](../includes/rest-api/get-results.md)]

# [Client libraries (Azure SDK)](#tab/client-libraries)

First you will need to get your resource key and endpoint:

[!INCLUDE [Get keys and endpoint Azure Portal](../includes/get-keys-endpoint-azure.md)]

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

## Next steps

* [Custom text classification overview](../overview.md)
