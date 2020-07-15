---
title: Speech-to-text API reference (REST) - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use the speech-to-text REST API. In this article, you'll learn about authorization options, query options, how to structure a request and receive a response.
services: cognitive-services
author: yinhew
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/13/2020
ms.author: yinhew
---

# Speech-to-text REST API

As an alternative to the [Speech SDK](speech-sdk.md), the Speech service allows you to convert speech-to-text using a REST API. Each accessible endpoint is associated with a region. Your application requires a subscription key for the endpoint you plan to use. The REST API is very limited, and it should only be used in cases were the [Speech SDK](speech-sdk.md) cannot.

Before using the speech-to-text REST API, understand:

* Requests that use the REST API and transmit audio directly can only contain up to 60 seconds of audio.
* The speech-to-text REST API only returns final results. Partial results are not provided.

If sending longer audio is a requirement for your application, consider using the [Speech SDK](speech-sdk.md) or a file-based REST API, like [batch transcription](batch-transcription.md).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-rest-auth.md)]

## Regions and endpoints

The endpoint for the REST API has this format:

```
https://<REGION_IDENTIFIER>.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
```

Replace `<REGION_IDENTIFIER>` with the identifier matching the region of your subscription from this table:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

> [!NOTE]
> The language parameter must be appended to the URL to avoid receiving an 4xx HTTP error. For example, the language set to US English using the West US endpoint is: `https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`.

## Query parameters

These parameters may be included in the query string of the REST request.

