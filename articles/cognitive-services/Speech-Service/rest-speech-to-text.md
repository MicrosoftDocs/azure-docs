---
title: Speech-to-text API reference (REST) - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use the speech-to-text REST API. In this article, you'll learn about authorization options, query options, how to structure a request and receive a response.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/01/2021
ms.author: lajanuar
ms.custom: devx-track-csharp
---

# Speech-to-text REST API

Speech-to-text has two different REST APIs. Each API serves its special purpose and uses different sets of endpoints.

The Speech-to-text REST APIs are:
- [Speech-to-text REST API v3.0](#speech-to-text-rest-api-v30) is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). v3.0 is a [successor of v2.0](./migrate-v2-to-v3.md).
- [Speech-to-text REST API for short audio](#speech-to-text-rest-api-for-short-audio) is used for online transcription as an alternative to the [Speech SDK](speech-sdk.md). Requests using this API can transmit only up to 60 seconds of audio per request. 

## Speech-to-text REST API v3.0

Speech-to-text REST API v3.0 is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). If you need to communicate with the online transcription via REST, use [Speech-to-text REST API for short audio](#speech-to-text-rest-api-for-short-audio).

Use REST API v3.0 to:
- Copy models to other subscriptions in case you want colleagues to have access to a model you built, or in cases where you want to deploy a model to more than one region
- Transcribe data from a container (bulk transcription) as well as provide multiple audio file URLs
- Upload data from Azure Storage accounts through the use of a SAS Uri
- Get logs per endpoint if logs have been requested for that endpoint
- Request the manifest of the models you create, for the purpose of setting up on-premises containers

REST API v3.0 includes such features as:
- **Notifications-Webhooks**—All running processes of the service now support webhook notifications. REST API v3.0 provides the calls to enable you to register your webhooks where notifications are sent
- **Updating models behind endpoints** 
- **Model adaptation with multiple data sets**—Adapt a model using multiple data set combinations of acoustic, language, and pronunciation data
- **Bring your own storage**—Use your own storage accounts for logs, transcription files, and other data

See examples on using REST API v3.0 with the Batch transcription is [this article](batch-transcription.md).

If you are using Speech-to-text REST API v2.0, see how you can migrate to v3.0 in [this guide](./migrate-v2-to-v3.md).

See the full Speech-to-text REST API v3.0 Reference [here](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0).

## Speech-to-text REST API for short audio

As an alternative to the [Speech SDK](speech-sdk.md), the Speech service allows you to convert Speech-to-text using a REST API.
The REST API for short audio is very limited, and it should only be used in cases were the [Speech SDK](speech-sdk.md) cannot.

Before using the Speech-to-text REST API for short audio, consider the following:

* Requests that use the REST API for short audio and transmit audio directly can only contain up to 60 seconds of audio.
* The Speech-to-text REST API for short audio only returns final results. Partial results are not provided.

If sending longer audio is a requirement for your application, consider using the [Speech SDK](speech-sdk.md) or [Speech-to-text REST API v3.0](#speech-to-text-rest-api-v30).

> [!TIP]
> See [this article](sovereign-clouds.md) for Azure Government and Azure China endpoints.

[!INCLUDE [](../../../includes/cognitive-services-speech-service-rest-auth.md)]

### Regions and endpoints

The endpoint for the REST API for short audio has this format:

```
https://<REGION_IDENTIFIER>.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
```

Replace `<REGION_IDENTIFIER>` with the identifier matching the region of your subscription from this table:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

> [!NOTE]
> The language parameter must be appended to the URL to avoid receiving an 4xx HTTP error. For example, the language set to US English using the West US endpoint is: `https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`.

### Query parameters

These parameters may be included in the query string of the REST request.

| Parameter | Description | Required / Optional |
|-----------|-------------|---------------------|
| `language` | Identifies the spoken language that is being recognized. See [Supported languages](language-support.md#speech-to-text). | Required |
| `format` | Specifies the result format. Accepted values are `simple` and `detailed`. Simple results include `RecognitionStatus`, `DisplayText`, `Offset`, and `Duration`. Detailed responses include four different representations of display text. The default setting is `simple`. | Optional |
| `profanity` | Specifies how to handle profanity in recognition results. Accepted values are `masked`, which replaces profanity with asterisks, `removed`, which removes all profanity from the result, or `raw`, which includes the profanity in the result. The default setting is `masked`. | Optional |
| `cid` | When using the [Custom Speech portal](./custom-speech-overview.md) to create custom models, you can use custom models via their **Endpoint ID** found on the **Deployment** page. Use the **Endpoint ID** as the argument to the `cid` query string parameter. | Optional |

### Request headers

This table lists required and optional headers for Speech-to-text requests.

|Header| Description | Required / Optional |
|------|-------------|---------------------|
| `Ocp-Apim-Subscription-Key` | Your Speech service subscription key. | Either this header or `Authorization` is required. |
| `Authorization` | An authorization token preceded by the word `Bearer`. For more information, see [Authentication](#authentication). | Either this header or `Ocp-Apim-Subscription-Key` is required. |
| `Pronunciation-Assessment` | Specifies the parameters for showing pronunciation scores in recognition results, which assess the pronunciation quality of speech input, with indicators of accuracy, fluency, completeness, etc. This parameter is a base64 encoded json containing multiple detailed parameters. See [Pronunciation assessment parameters](#pronunciation-assessment-parameters) for how to build this header. | Optional |
| `Content-type` | Describes the format and codec of the provided audio data. Accepted values are `audio/wav; codecs=audio/pcm; samplerate=16000` and `audio/ogg; codecs=opus`. | Required |
| `Transfer-Encoding` | Specifies that chunked audio data is being sent, rather than a single file. Only use this header if chunking audio data. | Optional |
| `Expect` | If using chunked transfer, send `Expect: 100-continue`. The Speech service acknowledges the initial request and awaits additional data.| Required if sending chunked audio data. |
| `Accept` | If provided, it must be `application/json`. The Speech service provides results in JSON. Some request frameworks provide an incompatible default value. It is good practice to always include `Accept`. | Optional, but recommended. |

### Audio formats

Audio is sent in the body of the HTTP `POST` request. It must be in one of the formats in this table:

| Format | Codec | Bit rate | Sample Rate  |
|--------|-------|----------|--------------|
| WAV    | PCM   | 256 kbps | 16 kHz, mono |
| OGG    | OPUS  | 256 kpbs | 16 kHz, mono |

>[!NOTE]
>The above formats are supported through REST API for short audio and WebSocket in the Speech service. The [Speech SDK](speech-sdk.md) currently supports the WAV format with PCM codec as well as [other formats](how-to-use-codec-compressed-audio-input-streams.md).

### Pronunciation assessment parameters

This table lists required and optional parameters for pronunciation assessment.

| Parameter | Description | Required? |
|-----------|-------------|---------------------|
| ReferenceText | The text that the pronunciation will be evaluated against. | Required |
| GradingSystem | The point system for score calibration. The `FivePoint` system gives a 0-5 floating point score, and `HundredMark` gives a 0-100 floating point score. Default: `FivePoint`. | Optional |
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
> The pronunciation assessment feature currently supports `en-US` language, which is available on all [speech-to-text regions](regions.md#speech-to-text). The support for `en-GB` and `zh-CN` languages is under preview, which is available on `westus`, `eastasia` and `centralindia` regions.

### Sample request

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

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description | Possible reason |
|------------------|-------------|-----------------|
| `100` | Continue | The initial request has been accepted. Proceed with sending the rest of the data. (Used with chunked transfer) |
| `200` | OK | The request was successful; the response body is a JSON object. |
| `400` | Bad request | Language code not provided, not a supported language, invalid audio file, etc. |
| `401` | Unauthorized | Subscription key or authorization token is invalid in the specified region, or invalid endpoint. |
| `403` | Forbidden | Missing subscription key or authorization token. |

### Chunked transfer

Chunked transfer (`Transfer-Encoding: chunked`) can help reduce recognition latency. It allows the Speech service to begin processing the audio file while it is transmitted. The REST API for short audio does not provide partial or interim results.

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

### Response parameters

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
| `AccuracyScore` | Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. Word and full text level accuracy score is aggregated from phoneme level accuracy score. |
| `FluencyScore` | Fluency of the given speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words. |
| `CompletenessScore` | Completeness of the speech, determined by calculating the ratio of pronounced words to reference text input. |
| `PronScore` | Overall score indicating the pronunciation quality of the given speech. This is aggregated from `AccuracyScore`, `FluencyScore` and `CompletenessScore` with weight. |
| `ErrorType` | This value indicates whether a word is omitted, inserted or badly pronounced, compared to `ReferenceText`. Possible values are `None` (meaning no error on this word), `Omission`, `Insertion` and `Mispronunciation`. |

### Sample responses

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

- [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
- [Customize acoustic models](./how-to-custom-speech-train-model.md)
- [Customize language models](./how-to-custom-speech-train-model.md)
- [Get familiar with Batch transcription](batch-transcription.md)

