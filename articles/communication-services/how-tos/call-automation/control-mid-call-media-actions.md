---
title: Azure Communication Services Call Automation how-to for managing media actions with Call Automation 
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide on using mid call media actions on a call with Call Automation.
author: kunaal
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 08/09/2023
ms.author: kpunjabi
ms.custom: public_priview
services: azure-communication-services
---

# How to control mid-call media actions with Call Automation

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

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
-----

## Send DTMF
You can send dtmf tones to an external participant, which may be useful when you’re already on a call and need to invite another participant who has an extension number or an IVR menu to navigate. 

>[!NOTE]
>This is only supported for external PSTN participants and supports sending a maximum of 18 tones at a time.

### SendDtmfAsync Method
Send a list of DTMF tones to an external participant.
### [csharp](#tab/csharp)
```csharp
var tones = new DtmfTone[] { DtmfTone.One, DtmfTone.Two, DtmfTone.Three, DtmfTone.Pound };

await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .SendDtmfTonesAsync(tones, new PhoneNumberIdentifier(c2Target), "dtmfs-to-ivr"); 
```
### [Java](#tab/java)
```java
List<DtmfTone> tones = Arrays.asList(DtmfTone.ONE, DtmfTone.TWO, DtmfTone.THREE, DtmfTone.POUND); 
callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .sendDtmfTonesWithResponse(tones, new PhoneNumberIdentifier(c2Target), "dtmfs-to-ivr") 
    .block(); 
```
-----
When your application sends these DTMF tones, you'll receive event updates. You can use the `SendDtmfCompleted` and `SendDtmfFailed` events to create business logic in your application to determine the next steps. 

Example of *SendDtmfCompleted* event
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
-----
Example of *SendDtmfFailed*
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
-----
## Continuous DTMF Recognition
You can subscribe to receive continuous DTMF tones throughout the call, your application receives DTMF tones as soon as the targeted participant presses on a key on their keypad. These tones will be sent to you one by one as the participant is pressing them.

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
callAutomationClient.getCallConnectionAsync(callConnectionId) 
        .getCallMediaAsync() 
        .startContinuousDtmfRecognitionWithResponse(new PhoneNumberIdentifier(c2Target), "dtmf-reco-on-c2") 
        .block(); 
```
-----

When your application no longer wishes to receive DTMF tones from the participant anymore you can use the `StopContinuousDtmfRecognitionAsync` method to let ACS know to stop detecting DTMF tones.

### StopContinuousDtmfRecognitionAsync
Stop detecting DTMF tones sent by participant.
### [csharp](#tab/csharp)
```csharp
await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .StopContinuousDtmfRecognitionAsync(new PhoneNumberIdentifier(c2Target), "dtmf-reco-on-c2"); 
```
### [Java](#tab/java)
```java
callAutomationClient.getCallConnectionAsync(callConnectionId) 
        .getCallMediaAsync() 
        .stopContinuousDtmfRecognitionWithResponse(new PhoneNumberIdentifier(c2Target), "dtmf-reco-on-c2") 
        .block(); 
```
-----

Your application receives event updates when these actions either succeed or fail. You can use these events to build custom business logic to configure the next step your application needs to take when it receives these event updates. 

### ContinuousDtmfRecognitionToneReceived Event
Example of how you can handle a DTMF tone successfully detected.
### [csharp](#tab/csharp)
``` csharp
if (acsEvent is ContinuousDtmfRecognitionToneReceived continuousDtmfRecognitionToneReceived) 
{ 
    logger.LogInformation("Tone detected: sequenceId={sequenceId}, tone={tone}, context={context}", 
        continuousDtmfRecognitionToneReceived.ToneInfo.SequenceId, 
        continuousDtmfRecognitionToneReceived.ToneInfo.Tone, 
        continuousDtmfRecognitionToneReceived.OperationContext); 
} 
```
### [Java](#tab/java)
``` java
if (acsEvent instanceof ContinuousDtmfRecognitionToneReceived) { 
    ContinuousDtmfRecognitionToneReceived event = (ContinuousDtmfRecognitionToneReceived) acsEvent; 
    log.info("Tone detected: sequenceId=" + event.getToneInfo().getSequenceId() 
        + ", tone=" + event.getToneInfo().getTone().convertToString() 
        + ", context=" + event.getOperationContext()); 
} 
```
-----

ACS provides you with a `SequenceId` as part of the `ContinuousDtmfRecognitionToneReceived` event, which your application can use to reconstruct the order in which the participant entered the DTMF tones.

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
-----
