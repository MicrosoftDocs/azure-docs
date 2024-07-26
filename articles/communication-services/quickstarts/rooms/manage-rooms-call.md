---
title: Quickstart - Manage a room call
titleSuffix: An Azure Communication Services Quickstart
description: In this quickstart, you'll learn how to manage a room call using Calling SDKs and Call Automation SDKs
services: azure-communication-services
author: mikehang
manager: alexokun

ms.author: mikehang
ms.date: 07/10/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Manage a room call

## Introduction
Once Azure Communication Services (ACS) room call is started, the call can be managed using Calling SDKs or Call Automation SDKs or both. In a room call, the mid-call actions are controlled by either the roles assigned to participants and properties configured in the room. The participant's roles are used to control capabilities permitted per participant while room's properties are applied to a room call as a whole.

## Calling SDKs
Calling SDK is a client side calling libraries enabling participants in a room call to perform several mid-call operations (e.g. screen share, turn on/off video, mute/unmute, etc. ). Full list of capabilities offered in Calling SDK is listed in the [Calling SDK Overview](../../concepts/voice-video-calling/calling-sdk-features.md#detailed-capabilities)

The capabilities are controlled based on roles assigned participants in the call (e.g. Only presenter can screen share). Please refer to [Rooms concepts](../../concepts/rooms/room-concept#predefined-participant-roles-and-permissions) for participant roles and permissions.

## Call Automation SDKs
Call Automation SDK is a sever side libraries enabling administrator to manage an ongoing room call in a central and controlled environment. Unlike Calling SDK, Call Automation SDK operations are roles agnostic. Therefore, a call administrator may perform several mid-call operations on behalf of the room call participants.

The following lists common mid-call actions available in a room call. 

### Connect to a room call
Call Automation must connect to an existing room call prior to performing any mid-call operations. CallConnected or ConnectFailed events are notified using callback mechanism to indicate a connect operation is successful or failed respectively.

### [csharp](#tab/csharp)

```csharp
Uri callbackUri = new Uri("https://<myendpoint>/Events"); //the callback endpoint where you want to receive subsequent events
CallLocator roomCallLocator = new RoomCallLocator("<RoomId>");
ConnectCallResult response = await client.ConnectAsync(roomCallLocator, callbackUri);
```

### [Java](#tab/java)

```java
String callbackUri = "https://<myendpoint>/Events"; //the callback endpoint where you want to receive subsequent events
CallLocator roomCallLocator =  new RoomCallLocator("<RoomId>");
ConnectCallResult response = client.connectCall(roomCallLocator, callbackUri).block();
```

### [JavaScript](#tab/javascript)

```javascript
const roomCallLocator = { kind: "roomCallLocator", id: "<RoomId>" };
const callbackUri = "https://<myendpoint>/Events"; // the callback endpoint where you want to receive subsequent events 
const response = await client.connectCall(roomCallLocator, callbackUri);
```

### [Python](#tab/python)

```python
callback_uri = "https://<myendpoint>/Events"  # the callback endpoint where you want to receive subsequent events
room_call_locator = RoomCallLocator("<room_id>")
call_connection_properties = client.connect_call(call_locator=room_call_locator, callback_url=callback_uri)
```
-----

Once successfully connected to a room call, a CallConnect event is notified via Callback URI. The ```callConnectionId``` is available such that it can be used to retrieve a call connection on the room call as needed. ```callConnectionId``` will be used in the following sample code snippets.


### Add PSTN Participant
Call Automation can dial out to a PSTN number and add the participant into a room call. A room, however, must be set up to enable PSTN dial-out option (EnabledPSTNDialout is set to true) and Azure Communication Services (ACS) resource must have a valid phone number. Please refer to [Rooms quickstart](get-started-rooms?tabs=windows&pivots=platform-azcli#enable-pstn-dial-out-capability-for-a-room) for detail.

### [csharp](#tab/csharp)

```csharp
var callerIdNumber = new PhoneNumberIdentifier("+16044561234"); // This is the Azure Communication Services provisioned phone number for the caller  
var callThisPerson = new CallInvite(new PhoneNumberIdentifier("+16041234567"), callerIdNumber); // person to call
CreateCallResult response = await client.GetCallConnection(callConnectionId).AddParticipantAsync(callThisPerson);
```

### [Java](#tab/java)

```java
PhoneNumberIdentifier callerIdNumber = new PhoneNumberIdentifier("+16044561234"); // This is the Azure Communication Services provisioned phone number for the caller
CallInvite callInvite = new CallInvite(new PhoneNumberIdentifier("+16041234567"), callerIdNumber);
AddParticipantOptions addParticipantOptions = new AddParticipantOptions(callInvite);
Response<AddParticipantResult> addParticipantResultResponse = client.getCallConnectionAsync(callConnectionId)
    .addParticipantWithResponse(addParticipantOptions).block();
```

### [JavaScript](#tab/javascript)

```javascript
const callInvite = {
    targetParticipant: { phoneNumber: "+18008008800" }, // person to call
    sourceCallIdNumber: { phoneNumber: "+18888888888" } // This is the Azure Communication Services provisioned phone number for the caller
};
const response = await client.getCallConnection(callConnectionId).addParticipant(callInvite);
```

### [Python](#tab/python)

```python
caller_id_number = PhoneNumberIdentifier(
    "+18888888888"
) # This is the Azure Communication Services provisioned phone number for the caller
target = PhoneNumberIdentifier("+18008008800"),

call_connection_client = call_automation_client.get_call_connection(
    "call_connection_id"
)
result = call_connection_client.add_participant(
    target,
    opration_context="Your context",
    operationCallbackUrl="<url_endpoint>"
)
```
-----

### Remove PSTN Participant

### [csharp](#tab/csharp)

```csharp

var removeThisUser = new PhoneNumberIdentifier("+16044561234");

// remove a participant from the call with optional parameters
var removeParticipantOptions = new RemoveParticipantOptions(removeThisUser)
{
    OperationContext = "operationContext",
    OperationCallbackUri = new Uri("uri_endpoint"); // Sending event to a non-default endpoint.
}

RemoveParticipantsResult result = await client.GetCallConnection(callConnectionId).RemoveParticipantAsync(removeParticipantOptions);
```

### [Java](#tab/java)

```java
CommunicationIdentifier removeThisUser = new PhoneNumberIdentifier("+16044561234");
RemoveParticipantOptions removeParticipantOptions = new RemoveParticipantOptions(removeThisUser)
                .setOperationContext("<operation_context>")
                .setOperationCallbackUrl("<url_endpoint>");
Response<RemoveParticipantResult> removeParticipantResultResponse = client.getCallConnectionAsync(callConnectionId)
    .removeParticipantWithResponse(removeParticipantOptions);
```

### [JavaScript](#tab/javascript)

```javascript
const removeThisUser = { phoneNumber: "+16044561234" };
const removeParticipantResult = await client.getCallConnection(callConnectionId).removeParticipant(removeThisUser);
```

### [Python](#tab/python)

```python
remove_this_user = PhoneNumberIdentifier("+16044561234")
call_connection_client = call_automation_client.get_call_connection(
    "call_connection_id"
)
result = call_connection_client.remove_participant(remove_this_user, opration_context="Your context", operationCallbackUrl="<url_endpoint>")
```
-----

### Send DTMF
Send a list of DTMF tones to an external participant.

### [csharp](#tab/csharp)
```csharp
var tones = new DtmfTone[] { DtmfTone.One, DtmfTone.Two, DtmfTone.Three, DtmfTone.Pound }; 
var sendDtmfTonesOptions = new SendDtmfTonesOptions(tones, new PhoneNumberIdentifier(calleePhonenumber))
{ 
	OperationContext = "dtmfs-to-ivr" 
}; 

var sendDtmfAsyncResult = await callAutomationClient.GetCallConnection(callConnectionId).GetCallMedia().SendDtmfTonesAsync(sendDtmfTonesOptions);

```
### [Java](#tab/java)
```java
List<DtmfTone> tones = Arrays.asList(DtmfTone.ONE, DtmfTone.TWO, DtmfTone.THREE, DtmfTone.POUND); 
SendDtmfTonesOptions options = new SendDtmfTonesOptions(tones, new PhoneNumberIdentifier(c2Target)); 
options.setOperationContext("dtmfs-to-ivr"); 
client.getCallConnectionAsync(callConnectionId)
	.getCallMediaAsync() 
	.sendDtmfTonesWithResponse(options) 
	.block(); 
```
### [JavaScript](#tab/javascript)
```javascript
const tones = [DtmfTone.One, DtmfTone.Two, DtmfTone.Three];
const sendDtmfTonesOptions: SendDtmfTonesOptions = {
	operationContext: "dtmfs-to-ivr"
};
const result: SendDtmfTonesResult = await client.getCallConnection(callConnectionId)
	.getCallMedia()
	.sendDtmfTones(tones, {
		phoneNumber: c2Target
	}, sendDtmfTonesOptions);
console.log("sendDtmfTones, result=%s", result);
```
### [Python](#tab/python)
```python
tones = [DtmfTone.ONE, DtmfTone.TWO, DtmfTone.THREE]
call_connection_client = call_automation_client.get_call_connection(
    "call_connection_id"
)

result = call_connection_client.send_dtmf_tones(
	tones = tones,
	target_participant = PhoneNumberIdentifier(c2_target),
	operation_context = "dtmfs-to-ivr")
```
-----

### Terminate a Call
Call Automation SDKs provides Hang Up action which can be used to terminate a call. CallDisconnected event is published once the Hang Up action has completed successfully.

### [csharp](#tab/csharp)

```csharp
_ = await client.GetCallConnection(callConnectionId).HangUpAsync(forEveryone: true); 
```

### [Java](#tab/java)

```java
Response<Void> response = client.getCallConnectionAsync(callConnectionId).hangUpWithResponse(true).block();
```

### [JavaScript](#tab/javascript)

```javascript
await callConnection.hangUp(true);
```

### [Python](#tab/python)

```python
call_connection_client = call_automation_client.get_call_connection(
    "call_connection_id"
)

call_connection_client.hang_up(is_for_everyone=True)
```
-----

## Other Actions
The following mid-call actions are also supported in a room call. 
1. Add participant (ACS identifier)
1. Remove participant (ACS identifier)
1. Cancel add participant (ACS identifier and PSTN number)
1. Hang up call
1. Get participant (ACS identifier and PSTN number)
1. Get multiple participants (ACS identifier and PSTN number)
1. Get latest info about a call
1. Play both audio files and text 
1. Play all both audio files and text
1. Recognize both DTMF and speech
1. Recognize continuous DTMF

Please see [call actions](../../how-tos/call-automation/actions-for-call-control?branch=pr-en-us-280574&tabs=csharp) and [media actions](../../how-tos/call-automation/control-mid-call-media-actions?branch=pr-en-us-280574&tabs=csharp) for detail.

## Next steps

In this section you learned how to:
> [!div class="checklist"]
> - Join a room call from your application
> - Add mid-call actions into a room call using calling SDKs
> - Add mid-call actions into a room call using Call Automation SDKs

You may also want to:
 - Learn about [Rooms concept](../../concepts/rooms/room-concept.md)
 - Learn about [Calling SDKs features](../../concepts/voice-video-calling/calling-sdk-features.md)
 - Learn about [Call Automation concepts](../../concepts/call-automation/call-automation.md)
