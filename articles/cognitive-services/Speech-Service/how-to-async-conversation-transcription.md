---
title: Asynchronous Conversation Transcription (Preview) - Speech Service
titleSuffix: Azure Cognitive Services
description: Learn how to use asynchronous Conversation Transcription using the Speech Service. Available for Java only.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: amishu
---

# Asynchronous Conversation Transcription (Preview)

In this article, asynchronous Conversation Transcription is demonstrated using the **RemoteConversationTranscriptionClient** API. If you have configured Conversation Transcription to do asynchronous transcription and have a `conversationId`, you can obtain the transcription associated with that `conversationId` using the **RemoteConversationTranscriptionClient** API.

## Asynchronous transcription vs. real-time plus asynchronous transcription

With asynchronous transcription, you stream the conversation audio, but don't need a transcription returned in real time. Instead, after the audio is sent, use the `conversationId` of `ConversationTranscriber` to query for the status of the asynchronous transcription. When the asynchronous transcription is ready, you'll get a `RemoteConversationTranscriptionResult`.

With real-time plus asynchronous, you get the transcription in real time, but also get the transcription by querying with the `conversationId` (similar to asynchronous scenario).

Two steps are required to accomplish asynchronous transcription. The first step is to upload the audio, choosing either asynchronous only or real-time plus asynchronous. The second step is to get the transcription results.

## Upload the audio

Before asynchronous transcription can be performed, you need to send the audio to Conversation Transcription using Microsoft Cognitive Speech client SDK (version 1.8.0 or above), presented in [Transcribe conversations in real time with the Speech SDK](how-to-use-conversation-transcription-service.md). The **Limitations** section of this topic specifies the supported platforms and languages APIs shown in this sample.

This example code shows asynchronous-only mode.

```java
// Create the speech config object
// Substitute real information for "YourSubscriptionKey" and "Region"
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "Region");

// Set the property for asynchronous transcription
speechConfig.setServiceProperty("transcriptionMode", "Offline", ServicePropertyChannel.UriQueryParameter);

// Set the property for real-time plus asynchronous transcription
//speechConfig.setServiceProperty("transcriptionMode", "RealTimeOffline", ServicePropertyChannel.UriQueryParameter);

// Do rest of the things as explained in how to use Conversation Transcription

// Keep a note of `conversationId` which is set using ConversationTranscriber.setConversationId(conversationId)
ConversationTranscriber transcriber = new ConversationTranscriber(speechConfig, AudioConfig.fromDefaultMicrophoneInput());
transcriber.setConversationId("MeetingTest");
// We will use this identifier to retrieve asynchronous transcription later
String conversationId = transcriber.getConversationId();

```

If you want real-time _plus_ asynchronous, comment and uncomment the appropriate lines of code as follows:

```java
// Set the property for asynchronous transcription
//speechConfig.setServiceProperty("transcriptionMode", "Offline", ServicePropertyChannel.UriQueryParameter);

// Set the property for real-time plus asynchronous transcription
speechConfig.setServiceProperty("transcriptionMode", "RealTimeOffline", ServicePropertyChannel.UriQueryParameter);
```

## Get transcription results

This step gets the asynchronous transcription results but assumes any real-time processing you might have required is done elsewhere. For more information, see [Transcribe conversations in real time with the Speech SDK](how-to-use-conversation-transcription-service.md).

For the code shown here, you need **remoteconversation-client-sdk version 1.0.0**, supported only for Java (1.8 or above) on Windows, Linux, and Android (API level 26 or above).

### Obtaining the client SDK

You can obtain **remoteconversation-client-sdk** by editing your pom.xml file as follows.

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

- Save the changes

### Transcribing and getting the results

After you have the `conversationId`, create a remote operation object **RemoteConversationTranscriptionOperation** at the client to query the status of the asynchronous transcription. **RemoteConversationTranscriptionOperation** is extended from [Poller](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/core/azure-core/src/main/java/com/azure/core/util/polling/Poller.java). Once the poller has finished, get **RemoteConversationTranscriptionResult** by subscribing to the poller and querying the object. In this code we simply print the result contents to system output.

```java
// Create the speech config object
SpeechConfig speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "Region");

// Create a remote Conversation Transcription client
RemoteConversationTranscriptionClient client = new RemoteConversationTranscriptionClient(speechConfig);

// Create a remote Conversation Transcription operation
RemoteConversationTranscriptionOperation operation = new RemoteConversationTranscriptionOperation(conversationId, client);

// Operation identifier now be the value of `conversationId`
System.out.println("Operation Identifier:" + operation.getId());

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
> [Explore our samples on GitHub](https://aka.ms/csspeech/samples)
