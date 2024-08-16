---
title: Quickstart - Manage a room call
titleSuffix: An Azure Communication Services Quickstart
description: In this quickstart, you learn how to manage a room call using Calling SDKs and Call Automation SDKs
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
During an Azure Communication Services (ACS) room call, you can manage the call using Calling SDKs or Call Automation SDKs or both. In a room call, you can control in-call actions using both the roles assigned to participants and properties configured in the room. The participant's roles control capabilities permitted per participant, while room properties apply to the room call as a whole.

## Calling SDKs
Calling SDK is a client-side calling library enabling participants in a room call to perform several in-call operations, such as screen share, turn on/off video, mute/unmute, and so on. For the full list of capabilities, see [Calling SDK Overview](../../concepts/voice-video-calling/calling-sdk-features.md#detailed-capabilities).

You control the capabilities based on roles assigned to participants in the call. For example, only the presenter can screen share. For participant roles and permissions, see [Rooms concepts](../../concepts/rooms/room-concept.md#predefined-participant-roles-and-permissions).

## Call Automation SDKs
Call Automation SDK is a server-side library enabling administrators to manage an ongoing room call in a central and controlled environment. Unlike Calling SDK, Call Automation SDK operations are roles agnostic. Therefore, a call administrator can perform several in-call operations on behalf of the room call participants.

The following lists describe common in-call actions available in a room call.

### Connect to a room call
Call Automation must connect to an existing room call before performing any in-call operations. The `CallConnected` or `ConnectFailed` events are raised using callback mechanisms to indicate if a connect operation was successful or failed respectively.

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

Once successfully connected to a room call, a `CallConnect` event is notified via Callback URI. You can use `callConnectionId` to retrieve a call connection on the room call as needed. The following sample code snippets use the `callConnectionId` to demonstrate this function.


### Add PSTN participant
Using Call Automation you can dial out to a PSTN number and add the participant into a room call. You must, however, set up a room to enable PSTN dial-out option (`EnabledPSTNDialout` set to `true`) and the Azure Communication Services resource must have a valid phone number provisioned.

For more information, see [Rooms quickstart](../../quickstarts//rooms/get-started-rooms.md?tabs=windows&pivots=platform-azcli#enable-pstn-dial-out-capability-for-a-room).


### [csharp](#tab/csharp)

```csharp
var callerIdNumber = new PhoneNumberIdentifier("+16044561234"); // This is the ACS-provisioned phone number for the caller  
var callThisPerson = new CallInvite(new PhoneNumberIdentifier("+16041234567"), callerIdNumber); // The target phone number to dial out to
CreateCallResult response = await client.GetCallConnection(callConnectionId).AddParticipantAsync(callThisPerson);
```

### [Java](#tab/java)

```java
PhoneNumberIdentifier callerIdNumber = new PhoneNumberIdentifier("+16044561234"); // This is the ACS-provisioned phone number for the caller
CallInvite callInvite = new CallInvite(new PhoneNumberIdentifier("+16041234567"), callerIdNumber); // The phone number participant to dial out to
AddParticipantOptions addParticipantOptions = new AddParticipantOptions(callInvite);
Response<AddParticipantResult> addParticipantResultResponse = client.getCallConnectionAsync(callConnectionId)
    .addParticipantWithResponse(addParticipantOptions).block();
```

### [JavaScript](#tab/javascript)

```javascript
const callInvite = {
    targetParticipant: { phoneNumber: "+18008008800" }, // The phone number participant to dial out to
    sourceCallIdNumber: { phoneNumber: "+18888888888" } // This is the ACS-provisioned phone number for the caller
};
const response = await client.getCallConnection(callConnectionId).addParticipant(callInvite);
```

### [Python](#tab/python)

```python
caller_id_number = PhoneNumberIdentifier(
    "+18888888888"
) # TThis is the ACS-provisioned phone number for the caller
target = PhoneNumberIdentifier("+18008008800"), # The phone number participant to dial out to

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

### Remove PSTN participant

### [csharp](#tab/csharp)

```csharp

var removeThisUser = new PhoneNumberIdentifier("+16044561234");

// Remove a participant from the call with optional parameters
var removeParticipantOptions = new RemoveParticipantOptions(removeThisUser)
{
    OperationContext = "operationContext",
    OperationCallbackUri = new Uri("uri_endpoint"); // Sending event to a non-default endpoint
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

### Call recording
Azure Communication Services rooms support recording capabilities including `start`, `stop`, `pause`, `resume`, and so on, provided by Call Automation. See the following code snippets to start/stop/pause/resume a recording in a room call. For a complete list of actions, see [Call Automation recording](../../concepts/voice-video-calling/call-recording.md#get-full-control-over-your-recordings-with-our-call-recording-apis).

### [csharp](#tab/csharp)
```csharp
// Start recording
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<ServerCallId>"))
{
   RecordingContent = RecordingContent.Audio,
   RecordingChannel = RecordingChannel.Unmixed,
   RecordingFormat = RecordingFormat.Wav,
   RecordingStateCallbackUri = new Uri("<CallbackUri>"),
   RecordingStorage = RecordingStorage.CreateAzureBlobContainerRecordingStorage(new Uri("<YOUR_STORAGE_CONTAINER_URL>"))
};
Response<RecordingStateResult> response = await callAutomationClient.GetCallRecording()
.StartAsync(recordingOptions);

// Pause recording using recordingId received in response of start recording.
var pauseRecording = await callAutomationClient.GetCallRecording ().PauseAsync(recordingId);

// Resume recording using recordingId received in response of start recording.
var resumeRecording = await callAutomationClient.GetCallRecording().ResumeAsync(recordingId);

// Stop recording using recordingId received in response of start recording.
var stopRecording = await callAutomationClient.GetCallRecording().StopAsync(recordingId);

```
### [Java](#tab/java)
```java
// Start recording
StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator("<serverCallId>"))
                    .setRecordingChannel(RecordingChannel.UNMIXED)
                    .setRecordingFormat(RecordingFormat.WAV)
                    .setRecordingContent(RecordingContent.AUDIO)
                    .setRecordingStateCallbackUrl("<recordingStateCallbackUrl>");

Response<RecordingStateResult> response = callAutomationClient.getCallRecording()
.startWithResponse(recordingOptions, null);

// Pause recording using recordingId received in response of start recording
Response<Void> response = callAutomationClient.getCallRecording()
              .pauseWithResponse(recordingId, null);

// Resume recording using recordingId received in response of start recording
Response<Void> response = callAutomationClient.getCallRecording()
               .resumeWithResponse(recordingId, null);

// Stop recording using recordingId received in response of start recording
Response<Void> response = callAutomationClient.getCallRecording()
               .stopWithResponse(recordingId, null);

```
### [JavaScript](#tab/javascript)
```javascript
// Start recording
var locator: CallLocator = { id: "<ServerCallId>", kind: "serverCallLocator" };

var options: StartRecordingOptions =
{
  callLocator: locator,
  recordingContent: "audio",
  recordingChannel:"unmixed",
  recordingFormat: "wav",
  recordingStateCallbackEndpointUrl: "<CallbackUri>"
};
var response = await callAutomationClient.getCallRecording().start(options);

// Pause recording using recordingId received in response of start recording
var pauseRecording = await callAutomationClient.getCallRecording().pause(recordingId);

// Resume recording using recordingId received in response of start recording.
var resumeRecording = await callAutomationClient.getCallRecording().resume(recordingId);

// Stop recording using recordingId received in response of start recording
var stopRecording = await callAutomationClient.getCallRecording().stop(recordingId);

```
### [Python](#tab/python)
```python
# Start recording
response = call_automation_client.start_recording(call_locator=ServerCallLocator(server_call_id),
            recording_content_type = RecordingContent.Audio,
            recording_channel_type = RecordingChannel.Unmixed,
            recording_format_type = RecordingFormat.Wav,
            recording_state_callback_url = "<CallbackUri>")

# Pause recording using recording_id received in response of start recording
pause_recording = call_automation_client.pause_recording(recording_id = recording_id)

# Resume recording using recording_id received in response of start recording
resume_recording = call_automation_client.resume_recording(recording_id = recording_id)

# Stop recording using recording_id received in response of start recording
stop_recording = call_automation_client.stop_recording(recording_id = recording_id)
```
-----

### Terminate a call
You can use the Call Automation SDK Hang Up action to terminate a call. When the Hang Up action completes, the SDK publishes a `CallDisconnected` event.

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

## Other actions
The following in-call actions are also supported in a room call. 
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

For more information, see [call actions](../../how-tos/call-automation/actions-for-call-control.md?branch=pr-en-us-280574&tabs=csharp) and [media actions](../../how-tos/call-automation/control-mid-call-media-actions.md?branch=pr-en-us-280574&tabs=csharp).

## Next steps

In this section you learned how to:
> [!div class="checklist"]
> - Join a room call from your application
> - Add in-call actions into a room call using calling SDKs
> - Add in-call actions into a room call using Call Automation SDKs

You may also want to:
 - Learn about [Rooms concept](../../concepts/rooms/room-concept.md)
 - Learn about [Calling SDKs features](../../concepts/voice-video-calling/calling-sdk-features.md)
 - Learn about [Call Automation concepts](../../concepts/call-automation/call-automation.md)
