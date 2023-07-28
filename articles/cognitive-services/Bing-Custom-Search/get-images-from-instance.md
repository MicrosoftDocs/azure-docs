---
title: Get images from your custom view - Bing Custom Search
titleSuffix: Azure AI services
description: High-level overview about using Bing Custom Search to get images from your custom view of the Web.
services: cognitive-services

manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: conceptual
ms.date: 09/10/2018

---

# Get images from your custom view

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

Bing Custom Images Search lets you enrich your custom search experience with images. Similar to web results, custom search supports searching for images in your instance's list of websites. You can get the images using the Bing Custom Images Search API or through the Hosted UI feature. Using the Hosted UI feature is simple to use and recommended for getting your search experience up and running in short order.  For information about configuring your Hosted UI to include images, see [Configure your hosted UI experience](hosted-ui.md).

If you want more control over displaying the search results, you can use the Bing Custom Images Search API. Because calling the API is similar to calling the Bing Image Search API, checkout [Bing Image Search](../bing-image-search/overview.md) for examples calling the API. But before you do that, familiarize yourself with the [Custom Images Search API reference](/rest/api/cognitiveservices-bingsearch/bing-custom-images-api-v7-reference) content. The main differences are the supported query parameters (you must include the customConfig query parameter) and the endpoint you send requests to.

<!--
## Next steps

[Call your custom view](search-your-custom-view.md)
-->
