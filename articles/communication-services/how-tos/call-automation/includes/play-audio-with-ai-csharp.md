---
title: include file
description: CSharp play ai action how-to
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 02/16/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Obtain the NuGet package from the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed).
- Create and connect [Azure Cognitive Services to your Azure Communication Services resource](../azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../cognitive-services/cognitive-services-custom-subdomains.md) for your Azure Cognitive Services resource. 

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

During the preview phase, the NuGet package can be obtained by configuring your package manager to use the Azure SDK Dev Feed from [here](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed).

## (Optional) Prepare your audio file if you wish to use audio files for playing prompts

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../cognitive-services/Speech-Service/how-to-audio-content-creation.md).

## (Optional) Connect your Azure Cognitive Service to your Azure Communication Service

If you would like to use Text-To-Speech capabilities, then it's required for you to connect your Azure Cognitive Service to your Azure Communication Service.
``` code
az communication bind-cognitive-service --name “{Azure Communication resource name}” --resource-group “{Azure Communication resource group}” --resource-id “{Cognitive service resource id}” --subscription{subscription Name of Cognitive service} –identity{Cognitive Services Identity}

```
## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this quickstart, we answer an incoming call.

``` csharp
AnswerCallOptions answerCallOptions = new AnswerCallOptions("<Incoming call context>", "<https://sample-callback-uri>");
answerCallOptions.setAzureCognitiveServicesEndpointUrl("https://sample-cognitive-service-resource.cognitiveservices.azure.com/");
Response<AnswerCallResult> answerCallResult = callAutomationClient
                                               .answerCallWithResponse(answerCallOptions)
                                               .block();
```

## Play Audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has joined the call or play audio to all the participants in the call.

### Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files you need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. 

``` csharp
FileSource playSource = new FileSource (new Uri(<audioUri>));
```

### Play source - Text-To-Speech

To play audio using Text-To-Speech through Azure Cognitive Services you need to provide the text you wish to play, as well either the SourceLocale, and VoiceGender or the VoiceName you wish to use.

```csharp
String textToPlay = "Welcome to Contoso";
TextSource playSource = new TextSource(textToPlay);
{
    SourceLocale = "en-US",
    VoiceGender = GenderType.Female,
    VoiceName = "en-US-ElizabethNeural"
 };
```

## Play audio to a specific participant

In this scenario audio is played to a specific participant. 

``` csharp
var targetUser = new PhoneNumberIdentifier(<target>);
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var playResponse = await callMedia.PlayAsync(playSource, new PhoneNumberIdentifier[] { targetUser });
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Play audio to all participants

In this scenario audio is played to all participants on the call.

``` csharp
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var playResponse = await callMedia.PlayToAllAsync(playSource);
Assert.AreEqual(202, playResponse.Status) // The request was accepted.
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller or progress the caller to the next logical step based on your applications business logic.

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

If your application is playing the same audio file multiple times using a FileSource, your application can provide us with the sourceID for the audio file. ACS caches this audio file for 1 hour.

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

Your application receives action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. An example of a successful play event update.

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

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

```csharp
var callMedia = callAutomationClient.GetCallConnection(<callConnectionId>).GetCallMedia();
var cancelResponse = await callMedia.CancelAllMediaOperations();
Assert.AreEqual(202, cancelResponse.Status) // The request was accepted.
```
