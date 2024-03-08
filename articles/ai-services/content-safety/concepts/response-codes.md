---
title: "Content Safety error codes"
titleSuffix: Azure AI services
description: See the possible error codes for the Azure AI Content Safety APIs.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: conceptual
ms.date: 05/09/2023
ms.author: pafarley
---

# Azure AI Content Safety error codes 

The content APIs may return the following error codes:

| Error Code    | Possible reasons   | Suggestions           |
| ---------- | ------- | -------------------- |
| InvalidRequestBody  | One or more fields in the request body do not match the API definition. | 1. Check the API version you specified in the API call. <br/>2. Check the corresponding API definition for the API version you selected. |
| InvalidResourceName | The resource name you specified in the URL does not meet the requirements, like the blocklist name, blocklist term ID, etc. | 1. Check the API version you specified in the API call.  <br/>2. Check whether the given name has invalid characters according to the API definition. |
| ResourceNotFound    | The resource you specified in the URL may not exist, like the blocklist name. | 1. Check the API version you specified in the API call. <br/> 2. Double check the existence of the resource specified in the URL. |
| InternalError       | Some unexpected situations on the server side have been triggered. | 1. You may want to retry a few times after a small period and see it the issue happens again.  <br/>             2. Contact Azure Support if this issue persists. |
| ServerBusy          | The server side cannot process the request temporarily.      | 1. You may want to retry a few times after a small period and see it the issue happens again.  <br/>2.Contact Azure Support if this issue persists. |
| TooManyRequests     | The current RPS has exceeded the quota for your current SKU. | 1. Check the pricing table to understand the RPS quota.   <br/>2.Contact Azure Support if you need more QPS. |
