---
title: Frequently Asked Questions about the Text Analytics API
titleSuffix: Azure Cognitive Services
description: Get answers to common questions about the Text Analytics API.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 02/13/2019
ms.author: aahi
---
# Frequently Asked Questions (FAQ) about the Text Analytics Cognitive Service

 Find answers to commonly asked questions about concepts, code, and scenarios related to the Text Analytics API for Microsoft Cognitive Services on Azure.

## Can Text Analytics identify sarcasm?

Analysis is for positive-negative sentiment rather than mood detection.

There is always some degree of imprecision in sentiment analysis, but the model is most useful when there is no hidden meaning or subtext to the content. Irony, sarcasm, humor, and similarly nuanced content rely on cultural context and norms to convey intent. This type of content is among the most challenging to analyze. Typically, the greatest discrepancy between a given score produced by the analyzer and a subjective assessment by a human is for content with nuanced meaning.

## Can I add my own training data or models?

No, the models are pretrained. The only operations available on uploaded data are scoring, key phrase extraction, and language detection. We do not host custom models. If you want to create and host custom machine learning models, consider the [machine learning capabilities in Microsoft R Server](https://docs.microsoft.com/r-server/r/concept-what-is-the-microsoftml-package).

## Can I request additional languages?

Sentiment analysis and key phrase extraction are available for a [select number of languages](text-analytics-supported-languages.md). Natural language processing is complex and requires substantial testing before new functionality can be released. For this reason, we avoid pre-announcing support so that no one takes a dependency on functionality that needs more time to mature. 

To help us prioritize which languages to work on next, vote for specific languages on [User Voice](https://cognitive.uservoice.com/forums/555922-text-analytics). 

## Why does key phrase extraction return some words but not others?

Key phrase extraction eliminates non-essential words and standalone adjectives. Adjective-noun combinations, such as "spectacular views" or "foggy weather" are returned together.

Generally, output consists of nouns and objects of the sentence. Output is listed in order of importance, with the first phrase being the most important. Importance is measured by the number of times a particular concept is mentioned, or the relation of that element to other elements in the text.

## Why does output vary, given identical inputs?

Improvements to models and algorithms are announced if the change is major, or quietly slipstreamed into the service if the update is minor. Over time, you might find that the same text input results in a different sentiment score or key phrase output. This is a normal and intentional consequence of using managed machine learning resources in the cloud.

## Next steps

Is your question about a missing feature or functionality? Consider requesting or voting for it on our [UserVoice web site](https://cognitive.uservoice.com/forums/555922-text-analytics).

## See also

 [StackOverflow: Text Analytics API](https://stackoverflow.com/questions/tagged/text-analytics-api)   
 [StackOverflow: Cognitive Services](https://stackoverflow.com/questions/tagged/microsoft-cognitive)
