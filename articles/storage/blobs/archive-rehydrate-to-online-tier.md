---
title: Rehydrate an archived blob to an online tier
titleSuffix: Azure Storage
description: Before you can read a blob that is in the archive tier, you must rehydrate it to either the hot or cool tier. You can rehydrate a blob either by copying it from the archive tier to an online tier, or by changing its tier from archive to hot or cool.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/11/2021
ms.author: tamram
ms.reviewer: fryu
ms.custom: devx-track-azurepowershell
ms.subservice: blobs
---

# Rehydrate an archived blob to an online tier

To read a blob that is in the archive tier, you must first rehydrate the blob to the hot or cool tier. You can rehydrate a blob in one of two ways:

- By copying it to a new blob in the hot or cool tier with the [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url) operation. Microsoft recommends this option for most scenarios.

- By changing its tier from archive to hot or cool with the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation.

A rehydration operation may take up to 15 hours to complete. You can configure Azure Event Grid to fire an event when rehydration is complete and run application code in response. To learn how to handle an event that runs an Azure Function when the blob rehydration operation is complete, see [Run an Azure Function in response to a blob rehydration event](archive-rehydrate-handle-event.md).

## Rehydrate a blob with a copy operation

To rehydrate a blob from the archive tier by copying it to an online tier, use PowerShell, Azure CLI, or one of the Azure Storage client libraries. The following examples show how to copy an archived blob with PowerShell or Azure CLI.

### [Azure portal](#tab/portal)

N/A

### [PowerShell](#tab/powershell)

To copy an archived blob to an online tier with PowerShell, call the [Start-AzStorageBlobCopy](/powershell/module/az.storage/start-azstorageblobcopy) command and specify the target tier and the rehydration priority. Remember to replace placeholders in angle brackets with your own values:

```powershell
# Initialize these variables with your values.
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$srcContainerName = "<source-container>"
$destContainerName = "<dest-container>"
$srcBlobName = "<source-blob>"
$destBlobName = "<dest-blob>"

# Get the storage account context
$ctx = (Get-AzStorageAccount `
        -ResourceGroupName $rgName `
        -Name $accountName).Context

# Copy the source blob to a new destination blob in hot tier with standard priority.
Start-AzStorageBlobCopy -SrcContainer $srcContainerName `
    -SrcBlob $srcBlobName `
    -DestContainer $destContainerName `
    -DestBlob $destBlobName `
    -StandardBlobTier Hot `
    -RehydratePriority Standard `
    -Context $ctx
```

### [Azure CLI](#tab/azure-cli)

