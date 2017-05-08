---
title: Text Analytics API | Microsoft Docs
description: Use the Text Analytics API for sentiment analysis, key phrase extraction, topic detection for English text, and much more.
services: cognitive-services
author: LuisCabrer
manager: mwinkle

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 05/02/2017
ms.author: onewth
---

# Text Analytics API

Use a few lines of code to easily analyze sentiment, extract key phrases, detect topics, and detect language for any kind of text.

## Sentiment Analysis

Find out what users think of your brand or topic by analyzing any text using sentiment analysis. You are now easily able to monitor the perception of your brand or topic over time.

Sentiment score is generated using classification techniques, and returns a score between 0 and 1. The input features to the classifier include n-grams, features generated from part-of-speech tags, and embedded words. 

## Key Phrase Extraction

Automatically extract key phrases to quickly identify the main points. We employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit.

For example, for the input text ‘The food was delicious and there were wonderful staff’, the service returns the main talking points: ‘food’ and ‘wonderful staff’.

## Topic Detection

This service returns topics that have been detected in multiple text articles. The service is designed to work well for short, human written text such as reviews and user feedback. It can help you to understand the main issues or suggestions that customers are mentioning.

## Language Detection

The service can be used to detect which language the input text is written in. 120 languages are supported.

## Supported Languages

The supported languages are as follows:

| Feature | Supported language codes |
|:--- |:--- |
| Sentiment |<div style="display:inline-block">`en` (English)</div>, <div style="display:inline-block">`es` (Spanish)</div>, <div style="display:inline-block">`fr` (French)</div>, <div style="display:inline-block">`pt` (Portuguese)</div> |
| Sentiment (additional preview languages) | <span style="display:inline-block">`de` (German),</span> <span style="display:inline-block">`it` (Italian),</span> <span style="display:inline-block">`nl` (Dutch),</span> <span style="display:inline-block">`no` (Norwegian),</span> <span style="display:inline-block">`sv` (Swedish),</span> <span style="display:inline-block">`pl` (Polish),</span> <span style="display:inline-block">`da` (Danish),</span> <span style="display:inline-block">`fi` (Finnish),</span> <span style="display:inline-block">`ru` (Russian),</span> <span style="display:inline-block">`el` (Greek),</span> <span style="display:inline-block">`tr` (Turkish)</span>
| Key Phrases |`en` (English)</span>, `es` (Spanish)</span>, `de` (German)</span>, `ja` (Japanese)</span> |
| Topics |`en` (English)</span> |
