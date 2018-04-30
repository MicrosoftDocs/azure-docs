---
title: How to use Text to Speech | Microsoft Docs
description: How to use Text to Speech in the Speech service.
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 04/28/2018
ms.author: v-jerkin
---
# How to use Text to Speech

The Speech service provides Text to Speech functionality through a straightforward HTTP request. You POST the text to be spoken to the appropriate endpoint, and the service returns an audio file (`.wav`) containing synthesized speech. Your application can then use this audio as it likes.

The body of the POST request may be plain text (ASCII or UTF8) or an [SSML](speech-synthesis-markup.md) document. Plain-text requests are spoken with a default voice. In most cases, you will want to use an SSML body.

The regional Speech to Text endpoints are shown here. Use the one appropriate to your subscription.

Region|	Endpoint
-|-
West US|	https://westus.tts.speech.microsoft.com/cognitiveservices/v1
East Asia|	https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1
North Europe|	https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1

> [!NOTE]
> If you have created a custom voice font, use the endpoint you created for it instead of the ones above.

The HTTP request must include an authorization, either your subscription key or a token. See [how to authenticate](how-to-authenticate.md).

## Specifying a voice

To specify a voice, use the `<voice>` [SSML](speech-synthesis-markup.md) tag. For example:

```xml
<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'>Hello, world!</voice> </speak>
```

See [text to speech voices](supported-languages.md#text-to-speech) for a list of the available voices and their names.

## Making a request

A Speech to Text HTTP request is made in POST mode with the text to be spoken in the body of the request. The request must have the following headers.

Header|Values|Comments
-|-|-
|`Content-Type` | application/ssml+xml | The input text format.
|`X-Microsoft-OutputFormat`|	 `raw-16khz-16bit-mono-pcm` | The output audio format.
|| `audio-16khz-16kbps-mono-siren`
|| `riff-16khz-16kbps-mono-siren`
|| `riff-16khz-16bit-mono-pcm`
|| `audio-16khz-128kbitrate-mono-mp3` 
|| `audio-16khz-64kbitrate-mono-mp3` 
|| `audio-16khz-32kbitrate-mono-mp3`
|| `raw-24khz-16bit-mono-pcm`
|| `riff-24khz-16bit-mono-pcm`
|| `audio-24khz-160kbitrate-mono-mp3`
|| `audio-24khz-96kbitrate-mono-mp3`
|| `audio-24khz-48kbitrate-mono-mp3`
|User-Agent	|Application name | The application name is required and must be fewer than 255 characters.
| Ocp-Apim-Subscription-Key or Authorization	| Subscription key or authorization token.

> [!NOTE]
> If your your selected voice and output format have different bitrates, the audio will be resampled as necessary. 24khz voices do not support `audio-16khz-16kbps-mono-siren` and `riff-16khz-16kbps-mono-siren` output formats. 

The maximum length of the HTTP request body is 1024 characters.

A sample request is shown below.

```
POST /cognitiveservices/v1
HTTP/1.1
Host: westus.tts.speech.microsoft.com
X-Microsoft-OutputFormat: riff-24khz-16bit-mono-pcm
Content-Type: application/ssml+xml
User-Agent: Test TTS application
Ocp-Apim-Subscription-Key: ... your subscription key

<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'>Hello, world!</voice> </speak>
```

The response body with a status of 200 contains audio in the specified output format.

```
HTTP/1.1 200 OK
Content-Length: XXX
Content-Type: audio/x-wav

Response audio payload
```

If an error occurs, the status codes below are used. In this case, the response body contains a description of the problem.

|Code|Description|Problem|
|-|-|-|
400 |Bad Request |A required parameter is missing, empty, or null, or the value passed to either a required or optional parameter is invalid. A common issue is a header that is too long.
401|Unauthorized |The request is not authorized. Check to make sure your subscription key or token is valid.
413|Request Entity Too Large|The SSML input is longer than 1024 characters.
|502|Bad Gateway	| Network or server-side issue. May also indicate invalid headers.

For more information on the Speech to Text REST API, see [REST APIs](rest-apis.md#text-to-speech).