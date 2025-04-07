---
title: include file
description: C# play audio quickstart
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/20/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Obtain the latest [NuGet package](https://www.nuget.org/packages/Azure.Communication.CallAutomation/).

### For AI features
- Create and connect [Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](/azure/ai-services/cognitive-services-custom-subdomains) for your Azure AI services resource. 

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

The NuGet package can be obtained from [here](https://www.nuget.org/packages/Azure.Communication.CallAutomation/), if you haven't already done so. 

## (Optional) Prepare your audio file if you wish to use audio files for playing prompts

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to Azure Communication Services with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. Azure Communication Services supports both file types of **MP3 files with ID3V2TAG** and **WAV files, mono 16-bit PCM at 16 KHz sample rate**. . 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](/azure/ai-services/speech-service/how-to-audio-content-creation).

## (Optional) Connect your Azure Cognitive Service to your Azure Communication Service

If you would like to use Text-To-Speech capabilities, then it's required for you to connect your [Azure Cognitive Service to your Azure Communication Service](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). You can also use the code snippet provided here to understand how to answer a call.

```csharp
var callAutomationClient = new CallAutomationClient("<Azure Communication Services connection string>");   

var answerCallOptions = new AnswerCallOptions("<Incoming call context once call is connected>", new Uri("<https://sample-callback-uri>"))  

{  
    CallIntelligenceOptions = new CallIntelligenceOptions() { CognitiveServicesEndpoint = new Uri("<Azure Cognitive Services Endpoint>") } 
};  

var answerCallResult = await callAutomationClient.AnswerCallAsync(answerCallOptions); 
```

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has joined the call or play audio to all the participants in the call.

### Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files, you need to make sure you provide Azure Communication Services with a uri to a file you host in a location where Azure Communication Services can access it. The FileSource type in our SDK can be used to specify audio files for the play action.

``` csharp
var playSource = new FileSource(new Uri(audioUri));

//Multiple FileSource Prompts, if you want to play multiple audio files in one request you can provide them in a list.
//var playSources = new List<PlaySource>() { new FileSource(new Uri("https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav")), new FileSource(new Uri("https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav")) };

```

### Play source - Text-To-Speech

To play audio using Text-To-Speech through Azure AI services, you need to provide the text you wish to play, as well either the SourceLocale, and VoiceKind or the VoiceName you wish to use. We support all voice names supported by Azure AI services, full list [here](/azure/ai-services/speech-service/language-support?tabs=tts).

``` csharp
String textToPlay = "Welcome to Contoso";

// Provide SourceLocale and VoiceKind to select an appropriate voice. 
var playSource = new TextSource(textToPlay, "en-US", VoiceKind.Female);

//Multiple TextSource prompt, if you want to play multiple text prompts in one request you can provide them in a list.
//var playSources = new List<PlaySource>() { new TextSource("recognize prompt one") { VoiceName = SpeechToTextVoice }, new TextSource("recognize prompt two") { VoiceName = SpeechToTextVoice }, new TextSource(content) { VoiceName = SpeechToTextVoice } };
```

``` csharp
String textToPlay = "Welcome to Contoso"; 
 
// Provide VoiceName to select a specific voice. 
var playSource = new TextSource(textToPlay, "en-US-ElizabethNeural");

//Multiple TextSource prompt, if you want to play multiple text prompts in one request you can provide them in a list.
//var playSources = new List<PlaySource>() { new TextSource("recognize prompt one") { VoiceName = SpeechToTextVoice }, new TextSource("recognize prompt two") { VoiceName = SpeechToTextVoice }, new TextSource(content) { VoiceName = SpeechToTextVoice } };
```

### Play source - Text-To-Speech with SSML

If you want to customize your Text-To-Speech output even more with Azure AI services you can use [Speech Synthesis Markup Language SSML](/azure/ai-services/speech-service/speech-synthesis-markup) when invoking your play action through Call Automation. With SSML you can fine-tune the pitch, pause, improve pronunciation, change speaking rate, adjust volume and attribute multiple voices.

``` csharp
String ssmlToPlay = "<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"en-US\"><voice name=\"en-US-JennyNeural\">Hello World!</voice></speak>"; 

var playSource = new SsmlSource(ssmlToPlay);
```

### Custom voice models
If you wish to enhance your prompts more and include custom voice models, the play action Text-To-Speech now supports these custom voices. These are a great option if you are trying to give customers a more local, personalized experience or have situations where the default models may not cover the words and accents you're trying to pronounce. To learn more about creating and deploying custom models you can read this [guide](/azure/ai-services/speech-service/how-to-custom-voice).

**Custom voice names regular text example**
``` csharp
String textToPlay = "Welcome to Contoso"; 
 
// Provide VoiceName and CustomVoiceEndpointId to select custom voice. 
var playSource = new TextSource(textToPlay)
    {
        VoiceName = "YourCustomVoiceName",
        CustomVoiceEndpointId = "YourCustomEndpointId"
    };
```
**Custom voice names SSML example**
``` javascriptString ssmlToPlay = "<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"en-US\"><voice name=\"YourCustomVoiceName\">Hello World!</voice></speak>"; 

var playSource = new SsmlSource(ssmlToPlay,"YourCustomEndpointId");
```

Once you've decided on which playSource you wish to use for playing audio, you can then choose whether you want to play it to a specific participant or to all participants.

## Play audio to all participants

In this scenario, audio is played to all participants on the call.

``` csharp
var playResponse = await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .PlayToAllAsync(playSource); 
```

### Support for barge-in
During scenarios where you're playing audio on loop to all participants e.g. waiting lobby you maybe playing audio to the participants in the lobby and keep them updated on their number in the queue. When you use the barge-in support, this will cancel the on-going audio and play your new message. Then if you wanted to continue playing your original audio you would make another play request.

```csharp
var GoodbyePlaySource = new TextSource("Good bye")
{
    VoiceName = "en-US-NancyNeural"
};

PlayToAllOptions playOptions = new PlayToAllOptions(GoodbyePlaySource)
{
    InterruptCallMediaOperation = false,
    OperationCallbackUri = new Uri(callbackUriHost),
    Loop = true
};

await callConnectionMedia.PlayToAllAsync(playOptions);

// Interrupt media with text source

// Option1:
var interrupt = new TextSource("Interrupt prompt message")
{
    VoiceName = "en-US-NancyNeural"
};

PlayToAllOptions playInterrupt = new PlayToAllOptions(interrupt)
{
    InterruptCallMediaOperation = true,
    OperationCallbackUri = new Uri(callbackUriHost),
    Loop = false
};

await callConnectionMedia.PlayToAllAsync(playInterrupt);

/*
Option2: Interrupt media with file source
var interruptFile = new FileSource(new Uri(<AUDIO URL>));
PlayToAllOptions playFileInterrupt = new PlayToAllOptions(interruptFile)
{
    InterruptCallMediaOperation = true,
    OperationCallbackUri = new Uri(callbackUriHost),
    Loop = false
};
await callConnectionMedia.PlayToAllAsync(playFileInterrupt);
*/
```

## Play audio to a specific participant

In this scenario, audio is played to a specific participant. 

``` csharp
var playTo = new List<CommunicationIdentifier> { targetParticipant }; 
var playResponse = await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .PlayAsync(playSource, playTo); 
```

## Play multiple audio prompts 

The play actions all supports the ability to send multiple play sources with just one request. This means you send a list of prompts to play in one go instead of individually making these requests.

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller. Or progress the caller to the next logical step based on your applications business logic.

``` csharp
var playOptions = new PlayToAllOptions(playSource) 
{ 
    Loop = true 
}; 
var playResult = await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .PlayToAllAsync(playOptions); 
```

## Enhance play with audio file caching

If you're playing the same audio file multiple times, your application can provide Azure Communication Services with the sourceID for the audio file. Azure Communication Services caches this audio file for 1 hour.
> [!Note] 
> Caching audio files isn't suitable for dynamic prompts. If you change the URL provided to Azure Communication Services, it does not update the cached URL straight away. The update will occur after the existing cache expires.

``` csharp
var playTo = new List<CommunicationIdentifier> { targetParticipant }; 
var playSource = new FileSource(new Uri(audioUri)) 
{ 
    PlaySourceCacheId = "<playSourceId>" 
}; 
var playResult = await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .PlayAsync(playSource, playTo); 
```

## Handle play action event updates 

Your application receives action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. An example of a successful play event update.

### Example of how you can deserialize the *PlayCompleted* event:

``` csharp
if (acsEvent is PlayCompleted playCompleted) 
{ 
    logger.LogInformation("Play completed successfully, context={context}", playCompleted.OperationContext); 
} 
```

### Example of how you can deserialize the *PlayStarted* event:

``` csharp
if (acsEvent is PlayStarted playStarted) 
{ 
    logger.LogInformation("Play started successfully, context={context}", playStarted.OperationContext); 
} 
```

### Example of how you can deserialize the *PlayFailed* event:

``` csharp
if (acsEvent is PlayFailed playFailed) 
{ 
    if (MediaEventReasonCode.PlayDownloadFailed.Equals(playFailed.ReasonCode)) 
    { 
        logger.LogInformation("Play failed: download failed, context={context}", playFailed.OperationContext); 
    } 
    else if (MediaEventReasonCode.PlayInvalidFileFormat.Equals(playFailed.ReasonCode)) 
    { 
        logger.LogInformation("Play failed: invalid file format, context={context}", playFailed.OperationContext); 
    } 
    else 
    { 
        logger.LogInformation("Play failed, result={result}, context={context}", playFailed.ResultInformation?.Message, playFailed.OperationContext); 
    } 
} 
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

```csharp
var cancelResult = await callAutomationClient.GetCallConnection(callConnectionId) 
    .GetCallMedia() 
    .CancelAllMediaOperationsAsync(); 
```

### Example of how you can deserialize the *PlayCanceled* event:

``` csharp
if (acsEvent is PlayCanceled playCanceled) 
{ 
    logger.LogInformation("Play canceled, context={context}", playCanceled.OperationContext); 
} 
```