To copy an archived blob to an online tier with Azure CLI, call the [az storage blob copy start](/cli/azure/storage/blob/copy#az_storage_blob_copy_start) command and specify the target tier and the rehydration priority. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob copy start \
    --source-container <source-container> \
    --source-blob <source-blob> \
    --destination-container <dest-container> \
    --destination-blob <dest-blob> \
    --account-name <storage-account> \
    --tier hot \
    --rehydrate-priority standard \
    --auth-mode login
```

---

Keep in mind that when you copy an archived blob to an online tier, the source and destination blobs must have different names.

After the copy operation is complete, the destination blob appears in the archive tier, as shown in the following image.

:::image type="content" source="media/archive-rehydrate-to-online-tier/copy-blob-archive-tier.png" alt-text="Screenshot showing the newly copied destination blob in the archive tier in the Azure portal":::

The destination blob is subsequently rehydrated to the online tier that you specified in the copy operation. In the Azure portal, you'll see that the fully rehydrated destination blob now appears in the targeted online tier.

:::image type="content" source="media/archive-rehydrate-to-online-tier/copy-blob-archive-tier-rehydrated.png" alt-text="Screenshot showing the original blob in the archive tier, the rehydrated blob in the hot tier, and the log blob written by the event handler":::

## Rehydrate a blob with Set Blob Tier

To rehydrate a blob by changing its tier from archive to hot or cool operation, use the Azure portal, PowerShell, or Azure CLI.

### [Azure portal](#tab/portal)

To change a blob's tier from archive to hot or cool in the Azure portal, follow these steps:

1. Locate the blob to rehydrate in the Azure portal.
1. Select the **More** button on the right side of the page.
1. Select **Change tier**.
1. Select the target access tier from the **Access tier** dropdown.
1. From the **Rehydrate priority** dropdown, select the desired rehydration priority. Keep in mind that setting the rehydration priority to *High* typically results in a faster rehydration, but also incurs a greater cost.

    :::image type="content" source="media/archive-rehydrate-to-online-tier/rehydrate-change-tier-portal.png" alt-text="Screenshot showing how to rehydrate a blob from the archive tier in the Azure portal ":::

1. Select the **Save** button.

### [PowerShell](#tab/powershell)

To change a blob's tier from archive to hot or cool with PowerShell, use the blob's **ICloudBlob** property to return a .NET reference to the blob, then call the **SetStandardBlobTier** method on that reference. Remember to replace placeholders in angle brackets with your own values:

```powershell
# Initialize these variables with your values.
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container>"
$blobName = "<archived-blob>"

# Get the storage account context
$ctx = (Get-AzStorageAccount `
        -ResourceGroupName $rgName `
        -Name $accountName).Context

# Change the blob’s access tier to hot with standard priority.
$blob = Get-AzStorageBlob -Container $containerName -Blob $blobName -Context $ctx
$blob.ICloudBlob.SetStandardBlobTier("Hot", "Standard")
```

### [Azure CLI](#tab/azure-cli)

To change a blob's tier from archive to hot or cool with Azure CLI, call the [az storage blob set-tier](/cli/azure/storage/blob#az_storage_blob_set_tier) command. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob set-tier /
    --container-name <container> /
    --name <archived-blob> /
    --tier Hot /
    --account-name <account-name> /
    --rehydrate-priority High /
    --auth-mode login
```

---

## Check the status of a rehydration operation

While the blob is rehydrating, you can check its status and rehydration priority using the Azure portal, PowerShell, or Azure CLI.

Keep in mind that rehydration of an archived blob may take up to 15 hours, and repeatedly polling the blob's status to determine whether rehydration is complete is inefficient. Using Azure Event Grid to capture the event that fires when rehydration is complete offers better performance and cost optimization. To learn how to run an Azure Function when an event fires on blob rehydration, see [Run an Azure Function in response to a blob rehydration event](archive-rehydrate-handle-event.md).

### [Azure portal](#tab/portal)

To check the status and priority of a pending rehydration operation in the Azure portal, display the **Change tier** dialog for the blob again:

:::image type="content" source="media/archive-rehydrate-to-online-tier/rehydration-status-portal.png" alt-text="Screenshot showing the rehydration status for a blob in the Azure portal":::

When the rehydration is complete, you can see in the Azure portal that the fully rehydrated blob now appears in the targeted online tier.

:::image type="content" source="media/archive-rehydrate-to-online-tier/set-blob-tier-rehydrated.png" alt-text="Screenshot showing the rehydrated blob in the cool tier and the log blob written by the event handler":::

### [PowerShell](#tab/powershell)

To check the status and priority of a pending rehydration operation with PowerShell, call the [Get-AzStorageBlob](/powershell/module/az.storage/get-azstorageblob) command, and check the **RehydrationStatus** and **RehydratePriority** properties of the blob. If the rehydration is a copy operation, check these properties on the destination blob. Remember to replace placeholders in angle brackets with your own values:

```powershell
$rehydratingBlob = Get-AzStorageBlob -Container $containerName -Blob $blobName -Context $ctx
$rehydratingBlob.BlobProperties.RehydratePriority
$rehydratingBlob.ICloudBlob.Properties.RehydrationStatus
```

### [Azure CLI](#tab/azure-cli)

To check the status and priority of a pending rehydration operation with Azure CLI, call the [az storage blob show](/cli/azure/storage/blob#az_storage_blob_show) command, and check the **rehydrationStatus** and **rehydratePriority** properties of the destination blob. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob show \
    --account-name <storage-account> \
    --container-name <container> \
    --name <destination-blob> \
    --query '[rehydratePriority, properties.rehydrationStatus]' \
    --output tsv \
    --auth-mode login
```

---

## See also

- [Rehydrate blob data from the archive tier](archive-rehydrate-overview.md)
- [Run an Azure Function in response to a blob rehydration event](archive-rehydrate-to-online-tier.md)
- [Reacting to Blob storage events](storage-blob-event-overview.md)
