---
title: "Quickstart: Text Analytics client library v3 | Microsoft Docs"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to connect your applications to the Text Analytics API from Azure Cognitive Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 06/11/2020
ms.author: aahi
ms.custom: tracking-python
zone_pivot_groups: programming-languages-text-analytics
---

# Quickstart: Use the Text Analytics client library

Get started with the Text Analytics client library. Follow these steps to install the package and try out the example code for basic tasks.

Use the Text Analytics client library to perform:

* Sentiment analysis
* Language detection
* Entity recognition
* Key phrase extraction

::: zone pivot="programming-language-csharp"

> [!IMPORTANT]
> * The latest stable version of the Text Analytics API is `3.0`.
>    * Be sure to only follow the instructions for the version you are using.
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. See the reference documentation below.

[!INCLUDE [C# quickstart](../includes/quickstarts/csharp-sdk.md)]

::: zone-end

::: zone pivot="programming-language-java"

> [!IMPORTANT]
> * The latest stable version of the Text Analytics API is `3.0`.
> * The code in this article uses synchronous methods and un-secured credentials storage for simplicity reasons. For production scenarios, we recommend using the batched asynchronous methods for performance and scalability. See the reference documentation below.

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

[!INCLUDE [Python quickstart](../includes/quickstarts/python-sdk.md)]

::: zone-end

::: zone pivot="programming-language-other"

## Additional language support

If you've clicked this tab, you probably didn't see a quickstart in your favorite programming language. Don't worry, we have additional quickstarts available. Use the table to find the right sample for your programming language.

| Language | Available version | 
|----------|------------------------|
| Ruby     | [Version 2.1](ruby-sdk.md) | 
| Go       | [Version 2.1](go-sdk.md) | 

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
