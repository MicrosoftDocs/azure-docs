---
title: Translator Container Translate Method
titleSuffix: Azure Cognitive Services
description: Understand the parameters, headers, and body messages for the Translate method of Azure Cognitive Services Translator container to translate text.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 05/06/2021
ms.author: lajanuar
---

# Translator container: translate text

## Request URL

Send a `POST` request to:

```HTTP
http://localhost:5000/translate?api-version=3.0&from={source language}&to={target language}
```

## Request parameters

Request parameters passed on the query string are:

### Required parameters

|Query parameter|Description|
|--- |--- |
|api-version|Required parameter.Version of the API requested by the client. Value must be 3.0.|
|to|Required parameter.Specifies the language of the output text. The target language must be one of the supported languages included in the translation scope. For example, use to=de to translate to German.It's possible to translate to multiple languages simultaneously by repeating the parameter in the query string. For example, use to=de&to=it to translate to German and Italian.|

### Optional parameters

|Query parameter|Description|
|--- |--- |
|from|Optional parameter.Specifies the language of the input text. Find which languages are available to translate from by looking up supported languages using the translation scope. If the from parameter is not specified, automatic language detection is applied to determine the source language. You must use the from parameter rather than autodetection when using the dynamic dictionary feature.|
|textType|Optional parameter.Defines whether the text being translated is plain text or HTML text. Any HTML needs to be a well-formed, complete element. Possible values are: plain (default) or html.|
|profanityAction|Optional parameter.Specifies how profanities should be treated in translations. Possible values are: NoAction (default), Marked or Deleted. To understand ways to treat profanity, see Profanity handling.|
|profanityMarker|Optional parameter.Specifies how profanities should be marked in translations. Possible values are: Asterisk (default) or Tag. To understand ways to treat profanity, see Profanity handling.|
|includeAlignment|Optional parameter.Specifies whether to include alignment projection from source text to translated text. Possible values are: true or false (default).|
|includeSentenceLength|Optional parameter.Specifies whether to include sentence boundaries for the input text and the translated text. Possible values are: true or false (default).|
|suggestedFrom|Optional parameter.Specifies a fallback language if the language of the input text can't be identified. Language auto-detection is applied when the from parameter is omitted. If detection fails, the suggestedFrom language will be assumed.|
|fromScript|Optional parameter.Specifies the script of the input text.|
|toScript|Optional parameter.Specifies the script of the translated text.|
|allowFallback|Optional parameter.Specifies that the service is allowed to fallback to a general system when a custom system does not exist. Possible values are: true (default) or false.allowFallback=false specifies that the translation should only use systems trained for the category specified by the request. If a translation for language X to language Y requires chaining through a pivot language E, then all the systems in the chain (X->E and E->Y) will need to be custom and have the same category. If no system is found with the specific category, the request will return a 400 status code. allowFallback=true specifies that the service is allowed to fallback to a general system when a custom system does not exist.|
