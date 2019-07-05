---
title: "Quickstart: Create a first Bing Custom Search instance | Microsoft Docs"
titlesuffix: Azure Cognitive Services
description: Use this article to create a custom Bing instance that can search domains and webpages that you define. 
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: quickstart
ms.date: 06/18/2019
ms.author: aahi
---

# Quickstart: Create your first Bing Custom Search instance

To use Bing Custom Search, you need to create a custom search instance that defines your view or slice of the web. This instance contains the public domains, websites, and webpages that you want to search, along with any ranking adjustments you may want. 

To create the instance, use the [Bing Custom Search portal](https://customsearch.ai). 

![A picture of the Bing Custom Search portal](media/blockedCustomSrch.png)

## Prerequisites

[!INCLUDE [cognitive-services-bing-custom-search-prerequisites](../../../includes/cognitive-services-bing-custom-search-signup-requirements.md)]

## Create a custom search instance

To create a Bing Custom Search instance:

1. Click **Get Started** on the [Bing Custom Search portal](https://customsearch.ai) webpage, and sign in with your Microsoft account.

2. Click **New Instance**, and enter a descriptive name. You can change the name of your instance at any time.
 
3. On the **Active** tab under **Search Experience**, enter the URL of one or more websites you want to include in your search. 

    > [!NOTE]
    > Bing Custom Search instances will only return results for domains, and webpages that are public and have been indexed by Bing.

4. You can use the right side of the Bing Custom Search portal to enter a query and examine the search results returned by your search instance. If no results are returned, try entering a different URL.  

5. Click **Publish** to publish your changes to the production environment, and update the instance's endpoints.

6.  Click on the **Production** tab under **Endpoints**, and copy your **Custom Configuration ID**. You need this ID to call the Custom Search API by appending it to the `customconfig=` query parameter in your calls.


## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Call your Bing Custom Search endpoint](./call-endpoint-csharp.md)
