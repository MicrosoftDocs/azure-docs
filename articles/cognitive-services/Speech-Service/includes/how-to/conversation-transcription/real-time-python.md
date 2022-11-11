---
author: jyotsna-ravi
ms.service: cognitive-services
ms.topic: include
ms.date: 11/11/2022
ms.author: jyravi
---

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Before you can do anything, you need to install the Speech SDK for Python. You may install Speech SDK package from pyPI using _pip install azure-cognitiveservices-speech_. If you already have this installed, please upgrade to the latest SDK using _pip install --upgrade azure-cognitiveservices-speech_.
 

## Create voice signatures

If you want to enroll user profiles, the first step is to create voice signatures for the conversation participants so that they can be identified as unique speakers. This isn't required if you don't want to use pre-enrolled user profiles to identify specific participants.

The input `.wav` audio file for creating voice signatures must be 16-bit, 16 kHz sample rate, in single channel (mono) format. The recommended length for each audio sample is between 30 seconds and two minutes. An audio sample that is too short will result in reduced accuracy when recognizing the speaker. The `.wav` file should be a sample of one person's voice so that a unique voice profile is created.

The following example shows how to create a voice signature by [using the REST API](https://aka.ms/cts/signaturegenservice) in JavaScript. You must insert your `subscriptionKey`, `region`, and the path to a sample `.wav` file.

```python


```

Running this script returns a voice signature string in the variable `voiceSignatureString`. Run the function twice so you have two strings to use as input to the variables `voiceSignatureStringUser1` and `voiceSignatureStringUser2` below.

> [!NOTE]
> Voice signatures can **only** be created using the REST API.

## Transcribe conversations

The following sample code demonstrates how to transcribe conversations in real time for two speakers. It assumes you've already created voice signature strings for each speaker as shown above. Substitute real information for `subscriptionKey`, `region`, and the path `filepath` for the audio you want to transcribe.

If you don't use pre-enrolled user profiles, it will take a few more seconds to complete the first recognition of unknown users as speaker1, speaker2, etc.

> [!NOTE]
> Make sure the same `subscriptionKey` is used across your application for signature creation, or you will encounter errors. 

This sample code does the following:

* Creates a push stream to use for transcription, and writes the sample `.wav` file to it.
* Creates a `Conversation` using `createConversationAsync()`.
* Creates a `ConversationTranscriber` using the constructor.
* Adds participants to the conversation. The strings `voiceSignatureStringUser1` and `voiceSignatureStringUser2` should come as output from the steps above.
* Registers to events and begins transcription.
* If you want to differentiate speakers without providing voice samples, please enable `DifferentiateGuestSpeakers` feature as in [Conversation Transcription Overview](../../../conversation-transcription.md). 

```python

 
```

See more samples on GitHub:
- [ROOBO device sample code](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK/blob/master/Samples/Java/Android/Speech%20Devices%20SDK%20Starter%20App/example/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/sdsdkstarterapp/ConversationTranscription.java)
- [Azure Kinect Dev Kit sample code](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK/blob/master/Samples/Java/Windows_Linux/SampleDemo/src/com/microsoft/cognitiveservices/speech/samples/Cts.java)
