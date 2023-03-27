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
ms.date: 11/29/2022
zone_pivot_groups: speech-cli-rest
ms.custom: devx-track-csharp
---

# Create a batch transcription

With batch transcriptions, you submit the [audio data](batch-transcription-audio-data.md), and then retrieve transcription results asynchronously. The service transcribes the audio data and stores the results in a storage container. You can then [retrieve the results](batch-transcription-get.md) from the storage container.

> [!NOTE]
> To use batch transcription, you need to use a standard (S0) Speech resource. Free resources (F0) aren't supported. For more information, see [pricing and limits](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## Create a transcription job

::: zone pivot="rest-api"

To create a transcription, use the [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) operation of the [Speech-to-text REST API](rest-speech-to-text.md#transcriptions). Construct the request body according to the following instructions:

- You must set either the `contentContainerUrl` or `contentUrls` property. For more information about Azure blob storage for batch transcription, see [Locate audio files for batch transcription](batch-transcription-audio-data.md).
- Set the required `locale` property. This should match the expected locale of the audio data to transcribe. The locale can't be changed later.
- Set the required `displayName` property. Choose a transcription name that you can refer to later. The transcription name doesn't have to be unique and can be changed later.
- Optionally you can set the `wordLevelTimestampsEnabled` property to `true` to enable word-level timestamps in the transcription results. The default value is `false`. 
- Optionally you can set the `languageIdentification` property.  Language identification is used to identify languages spoken in audio when compared against a list of [supported languages](language-support.md?tabs=language-identification). If you set the `languageIdentification` property, then you must also set `languageIdentification.candidateLocales` with candidate locales.

For more information, see [request configuration options](#request-configuration-options).

Make an HTTP POST request using the URI as shown in the following [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) example. Replace `YourSubscriptionKey` with your Speech resource key, replace `YourServiceRegion` with your Speech resource region, and set the request body properties as previously described.

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
    "languageIdentification": {
      "candidateLocales": [
        "en-US", "de-DE", "es-ES"
      ],
    }
  },
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions"
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/db474955-ab85-4c6c-ba6e-3bfe63d041ba",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/13fb305e-09ad-4bce-b3a1-938c9124dda3"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/db474955-ab85-4c6c-ba6e-3bfe63d041ba/files"
  },
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": true,
    "channels": [
      0,
      1
    ],
    "punctuationMode": "DictatedAndAutomatic",
    "profanityFilterMode": "Masked",
    "languageIdentification": {
      "candidateLocales": [
        "en-US",
        "de-DE",
        "es-ES"
      ]
    }
  },
  "lastActionDateTime": "2022-10-21T14:18:06Z",
  "status": "NotStarted",
  "createdDateTime": "2022-10-21T14:18:06Z",
  "locale": "en-US",
  "displayName": "My Transcription"
}
```

The top-level `self` property in the response body is the transcription's URI. Use this URI to [get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get) details such as the URI of the transcriptions and transcription report files. You also use this URI to [update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Update) or [delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete) a transcription.

You can query the status of your transcriptions with the [Transcriptions_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get) operation. 

Call [Transcriptions_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete)
regularly from the service, after you retrieve the results. Alternatively, set the `timeToLive` property to ensure the eventual deletion of the results.

::: zone-end

::: zone pivot="speech-cli"

To create a transcription, use the `spx batch transcription create` command. Construct the request parameters according to the following instructions:

- Set the required `content` parameter. You can specify either a semi-colon delimited list of individual files, or the URL for an entire container. For more information about Azure blob storage for batch transcription, see [Locate audio files for batch transcription](batch-transcription-audio-data.md).
- Set the required `language` property. This should match the expected locale of the audio data to transcribe. The locale can't be changed later. The Speech CLI `language` parameter corresponds to the `locale` property in the JSON request and response.
- Set the required `name` property. Choose a transcription name that you can refer to later. The transcription name doesn't have to be unique and can be changed later. The Speech CLI `name` parameter corresponds to the `displayName` property in the JSON request and response.

Here's an example Speech CLI command that creates a transcription job:

```azurecli-interactive
spx batch transcription create --api-version v3.1 --name "My Transcription" --language "en-US" --content https://crbn.us/hello.wav;https://crbn.us/whatstheweatherlike.wav
```

You should receive a response body in the following format:

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/7f4232d5-9873-47a7-a6f7-4a3f00d00dc0",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/13fb305e-09ad-4bce-b3a1-938c9124dda3"
  },
  "links": {
    "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/7f4232d5-9873-47a7-a6f7-4a3f00d00dc0/files"
  },
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": false,
    "channels": [
      0,
      1
    ],
    "punctuationMode": "DictatedAndAutomatic",
    "profanityFilterMode": "Masked"
  },
  "lastActionDateTime": "2022-10-21T14:21:59Z",
  "status": "NotStarted",
  "createdDateTime": "2022-10-21T14:21:59Z",
  "locale": "en-US",
  "displayName": "My Transcription",
  "description": ""
}
```

