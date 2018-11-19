---
title: "Quickstart: Create a first Bing Custom Search instance"
titlesuffix: Azure Cognitive Services
description: To use Bing Custom Search, you need to create a custom search instance that defines your view or slice of the web. The instance contains settings that specify the public domains, subsites, and webpages that you want Bing to search, and any ranking adjustments. 
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
To use Bing Custom Search, you need to create a custom search instance that defines your view or slice of the web. The instance contains settings that specify the public domains, websites, and webpages that you want Bing to search, and any ranking adjustments. To create the instance, use the Bing Custom Search [portal](https://customsearch.ai). 

## Create a custom search instance

To create a Bing Custom Search instance:

1.  Get a key for Custom Search API. See [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search).
2.	Click the **Sign in** button and sign in to the portal using a Microsoft account (MSA). 
    - If you don’t have an MSA, click **Create a Microsoft account**. The portal asks for permissions to access your data. Click **Yes**.
    - Agree to the Cognitive Services Terms. Check **I agree** and click **Agree**.  
3.	After signing in, click **New Instance** and name the instance. Use a name that’s meaningful and describes the type of content the search returns. You can change the name at any time. 
4.  On the **Active** tab under **Search Experience**, enter the URL of one or more websites you want to include in your search.
5.	To confirm that your instance returns results, enter a query in the preview pane on the right. If there are no results, specify a new website. Bing returns results only for public websites that it has indexed.
6.  Click **Publish** to publish configuration changes to production. When prompted, click **Publish** to confirm.
7.  Click **Production** > **Endpoints** and copy the **Custom Configuration ID**. You need this ID to call the Custom Search API.

## Next steps

Continue to work with the custom search instance you've just created by following instructions in these how-to guides:

- [Configure your custom search experience](./define-your-custom-view.md)
- [Call your custom search](./search-your-custom-view.md)
- [Share your custom search](./share-your-custom-search.md)
- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
