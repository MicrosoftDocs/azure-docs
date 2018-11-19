---
title: Translator Text API Dictionary Examples Method
titlesuffix: Azure Cognitive Services
description: Use the Translator Text API Dictionary Examples method.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: reference
ms.date: 03/29/2018
ms.author: v-jansko
---

# Translator Text API 3.0: Dictionary Examples

Provides examples that show how terms in the dictionary are used in context. This operation is used in tandem with [Dictionary lookup](.\v3-0-dictionary-lookup.md).

## Request URL

Send a `POST` request to:

```HTTP
https://api.cognitive.microsofttranslator.com/dictionary/examples?api-version=3.0
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

The body of the request is a JSON array. Each array element is a JSON object with the following properties:

  * `Text`: A string specifying the term to lookup. This should be the value of a `normalizedText` field from the back-translations of a previous [Dictionary lookup](.\v3-0-dictionary-lookup.md) request. It can also be the value of the `normalizedSource` field.

  * `Translation`: A string specifying the translated text previously returned by the [Dictionary lookup](.\v3-0-dictionary-lookup.md) operation. This should be the value from the `normalizedTarget` field in the `translations` list of the [Dictionary lookup](.\v3-0-dictionary-lookup.md) response. The service will return examples for the specific source-target word-pair.

An example is:

```json
[
    {"Text":"fly", "Translation":"volar"}
]
```

The following limitations apply:

* The array can have at most 10 elements.
* The text value of an array element cannot exceed 100 characters including spaces.

## Response body

A successful response is a JSON array with one result for each string in the input array. A result object includes the following properties:

  * `normalizedSource`: A string giving the normalized form of the source term. Generally, this should be identical to the value of the `Text` field at the matching list index in the body of the request.
    
  * `normalizedTarget`: A string giving the normalized form of the target term. Generally, this should be identical to the value of the `Translation` field at the matching list index in the body of the request.
  
  * `examples`: A list of examples for the (source term, target term) pair. Each element of the list is an object with the following properties:

    * `sourcePrefix`: The string to concatenate _before_ the value of `sourceTerm` to form a complete example. Do not add a space character, since it is already there when it should be. This value may be an empty string.

    * `sourceTerm`: A string equal to the actual term looked up. The string is added with `sourcePrefix` and `sourceSuffix` to form the complete example. Its value is separated so it can be marked in a user interface, e.g., by bolding it.

    * `sourceSuffix`: The string to concatenate _after_ the value of `sourceTerm` to form a complete example. Do not add a space character, since it is already there when it should be. This value may be an empty string.

    * `targetPrefix`: A string similar to `sourcePrefix` but for the target.

    * `targetTerm`: A string similar to `sourceTerm` but for the target.

    * `targetSuffix`: A string similar to `sourceSuffix` but for the target.

    > [!NOTE]
    > If there are no examples in the dictionary, the response is 200 (OK) but the `examples` list is an empty list.

## Examples

This example shows how to lookup examples for the pair made up of the English term `fly` and its Spanish translation `volar`.

# [curl](#tab/curl)

```
curl -X POST "https://api.cognitive.microsofttranslator.com/dictionary/examples?api-version=3.0&from=en&to=es" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'fly', 'Translation':'volar'}]"
```

---

The response body (abbreviated for clarity) is:

```
[
    {
        "normalizedSource":"fly",
        "normalizedTarget":"volar",
        "examples":[
            {
                "sourcePrefix":"They need machines to ",
                "sourceTerm":"fly",
                "sourceSuffix":".",
                "targetPrefix":"Necesitan máquinas para ",
                "targetTerm":"volar",
                "targetSuffix":"."
            },      
            {
                "sourcePrefix":"That should really ",
                "sourceTerm":"fly",
                "sourceSuffix":".",
                "targetPrefix":"Eso realmente debe ",
                "targetTerm":"volar",
                "targetSuffix":"."
            },
            //
            // ...list abbreviated for documentation clarity
            //
        ]
    }
]
```
