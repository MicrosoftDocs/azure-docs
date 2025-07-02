---
title: Restore individual files with single-file restore from backups in Azure NetApp Files
description: With single-file restore from backup, you can restore up to eight files to a directory. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 06/16/2025
ms.author: anfdocs
---
# Restore individual files with single-file restore from backups in Azure NetApp Files (preview)

To restore individual files no longer available in an online snapshot [single-file snapshot restore](snapshots-restore-file-single.md), you can rely on your Azure NetApp Files backup to restore individual files. With single-file restore from backup, you can restore a single file to a specific location in a volume or multiple files (up to eight) to a specific directory in the volume.

## Considerations

* If no destination path is provided during the restore operation, the file is restored in the original file location. If the file already exists at that location, it's overwritten by the restore operation. 
    * The destination path can't be blank. To restore to the original location, enter a slash (/) in the destination path field. 
    * If the file being restored has a multi-level directory depth (for example, `/dir1/dir2/file.txt`), all of the parent directories must be present in the active file system for the restore operation to succeed. The restore operation can't create new directories. 
* If the destination path provided is invalid (that is, it doesn't exist in the active file system), the operation fails.
* A maximum of eight files can be restored to a volume in a single operation. You must wait for a restore operation to complete before initiating another operation to restore more files to that volume.
* The file list field has a character limit of 1,024 characters. 
* The target volume for the restore operation must have enough logical free space available to accommodate all the files being restored.
* The restore operation doesn't work if a directory or a soft link path is entered in the file list field.

## Register the feature

Single-file restore from backup is currently in preview. Before using single file restore from a backup for the first time, you need to register the feature first.

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFSingleFileBackupRestore
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFSingleFileBackupRestore
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Steps

1. Under the **Backups** menu, select the backup you want to use to restore files.
1. Select the three dots `...` associated with the backup you want to use, then select **Restore Files**.

    :::image type="content" source="./media/restore-single-file-backup/restore-files-select.jpg" alt-text="Screenshot depicting restore file options: restore to a new volume, delete, or restore files." lightbox="./media/restore-single-file-backup/restore-files-select.jpg":::

1. In the **File paths** field, enter the file names with the complete file path for each file, for example `/dir/file1.txt`. You can enter the names of multiples files as a comma-separated list or by entering each file path on a separate line. 

    The menu includes three optional fields:

    * **NetApp account**: the NetApp account that hosts the destination volume. If no value is specified, the files are restored to the original volume.

    * **Destination volume**: the volume where the files will be restored. If no value is specified, the files will be restored to the original volume.

    * **Destination path**: the directory where the files will be restored. The destination path must already exist in the destination volume. This field cannot be left blank. Enter a slash ( / ) to restore files to their original path locations.

    >[!IMPORTANT]
    >The file path is case-sensitive. 
    
    :::image type="content" source="./media/restore-single-file-backup/restore-files-file-path.jpg" alt-text="Screenshot of restore interface." lightbox="./media/restore-single-file-backup/restore-files-file-path.jpg":::

1. Select **Restore** to complete the operation. 

## Next steps

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Requirements and considerations for Azure NetApp Files](backup-requirements-considerations.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Disable backup functionality for a volume](backup-disable.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
