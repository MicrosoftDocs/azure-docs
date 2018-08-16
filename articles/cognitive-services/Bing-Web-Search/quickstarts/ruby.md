---
title: "Quickstart: Use Ruby to call the Bing Web Search API"
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

# Quickstart: Use Ruby to call the Bing Web Search API  

Use this quickstart to make your first call to the Bing Web Search API and receive a JSON response in less than 10 minutes.  

[!INCLUDE [quickstart-signup](../includes/quickstart-signup.md)]

## Prerequisites

* [Ruby 2.4 or later](https://www.ruby-lang.org/en/downloads/)  

## Make a call to the Bing Web Search API

To run this application, follow these steps.

1. Create a new Ruby project in your favorite IDE or editor.
2. Copy this sample code into your project:  
    ```ruby
    require 'net/https'
    require 'uri'
    require 'json'

    # **********************************************
    # *** Update or verify the following values. ***
    # **********************************************

    # Replace the accessKey string value with your valid access key.
    accessKey = "enter key here"

    # Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
    # search APIs.  In the future, regional endpoints may be available.  If you
    # encounter unexpected authorization errors, double-check this value against
    # the endpoint for your Bing Web search instance in your Azure dashboard.

    uri  = "https://api.cognitive.microsoft.com"
    path = "/bing/v7.0/search"

    term = "Microsoft Cognitive Services"

    if accessKey.length != 32 then
        puts "Invalid Bing Search API subscription key!"
        puts "Please paste yours into the source code."
        abort
    end

    uri = URI(uri + path + "?q=" + URI.escape(term))

    puts "Searching the Web for: " + term

    request = Net::HTTP::Get.new(uri)
    request['Ocp-Apim-Subscription-Key'] = accessKey

    response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
        http.request(request)
    end

    puts "\nRelevant Headers:\n\n"
    response.each_header do |key, value|
        # header names are coerced to lowercase
        if key.start_with?("bingapis-") or key.start_with?("x-msedge-") then
            puts key + ": " + value
        end
    end

    puts "\nJSON Response:\n\n"
    puts JSON::pretty_generate(JSON(response.body))
    ```
3. Replace `accessKey` with an access key for your subscription.
4. Run the program. For example: `ruby your_program.rb`.

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

[!INCLUDE [quickstart-see-also](../includes/quickstart-see-also.md)]
