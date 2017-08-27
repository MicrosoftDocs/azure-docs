---
title: How-to sentiment analysis in Text Analytics REST API (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: How to detect sentiment  using the Text Analytics REST API in Microsoft Cognitive Services on Azure in this walkthrough tutorial.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: get-started-article
ms.date: 08/12/2017
ms.author: heidist
---

# How to detect sentiment in Text Analytics

The [sentiment analysis API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) evaluates text input and for each document returns a sentiment score ranging from 0 to 1, from negative to positive.

This capability is useful for detecting trends in terms of positive and negative sentiment in social media, customer reviews, and discussion forums. Content is provided by you; models and training data are provided by the service. You cannot customize the model or training data, or supplement it with your own information.

Given a large number of sentiment scores, you can import or stream the results to a visualization app for trend analysis, or call additional APIs from Twitter, Facebook, and so forth, to supplement sentiment scoring with metadata and other constructs available in the platform of origin. 

The sentiment analyzer is engineered to solve classification problems, and not aspect sentiment. The model is trained to analyze text at face value, and then score a positive, negative, or neutral sentiment based on our internal training data and natural language processing engines. 

There is always a degree of imprecision in sentiment analysis, but the model is most reliable when there is no hidden meaning or subtext to the content. Irony, sarcasm, puns, jokes, and similarly nuanced content relies on cultural context and norms to convey intent, which continues to challenge most sentiment analyzers. The biggest discrepancies between a given score produced by the analyzer and a subjective assessment by a human is usually on content with nuanced meaning.

## Concepts

Text Analytics uses a Naive-Bayes machine learning algorithm to classify any new piece of text as positive, negative, or neutral content. The model uses training data, as well as the following methodologies:

| Modeling aspect  | How effected |
|-------------|-------------|
| Linguistics | We invoke linguistic processing in the form of tokenization and stemming. |
| Patterns | We use n-grams to articulate patterns, such as word repetition, proximity, and sequencing. <br/> We assign of part-of-speech to each word in the input text. | 
| Expressivity | We incorporate any emoticons, punctuation such as exclamation or question marks, and letter case (upper or lower) as indicators of sentiment.|
| Semantics | We build resonance in the training data by mapping syntactically similar words. Sentiment evidence associated with one term can be applied to similar terms. We use neural networks to construct the associations. |

## Preparation

## Step 1: Initialize the request

Create a **Post** request. Review the API documentation for this request: [Key Phrases API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6)

Create the HTTP endpoint for key phrase extraction. It must include the `/keyphrases` resource: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases`

Get the access key that allows your subscription to access Text Analytics operations.

For more information on how to find a valid endpoint for your subscription, see [How to find endpoints and access keys](text-analytics-howto-accesskey.md).

Request headers:

   + `Ocp-Apim-Subscription-Key` set to your access key, obtained from Azure portal.
   + `Content-Type` set to application/json.
   + `Accept` set to application/json.

     Your request should look similar to the following screenshot:

   ![Request screenshot with endpoint and headers](../media/text-analytics/postman-request-keyphrase-1.png)

## Step 2: Structure the request body

### Guidance for constructing inputs

+ For sentiment analysis, you can submit any text subject to the 10-KB limit per document, but we recommend splitting text into sentences. This generally leads to greater precision in sentiment predictions.

+ Include the language identifier in the request. It is not required, but the score will be neutral or inconclusive (0.5) if you omit it.

> [!Note]
> You can submit the same collection of documents for multiple operations: sentiment analysis, key phrase analysis, and language detection. Operations are independent so run them sequentially or in parallel.

## Step 3: Post the request

## Step 4: Review results

##E Examples of sentiment output

The sentiment analyzer classifies text as predominantly positive or negative, assigning a score in the range of 0 to 1, up to 15 decimal places. A solid 0.5 is neutral; the functional equivalent of an indeterminate sentiment. The analyzer couldn't interpret or make sense of the text input.

The response consists of a document ID and a score. There is no built-in drillthrough to document detail. If you want clickthrough from a sentiment score to the original input, or to key phrases extracted for the same document, you will need to write code that collects the outputs for each document ID.

The following example illustrates the syntax, starting with an input:

```
{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "My cat ate all my food! He is one crazy dude."
    }
  ]
}
```

Output is one score for each document, where the ID is derived from the input, and the score is a 15-digit string indicating a degree of sentiment. Scores closer to zero indicate negative sentiment.

```
{
  "documents": [
    {
      "score": 0.193176138548217,
      "id": "1"
    }
  ],
  "errors": []
}
```

## Summary

## OLD

In this Quickstart, learn how to call the [**Text Analytics REST APIs**](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) to perform key phrase extraction, sentiment analysis, and language detection on text provided in requests to [Microsoft Cognitive Services](https://azure.microsoft.com/services/cognitive-services/).

To complete this Quickstart, you need an interactive tool for sending HTTP requests. 

+ [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop), [Telerik Fiddler](https://www.telerik.com/download/fiddler), or other Web API testing tool, if you have one. 
+ You can also use the built-in console app in our REST API documentation pages to interact with each API individually. To use the console, click **Open API testing console** on any [doc page](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6).

> [!Tip]
> For one-off interactions, we recommend the built-in console. There is no setup and user requirements consist only of the access key and the JSON documents you paste into the request. 
>
> For ongoing experimentation, we suggest a web API testing tool like Postman or Fiddler. A tool persists your request headers and content. You can make incremental changes, including switching to another operation, without having to start over with each new request.

## Before you begin

To use Microsoft Cognitive Service APIs, create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

> [!Note]
> Cognitive Services has many APIs. Billing, policies, and release cycles vary for each API, so we ask you to sign up for each one individually. To find out if your subscription already has Text Analytics, enter "text analytics" in the portal's search box.

## Set up a request in Postman

In this first exercise, structure the request, using key phrase extraction as the first analysis.

Text Analytics APIs invoke operations against pretrained models and machine learning algorithms running in Azure data centers. You need your own key to access the operations, which is generated for you when you sign up. 

Endpoints for each operation include the resource providing the underlying algorithms used for a particular analysis: **sentiment analysis**, **key phrase extraction**, and **language detection**. Each request must specify which resource to use. We list them in the next step.

1. In the [Azure portal](https://portal.azure.com), open the Text Analytics page. If it's not pinned to dashboard, search for "text analytics" to find the page. Leave the page open so that you can copy an access key and endpoint.

   ![Portal page with endpoint and keys](../media/text-analytics/portal-keys-endpoint.png)

3. Set up the request:

   + Choose **Post** as the request type.
   + Paste in the endpoint you copied from the portal page.
   + Append a resource. In this exercise, start with **/keyPhrases**.

  Endpoints for each available resource are as follows (your region may vary):

   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment`
   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases`
   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages`

