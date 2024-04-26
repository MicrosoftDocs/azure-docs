---
title: Set a blob's access tier
titleSuffix: Azure Storage
description: Learn how to specify a blob's access tier when you upload it, or how to change the access tier for an existing blob.
author: normesta
ms.author: normesta
ms.date: 08/10/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.reviewer: fryu
ms.devlang: powershell
# ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Set a blob's access tier

You can set a blob's access tier in any of the following ways:

- By setting the default online access tier (hot or cool) for the storage account. Blobs in the account inherit this access tier unless you explicitly override the setting for an individual blob.
- By explicitly setting a blob's tier on upload. You can create a blob in the hot, cool, cold, or archive tier.
- By changing an existing blob's tier with a Set Blob Tier operation. Typically, you would use this operation to move from a hotter tier to a cooler one.
- By copying a blob with a Copy Blob operation. Typically, you would use this operation to move from a cooler tier to a hotter one.

This article describes how to manage a blob in an online access tier. For more information about how to move a blob to the archive tier, see [Archive a blob](archive-blob.md). For more information about how to rehydrate a blob from the archive tier, see [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md).

For more information about access tiers for blobs, see [Access tiers for blob data](access-tiers-overview.md).

## Set the default access tier for a storage account

The default access tier setting for a general-purpose v2 storage account determines in which online tier a new blob is created by default. You can set the default access tier for a general-purpose v2 storage account at the time that you create the account or by updating an existing account's configuration.

When you change the default access tier setting for an existing general-purpose v2 storage account, the change applies to all blobs in the account for which an access tier hasn't been explicitly set. Changing the default access tier may have a billing impact. For details, see [Default account access tier setting](access-tiers-overview.md#default-account-access-tier-setting).

#### [Portal](#tab/azure-portal)

To set the default access tier for a storage account at create time in the Azure portal, follow these steps:

1. Navigate to the **Storage accounts** page, and select the **Create** button.

2. Fill out the **Basics** tab.

3. On the **Advanced** tab, under **Blob storage**, set the **Access tier** to either *Hot* or *Cool*. The default setting is *Hot*.

4. Select **Review + Create** to validate your settings and create your storage account.

    :::image type="content" source="media/access-tiers-online-manage/set-default-access-tier-create-portal.png" alt-text="Screenshot showing how to set the default access tier when creating a storage account.":::

To update the default access tier for an existing storage account in the Azure portal, follow these steps:

1. Navigate to the storage account in the Azure portal.

2. Under **Settings**, select **Configuration**.

3. Locate the **Blob access tier (default)** setting, and select either *Hot* or *Cool*. The default setting is *Hot*, if you have not previously set this property.

4. Save your changes.

#### [PowerShell](#tab/azure-powershell)

To change the default access tier setting for a storage account with PowerShell, call the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) command, specifying the new default access tier.

```azurepowershell
$rgName = <resource-group>
$accountName = <storage-account>

# Change the storage account tier to cool
Set-AzStorageAccount -ResourceGroupName $rgName -Name $accountName -AccessTier Cool
```

#### [Azure CLI](#tab/azure-cli)

To change the default access tier setting for a storage account with PowerShell, call the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) command, specifying the new default access tier.

```azurecli
# Change the storage account tier to cool
az storage account update \
    --resource-group <resource-group> \
    --name <storage-account> \
    --access-tier Cool
```

#### [AzCopy](#tab/azcopy)

N/A

---

## Set a blob's tier on upload

When you upload a blob to Azure Storage, you have two options for setting the blob's tier on upload:

- You can explicitly specify the tier in which the blob will be created. This setting overrides the default access tier for the storage account. You can set the tier for a blob or set of blobs on upload to hot, cool, cold or archive.
- You can upload a blob without specifying a tier. In this case, the blob will be created in the default access tier specified for the storage account (either hot or cool).

If you are uploading a new blob that uses an encryption scope, you cannot change the access tier for that blob.

