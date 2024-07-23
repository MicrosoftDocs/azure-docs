---
title: Troubleshooting call end response codes for Call Automation SDK
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
## Call Automation SDK error codes

The following error codes are exposed by the Call Automation SDK.

| SubCode | Code | Message | Result Categories | Advice |
|--- |--- |--- |--- |--- |
| | 400 | Bad request | | The input request is invalid. Look at the error message to determine which input is incorrect. |
| | 400 | Play Failed | | Ensure your audio file is WAV, 16 KHz, or Mono, and make sure the file URL is publicly accessible. |
| | 400 | Recognize Failed | | Check the error message. The message highlights if this failure is due to timeout being reached or if operation was canceled. For more information about the error codes and messages, see [gathering user input](../../../how-tos/call-automation/recognize-action.md#event-codes). |
| | 401 | Unauthorized | | HMAC authentication failed. Verify whether the connection string used to create CallAutomationClient is correct. |
| | 403 | Forbidden | | Request is forbidden. Make sure that you can have access to the resource you're trying to access. |
| | 404 | Resource not found | | The call you're trying to act on doesn't exist. For example, transferring a call that previously disconnected. |
| | 429 | Too many requests | | Retry after a delay suggested in the Retry-After header, then exponentially backoff. |
| | 500 | Internal server error | | Retry after a delay. If it persists, raise a support ticket. |
| | 500 | Play Failed | | File a support request through the Azure portal. |
| | 500 | Recognize Failed | | Check error message and confirm the audio file format is valid (WAV, 16 KHz, Mono). If the file format is valid, file a support request through Azure portal. |
| | 502 | Bad gateway | | Retry after a delay with a fresh http client. |
