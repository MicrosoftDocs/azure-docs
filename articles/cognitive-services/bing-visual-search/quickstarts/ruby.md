---
title: "Quickstart: Get image insights using Bing Visual Search REST API and Ruby"
titleSuffix: Azure Cognitive Services
description: Learn how to upload an image to the Bing Visual Search API and get insights about it.
services: cognitive-services
author: mikedodaro
manager: rosh

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: quickstart
ms.date: 2/27/2019
ms.author: rosh
---

# Quickstart: Get image insights using the Bing Visual Search REST API and Ruby

This quickstart uses the Ruby programming language to call the Bing Visual Search API and display results. A Post request uploads an image to the API endpoint. The results include URLs and descriptive information about images similar to the uploaded image.

## Prerequisites

Here are a few things that you'll need before running this quickstart:

* [Ruby 2.4 or later](https://www.ruby-lang.org/en/downloads/)
* A subscription key

[!INCLUDE [bing-web-search-quickstart-signup](../../../../includes/bing-web-search-quickstart-signup.md)]

## Create a project and declare required modules

Create a new Ruby project in your IDE or editor. Then import `net/http`, `uri` , `json` to handle the JSON text of results. The `base64` library is used to encode the file name string. 

```
require 'net/https'
require 'uri'
require 'json'
require 'base64'

```

## Define variables

The following code assigns required variables. Confirm that the endpoint is correct and replace the `accessKey` value with a subscription key from your Azure account.  The `batchNumber` is a guid required for leading and trailing boundaries of the Post data.  The `fileName` variable identifies the image file for the Post.  The `if` block tests for valid subscription key.

```
accessKey = "ACCESS-KEY"
uri  = "https://api.cognitive.microsoft.com"
path = "/bing/v7.0/images/visualsearch"
batchNumber = "dc05c75a-6b5e-4059-b556-0b7c079819a5"
fileName = "red-dress.jpg"

if accessKey.length != 32 then
    puts "Invalid Bing Search API subscription key!"
    puts "Please paste yours into the source code."
    abort
end

```

## Build the form data for Post request

The image data to Post is enclosed by leading and trailing boundaries.  The following functions set the boundaries.

```
def BuildFormDataStart(batNum, fileName)
    startBoundary = "--batch_" + batNum
    return startBoundary + "\r\n" + "Content-Disposition: form-data; name=\"image\"; filename=" + "\"" + fileName + "\"" + "\r\n\r\n"	
end

def BuildFormDataEnd(batNum)
    return "\r\n\r\n" + "--batch_" + batNum + "--" + "\r\n"
end

```

Next construct the endpoint URI and an array to contain the Post body.  Use the previous function to load the start boundary into the array. Read the image file into the array. Then, read the end boundary into the array. 

```
uri = URI(uri + path)
print uri
print "\r\n\r\n"

post_body = []

post_body << BuildFormDataStart(batchNumber, fileName)

post_body << File.read(fileName) #Base64.encode64(File.read(fileName))

post_body << BuildFormDataEnd(batchNumber)

```

## Create the HTTP request

Set the subscription key header.  Create the request.  Then, assign the header and content type.  Join the Post body created previously to the request.

```
header = {'Ocp-Apim-Subscription-Key': accessKey}
request = Net::HTTP::Post.new(uri)  # , 'ImageKnowledge' => 'ImageKnowledge'

request['Ocp-Apim-Subscription-Key'] = accessKey
request.content_type = "multipart/form-data; boundary=batch_" + batchNumber  
request.body = post_body.join

```

## Send the request and get the response

Ruby gets the response with the following code.

```
response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
   http.request(request)
end

```

## Print the results

Print the headers of the repsons. Then use the JSON library to format output.

```
puts "\nRelevant Headers:\n\n"
response.each_header do |key, value|
    if key.start_with?("bingapis-") or key.start_with?("x-msedge-") then
        puts key + ": " + value
    end
end

puts "\nJSON Response:\n\n"
puts JSON::pretty_generate(JSON(response.body))

```

## Next steps

> [!div class="nextstepaction"]
> [Bing Visual Search overview](../overview.md)
> [Build a Custom Search web app](../tutorial-bing-visual-search-single-page-app.md)