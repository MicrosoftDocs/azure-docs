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
- [Java Development Kit (JDK)](https://docs.microsoft.com/azure/developer/java/fundamentals/java-jdk-install) version 11 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this sample.
- Get a phone number for your new Azure Communication Services resource. For details, see [Get a phone number](https://docs.microsoft.com/azure/communication-services/quickstarts/telephony-sms/get-phone-number?pivots=platform-azp).
- Download and install [Ngrok](https://www.ngrok.com/download). As the sample is run locally, Ngrok will enable the receiving of all the events.
- (Optional) Create Azure Speech resource for generating custom message to be played by application. Follow [here](https://docs.microsoft.com/azure/cognitive-services/speech-service/overview#try-the-speech-service-for-free) to create the resource.

> Note: the samples make use of the Microsoft Cognitive Services Speech SDK. By downloading the Microsoft Cognitive Services Speech SDK, you acknowledge its license, see [Speech SDK license agreement](https://aka.ms/csspeech/license201809).

## Configuring application

- Open the config.properities file to configure the following settings

	- Connection String: Azure Communication Service resource's connection string.
	- Source Phone: Phone number associated with the resource.
	- DestinationIdentities: Destination identities to call. Multiple outbound calls are separated by a semi-colon and participants in an outbound call are separated by a coma.
      For e.g. +14251002000, 8:acs:ab12b0ea-85ea-4f83-b0b6-84d90209c7c4_00000009-bce0-da09-54b7-xxxxxxxxxxxx; +14251002001, 8:acs:ab12b0ea-85ea-4f83-b0b6-84d90209c7c4_00000009-bce0-da09-555-xxxxxxxxxxxx).
	- NgrokExePath: Folder path where ngrok.exe is installed/saved.
	- SecretPlaceholder: Secret/Password that would be part of callback and will be use to validate incoming requests.
	- CognitiveServiceKey: (Optional) Cognitive service key used for generating custom message
	- CognitiveServiceRegion: (Optional) Region associated with cognitive service
	- CustomMessage: (Optional) Text for the custom message to be converted to speech.

## Add the package references for the calling server SDK

In your POM file, reference the azure-communication-callingserver package with the Calling APIs:

```java
<dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-communication-callingserver</artifactId>
      <version>1.0.0-beta.1</version>
</dependency>
```

For create the user identity, your application needs to reference the `azure-communication-identity` package:

```java
<dependency>
	<groupId>com.azure</groupId>
	<artifactId>azure-communication-identity</artifactId>
	<version>1.0.0</version>
</dependency>
```

## Object model

The following classes handle some of the major features of the Azure Communication Calling Server SDK for Java.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| CallingServerClientBuilder | This class is used to create instance of CallingServerClient.|
| CallingServerClient | This class is needed for the calling functionality. You obtain an instance via CallingServerClientBuilder and use it to start/hangup a call, play/cancel audio and add/remove participants |
| CommunicationIdentityClient | This class is needed to create or delete a communication user identity. |

## Create a call client

A Communication Services connection string and httpClient object must be passed to the `CallingServerClientBuilder` via `connectionString()` and `httpClient()` functions respectively. To create a call client object use `buildClient()` function of `CallingServerClientBuilder` object.

```java
NettyAsyncHttpClientBuilder httpClientBuilder = new NettyAsyncHttpClientBuilder();
CallingServerClientBuilder callClientBuilder = new CallingServerClientBuilder().httpClient(httpClientBuilder.build())
		.connectionString(this.callConfiguration.ConnectionString);

this.callingServerClient = callClientBuilder.buildClient();
```

## Create user identity

Use `CommunicationIdentityClientBuilder` object and set the ACS resource connection string via connectionString() function to create a `CommunicationIdentityClient` object and then use `createUser` function to create a source user identity.

```java
CommunicationIdentityClient client = new CommunicationIdentityClientBuilder()
		.connectionString("<Connection_String>")
		.buildClient();
CommunicationUserIdentifier user = client.createUser();
```

## Delete user identity

Use `deleteUser` function of `CommunicationIdentityClient` object to delete a user identity

```java
CommunicationIdentityClient client = new CommunicationIdentityClientBuilder()
		.connectionString("<Connection_String>")
		.buildClient();
client.deleteUser(new CommunicationUserIdentifier(source));    
```

## Create a call

Use `createCallConnectionWithResponse` method of `CallingServerClient` object to start a call. The following are the parameters for `createCallConnectionWithResponse` method :
- `source`, is the source user identity of the caller. This is of type `CommunicationUserIdentifier`.
- `targets`, is list of target indentities. This is of type `Iterable<CommunicationIdentifier>`.
- `options`, is the options for the call. This is of type `CreateCallOptions`. The following are the parameters for `CreateCallOptions` method :

	- `callbackUri`, is the callback URI of the application.
	- `requestedModalities`, is request call modality. the type is `Iterable<MediaType>`. Values could be Audio or Video.
	- `requestedCallEvents`, is the requested call back events. This is of type `Iterable<EventSubscriptionType>`. Use this parameter to subscribe to `EventSubscriptionType.PARTICIPANTS_UPDATED` and `EventSubscriptionType.DTMF_RECEIVED` events

- Set source caller id as alternate caller id using `setAlternateCallerId()` function of `CreateCallOptions` object.

```java
CommunicationUserIdentifier source = new CommunicationUserIdentifier(this.callConfiguration.SourceIdentity);
PhoneNumberIdentifier target = new PhoneNumberIdentifier(targetPhoneNumber);
List<MediaType> callModality = new ArrayList<MediaType>() { {add(MediaType.AUDIO);} };
List<EventSubscriptionType> eventSubscriptionType = new ArrayList<EventSubscriptionType>() {
		{add(EventSubscriptionType.PARTICIPANTS_UPDATED); add(EventSubscriptionType.DTMF_RECEIVED);}};

CreateCallOptions createCallOption = new CreateCallOptions(this.callConfiguration.AppCallbackUrl,
		callModality, eventSubscriptionType);
createCallOption.setAlternateCallerId(new PhoneNumberIdentifier(this.callConfiguration.SourcePhoneNumber));

Logger.LogMessage(Logger.MessageType.INFORMATION,"Performing CreateCall operation");

List<CommunicationIdentifier> targets = new ArrayList<CommunicationIdentifier>() { {add(target);} };

Response<CallConnection> response = this.callingServerClient.createCallConnectionWithResponse(source, targets, createCallOption, null);
callConnection = response.getValue();
```

The `createCallConnectionWithResponse` method return object of `Response<CallConnection>` which is used to for other call operations like play audio, cancel audio and hangup.

## Play audio

Once a call is created you can use `playAudioWithResponse` method of `CallConnection` object to play an audio message for the callee. The following are the supported parameters for `playAudioWithResponse` method:

- `audioFileUri`, is the URI for the audio file having the message to be played.
- `playAudioOptions`, is the play audio options. The type is `PlayAudioOptions`. The following are the supported parameters for `PlayAudioOptions` object:
	- `loop`, set as true to repeat the audio message.
	- `audioFileId`, An id for the media in the AudioFileUri, using which we cache the media.
	- `operationContext`, is the unique id for request context.

```java
// Preparing data for request
String audioFileUri = callConfiguration.AudioFileUrl;
Boolean loop = true;
String operationContext = UUID.randomUUID().toString();
String audioFileId = UUID.randomUUID().toString();
PlayAudioOptions playAudioOptions = new PlayAudioOptions();
playAudioOptions.setLoop(loop);
playAudioOptions.setAudioFileId(audioFileId);
playAudioOptions.setOperationContext(operationContext);

Logger.LogMessage(Logger.MessageType.INFORMATION, "Performing PlayAudio operation");
Response<PlayAudioResult> playAudioResponse = this.callConnection.playAudioWithResponse(audioFileUri, playAudioOptions, null);

PlayAudioResult response = playAudioResponse.getValue();
```

The `playAudio` method return `Response<PlayAudioResult>` which can be used to get the `OperationStatus` using `getStatus()` method. The `OperationStatus` could have the following values - NotStarted, Running, Completed or Failed.

```java
Logger.LogMessage(Logger.MessageType.INFORMATION, "playAudioWithResponse -- > " + GetResponse(playAudioResponse) + 
", Id: " + response.getOperationId() + ", OperationContext: " + response.getOperationContext() + ", OperationStatus: " +
response.getStatus().toString());
```

## Add a participant to the call

Use `addParticipantWithResponse` method of `CallConnection` object to add a participant to the call. The following are the supported parameters for `addParticipantWithResponse` method:

- `participant`, is the participant identifier. This could be either a `CommunicationUserIdentifier` or `PhoneNumberIdentifier`.
- `alternateCallerId`, is the source caller id.
- `operationContext`, is the unique id for request context.

```java
// Preparing data for request
CommunicationIdentifier participant = null;
String operationContext = UUID.randomUUID().toString();

if (identifierKind == CommunicationIdentifierKind.UserIdentity) {
	participant = new CommunicationUserIdentifier(addedParticipant);

} else if (identifierKind == CommunicationIdentifierKind.PhoneIdentity) {
	participant = new PhoneNumberIdentifier(addedParticipant);
}

String alternateCallerId = new PhoneNumberIdentifier(
		ConfigurationManager.GetInstance().GetAppSettings("SourcePhone")).toString();
Response<AddParticipantResult> response = callConnection.addParticipantWithResponse(participant, alternateCallerId, operationContext, null);
```

## Cancel media processing

Use `cancelAllMediaOperationsWithResponse` method of `CallConnection` object to cancel the play audio operation. The following are the supported parameters for `cancelAllMediaOperationsWithResponse` method:

- `operationContext`, is the unique id for request context.

```java
String operationContext = UUID.randomUUID().toString();
Response<CancelAllMediaOperationsResult> cancelmediaresponse = this.callConnection.cancelAllMediaOperationsWithResponse(operationContext, null);
```

## Hang up the call

Use `hangupWithResponse` method of `CallConnection` object to hang up the call.

```java
Response<Void> response = this.callConnection.hangupWithResponse(null);
```
