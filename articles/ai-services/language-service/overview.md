---
title: What is Azure AI Language
titleSuffix: Azure AI services
description: Learn how to integrate AI into your applications that can extract information and understand written language.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 07/19/2023
ms.author: aahi
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# What is Azure AI Language?

[!INCLUDE [Azure AI services rebrand](../includes/rebrand-note.md)]

Azure AI Language is a cloud-based service that provides Natural Language Processing (NLP) features for understanding and analyzing text. Use this service to help build intelligent applications using the web-based Language Studio, REST APIs, and client libraries. 

## Available features

This Language service unifies the following previously available Azure AI services: Text Analytics, QnA Maker, and LUIS. If you need to migrate from these services, see [the migration section](#migrate-from-text-analytics-qna-maker-or-language-understanding-luis) below.

The Language service also provides several new features as well, which can either be:

* Preconfigured, which means the AI models that the feature uses are not customizable. You just send your data, and use the feature's output in your applications.
* Customizable, which means you'll train an AI model using our tools to fit your data specifically.

> [!TIP]
> Unsure which feature to use? See [Which Language service feature should I use?](#which-language-service-feature-should-i-use) to help you decide.

[**Language Studio**](./language-studio.md) enables you to use the below service features without needing to write code.

### Named Entity Recognition (NER)

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/named-entity-recognition.png" alt-text="A screenshot of a named entity recognition example."  lightbox="media/studio-examples/named-entity-recognition.png":::
   :::column-end:::
   :::column span="":::
      [Named entity recognition](./named-entity-recognition/overview.md) is a preconfigured feature that categorizes entities (words or phrases) in unstructured text across several predefined category groups. For example: people, events, places, dates, [and more](./named-entity-recognition/concepts/named-entity-categories.md).

   :::column-end:::
:::row-end:::

### Personally identifying (PII) and health (PHI) information detection

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/personal-information-detection.png" alt-text="A screenshot of a PII detection example." lightbox="media/studio-examples/personal-information-detection.png":::
   :::column-end:::
   :::column span="":::
      [PII detection](./personally-identifiable-information/overview.md) is a preconfigured feature that identifies, categorizes, and redacts sensitive information in both [unstructured text documents](./personally-identifiable-information/how-to-call.md), and [conversation transcripts](./personally-identifiable-information/how-to-call-for-conversations.md). For example: phone numbers, email addresses, forms of identification, [and more](./personally-identifiable-information/concepts/entity-categories.md).

   :::column-end:::
:::row-end:::

### Language detection

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/language-detection.png" alt-text="A screenshot of a language detection example." lightbox="media/studio-examples/language-detection.png":::
   :::column-end:::
   :::column span="":::
      [Language detection](./language-detection/overview.md) is a preconfigured feature that can detect the language a document is written in, and returns a language code for a wide range of languages, variants, dialects, and some regional/cultural languages.

   :::column-end:::
:::row-end:::

### Sentiment Analysis and opinion mining

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/sentiment-analysis-example.png" alt-text="A screenshot of a sentiment analysis example." lightbox="media/studio-examples/sentiment-analysis-example.png":::
   :::column-end:::
   :::column span="":::
      [Sentiment analysis and opinion mining](./sentiment-opinion-mining/overview.md) are preconfigured features that help you find out what people think of your brand or topic by mining text for clues about positive or negative sentiment, and can associate them with specific aspects of the text.

   :::column-end:::
:::row-end:::

### Summarization

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/summarization-example.png" alt-text="A screenshot of a summarization example." lightbox="media/studio-examples/summarization-example.png":::
   :::column-end:::
   :::column span="":::
      [Summarization](./summarization/overview.md) is a preconfigured feature that uses extractive text summarization to produce a summary of documents and conversation transcriptions. It extracts sentences that collectively represent the most important or relevant information within the original content.
   :::column-end:::
:::row-end:::

### Key phrase extraction

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/key-phrases.png" alt-text="A screenshot of a key phrase extraction example." lightbox="media/studio-examples/key-phrases.png":::
   :::column-end:::
   :::column span="":::
      [Key phrase extraction](./key-phrase-extraction/overview.md) is a preconfigured feature that evaluates and returns the main concepts in unstructured text, and returns them as a list.
   :::column-end:::
:::row-end:::

### Entity linking

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/entity-linking.png" alt-text="A screenshot of an entity linking example." lightbox="media/studio-examples/entity-linking.png":::
   :::column-end:::
   :::column span="":::
      [Entity linking](./entity-linking/overview.md) is a preconfigured feature that disambiguates the identity of entities (words or phrases) found in unstructured text and returns links to Wikipedia. 
   :::column-end:::
:::row-end:::

### Text analytics for health

:::row:::
   :::column span="":::
      :::image type="content" source="text-analytics-for-health/media/call-api/health-named-entity-recognition.png" alt-text="A screenshot of a text analytics for health example." lightbox="text-analytics-for-health/media/call-api/health-named-entity-recognition.png":::
   :::column-end:::
   :::column span="":::
      [Text analytics for health](./text-analytics-for-health/overview.md) is a preconfigured feature that extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records. 
   :::column-end:::
:::row-end:::

### Custom text classification

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/single-classification.png" alt-text="A screenshot of a custom text classification example." lightbox="media/studio-examples/single-classification.png":::
   :::column-end:::
   :::column span="":::
      [Custom text classification](./custom-text-classification/overview.md) enables you to build custom AI models to classify unstructured text documents into custom classes you define.
   :::column-end:::
:::row-end:::

### Custom Named Entity Recognition (Custom NER)


:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/custom-named-entity-recognition.png" alt-text="A screenshot of a custom NER example." lightbox="media/studio-examples/custom-named-entity-recognition.png":::
   :::column-end:::
   :::column span="":::
      [Custom NER](custom-named-entity-recognition/overview.md) enables you to build custom AI models to extract custom entity categories (labels for words or phrases), using unstructured text that you provide. 
   :::column-end:::
:::row-end:::


### Conversational language understanding

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/conversational-language-understanding.png" alt-text="A screenshot of a conversational language understanding example." lightbox="media/studio-examples/conversational-language-understanding.png":::
   :::column-end:::
   :::column span="":::
      [Conversational language understanding (CLU)](./conversational-language-understanding/overview.md) enables users to build custom natural language understanding models to predict the overall intention of an incoming utterance and extract important information from it.
   :::column-end:::
:::row-end:::

### Orchestration workflow

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/orchestration-workflow.png" alt-text="A screenshot of an orchestration workflow example." lightbox="media/studio-examples/orchestration-workflow.png":::
   :::column-end:::
   :::column span="":::
      [Orchestration workflow](./language-detection/overview.md) is a custom feature that enables you to connect [Conversational Language Understanding (CLU)](./conversational-language-understanding/overview.md), [question answering](./question-answering/overview.md), and [LUIS](../LUIS/what-is-luis.md) applications.

   :::column-end:::
:::row-end:::

### Question answering

:::row:::
   :::column span="":::
      :::image type="content" source="media/studio-examples/question-answering.png" alt-text="A screenshot of a question answering example." lightbox="media/studio-examples/question-answering.png":::
   :::column-end:::
   :::column span="":::
      [Question answering](./question-answering/overview.md) is a custom feature that finds the most appropriate answer for inputs from your users, and is commonly used to build conversational client applications, such as social media applications, chat bots, and speech-enabled desktop applications. 

   :::column-end:::
:::row-end:::

### Custom text analytics for health

:::row:::
   :::column span="":::
      :::image type="content" source="text-analytics-for-health/media/call-api/health-named-entity-recognition.png" alt-text="A screenshot of a custom text analytics for health example." lightbox="text-analytics-for-health/media/call-api/health-named-entity-recognition.png":::
   :::column-end:::
   :::column span="":::
      [Custom text analytics for health](./custom-text-analytics-for-health/overview.md) is a custom feature that extract healthcare specific entities from unstructured text, using a model you create.  
   :::column-end:::
:::row-end:::

## Which Language service feature should I use?

This section will help you decide which Language service feature you should use for your application:

|What do you want to do?  |Document format  |Your best solution  | Is this solution customizable?* |
|---------|---------|---------|---------|
| Detect and/or redact sensitive information such as PII and PHI. | Unstructured text, <br> transcribed conversations | [PII detection](./personally-identifiable-information/overview.md) | |
| Extract categories of information without creating a custom model.     | Unstructured text         | The [preconfigured NER feature](./named-entity-recognition/overview.md) |       |
| Extract categories of information using a model specific to your data. | Unstructured text | [Custom NER](./custom-named-entity-recognition/overview.md) | ✓ |
|Extract main topics and important phrases.     | Unstructured text        | [Key phrase extraction](./key-phrase-extraction/overview.md) |   |
| Determine the sentiment and opinions expressed in text. | Unstructured text | [Sentiment analysis and opinion mining](./sentiment-opinion-mining/overview.md) | ✓ |
| Summarize long chunks of text or conversations. | Unstructured text, <br> transcribed conversations. | [Summarization](./summarization/overview.md) | | 
| Disambiguate entities and get links to Wikipedia. | Unstructured text | [Entity linking](./entity-linking/overview.md) | | 
| Classify documents into one or more categories. | Unstructured text | [Custom text classification](./custom-text-classification/overview.md) | ✓|
| Extract medical information from clinical/medical documents, without building a model. | Unstructured text | [Text analytics for health](./text-analytics-for-health/overview.md) | |
| Extract medical information from clinical/medical documents using a model that's trained on your data. | Unstructured text | [Custom text analytics for health](./custom-text-analytics-for-health/overview.md) | |
| Build a conversational application that responds to user inputs. | Unstructured user inputs | [Question answering](./question-answering/overview.md) | ✓ |
| Detect the language that a text was written in. | Unstructured text | [Language detection](./language-detection/overview.md) | | 
| Predict the intention of user inputs and extract information from them. | Unstructured user inputs | [Conversational language understanding](./conversational-language-understanding/overview.md) | ✓ |
| Connect apps from conversational language understanding, LUIS, and question answering. | Unstructured user inputs | [Orchestration workflow](./orchestration-workflow/overview.md) | ✓ | 

\* If a feature is customizable, you can train an AI model using our tools to fit your data specifically. Otherwise a feature is preconfigured, meaning the AI models it uses cannot be changed. You just send your data, and use the feature's output in your applications.

## Migrate from Text Analytics, QnA Maker, or Language Understanding (LUIS)

Azure AI Language unifies three individual language services in Azure AI services - Text Analytics, QnA Maker, and Language Understanding (LUIS). If you have been using these three services, you can easily migrate to the new Azure AI Language. For instructions see [Migrating to Azure AI Language](concepts/migrate.md).  

## Tutorials

After you've had a chance to get started with the Language service, try our tutorials that show you how to solve various scenarios.

* [Extract key phrases from text stored in Power BI](key-phrase-extraction/tutorials/integrate-power-bi.md)
* [Use Power Automate to sort information in Microsoft Excel](named-entity-recognition/tutorials/extract-excel-information.md) 
* [Use Flask to translate text, analyze sentiment, and synthesize speech](/training/modules/python-flask-build-ai-web-app/)
* [Use Azure AI services in canvas apps](/powerapps/maker/canvas-apps/cognitive-services-api?context=/azure/ai-services/language-service/context/context)
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
