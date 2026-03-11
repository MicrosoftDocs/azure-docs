---
title: Use Azure Files Share Snapshots
description: A share snapshot is a read-only, point-in-time copy of an Azure file share that you can use to recover previous versions of a file. Learn how to take snapshots using the Azure portal, Azure PowerShell, and Azure CLI.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 3/2/2026
ms.author: kendownie
# Customer intent: "As a data administrator, I want to use file share snapshots for Azure Files, so that I can efficiently recover previous versions of files and protect against accidental deletions or data corruption."
---

# Use share snapshots with Azure Files

:heavy_check_mark: **Applies to:** Classic SMB and NFS file shares created with the Microsoft.Storage resource provider

:heavy_check_mark: **Applies to:** File shares created with the Microsoft.FileShares resource provider (preview)

Azure Files provides the capability to take snapshots of SMB and NFS file shares. Share snapshots capture the share state at that point in time. This article describes the capabilities that file share snapshots provide and how you can use them to recover previous versions of files.

> [!IMPORTANT]
> Share snapshots provide only file-level protection. They don't prevent accidental deletions on a file share or storage account. To help protect a storage account from accidental deletion, you can either [enable soft delete](storage-files-prevent-file-share-deletion.md), or lock the storage account and/or the resource group.

## When to use share snapshots

### Protect against application error and data corruption

Applications that use file shares perform operations such as writing, reading, storage, transmission, and processing. If an application is misconfigured or an unintentional bug is introduced, accidental overwrite or damage can happen to a few blocks. To help protect against these scenarios, take a share snapshot before you deploy new application code. If a bug or application error is introduced by the new deployment, you can go back to a previous version of your data on that file share.

### Protect against accidental deletions or unintended changes

Imagine that you're working on a text file in a file share. After you close the text file, you lose the ability to undo your changes. In these cases, you need to recover a previous version of the file. You can use share snapshots to recover previous versions of the file if it's accidentally renamed or deleted.

### General backup purposes

