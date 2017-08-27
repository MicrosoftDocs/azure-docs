---
title: How-to language detection in Text Analytics REST API (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: How to detect language using the Text Analytics REST API in Microsoft Cognitive Services on Azure in this walkthrough tutorial.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: get-started-article
ms.date: 08/26/2017
ms.author: heidist
---

# How to detect language in Text Analytics

The [language detection API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) evaluates text input and for each document returns language identifiers and a score indicating the strength of the analysis. Text Analytics recognizes up to 120 languages.

This capability is useful for content stores that collect arbitrary text, where language is unknown. You can parse the results of this analysis to determine which language representation and frequency of occurrence. From the output, you could trim unknown or inconclusive results, or investigate the findings more deeply to see if there is corruption in the form of unexpected non-text content.

## Preparation

You must have JSON documents in this format: id, text

The collection is submitted in the body of the request. The following example is an illustration of content you might submit for language detection.

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
                "text": "Этот документ находится на английском языке."
            }
        ]
    }
```

## Step 1: Structure the request

Assuming you have content properly expressed as JSON, you can structure a POST request to include the following elements.



[Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Text Analytics API**. 

Create a **Post** request. Review the API documentation for this request: [language detectopm API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6)

Create the HTTP endpoint for key phrase extraction. It must include the `/languages` resource: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages`


Get the access key that allows your subscription to access Text Analytics operations.

For more information on how to find a valid endpoint for your subscription, see [How to find endpoints and access keys](text-analytics-howto-accesskey.md).

Request headers:

   + `Ocp-Apim-Subscription-Key` set to your access key, obtained from Azure portal.
   + `Content-Type` set to application/json.
   + `Accept` set to application/json.

     Your request should look similar to the following screenshot:

   ![Request screenshot with endpoint and headers](../media/text-analytics/postman-request-keyphrase-1.png)

## Step 2: Structure the request body

## Step 3: Post the request

When

## Step 4: Review results

Results for the example request should look like the following JSON. Notice that it is one document with multiple items. Output is in English. Language identifiers include a friendly name and a language code in [ISO 639-1](https://www.iso.org/standard/22109.html) format.

A positive score of 1.0 expresses the highest possible confidence level of the analysis.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort and manipulate the data.

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

If the analyzer cannot parse the input (for example, assume you submitted a text block consisting solely of Arabic numerals), the system returns `(Unknown)`.

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

Mixed language content within the same document returns the language with the largest representation in the content, but with a lower positive rating to reflect the marginal strength of that assessment. In the following example, input is a blend of English, Spanish, and French. The analyzer counts characters in each segment to determine the predominent language.

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

Resulting output consists of the predominant language, with a score of less than 1.0 indicating a weaker signal strength.

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

+ [Language detection API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) is available for 120 languages.
+ JSON documents in the request body include an id and text.
+ POST request is to a `/languages` endpoint, using a personalized [access key and an endpoint](text-analytics-howto-acccesskey.md) that is valid for your subscription.
+ Response output, which consists of language identifiers for each document ID, can be streamed to any app that accepts JSON, including Excel and Power BI, to name a few.

## Next steps

+ [Quickstart](quick-start.md) is a walk through of the REST API calls written in C#. Learn how to submit text, choose an analysis, and view results with minimal code.

+ [API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) provides the technical documentation for the APIs. Documentation embeds interactive requests so that you can call the API from each documentation page.

+ [External & Community Content](text-analytics-resource-external-community.md) provides a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

+ To see how the Text Analytics API can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.

## See also 

 [Text Analytics overview](overview.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712) 