---
title: Translator Speech API Reference
titleSuffix: Azure Cognitive Services
description: Reference documentation for the Translator Speech API.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-speech
ms.topic: reference
ms.date: 05/18/2018
ms.author: swmachan
ROBOTS: NOINDEX,NOFOLLOW
---

# Translator Speech API

[!INCLUDE [Deprecation note](../../../includes/cognitive-services-translator-speech-deprecation-note.md)]

This service offers a streaming API to transcribe conversational speech from one language into text of another language. The API also integrates text-to-speech capabilities to speak the translated text back. The Translator Speech API enables scenarios like real-time translation of conversations as seen in Skype Translator.

With the Translator Speech API, client applications stream speech audio to the service and receive back a stream of text-based results, which include the recognized text in the source language, and its translation in the target language. Text results are produced by applying Automatic Speech Recognition (ASR) powered by deep neural networks to the incoming audio stream. Raw ASR output is further improved by a new technique called TrueText in order to more closely reflect user intent. For example, TrueText removes disfluencies (the hmms and coughs) and restore proper punctuation and capitalization. The ability to mask or exclude profanities is also included. The recognition and translation engines are specifically trained to handle conversational speech. The Speech Translation service uses silence detection to determine the end of an utterance. After a pause in voice activity, the service will stream back a final result for the completed utterance. The service can also send back partial results, which give intermediate recognitions and translations for an utterance in progress. For final results, the service provides the ability to synthesize speech (text-to-speech) from the spoken text in the target languages. Text-to-speech audio is created in the format specified by the client. WAV and MP3 formats are available.

Translator Speech API leverages the WebSocket protocol to provide a full-duplex communication channel between the client and the server. An application will require these steps to use the service:

## 1. Getting started
To access the Translator Text API you will need to [sign up for Microsoft Azure](translator-speech-how-to-signup.md).

## 2. Authentication

Use the subscription key to authenticate. The Translator Speech API supports two modes of authentication:

* **Using an access token:** In your application, obtain an access token from the token service. Use your Translator Speech API subscription key to obtain an access token from the Azure Cognitive Services authentication service. The access token is valid for 10 minutes. Obtain a new access token every 10 minutes, and keep using the same access token for repeated requests within these 10 minutes.

* **Using a subscription key directly:** In your application, pass your subscription key as a value in `Ocp-Apim-Subscription-Key` header.

Treat your subscription key and the access token as secrets that should be hidden from view.

## 3. Query languages
**Query the Languages resource for the current set of supported languages.** The [languages resource](languages-reference.md) exposes the set of languages and voices available for speech recognition, for text translation and for text-to-speech. Each language or voice is given an identifier which the Translator Speech API uses to identify the same language or voice.

## 4. Stream audio
**Open a connection and begin streaming audio to the service.** The service URL is `wss://dev.microsofttranslator.com/speech/translate`. Parameters and audio formats expected by the service are described below, in the `/speech/translate` operation. One of the parameters is used to pass the access token from Step 2 above.

## 5. Process the results
**Process the results streamed back from the service.** The format of partial results, final results and text-to-speech audio segments are described in the documentation of the `/speech/translate` operation below.

