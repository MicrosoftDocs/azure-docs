---
title: "Quickstart: Search for images using the Bing Image Search REST API and PHP"
titleSuffix: Azure AI services
description: Use this quickstart to send image search requests to the Bing Image Search REST API using PHP, and receive JSON responses.
services: cognitive-services
documentationcenter: ''
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-image-search
ms.topic: quickstart
ms.date: 05/08/2020
ms.author: aahi
ms.devlang: php
ms.custom: seodec2018, mode-api
---
# Quickstart: Search for images using the Bing Image Search REST API and PHP

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Image Search API and receive a JSON response. The simple application in this article sends a search query and displays the raw results.

Although this application is written in PHP, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON.

## Prerequisites

* [PHP 5.6.x or later](https://php.net/downloads.php)

For more information, see [Azure AI services pricing - Bing Search API](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/).

## Create and initialize the application

To run this application, follow these steps:

1. Make sure secure HTTP support is enabled in your `php.ini` file. For Windows, this file is located in *C:\windows*.
2. Create a new PHP project in your favorite IDE or editor.
3. Define the API endpoint, your subscription key, and search term. The endpoint can be the global endpoint in the following code, or the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

    ```php
    $endpoint = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search';
    // Replace the accessKey string value with your valid access key.
    $accessKey = 'enter key here';
    $term = 'tropical ocean';
    ```

## Construct and perform an HTTP request

1. Use the variables from the last step to prepare an HTTP request to the Image Search API.

    ```php
    $headers = "Ocp-Apim-Subscription-Key: $key\r\n";
    $options = array ( 'http' => array (
                            'header' => $headers,
                            'method' => 'GET' ));
    ```

2. Send the web request and get the JSON response.

    ```php
    $context = stream_context_create($options);
    $result = file_get_contents($url . "?q=" . urlencode($query), false, $context);
    ```

## Process and print the JSON

Process and print the returned JSON response.

```php
$headers = array();
    foreach ($http_response_header as $k => $v) {
        $h = explode(":", $v, 2);
        if (isset($h[1]))
            if (preg_match("/^BingAPIs-/", $h[0]) || preg_match("/^X-MSEdge-/", $h[0]))
                $headers[trim($h[0])] = trim($h[1]);
    }
    return array($headers, $result);
```

## Example JSON response

Responses from the Bing Image Search API are returned as JSON. This sample response has been truncated to show a single result.

```json
{
"_type":"Images",
"instrumentation":{
    "_type":"ResponseInstrumentation"
},
"readLink":"images\/search?q=tropical ocean",
"webSearchUrl":"https:\/\/www.bing.com\/images\/search?q=tropical ocean&FORM=OIIARP",
"totalEstimatedMatches":842,
"nextOffset":47,
"value":[
    {
        "webSearchUrl":"https:\/\/www.bing.com\/images\/search?view=detailv2&FORM=OIIRPO&q=tropical+ocean&id=8607ACDACB243BDEA7E1EF78127DA931E680E3A5&simid=608027248313960152",
        "name":"My Life in the Ocean | The greatest WordPress.com site in ...",
        "thumbnailUrl":"https:\/\/tse3.mm.bing.net\/th?id=OIP.fmwSKKmKpmZtJiBDps1kLAHaEo&pid=Api",
        "datePublished":"2017-11-03T08:51:00.0000000Z",
        "contentUrl":"https:\/\/mylifeintheocean.files.wordpress.com\/2012\/11\/tropical-ocean-wallpaper-1920x12003.jpg",
        "hostPageUrl":"https:\/\/mylifeintheocean.wordpress.com\/",
        "contentSize":"897388 B",
        "encodingFormat":"jpeg",
        "hostPageDisplayUrl":"https:\/\/mylifeintheocean.wordpress.com",
        "width":1920,
        "height":1200,
        "thumbnail":{
        "width":474,
        "height":296
        },
        "imageInsightsToken":"ccid_fmwSKKmK*mid_8607ACDACB243BDEA7E1EF78127DA931E680E3A5*simid_608027248313960152*thid_OIP.fmwSKKmKpmZtJiBDps1kLAHaEo",
        "insightsMetadata":{
        "recipeSourcesCount":0,
        "bestRepresentativeQuery":{
            "text":"Tropical Beaches Desktop Wallpaper",
            "displayText":"Tropical Beaches Desktop Wallpaper",
            "webSearchUrl":"https:\/\/www.bing.com\/images\/search?q=Tropical+Beaches+Desktop+Wallpaper&id=8607ACDACB243BDEA7E1EF78127DA931E680E3A5&FORM=IDBQDM"
        },
        "pagesIncludingCount":115,
        "availableSizesCount":44
        },
        "imageId":"8607ACDACB243BDEA7E1EF78127DA931E680E3A5",
        "accentColor":"0050B2"
    }]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](../tutorial-bing-image-search-single-page-app.md)

## See also

* [What is the Bing Image Search API?](../overview.md)  
* [Try an online interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/) 
* [Pricing details for the Bing Search APIs](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/) 
* [Azure AI services documentation](../../../ai-services/index.yml)
* [Bing Image Search API reference](/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference)
