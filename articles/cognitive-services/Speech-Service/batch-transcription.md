---
title: What is batch transcription - Speech service
titleSuffix: Azure Cognitive Services
description: Batch transcription is ideal if you want to transcribe a large quantity of audio in storage, such as Azure Blobs. By using the dedicated REST API, you can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcriptions.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/18/2020
ms.author: wolfma
---

# What is batch transcription?

Batch transcription is a set of REST API operations that enables you to transcribe a large amount of audio in storage. You can point to audio files with a shared access signature (SAS) URI and asynchronously receive transcription results. With the new v3.0 API, you have the choice of transcribing one or more audio files, or process a whole storage container.

Asynchronous speech-to-text transcription is just one of the features. You can use batch transcription REST APIs to call the following methods:



|    Batch Transcription Operation                                             |    Method    |    REST API Call                                   |
|------------------------------------------------------------------------------|--------------|----------------------------------------------------|
|    Creates a new transcription.                                              |    POST      |    speechtotext/v3.0/transcriptions            |
|    Retrieves a list of transcriptions for the authenticated subscription.    |    GET       |    speechtotext/v3.0/transcriptions            |
|    Gets a list of supported locales for offline transcriptions.              |    GET       |    speechtotext/v3.0/transcriptions/locales    |
|    Updates the mutable details of the transcription identified by its ID.    |    PATCH     |    speechtotext/v3.0/transcriptions/{id}       |
|    Deletes the specified transcription task.                                 |    DELETE    |    speechtotext/v3.0/transcriptions/{id}       |
|    Gets the transcription identified by the given ID.                        |    GET       |    speechtotext/v3.0/transcriptions/{id}       |
|    Gets the result files of the transcription identified by the given ID.    |    GET       |    speechtotext/v3.0/transcriptions/{id}/files |




You can review and test the detailed API, which is available as a [Swagger document](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0).

Batch transcription jobs are scheduled on a best effort basis. Currently there is no estimate for when a job changes into the running state. Under normal system load, it should happen within minutes. Once in the running state, the actual transcription is processed faster than the audio real time.

Next to the easy-to-use API, you don't need to deploy custom endpoints, and you don't have any concurrency requirements to observe.

## Prerequisites

### Subscription Key