Code samples demonstrating use of the Translator Speech API are available from the [Microsoft Translator GitHub site](https://github.com/MicrosoftTranslator).

## Implementation notes

GET /speech/translate Establishes a session for speech translation

### Connecting
Before connecting to the service, review the list of parameters given later in this section. An example request is:

`GET wss://dev.microsofttranslator.com/speech/translate?from=en-US&to=it-IT&features=texttospeech&voice=it-IT-Elsa&api-version=1.0`
`Ocp-Apim-Subscription-Key: {subscription key}`
`X-ClientTraceId: {GUID}`

The request specifies that spoken English will be streamed to the service and translated into Italian. Each final recognition result will generate a text-to-speech audio response with the female voice named Elsa. Notice that the request includes credentials in the `Ocp-Apim-Subscription-Key header`. The request also follows a best practice by setting a globally unique identifier in header `X-ClientTraceId`. A client application should log the trace ID so that it can be used to troubleshoot issues when they occur.

### Sending audio
Once the connection is established, the client begins streaming audio to the service. The client sends audio in chunks. Each chunk is transmitted using a Websocket message of type Binary.

Audio input is in the Waveform Audio File Format (WAVE, or more commonly known as WAV due to its filename extension). The client application should stream single channel, signed 16bit PCM audio sampled at 16 kHz. The first set of bytes streamed by the client will include the WAV header. A 44-byte header for a single channel signed 16 bit PCM stream sampled at 16 kHz is:

|Offset|Value|
|:---|:---|
|0 - 3|"RIFF"|
|4 - 7|0|
|8 - 11|"WAVE"|
|12 - 15|"fmt"|
|16 - 19|16|
|20 - 21|1|
|22 - 23|1|
|24 - 27|16000|
|28 - 31|32000|
|32 - 33|2|
|34 - 35|16|
|36 - 39|"data"|
|40 - 43|0|

Notice that the total file size (bytes 4-7) and the size of the "data" (bytes 40-43) are set to zero. This is OK for the streaming scenario where the total size is not necessarily known upfront.

After sending the WAV (RIFF) header, the client sends chunks of the audio data. The client will typically stream fixed size chunks representing a fixed duration (e.g. stream 100ms of audio at a time).

### Signal the end of the utterance
The Translator Speech API returns the transcript and the translation of the audio stream as you're sending the audio. The final transcript, the final translation, and the translated audio will be returned to you only after the end of the utterance. In some cases you may want to force the end of the utterance. Please send 2.5 seconds of silence to force the end of the utterance.

### Final result
A final speech recognition result is generated at the end of an utterance. A result is transmitted from the service to the client using a WebSocket message of type Text. The message content is the JSON serialization of an object with the following properties:

* `type`: String constant to identify the type of result. The value is final for final results.
* `id`: String identifier assigned to the recognition result.
* `recognition`: Recognized text in the source language. The text may be an empty string in the case of a false recognition.
* `translation`: Recognized text translated in the target language.
* `audioTimeOffset`: Time offset of the start of the recognition in ticks (1 tick = 100 nanoseconds). The offset is relative to the beginning of streaming.
* `audioTimeSize`: Duration in ticks (100 nanoseconds) of the recognition.
* `audioStreamPosition`: Byte offset of the start of the recognition. The offset is relative to the beginning of the stream.
* `audioSizeBytes`: Size in bytes of the recognition.

Note that positioning of the recognition in the audio stream is not included in the results by default. The `TimingInfo` feature must be selected by the client (see `features` parameter).

A sample final result is as follows:

```
{
  type: "final"
  id: "23",
  recognition: "what was said",
  translation: "translation of what was said",
  audioStreamPosition: 319680,
  audioSizeBytes: 35840,
  audioTimeOffset: 2731600000,
  audioTimeSize: 21900000
}
```

### Partial result
Partial or intermediate speech recognition results are not streamed to the client by default. The client can use the features query parameter to request them.

A partial result is transmitted from the service to the client using a WebSocket message of type Text. The message content is the JSON serialization of an object with the following properties:

* `type`: String constant to identify the type of result. The value is partial for partial results.
* `id`: String identifier assigned to the recognition result.
* `recognition`: Recognized text in the source language.
* `translation`: Recognized text translated in the target language.
* `audioTimeOffset`: Time offset of the start of the recognition in ticks (1 tick = 100 nanoseconds). The offset is relative to the beginning of streaming.
* `audioTimeSize`: Duration in ticks (100 nanoseconds) of the recognition.
* `audioStreamPosition`: Byte offset of the start of the recognition. The offset is relative to the beginning of the stream.
* `audioSizeBytes`: Size in bytes of the recognition.

Note that positioning of the recognition in the audio stream is not included in the results by default. The TimingInfo feature must be selected by the client (see features parameter).

A sample final result is as follows:

```
{
  type: "partial"
  id: "23.2",
  recognition: "what was",
  translation: "translation of what was",
  audioStreamPosition: 319680,
  audioSizeBytes: 25840,
  audioTimeOffset: 2731600000,
  audioTimeSize: 11900000
}
```

### Text-to-speech
When the text-to-speech feature is enabled (see `features` parameter below), a final result is followed by the audio of the spoken translated text. Audio data is chunked and sent from the service to the client as a sequence of Websocket messages of type Binary. A client can detect the end of the stream by checking the FIN bit of each message. The last Binary message will have its FIN bit set to one to indicate the end of the stream. The format of the stream depends on the value of the `format` parameter.

### Closing the connection
When a client application has finished streaming audio and has received the last final result, it should close the connection by initiating the WebSocket closing handshake. There are conditions that will cause the server to terminate the connection. The following WebSocket Closed codes may be received by the client:

* `1003 - Invalid Message Type`: The server is terminating the connection because it cannot accept the data type it received. This commonly happens when incoming audio does not start with a proper header.
* `1000 - Normal closure`: The connection has closed after the request was fulfilled. The server will close the connection: when no audio is received from the client for an extended period of time; when silence is streamed for an extended period of time; when a session reaches the maximum duration allowed (approximately 90 minutes).
* `1001 - Endpoint Unavailable`: Indicates that the server will become unavailable. Client application may attempt to reconnect with a limit on the number of retries.
* `1011 - Internal Server Error`: The connection will be closed by the server because of an error on the server.

### Parameters

|Parameter|Value|Description|Parameter Type|Data Type|
|:---|:---|:---|:---|:---|
|api-version|1.0|Version of the API requested by the client. Allowed values are: `1.0`.|query	|string|
|from|(empty)	|Specifies the language of the incoming speech. The value is one of the language identifiers from the `speech` scope in the response from the Languages API.|query|string|
|to|(empty)|Specifies the language to translate the transcribed text into. The value is one of the language identifiers from the `text` scope in the response from the Languages API.|query|string|
|features|(empty)	|Comma-separated set of features selected by the client. Available features include:<ul><li>`TextToSpeech`: specifies that the service must return the translated audio of the final translated sentence.</li><li>`Partial`: specifies that the service must return intermediate recognition results while the audio is streaming to the service.</li><li>`TimingInfo`: specifies that the service must return timing information associated with each recognition.</li></ul>As an example, a client would specify  `features=partial,texttospeech` to receive partial results and text-to-speech, but no timing information. Note that final results are always streamed to the client.|query|string|
|voice|(empty)|Identifies what voice to use for text-to-speech rendering of the translated text. The value is one of the voice identifiers from the tts scope in the response from the Languages API. If a voice is not specified the system will automatically choose one when the text-to-speech feature is enabled.|query|string|
|format|(empty)|Specifies the format of the text-to-speech audio stream returned by the service. Available options are:<ul><li>`audio/wav`: Waveform audio stream. Client should use the WAV header to properly interpret the audio format. WAV audio for text-to-speech is 16 bit, single channel PCM with a sampling rate of 24kHz or 16kHz.</li><li>`audio/mp3`: MP3 audio stream.</li></ul>Default is `audio/wav`.|query|string|
|ProfanityAction	|(empty)	|Specifies how the service should handle profanities recognized in the speech. Valid actions are:<ul><li>`NoAction`: Profanities are left as is.</li><li>`Marked`: Profanities are replaced with a marker. See  `ProfanityMarker` parameter.</li><li>`Deleted`: Profanities are deleted. For example, if the word  `"jackass"` is treated as a profanity, the phrase  `"He is a jackass."` will become `"He is a .".`</li></ul>The default is Marked.|query|string|
|ProfanityMarker|(empty)	|Specifies how detected profanities are handled when `ProfanityAction` is set to `Marked`. Valid options are:<ul><li>`Asterisk`: Profanities are replaced with the string `***`. For example, if the word `"jackass"` is treated as a profanity, the phrase `"He is a jackass."` will become `"He is a ***.".`</li><li>`Tag`: Profanity are surrounded by a profanity XML tag. For example, if the word `"jackass"` is treated as a profanity, the phrase `"He is a jackass."` will become  `"He is a <profanity>jackass</profanity>."`.</li></ul>The default is `Asterisk`.|query|string|
|Authorization|(empty)	|Specifies the value of the client's bearer token. Use the prefix `Bearer` followed by the value of the `access_token` value returned by the authentication token service.|header	|string|
|Ocp-Apim-Subscription-Key|(empty)|Required if the `Authorization` header is not specified.|header|string|
|access_token|(empty)	|Alternate way to pass a valid OAuth access token. The bearer token is usually provided with header `Authorization`. Some websocket libraries do not allow client code to set headers. In such case, the client can use the `access_token` query parameter to pass a valid token. When using an access token to authenticate, if `Authorization` header is not set, then `access_token` must be set. If both header and query parameter are set, then the query parameter is ignored. Clients should only use one method to pass the token.|query|string|
|subscription-key|(empty)	|Alternate way to pass subscription key. Some websocket libraries do not allow client code to set headers. In such case, the client can use the `subscription-key` query parameter to pass a valid subscription key. When using a subscription key to authenticate, if `Ocp-Apim-Subscription-Key` header is not set, then  subscription-key must be set. If both header and query parameter are set, then the query parameter is ignored. Clients should only use one method to pass the `subscription key`.|query|string|
|X-ClientTraceId	|(empty)	|A client-generated GUID used to trace a request. For proper troubleshooting of issues, clients should provide a new value with each request and log it.<br/>Instead of using a header, this value can be passed with query parameter `X-ClientTraceId`. If both header and query parameter are set, then the query parameter is ignored.|header|string|
|X-CorrelationId|(empty)	|A client-generated identifier used to correlate multiple channels in a conversation. Multiple speech translation sessions can be created to enable conversations between users. In such scenario, all speech translation sessions use the same correlation ID to tie the channels together. This facilitates tracing and diagnostics. The identifier should conform to: `^[a-zA-Z0-9-_.]{1,64}$`<br/>Instead of using a header, this value can be passed with query parameter `X-CorrelationId`. If both header and query parameter are set, then the query parameter is ignored.|header|string|
|X-ClientVersion|(empty)	|Identifies the version of the client application. Example: "2.1.0.123".<br/>Instead of using a header, this value can be passed with query parameter `X-ClientVersion`. If both header and query parameter are set, then the query parameter is ignored.|header|string|
|X-OsPlatform|(empty)	|Identifies the name and version of the operating system the client application is running on. Examples: "Android 5.0", "iOs 8.1.3", "Windows 8.1".<br/>Instead of using a header, this value can be passed with query parameter `X-OsPlatform`. If both header and query parameter are set, then the query parameter is ignored.|header|string|

### Response messages

|HTTP Status Code|Reason|Response Model|Headers|
|:--|:--|:--|:--|
|101	|WebSocket upgrade.|Model Example Value <br/> Object {}|X-RequestId<br/>A value identifying the request for troubleshooting purposes.<br/>string|
|400	|Bad request. Check input parameters to ensure they are valid. The response object includes a more detailed description of the error.|||
|401	|Unauthorized. Ensure that credentials are set, that they are valid and that your Azure Data Market subscription is in good standing with an available balance.|||
|500	|An error occurred. If the error persists, please report it with client trace identifier (X-ClientTraceId) or request identifier (X-RequestId).|||
|503	|Server temporarily unavailable. Please retry the request. If the error persists, please report it with client trace identifier (X-ClientTraceId) or request identifier (X-RequestId).|||
