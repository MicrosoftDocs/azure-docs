---
title: Language Understanding (LUIS) API HTTP response codes - Azure | Microsoft Docs
titleSuffix: Azure
description:  Understand what HTTP response codes are returned from the LUIS Authoring and Endpoint APIs
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 04/16/2018
ms.author: diberry
---

# LUIS API HTTP response codes
The [authoring](https://aka.ms/luis-authoring-apis) and [endpoint](https://aka.ms/luis-endpoint-apis) APIs return HTTP response codes. While response messages include information specific to a request, the HTTP response status code is general. 

## Common status codes
The following table lists some of the most common HTTP response status codes for the [authoring](https://aka.ms/luis-authoring-apis) and [endpoint](https://aka.ms/luis-endpoint-apis) APIs:

|Code|API|Explanation|
|:--|--|--|
|400|Authoring, Endpoint|request's parameters are incorrect meaning the required parameters are missing, malformed, or too large|
|400|Authoring, Endpoint|request's body is incorrect meaning the JSON is missing, malformed, or too large|
|401|Authoring|used endpoint subscription key, instead of authoring key|
|401|Authoring, Endpoint|invalid, malformed, or empty key|
|401|Authoring, Endpoint| key doesn't match region|
|401|Authoring|you are not the owner or collaborator|
|401|Authoring|invalid order of API calls|
|403|Authoring, Endpoint|total monthly key quota limit exceeded|
|409|Endpoint|application is still loading|
|410|Endpoint|application needs to be retrained and republished|
|414|Endpoint|query exceeds maximum character limit|
|429|Authoring, Endpoint|Rate limit is exceeded (requests/second)|