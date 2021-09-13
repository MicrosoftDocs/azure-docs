---
title: include file
description: include file
services: storage
author: fauhse
ms.service: storage
ms.topic: include
ms.date: 6/01/2021
ms.author: fauhse
ms.custom: include file
---

# [Portal](#tab/azure-portal)
To add a server endpoint, go to the newly created sync group and then select **Add server endpoint**.

![Add a new server endpoint in the sync group pane](media/storage-files-sync-create-server-endpoint/add-server-endpoint.png)

The **Add server endpoint** blade opens, enter the following information to create a server endpoint:

- **Registered server**: The name of the server or cluster where you want to create the server endpoint.
- **Path**: The Windows Server path to be synced as part of the sync group.
- **Cloud Tiering**: A switch to enable or disable cloud tiering. With cloud tiering, infrequently used or accessed files can be tiered to Azure Files.
- **Volume Free Space**: The amount of free space to reserve on the volume on which the server endpoint is located. For example, if volume free space is set to 50% on a volume that has only one server endpoint, roughly half the amount of data is tiered to Azure Files. Regardless of whether cloud tiering is enabled, your Azure file share always has a complete copy of the data in the sync group.
- **Initial download mode**: An optional selection, that can be helpful when there are files in the Azure file share but not on the server. Such a situation can exist, for instance, if you create a server endpoint to add another branch office server to a sync group or when you disaster-recover a failed server. If cloud tiering is enabled, the default is to only recall the namespace, no file content initially. That is useful if you believe that rather user access requests should decide what file content is recalled to the server. If cloud tiering is disabled, the default is that the namespace will download first and then files will be recalled based on last-modified timestamp until the local capacity has been reached. You can however change the initial download mode to namespace only. A third mode can only be used if cloud tiering is disabled for this server endpoint. This mode avoids recalling the namespace first. Files will only appear on the local server if they had a chance to fully download. This mode is useful if for instance an application requires full files to be present and cannot tolerate tiered files in its namespace.

To add the server endpoint, select **Create**. Your files are now kept in sync across your Azure file share and Windows Server. 

# [PowerShell](#tab/azure-powershell)
Execute the following PowerShell commands to create the server endpoint, and be sure to replace `<your-server-endpoint-path>`, `<your-volume-free-space>` with the desired values and check the settings for the optional [initial download](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-download-section) and [initial upload](../articles/storage/file-sync/file-sync-server-endpoint-create.md#initial-sync-section) policies.

```powershell
$serverEndpointPath = "<your-server-endpoint-path>"
$cloudTieringDesired = $true
$volumeFreeSpacePercentage = <your-volume-free-space>
# Optional property. Choose from: [NamespaceOnly] default when cloud tiering is enabled. [NamespaceThenModifiedFiles] default when cloud tiering is disabled. [AvoidTieredFiles] only available when cloud tiering is disabled.
$initialDownloadPolicy = NamespaceOnly
$initialUploadPolicy = Merge
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

Use the [`az storagesync sync-group server-endpoint`](/cli/azure/storagesync/sync-group/server-endpoint#az_storagesync_sync_group_server_endpoint_create) command to create a new server endpoint.

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