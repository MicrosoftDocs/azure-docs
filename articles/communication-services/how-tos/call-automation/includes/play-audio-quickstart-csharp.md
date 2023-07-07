---
title: include file
description: C# play audio quickstart
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/06/2022
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

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

The NuGet package can be obtained from [here](https://www.nuget.org/packages/Azure.Communication.CallAutomation/), if you have not already done so. 

## Prepare your audio file

If you don't already have an audio file, you can create a new one to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../ai-services/Speech-Service/how-to-audio-content-creation.md).

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). In this quickstart, we'll create an outbound call.

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has just joined the call or play audio to all the participants in the call.

### Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files you need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. The FileSource type in our SDK can be used to specify audio files for the play action.

``` csharp
FileSource playSource = new FileSource (new Uri(<audioUri>));
```

## Play audio to all participants

In this scenario audio is played to all participants on the call.

``` csharp
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var playResponse = await callMedia.PlayToAllAsync(playSource);
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Play audio to a specific participant

In this scenario audio is played to a specific participant. 

``` csharp
var targetUser = new PhoneNumberIdentifier(<target>);
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var playResponse = await callMedia.PlayAsync(playSource, new PhoneNumberIdentifier[] { targetUser });
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller. Or progress the caller to the next logical step based on your applications business logic.

``` csharp
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var playOptions = new PlayOptions()
{
    Loop = true
};
var playResponse = await callMedia.PlayToAllAsync(playSource, playOptions);
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Enhance play with audio file caching

If you are playing the same audio file multiple times, your application can provide ACS with the sourceID for the audio file. ACS caches this audio file for 1 hour. **Note:** Caching audio files is not suitable for dynamic prompts. If you change the URL provided to ACS, it will not update the cached URL straight away. The update will occur after the existing cache expires.

``` csharp
var targetUser = new PhoneNumberIdentifier(<target>);
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var fileSource = new FileSource(new Uri(<audioUri>)) {
    PlaySourceCacheId = "<playSourceId>"
};
var playResponse = await callMedia.PlayAsync(fileSource, new PhoneNumberIdentifier[] { targetUser });
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Handle play action event updates 

Your application will receive action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. Below is an example of a successful play event update.

### Example of how you can deserialize the *PlayCompleted* event:

``` csharp
 if (@event is PlayCompleted { OperationContext: "PlayAudio" })
        {
            var playCompletedEvent = (PlayCompleted)@event;

            if (ReasonCode.CompletedSuccessfully.Equals(playCompletedEvent.ReasonCode))
            {
                //Play audio succeeded, take action on success.
                await callConnection.HangUpAsync(forEveryone: true);
            }
        }
```

### Example of how you can deserialize the *PlayFailed* event:

``` csharp
if (@event is PlayFailed { OperationContext: "PlayAudio" })
        {
            var playFailedEvent = (PlayFailed)@event;

            if (ReasonCode.PlayDownloadFailed.Equals(playFailedEvent.ReasonCode) ||
            ReasonCode.PlayInvalidFileFormat.Equals(playFailedEvent.ReasonCode))
            {
                //Play audio failed, Take some action on failed event.
                logger.LogInformation($"PlayFailed event received for call connection id: {@event.CallConnectionId}");
                await callConnection.HangUpAsync(forEveryone: true);
            }
        }
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

```csharp
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var cancelResponse = await callMedia.CancelAllMediaOperations();
Assert.AreEqual(202, cancelResponse.Status) // The request was accepted.
```

### Example of how you can deserialize the *PlayCanceled* event:

``` csharp
if (@event is PlayCanceled { OperationContext: "PlayAudio" })
        {
            var playCanceledEvent = (PlayCanceled)@event;

            logger.LogInformation($"PlayCanceled event received for call connection id: {@event.CallConnectionId}");
            //Take action on play canceled operation
            await callConnection.HangUpAsync(forEveryone: true);
        }
```
