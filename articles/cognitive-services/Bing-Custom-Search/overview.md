---
title: Bing Custom Search Overview | Microsoft Docs
description: Provides a high-level overview of Bing Custom Search
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/29/2017
ms.author: v-brapel
---

# Customize your view of the web
Bing Custom Search enables you to create tailored search experiences for topics that you care about. For example, if you own a bicycle website that provides a search experience, you can specify the domains, subsites, and webpages that Bing searches. Your users see search results that are tailored to the content they care about instead of having to page through general search results that may contain irrelevant content. 

To create your custom view of the web, use the Bing Custom Search [portal](https://customsearch.ai). The portal lets you create a search instance that specifies the domains, subsites, and webpages that you want Bing to search, and those that you don’t want it to search. In addition to specifying the URLs of the content that you know about, you can also ask the portal to suggest content that you may want to add to your view. 

The portal also lets you pin a specific webpage to the top of the search result if the user enters a specific search term. 

After defining your instance, you can integrate custom search into your website, desktop app, or mobile app by calling the Custom Search API. If you have a web application, you can use the hosted UI for web applications.

The following image shows the simplicity of the custom search integration.



![picture alt](./media/bcs-overview.png "How Bing Custom Search works.")

### Next steps
To get started quickly see [Create your first Bing Custom Search instance](quick-start.md).

Familiarize yourself with the [Custom Search API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference) reference. The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects. 

Be sure to read [Bing Use and Display Requirements](./use-and-display-requirements.md) so you don't break any of the rules about using the search results.


