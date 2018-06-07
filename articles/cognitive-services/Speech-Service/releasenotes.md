---
title: Cognitive Services Speech SDK Documentation | Microsoft Docs
description: Release notes - what has changed in the most recent releases
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 06/07/2018
ms.author: wolfma
---

# Release Notes

## Cognitive Services Speech SDK 0.4.0 - Release 2018-June

**Functional Changes**

- AudioInputStream

  A recognizer can now consume a stream as the audio source. For detailed information, see the [documentation](https://aka.ms/csspeech) under the section **How-to guides**.

- Detailed Output Format

  While creating a `SpeechRecognizer`, you can request `Detailed` or `Simple` output format. The `DetailedSpeechRecognitionResult` contains a confidence score, recognized text, raw lexical form, normalized form, and normalized form with masked profanity.

**Breaking Change**

- Change to `SpeechRecognitionResult.Text` from `SpeechRecognitionResult.RecognizedText` in C#.

**Bug fixes**

- Fix a possible callback issue in USP layer during shutdown.

- If a recognizer consumed an audio input file, it was holding on to the file handle longer than necessary.

- Removed several deadlocks between message pump and recognizer.

- Fire a `nomatch` result when the response from service is timed out.

- The media foundation libraries on Windows are delay-loaded. This library is only required for microphone input.

- The upload speed for audio data is limited to about twice the original audio speed.

- File name changes (casing changes) for the java binding library (for the speech DDK).

- On Windows, C# .NET assemblies are now strong-named.

- Documentation fix

  `Region` is required information to create a recognizer.

More samples have been added and are constantly being updated. For the latest set of samples, see the [Speech SDK Sample GitHub repository](https://aka.ms/csspeech/samples).


## Cognitive Services Speech SDK 0.2.12733 - Release 2018-May

The first public preview release of the Cognitive Services Speech SDK.
