---
title: Azure Communication Services Call Automation how-to for passing call contextual data in Call Automation 
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for passing contextual information with Call Automation.
author: juta
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/28/2023
ms.author: jutav
manager: visho
services: azure-communication-services
---

# How to pass contextual data between calls

Call Automation allows developers to pass along custom contextual information when routing calls. Developers can pass metadata about the call, callee or any other information that is relevant to their application or business logic. This allows businesses to manage, and route calls across networks without having to worry about losing context.

Passing context is supported by specifying custom headers. These are an optional list of key-value pairs that can be included as part of `AddParticipant` or `Transfer` actions. The context can be later retrieved as part of the `IncomingCall` event payload.

Custom call context is also forwarded to the SIP protocol, this includes both the freeform custom headers as well as the standard User-to-User Information (UUI) SIP header. When routing an inbound call from your telephony network, the data set from your SBC in the custom headers and UUI is similarly included in the `IncomingCall` event payload. 

All custom context data is opaque to Call Automation or SIP protocols and its content is unrelated to any basic functions.

Below are samples on how to get started using custom context headers in Call Automation. 

As a prerequisite, we recommend you to read these articles to make the most of this guide:

1. Call Automation [concepts guide](../../concepts/call-automation/call-automation.md#call-actions) that describes the action-event programming model and event callbacks.
2. Learn about [user identifiers](../../concepts/identifiers.md#the-communicationidentifier-type) like CommunicationUserIdentifier and PhoneNumberIdentifier used in this guide.

For all the code samples, `client` is CallAutomationClient object that can be created as shown and `callConnection` is the CallConnection object obtained from Answer or CreateCall response. You can also obtain it from callback events received by your application.

-----
# Technical parameters
Call Automation supports up to 5 custom SIP headers and 1000 custom VOIP headers. Additionally, developers can include a dedicated User-To-User header as part of SIP headers list.

The custom SIP header key must start with a mandatory ‘X-MS-Custom-’ prefix.  The maximum length of a SIP header key is 64 chars, including the X-MS-Custom prefix. The maximum length of SIP header value is 256 chars. The same limitations apply when configuring the SIP headers on your SBC.

The maximum length of a VOIP header key is 64 chars. These headers can be sent without ‘x-MS-Custom’ prefix. The maximum length of VOIP header value is 1024 chars.

-----

# Adding custom context when inviting a participant

### [csharp](#tab/csharp)

```csharp
// Invite a communication services user and include one VOIP header
var addThisPerson = new CallInvite(new CommunicationUserIdentifier("<user_id>"));
addThisPerson.CustomCallingContext.AddVoip("myHeader", "myValue");
AddParticipantsResult result = await callConnection.AddParticipantAsync(addThisPerson);
// Invite a PSTN user and set UUI and custom SIP headers
var callerIdNumber = new PhoneNumberIdentifier("+16044561234"); 
var addThisPerson = new CallInvite(new PhoneNumberIdentifier("+16041234567"), callerIdNumber);

// Set custom UUI header. This key is sent on SIP protocol as User-to-User
addThisPerson.CustomCallingContext.AddSipUui("value");

// This provided key will be automatically prefixed with X-MS-Custom on SIP protocol, such as 'X-MS-Custom-{key}'
addThisPerson.CustomCallingContext.AddSipX("header1", "customSipHeaderValue1");
AddParticipantsResult result = await callConnection.AddParticipantAsync(addThisPerson);
```

-----
# Adding custom context during call transfer

### [csharp](#tab/csharp)

```csharp
var transferDestination = new CommunicationUserIdentifier("<user_id>"); 
var transferOption = new TransferToParticipantOptions(transferDestination);   
var transferOption = new TransferToParticipantOptions(transferDestination) {
    OperationContext = "<Your_context>",
    OperationCallbackUri = new Uri("<uri_endpoint>") // Sending event to a non-default endpoint.
};
// adding customCallingContext
transferOption.CustomCallingContext.AddVoip("customVoipHeader1", "customVoipHeaderValue1");
transferOption.CustomCallingContext.AddVoip("customVoipHeader2", "customVoipHeaderValue2");

TransferCallToParticipantResult result = await callConnection.TransferCallToParticipantAsync(transferOption);
```

Transfer of a VoIP call to a phone number is currently not supported.

-----
# Reading custom context from an incoming call event

### [csharp](#tab/csharp)

```csharp
AcsIncomingCallEventData incomingEvent = <incoming call event from Event Grid>;
// Retrieve incoming call custom context
AcsIncomingCallCustomContext callCustomContext = incomingEvent.CustomContext;

// Inspect dictionary with key/value pairs
var voipHeaders = callCustomContext.VoipHeaders;
var sipHeaders = callCustomContext.SipHeaders;

// Proceed to answer or reject call as usual
```
-----
# Additional resources

- For a sample payload of the incoming call, refer to this [guide](../../../event-grid/communication-services-voice-video-events.md#microsoftcommunicationincomingcall).

- Learn more about [SIP protocol details for direct routing](../../concepts/telephony/direct-routing-sip-specification.md).
