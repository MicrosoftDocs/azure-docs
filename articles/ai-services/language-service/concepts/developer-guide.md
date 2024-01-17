---
title: Use the Language SDK and REST API
titleSuffix: Azure AI services
description: Learn about how to integrate the Language service SDK and REST API into your applications.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
---

# SDK and REST developer guide for the Language service

Use this article to find information on integrating the Language service SDKs and REST API into your applications. 

## Development options

The Language service provides support through a REST API, and client libraries in several languages.

# [Client library (Azure SDK)](#tab/language-studio)

## Client libraries (Azure SDK)

The Language service provides three namespaces for using the available features. Depending on which features and programming language you're using, you will need to download one or more of the following packages, and have the following framework/language version support:

|Framework/Language  | Minimum supported version  |
|---------|---------|
|.NET     | .NET Framework 4.6.1 or newer, or .NET (formerly .NET Core) 2.0 or newer.       |
|Java     | v8 or later        |
|JavaScript     | v14 LTS or later        |
|Python| v3.7 or later        |

### Azure.AI.TextAnalytics  

>[!NOTE] 
> If you're using custom named entity recognition or custom text classification, you will need to create a project and train a model before using the SDK. The SDK only provides the ability to analyze text using models you create. See the following quickstarts for information on creating a model. 
> * [Custom named entity recognition](../custom-named-entity-recognition/quickstart.md)
> * [Custom text classification](../custom-text-classification/quickstart.md)

The `Azure.AI.TextAnalytics` namespace enables you to use the following Language features. Use the links below for articles to help you send API requests using the SDK.

