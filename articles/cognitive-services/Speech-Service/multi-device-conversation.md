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

- Connect multiple clients into the same conversation and manage the sending and receiving of messages between them.
- Easily transcribe audio from each client and send the transcription to the others, with optional translation.
- Easily send text messages between clients, with optional translation.

You can build a feature or solution that works across an array of devices, including mobile (Android or iOS), PC, and Linux. Each device can independently send messages (either transcriptions of audio or instant messages) to all other devices.

Whereas **Conversation Transcription** works on a single device with a multichannel microphone array, **Multi-device Conversation** is suited for scenarios with multiple devices, each with a single microphone.

>[!IMPORTANT]
> Multi-device conversation does not support sending audio files between clients: only the transcription and/or translation.

## Key features

- **Cross-platform support** – Clients can be mobile apps (Android / iOS), Windows apps, or web apps.
- **Message relay** - Each client will send text messages to the service, which then distributes the messages to all other clients, in the language(s) of their choice.
- **Voice or text input** – Each user can speak or type on their own device, depending on language support.
- **Real-time transcription** – Everyone can get a transcript of what is being said, so they can follow along the text in real-time or save it for later.
- **Readable transcripts** – The transcription will have punctuation and sentence breaks for easier readability.
- **Real-time translation** – Translate the transcription into more than 60 languages, so each person can participate in their own language.
- **Multi-speaker diarization** – If every speaker uses a separate device, the service will attribute messages based on which device sent it.

## Use cases

### Ad-hoc conversations

Creating and joining a conversation is lightweight: to join a conversation, a user just has to enter a 5-letter code provided by the other user. This is suited for scenarios in which individuals may not necessarily already have each other's contact information, and makes it easy to create quick, ad-hoc conversations.

### Inclusive meetings

Real-time transcription and translation can help make conversations more accessible to people who speak different languages, and/or are deaf or hard of hearing. Using multi-device conversation, each person can also actively participate in the conversation, by speaking their native tongue or using text input.

### Presentations

In scenarios where one person is giving a speech or presenting content to an audience, you can provide captions for the speaker, and also allow each audience member to follow the speech in their own language, on their own device.

## How it works

All clients will use the Speech SDK to create or join a conversation. The Speech SDK interacts with a backend service for multi-device conversation, which manages the lifetime of a conversation, including the list of participants, each client’s chosen language(s), and messages sent.  

Each client can send audio or instant messages. The service will transcribe audio into text, and instant messages will be sent as-is. If clients have chosen different languages, then the service will translate all messages into the specified language(s) of each client.

![Conversation Translation Overview Diagram](images/conversation-translation-service.png)

## Overview of Conversation, Host, and Participant

A **conversation** is a session which the clients connect to, and which is started by the **host** user. 

Metadata of the conversation includes: 
-	Timestamps of when the conversation started and ended
-	List of participants in the conversation, which includes each client’s nickname and chosen language

There are two types of users in a conversation:  **host** and **participant**.

The **host** is the user who starts a conversation, and who acts as the administrator of that conversation.
- Each conversation can only have one host
- The host must be connected to the conversation for the duration of the conversation. If the host leaves the conversation, the conversation will end for all other participants.
- The host has a few extra controls to manage the conversation: 
    - Lock the conversation (prevent additional participants from joining)
    - Mute all participants (prevent other participants from sending messages to the conversation)
    - Mute individual participants
    - Unmute all participants
    - Unmute individual participants

A **participant** is a user who joins a conversation.
- Participants can leave and rejoin the same conversation at any time, without ending the conversation for other participants.

> [!NOTE]
> You can have up to 100 participants per conversation, of which 10 can be speaking at any given time.

## Language support

When creating or joining a conversation, each participant must choose a language. 
- If they choose a language which is supported for **speech-to-text**, then they will be able to use speech input in the conversation. 

- If they choose a **text** language that does not support speech-to-text, then they will only be able to type in the conversation. 

All messages in the conversation will also be translated to each participant's chosen language.

Apart from their chosen, primary language, each participant can also specify additional languages for translating messages they receive.

Below is a summary of the capabilities of the two types of languages: **speech-to-text** and **text**.

|  | [Speech-to-text](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#speech-to-text) | [Text](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#text-languages) |
|-----------------------------------|----------------|------|
| Speech recognition | ✔️ | ❌ |
| Send an instant message | ✔️ | ✔️ |
| Translate others' participants messages to your language | ✔️ | ✔️ |

## Next steps

> [!div class="nextstepaction"]
> [Translate conversations in real-time](quickstarts/multi-device-conversation.md)
