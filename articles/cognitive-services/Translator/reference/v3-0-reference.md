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

Text API v3.0 is available in the following cloud:

| Description | Region | Base URL                                        |
|-------------|--------|-------------------------------------------------|
| Azure       | Global | api.cognitive.microsofttranslator.com           |


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
    "code":403000,
    "message":"The subscription has exceeded its free quota."
    }
}
```
