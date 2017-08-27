---
title: How-to sentiment analysis in Text Analytics REST API (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: How to detect sentiment  using the Text Analytics REST API in Microsoft Cognitive Services on Azure in this walkthrough tutorial.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/26/2017
ms.author: heidist
---

# How to detect sentiment in Text Analytics

The [sentiment analysis API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) evaluates text input and for each document returns a sentiment score ranging from 0 to 1, from negative to positive.

This capability is useful for detecting positive and negative sentiment in social media, customer reviews, and discussion forums. Content is provided by you; models and training data are provided by the service. You cannot customize the model or training data, or supplement it with your own information.

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

Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Text Analytics API**. 

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
                "text": "I love this trail. It has beautiful views and many places to stop and rest"
            }
        ]
    }
```

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

### Examples of sentiment output

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


### Ambiguous or neutral sentiment

A score of 0.5 indicates neutrality. When a string cannot be analyzed for sentiment or has no sentiment, the score is always 0.5 exactly.

For example, if you pass in a Spanish string with an English language code, the score is 0.5.

## Summary

In this article, you learned concepts and workflow for sentiment analysis using Text Analytics in Cognitive Services. The following are a quick reminder of the main points previously explained and demonstrated:

+ [Sentiment analysis API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) is available for selected languages.
+ JSON documents in the request body include an id, text, and language code.
+ POST request is to a `/sentiment` endpoint, using a personalized [access key and an endpoint](text-analytics-howto-accesskey.md) that is valid for your subscription.
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