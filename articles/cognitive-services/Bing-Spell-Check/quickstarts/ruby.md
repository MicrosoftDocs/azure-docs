---
title: "Quickstart: Check spelling with the Bing Spell Check REST API and Ruby"
titlesuffix: Azure Cognitive Services
description: Get started using the Bing Spell Check REST API to check spelling and grammar.
services: cognitive-services
author: aahill
manager: cgronlun

ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 09/14/2017
ms.author: aahi
---
# Quickstart: Check spelling with the Bing Spell Check REST API and Ruby

Use this quickstart to make your first call to the Bing Spell Check REST API using Ruby. This simple application sends a request to the API and returns a list of words it didn't recognize, followed by suggested corrections. While this application is written in Ruby, the API is a RESTful Web service compatible with most programming languages.

## Prerequisites

* [Ruby 2.4](https://www.ruby-lang.org/en/downloads/) or later.

## Get Spell Check results

1. Create a new Ruby project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```ruby
require 'net/http'
require 'uri'
require 'json'

uri = 'https://api.cognitive.microsoft.com'
path = '/bing/v7.0/spellcheck?'
params = 'mkt=en-us&mode=proof'

uri = URI(uri + path + params)
uri.query = URI.encode_www_form({
    # Request parameters
	'text' => 'Hollo, wrld!'
})

# NOTE: Replace this example key with a valid subscription key.
key = 'ENTER KEY HERE'

# The headers in the following example 
# are optional but should be considered as required:
#
# X-MSEdge-ClientIP: 999.999.999.999  
# X-Search-Location: lat: +90.0000000000000;long: 00.0000000000000;re:100.000000000000
# X-MSEdge-ClientID: <Client ID from Previous Response Goes Here>
#
# See below for more information.

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = "application/x-www-form-urlencoded"

request['Ocp-Apim-Subscription-Key'] = key

response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
    http.request(request)
end

result = JSON.pretty_generate(JSON.parse(response.body))
puts result
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
> [Bing Spell Check tutorial](../tutorials/spellcheck.md)

## See also

- [What is the Bing Spell Check API](../overview.md)
- [Bing Spell Check API v7 Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference)
