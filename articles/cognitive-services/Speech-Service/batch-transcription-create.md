---
title: Create a batch transcription - Speech service
titleSuffix: Azure Cognitive Services
description: With batch transcriptions, you submit the audio, and then retrieve transcription results asynchronously.
services: cognitive-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 09/11/2022
zone_pivot_groups: speech-cli-rest
ms.custom: devx-track-csharp
---

# Create a batch transcription

With batch transcriptions, you submit the [audio data](batch-transcription-audio-data.md), and then retrieve transcription results asynchronously. The service transcribes the audio data and stores the results in a storage container. You can then [retrieve the results](batch-transcription-get.md) from the storage container.

## Create a transcription job

::: zone pivot="speech-cli"

To create a transcription and connect it to an existing project, use the `spx batch transcription create` command. Construct the request parameters according to the following instructions:

- Set the required `content` parameter. You can specify either a semi-colon delimited list of individual files, or the SAS URL for an entire container. This property will not be returned in the response. For more information about Azure blob storage and SAS URLs, see [Azure storage for audio files](batch-transcription-audio-data.md#azure-blob-storage-example).
- Set the required `language` property. This should match the expected locale of the audio data to transcribe. The locale can't be changed later. The Speech CLI `language` parameter corresponds to the `locale` property in the JSON request and response.
- Set the required `name` property. Choose a transcription name that you can refer to later. The transcription name doesn't have to be unique and can be changed later. The Speech CLI `name` parameter corresponds to the `displayName` property in the JSON request and response.

Here's an example Speech CLI command that creates a transcription job:

```azurecli-interactive
spx batch transcription create --name "My Transcription" --language "en-US" --content https://crbn.us/hello.wav;https://crbn.us/whatstheweatherlike.wav
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base/aaa321e9-5a4e-4db1-88a2-f251bbe7b555"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files"
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
  "lastActionDateTime": "2022-09-10T18:39:07Z",
  "status": "NotStarted",
  "createdDateTime": "2022-09-10T18:39:07Z",
  "locale": "en-US",
  "displayName": "My Transcription"
}
```

The top-level `self` property in the response body is the transcription's URI. Use this URI to get details such as the URI of the transcriptions and transcription report files. You also use this URI to update or delete a transcription.

For Speech CLI help with transcriptions, run the following command:

```azurecli-interactive
spx help batch transcription
```

::: zone-end

::: zone pivot="rest-api"

To create a transcription, use the [CreateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateTranscription) operation of the [Speech-to-text REST API](rest-speech-to-text.md#transcriptions). Construct the request body according to the following instructions:

- You must set either the `contentContainerUrl` or `contentUrls` property. This property will not be returned in the response. For more information about Azure blob storage and SAS URLs, see [Azure storage for audio files](batch-transcription-audio-data.md#azure-blob-storage-example).
- Set the required `locale` property. This should match the expected locale of the audio data to transcribe. The locale can't be changed later.
- Set the required `displayName` property. Choose a transcription name that you can refer to later. The transcription name doesn't have to be unique and can be changed later.

Make an HTTP POST request using the URI as shown in the following [CreateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateTranscription) example. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "contentUrls": [
    "https://crbn.us/hello.wav",
    "https://crbn.us/whatstheweatherlike.wav"
  ],
  "locale": "en-US",
  "displayName": "My Transcription",
  "model": null,
  "properties": {
    "wordLevelTimestampsEnabled": true,
  },
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions"
```


You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base/aaa321e9-5a4e-4db1-88a2-f251bbe7b555"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/637d9333-6559-47a6-b8de-c7d732c1ddf3/files"
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
  "lastActionDateTime": "2022-09-10T18:39:07Z",
  "status": "NotStarted",
  "createdDateTime": "2022-09-10T18:39:07Z",
  "locale": "en-US",
  "displayName": "My Transcription"
}
```

The top-level `self` property in the response body is the transcription's URI. Use this URI to [get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscription) details such as the URI of the transcriptions and transcription report files. You also use this URI to [update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateTranscription) or [delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription) a transcription.

You can query the status of your transcriptions with the [GetTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscription) operation. 

Call [DeleteTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription)
regularly from the service, after you retrieve the results. Alternatively, set the `timeToLive` property to ensure the eventual deletion of the results.

::: zone-end

## Request configuration options

::: zone pivot="speech-cli"

For Speech CLI help with transcription configuration options, run the following command:

```azurecli-interactive
spx help batch transcription create advanced
```

::: zone-end

::: zone pivot="rest-api"

Here are some property options that you can use to configure a transcription when you call the [CreateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateTranscription) operation.

| Property | Description |
|----------|-------------|
|`channels`|An array of channel numbers to process. Channels `0` and `1` are transcribed by default. |
|`contentContainerUrl`| You can submit individual audio files, or a whole storage container. You must specify the audio data location via either the `contentContainerUrl` or `contentUrls` property. For more information, see [Azure storage for audio files](batch-transcription-audio-data.md#azure-blob-storage-example).|
|`contentUrls`| You can submit individual audio files, or a whole storage container. You must specify the audio data location via either the `contentContainerUrl` or `contentUrls` property. For more information, see [Azure storage for audio files](batch-transcription-audio-data.md#azure-blob-storage-example).|
|`destinationContainerUrl`|The result can be stored in an Azure container. Specify the [ad hoc SAS](../../storage/common/storage-sas-overview.md) with write permissions. SAS with stored access policies isn't supported. If you don't specify a container, the Speech service stores the results in a container managed by Microsoft. When the transcription job is deleted, the transcription result data is also deleted.|
|`diarization`|Indicates that diarization analysis should be carried out on the input, which is expected to be a mono channel that contains multiple voices. Specify the minimum and maximum number of people who might be speaking. You must also set the `diarizationEnabled` property to `true`. The [transcription file](batch-transcription-get.md#transcription-result-file) will contain a `speaker` entry for each transcribed phrase.<br/><br/>Diarization is the process of separating speakers in audio data. The batch pipeline can recognize and separate multiple speakers on mono channel recordings. The feature isn't available with stereo recordings.<br/><br/>**Note**: This property is only available with speech-to-text REST API version 3.1.|
|`diarizationEnabled`|Specifies that diarization analysis should be carried out on the input, which is expected to be a mono channel that contains two voices. The default value is `false`.|
|`model`|You can set the `model` property to use a specific base model or [Custom Speech](how-to-custom-speech-train-model.md) model. If you don't specify the `model`, the default base model for the locale is used. For more information, see [Using custom models](#using-custom-models).|
|`profanityFilterMode`|Specifies how to handle profanity in recognition results. Accepted values are `None` to disable profanity filtering, `Masked` to replace profanity with asterisks, `Removed` to remove all profanity from the result, or `Tags` to add profanity tags. The default value is `Masked`. |
|`punctuationMode`|Specifies how to handle punctuation in recognition results. Accepted values are `None` to disable punctuation, `Dictated` to imply explicit (spoken) punctuation, `Automatic` to let the decoder deal with punctuation, or `DictatedAndAutomatic` to use dictated and automatic punctuation. The default value is  `DictatedAndAutomatic`.|
|`timeToLive`|A duration after the transcription job is created, when the transcription results will be automatically deleted. For example, specify `PT12H` for 12 hours. As an alternative, you can call [DeleteTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription) regularly after you retrieve the transcription results.|
|`wordLevelTimestampsEnabled`|Specifies if word level timestamps should be included in the output. The default value is `false`.|


::: zone-end


## Using custom models

Batch transcription uses the default base model for the locale that you specify. You don't need to set any properties to use the default base model. 

Optionally, you can set the `model` property to use a specific base model or [Custom Speech](how-to-custom-speech-train-model.md) model. 


::: zone pivot="speech-cli"

```azurecli-interactive
spx batch transcription create --name "My Transcription" --language "en-US" --content https://crbn.us/hello.wav;https://crbn.us/whatstheweatherlike.wav --model "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
```

::: zone-end

::: zone pivot="rest-api"

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "contentContainerUrl": "https://YourStorageAccountName.blob.core.windows.net/YourContainerName?YourSASToken",
  "locale": "en-US",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
  },
  "displayName": "My Transcription",
  "properties": {
    "wordLevelTimestampsEnabled": true,
  },
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions"
```

::: zone-end

To use a Custom Speech model for batch transcription, you need the model's URI. You can retrieve the model location when you create or get a model. The top-level `self` property in the response body is the model's URI. For an example, see the JSON response example in the [Create a model](how-to-custom-speech-train-model.md?pivots=rest-api#create-a-model) guide. A [deployed custom endpoint](how-to-custom-speech-deploy-model.md) isn't needed for the batch transcription service.

Batch transcription requests for expired models will fail with a 4xx error. You'll want to set the `model` property to a base model or custom model that hasn't yet expired. Otherwise don't include the `model` property to always use the latest base model. For more information, see [Choose a model](how-to-custom-speech-create-project.md#choose-your-model) and [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md).

## Next steps

- [Batch transcription overview](batch-transcription.md)
- [Locate audio files for batch transcription](batch-transcription-audio-data.md)
- [Get batch transcription results](batch-transcription-get.md)