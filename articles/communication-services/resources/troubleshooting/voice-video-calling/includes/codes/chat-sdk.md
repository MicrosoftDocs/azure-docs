---
title: Troubleshooting response codes for Chat SDK
description: include file
services: azure-communication-services
author: slpavkov
manager: aakanmu

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 7/22/2024
ms.topic: include
ms.custom: include file
ms.author: slpavkov
---
## Chat SDK error codes

The Chat SDK uses the following error codes to help you troubleshoot chat issues. The error codes are exposed through the `error.code` property in the error response.

| Code | Message | Advice |
| --- | --- | --- |
| 401 | Unauthorized | Ensure that your Communication Services token is valid and not expired. |
| 403 | Forbidden | Ensure that the initiator of the request has access to the resource. |
| 429 | Too many requests | Ensure that your client-side application handles this scenario in a user-friendly manner. If the error persists, file a support request. |
| 503 | Service Unavailable | File a support request through the Azure portal. |