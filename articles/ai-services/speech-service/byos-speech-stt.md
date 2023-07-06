---
title: How to use Bring your own storage (BYOS) Speech resource for Speech to text
titleSuffix: Azure Cognitive Services
description: Learn how to use Bring your own storage (BYOS) Speech resource with Speech to text.
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 03/28/2023
ms.author: alexeyo 
---

# How to use the Bring your own storage (BYOS) Speech resource for Speech to text

Bring your own storage (BYOS) can be used in the following Speech to text scenarios:

!!!

1. [Batch transcription](batch-transcription.md)
1. Real-time transcription with [audio and transcription result logging](logging-audio-transcription.md) enabled
1. [Custom Speech](custom-speech-overview.md)

One Speech resource – Storage account combination can be used for all scenarios simultaneously in all combinations.

## Data storage

When using BYOS, Speech service doesn't keep any customer artifacts after the data processing (transcription, model training, model testing) is complete. However, some meta-data that isn't derived from the user content is stored within Speech service premises. For example, in Custom Speech scenario, the Service keeps certain information about the custom endpoints, like which models they use.

BYOS-associated Storage account stores the following data:

> [!NOTE]
> *Optional* in this section means, that it's possible, but not required to store the particular artifacts in the BYOS-associated Storage account. If needed, they can be stored elsewhere.

**Batch transcription**
- Source audio (optional)
- Batch transcription results

**Real-time transcription with audio and transcription result logging enabled**
- Audio and transcription result logs

**Custom Speech**
- Datasets for model training and testing (optional)
- All data and meta-data related to Custom models connected to the Speech resource associated with the BYOS Storage account

## Batch transcription

Batch transcription is used to transcribe a large amount of audio data in storage. If you're unfamiliar with Batch transcription, see [this section](batch-transcription.md) first.

Perform these steps to execute Batch transcription with BYOS-enabled Speech resource:

1. Start Batch transcription the usual way.

> [!IMPORTANT]
> Don't use `destinationContainerUrl` parameter in your transcription request. If you use BYOS, the transcription results are stored in the BYOS-associated Storage account automatically. 
>
> If you use `destinationContainerUrl` parameter, it will work, but provide significantly less security for your data, because of ad hoc SAS usage. See details in [this section](batch-transcription-create.md#destination-container-url).

2. Get transcription results are in `TranscriptionData` folder of `customspeech-artifacts` Blob container of the BYOS-associated Storage account.

### Get Batch transcription results via REST API

[Speech to text REST API](rest-speech-to-text.md) fully supports BYOS-enabled Speech resources. However, because the data is now stored within the BYOS-enabled Storage account, requests like [Get Transcription Files](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles) interact with the BYOS-associated Storage account Blob storage, instead of Speech service internal resources. It allows using the same REST API based code for both "regular" and BYOS-enabled Speech resources.

To achieve maximum security, use `sasValidityInSeconds` with the value set to `0` in your [Get Transcription Files](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles) request. Here's an example of the request URL:

```http
https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions/3b24ca19-2eb1-4a2a-b964-35d89eca486b/files?sasValidityInSeconds=0
```

Such request returns plain Storage Account URLs for data files (no SAS or other additions). For example:

```json
"links": {
        "contentUrl": "https://<BYOS_storage_account_name>.blob.core.windows.net/customspeech-artifacts/TranscriptionData/3b24ca19-2eb1-4a2a-b964-35d89eca486b_0_0.json"
      }
```

Such URL ensures, that only Azure Active Directory identities with sufficient access rights (like *Storage Blob Data Reader* role) can access the data from the URL.

> [!WARNING]
> If `sasValidityInSeconds` parameter is omitted in [Get Transcription Files](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles) request or similar ones, then a [User delegation SAS](../../storage/common/storage-sas-overview.md) with the validity of 30 days will be generated for all data file URLs returned. This SAS is signed by the system assigned managed identity of your BYOS-enabled Speech resource. Because of it, the SAS allows access to the data, even if storage account key access is disabled. See details [here](../../storage/common/shared-key-authorization-prevent.md#understand-how-disallowing-shared-key-affects-sas-tokens). 

## Next steps

!!!