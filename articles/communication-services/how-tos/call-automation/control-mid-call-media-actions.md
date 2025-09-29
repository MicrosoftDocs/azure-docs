---
title: Azure Communication Services Call Automation How-to for Managing Media Actions with Call Automation 
titleSuffix: An Azure Communication Services how-to document
description: The article shows how to use mid-call media actions on a call with Call Automation.
author: kunaal
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 07/16/2024
ms.author: kpunjabi
services: azure-communication-services
ms.custom:
  - public_preview
  - sfi-ropc-nochange
---

# Control mid-call media actions with Call Automation

Call Automation uses a REST API interface to receive requests for actions and provide responses to notify whether the request was successfully submitted or not. Because of the asynchronous nature of calling, most actions have corresponding events that are triggered when the action finishes successfully or fails. This article covers the actions that are available to developers during calls, like `SendDTMF` and `ContinuousDtmfRecognition`. Actions are accompanied with sample code on how to invoke the particular action.

Call Automation supports other actions to manage calls and recordings that aren't included in this article.

> [!NOTE]
> Call Automation currently doesn't interoperate with Microsoft Teams. Actions like making or redirecting a call to a Teams user or playing audio to a Teams user by using Call Automation aren't supported.

## Prerequisites

- Read the Call Automation [concepts article](../../concepts/call-automation/call-automation.md#call-actions) that describes the action-event programming model and event callbacks.
- Learn about the [user identifiers](../../concepts/identifiers.md#the-communicationidentifier-type) like `CommunicationUserIdentifier` and `PhoneNumberIdentifier` that are used in this article.
- Learn more about how to [control and steer calls with Call Automation](./actions-for-call-control.md), which teaches you about the basics of dealing with a call.

For all the code samples, `client` is the `CallAutomationClient` object that you can create, as shown, and `callConnection` is the `CallConnection` object that you obtain from the `Answer` or `CreateCall` response. You can also obtain it from callback events that your application receives.

### [C#](#tab/csharp)

```csharp
var callAutomationClient = new CallAutomationClient("<Azure Communication Services connection string>");
```

### [Java](#tab/java)

```java
CallAutomationClient callAutomationClient = new CallAutomationClientBuilder() 
    .connectionString("<Azure Communication Services connection string>") 
    .buildClient();
```

### [JavaScript](#tab/javascript)

```javascript
callAutomationClient = new CallAutomationClient(("<Azure Communication Services connection string>"); 
```

### [Python](#tab/python)

```python
call_automation_client = CallAutomationClient.from_connection_string((("<Azure Communication Services connection string>") 
```
-----

## Send DTMF

You can send dual-tone multifrequency (DTMF) tones to an external participant. This capability might be useful when you're already on a call and need to invite another participant who has an extension number or uses an interactive voice response menu.

>[!NOTE]
>This feature is supported only for external participants on public-switched telephone networks and supports sending a maximum of 18 tones at a time.

### SendDtmfAsync method

Send a list of DTMF tones to an external participant.

### [C#](#tab/csharp)

```csharp
var tones = new DtmfTone[] { DtmfTone.One, DtmfTone.Two, DtmfTone.Three, DtmfTone.Pound }; 
var sendDtmfTonesOptions = new SendDtmfTonesOptions(tones, new PhoneNumberIdentifier(calleePhonenumber))
{ 
	OperationContext = "dtmfs-to-ivr" 
}; 

var sendDtmfAsyncResult = await callAutomationClient.GetCallConnection(callConnectionId) 
	.GetCallMedia() 
        .SendDtmfTonesAsync(sendDtmfTonesOptions); 
```

### [Java](#tab/java)

```java
List<DtmfTone> tones = Arrays.asList(DtmfTone.ONE, DtmfTone.TWO, DtmfTone.THREE, DtmfTone.POUND); 
SendDtmfTonesOptions options = new SendDtmfTonesOptions(tones, new PhoneNumberIdentifier(c2Target)); 
options.setOperationContext("dtmfs-to-ivr"); 
callAutomationClient.getCallConnectionAsync(callConnectionId) 
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
const result: SendDtmfTonesResult = await callAutomationClient.getCallConnection(callConnectionId)
	.getCallMedia()
	.sendDtmfTones(tones, {
		phoneNumber: c2Target
	}, sendDtmfTonesOptions);
console.log("sendDtmfTones, result=%s", result);
```

### [Python](#tab/python)

```python
tones = [DtmfTone.ONE, DtmfTone.TWO, DtmfTone.THREE]
result = call_automation_client.get_call_connection(call_connection_id).send_dtmf_tones(
	tones = tones,
	target_participant = PhoneNumberIdentifier(c2_target),
	operation_context = "dtmfs-to-ivr")
app.logger.info("Send dtmf, result=%s", result)
```
-----

When your application sends these DTMF tones, you receive event updates. You can use the `SendDtmfTonesCompleted` and `SendDtmfTonesFailed` events to create business logic in your application to determine the next steps.

An example of a `SendDtmfTonesCompleted` event:

### [C#](#tab/csharp)

``` csharp
if (acsEvent is SendDtmfTonesCompleted sendDtmfCompleted) 
{ 
    logger.LogInformation("Send DTMF succeeded, context={context}", sendDtmfCompleted.OperationContext); 
} 
```

### [Java](#tab/java)

``` java
if (acsEvent instanceof SendDtmfTonesCompleted) { 
    SendDtmfTonesCompleted event = (SendDtmfTonesCompleted) acsEvent; 
    log.info("Send dtmf succeeded: context=" + event.getOperationContext()); 
} 
```

### [JavaScript](#tab/javascript)

```javascript
if (event.type === "Microsoft.Communication.SendDtmfTonesCompleted") {
	console.log("Send dtmf succeeded: context=%s", eventData.operationContext);
}
```

### [Python](#tab/python)

```python
if event.type == "Microsoft.Communication.SendDtmfTonesCompleted":
	app.logger.info("Send dtmf succeeded: context=%s", event.data['operationContext']);
```
-----

An example of a `SendDtmfTonesFailed` event:

### [C#](#tab/csharp)

```csharp
if (acsEvent is SendDtmfTonesFailed sendDtmfFailed) 
{ 
    logger.LogInformation("Send dtmf failed: result={result}, context={context}", 
        sendDtmfFailed.ResultInformation?.Message, sendDtmfFailed.OperationContext); 
} 
```

### [Java](#tab/java)

```java
if (acsEvent instanceof SendDtmfTonesFailed) { 
    SendDtmfTonesFailed event = (SendDtmfTonesFailed) acsEvent; 
    log.info("Send dtmf failed: result=" + event.getResultInformation().getMessage() + ", context=" 
        + event.getOperationContext()); 
} 
```

### [JavaScript](#tab/javascript)

```javascript
if (event.type === "Microsoft.Communication.SendDtmfTonesFailed") {
	console.log("sendDtmfTones failed: result=%s, context=%s",
		eventData.resultInformation.message,
		eventData.operationContext);
}
```

### [Python](#tab/python)

```python
if event.type == "Microsoft.Communication.SendDtmfTonesFailed": 
    app.logger.info("Send dtmf failed: result=%s, context=%s", event.data['resultInformation']['message'], event.data['operationContext']) 
```
-----

## Continuous DTMF recognition

You can subscribe to receive continuous DTMF tones throughout the call. Your application receives DTMF tones when the targeted participant presses on a key on their keypad. The tones are sent to your application one by one as the participant presses on them.

### StartContinuousDtmfRecognitionAsync method

Start detecting DTMF tones sent by a participant.

### [C#](#tab/csharp)

```csharp
await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .StartContinuousDtmfRecognitionAsync(new PhoneNumberIdentifier(c2Target), "dtmf-reco-on-c2"); 
```

### [Java](#tab/java)

```java
ContinuousDtmfRecognitionOptions options = new ContinuousDtmfRecognitionOptions(new PhoneNumberIdentifier(c2Target)); 
options.setOperationContext("dtmf-reco-on-c2"); 
callAutomationClient.getCallConnectionAsync(callConnectionId) 
	.getCallMediaAsync() 
	.startContinuousDtmfRecognitionWithResponse(options) 
	.block(); 
```

### [JavaScript](#tab/javascript)

```javascript
const continuousDtmfRecognitionOptions: ContinuousDtmfRecognitionOptions = {
	operationContext: "dtmf-reco-on-c2"
};

await callAutomationclient.getCallConnection(callConnectionId)
	.getCallMedia()
	.startContinuousDtmfRecognition({
		phoneNumber: c2Target
	}, continuousDtmfRecognitionOptions);
```

### [Python](#tab/python)

```python
call_automation_client.get_call_connection(
    call_connection_id
).start_continuous_dtmf_recognition(
    target_participant=PhoneNumberIdentifier(c2_target),
    operation_context="dtmf-reco-on-c2",
)
app.logger.info("Started continuous DTMF recognition")
```
-----

When your application no longer wants to receive DTMF tones from the participant, use the `StopContinuousDtmfRecognitionAsync` method to let Azure Communication Services know to stop detecting DTMF tones.

### StopContinuousDtmfRecognitionAsync

Stop detecting DTMF tones sent by a participant.

### [C#](#tab/csharp)

```csharp
var continuousDtmfRecognitionOptions = new ContinuousDtmfRecognitionOptions(new PhoneNumberIdentifier(callerPhonenumber)) 
{ 
    OperationContext = "dtmf-reco-on-c2" 
}; 

var startContinuousDtmfRecognitionAsyncResult = await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .StartContinuousDtmfRecognitionAsync(continuousDtmfRecognitionOptions); 
```

### [Java](#tab/java)

```java
ContinuousDtmfRecognitionOptions options = new ContinuousDtmfRecognitionOptions(new PhoneNumberIdentifier(c2Target)); 
options.setOperationContext("dtmf-reco-on-c2"); 
callAutomationClient.getCallConnectionAsync(callConnectionId) 
	.getCallMediaAsync() 
	.stopContinuousDtmfRecognitionWithResponse(options) 
	.block(); 
```

### [JavaScript](#tab/javascript)

```javascript
const continuousDtmfRecognitionOptions: ContinuousDtmfRecognitionOptions = {
	operationContext: "dtmf-reco-on-c2"
};

await callAutomationclient.getCallConnection(callConnectionId)
	.getCallMedia()
	.stopContinuousDtmfRecognition({
		phoneNumber: c2Target
	}, continuousDtmfRecognitionOptions);
```

### [Python](#tab/python)

```python
call_automation_client.get_call_connection(call_connection_id).stop_continuous_dtmf_recognition( 
    target_participant=PhoneNumberIdentifier(c2_target), 
    operation_context="dtmf-reco-on-c2") 
app.logger.info("Stopped continuous DTMF recognition") 
```
-----

Your application receives event updates when these actions either succeed or fail. You can use these events to build custom business logic to configure the next step that your application needs to take when it receives these event updates.

### ContinuousDtmfRecognitionToneReceived Event

An example of how you can handle a DTMF tone that was successfully detected.

### [C#](#tab/csharp)

``` csharp
if (acsEvent is ContinuousDtmfRecognitionToneReceived continuousDtmfRecognitionToneReceived) 
{ 
	logger.LogInformation("Tone detected: sequenceId={sequenceId}, tone={tone}", 
	continuousDtmfRecognitionToneReceived.SequenceId, 
        continuousDtmfRecognitionToneReceived.Tone); 
} 
```

### [Java](#tab/java)

``` java
 if (acsEvent instanceof ContinuousDtmfRecognitionToneReceived) { 
	ContinuousDtmfRecognitionToneReceived event = (ContinuousDtmfRecognitionToneReceived) acsEvent; 
	log.info("Tone detected: sequenceId=" + event.getSequenceId() 
		+ ", tone=" + event.getTone().convertToString() 
		+ ", context=" + event.getOperationContext()); 
} 
```

### [JavaScript](#tab/javascript)

```javascript
if (event.type === "Microsoft.Communication.ContinuousDtmfRecognitionToneReceived") { 
	console.log("Tone detected: sequenceId=%s, tone=%s, context=%s", 
        	eventData.sequenceId, 
        	eventData.tone, 
		eventData.operationContext); 
} 
```

### [Python](#tab/python)

```python
if event.type == "Microsoft.Communication.ContinuousDtmfRecognitionToneReceived":  
	app.logger.info("Tone detected: sequenceId=%s, tone=%s, context=%s",  
		event.data['sequenceId'],  
                event.data['tone'],  
		event.data['operationContext'])  
```
-----

Azure Communication Services provides you with `SequenceId` as part of the `ContinuousDtmfRecognitionToneReceived` event. Your application can use it to reconstruct the order in which the participant entered the DTMF tones.

### ContinuousDtmfRecognitionFailed Event

An example of what to do when DTMF tone detection fails.

### [C#](#tab/csharp)

``` csharp
if (acsEvent is ContinuousDtmfRecognitionToneFailed continuousDtmfRecognitionToneFailed) 
{ 
    logger.LogInformation("Start continuous DTMF recognition failed, result={result}, context={context}", 
        continuousDtmfRecognitionToneFailed.ResultInformation?.Message, 
        continuousDtmfRecognitionToneFailed.OperationContext); 
} 
```

### [Java](#tab/java)

``` java
if (acsEvent instanceof ContinuousDtmfRecognitionToneFailed) { 
    ContinuousDtmfRecognitionToneFailed event = (ContinuousDtmfRecognitionToneFailed) acsEvent; 
    log.info("Tone failed: result="+ event.getResultInformation().getMessage() 
        + ", context=" + event.getOperationContext()); 
} 
```

### [JavaScript](#tab/javascript)

```javascript
if (event.type === "Microsoft.Communication.ContinuousDtmfRecognitionToneFailed") {
	console.log("Tone failed: result=%s, context=%s", eventData.resultInformation.message, eventData.operationContext);
}
```

### [Python](#tab/python)

```python
if event.type == "Microsoft.Communication.ContinuousDtmfRecognitionToneFailed":
    app.logger.info(
        "Tone failed: result=%s, context=%s",
        event.data["resultInformation"]["message"],
        event.data["operationContext"],
    )
```
-----

### ContinuousDtmfRecognitionStopped Event

An example of what to do when continuous DTMF recognition stops. Maybe your application invoked the `StopContinuousDtmfRecognitionAsync` event or the call ended.

### [C#](#tab/csharp)

``` csharp
if (acsEvent is ContinuousDtmfRecognitionStopped continuousDtmfRecognitionStopped) 
{ 
    logger.LogInformation("Continuous DTMF recognition stopped, context={context}", continuousDtmfRecognitionStopped.OperationContext); 
} 
```

### [Java](#tab/java)

``` java
if (acsEvent instanceof ContinuousDtmfRecognitionStopped) { 
    ContinuousDtmfRecognitionStopped event = (ContinuousDtmfRecognitionStopped) acsEvent; 
    log.info("Tone stopped, context=" + event.getOperationContext()); 
} 
```

### [JavaScript](#tab/javascript)

```javascript
if (event.type === "Microsoft.Communication.ContinuousDtmfRecognitionStopped") {
	console.log("Tone stopped: context=%s", eventData.operationContext);
}
```

### [Python](#tab/python)

```python
if event.type == "Microsoft.Communication.ContinuousDtmfRecognitionStopped":
    app.logger.info("Tone stopped: context=%s", event.data["operationContext"])
```
-----

### Hold

The hold action allows developers to temporarily pause a conversation between a participant and a system or agent. This capability is useful in scenarios where the participant needs to be transferred to another agent or department or when the agent needs to consult a supervisor before continuing the conversation. During this time, you can choose to play audio to the participant who is on hold.

### [C#](#tab/csharp)

```csharp
// Option 1: Hold without additional options
await callAutomationClient.GetCallConnection(callConnectionId)
    .GetCallMedia().HoldAsync(c2Target);

/*
// Option 2: Hold with play source
PlaySource playSource = /* initialize playSource */;
await callAutomationClient.GetCallConnection(callConnectionId)
    .GetCallMedia().HoldAsync(c2Target, playSource);

// Option 3: Hold with options
var holdOptions = new HoldOptions(target) 
{ 
    OperationCallbackUri = new Uri(""),
    OperationContext = "holdcontext"
};
await callMedia.HoldAsync(holdOptions);
*/
```

### [Java](#tab/java)

```java
// Option 1: Hold with options
PlaySource playSource = /* initialize playSource */;
HoldOptions holdOptions = new HoldOptions(target)
    .setOperationCallbackUrl(appConfig.getBasecallbackuri())
    .setPlaySource(playSource)
    .setOperationContext("holdPstnParticipant");

client.getCallConnection(callConnectionId).getCallMedia().holdWithResponse(holdOptions, Context.NONE);

/*
// Option 2: Hold without additional options
client.getCallConnection(callConnectionId).getCallMedia().hold(target);
*/
```

### [JavaScript](#tab/javascript)

```javascript
// Option 1: Hold with options
const options = {
    playSource: playSource,
    operationContext: "holdUserContext",
    operationCallbackUrl: "URL" // replace with actual callback URL
};
await callMedia.hold(targetuser, options);

/*
// Option 2: Hold without additional options
await callMedia.hold(targetuser);
*/
```

### [Python](#tab/python)

```python
# Option 1: Hold without additional options
call_connection_client.hold(target_participant=PhoneNumberIdentifier(TARGET_PHONE_NUMBER))

'''
# Option 2: Hold with options
call_connection_client.hold(
    target_participant=PhoneNumberIdentifier(TARGET_PHONE_NUMBER),
    play_source=play_source,
    operation_context="holdUserContext",
    operation_callback_url="URL" # replace with actual callback URL
)
'''
```
-----
### Unhold

The unhold action allows developers to resume a conversation between a participant and a system or agent that was previously paused. When the participant is taken off hold, they can hear the system or agent again.

### [C#](#tab/csharp)

``` csharp
var unHoldOptions = new UnholdOptions(target) 
{ 
    OperationContext = "UnHoldPstnParticipant" 
}; 

// Option 1
var UnHoldParticipant = await callMedia.UnholdAsync(unHoldOptions);

/* 
// Option 2
var UnHoldParticipant = await callMedia.UnholdAsync(target);
*/
```

### [Java](#tab/java)

``` java
// Option 1
client.getCallConnection(callConnectionId).getCallMedia().unholdWithResponse(target, "unholdPstnParticipant", Context.NONE);

/* 
// Option 2
client.getCallConnection(callConnectionId).getCallMedia().unhold(target);
*/
```

### [JavaScript](#tab/javascript)

```javascript
const unholdOptions = { 
    operationContext: "unholdUserContext" 
}; 

// Option 1
await callMedia.unhold(target);

/* 
// Option 2
await callMedia.unhold(target, unholdOptions);
*/
```

### [Python](#tab/python)

```python
# Option 1
call_connection_client.unhold(target_participant=PhoneNumberIdentifier(TARGET_PHONE_NUMBER)) 

'''
# Option 2
call_connection_client.unhold(target_participant=PhoneNumberIdentifier(TARGET_PHONE_NUMBER), operation_context="holdUserContext") 
'''
```
-----

### Audio streaming 

With audio streaming, you can subscribe to real-time audio streams from an ongoing call. For more information on how to get started with audio streaming and information about audio-streaming callback events, see [Quickstart: Server-side audio streaming](audio-streaming-quickstart.md).

### Real-time transcription

By using real-time transcription, you can access live transcriptions for the audio of an ongoing call. For more information on how to get started with real-time transcription and information about real-time transcription callback events, see [Add real-time transcription into your application](real-time-transcription-tutorial.md).

## Media action compatibility table

The following table illustrates what media operations are allowed to run or queue if a previous operation is still running or queued.

| Existing operation | Call leg	| Allowed | Disallowed |
|--|--|--|--|
| `PlayToAll` | Main | `PlayToAll`, `Recognize(Non-Group Call)`, `PlayTo`, `Recognize(Group Call)`, `SendDTMF`, `StartContinuousDtmfRecognition` | `None` |
| `Recognize(Non-Group Call)` | Main | `PlayToAll`, `Recognize(Non-Group Call)`, `PlayTo`, `Recognize(Group Call)`, `SendDTMF`, `StartContinuousDtmfRecognition` | `None` |
| `PlayTo` | Sub | `PlayToAll`, `Recognize(Non-Group Call)` | `PlayTo`, `Recognize(Group Call)`, `SendDTMF`, `StartContinuousDtmfRecognition` |
| `Recognize(Group Call)`	| Sub | `PlayToAll`, `Recognize(Non-Group Call)` | `PlayTo`, `Recognize(Group Call)`, `SendDTMF`, `StartContinuousDtmfRecognition` |
| `SendDTMF` | Sub | `PlayToAll`, `Recognize(Non-Group Call)` | `PlayTo`, `Recognize(Group Call)`, `SendDTMF`, `StartContinuousDtmfRecognition` |
| `StartContinuousDtmfRecognition` | Sub | `PlayToAll`, `Recognize(Non-Group Call)`,`PlayTo`, `Recognize(Group Call)`, `SendDTMF`, `StartContinuousDtmfRecognition` | `None` |
