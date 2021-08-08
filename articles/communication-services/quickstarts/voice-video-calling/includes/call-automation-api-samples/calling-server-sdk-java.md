---
title: include file
description: Java call automation
services: azure-communication-services
author: ravithanneeru
manager: joseys
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: joseys
---

## Prerequisites
Before you get started, make sure to:
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/).
- [Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-jdk-install) version 11 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource). You'll need to record your resource **connection string** for this sample.
- Get a phone number for your new Azure Communication Services resource. For details, see [Get a phone number](https://docs.microsoft.com/azure/communication-services/quickstarts/telephony-sms/get-phone-number?pivots=platform-azp).
- Download and install [ngrok](https://www.ngrok.com/download). As the sample is run locally, ngrok will enable the receiving of all the events.
- (Optional) Create Azure Speech resource for generating custom message to be played by application. Follow [this guidance](../../../../../cognitive-services/speech-service/overview.md#try-the-speech-service-for-free) to create the resource.

> [!NOTE]
> You can find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/OutboundCallReminder). This sample makes use of the Microsoft Cognitive Services Speech SDK. By downloading the Microsoft Cognitive Services Speech SDK, you acknowledge its [license](https://aka.ms/csspeech/license201809).

## Add the package references for the calling server SDK

In your POM file, reference the `azure-communication-callingserver` package with the Calling APIs:

```java
<dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-communication-callingserver</artifactId>
      <version>1.0.0-beta.2</version>
</dependency>
```

For create the user identity, your application needs to reference the `azure-communication-identity` package:

```java
  <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-communication-identity</artifactId>
      <version>1.1.1</version>
      <exclusions>
        <exclusion>
          <groupId>com.azure</groupId>
          <artifactId>azure-communication-common</artifactId>
        </exclusion>
      </exclusions>
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

Use the `CommunicationIdentityClientBuilder` object and set the Communication Services resource connection string via the `connectionString()` function to create a `CommunicationIdentityClient` object and then use the `createUser` function to create a source user identity.

```java
CommunicationIdentityClient client = new CommunicationIdentityClientBuilder()
		.connectionString("<Connection_String>")
		.buildClient();
CommunicationUserIdentifier user = client.createUser();
```

## Delete user identity

Use the `deleteUser` function of the `CommunicationIdentityClient` object to delete a user identity:

```java
CommunicationIdentityClient client = new CommunicationIdentityClientBuilder()
		.connectionString("<Connection_String>")
		.buildClient();
client.deleteUser(new CommunicationUserIdentifier(source));    
```

## Create a call

Use the `createCallConnectionWithResponse` method of the `CallingServerClient` object to start a call. The following parameters are supported by the `createCallConnectionWithResponse` method:
- `source`, is the source user identity of the caller of type `CommunicationUserIdentifier`.
- `targets`, is list of target identities of type `Iterable<CommunicationIdentifier>`.
- `options`, is the options for the call of type `CreateCallOptions`. The following are the parameters for `CreateCallOptions` method:

	- `callbackUri`, is the callback URI of the application.
	- `requestedModalities`, is request call modality. the type is `Iterable<MediaType>`. Values could be Audio or Video.
	- `requestedCallEvents`, is the requested callback events of type `Iterable<EventSubscriptionType>`. Use this parameter to subscribe to `EventSubscriptionType.PARTICIPANTS_UPDATED` and `EventSubscriptionType.DTMF_RECEIVED` events

- Set source caller ID as alternate caller ID using `setAlternateCallerId()` function of `CreateCallOptions` object.

```java
CommunicationUserIdentifier source = new CommunicationUserIdentifier(this.callConfiguration.SourceIdentity);
PhoneNumberIdentifier target = new PhoneNumberIdentifier(targetPhoneNumber);
List<MediaType> callModality = new ArrayList<>() { {add(MediaType.AUDIO);} };
List<EventSubscriptionType> eventSubscriptionType = new ArrayList<>() {
        {add(EventSubscriptionType.PARTICIPANTS_UPDATED); add(EventSubscriptionType.DTMF_RECEIVED);}};

CreateCallOptions createCallOption = new CreateCallOptions(this.callConfiguration.appCallbackUrl,
        callModality, eventSubscriptionType);
createCallOption.setAlternateCallerId(new PhoneNumberIdentifier(this.callConfiguration.sourcePhoneNumber));

Logger.logMessage(Logger.MessageType.INFORMATION,"Performing CreateCall operation");

List<CommunicationIdentifier> targets = new ArrayList<>() { {add(target);} };

Response<CallConnection> response = this.callingServerClient.createCallConnectionWithResponse(source, targets, createCallOption, null);
callConnection = response.getValue();
```

The `createCallConnectionWithResponse` method return object of `Response<CallConnection>`, which is used to for other call operations like play audio, cancel audio and hang up.

## Play audio

Once a call is created, you can use the `playAudioWithResponse` method of the `CallConnection` object to play an audio message for the callee. The following parameters are supported by the `playAudioWithResponse` method:

- `audioFileUri`, is the URI for the audio file having the message to be played.
- `playAudioOptions`, is the play audio options. The type is `PlayAudioOptions`. The following are the supported parameters for `PlayAudioOptions` object:
	- `loop`, set as true to repeat the audio message.
	- `audioFileId`, An ID for the media in the AudioFileUri, using which we cache the media.
	- `operationContext`, is the unique ID for request context.

```java
// Preparing data for request
String audioFileUri = callConfiguration.audioFileUrl;
Boolean loop = true;
String operationContext = UUID.randomUUID().toString();
String audioFileId = UUID.randomUUID().toString();
PlayAudioOptions playAudioOptions = new PlayAudioOptions();
playAudioOptions.setLoop(loop);
playAudioOptions.setAudioFileId(audioFileId);
playAudioOptions.setOperationContext(operationContext);

Logger.logMessage(Logger.MessageType.INFORMATION, "Performing PlayAudio operation");
Response<PlayAudioResult> playAudioResponse = this.callConnection.playAudioWithResponse(audioFileUri, playAudioOptions, null);

PlayAudioResult response = playAudioResponse.getValue();
```

The `playAudio` method returns `Response<PlayAudioResult>`, which can be used to get the `OperationStatus` using the `getStatus()` method. The `OperationStatus` could have the following values: `NotStarted`, `Running`, `Completed`, or `Failed`.

```java
Logger.logMessage(Logger.MessageType.INFORMATION, "playAudioWithResponse -- > " + GetResponse(playAudioResponse) +
", Id: " + response.getOperationId() + ", OperationContext: " + response.getOperationContext() + ", OperationStatus: " +
response.getStatus().toString());
```

## Add a participant to the call

Use the `addParticipantWithResponse` method of the `CallConnection` object to add a participant to the call. The following parameters are supported by the `addParticipantWithResponse` method:

- `participant`, is the participant identifier of type `CommunicationUserIdentifier` or `PhoneNumberIdentifier`.
- `alternateCallerId`, is the source caller ID.
- `operationContext`, is the unique ID for request context.

```java
// Preparing data for request
CommunicationIdentifier participant = null;
String operationContext = UUID.randomUUID().toString();

if (identifierKind == CommunicationIdentifierKind.UserIdentity) {
	participant = new CommunicationUserIdentifier(addedParticipant);

} else if (identifierKind == CommunicationIdentifierKind.PhoneIdentity) {
	participant = new PhoneNumberIdentifier(addedParticipant);
}

Response<AddParticipantResult> response = callConnection.addParticipantWithResponse(participant, this.callConfiguration.sourcePhoneNumber, operationContext, null);
```

## Cancel media processing

Use the `cancelAllMediaOperationsWithResponse` method of the `CallConnection` object to cancel the play audio operation. The following parameters are supported by the `cancelAllMediaOperationsWithResponse` method:

- `operationContext`, is the unique ID for request context.

```java
String operationContext = UUID.randomUUID().toString();
Response<CancelAllMediaOperationsResult> cancelmediaresponse = this.callConnection.cancelAllMediaOperationsWithResponse(operationContext, null);
```

## Hang up the call

Use the `hangupWithResponse` method of `CallConnection` object to hang up the call.

```java
Response<Void> response = this.callConnection.hangupWithResponse(null);
```