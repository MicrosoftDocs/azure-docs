---
title: Sample for Speech-to-Text | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: Here is a sample for speech-to-text.
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 06/07/2018
ms.author: wolfma
---

# Sample for Speech-to-Text

> [!NOTE]
> For instructions to download this sample and others, see [Samples for Speech SDK](samples.md).

[!include[Get a Subscription Key](includes/get-subscription-key.md)]

> [!NOTE]
> For all samples below, the following top-level declarations should be in place:
>
> [!code-csharp[](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs#toplevel)]
>
> [!code-cpp[](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp#toplevel)]
>
> - - -

## Speech recognition using the microphone

The code snippet below shows how to recognize speech input from the microphone in the default language (`en-US`).

[!code-csharp[Speech Recognition Using Microphone](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs#recognitionWithMicrophone)]

[!code-cpp[Speech Recognition Using Microphone](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp#SpeechRecognitionWithMicrophone)]

- - -

## Speech recognition from a file

The following code snippet recognizes speech input from an audio file in the default language (`en-US`), the supported format is single-channel (mono) WAV / PCM with a sampling rate of 16 KHz.

[!include[Sample Audio](includes/sample-audio.md)]

[!code-csharp[Speech Recognition From a File](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs?name=recognitionFromFile)]

[!code-cpp[Speech Recognition From a File](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp?name=SpeechRecognitionWithFile)]

- - -

## Speech recognition using a customized model

The [Custom Speech Service (CRIS)](https://www.cris.ai/) allows the customization of the Microsoft's speech-to-text engine for your application. The snippet below shows how to recognize speech from a microphone using your CRIS model; fill in your CRIS subscription key and your own deployment identification before running it.

[!code-csharp[Speech Recognition Using a Customized Model](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs#recognitionCustomized)]

[!code-cpp[Speech Recognition Using a Customized Model](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp#SpeechRecognitionUsingCustomizedModel)]

- - -

## Continuous speech recognition

[!code-csharp[Continuous Speech Recognition](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs#recognitionContinuous)]

[!code-cpp[Continuous Speech Recognition](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp#SpeechContinuousRecognitionUsingEvents)]

- - -

## Sample source code

The latest version of the samples and even more advanced samples are in a dedicated [GitHub repository](https://github.com/Azure-Samples/cognitive-services-speech-sdk).

## Next steps

- [Intent Recognition](./intent.md)

- [Translation](./translation.md)
