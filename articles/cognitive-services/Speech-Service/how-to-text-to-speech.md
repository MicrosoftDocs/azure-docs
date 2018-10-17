---
title: Use Text to Speech using Speech services
description: Learn how to use Text to Speech in the Speech service.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: erhopf

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 09/08/2018
ms.author: erhopf
---
# Use "Text to Speech" in Speech service

The Speech service provides Text to Speech functionality through a straightforward HTTP request. You `POST` the text to be spoken to the appropriate endpoint, and the service returns an audio file (`.wav`) containing synthesized speech. Your application can then use this audio as it likes.

The body of the POST request for Text to Speech may be plain text (ASCII or UTF8) or an [SSML](speech-synthesis-markup.md) document. Plain-text requests are spoken with a default voice. In most cases, you want to use an SSML body. The HTTP request must include an [authorization](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#authentication) token.

The regional Text to Speech endpoints are shown here. Use the one appropriate to your subscription.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

## Specify a voice

To specify a voice, use the `<voice>` [SSML](speech-synthesis-markup.md) tag. For example:

```xml
<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
  <voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'>
    Hello, world!
  </voice>
</speak>
```

See [Text to Speech voices](language-support.md#text-to-speech) for a list of the available voices and their names.

## Make a request

A Text to Speech HTTP request is made in POST mode with the text to be spoken in the body of the request. The maximum length of the HTTP request body is 1024 characters. The request must have the following headers:

Header|Values|Comments
-|-|-
|`Content-Type` | `application/ssml+xml` | The input text format.
|`X-Microsoft-OutputFormat`|	 `raw-16khz-16bit-mono-pcm`<br>`riff-16khz-16bit-mono-pcm`<br>`raw-8khz-8bit-mono-mulaw`<br>`riff-8khz-8bit-mono-mulaw`<br>`audio-16khz-128kbitrate-mono-mp3`<br>`audio-16khz-64kbitrate-mono-mp3`<br>`audio-16khz-32kbitrate-mono-mp3`<br>`raw-24khz-16bit-mono-pcm`<br>`riff-24khz-16bit-mono-pcm`<br>`audio-24khz-160kbitrate-mono-mp3`<br>`audio-24khz-96kbitrate-mono-mp3`<br>`audio-24khz-48kbitrate-mono-mp3` | The output audio format.
|`User-Agent`	|Application name | The application name is required and must be fewer than 255 characters.
| `Authorization`	| Authorization token obtained by presenting your subscription key to the token service. Each token is valid for ten minutes. See [REST APIs: Authentication](rest-apis.md#authentication).

> [!NOTE]
> If your selected voice and output format have different bit rates, the audio is resampled as necessary.

A sample request is shown below.

```xml
POST /cognitiveservices/v1
HTTP/1.1
Host: westus.tts.speech.microsoft.com
X-Microsoft-OutputFormat: riff-24khz-16bit-mono-pcm
Content-Type: application/ssml+xml
User-Agent: Test TTS application
Authorization: (authorization token)

<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'>
<voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'>
    Hello, world!
</voice> </speak>
```

The response body with a status of 200 contains audio in the specified output format.

```
HTTP/1.1 200 OK
Content-Length: XXX
Content-Type: audio/x-wav

Response audio payload
```

If an error occurs, the status codes below are used. The response body for the error also contains a description of the problem.

|Code|Description|Problem|
|-|-|-|
400 |Bad Request |A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common issue is a header that is too long.
401|Unauthorized |The request is not authorized. Check to make sure your subscription key or token is valid.
413|Request Entity Too Large|The input SSML is too large or contains more than 3 `<voice>` elements.
429|Too Many Requests|You have exceeded the quota or rate of requests allowed for your subscription.
|502|Bad Gateway	| Network or server-side issue. May also indicate invalid headers.

For more information on the Text to Speech REST API, see [REST APIs](rest-apis.md#text-to-speech).

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Recognize speech in C++](quickstart-cpp-windows.md)
- [Recognize speech in C#](quickstart-csharp-dotnet-windows.md)
- [Recognize speech in Java](quickstart-java-android.md)
