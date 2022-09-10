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
ms.date: 09/10/2022
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# How to use batch transcription from audio files in storage

[Speech-to-text REST API](rest-speech-to-text.md#transcriptions) | [Speech CLI](spx-basics.md) | [Additional Samples on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

Batch transcription is used to transcribe a large amount of audio in storage. You should send multiple files per request or point to an Azure Blob Storage container with the audio files to transcribe. The batch transcription service can handle a large number of submitted transcriptions. The service transcribes the files concurrently, which reduces the turnaround time. 

Batch transcription jobs are scheduled on a best-effort basis. You can't estimate when a job will change into the running state, but it should happen within minutes under normal system load. When the job is in the running state, the transcription occurs faster than the audio runtime playback speed.

>[!NOTE]
> To use batch transcription, you need a standard Speech resource (S0) in your subscription. Free resources (F0) aren't supported. For more information, see [pricing and limits](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).


## REST API reference

You can use the REST API for batch transcription. For more information, see the [Speech to text REST API reference](rest-speech-to-text.md#transcriptions) documentation.

> [!NOTE]
> As a part of the REST API, batch transcription has a set of [quotas and limits](speech-services-quotas-and-limits.md#batch-transcription). It's a good idea to review these.


## Create a transcription job

To create a transcription, use the [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) operation of the [Speech-to-text REST API](rest-speech-to-text.md#transcriptions). Construct the request body according to the following instructions:

- You must set either the `contentContainerUrl` or `contentContainerUrl` property. The SAS URL for the container must have read (r) and list (l) permissions. This property will not be returned in a response. For more information about Azure blob storage and SAS URLs, see [Azure storage for audio files](#azure-storage-for-audio-files).
- Set the required `locale` property. This should match the expected locale of the audio data to transcribe. The locale can't be changed later.
- Set the required `displayName` property. Choose a transcription name that you can refer to later. The transcription name doesn't have to be unique and can be changed later.

Make an HTTP POST request using the URI as shown in the following [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) example. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "contentContainerUrl": "https://YourStorageAccountName.blob.core.windows.net/YourContainerName?YourSASToken",
  "locale": "en-US",
  "model": null,
  "displayName": "Transcription using the default base model for en-US",
  "properties": {
    "wordLevelTimestampsEnabled": true,
    "languageIdentification": {
      "candidateLocales": [
        "en-US", "es-ES", "de-DE", "fr-FR"
      ],
    },
  },
  "displayName": "Transcription using the default base model for en-US"
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1-preview.1/transcriptions/ca33f326-a85a-495e-8bb2-ce0413635d6c",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1-preview.1/models/base/aaa321e9-5a4e-4db1-88a2-f251bbe7b555"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1-preview.1/transcriptions/ca33f326-a85a-495e-8bb2-ce0413635d6c/files"
  },
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": true,
    "displayFormWordLevelTimestampsEnabled": false,
    "channels": [
      0,
      1
    ],
    "punctuationMode": "DictatedAndAutomatic",
    "profanityFilterMode": "Masked"
  },
  "lastActionDateTime": "2022-09-06T16:06:47Z",
  "status": "NotStarted",
  "createdDateTime": "2022-09-06T16:06:47Z",
  "locale": "en-US",
  "displayName": "Transcription using the default base model for en-US"
}
```

The top-level `self` property in the response body is the transcription's URI. Use this URI to [get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get) details such as the URI of the transcriptions and transcription report files. You also use this URI to [update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Update) or [delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete) a transcription.

You can query the status of your transcriptions with the [Transcriptions_List](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List) operation. 

Call [Transcriptions_Delete](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete)
regularly from the service, after you retrieve the results. Alternatively, set the `timeToLive` property to ensure the eventual deletion of the results.


## Using custom models with batch transcription

The service uses the base model for transcribing the file or files. For baseline transcriptions, you don't need to declare the ID for the base model. To specify the model, you can pass on the same method the model reference for the custom model.

Optionally, you can set the `model` property to use a specific base model or [Custom Speech](how-to-custom-speech-train-model.md) model. If you don't specify the `model`, the default base model for the locale is used. 

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "contentContainerUrl": "https://YourStorageAccountName.blob.core.windows.net/YourContainerName?YourSASToken",
  "locale": "en-US",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
  },
  "displayName": "Transcription using a specific base model for en-US",
  "properties": {
    "wordLevelTimestampsEnabled": true,
    "languageIdentification": {
      "candidateLocales": [
        "en-US", "es-ES", "de-DE", "fr-FR"
      ],
    },
  },
  "displayName": "Transcription using the default base model for en-US"
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions"
```

To use a Custom Speech model for batch transcription, you need the model's URI. You can retrieve the model location when you create or get a model. The top-level `self` property in the response body is the model's URI. For an example, see the JSON response example in the [Create a model](how-to-custom-speech-train-model.md?pivots=rest-api#create-a-model) guide. A [deployed custom endpoint](how-to-custom-speech-deploy-model.md) isn't needed for the batch transcription service.

Batch transcription requests for expired models will fail with a 4xx error. In each [Transcriptions_Create](https://westus2.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) REST API request body, set the `model` property to a base model or custom model that hasn't yet expired. Otherwise don't include the `model` property to always use the latest base model.

## Optional request configurations

Here are some optional properties that you can use to configure a transcription:

| Property | Description |
|----------|-------------|
|`channels`|An array of channel numbers to process. Channels `0` and `1` are transcribed by default. |
|`destinationContainerUrl`|The result can be stored in an Azure container. Specify the [ad hoc SAS](../../storage/common/storage-sas-overview.md) with write permissions. SAS with stored access policies isn't supported. If you don't specify a container, the Speech service stores the results in a container managed by Microsoft. When the transcription job is deleted, the transcription result data is also deleted.|
|`diarization`|Indicates that diarization analysis should be carried out on the input, which is expected to be a mono channel that contains multiple voices. Specify the minimum and maximum number of people who might be speaking. You must also set the `diarizationEnabled` and `wordLevelTimestampsEnabled` properties to `true`. The [transcription file](#batch-transcription-result-file) will contain a `speaker` entry for each transcribed phrase.<br/><br/>Diarization is the process of separating speakers in audio data. The batch pipeline can recognize and separate multiple speakers on mono channel recordings. The feature isn't available with stereo recordings.|
|`diarizationEnabled`|Specifies that diarization analysis should be carried out on the input, which is expected to be a mono channel that contains two voices. Requires `wordLevelTimestampsEnabled` to be set to `true`. This value is `false` by default.|
|`profanityFilterMode`|Optional, defaults to `Masked`. Specifies how to handle profanity in recognition results. Accepted values are `None` to disable profanity filtering, `Masked` to replace profanity with asterisks, `Removed` to remove all profanity from the result, or `Tags` to add profanity tags.|
|`punctuationMode`|Optional, defaults to `DictatedAndAutomatic`. Specifies how to handle punctuation in recognition results. Accepted values are `None` to disable punctuation, `Dictated` to imply explicit (spoken) punctuation, `Automatic` to let the decoder deal with punctuation, or `DictatedAndAutomatic` to use dictated and automatic punctuation.|
|`timeToLive`|Optional, no deletion by default. A duration to automatically delete transcriptions after completing the transcription. The `timeToLive` is useful in mass processing transcriptions to ensure they will be eventually deleted (for example, `PT12H` for 12 hours).|
|`wordLevelTimestampsEnabled`|Optional, `false` by default. Specifies if word level timestamps should be added to the output.|

## Batch transcription result file

For each audio input, one transcription result file is created. The [Transcriptions_ListFiles](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles) operation returns a list of result files for a transcription. 

The contents of each transcription result file are formatted as JSON, as shown in this example.

```json
{
  "source": "...",
  "timestamp": "2022-09-16T09:30:21Z",  
  "durationInTicks": 41200000,
  "duration": "PT4.12S",
  "combinedRecognizedPhrases": [
    {
      "channel": 0,
      "lexical": "hello world",
      "itn": "hello world",
      "maskedITN": "hello world",
      "display": "Hello world."
    }
  ],
  "recognizedPhrases": [
    {
      "recognitionStatus": "Success",
      "speaker": 1,
      "channel": 0,
      "offset": "PT0.07S",
      "duration": "PT1.59S",
      "offsetInTicks": 700000.0,
      "durationInTicks": 15900000.0,

      "nBest": [
        {
          "confidence": 0.898652852,
          "lexical": "hello world",
          "itn": "hello world",
          "maskedITN": "hello world",
          "display": "Hello world.",

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

Depending in part on the request parameters set when you created the transcription job, the transcription file can contain the following result properties.

|Property|Description|
|----------|-------------|
|`channel`|The channel number of the results. For stereo audio streams, the left and right channels are split during the transcription. A JSON result file is created for each channel.|
|`combinedRecognizedPhrases`|The concatenated results of all phrases for the channel.|
|`confidence`|The confidence value for the recognition.|
|`display`|The display form of the recognized text. Added punctuation and capitalization are included.|
|`displayPhraseElements`|A list of results with display text for each word of the phrase. The `displayFormWordLevelTimestampsEnabled` request property must be set to `true`, otherwise this property is not present.|
|`duration`|The audio duration, ISO 8601 encoded duration.|
|`durationInTicks`|The audio duration in ticks (1 tick is 100 nanoseconds).|
|`itn`|The inverse text normalized (ITN) form of the recognized text. Abbreviations such as "doctor smith" to "dr smith", phone numbers, and other transformations are applied.|
|`lexical`|The actual words recognized.|
|`locale`|The locale identified from the input the audio. The `languageIdentification` request property must be set to `true`, otherwise this property is not present.|
|`maskedITN`|The ITN form with profanity masking applied.|
|`nBest`|A list of possible transcriptions for the current phrase with confidences.|
|`offset`|The offset in audio of this phrase, ISO 8601 encoded duration.|
|`offsetInTicks`|The offset in audio of this phrase in ticks (1 tick is 100 nanoseconds).||
|`recognitionStatus`|The recognition state. For example: "Success" or "Failure".|
|`recognizedPhrases`|The list of results for each phrase.|
|`source`|The URL that was provided as the input audio source. The source corresponds to the `contentUrls` or `contentContainerUrl` request property. The `source` property is the only way to confirm the audio input for a transcription.|
|`speaker`|The identified speaker. The `diarization` and `diarizationEnabled` request properties must be set, otherwise this property is not present.|
|`timestamp`|The creation time of the transcription, ISO 8601 encoded timestamp, combined date and time.|
|`words`|A list of results with lexical text for each word of the phrase. The `wordLevelTimestampsEnabled` request property must be set to `true`, otherwise this property is not present.|

## Supported audio formats

The batch transcription API supports the following formats:

| Format | Codec | Bits per sample | Sample rate             |
|--------|-------|---------|---------------------------------|
| WAV    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| MP3    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| OGG    | OPUS  | 16-bit  | 8 kHz or 16 kHz, mono or stereo |

For stereo audio streams, the left and right channels are split during the transcription. A JSON result file is created for each channel. To create an ordered final transcript, use the timestamps that are generated per utterance.

## Azure Storage for audio files

Batch transcription can read audio files from a public URI or a [shared access signature (SAS)](../../storage/common/storage-sas-overview.md) URI. You can submit individual audio files, or a whole storage container. You can also read or write transcription results in a container.

The SAS URI must have `r` (read) and `l` (list) permissions. The Azure [blob](../../storage/blobs/storage-blobs-overview.md) container must have at most 5GB of audio data and a maximum number of 10,000 blobs. The maximum size for a blob is 2.5GB.

The following [configuration](#optional-request-configurations) example uses two files:

```json
{
  "contentUrls": [
    "https://crbn.us/hello.wav",
    "https://crbn.us/whatstheweatherlike.wav"
  ],
}
```

To process a whole storage container, follow this [configuration](#optional-request-configurations) example:

```json
{
  "contentContainerUrl": "<SAS URL to the Azure blob container to transcribe>",
}
```

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
> [Speech to text REST API reference](rest-speech-to-text.md#transcriptions)
