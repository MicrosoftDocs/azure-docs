---
title: 'Quickstart: Using Ruby to call the Text Analytics API'
titleSuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Text Analytics API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: raymondl
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 04/17/2019
ms.author: tasharm
---
# Quickstart: Using Ruby to call the Text Analytics Cognitive Service
<a name="HOLTop"></a>


Use this quickstart to begin analyzing language with the Text Analytics APIs with Ruby.

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

## Prerequisites

[!INCLUDE [cognitive-services-text-analytics-signup-requirements](../../../../includes/cognitive-services-text-analytics-signup-requirements.md)]

You must also have the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that was generated for you during sign up. 

<a name="TextAnalyticsClient"></a>

## Create a Text analytics client
1. Create a new ruby project.
1. Add a new file `TextAnalyticsClient.rb`
1. Add the following code to the file.
    ```ruby
    require 'net/https'
    require 'uri'
    require 'json'    

    class TextAnalyticsClient
      @@accessKey
      @@uri
      def initialize(accessKey, uri)
        @@accessKey = accessKey
        @@uri = uri
      end
    
      def SendRequest(path, documents)
        uri = URI(@@uri + path)
    
        puts 'Please wait a moment for the results to appear.'
    
        request = Net::HTTP::Post.new(uri)
        request['Content-Type'] = "application/json"
        request['Ocp-Apim-Subscription-Key'] = @@accessKey
        request.body = documents.to_json
    
        response = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https') do |http|
            http.request (request)
        end
    
        puts JSON::pretty_generate (JSON (response.body))
      end
    end
    ```
1. Create new `TextAnalyticsClient` object.
    ```ruby
    # Replace the accessKey string value with your valid access key.
    accessKey = 'enter key here'
    
    # Replace or verify the region.
    #
    # You must use the same region in your REST API call as you used to obtain your access keys.
    # For example, if you obtained your access keys from the westus region, replace 
    # "westcentralus" in the URI below with "westus".
    #
    uri = String.new("https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.1/")
    textAnalyticsClient = TextAnalyticsClient.new(accessKey, uri)
    ```

<a name="SentimentAnalysis"></a>

## Sentiment analysis

The Sentiment Analysis API detects the sentiment of a set of text records, using the [Sentiment method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9). The following example scores two documents, one in English and another in Spanish.

1. Create a new function called `Analyze_Sentiment` which takes text analytics client created above as parameter.

    ```ruby
    def Analyze_Sentiment(textAnalyticsClient)
      documents = { 'documents': [
        { 'id' => '1', 'language' => 'en', 'text' => 'I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable.' },
        { 'id' => '2', 'language' => 'es', 'text' => 'Este ha sido un dia terrible, llegué tarde al trabajo debido a un accidente automobilistico.' }
      ]}
      path = 'sentiment'
      textAnalyticsClient.SendRequest(path, documents)
    end
    ```
2. Call the function `Analyze_Sentiment`
    ```ruby
    Analyze_Sentiment(textAnalyticsClient)
    ```

### Output
A successful response is returned in JSON, as shown in the following example: 

    ```json
    {
       "documents": [
          {
             "score": 0.99984133243560791,
             "id": "1"
          },
          {
             "score": 0.024017512798309326,
             "id": "2"
          },
       ],
       "errors": [   ]
    }
    ```

<a name="LanguageDetection"></a>

## Language detection

The Language Detection API detects the language of a text document, using the [Detect Language method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7).

1. Create a new function called `Detect_Language` which takes text analytics client created above as parameter.

    ```ruby
    def Detect_Language(textAnalyticsClient)
      documents = { 'documents': [
        { 'id' => '1', 'text' => 'This is a document written in English.' },
        { 'id' => '2', 'text' => 'Este es un document escrito en Español.' },
        { 'id' => '3', 'text' => '这是一个用中文写的文件' }
      ]}
      path = 'languages'
      textAnalyticsClient.SendRequest(path, documents)
    end
    ```
2. Call the function `Detect_Language`
    ```ruby
    Detect_Language(textAnalyticsClient)
    ```

