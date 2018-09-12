---
title: "Quickstart: Analyze a remote image - REST, Ruby - Computer Vision"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you analyze an image using Computer Vision with Ruby in Cognitive Services.
services: cognitive-services
author: noellelacharite
manager: nolachar
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 08/28/2018
ms.author: v-deken
---
# Quickstart: Analyze a remote image - REST, Ruby - Computer Vision

In this quickstart, you analyze an image to extract visual features using Computer Vision.

## Prerequisites

To use Computer Vision, you need a subscription key; see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Analyze Image request

With the [Analyze Image method](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa), you can extract visual features based on image content. You can upload an image or specify an image URL and choose which features to return, including:

* A detailed list of tags related to the image content.
* A description of image content in a complete sentence.
* The coordinates, gender, and age of any faces contained in the image.
* The ImageType (clip art or a line drawing).
* The dominant color, the accent color, or whether an image is black & white.
* The category defined in this [taxonomy](../Category-Taxonomy.md).
* Does the image contain adult or sexually suggestive content?

To run the sample, do the following steps:

1. Copy the following code into an editor.
1. Replace `<Subscription Key>` with your valid subscription key.
1. Change the `uri` value to the location where you obtained your subscription keys, if necessary.
1. Optionally, change the response language (`'language' => 'en'`).
1. Optionally, change the image (`{\"url\":\"...`) to analyze.
1. Save the file with an `.rb` extension.
1. Open the Ruby Command Prompt and run the file, for example: `ruby myfile.rb`.

```ruby
require 'net/http'

# You must use the same location in your REST call as you used to get your
# subscription keys. For example, if you got your subscription keys from westus,
# replace "westcentralus" in the URL below with "westus".
uri = URI('https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze')
uri.query = URI.encode_www_form({
    # Request parameters
    'visualFeatures' => 'Categories, Description',
    'details' => 'Landmarks',
    'language' => 'en'
})

request = Net::HTTP::Post.new(uri.request_uri)

# Request headers
# Replace <Subscription Key> with your valid subscription key.
request['Ocp-Apim-Subscription-Key'] = '<Subscription Key>'
request['Content-Type'] = 'application/json'

request.body =
    "{\"url\": \"http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg\"}"

response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
    http.request(request)
end

puts response.body
```

## Analyze Image response

A successful response is returned in JSON, for example:

```json
{
  "categories": [
    {
      "name": "abstract_",
      "score": 0.00390625
    },
    {
      "name": "people_",
      "score": 0.83984375,
      "detail": {
        "celebrities": [
          {
            "name": "Satya Nadella",
            "faceRectangle": {
              "left": 597,
              "top": 162,
              "width": 248,
              "height": 248
            },
            "confidence": 0.999028444
          }
        ]
      }
    }
  ],
  "adult": {
    "isAdultContent": false,
    "isRacyContent": false,
    "adultScore": 0.0934349000453949,
    "racyScore": 0.068613491952419281
  },
  "tags": [
    {
      "name": "person",
      "confidence": 0.98979085683822632
    },
    {
      "name": "man",
      "confidence": 0.94493889808654785
    },
    {
      "name": "outdoor",
      "confidence": 0.938492476940155
    },
    {
      "name": "window",
      "confidence": 0.89513939619064331
    }
  ],
  "description": {
    "tags": [
      "person",
      "man",
      "outdoor",
      "window",
      "glasses"
    ],
    "captions": [
      {
        "text": "Satya Nadella sitting on a bench",
        "confidence": 0.48293603002174407
      }
    ]
  },
  "requestId": "0dbec5ad-a3d3-4f7e-96b4-dfd57efe967d",
  "metadata": {
    "width": 1500,
    "height": 1000,
    "format": "Jpeg"
  },
  "faces": [
    {
      "age": 44,
      "gender": "Male",
      "faceRectangle": {
        "left": 593,
        "top": 160,
        "width": 250,
        "height": 250
      }
    }
  ],
  "color": {
    "dominantColorForeground": "Brown",
    "dominantColorBackground": "Brown",
    "dominantColors": [
      "Brown",
      "Black"
    ],
    "accentColor": "873B59",
    "isBWImg": false
  },
  "imageType": {
    "clipArtType": 0,
    "lineDrawingType": 0
  }
}

```

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text. To rapidly experiment with the Computer Vision APIs, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa/console).

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
