---
title: include file
description: JS play audio how-to guide
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/28/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).


## Create a new Javascript application

**NEED STEPS HERE**

## Prepare your audio file

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../cognitive-services/Speech-Service/how-to-audio-content-creation.md).

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this quickstart, we'll answer an incoming call.

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has just joined the call or play audio to all the participants in the call.

## Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files you need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. The FileSource type in our SDK can be used to specify audio files for the play action.

```javascript
const fileSource: FileSource = {
    url: "https://example.com/audio/test.wav",
    kind: "fileSource"
};
```

## Play audio - All participants

In this scenario audio will be played to all participants on the call. 

``` javascript 
callMedia.playToAll(fileSource);
```

## Play audio - Specific participant

In this scenario audio is played to a specific participant.

``` javascript 
callMedia.play(fileSource, [targetParticipant]);
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller. Or progress the caller to the next logical step based on your applications business logic.

``` javascript
const playOptions: PlayOptions = {
    loop: true
};
callMedia.play(fileSource, [targetParticipant], playOptions);
```

## Enhance play with audio file caching

If you'll be playing the same audio file multiple times, your application can provide us the sourceID for the audio file. ACS will cache this audio file for 1 hour.

``` javascript
const fileSource: FileSource = {
    url: https://example.com/audio/test.wav,
    playSourceId: "example_source",
    kind: "fileSource"
};
```

## Handle play action event updates 

Your application will receive action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. 

### Example of how you can deserialize the *PlayCompleted* event:

```javascript 
var body = req.body[events];

if (body.data && body.type === "Microsoft.Communication.PlayCompleted") {
var playCompletedEvent: PlayCompleted = body.data;
    // Handle the PlayCompleted event according to your application logic
}
```

### Example of how you can deserialize the *PlayFailed* event:

```javascript
var body = req.body[events];

if (body.data && body.type === "Microsoft.Communication.PlayFailed") {
var playFailedEvent: PlayFailed = body.data;
    // Handle the PlayFailed event according to your application logic
}
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations will be canceled. This action will also cancel other queued play actions.

```javascript
callMedia.cancelAllOperations();
```

### Example of how you can deserialize the *PlayCanceled* event:

```javascript
var body = req.body[events];

if (body.data && body.type === "Microsoft.Communication.PlayCanceled") {
var playCanceledEvent: PlayCanceled = body.data;
    // Handle the PlayCanceled event according to your application logic
}
```
