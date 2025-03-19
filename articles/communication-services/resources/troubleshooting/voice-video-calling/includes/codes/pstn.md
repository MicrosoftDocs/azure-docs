---
title: Troubleshooting call end response codes for PSTN calling
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
## PSTN call response codes with ParticipantEndReason

This section provides troubleshooting information for various combinations of `ParticipantEndReason` and `ParticipantEndSubCode` response codes. For the tables in this section, `ParticipantEndReason` = **Code** and `ParticipantEndSubCode` = **SubCode**.

### ParticipantEndReason 0

Response `ParticipantEndReason` with value 0 usually means normal call clearing and marks calls that completed without errors.

| SubCode | Code | Message | Result Categories | Advice |
|--- |--- |--- |--- |--- |
| 0 | 0 | Call ended successfully by local participant. | Success | |
| 560000 | 0 | Normal PSTN call end:<br/> - User ended the call.<br/>  - Call ended by media agent.  | Success | |
| 540000 | 0 | Normal PSTN call end:<br/> - User ended the call.<br/>  - Call ended by media agent.  | Success | |


### ParticipantEndReason 4xx

Response `ParticipantEndReason` with value 4xx means that the call didn't connect.

| SubCode | Code | Message | Result Categories | Advice |
|--- |--- |--- |--- |--- |
| 510403 | 403 | Call blocked:<br/> - Alternate ID not supplied for the call.<br/> - Phone number not allowed by users Session Border Controller (SBC). |  | - For more information about Alternate ID, see [Manage calls](../../../../../how-tos/calling-sdk/manage-calls.md#place-a-call).<br/> - Make sure that you specified a valid Alternate ID. It must be a phone number that belongs to the Resource you're using.<br/> - Verify that you own the Resource you're using to make a call.<br/> - For direct routing calls, verify why your Session Border Controller disallowed the call. |
| 560403 | 403 | - Call forbidden.<br/> - Call canceled.<br/> - Call rejected. |  | Make sure that you called a valid phone number in the correct format. For more information about supported number formats, see <https://en.wikipedia.org/wiki/E.164>. |
| 511532 | 403 | Resource SIP trunk configuration not found. |  | Check your direct routing setup in the [Azure portal](https://portal.azure.com). For more information, see [Direct routing provisioning](../../../../../concepts/telephony/direct-routing-provisioning.md). |
| 560404 | 404 | - Phone number not found.<br/> - Phone number not assigned to any target.<br/> - Phone number not allowed by Session Border Controller.  |  | - Make sure the phone number belongs to the Resource you're using and that you own the Resource.<br/> - Verify that the number you're calling exists, and is assigned to valid target. |
| 511404 | 404 | - Phone number not found.<br/> - Resource used in the call not found.  |  | - Make sure you used a phone number that belongs to the Resource you're using and that you own the Resource.<br/> - Verify that the number you're calling exists, and is assigned to a valid target.<br/> - Make sure that the Resource you're using for the call isn't deleted or disabled.<br/> - Make sure your Azure subscriptions isn't deleted or disabled. |
| 560408 | 408 | The called party didn't respond to a call establishment message within the prescribed time period. |  | - Double check why the called party didn't respond.<br/> - For direct routing calls, check your Session Border Control (SBC) logs and settings and timeouts configuration. |
| 500001 | 408 | User gateway timeout<br/>Azure Communication Services didn't receive a response from the client within a specified time limit and terminated the request.  |  | - Double check why the called party didn't respond.<br/> - For direct routing calls, check your SBC logs and settings and timeouts configuration. |
| 531004 | 410 | Interactive Connectivity Establishment (ICE) checks failed. |  | - The media path couldn't be established. Can be caused by incorrect network configuration. Verify your network configuration to make sure that the required IP addresses and ports aren't blocked. Read the guidelines in <https://www.rfc-editor.org/rfc/rfc5245#section-7>.<br/> - For direct routing calls, check your SBC logs and settings for ICE configuration and profile. Contact your SBC vendor for configuration help. For more information, see [List of Session Border Controllers certified for Azure Communication Services direct routing](../../../../../concepts/telephony/certified-session-border-controllers.md). |
| 560480 | 480 | - No answer from the called user.<br/> - Called user temporary unavailable.  |  | - Double check why the called party didn't respond.<br/> - Retry the call later in case that the called party was temporary unavailable.<br/> - For direct routing calls, check your SBC logs and settings and timeouts configuration. |
| 560484 | 484 | - Incomplete or invalid callee address.<br/> - Incomplete or invalid callee number format. |  | - In some cases, you can ignore these failures because the user is dialing an invalid number.<br/> - Make sure the phone numbers are formatted correctly. For more information, see <https://en.wikipedia.org/wiki/E.164>.<br/> - For direct routing, the SBC could cause these failures because of a missing configuration in a call transfer scenario. |
| 60486 | 486 | The called number was busy |  | - The called number may be connected to an existing call, or having a technical problem.<br/> - For direct routing calls, check your SBC logs and settings and timeouts configuration. |
| 540487 | 487 | The caller terminated the call request. |  | Retry the call. |
| 560487 | 497 | - The caller terminated the call request.<br/> - Request terminated with normal call clearing. |  | Retry the call. |


### ParticipantEndReason 5xx 

Response `ParticipantEndReason` with value 5xx means that the call failed due to a problem with a software or hardware component required to complete the connection.

| SubCode | Code | Message | Result Categories | Advice |
|--- |--- |--- |--- |--- |
| 560500 | 500 | An internal server error occurred in one of the services involved in the call. |  | - Retry the call. If the issue persists contact your telco provider or Microsoft support.<br/> - For direct routing calls, check your SBC logs and settings and timeouts configuration, to see if your SBC caused the failure. |
| 560503 | 503 | - Call failed because of an internal server error in one of the services involved in the call.<br/> - The network used to establish the call is out of order.<br/> - A temporary failure in one of the services involved in the call. |  | - Check your network and routing configuration for possible issues. Verify that your network firewall rules are correct.<br/> - Retry the call. If the issue persists, contact your telco provider or Microsoft support.<br/> - For direct routing calls, check your SBC logs and settings and timeouts configuration, to see if your SBC caused the failure. |


### ParticipantEndReason 603

Response `ParticipantEndReason` with value 603 means that the call was rejected without connecting.

| SubCode | Code | Message | Result Categories | Advice |
|--- |--- |--- |--- |--- |
| 560603 | 603 | - Call declined by the recipient.<br/> - Call declined due to fraud detection. |  | - If declined by the recipient, retry the call.<br/> - Ensure that you aren't exceeding the maximum number of concurrent calls allowed for your Azure Communication Services phone number. For more information, see [PSTN call limitations](../../../../../concepts/service-limits.md#pstn-call-limitations). |