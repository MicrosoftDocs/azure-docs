---
title: Azure Communication Services Call Automation How-to for Passing Call Contextual Data in Call Automation 
titleSuffix: An Azure Communication Services how-to document
description: The article shows how to pass contextual information with Call Automation.
author: jutik0
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/28/2023
ms.author: jutav
manager: visho
services: azure-communication-services
---

# Pass contextual data between calls

Call Automation allows developers to pass along custom contextual information when routing calls. Developers can pass metadata about the call, caller, or any other information that's relevant to their application or business logic. Businesses can then manage and route calls across networks without having to worry about losing context.

Passing context is supported by specifying custom headers. This optional list of key/value pairs is included as part of `AddParticipant` or `Transfer` actions. The context is retrieved later as part of the `IncomingCall` event payload.

Custom call context is also forwarded to the Session Initiation Protocol (SIP), which includes both the freeform custom headers and the standard user-to-user information (UUI) SIP header. When an inbound call from your telephony network is routed, the data set from your Session Border Controller (SBC) in the custom headers and UUI is similarly included in the `IncomingCall` event payload.

All custom context data is opaque to Call Automation or SIP protocols, and its content is unrelated to any basic functions.

The following samples show how to get started by using custom context headers in Call Automation.

## Prerequisites

- Read the Call Automation [concepts article](../../concepts/call-automation/call-automation.md#call-actions) that describes the action-event programming model and event callbacks.
- Learn about the [user identifiers](../../concepts/identifiers.md#the-communicationidentifier-type) like `CommunicationUserIdentifier` and PhoneNumberIdentifier` that are used in this article.

For all the code samples, `client` is the `CallAutomationClient` object that you can create, and `callConnection` is the `CallConnection` object that you obtain from an `Answer` or `CreateCall` response. You can also obtain it from callback events that your application receives.

## Technical parameters

Call Automation supports up to five custom SIP headers and 1,000 custom voice-over-IP (VoIP) headers. Developers can include a dedicated user-to-user header as part of a SIP headers list.

Custom SIP header keys can now start with either the **X-\*** prefix or the **X-MS-Custom-\*** prefix.  
- **X-\*** is newly supported.  
- **X-MS-Custom-\*** remains supported for backward compatibility.  
- Any other **X-MS-\*** prefix is reserved and must not be used.

The maximum length of a SIP header key is **64 characters**, including the prefix, while the maximum length of a SIP header value is **256 characters**. The key can contain alphanumeric characters and the following symbols:  
```
`.`, `!`, `%`, `*`, `_`, `+`, `~`, and `-`
```
The SIP header value consists also of alphanumeric characters and a few selected symbols, which include:
```
`=`, `;`, `.`, `!`, `%`, `*`, `_`, `+`, `~`, and `-`.
```
> [!NOTE]
> The same limitations apply when configuring SIP headers on your SBC.


For VoIP header, the maximum length of a VoIP header key is **64 characters** while the maximum length of a VoIP header value is **1,024 characters**. These headers can be sent without the custom prefix. 

## Add custom context when you invite a participant

### [C#](#tab/csharp)

```csharp
// Invite an Azure Communication Services user and include one VOIP header
var addThisPerson = new CallInvite(new CommunicationUserIdentifier("<user_id>"));
addThisPerson.CustomCallingContext.AddVoip("myHeader", "myValue");
AddParticipantsResult result = await callConnection.AddParticipantAsync(addThisPerson);
// Invite a PSTN user and set UUI and custom SIP headers
var callerIdNumber = new PhoneNumberIdentifier("+16044561234"); 
var addThisPerson = new CallInvite(new PhoneNumberIdentifier("+16041234567"), callerIdNumber);

// Set custom UUI header. This key is sent on SIP protocol as User-to-User
addThisPerson.CustomCallingContext.AddSipUui("value");

// The provided key will be automatically prefixed with X-MS-Custom on SIP protocol, such as 'X-MS-Custom-{key}'
addThisPerson.CustomCallingContext.AddSipX("header1", "customSipHeaderValue1");
// The provided key prefix is based on SipHeaderPrefix param: SipHeaderPrefix.X → 'X-{key}', SipHeaderPrefix.XmsCustom → 'X-MS-Custom-{key}'
addThisPerson.CustomCallingContext.AddSipX("header2", "customSipHeaderValue2", SipHeaderPrefix.X);
AddParticipantsResult result = await callConnection.AddParticipantAsync(addThisPerson);
```
### [Java](#tab/java)
```java
// Invite an Azure Communication Services user and include one VOIP header
CallInvite callInvite = new CallInvite(new CommunicationUserIdentifier("<user_id>"));
callInvite.getCustomCallingContext().addVoip("voipHeaderName", "voipHeaderValue");
AddParticipantOptions addParticipantOptions = new AddParticipantOptions(callInvite);
Response<AddParticipantResult> addParticipantResultResponse = callConnectionAsync.addParticipantWithResponse(addParticipantOptions).block();

// Invite a PSTN user and set UUI and custom SIP headers
PhoneNumberIdentifier callerIdNumber = new PhoneNumberIdentifier("+16044561234");
CallInvite callInvite = new CallInvite(new PhoneNumberIdentifier("+16041234567"), callerIdNumber);
callInvite.getCustomCallingContext().addSipUui("value");
// The provided key will be automatically prefixed with X-MS-Custom on SIP protocol, such as 'X-MS-Custom-{key}'
callInvite.getCustomCallingContext().addSipX("header1", "customSipHeaderValue1");
// The provided key prefix is based on SipHeaderPrefix param: SipHeaderPrefix.X → 'X-{key}', SipHeaderPrefix.X_MS_CUSTOM → 'X-MS-Custom-{key}'
callInvite.getCustomCallingContext().addSipX("header2", "customSipHeaderValue2", SipHeaderPrefix.X);
AddParticipantOptions addParticipantOptions = new AddParticipantOptions(callInvite);
Response<AddParticipantResult> addParticipantResultResponse = callConnectionAsync.addParticipantWithResponse(addParticipantOptions).block();
```

### [JavaScript](#tab/javascript)
```javascript
// Invite an Azure Communication Services user and include one VOIP header
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
// The provided key will be automatically prefixed with X-MS-Custom on SIP protocol, such as 'X-MS-Custom-{key}'
customCallingContext.push({ kind: "sipx", key: "headerName", value: "headerValue" });
// The provided key prefix is based on sipHeaderPrefix param: X- → 'X-{key}', X-MS-Custom- → 'X-MS-Custom-{key}'
customCallingContext.push({ kind: "sipx", key: "headerName2", value: "headerValue2", sipHeaderPrefix: "X-" });
const addThisPerson = {
    targetParticipant: { phoneNumber: "+16041234567" }, 
    sourceCallIdNumber: callerIdNumber,
    customCallingContext: customCallingContext,
};
const addParticipantResult = await callConnection.addParticipant(addThisPerson);
```

### [Python](#tab/python)
```python
#Invite an Azure Communication Services user and include one VOIP header
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
# Specify dict key with X-MS-Custom prefix
sip_headers["X-MS-Custom-headerName"] = "headerValue"
# Specify dict key with X- prefix
sip_headers["X-headerName2"] = "headerValue2"
target = PhoneNumberIdentifier("+16041234567")
result = call_connection_client.add_participant(
    target,
    sip_headers=sip_headers,
    source_caller_id_number=caller_id_number
)
```

-----
## Add a custom context during a call transfer

### [C#](#tab/csharp)

```csharp
//Transfer to an Azure Communication Services user and include one VOIP header
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
// The provided key will be automatically prefixed with X-MS-Custom on SIP protocol, such as 'X-MS-Custom-{key}'
transferOption.CustomCallingContext.AddSipX("header1", "headerValue");
// The provided key prefix is based on SipHeaderPrefix param: SipHeaderPrefix.X → 'X-{key}', SipHeaderPrefix.XmsCustom → 'X-MS-Custom-{key}'
transferOption.CustomCallingContext.AddSipX("header2", "headerValue2", SipHeaderPrefix.X);
TransferCallToParticipantResult result = await callConnection.TransferCallToParticipantAsync(transferOption)
```

### [Java](#tab/java)
```java
//Transfer to an Azure Communication Services user and include one VOIP header
CommunicationIdentifier transferDestination = new CommunicationUserIdentifier("<user_id>");
TransferCallToParticipantOptions options = new TransferCallToParticipantOptions(transferDestination);
options.getCustomCallingContext().addVoip("voipHeaderName", "voipHeaderValue");
Response<TransferCallResult> transferResponse = callConnectionAsync.transferToParticipantCallWithResponse(options).block();

//Transfer a PSTN call to phone number and set UUI and custom SIP headers
CommunicationIdentifier transferDestination = new PhoneNumberIdentifier("<target_phoneNumber>");
TransferCallToParticipantOptions options = new TransferCallToParticipantOptions(transferDestination);
options.getCustomCallingContext().addSipUui("UUIvalue");
// The provided key will be automatically prefixed with X-MS-Custom on SIP protocol, such as 'X-MS-Custom-{key}'
options.getCustomCallingContext().addSipX("sipHeaderName", "value");
// The provided key prefix is based on SipHeaderPrefix param: SipHeaderPrefix.X → 'X-{key}', SipHeaderPrefix.X_MS_CUSTOM → 'X-MS-Custom-{key}'
options.getCustomCallingContext().addSipX("sipHeaderName2", "value2", SipHeaderPrefix.X);
Response<TransferCallResult> transferResponse = callConnectionAsync.transferToParticipantCallWithResponse(options).block();
```

### [JavaScript](#tab/javascript)
```javascript
//Transfer to an Azure Communication Services user and include one VOIP header
const transferDestination = { communicationUserId: "<user_id>" };
const transferee = { communicationUserId: "<transferee_user_id>" };
const options = { transferee: transferee, operationContext: "<Your_context>", operationCallbackUrl: "<url_endpoint>" };
const customCallingContext: CustomCallingContext = [];
customCallingContext.push({ kind: "voip", key: "customVoipHeader1", value: "customVoipHeaderValue1" })
options.customCallingContext = customCallingContext;
const result = await callConnection.transferCallToParticipant(transferDestination, options);

//Transfer a PSTN call to phone number and set UUI and custom SIP headers
const transferDestination = { phoneNumber: "<target_phoneNumber>" };
const transferee = { phoneNumber: "<transferee_phoneNumber>" };
const options = { transferee: transferee, operationContext: "<Your_context>", operationCallbackUrl: "<url_endpoint>" };
const customCallingContext: CustomCallingContext = [];
customCallingContext.push({ kind: "sipuui", key: "", value: "uuivalue" });
// The provided key will be automatically prefixed with X-MS-Custom on SIP protocol, such as 'X-MS-Custom-{key}'
customCallingContext.push({ kind: "sipx", key: "headerName", value: "headerValue" });
// The provided key prefix is based on sipHeaderPrefix param: X- → 'X-{key}', X-MS-Custom- → 'X-MS-Custom-{key}'
customCallingContext.push({ kind: "sipx", key: "headerName2", value: "headerValue2", sipHeaderPrefix: "X-" });
options.customCallingContext = customCallingContext;
const result = await callConnection.transferCallToParticipant(transferDestination, options);
```

### [Python](#tab/python)
```python
#Transfer to an Azure Communication Services user and include one VOIP header
transfer_destination = CommunicationUserIdentifier("<user_id>")
transferee = CommunicationUserIdentifier("transferee_user_id")
voip_headers = {"customVoipHeader1", "customVoipHeaderValue1"}
result = call_connection_client.transfer_call_to_participant(
    target_participant=transfer_destination,
    transferee=transferee,
    voip_headers=voip_headers,
    operation_context="Your context",
    operationCallbackUrl="<url_endpoint>"
)

#Transfer a PSTN call to phone number and set UUI and custom SIP headers
transfer_destination = PhoneNumberIdentifier("<target_phoneNumber>")
transferee = PhoneNumberIdentifier("transferee_phoneNumber")
sip_headers={}
sip_headers["User-To-User"] = "uuivalue"
# Specify dict key with X-MS-Custom prefix
sip_headers["X-MS-Custom-headerName"] = "headerValue"
# Specify dict key with X- prefix
sip_headers["X-headerName2"] = "headerValue2"
result = call_connection_client.transfer_call_to_participant(
    target_participant=transfer_destination,
    transferee=transferee,
    sip_headers=sip_headers,
    operation_context="Your context",
    operationCallbackUrl="<url_endpoint>"
)
```

Currently, transfer of a VoIP call to a phone number isn't supported.

-----
## Read custom context from an incoming call event

### [C#](#tab/csharp)

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
## Related content

- For a sample payload of the incoming call, see [Azure Communication Services: Voice and video calling events](../../../event-grid/communication-services-voice-video-events.md#microsoftcommunicationincomingcall).
- Learn more about [SIP protocol details for direct routing](../../concepts/telephony/direct-routing-sip-specification.md).
