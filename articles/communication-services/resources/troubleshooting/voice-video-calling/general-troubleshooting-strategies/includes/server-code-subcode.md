---
title: General troubleshooting strategies - Understanding Server codes and subcodes
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn to understand error messages and codes.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 05/13/2024
ms.topic: include
ms.service: azure-communication-services
ms.subservice: calling
---

## Azure Communication Services Calling Server error codes and subcodes

[!INCLUDE [Public Preview](../../../../../includes/public-preview-include-document.md)]

| Subcode | Code | Message  (public preview *) | Result Categories (public preview *) | Advice |
|---------|------|---------|--------------------------------------|--------|
| 0 | 0 | Call ended successfully by local participant. | Success | |
| 0 | 487 | Call ended successfully as caller canceled the call. | Success | |
| 0 | 603 | Call ended successfully as it was declined from callee. | Success | |
| 4097 | 0 | Call ended for all users by the meeting organizer. | Success | |
| 4507 | 495 | Call ended as application didn't provide valid Azure Communication Services token. | UnexpectedClientError |- Ensure that your application implements token refresh mechanism correctly. |
| 5000 | 0 | Call ended for this participant as it was removed from the conversation by another participant. | Success | |
| 5003 | 0 | Call ended successfully, as all callee endpoints declined the call. | Success | |
| 5300 | 0 | Call ended for this participant as it was removed from the conversation by another participant. | Success | |
| 7000 | 0 | Call ended by Azure Communication Services platform. | Success | |
| 10003 | 487 | Call was accepted elsewhere, by another endpoint of this user. | Success | |
| 10004 | 487 | Call was canceled on timeout, no callee endpoint accepted on time. Ensure that user saw the notification and try to initiate that call again. | ExpectedError | |
| 10024 | 487 | Call ended successfully as it was declined by all callee endpoint. | Success | - Try to place the call again. |
| 301005 | 410 | Participant was removed from the call by the Azure Communication Services infrastructure due to loss of media connectivity with Azure Communication Services infrastructure, this usually happens if participant leaves the call abruptly or looses network connectivity. If participant wants to continue the call, it should reconnect. | UnexpectedClientError | - Ensure that you're using the latest SDK in a supported environment.<br> |
| 510403 | 403 | Call ended, as it has been marked as a spam and got blocked. | ExpectedError | - Ensure that your Communication Services token is valid and not expired.<br>  - Ensure to pass in AlternateId in the call options.<br> |
| 540487 | 487 | Call ended successfully as caller canceled the call. | Success | |
| 560000 | 0 | Call ended successfully by remote PSTN participant. | Success |Possible causes:<br> - User ended the call.<br> - Call was ended by media agent.<br> |
| 560486 | 486 | Call ended because remote PSTN participant was busy. The number called was already in a call or having technical issues. | Success | - For Direct Routing calls, check your Session Border Control logs and settings and timeouts configuration.<br> Possible causes: <br>  - The number called was already in a call or having technical issues.<br> |
