---
title: Speech-to-text API reference (REST) - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use REST APIs to convert speech to text.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/01/2021
ms.author: eur
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Speech-to-text REST APIs

Speech-to-text has two REST APIs. Each API serves a special purpose and uses its own set of endpoints. In this article, you learn how to use those APIs, including authorization options, query options, how to structure a request, and how to interpret a response.  

## Speech-to-text REST API v3.0

Speech-to-text REST API v3.0 is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). v3.0 is a [successor of v2.0](./migrate-v2-to-v3.md). If you need to communicate with the online transcription via REST, use the [speech-to-text REST API for short audio](#speech-to-text-rest-api-for-short-audio).

Use REST API v3.0 to:
- Copy models to other subscriptions if you want colleagues to have access to a model that you built, or if you want to deploy a model to more than one region.
- Transcribe data from a container (bulk transcription) and provide multiple URLs for audio files.
- Upload data from Azure storage accounts by using a shared access signature (SAS) URI.
- Get logs for each endpoint if logs have been requested for that endpoint.
- Request the manifest of the models that you create, to set up on-premises containers.

REST API v3.0 includes such features as:
- **Webhook notifications**: All running processes of the service now support webhook notifications. REST API v3.0 provides the calls to enable you to register your webhooks where notifications are sent.
- **Updating models behind endpoints** 
- **Model adaptation with multiple datasets**: Adapt a model by using multiple dataset combinations of acoustic, language, and pronunciation data.
- **Bring your own storage**: Use your own storage accounts for logs, transcription files, and other data.

For examples of using REST API v3.0 with batch transcription, see [How to use batch transcription](batch-transcription.md).

For information about migrating to the latest version of the speech-to-text REST API, see [Migrate code from v2.0 to v3.0 of the REST API](./migrate-v2-to-v3.md).

You can find the full speech-to-text REST API v3.0 reference on the [Microsoft developer portal](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0).

## Speech-to-text REST API for short audio

As an alternative to the [Speech SDK](speech-sdk.md), the Speech service allows you to convert speech to text by using the [REST API for short audio](#speech-to-text-rest-api-for-short-audio).
This API is very limited. Use it only in cases where you can't use the Speech SDK.

Before you use the speech-to-text REST API for short audio, consider the following limitations:

* Requests that use the REST API for short audio and transmit audio directly can contain no more than 60 seconds of audio.
* The REST API for short audio returns only final results. It doesn't provide partial results.

If sending longer audio is a requirement for your application, consider using the Speech SDK or [speech-to-text REST API v3.0](#speech-to-text-rest-api-v30).

> [!TIP]
> For Azure Government and Azure China endpoints, see [this article about sovereign clouds](sovereign-clouds.md).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-rest-auth.md)]

### Regions and endpoints

The endpoint for the REST API for short audio has this format:

```
https://<REGION_IDENTIFIER>.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
```

Replace `<REGION_IDENTIFIER>` with the identifier that matches the region of your subscription from this table:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

> [!NOTE]
> You must append the language parameter to the URL to avoid receiving a 4xx HTTP error. For example, the language set to US English via the West US endpoint is: `https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`.

### Query parameters

These parameters might be included in the query string of the REST request:

| Parameter | Description | Required or optional |
|-----------|-------------|---------------------|
| `language` | Identifies the spoken language that's being recognized. See [Supported languages](language-support.md#speech-to-text). | Required |
| `format` | Specifies the result format. Accepted values are `simple` and `detailed`. Simple results include `RecognitionStatus`, `DisplayText`, `Offset`, and `Duration`. Detailed responses include four different representations of display text. The default setting is `simple`. | Optional |
| `profanity` | Specifies how to handle profanity in recognition results. Accepted values are: <br><br>`masked`, which replaces profanity with asterisks. <br>`removed`, which removes all profanity from the result. <br>`raw`, which includes profanity in the result. <br><br>The default setting is `masked`. | Optional |
| `cid` | When you're using the [Custom Speech portal](./custom-speech-overview.md) to create custom models, you can take advantage of the **Endpoint ID** value from the **Deployment** page. Use the **Endpoint ID** value as the argument to the `cid` query string parameter. | Optional |

### Request headers

This table lists required and optional headers for speech-to-text requests:

|Header| Description | Required or optional |
|------|-------------|---------------------|
| `Ocp-Apim-Subscription-Key` | Your subscription key for the Speech service. | Either this header or `Authorization` is required. |
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Either this header or `Ocp-Apim-Subscription-Key` is required. |
| `Pronunciation-Assessment` | Specifies the parameters for showing pronunciation scores in recognition results. These scores assess the pronunciation quality of speech input, with indicators like accuracy, fluency, and completeness. <br><br>This parameter is a Base64-encoded JSON that contains multiple detailed parameters. To learn how to build this header, see [Pronunciation assessment parameters](#pronunciation-assessment-parameters). | Optional |
| `Content-type` | Describes the format and codec of the provided audio data. Accepted values are `audio/wav; codecs=audio/pcm; samplerate=16000` and `audio/ogg; codecs=opus`. | Required |
| `Transfer-Encoding` | Specifies that chunked audio data is being sent, rather than a single file. Use this header only if you're chunking audio data. | Optional |
| `Expect` | If you're using chunked transfer, send `Expect: 100-continue`. The Speech service acknowledges the initial request and awaits additional data.| Required if you're sending chunked audio data. |
| `Accept` | If provided, it must be `application/json`. The Speech service provides results in JSON. Some request frameworks provide an incompatible default value. It's good practice to always include `Accept`. | Optional, but recommended. |

### Audio formats

Audio is sent in the body of the HTTP `POST` request. It must be in one of the formats in this table:

| Format | Codec | Bit rate | Sample rate  |
|--------|-------|----------|--------------|
| WAV    | PCM   | 256 kbps | 16 kHz, mono |
| OGG    | OPUS  | 256 kpbs | 16 kHz, mono |

>[!NOTE]
>The preceding formats are supported through the REST API for short audio and WebSocket in the Speech service. The [Speech SDK](speech-sdk.md) currently supports the WAV format with PCM codec as well as [other formats](how-to-use-codec-compressed-audio-input-streams.md).

### Pronunciation assessment parameters

This table lists required and optional parameters for pronunciation assessment:

| Parameter | Description | Required or optional |
|-----------|-------------|---------------------|
| `ReferenceText` | The text that the pronunciation will be evaluated against. | Required |
| `GradingSystem` | The point system for score calibration. The `FivePoint` system gives a 0-5 floating point score, and `HundredMark` gives a 0-100 floating point score. Default: `FivePoint`. | Optional |
| `Granularity` | The evaluation granularity. Accepted values are:<br><br> `Phoneme`, which shows the score on the full-text, word, and phoneme levels.<br>`Word`, which shows the score on the full-text and word levels. <br>`FullText`, which shows the score on the full-text level only.<br><br> The default setting is `Phoneme`. | Optional |
| `Dimension` | Defines the output criteria. Accepted values are:<br><br> `Basic`, which shows the accuracy score only. <br>`Comprehensive`, which shows scores on more dimensions (for example, fluency score and completeness score on the full-text level, and error type on the word level).<br><br> To see definitions of different score dimensions and word error types, see [Response parameters](#response-parameters). The default setting is `Basic`. | Optional |
| `EnableMiscue` | Enables miscue calculation. With this parameter enabled, the pronounced words will be compared to the reference text. They'll be marked with omission or insertion based on the comparison. Accepted values are `False` and `True`. The default setting is `False`. | Optional |
| `ScenarioId` | A GUID that indicates a customized point system. | Optional |

Here's example JSON that contains the pronunciation assessment parameters:

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

We strongly recommend streaming (chunked) uploading while you're posting the audio data, which can significantly reduce the latency. To learn how to enable streaming, see the [sample code in various programming languages](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/PronunciationAssessment).

>[!NOTE]
> The pronunciation assessment feature currently supports the `en-US` language, which is available on all [speech-to-text regions](regions.md#speech-to-text). Support for `en-GB` and `zh-CN` languages is under preview.

### Sample request

The following sample includes the host name and required headers. It's important to note that the service also expects audio data, which is not included in this sample. As mentioned earlier, chunking is recommended but not required.

```HTTP
POST speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed HTTP/1.1
Accept: application/json;text/xml
Content-Type: audio/wav; codecs=audio/pcm; samplerate=16000
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: westus.stt.speech.microsoft.com
Transfer-Encoding: chunked
Expect: 100-continue
```

To enable pronunciation assessment, you can add the following header. To learn how to build this header, see [Pronunciation assessment parameters](#pronunciation-assessment-parameters).

```HTTP
Pronunciation-Assessment: eyJSZWZlcm...
```

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reasons |
|------------------|-------------|-----------------|
| 100 | Continue | The initial request has been accepted. Proceed with sending the rest of the data. (This code is used with chunked transfer.) |
| 200 | OK | The request was successful. The response body is a JSON object. |
| 400 | Bad request | The language code wasn't provided, the language isn't supported, or the audio file is invalid (for example). |
| 401 | Unauthorized | A subscription key or an authorization token is invalid in the specified region, or an endpoint is invalid. |
| 403 | Forbidden | A subscription key or authorization token is missing. |

### Chunked transfer

Chunked transfer (`Transfer-Encoding: chunked`) can help reduce recognition latency. It allows the Speech service to begin processing the audio file while it's transmitted. The REST API for short audio does not provide partial or interim results.

The following code sample shows how to send audio in chunks. Only the first chunk should contain the audio file's header. `request` is an `HttpWebRequest` object that's connected to the appropriate REST endpoint. `audioFile` is the path to an audio file on disk.

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
    // Open a request stream and write 1,024-byte chunks in the stream one at a time.
    byte[] buffer = null;
    int bytesRead = 0;
    using (var requestStream = request.GetRequestStream())
    {
        // Read 1,024 raw bytes from the input audio file.
        buffer = new Byte[checked((uint)Math.Min(1024, (int)fs.Length))];
        while ((bytesRead = fs.Read(buffer, 0, buffer.Length)) != 0)
        {
            requestStream.Write(buffer, 0, bytesRead);
        }

        requestStream.Flush();
    }
}
```

### Response parameters

Results are provided as JSON. The `simple` format includes the following top-level fields:

| Parameter | Description  |
|-----------|--------------|
|`RecognitionStatus`|Status, such as `Success` for successful recognition. See the next table.|
|`DisplayText`|The recognized text after capitalization, punctuation, inverse text normalization, and profanity masking. Present only on success. Inverse text normalization is conversion of spoken text to shorter forms, such as 200 for "two hundred" or "Dr. Smith" for "doctor smith."|
|`Offset`|The time (in 100-nanosecond units) at which the recognized speech begins in the audio stream.|
|`Duration`|The duration (in 100-nanosecond units) of the recognized speech in the audio stream.|

The `RecognitionStatus` field might contain these values:

| Status | Description |
|--------|-------------|
| `Success` | The recognition was successful, and the `DisplayText` field is present. |
| `NoMatch` | Speech was detected in the audio stream, but no words from the target language were matched. This status usually means that the recognition language is different from the language that the user is speaking. |
| `InitialSilenceTimeout` | The start of the audio stream contained only silence, and the service timed out while waiting for speech. |
| `BabbleTimeout` | The start of the audio stream contained only noise, and the service timed out while waiting for speech. |
| `Error` | The recognition service encountered an internal error and could not continue. Try again if possible. |

> [!NOTE]
> If the audio consists only of profanity, and the `profanity` query parameter is set to `remove`, the service does not return a speech result.

The `detailed` format includes additional forms of recognized results.
When you're using the `detailed` format, `DisplayText` is provided as `Display` for each result in the `NBest` list.

The object in the `NBest` list can include:

| Parameter | Description |
|-----------|-------------|
| `Confidence` | The confidence score of the entry, from 0.0 (no confidence) to 1.0 (full confidence). |
| `Lexical` | The lexical form of the recognized text: the actual words recognized. |
| `ITN` | The inverse-text-normalized (ITN) or canonical form of the recognized text, with phone numbers, numbers, abbreviations ("doctor smith" to "dr smith"), and other transformations applied. |
| `MaskedITN` | The ITN form with profanity masking applied, if requested. |
| `Display` | The display form of the recognized text, with punctuation and capitalization added. This parameter is the same as what `DisplayText` provides when the format is set to `simple`. |
| `AccuracyScore` | Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. The accuracy score at the word and full-text levels is aggregated from the accuracy score at the phoneme level. |
| `FluencyScore` | Fluency of the provided speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words. |
| `CompletenessScore` | Completeness of the speech, determined by calculating the ratio of pronounced words to reference text input. |
| `PronScore` | Overall score that indicates the pronunciation quality of the provided speech. This score is aggregated from `AccuracyScore`, `FluencyScore`, and `CompletenessScore` with weight. |
| `ErrorType` | Value that indicates whether a word is omitted, inserted, or badly pronounced, compared to `ReferenceText`. Possible values are `None` (meaning no error on this word), `Omission`, `Insertion`, and `Mispronunciation`. |

### Sample responses

Here's a typical response for `simple` recognition:

```json
{
  "RecognitionStatus": "Success",
  "DisplayText": "Remind me to buy 5 pencils.",
  "Offset": "1236645672289",
  "Duration": "1236645672289"
}
```

Here's a typical response for `detailed` recognition:

```json
{
  "RecognitionStatus": "Success",
  "Offset": "1236645672289",
  "Duration": "1236645672289",
  "NBest": [
    {
      "Confidence": 0.9052885,
      "Display": "What's the weather like?",
      "ITN": "what's the weather like",
      "Lexical": "what's the weather like",
      "MaskedITN": "what's the weather like"
    },
    {
      "Confidence": 0.92459863,
      "Display": "what is the weather like",
      "ITN": "what is the weather like",
      "Lexical": "what is the weather like",
      "MaskedITN": "what is the weather like"
    }
  ]
}
```

Here's a typical response for recognition with pronunciation assessment:

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

- [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
- [Customize acoustic models](./how-to-custom-speech-train-model.md)
- [Customize language models](./how-to-custom-speech-train-model.md)
- [Get familiar with batch transcription](batch-transcription.md)

