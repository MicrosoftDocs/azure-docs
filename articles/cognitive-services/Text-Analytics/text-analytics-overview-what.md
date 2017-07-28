---
title: What is Text Analytics API (Azure Cognitive Servies) | Microsoft Docs
description: A Text Analytics API in Azure Cognitive Services for sentiment analysis, key phrase extraction, and language detection.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/24/2017
ms.author: heidist
---

# Text Analytics API (Azure Cognitive Services)

**Text Analytics** is a platform for analyzing text with a clear focus on language detection, key phrase extraction, and sentiment analysis. As part of the language-oriented services in [Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/), you can combine it with other services to cover a broader range of analytical scenario. For ideas on multi-service use cases, see [How to use Text Analytics](test-analytics-overview-how.md).

## Workloads supported by Text Analytics API

| Workload | 

## Typical workflow

The Text Analytics API is used to access an analytics engine in the Azure cloud. You submit text data in JSON, and then make API calls to analyze the input and return results.

Text analysis can mean different things, but in Azure Cognitives Services, it performs three functions:

interpretation
expression

The API is very specific in what it returns. Output consists of ...

Other phases of text analysis -- such as text parsing, cleansing, summarization, and visualization -- are not supported.

or several phases of the text analysis process, including text collection, text parsing and cleaning, text summary and analysis methods, and text visualization.

## Language Detection

The service can detect which language the input text is written in. 120 languages are supported. If more than one language is used, a list ...


## Key Phrase Extraction

Automatically extract key phrases to quickly identify the main points. We employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit.

For example, for the input text ‘The food was delicious and there were wonderful staff’, the service returns the main talking points: ‘food’ and ‘wonderful staff’.

## Sentiment Analysis

Find out what users think of your brand or topic by analyzing any text using sentiment analysis. You are now easily able to monitor the perception of your brand or topic over time.

Sentiment score is generated using classification techniques, and returns a score between 0 and 1. The input features to the classifier include n-grams, features generated from part-of-speech tags, and embedded words. 

## Supported Languages for sentiment analysis and key phrase extraction


| Language    | Language code | Sentiment | Key phrases |
|:----------- |:----:|:----:|:----:|
| Danish      | `da` | ✔ \* |  |
| German       | `de` | ✔ \* | ✔ |
| Greek       | `el` | ✔ \* |  |
| English     | `en` | ✔ | ✔ | 
| Spanish     | `es` | ✔ | ✔ | 
| Finnish     | `fi` | ✔ \* |  | 
| French      | `fr` | ✔ | ✔ \* | 
| Japanese    | `ja` |  | ✔ |   |
| Italian     | `it` | ✔ \* |  | 
| Dutch       | `nl` | ✔ \* |  | 
| Norwegian   | `no` | ✔ \* |  | 
| Polish      | `pl` | ✔ \* |  | 
| Portuguese  | `pt` | ✔ |  | 
| Russian     | `ru` | ✔ \* |  | 
| Swedish     | `sv` | ✔ \* |  | 
| Turkish     | `tr` | ✔ \* |  | 

\* indicates language support in preview

## Next steps

As a first step, use the [interactive demo]() to submit text input (5K character maximum) to detect the language (up to 120), calculate a sentiment score, or exract key phrases.

Step through the [quickstart tutorial]() to learn the basic workflow using the REST API.

Learn about the [Windows SDK](), a .NET alternative for writing text analysis apps in managed code.

## See also

 [Azure Cognitive Services]()   


