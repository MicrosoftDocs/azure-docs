---
title: What is Azure Cognitive Service for Language
titleSuffix: Azure Cognitive Services
description: Learn how to integrate AI into your applications that can extract information and understand written language.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 07/21/2022
ms.author: aahi
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# What is Azure Cognitive Service for Language?

Azure Cognitive Service for Language is a cloud-based service that provides Natural Language Processing (NLP) features for understanding and analyzing text. Use this service to help build intelligent applications using the web-based Language Studio, REST APIs, and client libraries.  

## Available features

This Language service unifies Text Analytics, QnA Maker, and LUIS and provides several new features as well. These features can either be:

* Pre-configured, which means the AI models that the feature uses are not customizable. You just send your data, and use the feature's output in your applications.
* Customizable, which means you'll train an AI model using our tools to fit your data specifically.

### Named Entity Recognition (NER)

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/named-entity-recognition.png" alt-text="A screenshot of a named entity recognition example."  lightbox="media/studio-examples/named-entity-recognition.png":::
   :::column-end:::
   :::column span="":::
      [Named entity recognition](./named-entity-recognition/overview.md) is a pre-configured feature that identifies entities in unstructured text across several pre-defined categories. For example: people, events, places, dates, [and more](./named-entity-recognition/concepts/named-entity-categories.md).

   :::column-end:::
:::row-end:::

You can use this feature with:

* [**Language Studio**](language-studio.md), a web-based platform where you can try NER without needing writing code.
* [**REST API and client library (Azure SDK)**](named-entity-recognition/quickstart.md), which enables you to integrate NER into your applications using the REST API, or the client library available in a variety of languages.

### Personally identifying (PII) and health (PHI) information  detection

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/personal-information-detection.png" alt-text="A screenshot of a PII detection example." lightbox="media/studio-examples/personal-information-detection.png":::
   :::column-end:::
   :::column span="":::
      [PII detection](./personally-identifiable-information/overview.md) is a pre-configured feature that identifies, categorizes, and redacts sensitive information in both [unstructured text documents](./personally-identifiable-information/how-to-call.md), and [conversation transcripts](./personally-identifiable-information/how-to-call-for-conversations.md). For example: phone numbers, email addresses, forms of identification, [and more](./personally-identifiable-information/concepts/entity-categories.md).

   :::column-end:::
:::row-end:::

You can use this feature with:

* [**Language Studio**](language-studio.md), a web-based platform where you can try PII detection without needing writing code.
* [**REST API and client library (Azure SDK)**](./personally-identifiable-information/quickstart.md), which enables you to integrate PII detection into your applications using the REST API, or the client library available in a variety of languages.

### Key phrase extraction

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/key-phrases.png" alt-text="A screenshot of a key phrase extraction example." lightbox="media/studio-examples/key-phrases.png":::
   :::column-end:::
   :::column span="":::
      [Key phrase extraction](./key-phrase-extraction/overview.md) is a pre-configured feature that evaluates and returns the main concepts in unstructured text, and returns them as a list.
   :::column-end:::
:::row-end:::

You can use this feature with:

* [**Language Studio**](language-studio.md), a web-based platform where you can try key phrase extraction without needing writing code.
* [**REST API and client library (Azure SDK)**](./key-phrase-extraction/quickstart.md), which enables you to integrate key phrase extraction into your applications using the REST API, or the client library available in a variety of languages.

### Entity linking

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/entity-linking.png" alt-text="A screenshot of an entity linking example." lightbox="media/studio-examples/entity-linking.png":::
   :::column-end:::
   :::column span="":::
      [Entity linking](./entity-linking/overview.md) is a pre-configured feature that disambiguates the identity of entities found in unstructured text and returns links to Wikipedia. 
   :::column-end:::
:::row-end:::

You can use this feature with:

* [**Language Studio**](language-studio.md), a web-based platform where you can try key phrase extraction without needing writing code.
* [**REST API and client library (Azure SDK)**](./entity-linking/quickstart.md), which enables you to integrate key phrase extraction into your applications using the REST API, or the client library available in a variety of languages.


### Text analytics for health

:::row:::
   :::column span="":::
      :::image type="content" source="text-analytics-for-health/media/call-api/health-named-entity-recognition.png" alt-text="A screenshot of a text analytics for health example." lightbox="text-analytics-for-health/media/call-api/health-named-entity-recognition.png":::
   :::column-end:::
   :::column span="":::
      [Text analytics for health](./text-analytics-for-health/overview.md) is a pre-configured feature that extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records. 
   :::column-end:::
