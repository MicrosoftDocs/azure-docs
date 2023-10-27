---
title: Text to speech API reference (REST) - Speech service
titleSuffix: Azure AI services
description: Learn how to use the REST API to convert text into synthesized speech.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: reference
ms.date: 01/24/2022
ms.author: eur
ms.custom: references_regions
---

# Text to speech REST API

The Speech service allows you to [convert text into synthesized speech](#convert-text-to-speech) and [get a list of supported voices](#get-a-list-of-voices) for a region by using a REST API. In this article, you'll learn about authorization options, query options, how to structure a request, and how to interpret a response.

> [!TIP]
> Use cases for the text to speech REST API are limited. Use it only in cases where you can't use the [Speech SDK](speech-sdk.md). For example, with the Speech SDK you can [subscribe to events](how-to-speech-synthesis.md#subscribe-to-synthesizer-events) for more insights about the text to speech processing and results.

The text to speech REST API supports neural text to speech voices, which support specific languages and dialects that are identified by locale. Each available endpoint is associated with a region. A Speech resource key for the endpoint or region that you plan to use is required. Here are links to more information:

- For a complete list of voices, see [Language and voice support for the Speech service](language-support.md?tabs=tts).
- For information about regional availability, see [Speech service supported regions](regions.md#speech-service).
- For Azure Government and Microsoft Azure operated by 21Vianet endpoints, see [this article about sovereign clouds](sovereign-clouds.md).

> [!IMPORTANT]
> Costs vary for prebuilt neural voices (called *Neural* on the pricing page) and custom neural voices (called *Custom Neural* on the pricing page). For more information, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Before you use the text to speech REST API, understand that you need to complete a token exchange as part of authentication to access the service. For more information, see [Authentication](#authentication).

## Get a list of voices

You can use the `tts.speech.microsoft.com/cognitiveservices/voices/list` endpoint to get a full list of voices for a specific region or endpoint. Prefix the voices list endpoint with a region to get a list of voices for that region. For example, to get a list of voices for the `westus` region, use the `https://westus.tts.speech.microsoft.com/cognitiveservices/voices/list` endpoint. For a list of all supported regions, see the [regions](regions.md) documentation.

> [!NOTE]
> [Voices and styles in preview](language-support.md?tabs=tts) are only available in three service regions: East US, West Europe, and Southeast Asia.

### Request headers

This table lists required and optional headers for text to speech requests:

| Header | Description | Required or optional |
|--------|-------------|---------------------|
| `Ocp-Apim-Subscription-Key` | Your Speech resource key. | Either this header or `Authorization` is required. |
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Either this header or `Ocp-Apim-Subscription-Key` is required. |

### Request body

A body isn't required for `GET` requests to this endpoint.

### Sample request

This request requires only an authorization header:

```http
GET /cognitiveservices/voices/list HTTP/1.1

Host: westus.tts.speech.microsoft.com
Ocp-Apim-Subscription-Key: YOUR_RESOURCE_KEY
```

Here's an example curl command:

```curl
curl --location --request GET 'https://YOUR_RESOURCE_REGION.tts.speech.microsoft.com/cognitiveservices/voices/list' \
--header 'Ocp-Apim-Subscription-Key: YOUR_RESOURCE_KEY'
```

### Sample response

You should receive a response with a JSON body that includes all supported locales, voices, gender, styles, and other details. The `WordsPerMinute` property for each voice can be used to estimate the length of the output speech. This JSON example shows partial results to illustrate the structure of a response:

```json
[  
    // Redacted for brevity
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
        "DisplayName": "Jenny",
        "LocalName": "Jenny",
        "ShortName": "en-US-JennyNeural",
        "Gender": "Female",
        "Locale": "en-US",
        "LocaleName": "English (United States)",
        "StyleList": [
          "assistant",
          "chat",
          "customerservice",
          "newscast",
          "angry",
          "cheerful",
          "sad",
          "excited",
          "friendly",
          "terrified",
          "shouting",
          "unfriendly",
          "whispering",
          "hopeful"
        ],
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA",
        "ExtendedPropertyMap": {
          "IsHighQuality48K": "True"
        },
        "WordsPerMinute": "152"
    },
    // Redacted for brevity
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (en-US, JennyMultilingualNeural)",
        "DisplayName": "Jenny Multilingual",
        "LocalName": "Jenny Multilingual",
        "ShortName": "en-US-JennyMultilingualNeural",
        "Gender": "Female",
        "Locale": "en-US",
        "LocaleName": "English (United States)",
        "SecondaryLocaleList": [
          "de-DE",
          "en-AU",
          "en-CA",
          "en-GB",
          "es-ES",
          "es-MX",
          "fr-CA",
          "fr-FR",
          "it-IT",
          "ja-JP",
          "ko-KR",
          "pt-BR",
          "zh-CN"
        ],
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA",
        "WordsPerMinute": "190"
    },
    // Redacted for brevity
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (ga-IE, OrlaNeural)",
        "DisplayName": "Orla",
        "LocalName": "Orla",
        "ShortName": "ga-IE-OrlaNeural",
        "Gender": "Female",
        "Locale": "ga-IE",
        "LocaleName": "Irish (Ireland)",
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA",
        "WordsPerMinute": "139"
    },
    // Redacted for brevity
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiNeural)",
        "DisplayName": "Yunxi",
        "LocalName": "云希",
        "ShortName": "zh-CN-YunxiNeural",
        "Gender": "Male",
        "Locale": "zh-CN",
        "LocaleName": "Chinese (Mandarin, Simplified)",
        "StyleList": [
          "narration-relaxed",
          "embarrassed",
          "fearful",
          "cheerful",
          "disgruntled",
          "serious",
          "angry",
          "sad",
          "depressed",
          "chat",
          "assistant",
          "newscast"
        ],
        "SampleRateHertz": "24000",
        "VoiceType": "Neural",
        "Status": "GA",
        "RolePlayList": [
          "Narrator",
          "YoungAdultMale",
          "Boy"
        ],
        "WordsPerMinute": "293"
    },
    // Redacted for brevity
]
```

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 200 | OK | The request was successful. |
| 400 | Bad request | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common reason is a header that's too long. |
| 401 | Unauthorized | The request is not authorized. Make sure your resource key or token is valid and in the correct region. |
| 429 | Too many requests | You have exceeded the quota or rate of requests allowed for your resource. |
| 502 | Bad gateway    | There's a network or server-side problem. This status might also indicate invalid headers. |


## Convert text to speech

The `cognitiveservices/v1` endpoint allows you to convert text to speech by using [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md).

### Regions and endpoints

These regions are supported for text to speech through the REST API. Be sure to select the endpoint that matches your Speech resource region.

[!INCLUDE [](includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

### Request headers

This table lists required and optional headers for text to speech requests:

| Header | Description | Required or optional |
|--------|-------------|---------------------|
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Required |
| `Content-Type` | Specifies the content type for the provided text. Accepted value: `application/ssml+xml`. | Required |
| `X-Microsoft-OutputFormat` | Specifies the audio output format. For a complete list of accepted values, see [Audio outputs](#audio-outputs). | Required |
| `User-Agent` | The application name. The provided value must be fewer than 255 characters. | Required |

### Request body

If you're using a custom neural voice, the body of a request can be sent as plain text (ASCII or UTF-8). Otherwise, the body of each `POST` request is sent as [SSML](speech-synthesis-markup.md). SSML allows you to choose the voice and language of the synthesized speech that the text to speech feature returns. For a complete list of supported voices, see [Language and voice support for the Speech service](language-support.md?tabs=tts).

### Sample request

This HTTP request uses SSML to specify the voice and language. If the body length is long, and the resulting audio exceeds 10 minutes, it's truncated to 10 minutes. In other words, the audio length can't exceed 10 minutes.

```http
POST /cognitiveservices/v1 HTTP/1.1

X-Microsoft-OutputFormat: riff-24khz-16bit-mono-pcm
Content-Type: application/ssml+xml
Host: westus.tts.speech.microsoft.com
Content-Length: <Length>
Authorization: Bearer [Base64 access_token]
User-Agent: <Your application name>

<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Male'
    name='en-US-ChristopherNeural'>
        I'm excited to try text to speech!
</voice></speak>
```
<sup>*</sup> For the Content-Length, you should use your own content length. In most cases, this value is calculated automatically.

### HTTP status codes

The HTTP status code for each response indicates success or common errors:

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 200 | OK | The request was successful. The response body is an audio file. |
| 400 | Bad request | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common reason is a header that's too long. |
| 401 | Unauthorized | The request is not authorized. Make sure your Speech resource key or token is valid and in the correct region. |
| 415 | Unsupported media type | It's possible that the wrong `Content-Type` value was provided. `Content-Type` should be set to `application/ssml+xml`. |
| 429 | Too many requests | You have exceeded the quota or rate of requests allowed for your resource. |
| 502 | Bad gateway    | There's a network or server-side problem. This status might also indicate invalid headers. |

If the HTTP status is `200 OK`, the body of the response contains an audio file in the requested format. This file can be played as it's transferred, saved to a buffer, or saved to a file.

## Audio outputs

The supported streaming and non-streaming audio formats are sent in each request as the `X-Microsoft-OutputFormat` header. Each format incorporates a bit rate and encoding type. The Speech service supports 48-kHz, 24-kHz, 16-kHz, and 8-kHz audio outputs. Each prebuilt neural voice model is available at 24kHz and high-fidelity 48kHz. 

#### [Streaming](#tab/streaming)

```
amr-wb-16000hz
audio-16khz-16bit-32kbps-mono-opus
audio-16khz-32kbitrate-mono-mp3
audio-16khz-64kbitrate-mono-mp3
audio-16khz-128kbitrate-mono-mp3
audio-24khz-16bit-24kbps-mono-opus
audio-24khz-16bit-48kbps-mono-opus
audio-24khz-48kbitrate-mono-mp3
audio-24khz-96kbitrate-mono-mp3
audio-24khz-160kbitrate-mono-mp3
audio-48khz-96kbitrate-mono-mp3
audio-48khz-192kbitrate-mono-mp3
ogg-16khz-16bit-mono-opus
ogg-24khz-16bit-mono-opus
ogg-48khz-16bit-mono-opus
raw-8khz-8bit-mono-alaw
raw-8khz-8bit-mono-mulaw
raw-8khz-16bit-mono-pcm
raw-16khz-16bit-mono-pcm
raw-16khz-16bit-mono-truesilk
raw-22050hz-16bit-mono-pcm
raw-24khz-16bit-mono-pcm
raw-24khz-16bit-mono-truesilk
raw-44100hz-16bit-mono-pcm
raw-48khz-16bit-mono-pcm
webm-16khz-16bit-mono-opus
webm-24khz-16bit-24kbps-mono-opus
webm-24khz-16bit-mono-opus
```

#### [NonStreaming](#tab/nonstreaming)

```
riff-8khz-8bit-mono-alaw
riff-8khz-8bit-mono-mulaw
riff-8khz-16bit-mono-pcm
riff-22050hz-16bit-mono-pcm
riff-24khz-16bit-mono-pcm
riff-44100hz-16bit-mono-pcm
riff-48khz-16bit-mono-pcm
```

***

> [!NOTE]
> If you select 48kHz output format, the high-fidelity voice model with 48kHz will be invoked accordingly. The sample rates other than 24kHz and 48kHz can be obtained through upsampling or downsampling when synthesizing, for example, 44.1kHz is downsampled from 48kHz.
>
> If your selected voice and output format have different bit rates, the audio is resampled as necessary. You can decode the `ogg-24khz-16bit-mono-opus` format by using the [Opus codec](https://opus-codec.org/downloads/).

## Authentication

[!INCLUDE [](includes/cognitive-services-speech-service-rest-auth.md)]

## Next steps

- [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
- [Get started with custom neural voice](how-to-custom-voice.md)
- [Batch synthesis](batch-synthesis.md)
