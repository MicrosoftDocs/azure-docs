---
title: Speech-to-text API reference (REST) - Speech Services
titleSuffix: Azure Cognitive Services
description: Learn how to use the speech-to-text REST API. In this article, you'll learn about authorization options, query options, how to structure a request and receive a response.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: erhopf
---

# Speech-to-text REST API

As an alternative to the [Speech SDK](speech-sdk.md), Speech Services allow you to convert speech-to-text using a REST API. Each accessible endpoint is associated with a region. Your application requires a subscription key for the endpoint you plan to use.

Before using the speech-to-text REST API, understand:
* Requests that use the REST API can only contain 10 seconds of recorded audio.
* The speech-to-text REST API only returns final results. Partial results are not provided.

If sending longer audio is a requirement for your application, consider using the [Speech SDK](speech-sdk.md) or [batch transcription](batch-transcription.md).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-rest-auth.md)]

## Regions and endpoints

These regions are supported for speech-to-text transcription using the REST API. Make sure that you select the endpoint that matches your subscription region.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-speech-to-text.md)]

## Query parameters

These parameters may be included in the query string of the REST request.

| Parameter | Description | Required / Optional |
|-----------|-------------|---------------------|
| `language` | Identifies the spoken language that is being recognized. See [Supported languages](language-support.md#speech-to-text). | Required |
| `format` | Specifies the result format. Accepted values are `simple` and `detailed`. Simple results include `RecognitionStatus`, `DisplayText`, `Offset`, and `Duration`. Detailed responses include multiple results with confidence values and four different representations. The default setting is `simple`. | Optional |
| `profanity` | Specifies how to handle profanity in recognition results. Accepted values are `masked`, which replaces profanity with asterisks, `removed`, which remove all profanity from the result, or `raw`, which includes the profanity in the result. The default setting is `masked`. | Optional |

## Request headers

This table lists required and optional headers for speech-to-text requests.

|Header| Description | Required / Optional |
|------|-------------|---------------------|
| `Ocp-Apim-Subscription-Key` | Your Speech Services subscription key. | Either this header or `Authorization` is required. |
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Either this header or `Ocp-Apim-Subscription-Key` is required. |
| `Content-type` | Describes the format and codec of the provided audio data. Accepted values are `audio/wav; codecs=audio/pcm; samplerate=16000` and `audio/ogg; codecs=opus`. | Required |
| `Transfer-Encoding` | Specifies that chunked audio data is being sent, rather than a single file. Only use this header if chunking audio data. | Optional |
| `Expect` | If using chunked transfer, send `Expect: 100-continue`. The Speech Services acknowledge the initial request and awaits additional data.| Required if sending chunked audio data. |
| `Accept` | If provided, it must be `application/json`. The Speech Services provide results in JSON. Some Web request frameworks provide an incompatible default value if you do not specify one, so it is good practice to always include `Accept`. | Optional, but recommended. |

## Audio formats

Audio is sent in the body of the HTTP `POST` request. It must be in one of the formats in this table:

| Format | Codec | Bitrate | Sample Rate |
|--------|-------|---------|-------------|
| WAV | PCM | 16-bit | 16 kHz, mono |
| OGG | OPUS | 16-bit | 16 kHz, mono |

>[!NOTE]
>The above formats are supported through REST API and WebSocket in the Speech Services. The [Speech SDK](speech-sdk.md) currently only supports the WAV format with PCM codec.

## Sample request

This is a typical HTTP request. The sample below includes the hostname and required headers. It's important to note that the service also expects audio data, which is not included in this sample. As mentioned earlier, chunking is recommended, however, not required.

```HTTP
POST speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codecs=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: westus.stt.speech.microsoft.com
Transfer-Encoding: chunked
Expect: 100-continue
```

## HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| 100 | Continue | The initial request has been accepted. Proceed with sending the rest of the data. (Used with chunked transfer.) |
| 200 | OK | The request was successful; the response body is a JSON object. |
| 400 | Bad request | Language code not provided or is not a supported language; invalid audio file. |
| 401 | Unauthorized | Subscription key or authorization token is invalid in the specified region, or invalid endpoint. |
| 403 | Forbidden | Missing subscription key or authorization token. |

## Chunked transfer

Chunked transfer (`Transfer-Encoding: chunked`) can help reduce recognition latency because it allows the Speech Services to begin processing the audio file while it's being transmitted. The REST API does not provide partial or interim results. This option is intended solely to improve responsiveness.

This code sample shows how to send audio in chunks. Only the first chunk should contain the audio file's header. `request` is an HTTPWebRequest object connected to the appropriate REST endpoint. `audioFile` is the path to an audio file on disk.

```csharp

    HttpWebRequest request = null;
    request = (HttpWebRequest)HttpWebRequest.Create(requestUri);
    request.SendChunked = true;
    request.Accept = @"application/json;text/xml";
    request.Method = "POST";
    request.ProtocolVersion = HttpVersion.Version11;
    request.Host = host;
    request.ContentType = @"audio/wav; codecs=audio/pcm; samplerate=16000";
    request.Headers["Ocp-Apim-Subscription-Key"] = args[1];
    request.AllowWriteStreamBuffering = false;

using (fs = new FileStream(audioFile, FileMode.Open, FileAccess.Read))
{
    /*
    * Open a request stream and write 1024 byte chunks in the stream one at a time.
    */
    byte[] buffer = null;
    int bytesRead = 0;
    using (Stream requestStream = request.GetRequestStream())
    {
        /*
        * Read 1024 raw bytes from the input audio file.
        */
        buffer = new Byte[checked((uint)Math.Min(1024, (int)fs.Length))];
        while ((bytesRead = fs.Read(buffer, 0, buffer.Length)) != 0)
        {
            requestStream.Write(buffer, 0, bytesRead);
        }

        // Flush
        requestStream.Flush();
    }
}
```

## Response parameters

Results are provided as JSON. The `simple` format includes these top-level fields.

| Parameter | Description  |
|-----------|--------------|
|`RecognitionStatus`|Status, such as `Success` for successful recognition. See next table.|
|`DisplayText`|The recognized text after capitalization, punctuation, inverse text normalization (conversion of spoken text to shorter forms, such as 200 for "two hundred" or "Dr. Smith" for "doctor smith"), and profanity masking. Present only on success.|
|`Offset`|The time (in 100-nanosecond units) at which the recognized speech begins in the audio stream.|
|`Duration`|The duration (in 100-nanosecond units) of the recognized speech in the audio stream.|

The `RecognitionStatus` field may contain these values:

| Status | Description |
|--------|-------------|
| `Success` | The recognition was successful and the `DisplayText` field is present. |
| `NoMatch` | Speech was detected in the audio stream, but no words from the target language were matched. Usually means the recognition language is a different language from the one the user is speaking. |
| `InitialSilenceTimeout` | The start of the audio stream contained only silence, and the service timed out waiting for speech. |
| `BabbleTimeout` | The start of the audio stream contained only noise, and the service timed out waiting for speech. |
| `Error` | The recognition service encountered an internal error and could not continue. Try again if possible. |

> [!NOTE]
> If the audio consists only of profanity, and the `profanity` query parameter is set to `remove`, the service does not return a speech result.

The `detailed` format includes the same data as the `simple` format, along with `NBest`, a list of alternative interpretations of the same recognition result. These results are ranked from most likely to least likely. The first entry is the same as the main recognition result.  When using the `detailed` format, `DisplayText` is provided as `Display` for each result in the `NBest` list.

Each object in the `NBest` list includes:

| Parameter | Description |
|-----------|-------------|
| `Confidence` | The confidence score of the entry from 0.0 (no confidence) to 1.0 (full confidence) |
| `Lexical` | The lexical form of the recognized text: the actual words recognized. |
| `ITN` | The inverse-text-normalized ("canonical") form of the recognized text, with phone numbers, numbers, abbreviations ("doctor smith" to "dr smith"), and other transformations applied. |
| `MaskedITN` | The ITN form with profanity masking applied, if requested. |
| `Display` | The display form of the recognized text, with punctuation and capitalization added. This parameter is the same as `DisplayText` provided when format is set to `simple`. |

## Sample responses

This is a typical response for `simple` recognition.

```json
{
  "RecognitionStatus": "Success",
  "DisplayText": "Remind me to buy 5 pencils.",
  "Offset": "1236645672289",
  "Duration": "1236645672289"
}
```

This is a typical response for `detailed` recognition.

```json
{
  "RecognitionStatus": "Success",
  "Offset": "1236645672289",
  "Duration": "1236645672289",
  "NBest": [
      {
        "Confidence" : "0.87",
        "Lexical" : "remind me to buy five pencils",
        "ITN" : "remind me to buy 5 pencils",
        "MaskedITN" : "remind me to buy 5 pencils",
        "Display" : "Remind me to buy 5 pencils.",
      },
      {
        "Confidence" : "0.54",
        "Lexical" : "rewind me to buy five pencils",
        "ITN" : "rewind me to buy 5 pencils",
        "MaskedITN" : "rewind me to buy 5 pencils",
        "Display" : "Rewind me to buy 5 pencils.",
      }
  ]
}
```

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
