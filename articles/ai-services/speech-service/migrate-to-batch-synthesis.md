---
title: Migrate to Batch synthesis API - Speech service
titleSuffix: Azure AI services
description: This document helps developers migrate code from Long Audio REST API to Batch synthesis REST API.
services: cognitive-services
author: heikora
manager: dongli
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 09/01/2022
ms.author: heikora
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Migrate code from Long Audio API to Batch synthesis API

The [Batch synthesis API](batch-synthesis.md) (Preview) provides asynchronous synthesis of long-form text to speech. Benefits of upgrading from Long Audio API to Batch synthesis API, and details about how to do so, are described in the sections below.

> [!IMPORTANT]
> [Batch synthesis API](batch-synthesis.md) is currently in public preview. Once it's generally available, the Long Audio API will be deprecated.

## Base path

You must update the base path in your code from `/texttospeech/v3.0/longaudiosynthesis` to `/texttospeech/3.1-preview1/batchsynthesis`. For example, to list synthesis jobs for your Speech resource in the `eastus` region, use `https://eastus.customvoice.api.speech.microsoft.com/api/texttospeech/3.1-preview1/batchsynthesis` instead of `https://eastus.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis`.

## Regions and endpoints

Batch synthesis API is available in all [Speech regions](regions.md).

The Long Audio API is limited to the following regions:

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.customvoice.api.speech.microsoft.com` |
| East US | `https://eastus.customvoice.api.speech.microsoft.com` |
| India Central | `https://centralindia.customvoice.api.speech.microsoft.com` |
| South Central US | `https://southcentralus.customvoice.api.speech.microsoft.com` |
| Southeast Asia | `https://southeastasia.customvoice.api.speech.microsoft.com` |
| UK South | `https://uksouth.customvoice.api.speech.microsoft.com` |
| West Europe | `https://westeurope.customvoice.api.speech.microsoft.com` |

## Voices list

Batch synthesis API supports all [text to speech voices and styles](language-support.md?tabs=tts).

The Long Audio API is limited to the set of voices returned by a GET request to `https://<endpoint>/api/texttospeech/v3.0/longaudiosynthesis/voices`.

## Text inputs

Batch synthesis text inputs are sent in a JSON payload of up to 500 kilobytes. 

Long Audio API text inputs are uploaded from a file that meets the following requirements:
* One plain text (.txt) or SSML text (.txt) file encoded as [UTF-8 with Byte Order Mark (BOM)](https://www.w3.org/International/questions/qa-utf8-bom.en#bom). Don't use compressed files such as ZIP. If you have more than one input file, you must submit multiple requests.
* Contains more than 400 characters for plain text or 400 [billable characters](./text-to-speech.md#pricing-note) for SSML text, and less than 10,000 paragraphs. For plain text, each paragraph is separated by a new line. For SSML text, each SSML piece is considered a paragraph. Separate SSML pieces by different paragraphs.

With Batch synthesis API, you can use any of the [supported SSML elements](speech-synthesis-markup.md), including the `audio`, `mstts:backgroundaudio`, and `lexicon` elements. The `audio`, `mstts:backgroundaudio`, and `lexicon` elements aren't supported by Long Audio API.

## Audio output formats

Batch synthesis API supports all [text to speech audio output formats](rest-text-to-speech.md#audio-outputs).

The Long Audio API is limited to the following set of audio output formats. The sample rate for long audio voices is 24kHz, not 48kHz. Other sample rates can be obtained through upsampling or downsampling when synthesizing.

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

## Getting results

With batch synthesis API, use the URL from the `outputs.result` property of the GET batch synthesis response. The [results](batch-synthesis.md#batch-synthesis-results) are in a ZIP file that contains the audio (such as `0001.wav`), summary, and debug details. 

Long Audio API text inputs and results are returned via two separate content URLs as shown in the following example. The one with `"kind": "LongAudioSynthesisScript"` is the input script submitted. The other one with `"kind": "LongAudioSynthesisResult"` is the result of this request. Both ZIP files can be downloaded from the URL in their `links.contentUrl` property.

## Cleaning up resources

Batch synthesis API supports up to 200 batch synthesis jobs that don't have a status of "Succeeded" or "Failed". The Speech service will keep each synthesis history for up to 31 days, or the duration of the request `timeToLive` property, whichever comes sooner. The date and time of automatic deletion (for synthesis jobs with a status of "Succeeded" or "Failed") is equal to the `lastActionDateTime` + `timeToLive` properties.

The Long Audio API is limited to 20,000 requests for each Azure subscription account. The Speech service doesn't remove job history automatically. You must remove the previous job run history before making new requests that would otherwise exceed the limit.   

## Next steps

- [Batch synthesis API](batch-synthesis.md)
- [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md)
- [Text to speech quickstart](get-started-text-to-speech.md)
