---
title: Translator Text API V3.0 Reference
titlesuffix: Azure Cognitive Services
description: Reference documentation for the Translator Text API V3.0.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: reference
ms.date: 03/29/2018
ms.author: v-jansko
---

# Translator Text API v3.0

## What's new?

Version 3 of the Translator Text API provides a modern JSON-based Web API. It improves usability and performance by consolidating existing features into fewer operations and it provides new features.

 * Transliteration to convert text in one language from one script to another script.
 * Translation to multiple languages in one request.
 * Language detection, translation, and transliteration in one request.
 * Dictionary to lookup alternative translations of a term, to find back-translations and examples showing terms used in context.
 * More informative language detection results.

## Base URLs

Microsoft Translator is served out of multiple datacenter locations. Currently they are located in 6 [Azure regions](https://azure.microsoft.com/global-infrastructure/regions):

* **Americas:** West US 2 and West Central US 
* **Asia Pacific:** Southeast Asia and Korea South
* **Europe:** North Europe and West Europe

Requests to the Microsoft Translator Text API are in most cases handled by the datacenter that is closest to where the request originated. In case of a datacenter failure, the request may be routed outside of the region.

To force the request to be handled by a specific datacenter, change the Global endpoint in the API request to the desired regional endpoint:

|Description|Region|Base URL|
|:--|:--|:--|
|Azure|Global|	api.cognitive.microsofttranslator.com|
|Azure|North America|	api-nam.cognitive.microsofttranslator.com|
|Azure|Europe|	api-eur.cognitive.microsofttranslator.com|
|Azure|Asia Pacific|	api-apc.cognitive.microsofttranslator.com|


## Authentication

Subscribe to Translator Text API in Microsoft Cognitive Services and use your subscription key (available in the Azure portal) to authenticate. 

The simplest way is to pass your Azure secret key to the Translator service using request header `Ocp-Apim-Subscription-Key`.

An alternative is to use your secret key to obtain an authorization token from the token service. Then, you pass the authorization token to the Translator service using the `Authorization` request header. To obtain an authorization token, make a `POST` request to the following URL:

| Environment     | Authentication service URL                                |
|-----------------|-----------------------------------------------------------|
| Azure           | `https://api.cognitive.microsoft.com/sts/v1.0/issueToken` |

Here are example requests to obtain a token given a secret key:

```
// Pass secret key using header
curl --header 'Ocp-Apim-Subscription-Key: <your-key>' --data "" 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken'
// Pass secret key using query string parameter
curl --data "" 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken?Subscription-Key=<your-key>'
```

A successful request returns the encoded access token as plain text in the response body. The valid token is passed to the Translator service as a bearer token in the Authorization.

```
Authorization: Bearer <Base64-access_token>
```

An authentication token is valid for 10 minutes. The token should be re-used when making multiple calls to the Translator APIs. However, if your program makes requests to the Translator API over an extended period of time, then your program must request a new access token at regular intervals (e.g. every 8 minutes).

To summarize, a client request to the Translator API will include one authorization header taken from the following table:

<table width="100%">
  <th width="30%">Headers</th>
  <th>Description</th>
  <tr>
    <td>Ocp-Apim-Subscription-Key</td>
    <td>*Use with Cognitive Services subscription if you are passing your secret key*.<br/>The value is the Azure secret key for your subscription to Translator Text API.</td>
  </tr>
  <tr>
    <td>Authorization</td>
    <td>*Use with Cognitive Services subscription if you are passing an authentication token.*<br/>The value is the Bearer token: `Bearer <token>`.</td>
  </tr>
</table> 

## Errors

A standard error response is a JSON object with name/value pair named `error`. The value is also a JSON object with properties:

  * `code`: A server-defined error code.

  * `message`: A string giving a human-readable representation of the error.

For example, a customer with a free trial subscription would receive the following error once the free quota is exhausted:

```
{
  "error": {
    "code":403001,
    "message":"The operation is not allowed because the subscription has exceeded its free quota."
    }
}
```
The error code is a 6-digit number combining the 3-digit HTTP status code followed by a 3-digit number to further categorize the error. Common error codes are:

| Code | Description |
|:----|:-----|
| 400000| One of the request inputs is not valid.|
| 400001| The "scope" parameter is invalid.|
| 400002| The "category" parameter is invalid.|
| 400003| A language specifier is missing or invalid.|
| 400004| A target script specifier ("To script") is missing or invalid.|
| 400005| An input text is missing or invalid.|
| 400006| The combination of language and script is not valid.|
| 400018| A source script specifier ("From script") is missing or invalid.|
| 400019| One of the specified language is not supported.|
| 400020| One of the elements in the array of input text is not valid.|
| 400021| The API version parameter is missing or invalid.|
| 400023| One of the specified language pair is not valid.|
| 400035| The source language ("From" field) is not valid.|
| 400036| The target language ("To" field) is missing or invalid.|
| 400042| One of the options specified ("Options" field) is not valid.|
| 400043| The client trace ID (ClientTraceId field or X-ClientTranceId header) is missing or invalid.|
| 400050| The input text is too long.|
| 400064| The "translation" parameter is missing or invalid.|
| 400070| The number of target scripts (ToScript parameter) does not match the number of target languages (To parameter).|
| 400071| The value is not valid for TextType.|
| 400072| The array of input text has too many elements.|
| 400073| The script parameter is not valid.|
| 400074| The body of the request is not valid JSON.|
| 400075| The language pair and category combination is not valid.|
| 400077| The maximum request size has been exceeded.|
| 400079| The custom system requested for translation between from and to language does not exist.|
| 401000| The request is not authorized because credentials are missing or invalid.|
| 401015| "The credentials provided are for the Speech API. This request requires credentials for the Text API. Please use a subscription to Translator Text API."|
| 403000| The operation is not allowed.|
| 403001| The operation is not allowed because the subscription has exceeded its free quota.|
| 405000| The request method is not supported for the requested resource.|
| 408001| The custom translation system requested is not yet available. Please retry in a few minutes.|
| 415000| The Content-Type header is missing or invalid.|
| 429000, 429001, 429002| The server rejected the request because the client is sending too many requests. Reduce the frequency of requests to avoid throttling.|
| 500000| An unexpected error occurred. If the error persists, report it with date/time of error, request identifier from response header X-RequestId, and client identifier from request header X-ClientTraceId.|
| 503000| Service is temporarily unavailable. Please retry. If the error persists, report it with date/time of error, request identifier from response header X-RequestId, and client identifier from request header X-ClientTraceId.|

