---
title: include file
description: include file
services: storage
author: khdownie
ms.service: azure-storage
ms.topic: include
ms.date: 04/26/2023
ms.author: kendownie
ms.custom: include file, devx-track-azurecli 
ms.devlang: azurecli
---

# [Portal](#tab/azure-portal)
To add a server endpoint, go to the newly created sync group. Under **Server endpoints**, select **+Add server endpoint**. The **Add server endpoint** blade opens. Enter the following information to create a server endpoint:

:::image type="content" source="media/storage-files-sync-create-server-endpoint/create-server-endpoint.png" alt-text="Screenshot showing the add server endpoint blade.":::

- **Registered server**: The name of the server or cluster where you want to create the server endpoint.
- **Path**: The path on the Windows Server to be synced to the Azure file share. The path can be a folder (for example, D:\Data), volume root (for example, D:\\\), or volume mount point (for example, D:\Mount).
- **Cloud Tiering**: A switch to enable or disable cloud tiering. With cloud tiering, infrequently used or accessed files can be tiered to Azure Files. When you enable cloud tiering, there are two policies that you can set to inform Azure File Sync when to tier cool files: the **Volume Free Space Policy** and the **Date Policy**.
    - **Volume Free Space**: The amount of free space to reserve on the volume on which the server endpoint is located. For example, if volume free space is set to 50% on a volume that has only one server endpoint, roughly half the amount of data is tiered to Azure Files. Regardless of whether cloud tiering is enabled, your Azure file share always has a complete copy of the data in the sync group.
    - **Date Policy**: Files are tiered to the cloud if they haven't been accessed (that is, read or written to) for the specified number of days. For example, if you noticed that files that have gone more than 15 days without being accessed are typically archival files, you should set your date policy to 15 days.
- **Initial Sync**: The Initial Sync section is available only for the first server endpoint in a sync group (section changes to Initial Download when creating more than one server endpoint in a sync group). Within the Initial Sync section, you can select the **Initial Upload** and **Initial Download** behavior. 
    - **Initial Upload**: You can select how the server initially uploads the data to the Azure file share:
        -  Option #1: Merge the content of this server path with the content in the Azure file share. Files with the same name and path will lead to conflicts if their content is different. Both versions of those files will be stored next to each other. If your server path or Azure file share are empty, always choose this option.
        -  Option #2: Authoritatively overwrite files and folders in the Azure file share with content in this server’s path. This option avoids file conflicts.
       
       To learn more, see [Initial sync](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-sync-section).

    - **Initial Download**: You can select how the server initially downloads the Azure file share data. This setting is important when the server is connecting to an Azure file share with files in it. "Namespace" stands for the file and folder structure without the file content. File content of "tiered files" is recalled from the cloud to the server by local access or policy.
        -  Option #1: Download the namespace first and then recall the file content, as much as will fit on the local disk.
        -  Option #2: Download the namespace only. The file content will be recalled when accessed.
        -  Option #3: Avoid tiered files. Files will only appear on the server once they're fully downloaded.

       To learn more, see [Initial download](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-download-section).

To add the server endpoint, select **Create**. Your files are now kept in sync across your Azure file share and Windows Server.

# [PowerShell](#tab/azure-powershell)
Execute the following PowerShell commands to create the server endpoint, and be sure to replace `<your-server-endpoint-path>` and `<your-volume-free-space>` with the desired values. Check the settings for the optional [initial download](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-download-section) and [initial upload](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-sync-section) policies.

```powershell
$serverEndpointPath = "<your-server-endpoint-path>"
$cloudTieringDesired = $true
$volumeFreeSpacePercentage = <your-volume-free-space>
# Optional property. Choose from: [NamespaceOnly] default when cloud tiering is enabled. [NamespaceThenModifiedFiles] default when cloud tiering is disabled. [AvoidTieredFiles] only available when cloud tiering is disabled.
$initialDownloadPolicy = "NamespaceOnly"
$initialUploadPolicy = "Merge"
# Optional property. Choose from: [Merge] default for all new server endpoints. Content from the server and the cloud merge. This is the right choice if one location is empty or other server endpoints already exist in the sync group. [ServerAuthoritative] This is the right choice when you seeded the Azure file share (e.g. with Data Box) AND you are connecting the server location you seeded from. This enables you to catch up the Azure file share with the changes that happened on the local server since the seeding.

if ($cloudTieringDesired) {
    # Ensure endpoint path is not the system volume
    $directoryRoot = [System.IO.Directory]::GetDirectoryRoot($serverEndpointPath)
    $osVolume = "$($env:SystemDrive)\"
    if ($directoryRoot -eq $osVolume) {
        throw [System.Exception]::new("Cloud tiering cannot be enabled on the system volume")
    }

    # Create server endpoint
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
    # Create server endpoint
    New-AzStorageSyncServerEndpoint `
        -Name $registeredServer.FriendlyName `
        -SyncGroup $syncGroup `
        -ServerResourceId $registeredServer.ResourceId `
        -ServerLocalPath $serverEndpointPath `
        -InitialDownloadPolicy $initialDownloadPolicy
}
```

# [Azure CLI](#tab/azure-cli)

Use the [`az storagesync sync-group server-endpoint`](/cli/azure/storagesync/sync-group/server-endpoint#az-storagesync-sync-group-server-endpoint-create) command to create a new server endpoint.

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
