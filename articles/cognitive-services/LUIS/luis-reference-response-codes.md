---
title: API HTTP response codes - LUIS
titleSuffix: Azure Cognitive Services
description:  Understand what HTTP response codes are returned from the LUIS Authoring and Endpoint APIs
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: reference
ms.date: 03/04/2019
ms.author: diberry
---

# Common API response codes and their meaning

The [authoring](https://go.microsoft.com/fwlink/?linkid=2092087) and [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) APIs return HTTP response codes. While response messages include information specific to a request, the HTTP response status code is general.

## Common status codes
The following table lists some of the most common HTTP response status codes for the [authoring](https://go.microsoft.com/fwlink/?linkid=2092087) and [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) APIs:

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

## Next steps

* REST API [authoring](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f) and [endpoint](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) documentation
