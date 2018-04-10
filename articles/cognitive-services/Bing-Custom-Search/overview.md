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
Bing Custom Search enables you to create tailored search experiences for topics that you care about. For example, if you own a website that provides a search experience, you can specify the domains, websites, and webpages that Bing searches. Your users see search results tailored to the content they care about instead of having to page through search results that have irrelevant content. 

To create your custom view of the web, use the Bing Custom Search [portal](https://customsearch.ai). The portal lets you create a custom search instance that specifies the domains, websites, and webpages that you want Bing to search, and the websites that you don’t want it to search. In addition to specifying the URLs of the content that you know about, you can also use the portal to find relevant content that you may want to add.

The portal also lets you pin webpages and customize auto suggest search terms. Pinned webpages will appear at the top of the search results if the user enters the search term you specify. Auto suggest search terms are suggested based on the user's current input. Customizing auto suggest will show your suggestions first in the list of suggested search terms.

After defining your instance, you can integrate custom search into your website, desktop app, or mobile app by calling the Custom Search API. If you have a web-based site or application, you can let the hosted UI render the search interface for you.

The following image shows the simplicity of the custom search integration.



![picture alt](./media/bcs-overview.png "How Bing Custom Search works.")

### Next steps
To get started quickly, see [Create your first Bing Custom Search instance](quick-start.md).

For detail about available options to customize your search instance, see [Define a custom search instance](define-your-custom-view.md).

Familiarize yourself with the [Custom Search API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference) reference. The reference contains the list of endpoints, headers, and query parameters that you'd use to request search results. It also includes definitions of the response objects. 

Be sure to read [Bing Use and Display Requirements](./use-and-display-requirements.md) so you don't break any of the rules about using the search results.


