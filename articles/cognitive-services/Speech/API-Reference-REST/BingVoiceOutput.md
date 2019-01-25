---
title: Text to Speech API of Microsoft Speech Service | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Use the text to speech API to provide real-time text-to-speech conversion in a variety of voices and languages
services: cognitive-services
author: priyaravi20
manager: yanbo
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: priyar
---
# Bing text to speech API

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

## <a name="Introduction"></a>Introduction

With the Bing text to speech API, your application can send HTTP requests to a cloud server, where text is instantly synthesized into human-sounding speech and returned as an audio file. This API can be used in many different contexts to provide real-time text-to-speech conversion in a variety of different voices and languages.

## <a name="VoiceSynReq"></a>Voice synthesis request

### <a name="Subscription"></a>Authorization token

Every voice synthesis request requires a JSON Web Token (JWT) access token. The JWT access token is passed through in the speech request header. The token has an expiry time of 10 minutes. For information about subscribing and obtaining API keys that are used to retrieve valid JWT access tokens, see [Cognitive Services Subscription](https://azure.microsoft.com/try/cognitive-services/).

The API key is passed to the token service. For example:

```HTTP
POST https://api.cognitive.microsoft.com/sts/v1.0/issueToken
Content-Length: 0
```

The required header information for token access is as follows.

Name| Format | Description
----|----|----
Ocp-Apim-Subscription-Key | ASCII | Your subscription key

The token service returns the JWT access token as `text/plain`. Then the JWT is passed as a `Base64 access_token` to the speech endpoint as an authorization header prefixed with the string `Bearer`. For example:

`Authorization: Bearer [Base64 access_token]`

Clients must use the following endpoint to access the text-to-speech service:

`https://speech.platform.bing.com/synthesize`

>[!NOTE]
>Until you have acquired an access token with your subscription key as described earlier, this link generates a `403 Forbidden` response error.

### <a name="Http"></a>HTTP headers

The following table shows the HTTP headers that are used for voice synthesis requests.

Header |Value |Comments
----|----|----
Content-Type | application/ssml+xml | The input content type.
X-Microsoft-OutputFormat | **1.** ssml-16khz-16bit-mono-tts <br> **2.** raw-16khz-16bit-mono-pcm <br>**3.** audio-16khz-16kbps-mono-siren <br> **4.** riff-16khz-16kbps-mono-siren <br> **5.** riff-16khz-16bit-mono-pcm <br> **6.** audio-16khz-128kbitrate-mono-mp3 <br> **7.** audio-16khz-64kbitrate-mono-mp3 <br> **8.** audio-16khz-32kbitrate-mono-mp3 | The output audio format.
X-Search-AppId | A GUID (hex only, no dashes) | An ID that uniquely identifies the client application. This can be the store ID for apps. If one is not available, the ID can be user generated for an application.
X-Search-ClientID | A GUID (hex only, no dashes) | An ID that uniquely identifies an application instance for each installation.
User-Agent | Application name | The application name is required and must be fewer than 255 characters.
Authorization | Authorization token |  See the <a href="#Subscription">Authorization token</a> section.

### <a name="InputParam"></a>Input parameters

Requests to the Bing text to speech API are made using HTTP POST calls. The headers are specified in the previous section. The body contains Speech Synthesis Markup Language (SSML) input that represents the text to be synthesized. For a description of the markup used to control aspects of speech such as the language and gender of the speaker, see the [SSML W3C Specification](http://www.w3.org/TR/speech-synthesis/).

>[!NOTE]
>The maximum size of the SSML input that is supported is 1,024 characters, including all tags.

###  <a name="SampleVoiceOR"></a>Example: voice output request

An example of a voice output request is as follows:

```HTTP
POST /synthesize
HTTP/1.1
Host: speech.platform.bing.com

X-Microsoft-OutputFormat: riff-8khz-8bit-mono-mulaw
Content-Type: application/ssml+xml
Host: speech.platform.bing.com
Content-Length: 197
Authorization: Bearer [Base64 access_token]

<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)'>Microsoft Bing Voice Output API</voice></speak>
```

## <a name="VoiceOutResponse"></a>Voice output response

The Bing text to speech API uses HTTP POST to send audio back to the client. The API response contains the audio stream and the codec, and it matches the requested output format. The audio returned for a given request must not exceed 15 seconds.

### <a name="SuccessfulRecResponse"></a>Example: successful synthesis response

The following code is an example of a JSON response to a successful voice synthesis request. The comments and formatting of the code are for purposes of this example only and are omitted from the actual response.

```HTTP
HTTP/1.1 200 OK
Content-Length: XXX
Content-Type: audio/x-wav

Response audio payload
```

### <a name="RecFailure"></a>Example: synthesis failure

The following example code shows a JSON response to a voice-synthesis query failure:

```HTTP
HTTP/1.1 400 XML parser error
Content-Type: text/xml
Content-Length: 0
```

### <a name="ErrorResponse"></a>Error responses

Error | Description
----|----
HTTP/400 Bad Request | A required parameter is missing, empty, or null, or the value passed to either a required or optional parameter is invalid. One reason for getting the “invalid” response is passing a string value that is longer than the allowed length. A brief description of the problematic parameter is included.
HTTP/401 Unauthorized | The request is not authorized.
HTTP/413 RequestEntityTooLarge  | The SSML input is larger than what is supported.
HTTP/502 BadGateway | There is a network-related problem or a server-side issue.

An example of an error response is as follows:

```HTTP
HTTP/1.0 400 Bad Request
Content-Length: XXX
Content-Type: text/plain; charset=UTF-8

Voice name not supported
```

## <a name="ChangeSSML"></a>Changing voice output via SSML

Microsoft Text-to-Speech API supports SSML 1.0 as defined in W3C [Speech Synthesis Markup Language (SSML) Version 1.0](http://www.w3.org/TR/2009/REC-speech-synthesis-20090303/). This section shows examples of changing certain characteristics of generated voice output like speaking rate, pronunciation etc. by using SSML tags.

1. Adding break

  ```
  <speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, BenjaminRUS)'> Welcome to use Microsoft Cognitive Services <break time="100ms" /> Text-to-Speech API.</voice> </speak>
  ```

2. Change speaking rate

  ```
  <speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'><prosody rate="+30.00%">Welcome to use Microsoft Cognitive Services Text-to-Speech API.</prosody></voice> </speak>
  ```

3. Pronunciation

  ```
  <speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'> <phoneme alphabet="ipa" ph="t&#x259;mei&#x325;&#x27E;ou&#x325;"> tomato </phoneme></voice> </speak>
  ```

4. Change volume

  ```
  <speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'><prosody volume="+20.00%">Welcome to use Microsoft Cognitive Services Text-to-Speech API.</prosody></voice> </speak>
  ```

5. Change pitch

  ```
  <speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'>Welcome to use <prosody pitch="high">Microsoft Cognitive Services Text-to-Speech API.</prosody></voice> </speak>
  ```

6. Change prosody contour

  ```
  <speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xml:lang='en-US'><voice  name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'><prosody contour="(80%,+20%) (90%,+30%)" >Good morning.</prosody></voice> </speak>
  ```

> [!NOTE]
> Note the audio data has to be 8k or 16k wav filed in the following format: **CRC code** (CRC-32): 4 bytes (DWORD) with valid range 0x00000000 ~ 0xFFFFFFFF; **Audio format flag**: 4 bytes (DWORD) with valid range 0x00000000 ~ 0xFFFFFFFF; **Sample count**: 4 bytes (DWORD) with valid range 0x00000000 ~ 0x7FFFFFFF; **Size of binary body**: 4 bytes (DWORD) with valid range 0x00000000 ~ 0x7FFFFFFF; **Binary body**: n bytes.

## <a name="SampleApp"></a>Sample application

For implementation details, see the [Visual C#.NET text-to-speech sample application](https://github.com/Microsoft/Cognitive-Speech-TTS/blob/master/Samples-Http/CSharp/TTSProgram.cs).

## <a name="SupLocales"></a>Supported locales and voice fonts

The following table identifies some of the supported locales and related voice fonts.

Locale | Gender | Service name mapping
---------|--------|------------
ar-EG* | Female | "Microsoft Server Speech Text to Speech Voice (ar-EG, Hoda)"
ar-SA | Male | "Microsoft Server Speech Text to Speech Voice (ar-SA, Naayf)"
bg-BG | Male | "Microsoft Server Speech Text to Speech Voice (bg-BG, Ivan)"
ca-ES | Female | "Microsoft Server Speech Text to Speech Voice (ca-ES, HerenaRUS)"
cs-CZ | Male | "Microsoft Server Speech Text to Speech Voice (cs-CZ, Jakub)"
da-DK | Female | "Microsoft Server Speech Text to Speech Voice (da-DK, HelleRUS)"
de-AT | Male | "Microsoft Server Speech Text to Speech Voice (de-AT, Michael)"
de-CH | Male | "Microsoft Server Speech Text to Speech Voice (de-CH, Karsten)"
de-DE | Female | "Microsoft Server Speech Text to Speech Voice (de-DE, Hedda) "
de-DE | Female | "Microsoft Server Speech Text to Speech Voice (de-DE, HeddaRUS)"
de-DE | Male | "Microsoft Server Speech Text to Speech Voice (de-DE, Stefan, Apollo) "
el-GR | Male | "Microsoft Server Speech Text to Speech Voice (el-GR, Stefanos)"
en-AU | Female | "Microsoft Server Speech Text to Speech Voice (en-AU, Catherine) "
en-AU | Female | "Microsoft Server Speech Text to Speech Voice (en-AU, HayleyRUS)"
en-CA | Female | "Microsoft Server Speech Text to Speech Voice (en-CA, Linda)"
en-CA | Female | "Microsoft Server Speech Text to Speech Voice (en-CA, HeatherRUS)"
en-GB | Female | "Microsoft Server Speech Text to Speech Voice (en-GB, Susan, Apollo)"
en-GB | Female | "Microsoft Server Speech Text to Speech Voice (en-GB, HazelRUS)"
en-GB | Male | "Microsoft Server Speech Text to Speech Voice (en-GB, George, Apollo)"
en-IE | Male | "Microsoft Server Speech Text to Speech Voice (en-IE, Sean)"
en-IN | Female | "Microsoft Server Speech Text to Speech Voice (en-IN, Heera, Apollo)"
en-IN | Female | "Microsoft Server Speech Text to Speech Voice (en-IN, PriyaRUS)"
en-IN | Male | "Microsoft Server Speech Text to Speech Voice (en-IN, Ravi, Apollo)"
en-US | Female | "Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)"
en-US | Female | "Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)"
en-US | Male | "Microsoft Server Speech Text to Speech Voice (en-US, BenjaminRUS)"
es-ES | Female | "Microsoft Server Speech Text to Speech Voice (es-ES, Laura, Apollo)"
es-ES | Female | "Microsoft Server Speech Text to Speech Voice (es-ES, HelenaRUS)"
es-ES | Male | "Microsoft Server Speech Text to Speech Voice (es-ES, Pablo, Apollo)"
es-MX | Female | "Microsoft Server Speech Text to Speech Voice (es-MX, HildaRUS)"
es-MX | Male | "Microsoft Server Speech Text to Speech Voice (es-MX, Raul, Apollo)"
fi-FI | Female | "Microsoft Server Speech Text to Speech Voice (fi-FI, HeidiRUS)"
fr-CA | Female | "Microsoft Server Speech Text to Speech Voice (fr-CA, Caroline)"
fr-CA | Female | "Microsoft Server Speech Text to Speech Voice (fr-CA, HarmonieRUS)"
fr-CH | Male | "Microsoft Server Speech Text to Speech Voice (fr-CH, Guillaume)"
fr-FR | Female | "Microsoft Server Speech Text to Speech Voice (fr-FR, Julie, Apollo)"
fr-FR | Female | "Microsoft Server Speech Text to Speech Voice (fr-FR, HortenseRUS)"
fr-FR | Male | "Microsoft Server Speech Text to Speech Voice (fr-FR, Paul, Apollo)"
he-IL| Male| "Microsoft Server Speech Text to Speech Voice (he-IL, Asaf)"
hi-IN | Female | "Microsoft Server Speech Text to Speech Voice (hi-IN, Kalpana, Apollo)"
hi-IN | Female | "Microsoft Server Speech Text to Speech Voice (hi-IN, Kalpana)"
hi-IN | Male | "Microsoft Server Speech Text to Speech Voice (hi-IN, Hemant)"
hr-HR | Male | "Microsoft Server Speech Text to Speech Voice (hr-HR, Matej)"
hu-HU | Male | "Microsoft Server Speech Text to Speech Voice (hu-HU, Szabolcs)"
id-ID | Male | "Microsoft Server Speech Text to Speech Voice (id-ID, Andika)"
it-IT | Male | "Microsoft Server Speech Text to Speech Voice (it-IT, Cosimo, Apollo)"
it-IT | Female | "Microsoft Server Speech Text to Speech Voice (it-IT, LuciaRUS)"
ja-JP | Female | "Microsoft Server Speech Text to Speech Voice (ja-JP, Ayumi, Apollo)"
ja-JP | Male | "Microsoft Server Speech Text to Speech Voice (ja-JP, Ichiro, Apollo)"
ja-JP | Female | "Microsoft Server Speech Text to Speech Voice (ja-JP, HarukaRUS)"
ko-KR | Female | "Microsoft Server Speech Text to Speech Voice (ko-KR, HeamiRUS)"
ms-MY | Male | "Microsoft Server Speech Text to Speech Voice (ms-MY, Rizwan)"
nb-NO | Female | "Microsoft Server Speech Text to Speech Voice (nb-NO, HuldaRUS)"
nl-NL | Female | "Microsoft Server Speech Text to Speech Voice (nl-NL, HannaRUS)"
pl-PL | Female | "Microsoft Server Speech Text to Speech Voice (pl-PL, PaulinaRUS)"
pt-BR | Female | "Microsoft Server Speech Text to Speech Voice (pt-BR, HeloisaRUS)"
pt-BR | Male | "Microsoft Server Speech Text to Speech Voice (pt-BR, Daniel, Apollo)"
pt-PT | Female | "Microsoft Server Speech Text to Speech Voice (pt-PT, HeliaRUS)"
ro-RO | Male | "Microsoft Server Speech Text to Speech Voice (ro-RO, Andrei)"
ru-RU | Female | "Microsoft Server Speech Text to Speech Voice (ru-RU, Irina, Apollo)"
ru-RU | Male | "Microsoft Server Speech Text to Speech Voice (ru-RU, Pavel, Apollo)"
ru-RU | Female | "Microsoft Server Speech Text to Speech Voice (ru-RU, EkaterinaRUS)"
sk-SK | Male | "Microsoft Server Speech Text to Speech Voice (sk-SK, Filip)"
sl-SI | Male | "Microsoft Server Speech Text to Speech Voice (sl-SI, Lado)"
sv-SE | Female | "Microsoft Server Speech Text to Speech Voice (sv-SE, HedvigRUS)"
ta-IN | Male | "Microsoft Server Speech Text to Speech Voice (ta-IN, Valluvar)"
th-TH | Male | "Microsoft Server Speech Text to Speech Voice (th-TH, Pattara)"
tr-TR | Female | "Microsoft Server Speech Text to Speech Voice (tr-TR, SedaRUS)"
vi-VN | Male | "Microsoft Server Speech Text to Speech Voice (vi-VN, An)"
zh-CN | Female | "Microsoft Server Speech Text to Speech Voice (zh-CN, HuihuiRUS)"
zh-CN | Female | "Microsoft Server Speech Text to Speech Voice (zh-CN, Yaoyao, Apollo)"
zh-CN | Male | "Microsoft Server Speech Text to Speech Voice (zh-CN, Kangkang, Apollo)"
zh-HK | Female | "Microsoft Server Speech Text to Speech Voice (zh-HK, Tracy, Apollo)"
zh-HK | Female | "Microsoft Server Speech Text to Speech Voice (zh-HK, TracyRUS)"
zh-HK | Male | "Microsoft Server Speech Text to Speech Voice (zh-HK, Danny, Apollo)"
zh-TW | Female | "Microsoft Server Speech Text to Speech Voice (zh-TW, Yating, Apollo)"
zh-TW | Female | "Microsoft Server Speech Text to Speech Voice (zh-TW, HanHanRUS)"
zh-TW | Male | "Microsoft Server Speech Text to Speech Voice (zh-TW, Zhiwei, Apollo)"
 *ar-EG supports Modern Standard Arabic (MSA).

> [!NOTE]
> Note that the previous service names **Microsoft Server Speech Text to Speech Voice (cs-CZ, Vit)** and **Microsoft Server Speech Text to Speech Voice (en-IE, Shaun)** will be deprecated after 3/31/2018, in order to optimize the Bing Speech API’s capabilities. Please update your code with the updated names.

## <a name="TrouNSupport"></a>Troubleshooting and support

Post all questions and issues to the [Bing Speech Service](https://social.msdn.microsoft.com/Forums/en-US/home?forum=SpeechService) MSDN forum. Include complete details, such as:

* An example of the full request string.
* If applicable, the full output of a failed request, which includes log IDs.
* The percentage of requests that are failing.