* [Custom named entity recognition](../custom-named-entity-recognition/how-to/call-api.md?tabs=client#send-an-entity-recognition-request-to-your-model)
* [Custom text classification](../custom-text-classification/how-to/call-api.md?tabs=client-libraries#send-a-text-classification-request-to-your-model)
* [Document summarization](../summarization/quickstart.md)
* [Entity linking](../entity-linking/quickstart.md)
* [Key phrase extraction](../key-phrase-extraction/quickstart.md)
* [Named entity recognition (NER)](../named-entity-recognition/quickstart.md)
* [Personally Identifying Information (PII) detection](../personally-identifiable-information/quickstart.md)
* [Sentiment analysis and opinion mining](../sentiment-opinion-mining/quickstart.md)
* [Text analytics for health](../text-analytics-for-health/quickstart.md)

As you use these features in your application, use the following documentation and code samples for additional information.

| Language → Latest GA version |Reference documentation |Samples  |
|---------|---------|---------|
| [C#/.NET → v5.2.0](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0) | [C# documentation](/dotnet/api/azure.ai.textanalytics)        | [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/textanalytics/Azure.AI.TextAnalytics/samples)        |
| [Java → v5.2.0](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0) | [Java documentation](/java/api/overview/azure/ai-textanalytics-readme)        | [Java Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples) |
| [JavaScript → v1.0.0](https://www.npmjs.com/package/@azure/ai-language-text/v/1.0.0) | [JavaScript documentation](/javascript/api/overview/azure/ai-language-text-readme)        | [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples/v5) |
| [Python → v5.2.0](https://pypi.org/project/azure-ai-textanalytics/5.2.0/) |  [Python documentation](/python/api/overview/azure/ai-language-conversations-readme) | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) |


### Azure.AI.Language.Conversations 

> [!NOTE] 
> If you're using conversational language understanding or orchestration workflow, you will need to create a project and train a model before using the SDK. The SDK only provides the ability to analyze text using models you create. See the following quickstarts for more information. 
> * [Conversational language understanding](../conversational-language-understanding/quickstart.md)
> * [Orchestration workflow](../orchestration-workflow/quickstart.md)

The `Azure.AI.Language.Conversations` namespace enables you to use the following Language features. Use the links below for articles to help you send API requests using the SDK.

* [Conversational language understanding](../conversational-language-understanding/how-to/call-api.md?tabs=azure-sdk#send-a-conversational-language-understanding-request)
* [Orchestration workflow](../orchestration-workflow/how-to/call-api.md?tabs=azure-sdk#send-an-orchestration-workflow-request)
* [Conversation summarization (Python only)](../summarization/quickstart.md?tabs=conversation-summarization&pivots=programming-language-python)
* [Personally Identifying Information (PII) detection for conversations](../personally-identifiable-information/how-to-call-for-conversations.md?tabs=client-libraries#examples)

As you use these features in your application, use the following documentation and code samples for additional information.

| Language → Latest GA version | Reference documentation |Samples  |
|---------|---------|---------|
| [C#/.NET → v1.0.0](https://www.nuget.org/packages/Azure.AI.Language.Conversations/1.0.0) | [C# documentation](/dotnet/api/overview/azure/ai.language.conversations-readme)        |  [C# samples](https://aka.ms/sdk-sample-conversation-dot-net)        |
| [Python → v1.0.0](https://pypi.org/project/azure-ai-language-conversations/) |  [Python documentation](/python/api/overview/azure/ai-language-conversations-readme)        | [Python samples](https://aka.ms/sdk-samples-conversation-python) |

### Azure.AI.Language.QuestionAnswering 

The `Azure.AI.Language.QuestionAnswering` namespace enables you to use the following Language features:

* [Question answering](../question-answering/quickstart/sdk.md?pivots=programming-language-csharp)
    * Authoring - Automate common tasks like adding new question answer pairs and working with projects/knowledge bases.
    * Prediction - Answer questions based on passages of text.

As you use these features in your application, use the following documentation and code samples for additional information.

| Language → Latest GA version |Reference documentation  |Samples  |
|---------|---------|---------|
| [C#/.NET → v1.0.0](https://www.nuget.org/packages/Azure.AI.Language.QuestionAnswering/1.0.0#readme-body-tab) | [C# documentation](/dotnet/api/overview/azure/ai.language.questionanswering-readme)        |  [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/cognitivelanguage/Azure.AI.Language.QuestionAnswering)        |
| [Python → v1.0.0](https://pypi.org/project/azure-ai-language-questionanswering/1.0.0/) | [Python documentation](/python/api/overview/azure/ai-language-questionanswering-readme)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-questionanswering) |

# [REST API](#tab/rest-api)

## REST API

The Language service provides multiple API endpoints depending on which feature you wish to use.

### Conversation analysis authoring API

The conversation analysis authoring API enables you to author custom models and create/manage projects for the following features.
* [Conversational language understanding](../conversational-language-understanding/quickstart.md?pivots=rest-api)
* [Orchestration workflow](../orchestration-workflow/quickstart.md?pivots=rest-api)

As you use this API in your application, see the [reference documentation](/rest/api/language/2023-04-01/conversational-analysis-authoring) for additional information.

### Conversation analysis runtime API

The conversation analysis runtime API enables you to send requests to custom models you've created for:
* [Conversational language understanding](../conversational-language-understanding/how-to/call-api.md?tabs=REST-APIs#send-a-conversational-language-understanding-request)
* [Orchestration workflow](../orchestration-workflow/how-to/call-api.md?tabs=REST-APIs#send-an-orchestration-workflow-request)

It additionally enables you to use the following features, without creating any models:
* [Conversation summarization](../summarization/quickstart.md?pivots=rest-api&tabs=conversation-summarization)
* [Personally Identifiable Information (PII) detection for conversations](../personally-identifiable-information/how-to-call-for-conversations.md?tabs=rest-api#examples)

As you use this API in your application, see the [reference documentation](/rest/api/language/2023-04-01/conversation-analysis-runtime) for additional information.


### Text analysis authoring API

The text analysis authoring API enables you to author custom models and create/manage projects for:
* [Custom named entity recognition](../custom-named-entity-recognition/quickstart.md?pivots=rest-api)
* [Custom text classification](../custom-text-classification/quickstart.md?pivots=rest-api)

As you use this API in your application, see the [reference documentation](/rest/api/language/2023-04-01/text-analysis-authoring) for additional information.

### Text analysis runtime API

The text analysis runtime API enables you to send requests to custom models you've created for:

* [Custom named entity recognition](../custom-named-entity-recognition/quickstart.md?pivots=rest-api)
* [Custom text classification](../custom-text-classification/quickstart.md?pivots=rest-api)

It additionally enables you to use the following features, without creating any models:

* [Document summarization](../summarization/quickstart.md?tabs=document-summarization&pivots=rest-api)
* [Entity linking](../entity-linking/quickstart.md?pivots=rest-api)
* [Key phrase extraction](../key-phrase-extraction/quickstart.md?pivots=rest-api)
* [Named entity recognition (NER)](../named-entity-recognition/quickstart.md?pivots=rest-api)
* [Personally Identifying Information (PII) detection](../personally-identifiable-information/quickstart.md?pivots=rest-api)
* [Sentiment analysis and opinion mining](../sentiment-opinion-mining/quickstart.md?pivots=rest-api)
* [Text analytics for health](../text-analytics-for-health/quickstart.md?pivots=rest-api)

As you use this API in your application, see the [reference documentation](https://go.microsoft.com/fwlink/?linkid=2239169) for additional information.

### Question answering APIs

The question answering APIs enables you to use the [question answering](../question-answering/quickstart/sdk.md?pivots=rest) feature. 

#### Reference documentation

As you use this API in your application, see the following reference documentation for additional information.

* [Prebuilt API](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers-from-text) - Use the prebuilt runtime API to answer specified question using text provided by users.
* [Custom authoring API](/rest/api/cognitiveservices/questionanswering/question-answering-projects) - Create a knowledge base to answer questions.
* [Custom runtime API](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers) - Query and knowledge base to generate an answer.


---

## See also 

[Azure AI Language overview](../overview.md)