| Parameter | Description | Required / Optional |
|-----------|-------------|---------------------|
| `language` | Identifies the spoken language that is being recognized. See [Supported languages](language-support.md#speech-to-text). | Required |
| `format` | Specifies the result format. Accepted values are `simple` and `detailed`. Simple results include `RecognitionStatus`, `DisplayText`, `Offset`, and `Duration`. Detailed responses include four different representations of display text. The default setting is `simple`. | Optional |
| `profanity` | Specifies how to handle profanity in recognition results. Accepted values are `masked`, which replaces profanity with asterisks, `removed`, which removes all profanity from the result, or `raw`, which includes the profanity in the result. The default setting is `masked`. | Optional |
| `cid` | When using the [Custom Speech portal](how-to-custom-speech.md) to create custom models, you can use custom models via their **Endpoint ID** found on the **Deployment** page. Use the **Endpoint ID** as the argument to the `cid` query string parameter. | Optional |

## Request headers

This table lists required and optional headers for speech-to-text requests.

|Header| Description | Required / Optional |
|------|-------------|---------------------|
| `Ocp-Apim-Subscription-Key` | Your Speech service subscription key. | Either this header or `Authorization` is required. |
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Either this header or `Ocp-Apim-Subscription-Key` is required. |
| `Pronunciation-Assessment` | Specifies the parameters for showing pronunciation scores in recognition results, which assess the pronunciation quality of speech input, with indicators of accuracy, fluency, completeness, etc. This parameter is a base64 encoded json containing multiple detailed parameters. See [Pronunciation assessment parameters](#pronunciation-assessment-parameters) for how to build this header. | Optional |
| `Content-type` | Describes the format and codec of the provided audio data. Accepted values are `audio/wav; codecs=audio/pcm; samplerate=16000` and `audio/ogg; codecs=opus`. | Required |
| `Transfer-Encoding` | Specifies that chunked audio data is being sent, rather than a single file. Only use this header if chunking audio data. | Optional |
| `Expect` | If using chunked transfer, send `Expect: 100-continue`. The Speech service acknowledges the initial request and awaits additional data.| Required if sending chunked audio data. |
| `Accept` | If provided, it must be `application/json`. The Speech service provides results in JSON. Some request frameworks provide an incompatible default value. It is good practice to always include `Accept`. | Optional, but recommended. |

## Audio formats

Audio is sent in the body of the HTTP `POST` request. It must be in one of the formats in this table:

| Format | Codec | Bit rate | Sample Rate  |
|--------|-------|----------|--------------|
| WAV    | PCM   | 256 kbps | 16 kHz, mono |
| OGG    | OPUS  | 256 kpbs | 16 kHz, mono |

>[!NOTE]
>The above formats are supported through REST API and WebSocket in the Speech service. The [Speech SDK](speech-sdk.md) currently supports the WAV format with PCM codec as well as [other formats](how-to-use-codec-compressed-audio-input-streams.md).

## Pronunciation assessment parameters

This table lists required and optional parameters for pronunciation assessment.

| Parameter | Description | Required / Optional |
|-----------|-------------|---------------------|
| ReferenceText | The text that the pronunciation will be evaluated against. | Required |
| GradingSystem | The point system for score calibration. Accepted values are `FivePoint` and `HundredMark`. The default setting is `FivePoint`. | Optional |
| Granularity | The evaluation granularity. Accepted values are `Phoneme`, which shows the score on the full text, word and phoneme level, `Word`, which shows the score on the full text and word level, `FullText`, which shows the score on the full text level only. The default setting is `Phoneme`. | Optional |
| Dimension | Defines the output criteria. Accepted values are `Basic`, which shows the accuracy score only, `Comprehensive` shows scores on more dimensions (e.g. fluency score and completeness score on the full text level, error type on word level). Check [Response parameters](#response-parameters) to see definitions of different score dimensions and word error types. The default setting is `Basic`. | Optional |
| EnableMiscue | Enables miscue calculation. With this enabled, the pronounced words will be compared to the reference text, and will be marked with omission/insertion based on the comparison. Accepted values are `False` and `True`. The default setting is `False`. | Optional |
| ScenarioId | A GUID indicating a customized point system. | Optional |

Below is an example JSON containing the pronunciation assessment parameters:

```json
{
  "ReferenceText": "Good morning.",
  "GradingSystem": "HundredMark",
  "Granularity": "FullText",
  "Dimension": "Comprehensive"
}
```

The following sample code shows how to build the pronunciation assessment parameters into the `Pronunciation-Assessment` header:

```csharp
var pronAssessmentParamsJson = $"{{\"ReferenceText\":\"Good morning.\",\"GradingSystem\":\"HundredMark\",\"Granularity\":\"FullText\",\"Dimension\":\"Comprehensive\"}}";
var pronAssessmentParamsBytes = Encoding.UTF8.GetBytes(pronAssessmentParamsJson);
var pronAssessmentHeader = Convert.ToBase64String(pronAssessmentParamsBytes);
```

We strongly recommend streaming (chunked) uploading while posting the audio data, which can significantly reduce the latency. See [sample code in different programming languages](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/PronunciationAssessment) for how to enable streaming.

>[!NOTE]
>The pronunciation assessment feature is currently only available on `westus`, `eastasia` and `centralindia` regions. And this feature is currently only available on `en-US` language.

## Sample request

The sample below includes the hostname and required headers. It's important to note that the service also expects audio data, which is not included in this sample. As mentioned earlier, chunking is recommended, however, not required.

```HTTP
POST speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codecs=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: westus.stt.speech.microsoft.com
Transfer-Encoding: chunked
Expect: 100-continue
```

To enable pronunciation assessment, you can add below header. See [Pronunciation assessment parameters](#pronunciation-assessment-parameters) for how to build this header.

```HTTP
Pronunciation-Assessment: eyJSZWZlcm...
```

## HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| `100` | Continue | The initial request has been accepted. Proceed with sending the rest of the data. (Used with chunked transfer) |
| `200` | OK | The request was successful; the response body is a JSON object. |
| `400` | Bad request | Language code not provided, not a supported language, invalid audio file, etc. |
| `401` | Unauthorized | Subscription key or authorization token is invalid in the specified region, or invalid endpoint. |
| `403` | Forbidden | Missing subscription key or authorization token. |

## Chunked transfer

Chunked transfer (`Transfer-Encoding: chunked`) can help reduce recognition latency. It allows the Speech service to begin processing the audio file while it is transmitted. The REST API does not provide partial or interim results.

This code sample shows how to send audio in chunks. Only the first chunk should contain the audio file's header. `request` is an `HttpWebRequest` object connected to the appropriate REST endpoint. `audioFile` is the path to an audio file on disk.

```csharp
var request = (HttpWebRequest)HttpWebRequest.Create(requestUri);
request.SendChunked = true;
request.Accept = @"application/json;text/xml";
request.Method = "POST";
request.ProtocolVersion = HttpVersion.Version11;
request.Host = host;
request.ContentType = @"audio/wav; codecs=audio/pcm; samplerate=16000";
request.Headers["Ocp-Apim-Subscription-Key"] = "YOUR_SUBSCRIPTION_KEY";
request.AllowWriteStreamBuffering = false;

using (var fs = new FileStream(audioFile, FileMode.Open, FileAccess.Read))
{
    // Open a request stream and write 1024 byte chunks in the stream one at a time.
    byte[] buffer = null;
    int bytesRead = 0;
    using (var requestStream = request.GetRequestStream())
    {
        // Read 1024 raw bytes from the input audio file.
        buffer = new Byte[checked((uint)Math.Min(1024, (int)fs.Length))];
        while ((bytesRead = fs.Read(buffer, 0, buffer.Length)) != 0)
        {
            requestStream.Write(buffer, 0, bytesRead);
        }

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

The `detailed` format includes additional forms of recognized results.
When using the `detailed` format, `DisplayText` is provided as `Display` for each result in the `NBest` list.

The object in the `NBest` list can include:

| Parameter | Description |
|-----------|-------------|
| `Confidence` | The confidence score of the entry from 0.0 (no confidence) to 1.0 (full confidence) |
| `Lexical` | The lexical form of the recognized text: the actual words recognized. |
| `ITN` | The inverse-text-normalized ("canonical") form of the recognized text, with phone numbers, numbers, abbreviations ("doctor smith" to "dr smith"), and other transformations applied. |
| `MaskedITN` | The ITN form with profanity masking applied, if requested. |
| `Display` | The display form of the recognized text, with punctuation and capitalization added. This parameter is the same as `DisplayText` provided when format is set to `simple`. |
| `AccuracyScore` | The score indicating the pronunciation accuracy of the given speech. |
| `FluencyScore` | The score indicating the fluency of the given speech. |
| `CompletenessScore` | The score indicating the completeness of the given speech by calculating the ratio of pronounced words towards entire input. |
| `PronScore` | The overall score indicating the pronunciation quality of the given speech. This is calculated from `AccuracyScore`, `FluencyScore` and `CompletenessScore` with weight. |
| `ErrorType` | This value indicates whether a word is omitted, inserted or badly pronounced, compared to `ReferenceText`. Possible values are `None` (meaning no error on this word), `Omission`, `Insertion` and `Mispronunciation`. |

## Sample responses

A typical response for `simple` recognition:

```json
{
  "RecognitionStatus": "Success",
  "DisplayText": "Remind me to buy 5 pencils.",
  "Offset": "1236645672289",
  "Duration": "1236645672289"
}
```

A typical response for `detailed` recognition:

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
      }
  ]
}
```

A typical response for recognition with pronunciation assessment:

```json
{
  "RecognitionStatus": "Success",
  "Offset": "400000",
  "Duration": "11000000",
  "NBest": [
      {
        "Confidence" : "0.87",
        "Lexical" : "good morning",
        "ITN" : "good morning",
        "MaskedITN" : "good morning",
        "Display" : "Good morning.",
        "PronScore" : 84.4,
        "AccuracyScore" : 100.0,
        "FluencyScore" : 74.0,
        "CompletenessScore" : 100.0,
        "Words": [
            {
              "Word" : "Good",
              "AccuracyScore" : 100.0,
              "ErrorType" : "None",
              "Offset" : 500000,
              "Duration" : 2700000
            },
            {
              "Word" : "morning",
              "AccuracyScore" : 100.0,
              "ErrorType" : "None",
              "Offset" : 5300000,
              "Duration" : 900000
            }
        ]
      }
  ]
}
```

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
