---
title: include file
description: include file
services: azure-communication-services
author: ravithanneeru
manager: joseys
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/08/2021
ms.topic: include
ms.custom: include file
ms.author: joseys
---

> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/add-chat)

## Prerequisites
Before you get started, make sure to:
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/).
- [Visual Studio (2019 and above)](https://visualstudio.microsoft.com/vs/).
- [.NET Framework 4.7.2](https://dotnet.microsoft.com/download/dotnet-framework/net472) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this sample.
- Get a phone number for your new Azure Communication Services resource. For details, see [Get a phone number](https://docs.microsoft.com/azure/communication-services/quickstarts/telephony-sms/get-phone-number?pivots=platform-azp).
- Download and install [Ngrok](https://www.ngrok.com/download). As the sample is run locally, Ngrok will enable the receiving of all the events.
- (Optional) Create Azure Speech resource for generating custom message to be played by application. Follow [here](https://docs.microsoft.com/azure/cognitive-services/speech-service/overview#try-the-speech-service-for-free) to create the resource.

> Note: the samples make use of the Microsoft Cognitive Services Speech SDK. By downloading the Microsoft Cognitive Services Speech SDK, you acknowledge its license, see [Speech SDK license agreement](https://aka.ms/csspeech/license201809).

## Configuring application

- Open the App.config file to configure the following settings

	- Connection String: Azure Communication Service resource's connection string.
	- Source Phone: Phone number associated with the resource.
	- DestinationIdentities: Destination identities to call. Multiple outbound calls are separated by a semi-colon and participants in an outbound call are separated by a coma.
      For e.g. +14251002000, 8:acs:ab12b0ea-85ea-4f83-b0b6-84d90209c7c4_00000009-bce0-da09-54b7-xxxxxxxxxxxx; +14251002001, 8:acs:ab12b0ea-85ea-4f83-b0b6-84d90209c7c4_00000009-bce0-da09-555-xxxxxxxxxxxx).
	- NgrokExePath: Folder path where ngrok.exe is installed/saved.
	- SecretPlaceholder: Secret/Password that would be part of callback and will be use to validate incoming requests.
	- CognitiveServiceKey: (Optional) Cognitive service key used for generating custom message
	- CognitiveServiceRegion: (Optional) Region associated with cognitive service
	- CustomMessage: (Optional) Text for the custom message to be converted to speech.

## Object model

The following classes handle some of the major features of the Azure Communication Calling Server SDK for C#.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallingServerClient | This class is needed for the calling functionality. You create an instance of CallingServerClient using ACS resource connection string and use it to start/hangup a call, play/cancel audio and add/remove participants |
| CommunicationIdentityClient | This class is needed to create or delete a communication user identity. |

## Create a call client

To create a call client, you'll use your Communication Services connection string and pass to call client object.

```csharp
this.CallClient = new CallingServerClient("<Connection_String>");
```

## Create user identity

Use the ACS resource connection string to create a `CommunicationIdentityClient` object and then use `CreateUserAsync` method to create a source user identity.

```csharp
var client = new CommunicationIdentityClient("<Connection_String>");
var user = await client.CreateUserAsync().ConfigureAwait(false);
```

## Delete user identity

Use `DeleteUserAsync` method of `CommunicationIdentityClient` object to delete a user identity

```csharp
var client = new CommunicationIdentityClient("<Connection_String>");
await client.DeleteUserAsync(new CommunicationUserIdentifier(source)).ConfigureAwait(false);
```

## Create a call

Use `CreateCallConnectionAsync` method of `CallingServerClient` object to start a call. The following are the parameters for `CreateCallConnectionAsync` method :
- `source`, is the source user identity of the caller. This is of type `CommunicationIdentifier`.
- `targets`, is list of target indentities. This is of type `IEnumerable<CommunicationIdentifier>`.
- `options`, is the options for the call. This is of type `CreateCallOptions`. The following are the parameters for `CreateCallOptions` method :

	- `callbackUri`, is the callback URI of the application.
	- `requestedModalities`, is request call modality. The type is `IEnumerable<MediaType>`. Values could be Audio or Video.
	- `requestedCallEvents`, is the requested call back events. This is type of `IEnumerable<EventSubscriptionType>`. Use this parameter to subscribe to `EventSubscriptionType.ParticipantsUpdated` and `EventSubscriptionType.DtmfReceived` events

- `cancellationToken`, is the cancellation token. The type is `CancellationToken`.

```csharp
var source = new CommunicationUserIdentifier(callConfiguration.SourceIdentity);
var target = new PhoneNumberIdentifier(targetPhoneNumber);
var createCallOption = new CreateCallOptions(
	new Uri(callConfiguration.AppCallbackUrl),
	new List<MediaType> { MediaType.Audio },
	new List<EventSubscriptionType> { EventSubscriptionType.ParticipantsUpdated, EventSubscriptionType.DtmfReceived }
	);
createCallOption.AlternateCallerId = new PhoneNumberIdentifier(callConfiguration.SourcePhoneNumber);

Logger.LogMessage(Logger.MessageType.INFORMATION, "Performing CreateCall operation");
var call = await callClient.CreateCallConnectionAsync(source,
	new List<CommunicationIdentifier>() { target },
	createCallOption, reportCancellationToken)
	.ConfigureAwait(false);
```

The `CreateCallConnectionAsync` method return `CallConnection` object which can be used for other call operations like play audio, cancel audio and hangup.

## Play audio

Once a call connection is created you can use `PlayAudioAsync` method of `CallConnection` object to play an audio message for the callee. The following are the supported parameters for `PlayAudioAsync` method:

- `options`, required, is the play audio options. The type is `PlayAudioOptions`. The following are the supported parameters for `PlayAudioOptions` object:
	- `AudioFileUri`, required, is the URI for the audio file having the message to be played.
	- `OperationContext`, required, is the unique id for request context.
	- `Loop`, optional, set as true to repeat the audio message.
- `cancellationToken`, is the cancellation token. The type is `CancellationToken`.

```csharp
// Preparing data for request
var playAudioRequest = new PlayAudioOptions()
{
	AudioFileUri = new Uri(callConfiguration.AudioFileUrl),
	OperationContext = Guid.NewGuid().ToString(),
	Loop = true,
};

Logger.LogMessage(Logger.MessageType.INFORMATION, "Performing PlayAudio operation");
var response = await callConnection.PlayAudioAsync(playAudioRequest, reportCancellationToken).ConfigureAwait(false);
```

The `PlayAudioAsync` method return `PlayAudioResponse` which can be used to get the `OperationStatus`. The `OperationStatus` could have the following values - NotStarted, Running, Completed or Failed.

```csharp
Logger.LogMessage(Logger.MessageType.INFORMATION, $"Play Audio state: {response.Value.Status}");
```

## Add a participant to the call

Use `AddParticipantAsync` method of `CallConnection` object to add a participant to the call. The following are the supported parameters for `AddParticipantAsync` method:

- `participant`, is the participant identifier. This could be either a `CommunicationUserIdentifier` or `PhoneNumberIdentifier`.
- `alternateCallerId`, is the source caller id.
- `operationContext`, is the unique id for request context.
- `cancellationToken`, optional, is the cancellation token.


```csharp
// Preparing data for request
var operationContext = Guid.NewGuid().ToString();
var alternartCallerid = new PhoneNumberIdentifier(ConfigurationManager.AppSettings["SourcePhone"]).ToString();

if (identifierKind == CommunicationIdentifierKind.UserIdentity)
{
	var response = await callConnection.AddParticipantAsync(new CommunicationUserIdentifier(addedParticipant), alternartCallerid, operationContext).ConfigureAwait(false);
	Logger.LogMessage(Logger.MessageType.INFORMATION, $"PlayAudioAsync response --> {response}");
}
else if (identifierKind == CommunicationIdentifierKind.PhoneIdentity)
{
	var response = await callConnection.AddParticipantAsync(new PhoneNumberIdentifier(addedParticipant), alternartCallerid, operationContext).ConfigureAwait(false);
	Logger.LogMessage(Logger.MessageType.INFORMATION, $"PlayAudioAsync response --> {response}");
}
```

## Cancel media processing

Use `CancelAllMediaOperationsAsync` method of `CallConnection` object to cancel the play audio operation. The following are the supported parameters for `CancelAllMediaOperationsAsync` method:

- `operationContext`, is the unique id for request context.
- `reportCancellationToken`, is the cancellation token. The type is `CancellationToken`.

```csharp
var operationContext = Guid.NewGuid().ToString();
var response = await callConnection.CancelAllMediaOperationsAsync(operationContext, reportCancellationToken).ConfigureAwait(false);
```

## Hang up the call

Use `HangupAsync` method of `CallConnection` object to hang up the call. The following are the supported parameters for `HangupAsync` method:

- `reportCancellationToken`, is the cancellation token. The type is `CancellationToken`.

```csharp
var hangupResponse = await callConnection.HangupAsync(reportCancellationToken).ConfigureAwait(false);
```
