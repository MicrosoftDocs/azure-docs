---
title: How to use Batch Transcription - Speech Services
titlesuffix: Azure Cognitive Services
description: Batch transcription is ideal if you want to transcribe a large quantity of audio in storage, such as Azure Blobs. By using the dedicated REST API, you can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcriptions.
services: cognitive-services
author: PanosPeriorellis
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: panosper
---

# Why use Batch transcription?

Batch transcription is ideal if you want to transcribe a large quantity of audio in storage, such as Azure Blobs. By using the dedicated REST API, you can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcriptions.

## Prerequisites

### Subscription Key

As with all features of the Speech service, you create a subscription key from the [Azure portal](https://portal.azure.com) by following our [Get started guide](get-started.md). If you plan to get transcriptions from our baseline models, creating a key is all you need to do.

>[!NOTE]
> A standard subscription (S0) for Speech Services is required to use batch transcription. Free subscription keys (F0) will not work. For additional information, see [pricing and limits](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

### Custom models

If you plan to customize acoustic or language models, follow the steps in [Customize acoustic models](how-to-customize-acoustic-models.md) and [Customizing language models](how-to-customize-language-model.md). To use the created models in batch transcription you need their model IDs. This ID is not the endpoint ID that you find on the Endpoint Details view, it is the model ID that you can retrieve when you select the details of the models.

## The Batch Transcription API

The Batch Transcription API offers asynchronous speech-to-text transcription, along with additional features. It is a REST API that exposes methods for:

1. Creating batch processing requests
1. Query Status
1. Downloading transcriptions

> [!NOTE]
> The Batch Transcription API is ideal for call centers, which typically accumulate thousands of hours of audio. It makes it easy to transcribe large volumes of audio recordings.

### Supported formats

The Batch Transcription API supports the following formats:

| Format | Codec | Bitrate | Sample Rate |
|--------|-------|---------|-------------|
| WAV | PCM | 16-bit | 8 or 16 kHz, mono, stereo |
| MP3 | PCM | 16-bit | 8 or 16 kHz, mono, stereo |
| OGG | OPUS | 16-bit | 8 or 16 kHz, mono, stereo |

For stereo audio streams, the Batch transcription API splits the left and right channel during the transcription. The two JSON files with the result are each created from a single channel. The timestamps per utterance enable the developer to create an ordered final transcript. This sample request includes properties for profanity filtering, punctuation, and word level timestamps.

### Configuration

Configuration parameters are provided as JSON:

```json
{
  "recordingsUrl": "<URL to the Azure blob to transcribe>",
  "models": [{"Id":"<optional acoustic model ID>"},{"Id":"<optional language model ID>"}],
  "locale": "<locale to us, for example en-US>",
  "name": "<user defined name of the transcription batch>",
  "description": "<optional description of the transcription>",
  "properties": {
    "ProfanityFilterMode": "Masked",
    "PunctuationMode": "DictatedAndAutomatic",
    "AddWordLevelTimestamps" : "True",
    "AddSentiment" : "True"
  }
}
```

> [!NOTE]
> The Batch Transcription API uses a REST service for requesting transcriptions, their status, and associated results. You can use the API from any language. The next section describes how the API is used.

### Configuration properties

Use these optional properties to configure transcription:

| Parameter | Description |
|-----------|-------------|
| `ProfanityFilterMode` | Specifies how to handle profanity in recognition results. Accepted values are `none` which disables profanity filtering, `masked` which replaces profanity with asterisks, `removed` which removes all profanity from the result, or `tags` which adds "profanity" tags. The default setting is `masked`. |
| `PunctuationMode` | Specifies how to handle punctuation in recognition results. Accepted values are `none` which disables punctuation, `dictated` which implies explicit punctuation, `automatic` which lets the decoder deal with punctuation, or `dictatedandautomatic` which implies dictated punctuation marks or automatic. |
 | `AddWordLevelTimestamps` | Specifies if word level timestamps should be added to the output. Accepted values are `true` which enables word level timestamps and `false` (the default value) to disable it. |
 | `AddSentiment` | Specifies sentiment should be added to the utterance. Accepted values are `true` which enables sentiment per utterance and `false` (the default value) to disable it. |
 | `AddDiarization` | Specifies that diarization alalysis should be carried out on the input which is expected to be mono channel containing two voices. Accepted values are `true` which enables diarization and `false` (the default value) to disable it. It also requires `AddWordLevelTimestamps` to be set to true.|

### Storage

Batch transcription supports [Azure Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-overview) for reading audio and writing transcriptions to storage.

## Webhooks

Polling for transcription status may not be the most performant, or provide the best user experience. To poll for status, you can register callbacks, which will notify the client when long-running transcription tasks have completed.

For more details, see [Webhooks](webhooks.md).

## Speaker Separation (Diarization)

Diarization is the process of separating speakers in a piece of audio. Our Batch pipeline supports Diarization and is capable of recognizing two speakers on mono channel recordings.

To request that your audio transcription request is processed for diarization, you simply have to add the relevant parameter in the HTTP request as shown below.

 ```json
{
  "recordingsUrl": "<URL to the Azure blob to transcribe>",
  "models": [{"Id":"<optional acoustic model ID>"},{"Id":"<optional language model ID>"}],
  "locale": "<locale to us, for example en-US>",
  "name": "<user defined name of the transcription batch>",
  "description": "<optional description of the transcription>",
  "properties": {
    "AddWordLevelTimestamps" : "True",
    "AddDiarization" : "True"
  }
}
```

Word level timestamps would also have to be 'turned on' as the parameters in the above request indicate.

The corresponding audio will contain the speakers identified by a number (currently we support only two voices, so the speakers will be identified as 'Speaker 1 'and 'Speaker 2') followed by the transcription output.

Also note that Diarization is not available in Stereo recordings. Furthermore, all JSON output will contain the Speaker tag. If diarization is not used, it will show 'Speaker: Null' in the JSON output.

> [!NOTE]
> Diarization is available in all regions and for all locales!

## Sentiment

Sentiment is a new feature in Batch Transcription API and is an important feature in the call center domain. Customers can use the `AddSentiment` parameters to their requests to

1.	Get insights on customer satisfaction
2.	Get insight on the performance of the agents (team taking the calls)
3.	Pinpoint the exact point in time when a call took a turn in a negative direction
4.	Pinpoint what went well when turning negative calls to positive
5.	Identify what customers like and what they dislike about a product or a service

Sentiment is scored per audio segment where an audio segment is defined as the time lapse between the start of the utterance (offset) and the detection silence of end of byte stream. The entire text within that segment is used to calculate sentiment. We DO NOT calculate any aggregate sentiment values for the entire call or the entire speech of each channel. These aggregations are left to the domain owner to further apply.

Sentiment is applied on the lexical form.

A JSON output sample looks like below:

```json
{
  "AudioFileResults": [
    {
      "AudioFileName": "Channel.0.wav",
      "AudioFileUrl": null,
      "SegmentResults": [
        {
          "RecognitionStatus": "Success",
          "ChannelNumber": null,
          "Offset": 400000,
          "Duration": 13300000,
          "NBest": [
            {
              "Confidence": 0.976174,
              "Lexical": "what's the weather like",
              "ITN": "what's the weather like",
              "MaskedITN": "what's the weather like",
              "Display": "What's the weather like?",
              "Words": null,
              "Sentiment": {
                "Negative": 0.206194,
                "Neutral": 0.793785,
                "Positive": 0.0
              }
            }
          ]
        }
      ]
    }
  ]
}
```
The feature uses a Sentiment model, which is currently in Beta.

## Sample code

Complete samples are available in the [GitHub sample repository](https://aka.ms/csspeech/samples) inside the `samples/batch` subdirectory.

You have to customize the sample code with your subscription information, the service region, the SAS URI pointing to the audio file to transcribe, and model IDs in case you want to use a custom acoustic or language model.

[!code-csharp[Configuration variables for batch transcription](~/samples-cognitive-services-speech-sdk/samples/batch/csharp/program.cs#batchdefinition)]

The sample code will setup the client and submit the transcription request. It will then poll for status information and print details about the transcription progress.

[!code-csharp[Code to check batch transcription status](~/samples-cognitive-services-speech-sdk/samples/batch/csharp/program.cs#batchstatus)]

For full details about the preceding calls, see our [Swagger document](https://westus.cris.ai/swagger/ui/index). For the full sample shown here, go to [GitHub](https://aka.ms/csspeech/samples) in the `samples/batch` subdirectory.

Take note of the asynchronous setup for posting audio and receiving transcription status. The client that you create is a .NET HTTP client. There's a `PostTranscriptions` method for sending the audio file details and a `GetTranscriptions` method for receiving the results. `PostTranscriptions` returns a handle, and `GetTranscriptions` uses it to create a handle to get the transcription status.

The current sample code doesn't specify a custom model. The service uses the baseline models for transcribing the file or files. To specify the models, you can pass on the same method as the model IDs for the acoustic and the language model.

> [!NOTE]
> For baseline transcriptions, you don't need to declare the ID for the baseline models. If you only specify a language model ID (and no acoustic model ID), a matching acoustic model is automatically selected. If you only specify an acoustic model ID, a matching language model is automatically selected.

## Download the sample

You can find the sample in the `samples/batch` directory in the [GitHub sample repository](https://aka.ms/csspeech/samples).

> [!NOTE]
> Batch transcription jobs are scheduled on a best effort basis, there is no time estimate for when a job will change into the running state. Once in running state, the actual transcription is processed faster than the audio real time.

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
