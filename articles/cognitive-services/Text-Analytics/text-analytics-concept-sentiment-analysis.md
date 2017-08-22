---
title: 'Sentiment analysis in Text Analytics API (Microsoft Cognitive Services on Azure) | Microsoft Docs'
description: Guidance, best practices, and tips for implmenting sentiment analysis over text in custom apps using Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: cgronlun

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/11/2017
ms.author: heidist

---
# Sentiment analysis in Text Analytics API

The [sentiment analysis API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) evaluates text input and for each document returns a sentiment score ranging from 0 to 1, from negative to positive.

## Common use cases

This capability is useful for detecting trends in terms of positive and negative sentiment in social media, customer reviews, and discussion forums. Content is provided by you; models and training data are provided by the service. You cannot customize the model or training data, or supplement it with your own information.

Given a large number of sentiment scores, you can import or stream the results to a visualization app for trend analysis, or call additional APIs from Twitter, Facebook, and so forth, to supplement sentiment scoring with metadata and other constructs available in the platform of origin. For more information on handling results, see [How to work with analyses outputs](text-analytics-howto-output.md).

The sentiment analyzer is engineered to solve classification problems, and not aspect sentiment. The model is trained to analyze text at face value, and then score a positive, negative, or neutral sentiment based on our internal training data and natural language processing engines. 

There is always a degree of imprecision in sentiment analysis, but the model is most reliable when there is no hidden meaning or subtext to the content. Irony, sarcasm, puns, jokes, and similarly nuanced content relies on cultural context and norms to convey intent, which continues to challenge most sentiment analyzers. The biggest discrepancies between a given score produced by the analyzer and a subjective assessment by a human is usually on content with nuanced meaning.

## Classification techniques

We use a Naive-Bayes machine learning algorithm to classify any new piece of text as positive, negative, or neutral content. The model uses training data, as well as the following methodologies:

| Modeling aspect  | How effected |
|-------------|-------------|
| Linguistics | We invoke linguistic processing in the form of tokenization and stemming. |
| Patterns | We use n-grams to articulate patterns, such as word repetition, proximity, and sequencing. <br/> We assign of part-of-speech to each word in the input text. | 
| Expressivity | We incorporate any emoticons, punctuation such as exclamation or question marks, and letter case (upper or lower) as indicators of sentiment.|
| Semantics | We build resonance in the training data by mapping syntactically similar words. Sentiment evidence associated with one term can be applied to similar terms. We use neural networks to construct the associations. |

## Guidance for constructing inputs

+ For sentiment analysis, you can submit any text subject to the 10-KB limit per document, but we recommend splitting text into sentences. This generally leads to greater precision in sentiment predictions.

+ Include the language identifier in the request. It is not required, but the score will be neutral or inconclusive (0.5) if you omit it.

> [!Note]
> You can submit the same collection of documents for multiple operations: sentiment analysis, key phrase analysis, and language detection. Operations are independent so run them sequentially or in parallel.

## Examples of sentiment output

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

## Next steps

Use the built-in API testing console in the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c9) to call the API interactively. To use the console:

+ Provide an access key to your service. You can get it from the [Azure portal](https://portal.azure.com). 
+ Paste the JSON documents, in the format described for the API, into the Request Body section of the page. 
+ Click **Send** to analyze content and get the results. 
+ Review the response inline. Responses include a status code, latency (in milliseconds), and payload (in JSON). 

In addition to the console, we also recommend the [Quickstart](quick-start.md) for more practice and details about each operation.

## See also

 [Key phrase extraction concepts](text-analytics-concept-keyword-extraction.md)  
 [Language detection concepts](text-analytics-concept-language-detection.md) 