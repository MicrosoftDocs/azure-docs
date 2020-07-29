---
title: "Quickstart: Check spelling with the REST API and Ruby - Bing Spell Check"
titleSuffix: Azure Cognitive Services
description: Get started using the Bing Spell Check REST API to check spelling and grammar with this quickstart.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 05/21/2020
ms.author: aahi
---
# Quickstart: Check spelling with the Bing Spell Check REST API and Ruby

Use this quickstart to make your first call to the Bing Spell Check REST API using Ruby. This simple application sends a request to the API and returns a list of suggested corrections. 

Although this application is written in Ruby, the API is a RESTful Web service compatible with most programming languages. The source code for this application is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/ruby/Search/BingSpellCheckv7.rb)

## Prerequisites

* [Ruby 2.4](https://www.ruby-lang.org/en/downloads/) or later.

[!INCLUDE [cognitive-services-bing-spell-check-signup-requirements](../../../../includes/cognitive-services-bing-spell-check-signup-requirements.md)]


## Create and initialize the application

1. Create a new Ruby file in your favorite editor or IDE, and add the following requirements: 

    ```ruby
    require 'net/http'
    require 'uri'
    require 'json'
    ```

2. Create variables for your subscription key, endpoint URI, and path. You can use the global endpoint in the following code, or use the [custom subdomain](../../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource. Create your request parameters:

   1. Assign your market code to the `mkt` parameter with the `=` operator. The market code is the code of the country/region you make the request from. 

   1. Add the `mode` parameter with the `&` operator, and then assign the spell-check mode. The mode can be either `proof` (catches most spelling/grammar errors) or `spell` (catches most spelling errors, but not as many grammar errors). 

    ```ruby
    key = 'ENTER YOUR KEY HERE'
    uri = 'https://api.cognitive.microsoft.com'
    path = '/bing/v7.0/spellcheck?'
    params = 'mkt=en-us&mode=proof'
    ```

## Send a spell check request

1. Create a URI from your host uri, path, and parameters string. Set its query to contain the text you want to spell check.

   ```ruby
   uri = URI(uri + path + params)
   uri.query = URI.encode_www_form({
      # Request parameters
   'text' => 'Hollo, wrld!'
   })
   ```

2. Create a request using the URI constructed previously. Add your key to the `Ocp-Apim-Subscription-Key` header.

    ```ruby
    request = Net::HTTP::Post.new(uri)
    request['Content-Type'] = "application/x-www-form-urlencoded"
    request['Ocp-Apim-Subscription-Key'] = key
    ```

3. Send the request.

    ```ruby
    response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
        http.request(request)
    end
    ```

4. Get the JSON response, and print it to the console. 

    ```ruby
    result = JSON.pretty_generate(JSON.parse(response.body))
    puts result
    ```

## Run the application

Build and run your project. If you're using the command line, use the following command to run the application:

   ```bash
   ruby <FILE_NAME>.rb
   ```

## Example JSON response

A successful response is returned in JSON, as shown in the following example: 

```json
{
   "_type": "SpellCheck",
   "flaggedTokens": [
      {
         "offset": 0,
         "token": "Hollo",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "Hello",
               "score": 0.9115257530801
            },
            {
               "suggestion": "Hollow",
               "score": 0.858039839213461
            },
            {
               "suggestion": "Hallo",
               "score": 0.597385084464481
            }
         ]
      },
      {
         "offset": 7,
         "token": "wrld",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "world",
               "score": 0.9115257530801
            }
         ]
      }
   ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](../tutorials/spellcheck.md)

- [What is the Bing Spell Check API?](../overview.md)
- [Bing Spell Check API v7 reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-spell-check-api-v7-reference)
