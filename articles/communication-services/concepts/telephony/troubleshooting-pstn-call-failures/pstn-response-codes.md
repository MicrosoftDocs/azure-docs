---
title: Troubleshooting PSTN call failures using ParticipantEndReason values - Azure Communication Services
description: Troubleshooting Azure Communication Services PSTN call failures using ParticipantEndReason values from 0 through 6xx.
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

# Troubleshooting PSTN call failures using ParticipantEndReason

This article provides troubleshooting information for various combinations of `ParticipantEndReason` and `ParticipantEndSubReason` response codes.


## ParticipantEndReason 0

Response `ParticipantEndReason` with value 0 usually means normal call clearing and marks calls that completed without errors.


### 560000 0 Normal call clearing

- `ParticipantEndSubReason`: **560000**
- `ParticipantEndReason`: **0**

Indicates a normal PSTN call end without errors, such as:

- User ended the call.
- Call ended by media agent.


### 540000 0 Normal call clearing

- `ParticipantEndSubReason`: **540000**
- `ParticipantEndReason`: **0**

Indicates a normal PSTN call end without errors, including:

- User ended the call.
- Call ended by media agent.


## ParticipantEndReason 4xx

Response `ParticipantEndReason` with value 4xx means that the call didn't connect.


### 510403 403 call blocked

- ParticipantEndSubReason: **510403**
- ParticipantEndReason: **403**

The call was blocked for one of the following reasons:

