---
title: Configure and use asynchronous directory deletion in Azure NetApp Files
description: Learn how to register, enable, use, and disable asynchronous directory deletion on an Azure NetApp Files volume to remove large directory trees efficiently.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/05/2026
ms.author: anfdocs
# Customer intent: As a storage administrator, I want to configure asynchronous directory deletion on my Azure NetApp Files volume, so that I can remove large directory trees without client-side file enumeration.
---

# Configure and use asynchronous directory deletion in Azure NetApp Files (preview)

Asynchronous directory deletion enables you to remove large directory trees without requiring the client to enumerate and delete every file. After you enable the feature on a volume, move the target directory into the configured trash bin path. Azure NetApp Files then deletes the directory contents and reclaims space asynchronously in the background.

This article describes how to register the preview feature, enable it on a volume, delete a directory asynchronously from an NFS or SMB client, and disable the feature. To learn more about the feature, see [Understand asynchronous directory deletion](asynchronous-directory-deletion-concept.md).

## Prerequisites

* An Azure subscription and an existing Azure NetApp Files volume.
* Preview access enabled for the subscription through Azure Feature Exposure Control (AFEC).
* Permissions to register Azure provider features and update the target Azure NetApp Files volume.
* Azure PowerShell or Azure CLI for feature registration and status checks.
* A method to send authenticated Azure Resource Manager REST API requests, such as Azure Cloud Shell, PowerShell, or a REST client.
* API version `2026-08-15-preview` or later for viewing or modifying asynchronous directory deletion properties.
* An NFS or SMB client with access to the volume for moving directories into the trash bin path.

> [!IMPORTANT]
> You can't enable asynchronous directory deletion on a data protection volume. During preview, Azure CLI support isn't available for the volume properties described in this article. Use the REST API or a beta SDK to enable, disable, or inspect the configuration.

## Register the feature

Register the preview feature once for each subscription that uses asynchronous directory deletion.

# [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp `
  -FeatureName ANFAsyncDirectoryDelete

Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp `
  -FeatureName ANFAsyncDirectoryDelete
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az feature register --namespace Microsoft.NetApp --name ANFAsyncDirectoryDelete

az feature show --namespace Microsoft.NetApp --name ANFAsyncDirectoryDelete
```

---

> [!NOTE]
> Because the feature is in preview, the registration status initially remains `Pending` and requires confirmation by the product team. Notify your account team after registering the feature.

## Enable asynchronous directory deletion

Enable the capability by updating the target volume. Specify both `status` as `Enabled` and a unique `trashBinName`.

* The trash bin name must contain 1 through 255 characters.
* Supported characters are letters, numbers, period (`.`), underscore (`_`), and hyphen (`-`).
* The name must not match an existing file or directory at the root of the volume.

1. Obtain an Azure Resource Manager access token and identify the subscription, resource group, NetApp account, capacity pool, volume, and Azure region values.

1. Send the following `PATCH` request, replacing the placeholder values with values for your environment.

    ```
    PATCH
    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/volumes/{volumeName}?api-version=2026-08-15-preview

    Content-Type: application/json
    Authorization: Bearer {token}

    Body:
    {
      "location": "<region>",
      "properties": {
        "asyncDirectoryDelete": {
          "status": "Enabled",
          "trashBinName": "<trashbin-name>"
        }
      }
    }
    ```

1. Confirm that the request completes successfully before moving a directory into the trash bin path.

## Verify the configuration

Retrieve the volume and verify the `asyncDirectoryDelete` properties in the response.

```
GET
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.NetApp/netAppAccounts/{accountName}/capacityPools/{poolName}/volumes/{volumeName}?api-version=2026-08-15-preview

Authorization: Bearer {token}
```

The response includes a fragment similar to the following example:

```
{
  "properties": {
    "asyncDirectoryDelete": {
      "status": "Enabled",
      "trashBinName": "myTrashBin"
    }
  }
}
```

## Delete a directory asynchronously

> [!IMPORTANT]
> Moving a directory into the configured trash bin path initiates deletion. Azure NetApp Files removes the files and directories under the moved path automatically. Confirm that the directory is no longer needed before moving it.

