---
title: Speech Synthesis Markup Language (SSML) overview - Speech service
titleSuffix: Azure AI services
description: Learn how to use the Speech Synthesis Markup Language to control pronunciation and prosody in text to speech.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 8/16/2023
ms.author: eur
---

# Speech Synthesis Markup Language (SSML) overview

Speech Synthesis Markup Language (SSML) is an XML-based markup language that you can use to fine-tune your text to speech output attributes such as pitch, pronunciation, speaking rate, volume, and more. It gives you more control and flexibility than plain text input. 

> [!TIP]
> You can hear voices in different styles and pitches reading example text by using the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery).

## Use case scenarios

SSML is designed to give you flexibility in how you want your speech output to sound, and it provides different properties for how you can customize that output. You can use SSML to:

- [Define the input text structure](speech-synthesis-markup-structure.md) that determines the structure, content, and other characteristics of your text to speech output. For example, you can use SSML to define a paragraph, a sentence, a break or a pause, or silence. You can wrap text with event tags, like a bookmark or viseme, that your application can process later. A viseme is the visual description of a phoneme, the individual speech sounds, in spoken language.
- [Choose the voice](speech-synthesis-markup-voice.md), language, name, style, and role. You can use multiple voices in a single SSML document. You can also adjust the emphasis, speaking rate, pitch, and volume. SSML can also insert prerecorded audio, such as a sound effect or a musical note.
- [Control pronunciation](speech-synthesis-markup-pronunciation.md) of the output audio. For example, you can use SSML with phonemes and a custom lexicon to improve pronunciation. You can also use SSML to define how a word or mathematical expression is pronounced.

## Ways to work with SSML

SSML functionality is available in various tools that might fit your use case.

> [!IMPORTANT]
> You're billed for each character that's converted to speech, including punctuation. Although the SSML document itself isn't billable, the service counts optional elements that you use to adjust how the text is converted to speech, like phonemes and pitch, as billable characters. For more information, see [Pricing note](text-to-speech.md#pricing-note).

You can use SSML in the following ways:

- [The Audio Content Creation](https://aka.ms/audiocontentcreation) tool lets you author plain text and SSML in Speech Studio. You can listen to the output audio and adjust the SSML to improve speech synthesis. For more information, see [Speech synthesis with the Audio Content Creation tool](how-to-audio-content-creation.md).
- [The Batch synthesis API](batch-synthesis.md) accepts SSML via the `inputs` property. 
- [The Speech CLI](get-started-text-to-speech.md?pivots=programming-language-cli) accepts SSML via the `spx synthesize --ssml SSML` command line argument.
- [The Speech SDK](how-to-speech-synthesis.md#use-ssml-to-customize-speech-characteristics) accepts SSML via the "speak" SSML method across the different supported languages.

## Next steps

- [SSML document structure and events](speech-synthesis-markup-structure.md)
- [Voice and sound with SSML](speech-synthesis-markup-voice.md)
- [Pronunciation with SSML](speech-synthesis-markup-pronunciation.md)
- [Language and voice support for the Speech service](language-support.md?tabs=tts)
