---
title: Send a custom Text Analytics for health request to your custom model
description: Learn how to send a request for custom text analytics for health.
titleSuffix: Azure AI services
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 04/14/2023
ms.author: aahi
ms.devlang: REST API
ms.custom: language-service-custom-ta4h
---

# Send queries to your custom Text Analytics for health model

After the deployment is added successfully, you can query the deployment to extract entities from your text based on the model you assigned to the deployment.
You can query the deployment programmatically using the [Prediction API](https://aka.ms/ct-runtime-api). 

## Test deployed model

You can use Language Studio to submit the custom Text Analytics for health task and visualize the results. 

[!INCLUDE [Test model](../../includes/custom/language-studio/test-model.md)]

:::image type="content" source="../media/test-model-results.png" alt-text="A screenshot showing the deployment testing screen in Language Studio for Custom text analytics of health." lightbox="../media/test-model-results.png":::


## Send a custom text analytics for health request to your model

# [Language Studio](#tab/language-studio)

[!INCLUDE [Get prediction URL](../../includes/custom/language-studio/get-prediction-url.md)]


# [REST API](#tab/rest-api)

First you will need to get your resource key and endpoint:

[!INCLUDE [Get keys and endpoint Azure Portal](../../includes/key-endpoint-page-azure-portal.md)]


### Submit a custom Text Analytics for health task

[!INCLUDE [submit a custom Text Analytics for health task using the REST API](../includes/rest-api/submit-task.md)]

### Get task results

[!INCLUDE [get custom Text Analytics for health task results](../includes/rest-api/get-results.md)]


---

## Next steps

* [Custom text analytics for health](../overview.md)