### Output
A successful response is returned in JSON, as shown in the following example: 

    ```json
    {
       "documents": [
          {
             "id": "1",
             "detectedLanguages": [
                {
                   "name": "English",
                   "iso6391Name": "en",
                   "score": 1.0
                }
             ]
          },
          {
             "id": "2",
             "detectedLanguages": [
                {
                   "name": "Spanish",
                   "iso6391Name": "es",
                   "score": 1.0
                }
             ]
          },
          {
             "id": "3",
             "detectedLanguages": [
                {
                   "name": "Chinese_Simplified",
                   "iso6391Name": "zh_chs",
                   "score": 1.0
                }
             ]
          }
       ],
       "errors": [
    
       ]
    }
    ```

<a name="EntityRecognition"></a>

## Entity recognition

The Entities API extracts entities in a text document, using the [Entities method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1-Preview/operations/5ac4251d5b4ccd1554da7634). The following example identifies entities for English documents.

1. Create a new function called `Recognize_Entities` which takes text analytics client created above as parameter.

    ```ruby
    def Recognize_Entities(textAnalyticsClient)
      documents = { 'documents': [
        { 'id' => '1', 'language' => 'en', 'text' => 'Microsoft is an It company.' }
      ]}
      path = 'entities'
      textAnalyticsClient.SendRequest(path, documents)
    end
    ```
2. Call the function `Recognize_Entities`
    ```ruby
    Recognize_Entities(textAnalyticsClient)
    ```

### Output
A successful response is returned in JSON, as shown in the following example: 

    ```json
    {
      "documents": [
        {
          "id": "1",
          "entities": [
            {
              "name": "Microsoft",
              "matches": [
                {
                  "wikipediaScore": 0.20634493406692744,
                  "entityTypeScore": 0.999969482421875,
                  "text": "Microsoft",
                  "offset": 0,
                  "length": 9
                }
              ],
              "wikipediaLanguage": "en",
              "wikipediaId": "Microsoft",
              "wikipediaUrl": "https://en.wikipedia.org/wiki/Microsoft",
              "bingId": "a093e9b9-90f5-a3d5-c4b8-5855e1b01f85",
              "type": "Organization"
            },
            {
              "name": "Technology company",
              "matches": [
                {
                  "wikipediaScore": 0.8246355141864805,
                  "entityTypeScore": 0.8,
                  "text": "It company",
                  "offset": 16,
                  "length": 10
                }
              ],
              "wikipediaLanguage": "en",
              "wikipediaId": "Technology company",
              "wikipediaUrl": "https://en.wikipedia.org/wiki/Technology_company",
              "bingId": "bc30426e-22ae-7a35-f24b-454722a47d8f",
              "type": "Organization"
            }
          ]
        }
      ],
      "errors": [
    
      ]
    }
    ```

<a name="KeyPhraseExtraction"></a>

## Key phrase extraction

The Key Phrase Extraction API extracts key-phrases from a text document, using the [Key Phrases method](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6). The following example extracts key phrases for both English and Spanish documents.

1. Create a new function called `Extract_KeyPhrases` which takes text analytics client created above as parameter.

    ```ruby
    def Extract_KeyPhrases(textAnalyticsClient)
      documents = { 'documents': [
        { 'id' => '1', 'language' => 'en', 'text' => 'I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable.' },
        { 'id' => '2', 'language' => 'es', 'text' => 'Si usted quiere comunicarse con Carlos, usted debe de llamarlo a su telefono movil. Carlos es muy responsable, pero necesita recibir una notificacion si hay algun problema.' },
        { 'id' => '3', 'language' => 'en', 'text' => 'The Grand Hotel is a new hotel in the center of Seattle. It earned 5 stars in my review, and has the classiest decor I\'ve ever seen.' },
      ]}
      path = 'keyphrases'
      textAnalyticsClient.SendRequest(path, documents)
    end
    ```
2. Call the function `Extract_KeyPhrases`
    ```ruby
    Extract_KeyPhrases(textAnalyticsClient)
    ```

### Output
A successful response is returned in JSON, as shown in the following example: 

    ```json
    {
      "documents": [
        {
          "id": "1",
          "keyPhrases": [
            "HDR resolution",
            "new XBox",
            "clean look"
          ]
        },
        {
          "id": "2",
          "keyPhrases": [
            "Carlos",
            "notificacion",
            "algun problema",
            "telefono movil"
          ]
        },
        {
          "id": "3",
          "keyPhrases": [
            "new hotel",
            "Grand Hotel",
            "review",
            "center of Seattle",
            "classiest decor",
            "stars"
          ]
        }
      ],
      "errors": [
    
      ]
    }
    ```

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
