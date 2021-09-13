---
title: What is Azure Cognitive Service for Language
titleSuffix: Azure Cognitive Services
description: Learn how to integrate AI into your applications that can extract information and understand written language.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/06/2021
ms.author: aahi
---

# What are Azure Language services? 

Azure Cognitive Service for language is a cloud-based service that provides Natural Language Processing (NLP) features for understanding, mining, and analyzing text.

The service is the unification of several Cognitive Services offerings, such as Text Analytics, Language Understanding (LUIS), and QnA Maker. This unified service is enhanced with Microsoft’s state of the art AI models to help you build intelligent applications with Language Studio, REST APIs, and client libraries. 

## Available features

Azure Cognitive Service for language provides the following features, categorized by 


### Extract information

|Feature  |Description  |
|---------|---------|
| Extract sensitive information (PII)     | This pre-configured feature identifies and redacts Personally Identifiable Information (PII) in text across several pre-defined categories, and categorizes them. For example: names, addresses, phone numbers, and passport numbers.        |
| Key phrase extraction     | This pre-configured feature evaluates unstructured text, and for each input document, returns a list of key phrases and main points in the text. |
|Entity linking    | This pre-configured feature disambiguates the identity of an entity found in text and provides links to the entity on Wikipedia.        |
|Named Entity Recognition (NER)    | This prebuilt feature identifies entities in text and categorizes them into pre-defined classes such as: names, locations, and organizations.        |
| Extract information from healthcare-related text    | This pre-configured feature extracts information from unstructured medical texts, such as clinical notes and doctor's notes.  |
| Custom NER    | Build an AI model to extract custom entity categories, using unstructured text that you provide. |


### Classify text


|Feature |Description  |
|---------|---------|
|Analyze sentiment and opinions     | This pre-configured feature provides sentiment labels (such as "*negative*", "*neutral*" and "*positive*") for sentences and documents. This feature can additionally provide granular information about the opinions related to words that appear in the text, such as the attributes of products or services. |
|Language detection    | This pre-configured feature evaluates text, and determines the language it was written in. It returns a language identifier and a score that indicates the strength of the analysis.        |
|Custom text classification    | Build an AI model to classify unstructured text into custom classes that you define.         |

### Summarize Text

|Feature |Description  |
|---------|---------|
| Text Summarization     | This pre-configured feature extracts key sentences that collectively convey the essence of a document. |

### Understand conversational language
 
|Feature |Description  |
|---------|---------|
| Custom conversational language understanding     | Build an AI model to bring the ability to understand natural language into apps, bots, and IoT devices. |

### Answer questions

|Feature |Description  |
|---------|---------|
| Question answering     | This pre-configured feature provides answers to questions extracted from text input, using semi-structured content such as: FAQs, manuals, and documents. |
| Custom question answering     | Customize conversational question and answer responses, using over your data. |

## Get started using Azure Cognitive Services for language 

Azure Cognitive Services for language provides Language Studio, which is a set of UI-based tools that lets you quickly explore, start using features without needing to write code.

[!INCLUDE [deploy an Azure resource](includes/deploy-azure-resource.md)]

## Complete a quickstart  

We offer quickstarts in most popular programming languages, each designed to teach you basic design patterns, and have you running code in less than 10 minutes. See the following list for the quickstart for each feature.

* Sentiment Analysis quickstart
* NER and PII quickstart
* Summarization quickstart
* Question answering quickstart
* Custom classification quickstart
* Custom conversational language understanding quickstart 

After you've had a chance to get started with the Language service, try our tutorials that show you how to solve various scenarios.

* Tutorial: Determine user intentions with the Language SDK, C#
* Tutorial: Extract information in Excel with the Language SDK, C#
* Tutorial: Add knowledge bases in multiple languages with Language SDK, C# 

## Get sample code

Sample code is available on GitHub for the Language service. These samples cover common scenarios like creating a knowledgebase, getting answers to a question, and working with custom models. Use these links to view SDK and REST samples:
* Question Answering samples (SDK)
* Information extraction (PII, key phrases, linked/named entities, custom text) samples (SDK)
* Text Classification (sentiment analysis, language detection, custom classification) samples (SDK)
* Conversational Language Understanding samples (SDK) 

## Deploy on premises using Docker containers 
Use Language service containers  to deploy API features on-premises. These Docker containers enable you to bring the service closer to your data for compliance, security or other operational reasons. The Language service offers the following containers:

* Sentiment analysis
* Language detection
* Key phrase extraction 
* Text Analytics for health


## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](/legal/cognitive-services/text-analytics/transparency-note)
* [Transparency note for Sentiment Analysis and Opinion Mining](/legal/cognitive-services/text-analytics/transparency-note-sentiment-analysis)
* [Integration and responsible use](/legal/cognitive-services/text-analytics/guidance-integration-responsible-use)
* [Data, privacy and security](/legal/cognitive-services/text-analytics/data-privacy)
