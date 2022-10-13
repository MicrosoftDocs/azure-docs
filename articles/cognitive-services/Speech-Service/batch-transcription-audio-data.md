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

Batch transcription is used to transcribe a large amount of audio in storage. Batch transcription can access audio files from inside or outside of Azure.

- When source audio files are stored outside of Azure, they can be accessed via a public URI (such as "https://crbn.us/hello.wav"). Files should be directly accessible; URIs that require authentication or that invoke interactive scripts before the file can be accessed aren't supported. 
- Audio files that are stored in Azure Blob storage can be accessed using [trusted Azure services security mechanism](../../storage/common/storage-network-security.md#trusted-access-based-on-a-managed-identity) or via [shared access signature (SAS)](../../storage/common/storage-sas-overview.md) URI. 

You can specify one or multiple audio files when creating a transcription. We recommend that you provide multiple files per request or point to an Azure Blob storage container with the audio files to transcribe. The batch transcription service can handle a large number of submitted transcriptions. The service transcribes the files concurrently, which reduces the turnaround time. 

## Supported audio formats

The batch transcription API supports the following formats:

| Format | Codec | Bits per sample | Sample rate             |
|--------|-------|---------|---------------------------------|
| WAV    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| MP3    | PCM   | 16-bit  | 8 kHz or 16 kHz, mono or stereo |
| OGG    | OPUS  | 16-bit  | 8 kHz or 16 kHz, mono or stereo |

For stereo audio streams, the left and right channels are split during the transcription. A JSON result file is created for each input audio file. To create an ordered final transcript, use the timestamps that are generated per utterance.

## Azure Blob Storage with SAS

You need to use [Azure Blob storage](../../storage/blobs/storage-blobs-overview.md) to store audio files. Usage of [Azure Files](../../storage/files/storage-files-introduction.md) is not supported.
When audio files are stored in an Azure Blob storage you can provide individual audio files, or an entire Azure Blob Storage container. You can also write transcription results in a Blob container (note some [security considerations](how-to-batch-transcription-storage-security.md#store-the-transcription-results-in-a-blob-container)). This example shows how to transcribe audio files in [Azure Blob storage](../../storage/blobs/storage-blobs-overview.md).

The storage container must have at most 5 GB of audio data and a maximum number of 10,000 blobs. The maximum size for a blob is 2.5 GB.

Follow these steps to create a storage account and upload wav files from your local directory to a new container. 


You can provide individual audio files, or an entire Azure Blob Storage container. You can also read or write transcription results in a container. This example shows how to transcribe audio files in [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md).

The [shared access signature (SAS) URI](../../storage/common/storage-sas-overview.md) must have `r` (read) and `l` (list) permissions. The storage container must have at most 5GB of audio data and a maximum number of 10,000 blobs. The maximum size for a blob is 2.5GB.

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

## Trusted Azure services security mechanism

This section explains how to configure an Azure Storage account used for storing [Batch transcription](batch-transcription.md) audio files with the maximal restricted access rights. The article implies that the [trusted Azure services security mechanism](../../storage/common/storage-network-security.md#trusted-access-based-on-a-managed-identity) is used to access the files. 

If you perform all actions in this article, your Storage account will be in the following configuration:
- Access to all external network traffic is prohibited.
- Access to Storage account using Storage account key is prohibited.
- Access to Storage account blob storage using [shared access signatures (SAS)](../../storage/common/storage-sas-overview.md) is prohibited.
- Access to the selected Speech resource is allowed using the resource [system assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

So in effect your Storage account becomes completely "locked" and can't be used in any scenario apart from transcribing audio files that were already present by the time the new configuration was applied. You should consider this configuration as a "model" as far as the security of your audio data is concerned and enhance and/or relax it according to your needs.

For example, you may allow traffic from selected public IP addresses and/or Azure Virtual networks. You may also set up access to your Storage account using [private endpoints](../../storage/common/storage-private-endpoints.md) (see as well [this tutorial](../../private-link/tutorial-private-endpoint-storage-portal.md)), re-enable access using Storage account key, allow access to other Azure trusted services, etc.

In the steps below, you'll severely restrict access to the storage account. Then you'll assign the minimum required permissions for Speech resource managed identity to access the Storage account. 

### Enable system assigned managed identity for the Speech resource

Follow these steps to enable system assigned managed identity for the Speech resource that you will use for batch transcription. 

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Speech resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. On the **System assigned** tab, select **On** for the status.

    > [!IMPORTANT] 
    > User assigned managed identity won't meet requirements for the batch transcription storage account scenario. Be sure to enable system assigned managed identity.

1. Select **Save**

Now the managed identity for your Speech resource can be granted access to your storage account.

### Restrict access to the storage account

Follow these steps to restrict access to the storage account. 

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the **Settings** group in the left pane, select **Configuration**.
1. Select **Disabled** for **Allow Blob public access**. 
1. Select **Disabled** for **Allow storage account key access**
1. Select **Save**.

For more information, see [Prevent anonymous public read access to containers and blobs](/azure/storage/blobs/anonymous-read-access-prevent) and [Prevent Shared Key authorization for an Azure Storage account](/azure/storage/common/shared-key-authorization-prevent).

### Grant storage account access to the Speech resource

Having restricted access to the Storage account, you need to grant access to specific managed identities. Follow these steps to add access for the Speech resource.

1. Go to **Networking** menu in **Security + networking** group.
1. In the **Firewalls and virtual networks** tab select **Enabled from selected virtual networks and IP addresses**.
1. Deselect all check boxes.
1. Leave **Microsoft network routing** selected.
1. In **Resource instances** section add access for your Speech resource. Resource type will be **Microsoft.CognitiveServices/accounts**.
1. Press **Save**.

    > [!NOTE]
    > It may takes up to 5 min for the network changes to propagate.

Although now the access is permitted, the Speech resource can't yet access the Storage account. You need to assign a specific access role for Speech resource managed identity.

### Assign resource access role

Follow these steps to assign the **Storage Blob Data Read** role to the managed identity of your Speech resource.

> [!IMPORTANT]
> You need to be assigned the *Owner* role of the Storage account or higher scope (like Subscription) to perform the operation in the next steps. This is because only only the *Owner* role can assign roles to others. See details [here.](../../role-based-access-control/built-in-roles.md)

1. Go to **Access Control (IAM)** menu in the top menu group.
1. Click **Add role assignment** in **Grant access to this resource** group and assign the managed identity of your Speech resource to **Storage Blob Data Reader** role. Be sure to select **Managed identity** for **Assign access to** parameter.

Now the Speech resource managed identity has access to the Storage account and can access the audio files for batch transcription.

### Create batch transcription

With system assigned managed identity, you'll use a plain Storage Account URL (no SAS or other additions) when you [create a batch transcription](batch-transcription-create.md) request. For example: 

```json
{
    "contentContainerUrl": "https://<storage_account_name>.blob.core.windows.net/<container_name>"
}
```



## SAS URL for batch transcription

1. Generate a SAS URL with read (r) and list (l) permissions for the container with the [`az storage container generate-sas`](/cli/azure/storage/container#az-storage-container-generate-sas) command. Replace `<mycontainer>` with the name of your container.

    ```azurecli-interactive
    az storage container generate-sas -n <mycontainer> --expiry 2022-09-09 --permissions rl --https-only
    ```

The previous command returns a SAS token. Append the SAS token to your container blob URL to create a SAS URL. For example: `https://<storage_account_name>.blob.core.windows.net/<container_name>?SAS_TOKEN`. 

### Create batch transcription

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
