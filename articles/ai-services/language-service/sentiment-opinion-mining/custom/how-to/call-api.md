---
title: Send a Custom sentiment analysis request to your custom model
description: Learn how to send requests for Custom sentiment analysis.
titleSuffix: Azure AI services
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: aahi
ms.devlang: csharp, python
ms.custom: language-service-custom-ner, event-tier1-build-2022
---

# Send a Custom sentiment analysis request to your custom model

After the deployment is added successfully, you can query the deployment to extract entities from your text based on the model you assigned to the deployment.
You can query the deployment programmatically using the [Prediction API](https://aka.ms/ct-runtime-api) or through the client libraries (Azure SDK). 

## Test a deployed Custom sentiment analysis model

You can use Language Studio to submit the custom entity recognition task and visualize the results. 

[!INCLUDE [Test model](../../../includes/custom/language-studio/test-model.md)]

<!--:::image type="content" source="../media/test-model-results.png" alt-text="View the test results" lightbox="../media/test-model-results.png":::--->


## Send a sentiment analysis request to your model

# [Language Studio](#tab/language-studio)

[!INCLUDE [Get prediction URL](../../../includes/custom/language-studio/get-prediction-url.md)]

# [REST API](#tab/rest-api)

First you need to get your resource key and endpoint:

[!INCLUDE [Get keys and endpoint Azure Portal](../../../includes/key-endpoint-page-azure-portal.md)]




### Submit a Custom sentiment analysis task

[!INCLUDE [submit a Custom sentiment analysis task using the REST API](../../includes/custom/rest-api/submit-task.md)]

### Get task results

[!INCLUDE [get Custom sentiment analysis task results](../../includes/custom/rest-api/get-results.md)]

## Next steps

* [Sentiment Analysis overview](../../overview.md)