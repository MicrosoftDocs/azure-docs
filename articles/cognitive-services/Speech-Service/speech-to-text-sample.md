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
ms.date: 05/07/2018
ms.author: wolfma
---

# Sample for Speech-to-Text

> [!NOTE]
> For instructions to download this sample and others, see [Samples for Speech SDK](samples.md).

[!include[Get a Subscription Key](includes/get-subscription-key.md)]

> [!NOTE]
> For all samples below, we assume the following top-level declarations are in place:
>
> [!code-csharp[](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs#toplevel)]
>
> [!code-cpp[](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp#toplevel)]
>
> - - -

## Speech Recognition Using Microphone

The code snippet below shows how to recognize speech input from the microphone in the default language (`en-US`).

[!code-csharp[Speech Recognition Using Microphone](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs#recognitionWithMicrophone)]

[!code-cpp[Speech Recognition Using Microphone](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp#SpeechRecognitionWithMicrophone)]

- - -

## Speech Recognition From a File

The code snippet below shows how to recognize speech input from a file in the default language (`en-US`),
using the factory's `CreateSpeechRecognizerWithFileInput` member function.
The audio format needs to be WAV / PCM with a single channel (mono) and 16 KHz sampling rate.

[!include[Sample Audio](includes/sample-audio.md)]

[!code-csharp[Speech Recognition From a File](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs?name=recognitionFromFile)]

[!code-cpp[Speech Recognition From a File](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp?name=SpeechRecognitionWithFile)]

- - -

## Speech Recognition Using a Customized Model

The [Custom Speech Service (CRIS)](https://www.cris.ai/) allows to customize Microsoft's speech-to-text engine for your application.
The snippet below shows how to recognize speech from a microphone using your CRIS model;
fill in your CRIS subscription key and your own deployment ID before running it.

[!code-csharp[Speech Recognition Using a Customized Model](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs#recognitionCustomized)]

[!code-cpp[Speech Recognition Using a Customized Model](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp#SpeechRecognitionUsingCustomizedModel)]

- - -

## Continuous Speech Recognition

[!code-csharp[Continuous Speech Recognition](~/samples-cognitive-services-speech-sdk/Windows/csharp_samples/speech_recognition_samples.cs#recognitionContinuous)]

[!code-cpp[Continuous Speech Recognition](~/samples-cognitive-services-speech-sdk/Windows/cxx_samples/speech_recognition_samples.cpp#SpeechContinuousRecognitionUsingEvents)]

- - -

## Downloading the sample

The samples in this article are contained in the sample package; please download from [here](https://aka.ms/csspeech/winsample).

## Next steps

- [Intent Recognition](./intent.md)

- [Translation](./translation.md)