The top-level `self` property in the response body is the transcription's URI. Use this URI to get details such as the URI of the transcriptions and transcription report files. You also use this URI to update or delete a transcription.

For Speech CLI help with transcriptions, run the following command:

```azurecli-interactive
spx help batch transcription
```

::: zone-end

## Request configuration options

::: zone pivot="rest-api"

Here are some property options that you can use to configure a transcription when you call the [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) operation.

| Property | Description |
|----------|-------------|
|`channels`|An array of channel numbers to process. Channels `0` and `1` are transcribed by default. |
|`contentContainerUrl`| You can submit individual audio files, or a whole storage container.<br/><br/>You must specify the audio data location via either the `contentContainerUrl` or `contentUrls` property. For more information about Azure blob storage for batch transcription, see [Locate audio files for batch transcription](batch-transcription-audio-data.md).<br/><br/>This property won't be returned in the response.|
|`contentUrls`| You can submit individual audio files, or a whole storage container.<br/><br/>You must specify the audio data location via either the `contentContainerUrl` or `contentUrls` property. For more information, see [Locate audio files for batch transcription](batch-transcription-audio-data.md).<br/><br/>This property won't be returned in the response.|
|`destinationContainerUrl`|The result can be stored in an Azure container. If you don't specify a container, the Speech service stores the results in a container managed by Microsoft. When the transcription job is deleted, the transcription result data is also deleted. For more information, see [Destination container URL](#destination-container-url).|
|`diarization`|Indicates that diarization analysis should be carried out on the input, which is expected to be a mono channel that contains multiple voices. Specify the minimum and maximum number of people who might be speaking. You must also set the `diarizationEnabled` property to `true`. The [transcription file](batch-transcription-get.md#transcription-result-file) will contain a `speaker` entry for each transcribed phrase.<br/><br/>You need to use this property when you expect three or more speakers. For two speakers setting `diarizationEnabled` property to `true` is enough. See an example of the property usage in [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) operation description.<br/><br/>Diarization is the process of separating speakers in audio data. The batch pipeline can recognize and separate multiple speakers on mono channel recordings. The feature isn't available with stereo recordings.<br/><br/>When this property is selected, source audio length can't exceed 240 minutes per file.<br/><br/>**Note**: This property is only available with Speech-to-text REST API version 3.1.|
|`diarizationEnabled`|Specifies that diarization analysis should be carried out on the input, which is expected to be a mono channel that contains two voices. The default value is `false`.<br/><br/>For three or more voices you also need to use property `diarization` (only with Speech-to-text REST API version 3.1).<br/><br/>When this property is selected, source audio length can't exceed 240 minutes per file.|
|`displayName`|The name of the batch transcription. Choose a name that you can refer to later. The display name doesn't have to be unique.<br/><br/>This property is required.|
|`languageIdentification`|Language identification is used to identify languages spoken in audio when compared against a list of [supported languages](language-support.md?tabs=language-identification).<br/><br/>If you set the `languageIdentification` property, then you must also set its enclosed `candidateLocales` property.|
|`languageIdentification.candidateLocales`|The candidate locales for language identification such as `"properties": { "languageIdentification": { "candidateLocales": ["en-US", "de-DE", "es-ES"]}}`. A minimum of 2 and a maximum of 10 candidate locales, including the main locale for the transcription, is supported.|
|`locale`|The locale of the batch transcription. This should match the expected locale of the audio data to transcribe. The locale can't be changed later.<br/><br/>This property is required.|
|`model`|You can set the `model` property to use a specific base model or [Custom Speech](how-to-custom-speech-train-model.md) model. If you don't specify the `model`, the default base model for the locale is used. For more information, see [Using custom models](#using-custom-models).|
|`profanityFilterMode`|Specifies how to handle profanity in recognition results. Accepted values are `None` to disable profanity filtering, `Masked` to replace profanity with asterisks, `Removed` to remove all profanity from the result, or `Tags` to add profanity tags. The default value is `Masked`. |
|`punctuationMode`|Specifies how to handle punctuation in recognition results. Accepted values are `None` to disable punctuation, `Dictated` to imply explicit (spoken) punctuation, `Automatic` to let the decoder deal with punctuation, or `DictatedAndAutomatic` to use dictated and automatic punctuation. The default value is  `DictatedAndAutomatic`.|
|`timeToLive`|A duration after the transcription job is created, when the transcription results will be automatically deleted. The value is an ISO 8601 encoded duration. For example, specify `PT12H` for 12 hours. As an alternative, you can call [DeleteTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription) regularly after you retrieve the transcription results.|
|`wordLevelTimestampsEnabled`|Specifies if word level timestamps should be included in the output. The default value is `false`.|


::: zone-end

::: zone pivot="speech-cli"

For Speech CLI help with transcription configuration options, run the following command:

```azurecli-interactive
spx help batch transcription create advanced
```

::: zone-end

## Using custom models

Batch transcription uses the default base model for the locale that you specify. You don't need to set any properties to use the default base model. 

Optionally, you can modify the previous [create transcription example](#create-a-batch-transcription) by setting the `model` property to use a specific base model or [Custom Speech](how-to-custom-speech-train-model.md) model. 

::: zone pivot="rest-api"

```azurecli-interactive
curl -v -X POST -H "Ocp-Apim-Subscription-Key: YourSubscriptionKey" -H "Content-Type: application/json" -d '{
  "contentUrls": [
    "https://crbn.us/hello.wav",
    "https://crbn.us/whatstheweatherlike.wav"
  ],
  "locale": "en-US",
  "displayName": "My Transcription",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
  },
  "properties": {
    "wordLevelTimestampsEnabled": true,
  },
}'  "https://YourServiceRegion.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions"
```

::: zone-end

::: zone pivot="speech-cli"

```azurecli-interactive
spx batch transcription create --api-version v3.1 --name "My Transcription" --language "en-US" --content https://crbn.us/hello.wav;https://crbn.us/whatstheweatherlike.wav --model "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base/1aae1070-7972-47e9-a977-87e3b05c457d"
```

::: zone-end

To use a Custom Speech model for batch transcription, you need the model's URI. You can retrieve the model location when you create or get a model. The top-level `self` property in the response body is the model's URI. For an example, see the JSON response example in the [Create a model](how-to-custom-speech-train-model.md?pivots=rest-api#create-a-model) guide. A [custom model deployment endpoint](how-to-custom-speech-deploy-model.md) isn't needed for the batch transcription service.

Batch transcription requests for expired models will fail with a 4xx error. You'll want to set the `model` property to a base model or custom model that hasn't yet expired. Otherwise don't include the `model` property to always use the latest base model. For more information, see [Choose a model](how-to-custom-speech-create-project.md#choose-your-model) and [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md).


## Destination container URL

The transcription result can be stored in an Azure container. If you don't specify a container, the Speech service stores the results in a container managed by Microsoft. In that case, when the transcription job is deleted, the transcription result data is also deleted.

You can store the results of a batch transcription to a writable Azure Blob storage container using option `destinationContainerUrl` in the [batch transcription creation request](#create-a-transcription-job). Note however that this option is only using [ad hoc SAS](batch-transcription-audio-data.md#sas-url-for-batch-transcription) URI and doesn't support [Trusted Azure services security mechanism](batch-transcription-audio-data.md#trusted-azure-services-security-mechanism). The Storage account resource of the destination container must allow all external traffic.

The [Trusted Azure services security mechanism](batch-transcription-audio-data.md#trusted-azure-services-security-mechanism) is not supported for storing transcription results from a Speech resource. If you would like to store the transcription results in an Azure Blob storage container via the [Trusted Azure services security mechanism](batch-transcription-audio-data.md#trusted-azure-services-security-mechanism), then you should consider using [Bring-your-own-storage (BYOS)](speech-encryption-of-data-at-rest.md#bring-your-own-storage-byos-for-customization-and-logging). You can secure access to BYOS-associated Storage account exactly as described in the [Trusted Azure services security mechanism](batch-transcription-audio-data.md#trusted-azure-services-security-mechanism) guide, except that the BYOS Speech resource would need **Storage Blob Data Contributor** role assignment. The results of batch transcription performed by the BYOS Speech resource will be automatically stored in the **TranscriptionData** folder of the **customspeech-artifacts** blob container.

## Next steps

- [Batch transcription overview](batch-transcription.md)
- [Locate audio files for batch transcription](batch-transcription-audio-data.md)
- [Get batch transcription results](batch-transcription-get.md)
- [See batch transcription code samples at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch/)