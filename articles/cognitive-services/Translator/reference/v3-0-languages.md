---
title: Translator Text API Languages Method
titlesuffix: Azure Cognitive Services
description: Use the Translator Text API Languages method.
services: cognitive-services
author: swmachan
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 02/01/2019
ms.author: swmachan
---

# Translator Text API 3.0: Languages

Gets the set of languages currently supported by other operations of the Translator Text API. 

## Request URL

Send a `GET` request to:
```HTTP
https://api.cognitive.microsofttranslator.com/languages?api-version=3.0
```

## Request parameters

Request parameters passed on the query string are:

<table width="100%">
  <th width="20%">Query parameter</th>
  <th>Description</th>
  <tr>
    <td>api-version</td>
    <td><em>Required parameter</em>.<br/>Version of the API requested by the client. Value must be `3.0`.</td>
  </tr>
  <tr>
    <td>scope</td>
    <td>*Optional parameter*.<br/>A comma-separated list of names defining the group of languages to return. Allowed group names are: `translation`, `transliteration` and `dictionary`. If no scope is given, then all groups are returned, which is equivalent to passing `scope=translation,transliteration,dictionary`. To decide which set of supported languages is appropriate for your scenario, see the description of the [response object](#response-body).</td>
  </tr>
</table> 

Request headers are:

<table width="100%">
  <th width="20%">Headers</th>
  <th>Description</th>
  <tr>
    <td>Accept-Language</td>
    <td>*Optional request header*.<br/>The language to use for user interface strings. Some of the fields in the response are names of languages or names of regions. Use this parameter to define the language in which these names are returned. The language is specified by providing a well-formed BCP 47 language tag. For instance, use the value `fr` to request names in French or use the value `zh-Hant` to request names in Chinese Traditional.<br/>Names are provided in the English language when a target language is not specified or when localization is not available.
    </td>
  </tr>
  <tr>
    <td>X-ClientTraceId</td>
    <td>*Optional request header*.<br/>A client-generated GUID to uniquely identify the request.</td>
  </tr>
</table> 

Authentication isn't required to get language resources.

## Response body

A client uses the `scope` query parameter to define which groups of languages it's interested in.

* `scope=translation` provides languages supported to translate text from one language to another language;

* `scope=transliteration` provides capabilities for converting text in one language from one script to another script;

* `scope=dictionary` provides language pairs for which `Dictionary` operations return data.

A client may retrieve several groups simultaneously by specifying a comma-separated list of names. For example, `scope=translation,transliteration,dictionary` would return supported languages for all groups.

A successful response is a JSON object with one property for each requested group:

```json
{
    "translation": {
        //... set of languages supported to translate text (scope=translation)
    },
    "transliteration": {
        //... set of languages supported to convert between scripts (scope=transliteration)
    },
    "dictionary": {
        //... set of languages supported for alternative translations and examples (scope=dictionary)
    }
}
```

The value for each property is as follows.

* `translation` property

  The value of the `translation` property is a dictionary of (key, value) pairs. Each key is a BCP 47 language tag. A key identifies a language for which text can be translated to or translated from. The value associated with the key is a JSON object with properties that describe the language:

  * `name`: Display name of the language in the locale requested via `Accept-Language` header.

  * `nativeName`: Display name of the language in the locale native for this language.

  * `dir`: Directionality, which is `rtl` for right-to-left languages or `ltr` for left-to-right languages.

  An example is:
          
  ```json
  {
    "translation": {
      ...
      "fr": {
        "name": "French",
        "nativeName": "Français",
        "dir": "ltr"
      },
      ...
    }
  }
  ```

* `transliteration` property

  The value of the `transliteration` property is a dictionary of (key, value) pairs. Each key is a BCP 47 language tag. A key identifies a language for which text can be converted from one script to another script. The value associated with the key is a JSON object with properties that describe the language and its supported scripts:

  * `name`: Display name of the language in the locale requested via `Accept-Language` header.

  * `nativeName`: Display name of the language in the locale native for this language.

  * `scripts`: List of scripts to convert from. Each element of the `scripts` list has properties:

    * `code`: Code identifying the script.

    * `name`: Display name of the script in the locale requested via `Accept-Language` header.

    * `nativeName`: Display name of the language in the locale native for the language.

    * `dir`: Directionality, which is `rtl` for right-to-left languages or `ltr` for left-to-right languages.

    * `toScripts`: List of scripts available to convert text to. Each element of the `toScripts` list has properties `code`, `name`, `nativeName`, and `dir` as described earlier.

  An example is:

  ```json
  {
    "transliteration": {
      ...
      "ja": {
        "name": "Japanese",
        "nativeName": "日本語",
        "scripts": [
          {
            "code": "Jpan",
            "name": "Japanese",
            "nativeName": "日本語",
            "dir": "ltr",
            "toScripts": [
              {
                "code": "Latn",
                "name": "Latin",
                "nativeName": "ラテン語",
                "dir": "ltr"
              }
            ]
          },
          {
            "code": "Latn",
            "name": "Latin",
            "nativeName": "ラテン語",
            "dir": "ltr",
            "toScripts": [
              {
                "code": "Jpan",
                "name": "Japanese",
                "nativeName": "日本語",
                "dir": "ltr"
              }
            ]
          }
        ]
      },
      ...
    }
  }
  ```

* `dictionary` property

  The value of the `dictionary` property is a dictionary of (key, value) pairs. Each key is a BCP 47 language tag. The key identifies a language for which alternative translations and back-translations are available. The value is a JSON object that describes the source language and the target languages with available translations:

  * `name`: Display name of the source language in the locale requested via `Accept-Language` header.

  * `nativeName`: Display name of the language in the locale native for this language.

  * `dir`: Directionality, which is `rtl` for right-to-left languages or `ltr` for left-to-right languages.

  * `translations`: List of languages with alterative translations and examples for the query expressed in the source language. Each element of the `translations` list has properties:

    * `name`: Display name of the target language in the locale requested via `Accept-Language` header.

    * `nativeName`: Display name of the target language in the locale native for the target language.

    * `dir`: Directionality, which is `rtl` for right-to-left languages or `ltr` for left-to-right languages.
    
    * `code`: Language code identifying the target language.

  An example is:

  ```json
  "es": {
    "name": "Spanish",
    "nativeName": "Español",
    "dir": "ltr",
    "translations": [
      {
        "name": "English",
        "nativeName": "English",
        "dir": "ltr",
        "code": "en"
      }
    ]
  },
  ```

The structure of the response object will not change without a change in the version of the API. For the same version of the API, the list of available languages may change over time because Microsoft Translator continually extends the list of languages supported by its services.

The list of supported languages will not change frequently. To save network bandwidth and improve responsiveness, a client application should consider caching language resources and the corresponding entity tag (`ETag`). Then, the client application can periodically (for example, once every 24 hours) query the service to fetch the latest set of supported languages. Passing the current `ETag` value in an `If-None-Match` header field will allow the service to optimize the response. If the resource has not been modified, the service will return status code 304 and an empty response body.

## Response headers

<table width="100%">
  <th width="20%">Headers</th>
  <th>Description</th>
  <tr>
    <td>ETag</td>
    <td>Current value of the entity tag for the requested groups of supported languages. To make subsequent requests more efficient, the client may send the `ETag` value in an `If-None-Match` header field.
    </td>
  </tr>
  <tr>
    <td>X-RequestId</td>
    <td>Value generated by the service to identify the request. It is used for troubleshooting purposes.</td>
  </tr>
</table> 

## Response status codes

The following are the possible HTTP status codes that a request returns. 

<table width="100%">
  <th width="20%">Status Code</th>
  <th>Description</th>
  <tr>
    <td>200</td>
    <td>Success.</td>
  </tr>
  <tr>
    <td>304</td>
    <td>The resource has not been modified since the version specified by request headers `If-None-Match`.</td>
  </tr>
  <tr>
    <td>400</td>
    <td>One of the query parameters is missing or not valid. Correct request parameters before retrying.</td>
  </tr>
  <tr>
    <td>429</td>
    <td>The server rejected the request because the client has exceeded request limits.</td>
  </tr>
  <tr>
    <td>500</td>
    <td>An unexpected error occurred. If the error persists, report it with: date and time of the failure, request identifier from response header `X-RequestId`, and client identifier from request header `X-ClientTraceId`.</td>
  </tr>
  <tr>
    <td>503</td>
    <td>Server temporarily unavailable. Retry the request. If the error persists, report it with: date and time of the failure, request identifier from response header `X-RequestId`, and client identifier from request header `X-ClientTraceId`.</td>
  </tr>
</table> 

If an error occurs, the request will also return a JSON error response. The error code is a 6-digit number combining the 3-digit HTTP status code followed by a 3-digit number to further categorize the error. Common error codes can be found on the [v3 Translator Text API reference page](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#errors). 

## Examples

The following example shows how to retrieve languages supported for text translation.

# [curl](#tab/curl)

```
curl "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation"
```

---
