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

 ## Availability & billing

 ### Can I manually throttle requests to suspend billable transactions?

 You cannot pause the service or temporarily throttle requests service-side to conserve the balance of your request allocation for future use in the same billing cycle. The only guarantee for preventing transactions against your subscription is to remove the Text Analytics API from your subscription, and then repeat signup when you are ready to resume transactions. 
 
 Because data isn't stored, the impact on deleting and recreating the signup is minimal. The only coding investment you lose is the reference to your access key string, which you would need to update after signing up for the API.

## Architecture & concepts

### Can I add my own training data or models?

No, the models are pretrained. The only operations available on uploaded data are scoring, key phrase extraction, and language detection. We do not host custom models. If you want to create and host custom machine learning models, consider the [machine learning capabilities in Microsoft R Server](https://docs.microsoft.com/r-server/r/concept-what-is-the-microsoftml-package).

### What is the schedule or timeline for rolling out additional languages for sentiment analysis or key phrase extraction?

We avoid pre-announcing support for specific languages so that no one takes a dependency on functionality that we might not be able to deliver in a timely manner. To help us prioritize which ones to work on next, vote for specific languages on [User Voice](https://cognitive.uservoice.com/). 

### Is keyword extraction related to sentiment analysis?

No, while both use n-grams, they do not share models or components. Keywords or phrases are not extracted based on a higher or lower sentiment; nor is sentiment biased on words considered more important or relevant to the phrase. 

### Why do output calculations vary, when inputs are identical?

Improvements to models and algorithms are announced if the change is major, or quietly slipstreamed into the service if the update is minor. Over time, you might find that the same text input results in a different sentiment score or key phrase extraction. This is a normal and intended consequence of using managed machine learning resources in the cloud.

### Why do some sentiment scores seem off?

Sentiment analysis is hard to do when sentiment is nuanced or unclear. Sarcasm, irony, puns, and some slang are a challenge for most analyzers. In general, sentiment scoring is best at predicting positive or negative sentiment. The model provides a score given sufficient evidence. When analysis is indeterminate, a neutral score of 0.5 is assigned to the document.

## Next steps

Is your question about a missing feature or functionality? Consider requesting or voting for it on our [User Voice web site](https://cognitive.uservoice.com/).

## See also

 [StackOverflow: Text Analytics API](https://stackoverflow.com/questions/tagged/text-analytics-api)   
 [StackOverflow: Cognitive Services](http://stackoverflow.com/questions/tagged/microsoft-cognitive)
