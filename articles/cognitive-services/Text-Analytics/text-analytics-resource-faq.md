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

## Can Text Analytics identify sarcasm?

Analysis is for positive-negative sentiment rather than mood detection.

There is always some degree of imprecision in sentiment analysis, but the model is most useful when there is no hidden meaning or subtext to the content. Irony, sarcasm, humor, and similarly nuanced content rely on cultural context and norms to convey intent. This type of content is among the most challenging to analyze. Typically, the greatest discrepancy between a given score produced by the analyzer and a subjective assessment by a human is for content with nuanced meaning.

## Can I throttle requests or pause the service?

You cannot pause the service or temporarily throttle requests service-side to conserve the balance of your request allocation for future use in the same billing cycle. The only guarantee for preventing transactions against your subscription is to remove the Text Analytics API from your subscription, and then repeat signup when you are ready to resume transactions. 
 
Because data isn't stored, the impact on deleting and recreating the signup is minimal. The only coding investment you lose is the reference to your access key string, which you would need to update after signing up for the API.

## Can I add my own training data or models?

No, the models are pretrained. The only operations available on uploaded data are scoring, key phrase extraction, and language detection. We do not host custom models. If you want to create and host custom machine learning models, consider the [machine learning capabilities in Microsoft R Server](https://docs.microsoft.com/r-server/r/concept-what-is-the-microsoftml-package).

## Can I request additional languages?

Sentiment analysis and key phrase extraction are available for a [select number of languages](overview.md#supported-languages). Natural language processing is complex and requires substantial testing before new functionality can be released. For this reason, we avoid pre-announcing support so that no one takes a dependency on functionality that needs more time to mature. 

To help us prioritize which languages to work on next, vote for specific languages on [User Voice](https://cognitive.uservoice.com/forums/555922-text-analytics). 

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
