---
title: Troubleshooting call end response codes for Calling SDK, Call Automation SDK, and PSTN calling - Azure Communication Services
description: Use call end response codes to diagnose why a call ended for Calling SDK, Call Automation SDK, and PSTN calling.
services: azure-communication-services
ms.date: 11/24/2023
author: slpavkov
ms.service: azure-communication-services
ms.author: slpavkov
manager: aakanmu
audience: ITPro
ms.topic: troubleshooting
localization_priority: Normal
---

# Troubleshooting call end response codes for Calling SDK, Call Automation SDK, and PSTN calls

This article describes troubleshooting call end response codes for [Calling SDK](#calling-sdk-error-codes), [Call Automation](#call-automation-sdk-error-codes), and [PSTN calling](#pstn-call-response-codes-with-participantendreason).

## Troubleshooting tips

Consider the following tips when troubleshooting certain issues: 
- Your application isn't receiving an `IncomingCall Event Grid` event: Make sure the application endpoint is [validated with Event Grid](../../event-grid/webhook-event-delivery.md) when creating an event subscription. The provisioning status for your event subscription is marked as succeeded if the validation was successful. 
- For error `The field CallbackUri is invalid`: Call Automation doesn't support HTTP endpoints. Make sure the callback URL you provide supports HTTPS.
- The `PlayAudio` action doesn't play anything: Currently only Wave file (.wav) format is supported for audio files. The audio content in the wave file must be mono (single-channel), 16-bit samples with a 16,000 (16 KHz) sampling rate.
- Actions on PSTN endpoints aren't working: For `CreateCall`, `Transfer`, `AddParticipant`, and `Redirect` to phone numbers, you need to set the `SourceCallerId` in the action request. Unless you're using direct routing, the source caller ID must be a phone number owned by your Communication Services resource for the action to succeed. 

For more information about issues tracked by the product team, see [Known issues](./known-issues.md). 

## Calling SDK error codes

The Azure Communication Services Calling SDK uses the following error codes to help you troubleshoot calling issues. These error codes are exposed through the `call.callEndReason` property after a call ends.

| Error code | Description | Action to take |
| -------- | ---------------| ---------------|
| 403 | Forbidden / Authentication failure. | Ensure that your Communication Services token is valid and not expired. |
| 404 | Call not found. | Ensure that the number you're calling (or call you're joining) exists. |
| 408 | Call controller timed out. | Call Controller timed out waiting for protocol messages from user endpoints. Ensure clients are connected and available. |
| 410 | Local media stack or media infrastructure error. | Ensure that you're using the latest SDK in a supported environment. |
| 430 | Unable to deliver message to client application. | Ensure that the client application is running and available. |
| 480 | Remote client endpoint not registered. | Ensure that the remote endpoint is available. |
| 481 | Failed to handle incoming call. | File a support request through the Azure portal. |
| 487 | Call canceled, locally declined, ended due to an endpoint mismatch issue, or failed to generate media offer. | Expected behavior. |
| 490, 491, 496, 497, 498 | Local endpoint network issues. | Check your network. |
| 500, 503, 504 | Communication Services infrastructure error. | File a support request through the Azure portal. |
| 603 | Call globally declined by remote Communication Services participant | Expected behavior. |

## Call Automation SDK error codes

The following error codes are exposed by the Call Automation SDK.

