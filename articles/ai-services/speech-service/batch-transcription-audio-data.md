---
title: Locate audio files for batch transcription - Speech service
titleSuffix: Azure AI services
description: Batch transcription is used to transcribe a large amount of audio in storage. You should provide multiple files per request or point to an Azure Blob Storage container with the audio files to transcribe.
#services: cognitive-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 10/21/2022
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurecli
---

# Locate audio files for batch transcription

Batch transcription is used to transcribe a large amount of audio in storage. Batch transcription can access audio files from inside or outside of Azure.

When source audio files are stored outside of Azure, they can be accessed via a public URI (such as "https://crbn.us/hello.wav"). Files should be directly accessible; URIs that require authentication or that invoke interactive scripts before the file can be accessed aren't supported. 

Audio files that are stored in Azure Blob storage can be accessed via one of two methods:
- [Trusted Azure services security mechanism](#trusted-azure-services-security-mechanism)
- [Shared access signature (SAS)](#sas-url-for-batch-transcription) URI. 

You can specify one or multiple audio files when creating a transcription. We recommend that you provide multiple files per request or point to an Azure Blob storage container with the audio files to transcribe. The batch transcription service can handle a large number of submitted transcriptions. The service transcribes the files concurrently, which reduces the turnaround time. 

## Supported audio formats and codecs

The batch transcription API supports a number of different formats and codecs, such as:

- WAV
- MP3
- OPUS/OGG
- AAC
- FLAC
- WMA
- ALAW in WAV container
- MULAW in WAV container
- AMR
- WebM
- M4A
- SPEEX


> [!NOTE]
> Batch transcription service integrates GStreamer and may accept more formats and codecs without returning errors, while we suggest to use lossless formats such as WAV (PCM encoding) and FLAC to ensure best transcription quality.

## Azure Blob Storage upload

When audio files are located in an [Azure Blob Storage](../../storage/blobs/storage-blobs-overview.md) account, you can request transcription of individual audio files or an entire Azure Blob Storage container. You can also [write transcription results](batch-transcription-create.md#destination-container-url) to a Blob container.

> [!NOTE]
> For blob and container limits, see [batch transcription quotas and limits](speech-services-quotas-and-limits.md#batch-transcription).

# [Azure portal](#tab/portal)

Follow these steps to create a storage account and upload wav files from your local directory to a new container. 

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. <a href="https://portal.azure.com/#create/Microsoft.StorageAccount-ARM"  title="Create a Storage account resource"  target="_blank">Create a Storage account resource</a> in the Azure portal. Use the same subscription and resource group as your Speech resource.
1. Select the Storage account.
1. In the **Data storage** group in the left pane, select **Containers**.
1. Select **+ Container**.
1. Enter a name for the new container and select **Create**.
1. Select the new container.
1. Select **Upload**.
1. Choose the files to upload and select **Upload**.

# [Azure CLI](#tab/azure-cli)

Follow these steps to create a storage account and upload wav files from your local directory to a new container. 

1. Set the `RESOURCE_GROUP` environment variable to the name of an existing resource group where the new storage account will be created. Use the same subscription and resource group as your Speech resource.

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

---

## Trusted Azure services security mechanism

This section explains how to set up and limit access to your batch transcription source audio files in an Azure Storage account using the [trusted Azure services security mechanism](../../storage/common/storage-network-security.md#trusted-access-based-on-a-managed-identity). 

> [!NOTE]
> With the trusted Azure services security mechanism, you need to use [Azure Blob storage](../../storage/blobs/storage-blobs-overview.md) to store audio files. Usage of [Azure Files](../../storage/files/storage-files-introduction.md) is not supported.

If you perform all actions in this section, your Storage account will be in the following configuration:
- Access to all external network traffic is prohibited.
- Access to Storage account using Storage account key is prohibited.
- Access to Storage account blob storage using [shared access signatures (SAS)](../../storage/common/storage-sas-overview.md) is prohibited.
- Access to the selected Speech resource is allowed using the resource [system assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

So in effect your Storage account becomes completely "locked" and can't be used in any scenario apart from transcribing audio files that were already present by the time the new configuration was applied. You should consider this configuration as a model as far as the security of your audio data is concerned and customize it according to your needs.

For example, you may allow traffic from selected public IP addresses and Azure Virtual networks. You may also set up access to your Storage account using [private endpoints](../../storage/common/storage-private-endpoints.md) (see as well [this tutorial](../../private-link/tutorial-private-endpoint-storage-portal.md)), re-enable access using Storage account key, allow access to other Azure trusted services, etc.

> [!NOTE] 
> Using [private endpoints for Speech](speech-services-private-link.md) isn't required to secure the storage account. You can use a private endpoint for batch transcription API requests, while separately accessing the source audio files from a secure storage account, or the other way around.

By following the steps below, you'll severely restrict access to the storage account. Then you'll assign the minimum required permissions for Speech resource managed identity to access the Storage account. 

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

> [!IMPORTANT]
> Upload audio files in a Blob container before locking down the storage account access.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the **Settings** group in the left pane, select **Configuration**.
1. Select **Disabled** for **Allow Blob public access**. 
1. Select **Disabled** for **Allow storage account key access**
1. Select **Save**.

For more information, see [Prevent anonymous public read access to containers and blobs](../../storage/blobs/anonymous-read-access-prevent.md) and [Prevent Shared Key authorization for an Azure Storage account](../../storage/common/shared-key-authorization-prevent.md).

### Configure Azure Storage firewall

Having restricted access to the Storage account, you need to grant access to specific managed identities. Follow these steps to add access for the Speech resource.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. In the **Security + networking** group in the left pane, select **Networking**.
1. In the **Firewalls and virtual networks** tab, select **Enabled from selected virtual networks and IP addresses**.
1. Deselect all check boxes.
1. Make sure **Microsoft network routing** is selected.
1. Under the **Resource instances** section, select **Microsoft.CognitiveServices/accounts** as the resource type and select your Speech resource as the instance name. 
1. Select **Save**.

    > [!NOTE]
    > It may take up to 5 min for the network changes to propagate.

Although by now the network access is permitted, the Speech resource can't yet access the data in the Storage account. You need to assign a specific access role for Speech resource managed identity.

### Assign resource access role

Follow these steps to assign the **Storage Blob Data Reader** role to the managed identity of your Speech resource.

> [!IMPORTANT]
> You need to be assigned the *Owner* role of the Storage account or higher scope (like Subscription) to perform the operation in the next steps. This is because only the *Owner* role can assign roles to others. See details [here](../../role-based-access-control/built-in-roles.md).

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Storage account.
1. Select **Access Control (IAM)** menu in the left pane.
1. Select **Add role assignment** in the **Grant access to this resource** tile.
1. Select **Storage Blob Data Reader** under **Role** and then select **Next**.
1. Select **Managed identity** under **Members** > **Assign access to**.
1. Assign the managed identity of your Speech resource and then select **Review + assign**.

    :::image type="content" source="media/storage/storage-identity-access-management-role.png" alt-text="Screenshot of the managed role assignment review.":::

1. After confirming the settings, select **Review + assign**

Now the Speech resource managed identity has access to the Storage account and can access the audio files for batch transcription.

With system assigned managed identity, you'll use a plain Storage Account URL (no SAS or other additions) when you [create a batch transcription](batch-transcription-create.md) request. For example: 

```json
{
    "contentContainerUrl": "https://<storage_account_name>.blob.core.windows.net/<container_name>"
}
```

You could otherwise specify individual files in the container. For example: 

```json
{
    "contentUrls": [
        "https://<storage_account_name>.blob.core.windows.net/<container_name>/<file_name_1>",
        "https://<storage_account_name>.blob.core.windows.net/<container_name>/<file_name_2>"
    ]
}
```

## SAS URL for batch transcription

A shared access signature (SAS) is a URI that grants restricted access to an Azure Storage container. Use it when you want to grant access to your batch transcription files for a specific time range without sharing your storage account key. 

> [!TIP]
> If the container with batch transcription source files should only be accessed by your Speech resource, use the [trusted Azure services security mechanism](#trusted-azure-services-security-mechanism) instead.

# [Azure portal](#tab/portal)

Follow these steps to generate a SAS URL that you can use for batch transcriptions.

1. Complete the steps in [Azure Blob Storage upload](#azure-blob-storage-upload) to create a Storage account and upload audio files to a new container.
1. Select the new container.
1. In the **Settings** group in the left pane, select **Shared access tokens**.
1. Select **+ Container**.
1. Select **Read** and **List** for **Permissions**.

    :::image type="content" source="media/storage/storage-container-shared-access-signature.png" alt-text="Screenshot of the container SAS URI permissions.":::

1. Enter the start and expiry times for the SAS URI, or leave the defaults.
1. Select **Generate SAS token and URL**.

# [Azure CLI](#tab/azure-cli)

Follow these steps to generate a SAS URL that you can use for batch transcriptions.

1. Complete the steps in [Azure Blob Storage upload](#azure-blob-storage-upload) to create a Storage account and upload audio files to a new container.
1. Generate a SAS URL with read (r) and list (l) permissions for the container with the [`az storage container generate-sas`](/cli/azure/storage/container#az-storage-container-generate-sas) command. Choose a new expiry date and replace `<mycontainer>` with the name of your container.

    ```azurecli-interactive
    az storage container generate-sas -n <mycontainer> --expiry 2022-10-10 --permissions rl --https-only
    ```

The previous command returns a SAS token. Append the SAS token to your container blob URL to create a SAS URL. For example: `https://<storage_account_name>.blob.core.windows.net/<container_name>?SAS_TOKEN`. 

---

You will use the SAS URL when you [create a batch transcription](batch-transcription-create.md) request. For example: 

```json
{
    "contentContainerUrl": "https://<storage_account_name>.blob.core.windows.net/<container_name>?SAS_TOKEN"
}
```

You could otherwise specify individual files in the container. You must generate and use a different SAS URL with read (r) permissions for each file. For example: 

```json
{
    "contentUrls": [
        "https://<storage_account_name>.blob.core.windows.net/<container_name>/<file_name_1>?SAS_TOKEN_1",
        "https://<storage_account_name>.blob.core.windows.net/<container_name>/<file_name_2>?SAS_TOKEN_2"
    ]
}
```

## Next steps

- [Batch transcription overview](batch-transcription.md)
- [Create a batch transcription](batch-transcription-create.md)
- [Get batch transcription results](batch-transcription-get.md)
- [See batch transcription code samples at GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch/)
