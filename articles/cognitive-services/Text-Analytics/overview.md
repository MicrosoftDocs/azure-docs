---
title: Text Analytics API in Microsoft Cognitive Services | Microsoft Docs
description: Use the Text Analytics API for sentiment analysis, key phrase extraction, topic detection for English text, and much more.
services: cognitive-services
author: LuisCabrer
manager: mwinkle

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 04/06/2016
ms.author: luisca
---

# Text Analytics Documentation

**Description**

Understanding and analyzing unstructured text is an increasingly popular field and includes a wide spectrum of problems such as sentiment analysis, key phrase extraction, topic modeling/extraction, aspect extraction and more.

Text Analytics API is a suite of text analytics services built with Azure Machine Learning. We currently offer APIs for sentiment analysis, key phrase extraction and topic detection for English text, as well as language detection for 120 languages.In this initial preview release, we offer APIs for sentiment analysis and key phrase extraction of English text. No labeled or training data is needed to use the service - just bring your text data. This service is based on research and engineering that originated in Microsoft Research and which has been battle-tested and improved over the past few years by product teams such as Bing and Office.

**Sentiment Analysis**

Let's say you run a website to sell handicrafts. Your users submit feedback on your site, and you'd like to find out what users think of your brand, and how that changes over time as you release new products and features to your site. Sentiment analysis can help here - given a piece of text, the Azure ML Text Analytics service returns a score between 0 and 1 denoting overall sentiment in the input text. Scores close to 1 indicate positive sentiment, while scores close to 0 indicate negative sentiment.

Sentiment score is generated using classification techniques. The input features to the classifier include n-grams, features generated from part-of-speech tags, and embedded words. The classifier was trained in part using Sentiment140 data.

**Key Phrase Extraction**

This service can also extract key phrases, which denote the main talking points in the text. We employ techniques from Microsoft Office's sophisticated Natural Language Processing toolkit.

For example, for the input text ‘The manual transmission is a bit twitchy. Also, the vehicle is old-school’, the service would return the main talking points: ‘manual transmission’, ‘vehicle’ and ‘old-school’.

**Topic Detection**

This is a new service which returns the topics which have been detected in multiple text articles. The service is designed to work well for short, human written text such as reviews and user feedback, and can help you to understand the main issues or suggestions that customers are mentioning.

**Language Detection**

The service can be used to detect which language the input text is written in.



