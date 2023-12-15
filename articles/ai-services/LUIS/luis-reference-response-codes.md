---
title: API HTTP response codes - LUIS
titleSuffix: Azure AI services
description:  Understand what HTTP response codes are returned from the LUIS Authoring and Endpoint APIs
#services: cognitive-services
author: aahill
ms.author: aahi
manager: nitinme
ms.custom: seodec18
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: reference
ms.date: 06/14/2022

---

# Common API response codes and their meaning

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


The [authoring](https://go.microsoft.com/fwlink/?linkid=2092087) and [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) APIs return HTTP response codes. While response messages include information specific to a request, the HTTP response status code is general.

## Common status codes
The following table lists some of the most common HTTP response status codes for the [authoring](https://go.microsoft.com/fwlink/?linkid=2092087) and [endpoint](https://go.microsoft.com/fwlink/?linkid=2092356) APIs:

|Code|API|Explanation|
|:--|--|--|
|400|Authoring, Endpoint|request's parameters are incorrect meaning the required parameters are missing, malformed, or too large|
|400|Authoring, Endpoint|request's body is incorrect meaning the JSON is missing, malformed, or too large|
|401|Authoring|used endpoint key, instead of authoring key|
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