The following sections describe how to specify that a blob is uploaded to either the hot or cool tier. For more information about archiving a blob on upload, see [Archive blobs on upload](archive-blob.md#archive-blobs-on-upload).

### Upload a blob to a specific online tier

To create a blob in the hot, cool, or cold tier, specify that tier when you create the blob. The access tier specified on upload overrides the default access tier for the storage account.

### [Portal](#tab/azure-portal)

To upload a blob or set of blobs to a specific tier from the Azure portal, follow these steps:

1. Navigate to the target container.

2. Select the **Upload** button.

3. Select the file or files to upload.

4. Expand the **Advanced** section, and set the **Access tier** to *Hot* or *Cool*.

5. Select the **Upload** button.

    :::image type="content" source="media/access-tiers-online-manage/upload-blob-to-online-tier-portal.png" alt-text="Screenshot showing how to upload blobs to an online tier in the Azure portal.":::

### [PowerShell](#tab/azure-powershell)

To upload a blob or set of blobs to a specific tier with PowerShell, call the [Set-AzStorageBlobContent](/powershell/module/az.storage/set-azstorageblobcontent) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values:

```azurepowershell
$rgName = <resource-group>
$storageAccount = <storage-account>
$containerName = <container>
# tier can be hot, cool, cold, or archive
$tier = <tier>

# Get context object
$ctx = New-AzStorageContext -StorageAccountName $storageAccount -UseConnectedAccount

# Create new container.
New-AzStorageContainer -Name $containerName -Context $ctx

# Upload a single file named blob1.txt to the cool tier.
Set-AzStorageBlobContent -Container $containerName `
    -File "blob1.txt" `
    -Blob "blob1.txt" `
    -Context $ctx `
    -StandardBlobTier Cool

# Upload the contents of a sample-blobs directory to the cool tier, recursively.
Get-ChildItem -Path "C:\sample-blobs" -File -Recurse | 
    Set-AzStorageBlobContent -Container $containerName `
        -Context $ctx `
        -StandardBlobTier $tier
```

### [Azure CLI](#tab/azure-cli)

To upload a blob to a specific tier with Azure CLI, call the [az storage blob upload](/cli/azure/storage/blob#az-storage-blob-upload) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values. Replace the `<tier>` placeholder with `hot`, `cool`, `cold`, or `archive`.

```azurecli
az storage blob upload \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --file <file> \
    --tier <tier> \
    --auth-mode login
```

To upload a set of blobs to a specific tier with Azure CLI, call the [az storage blob upload-batch](/cli/azure/storage/blob#az-storage-blob-upload-batch) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values. Replace the `<tier>` placeholder with `hot`, `cool`, `cold`, or `archive`.

```azurecli
az storage blob upload-batch \
    --destination <container> \
    --source <source-directory> \
    --account-name <storage-account> \
    --tier <tier> \
    --auth-mode login
```

### [AzCopy](#tab/azcopy)





To upload a blob to a specific tier by using AzCopy, use the [azcopy copy](../common/storage-ref-azcopy-copy.md) command and set the `--block-blob-tier` parameter to `hot`, `cool`, or `archive`.

> [!NOTE]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes (''). <br>This example excludes the SAS token because it assumes that you've provided authorization credentials by using Microsoft Entra ID.  See the [Get started with AzCopy](../common/storage-use-azcopy-v10.md) article to learn about the ways that you can provide authorization credentials to the storage service.

```azcopy
azcopy copy '<local-file-path>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>' --block-blob-tier <blob-tier>
```

To upload a set of blobs to a specific tier by using AzCopy, refer to the local directory or local directory contents, and then append `--recursive=true` to the command.

**Local directory example**

```azcopy
azcopy copy '<local-directory-path>' 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>' --block-blob-tier <blob-tier> --recursive=true
```

**Local directory contents example**

```azcopy
azcopy copy '<local-directory-path>\*' 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>' --block-blob-tier <blob-tier> --recursive=true
```



---

### Upload a blob to the default tier

Storage accounts have a default access tier setting that indicates in which online tier a new blob is created. The default access tier setting can be set to either hot or cool. The behavior of this setting is slightly different depending on the type of storage account:

- The default access tier for a new general-purpose v2 storage account is set to the hot tier by default. You can change the default access tier setting when you create a storage account or after it's created.
- When you create a legacy Blob Storage account, you must specify the default access tier setting as hot or cool when you create the storage account. You can change the default access tier setting for the storage account after it's created.

A blob that doesn't have an explicitly assigned tier infers its tier from the default account access tier setting. You can determine whether a blob's access tier is inferred by using the Azure portal, PowerShell, or Azure CLI.

#### [Portal](#tab/azure-portal)

If a blob's access tier is inferred from the default account access tier setting, then the Azure portal displays the access tier as **Hot (inferred)** or **Cool (inferred)**.

:::image type="content" source="media/access-tiers-online-manage/default-access-tier-portal.png" alt-text="Screenshot showing blobs with the default access tier in the Azure portal.":::

#### [PowerShell](#tab/azure-powershell)

To determine a blob's access tier and whether it's inferred from Azure PowerShell, retrieve the blob, then check its **AccessTier** and **AccessTierInferred** properties.

```azurepowershell
$rgName = "<resource-group>"
$storageAccount = "<storage-account>"
$containerName = "<container>"
$blobName = "<blob>"

# Get the storage account context.
$ctx = New-AzStorageContext -StorageAccountName $storageAccount -UseConnectedAccount

# Get the blob from the service.
$blob = Get-AzStorageBlob -Context $ctx -Container $containerName -Blob $blobName

# Check the AccessTier and AccessTierInferred properties.
# If the access tier is inferred, that property returns true.
$blob.BlobProperties.AccessTier
$blob.BlobProperties.AccessTierInferred
```

#### [Azure CLI](#tab/azure-cli)

To determine a blob's access tier and whether it's inferred from Azure CLI, retrieve the blob, then check its **blobTier** and **blobTierInferred** properties.

```azurecli
az storage blob show \
    --container-name <container> \
    --name <blob> \
    --account-name <storage-account> \
    --query '[properties.blobTier, properties.blobTierInferred]' \
    --output tsv \
    --auth-mode login 
```

#### [AzCopy](#tab/azcopy)

N/A

---

## Move a blob to a different online tier

You can move a blob to a different online tier in one of two ways:

- By changing the access tier.
- By copying the blob to a different online tier.

For more information about each of these options, see [Setting or changing a blob's tier](access-tiers-overview.md#setting-or-changing-a-blobs-tier).

Use PowerShell, Azure CLI, AzCopy v10, or one of the Azure Storage client libraries to move a blob to a different tier.

### Change a blob's tier

When you change a blob's tier, you move that blob and all of its data to the target tier by calling the [Set Blob Tier](/rest/api/storageservices/set-blob-tier) operation (either directly or via a [lifecycle management](access-tiers-overview.md#blob-lifecycle-management) policy), or by using the [azcopy set-properties](../common/storage-ref-azcopy-set-properties.md) command with AzCopy. This option is typically the best when you're changing a blob's tier from a hotter tier to a cooler one.

#### [Portal](#tab/azure-portal)

To change a blob's tier to a cooler tier in the Azure portal, follow these steps:

1. Navigate to the blob for which you want to change the tier.
1. Select the blob, then select the **Change tier** button.
1. In the **Change tier** dialog, select the target tier.
1. Select the **Save** button.

    :::image type="content" source="media/access-tiers-online-manage/change-blob-tier-portal.png" alt-text="Screenshot showing how to change a blob's tier in the Azure portal":::

#### [PowerShell](#tab/azure-powershell)

To change a blob's tier to a cooler tier with PowerShell, use the blob's **BlobClient** property to return a .NET reference to the blob, then call the **SetAccessTier** method on that reference. Remember to replace placeholders in angle brackets with your own values:

```azurepowershell
# Initialize these variables with your values.
$rgName = "<resource-group>"
$accountName = "<storage-account>"
$containerName = "<container>"
$blobName = "<blob>"
$tier = "<tier>"

# Get the storage account context
$ctx = (Get-AzStorageAccount `
        -ResourceGroupName $rgName `
        -Name $accountName).Context

# Change the blob's access tier.
$blob = Get-AzStorageBlob -Container $containerName -Blob $blobName -Context $ctx
$blob.BlobClient.SetAccessTier($tier, $null, "Standard")
```

#### [Azure CLI](#tab/azure-cli)

To change a blob's tier to a cooler tier with Azure CLI, call the [az storage blob set-tier](/cli/azure/storage/blob#az-storage-blob-set-tier) command. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob set-tier \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --tier <tier> \
    --auth-mode login
```

#### [AzCopy](#tab/azcopy)

To change a blob's tier to a cooler tier, use the [azcopy set-properties](..\common\storage-ref-azcopy-set-properties.md) command and set the `-block-blob-tier` parameter.

> [!IMPORTANT]
> Using AzCopy to change a blob's access tier is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes (''). <br>This example excludes the SAS token because it assumes that you've provided authorization credentials by using Microsoft Entra ID.  See the [Get started with AzCopy](../common/storage-use-azcopy-v10.md) article to learn about the ways that you can provide authorization credentials to the storage service.

```azcopy
azcopy set-properties 'https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>' --block-blob-tier=<tier>
```

To change the access tier for all blobs in a virtual directory, refer to the virtual directory name instead of the blob name, and then append `--recursive=true` to the command.

```azcopy
azcopy set-properties 'https://<storage-account-name>.blob.core.windows.net/<container-name>/myvirtualdirectory' --block-blob-tier=<tier> --recursive=true
```



---

### Copy a blob to a different online tier

Call [Copy Blob](/rest/api/storageservices/copy-blob) operation to copy a blob from one tier to another. When you copy a blob to a different tier, you move that blob and all of its data to the target tier. The source blob remains in the original tier, and a new blob is created in the target tier. Calling [Copy Blob](/rest/api/storageservices/copy-blob) is recommended for most scenarios where you're moving a blob to a warmer tier, or rehydrating a blob from the archive tier.

#### [Portal](#tab/azure-portal)

N/A

#### [PowerShell](#tab/azure-powershell)

To copy a blob to from cool to hot with PowerShell, call the [Start-AzStorageBlobCopy](/powershell/module/az.storage/start-azstorageblobcopy) command and specify the target tier. Remember to replace placeholders in angle brackets with your own values:

```azurepowershell
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

# Copy the source blob to a new destination blob in hot tier.
Start-AzStorageBlobCopy -SrcContainer $srcContainerName `
    -SrcBlob $srcBlobName `
    -DestContainer $destContainerName `
    -DestBlob $destBlobName `
    -StandardBlobTier Hot `
    -Context $ctx
```

#### [Azure CLI](#tab/azure-cli)

To copy a blob to a warmer tier with Azure CLI, call the [az storage blob copy start](/cli/azure/storage/blob/copy#az-storage-blob-copy-start) command and specify the target tier. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob copy start \
    --source-container <source-container> \
    --source-blob <source-blob> \
    --destination-container <dest-container> \
    --destination-blob <dest-blob> \
    --account-name <storage-account> \
    --tier hot \
    --auth-mode login
```

#### [AzCopy](#tab/azcopy)

To copy a blob from cool to hot with AzCopy, use [azcopy copy](..\common\storage-ref-azcopy-copy.md) command and set the `--block-blob-tier` parameter to `hot`.

> [!NOTE]
> This example encloses path arguments with single quotes (''). Use single quotes in all command shells except for the Windows Command Shell (cmd.exe). If you're using a Windows Command Shell (cmd.exe), enclose path arguments with double quotes ("") instead of single quotes (''). <br><br>This example excludes the SAS token because it assumes that you've provided authorization credentials by using Microsoft Entra ID.  See the [Get started with AzCopy](../common/storage-use-azcopy-v10.md) article to learn about the ways that you can provide authorization credentials to the storage service.
> <br><br>AzCopy doesn't support copy from a source blob in archive tier.





```azcopy
azcopy copy 'https://mystorageeaccount.blob.core.windows.net/mysourcecontainer/myTextFile.txt' 'https://mystorageaccount.blob.core.windows.net/mydestinationcontainer/myTextFile.txt' --block-blob-tier=hot
```

The copy operation is synchronous so when the command returns, all files are copied.

---

### Bulk tiering

To move blobs to another tier in a container or a folder, enumerate blobs and call the Set Blob Tier operation on each one. The following example shows how to perform this operation:

#### [Portal](#tab/azure-portal)

N/A

#### [PowerShell](#tab/azure-powershell)

```azurepowershell
# Initialize these variables with your values.
    $rgName = "<resource-group>"
    $accountName = "<storage-account>"
    $containerName = "<container>"
    $folderName = "<folder>/"

    $ctx = (Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName).Context

    $blobCount = 0
    $Token = $Null
    $MaxReturn = 5000

    do {
        $Blobs = Get-AzStorageBlob -Context $ctx -Container $containerName -Prefix $folderName -MaxCount $MaxReturn -ContinuationToken $Token
        if($Blobs -eq $Null) { break }

        #Set-StrictMode will cause Get-AzureStorageBlob returns result in different data types when there is only one blob
        if($Blobs.GetType().Name -eq "AzureStorageBlob")
        {
            $Token = $Null
        }
        else
        {
            $Token = $Blobs[$Blobs.Count - 1].ContinuationToken;
        }

        $Blobs | ForEach-Object {
                if($_.BlobType -eq "BlockBlob") {
                    $_.BlobClient.SetAccessTier("Cold", $null)
                }
            }
    }
    While ($Token -ne $Null)
    
```

#### [Azure CLI](#tab/azure-cli)

```azurecli
az storage blob list --account-name $accountName --account-key $key \
    --container-name $containerName --prefix $folderName \
    --query "[?properties.blobTier == 'Cool'].name" --output tsv \
    | xargs -I {} -P 10 \
    az storage blob set-tier --account-name $accountName --account-key $key \
    --container-name $containerName --tier Cold --name "{}" 
```

#### [AzCopy](#tab/azcopy)

N/A

---

When moving a large number of blobs to another tier, use a batch operation for optimal performance. A batch operation sends multiple API calls to the service with a single request. The suboperations supported by the [Blob Batch](/rest/api/storageservices/blob-batch) operation include [Delete Blob](/rest/api/storageservices/delete-blob) and [Set Blob Tier](/rest/api/storageservices/set-blob-tier).

> [!NOTE]
> The [Set Blob Tier](/rest/api/storageservices/set-blob-tier) suboperation of the [Blob Batch](/rest/api/storageservices/blob-batch) operation is not yet supported in accounts that have a hierarchical namespace.

To change access tier of blobs with a batch operation, use one of the Azure Storage client libraries. The following code example shows how to perform a basic batch operation with the .NET client library:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/AccessTiers.cs" id="Snippet_BulkArchiveContainerContents":::

For an in-depth sample application that shows how to change tiers with a batch operation, see [AzBulkSetBlobTier](/samples/azure/azbulksetblobtier/azbulksetblobtier/).

## Next steps

- [Access tiers for blob data](access-tiers-overview.md)
- [Archive a blob](archive-blob.md)
- [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md)

