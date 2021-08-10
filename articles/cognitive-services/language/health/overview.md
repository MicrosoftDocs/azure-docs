---
title: Health API
titleSuffix: Azure Cognitive Services
description: Learn how to use the Health API, which is a part of the Language Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/15/2021
ms.author: aahi
---

# What is the Health API?

The Health API is a feature of Language Services that extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records.  

The API is a part of [Azure Cognitive Services](../../index.yml), a collection of cloud-based machine learning and AI algorithms for your development projects. You can use these features with the REST API, or the client libraries.

This documentation contains the following types of articles:

* [How-to guides](./how-to/call-api.md) contain instructions for using the service in more specific or customized ways.


> [!VIDEO https://channel9.msdn.com/Shows/AI-Show/Introducing-Text-Analytics-for-Health/player]

## Features

The Health API performs Named Entity Recognition (NER), relation extraction, entity negation and entity linking on English-language text to uncover insights in unstructured clinical and biomedical text.

### [Named Entity Recognition](#tab/ner)

Named Entity Recognition detects words and phrases mentioned in unstructured text that can be associated with one or more semantic types, such as diagnosis, medication name, symptom/sign, or age.

> [!div class="mx-imgBorder"]
> ![Health NER](./media/call-api/health-named-entity-recognition.png)

### [Relation Extraction](#tab/relation-extraction)

Relation extraction identifies meaningful connections between concepts mentioned in text. For example, a "time of condition" relation is found by associating a condition name with a time or between an abbreviation and the full description.  

> [!div class="mx-imgBorder"]
> ![Health RE](./media/call-api/health-relation-extraction.png)


### [Entity Linking](#tab/entity-linking)

Entity Linking disambiguates distinct entities by associating named entities mentioned in text to concepts found in a predefined database of concepts including the Unified Medical Language System (UMLS). Medical concepts are also assigned preferred naming, as an additional form of normalization.

> [!div class="mx-imgBorder"]
> ![Health EL](./media/call-api/health-entity-linking.png)

The Health API supports linking to the health and biomedical vocabularies found in the Unified Medical Language System ([UMLS](https://www.nlm.nih.gov/research/umls/sourcereleasedocs/index.html)) Metathesaurus Knowledge Source.

### [Assertion Detection](#tab/assertion-detection) 

The meaning of medical content is highly affected by modifiers, such as negative or conditional assertions which can have critical implications if misrepresented. The Health API supports three categories of assertion detection for entities in the text: 

* Certainty
* Conditional
* Association

> [!div class="mx-imgBorder"]
> ![Health NEG](./media/call-api/assertions.png)

---

## Typical workflow

To use the API, you submit data for analysis and handle outputs in your application. Analysis is performed as-is, with no additional customization to the model used on your data.

1. Create an Azure resource for Language Services. Afterwards, get the key and endpoint generated for you to authenticate your requests.

2. Formulate a request using either the REST API or the client library for: C#, Java, JavaScript or Python.

3. Send the request containing your data as raw unstructured text. Your key and endpoint will be used for authentication.

4. Stream or store the response locally. The result will be the above features of the healthcare and medical text you send. 

## Responsible AI 

An AI system includes not only the technology, but also: the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](../overview.md)
* [Transparency note for NER and PII](../overview.md)
* [Integration and responsible use](../overview.md)
* [Data, privacy, and security](../overview.md)

## Next steps

Follow a quickstart to implement and run a service in your preferred development language.

* [Quickstart: Sentiment Analysis and opinion mining](../overview.md)