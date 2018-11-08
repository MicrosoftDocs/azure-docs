---
title: What is Bing Custom Search?
titlesuffix: Azure Cognitive Services
description: Provides a high-level overview of Bing Custom Search.
services: cognitive-services
author: brapel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: overview
ms.date: 09/29/2017
ms.author: v-brapel
---

# What is Bing Custom Search?

Bing Custom Search enables you to create tailored search experiences for topics that you care about. For example, if you own a website that provides a search experience, you can specify the domains, websites, and webpages that Bing searches. Your users see search results tailored to the content they care about instead of having to page through search results that have irrelevant content.

To create your custom view of the web, use the Bing Custom Search [portal](https://customsearch.ai). The portal lets you create a custom search instance that specifies the domains, websites, and webpages that you want Bing to search, and the websites that you don’t want it to search. In addition to specifying the URLs of the content that you know about, you can also use the portal to find relevant content that you may want to add.

The portal also lets you pin a specific webpage to the top of the search result if the user enters a specific search term. 

After defining your instance, you can integrate custom search into your website, desktop app, or mobile app by calling the Custom Search API. If you have a web-based site or application, you can let the hosted UI render the search interface for you.

The following image shows the simplicity of the custom search integration.

![picture alt](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/cognitive-services/Bing-Custom-Search/media/BCS-Overview.png "How Bing Custom Search works.")

## Adding custom search box suggestions

You can enrich your custom search experience with custom search box suggestions. This feature lets you provide custom search suggestions relevant to your search experience. As the user types in the search box, the dropdown list contains suggested query strings based on the user's partial query string. You can specify whether to return only your custom suggestions or also include Bing suggestions. [Read more](define-custom-suggestions.md).

## Adding custom image search experience

You can enrich your custom search experience with images. Similar to web results, custom search supports searching for images in your instance's list of websites. [Read more](get-images-from-instance.md).

## Adding custom video search experience

You can enrich your custom search experience with videos. Similar to web results, custom search supports searching for videos in your instance's list of websites. [Read more](get-videos-from-instance.md).

## Sharing your custom search instance with others

You can easily allow collaborative editing and testing of your instance by sharing it with members of your team. [Read more](share-your-custom-search.md).

## Next steps

To get started quickly, see [Create your first Bing Custom Search instance](quick-start.md).

For details about customizing your search instance, see [Define a custom search instance](define-your-custom-view.md).

Familiarize yourself with the reference content for each of the custom search endpoints. The reference contains the endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects.

- [Custom Search API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference)
- [Custom Image API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-images-api-v7-reference)
- [Custom Video API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-videos-api-v7-reference)
- [Custom Autosuggest API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-autosuggest-api-v7-reference)


Be sure to read [Bing Use and Display Requirements](./use-and-display-requirements.md) so you don't break any of the rules about using the search results.
