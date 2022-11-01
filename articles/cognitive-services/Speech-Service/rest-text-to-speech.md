---
title: Text-to-speech API reference (REST) - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use the REST API to convert text into synthesized speech.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 01/24/2022
ms.author: eur
ms.custom: references_regions
---

# Text-to-speech REST API

The Speech service allows you to [convert text into synthesized speech](#convert-text-to-speech) and [get a list of supported voices](#get-a-list-of-voices) for a region by using a REST API. In this article, you'll learn about authorization options, query options, how to structure a request, and how to interpret a response.

The text-to-speech REST API supports neural text-to-speech voices, which support specific languages and dialects that are identified by locale. Each available endpoint is associated with a region. A subscription key for the endpoint or region that you plan to use is required. Here are links to more information:

- For a complete list of voices, see [Language and voice support for the Speech service](language-support.md?tabs=stt-tts).
- For information about regional availability, see [Speech service supported regions](regions.md#speech-service).
- For Azure Government and Azure China endpoints, see [this article about sovereign clouds](sovereign-clouds.md).

> [!IMPORTANT]
> Costs vary for prebuilt neural voices (called *Neural* on the pricing page) and custom neural voices (called *Custom Neural* on the pricing page). For more information, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Before you use the text-to-speech REST API, understand that you need to complete a token exchange as part of authentication to access the service.

[!INCLUDE [](includes/cognitive-services-speech-service-rest-auth.md)]

## Get a list of voices

You can use the `voices/list` endpoint to get a full list of voices for a specific region or endpoint:

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Brazil South | `https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Canada Central | `https://canadacentral.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Central US | `https://centralus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| China East 2 | `https://chinaeast2.tts.speech.azure.cn/cognitiveservices/voices/list` |
| China North 2 | `https://chinanorth2.tts.speech.azure.cn/cognitiveservices/voices/list` |
| East Asia | `https://eastasia.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| East US | `https://eastus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| East US 2 | `https://eastus2.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| France Central | `https://francecentral.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Germany West Central | `https://germanywestcentral.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| India Central | `https://centralindia.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Japan East | `https://japaneast.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Japan West | `https://japanwest.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Jio India West | `https://jioindiawest.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Korea Central | `https://koreacentral.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| North Central US | `https://northcentralus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| North Europe | `https://northeurope.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Norway East | `https://norwayeast.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| South Central US | `https://southcentralus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Southeast Asia | `https://southeastasia.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Switzerland North | `https://switzerlandnorth.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Switzerland West | `https://switzerlandwest.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| US Gov Arizona | `https://usgovarizona.tts.speech.azure.us/cognitiveservices/voices/list` |
| US Gov Virginia | `https://usgovvirginia.tts.speech.azure.us/cognitiveservices/voices/list` |
| UK South | `https://uksouth.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| West Central US | `https://westcentralus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| West Europe | `https://westeurope.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| West US | `https://westus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| West US 2 | `https://westus2.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| West US 3 | `https://westus3.tts.speech.microsoft.com/cognitiveservices/voices/list` |

> [!TIP]
> [Voices in preview](language-support.md?tabs=stt-tts) are available in only these three regions: East US, West Europe, and Southeast Asia.

### Request headers

This table lists required and optional headers for text-to-speech requests:

| Header | Description | Required or optional |
|--------|-------------|---------------------|
| `Ocp-Apim-Subscription-Key` | Your subscription key for the Speech service. | Either this header or `Authorization` is required. |
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Either this header or `Ocp-Apim-Subscription-Key` is required. |

### Request body

A body isn't required for `GET` requests to this endpoint.

### Sample request

This request requires only an authorization header:

```http
GET /cognitiveservices/voices/list HTTP/1.1

Host: westus.tts.speech.microsoft.com
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
```

### Sample response

This response has been truncated to illustrate the structure of a response.

> [!NOTE]
> Voice availability varies by region or endpoint.

```json
[

    {
    "Name": "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
    "DisplayName": "Jenny",
    "LocalName": "Jenny",
    "ShortName": "en-US-JennyNeural",
    "Gender": "Female",
    "Locale": "en-US",
    "StyleList": [
      "chat",
      "customerservice",
      "newscast-casual",
      "assistant",
    ],
    "SampleRateHertz": "24000",
    "VoiceType": "Neural",
    "Status": "GA"
  },

    ...

     {
    "Name": "Microsoft Server Speech Text to Speech Voice (en-US, JennyMultilingualNeural)",
    "ShortName": "en-US-JennyMultilingualNeural",
    "DisplayName": "Jenny Multilingual",
    "LocalName": "Jenny Multilingual",
    "Gender": "Female",
    "Locale": "en-US",
    "SampleRateHertz": "24000",
    "VoiceType": "Neural",
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
    "Status": "Preview"
    },

  ...

    {
    "Name": "Microsoft Server Speech Text to Speech Voice (ga-IE, OrlaNeural)",
    "DisplayName": "Orla",
    "LocalName": "Orla",
    "ShortName": "ga-IE-OrlaNeural",
    "Gender": "Female",
    "Locale": "ga-IE",
    "SampleRateHertz": "24000",
    "VoiceType": "Neural",
    "Status": "GA"
  },

  ...

   {
    "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiNeural)",
    "DisplayName": "Yunxi",
    "LocalName": "云希",
    "ShortName": "zh-CN-YunxiNeural",
    "Gender": "Male",
    "Locale": "zh-CN",
    "StyleList": [
      "Calm",
      "Fearful",
      "Cheerful",
      "Disgruntled",
      "Serious",
      "Angry",
      "Sad",
      "Depressed",
      "Embarrassed"
    ],
    "SampleRateHertz": "24000",
    "VoiceType": "Neural",
    "Status": "GA"
  },

    ...

]
```

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 200 | OK | The request was successful. |
| 400 | Bad request | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common reason is a header that's too long. |
| 401 | Unauthorized | The request is not authorized. Make sure your subscription key or token is valid and in the correct region. |
| 429 | Too many requests | You have exceeded the quota or rate of requests allowed for your subscription. |
| 502 | Bad gateway    | There's a network or server-side problem. This status might also indicate invalid headers. |


## Convert text to speech

The `v1` endpoint allows you to convert text to speech by using [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md).

### Regions and endpoints

These regions are supported for text-to-speech through the REST API. Be sure to select the endpoint that matches your subscription region.

[!INCLUDE [](includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

### Request headers

This table lists required and optional headers for text-to-speech requests:

| Header | Description | Required or optional |
|--------|-------------|---------------------|
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Required |
| `Content-Type` | Specifies the content type for the provided text. Accepted value: `application/ssml+xml`. | Required |
| `X-Microsoft-OutputFormat` | Specifies the audio output format. For a complete list of accepted values, see [Audio outputs](#audio-outputs). | Required |
| `User-Agent` | The application name. The provided value must be fewer than 255 characters. | Required |

### Request body

If you're using a custom neural voice, the body of a request can be sent as plain text (ASCII or UTF-8). Otherwise, the body of each `POST` request is sent as [SSML](speech-synthesis-markup.md). SSML allows you to choose the voice and language of the synthesized speech that the text-to-speech feature returns. For a complete list of supported voices, see [Language and voice support for the Speech service](language-support.md?tabs=stt-tts).

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
        Microsoft Speech Service Text-to-Speech API
</voice></speak>
```
<sup>*</sup> For the Content-Length, you should use your own content length. In most cases, this value is calculated automatically.

### HTTP status codes

The HTTP status code for each response indicates success or common errors:

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 200 | OK | The request was successful. The response body is an audio file. |
| 400 | Bad request | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common reason is a header that's too long. |
| 401 | Unauthorized | The request is not authorized. Make sure your subscription key or token is valid and in the correct region. |
| 415 | Unsupported media type | It's possible that the wrong `Content-Type` value was provided. `Content-Type` should be set to `application/ssml+xml`. |
| 429 | Too many requests | You have exceeded the quota or rate of requests allowed for your subscription. |
| 502 | Bad gateway    | There's a network or server-side problem. This status might also indicate invalid headers. |

If the HTTP status is `200 OK`, the body of the response contains an audio file in the requested format. This file can be played as it's transferred, saved to a buffer, or saved to a file.

## Audio outputs

The supported streaming and non-streaming audio formats are sent in each request as the `X-Microsoft-OutputFormat` header. Each format incorporates a bit rate and encoding type. The Speech service supports 48-kHz, 24-kHz, 16-kHz, and 8-kHz audio outputs. Prebuilt neural voices are created from samples that use a 24-khz sample rate. All voices can upsample or downsample to other sample rates when synthesizing.

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
> en-US-AriaNeural, en-US-JennyNeural and zh-CN-XiaoxiaoNeural are available in public preview in 48Khz output. Other voices support 24khz upsampled to 48khz output.

> [!NOTE]
> If your selected voice and output format have different bit rates, the audio is resampled as necessary. You can decode the `ogg-24khz-16bit-mono-opus` format by using the [Opus codec](https://opus-codec.org/downloads/).

## Next steps

- [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
- [Asynchronous synthesis for long-form audio](./long-audio-api.md)
- [Get started with custom neural voice](how-to-custom-voice.md)
