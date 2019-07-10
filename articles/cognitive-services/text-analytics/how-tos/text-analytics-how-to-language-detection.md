---
title: Detecting language with the Text Analytics REST API | Microsoft Docs
description: How to detect language using the Text Analytics REST API from Azure Cognitive Services.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: sample
ms.date: 02/26/2019
ms.author: aahi
---

# Example: How to detect language with Text Analytics

The [Language Detection](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c7) feature of the API evaluates text input and for each document and returns language identifiers with a score indicating the strength of the analysis.

This capability is useful for content stores that collect arbitrary text, where language is unknown. You can parse the results of this analysis to determine which language is used in the input document. The response also returns a score which reflects the confidence of the model (a value between 0 and 1).

We don't publish the exact list of languages for this feature, but it can detect a wide range of languages, variants, dialects, and some regional/cultural languages. 

If you have content expressed in a less frequently used language, you can try Language Detection to see if it returns a code. The response for languages that cannot be detected is `unknown`.

> [!TIP]
> Text Analytics also provides a Linux-based Docker container image for language detection, so you can [install and run the Text Analytics container](text-analytics-how-to-install-containers.md) close to your data.

## Preparation

You must have JSON documents in this format: ID, text

Document size must be under 5,120 characters per document, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request. The following is an example of content you might submit for language detection.

   ```
    {
        "documents": [
            {
                "id": "1",
                "text": "This document is in English."
            },
            {
                "id": "2",
                "text": "Este documento está en inglés."
            },
            {
                "id": "3",
                "text": "Ce document est en anglais."
            },
            {
                "id": "4",
                "text": "本文件为英文"
            },                
            {
                "id": "5",
                "text": "Этот документ на английском языке."
            }
        ]
    }
```

## Step 1: Structure the request

Details on request definition can be found in [How to call the Text Analytics API](text-analytics-how-to-call-api.md). The following points are restated for convenience:

+ Create a **POST** request. Review the API documentation for this request: [Language Detection API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c7)

+ Set the HTTP endpoint for language detection, using either a Text Analytics resource on Azure or an instantiated [Text Analytics container](text-analytics-how-to-install-containers.md). It must include the `/languages` resource: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.1/languages`

+ Set a request header to include the access key for Text Analytics operations. For more information, see [How to find endpoints and access keys](text-analytics-how-to-access-key.md).

+ In the request body, provide the JSON documents collection you prepared for this analysis

> [!Tip]
> Use [Postman](text-analytics-how-to-call-api.md) or open the **API testing console** in the [documentation](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c7) to structure a request and POST it to the service.

## Step 2: Post the request

Analysis is performed upon receipt of the request. See the [data limits](../overview.md#data-limits) section in the overview for information on the size and number of requests you can send per minute and second.

Recall that the service is stateless. No data is stored in your account. Results are returned immediately in the response.


## Step 3: View results

All POST requests return a JSON formatted response with the IDs and detected properties.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

Results for the example request should look like the following JSON. Notice that it is one document with multiple items. Output is in English. Language identifiers include a friendly name and a language code in [ISO 639-1](https://www.iso.org/standard/22109.html) format.

A positive score of 1.0 expresses the highest possible confidence level of the analysis.



```
{
    "documents": [
        {
            "id": "1",
            "detectedLanguages": [
                {
                    "name": "English",
                    "iso6391Name": "en",
                    "score": 1
                }
            ]
        },
        {
            "id": "2",
            "detectedLanguages": [
                {
                    "name": "Spanish",
                    "iso6391Name": "es",
                    "score": 1
                }
            ]
        },
        {
            "id": "3",
            "detectedLanguages": [
                {
                    "name": "French",
                    "iso6391Name": "fr",
                    "score": 1
                }
            ]
        },
        {
            "id": "4",
            "detectedLanguages": [
                {
                    "name": "Chinese_Simplified",
                    "iso6391Name": "zh_chs",
                    "score": 1
                }
            ]
        },
        {
            "id": "5",
            "detectedLanguages": [
                {
                    "name": "Russian",
                    "iso6391Name": "ru",
                    "score": 1
                }
            ]
        }
    ],
```

### Ambiguous content

If the analyzer cannot parse the input (for example, assume you submitted a text block consisting solely of Arabic numerals), it returns `(Unknown)`.

```
    {
      "id": "5",
      "detectedLanguages": [
        {
          "name": "(Unknown)",
          "iso6391Name": "(Unknown)",
          "score": "NaN"
        }
      ]
```
### Mixed language content

Mixed language content within the same document returns the language with the largest representation in the content, but with a lower positive rating, reflecting the marginal strength of that assessment. In the following example, input is a blend of English, Spanish, and French. The analyzer counts characters in each segment to determine the predominant language.

**Input**

```
{
  "documents": [
    {
      "id": "1",
      "text": "Hello, I would like to take a class at your University. ¿Se ofrecen clases en español? Es mi primera lengua y más fácil para escribir. Que diriez-vous des cours en français?"
    }
  ]
}
```

**Output**

Resulting output consists of the predominant language, with a score of less than 1.0, indicating a weaker level of confidence.

```
{
  "documents": [
    {
      "id": "1",
      "detectedLanguages": [
        {
          "name": "Spanish",
          "iso6391Name": "es",
          "score": 0.9375
        }
      ]
    }
  ],
  "errors": []
}
```

## Summary

In this article, you learned concepts and workflow for language detection using Text Analytics in Cognitive Services. The following are a quick reminder of the main points previously explained and demonstrated:

+ [Language detection](https://westcentralus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c7) is available for a wide range of languages, variants, dialects, and some regional/cultural languages.
+ JSON documents in the request body include an ID and text.
+ POST request is to a `/languages` endpoint, using a personalized [access key and an endpoint](text-analytics-how-to-access-key.md) that is valid for your subscription.
+ Response output, which consists of language identifiers for each document ID, can be streamed to any app that accepts JSON, including Excel and Power BI, to name a few.

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)</br>
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712) 

## Next steps

> [!div class="nextstepaction"]
> [Analyze sentiment](text-analytics-how-to-sentiment-analysis.md)
