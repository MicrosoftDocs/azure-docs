---
title: Translator Text API Dictionary Lookup Method
titlesuffix: Azure Cognitive Services
description: Use the Translator Text API Dictionary Lookup method.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: reference
ms.date: 03/29/2018
ms.author: v-jansko
---

# Translator Text API 3.0: Dictionary Lookup

Provides alternative translations for a word and a small number of idiomatic phrases. Each translation has a part-of-speech and a list of back-translations. The back-translations enable a user to understand the translation in context. The [Dictionary Example](.\v3-0-dictionary-examples.md) operation allows further drill down to see example uses of each translation pair.

## Request URL

Send a `POST` request to:

```HTTP
https://api.cognitive.microsofttranslator.com/dictionary/lookup?api-version=3.0
```

## Request parameters

Request parameters passed on the query string are:

<table width="100%">
  <th width="20%">Query parameter</th>
  <th>Description</th>
  <tr>
    <td>api-version</td>
    <td>*Required parameter*.<br/>Version of the API requested by the client. Value must be `3.0`.</td>
  </tr>
  <tr>
    <td>from</td>
    <td>*Required parameter*.<br/>Specifies the language of the input text. The source language must be one of the [supported languages](.\v3-0-languages.md) included in the `dictionary` scope.</td>
  </tr>
  <tr>
    <td>to</td>
    <td>*Required parameter*.<br/>Specifies the language of the output text. The target language must be one of the [supported languages](.\v3-0-languages.md) included in the `dictionary` scope.</td>
  </tr>
</table>

Request headers include:

