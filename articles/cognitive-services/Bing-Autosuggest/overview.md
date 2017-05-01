---
title: Refine query results with the Bing Autosuggest API | Microsoft Docs
description: Get started with the Bing Autosuggest API, and use the API Testing Console to test API requests.
services: cognitive-services
author: swhite-msft
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-autosuggest
ms.topic: article
ms.date: 01/12/2017
ms.author: scottwhi
---

# Bing Autosuggest API

The Bing Autosuggest API lets partners send a partial search query to Bing and get back a list of suggested queries that other users have searched on (overview on [MSDN](https://msdn.microsoft.com/en-us/library/mt711406.aspx)). In addition to including searches that other users have made, the list may include suggestions based on user intent. For example, if the query string is "*weather in Lo*", the list will include relevant weather suggestions.

Typically, you use this API to support an auto-suggest search box feature. For example, as the user types a query into the search box, you would call this API to populate a drop-down list of suggested query strings. If the user selects a query from the list, you would either send the user to the Bing search results page for the selected query or call the [Web Search API](https://msdn.microsoft.com/en-us/library/mt711415(v=bsynd.50).aspx) to get the search results and display the results yourself.

To get started, read our [Getting Started](https://msdn.microsoft.com/en-US/library/mt712546.aspx) guide, which describes how you can obtain your own subscription keys and start making calls to the API. If you already have a subscription, try our API Testing Console [API Testing Console](https://dev.cognitive.microsoft.com/docs/services/56c7694ecf5ff801a090fbd1/operations/56c769a2cf5ff801a090fbd2/console) where you can easily craft API requests in a sandbox environment.

For information that shows you how to use the Autosuggest API, see [Autosuggest Guide](https://msdn.microsoft.com/en-us/library/mt711401(v=bsynd.50).aspx).

For information about the programming elements that you'd use to request and consume the search results, see [Autosuggest Reference](https://msdn.microsoft.com/en-us/library/mt711395(v=bsynd.50).aspx).

For additional guide and reference content that is common to all Bing APIs, such as Paging Results and Error Codes, see [Shared Guides](https://msdn.microsoft.com/en-us/library/mt711404(v=bsynd.50).aspx) and [Shared Reference](https://msdn.microsoft.com/en-us/library/mt711403(v=bsynd.50).aspx).