| Error Code | Description | Actions to take |
|-- |-- |-- |
| 400 | Bad request           | The input request is invalid. Look at the error message to determine which input is incorrect. |
| 400 | Play Failed           | Ensure your audio file is WAV, 16 KHz, or Mono, and make sure the file URL is publicly accessible. |
| 400 | Recognize Failed      | Check the error message. The message highlights if this failure is due to timeout being reached or if operation was canceled. For more information about the error codes and messages, see [gathering user input](../how-tos/call-automation/recognize-action.md#event-codes). |
| 401 | Unauthorized          | HMAC authentication failed. Verify whether the connection string used to create CallAutomationClient is correct. |
| 403 | Forbidden             | Request is forbidden. Make sure that you can have access to the resource you're trying to access. |
| 404 | Resource not found    | The call you're trying to act on doesn't exist. For example, transferring a call that previously disconnected. |
| 429 | Too many requests     | Retry after a delay suggested in the Retry-After header, then exponentially backoff. |
| 500 | Internal server error | Retry after a delay. If it persists, raise a support ticket. |
| 500 | Play Failed           | File a support request through the Azure portal. |
| 500 | Recognize Failed      | Check error message and confirm the audio file format is valid (WAV, 16 KHz, Mono). If the file format is valid, file a support request through Azure portal. |
| 502 | Bad gateway           | Retry after a delay with a fresh http client. |


## PSTN call response codes with ParticipantEndReason

This section provides troubleshooting information for various combinations of `ParticipantEndReason` and `ParticipantEndSubCode` response codes. For the tables in this section, `ParticipantEndReason` = **Code** and `ParticipantEndSubCode` = **SubCode**.

### ParticipantEndReason 0

Response `ParticipantEndReason` with value 0 usually means normal call clearing and marks calls that completed without errors.

| SubCode | Code | Message  (public preview) | Result Categories (public preview) | Advice |
|--- |--- |--- |--- |--- |
| 0 | 0 | Call ended successfully by local participant. | Success | |
| 560000 | 0 | Normal PSTN call end:<br/> - User ended the call.<br/>  - Call ended by media agent.  | Success | |
| 540000 | 0 | Normal PSTN call end:<br/> - User ended the call.<br/>  - Call ended by media agent.  | Success | |


### ParticipantEndReason 4xx

Response `ParticipantEndReason` with value 4xx means that the call didn't connect.

| SubCode | Code | Message  (public preview) | Result Categories (public preview) | Advice |
|--- |--- |--- |--- |--- |
| 510403 | 403 | Call blocked:<br/> - Alternate ID not supplied for the call.<br/> - Phone number not allowed by users Session Border Controller (SBC). |  | - For more information about Alternate ID, see [Manage calls](../how-tos/calling-sdk/manage-calls.md#place-a-call).<br/> - Make sure that you specified a valid Alternate ID. It must be a phone number that belongs to the Resource you're using.<br/> - Verify that you own the Resource you're using to make a call.<br/> - For direct routing calls, verify why your Session Border Controller disallowed the call. |
| 560403 | 403 | - Call forbidden.<br/> - Call canceled.<br/> - Call rejected. |  | Make sure that you called a valid phone number in the correct format. For more information about supported number formats, see <https://en.wikipedia.org/wiki/E.164>. |
| 511532 | 403 | Resource SIP trunk configuration not found. |  | Check your direct routing setup in the [Azure portal](https://portal.azure.com). For more information, see [Direct routing provisioning](../concepts/telephony/direct-routing-provisioning.md). |
| 560404 | 404 | - Phone number not found.<br/> - Phone number not assigned to any target.<br/> - Phone number not allowed by Session Border Controller.  |  | - Make sure the phone number belongs to the Resource you're using and that you own the Resource.<br/> - Verify that the number you're calling exists, and is assigned to valid target. |
| 511404 | 404 | - Phone number not found.<br/> - Resource used in the call not found.  |  | - Make sure you used a phone number that belongs to the Resource you're using and that you own the Resource.<br/> - Verify that the number you're calling exists, and is assigned to a valid target.<br/> - Make sure that the Resource you're using for the call isn't deleted or disabled.<br/> - Make sure your Azure subscriptions isn't deleted or disabled. |
| 560408 | 408 | The called party didn't respond to a call establishment message within the prescribed time period. |  | - Double check why the called party didn't respond.<br/> - For direct routing calls, check your Session Border Control logs and settings and timeouts configuration. |
| 500001 | 408 | User gateway timeout<br/>Azure Communication Services didn't receive a response from the client within a specified time limit and terminated the request.  |  | - Double check why the called party didn't respond.<br/> - For direct routing calls, check your Session Border Control logs and settings and timeouts configuration. |
| 531004 | 410 | Interactive Connectivity Establishment (ICE) checks failed. |  | - The media path couldn't be established. Can be caused by incorrect network configuration. Verify your network configuration to make sure that the required IP addresses and ports aren't blocked. Read the guidelines in <https://www.rfc-editor.org/rfc/rfc5245#section-7>.<br/> - For direct routing calls, check your Session Border Control logs and settings for ICE configuration and profile. Contact your SBC vendor for configuration help. For more information, see [List of Session Border Controllers certified for Azure Communication Services direct routing](../concepts/telephony/certified-session-border-controllers.md). |
| 560480 | 480 | - No answer from the called user.<br/> - Called user temporary unavailable.  |  | - Double check why the called party didn't respond.<br/> - Retry the call later in case that the called party was temporary unavailable.<br/> - For direct routing calls, check your Session Border Control logs and settings and timeouts configuration. |
| 560484 | 484 | - Incomplete or invalid callee address.<br/> - Incomplete or invalid callee number format. |  | - In some cases, you can ignore these failures because the user is dialing an invalid number.<br/> - Make sure the phone numbers are formatted correctly. For more information, see <https://en.wikipedia.org/wiki/E.164>.<br/> - For direct routing, the SBC could cause these failures because of a missing configuration in a call transfer scenario. |
| 60486 | 486 | The called number was busy |  | - The called number may be connected to an existing call, or having a technical problem.<br/> - For direct routing calls, check your Session Border Control logs and settings and timeouts configuration. |
| 540487 | 487 | The caller terminated the call request. |  | Retry the call. |
| 560487 | 497 | - The caller terminated the call request.<br/> - Request terminated with normal call clearing. |  | Retry the call. |


### ParticipantEndReason 5xx 

Response `ParticipantEndReason` with value 5xx means that the call failed due to a problem with a software or hardware component required to complete the connection.

| SubCode | Code | Message  (public preview) | Result Categories (public preview) | Advice |
|--- |--- |--- |--- |--- |
| 560500 | 500 | An internal server error occurred in one of the services involved in the call. |  | - Retry the call. If the issue persists contact your telco provider or Microsoft support.<br/> - For direct routing calls, check your Session Border Control logs and settings and timeouts configuration, to see if your SBC caused the failure. |
| 560503 | 503 | - Call failed because of an internal server error in one of the services involved in the call.<br/> - The network used to establish the call is out of order.<br/> - A temporary failure in one of the services involved in the call. |  | - Check your network and routing configuration for possible issues. Verify that your network firewall rules are correct.<br/> - Retry the call. If the issue persist contact your telco provider or Microsoft support.<br/> - For direct routing calls, check your Session Border Control logs and settings and timeouts configuration, to see if your SBC caused the failure. |


### ParticipantEndReason 603

Response `ParticipantEndReason` with value 603 means that the call was rejected without connecting.

| SubCode | Code | Message  (public preview) | Result Categories (public preview) | Advice |
|--- |--- |--- |--- |--- |
| 560603 | 603 | - Call declined by the recipient.<br/> - Call declined due to fraud detection. |  | - If declined by the recipient, retry the call.<br/> - Ensure that you aren't exceeding the maximum number of concurrent calls allowed for your Azure Communication Services phone number. For more information, see [PSTN call limitations](../concepts/service-limits.md#pstn-call-limitations). |

## Related articles

- [Troubleshooting in Azure Communication Services](./troubleshooting-info.md)
- [Troubleshooting Azure Communication Services PSTN call failures](./telephony/troubleshooting-pstn-call-failures.md)