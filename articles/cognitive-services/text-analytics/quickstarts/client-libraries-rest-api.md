---
title: "Quickstart: Text mining using the Text Analytics client library"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to perform sentiment analysis and more, using the Text Analytics API from Azure Cognitive Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 04/19/2021
ms.author: aahi
keywords: text mining, sentiment analysis, text analytics
ms.custom: "devx-track-python, devx-track-js, devx-track-csharp, cog-serv-seo-aug-2020"
zone_pivot_groups: programming-languages-text-analytics       
---

# Quickstart: Use the Text Analytics client library and REST API

Use this article to get started with the Text Analytics client library and REST API. Follow these steps to try out examples code for mining text:

* Sentiment analysis
* Opinion mining
* Language detection
* Entity recognition
* Personal Identifying Information recognition
* Key phrase extraction


::: zone pivot="programming-language-csharp"

> [!IMPORTANT]
> * The latest stable version of the Text Analytics API is `3.0`.
>    * Be sure to only follow the instructions for the version you are using.
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. See the reference documentation below.
> * If you want to use Text Analytics for health or Asynchronous operations, see the examples on Github for [C#](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics), [Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/) or [Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/textanalytics/azure-ai-textanalytics)

[!INCLUDE [C# quickstart](../includes/quickstarts/csharp-sdk.md)]

::: zone-end

::: zone pivot="programming-language-java"

> [!IMPORTANT]
> * The latest stable version of the Text Analytics API is `3.0`.
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. See the reference documentation below.
If you want to use Text Analytics for health or Asynchronous operations, see the examples on Github for [C#](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics), [Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/) or [Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/textanalytics/azure-ai-textanalytics)

[!INCLUDE [Java quickstart](../includes/quickstarts/java-sdk.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

> [!IMPORTANT]
> * The latest stable version of the Text Analytics API is `3.0`.
>    * Be sure to only follow the instructions for the version you are using.
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. See the reference documentation below.
> * You can also run this version of the Text Analytics client library [in your browser](https://github.com/Azure/azure-sdk-for-js/blob/master/documentation/Bundling.md).

[!INCLUDE [NodeJS quickstart](../includes/quickstarts/nodejs-sdk.md)]

::: zone-end

::: zone pivot="programming-language-python"

> [!IMPORTANT]
> * The latest stable version of the Text Analytics API is `3.0`.
>    * Be sure to only follow the instructions for the version you are using.
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. See the reference documentation below. 
If you want to use Text Analytics for health or Asynchronous operations, see the examples on Github for [C#](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics), [Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/textanalytics/azure-ai-textanalytics/) or [Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/textanalytics/azure-ai-textanalytics)

[!INCLUDE [Python quickstart](../includes/quickstarts/python-sdk.md)]

::: zone-end

::: zone pivot="rest-api"

> [!IMPORTANT]
> * The latest stable version of the Text Analytics API is `3.0`.
>    * Be sure to only follow the instructions for the version you are using.

[!INCLUDE [REST API quickstart](../includes/quickstarts/rest-api.md)]

::: zone-end

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
> [Explore a solution](../text-analytics-user-scenarios.md#analyze-recorded-inbound-customer-calls)

* [Text Analytics overview](../overview.md)
* [Sentiment analysis](../how-tos/text-analytics-how-to-sentiment-analysis.md)
* [Entity recognition](../how-tos/text-analytics-how-to-entity-linking.md)
* [Detect language](../how-tos/text-analytics-how-to-keyword-extraction.md)
* [Language recognition](../how-tos/text-analytics-how-to-language-detection.md)
