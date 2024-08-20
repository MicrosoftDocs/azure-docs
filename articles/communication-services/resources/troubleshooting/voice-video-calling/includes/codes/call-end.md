---
title: Troubleshooting Calling End codes and subcodes
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

## Understanding calling codes and subcodes errors

Error codes, subcodes, and corresponding result categories help developers identify and diagnose errors. These error codes are exposed through the `call.callEndReason` property after a call ends.

Error code details include:

**Code** - are 3 digit integers representing client or server response status. The code categories:

- Successful responses (**200-299**)
- Client error (**400-499**)
- Server error (**500-599**)
- Global error (**600-699**)

**Subcode** - Are defined as an integer, where each number indicates a unique reason, specific to a group of scenarios or specific scenario outcome.

**Message** - Describes the outcome, and provides hints how to mitigate the problem if an outcome is a failure.

**ResultCategory** - Indicates the type of the error. Depending on the context, the value can be `Success`, `ExpectedError`, `UnexpectedClientError`, or `UnexpectedServerError`.

## Calling End call codes and subcodes

There are different explanations for why a call ended. Here are the meanings of the end of call codes and subcodes that show how a call can end.

| Subcode | Code | Message | Result Categories | Advice |
|--- |--- |--- |--- |--- |
| 0 | 0 | Call ended successfully by local participant. | Success | |
| 0 | 487 | Call ended successfully as caller canceled the call. | Success | |
| 0 | 603 | Call ended successfully as it was declined from callee. | Success | |
| 3100 | 410 | Call setup failed due to unexpected network problem on the client, please check client's network and retry. | UnxpectedClientError | - Ensure that you're using the latest SDK in a supported environment.<br> |
| 3101 | 410 | Call dropped due to unexpected network problem on the client, please check client's network and retry. | UnxpectedClientError | |
| 3112 | 410 |  Call setup failed due to network configuration problem on the client side, please check client's network configuration, and retry. | ExpectedError | |
| 4097 | 0 | Call ended for all users by the meeting organizer. | Success | |
| 4507 | 495 | Call ended as application didn't provide valid Azure Communication Services token. | UnexpectedClientError | Ensure that your application implements token refresh mechanism correctly. |
| 4521 | 0 | Call ended because user disconnected from the call abruptly. This might be caused by a user closing the application that hosted the call, such as a user terminated the application by closing the browser tab without proper hang-up. | ExpectedError | |
| 5000 | 0 | Call ended for this participant. Participant removed from the conversation by another participant. | Success | |
| 5003 | 0 | Call ended successfully, as all callee endpoints declined the call. | Success | |
| 5300 | 0 | Call ended for this participant. Participant removed from the conversation by another participant. | Success | |
| 7000 | 0 | Call ended by Azure Communication Services platform. | Success | |
| 10003 | 487 | Call was accepted elsewhere, by another endpoint of this user. | Success | |
| 10004 | 487 | Call was canceled on timeout, no callee endpoint accepted on time. Ensure that user saw the notification and try to initiate that call again. | ExpectedError | |
| 10024 | 487 | Call ended successfully. Call declined by all callee endpoints. | Success | - Try to place the call again. |
| 10057 | 408 | Call failed, callee failed to finalize call setup, most likely callee lost network or terminated the application abruptly. Ensure clients are connected and available. | ExpectedError | |
| 301005 | 410 | Participant removed from the call by the Azure Communication Services infrastructure due to loss of media connectivity with the same infrastructure. This usually happens if participant leaves the call abruptly or loses network connectivity. If the participant wants to continue the call, they can reconnect. | UnexpectedClientError | Ensure that you're using the latest SDK in a supported environment. |
| 510403 | 403 | Call ended, previously marked as a spam and now blocked. | ExpectedError | - Ensure that your Communication Services token is valid and not expired. <br />  - Ensure to pass in `AlternateId` in the call options. |
| 540487 | 487 | Call ended successfully as caller canceled the call. | Success | |
| 560000 | 0 | Call ended successfully by remote PSTN participant. | Success |Possible causes: <br /> - User ended the call. <br /> - Call ended by media agent. |
| 560486 | 486 | Call ended because remote PSTN participant was busy. The number called was already in a call or having technical issues. |
| | 404 | Call not found. | | Ensure that the number you're calling (or call you're joining) exists. |
| | 408 | Call controller timed out. | | Call Controller timed out waiting for protocol messages from user endpoints. Ensure clients are connected and available. |
| | 410 | Local media stack or media infrastructure error. | | Ensure that you're using the latest SDK in a supported environment. |
| | 430 | Unable to deliver message to client application. | | Ensure that the client application is running and available. |
| | 480 | Remote client endpoint not registered. | | Ensure that the remote endpoint is available. |
| | 481 | Failed to handle incoming call. | | File a support request through the Azure portal. |
| | 490, 491, 496, 497, 498 | Local endpoint network issues. | | Check your network. |
| | 500, 503, 504 | Communication Services infrastructure error. | | File a support request through the Azure portal. |