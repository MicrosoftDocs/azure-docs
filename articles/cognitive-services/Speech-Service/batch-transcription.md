---
title: How to use batch transcription - Speech service
titleSuffix: Azure Cognitive Services
description: Batch transcription is ideal if you want to transcribe a large quantity of audio in storage, such as Azure blobs. By using the dedicated REST API, you can point to audio files with a shared access signature (SAS) URI, and asynchronously receive transcriptions.
services: cognitive-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 01/23/2022
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# How to use batch transcription from audio files in storage

[Speech-to-text REST API](rest-speech-to-text.md) | [Speech CLI](spx-basics.md) | [Additional Samples on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

Batch transcription is used to transcribe a large amount of audio in storage. You should send multiple files per request or point to an Azure Blob Storage container with the audio files to transcribe. The batch transcription service can handle a large number of submitted transcriptions. The service transcribes the files concurrently, which reduces the turnaround time. 

Batch transcription jobs are scheduled on a best-effort basis. You can't estimate when a job will change into the running state, but it should happen within minutes under normal system load. When the job is in the running state, the transcription occurs faster than the audio runtime playback speed.

>[!NOTE]
> To use batch transcription, you need a standard Speech resource (S0) in your subscription. Free resources (F0) aren't supported. For more information, see [pricing and limits](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## REST API reference

You can use the REST API operations in this table for batch transcription.

> [!NOTE]
> As a part of the REST API, batch transcription has a set of [quotas and limits](speech-services-quotas-and-limits.md#batch-transcription). It's a good idea to review these.

|Path|Method|Operation ID|
|---------|---------|---------|
|`/transcriptions`|POST|[Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create)|
|`/transcriptions/{id}`|DELETE|[Transcriptions_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete)|
|`/transcriptions/{id}`|GET|[Transcriptions_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get)|
|`/transcriptions/{id}/files/{fileId}`|GET|[Transcriptions_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_GetFile)|
|`/transcriptions`|GET|[Transcriptions_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List)|
|`/transcriptions/{id}/files`|GET|[Transcriptions_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles)|
|`/transcriptions/locales`|GET|[Transcriptions_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListSupportedLocales)|
|`/transcriptions/{id}`|PATCH|[Transcriptions_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Update)|

For more information, see the [Speech to text REST API reference](rest-speech-to-text.md) documentation.

## Supported audio formats

The batch transcription API supports the following formats:

| Format | Codec | Bits per sample | Sample rate             |
|--------|-------|---------|---------------------------------|
| WAV    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| MP3    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| OGG    | OPUS  | 16-bit  | 8 kHz or 16 kHz, mono or stereo |

For stereo audio streams, the left and right channels are split during the transcription. A JSON result file is created for each channel. To create an ordered final transcript, use the timestamps that are generated per utterance.

## Configuration

Configuration parameters are provided as JSON. You can transcribe one or more individual files, process a whole storage container, and use a custom trained model in a batch transcription.

If you have more than one file to transcribe, it's a good idea to send multiple files in one request. The following example uses three files:

```json
{
  "contentUrls": [
    "<URL to an audio file 1 to transcribe>",
    "<URL to an audio file 2 to transcribe>",
    "<URL to an audio file 3 to transcribe>"
  ],
  "properties": {
    "wordLevelTimestampsEnabled": true
  },
  "locale": "en-US",
  "displayName": "Transcription of file using default model for en-US"
}
```

To process a whole storage container, you can make the following configurations. Container [SAS](../../storage/common/storage-sas-overview.md) should contain `r` (read) and `l` (list) permissions:

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

Here's an example of using a custom trained model in a batch transcription. This example uses three files:

```json
{
  "contentUrls": [
    "<URL to an audio file 1 to transcribe>",
    "<URL to an audio file 2 to transcribe>",
    "<URL to an audio file 3 to transcribe>"
  ],
  "properties": {
    "wordLevelTimestampsEnabled": true
  },
  "locale": "en-US",
  "model": {
    "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.1/models/{id}"
  },
  "displayName": "Transcription of file using default model for en-US"
}
```

## Batch transcription request

Use these optional properties to configure transcription:

| Property | Description |
|----------|-------------|
|`profanityFilterMode`|Optional, defaults to `Masked`. Specifies how to handle profanity in recognition results. Accepted values are `None` to disable profanity filtering, `Masked` to replace profanity with asterisks, `Removed` to remove all profanity from the result, or `Tags` to add profanity tags.|
|`punctuationMode`|Optional, defaults to `DictatedAndAutomatic`. Specifies how to handle punctuation in recognition results. Accepted values are `None` to disable punctuation, `Dictated` to imply explicit (spoken) punctuation, `Automatic` to let the decoder deal with punctuation, or `DictatedAndAutomatic` to use dictated and automatic punctuation.|
|`wordLevelTimestampsEnabled`|Optional, `false` by default. Specifies if word level timestamps should be added to the output.|
|`diarizationEnabled`|Optional, `false` by default. Specifies that diarization analysis should be carried out on the input, which is expected to be a mono channel that contains two voices. Requires `wordLevelTimestampsEnabled` to be set to `true`.|
|`channels`|Optional, `0` and `1` transcribed by default. An array of channel numbers to process. Here, a subset of the available channels in the audio file can be specified to be processed (for example `0` only).|
|`timeToLive`|Optional, no deletion by default. A duration to automatically delete transcriptions after completing the transcription. The `timeToLive` is useful in mass processing transcriptions to ensure they will be eventually deleted (for example, `PT12H` for 12 hours).|
|`destinationContainerUrl`|Optional URL with [ad hoc SAS](../../storage/common/storage-sas-overview.md) to a writeable container in Azure. The result is stored in this container. SAS with stored access policies isn't supported. If you don't specify a container, Microsoft stores the results in a storage container managed by Microsoft. When the transcription is deleted by calling [Transcriptions_Delete](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete), the result data is also deleted.|

## Batch transcription result

For each audio input, one transcription result file is created. The [Transcriptions_ListFiles](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles) operation returns a list of result files for this transcription. The only way to confirm the audio input for a transcription, is to check the `source` field in the transcription result file. 

Each transcription result file has this format:

```json
{
  "source": "...",                      // sas url of a given contentUrl or the path relative to the root of a given container
  "timestamp": "2020-06-16T09:30:21Z",  // creation time of the transcription, ISO 8601 encoded timestamp, combined date and time
  "durationInTicks": 41200000,          // total audio duration in ticks (1 tick is 100 nanoseconds)
  "duration": "PT4.12S",                // total audio duration, ISO 8601 encoded duration
  "combinedRecognizedPhrases": [        // concatenated results for simple access in single string for each channel
    {
      "channel": 0,                     // channel number of the concatenated results
      "lexical": "hello world",
      "itn": "hello world",
      "maskedITN": "hello world",
      "display": "Hello world."
    }
  ],
  "recognizedPhrases": [                // results for each phrase and each channel individually
    {
      "recognitionStatus": "Success",   // recognition state, e.g. "Success", "Failure"
      "speaker": 1,                     // if `diarizationEnabled` is `true`, this is the identified speaker (1 or 2), otherwise this property is not present
      "channel": 0,                     // channel number of the result
      "offset": "PT0.07S",              // offset in audio of this phrase, ISO 8601 encoded duration
      "duration": "PT1.59S",            // audio duration of this phrase, ISO 8601 encoded duration
      "offsetInTicks": 700000.0,        // offset in audio of this phrase in ticks (1 tick is 100 nanoseconds)
      "durationInTicks": 15900000.0,    // audio duration of this phrase in ticks (1 tick is 100 nanoseconds)

      // possible transcriptions of the current phrase with confidences
      "nBest": [
        {
          "confidence": 0.898652852,    // confidence value for the recognition of the whole phrase
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

The response contains the following properties:

| Property | Description |
|----------|-------------|
|`lexical`|The actual words recognized.|
|`itn`|The inverse-text-normalized (ITN) form of the recognized text. Abbreviations (for example, "doctor smith" to "dr smith"), phone numbers, and other transformations are applied.|
|`maskedITN`|The ITN form with profanity masking applied.|
|`display`|The display form of the recognized text. Added punctuation and capitalization are included.|

## Speaker separation (diarization)

*Diarization* is the process of separating speakers in a piece of audio. The batch pipeline supports diarization and is capable of recognizing two speakers on mono channel recordings. The feature isn't available on stereo recordings.

The output of transcription with diarization enabled contains a `Speaker` entry for each transcribed phrase. If diarization isn't used, the `Speaker` property isn't present in the JSON output. For diarization, the speakers are identified as `1` or `2`.

To request diarization, set the `diarizationEnabled` property to `true`. Here's an example:

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

Word-level timestamps must be enabled, as the parameters in this request indicate.

## Best practices

You can query the status of your transcriptions with the [Transcriptions_List](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List) operation. Call [Transcriptions_Delete](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete)
regularly from the service, after you retrieve the results. Alternatively, set the `timeToLive` property to ensure the eventual deletion of the results.

## Using custom models with batch transcription

The service uses the base model for transcribing the file or files. To specify the model, you can pass on the same method the model reference for the custom model.

> [!NOTE]
> For baseline transcriptions, you don't need to declare the ID for the base model.

If you plan to use a Custom Speech model, follow the steps from [Create a Custom Speech project](how-to-custom-speech-create-project.md) to [Train a model](how-to-custom-speech-train-model.md). A [deployed custom endpoint](how-to-custom-speech-deploy-model.md) isn't needed for the batch transcription service.

To use a Custom Speech model for batch transcription, you need the model's URI. You can retrieve the model location when you create or get a model. The top-level `self` property in the response body is the model's URI. For an example, see the JSON response example in the [Create a model](how-to-custom-speech-train-model.md?pivots=rest-api#create-a-model) guide. 

## Azure Storage for audio files

You can point to audio files by using a typical URI or a [shared access signature (SAS)](../../storage/common/storage-sas-overview.md) URI, and asynchronously receive transcription results. With the [Speech to text REST API](rest-speech-to-text.md), you can transcribe one or more audio files, or process a whole storage container.

Batch transcription can read audio from a public-visible internet URI and can read audio or write transcriptions by using a SAS URI with [Blob Storage](../../storage/blobs/storage-blobs-overview.md).

Follow these steps to create a storage account, upload wav files from your local directory to a new container, and generate a SAS URL that you can use for batch transcriptions.

1. Set the `RESOURCE_GROUP` environment variable to the name of an existing resource group where the new storage account will be created.

    ```azurecli-interactive
    set RESOURCE_GROUP=<your existing resource group name>
    ```

1. Set the `AZURE_STORAGE_ACCOUNT` environment variable to the name of a storage account that you want to create.

    ```azurecli-interactive
    set AZURE_STORAGE_ACCOUNT=<choose new storage account name>
    ```

1. Create a new storage account with the [`az storage account create`](/cli/azure/storage/account#az-storage-account-create) command. Replace `eastus` with the region of your resource group.

    ```azurecli-interactive
    az storage account create -n %AZURE_STORAGE_ACCOUNT% -g %RESOURCE_GROUP% -l eastus
    ```

    > [!TIP]
    > When you are finished with batch transcriptions and want to delete your storage account, use the [`az storage delete create`](/cli/azure/storage/account#az-storage-account-delete) command.

1. Get your new storage account keys with the [`az storage account keys list`](/cli/azure/storage/account#az-storage-account-keys-list) command. 

    ```azurecli-interactive
    az storage account keys list -g %RESOURCE_GROUP% -n %AZURE_STORAGE_ACCOUNT%
    ```

1. Set the `AZURE_STORAGE_KEY` environment variable to one of the key values retrieved in the previous step.

    ```azurecli-interactive
    set AZURE_STORAGE_KEY=<your storage account key>
    ```
    
    > [!IMPORTANT]
    > The remaining steps use the `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_KEY` environment variables. If you didn't set the environment variables, you can pass the values as parameters to the commands. See the [az storage container create](/cli/azure/storage/) documentation for more information.
    
1. Create a container with the [`az storage container create`](/cli/azure/storage/container#az-storage-container-create) command. Replace `<mycontainer>` with a name for your container.

    ```azurecli-interactive
    az storage container create -n <mycontainer>
    ```

1. The following [`az storage blob upload-batch`](/cli/azure/storage/blob#az-storage-blob-upload-batch) command uploads all .wav files from the current local directory. Replace `<mycontainer>` with a name for your container. Optionally you can modify the command to upload files from a different directory.

    ```azurecli-interactive
    az storage blob upload-batch -d <mycontainer> -s . --pattern *.wav
    ```

1. Generate a SAS URL with read (r) and list (l) permissions for the container with the [`az storage container generate-sas`](/cli/azure/storage/container#az-storage-container-generate-sas) command. Replace `<mycontainer>` with the name of your container.

    ```azurecli-interactive
    az storage container generate-sas -n <mycontainer> --expiry 2022-09-09 --permissions rl --https-only
    ```

The previous command returns a SAS token. Append the SAS token to your container blob URL to create a SAS URL. For example: `https://<storage_account_name>.blob.core.windows.net/<container_name>?SAS_TOKEN`. You will use the SAS URL for batch transcription.

## Next steps

> [!div class="nextstepaction"]
> [Speech to text REST API reference](rest-speech-to-text.md)