The directory and trash bin path must be on the same volume. After the move finishes, no additional client action is required. Space is reclaimed in the background, and the completion time depends on the number of objects and directory-tree characteristics.

# [Linux NFS client](#tab/nfs)

To delete one directory from an NFS client, replace the mount path, trash bin name, and target directory as in the following example:

```bash
mv /mnt/<volume>/<directory-to-delete> \
   /mnt/<volume>/<trashbin-name>/<directory-to-delete>
```

To delete more than one directory from an NFS client, don't move a second directory into the trash bin until you list the mount. Without that listing, the client reuses the lookup from the first move. The second directory is placed inside the directory that is already being deleted, and only one deletion starts. 

That deletion removes only the files that were in the first directory when the move completed. It doesn't remove the files in the nested second directory. Those files remain on the volume after the deletion finishes, and no later deletion removes them. 

List the mount between each move:

```bash
mv dir1 <trashbin-name>/ 
ls -a 
mv dir2 <trashbin-name>/ 
```
`ls -a` applies only to the next move. It doesn't remove a directory that was already nested. 

# [Windows SMB client](#tab/smb)

To delete one directory from an SMB client, replace the mapped drive, trash bin name, and target directory in the following example:

```powershell
Move-Item -Path "X:\<directory-to-delete>" `
  -Destination "X:\<trashbin-name>\<directory-to-delete>"
```

To delete more than one directory from an SMB client, use the same back-to-back moves, each starting its own deletion. The second directory isn't inside the first directory. You don't need to list the share between moves.

```powershell
Move-Item .\dir1 .\trash\; Move-Item .\dir2 .\trash\ 
```

---



## Disable asynchronous directory deletion

You can disable the feature while preserving the stored trash bin name, or disable the feature and clear the stored name. Send either payload in a `PATCH` request to the same volume resource URI and use API version `2026-08-15-preview` or later.

* To disable the feature and preserve the trash bin name, use the following body:

    ```
    {
      "location": "<region>",
      "properties": {
        "asyncDirectoryDelete": {
          "status": "Disabled"
        }
      }
    }
    ```

* To disable the feature and clear the trash bin name, use the following body:

    ```
    {
      "location": "<region>",
      "properties": {
        "asyncDirectoryDelete": {
          "status": "Disabled",
          "trashBinName": ""
        }
      }
    }
    ```

## Change the trash bin name

You can't edit the trash bin name while asynchronous directory deletion is enabled. To use a different name:

1. Disable asynchronous directory deletion on the volume.
1. Re-enable the feature and specify the new trash bin name.
1. Verify the new configuration with a `GET` request before using the new trash bin path.

## Common errors

The following errors can occur when you configure asynchronous directory deletion. For more information, see [Troubleshoot asynchronous directory deletion](troubleshoot-asynchronous-directory-deletion.md).

* `400` – "This property is available in Api-Version 2026-08-15-preview and later." Use API version `2026-08-15-preview` or later, which includes the asynchronous directory deletion schema.
* `400` – "Cannot enable asynchronous deletion on a Data Protection volume." Asynchronous directory deletion isn't supported on data protection volumes.
* `400` – "The asynchronous directory delete trash bin name cannot be specified unless asynchronous directory delete from the client is being enabled." Always include `status: Enabled` when supplying a `trashBinName`.
* `400` – "Directory `<dirName>` already exists on volume `<volName>`. The service can only use a directory that doesn't already exist as a trash bin." Choose a different `trashBinName`, or remove the existing file or directory from the volume before enabling the feature.


## Next steps

* [Understand asynchronous directory deletion in Azure NetApp Files](asynchronous-directory-deletion-concept.md).
* [Troubleshoot asynchronous directory deletion in Azure NetApp Files](troubleshoot-asynchronous-directory-deletion.md).
* [Understand maxfiles limits in Azure NetApp Files](maxfiles-concept.md).
* [Understand directory sizes in Azure NetApp Files](directory-sizes-concept.md).
* [Azure NetApp Files REST API reference](/rest/api/netapp/).
