---
title: Use the Language SDK and REST API
titleSuffix: Azure Cognitive Services
description: Learn about how to integrate the Language service SDK and REST API into your applications.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 06/15/2022
ms.author: aahi
---

# SDK and REST developer guide for the Language service

Use this article to find information on integrating the Language service SDKs and REST API into your applications. 

>[!TIP]
> Is it your first time using Language service features? You can find quickstart guides with both REST API and SDK samples in the documentation for the [available features](../overview.md#available-features) you want to use.

## Development options

The Language service provides support through a REST API, and client libraries in several languages.

# [Client library (Azure SDK)](#tab/language-studio)

## Client libraries (Azure SDK)

The Language service provides three namespaces for using the available features. Depending on which features and programming language you're using, you will need to download one or more of the following packages.  

### Azure.AI.TextAnalytics  

>[!NOTE] 
> If you're using custom named entity recognition or custom text classification, you will need to create a project and train a model before using the SDK. The SDK only provides the ability to analyze text using models you create. See the following quicsktarts for more information. 
> * [Custom named entity recognition](../custom-named-entity-recognition/quickstart.md)
> * [Custom text classification](../custom-text-classification/quickstart.md)

The `Azure.AI.TextAnalytics` namespace enables you to use the following Language features:

* [Custom named entity recognition](../custom-named-entity-recognition/overview.md)
* [Custom text classification](../custom-text-classification/overview.md)
* [Document summarization](../summarization/overview.md?tabs=document-summarization)
* [Entity linking](../entity-linking/overview.md)
* [Key phrase extraction](../key-phrase-extraction/overview.md)
* [Named entity recognition (NER)](../named-entity-recognition/overview.md)
* [Personally Identifying Information (PII) detection](../personally-identifiable-information/overview.md)
* [Sentiment analysis and opinion mining](../sentiment-opinion-mining/overview.md)
* [Text analytics for health](../text-analytics-for-health/overview.md)

As you use these features in your application, use the following documentation and code samples for additional information.

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|C#     | [C# documentation](/dotnet/api/azure.ai.textanalytics?view=azure-dotnet-preview&preserve-view=true)        | [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)        |
| Java     | [Java documentation](/java/api/overview/azure/ai-textanalytics-readme?view=azure-java-preview&preserve-view=true)        | [Java Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) |
|JavaScript     | [JavaScript documentation](/javascript/api/overview/azure/ai-text-analytics-readme?view=azure-node-preview&preserve-view=true)        | [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples/v5) |
|Python | [Python documentation](/python/api/overview/azure/ai-textanalytics-readme?view=azure-python-preview&preserve-view=true)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) |


### Azure.AI.Language.Conversations 

> [!NOTE] 
> If you're using conversational language understanding or orchestration workflow, you will need to create a project and train a model before using the SDK. The SDK only provides the ability to analyze text using models you create. See the following quicsktarts for more information. 
> * [Conversational language understanding](../conversational-language-understanding/quickstart.md)
> * [Orchestration workflow](../orchestration-workflow/quickstart.md)

The `Azure.AI.Language.Conversations` namespace enables you to use the following Language features:

* [Conversational language understanding](../conversational-language-understanding/overview.md)
* [Orchestration workflow](../orchestration-workflow/overview.md)
* [Conversation summarization](../summarization/overview.md?tabs=conversation-summarization)
* [Personally Identifying Information (PII) detection for conversations](../summarization/how-to/conversation-summarization.md)

As you use these features in your application, use the following documentation and code samples for additional information.

|Development option / language  | Reference documentation |Samples  |
|---------|---------|---------|---------|
|C#     | [C# documentation](/dotnet/api/overview/azure/ai.language.conversations-readme-pre?view=azure-dotnet-preview&preserve-view=true)        |  [C# samples](https://aka.ms/sdk-sample-conversation-dot-net)        |
|Python |  [Python documentation](/python/api/overview/azure/ai-language-conversations-readme?view=azure-python-preview&preserve-view=true)        | [Python samples](https://aka.ms/sdk-samples-conversation-python) |

### Azure.AI.Language.QuestionAnswering 

The `Azure.AI.Language.QuestionAnswering` namespace enables you to use the following Language features:

* [Question answering](../question-answering/overview.md)

As you use these features in your application, use the following documentation and code samples for additional information.

|Development option / language  |Reference documentation  |Samples  |
|---------|---------|---------|
|C#     | [C# documentation](/dotnet/api/overview/azure/ai.language.questionanswering-readme-pre?view=azure-dotnet)        |  [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/cognitivelanguage/Azure.AI.Language.QuestionAnswering)        |
|Python | [Python documentation](/python/api/overview/azure/ai-language-questionanswering-readme?view=azure-python)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-questionanswering) |


# [REST API](#tab/rest-api)

## REST API

The Language service provides multiple API endpoints depending on which feature you wish to use.

### Conversation analysis authoring API

The conversation analysis authoring API enables you to author custom models and create/manage projects for:
* [Conversational language understanding](../conversational-language-understanding/overview.md)
* [Orchestration workflow](../orchestration-workflow/overview.md)

#### Reference documentation

* [Reference documentation](/rest/api/language/conversational-analysis-authoring)

### Conversation analysis runtime API

The conversation analysis runtime API enables you to send requests to custom models you've created for:
* [Conversational language understanding](../conversational-language-understanding/overview.md)
* [Orchestration workflow](../orchestration-workflow/overview.md)

It additionally enables you to use the following features, without creating any models:
* [Conversation summarization](../summarization/overview.md?tabs=conversation-summarization)
* [Personally Identifiable Information (PII) detection for conversations](../summarization/how-to/conversation-summarization.md)

#### Reference documentation

* [Reference documentation](/rest/api/language/conversation-analysis-runtime)

### Text analysis authoring API

The text analysis authoring API enables you to author custom models and create/manage projects for:
* [Custom named entity recognition](../custom-named-entity-recognition/overview.md)
* [Custom text classification](../custom-text-classification/overview.md)

#### Reference documentation

* [Reference documentation](/rest/api/language/text-analysis-authoring)

### Text analysis runtime API

The text analysis runtime API enables you to send requests to custom models you've created for:

* [Custom named entity recognition](../custom-named-entity-recognition/overview.md)
* [Custom text classification](../custom-text-classification/overview.md)

It additionally enables you to use the following features, without creating any models:

* [Document summarization](../summarization/overview.md?tabs=document-summarization)
* [Entity linking](../entity-linking/overview.md)
* [Key phrase extraction](../key-phrase-extraction/overview.md)
* [Named entity recognition (NER)](../named-entity-recognition/overview.md)
* [Personally Identifying Information (PII) detection](../personally-identifiable-information/overview.md)
* [Sentiment analysis and opinion mining](../sentiment-opinion-mining/overview.md)
* [Text analytics for health](../text-analytics-for-health/overview.md)

#### Reference documentation

* [Reference documentation](/rest/api/language/text-analysis-runtime)

### Question answering APIs

The question answering APIs enables you to use the [question answering](../question-answering/overview.md) feature. 

#### Reference documentation

* [Prebuilt API](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers-from-text) - Use the prebuilt runtime API to answer specified question using text provided by users.
* [Custom authoring API](/rest/api/cognitiveservices/questionanswering/question-answering-projects) - Create a knowledge base to answer questions.
* [Custom runtime API](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers) - Query and knowledge base to generate an answer.

---

## See also 

[Azure Cognitive Service for Language overview](../overview.md)