---
title: Troubleshooting call end response codes for Calling SDK
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
## Calling SDK error codes

The Azure Communication Services Calling SDK uses the following error codes to help you troubleshoot calling issues. These error codes are exposed through the `call.callEndReason` property after a call ends.

| SubCode | Code | Message | Result Categories | Advice |
|--- |--- |--- |--- |--- |
| | 403 | Forbidden / Authentication failure. | | Ensure that your Communication Services token is valid and not expired. |
| | 404 | Call not found. | | Ensure that the number you're calling (or call you're joining) exists. |
| | 408 | Call controller timed out. | | Call Controller timed out waiting for protocol messages from user endpoints. Ensure clients are connected and available. |
| | 410 | Local media stack or media infrastructure error. | | Ensure that you're using the latest SDK in a supported environment. |
| | 430 | Unable to deliver message to client application. | | Ensure that the client application is running and available. |
| | 480 | Remote client endpoint not registered. | | Ensure that the remote endpoint is available. |
| | 481 | Failed to handle incoming call. | | File a support request through the Azure portal. |
| | 487 | Call canceled, locally declined, ended due to an endpoint mismatch issue, or failed to generate media offer. | | Expected behavior. |
| | 490, 491, 496, 497, 498 | Local endpoint network issues. | | Check your network. |
| | 500, 503, 504 | Communication Services infrastructure error. | | File a support request through the Azure portal. |
| | 603 | Call globally declined by remote Communication Services participant. | | Expected behavior. |

