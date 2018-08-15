---
title: Quickstart: Use PHP to call the Bing Web Search API
description: Get information and code samples to help you quickly get started using the Bing Web Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: v-jerkin
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: article
ms.date: 9/18/2017
ms.author: v-jerkin, erhopf
---

# Quickstart: Use PHP to call the Bing Web Search API  

Use this quickstart to make your first call to the Bing Web Search API and receive a JSON response in less than 10 minutes.  

[!INCLUDE [cognitive-services-bing-web-search-quickstart-signup](../../includes/cognitive-services-bing-web-search-quickstart-signup.md)]

## Prerequisites

* [PHP 5.6.x](http://php.net/downloads.php) or later  

## Make a call to the Bing Web Search API  

To run this application, follow these steps.

1. Make sure secure HTTP support is enabled in your `php.ini` as described in the code comment. On Windows, this file is in `C:\windows`.  
2. Create a new PHP project in your favorite IDE or editor.  
3. Copy this sample code into your project:  
    ```php
    <?php

    // NOTE: Be sure to uncomment the following line in your php.ini file.
    // ;extension=php_openssl.dll

    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace the accessKey string value with your valid access key.
    $accessKey = 'enter key here';

    // Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
    // search APIs.  In the future, regional endpoints may be available.  If you
    // encounter unexpected authorization errors, double-check this value against
    // the endpoint for your Bing Web search instance in your Azure dashboard.
    $endpoint = 'https://api.cognitive.microsoft.com/bing/v7.0/search';

    $term = 'Microsoft Cognitive Services';

    function BingWebSearch ($url, $key, $query) {
        // Prepare HTTP request
        // NOTE: Use the key 'http' even if you are making an HTTPS request. See:
        // http://php.net/manual/en/function.stream-context-create.php
        $headers = "Ocp-Apim-Subscription-Key: $key\r\n";
        $options = array ('http' => array (
                              'header' => $headers,
                               'method' => 'GET'));

        // Perform the Web request and get the JSON response
        $context = stream_context_create($options);
        $result = file_get_contents($url . "?q=" . urlencode($query), false, $context);

        // Extract Bing HTTP headers
        $headers = array();
        foreach ($http_response_header as $k => $v) {
            $h = explode(":", $v, 2);
            if (isset($h[1]))
                if (preg_match("/^BingAPIs-/", $h[0]) || preg_match("/^X-MSEdge-/", $h[0]))
                    $headers[trim($h[0])] = trim($h[1]);
        }

        return array($headers, $result);
    }

    if (strlen($accessKey) == 32) {

        print "Searching the Web for: " . $term . "\n";

        list($headers, $json) = BingWebSearch($endpoint, $accessKey, $term);

        print "\nRelevant Headers:\n\n";
        foreach ($headers as $k => $v) {
            print $k . ": " . $v . "\n";
        }

        print "\nJSON Response:\n\n";
        echo json_encode(json_decode($json), JSON_PRETTY_PRINT);

    } else {

        print("Invalid Bing Search API subscription key!\n");
        print("Please paste yours into the source code.\n");

    }
    ?>
    ```  
4. Replace the `accessKey` value with an access key valid for your subscription.  
5. Run the program. For example: `php your_program.php`.  

## Sample response

Responses from the Bing Web Search API are returned as JSON. This sample response has been truncated to show a single result.  

```json
{
  "_type": "SearchResponse",
  "queryContext": {
    "originalQuery": "Microsoft Cognitive Services"
  },
  "webPages": {
    "webSearchUrl": "https://www.bing.com/search?q=Microsoft+cognitive+services",
    "totalEstimatedMatches": 22300000,
    "value": [
      {
        "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0",
        "name": "Microsoft Cognitive Services",
        "url": "https://www.microsoft.com/cognitive-services",
        "displayUrl": "https://www.microsoft.com/cognitive-services",
        "snippet": "Knock down barriers between you and your ideas. Enable natural and contextual interaction with tools that augment users' experiences via the power of machine-based AI. Plug them in and bring your ideas to life.",
        "deepLinks": [
          {
            "name": "Face API",
            "url": "https://azure.microsoft.com/services/cognitive-services/face/",
            "snippet": "Add facial recognition to your applications to detect, identify, and verify faces using a Face API from Microsoft Azure. ... Cognitive Services; Face API;"
          },
          {
            "name": "Text Analytics",
            "url": "https://azure.microsoft.com/services/cognitive-services/text-analytics/",
            "snippet": "Cognitive Services; Text Analytics API; Text Analytics API . Detect sentiment, ... you agree that Microsoft may store it and use it to improve Microsoft services, ..."
          },
          {
            "name": "Computer Vision API",
            "url": "https://azure.microsoft.com/services/cognitive-services/computer-vision/",
            "snippet": "Extract the data you need from images using optical character recognition and image analytics with Computer Vision APIs from Microsoft Azure."
          },
          {
            "name": "Emotion",
            "url": "https://www.microsoft.com/cognitive-services/en-us/emotion-api",
            "snippet": "Cognitive Services Emotion API - microsoft.com"
          },
          {
            "name": "Bing Speech API",
            "url": "https://azure.microsoft.com/services/cognitive-services/speech/",
            "snippet": "Add speech recognition to your applications, including text to speech, with a speech API from Microsoft Azure. ... Cognitive Services; Bing Speech API;"
          },
          {
            "name": "Get Started for Free",
            "url": "https://azure.microsoft.com/services/cognitive-services/",
            "snippet": "Add vision, speech, language, and knowledge capabilities to your applications using intelligence APIs and SDKs from Cognitive Services."
          }
        ]
      }
    ]
  },
  "relatedSearches": {
    "id": "https://api.cognitive.microsoft.com/api/v7/#RelatedSearches",
    "value": [
      {
        "text": "microsoft bot framework",
        "displayText": "microsoft bot framework",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+bot+framework"
      },
      {
        "text": "microsoft cognitive services youtube",
        "displayText": "microsoft cognitive services youtube",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+youtube"
      },
      {
        "text": "microsoft cognitive services search api",
        "displayText": "microsoft cognitive services search api",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+search+api"
      },
      {
        "text": "microsoft cognitive services news",
        "displayText": "microsoft cognitive services news",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+news"
      },
      {
        "text": "ms cognitive service",
        "displayText": "ms cognitive service",
        "webSearchUrl": "https://www.bing.com/search?q=ms+cognitive+service"
      },
      {
        "text": "microsoft cognitive services text analytics",
        "displayText": "microsoft cognitive services text analytics",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+text+analytics"
      },
      {
        "text": "microsoft cognitive services toolkit",
        "displayText": "microsoft cognitive services toolkit",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+toolkit"
      },
      {
        "text": "microsoft cognitive services api",
        "displayText": "microsoft cognitive services api",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+api"
      }
    ]
  },
  "rankingResponse": {
    "mainline": {
      "items": [
        {
          "answerType": "WebPages",
          "resultIndex": 0,
          "value": {
            "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0"
          }
        }
      ]
    },
    "sidebar": {
      "items": [
        {
          "answerType": "RelatedSearches",
          "value": {
            "id": "https://api.cognitive.microsoft.com/api/v7/#RelatedSearches"
          }
        }
      ]
    }
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Web search single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [cognitive-services-bing-web-search-quickstart-see-also](../../../includes/cognitive-services-bing-web-search-quickstart-see-also.md)]
