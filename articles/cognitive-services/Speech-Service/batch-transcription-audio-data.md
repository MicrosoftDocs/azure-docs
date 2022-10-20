---
title: Locate audio files for batch transcription - Speech service
titleSuffix: Azure Cognitive Services
description: Batch transcription is used to transcribe a large amount of audio in storage. You should provide multiple files per request or point to an Azure Blob Storage container with the audio files to transcribe.
services: cognitive-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 09/11/2022
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Locate audio files for batch transcription

Batch transcription is used to transcribe a large amount of audio in storage. Batch transcription can read audio files from a public URI (such as "https://crbn.us/hello.wav") or a [shared access signature (SAS)](../../storage/common/storage-sas-overview.md) URI. 

You should provide multiple files per request or point to an Azure Blob Storage container with the audio files to transcribe. The batch transcription service can handle a large number of submitted transcriptions. The service transcribes the files concurrently, which reduces the turnaround time. 

## Supported audio formats

The batch transcription API supports the following formats:

| Format | Codec | Bits per sample | Sample rate             |
|--------|-------|---------|---------------------------------|
| WAV    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| MP3    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| OGG    | OPUS  | 16-bit  | 8 kHz or 16 kHz, mono or stereo |

For stereo audio streams, the left and right channels are split during the transcription. A JSON result file is created for each input audio file. To create an ordered final transcript, use the timestamps that are generated per utterance.

## Azure Blob Storage example

Batch transcription can read audio files from a public URI (such as "https://crbn.us/hello.wav") or a [shared access signature (SAS)](../../storage/common/storage-sas-overview.md) URI. You can provide individual audio files, or an entire Azure Blob Storage container. You can also read or write transcription results in a container. This example shows how to transcribe audio files in [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md).

The [SAS URI](../../storage/common/storage-sas-overview.md) must have `r` (read) and `l` (list) permissions. The storage container must have at most 5GB of audio data and a maximum number of 10,000 blobs. The maximum size for a blob is 2.5GB.

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

The previous command returns a SAS token. Append the SAS token to your container blob URL to create a SAS URL. For example: `https://<storage_account_name>.blob.core.windows.net/<container_name>?SAS_TOKEN`. 

You will use the SAS URL when you [create a batch transcription](batch-transcription-create.md) request. For example: 

```json
{
    "contentContainerUrl": "https://<storage_account_name>.blob.core.windows.net/<container_name>?SAS_TOKEN"
}
```

## Next steps

- [Batch transcription overview](batch-transcription.md)
- [Create a batch transcription](batch-transcription-create.md)
- [Get batch transcription results](batch-transcription-get.md)
