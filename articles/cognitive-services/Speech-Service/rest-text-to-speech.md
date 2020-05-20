---
title: Text-to-speech API reference (REST) - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use the text-to-speech REST API. In this article, you'll learn about authorization options, query options, how to structure a request and receive a response.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/23/2020
ms.author: trbye
---

# Text-to-speech REST API

The Speech service allows you to [convert text into synthesized speech](#convert-text-to-speech) and [get a list of supported voices](#get-a-list-of-voices) for a region using a set of REST APIs. Each available endpoint is associated with a region. A subscription key for the endpoint/region you plan to use is required.

The text-to-speech REST API supports neural and standard text-to-speech voices, each of which supports a specific language and dialect, identified by locale.

* For a complete list of voices, see [language support](language-support.md#text-to-speech).
* For information about regional availability, see [regions](regions.md#text-to-speech).

> [!IMPORTANT]
> Costs vary for standard, custom, and neural voices. For more information, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Before using this API, understand:

* The text-to-speech REST API requires an Authorization header. This means that you need to complete a token exchange to access the service. For more information, see [Authentication](#authentication).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-rest-auth.md)]

## Get a list of voices

The `voices/list` endpoint allows you to get a full list of voices for a specific region/endpoint.

### Regions and endpoints

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Brazil South | `https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Canada Central | `https://canadacentral.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Central US | `https://centralus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| East Asia | `https://eastasia.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| East US | `https://eastus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| East US 2 | `https://eastus2.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| France Central | `https://francecentral.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| India Central | `https://centralindia.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Japan East | `https://japaneast.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Korea Central | `https://koreacentral.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| North Central US | `https://northcentralus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| North Europe | `https://northeurope.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| South Central US | `https://southcentralus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| Southeast Asia | `https://southeastasia.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| UK South | `https://uksouth.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| West Europe | `https://westeurope.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| West US | `https://westus.tts.speech.microsoft.com/cognitiveservices/voices/list` |
| West US 2 | `https://westus2.tts.speech.microsoft.com/cognitiveservices/voices/list` |

### Request headers

This table lists required and optional headers for text-to-speech requests.

| Header | Description | Required / Optional |
|--------|-------------|---------------------|
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Required |

### Request body

A body isn't required for `GET` requests to this endpoint.

### Sample request

This request only requires an authorization header.

```http
GET /cognitiveservices/voices/list HTTP/1.1

Host: westus.tts.speech.microsoft.com
Authorization: Bearer [Base64 access_token]
```

### Sample response

This response has been truncated to illustrate the structure of a response.

> [!NOTE]
> Voice availability varies by region/endpoint.

```json
[
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (ar-EG, Hoda)",
        "ShortName": "ar-EG-Hoda",
        "Gender": "Female",
        "Locale": "ar-EG",
        "SampleRateHertz": "16000",
        "VoiceType": "Standard"
    },
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (ar-SA, Naayf)",
        "ShortName": "ar-SA-Naayf",
        "Gender": "Male",
        "Locale": "ar-SA",
        "SampleRateHertz": "16000",
        "VoiceType": "Standard"
    },
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (bg-BG, Ivan)",
        "ShortName": "bg-BG-Ivan",
        "Gender": "Male",
        "Locale": "bg-BG",
        "SampleRateHertz": "16000",
        "VoiceType": "Standard"
    },
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (ca-ES, HerenaRUS)",
        "ShortName": "ca-ES-HerenaRUS",
        "Gender": "Female",
        "Locale": "ca-ES",
        "SampleRateHertz": "16000",
        "VoiceType": "Standard"
    },
    {
        "Name": "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)",
        "ShortName": "zh-CN-XiaoxiaoNeural",
        "Gender": "Female",
        "Locale": "zh-CN",
        "SampleRateHertz": "24000",
        "VoiceType": "Neural"
    },

    ...
]
```

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 200 | OK | The request was successful. |
| 400 | Bad Request | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common issue is a header that is too long. |
| 401 | Unauthorized | The request is not authorized. Check to make sure your subscription key or token is valid and in the correct region. |
| 429 | Too Many Requests | You have exceeded the quota or rate of requests allowed for your subscription. |
| 502 | Bad Gateway    | Network or server-side issue. May also indicate invalid headers. |


## Convert text-to-speech

The `v1` endpoint allows you to convert text-to-speech using [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md).

### Regions and endpoints

These regions are supported for text-to-speech using the REST API. Make sure that you select the endpoint that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

### Request headers

This table lists required and optional headers for text-to-speech requests.

| Header | Description | Required / Optional |
|--------|-------------|---------------------|
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Required |
| `Content-Type` | Specifies the content type for the provided text. Accepted value: `application/ssml+xml`. | Required |
| `X-Microsoft-OutputFormat` | Specifies the audio output format. For a complete list of accepted values, see [audio outputs](#audio-outputs). | Required |
| `User-Agent` | The application name. The value provided must be less than 255 characters. | Required |

### Audio outputs

This is a list of supported audio formats that are sent in each request as the `X-Microsoft-OutputFormat` header. Each incorporates a bitrate and encoding type. The Speech service supports 24 kHz, 16 kHz, and 8 kHz audio outputs.

|||
|-|-|
| `raw-16khz-16bit-mono-pcm` | `raw-8khz-8bit-mono-mulaw` |
| `riff-8khz-8bit-mono-alaw` | `riff-8khz-8bit-mono-mulaw` |
| `riff-16khz-16bit-mono-pcm` | `audio-16khz-128kbitrate-mono-mp3` |
| `audio-16khz-64kbitrate-mono-mp3` | `audio-16khz-32kbitrate-mono-mp3` |
| `raw-24khz-16bit-mono-pcm` | `riff-24khz-16bit-mono-pcm` |
| `audio-24khz-160kbitrate-mono-mp3` | `audio-24khz-96kbitrate-mono-mp3` |
| `audio-24khz-48kbitrate-mono-mp3` | |

> [!NOTE]
> If your selected voice and output format have different bit rates, the audio is resampled as necessary. However, 24 kHz voices do not support `audio-16khz-16kbps-mono-siren` and `riff-16khz-16kbps-mono-siren` output formats.

### Request body

The body of each `POST` request is sent as [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). SSML allows you to choose the voice and language of the synthesized speech returned by the text-to-speech service. For a complete list of supported voices, see [language support](language-support.md#text-to-speech).

> [!NOTE]
> If using a custom voice, the body of a request can be sent as plain text (ASCII or UTF-8).

### Sample request

This HTTP request uses SSML to specify the voice and language. If the body length is long, and the resulting audio exceeds 10 minutes - it is truncated to 10 minutes. In other words, the audio length cannot exceed 10 minutes.

```http
POST /cognitiveservices/v1 HTTP/1.1

X-Microsoft-OutputFormat: raw-16khz-16bit-mono-pcm
Content-Type: application/ssml+xml
Host: westus.tts.speech.microsoft.com
Content-Length: 225
Authorization: Bearer [Base64 access_token]

<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female'
    name='en-US-AriaRUS'>
        Microsoft Speech Service Text-to-Speech API
</voice></speak>
```

See our quickstarts for language-specific examples:

* [.NET Core, C#](~/articles/cognitive-services/Speech-Service/quickstarts/text-to-speech.md?pivots=programming-language-csharp&tabs=dotnetcore)
* [Python](~/articles/cognitive-services/Speech-Service/quickstarts/text-to-speech.md?pivots=programming-language-python)
* [Node.js](quickstart-nodejs-text-to-speech.md)

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 200 | OK | The request was successful; the response body is an audio file. |
| 400 | Bad Request | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common issue is a header that is too long. |
| 401 | Unauthorized | The request is not authorized. Check to make sure your subscription key or token is valid and in the correct region. |
| 413 | Request Entity Too Large | The SSML input is longer than 1024 characters. |
| 415 | Unsupported Media Type | It's possible that the wrong `Content-Type` was provided. `Content-Type` should be set to `application/ssml+xml`. |
| 429 | Too Many Requests | You have exceeded the quota or rate of requests allowed for your subscription. |
| 502 | Bad Gateway    | Network or server-side issue. May also indicate invalid headers. |

If the HTTP status is `200 OK`, the body of the response contains an audio file in the requested format. This file can be played as it's transferred, saved to a buffer, or saved to a file.

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services)
- [Asynchronous synthesis for long-form audio](quickstarts/text-to-speech/async-synthesis-long-form-audio.md)
- [Get started with Custom Voice](how-to-custom-voice.md)
