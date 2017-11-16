---
title: "Bing Custom Search: Get started | Microsoft Docs"
description: Describes how to create a custom search instance
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Create your first Bing Custom Search instance
To use Bing Custom Search, you need to create a custom search instance that defines your view or slice of the web. The instance contains settings that specify the public domains, subsites, and webpages that you want Bing to search, and any ranking adjustments. To create the instance, use the Bing Custom Search [portal](https://customsearch.ai). 

## Create a custom search instance

To create a Bing Custom Search instance:

1.  Get a key for Custom Search API. See [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).
2.	Sign in to the portal using a Microsoft account (MSA). Click the **Sign in** button. If you don’t have an MSA, click **Create a Microsoft account**. Since it’s your first time using the portal, it’ll ask for permissions to access your data. Click **Yes**.
3.	After signing in, click **New search instance** and name the instance. Use a name that’s meaningful and describes the type of content the search returns. You can change the name at any time. 
4.	In the **Definition Editor**, click the **Active** tab and enter the URL of one or more sites you want to include in your search.
5.	To confirm that your instance returns results, enter a query in the preview pane on the right. If there are no results, specify a new site. Bing returns results only for public sites that it has indexed.
6.	 Click the **API Endpoint** tab and copy the **Custom Configuration ID**. You need this ID to call the Custom Search API.

## Next steps

- [Define your custom view](./define-your-custom-view.md)
- [Search your custom instance](./search-your-custom-view.md)
- [Configure and consume custom hosted UI](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
