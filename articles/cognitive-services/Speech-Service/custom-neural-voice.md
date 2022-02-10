---
title: Custom Neural Voice overview - Speech service
titleSuffix: Azure Cognitive Services
description: Custom Neural Voice is a text-to-speech feature that allows you to create a one-of-a-kind, customized, synthetic voice for your applications. You provide your own audio data as a sample.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/23/2022
ms.author: eur
---

# What is Custom Neural Voice?

Custom Neural Voice is a text-to-speech feature that lets you create a one-of-a-kind, customized, synthetic voice for your applications. With Custom Neural Voice, you can build a highly natural-sounding voice by providing your audio samples as training data.

Based on the neural text-to-speech technology and the multilingual, multi-speaker, universal model, Custom Neural Voice lets you create synthetic voices that are rich in speaking styles, or adaptable cross languages. The realistic and natural sounding voice of Custom Neural Voice can represent brands, personify machines, and allow users to interact with applications conversationally. See the [supported languages](language-support.md#custom-neural-voice) for Custom Neural Voice.

> [!NOTE]
> Custom Neural Voice requires registration, and access to it is limited based on eligibility and use criteria. To use this feature, register your use cases by using the [intake form](https://aka.ms/customneural).

## The basics of Custom Neural Voice

Custom Neural Voice consists of three major components: the text analyzer, the neural acoustic
model, and the neural vocoder. To generate natural synthetic speech from text, text is first input into the text analyzer, which provides output in the form of phoneme sequence. A *phoneme* is a basic unit of sound that distinguishes one word from another in a particular language. A sequence of phonemes defines the pronunciations of the words provided in the text.

Next, the phoneme sequence goes into the neural acoustic model to predict acoustic features that define speech signals. Acoustic features include the timbre, the speaking style, speed, intonations, and stress patterns. Finally, the neural vocoder converts the acoustic features into audible waves, so that synthetic speech is generated.

![Flowchart that shows the components of Custom Neural Voice.](./media/custom-voice/cnv-intro.png)

Neural text-to-speech voice models are trained by using deep neural networks based on
the recording samples of human voices. For more information, see [this Microsoft blog post](https://techcommunity.microsoft.com/t5/azure-ai/neural-text-to-speech-extends-support-to-15-more-languages-with/ba-p/1505911). To learn more about how a neural vocoder is trained, see [this Microsoft blog post](https://techcommunity.microsoft.com/t5/azure-ai/azure-neural-tts-upgraded-with-hifinet-achieving-higher-audio/ba-p/1847860).

You can adapt the neural text-to-speech engine to fit your needs. To create a custom neural voice, use [Speech Studio](https://speech.microsoft.com/customvoice) to upload the recorded audio and corresponding scripts, train the model, and deploy the voice to a custom endpoint. Custom Neural Voice can use text provided by the user to convert text into speech in real time, or generate audio content offline with text input. You can do this by using the [REST API](./rest-text-to-speech.md), the [Speech SDK](./get-started-text-to-speech.md), or the [web portal](https://speech.microsoft.com/audiocontentcreation).

## Get started

The following articles help you start using this feature:

* To get started with Custom Neural Voice and create a project, see [Get started with Custom Neural Voice](how-to-custom-voice.md).
* To prepare and upload your audio data, see [Prepare training data](how-to-custom-voice-prepare-data.md).
* To train and deploy your models, see [Create and use your voice model](how-to-custom-voice-create-voice.md).

## Terms and definitions

| **Term**      | **Definition**                                                                                                                                                                                                                                                                                                                                                                                       |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Voice model   | A text-to-speech model that can mimic the unique vocal characteristics of a target speaker. A *voice model* is also known as a *voice font* or *synthetic voice*. A voice model is a set of parameters in binary format that is not human readable and does not contain audio recordings. It can't be reverse engineered to derive or construct the audio of a human voice. |
| Voice talent  | Individuals or target speakers whose voices are recorded and used to create voice models. These voice models are intended to sound like the voice talent’s voice.|
| Standard text-to-speech  | The standard, or "traditional," method of text-to-speech. This method breaks down spoken language into phonetic snippets so that they can be remixed and matched by using classical programming or statistical methods.|
| Neural text-to-speech    | This method synthesizes speech by using deep neural networks. These networks have "learned" the way phonetics are combined in natural human speech, rather than using procedural programming or statistical methods. In addition to the recordings of a target voice talent, neural text-to-speech uses a source library or base model that is built with voice recordings from many different speakers.          |
| Training data | A Custom Neural Voice training dataset that includes the audio recordings of the voice talent, and the associated text transcriptions.|
| Persona       | A persona describes who you want this voice to be. A good persona design will inform all voice creation. This might include choosing an available voice model already created, or starting from scratch by casting and recording a new voice talent.|
| Script        | A script is a text file that contains the utterances to be spoken by your voice talent. (The term *utterances* encompasses both full sentences and shorter phrases.)|

## Responsible use of AI

To learn how to use Custom Neural Voice responsibly, see the [transparency note](/legal/cognitive-services/speech-service/custom-neural-voice/transparency-note-custom-neural-voice?context=/azure/cognitive-services/speech-service/context/context). Transparency notes are intended to help you understand how the AI technology from Microsoft works, and the choices system owners can make that influence system performance and behavior. Transparency notes also discuss the importance of thinking about the whole system, including the technology, the people, and the environment.

## Next steps

> [!div class="nextstepaction"]
> [Get started with Custom Neural Voice](how-to-custom-voice.md)
