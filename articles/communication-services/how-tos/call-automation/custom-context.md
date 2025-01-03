---
title: Azure Communication Services Call Automation how-to for passing call contextual data in Call Automation 
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide for passing contextual information with Call Automation.
author: jutik0
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

- Call Automation [concepts guide](../../concepts/call-automation/call-automation.md#call-actions) that describes the action-event programming model and event callbacks.
- Learn about [user identifiers](../../concepts/identifiers.md#the-communicationidentifier-type) like CommunicationUserIdentifier and PhoneNumberIdentifier used in this guide.

For all the code samples, `client` is CallAutomationClient object that can be created as shown and `callConnection` is the CallConnection object obtained from Answer or CreateCall response. You can also obtain it from callback events received by your application.

## Technical parameters
Call Automation supports up to 5 custom SIP headers and 1000 custom VOIP headers. Additionally, developers can include a dedicated User-To-User header as part of SIP headers list.

The custom SIP header key must start with a mandatory ‘X-MS-Custom-’ prefix.  The maximum length of a SIP header key is 64 chars, including the X-MS-Custom prefix. The SIP header key may consist of alphanumeric characters and a few selected symbols which includes `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`. The maximum length of SIP header value is 256 chars. The same limitations apply when configuring the SIP headers on your SBC. The SIP header value may consist of alphanumeric characters and a few selected symbols which includes `=`, `;`, `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`.

The maximum length of a VOIP header key is 64 chars. These headers can be sent without ‘x-MS-Custom’ prefix. The maximum length of VOIP header value is 1024 chars.

## Adding custom context when inviting a participant

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
### [Java](#tab/java)
```java
// Invite a communication services user and include one VOIP header
CallInvite callInvite = new CallInvite(new CommunicationUserIdentifier("<user_id>"));
callInvite.getCustomCallingContext().addVoip("voipHeaderName", "voipHeaderValue");
AddParticipantOptions addParticipantOptions = new AddParticipantOptions(callInvite);
Response<AddParticipantResult> addParticipantResultResponse = callConnectionAsync.addParticipantWithResponse(addParticipantOptions).block();

// Invite a PSTN user and set UUI and custom SIP headers
PhoneNumberIdentifier callerIdNumber = new PhoneNumberIdentifier("+16044561234");
CallInvite callInvite = new CallInvite(new PhoneNumberIdentifier("+16041234567"), callerIdNumber);
callInvite.getCustomCallingContext().addSipUui("value");
callInvite.getCustomCallingContext().addSipX("header1", "customSipHeaderValue1");
AddParticipantOptions addParticipantOptions = new AddParticipantOptions(callInvite);
Response<AddParticipantResult> addParticipantResultResponse = callConnectionAsync.addParticipantWithResponse(addParticipantOptions).block();
```

### [JavaScript](#tab/javascript)
```javascript
// Invite a communication services user and include one VOIP header
const customCallingContext: CustomCallingContext = [];
customCallingContext.push({ kind: "voip", key: "voipHeaderName", value: "voipHeaderValue" })
const addThisPerson = {
    targetParticipant: { communicationUserId: "<acs_user_id>" },
    customCallingContext: customCallingContext,
};
const addParticipantResult = await callConnection.addParticipant(addThisPerson);

// Invite a PSTN user and set UUI and custom SIP headers
const callerIdNumber = { phoneNumber: "+16044561234" };
const customCallingContext: CustomCallingContext = [];
customCallingContext.push({ kind: "sipuui", key: "", value: "value" });
customCallingContext.push({ kind: "sipx", key: "headerName", value: "headerValue" })
const addThisPerson = {
    targetParticipant: { phoneNumber: "+16041234567" }, 
    sourceCallIdNumber: callerIdNumber,
    customCallingContext: customCallingContext,
};
const addParticipantResult = await callConnection.addParticipant(addThisPerson);
```

### [Python](#tab/python)
```python
#Invite a communication services user and include one VOIP header
voip_headers = {"voipHeaderName", "voipHeaderValue"}
target = CommunicationUserIdentifier("<acs_user_id>")
result = call_connection_client.add_participant(
    target,
    voip_headers=voip_headers
)

#Invite a PSTN user and set UUI and custom SIP headers
caller_id_number = PhoneNumberIdentifier("+16044561234")
sip_headers = {}
sip_headers["User-To-User"] = "value"
sip_headers["X-MS-Custom-headerName"] = "headerValue"
target = PhoneNumberIdentifier("+16041234567")
result = call_connection_client.add_participant(
    target,
    sip_headers=sip_headers,
    source_caller_id_number=caller_id_number
)
```

-----
## Adding custom context during call transfer

### [csharp](#tab/csharp)

```csharp
//Transfer to communication services user and include one VOIP header
var transferDestination = new CommunicationUserIdentifier("<user_id>"); 
var transferOption = new TransferToParticipantOptions(transferDestination);   
var transferOption = new TransferToParticipantOptions(transferDestination) {
    OperationContext = "<Your_context>",
    OperationCallbackUri = new Uri("<uri_endpoint>") // Sending event to a non-default endpoint.
};
transferOption.CustomCallingContext.AddVoip("customVoipHeader1", "customVoipHeaderValue1");
TransferCallToParticipantResult result = await callConnection.TransferCallToParticipantAsync(transferOption);

//Transfer a PSTN call to phone number and set UUI and custom SIP headers
var transferDestination = new PhoneNumberIdentifier("<target_phoneNumber>");
var transferOption = new TransferToParticipantOptions(transferDestination);
transferOption.CustomCallingContext.AddSipUui("uuivalue");
transferOption.CustomCallingContext.AddSipX("header1", "headerValue");
TransferCallToParticipantResult result = await callConnection.TransferCallToParticipantAsync(transferOption)
```

### [Java](#tab/java)
```java
//Transfer to communication services user and include one VOIP header
CommunicationIdentifier transferDestination = new CommunicationUserIdentifier("<user_id>");
TransferCallToParticipantOptions options = new TransferCallToParticipantOptions(transferDestination);
options.getCustomCallingContext().addVoip("voipHeaderName", "voipHeaderValue");
Response<TransferCallResult> transferResponse = callConnectionAsync.transferToParticipantCallWithResponse(options).block();

//Transfer a PSTN call to phone number and set UUI and custom SIP headers
CommunicationIdentifier transferDestination = new PhoneNumberIdentifier("<taget_phoneNumber>");
TransferCallToParticipantOptions options = new TransferCallToParticipantOptions(transferDestination);
options.getCustomCallingContext().addSipUui("UUIvalue");
options.getCustomCallingContext().addSipX("sipHeaderName", "value");
Response<TransferCallResult> transferResponse = callConnectionAsync.transferToParticipantCallWithResponse(options).block();
```

### [JavaScript](#tab/javascript)
```javascript
//Transfer to communication services user and include one VOIP header
const transferDestination = { communicationUserId: "<user_id>" };
const transferee = { communicationUserId: "<transferee_user_id>" };
const options = { transferee: transferee, operationContext: "<Your_context>", operationCallbackUrl: "<url_endpoint>" };
const customCallingContext: CustomCallingContext = [];
customCallingContext.push({ kind: "voip", key: "customVoipHeader1", value: "customVoipHeaderValue1" })
options.customCallingContext = customCallingContext;
const result = await callConnection.transferCallToParticipant(transferDestination, options);

//Transfer a PSTN call to phone number and set UUI and custom SIP headers
const transferDestination = { phoneNumber: "<taget_phoneNumber>" };
const transferee = { phoneNumber: "<transferee_phoneNumber>" };
const options = { transferee: transferee, operationContext: "<Your_context>", operationCallbackUrl: "<url_endpoint>" };
const customCallingContext: CustomCallingContext = [];
customCallingContext.push({ kind: "sipuui", key: "", value: "uuivalue" });
customCallingContext.push({ kind: "sipx", key: "headerName", value: "headerValue" })
options.customCallingContext = customCallingContext;
const result = await callConnection.transferCallToParticipant(transferDestination, options);
```

### [Python](#tab/python)
```python
#Transfer to communication services user and include one VOIP header
transfer_destination = CommunicationUserIdentifier("<user_id>")
transferee = CommnunicationUserIdentifer("transferee_user_id")
voip_headers = {"customVoipHeader1", "customVoipHeaderValue1"}
result = call_connection_client.transfer_call_to_participant(
    target_participant=transfer_destination,
    transferee=transferee,
    voip_headers=voip_headers,
    opration_context="Your context",
    operationCallbackUrl="<url_endpoint>"
)

#Transfer a PSTN call to phone number and set UUI and custom SIP headers
transfer_destination = PhoneNumberIdentifer("<target_phoneNumber>")
transferee = PhoneNumberIdentifer("transferee_phoneNumber")
sip_headers={}
sip_headers["X-MS-Custom-headerName"] = "headerValue"
sip_headers["User-To-User"] = "uuivalue"
result = call_connection_client.transfer_call_to_participant(
    target_participant=transfer_destination,
    transferee=transferee,
    sip_headers=sip_headers,
    opration_context="Your context",
    operationCallbackUrl="<url_endpoint>"
)
```

Transfer of a VoIP call to a phone number is currently not supported.

-----
## Reading custom context from an incoming call event

### [csharp](#tab/csharp)

```csharp
AcsIncomingCallEventData incomingEvent = <incoming call event from Event Grid>;
// Retrieve incoming call custom context
AcsIncomingCallCustomContext callCustomContext = incomingEvent.CustomContext;

// Inspect dictionary with key/value pairs
var voipHeaders = callCustomContext.VoipHeaders;
var sipHeaders = callCustomContext.SipHeaders;

// Get SIP UUI header value
var userToUser = sipHeaders["user-To-User"]

// Proceed to answer or reject call as usual
```

### [Java](#tab/java)
```java
AcsIncomingCallEventData incomingEvent = <incoming call event from Event Grid>;
// Retrieve incoming call custom context
AcsIncomingCallCustomContext callCustomContext = incomingEvent.getCustomContext();

// Inspect dictionary with key/value pairs
Map<String, String> voipHeaders = callCustomContext.getVoipHeaders();
Map<String, String> sipHeaders = callCustomContext.getSipHeaders();

// Get SIP UUI header value
String userToUser = sipHeaders.get("user-To-User");

// Proceed to answer or reject call as usual
```

### [JavaScript](#tab/javascript)
```javascript
// Retrieve incoming call custom context
const callCustomContext = incomingEvent.customContext;

// Inspect dictionary with key/value pairs
const voipHeaders = callCustomContext.voipHeaders;
const sipHeaders = callCustomContext.sipHeaders;

// Get SIP UUI header value
const userToUser = sipHeaders["user-To-User"];

// Proceed to answer or reject call as usual
```

### [Python](#tab/python)
```python
# Retrieve incoming call custom context
callCustomContext = incomingEvent.customContext

# Inspect dictionary with key/value pairs
voipHeaders = callCustomContext.voipHeaders
sipHeaders = callCustomContext.sipHeaders

# Get SIP UUI header value
userToUser = sipHeaders["user-To-User"]

# Proceed to answer or reject call as usual
```

-----
## Additional resources

- For a sample payload of the incoming call, refer to this [guide](../../../event-grid/communication-services-voice-video-events.md#microsoftcommunicationincomingcall).

- Learn more about [SIP protocol details for direct routing](../../concepts/telephony/direct-routing-sip-specification.md).
