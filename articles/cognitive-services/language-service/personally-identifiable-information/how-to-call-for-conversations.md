---
title: How to detect Personally Identifiable Information (PII) in conversations.
titleSuffix: Azure Cognitive Services
description: This article will show you how to extract PII from chat and spoken transcripts and redact identifiable information.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 05/10/2022
ms.author: 
ms.custom:
---


# How to detect and redact Personally Identifying Information (PII) in conversations

The Conversational PII feature can evaluate conversations to extract sensitive information (PII) in the content across several pre-defined categories and redact them. This API operates on both transcribed text (referenced as transcripts) and chats.
For transcripts, the API also enables redaction of audio segments, which contains the PII information by providing the audio timing information for those audio segments.

## Determine how to process the data (optional)

### Specify the PII detection model

By default, this feature will use the latest available AI model on your input. You can also configure your API requests to use a specific [model version](../concepts/model-lifecycle.md).

### Input languages

Currently the conversational PII preview API only supports English language and is available in the following 3 regions East US, North Europe and UK south.

## Submitting data

You can submit the input to the API as list of conversation items. Analysis is performed upon receipt of the request. Because the API is asynchronous, there may be a delay between sending an API request, and receiving the results. For information on the size and number of requests you can send per minute and second, see the data limits below.

When using the async feature, the API results are available for 24 hours from the time the request was ingested, and is indicated in the response. After this time period, the results are purged and are no longer available for retrieval.

When you submit data to conversational PII, we can send one conversation (chat or spoken) per request.

The API will attempt to detect all the [defined entity categories](concepts/conversations-entity-categories.md) for a given conversation input. If you want to specify which entities will be detected and returned, use the optional `piiCategories` parameter with the appropriate entity categories.

For spoken transcripts, the entities detected will be returned on the `redactionSource` parameter value provided. Currently, the supported values for `redactionSource` are `text`, `lexical`, `itn`, and `maskedItn` (which maps to Microsoft Speech to Text API's `display`\\`displayText`, `lexical`, `itn` and `maskedItn` format respectively). Additionally, for the spoken transcript input, this API will also provide audio timing information to empower audio redaction. For using the audioRedaction feature, use the optional `includeAudioRedaction` flag with `true` value. The audio redaction is performed based on the lexical input format.

## Getting PII results

When you get results from PII detection, you can stream the results to an application or save the output to a file on the local system. The API response will include [recognized entities](concepts/conversations-entity-categories.md), including their categories and sub-categories, and confidence scores. The text string with the PII entities redacted will also be returned.

## Service and data limits

[!INCLUDE [service limits article](../includes/service-limits-link.md)]

