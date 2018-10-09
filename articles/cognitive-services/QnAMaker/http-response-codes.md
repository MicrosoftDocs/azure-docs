---
title: API HTTP response codes - QnA Maker
titleSuffix: Azure Cognitive Services
description:  Understand what HTTP response codes are returned from the QnA Maker APIs
services: cognitive-services
author: tulasim88
manager: cgronlun

ms.service: cognitive-services
ms.component: luis
ms.topic: article
ms.date: 10/09/2018
ms.author: tulasim
---

# QnA Maker API HTTP response codes
The [management](https://aka.ms/luis-authoring-apis) and prediction APIs return HTTP response codes. While response messages include information specific to a request, the HTTP response status code is general. 

## Common status codes
The following table lists some of the most common HTTP response status codes for the [authoring](https://aka.ms/luis-authoring-apis) and [endpoint](https://aka.ms/luis-endpoint-apis) APIs:

### Management

|Code|Explanation|
|:--|--|
|2xx|Success|
|400|Request's parameters are incorrect meaning the required parameters are missing, malformed, or too large|
|400|Request's body is incorrect meaning the JSON is missing, malformed, or too large|
|401|Invalid key|
|403|Forbidden - you do not have correct permissions|
|404|KB doesn't exist|