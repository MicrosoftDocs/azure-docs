---
title: Game development with Azure Cognitive Service for Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Concepts for game development with Azure Cognitive Service for Speech.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/11/2023
ms.author: eur
zone_pivot_groups: programming-languages-speech-sdk-cli
---

# Game development with Azure Cognitive Service for Speech

Azure Cognitive Services for Speech can be used to improve a variety of gaming scenarios, both in- and out-of-game. 

Here are a few Speech features to consider for flexible and interactive game experiences:

- Bring everyone into the conversation by synthesizing audio from text. Or by displaying text from audio.
- Make the game more accessible for players who are unable to read text in a particular language, including young players who haven't learnt to read and write. Players can listen to storylines and instructions in their preferred language. 
- Create game avatars and non-playable characters (NPC) that can initiate or participate in a conversation in-game. 
- Prebuilt neural voice can provide highly natural out-of-box voices with leading voice variety in terms of a large portfolio of languages and voices. 
- Custom neural voice for creating a voice that stays on-brand with consistent quality and speaking style. You can add emotions, accents, nuances, laughter, and other paralinguistic sounds and expressions. 
- Use game dialogue prototyping to shorten the amount of time and money spent in product to get the game to market sooner. You can rapidly swap lines of dialog and listen to variations in real-time to iterate the game content.

You can use the [Speech SDK](speech-sdk.md) or [Speech CLI](spx-overview.md) for speech-to-text, text-to-speech, language identification, and speech translation. You can also use the [Batch transcription API](batch-transcription.md) to transcribe pre-recorded speech to text. To synthesize a large volume of text input (long and short) to speech, use the [Batch synthesis API](batch-synthesis.md).

## Text-to-speech

Help bring everyone into the conversation by converting text messages to audio using Text-to-Speech for scenarios, such as game dialogue prototyping, greater accessibility, or non-playable character (NPC) voices. Text-to-Speech includes prebuilt neural voice and custom neural voice features. Prebuilt neural voice can provide highly natural out-of-box voices with leading voice variety in terms of a large portfolio of languages and voices. Custom neural voice is an easy-to-use self-service for creating a highly natural custom voice. For details on the two features and voice samples, see Text-to-Speech overview.

When enabling this functionality in your game, keep in mind the following benefits:

- Voices and languages supported - A large portfolio of languages and variants are supported. For a complete list of voices, see the prebuilt neural voice and custom neural voice. You can also specify multiple languages for Text-to-Speech output. For details, see how to adjust speaking languages. For custom neural voice, you can select to create different languages from single language training data.
- Emotional styles supported - Emotional tones, such as cheerful, angry, sad, excited, hopeful, friendly, unfriendly, terrified, shouting, and whispering. You can adjust the speaking style, style degree, and role at the sentence level.
- Low latency real-time speech synthesis supported - Use the Speech SDK to convert text to speech by using prebuilt neural voices or custom neural voices.
- Visemes supported - You can use visemes during real-time synthesizing to control the movement of 2D and 3D avatar models, so that the mouth movements are perfectly matched to synthetic speech.
Fine-tuning Text-to-Speech output with Speech Synthesis Markup Language (SSML) - With SSML, you can customize Text-to-Speech outputs, with richer voice tuning supports. For more details, see how to improve synthesis with SSML.
- Audio outputs - There is a list of supported audio formats. Each incorporates a bitrate and encoding type. Each prebuilt neural voice model is available at 24kHz and high-fidelity 48kHz. If you select 48kHz output format, the high-fidelity voice model with 48kHz will be invoked accordingly. The sample rates other than 24kHz and 48kHz can be obtained through upsampling or downsampling when synthesizing, for example, 44.1kHz is downsampled from 48kHz. For more tech details on 48kHz high-quality voices, see this introduction blog.
Regions supported - For information about regional availability, see the regions topic.

## Speech-to-text

You can use speech-to-text to display text from the spoken audio in your game. 

## Language identification

Language identification can detect the language of the chat string submitted by the player.

## Speech translation

It's not unusual that players in the same game session natively speak different languages and may appreciate receiving both the original message and its translation.



## Next steps

* [Text-to-speech quickstart](get-started-text-to-speech.md)
* [Get facial position with viseme](how-to-speech-synthesis-viseme.md)
* [Speech-to-text quickstart](get-started-speech-to-text.md)
* [Speech translation quickstart](get-started-speech-translation.md)