:::row-end:::

You can use this feature with:

* [**Language Studio**](language-studio.md), a web-based platform where you can try key phrase extraction without needing writing code.
* [**REST API and client library (Azure SDK)**](./entity-linking/quickstart.md), which enables you to integrate key phrase extraction into your applications using the REST API, or the client library available in a variety of languages.
* [**Docker container**](text-analytics-for-health/how-to/use-containers.md), to deploy this feature on-premises, letting you bring the service closer to your data for compliance, security, or other operational reasons. 

### Custom Named Entity Recognition (Custom NER)


:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/custom-named-entity-recognition.png" alt-text="A screenshot of a custom NER example." lightbox="media/studio-examples/custom-named-entity-recognition.png":::
   :::column-end:::
   :::column span="":::
      [Custom NER](custom-named-entity-recognition/overview.md) enables you to build an AI model to extract custom entity categories, using unstructured text that you provide. 
   :::column-end:::
:::row-end:::

You can use this feature with:

* [**Language Studio**](./custom-named-entity-recognition/quickstart.md?pivots=language-studio), a web-based platform where you can do the following without needing to write code:
    * Create and manage a custom NER project
    * Author, evaluate, and publish an AI model 
    * Send prediction requests to your model, and view the output visually
* [**REST API**](./custom-named-entity-recognition/quickstart.md?pivots=rest-api): 
    * Create and manage a custom NER project
    * Author, evaluate, and publish an AI model
    * Send prediction requests to your model, and integrate it into your applications
* [**Client library (Azure SDK)**](custom-named-entity-recognition/how-to/call-api.md):
    * Send prediction requests to your model after it has been created with either Language Studio, or the REST API.



## Migrate from Text Analytics, QnA Maker, or Language Understanding (LUIS)

Azure Cognitive Services for Language unifies three individual language services in Cognitive Services - Text Analytics, QnA Maker, and Language Understanding (LUIS). If you have been using these three services, you can easily migrate to the new Azure Cognitive Services for Language. For instructions see [Migrating to Azure Cognitive Services for Language](concepts/migrate.md).  



<!--Azure Cognitive Service for Language provides the following features:

