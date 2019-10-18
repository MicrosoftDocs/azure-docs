---
title: Offline multi-participant conversation transcription with the Speech SDK - Speech Service
titleSuffix: Azure Cognitive Services
description: Learn how to use Remote Conversation Transcription with the Speech SDK. Available for Java only.
services: cognitive-services
author: amishu
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/18/2019
ms.author: amishu
---

# Offline multi-participant conversation transcription with the Speech SDK

In this article, offline conversation transcription is demonstrated using the **RemoteConversationTranscriptionClient** API in the Speech SDK. If you have configured the Conversation Transcription Service to perform offline conversation transcription and have a `conversationId`, you can obtain the transcription associated with that `conversationId` using the **RemoteConversationTranscriptionClient** API.

## Limitations

- Offline conversation transcription is supported for Java (version 1.8 or above) on Windows, Linux, and Android (API 26 or above).
- All the same limitations listed in [How to use conversation transcription service for real-time transcription](how-to-use-conversation-transcription-service.md) apply here.

## Prerequisites

This feature is available in the extension **remoteconversation-client-sdk version 1.0.0** which uses Microsoft cognitive speech client-sdk 1.8.0 or later. The **remoteconversation-client-sdk version 1.0.0** uses **azure-core 1.0.0-preview.5** and **azure-core-http-netty 1.0.0-preview.5**.

- Learn how to use Speech-to-text with the Speech SDK version 1.8.0 or later. For more information, see [What are Speech Services](overview.md).
- A Speech Services subscription. You can get a Speech trial subscription [HERE](https://azure.microsoft.com/try/cognitive-services/) if you do not already have one.
- Learn how to use real-time conversation transcription [HERE](how-to-use-conversation-transcription-service.md).

## Creating voice signatures for participants

If you have not already done so, perform the steps [HERE](how-to-use-conversation-transcription-service.md#creating-voice-signatures-for-participants) for creating voice signatures and setting requirements for the input wave file to use in this guide.

### Offline transcription vs. real-time plus offline transcription

In offline transcription you stream the conversation audio but do not expect the transcription to return to the client. Instead, once the audio is sent successfully, use the `conversationId` of `ConversationTranscriber` to query the status of the offline transcription. Once the offline transcription is successfully completed get a `RemoteConversationTranscriptionResult`.

With real-time plus offline, you get the transcription in real-time but can also get the transcription by querying the service with the `conversationId` (similar to offline scenario). This is covered in greater detail in the topics listed above.

In the example code below, the service is set for offline mode only as it is presented here (you need to substitute real information for "YourSubscriptionKey" and "YourServiceRegion").

```java
// Create the speech config object
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "Region");

// Set the property for offline transcription
speechConfig.setServiceProperty("transcriptionMode", "Offline", ServicePropertyChannel.UriQueryParameter);

// Set the property for real-time plus offline transcription
//speechConfig.setServiceProperty("transcriptionMode", "RealTimeOffline", ServicePropertyChannel.UriQueryParameter);

// Do rest of the things as explained in how to use conversation transcription service

// Keep a note of `conversationId` which is set using ConversationTranscriber.setConversationId(conversationId)
ConversationTranscriber transcriber = new ConversationTranscriber(speechConfig, AudioConfig.fromDefaultMicrophoneInput());
transcriber.setConversationId("MeetingTest");
// We will use this id to retrieve offline transcription later
String conversationId = transcriber.getConversationId();

```

Note that if you want real-time plus offline, you will need to comment and uncomment the following lines as shown:

```java
// Set the property for offline transcription
//speechConfig.setServiceProperty("transcriptionMode", "Offline", ServicePropertyChannel.UriQueryParameter);

// Set the property for real-time plus offline transcription
speechConfig.setServiceProperty("transcriptionMode", "RealTimeOffline", ServicePropertyChannel.UriQueryParameter);
```

Although this topic does not show how to use real-time transcription, it is shown [HERE](how-to-use-conversation-transcription-service.md).

### Get offline transcription results

Refer to the code example and description below.

```java
// Create the speech config object
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "Region");

// Create a remote conversation transcription client
RemoteConversationTranscriptionClient client = new RemoteConversationTranscriptionClient(speechConfig);

// Create a remote conversation transcription operation
RemoteConversationTranscriptionOperation operation = new RemoteConversationTranscriptionOperation(conversationId, client);

// Operation id now be the value of `conversationId`
System.out.println("Operation Id:" + operation.getId());

// Get the observer (which is a Flux) and subscribe to it for the response
operation.getObserver()
                .subscribe(
                        pollResponse -> {
                            System.out.println("Poll response status : " + pollResponse.getStatus());
                            if(pollResponse.getValue().getConversationTranscriptionResults() != null) {
                                for (int i = 0; i < pollResponse.getValue().getConversationTranscriptionResults().size(); i++) {
                                    System.out.println(pollResponse.getValue().getConversationTranscriptionResults().get(i).getOffset());
                                    System.out.println(pollResponse.getValue().getConversationTranscriptionResults().get(i).getDuration());
                                    System.out.println(pollResponse.getValue().getConversationTranscriptionResults().get(i).getUserId());
                                    System.out.println(pollResponse.getValue().getConversationTranscriptionResults().get(i).getReason());
                                    System.out.println(pollResponse.getValue().getConversationTranscriptionResults().get(i).getResultId());
                                    System.out.println(pollResponse.getValue().getConversationTranscriptionResults().get(i).getText());
                                    System.out.println(pollResponse.getValue().getConversationTranscriptionResults().get(i).toString());
                                }
                            }
                        }
                );
// Block on the operation till it is finished
operation.block();

System.out.println("Operation finished");
```

Once you have the `conversationId`, create a remote operation object **_RemoteConversationTranscriptionOperation_** at the client to query the status of the offline conversation transcription service. The remote operation object is extended from [Poller](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/util/polling/Poller.java) in [azure-core](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/core/azure-core). **_Poller_** is built using the [reactor framework](https://projectreactor.io/) for Java. Once the poller has successfully completed, you can get the RemoteConversationTranscriptionResult by subscribing to the poller.

## Next steps

> [!div class="nextstepaction"][explore our samples on github](https://aka.ms/csspeech/samples)
