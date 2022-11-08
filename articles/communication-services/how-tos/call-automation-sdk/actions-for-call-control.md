---
title: Azure Communication Services Call Automation how-to for managing calls with Call Automation 
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide on using call actions to steer and manage a call with Call Automation.
author: ashwinder

ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/03/2022
ms.author: askaur
manager: visho
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# How to control and steer calls with Call Automation
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly. Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

Call Automation uses a REST API interface to receive requests for actions and provide responses to notify whether the request was successfully submitted or not. Due to the asynchronous nature of calling, most actions have corresponding events that are triggered when the action completes successfully or fails. This guide covers the  actions available for steering calls, like CreateCall, Transfer, Redirect, and managing participants. Actions are accompanied with sample code on how to invoke the said action and sequence diagrams describing the events expected after invoking an action. These diagrams will help you visualize how to program your service application with Call Automation. 

Call Automation supports various other actions to manage call media and recording that aren't included in this guide.

> [!NOTE]
> Call Automation currently doesn't interoperate with Microsoft Teams. Actions like making, redirecting a call to a Teams user or adding them to a call using Call Automation isn't supported. 

As a pre-requisite, we recommend you to read the below articles to make the most of this guide: 
1. Call Automation [concepts guide](../../concepts/voice-video-calling/call-automation.md#call-actions) that describes the action-event programming model and event callbacks. 
2. Learn about [user identifiers](../../concepts/identifiers.md#the-communicationidentifier-type) like CommunicationUserIdentifier and PhoneNumberIdentifier used in this guide. 

For all the code samples, `client` is CallAutomationClient object that can be created as shown and `callConnection` is the CallConnection object obtained from Answer or CreateCall response. You can also obtain it from callback events received by your application. 
## [csharp](#tab/csharp)
```csharp
var client = new CallAutomationClient("<resource_connection_string>"); 
```
## [Java](#tab/java)
```java
 CallAutomationClient client = new CallAutomationClientBuilder().connectionString("<resource_connection_string>").buildClient();
```
-----

## Make an outbound call 
You can place a 1:1 or group call to a communication user or phone number (public or Communication Services owned number). Below sample makes an outbound call from your service application to a phone number. 
callerIdentifier is used by Call Automation as your application's identity when making an outbound a call. When calling a PSTN endpoint, you also need to provide a phone number that will be used as the source caller ID and shown in the call notification to the target PSTN endpoint. 
To place a call to a Communication Services user, you'll need to provide a CommunicationUserIdentifier object instead of PhoneNumberIdentifier.  
### [csharp](#tab/csharp)
```csharp
Uri callBackUri = new Uri("https://<myendpoint>/Events"); //the callback endpoint where you want to receive subsequent events 
var callerIdentifier = new CommunicationUserIdentifier("<user_id>");  
CallSource callSource = new CallSource(callerIdentifier); 
callSource.CallerId = new PhoneNumberIdentifier("+16044561234"); // This is the ACS provisioned phone number for the caller  
var callThisPerson = new PhoneNumberIdentifier("+16041234567"); 
var listOfPersonToBeCalled = new List<CommunicationIdentifier>();  
listOfPersonToBeCalled.Add(callThisPerson); 
var createCallOptions = new CreateCallOptions(callSource, listOfPersonToBeCalled, callBackUri); 
CreateCallResult response = await client.CreateCallAsync(createCallOptions); 
```
### [Java](#tab/java)
```java
String callbackUri = "https://<myendpoint>/Events"; //the callback endpoint where you want to receive subsequent events
List<CommunicationIdentifier> targets = new ArrayList<>(Arrays.asList(new PhoneNumberIdentifier("+16471234567"))); 
CommunicationUserIdentifier callerIdentifier = new CommunicationUserIdentifier("<user_id>"); 
CreateCallOptions createCallOptions = new CreateCallOptions(callerIdentifier, targets, callbackUri) 
        .setSourceCallerId("+18001234567"); // This is the ACS provisioned phone number for the caller  
Response<CreateCallResult> response = client.createCallWithResponse(createCallOptions).block(); 
```
-----
The response provides you with CallConnection object that you can use to take further actions on this call once it's connected. Once the call is answered, two events will be published to the callback endpoint you provided earlier:
1. `CallConnected` event notifying that the call has been established with the callee. 
2. `ParticipantsUpdated` event that contains the latest list of participants in the call.
![Sequence diagram for placing an outbound call.](media/make-call-flow.png)


## Answer an incoming call
Once you've subscribed to receive [incoming call notifications](../../concepts/voice-video-calling/incoming-call-notification.md) to your resource, below is sample code on how to answer that call. When answering a call, it's necessary to provide a callback url. Communication Services will post all subsequent events about this call to that url.  
### [csharp](#tab/csharp)

```csharp
string incomingCallContext = "<IncomingCallContext_From_IncomingCall_Event>"; 
Uri callBackUri = new Uri("https://<myendpoint_where_I_want_to_receive_callback_events"); 

var answerCallOptions = new AnswerCallOptions(incomingCallContext, callBackUri);  
AnswerCallResult answerResponse = await client.AnswerCallAsync(answerCallOptions);
CallConnection callConnection = answerResponse.CallConnection; 
```
### [Java](#tab/java)

```java
String incomingCallContext = "<IncomingCallContext_From_IncomingCall_Event>";
String callbackUri = "https://<myendpoint>/Events"; 
 
AnswerCallOptions answerCallOptions = new AnswerCallOptions(incomingCallContext, callbackUri); 
Response<AnswerCallResult> response = client.answerCallWithResponse(answerCallOptions).block(); 
```
-----
The response provides you with CallConnection object that you can use to take further actions on this call once it's connected. Once the call is answered, two events will be published to the callback endpoint you provided earlier:
1. `CallConnected` event notifying that the call has been established with the caller. 
2. `ParticipantsUpdated` event that contains the latest list of participants in the call.

![Sequence diagram for answering an incoming call.](media/answer-flow.png)

## Reject a call 
You can choose to reject an incoming call as shown below. You can provide a reject reason: none, busy or forbidden. If nothing is provided, none is chosen by default. 
# [csharp](#tab/csharp)
```csharp
string incomingCallContext = "<IncomingCallContext_From_IncomingCall_Event>"; 
var rejectOption = new RejectCallOptions(incomingCallContext); 
rejectOption.CallRejectReason = CallRejectReason.Forbidden; 
_ = await client.RejectCallAsync(rejectOption); 
```
# [Java](#tab/java)

```java
String incomingCallContext = "<IncomingCallContext_From_IncomingCall_Event>";  
RejectCallOptions rejectCallOptions = new RejectCallOptions(incomingCallContext) 
        .setCallRejectReason(CallRejectReason.BUSY); 
Response<Void> response = client.rejectCallWithResponse(rejectCallOptions).block(); 
```
-----
No events are published for reject action. 

## Redirect a call 
You can choose to redirect an incoming call to one or more endpoints without answering it. Redirecting a call will remove your application's ability to control the call using Call Automation.
# [csharp](#tab/csharp)
```csharp
string incomingCallContext = "<IncomingCallContext_From_IncomingCall_Event>"; 
var target = new CommunicationUserIdentifier("<user_id_of_target>"); //user id looks like 8:a1b1c1-... 
var redirectOption = new RedirectCallOptions(incomingCallContext, target); 
_ = await client.RedirectCallAsync(redirectOption); 
```
# [Java](#tab/java)
```java
String incomingCallContext = "<IncomingCallContext_From_IncomingCall_Event>"; 
CommunicationIdentifier target = new CommunicationUserIdentifier("<user_id_of_target>"); //user id looks like 8:a1b1c1-... 
RedirectCallOptions redirectCallOptions = new RedirectCallOptions(incomingCallContext, target); 
Response<Void> response = client.redirectCallWithResponse(redirectCallOptions).block();
```
-----
To redirect the call to a phone number, set the target to be PhoneNumberIdentifier. 
# [csharp](#tab/csharp)
```csharp
var target = new PhoneNumberIdentifier("+16041234567"); 
```
# [Java](#tab/java)
```java
CommunicationIdentifier target = new PhoneNumberIdentifier("+18001234567"); 
```
-----
No events are published for redirect. If the target is a Communication Services user or a phone number owned by your resource, it will generate a new IncomingCall event with 'to' field set to the target you specified. 

## Transfer a 1:1 call 
When your application answers a call or places an outbound call to an endpoint, that endpoint can be transferred to another destination endpoint. Transferring a 1:1 call will remove your application from the call and hence remove its ability to control the call using Call Automation.
# [csharp](#tab/csharp)
```csharp
var transferDestination = new CommunicationUserIdentifier("<user_id>"); 
var transferOption = new TransferToParticipantOptions(transferDestination);   
TransferCallToParticipantResult result = await callConnection.TransferCallToParticipantAsync(transferOption);
```
# [Java](#tab/java)
```java
CommunicationIdentifier transferDestination = new CommunicationUserIdentifier("<user_id>"); 
TransferToParticipantCallOptions options = new TransferToParticipantCallOptions(transferDestination); 
Response<TransferCallResult> transferResponse = callConnectionAsync.transferToParticipantCallWithResponse(options).block();
```
-----
When transferring to a phone number, it's mandatory to provide a source caller ID. This ID serves as the identity of your application(the source) for the destination endpoint. 
# [csharp](#tab/csharp)
```csharp
var transferDestination = new PhoneNumberIdentifier("+16041234567"); 
var transferOption = new TransferToParticipantOptions(transferDestination); 
transferOption.SourceCallerId = new PhoneNumberIdentifier("+16044561234"); 
TransferCallToParticipantResult result = await callConnection.TransferCallToParticipantAsync(transferOption);
```
# [Java](#tab/java)
```java
CommunicationIdentifier transferDestination = new PhoneNumberIdentifier("+16471234567"); 
TransferToParticipantCallOptions options = new TransferToParticipantCallOptions(transferDestination) 
        .setSourceCallerId(new PhoneNumberIdentifier("+18001234567")); 
Response<TransferCallResult> transferResponse = callConnectionAsync.transferToParticipantCallWithResponse(options).block();
```
-----
The below sequence diagram shows the expected flow when your application places an outbound 1:1 call and then transfers it to another endpoint. 
![Sequence diagram for placing a 1:1 call and then transferring it.](media/transfer-flow.png)

## Add a participant to a call 
You can add one or more participants (Communication Services users or phone numbers) to an existing call. When adding a phone number, it's mandatory to provide source caller ID. This caller ID will be shown on call notification to the participant being added.
# [csharp](#tab/csharp)
```csharp
var addThisPerson = new PhoneNumberIdentifier("+16041234567"); 
var listOfPersonToBeAdded = new List<CommunicationIdentifier>(); 
listOfPersonToBeAdded.Add(addThisPerson); 
var addParticipantsOption = new AddParticipantsOptions(listOfPersonToBeAdded); 
addParticipantsOption.SourceCallerId = new PhoneNumberIdentifier("+16044561234");
AddParticipantsResult result = await callConnection.AddParticipantsAsync(addParticipantsOption); 
```
# [Java](#tab/java)
```java
CommunicationIdentifier target = new PhoneNumberIdentifier("+16041234567"); 
List<CommunicationIdentifier> targets = new ArrayList<>(Arrays.asList(target)); 
AddParticipantsOptions addParticipantsOptions = new AddParticipantsOptions(targets) 
        .setSourceCallerId(new PhoneNumberIdentifier("+18001234567"));  
Response<AddParticipantsResult> addParticipantsResultResponse = callConnectionAsync.addParticipantsWithResponse(addParticipantsOptions).block();
```
-----
To add a Communication Services user, provide a CommunicationUserIdentifier instead of PhoneNumberIdentifier. Source caller ID isn't mandatory in this case. 

AddParticipant will publish a `AddParticipantSucceeded` or `AddParticipantFailed` event, along with a `ParticipantUpdated` providing the latest list of participants in the call.
  
![Sequence diagram for adding a participant to the call.](media/add-participant-flow.png)

## Remove a participant from a call
# [csharp](#tab/csharp)
```csharp
var removeThisUser = new CommunicationUserIdentifier("<user_id>"); 
var listOfParticipantsToBeRemoved = new List<CommunicationIdentifier>(); 
listOfParticipantsToBeRemoved.Add(removeThisUser); 
var removeOption = new RemoveParticipantsOptions(listOfParticipantsToBeRemoved); 
RemoveParticipantsResult result = await callConnection.RemoveParticipantsAsync(removeOption);
```
# [Java](#tab/java)
```java
CommunicationIdentifier removeThisUser = new CommunicationUserIdentifier("<user_id>");
RemoveParticipantsOptions removeParticipantsOptions = new RemoveParticipantsOptions(new ArrayList<>(Arrays.asList(removeThisUser))); 
Response<RemoveParticipantsResult> removeParticipantsResultResponse = callConnectionAsync.removeParticipantsWithResponse(removeParticipantsOptions).block();
```
-----
RemoveParticipant only generates `ParticipantUpdated` event describing the latest list of participants in the call. The removed participant is excluded if remove operation was successful.  
![Sequence diagram for removing a participant from the call.](media/remove-participant-flow.png)

## Hang up on a call 
Hang Up action can be used to remove your application from the call or to terminate a group call by setting forEveryone parameter to true. For a 1:1 call, hang up will terminate the call with the other participant by default.  

# [csharp](#tab/csharp)
```csharp
_ = await callConnection.HangUpAsync(true); 
```
# [Java](#tab/java)
```java
Response<Void> response1 = callConnectionAsync.hangUpWithResponse(new HangUpOptions(true)).block();
```
-----
CallDisconnected event is published once the hangUp action has completed successfully. 

## Get information about a call participant 
# [csharp](#tab/csharp)
```csharp
CallParticipant participantInfo = await callConnection.GetParticipantAsync("<user_id>")
```
# [Java](#tab/java)
```java
CallParticipant participantInfo = callConnection.getParticipant("<user_id>").block();
```
-----

## Get information about all call participants
# [csharp](#tab/csharp)
```csharp
List<CallParticipant> participantList = (await callConnection.GetParticipantsAsync()).Value.ToList(); 
```
# [Java](#tab/java)
```java
List<CallParticipant> participantsInfo = Objects.requireNonNull(callConnection.listParticipants().block()).getValues();
```
-----

## Get latest info about a call 
# [csharp](#tab/csharp)
```csharp
CallConnectionProperties thisCallsProperties = callConnection.GetCallConnectionProperties(); 
```
# [Java](#tab/java)
```java
CallConnectionProperties thisCallsProperties = callConnection.getCallProperties().block(); 
```
-----
