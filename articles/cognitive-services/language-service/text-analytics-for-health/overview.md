---
title: What is the Text Analytics for health in Azure Cognitive Service for Language?
titleSuffix: Azure Cognitive Services
description: An overview of Text Analytics for health in Azure Cognitive Services, which helps you extract medical information from unstructured text, like clinical documents.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 03/01/2022
ms.author: aahi
ms.custom: language-service-health, ignite-fall-2021
---

# What is Text Analytics for health in Azure Cognitive Service for Language?

[!INCLUDE [service notice](includes/service-notice.md)]

Text Analytics for health is one of the features offered by [Azure Cognitive Service for Language](../overview.md), a collection of machine learning and AI algorithms in the cloud for developing intelligent applications that involve written language. 

This documentation contains the following types of articles:

* [**Quickstarts**](quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to/call-api.md) contain instructions for using the service in more specific or customized ways.
* The [**conceptual articles**](concepts/health-entity-categories.md) provide in-depth explanations of the service's functionality and features.

## Text Analytics for health features

Text Analytics for health extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records.

[!INCLUDE [Text Analytics for health](includes/features.md)]

> [!VIDEO https://docs.microsoft.com/Shows/AI-Show/Introducing-Text-Analytics-for-Health/player]

## Get started with Text analytics for health

To use this feature, you submit raw unstructured text for analysis and handle the API output in your application. Analysis is performed as-is, with no additional customization to the model used on your data. There are three ways to use Text Analytics for health:


|Development option  |Description  | Links | 
|---------|---------|---------|
| Language Studio    | A web-based platform that enables you to try Text Analytics for health without needing writing code. | • [Language Studio website](https://language.cognitive.azure.com/tryout/healthAnalysis) <br> • [Quickstart: Use the Language studio](../language-studio.md) |
| REST API or Client library (Azure SDK)     | Integrate Text Analytics for health into your applications using the REST API, or the client library available in a variety of languages. | • [Quickstart: Use Text Analytics for health](quickstart.md)  |
| Docker container | Use the available Docker container to deploy this feature on-premises, letting you bring the service closer to your data for compliance, security, or other operational reasons. | • [How to deploy on-premises](how-to/use-containers.md) |

## Input requirements and service limits

* Text Analytics for health takes raw unstructured text for analysis. See [Data and service limits](../concepts/data-limits.md) for more information.
* Text Analytics for health works with a variety of written languages. See [language support](language-support.md) for more information.

## Reference documentation and code samples

As you use Text Analytics for health in your applications, see the following reference documentation and samples for Azure Cognitive Services for Language:

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST API     | [REST API documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-2-Preview-2/operations/Analyze)        |         |
|C#     | [C# documentation](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)        | [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)        |
| Java     | [Java documentation](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)        | [Java Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) |
|JavaScript     | [JavaScript documentation](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)        | [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples/v5) |
|Python | [Python documentation](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python-preview&preserve-view=true)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) |

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the [transparency note for Text Analytics for health](/legal/cognitive-services/language-service/transparency-note-health?context=/azure/cognitive-services/language-service/context/context) to learn about responsible AI use and deployment in your systems. You can also see the following articles for more information:

[!INCLUDE [Responsible AI links](../includes/overview-responsible-ai-links.md)]
