---
title: What is Multi-device Conversation (Preview) - Speech Service
titleSuffix: Azure Cognitive Services
description:
services: cognitive-services
author: ralphe
manager: cpoulain
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/06/2019
ms.author: ralphe
---
# What is Multi-device Conversation?

**Multi-device conversation** makes it easy to create a speech or text conversation between multiple clients and coordinate the messages sent between them.

With **multi-device conversation**, you can:

- Connect multiple clients into the same conversation and manage the sending and receiving of messages between them
- Easily transcribe audio from each client and send the transcription to the others, with optional translation
- Easily translate instant messages between clients

You can build a feature or solution that works across an array of devices, including mobile (Android or iOS), PC, and Linux. Each device can independently send audio and/or text to all other devices.

>[!NOTE]
> Multi-device conversation does not support sending audio files between clients: only the transcription and/or translation.

Whereas **Conversation Transcription** works on a single device with a multichannel microphone array, **Multi-device Conversation** is suited for scenarios with multiple devices, each with a single microphone. 


> [!NOTE]
> You can have up to 100 participants per conversation, of which 10 can be speaking at any given time.

## Key features

- **Cross-platform support** – Clients can be mobile apps (Android / iOS), Windows desktop apps, or web apps
- **Message relay** - Each client will send text messages to the service, which then distributes the messages to all other clients, in the language(s) of their choice
- **Voice or text input** – Each user can speak or type on their own device, depending on language support
- **Real-time transcription** – Get a transcript of what is being said, so you can follow along the text in real-time or save it for later
- **Readable transcripts** – The transcription will have punctuation and sentence breaks for easier readability
- **Real-time translation** – Translate the transcription into more than 60 languages, so each person can receive content in their own language- 
**Multi-speaker diarization** – If every speaker uses a separate device, the service will attribute messages based on which device sent it


## Use cases



### Multilingual group conversations
Creating and joining a conversation is lightweight and suited for scenarios in which individuals may not necessarily already have each other's contact information. This makes it easy to create quick, ad-hoc conversations.

### Inclusive meetings
Real-time transcription and translation can help make conversations more accessible to people who speak different languages or are deaf or hard of hearing. Using multi-device conversation, each person can also actively participate in the conversation, by speaking their native tongue or using text input. 

### Education

### Presentations
In scenarios where one person is giving a speech or presenting content to an audience, you can provide captions for the speaker, and also allow each audience member to follow the speech in their own language, on their own device. 

## How it works

All clients will use the Speech SDK to create or join a conversation. The Speech SDK interacts with a backend service for multi-device conversation, which manages the lifetime of a conversation, including the list of participants, each client’s chosen language(s), and  messages sent.  

Each client can send audio or instant messages. The service will transcribe audio into text, and instant messages will be sent as-is.
If clients have chosen different languages, then the service will translate all messages into the specified language(s) of each client.

![Conversation Translation Overview Diagram](media/scenarios/conversation-translation-service.png)



## Language support

When creating or joining a conversation you can specify two different types of languages:

|  | [Speech-to-text](language-support.md#speech-to-text) | [Text](language-support.md#text-languages) |
|-----------------------------------|----------------|------|
| Speech recognition & translation | ✔️ | ❌ |
| Send an instant message | ✔️ | ✔️ |
| Follow along in your own language | ✔️ | ✔️ |

## Next steps

> [!div class="nextstepaction"]
> [Translate conversations in real time](quickstarts/conversation-translator-multiple-languages.md)
