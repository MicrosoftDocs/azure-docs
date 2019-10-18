---
title: Long Audio API - Speech Service
titleSuffix: Azure Cognitive Services
description:
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/26/2019
ms.author: erhopf
---

# Long Audio API

As the name implies, the Long Audio API is designed for batch synthesis of long-form text to speech. This API doesn't return synthesized audio in real-time, instead the expectation is that you will poll for the response(s) and consume the output(s) as they are made available from the service. Unlike the text to speech API that's used by the Speech SDK, the Long Audio API can create synthesized audio longer than 10 minutes, making it ideal for publishers and audio content platforms.

Additional benefits of the Long Audio API:

* Synthesized speech returned by the service uses neural voices, which ensures high-fidelity audio outputs.
* Since real-time responses aren't supported, there's no need to deploy a voice endpoint.

## Workflow

Typically, when using the Long Audio API, you'll submit a text file or files to be synthesized, poll for the status, then if the status is successful, you can download the audio output.

This diagram provides a high-level overview of the workflow.

![Long Audio API workflow diagram](media/long-audio-api/long-audio-api-workflow.png)

## Prepare content for synthesis

When preparing your text file, make sure it:

* Is either plain text (.txt) or SSML text (.txt)
  * For plain text, each paragraph is separated by hitting **Enter/Return** - View [plain text input example](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/en-US.txt)
  * For SSML text, each SSML piece is considered a paragraph. SSML pieces shall be separated by different paragraphs - View [SSML text input example](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/SSMLTextInputSample.txt). For language code, see [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md)
* Is encoded as [UTF-8 with Byte Order Mark (BOM)](https://www.w3.org/International/questions/qa-utf8-bom.en#bom)
* Contains more than 10,000 characters or more than 50 paragraphs
* Is a single file, not a zip

## Audio output formats

The following audio output formats are supported by the Long Audio API:

> [!NOTE]
> The default audio format is riff-16khz-16bit-mono-pcm.

* riff-8khz-16bit-mono-pcm
* riff-16khz-16bit-mono-pcm
* riff-24khz-16bit-mono-pcm
* riff-48khz-16bit-mono-pcm
* audio-16khz-32kbitrate-mono-mp3
* audio-16khz-64kbitrate-mono-mp3
* audio-16khz-128kbitrate-mono-mp3
* audio-24khz-48kbitrate-mono-mp3
* audio-24khz-96kbitrate-mono-mp3
* audio-24khz-160kbitrate-mono-mp3

## Get started with Long Audio API

We offer quickstarts designed to help you run the Long Audio API successfully. This table includes a list of Long Audio API quickstarts organized by language.
* [Quickstart: Python](https://aka.ms/long-audio-python)
* [Quickstart: C#](https://aka.ms/long-audio-csharp)
* [Quickstart: Java](https://aka.ms/long-audio-java)

## Sample code
Sample code for Long Audio API is available on GitHub. 
* [Sample code: Python](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/CustomVoice-API-Samples/Python)
* [Sample code: C#](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/CustomVoice-API-Samples/CSharp)
* [Sample code: Java](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/)

## See also

* [Long Audio API reference](https://aka.ms/long-audio-ref)
