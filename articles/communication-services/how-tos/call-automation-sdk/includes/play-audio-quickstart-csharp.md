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
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [Call Automation SDK](../../Callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Obtain the NuGet package from the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

During the preview phase, the NuGet package can be obtained by configuring your package manager to use the Azure SDK Dev Feed from [here](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)

## Obtain your connection string

From the Azure portal, locate your Communication Service resource and click on the Keys section to obtain your connection string.

:::image type="content" source="./../../media/call-automation/Key.png" alt-text="Screenshot of Communication Services resource page on portal to access keys.":::

## Prepare your audio file

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**.

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/voice-video-calling/callflows-for-customer-interactions.md). In this quickstart, we'll answer an incoming call.

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has just joined the call or play audio to all the participants in the call.

## Play audio - Specific participant

In this scenario audio will be played to a specific participant that is specified in the request.

``` csharp 
var targetUser = new PhoneNumberIdentifier(<target>);
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var fileSource = new FileSource(new Uri(<audioUri>));
var playResponse = await callMedia.PlayAsync(fileSource, new PhoneNumberIdentifier[] { targetUser });
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Play audio - All participants

In this scenario audio will be played to all participants on the call. 

``` csharp 
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var fileSource = new FileSource(new Uri(<audioUri>));
var playResponse = await callMedia.PlayToAllAsync(fileSource);
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller. Or progress the caller to the next logical step based on your applications business logic.

``` csharp
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var fileSource = new FileSource(new Uri(<audioUri>));
var playOptions = new PlayOptions()
{
    Loop = true
};
var playResponse = await callMedia.PlayToAllAsync(fileSource, playOptions);
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Enhance play with audio file caching

If you'll be playing the same audio file multiple times, your application can provide us the sourceID for the audio file. ACS will cache this audio file for 1 hour.

``` csharp
var targetUser = new PhoneNumberIdentifier(<target>);
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var fileSource = new FileSource(new Uri(<audioUri>)) {
    PlaySourceId = "<playSourceId>"
};
var playResponse = await callMedia.PlayAsync(fileSource, new PhoneNumberIdentifier[] { targetUser });
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Handle play action event updates 

Your application will receive action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. Below is an example of a successful play event update.

```json 
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

To learn more about other supported events, visit the [Call Automation overview document](../../../../concepts/voice-video-calling/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations will be canceled. This action will also cancel other queued play actions.

```csharp
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var cancelResponse = await callMedia.CancelAllMediaOperations();
Assert.AreEqual(202, cancelResponse.Status) // The request was accepted.
```
