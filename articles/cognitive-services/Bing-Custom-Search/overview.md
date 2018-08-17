---
title: What is Bing Custom Search? | Microsoft Docs
description: Provides a high-level overview of Bing Custom Search
services: cognitive-services
author: brapel
manager: ehansen
ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: article
ms.date: 09/29/2017
ms.author: v-brapel
---
# What is Bing Custom Search?

Bing Custom Search enables you to create tailored search experiences for topics that you care about. For example, if you own a website that provides a search experience, you can specify the domains, websites, and webpages that Bing searches. Your users see search results tailored to the content they care about instead of having to page through search results that have irrelevant content.

To create your custom view of the web, use the Bing Custom Search [portal](https://customsearch.ai). The portal lets you create a custom search instance that specifies the domains, websites, and webpages that you want Bing to search, and the websites that you don’t want it to search. In addition to specifying the URLs of the content that you know about, you can also use the portal to find relevant content that you may want to add.

The portal also lets you pin a specific webpage to the top of the search result if the user enters a specific search term. 

After defining your instance, you can integrate custom search into your website, desktop app, or mobile app by calling the Custom Search API. If you have a web-based site or application, you can let the hosted UI render the search interface for you.

The following image shows the simplicity of the custom search integration.

![picture alt](./media/bcs-overview.png "How Bing Custom Search works.")

## Customize search suggestions

If you subscribed to Custom Search at the appropriate level (see the [pricing pages](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/)), you can customize the search suggestions made in your Custom Search experience. The Custom Autosuggest API returns a list of suggested queries based on a partial query string that the user provides. With Custom Autosuggest, you provide custom search suggestions relevant to your search experience. You specify whether to return only custom suggestions or to include Bing suggestions. If Bing suggestions are included, custom suggestions appear before the suggestions Bing provides. Bing suggestions are restricted to the context of your Custom Search instance.

## Next steps

To get started quickly, see [Create your first Bing Custom Search instance](quick-start.md).

For details about available options to customize your search instance, see [Define a custom search instance](define-your-custom-view.md).

Familiarize yourself with the [Custom Search API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference) reference. The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects.

To learn how to customize suggestions, see [Define custom search suggestions](define-custom-suggestions.md).

Be sure to read [Bing Use and Display Requirements](./use-and-display-requirements.md) so you don't break any of the rules about using the search results.