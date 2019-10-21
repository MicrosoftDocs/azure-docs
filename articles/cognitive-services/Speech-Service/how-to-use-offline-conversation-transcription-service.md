---
title: Offline multi-participant conversation transcription - Speech Service
titleSuffix: Azure Cognitive Services
description: Learn how to use offline conversation transcription using the Speech Service. Available for Java only.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/18/2019
ms.author: amishu
---

# Offline multi-participant conversation transcription

In this article, offline conversation transcription is demonstrated using the **RemoteConversationTranscriptionClient** API. If you have configured the Conversation Transcription Service to perform offline conversation transcription and have a `conversationId`, you can obtain the transcription associated with that `conversationId` using the **RemoteConversationTranscriptionClient** API.

## Offline transcription vs. real-time plus offline transcription

In offline transcription you stream the conversation audio but do not expect the transcription to return to the client. Instead, once the audio is sent successfully, use the `conversationId` of `ConversationTranscriber` to query the status of the offline transcription. Once the offline transcription is successfully completed, you get a `RemoteConversationTranscriptionResult`.

With real-time plus offline, you get the transcription in real-time but can also get the transcription by querying the service with the `conversationId` (similar to offline scenario). This is covered in greater detail in the topics listed above.

## Code examples

There are two parts to offline conversation transcription.

### First: upload the audio to the service using the Speech SDK

Before offline transcription can be performed, we send the audio to Conversation Transcription Service using Microsoft Cognitive Speech client SDK (version 1.8.0 or above), presented in [Transcribe multi-participant conversations in real time with the Speech SDK](how-to-use-conversation-transcription-service.md). In the example code below, the service is set for offline mode. Note that you need to substitute real information for "YourSubscriptionKey" and "YourServiceRegion".

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

If you want real-time _plus_ offline, you will need to comment and uncomment the following lines as shown:

```java
// Set the property for offline transcription
//speechConfig.setServiceProperty("transcriptionMode", "Offline", ServicePropertyChannel.UriQueryParameter);

// Set the property for real-time plus offline transcription
speechConfig.setServiceProperty("transcriptionMode", "RealTimeOffline", ServicePropertyChannel.UriQueryParameter);
```

The above sample is written with Java, but the APIs used are supported on all the platforms and languages specified in the **Limitations** section of [this topic](how-to-use-conversation-transcription-service.md#limitations).

### Second: get offline transcription results using remoteconversation-client-sdk

You will need **remoteconversation-client-sdk version 1.0.0** to use the code in this section. Note that **remoteconversation-client-sdk version 1.0.0** is supported only for Java (1.8 or above) on Windows, Linux and Android (API level 26 or above). You can obtain **remoteconversation-client-sdk** by editing your pom.xml file as follows:

- At the end of the file, before the closing tag `</project>`, create a `repositories` element with a reference to the Maven repository for the Speech SDK:

  ```xml
  <repositories>
    <repository>
      <id>maven-cognitiveservices-speech</id>
      <name>Microsoft Cognitive Services Speech Maven Repository</name>
      <url>https://csspeechstorage.blob.core.windows.net/maven/</url>
    </repository>
  </repositories>
  ```

- Also add a `dependencies` element, with the remoteconversation-client-sdk 1.0.0 as a dependency:

  ```xml
  <dependencies>
    <dependency>
      <groupId>com.microsoft.cognitiveservices.speech.remoteconversation</groupId>
      <artifactId>remoteconversation-client-sdk</artifactId>
      <version>1.0.0</version>
    </dependency>
  </dependencies>
  ```

- Save the changes.

After you have the `conversationId`, create a remote operation object **RemoteConversationTranscriptionOperation** at the client to query the status of the offline conversation transcription service. Note that **RemoteConversationTranscriptionOperation** is extended from [Poller](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/util/polling/Poller.java). Once the poller has successfully finished, you can get the status of **RemoteConversationTranscriptionResult** by subscribing to the poller and querying the result as shown.

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
                                    ConversationTranscriptionResult result = pollResponse.getValue().getConversationTranscriptionResults().get(i);
                                    System.out.println(result.getOffset());
                                    System.out.println(result.getDuration());
                                    System.out.println(result.getUserId());
                                    System.out.println(result.getReason());
                                    System.out.println(result.getResultId());
                                    System.out.println(result.getText());
                                    System.out.println(result.toString());
                                }
                            }
                        }
                );
// Block on the operation till it is finished
operation.block();

System.out.println("Operation finished");
```

## Next steps

> [!div class="nextstepaction"]
> [explore our samples on github](https://aka.ms/csspeech/samples)
