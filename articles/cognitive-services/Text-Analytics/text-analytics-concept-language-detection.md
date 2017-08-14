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

The [language detection API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) evaluates text input and for each document returns a language code in [ISO 6391](https://www.iso.org/standard/22109.html) format and a score indicating the strength of the analysis. Text Analytics recognizes up to 120 languages.

## Common use cases

This capability is useful for content stores that collect arbitrary text, in possibly any number of languages, which you might want to then parse to determine which languages are represented and the frequency at which they occur. From the output, you could trim unknown or inconclusive results, or investigate the findings more deeply to see if there is corruption in the form of unexpected non-text content. For more information on handling results, see [How to work with analyses outputs](text-analytics-howto-output.md).

> [!Note]
> If you are submitting the same collection of documents for sentiment analysis, key phrase analysis, and language detection, the `language` code used for sentiment analysis and key phrase extraction is ignored for language detection.

## Examples of language output

Standard output assumes the following form (using English as an example). A positive score of 1.0 expresses the highest possible confidence level of the analysis.

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

Ambiguous content, such as a text block consisting solely of Arabic numerals, the system returns `(Unknown)`.

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

Mixed language content within the same document returns the language with the largest representation in the content, but with a lower positive rating to reflect the marginal strength of that assessment. In the following example, input is a blend of English, Spanish, and French:

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

## Next steps

Use the built-in API testing console in the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) to call the API interactively. To use the console:

+ Provide an access key to your service. You can get it from the [Azure portal](https://portal.azure.com). 
+ Paste the JSON documents, in the format described for the API, into the Request Body section of the page. 
+ Click **Send** to analyze content and get the results. 
+ Review the response inline. Responses include a status code, latency (in milliseconds), and payload (in JSON). 

In addition to the console, we also recommend the [Quickstart](quick-start.md) for more practice and details about each operation.

## See also

 [Sentiment analysis concepts](text-analytics-concept-sentiment-analysis.md) 
 [Key phrase extraction concepts](text-analytics-concept-keyword-extraction.md)  
