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

Let's say you run a website to sell handicrafts. Your users submit feedback on your site, and you'd like to find out what users think of your brand, and how that changes over time as you release new products and features to your site. Sentiment analysis can help here - given a piece of text, the Azure ML Text Analytics service returns a score between 0 and 1 denoting overall sentiment in the input text. Scores close to 1 indicate positive sentiment, while scores close to 0 indicate negative sentiment.

Sentiment score is generated using classification techniques. The input features to the classifier include n-grams, features generated from part-of-speech tags, and embedded words. 

## Key Phrase Extraction

This service can also extract key phrases, which denote the main talking points in the text. We employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit.

For example, for the input text ‘The manual transmission is a bit twitchy. Also, the vehicle is old-school’, the service would return the main talking points: ‘manual transmission’, ‘vehicle’ and ‘old-school’.

## Topic Detection

This is a new service which returns the topics which have been detected in multiple text articles. The service is designed to work well for short, human written text such as reviews and user feedback, and can help you to understand the main issues or suggestions that customers are mentioning.

## Language Detection

The service can be used to detect which language the input text is written in.

## Supported Languages

Note that the supported languages are as follows:

| Feature | Supported language codes |
|:--- |:--- |
| Sentiment |`en` (English), `es` (Spanish), `fr` (French), `pt` (Portuguese) |
| Key Phrases |`en` (English), `es` (Spanish), `de` (German), `ja` (Japanese) |
| Topics |`en` (English) |
