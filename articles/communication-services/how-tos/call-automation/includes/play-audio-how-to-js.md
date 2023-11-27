---
title: include file
description: JS play audio how-to guide
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 08/10/2023
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

Create a new JavaScript file in your project directory, for example, name it app.js. You write your JavaScript code in this file. Run your application using Node.js with the following command. This code executes the JavaScript code you have written. 

``` console
node app.js
```

## (Optional) Prepare your audio file if you wish to use audio files for playing prompts

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to Azure Communication Services with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. Azure Communication Services supports both file types of **MP3** and **WAV files, mono 16-bit PCM at 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../ai-services/Speech-Service/how-to-audio-content-creation.md).

## (Optional) Connect your Azure Cognitive Service to your Azure Communication Service (Public Preview)

If you would like to use Text-To-Speech capabilities, then it's required for you to connect your [Azure Cognitive Service to your Azure Communication Service](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). You can also use the code snippet provided here to understand how to answer a call.

```javascript
const answerCallOptions: AnswerCallOptions = { cognitiveServicesEndpoint: "<https://sample-callback-uri>" }; 
await callAutomationClient.answerCall("<Incoming call context>", "<https://sample-callback-uri>", answerCallOptions); 
```

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has joined the call or play audio to all the participants in the call.

### Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files, you need to make sure you provide Azure Communication Services with a uri to a file you host in a location where Azure Communication Services can access it. The FileSource type in our SDK can be used to specify audio files for the play action.

``` javascript
const playSource: FileSource = { url: audioUri, kind: "fileSource" };
```

### Play source - Text-To-Speech

To play audio using Text-To-Speech through Azure AI services, you need to provide the text you wish to play, as well either the SourceLocale, and VoiceKind or the VoiceName you wish to use. We support all voice names supported by Azure AI services, full list [here](../../../../ai-services/Speech-Service/language-support.md?tabs=tts). 

``` javascript
const textToPlay = "Welcome to Contoso"; 
// Provide SourceLocale and VoiceKind to select an appropriate voice. 
const playSource: TextSource = { text: textToPlay, sourceLocale: "en-US", voiceKind: VoiceKind.Female, kind: "textSource" }; 
```

``` javascript
const textToPlay = "Welcome to Contoso"; 
// Provide VoiceName to select a specific voice. 
const playSource: TextSource = { text: textToPlay, voiceName: "en-US-ElizabethNeural", kind: "textSource" }; 
```

### Play source - Text-To-Speech with SSML

If you want to customize your Text-To-Speech output even more with Azure AI services you can use [Speech Synthesis Markup Language SSML](../../../../ai-services/Speech-Service/speech-synthesis-markup.md) when invoking your play action through Call Automation. With SSML you can fine-tune the pitch, pause, improve pronunciation, change speaking rate, adjust volume and attribute multiple voices.

``` javascript
const ssmlToPlay = "<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"en-US\"><voice name=\"en-US-JennyNeural\">Hello World!</voice></speak>"; 
const playSource: SsmlSource = { ssmlText: ssmlToPlay, kind: "ssmlSource" }; 
```
### Custom voice models
If you wish to enhance your prompts more and include custom voice models, the play action Text-To-Speech now supports these custom voices. These are a great option if you are trying to give customers a more local, personalized experience or have situations where the default models may not cover the words and accents you're trying to pronounce. To learn more about creating and deploying custom models you can read this [guide](../../../../ai-services/speech-service/how-to-custom-voice.md).

**Custom voice names regular text exmaple**
``` javascript
const textToPlay = "Welcome to Contoso";
// Provide VoiceName and CustomVoiceEndpointID to play your custom voice
const playSource: TextSource = { text: textToPlay, voiceName: "YourCustomVoiceName", customVoiceEndpointId: "YourCustomEndpointId"}
```
**Custom voice names SSML example**
``` javascript
const ssmlToPlay = "<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"en-US\"><voice name=\"YourCustomVoiceName\">Hello World!</voice></speak>"; 
const playSource: SsmlSource = { ssmlText: ssmlToPlay, kind: "ssmlSource", customVoiceEndpointId: "YourCustomEndpointId"}; 
```

Once you've decided on which playSource you wish to use for playing audio, you can then choose whether you want to play it to a specific participant or to all participants.

## Play audio - All participants

In this scenario, audio is played to all participants on the call. 

``` javascript 
await callAutomationClient.getCallConnection(callConnectionId) 
    .getCallMedia() 
    .playToAll([ playSource ]);
```

## Play audio - Specific participant

In this scenario, audio is played to a specific participant.

``` javascript
await callAutomationClient.getCallConnection(callConnectionId) 
    .getCallMedia() 
    .play([ playSource ], [ targetParticipant ]); 
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller. Or progress the caller to the next logical step based on your applications business logic.

``` javascript
const playOptions: PlayOptions = { loop: true }; 
await callAutomationClient.getCallConnection(callConnectionId) 
    .getCallMedia() 
    .playToAll([ playSource ], playOptions); 
```

## Enhance play with audio file caching

If you're playing the same audio file multiple times, your application can provide Azure Communication Services with the sourceID for the audio file. Azure Communication Services caches this audio file for 1 hour. 
> [!Note]
> Caching audio files isn't suitable for dynamic prompts. If you change the URL provided to Azure Communication Services, it does not update the cached URL straight away. The update will occur after the existing cache expires.

``` javascript
const playSource: FileSource = { url: audioUri, playsourcacheid: "<playSourceId>", kind: "fileSource" }; 
await callAutomationClient.getCallConnection(callConnectionId) 
.getCallMedia() 
.play([ playSource ], [ targetParticipant ]); 
```

## Handle play action event updates 

Your application receives action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. 

### Example of how you can deserialize the *PlayCompleted* event:

```javascript 
if (event.type === "Microsoft.Communication.PlayCompleted") { 
    console.log("Play completed, context=%s", eventData.operationContext); 
} 
```

### Example of how you can deserialize the *PlayFailed* event:

```javascript
if (event.type === "Microsoft.Communication.PlayFailed") { 
    console.log("Play failed: data=%s", JSON.stringify(eventData)); 
} 
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

```javascript
await callAutomationClient.getCallConnection(callConnectionId) 
.getCallMedia() 
.cancelAllOperations();
```

### Example of how you can deserialize the *PlayCanceled* event:

```javascript
if (event.type === "Microsoft.Communication.PlayCanceled") {
    console.log("Play canceled, context=%s", eventData.operationContext);
}
```
