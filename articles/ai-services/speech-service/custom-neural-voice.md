---
title: Custom Neural Voice overview - Speech service
titleSuffix: Azure AI services
description: Custom Neural Voice is a text to speech feature that allows you to create a one-of-a-kind, customized, synthetic voice for your applications. You provide your own audio data as a sample.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 03/27/2023
ms.author: eur
---

# What is Custom Neural Voice?

Custom Neural Voice (CNV) is a text to speech feature that lets you create a one-of-a-kind, customized, synthetic voice for your applications. With Custom Neural Voice, you can build a highly natural-sounding voice for your brand or characters by providing human speech samples as training data.

> [!IMPORTANT]
> Custom Neural Voice access is [limited](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) based on eligibility and usage criteria. Request access on the [intake form](https://aka.ms/customneural).
> 
> Access to [Custom Neural Voice (CNV) Lite](custom-neural-voice-lite.md) is available for anyone to demo and evaluate CNV before investing in professional recordings to create a higher-quality voice. 

Out of the box, [text to speech](text-to-speech.md) can be used with prebuilt neural voices for each [supported language](language-support.md?tabs=tts). The prebuilt neural voices work very well in most text to speech scenarios if a unique voice isn't required.

Custom Neural Voice is based on the neural text to speech technology and the multilingual, multi-speaker, universal model. You can create synthetic voices that are rich in speaking styles, or adaptable cross languages. The realistic and natural sounding voice of Custom Neural Voice can represent brands, personify machines, and allow users to interact with applications conversationally. See the [supported languages](language-support.md?tabs=tts) for Custom Neural Voice.

## How does it work?

To create a custom neural voice, use [Speech Studio](https://aka.ms/speechstudio/customvoice) to upload the recorded audio and corresponding scripts, train the model, and deploy the voice to a custom endpoint. 

> [!TIP]
> Try [Custom Neural Voice (CNV) Lite](custom-neural-voice-lite.md) to demo and evaluate CNV before investing in professional recordings to create a higher-quality voice. 

Creating a great custom neural voice requires careful quality control in each step, from voice design and data preparation, to the deployment of the voice model to your system. 

Before you get started in Speech Studio, here are some considerations:

- [Design a persona](record-custom-voice-samples.md#choose-your-voice-talent) of the voice that represents your brand by using a persona brief document. This document defines elements such as the features of the voice, and the character behind the voice. This helps to guide the process of creating a custom neural voice model, including defining the scripts, selecting your voice talent, training, and voice tuning.
- [Select the recording script](record-custom-voice-samples.md#script-selection-criteria) to represent the user scenarios for your voice. For example, you can use the phrases from bot conversations as your recording script if you're creating a customer service bot. Include different sentence types in your scripts, including statements, questions, and exclamations.

Here's an overview of the steps to create a custom neural voice in Speech Studio:

1. [Create a project](how-to-custom-voice.md) to contain your data, voice models, tests, and endpoints. Each project is specific to a country/region and language. If you are going to create multiple voices, it's recommended that you create a project for each voice.
1. [Set up voice talent](how-to-custom-voice.md). Before you can train a neural voice, you must submit a recording of the voice talent's consent statement. The voice talent statement is a recording of the voice talent reading a statement that they consent to the usage of their speech data to train a custom voice model.
1. [Prepare training data](how-to-custom-voice-prepare-data.md) in the right [format](how-to-custom-voice-training-data.md). It's a good idea to capture the audio recordings in a professional quality recording studio to achieve a high signal-to-noise ratio. The quality of the voice model depends heavily on your training data. Consistent volume, speaking rate, pitch, and consistency in expressive mannerisms of speech are required.
1. [Train your voice model](how-to-custom-voice-create-voice.md). Select at least 300 utterances to create a custom neural voice. A series of data quality checks are automatically performed when you upload them. To build high-quality voice models, you should fix any errors and submit again.
1. [Test your voice](how-to-custom-voice-create-voice.md#test-your-voice-model). Prepare test scripts for your voice model that cover the different use cases for your apps. It’s a good idea to use scripts within and outside the training dataset, so you can test the quality more broadly for different content.
1. [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md) in your apps.

You can tune, adjust, and use your custom voice, similarly as you would use a prebuilt neural voice. Convert text into speech in real-time, or generate audio content offline with text input. You can do this by using the [REST API](./rest-text-to-speech.md), the [Speech SDK](./get-started-text-to-speech.md), or the [Speech Studio](https://speech.microsoft.com/audiocontentcreation).

The style and the characteristics of the trained voice model depend on the style and the quality of the recordings from the voice talent used for training. However, you can make several adjustments by using [SSML (Speech Synthesis Markup Language)](./speech-synthesis-markup.md?tabs=csharp) when you make the API calls to your voice model to generate synthetic speech. SSML is the markup language used to communicate with the text to speech service to convert text into audio. The adjustments you can make include change of pitch, rate, intonation, and pronunciation correction. If the voice model is built with multiple styles, you can also use SSML to switch the styles.

## Components sequence

Custom Neural Voice consists of three major components: the text analyzer, the neural acoustic
model, and the neural vocoder. To generate natural synthetic speech from text, text is first input into the text analyzer, which provides output in the form of phoneme sequence. A *phoneme* is a basic unit of sound that distinguishes one word from another in a particular language. A sequence of phonemes defines the pronunciations of the words provided in the text.

Next, the phoneme sequence goes into the neural acoustic model to predict acoustic features that define speech signals. Acoustic features include the timbre, the speaking style, speed, intonations, and stress patterns. Finally, the neural vocoder converts the acoustic features into audible waves, so that synthetic speech is generated.

![Flowchart that shows the components of Custom Neural Voice.](./media/custom-voice/cnv-intro.png)

Neural text to speech voice models are trained by using deep neural networks based on
the recording samples of human voices. For more information, see [this Microsoft blog post](https://techcommunity.microsoft.com/t5/azure-ai/neural-text-to-speech-extends-support-to-15-more-languages-with/ba-p/1505911). To learn more about how a neural vocoder is trained, see [this Microsoft blog post](https://techcommunity.microsoft.com/t5/azure-ai/azure-neural-tts-upgraded-with-hifinet-achieving-higher-audio/ba-p/1847860).

## Migrate to Custom Neural Voice

If you're using the old version of Custom Voice (which is scheduled to be retired in February 2024), see [How to migrate to Custom Neural Voice](how-to-migrate-to-custom-neural-voice.md).

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the transparency notes to learn about responsible AI use and deployment in your systems. 

* [Transparency note and use cases for Custom Neural Voice](/legal/cognitive-services/speech-service/custom-neural-voice/transparency-note-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)  
* [Characteristics and limitations for using Custom Neural Voice](/legal/cognitive-services/speech-service/custom-neural-voice/characteristics-and-limitations-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)   
* [Limited access to Custom Neural Voice](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=/azure/ai-services/speech-service/context/context) 
* [Guidelines for responsible deployment of synthetic voice technology](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-guidelines-responsible-deployment-synthetic?context=/azure/ai-services/speech-service/context/context)   
* [Disclosure for voice talent](/legal/cognitive-services/speech-service/disclosure-voice-talent?context=/azure/ai-services/speech-service/context/context)   
* [Disclosure design guidelines](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-disclosure-guidelines?context=/azure/ai-services/speech-service/context/context)   
* [Disclosure design patterns](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-disclosure-patterns?context=/azure/ai-services/speech-service/context/context)   
* [Code of Conduct for Text to speech integrations](/legal/cognitive-services/speech-service/tts-code-of-conduct?context=/azure/ai-services/speech-service/context/context)   
* [Data, privacy, and security for Custom Neural Voice](/legal/cognitive-services/speech-service/custom-neural-voice/data-privacy-security-custom-neural-voice?context=/azure/ai-services/speech-service/context/context)

## Next steps

* [Create a project](how-to-custom-voice.md) 
* [Prepare training data](how-to-custom-voice-prepare-data.md)
* [Train model](how-to-custom-voice-create-voice.md)
