---
title: What's new in Azure AI Language?
titleSuffix: Azure AI services
description: Find out about new releases and features for the Azure AI Language.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: whats-new
ms.date: 04/14/2023
ms.author: aahi
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# What's new in Azure AI Language?

Azure AI Language is updated on an ongoing basis. To stay up-to-date with recent developments, this article provides you with information about new releases and features.

## July 2023

* [Custom sentiment analysis](./sentiment-opinion-mining/overview.md) is now available in preview.

## May 2023

* [Custom Named Entity Recognition (NER) Docker containers](./custom-named-entity-recognition/how-to/use-containers.md) are now available for on-premises deployment. 

## April 2023

* [Custom Text analytics for health](./custom-text-analytics-for-health/overview.md) is available in public preview, which enables you to build custom AI models to extract healthcare specific entities from unstructured text
* You can now use Azure OpenAI to automatically label or generate data during authoring. Learn more with the links below. 
    * Auto-label your documents in [Custom text classification](./custom-text-classification/how-to/use-autolabeling.md) or [Custom named entity recognition](./custom-named-entity-recognition/how-to/use-autolabeling.md).
    * Generate suggested utterances in [Conversational language understanding](./conversational-language-understanding/how-to/tag-utterances.md#suggest-utterances-with-azure-openai).
* The latest model version (2022-10-01) for Language Detection now supports 6 more International languages and 12 Romanized Indic languages.

## March 2023

* New model version ('2023-01-01-preview') for Personally Identifiable Information (PII) detection with quality updates and new [language support](./personally-identifiable-information/language-support.md)

* New versions of the text analysis client library are available in preview:

    ### [C#](#tab/csharp)
    
    [**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.3.0-beta.2)
    
    [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.TextAnalytics_5.3.0-beta.2/sdk/textanalytics/Azure.AI.TextAnalytics/CHANGELOG.md)
    
    [**ReadMe**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.TextAnalytics_5.3.0-beta.2/sdk/textanalytics/Azure.AI.TextAnalytics/README.md)
    
    [**Samples**](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.TextAnalytics_5.3.0-beta.2/sdk/textanalytics/Azure.AI.TextAnalytics/samples/README.md)
  
    ### [Java](#tab/java)
    
    [**Package (Maven)**](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.3.0-beta.2)
    
    [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/CHANGELOG.md#530-beta2-2023-03-07)
    
    [**ReadMe**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/README.md)
    
    [**Samples**](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples)
    
    ### [JavaScript](#tab/javascript)

    [**Package (npm)**](https://www.npmjs.com/package/@azure/ai-language-text/v/1.1.0-beta.2)
    
    [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cognitivelanguage/ai-language-text/CHANGELOG.md)
    
    [**ReadMe**](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text)
    
    [**Samples**](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1-beta)

    ### [Python](#tab/python)
    
    [**Package (PyPi)**](https://pypi.org/project/azure-ai-textanalytics/5.3.0b2/)
    
    [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-textanalytics_5.3.0b2/sdk/textanalytics/azure-ai-textanalytics/CHANGELOG.md)
    
    [**ReadMe**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-textanalytics_5.3.0b2/sdk/textanalytics/azure-ai-textanalytics/README.md)
    
    [**Samples**](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-textanalytics_5.3.0b2/sdk/textanalytics/azure-ai-textanalytics/samples)
    
    ---

## February 2023

* Conversational language understanding and orchestration workflow is now available in the following regions in the sovereign cloud for China:
  * China East 2 (Authoring and Prediction)
  * China North 2 (Prediction)
* New model evaluation updates for Conversational language understanding and Orchestration workflow.
* New model version ('2023-01-01-preview') for Text Analytics for health featuring new [entity categories](./text-analytics-for-health/concepts/health-entity-categories.md) for social determinants of health.
* New model version ('2023-02-01-preview') for named entity recognition features improved accuracy and more [language support](./named-entity-recognition/language-support.md) with up to 79 languages.

## December 2022

* New version (v5.2.0-beta.1) of the text analysis client library is available in preview for C#/.NET:
    * [**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.3.0-beta.1)
    * [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/CHANGELOG.md)
    * [**ReadMe**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/README.md)
    * [**Samples**](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples)
 * New model version (`2022-10-01`) released for Language Detection. The new model version comes with improvements in language detection quality on short texts.

## November 2022

* Expanded language support for:
    * [Opinion mining](./sentiment-opinion-mining/language-support.md)
* Conversational PII now supports up to 40,000 characters as document size.
* New versions of the text analysis client library are available in preview:

    * Java
        * [**Package (Maven)**](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.3.0-beta.1)
        * [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-textanalytics_5.3.0-beta.1/sdk/textanalytics/azure-ai-textanalytics/CHANGELOG.md)
        * [**ReadMe**](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-textanalytics_5.3.0-beta.1/sdk/textanalytics/azure-ai-textanalytics/README.md)
        * [**Samples**](https://github.com/Azure/azure-sdk-for-java/tree/azure-ai-textanalytics_5.3.0-beta.1/sdk/textanalytics/azure-ai-textanalytics/src/samples)
    
    * JavaScript
        * [**Package (npm)**](https://www.npmjs.com/package/@azure/ai-language-text/v/1.1.0-beta.1)
        * [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cognitivelanguage/ai-language-text/CHANGELOG.md)
        * [**ReadMe**](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cognitivelanguage/ai-language-text/README.md)
        * [**Samples**](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1)

    * Python
        * [**Package (PyPi)**](https://pypi.org/project/azure-ai-textanalytics/5.3.0b1/)
        * [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-textanalytics_5.3.0b1/sdk/textanalytics/azure-ai-textanalytics/CHANGELOG.md)
        * [**ReadMe**](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-textanalytics_5.3.0b1/sdk/textanalytics/azure-ai-textanalytics/README.md)
        * [**Samples**](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-textanalytics_5.3.0b1/sdk/textanalytics/azure-ai-textanalytics/samples)

## October 2022

* The summarization feature now has the following capabilities:
    * [Document summarization](./summarization/overview.md):
        * Abstractive summarization, which generates a summary of a document that may not use the same words as those in the document, but captures the main idea.
    * [Conversation summarization](./summarization/overview.md?tabs=document-summarization?tabs=conversation-summarization)
        * Chapter title summarization, which returns suggested chapter titles of input conversations.
        * Narrative summarization, which returns call notes, meeting notes or chat summaries of input conversations.
* Expanded language support for:
    * [Sentiment analysis](./sentiment-opinion-mining/language-support.md)
    * [Key phrase extraction](./key-phrase-extraction/language-support.md)
    * [Named entity recognition](./named-entity-recognition/language-support.md)
    * [Text Analytics for health](./text-analytics-for-health/language-support.md)
* [Multi-region deployment](./concepts/custom-features/multi-region-deployment.md) and [project asset versioning](./concepts/custom-features/project-versioning.md) for: 
    * [Conversational language understanding](./conversational-language-understanding/overview.md)
    * [Orchestration workflow](./orchestration-workflow/overview.md)
    * [Custom text classification](./custom-text-classification/overview.md) 
    * [Custom named entity recognition](./custom-named-entity-recognition/overview.md)
* [Regular expressions](./conversational-language-understanding/concepts/entity-components.md#regex-component) in conversational language understanding and [required components](./conversational-language-understanding/concepts/entity-components.md#required-components), offering an additional ability to influence entity predictions.
* [Entity resolution](./named-entity-recognition/concepts/entity-resolutions.md) in named entity recognition
* New region support for:
    * [Conversational language understanding](./conversational-language-understanding/service-limits.md#regional-availability)
    * [Orchestration workflow](./orchestration-workflow/service-limits.md#regional-availability)
    * [Custom text classification](./custom-text-classification/service-limits.md#regional-availability) 
    * [Custom named entity recognition](./custom-named-entity-recognition/service-limits.md#regional-availability) 
* Document type as an input supported for [Text Analytics for health](./text-analytics-for-health/how-to/call-api.md) FHIR requests 

## September 2022

* [Conversational language understanding](./conversational-language-understanding/overview.md) is available in the following regions:
  * Central India
  * Switzerland North
  * West US 2
* Text Analytics for Health now [supports additional languages](./text-analytics-for-health/language-support.md) in preview: Spanish, French, German Italian, Portuguese and Hebrew. These languages are available when using a docker container to deploy the API service. 
* The Azure.AI.TextAnalytics client library v5.2.0 are generally available and ready for use in production applications. For more information on Language service client libraries, see the [**Developer overview**](./concepts/developer-guide.md).
    * Java
        * [**Package (Maven)**](https://mvnrepository.com/artifact/com.azure/azure-ai-textanalytics/5.2.0)
        * [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/CHANGELOG.md)
        * [**ReadMe**](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/textanalytics/azure-ai-textanalytics/README.md)
        * [**Samples**](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples)
    * Python
        * [**Package (PyPi)**](https://pypi.org/project/azure-ai-textanalytics/5.2.0/)
        * [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/CHANGELOG.md)
        * [**ReadMe**](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/textanalytics/azure-ai-textanalytics/README.md)
        * [**Samples**](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples)
    * C#/.NET
        * [**Package (NuGet)**](https://www.nuget.org/packages/Azure.AI.TextAnalytics/5.2.0)
        * [**Changelog/Release History**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/CHANGELOG.md)
        * [**ReadMe**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/textanalytics/Azure.AI.TextAnalytics/README.md)
        * [**Samples**](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples)

## August 2022

* [Role-based access control](./concepts/role-based-access-control.md) for the Language service.

## July 2022

* New AI models for [sentiment analysis](./sentiment-opinion-mining/overview.md) and [key phrase extraction](./key-phrase-extraction/overview.md) based on [z-code models](https://www.microsoft.com/research/project/project-zcode/), providing:
    * Performance and quality improvements for the following 11 [languages](./sentiment-opinion-mining/language-support.md) supported by sentiment analysis: `ar`, `da`, `el`, `fi`, `hi`, `nl`, `no`, `pl`,  `ru`, `sv`, `tr` 
    * Performance and quality improvements for the following 20 [languages](./key-phrase-extraction/language-support.md) supported by key phrase extraction: `af`, `bg`, `ca`, `hr`, `da`, `nl`, `et`, `fi`, `el`, `hu`, `id`, `lv`, `no`, `pl`, `ro`, `ru`, `sk`, `sl`, `sv`, `tr` 

* Conversational PII is now available in all Azure regions supported by the Language service.

* A new version of the Language API (`2022-07-01-preview`) has been released. It provides:
    * [Automatic language detection](./concepts/use-asynchronously.md#automatic-language-detection) for asynchronous tasks.
    * Text Analytics for health confidence scores are now returned in relations.

    To use this version in your REST API calls, use the following URL:

    ```http
    <your-language-resource-endpoint>/language/:analyze-text?api-version=2022-07-01-preview
    ```
    
## June 2022
* v1.0 client libraries for [conversational language understanding](./conversational-language-understanding/how-to/call-api.md?tabs=azure-sdk#send-a-conversational-language-understanding-request) and [orchestration workflow](./orchestration-workflow/how-to/call-api.md?tabs=azure-sdk#send-an-orchestration-workflow-request) are Generally Available for the following languages:
    * [C#](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Language.Conversations_1.0.0/sdk/cognitivelanguage/Azure.AI.Language.Conversations)
    * [Python](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-language-conversations_1.0.0/sdk/cognitivelanguage/azure-ai-language-conversations)
* v1.1.0b1 client library for [conversation summarization](summarization/quickstart.md?tabs=conversation-summarization&pivots=programming-language-python) is available as a preview for:
    * [Python](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-language-conversations_1.1.0b1/sdk/cognitivelanguage/azure-ai-language-conversations/samples/README.md)
* There is a new endpoint URL and request format for making REST API calls to prebuilt Language service features. See the following quickstart guides and reference documentation for information on structuring your API calls. All text analytics 3.2-preview.2 API users can begin migrating their workloads to this new endpoint.
    * [Entity linking](./entity-linking/quickstart.md?pivots=rest-api)
    * [Language detection](./language-detection/quickstart.md?pivots=rest-api)
    * [Key phrase extraction](./key-phrase-extraction/quickstart.md?pivots=rest-api)
    * [Named entity recognition](./named-entity-recognition/quickstart.md?pivots=rest-api)
    * [PII detection](./personally-identifiable-information/quickstart.md?pivots=rest-api)
    * [Sentiment analysis and opinion mining](./sentiment-opinion-mining/quickstart.md?pivots=rest-api)
    * [Text analytics for health](./text-analytics-for-health/quickstart.md?pivots=rest-api)


## May 2022

* PII detection for conversations.
* Rebranded Text Summarization to Document summarization.
* Conversation summarization is now available in public preview.

* The following features are now Generally Available (GA):
    * Custom text classification
    * Custom Named Entity Recognition (NER)
    * Conversational language understanding
    * Orchestration workflow

* The following updates for custom text classification, custom Named Entity Recognition (NER), conversational language understanding, and orchestration workflow:
    * Data splitting controls.
    * Ability to cancel training jobs.
    * Custom deployments can be named. You can have up to 10 deployments.
    * Ability to swap deployments.
    * Auto labeling (preview) for custom named entity recognition
    * Enterprise readiness support
    * Training modes for conversational language understanding
    * Updated service limits
    * Ability to use free (F0) tier for Language resources
    * Expanded regional availability
    * Updated model life cycle to add training configuration versions



## April 2022

* Fast Healthcare Interoperability Resources (FHIR) support is available in the [Language REST API preview](text-analytics-for-health/quickstart.md?pivots=rest-api&tabs=language) for Text Analytics for health.

## March 2022

* Expanded language support for:
  * [Custom text classification](custom-text-classification/language-support.md)
  * [Custom Named Entity Recognition (NER)](custom-named-entity-recognition/language-support.md)
  * [Conversational language understanding](conversational-language-understanding/language-support.md)

## February 2022

* Model improvements for latest model-version for [text summarization](summarization/overview.md)

* Model 2021-10-01 is Generally Available (GA) for [Sentiment Analysis and Opinion Mining](sentiment-opinion-mining/overview.md), featuring enhanced modeling for emojis and better accuracy across all supported languages.

* [Question Answering](question-answering/overview.md): Active learning v2 incorporates a better clustering logic providing improved accuracy of suggestions. It considers user actions when suggestions are accepted or rejected to avoid duplicate suggestions, and improve query suggestions.

## December 2021

* The version 3.1-preview.x REST endpoints and 5.1.0-beta.x client library have been retired. Please upgrade to the General Available version of the API(v3.1). If you're using the client libraries, use package version 5.1.0 or higher. See the [migration guide](./concepts/migrate-language-service-latest.md) for details.

## November 2021

* Based on ongoing customer feedback, we have increased the character limit per document for Text Analytics for health from 5,120 to 30,720.

* Azure AI Language release, with support for:

  * [Question Answering (now Generally Available)](question-answering/overview.md)
  * [Sentiment Analysis and opinion mining](sentiment-opinion-mining/overview.md)
  * [Key Phrase Extraction](key-phrase-extraction/overview.md)
  * [Named Entity Recognition (NER), Personally Identifying Information (PII)](named-entity-recognition/overview.md)
  * [Language Detection](language-detection/overview.md)
  * [Text Analytics for health](text-analytics-for-health/overview.md)
  * [Text summarization preview](summarization/overview.md)
  * [Custom Named Entity Recognition (Custom NER) preview](custom-named-entity-recognition/overview.md)
  * [Custom Text Classification preview](custom-text-classification/overview.md)
  * [Conversational Language Understanding preview](conversational-language-understanding/overview.md)

* Preview model version `2021-10-01-preview` for [Sentiment Analysis and Opinion mining](sentiment-opinion-mining/overview.md), which provides:

  * Improved prediction quality.
  * [Additional language support](sentiment-opinion-mining/language-support.md?tabs=sentiment-analysis) for the opinion mining feature.
  * For more information, see the [project z-code site](https://www.microsoft.com/research/project/project-zcode/).
  * To use this [model version](sentiment-opinion-mining/how-to/call-api.md#specify-the-sentiment-analysis-model), you must specify it in your API calls, using the model version parameter.

* SDK support for sending requests to custom models:

  * Custom Named Entity Recognition
  * Custom text classification
  * Custom language understanding

## Next steps

* See the [previous updates](./concepts/previous-updates.md) article for service updates not listed here. 