4. Set three request headers:

   + `Ocp-Apim-Subscription-Key` set to your access key, obtained from Azure portal.
   + `Content-Type` set to application/json.
   + `Accept` set to application/json.

  Your request should look similar to the following screenshot:

   ![Request screenshot with endpoint and headers](../media/text-analytics/postman-request-keyphrase-1.png)

4. Click **Body** and choose **raw** for the format.

   ![Request screenshot with body settings](../media/text-analytics/postman-request-body-raw.png)

5. Paste in some JSON documents: 

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
                "text": "Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar"
            }
        ]
    }
```

> [!Note]
> A Spanish string is included to demonstrate [language detection](#detect-language) and other behaviors, described in a following section. It is incorrectly tagged as `en` to demonstrate the effects of setting the wrong language.

### About the request body

Input rows must be JSON in raw unstructured text. XML is not supported. The schema is simple, consisting of the elements described in the following list. You can use the same documents for all three operations: sentiment, key phrase, and language detection.

+ `id` is required. The data type is string, but in practice document IDs tend to be integers. The system uses the IDs you provide to structure the output. Language codes, keywords, and sentiment scores are generated for each ID.

+ `text` field is requred and contains unstructured raw text, up to 10 KB. For more information about limits, see [Text Analytics Overview > Data limits](overview.md#data-limits). 

+ `language` is used only in sentiment analysis and key phrase extraction. It is ignored in language detection. 

> [!Note]
> For both sentiment analysis and key phrase extraction, `language` is an optional parameter. If `language` is wrong, results of the analysis might be incorrect or suboptimal. If `language` is missing, the system performs language detection prior to sentiment or key phrase analysis. This can slow down operations. For this reason, we recommend including an accurate language code in the request, assuming you know what it is. For more information about which languages are supported, see [Text Analytics Overview > Supported Languages](overview.md#supported-languages).

## Key phrase extraction

1. Compare the screenshots against your tool to verify the request is configured correctly.

2. Click **Send** to submit the request.

All POST requests return a JSON formatted response with the IDs and detected properties. An example of the output for key phrase extraction is shown next:

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

### Review the output

Comparing inputs and outputs side by side helps us understand key phrase extraction operations. The analyzer finds and discards non-essential words, and keeps single terms or phrases that appear to be the subject or object of a sentence. 

| ID | Input | key phrase output | 
|----|-------|------|
| 1 | "We love this trail and make the trip every year. The views are breathtaking and well worth the hike!" | "year", "trail", "trip", "views"" |
| 2 | "Poorly marked trails! I thought we were goners. Worst hike ever." | "Worst hike",  "trails", "goners" |
| 3 | "Everyone in my family liked the trail but thought it was too challenging for the less athletic among us. Not necessarily recommended for small children." | "family", "trail", "us", "small children"|
| 4 | "It was foggy so we missed the spectacular views, but the trail was ok. Worth checking out if you are in the area." | "spectacular views", "trail", "Worth", "area" |
| 5 | ""Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar" | "Tiene hermosas vistas y muchos lugares para detenerse y descansar", "encanta este sendero"|

## Analyze sentiment

Using the same documents and request headers, you can edit the existing request to call the sentiment analyzer and return sentiment scores.

1. In the URL, replace `/keyPhrases` with `/sentiment` in the endpoint.

2. Click **Send**.

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
| 5 | 0.5 | neutral <sup>1</sup> | "Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar." |

<sup>1</sup> The Spanish string is not parsed for sentiment because the language code is `en` instead of `es`. When a string cannot be analyzed for sentiment or has no sentiment, the score is always 0.5 exactly. In a [later step](#set-lang-code), you can change the language code to get a valid score for this text.

<a name="detect-language></a>

## Detect language

Using same documents and request headers, you can edit the existing request to call the language detection analyzer.

1. In the URL, replace `/sentiment` with `/languages` in the endpoint.

2. Click **Send**.

The language code input, which was useful for other analyses, is ignored for language detection. Text Analytics operates only on the `text` you provide. Response output for each document includes a friendly language name, a 2-character language code, and a score indicating the strength of the analysis. 

Notice that the last document is correctly identified as Spanish, even though the string was tagged as `en`.

            "id": "5",
            "detectedLanguages": [
                {
                    "name": "Spanish",
                    "iso6391Name": "es",
                    "score": 1
                }
            ]

<a name="set-lang-code"></a>

## Align language codes to text

We deliberately used an incorrect language code in document 5 to show what happens when a language code is wrong. Byproducts of an incorrect language code include indeterminate sentiment, or key phrase extraction with the help of N-gram analysis.

In this last exercise, change the language code for the Spanish string in document 5 from `en` to `es`. Resend the requests for sentiment analysis and keyword detection. 

Comparing before-and-after results, sentiment score goes from 0.5 (neutral) to 1.0 (positive), an accurate score for this text. For key phrase extraction, notice that the results are more granular, on a level consistent with the English strings.

        {
            "keyPhrases": [
                "lugares",
                "sendero"
            ],
            "id": "5"

The point to take away from this last exercise is that you should set the language code correctly, assuming you know it. If you don't, use [language detection](text-analytics-concept-language-detection.md) to obtain it, and then set the code before performing sentiment analysis or key phrase extraction. 

## Summary

In this article, you learned concepts and workflow for sentiment analysis using Text Analytics in Cognitive Services. The following are a quick reminder of the main points previously explained and demonstrated:

+ [Sentiment analysis API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) is available for selected languages.
+ JSON documents in the request body include an id, text, and language code.
+ POST request is to a `/sentiment` endpoint, using a personalized [access key and an endpoint](text-analytics-howto-acccesskey.md) that is valid for your subscription.
+ Response output, which consists of a sentiment score for each document ID, can be streamed to any app that accepts JSON, including Excel and Power BI, to name a few.

## Next steps

+ [Quickstart](quick-start.md) is a walk through of the REST API calls written in C#. Learn how to submit text, choose an analysis, and view results with minimal code.

+ [API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) provides the technical documentation for the APIs. Documentation embeds interactive requests so that you can call the API from each documentation page.

+ [External & Community Content](text-analytics-resource-external-community.md) provides a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

+ To see how the Text Analytics API can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.


## See also 

 [Text Analytics overview](overview.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712) 