---
title: Search a custom view - Bing Custom Search
titlesuffix: Azure Cognitive Services
description: Describes how to search a custom view of the web.
services: cognitive-services
author: brapel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: conceptual
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
4. Under the **Endpoints** tab, select an endpoint (for example, Web API). Your subscription determines which endpoints are shown (see [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/) for subscription options). 
5. Specify the parameter values. 

    The following are the possible parameters you can set (the actual list depends on the selected endpoint). For additional information about these parameters, see [Custom Search API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#query-parameters) reference.

    - **Query**: The search term to search for. Only available for Web, Image, Video, and Autosuggest endpoints.
    - **Custom Configuration ID**: The configuration ID of the selected Custom Search instance. This field is read only.
    - **Market**: The market where the results come from. Only available for Web, Image, Video, and Hosted UI endpoints.
    - **Subscription Key**: The subscription key to test with. You may select a key from the dropdown list or enter one manually.  
      
    Clicking **Additional Parameters** reveals the following parameters:  
      
    - **Safe Search**: A filter used to filter webpages for adult content. Available only for Web, Image, Video, and Hosted UI endpoints.
    - **User Interface Language**: The language used for user interface strings. For example, if you enable images and videos in Hosted UI, the **Image** and **Video** tabs use the specified language.
    - **Count**: The number of search results to return in the response. Available only for Web, Image, and Video endpoints.
    - **Offset**: The number of search results to skip before returning results. Available only for Web, Image, and Video endpoints.

6. After you've specified all required options, click **Call** to view the JSON response in the right pane. 

If you select the Hosted UI endpoint, you can test the search experience in the bottom pane.

## Next steps

- [Call your custom view with C#](./call-endpoint-csharp.md)
- [Call your custom view with Java](./call-endpoint-java.md)
- [Call your custom view with NodeJs](./call-endpoint-nodejs.md)
- [Call your custom view with Python](./call-endpoint-python.md)

- [Call your custom view with the C# SDK](./sdk-csharp-quick-start.md)