---
title: "Quickstart: Create a first Bing Custom Search instance"
titlesuffix: Azure Cognitive Services
description: Use this article to create a custom Bing instance that can search domains and webpages that you define. 
services: cognitive-services
author: brapel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: quickstart
ms.date: 05/07/2017
ms.author: v-brapel
---

# Quickstart: Create your first Bing Custom Search instance

To use Bing Custom Search, you need to create a custom search instance that defines your view or slice of the web. This instance contains the public domains, websites, and webpages that you want to search, along with any ranking adjustments you may want. 

To create the instance, use the [Bing Custom Search portal](https://customsearch.ai). 

## Prerequisites

You must have a [Cognitive Services API account](../cognitive-services-apis-create-account) with access to the Bing Custom Search API. If you don't have an Azure subscription, you can [create an account](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search) for free. Before continuing, You will need the access key provided after activating your free trial, or a paid subscription key from your Azure dashboard.

## Create a custom search instance

To create a Bing Custom Search instance:

1. Click **Get Started** on the [Bing Custom Search portal](https://customsearch.ai) webpage, and sign in with your Microsoft account.

2. Click **New Instance**, and enter a descriptive name. You can change the name of your instance at any time.
 
3. On the **Active** tab under **Search Experience**, enter the URL of one or more websites you want to include in your search. 

    > [!NOTE]
    > Bing Custom Search instances will only return results for domains, and webpages that are public and have been indexed by Bing.

4. You can use the right side of the Bing Custom Search portal to enter a query and examine the search results returned by your search instance. If no results are returned, try entering a different URL.  

5. Click **Publish** to publish your changes to the production environment, and update the instance's endpoints.

6.  Click on the **Production** tab. under **Endpoints**, copy your **Custom Configuration ID**. You need this ID to call the Custom Search API by appending it to the `customconfig=` query parameter in your calls.


## Next steps

> [!div class="nextstepaction"]
> [Call your custom search](./search-your-custom-view.md)


Continue to work with the custom search instance you've just created by following instructions in these how-to guides:

- [Configure your custom search experience](./define-your-custom-view.md)
- [Share your custom search](./share-your-custom-search.md)
- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
