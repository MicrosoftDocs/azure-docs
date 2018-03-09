---
title: Call and response - Ruby Quickstart for Azure Cognitive Services, Bing Image Search API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Bing Image Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: jerrykindall

ms.service: cognitive-services
ms.technology: bing-search
ms.topic: article
ms.date: 9/21/2017
ms.author: v-jerkin

---
# Call and response: your first Bing Image Search query in Ruby

The Bing Image Search API provides an experience similar to Bing.com/Images by letting you send a user search query to Bing and get back a list of relevant images.

This article includes a simple console application that performs a Bing Image Search API query and displays the returned raw search results, which are in JSON format. While this application is written in Ruby, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON. 

## Prerequisites

You will need [Ruby 2.4 or later](https://www.ruby-lang.org/en/downloads/) to run the example code.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Running the application

To run this application, follow these steps.

1. Create a new Ruby project in your favorite IDE or editor.
2. Add the provided code.
3. Replace the `accessKey` value with an access key valid for your subscription.
4. Run the program.

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
# the endpoint for your Bing Search instance in your Azure dashboard.

uri  = "https://api.cognitive.microsoft.com"
path = "/bing/v7.0/images/search"

term = "puppies"

if accessKey.length != 32 then
    puts "Invalid Bing Search API subscription key!"
    puts "Please paste yours into the source code."
    abort
end

uri = URI(uri + path + "?q=" + URI.escape(term))

puts "Searching images for: " + term

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

## JSON response

A sample response follows. To limit the length of the JSON, only a single result is shown, and other parts of the response have been truncated. 

```json
{
  "_type": "Images",
  "instrumentation": {},
  "readLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=puppies",
  "webSearchUrl": "https://www.bing.com/images/search?q=puppies&FORM=OIIARP",
  "totalEstimatedMatches": 955,
  "nextOffset": 1,
  "value": [
    {
      "webSearchUrl": "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&q=puppies&id=F68CC526226E163FD1EA659747ADCB8F9FA3CD96&simid=608055280844016271",
      "name": "So cute - Puppies Wallpaper (14749028) - Fanpop",
      "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OIP.jHrihoDNkXGS1t5e89jNfwEsDh&pid=Api",
      "datePublished": "2014-02-01T21:55:00.0000000Z",
      "contentUrl": "http://images4.fanpop.com/image/photos/14700000/So-cute-puppies-14749028-1600-1200.jpg",
      "hostPageUrl": "http://www.fanpop.com/clubs/puppies/images/14749028/title/cute-wallpaper",
      "contentSize": "394455 B",
      "encodingFormat": "jpeg",
      "hostPageDisplayUrl": "www.fanpop.com/clubs/puppies/images/14749028/title/cute-wallpaper",
      "width": 1600,
      "height": 1200,
      "thumbnail": {
        "width": 300,
        "height": 225
      },
      "imageInsightsToken": "ccid_jHrihoDN*mid_F68CC526226E163FD1EA659747ADCB8F9FA3CD96*simid_608055280844016271*thid_OIP.jHrihoDNkXGS1t5e89jNfwEsDh",
      "insightsMetadata": {
        "recipeSourcesCount": 0
      },
      "imageId": "F68CC526226E163FD1EA659747ADCB8F9FA3CD96",
      "accentColor": "8D613E"
    }
  ],
  "queryExpansions": [
    {
      "text": "Shih Tzu Puppies",
      "displayText": "Shih Tzu",
      "webSearchUrl": "https://www.bing.com/images/search?q=Shih+Tzu+Puppies&tq=%7b%22pq%22%3a%22puppies%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22puppies%22%2c%22pv%22%3a%22puppies%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Shih+Tzu%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRPATC",
      "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=Shih+Tzu+Puppies&tq=%7b%22pq%22%3a%22puppies%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22puppies%22%2c%22pv%22%3a%22puppies%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Shih+Tzu%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
      "thumbnail": {
        "thumbnailUrl": "https://tse2.mm.bing.net/th?q=Shih+Tzu+Puppies&pid=Api&mkt=en-US&adlt=moderate&t=1"
      }
    }
  ],
  "pivotSuggestions": [
    {
      "pivot": "puppies",
      "suggestions": [
        {
          "text": "Dog",
          "displayText": "Dog",
          "webSearchUrl": "https://www.bing.com/images/search?q=Dog&tq=%7b%22pq%22%3a%22puppies%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22puppies%22%2c%22pv%22%3a%22puppies%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dog%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d&FORM=IRQBPS",
          "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=Dog&tq=%7b%22pq%22%3a%22puppies%22%2c%22qs%22%3a%5b%7b%22cv%22%3a%22puppies%22%2c%22pv%22%3a%22puppies%22%2c%22hps%22%3atrue%2c%22iqp%22%3afalse%7d%2c%7b%22cv%22%3a%22Dog%22%2c%22pv%22%3a%22%22%2c%22hps%22%3afalse%2c%22iqp%22%3atrue%7d%5d%7d",
          "thumbnail": {
            "thumbnailUrl": "https://tse1.mm.bing.net/th?q=Dog&pid=Api&mkt=en-US&adlt=moderate&t=1"
          }
        }
      ]
    }
  ],
  "similarTerms": [
    {
      "text": "cute",
      "displayText": "cute",
      "webSearchUrl": "https://www.bing.com/images/search?q=cute&FORM=IDINTS",
      "thumbnail": {
        "url": "https://tse2.mm.bing.net/th?q=cute&pid=Api&mkt=en-US&adlt=moderate"
      }
    }
  ],
  "relatedSearches": [
    {
      "text": "Cute Puppies",
      "displayText": "Cute Puppies",
      "webSearchUrl": "https://www.bing.com/images/search?q=Cute+Puppies&FORM=IRPATC",
      "searchLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=Cute+Puppies",
      "thumbnail": {
        "thumbnailUrl": "https://tse4.mm.bing.net/th?q=Cute+Puppies&pid=Api&mkt=en-US&adlt=moderate&t=1"
      }
    }
  ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](../tutorial-bing-image-search-single-page-app.md)

## See also 

[Bing Image Search overview](../overview.md)  
[Try it](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-image-search-api)  
[Bing Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference)