After you create a file share, you can periodically create a share snapshot of the file share to use it for data backup. A share snapshot, when taken periodically, helps maintain previous versions of data that can be used for future audit requirements or disaster recovery. Use [Azure file share backup](../../backup/azure-file-share-backup-overview.md) for taking and managing snapshots. You can also take and manage snapshots yourself by using the Azure portal, [Azure PowerShell](/powershell/module/az.storage/new-azrmstorageshare), or [Azure CLI](/cli/azure/storage/share#az-storage-share-snapshot).

## Capabilities

A share snapshot is a point-in-time, read-only copy of your data. Share snapshot capability is provided at the file share level. Retrieval is provided at the individual file level, to allow for restoring individual files. Share snapshots have the same redundancy as the Azure file share for which they were taken. If you select geo-redundant storage for your account, your share snapshot is also stored redundantly in the paired region.

You can restore a complete file share by using SMB, NFS, REST API, the Azure portal, the client library, or PowerShell/CLI. You can view snapshots of a share by using the REST API, SMB, or NFS. You can retrieve the list of versions of the directory or file, and you can mount a specific version directly as a drive (only available on Windows - see [Limits](#limits)).

After you create a share snapshot, you can read, copy, or delete it, but you can't modify it. You can't copy a whole share snapshot to another storage account. You have to copy that data file by file, by using AzCopy or other copying mechanisms.

A share snapshot of a file share is identical to its base file share. The only difference is that a **DateTime** value is appended to the share URI to indicate the time at which the share snapshot was taken. For example, if a file share URI is `https://storagesample.file.core.windows.net/myshare`, the share snapshot URI is similar to:

```
https://storagesample.file.core.windows.net/myshare?sharesnapshot=2024-12-09T17:44:51.0000000Z
```

Share snapshots persist until you explicitly delete them, or until the file share is deleted. You can't delete a file share and keep the share snapshots. The delete workflow automatically deletes the snapshots when you delete the share. You can enumerate the snapshots associated with the base file share to track your current snapshots.

When you create a share snapshot of a file share, the files in the share's system properties are copied to the share snapshot with the same values. The base files and the file share's metadata are also copied to the share snapshot, unless you specify separate metadata for the share snapshot when you create it.

## Space usage

Share snapshots are incremental in nature. Only the data that has changed after your most recent share snapshot is saved. This feature minimizes the time required to create the share snapshot and saves on storage costs, because you pay only for the changed content. Any write operation to the object or property, or metadata update operation, counts toward "changed content" and is stored in the share snapshot.  

To conserve space, you can delete the share snapshot for the period when the churn was highest.

Even though share snapshots are saved incrementally, you need to retain only the most recent share snapshot in order to restore the share. When you delete a share snapshot, only the data unique to that share snapshot is removed. Active snapshots contain all the information that you need to browse and restore your data (from the time the share snapshot was taken) to the original location or an alternate location. You can restore at the item level.

Snapshots don't count towards the maximum share size limit. There's no limit to how much space share snapshots occupy in total, or that share snapshots of a particular file share can consume. Storage account limits still apply.

## Limits

Azure Files supports up to 200 share snapshots per share. After reaching 200 share snapshots, you must delete older share snapshots to create new ones. You can retain snapshots for up to 10 years.

There's no limit to the simultaneous calls for creating share snapshots.

Only file management APIs (`AzRmStorageShare`) are supported for NFS Azure file share snapshots. File data plane APIs (`AzStorageShare`) aren't supported.

## Copying data back to a share from share snapshot

Copy operations that involve files and share snapshots follow these rules:

- You can copy individual files in a file share snapshot over to its base share or any other location. You can restore an earlier version of a file or restore the complete file share by copying file by file from the share snapshot. The share snapshot isn't promoted to base share.

- The share snapshot remains intact after copying, but the base file share is overwritten with a copy of the data that was available in the share snapshot. All the restored files count toward "changed content."

- You can copy a file in a share snapshot to a different destination with a different name. The resulting destination file is a writable file and not a share snapshot. In this case, your base file share remains intact.

- When a destination file is overwritten with a copy, any share snapshots associated with the original destination file remain intact.

## Copying data back to a local drive from share snapshot

If you want to restore data from a snapshot of an SMB Azure file share to a local drive on Windows, you can use Robocopy to copy files and folders from the snapshot.

On Windows, you can access SMB file share snapshots from the **Previous Versions** tab in Windows File Explorer. When you access a snapshot view by using this method, you can copy files and folders to a local path by using standard file operations or Robocopy.

If you run Robocopy from an elevated command prompt, mapped drives might not be accessible, and referencing a drive letter might fail. In that case, use a UNC path that references the snapshot view. Ensure the path references the snapshot and not the live file share. If you reference the live file share instead of the snapshot, the copy operation uses the current state of the file share rather than the point-in-time state captured in the snapshot.

## General best practices

Automate backups for data recovery whenever possible. Automated actions are more reliable than manual processes, so automation helps improve data protection and recoverability. For automation, you can use Azure file share backup (SMB file shares only), the REST API, the Client SDK, or scripting.

Before you deploy the share snapshot scheduler, carefully consider your share snapshot frequency and retention settings to avoid incurring unnecessary charges.

## SMB file share snapshots

Users of SMB Azure file shares can create, list, delete, and restore from share snapshots.

### Create an SMB file share snapshot

You can create a snapshot of an SMB Azure file share by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

To create a snapshot of an existing file share, sign in to the Azure portal and follow these steps.

1. In the portal, go to your file share.

1. Select **Snapshots**, select **+ Add snapshot**, and then select **OK**.

   :::image type="content" source="media/storage-snapshots-files/create-snapshot.png" alt-text="Screenshot of the storage account snapshots tab.":::

# [Azure PowerShell](#tab/powershell)

To create a snapshot of an existing file share, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

```azurepowershell
New-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -Snapshot
```

# [Azure CLI](#tab/cli)

To create a snapshot of an existing file share, run the following Azure CLI command. Replace `<file-share-name>` and `<storage-account-name>` with your own values.

```azurecli
az storage share snapshot --name <file-share-name> --account-name <storage-account-name>
```
---

### List SMB file share snapshots

You can list all the snapshots for a file share by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

To list all the snapshots for an existing file share, sign in to the Azure portal and follow these steps:

1. In the portal, go to your file share.

1. On your file share, select **Snapshots**.

1. On the **Snapshots** tab, select a snapshot from the list.

   :::image type="content" source="media/storage-snapshots-files/snapshot-list.png" alt-text="Screenshot of the Snapshots tab, the first snapshot is highlighted.":::

1. Open that snapshot to browse the files it contains.

# [Azure PowerShell](#tab/powershell)

To list all file shares and snapshots in a storage account, run the following PowerShell command. Replace `<resource-group-name>` and `<storage-account-name>` with your own values.

```azurepowershell
Get-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -IncludeSnapshot
```

# [Azure CLI](#tab/cli)
To list all file shares and snapshots in a storage account, run the following Azure CLI command. Replace `<storage-account-name>` with your own value.

```azurecli
az storage share list --account-name <storage-account-name> --include-snapshots
```
---

### Restore from an SMB file share snapshot

To restore files from a snapshot, sign in to the Azure portal and follow these steps.

1. In the portal, go to your file share.

1. On your file share, select **Snapshots**.

1. From the file share snapshot tab, right-click on the file you want to restore, and select the **Restore** button.

   :::image type="content" source="media/storage-snapshots-files/restore-share-snapshot.png" alt-text="Screenshot of the snapshot tab, qstestfile is selected, restore is highlighted.":::

1. Select **Overwrite original file** and then select **OK**.

   :::image type="content" source="media/storage-snapshots-files/snapshot-download-restore-portal.png" alt-text="Screenshot of the Restore pop up, overwrite original file is selected.":::

The unmodified version of the file is now restored.

### Delete SMB file share snapshots

Existing share snapshots are never overwritten. You must delete them explicitly. You can delete share snapshots by using the Azure portal, Azure PowerShell, or Azure CLI.

Before you can delete a share snapshot, you need to remove any locks on the storage account. Go to the storage account and select **Settings** > **Locks**. If any locks are listed, delete them.

# [Azure portal](#tab/portal)

To delete a snapshot of an existing file share, sign in to the Azure portal and follow these steps.

1. In the search box at the top of the Azure portal, type and select *storage accounts*.

1. Select the storage account that contains the file share for which you want to delete snapshots.

1. Select **Data storage** > **File shares**.

1. Select the file share for which you want to delete one or more snapshots, and then select **Operations** > **Snapshots**. The portal lists any existing snapshots for the file share.

1. Select the snapshots that you want to delete, and then select **Delete**.

   :::image type="content" source="media/storage-snapshots-files/portal-snapshots-delete.png" alt-text="Screenshot of the Snapshots tab, the last snapshot is selected and the delete button is highlighted.":::

# [Azure PowerShell](#tab/powershell)

To delete a file share snapshot, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values. The `SnapshotTime` parameter must follow the correct name format, such as `2024-05-10T08:04:08Z`. 

```azurepowershell
Remove-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -SnapshotTime "<snapshot-time>"
```

To delete a file share and all its snapshots, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

```azurepowershell
Remove-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -Include Snapshots
```

# [Azure CLI](#tab/cli)

To delete a file share snapshot, run the following Azure CLI command. Replace `<storage-account-name>` and `<file-share-name>` with your own values. The `--snapshot` parameter must follow the correct name format, such as `2024-05-10T08:04:08Z`.

```azurecli
az storage share delete --account-name <storage-account-name> --name <file-share-name> --snapshot <snapshot-time>
```

To delete a file share and all its snapshots, run the following Azure CLI command. Replace `<storage-account-name>` and `<file-share-name>` with your own values.

```azurecli
az storage share delete --account-name <storage-account-name> --name <file-share-name> --delete-snapshots include
```
---

### Use an SMB file share snapshot in Windows

Just like with on-premises Volume Shadow Copy (VSS) snapshots, you can view the snapshots from your mounted Azure file share by using the **Previous versions** tab in Windows.

1. In File Explorer, locate the mounted share.

   :::image type="content" source="media/storage-snapshots-files/snapshot-windows-mount.png" alt-text="Screenshot of a mounted share in File Explorer.":::

1. Browse to the item or parent item that you need to restore. Right-click and select **Properties** from the menu.

   :::image type="content" source="media/storage-snapshots-files/snapshot-windows-previous-versions.png" alt-text="Screenshot of the right click menu for a selected directory.":::

1. Select **Previous Versions** to see the list of share snapshots for this directory.

1. Select **Open** to open the snapshot.

   :::image type="content" source="media/storage-snapshots-files/snapshot-windows-list.png" alt-text="Screenshot of the Previous versions tab.":::

1. Select **Restore**. This action copies the contents of the entire directory recursively to the original location at the time the share snapshot was created.

   :::image type="content" source="media/storage-snapshots-files/snapshot-windows-restore.png" alt-text="Screenshot of the Previous versions tab, the restore button in warning message is highlighted.":::
    
    > [!NOTE]
    > If your file hasn't changed, you won't see a previous version for that file because that file is the same version as the snapshot. This behavior is consistent with how it works on a Windows file server.

### Mount an SMB file share snapshot on Linux

To mount a specific snapshot of an SMB Azure file share on Linux, you must supply the `snapshot` option as part of the `mount` command. The `snapshot` option is the time that the particular snapshot was created in a format such as @GMT-2023.01.05-00.08.20. The Linux kernel supports the `snapshot` option starting with version 4.19.

After you create the file share snapshot, follow these instructions to mount it.

1. In the Azure portal, go to the storage account that contains the file share you want to mount a snapshot of.
1. Select **Data storage > File shares** and select the file share.
1. Select **Operations > Snapshots** and take note of the name of the snapshot you want to mount. The snapshot name is a GMT timestamp, such as in the screenshot.

   :::image type="content" source="media/storage-snapshots-files/mount-smb-snapshot-on-linux.png" alt-text="Screenshot showing how to locate a file share snapshot name and timestamp in the Azure portal." border="true" :::

1. Convert the timestamp to the format expected by the `mount` command, which is **@GMT-year.month.day-hour.minutes.seconds**. In this example, convert **2023-01-05T00:08:20.0000000Z** to **@GMT-2023.01.05-00.08.20**.
1. Run the `mount` command using the GMT time to specify the `snapshot` value. Replace `<storage-account-name>`, `<file-share-name>`, and the GMT timestamp with your values. The .cred file contains the credentials to use to mount the share.

   ```bash
   sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<file-share-name> /media/<file-share-name>/snapshot1 -o credentials=/etc/smbcredentials/snapshottestlinux.cred,snapshot=@GMT-2023.01.05-00.08.20
   ```

1. If you can browse the snapshot under the path `/media/<file-share-name>/snapshot1`, then the mount succeeded.

If the mount fails, see [Troubleshoot Azure Files connectivity and access issues (SMB)](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-connectivity?toc=/azure/storage/files/toc.json).

## NFS file share snapshots

Customers using NFS Azure file shares (both classic file shares, and file shares with Microsoft.FileShares) can create, list, delete, and restore from share snapshots.

> [!IMPORTANT]
> You should mount your file share before creating snapshots. If you create a new NFS file share and take snapshots before mounting the share, attempting to list the snapshots for the share returns an empty list. Delete any snapshots taken before the first mount and re-create them after you mount the share.

### NFS snapshot limitations

Only file management APIs (`AzRmStorageShare`) are supported for NFS Azure file share snapshots. File data plane APIs (`AzStorageShare`) aren't supported.

Azure Backup doesn't currently support NFS file shares.

NFS Azure file share snapshots are available in all Azure public cloud regions.

### Create a snapshot of an NFS classic file share

You can create a snapshot of an NFS classic file share by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

To create a snapshot of an existing classic file share, sign in to the Azure portal and follow these steps.

1. In the search box at the top of the Azure portal, type and select *storage accounts*.

1. Select the FileStorage storage account that contains the NFS classic file share that you want to take a snapshot of.

1. Select **Data storage** > **File shares**.

1. Select the classic file share that you want to snapshot, and then select **Operations** > **Snapshots**.

1. Select **+ Add snapshot**. Add an optional comment, and select **OK**.

  :::image type="content" source="media/storage-snapshots-files/add-file-share-snapshot.png" alt-text="Screenshot of adding a file share snapshot.":::

# [Azure PowerShell](#tab/powershell)

To create a snapshot of an existing classic file share, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

```azurepowershell
New-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -Snapshot
```

# [Azure CLI](#tab/cli)
To create a snapshot of an existing classic file share, run the following Azure CLI command. Replace `<file-share-name>` and `<storage-account-name>` with your own values.

```azurecli
az storage share snapshot --name <file-share-name> --account-name <storage-account-name>
```
---

### List NFS classic file share snapshots

You can list all the snapshots for a classic file share by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

To list all the snapshots for an existing classic file share, sign in to the Azure portal and follow these steps.

1. In the search box at the top of the Azure portal, type and select *storage accounts*.

1. Select the storage account that contains the NFS classic file share that you want to list the snapshots for.

1. Select **Data storage** > **File shares**.

1. Select the classic file share for which you want to list the snapshots.

1. Select **Operations** > **Snapshots**, and the portal lists any existing snapshots for the classic file share.

# [Azure PowerShell](#tab/powershell)

To list all classic file shares and snapshots in a storage account, run the following PowerShell command. Replace `<resource-group-name>` and `<storage-account-name>` with your own values.

```azurepowershell
Get-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -IncludeSnapshot
```

# [Azure CLI](#tab/cli)
To list all classic file shares and snapshots in a storage account, run the following Azure CLI command. Replace `<storage-account-name>` with your own value.

```azurecli
az storage share list --account-name <storage-account-name> --include-snapshots
```
---

### Restore from an NFS classic file share snapshot

To mount an NFS classic file share snapshot to a Linux VM (NFS client) and restore files, follow these steps.

1. Run the following command in a console. See [Mount options](storage-files-how-to-mount-nfs-shares.md#mount-options) for other recommended mount options. To improve copy performance, mount the snapshot by using [nconnect](nfs-performance.md#nfs-nconnect) to use multiple TCP channels.
   
   ```bash
   sudo mount -o vers=4,minorversion=1,proto=tcp,sec=sys $server:/nfs4account/share /media/nfs
   ```
   
1. Change the directory to `/media/nfs/.snapshots` so you can view the available snapshots. The `.snapshots` directory is hidden by default, but you can access and read from it like any directory. If you just created the snapshot, wait at least 30 seconds for the `.snapshots` directory to become available.
   
   ```bash
   cd /media/nfs/.snapshots
   ```
   
1. List the contents of the `.snapshots` directory.
   
   ```bash
   ls
   ```
   
1. Each snapshot has its own directory that serves as a recovery point. Change to the snapshot directory for which you want to restore files.
   
   ```bash
   cd <snapshot-name>
   ```
   
1. List the contents of the directory to view a list of files and directories that you can recover.
   
   ```bash
   ls
   ```
   
1. Copy all files and directories from the snapshot to a *restore* directory to complete the restore.
   
   ```bash
   cp -r <snapshot-name> ../restore
   ```
   
The files and directories from the snapshot are now available in the `/media/nfs/restore` directory.

### Delete NFS classic file share snapshots

Existing share snapshots are never overwritten. You must delete them explicitly. You can delete classic share snapshots by using the Azure portal, Azure PowerShell, or Azure CLI.

Before you can delete a share snapshot, you need to remove any locks on the storage account. Go to the storage account and select **Settings** > **Locks**. If any locks are listed, delete them.

# [Azure portal](#tab/portal)

To delete a snapshot of an existing classic file share, sign in to the Azure portal and follow these steps.

1. In the search box at the top of the Azure portal, type and select *storage accounts*.

1. Select the FileStorage storage account that contains the NFS classic file share for which you want to delete snapshots.

1. Select **Data storage** > **File shares**.

1. Select the file share for which you want to delete one or more snapshots, and then select **Operations** > **Snapshots**. The portal lists any existing snapshots for the file share.

1. Select the snapshots that you want to delete, and then select **Delete**.

   :::image type="content" source="media/storage-snapshots-files/delete-file-share-snapshot.png" alt-text="Screenshot of deleting file share snapshots.":::

# [Azure PowerShell](#tab/powershell)

To delete a classic file share snapshot, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values. The `SnapshotTime` parameter must follow the correct name format, such as `2024-05-10T08:04:08Z`.

```azurepowershell
Remove-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -SnapshotTime "<snapshot-time>"
```

To delete a classic file share and all its snapshots, run the following PowerShell command. Replace `<resource-group-name>`, `<storage-account-name>`, and `<file-share-name>` with your own values.

```azurepowershell
Remove-AzRmStorageShare -ResourceGroupName "<resource-group-name>" -StorageAccountName "<storage-account-name>" -Name "<file-share-name>" -Include Snapshots
```

# [Azure CLI](#tab/cli)

To delete a classic file share snapshot, run the following Azure CLI command. Replace `<storage-account-name>` and `<file-share-name>` with your own values. The `--snapshot` parameter must follow the correct name format, such as `2024-05-10T08:04:08Z`.

```azurecli
az storage share delete --account-name <storage-account-name> --name <file-share-name> --snapshot <snapshot-time>
```

To delete a classic file share and all its snapshots, run the following Azure CLI command. Replace `<storage-account-name>` and `<file-share-name>` with your own values.

```azurecli
az storage share delete --account-name <storage-account-name> --name <file-share-name> --delete-snapshots include
```
---

### Create an NFS file share snapshot with Microsoft.FileShares

You can create a snapshot of an NFS file share created with the Microsoft.FileShares resource provider (preview) by using the Azure portal, Azure PowerShell, or Azure CLI.

> [!NOTE]
> File share with Microsoft.FileShares is currently in preview. You can use the Azure portal, or you can use generic PowerShell or Azure CLI commands to work with file shares. If you want to try the CLI private package for Microsoft.FileShares resource provider, fill out this [survey](https://forms.microsoft.com/r/nEGcB0ccaD).

# [Azure portal](#tab/portal)

To create a snapshot of an existing file share, sign in to the Azure portal and follow these steps.

1. In the search box at the top of the Azure portal, type and select *File Shares*.

1. Select the file share that you want to take a snapshot of.

1. Select **Operations** > **Snapshots**.

1. Select **+ Add snapshot**. Add an optional comment, and select **OK**.

   :::image type="content" source="media/storage-snapshots-files/add-managed-file-share-snapshot.png" alt-text="A screenshot of the Azure portal showing how to create a snapshot of a file share created with Microsoft.FileShares." border="true":::


# [Azure PowerShell](#tab/powershell)

To create a snapshot of an existing file share, run the following PowerShell command. Replace `<subscription-ID>`, `<resource-group-name>`, `<file-share-name>`, and `<snapshot-name>` with your own values.

```powershell
New-AzResource -ResourceId "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.FileShares/fileShares/<file-share-name>/fileShareSnapshots/<snapshot-name>" `
               -ApiVersion "2025-09-01-preview" `
               -Properties @{
                  metadata = @{}; 
                  initiatorId=""
               } `
               -Force
```

# [Azure CLI](#tab/cli)
To create a snapshot of an existing file share, run the following Azure CLI command. Replace `<subscription-ID>`, `<resource-group-name>`, `<file-share-name>`, and `<snapshot-name>` with your own values.

```bash
az rest --method put \
--uri "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.FileShares/fileShares/<file-share-name>/fileShareSnapshots/<snapshot-name>?api-version=2025-09-01-preview" \
--body '{
  "properties": {
    "metadata": {},
    "initiatorId": ""
  }
}'
```

---

### List NFS file share snapshots

You can list all the snapshots for an NFS file share by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

To list all the snapshots for an existing file share, sign in to the Azure portal and follow these steps:

1. In the search box at the top of the Azure portal, type and select *File Shares*.

1. Select the file share that you want to view the snapshots for.

1. Select **Operations** > **Snapshots**. The portal lists any existing snapshots for the file share.

# [Azure PowerShell](#tab/powershell)

To list all file share snapshots, run the following PowerShell command. Replace `<subscription-ID>`, `<resource-group-name>`, and `<file-share-name>` with your own values.

```powershell
$filesharesnapshot=Get-AzResource -ResourceId "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.FileShares/fileShares/<file-share-name>/fileShareSnapshots"
$filesharesnapshot

# to view the metadata
$filesharesnapshot.properties.metadata
```

# [Azure CLI](#tab/cli)
To list all file share snapshots, run the following Azure CLI command. Replace `<subscription-ID>`, `<resource-group-name>`, and `<file-share-name>` with your own values.
```bash
az rest --method get \
--uri "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.FileShares/fileShares/<file-share-name>/fileShareSnapshots/?api-version=2025-09-01-preview"
```

---

### Restore from an NFS file share snapshot

To mount an NFS file share snapshot to a Linux VM (NFS client) and restore files, follow these steps.

1. Run the following command in a console. See [Mount options](storage-files-how-to-mount-nfs-shares.md#mount-options) for other recommended mount options. To improve copy performance, mount the snapshot by using [nconnect](nfs-performance.md#nfs-nconnect) to use multiple TCP channels. Make sure you change `/media/nfs` to your corresponding path to the file share.
   
   ```bash
   sudo mount -o vers=4,minorversion=1,proto=tcp,sec=sys $server:/nfs4account/share /media/nfs
   ```
   
1. Change the directory to `/media/nfs/.snapshots` so you can view the available snapshots. The `.snapshots` directory is hidden by default, but you can access and read from it like any directory. If you just created the snapshot, wait at least 30 seconds for the `.snapshots` directory to become available.
   
   ```bash
   cd /media/nfs/.snapshots
   ```
   
1. List the contents of the `.snapshots` folder.
   
   ```bash
   ls
   ```
   
1. Each snapshot has its own directory that serves as a recovery point. Change to the snapshot directory for which you want to restore files.
   
   ```bash
   cd <snapshot-name>
   ```
   
1. List the contents of the directory to view a list of files and directories that you can recover.
   
   ```bash
   ls
   ```
   
1. Copy all files and directories from the snapshot to a *restore* directory to complete the restore.
   
   ```bash
   cp -r <snapshot-name> ../restore
   ```
   
The files and directories from the snapshot are now available in the `/media/nfs/restore` directory.

### Delete NFS file share snapshots

Existing share snapshots are never overwritten. You must delete them explicitly. You can delete share snapshots by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

To delete a snapshot of an existing file share, sign in to the Azure portal and follow these steps.

1. In the search box at the top of the Azure portal, type and select *File Shares*.

1. Select the file share for which you want to delete snapshots.

1. To delete one or more snapshots, select **Operations** > **Snapshots**. The portal lists any existing snapshots for the file share.

1. Select the snapshots that you want to delete, and then select **Delete**.

   :::image type="content" source="media/storage-snapshots-files/delete-managed-file-share-snapshot.png" alt-text="A screenshot of the Azure portal showing how to delete the snapshots for an NFS file share created with the Microsoft.FileShares resource provider." border="true":::

# [Azure PowerShell](#tab/powershell)

To delete a file share snapshot, run the following PowerShell command. Replace `<subscription-ID>`, `<resource-group-name>`, `<file-share-name>`, and `<snapshot-name>` with your own values.

```powershell
Remove-AzResource -ResourceId "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.FileShares/fileShares/<file-share-name>/fileShareSnapshots/<snapshot-name>" `
                  -ApiVersion "2025-09-01-preview" `
                  -Force
```

# [Azure CLI](#tab/cli)

To delete a file share snapshot, run the following Azure CLI command. Replace `<subscription-ID>`, `<resource-group-name>`, `<file-share-name>`, and `<snapshot-name>` with your own values.

```bash
az rest --method delete \
--uri "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.FileShares/fileShares/<file-share-name>/fileShareSnapshots/<snapshot-name>?api-version=2025-09-01-preview"
```

---

## See also

- Working with share snapshots in:
    - [Azure file share backup](../../backup/azure-file-share-backup-overview.md)
    - [Azure PowerShell](/powershell/module/az.storage/new-azrmstorageshare)
    - [Azure CLI](/cli/azure/storage/share#az-storage-share-snapshot)