- Alternate ID not supplied for the call. For more information on the Alternate ID, see [Manage calls](../../../how-tos/calling-sdk/manage-calls.md#place-a-call).
- Phone number not allowed by users Session Border Controller (SBC).

Suggested actions:

- Make sure that you specified a valid Alternate ID when making a call. The Alternate ID must be a phone number that belongs to the Azure Communication Services Resource you're using.
- Verify that you own the Resource you're using to make a call.
- For direct routing calls, verify why your Session Border Controller disallowed the call.


### 560403 403 call forbidden, canceled, or rejected

- ParticipantEndSubReason: **560403**
- ParticipantEndReason: **403**

Indicates:

- Call forbidden.
- Call canceled.
- Call rejected.

Suggested actions:

- Double check that you used a valid phone number in the correct format. For more information about supported number formats, see <https://en.wikipedia.org/wiki/E.164>.


### 511532 403 No ACS Resource SIP trunk configuration found

- ParticipantEndSubReason: **511532**
- ParticipantEndReason: **403**

Indicates no Resource SIP trunk configuration found.

Suggested actions:

- Check your direct routing setup in the [Azure portal](https://portal.azure.com). For more information, see [Direct routing provisioning](../direct-routing-provisioning.md).


### 560404 404 Phone Number not found

- `ParticipantEndSubReason`: **560404**
- `ParticipantEndReason`: **404**

Indicates:

- Phone number not found.
- Phone number not assigned to any target.
- Phone number not allowed by Session Border Controller.

Suggested actions:

- Make sure the phone number belongs to the Resource you're using and that you own the Resource used for the call.
- Verify that the number you're calling exists, and is assigned to valid target

### 511404 404 Phone Number or ACS Resource not found

- `ParticipantEndSubReason`: **511404**
- `ParticipantEndReason`: **404**

Indicates:

- Phone number not found.
- Resource used in the call not found.

Suggested actions:

- Make sure you used a phone number that belongs to the Resource you're using and that you own the Resource used for the call.
- Verify that the number you're calling exists, and is assigned to a valid target.
- Make sure that the Resource you're using for the call isn't deleted or disabled.
- Make sure your Azure subscriptions isn't deleted or disabled.


### 560408 408 The called party did not respond

- `ParticipantEndSubReason`: **560408**
- `ParticipantEndReason`: **408**

Indicates that the called party did not respond to a call establishment message within the prescribed period allocated.

Suggested actions:

- Double check why the called party did not respond.
- For direct routing calls, check your Session Border Control logs and settings and timeouts configuration.


### 500001 408 User gateway timeout

- `ParticipantEndSubReason`: **500001**
- `ParticipantEndReason`: **408**

Indicates that Azure Communication Services did not receive a response from the client within a specified time limit and terminated the request.

Suggested actions:

- Double check why the called party did not respond.
- For direct routing calls, check your Session Border Control logs and settings and timeouts configuration.


### 531004 410 ICE connectivity checks failed

- `ParticipantEndSubReason`: **531004**
- `ParticipantEndReason`: **410**

Indicates that Interactive Connectivity Establishment (ICE) checks failed.

Suggested actions:

- The media path couldn't be established. Usually caused by incorrect network configuration. Verify your network configuration to make sure that the required IP addresses and ports aren't blocked. Read the guidelines in <https://www.rfc-editor.org/rfc/rfc5245#section-7>.
- For direct routing calls, check your Session Border Control logs and settings for ICE configuration and profile. Contact your SBC vendor for configuration help. For more information, see [List of Session Border Controllers certified for Azure Communication Services direct routing](../certified-session-border-controllers.md).


## 560480 480 No answer

- `ParticipantEndSubReason`: **560480**
- `ParticipantEndReason`: **480**

Indicates that:

- No answer from the called user
- Called user temporary unavailable  

Suggested actions:

- Double check why the called party did not respond.
- Retry the call later in case that the called party was temporary unavailable.
- For direct routing calls, check your Session Border Control logs and settings and timeouts configuration.


### 560484 484 Incomplete or invalid callee address

- `ParticipantEndSubReason`: **560484**
- `ParticipantEndReason`: **484**

Indicates one of the following failures:

- Incomplete or invalid callee address.
- Incomplete or invalid callee number format.

Suggested actions:

- In some cases, you can ignore these failures because the user is dialing an invalid number.
- Make sure the phone numbers are formatted correctly. For more information, see <https://en.wikipedia.org/wiki/E.164>.
- For direct routing, the SBC could cause these failures because of a missing configuration in a call transfer scenario.


### 560486 486 Callee user was busy

- `ParticipantEndSubReason`: **560484**
- `ParticipantEndReason`: **486**

Indicates that the called number was busy.

Suggested actions:

- The called number may be connected to an existing call, or having a technical problem.
- For direct routing calls, check your Session Border Control logs and settings and timeouts configuration.


### 540487 487 Call canceled by user

- `ParticipantEndSubReason`: **540487**
- `ParticipantEndReason`: **487**

The caller terminated the call request.

Suggested action is to retry the call, because the caller canceled.


### 560487 487 Call canceled by originator

- `ParticipantEndSubReason`: **560487**
- `ParticipantEndReason`: **487**

Indicates:

- The caller terminated the call request.
- Request terminated with normal call clearing.

Suggested action is to retry the call, because the caller canceled.


### 560500 500 Server Internal Error

- `ParticipantEndSubReason`: **560500**
- `ParticipantEndReason`: **500**

The call failed because an internal error occurred in one of the services involved in the call.

Suggested actions:

- One of the services involved in the call had an unexpected failure, resulting in the termination of the call. Retry the call, and if the issue persists contact your telco provider or Microsoft support.
- For direct routing calls, check your Session Border Control logs and settings and timeouts configuration, to see if your SBC caused the failure.


## 560503 503 Unexpected server error

- `ParticipantEndSubReason`: **560503**
- `ParticipantEndReason`: **503**

Indicates:

- Call failed because of an internal server error in one of the services involved in the call.
- The network used to establish the call is out of order.
- A temporary failure in one of the services involved in the call.

Suggested actions:

- Check your network and routing configuration for possible issues. Verify that your network firewall rules are correct.
- Retry the call, and if the issue persist contact your telco provider or Microsoft support.
- For direct routing calls, check your Session Border Control logs and settings and timeouts configuration, to see if your SBC caused the failure.


## ParticipantEndReason 603

Response `ParticipantEndReason` with value 603 means that the call was rejected without connecting.

### 560603 603 Call rejected

- `ParticipantEndSubReason`: **560603**
- `ParticipantEndReason`: **603**

The call was rejected for one of the following reasons:
- Call declined by the recipient.
- Call declined due to fraud detection.

Suggested actions:

- If declined by the recipient, retry the call.
- Ensure that you aren't exceeding the maximum number of concurrent calls allowed for your Azure Communication Services phone number. For more information, see [PSTN call limitations](../../service-limits.md#pstn-call-limitations).