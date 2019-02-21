---
title: API HTTP response codes - QnA Maker
titleSuffix: Azure Cognitive Services
description:  Understand what HTTP response codes are returned from the QnA Maker APIs. This will help you resolve any errors.  
services: cognitive-services
author: tulasim88
manager: nitinme

ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 02/20/2019
ms.author: tulasim
ms.custom: seodec18
---

# QnA Maker API HTTP response codes
The [management](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff) and prediction APIs return HTTP response codes. While response messages include information specific to a request, the HTTP response status code is general. 

### Management

|Code|Explanation|
|:--|--|
|2xx|Success|
|400|Request's parameters are incorrect meaning the required parameters are missing, malformed, or too large|
|400|Request's body is incorrect meaning the JSON is missing, malformed, or too large|
|401|Invalid key|
|403|Forbidden - you do not have correct permissions|
|404|KB doesn't exist|
|410|This API is deprecated and is no longer available|
