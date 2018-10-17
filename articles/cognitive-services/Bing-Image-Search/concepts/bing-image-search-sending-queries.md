---
title: Send image queries - Bing Image Search API
titleSuffix: Azure Cognitive Services
description: Learn about customizing search queries sent to the Bing Image Search API.
services: cognitive-services
author: aahill
manager: cgronlun
ms.assetid: C2862E98-8BCC-423B-9C4A-AC79A287BE38
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: conceptual
ms.date: 8/8/2018
ms.author: aahi
---

# Send queries to the Bing Image Search API

The Bing Image Search API provides an experience similar to Bing.com/Images. You can use it to send a search query to Bing and get back a list of relevant images.

## Use and suggest search terms

After a search term is entered, URL-encode the term before you set the [**q**](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#query) query parameter. For example, if you enter *sailing dinghies*, set `q` to `sailing+dinghies` or `sailing%20dinghies`.

If your app has a search box where search terms are entered, you can use the [Bing Autosuggest API](../../bing-autosuggest/get-suggested-search-terms.md) to improve the experience. The API can display suggested search terms in real time. The API returns suggested query strings based on partial search terms and Cognitive Services.

## Pivot the query

If Bing can segment the original search query, the returned [Images](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#images) object contains `pivotSuggestions`. Pivot suggestions can be displayed as optional search terms to the user. For example, if the original query was *Microsoft Surface*, Bing might segment the query into *Microsoft* and *Surface* and provide suggested pivots for each. These suggestions can be displayed as optional query terms to the user.

The following example shows the pivot suggestions for *Microsoft Surface*:  

```json
{
    "_type": "Images",
    "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=microsoft%20surface&FORM=OIIARP",
    "totalEstimatedMatches": 1000,
    "value": [...],
    "queryExpansions": [...],
    "pivotSuggestions": [{
        "pivot": "microsoft",
        "suggestions": [{
            "text": "Contoso Surface",
            "displayText": "Contoso",
            "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=OtterBox+Surface&FORM=IRQBPS",
            "searchLink": "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?q=Contoso...",
                    "searchLink": "https:\/\/api.cognitive.microsoft.com\/api...",
            "thumbnail": {
                "thumbnailUrl": "https:\/\/tse3.mm.bing.net\/th?q=Contoso+Surface..."
            }
        },
        {
            "text": "Adatum Surface",
            "displayText": "Adatum",
            "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=Adatum+Surface&FORM=IRQBPS",
            "searchLink": "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?q=...",
            "thumbnail": {
                "thumbnailUrl": "https:\/\/tse3.mm.bing.net\/th?q=Adatum+Surface&pid=Ap..."
            }
        },
        ...
        ]
    },
    {
        "pivot": "surface",
        "suggestions": [{
            "text": "Microsoft Surface4",
            "displayText": "Surface4",
            "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=Microsoft+Surface...",
            "searchLink": "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?...",
            "thumbnail": {
                "thumbnailUrl": "https:\/\/tse4.mm.bing.net\/th?q=Microsoft..."
            }
        },
        {
            "text": "Microsoft Tablet",
            "displayText": "Tablet",
            "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=Microsoft+Tablet&FORM=IRQBPS",
            "searchLink": "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?...",
            "thumbnail": {
                "thumbnailUrl": "https:\/\/tse3.mm.bing.net\/th?q=Microsoft+Tablet..."
            }
        },
        ...
    ],
    "nextOffsetAddCount": 0
}
```

The `pivotSuggestions` field contains the list of segments (pivots) that the original query was broken into. For each pivot, the response contains a list of [Query](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#query_obj) objects that contain suggested queries. The `text` field contains the suggested query. The `displayText` field contains the term that replaces the pivot in the original query. An example is Release Date of Surface.

If the pivot query string is what the user is looking for, use the `text` and `thumbnail` fields to display the pivot query strings. Make the thumbnail and text clickable by using the `webSearchUrl` URL or the `searchLink` URL. Use `webSearchUrl` to send the user to the Bing search results. If you provide your own results page, use `searchLink`.

<!-- Need a sanitized version of the image
The following shows an example of the pivot queries.

![Pivot suggestions](./media/cognitive-services-bing-images-api/bing-image-pivotsuggestion.GIF)
-->

## Expand the query

If Bing can expand the query to narrow the original search, the [Images](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#images) object contains the `queryExpansions` field. For example, if the query was *Microsoft Surface*, the expanded queries might be:
- Microsoft Surface **Pro 3**.
- Microsoft Surface **RT**.
- Microsoft Surface **Phone**.
- Microsoft Surface **Hub**.

The following example shows the expanded queries for *Microsoft Surface*.

```json
{
    "_type": "Images",
    "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=microsoft%20surface...",
    "totalEstimatedMatches": 1000,
    "value": [...],
    "queryExpansions":  [{
        "text": "Microsoft Surface Pro 3",
        "displayText": "Pro 3",
        "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=Microsoft+Surface+Pro+3...",
        "searchLink": "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?q=Microsoft...",
        "thumbnail": {
            "thumbnailUrl": "https:\/\/tse4.mm.bing.net\/th?q=Microsoft+Surface+Pro+3..."
        }
    },
    {
        "text": "Microsoft Surface RT",
        "displayText": "RT",
        "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=Microsoft+Surface+RT...",
        "searchLink": "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?q=...",
        "thumbnail": {
            "thumbnailUrl": "https:\/\/tse4.mm.bing.net\/th?q=Microsoft+Surface+RT..."
        }
    },
    {
        "text": "Microsoft Surface Phone",
        "displayText": "Phone",
        "webSearchUrl": "https:\/\/www.bing.com\/images\/search?q=Microsoft+Surface+Phone",
        "searchLink": "https:\/\/api.cognitive.microsoft.com\/api\/v7\/images\/search?q=...",
        "thumbnail": {
            "thumbnailUrl": "https:\/\/tse4.mm.bing.net\/th?q=Microsoft+Surface+Phone..."
        }
    }],
    "pivotSuggestions": [...],
    "nextOffsetAddCount": 0
}
```

The `queryExpansions` field contains a list of [Query](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference#query_obj) objects. The `text` field contains the expanded query. The `displayText` field contains the expansion term. If the expanded query string is what the user is looking for, use the `text` and `thumbnail` fields to display the expanded query strings. Make the thumbnail and text clickable by using the `webSearchUrl` URL or the `searchLink` URL. Use `webSearchUrl` to send the user to the Bing search results. if you provide your own results page, use `searchLink`.

<!-- Removing until we can replace with a sanitized image.
The following shows an example Bing implementation that uses expanded queries. If the user clicks the Microsoft Surface Pro 3 link, they're taken to the Bing search results page, which shows them images of the Pro 3.

![Query expansion suggestions](./media/cognitive-services-bing-images-api/bing-image-queryexpansion.GIF)
-->


## Throttling requests

[!INCLUDE [cognitive-services-bing-throttling-requests](../../../../includes/cognitive-services-bing-throttling-requests.md)]

## Next steps

If you haven't tried the Bing Image Search API before, try a [quickstart](../quickstarts/csharp.md). If you're looking for something more complex, try the tutorial to create a [single-page web app](../tutorial-bing-image-search-single-page-app.md).