<table width="100%">
  <th width="20%">Headers</th>
  <th>Description</th>
  <tr>
    <td>_One authorization_<br/>_header_</td>
    <td>*Required request header*.<br/>See [available options for authentication](./v3-0-reference.md#authentication).</td>
  </tr>
  <tr>
    <td>Content-Type</td>
    <td>*Required request header*.<br/>Specifies the content type of the payload. Possible values are: `application/json`.</td>
  </tr>
  <tr>
    <td>Content-Length</td>
    <td>*Required request header*.<br/>The length of the request body.</td>
  </tr>
  <tr>
    <td>X-ClientTraceId</td>
    <td>*Optional*.<br/>A client-generated GUID to uniquely identify the request. You can omit this header if you include the trace ID in the query string using a query parameter named `ClientTraceId`.</td>
  </tr>
</table> 

## Request body

The body of the request is a JSON array. Each array element is a JSON object with a string property named `Text`, which represents the term to lookup.

```json
[
    {"Text":"fly"}
]
```

The following limitations apply:

* The array can have at most 10 elements.
* The text value of an array element cannot exceed 100 characters including spaces.

## Response body

A successful response is a JSON array with one result for each string in the input array. A result object includes the following properties:

  * `normalizedSource`: A string giving the normalized form of the source term. For example, if the request is "JOHN", the normalized form will be "john". The content of this field becomes the input to [lookup examples](.\v3-0-dictionary-examples.md).
    
  * `displaySource`: A string giving the source term in a form best suited for end-user display. For example, if the input is "JOHN", the display form will reflect the usual spelling of the name: "John". 

  * `translations`: A list of translations for the source term. Each element of the list is an object with the following properties:

    * `normalizedTarget`: A string giving the normalized form of this term in the target language. This value should be used as input to [lookup examples](.\v3-0-dictionary-examples.md).

    * `displayTarget`: A string giving the term in the target language and in a form best suited for end-user display. Generally, this will only differ from the `normalizedTarget` in terms of capitalization. For example, a proper noun like "Juan" will have `normalizedTarget = "juan"` and `displayTarget = "Juan"`.

    * `posTag`: A string associating this term with a part-of-speech tag.

        | Tag name | Description  |
        |----------|--------------|
        | ADJ      | Adjectives   |
        | ADV      | Adverbs      |
        | CONJ     | Conjunctions |
        | DET      | Determiners  |
        | MODAL    | Verbs        |
        | NOUN     | Nouns        |
        | PREP     | Prepositions |
        | PRON     | Pronouns     |
        | VERB     | Verbs        |
        | OTHER    | Other        |

        As an implementation note, these tags were determined by part-of-speech tagging the English side, and then taking the most frequent tag for each source/target pair. So if people frequently translate a Spanish word to a different part-of-speech tag in English, tags may end up being wrong (with respect to the Spanish word).

    * `confidence`: A value between 0.0 and 1.0 which represents the "confidence" (or perhaps more accurately, "probability in the training data") of that translation pair. The sum of confidence scores for one source word may or may not sum to 1.0. 

    * `prefixWord`: A string giving the word to display as a prefix of the translation. Currently, this is the gendered determiner of nouns, in languages that have gendered determiners. For example, the prefix of the Spanish word "mosca" is "la", since "mosca" is a feminine noun in Spanish. This is only dependent on the translation, and not on the source. If there is no prefix, it will be the empty string.
    
    * `backTranslations`: A list of "back translations" of the target. For example, source words that the target can translate to. The list is guaranteed to contain the source word that was requested (e.g., if the source word being looked up is "fly", then it is guaranteed that "fly" will be in the `backTranslations` list). However, it is not guaranteed to be in the first position, and often will not be. Each element of the `backTranslations` list is an object described by the following properties:

        * `normalizedText`: A string giving the normalized form of the source term that is a back-translation of the target. This value should be used as input to [lookup examples](.\v3-0-dictionary-examples.md).        

        * `displayText`: A string giving the source term that is a back-translation of the target in a form best suited for end-user display.

        * `numExamples`: An integer representing the number of examples that are available for this translation pair. Actual examples must be retrieved with a separate call to [lookup examples](.\v3-0-dictionary-examples.md). The number is mostly intended to facilitate display in a UX. For example, a user interface may add a hyperlink to the back-translation if the number of examples is greater than zero and show the back-translation as plain text if there are no examples. Note that the actual number of examples returned by a call to [lookup examples](.\v3-0-dictionary-examples.md) may be less than `numExamples`, because additional filtering may be applied on the fly to remove "bad" examples.
        
        * `frequencyCount`: An integer representing the frequency of this translation pair in the data. The main purpose of this field is to provide a user interface with a means to sort back-translations so the most frequent terms are first.

    > [!NOTE]
    > If the term being looked-up does not exist in the dictionary, the response is 200 (OK) but the `translations` list is an empty list.

## Examples

This example shows how to lookup alternative translations in Spanish of the English term `fly` .

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/dictionary/lookup?api-version=3.0&from=en&to=es" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'fly'}]"
```

---

The response body (abbreviated for clarity) is:

```
[
    {
        "normalizedSource":"fly",
        "displaySource":"fly",
        "translations":[
            {
                "normalizedTarget":"volar",
                "displayTarget":"volar",
                "posTag":"VERB",
                "confidence":0.4081,
                "prefixWord":"",
                "backTranslations":[
                    {"normalizedText":"fly","displayText":"fly","numExamples":15,"frequencyCount":4637},
                    {"normalizedText":"flying","displayText":"flying","numExamples":15,"frequencyCount":1365},
                    {"normalizedText":"blow","displayText":"blow","numExamples":15,"frequencyCount":503},
                    {"normalizedText":"flight","displayText":"flight","numExamples":15,"frequencyCount":135}
                ]
            },
            {
                "normalizedTarget":"mosca",
                "displayTarget":"mosca",
                "posTag":"NOUN",
                "confidence":0.2668,
                "prefixWord":"",
                "backTranslations":[
                    {"normalizedText":"fly","displayText":"fly","numExamples":15,"frequencyCount":1697},
                    {"normalizedText":"flyweight","displayText":"flyweight","numExamples":0,"frequencyCount":48},
                    {"normalizedText":"flies","displayText":"flies","numExamples":9,"frequencyCount":34}
                ]
            },
            //
            // ...list abbreviated for documentation clarity
            //
        ]
    }
]
```

This example shows what happens when the term being looked up does not exist for the valid dictionary pair.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/dictionary/lookup?api-version=3.0&from=en&to=es" -H "X-ClientTraceId: 875030C7-5380-40B8-8A03-63DACCF69C11" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'fly123456'}]"
```

---

Since the term is not found in the dictionary, the response body includes an empty `translations` list.

```
[
    {
        "normalizedSource":"fly123456",
        "displaySource":"fly123456",
        "translations":[]
    }
]
```
