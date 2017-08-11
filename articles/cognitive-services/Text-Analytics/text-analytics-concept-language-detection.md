---
title: 'Language detection in Text Analytics API (Microsoft Cognitive Services on Azure) | Microsoft Docs'
description: Guidance, best practices, and tips for language detection using Microsoft Cognitive Services on Azure.
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
# Language detection in Text Analytics API

The [language detection](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) API evaluates text input and for each document returns a language code in [ISO 6391](https://www.iso.org/standard/22109.html) format and a score indicating the strength of the analysis. Text Analytics recognizes up to 102 languages.

> [!Note]
> If you are submitting the same collection of documents for sentiment analysis, key phrase analysis, and language detection, the `language` code used for sentiment analysis and key phrase extraction is ignored in language detection.

## Common use cases

This capability is useful for content stores that collect text from multiple languages, which you might parse to determine all of the languages represented in the collection and the frequency of certain languages. You could trim unknown or inconclusive results, or investigate the findings more deeply to see if there is corruption in the form of unexpected non-text content. For more guidance on handling results, see [How to work with analyses outputs](text-analytics-howto-output.md).

## Examples of language detection output

Standard output assumes the following form (using English as an example). A positive score of 1.0 expresses a confidence level of the analysis.

```
      "id": "4",
      "detectedLanguages": [
        {
          "name": "English",
          "iso6391Name": "en",
          "score": 1.0
        }
      ]
    },
```

Ambiguous content, such as a text block consisting solely of arabic numerals, the system returns `(Unknown)`.

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

Mixed language content within the same document returns the language with the largest representation in the content, but with a lower positive rating to reflect the marginal strength of that assessement.

Input consisting of a blend of English, Spanish, and French:

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

Output is the predominant language, with a score of less than 1.0 indicating a weaker signal strength.

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

## Next steps

Use the built-in API testing console in the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) to call the API interactively. To use the console:

+ Provide an access key to your service. You can get it from the [Azure portal](https://portal.azure.com). 
+ Paste the JSON documents, in the format described for the API. 
+ Click **Send** to analyze content and get the results. 
+ Review the reponse inline. Reponses include a status code, latency (in milliseconds), and payload (in JSON). 

We also recommend the [Quickstart](quick-start.md) for additional practice and detail about each operation.

## See also

 [Sentiment analysis concepts](text-analytics-concept-sentiment-analysis.md) 
 [Key phrase extraction concepts](text-analytics-concept-keyword-extraction.md)  
