---
title: Frequently Asked Questions (FAQ) about Azure Text Analytics API | Microsoft Docs
description: Get answers to common questions about Microsoft Azure Cognitive Services Text Analytics API.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 07/26/2017
ms.author: heidist
---

# Frequently Asked Questions (FAQ) about Text Analytics API (Azure Cognitive Services)
 
 Find answers to commonly asked questions about concepts, code, and scenarios related to the Text Analytics API in Azure Cognitive Services.

 ## Availability & billing

 ### Can I manually throttle requests to suspend billable transactions?

 You cannot pause the service or temporarily throttle requests service-side to conserve the balance of your request allocation for future use in the same billing cycle. The only guarantee for preventing transactions against your subscription is to remove the Text Analytics API from your subscription, and then repeat sign up when you are ready to resume transactions. 
 
 Because data isn't stored, the impact on deleting and recreating the sign up is generally minimal. The only coding investment you lose is the reference to your access key string, which you would need to update after signing up for the API.

## Architecture and concepts

 ### Can I find out if support for a specific language is forthcoming?

We avoid pre-announcing support for specific languages. This practice minimizes the chance of customers or partners taking a dependency on functionality that we might not be able to deliver in a timely manner. If you want support for a specific language, you can request or vote for it on [User Voice](https://cognitive.uservoice.com/). Your votes will help us prioritize which ones to work on next.

### Why do output caclulations vary, when inputs are identical?

Improvements to models and algorithms are announced if the change is major, or quietly slipstreamed into the service if the update is minor. Over time, you might find that the same text input results in a different sentiment score or key phrase extraction. This is a normal and intended consequence for machine learning resources hosted in Cognitive Services.

## Next steps

Is your question about a missing feature or functionality? Consider requesting or voting for it on our [User Voice web site](https://cognitive.uservoice.com/).

## See also

 [StackOverflow: Azure Text Analytics API](https://stackoverflow.com/questions/tagged/text-analytics-api)   
 [StackOverflow: Azure Cognitive Services](http://stackoverflow.com/questions/tagged/microsoft-cognitive)
