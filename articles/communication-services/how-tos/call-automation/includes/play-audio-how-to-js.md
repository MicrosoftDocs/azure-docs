---
title: include file
description: JS play audio how-to guide
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 05/28/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- Have Node.js installed, you can install it from their [official website](https://nodejs.org).

## Create a new JavaScript application
Create a new JavaScript application in your project directory. Initialize a new Node.js project with the following command. This creates a package.json file for your project, which is used to manage your project's dependencies. 

``` console
npm init -y
```

### Install the Azure Communication Services Call Automation package
``` console
npm install @azure/communication-call-automation
```

Create a new JavaScript file in your project directory, for example, name it app.js. You write your JavaScript code in this file. Run your application using Node.js with the following command. This executes the JavaScript code you have written. 

``` console
node app.js
```

## Prepare your audio file

If you don't already have an audio file, you can create a new one to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../ai-services/Speech-Service/how-to-audio-content-creation.md).

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). In this quickstart, we'll create an outbound call.

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has joined the call or play audio to all the participants in the call.

## Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files, you need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. The FileSource type in our SDK can be used to specify audio files for the play action.

```javascript
const fileSource: FileSource = {
    url: "https://example.com/audio/test.wav",
    kind: "fileSource"
};
```

## Play audio - All participants

In this scenario, audio is played to all participants on the call. 

``` javascript 
callMedia.playToAll(fileSource);
```

## Play audio - Specific participant

In this scenario, audio is played to a specific participant.

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

If you are playing the same audio file multiple times, your application can provide ACS with the sourceID for the audio file. ACS caches this audio file for 1 hour. **Note:** Caching audio files is not suitable for dynamic prompts. If you change the URL provided to ACS, it will not update the cached URL straight away. The update will occur after the existing cache expires.

``` javascript
const fileSource: FileSource = {
    url: https://example.com/audio/test.wav,
    playSourceCacheId: "example_source",
    kind: "fileSource"
};
```

## Handle play action event updates 

Your application receives action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. 

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

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

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