> [!div class="mx-tdCol2BreakAll"]
> |Feature  |Description  | Deployment options| 
> |---------|---------|---------|
> | [Named Entity Recognition (NER)](named-entity-recognition/overview.md)     | This pre-configured feature identifies entities in text across several pre-defined categories.        | * [Language Studio](language-studio.md) <br> * [REST API and client-library](named-entity-recognition/quickstart.md) |
> | [Personally Identifiable Information (PII) detection](personally-identifiable-information/overview.md)     | This pre-configured feature identifies entities in text across several pre-defined categories of sensitive information, such as account information.        | * [Language Studio](language-studio.md) <br> * [REST API and client-library](personally-identifiable-information/quickstart.md) |
> | [Key phrase extraction](key-phrase-extraction/overview.md)     | This pre-configured feature evaluates unstructured text, and for each input document, returns a list of key phrases and main points in the text. | * [Language Studio](language-studio.md) <br> * [REST API and client-library](key-phrase-extraction/quickstart.md) <br> * [Docker container](key-phrase-extraction/how-to/use-containers.md)  |
> |[Entity linking](entity-linking/overview.md)    | This pre-configured feature disambiguates the identity of an entity found in text and provides links to the entity on Wikipedia.        | * [Language Studio](language-studio.md) <br> * [REST API and client-library](entity-linking/quickstart.md) |
> | [Text Analytics for health](text-analytics-for-health/overview.md)    | This pre-configured feature extracts information from unstructured medical texts, such as clinical notes and doctor's notes.  | * [Language Studio](language-studio.md) <br> * [REST API and client-library](text-analytics-for-health/quickstart.md) <br> * [Docker container](text-analytics-for-health/how-to/use-containers.md) |
> | [Custom NER](custom-named-entity-recognition/overview.md)    | Build an AI model to extract custom entity categories, using unstructured text that you provide. |  * [Language Studio](custom-named-entity-recognition/quickstart.md?pivots=language-studio) <br> * [REST API](custom-named-entity-recognition/quickstart.md?pivots=rest-api)<br> * [client-library (prediction only)](custom-named-entity-recognition/how-to/call-api.md) |
> | [Analyze sentiment and opinions](sentiment-opinion-mining/overview.md)     | This pre-configured feature provides sentiment labels (such as "*negative*", "*neutral*" and "*positive*") for sentences and documents. This feature can additionally provide granular information about the opinions related to words that appear in the text, such as the attributes of products or services. |  * [Language Studio](language-studio.md) <br> * [REST API and client-library](sentiment-opinion-mining/quickstart.md) <br> * [Docker container](sentiment-opinion-mining/how-to/use-containers.md)
> |[Language detection](language-detection/overview.md)    | This pre-configured feature evaluates text, and determines the language it was written in. It returns a language identifier and a score that indicates the strength of the analysis.        | * [Language Studio](language-studio.md) <br> * [REST API and client-library](language-detection/quickstart.md) <br> * [Docker container](language-detection/how-to/use-containers.md) |
> |[Custom text classification](custom-classification/overview.md)    | Build an AI model to classify unstructured text into custom classes that you define.         | * [Language Studio](custom-classification/quickstart.md?pivots=language-studio)<br> * [REST API](custom-classification/quickstart.md?pivots=rest-api) <br> * [client-library (prediction only)](custom-text-classification/how-to/call-api.md) |
> | [Document summarization (preview)](summarization/overview.md?tabs=document-summarization)     | This pre-configured feature extracts key sentences that collectively convey the essence of a document. | * [Language Studio](language-studio.md) <br> * [REST API and client-library](summarization/quickstart.md) |
> | [Conversation summarization (preview)](summarization/overview.md?tabs=conversation-summarization)     | This pre-configured feature summarizes issues and summaries in transcripts of customer-service conversations. | * [Language Studio](language-studio.md) <br> * [REST API](summarization/quickstart.md?tabs=rest-api) |
> | [Conversational language understanding](conversational-language-understanding/overview.md)   | Build an AI model to bring the ability to understand natural language into apps, bots, and IoT devices. | * [Language Studio](conversational-language-understanding/quickstart.md?pivots=language-studio) <br> * [REST API](conversational-language-understanding/quickstart.md?pivots=rest-api) <br> * [client-library (prediction only)](conversational-language-understanding/how-to/call-api.md) |
> | [Question answering](question-answering/overview.md)     | This pre-configured feature provides answers to questions extracted from text input, using semi-structured content such as: FAQs, manuals, and documents. | * [Language Studio](language-studio.md) <br> * [REST API and client-library](question-answering/quickstart/sdk.md) |
> | [Orchestration workflow](orchestration-workflow/overview.md)    | Train language models to connect your applications to question answering, conversational language understanding, and LUIS |  * [Language Studio](orchestration-workflow/quickstart.md?pivots=language-studio) <br> * [REST API](orchestration-workflow/quickstart.md?pivots=rest-api) <br> * [client-library (prediction only)](orchestration-workflow/how-to/call-api.md) |
-->

## Tutorials

After you've had a chance to get started with the Language service, try our tutorials that show you how to solve various scenarios.

* [Extract key phrases from text stored in Power BI](key-phrase-extraction/tutorials/integrate-power-bi.md)
* [Use Power Automate to sort information in Microsoft Excel](named-entity-recognition/tutorials/extract-excel-information.md) 
* [Use Flask to translate text, analyze sentiment, and synthesize speech](/learn/modules/python-flask-build-ai-web-app/)
* [Use Cognitive Services in canvas apps](/powerapps/maker/canvas-apps/cognitive-services-api?context=/azure/cognitive-services/language-service/context/context)
* [Create a FAQ Bot](question-answering/tutorials/bot-service.md)

## Additional code samples

You can find more code samples on GitHub for the following languages:

* [C#](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/textanalytics/Azure.AI.TextAnalytics/samples)
* [Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/textanalytics/azure-ai-textanalytics/src/samples)
* [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples)
* [Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples)

## Deploy on premises using Docker containers 
Use Language service containers to deploy API features on-premises. These Docker containers enable you to bring the service closer to your data for compliance, security, or other operational reasons. The Language service offers the following containers:

* [Sentiment analysis](sentiment-opinion-mining/how-to/use-containers.md)
* [Language detection](language-detection/how-to/use-containers.md)
* [Key phrase extraction](key-phrase-extraction/how-to/use-containers.md) 
* [Text Analytics for health](text-analytics-for-health/how-to/use-containers.md)


## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for the Language service](/legal/cognitive-services/text-analytics/transparency-note)
* [Integration and responsible use](/legal/cognitive-services/text-analytics/guidance-integration-responsible-use)
* [Data, privacy, and security](/legal/cognitive-services/text-analytics/data-privacy)
