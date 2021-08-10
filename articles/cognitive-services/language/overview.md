---
title: What is the Azure Language services?
titleSuffix: Azure Cognitive Services
description: What is Azure language services?
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

Azure Language services is a cloud-based service that provides Natural Language Processing (NLP) features for text mining and text analysis

## Sentiment analysis

Use sentiment analysis and find out what people think of your brand or topic by mining the text for clues about positive or negative sentiment. 

The feature provides sentiment labels (such as "negative", "neutral" and "positive") based on the highest confidence score found by the service at a sentence and document-level. This feature also returns confidence scores between 0 and 1 for each document & sentences within it for positive, neutral and negative sentiment. You can also be run the service on premises using a container.

## Opinion mining

Opinion mining is a feature of Sentiment Analysis. Also known as Aspect-based Sentiment Analysis in Natural Language Processing (NLP), this feature provides more granular information about the opinions related to words (such as the attributes of products or services) in text.

## Key phrase extraction

Use key phrase extraction to quickly identify the main concepts in text. For example, in the text "The food was delicious and there were wonderful staff", Key Phrase Extraction will return the main talking points: "food" and "wonderful staff".

## Language detection

Language detection can detect the language an input text is written in and report a single language code for every document submitted on the request in a wide range of languages, variants, dialects, and some regional/cultural languages. The language code is paired with a confidence score.

## Entity linking

Entity linking is the ability to identify and disambiguate the identity of an entity found in text 

## Named entity recognition

Named Entity Recognition (NER) can Identify and categorize entities in your text as people, places, organizations, quantities, Well-known entities are also recognized and linked to more information on the web.

## Conversational Language Understanding (preview)

Conversational Language Understanding enables you to train conversational language models using transformer-based models. 

## Text summarization

Extractive summarization is a feature in Azure Text Analytics that produces a summary by extracting sentences that collectively represent the most important or relevant information within the original content.

This feature is designed to help address the problem with content that users think is too long to read. Extractive summarization condenses articles, papers, or documents to key sentences.


## Health

the health feature extracts and labels relevant medical information from unstructured texts such as doctor's notes, discharge summaries, clinical documents, and electronic health records.

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the following articles to learn about responsible AI use and deployment in your systems:

* [Transparency note for Language services](/legal/cognitive-services/text-analytics/transparency-note)
* [Transparency note for Sentiment Analysis and Opinion Mining](/legal/cognitive-services/text-analytics/transparency-note-sentiment-analysis)
* [Integration and responsible use](/legal/cognitive-services/text-analytics/guidance-integration-responsible-use)
* [Data, privacy and security](/legal/cognitive-services/text-analytics/data-privacy)
