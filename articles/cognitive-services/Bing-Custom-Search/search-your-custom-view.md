---
title: "Bing Custom Search: Search a custom view | Microsoft Docs"
description: Describes how to search a custom view of the web
services: cognitive-services
author: brapel
manager: ehansen
ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Call your custom search

Before making your first call to the Custom Search API to get search results for your instance, you need to get a Cognitive Services subscription key. To get a key for Custom Search API, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search).


## Try it out

After you've configured your custom search experience, you can test the configuration from within the Custom Search portal. 

1. Sign into [Custom Search](https://customsearch.ai).
2. Click a Custom Search instance from your list of instances.
3. Click the **Production** tab. 
4. Under the **Endpoints** tab, select an endpoint (for example, Web API). Your subscription determines which endpoints are available to try (see [pricing pages](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/) for subscription options). 
5. Specify the parameter values. 

The following are the possible parameters you can set (the actual list depends on the selected endpoint).

- **Query**: The search term to search for. Only available for Web, Image, Video, and Autosuggest endpoints.
- **Custom Configuration ID**: The configuration ID of the selected Custom Search instance. This field is read only.
- **Market**: The market where the results come from. Only available for Web, Image, Video, and Hosted UI endpoints.
- **Subscription Key**: The subscription key to test with. You may select a key from the dropdown list or enter one manually.
- **Safe Search**: A set of filter used to filter webpages for adult content. Only available for Web, Image, Video, and Hosted UI endpoints.
- **Language**: The language to use for user interface strings in Hosted UI. For example, if you enable images and videos, the **Image** and **Video** tabs in the hosted UI will use the specified language.
- **Count**: The number of search results to return in the response. Only available for Web, Image, and Video endpoints.
- **Offset**: The number of search results to return in the response. Only available for Web, Image, and Video endpoints.

After you've specified all required options, click **Call** to view the JSON response in the right pane. 

If you select the Hosted UI endpoint, you can test the search experience from the right pane.

## Next steps

- [Call your custom view with C#](./call-endpoint-csharp.md)
- [Call your custom view with Java](./call-endpoint-java.md)
- [Call your custom view with NodeJs](./call-endpoint-nodejs.md)
- [Call your custom view with Python](./call-endpoint-python.md)

- [Call your custom view with the C# SDK](./sdk-csharp-quick-start.md)