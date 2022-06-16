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

# Dveloper and samples guide

Use this article to find information on integrating the Language service SDKs and REST API into your applications. 

>[!TIP]
> Is it your first time using Language service features? You can find quickstart guides with both REST API and SDK samples in the docmentation for the [available features](../overview.md#available-features) you want to use.

## What SDKs are available? 

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
* [Personally Identifing Information (PII) detection](../personally-identifiable-information/overview.md)
* [Sentiment analysis and opinion mining](../sentiment-opinion-mining/overview.md)
* [Text analytics for health](../text-analytics-for-health/overview.md)

### Azure.AI.TextAnalytics reference documentation and code samples

As you use these features in your application, use the following documentation and code samples for additional information.

|Development option / language  |Reference documentation |Samples  |
|---------|---------|---------|
|REST API     | [REST API documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-2-Preview-2/operations/Analyze)        |         |
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
* [Personally Identifing Information (PII) detection for conversations](../summarization/how-to/conversation-summarization.md)

#### Azure.AI.Language.Conversations reference documentation and code samples

As you use these features in your application, use the following documentation and code samples for additional information.

|Development option / language  |Reference documentation (Authoring API) | Reference documentation (Runtime prediction API) |Samples  |
|---------|---------|---------|---------|
|REST API     | [REST API documentation (authoring API)](https://aka.ms/clu-authoring-apis)        | [REST API documentation (prediction API)](https://aka.ms/clu-runtime-api)        |         |
|C#     |         | [C# documentation](/dotnet/api/overview/azure/ai.language.conversations-readme-pre?view=azure-dotnet-preview&preserve-view=true)        |  [C# samples](https://aka.ms/sdk-sample-conversation-dot-net)        |
|Python |         | [Python documentation](/python/api/overview/azure/ai-language-conversations-readme?view=azure-python-preview&preserve-view=true)        | [Python samples](https://aka.ms/sdk-samples-conversation-python) |

### Azure.AI.Language.QuestionAnswering 

The `Azure.AI.Language.QuestionAnswering` namespace enables you to use the following Language features:

* [Question answering](../question-answering/overview.md)

#### Azure.AI.Language.QuestionAnswering reference documentation and code samples

As you use these features in your application, use the following documentation and code samples for additional information.

|Development option / language  |Reference documentation  |Samples  |
|---------|---------|---------|---------|
|REST API     | [REST API documentation (Prebuilt API)](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers-from-text), [REST API documentation (Custom API)](/rest/api/cognitiveservices/questionanswering/question-answering-projects)        |         |
|C#     | [C# documentation](/dotnet/api/overview/azure/ai.language.questionanswering-readme-pre?view=azure-dotnet)        |  [C# samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/cognitivelanguage/Azure.AI.Language.QuestionAnswering)        |
|Python | [Python documentation](/python/api/overview/azure/ai-language-questionanswering-readme?view=azure-python)        | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-questionanswering) |


<!--## Other development options 

While not the main focus of the guide, informs customers that the Text Analytics for health Docker container can be used with the SDK (note: need to check if other containers are compatible with the SDK) 

See also 

Additional links to relevant material for SDK developers -->