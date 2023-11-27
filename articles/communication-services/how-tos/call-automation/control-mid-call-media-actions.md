---
title: Azure Communication Services Call Automation how-to for managing media actions with Call Automation 
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide on using mid call media actions on a call with Call Automation.
author: kunaal
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/16/2023
ms.author: kpunjabi
ms.custom: public_preview
services: azure-communication-services
---

# How to control mid-call media actions with Call Automation

Call Automation uses a REST API interface to receive requests for actions and provide responses to notify whether the request was successfully submitted or not. Due to the asynchronous nature of calling, most actions have corresponding events that are triggered when the action completes successfully or fails. This guide covers the actions available to developers during calls, like Send DTMF and Continuous DTMF Recognition. Actions are accompanied with sample code on how to invoke the said action.

Call Automation supports various other actions to manage calls and recording that aren't included in this guide.

> [!NOTE]
> Call Automation currently doesn't interoperate with Microsoft Teams. Actions like making, redirecting a call to a Teams user or playing audio to a Teams user using Call Automation isn't supported. 

As a prerequisite, we recommend you to read the below articles to make the most of this guide: 
1. Call Automation [concepts guide](../../concepts/call-automation/call-automation.md#call-actions) that describes the action-event programming model and event callbacks. 
2. Learn about [user identifiers](../../concepts/identifiers.md#the-communicationidentifier-type) like CommunicationUserIdentifier and PhoneNumberIdentifier used in this guide. 
3. Learn more about [how to control and steer calls with Call Automation](./actions-for-call-control.md), which teaches you about dealing with the basics of dealing with a call.

For all the code samples, `client` is CallAutomationClient object that can be created as shown and `callConnection` is the CallConnection object obtained from Answer or CreateCall response. You can also obtain it from callback events received by your application. 
### [csharp](#tab/csharp)
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
You can send DTMF tones to an external participant, which may be useful when you’re already on a call and need to invite another participant who has an extension number or an IVR menu to navigate. 

>[!NOTE]
>This is only supported for external PSTN participants and supports sending a maximum of 18 tones at a time.

### SendDtmfAsync Method
Send a list of DTMF tones to an external participant.
### [csharp](#tab/csharp)
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

Example of *SendDtmfTonesCompleted* event
### [csharp](#tab/csharp)
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
Example of *SendDtmfTonesFailed*
### [csharp](#tab/csharp)
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
## Continuous DTMF Recognition
You can subscribe to receive continuous DTMF tones throughout the call. Your application receives DTMF tones as the targeted participant presses on a key on their keypad. These tones are sent to your application one by one as the participant is pressing them.

### StartContinuousDtmfRecognitionAsync Method
Start detecting DTMF tones sent by a participant.
### [csharp](#tab/csharp)
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

When your application no longer wishes to receive DTMF tones from the participant anymore, you can use the `StopContinuousDtmfRecognitionAsync` method to let Azure Communication Services know to stop detecting DTMF tones.

### StopContinuousDtmfRecognitionAsync
Stop detecting DTMF tones sent by participant.
### [csharp](#tab/csharp)
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

Your application receives event updates when these actions either succeed or fail. You can use these events to build custom business logic to configure the next step your application needs to take when it receives these event updates. 

### ContinuousDtmfRecognitionToneReceived Event
Example of how you can handle a DTMF tone successfully detected.
### [csharp](#tab/csharp)
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

Azure Communication Services provides you with a `SequenceId` as part of the `ContinuousDtmfRecognitionToneReceived` event, which your application can use to reconstruct the order in which the participant entered the DTMF tones.

### ContinuousDtmfRecognitionFailed Event
Example of how you can handle when DTMF tone detection fails.
### [csharp](#tab/csharp)
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

### ContinuousDtmfRecogntionStopped Event
Example of how to handle when continuous DTMF recognition has stopped, this could be because your application invoked the `StopContinuousDtmfRecognitionAsync` event or because the call has ended.
### [csharp](#tab/csharp)
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
    app.logger.info("Tone stoped: context=%s", event.data["operationContext"])
```
-----
