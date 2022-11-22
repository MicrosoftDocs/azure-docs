---
title: Speech Synthesis Markup Language (SSML) overview - Speech service
titleSuffix: Azure Cognitive Services
description: Use the Speech Synthesis Markup Language to control pronunciation and prosody in text-to-speech.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/21/2022
ms.author: eur
---

# Speech Synthesis Markup Language (SSML) overview

Speech Synthesis Markup Language (SSML) is an XML-based markup language that can be used to fine-tune the text-to-speech output attributes such as pitch, pronunciation, speaking rate, volume, and more. You have more control and flexibility compared to plain text input. The Speech service automatically handles punctuation as appropriate, such as pausing after a period, or using the correct intonation when a sentence ends with a question mark.

> [!IMPORTANT]
> You're billed for each character that's converted to speech, including punctuation. Although the SSML document itself is not billable, optional elements that are used to adjust how the text is converted to speech, like phonemes and pitch, are counted as billable characters. For more information, see [text-to-speech pricing notes](text-to-speech.md#pricing-note).

Speech SDK

Batch synthesis API

Author plain text and SSML using the [Audio Content Creation](https://aka.ms/audiocontentcreation) tool in Speech Studio. You can listen to the output audio and adjust the SSML to improve speech synthesis. For more information, see [Speech synthesis with the Audio Content Creation tool](how-to-audio-content-creation.md).

You can hear voices in different styles and pitches reading example text by using this [text-to-speech website](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).

## Scenarios


### Structure including paragraphs

Supported SSML elements and syntax
Paragraphs and sentences
Special characters
Add or remove a break or pause
Add silence
Events such as viseme (things you don't "hear" in the output audio)
- Bookmark element
- Viseme element


### Voice, style, pitch, volume, background audio (what)

Choose a voice
Use multiple voices
Adjust speaking styles
Adjust speaking languages
Adjust prosody
Adjust emphasis
Add recorded audio
Add background audio

### Pronunciation including say-as and MathML (how)

Use phonemes to improve pronunciation
Use custom lexicon to improve pronunciation
Add say-as element
Supported MathML elements


## Next steps

- [How to synthesize speech](how-to-speech-synthesis.md)
- [Language support: Voices, locales, languages](language-support.md?tabs=stt-tts)
