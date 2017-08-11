---
title: 'Analyze sentiment in ten minute quickstart (Microsoft Cognitive Services on Azure) in 10 minutes| Microsoft Docs'
description: Learn the Text Analytics API in Microsoft Cognitive Services on Azure in ten minutes.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/01/2017
ms.author: heidist
---

# Analyze sentiment in ten minutes (REST API)

In this Quickstart, learn how to call the Text Analytics REST APIs to perform sentiment analysis, keyword extraction, and language detection on text provided in requests to Microsoft Cognitive Services.

> [!Tip]
> We recommend using a Web API testing tool for this exercise. [Chrome Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) is a good choice, but any tool that sends HTTP requests will work. You can watch this [short video](https://www.youtube.com/watch?v=jBjXVrS8nXs) to learn basic Postman operations.
>

## Before you begin

To use Microsoft Cognitive Service APIs, create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

> [!Note]
> If you already signed up for Cognitive Services to use another API, you need to retrace your steps for Text Analytics. Billing, policies, and release cycles vary for each API, so we ask you to sign up for each one individually. 

## Set up a request in Postman

In this first exercise, you will structure the request, using key phrase extraction as the first analysis.

Text Analytics APIs invoke operations against machine learning pretrained models and algorithms running in Azure data centers. You need your own key to access the operations. 

Endpoints for each operation include the resource providing the underlying algorithms used for a particular analysis: **sentiment analysis** , **key phrase extraction**, and **language detection**. Each request must specify which resource to use. We list them in full below.

1. In the [Azure portal](https://portal.azure.com) and find the Text Analysis API you signed up for. Leave the page open so that you can copy a key and endpoint, starting in the next step.

2. In Postman or another tool, set up the request:

   + Choose **Post** as the request type.
   + Paste in the endpoint you copied from the portal page.
   + Append a resource. In this exercise, start with **/keyPhrases**.

  Endpoints for each available resource are as follows (your region may vary):

   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment`
   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases`
   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages`

3. Set three request headers:

   + `Ocp-Apim-Subscription-Key` set to your access key, obtained from Azure portal.
   + `Content-Type` set to application/json.
   + `Accept` set to application/json.

  Your request should look similar to the following screenshot.

   ![Request screenshot with endpoint and headers](../media/text-analytics/postman-request-keyphrase-1.png)

4. Provide text for analysis. Each document can have a maximum of 10 KB of raw text. Specifying `language` is not required, but providing it bypasses an implicit language detection check, which is more efficient.

  Click **Body** and paste in the JSON documents below. 

   ```
    {
        "documents": [
            {
                "language": "en",
                "id": "1",
                "text": "We love this trail and make the trip every year. The views are breathtaking and well worth the hike!"
            },
            {
                "language": "en",
                "id": "2",
                "text": "Poorly marked trails! I thought we were goners. Worst hike ever."
            },
            {
                "language": "en",
                "id": "3",
                "text": "Everyone in my family liked the trail but thought it was too challenging for the less athletic among us. Not necessarily recommended for small children."
            },
            {
                "language": "en",
                "id": "4",
                "text": "It was foggy so we missed the spectacular views, but the trail was ok. Worth checking out if you are in the area."
            },                
            {
                "language": "en",
                "id": "5",
                "text": "Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar."
            }
        ]
    }
```

5. Choose **raw** for the format. Click **Send** to submit the request.

### Drillldown: Formatting the request body

Input rows must be JSON in raw text. XML is not supported. The schema is extremely simple, which means the same documents collection can be used in all requests.
 
+ Language is used only in sentiment analysis and key phrase extraction. It is ignored in language detection. For both sentiment analysis and key phrase extraction, language is an optional parameter but if you do not provide it, the service performs an additional language detection pass. For maximum efficiency, you should always include the language in the request, assuming you know what it is. Refer to the [Text Analytics Overview > Supported Languages](overview.md#supported-languages) for a list of supported languages.

+ Document ID is required. Each ID should be a unique integer. The system uses this ID to structure the output. For example, keywords and sentiment scores are provided for each ID.

+ Text provides the strings to be analyzed. The maximum size of a single document that can be submitted is 10 KB, and 1 MB for the request overall. For more information about limits, see [Text Analytics Overview > Data limits](text-analytics-overview-whatis.md#data-limits). 

### Drilldown: Parsing the response

All POST requests return a JSON formatted response with the IDs and detected properties. An example of the output for key phrase extraction is shown below. The keyPhrases algorithm iterates over the entire collection before extracting phrases, using the context of all strings to determine which ones to extract.

```
{
    "documents": [
        {
            "keyPhrases": [
                "year",
                "trail",
                "trip",
                "views"
            ],
            "id": "1"
        },
        {
            "keyPhrases": [
                "Worst hike",
                "trails",
                "goners"
            ],
            "id": "2"
        },
        {
            "keyPhrases": [
                "family",
                "trail",
                "us",
                "small children"
            ],
            "id": "3"
        },
        {
            "keyPhrases": [
                "spectacular views",
                "trail",
                "Worth",
                "area"
            ],
            "id": "4"
        },
        {
            "keyPhrases": [
                "Tiene hermosas vistas y muchos lugares para detenerse y descansar",
                "encanta este sendero"
            ],
            "id": "5"
        }
    ],
    "errors": []
}
```

### Drilldown: Observations about key phrase extraction

Presenting inputs and outputs side by side helps us see how the key phrase extraction algorithm operates. 

The algorithm finds and discards non-essential words, and keeps single terms or phrases that appear to be the subject or object of a sentence.

| ID | Input | key phrase output | 
|----|-------|------|
| 1 | "We love this trail and make the trip every year. The views are breathtaking and well worth the hike!" | "year", "trail", "trip", "views"" |
| 2 | "Poorly marked trails! I thought we were goners. Worst hike ever." | "Worst hike",  "trails", "goners" |
| 3 | "Everyone in my family liked the trail but thought it was too challenging for the less athletic among us. Not necessarily recommended for small children." | "family", "trail", "us", "small children"|
| 4 | "It was foggy so we missed the spectacular views, but the trail was ok. Worth checking out if you are in the area." | "spectacular views", "trail", "Worth", "area" |
| 5 | "Tiene hermosas vistas y muchos lugares para detenerse y descansar", "encanta este sendero" | The|


## Analyze sentiment

Using the same documents, you can edit the existing request to call the sentiment analysis algorithm and return sentiment scores.

+ Replace `/keyPhrases` with `/sentiment` in the endpoint and then click **Send**.

The response includes a sentiment score between 0.0 (negative) and 1.0 (positive) to indicate relative sentiment.

```
{
    "documents": [
        {
            "score": 0.989059339865683,
            "id": "1"
        },
        {
            "score": 0.00626599157674657,
            "id": "2"
        },
        {
            "score": 0.919842553279166,
            "id": "3"
        },
        {
            "score": 0.841722489453801,
            "id": "4"
        },
        {
            "score": 0.5,
            "id": "5"
        }
    ],
    "errors": []
}
```

The API returns a score and ID, but not the input string. The following table shows the original strings so that you can evaluate the score with your own interpretation of positive or negative sentiment.

| ID | Score | Bias | String |
|----|-------|------|--------|
| 1 | 0.989059339865683  | positive | "We love this trail and make the trip every year. The views are breathtaking and well worth the hike!" |
| 2 | 0.00626599157674657  | negative | "Poorly marked trails! I thought we were goners. Worst hike ever." |
| 3 | 0.919842553279166  | positive | "Everyone in my family liked the trail but thought it was too challenging for the less athletic among us. Not necessarily recommended for small children." |
| 4 | 0.841722489453801  | positive | "It was foggy so we missed the spectacular views, but the trail was ok. Worth checking out if you are in the area." |
| 5 | 0.5 | indeterminate <sup>1</sup> | "Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar." |

<sup>1</sup> The Spanish string is not parsed for sentiment because the language code is `en` instead of `es`. When a string cannot be analyzed for sentiment, the score is always 0.5 exactly.

## Detect language

Using same documents, you can edit the existing request to call the language detection algorithm.

+ Replace `/sentiment` with `/languages` in the endpoint and then click **Send**.

The language code input, which was useful for other analyses, is ignored for language detection. Text Analytics operates only on the `text` you provide. Response output for each document includes a friendly language name, an ISO language code, and a score indicating the strength of the analysis. 

Notice that the last document is correctly identified as Spanish, even though the string was tagged as `en`.

            "id": "5",
            "detectedLanguages": [
                {
                    "name": "Spanish",
                    "iso6391Name": "es",
                    "score": 1
                }
            ]

> [!Tip] 
> Use an online translator to translate some of the existing phrases from English to another language. Re-send the request to detect the various languages (120 languages are supported for language detection).

## Next steps

+ Sign up for the [Translate API](https://azure.microsoft.com/services/cognitive-services/translator-text-api/) and submit the documents collection for translation. Copy the strings to create a language-specific version of the documents, then run language detection to confirm the results.

+ [Visit the product page](//go.microsoft.com/fwlink/?LinkID=759712) to try out an interactive demo of the APIs. Submit text, choose an analysis, and view results without writing any code.

+ [Visit API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs. Documentation embeds interactive requests so that you can call the API from each documentation page.

+ Learn how to call the [Text Analytics API from PowerApps](https://powerapps.microsoft.com/blog/custom-connectors-and-text-analytics-in-powerapps-part-one/), an application development platform that does not require in-depth programming knowledge to use.

+ To see how the Text Analytics API can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.

## See also 

 [Welcome to Text Analytics in Microsoft Cognitive Services on Azure](text-analytics-overview-whatis.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)