As with all features of the Speech service, you create a subscription key from the [Azure portal](https://portal.azure.com) by following our [Get started guide](get-started.md).

>[!NOTE]
> A standard subscription (S0) for Speech service is required to use batch transcription. Free subscription keys (F0) don't work. For more information, see [pricing and limits](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

### Custom models

If you plan to customize models, follow the steps in [Acoustic customization](how-to-customize-acoustic-models.md) and [Language customization](how-to-customize-language-model.md). To use the created models in batch transcription, you need their model location. You can retrieve the model location when you inspect the details of the model (`self` property). A deployed custom endpoint is *not needed* for the batch transcription service.

## The Batch Transcription API

### Supported formats

The Batch Transcription API supports the following formats:

| Format | Codec | Bitrate | Sample Rate                     |
|--------|-------|---------|---------------------------------|
| WAV    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| MP3    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| OGG    | OPUS  | 16-bit  | 8 kHz or 16 kHz, mono or stereo |

For stereo audio streams, the left and right channels are split during the transcription. For each channel, a JSON result file is being created. The timestamps generated per utterance enable the developer to create an ordered final transcript.

### Configuration

Configuration parameters are provided as JSON (one or more individual files):

```json
{
  "contentUrls": [
    "<URL to an audio file to transcribe>",
  ],
  "properties": {
    "wordLevelTimestampsEnabled": true
  },
  "locale": "en-US",
  "displayName": "Transcription of file using default model for en-US"
}
```

Configuration parameters are provided as JSON (processing a whole storage container):

```json
{
  "contentContainerUrl": "<SAS URL to the Azure blob container to transcribe>",
  "properties": {
    "wordLevelTimestampsEnabled": true
  },
  "locale": "en-US",
  "displayName": "Transcription of container using default model for en-US"
}
```

To use custom trained models in batch transcriptions they can be referenced like shown below:

```json
{
  "contentUrls": [
    "<URL to an audio file to transcribe>",
  ],
  "properties": {
    "wordLevelTimestampsEnabled": true
  },
  "locale": "en-US",
  "model": {
    "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/models/{id}"
  },
  "displayName": "Transcription of file using default model for en-US"
}
```


### Configuration properties

Use these optional properties to configure transcription:

:::row:::
   :::column span="1":::
      **Parameter**
   :::column-end:::
   :::column span="2":::
      **Description**
:::row-end:::
:::row:::
   :::column span="1":::
      `profanityFilterMode`
   :::column-end:::
   :::column span="2":::
      Specifies how to handle profanity in recognition results. Accepted values are `None` to disable profanity filtering, `Masked` to replace profanity with asterisks, `Removed` to remove all profanity from the result, or `Tags` to add "profanity" tags. The default setting is `Masked`.
:::row-end:::
:::row:::
   :::column span="1":::
      `punctuationMode`
   :::column-end:::
   :::column span="2":::
      Specifies how to handle punctuation in recognition results. Accepted values are `None` to disable punctuation, `Dictated` to imply explicit (spoken) punctuation, `Automatic` to let the decoder deal with punctuation, or `DictatedAndAutomatic` to use dictated and automatic punctuation. The default setting is `DictatedAndAutomatic`.
:::row-end:::
:::row:::
   :::column span="1":::
      `wordLevelTimestampsEnabled`
   :::column-end:::
   :::column span="2":::
      Specifies if word level timestamps should be added to the output. Accepted values are `true` to enable word level timestamps and `false` (the default value) to disable it.
:::row-end:::
:::row:::
   :::column span="1":::
      `diarizationEnabled`
   :::column-end:::
   :::column span="2":::
      Specifies that diarization analysis should be carried out on the input, which is expected to be mono channel containing two voices. Accepted values are `true` enabling diarization and `false` (the default value) to disable it. It also requires `wordLevelTimestampsEnabled` to be set to true.
:::row-end:::
:::row:::
   :::column span="1":::
      `channels`
   :::column-end:::
   :::column span="2":::
      A optional array of channel numbers to process. Here a subset of the available channels in the audio file can be specified to be processed (e.g. `0` only). If not specified, channels `0` and `1` are transcribed as default.
:::row-end:::
:::row:::
   :::column span="1":::
      `timeToLive`
   :::column-end:::
   :::column span="2":::
      An optional duration to automatically delete transcriptions after completing the transcription. The `timeToLive` is useful in mass processing transcriptions to ensure they will be eventually deleted (e.g. `PT12H`). If not specified or set to `PT0H`, the transcription will not be deleted automatically.
:::row-end:::
:::row:::
   :::column span="1":::
      `destinationContainerUrl`
   :::column-end:::
   :::column span="2":::
      Optional URL with [service SAS](../../storage/common/storage-sas-overview.md) to a writeable container in Azure. The result is stored in this container. When not specified, Microsoft stores the results in a storage container managed by Microsoft. When the transcription is deleted by calling [Delete transcription](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription), the result data will also be deleted.
:::row-end:::

### Storage

Batch transcription supports [Azure Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-overview) for reading audio and writing transcriptions to storage.

## The batch transcription result

For each input audio, one transcription result file is being created. You can get the list of result files by calling [Get transcriptions files](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionFiles). This method returns a list of result files for this transcription. To find the transcription file for a specific input file, filter all returned files with `kind` == `Transcription` and  `name` == `{originalInputName.suffix}.json`.

Each transcription result file his this format:

```json
{
  "source": "...",                                                 // the sas url of a given contentUrl or the path relative to the root of a given container
  "timestamp": "2020-06-16T09:30:21Z",                             // creation time of the transcription, ISO 8601 encoded timestamp, combined date and time
  "durationInTicks": 41200000,                                     // total audio duration in ticks (1 tick is 100 nanoseconds)
  "duration": "PT4.12S",                                           // total audio duration, ISO 8601 encoded duration
  "combinedRecognizedPhrases": [                                   // concatenated results for simple access in single string for each channel
    {
      "channel": 0,                                                // channel number of the concatenated results
      "lexical": "hello world",
      "itn": "hello world",
      "maskedITN": "hello world",
      "display": "Hello world."
    }
  ],
  "recognizedPhrases": [                                           // results for each phrase and each channel individually
    {
      "recognitionStatus": "Success",                              // recognition state, e.g. "Success", "Failure"
      "channel": 0,                                                // channel number of the result
      "offset": "PT0.07S",                                         // offset in audio of this phrase, ISO 8601 encoded duration 
      "duration": "PT1.59S",                                       // audio duration of this phrase, ISO 8601 encoded duration
      "offsetInTicks": 700000.0,                                   // offset in audio of this phrase in ticks (1 tick is 100 nanoseconds)
      "durationInTicks": 15900000.0,                               // audio duration of this phrase in ticks (1 tick is 100 nanoseconds)
      
      // possible transcriptions of the current phrase with confidences
      "nBest": [
        {
          "confidence": 0.898652852,                               // confidence value for the recognition of the whole phrase
          "speaker": 1,                                            // if `diarizationEnabled` is `true`, this is the identified speaker (1 or 2), otherwise this property is not present
          "lexical": "hello world",
          "itn": "hello world",
          "maskedITN": "hello world",
          "display": "Hello world.",
          
          // if wordLevelTimestampsEnabled is `true`, there will be a result for each word of the phrase, otherwise this property is not present
          "words": [
            {
              "word": "hello",
              "offset": "PT0.09S",
              "duration": "PT0.48S",
              "offsetInTicks": 900000.0,
              "durationInTicks": 4800000.0,
              "confidence": 0.987572
            },
            {
              "word": "world",
              "offset": "PT0.59S",
              "duration": "PT0.16S",
              "offsetInTicks": 5900000.0,
              "durationInTicks": 1600000.0,
              "confidence": 0.906032
            }
          ]
        }
      ]    
    }
  ]
}
```

The result contains these forms:

:::row:::
   :::column span="1":::
      **Form**
   :::column-end:::
   :::column span="2":::
      **Content**
:::row-end:::
:::row:::
   :::column span="1":::
      `lexical`
   :::column-end:::
   :::column span="2":::
      The actual words recognized.
:::row-end:::
:::row:::
   :::column span="1":::
      `itn`
   :::column-end:::
   :::column span="2":::
      Inverse-text-normalized form of the recognized text. Abbreviations ("doctor smith" to "dr smith"), phone numbers, and other transformations are applied.
:::row-end:::
:::row:::
   :::column span="1":::
      `maskedITN`
   :::column-end:::
   :::column span="2":::
      The ITN form with profanity masking applied.
:::row-end:::
:::row:::
   :::column span="1":::
      `display`
   :::column-end:::
   :::column span="2":::
      The display form of the recognized text. Added punctuation and capitalization are included.
:::row-end:::

## Speaker separation (Diarization)

Diarization is the process of separating speakers in a piece of audio. Our Batch pipeline supports diarization and is capable of recognizing two speakers on mono channel recordings. The feature is not available on stereo recordings.

The output of transcription with diarization enabled contains a `Speaker` entry for each transcribed phrase. If diarization is not used, the property `Speaker` is not present in the JSON output. For diarization we support two voices, so the speakers are identified as `1` or `2`.

To request diarization, you simply have to add the relevant parameter in the HTTP request as shown below.

 ```json
{
  "contentUrls": [
    "<URL to an audio file to transcribe>",
  ],
  "properties": {
    "diarizationEnabled": true,
    "wordLevelTimestampsEnabled": true,
    "punctuationMode": "DictatedAndAutomatic",
    "profanityFilterMode": "Masked"
  },
  "locale": "en-US",
  "displayName": "Transcription of file using default model for en-US"
}
```

Word-level timestamps must be enabled as the parameters in the above request indicate.

## Best practices

The transcription service can handle large number of submitted transcriptions. You can query the status of your transcriptions through a `GET` on [Get transcriptions](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptions). Call [Delete transcription](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription) regularly from the service once you retrieved the results. Alternatively set `timeToLive` property to a reasonable value to ensure eventual deletion of the results.

## Sample code

Complete samples are available in the [GitHub sample repository](https://aka.ms/csspeech/samples) inside the `samples/batch` subdirectory.

Please update the sample code with your subscription information, the service region, the SAS URI pointing to the audio file to transcribe, and model location in case you want to use a custom model.

[!code-csharp[Configuration variables for batch transcription](~/samples-cognitive-services-speech-sdk/samples/batch/csharp/program.cs#transcriptiondefinition)]

The sample code sets up the client and submits the transcription request. It then polls for the status information and print details about the transcription progress.

[!code-csharp[Code to check batch transcription status](~/samples-cognitive-services-speech-sdk/samples/batch/csharp/program.cs#transcriptionstatus)]

For full details about the preceding calls, see our [Swagger document](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0). For the full sample shown here, go to [GitHub](https://aka.ms/csspeech/samples) in the `samples/batch` subdirectory.

Take note of the asynchronous setup for posting audio and receiving transcription status. The client that you create is a .NET HTTP client. There's a `PostTranscriptions` method for sending the audio file details and a `GetTranscriptions` method for receiving the states. `PostTranscriptions` returns a handle, and `GetTranscriptions` uses it to create a handle to get the transcription status.

The current sample code doesn't specify a custom model. The service uses the baseline model for transcribing the file or files. To specify the model, you can pass on the same method the model reference for the custom model.

> [!NOTE]
> For baseline transcriptions, you don't need to declare the ID for the baseline model.

## Download the sample

You can find the sample in the `samples/batch` directory in the [GitHub sample repository](https://aka.ms/csspeech/samples).

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
