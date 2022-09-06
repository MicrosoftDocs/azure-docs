---
title: include file
description: Java play audio quickstart
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/06/2022
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [!INCLUDE[Call Automation SDK](../Call%flows%for%customer%interactions.md)].
- [Java Development Kit](https://docs.microsoft.com/en-us/azure/developer/java/fundamentals/java-jdk-install) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Add package references

In your POM file, reference the **azure-communication-callingserver** package:

``` console 
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callingserver</artifactId>
  <version>1.0.0-beta.7</version>
</dependency> 
```

## Prepare your audio file

Create an audio file, if you do not already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file ACS supports needs to be wav, mono and 16KHz. 

## Update App.java with code

In your editor of choice, open App.java file and update it with the following code. Please see comments in the code for more details.

[Pastebin code reference](https://paste.microsoft.com/1207add3-8fda-4e75-ba31-0a54679f66c7)

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about how to start call please view our [quickstart](../Call%flows%for%customer%interactions.md). In this instance we will answer an incoming call.

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. The first scenario is if you want to play it to the participant that has just joined the call, while the second scenario is when you wish to play audio to all the participants in the call. 

## Play audio - Specific participant

In this scenario audio will be played to a specific participant that is specified in the request.

``` console 
var targetUser = new PhoneNumberIdentifier(<target>);
var callMedia = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var fileSource = new FileSource().setUri(<audioUrl>);
var playResponse = new callMedia.playWithResponse(
    fileSource,
    Collections.singletonList(targetUser),
    new PlayOptions()
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Play audio - All participants

In this scenario audio will be played to all participants on the call. 

``` console 
var callMedia = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var fileSource = new FileSource().setUri(<audioUrl>);
var playResponse = new callMedia.playToAllWithResponse(
    fileSource,
    new PlayOptions()
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller or progress the caller to the next logical step based on your applications business logic. 

``` console
var callMedia = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var fileSource = new FileSource().setUri(<audioUrl>);
var playOptions = new PlayOptions().setLoop(true);
var playResponse = new callMedia.playToAllWithResponse(
    fileSource,
    playOptions
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Play audio with sourceID

If you will be playing the same audio file multiple times, your application can provide us the sourceID for the audio file. ACS will cache this audio file for 1 hour.

``` console
var targetUser = new PhoneNumberIdentifier(<target>);
var callMedia = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var fileSource = new FileSource().setUri(<audioUrl>).setPlaySourceId(<sourceId>);
var playResponse = new callMedia.playWithResponse(
    fileSource,
    Collections.singletonList(targetUser),
    new PlayOptions()
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Receiving play updates from ACS 

ACS will provide your application with update events using the callback URL provided at the time of answering the call. Below is an example of what a successful play event update would look like.

```console 
[{
    "id": "704a7a96-4d74-4ebe-9cd0-b7cc39c3d7b1",
    "source": "calling/callConnections/<callConnectionId>/PlayCompleted",
    "type": "Microsoft.Communication.PlayCompleted",
    "data": {
        "resultInfo": {
            "code": 200,
            "subCode": 0,
            "message": "Action completed successfully."
        },
        "type": "playCompleted",
        "callConnectionId": "<callConnectionId>",
        "serverCallId": "<serverCallId>",
        "correlationId": "<correlationId>"
        },
    "time": "2022-08-12T03:13:25.0252763+00:00",
    "specversion": "1.0",
    "datacontenttype": "application/json",
    "subject": "calling/callConnections/<callConnectionId>/PlayCompleted"
}]
```

## Cancel play action

Cancel all media operations, all pending media operations will be cancelled. This will also cancel other queued up play actions. 

```console
var callMedia = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var cancelResponse = new callMedia.cancelAllMediaOperationsWithResponse().block();
assertEquals(202, cancelResponse.getStatusCode()); // The request was accepted
```
