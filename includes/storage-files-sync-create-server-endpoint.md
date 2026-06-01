---
title: Include file
description: Include file
services: storage
author: khdownie
ms.service: azure-file-storage
ms.topic: include
ms.date: 06/04/2024
ms.author: kendownie
ms.custom: include file, devx-track-azurecli 
ms.devlang: azurecli
---

# [Portal](#tab/azure-portal)

1. Go to the newly created sync group.

1. Under **Server endpoints**, select **+Add server endpoint**.

1. On the **Add server endpoint** pane, enter the following information:

   - **Registered Server**: Select the name of the server or cluster where you want to create the server endpoint.

   - **Path**: Enter the path on the Windows Server instance to be synced to the Azure file share. The path can be a folder (for example, **D:\Data**), volume root (for example, **D:\\**), or volume mount point (for example, **D:\Mount**).

   - **Cloud Tiering**: This section includes a switch to enable or disable cloud tiering. With cloud tiering, infrequently used or accessed files can be tiered to Azure Files. When you enable cloud tiering, there are two policies that you can set to inform Azure File Sync when to tier cool files:

     - **Volume Free Space Policy**: The amount of free space to reserve on the volume on which the server endpoint is located. For example, if volume free space is set to 50% on a volume that has only one server endpoint, roughly half the amount of data is tiered to Azure Files. Regardless of whether cloud tiering is enabled, your Azure file share always has a complete copy of the data in the sync group.

     - **Date Policy**: Files are tiered to the cloud if they aren't accessed (that is, read or written to) for the specified number of days. For example, if you notice that files that go more than 15 days without being accessed are typically archival files, you should set your date policy to 15 days.

     :::image type="content" source="media/storage-files-sync-create-server-endpoint/create-server-endpoint.png" alt-text="Screenshot that shows options for cloud tiering on the pane for adding a server endpoint.":::

   - **Initial Sync**: This section is available only for the first server endpoint in a sync group. (The section changes to **Initial Download** when you're creating more than one server endpoint in a sync group.) You can select the following behavior:

     - **Initial Upload**: How the server initially uploads the data to the Azure file share. Two options are available:

       - Merge the content of this server path with the content in the Azure file share. Files with the same name and path will lead to conflicts if their content is different. Both versions of those files are stored next to each other. If your server path or Azure file share is empty, always choose this option.
       - Authoritatively overwrite files and folders in the Azure file share with content in this server's path. This option avoids file conflicts.

     To learn more, see [Initial sync section](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-sync-section).

     - **Initial Download**: How the server initially downloads the Azure file share data. This setting is important when the server is connecting to an Azure file share that contains files. Three options are available:

       - Download the namespace first and then recall the file content, as much as you can fit on the local disk. *Namespace* stands for the file and folder structure without the file content.
       - Download the namespace only. The file content is recalled when it's accessed.
       - Avoid tiered files. Files appear on the server only after they're fully downloaded. Local access or policy recalls the file content of tiered files from the cloud to the server.

     To learn more, see [Initial download section](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-download-section).

1. To finish adding the server endpoint, select **Create**. Your files are now kept in sync across your Azure file share and Windows Server instance.

> [!NOTE]
> Azure File Sync takes a snapshot of the Azure file share as a backup before it creates the server endpoint. You can use this snapshot to restore the share to the state from before the server endpoint was created.
>
> The snapshot isn't removed automatically after the server endpoint is created. You can delete it manually if you don't need it.
>
> You can find the snapshots that Azure File Sync created by viewing the snapshots for the Azure file share and checking for **AzureFileSync** in the **Initiator** column.

# [PowerShell](#tab/azure-powershell)

Run the following PowerShell commands to create the server endpoint. Replace `<your-server-endpoint-path>` and `<your-volume-free-space>` with the desired values. Check the settings for the optional [initial download](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-download-section) and [initial upload](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-sync-section) policies.

```powershell
$serverEndpointPath = "<your-server-endpoint-path>"
$cloudTieringDesired = $true
$volumeFreeSpacePercentage = <your-volume-free-space>
# Optional property. Choose from: [NamespaceOnly], the default when cloud tiering is enabled. [NamespaceThenModifiedFiles], the default when cloud tiering is disabled. [AvoidTieredFiles], available only when cloud tiering is disabled.
$initialDownloadPolicy = "NamespaceOnly"
$initialUploadPolicy = "Merge"
# Optional property. Choose from: [Merge], the default for all new server endpoints. Content is from the server and the cloud merge. This is the right choice if one location is empty or other server endpoints already exist in the sync group. [ServerAuthoritative], the right choice when you seeded the Azure file share (for example, with Azure Data Box) and you're connecting the server location that you seeded from. It enables you to catch up the Azure file share with the changes that happened on the local server since the seeding.

if ($cloudTieringDesired) {
    # Ensure that the endpoint path is not the system volume
    $directoryRoot = [System.IO.Directory]::GetDirectoryRoot($serverEndpointPath)
    $osVolume = "$($env:SystemDrive)\"
    if ($directoryRoot -eq $osVolume) {
        throw [System.Exception]::new("Cloud tiering cannot be enabled on the system volume")
    }

    # Create the server endpoint
    New-AzStorageSyncServerEndpoint `
        -Name $registeredServer.FriendlyName `
        -SyncGroup $syncGroup `
        -ServerResourceId $registeredServer.ResourceId `
        -ServerLocalPath $serverEndpointPath `
        -CloudTiering `
        -VolumeFreeSpacePercent $volumeFreeSpacePercentage `
        -InitialDownloadPolicy $initialDownloadPolicy `
        -InitialUploadPolicy $initialUploadPolicy
} else {
    # Create the server endpoint
    New-AzStorageSyncServerEndpoint `
        -Name $registeredServer.FriendlyName `
        -SyncGroup $syncGroup `
        -ServerResourceId $registeredServer.ResourceId `
        -ServerLocalPath $serverEndpointPath `
        -InitialDownloadPolicy $initialDownloadPolicy
}
```

# [Azure CLI](#tab/azure-cli)

Use the [`az storagesync sync-group server-endpoint`](/cli/azure/storagesync/sync-group/server-endpoint#az-storagesync-sync-group-server-endpoint-create) command to create a new server endpoint:

```azurecli
# Create a new sync group server endpoint 
az storagesync sync-group server-endpoint create --resource-group myResourceGroupName \
                                                 --name myNewServerEndpointName
                                                 --registered-server-id 91beed22-7e9e-4bda-9313-fec96c286e0
                                                 --server-local-path d:\myPath
                                                 --storage-sync-service myStorageSyncServiceNAme
                                                 --sync-group-name mySyncGroupName

# Create a new sync group server endpoint with additional optional parameters
az storagesync sync-group server-endpoint create --resource-group myResourceGroupName \
                                                 --storage-sync-service myStorageSyncServiceName \
                                                 --sync-group-name mySyncGroupName \
                                                 --name myNewServerEndpointName \
                                                 --registered-server-id 91beed22-7e9e-4bda-9313-fec96c286e0 \
                                                 --server-local-path d:\myPath \
                                                 --cloud-tiering on \
                                                 --volume-free-space-percent 85 \
                                                 --tier-files-older-than-days 15 \
                                                 --initial-download-policy NamespaceOnly [OR] NamespaceThenModifiedFiles [OR] AvoidTieredFiles
                                                 --initial-upload-policy Merge [OR] ServerAuthoritative

```

---
