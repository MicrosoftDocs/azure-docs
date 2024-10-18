---
title: Troubleshooting Calling End codes and subcodes
description: include file
services: azure-communication-services
author: sloanster

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 10/15/2024
ms.topic: include
ms.custom: include file
ms.author: micahvivion
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
| 0 | 603 | Call ended successfully as it was declined from callee. | Success | Call ended because it was declined from the target user via either the client SDK, Call Automation, Graph, PSTN, or Teams reject function. |
| 7 | 496 | Call ended as client lost network connection abruptly, and despite retrying multiple times it wasn't able to connect | ExpectedError | Browser is offline or has network issues. Check your browser's network connection and retry. |
| 3100 | 410 | Call setup failed due to unexpected network problem on the client, check the client's network and retry. | UnxpectedClientError | Check network configuration, make sure it follows Azure Communication Calling network [requirements](../../../../../concepts/voice-video-calling/network-requirements.md). |
| 3101 | 410 | Call dropped due to unexpected network problem on the client, check the client's network and retry. | UnxpectedClientError | Check network configuration, make sure it follows Azure Communication Calling network [requirements](../../../../../concepts/voice-video-calling/network-requirements.md).  |
| 3111 | 410 | Call setup failed, unable to process media offer while connecting the call. | UnxpectedClientError | Try again. If issue persists, gather [call info](../../references/how-to-collect-call-info.md), [client logs](../../references/how-to-collect-client-logs.md), [browser console logs](../../references/how-to-collect-browser-verbose-log.md) and contact Azure Communication Services support. |
| 3112 | 410 |  Call setup failed due to network configuration problem on the client side, check the client's network configuration, and retry. | ExpectedError | Learn more details about a call ending with a subcode of 3112 [here](../../../../troubleshooting/voice-video-calling/call-setup-issues/call-ends-with-410-3112.md). |
| 4097 | 0 | Call ended for all users by the meeting organizer. | Success | |
| 4502 | 490 | Call failed due to network connectivity problems, browser failed to complete the network HTTP request. | UnexpectedClientError | Client failed to complete HTTP request and response. Try again. If issue persists, gather [call info](../../references/how-to-collect-call-info.md), [client logs](../../references/how-to-collect-client-logs.md), [browser console logs](../../references/how-to-collect-browser-verbose-log.md) and contact Azure Communication Services support. |
| 4506 | 408 | Call timed out. Check if the callee received and accepted the call. | UnexpectedClientError | Try again. If issue persists, gather [call info](../../references/how-to-collect-call-info.md), [client logs](../../references/how-to-collect-client-logs.md), [browser console logs](../../references/how-to-collect-browser-verbose-log.md) and contact Azure Communication Services support. |
| 4507 | 495 | Call ended as application didn't provide valid Azure Communication Services token. | UnexpectedClientError | Ensure that your application implements token refresh mechanism correctly. |
| 4521 | 0 | Call ended because user disconnected from the call abruptly. This might be caused by a user closing the application that hosted the call, such as a user terminated the application by closing the browser tab without proper hang-up. | ExpectedError | |
| 5000 | 0 | Call ended for this participant. Participant removed from the conversation by another participant. | Success | |
| 5003 | 0 | Call ended successfully, as all callee endpoints declined the call. | Success | |
| 5300 | 0 | Call ended for this participant as it was removed from the conversation by another participant. | Success | Call ended for this participant as another participant removed it, it could be another client, Call Automation API, Graph API. |
| 5317 | 0 | Target participant is removed due to participant role update. | ExpectedError | |
| 5828 | 403 | The join isn't authorized for the Rooms meeting since user isn't part of invitee list.	 | UnexpectedClientError | |
| 5829 | 403 | The join isn't allowed for the Rooms meeting beyond end time or prior to start time of the meeting. | UnexpectedClientError | |
| 5830 | 403 | Only Communication Services user is allowed to join the Rooms meeting. | ExpectedError | |
| 7000 | 0 | Call was ended by Azure Communication Service Call Automation API or a server bot. | Success | Call was ended by ACS Call Automation API or Graph bot. |
| 10003 | 487 | Call was canceled for this user endpoint as it was accepted elsewhere, by another endpoint. | Success | A call was initiated to target user (start call, add participant, transfer), target user had multiple active endpoints at the same time, on one of the endpoints user accepted the call. This is normal behavior, only one endpoint can accept and connect to a call. All other endpoints receive subcode 10003 to indicate that call was already accepted. |
| 10004 | 487 | Call was canceled on timeout, as target user didn't accept or reject it on time. Ensure that user saw the notification and/or application can handle it automatically and try to initiate that call again. | ExpectedError | Call was canceled after predefined amount of time (usually 2 minutes) as target user didn't accept or reject. |
| 10009 | 401 | Unauthenticated identity. Ensure that your Azure Communication Services token is valid and not expired. | UnexpectedClientError | |
| 10024 | 487 | Call ended successfully. Call declined by all callee endpoints. | Success | Try to place the call again. |
| 10037 | 480 | Target user didn't have any endpoints registered with ACS. Ensure that target user has at least one active endpoint and  it's online. | ExpectedError | If the target user is using the Azure Communication Services Calling SDK, ensure that the SDK is initialized successfully in their client application. If the target user is a Teams user, make sure that their client is online. Make sure that the target user's identifier (CommunicationUserIdentifier, MicrosoftTeamsUserIdentifier, or MicrosoftTeamsBotIdentifier) is correct. If the Graph API `user` has property `department` set to `Microsoft Communication Application Instance` the `MicrosoftTeamsBotIdentifier` should be specified. |
| 10057 | 408 | Call failed, callee failed to finalize call setup, most likely callee lost network or terminated the application abruptly. Ensure clients are connected and available. | ExpectedError | |
| 10076 | 480 | Target user was registered but it wasn't online at the time of the call. Ensure that target user has at least one active endpoint and  it's online. | ExpectedError | If the target user is using the Azure Communication Services Calling SDK, ensure that the SDK is initialized successfully in their client application and their endpoint is online. If the target user is a Teams user, make sure that their client is online. |
| 10077 | 480 | Target user was registered with ACS and/or for push notifications, but it wasn't online at the time of the call. Ensure that target user has at least one active endpoint and  it's online. | ExpectedError | If the target user is using the Azure Communication Services Calling SDK, ensure that the SDK is initialized successfully in their client application and their endpoint is online. If application leverages Push Notifications make sure they're configured correctly. If the target user is a Teams user, make sure that their client is online. |
| 10078 | 480 | Remote client endpoint not registered or not reachable. Ensure the remote client endpoint is successfully sending network requests to Azure Communication Services. | ExpectedError | - If the target user is using the Azure Communication Services Calling SDK, ensure that the SDK is initialized successfully in their client application and their endpoint is online. If application leverages Push Notifications make sure they're configured correctly. <br> - If the target user is a Teams user, make sure that their client is online. |
| 301004 | 410 | Participant was removed from the call by the Azure Communication Services infrastructure due to inability to establish media connectivity with Azure Communication Services infrastructure during call setup. Check user's network configuration, including local network, firewalls, VPNs configuration and try again. | UnexpectedClientError | Ensure that user's network is configured correctly, follow 'Network Recommendations' public documentation. |
| 301005 | 410 | Participant removed from the call by the Azure Communication Services infrastructure due to loss of media connectivity with the same infrastructure. This usually happens if participant leaves the call abruptly or loses network connectivity. If the participant wants to continue the call, they can reconnect. | UnexpectedClientError | Ensure that you're using the latest SDK in a supported environment. |
| 540000 | 0 | Call ended successfully by local PSTN caller. | Success | |
| 510403 | 403 | Call ended, previously marked as a spam and now blocked. | ExpectedError | - Ensure that your Communication Services token is valid and not expired. <br />  - Ensure to pass in `AlternateId` in the call options. |
| 540487 | 487 | Call ended successfully as caller canceled the call. | Success | |
| 560000 | 0 | Call ended successfully by remote PSTN participant. | Success |Possible causes: <br /> - User ended the call. <br /> - Call ended by media agent. |
| 560486 | 486 | Call ended because remote PSTN participant was busy. The number called was already in a call or having technical issues. | Success | - For Direct Routing calls, check your Session Border Control logs and settings and timeouts configuration. Possible causes: The number called was already in a call or having technical issues. |
| | 404 | Call not found. | | Ensure that the number you're calling (or call you're joining) exists. |
| | 408 | Call controller timed out. | | Call Controller timed out waiting for protocol messages from user endpoints. Ensure clients are connected and available. |
| | 410 | Local media stack or media infrastructure error. | | Ensure that you're using the latest SDK in a supported environment. |
| | 430 | Unable to deliver message to client application. | | Ensure that the client application is running and available. |
| | 480 | Remote client endpoint not registered. | | Ensure that the remote endpoint is available. |
| | 481 | Failed to handle incoming call. | | File a support request through the Azure portal. |
| | 490, 491, 496, 497, 498 | Local endpoint network issues. | | Check network configuration, make sure it follows Azure Communication Calling network [requirements](../../../../../concepts/voice-video-calling/network-requirements.md). |
| | 500, 503, 504 | Communication Services infrastructure error. | | File a support request through the Azure portal. |
