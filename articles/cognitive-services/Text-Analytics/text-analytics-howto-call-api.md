---
title: Call the Text Analytics API (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: Learn how to call the Text Analytics REST API.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: get-started-article
ms.date: 08/24/2017
ms.author: heidist
---

# How to call Text Analytics REST API

This articles demonstrates how to call Text Analytics API using HTTP POST/GET calls in C# and [Chrome Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop).

> [!Tip]
> You can call the REST API from the built-in testing console available any [API doc page](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6). There is no setup, and user requirements consist only of pasting an access key and the JSON documents into the request. 

## Prerequisites

Have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) and [sign up for the Text Analytics API](text-analytics-howto-signup.md). 

Have [an access key](text-analytics-howto-accesskey.md) for Text Analysis operations. You can use the same key for sentiment analysis, language detection, and key phrase extraction. 

## Set up a request in C#

TBD

## Set up a request in Postman

If you are using Chrome Postman or another Web API test tool, set up the endpoint to the resource you want to use, and provide the access key in a request header. Each operation requires that you append the appropriate resource to the endpoint. 

1. In Postman:

   + Choose **Post** as the request type.
   + Paste in the endpoint you copied from the portal page.
   + Append a resource. In this exercise, start with **/keyPhrases**.

  Endpoints for each available resource are as follows (your region may vary):

   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment`
   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases`
   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages`

2. Set three request headers:

   + `Ocp-Apim-Subscription-Key` set to your access key, obtained from Azure portal.
   + `Content-Type` set to application/json.
   + `Accept` set to application/json.

  Your request should look similar to the following screenshot:

   ![Request screenshot with endpoint and headers](../media/text-analytics/postman-request-keyphrase-1.png)

4. Click **Body** and choose **raw** for the format.

   ![Request screenshot with body settings](../media/text-analytics/postman-request-body-raw.png)

5. Paste in some JSON documents that have **id** and **text**. For sentiment analysis and key phrase extraction, include a 2-character **language** such as `en` for English, `es` for Spanish, and so forth.

## JSON schema requirements

Input rows must be JSON in raw unstructured text. XML is not supported. The schema is simple, consisting of the elements described in the following list. You can use the same documents for all three operations: sentiment, key phrase, and language detection.

+ `id` is required. The data type is string, but in practice document IDs tend to be integers. The system uses the IDs you provide to structure the output. Language codes, keywords, and sentiment scores are generated for each ID.

+ `text` field is required and contains unstructured raw text, up to 10 KB. For more information about limits, see [Text Analytics Overview > Data limits](overview.md#data-limits). 

+ `language` is used only in sentiment analysis and key phrase extraction. It is ignored in language detection. 

## Next steps

+ [Quick start](quick-start.md) is a walk through of the main capabilities. Learn how to submit text, choose an analysis, and view results with minimal code.

+ [Visit API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs. Documentation embeds interactive requests so that you can call the API from each documentation page.

+ To see how the Text Analytics API can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.

+ [Visit this page](text-analytics-resource-external-community.md) for a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

## See also 

 [Welcome to Text Analytics in Microsoft Cognitive Services on Azure](overview.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)