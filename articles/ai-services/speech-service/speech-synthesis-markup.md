---
title: Speech Synthesis Markup Language (SSML) overview - Speech service
titleSuffix: Azure AI services
description: Use the Speech Synthesis Markup Language to control pronunciation and prosody in text to speech.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/30/2022
ms.author: eur
---

# Speech Synthesis Markup Language (SSML) overview

Speech Synthesis Markup Language (SSML) is an XML-based markup language that can be used to fine-tune the text to speech output attributes such as pitch, pronunciation, speaking rate, volume, and more. You have more control and flexibility compared to plain text input. 

> [!TIP]
> You can hear voices in different styles and pitches reading example text via the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery).

## Scenarios

You can use SSML to:

- [Define the input text structure](speech-synthesis-markup-structure.md) that determines the structure, content, and other characteristics of the text to speech output. For example, you can use SSML to define a paragraph, a sentence, a break or a pause, or silence. You can wrap text with event tags such as bookmark or viseme that can be processed later by your application.
- [Choose the voice](speech-synthesis-markup-voice.md), language, name, style, and role. You can use multiple voices in a single SSML document. Adjust the emphasis, speaking rate, pitch, and volume. You can also use SSML to insert pre-recorded audio, such as a sound effect or a musical note.
- [Control pronunciation](speech-synthesis-markup-pronunciation.md) of the output audio. For example, you can use SSML with phonemes and a custom lexicon to improve pronunciation. You can also use SSML to define how a word or mathematical expression is pronounced.

## Use SSML

> [!IMPORTANT]
> You're billed for each character that's converted to speech, including punctuation. Although the SSML document itself is not billable, optional elements that are used to adjust how the text is converted to speech, like phonemes and pitch, are counted as billable characters. For more information, see [text to speech pricing notes](text-to-speech.md#pricing-note).

You can use SSML in the following ways:

- [Audio Content Creation](https://aka.ms/audiocontentcreation) tool: Author plain text and SSML in Speech Studio: You can listen to the output audio and adjust the SSML to improve speech synthesis. For more information, see [Speech synthesis with the Audio Content Creation tool](how-to-audio-content-creation.md).
- [Batch synthesis API](batch-synthesis.md): Provide SSML via the `inputs` property. 
- [Speech CLI](get-started-text-to-speech.md?pivots=programming-language-cli): Provide SSML via the `spx synthesize --ssml SSML` command line argument.
- [Speech SDK](how-to-speech-synthesis.md#use-ssml-to-customize-speech-characteristics): Provide SSML via the "speak" SSML method.

## Next steps

- [SSML document structure and events](speech-synthesis-markup-structure.md)
- [Voice and sound with SSML](speech-synthesis-markup-voice.md)
- [Pronunciation with SSML](speech-synthesis-markup-pronunciation.md)
- [Language support: Voices, locales, languages](language-support.md?tabs=tts)
