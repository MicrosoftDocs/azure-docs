---
title: Frequently Asked Questions (FAQ) about Azure Text Analytics API | Microsoft Docs
description: Get answers to common questions about Microsoft Cognitive Services Text Analytics API on Azure.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/26/2017
ms.author: heidist
---

# Frequently Asked Questions (FAQ) about Text Analytics API (Cognitive Services)
 
 Find answers to commonly asked questions about concepts, code, and scenarios related to the Text Analytics API for Microsoft Cognitive Services on Azure.

## How is the sentiment score calculated?

Sentiment analysis is based on Naive-Bayes classifiers and a large body of fixed training data. The model calculates the probability of how positive or negative a word is based on its context, proximity to other words, and other evidence in the text, including punctuation and emoticons. Against this model, new text inputs are scored along a negative (0) to positive (1.0) continuum based on typical usage. When analysis is indeterminate, a neutral score of 0.5 is assigned to the document.

Currently, we do not support *mood detection* or *aspect-based sentiment analysis*. Text that is sarcastic, ironic, humorous, and so on, is scored at face value, which means the underlying nuance is probably not reflected accurately in the score. 

Generally, sentiment analysis is the most useful when the following conditions are met:

+ You can provide a large collection of documents, at sufficient quantity to offset incorrect analyses due to nuanced or subtle meanings in the text.
+ Fast machine learning algorithms are a good fit for your solution, where the text you want to analyze is unstructured, and alternative approaches would require large amounts of complex code.
+ You can derive actionable insights from the scored results. Scoring can reveal emerging trends, spikes, or dips in positive-negative sentiment, which could prove useful in a variety of scenarios.

 ## Can I throttle requests or pause the service?

 You cannot pause the service or temporarily throttle requests service-side to conserve the balance of your request allocation for future use in the same billing cycle. The only guarantee for preventing transactions against your subscription is to remove the Text Analytics API from your subscription, and then repeat signup when you are ready to resume transactions. 
 
 Because data isn't stored, the impact on deleting and recreating the signup is minimal. The only coding investment you lose is the reference to your access key string, which you would need to update after signing up for the API.

### Can I add my own training data or models?

No, the models are pretrained. The only operations available on uploaded data are scoring, key phrase extraction, and language detection. We do not host custom models. If you want to create and host custom machine learning models, consider the [machine learning capabilities in Microsoft R Server](https://docs.microsoft.com/r-server/r/concept-what-is-the-microsoftml-package).

### Can I request additional languages?

Sentiment analysis and key phrase extraction are available for a [select number of languages](overview.md#supported-languages). Natural language processing is complex and requires substantial testing before new functionality can be released. For this reason, we avoid pre-announcing support so that no one takes a dependency on functionality that needs more time to mature. 

To help us prioritize which languages to work on next, vote for specific languages on [User Voice](https://cognitive.uservoice.com/). 

## Is keyword extraction related to sentiment analysis?

No, none of the operations share models, training data, or components. Keywords or phrases are not extracted based on a higher or lower sentiment; nor is sentiment biased on words considered more important or relevant in the document. 

 ## Can I restrict access to the API?

You can selectively enable or disable access to specific APIs within your organization by [creating resource policies](../../azure-resource-manager/resource-manager-policy-portal.md).

## Why does output vary, given identical inputs?

Improvements to models and algorithms are announced if the change is major, or quietly slipstreamed into the service if the update is minor. Over time, you might find that the same text input results in a different sentiment score or key phrase output. This is a normal and intentional consequence of using managed machine learning resources in the cloud.

## Next steps

Is your question about a missing feature or functionality? Consider requesting or voting for it on our [User Voice web site](https://cognitive.uservoice.com/).

## See also

 [StackOverflow: Text Analytics API](https://stackoverflow.com/questions/tagged/text-analytics-api)   
 [StackOverflow: Cognitive Services](http://stackoverflow.com/questions/tagged/microsoft-cognitive)
