---
title: Translator Dictionary Examples Method
titleSuffix: Azure AI services
description: The Translator Dictionary Examples method provides examples that show how terms in the dictionary are used in context.
#services: cognitive-services
author: laujan
manager: nitinme

ms.service: azure-ai-translator
ms.topic: reference
ms.date: 09/19/2023
ms.author: lajanuar
---
<!-- markdownlint-disable MD033 -->

# Translator 3.0: Dictionary Examples

Provides examples that show how terms in the dictionary are used in context. This operation is used in tandem with [Dictionary lookup](./v3-0-dictionary-lookup.md).

## Request URL

Send a `POST` request to:

```HTTP
https://api.cognitive.microsofttranslator.com/dictionary/examples?api-version=3.0
```

_See_ [**Virtual Network Support**](v3-0-reference.md#virtual-network-support) for Translator service selected network and private endpoint configuration and support.

## Request parameters

Request parameters passed on the query string are:

| Query Parameter | Description |
| --------- | ----------- |
| api-version <img width=200/> | **Required parameter**.<br>Version of the API requested by the client. Value must be `3.0`. |
| from | **Required parameter**.<br>Specifies the language of the input text. The source language must be one of the [supported languages](./v3-0-languages.md) included in the `dictionary` scope. |
| to | **Required parameter**.<br>Specifies the language of the output text. The target language must be one of the [supported languages](./v3-0-languages.md) included in the `dictionary` scope.  |

Request headers include:

| Headers  | Description |
| ------ | ----------- |
| Authentication header(s) <img width=200/>  | **Required request header**.<br>See [Authentication](v3-0-reference.md#authentication)>available options for authentication</a>. |
| Content-Type | **Required request header**.<br>Specifies the content type of the payload. Possible values are: `application/json`. |
| Content-Length   | **Required request header**.<br>The length of the request body. |
| X-ClientTraceId   | **Optional**.<br>A client-generated GUID to uniquely identify the request. You can omit this header if you include the trace ID in the query string using a query parameter named `ClientTraceId`. |

## Request body

The body of the request is a JSON array. Each array element is a JSON object with the following properties:

* `Text`: A string specifying the term to look up. This property should be the value of a `normalizedText` field from the back-translations of a previous [Dictionary lookup](./v3-0-dictionary-lookup.md) request. It can also be the value of the `normalizedSource` field.

* `Translation`: A string specifying the translated text previously returned by the [Dictionary lookup](./v3-0-dictionary-lookup.md) operation. This property should be the value from the `normalizedTarget` field in the `translations` list of the [Dictionary lookup](./v3-0-dictionary-lookup.md) response. The service returns examples for the specific source-target word-pair.

An example is:

```json
[
    {"Text":"fly", "Translation":"volar"}
]
```

The following limitations apply:

* The array can have at most 10 elements.
* The text value of an array element can't exceed 100 characters including spaces.

## Response body

A successful response is a JSON array with one result for each string in the input array. A result object includes the following properties:

* `normalizedSource`: A string giving the normalized form of the source term. Generally, this property should be identical to the value of the `Text` field at the matching list index in the body of the request.

* `normalizedTarget`: A string giving the normalized form of the target term. Generally, this property should be identical to the value of the `Translation` field at the matching list index in the body of the request.

* `examples`: A list of examples for the (source term, target term) pair. Each element of the list is an object with the following properties:

* `sourcePrefix`: The string to concatenate _before_ the value of `sourceTerm` to form a complete example. Don't add a space character, since it's already there when it should be. This value may be an empty string.

* `sourceTerm`: A string equal to the actual term looked up. The string is added with `sourcePrefix` and `sourceSuffix` to form the complete example. Its value is separated so it can be marked in a user interface, for example, by bolding it.

  * `sourceSuffix`: The string to concatenate _after_ the value of `sourceTerm` to form a complete example. Don't add a space character, since it's already there when it should be. This value may be an empty string.

  * `targetPrefix`: A string similar to `sourcePrefix` but for the target.

  * `targetTerm`: A string similar to `sourceTerm` but for the target.

  * `targetSuffix`: A string similar to `sourceSuffix` but for the target.

    > [!NOTE]
    > If there are no examples in the dictionary, the response is 200 (OK) but the `examples` list is an empty list.

## Examples

This example shows how to look up examples for the pair made up of the English term `fly` and its Spanish translation `volar`.

```curl
curl -X POST "https://api.cognitive.microsofttranslator.com/dictionary/examples?api-version=3.0&from=en&to=es" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json" -d "[{'Text':'fly', 'Translation':'volar'}]"
```

The response body (abbreviated for clarity) is:

```json
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
