---
title: What is Bing Autosuggest?
titlesuffix: Azure Cognitive Services
description: Learn how to use the Bing Autosuggest API.
services: cognitive-services
author: swhite-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-autosuggest
ms.topic: overview
ms.date: 09/12/2017
ms.author: scottwhi
---
# What is Bing Autosuggest?

If your application sends queries to any of the Bing Search APIs, you can use the Bing Autosuggest API to improve your users' search experience. The Bing Autosuggest API returns a list of suggested queries based on the partial query string in the search box. As characters are entered into the search box, you can display suggestions in a drop-down list.

## Bing Autosuggest API features

| Feature                                                                                                                                                                                 | Description                                                                                                                                                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Suggest search terms in real-time](concepts/sending-requests.md#suggest-search-terms-with-the-bing-autosuggest-api) | Improve your app experience by using the [Bing Autosuggest API](../bing-autosuggest/get-suggested-search-terms.md) to display suggested search terms as they're typed. |

## Workflow

The Bing Autosuggest API is a RESTful web service, easy to call from any programming language that can make HTTP requests and parse JSON. 

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.
2. Send a request to this API each time the user types a new character in the search box.
3. Process the API response by parsing the returned JSON message.

| Feature                                                                                                                                                                                 | Description                                                                                                                                                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Suggest search terms in real-time](concepts/getting-suggestions.md) | Improve your app experience by using the Autosuggest API to display suggested search terms as they're typed. |

Typically, you'd call this API each time the user types a new character in the search box. The completeness of the query string impacts the relevance of the suggested query terms that the API returns. The more complete the query string, the more relevant the list of suggested query terms are. For example, the suggestions that the API may return for *s* are likely to be less relevant than the queries it returns for *sailing dinghies*.

The following example shows a request that returns the suggested query strings for *sail*. Remember to URL encode the user's partial query term when you set the [q](https://docs.microsoft.com/rest/api/cognitiveservices/bing-autosuggest-api-v7-reference#query) query parameter. For example, if the user entered *sailing les*, set `q` to `sailing+les` or `sailing%20les`.

The Bing Autosuggest API is a RESTful web service, easy to call from any programming language that can make HTTP requests and parse JSON. 

1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) for free.
2. Send a request to this API each time a user types a new character in your application's search box.
3. Process the API response by parsing the returned JSON message.

Typically, you'd call this API each time the user types a new character in your application's search box. As more characters are entered, the API will return more relevant suggested search queries. For example, the suggestions the API might return for a single `s` are likely to be less relevant than ones for `sail`.

The following example shows a drop-down search box with suggested query terms from the Bing Autosuggest API.

![Autosuggest drop-down search box list](./media/cognitive-services-bing-autosuggest-api/bing-autosuggest-drop-down-list.PNG)

If the user selects a suggested query from the drop-down list, you'd use the query term in the `query` field to call the [Bing Web Search API](../bing-web-search/search-the-web.md) and display the results yourself. Or, you could use the URL in the `url` field to send the user to the Bing search results page instead.

## Next steps

To get started quickly with your first request, see [Making Your First Query](quickstarts/csharp.md).

Familiarize yourself with the [Bing Autosuggest API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-autosuggest-api-v7-reference) reference. The reference contains the list of endpoints, headers, and query parameters that you'd use to request suggested query terms, and the definitions of the response objects.

Learn how to search the web by using the [Bing Web Search API](../bing-web-search/search-the-web.md).

Be sure to read [Bing Use and Display Requirements](./useanddisplayrequirements.md) so you don't break any of the rules about using the search results.
