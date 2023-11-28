---
title: Game development with Azure AI Speech - Speech service
titleSuffix: Azure AI services
description: Concepts for game development with Azure AI Speech.
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 01/25/2023
ms.author: eur
---

# Game development with Azure AI Speech

Azure AI services for Speech can be used to improve various gaming scenarios, both in- and out-of-game. 

Here are a few Speech features to consider for flexible and interactive game experiences:

- Bring everyone into the conversation by synthesizing audio from text. Or by displaying text from audio.
- Make the game more accessible for players who are unable to read text in a particular language, including young players who haven't learned to read and write. Players can listen to storylines and instructions in their preferred language. 
- Create game avatars and non-playable characters (NPC) that can initiate or participate in a conversation in-game. 
- Prebuilt neural voice can provide highly natural out-of-box voices with leading voice variety in terms of a large portfolio of languages and voices. 
- Custom neural voice for creating a voice that stays on-brand with consistent quality and speaking style. You can add emotions, accents, nuances, laughter, and other para linguistic sounds and expressions. 
- Use game dialogue prototyping to shorten the amount of time and money spent in product to get the game to market sooner. You can rapidly swap lines of dialog and listen to variations in real-time to iterate the game content.

You can use the [Speech SDK](speech-sdk.md) or [Speech CLI](spx-overview.md) for real-time low latency speech to text, text to speech, language identification, and speech translation. You can also use the [Batch transcription API](batch-transcription.md) to transcribe pre-recorded speech to text. To synthesize a large volume of text input (long and short) to speech, use the [Batch synthesis API](batch-synthesis.md).

For information about locale and regional availability, see [Language and voice support](language-support.md) and [Region support](regions.md).

## Text to speech

Help bring everyone into the conversation by converting text messages to audio using [Text to speech](text-to-speech.md) for scenarios, such as game dialogue prototyping, greater accessibility, or non-playable character (NPC) voices. Text to speech includes [prebuilt neural voice](language-support.md?tabs=tts#prebuilt-neural-voices) and [custom neural voice](language-support.md?tabs=tts#custom-neural-voice) features. Prebuilt neural voice can provide highly natural out-of-box voices with leading voice variety in terms of a large portfolio of languages and voices. Custom neural voice is an easy-to-use self-service for creating a highly natural custom voice. 

When enabling this functionality in your game, keep in mind the following benefits:

- Voices and languages supported - A large portfolio of [locales and voices](language-support.md?tabs=tts#supported-languages) are supported. You can also [specify multiple languages](speech-synthesis-markup-voice.md#adjust-speaking-languages) for Text to speech output. For [custom neural voice](custom-neural-voice.md), you can [choose to create](how-to-custom-voice-create-voice.md?tabs=neural#choose-a-training-method) different languages from single language training data.
- Emotional styles supported - [Emotional tones](language-support.md?tabs=tts#voice-styles-and-roles), such as cheerful, angry, sad, excited, hopeful, friendly, unfriendly, terrified, shouting, and whispering. You can [adjust the speaking style](speech-synthesis-markup-voice.md#use-speaking-styles-and-roles), style degree, and role at the sentence level.
- Visemes supported - You can use visemes during real-time synthesizing to control the movement of 2D and 3D avatar models, so that the mouth movements are perfectly matched to synthetic speech. For more information, see [Get facial position with viseme](how-to-speech-synthesis-viseme.md).
- Fine-tuning Text to speech output with Speech Synthesis Markup Language (SSML) - With SSML, you can customize Text to speech outputs, with richer voice tuning supports. For more information, see [Speech Synthesis Markup Language (SSML) overview](speech-synthesis-markup.md).
- Audio outputs - Each prebuilt neural voice model is available at 24 kHz and high-fidelity 48 kHz. If you select 48-kHz output format, the high-fidelity voice model with 48 kHz will be invoked accordingly. The sample rates other than 24 kHz and 48 kHz can be obtained through upsampling or downsampling when synthesizing. For example, 44.1 kHz is downsampled from 48 kHz. Each audio format incorporates a bitrate and encoding type. For more information, see the [supported audio formats](rest-text-to-speech.md?tabs=streaming#audio-outputs). For more information on 48-kHz high-quality voices, see [this introduction blog](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/azure-neural-tts-voices-upgraded-to-48khz-with-hifinet2-vocoder/ba-p/3665252).  

For an example, see the [Text to speech quickstart](get-started-text-to-speech.md).

## Speech to text

You can use [speech to text](speech-to-text.md) to display text from the spoken audio in your game. For an example, see the [Speech to text quickstart](get-started-speech-to-text.md).

## Language identification

With [language identification](language-identification.md), you can detect the language of the chat string submitted by the player.

## Speech translation

It's not unusual that players in the same game session natively speak different languages and may appreciate receiving both the original message and its translation. You can use [speech translation](speech-translation.md) to translate text between languages so players across the world can communicate with each other in their native language.

For an example, see the [Speech translation quickstart](get-started-speech-translation.md).

> [!NOTE]
> Besides the Speech service, you can also use the [Translator service](../translator/translator-overview.md). To execute text translation between supported source and target languages in real-time see [Text translation](../translator/text-translation-overview.md). 

## Next steps

* [Azure gaming documentation](/gaming/azure/)
* [Text to speech quickstart](get-started-text-to-speech.md)
* [Speech to text quickstart](get-started-speech-to-text.md)
* [Speech translation quickstart](get-started-speech-translation.md)
