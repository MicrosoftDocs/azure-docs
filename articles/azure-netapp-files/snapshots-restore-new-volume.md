---
title: Restore a snapshot to a new volume using Azure NetApp Files 
description: Describes how to create a new volume from a snapshot by using Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 02/03/2026
ms.author: anfdocs
# Customer intent: "As a cloud administrator, I want to restore a volume from a snapshot so that I can recover data to a specific point in time and maintain system integrity."
---

# Restore a snapshot to a new volume using Azure NetApp Files

[Snapshots](snapshots-introduction.md) enable point-in-time recovery of volumes. This article describes how to create a new volume from a snapshot by using Azure NetApp Files.

## Considerations 

* Depending on the size of the selected volume snapshot to restore, the operation may take minutes to hours to complete.

* To avoid extensive restore times, only perform one "restore snapshot to new volume" operation at a time. For this reason, chained restore operations, such as restoring a snapshot to a new volume while the originating volume itself is being restored from a snapshot, should be avoided as well. Alternatively, consider using [cross-zone replication within the same zone](cross-zone-region-replication-configure.md) to create an independent volume copy.

* Cross-region replication and cross-zone replication operations are suspended and cannot be added while restoring a snapshot to a new volume.

* Only enable backup, snapshots, and replication (cross-region or cross-zone) on the new volume _after_ it's fully restored from the snapshot. To ensure the volume is fully restored, check the progress indicator in the volume details.

* If you use the cool access feature, see [Manage Azure NetApp Files storage with cool access](manage-cool-access.md#considerations) for more considerations.
  
### Considerations for the Elastic service level 

* The new volume must be in the same Elastic capacity pool that contains the source snapshot. 

* When restoring a snapshot to a new volume in the Elastic Zone-redundant service level, the volume quota is set to 1 GiB instead of the source volume's quota. You must manually [modify the volume's quota](elastic-volume-server-message-block.md#resize-a-volume) to the correct value. 

## Steps

Follow the steps for the appropriate service level. 

# [Flexible, Standard, Premium, and Ultra](#tab/regular)

1. Navigate to the volume hosting the snapshot you want to restore. Select **Snapshots** from the Volume page to display the snapshot list. 

2. Right-click the snapshot to restore and select **Restore to new volume** from the menu option.  

    :::image type="content" source="./media/shared/snapshot-actions.png" alt-text="Screenshot showing the options when right-clicking a snapshot."::: 

3. In the **Create a Volume** page, provide information for the new volume.  

    The new volume uses the same protocol that the snapshot uses.   
    For information about the fields in the Create a Volume page, see: 
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)   
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)   
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

    By default, the new volume includes a reference to the snapshot that was used for the restore operation from the original volume from Step 2, referred to as the *base snapshot*. This base snapshot does *not* consume any additional space because of [how snapshots work](snapshots-introduction.md). If you don't want the new volume to contain this base snapshot, select **Delete base snapshot** during the new volume creation.

    :::image type="content" source="./media/snapshots-restore-new-volume/snapshot-restore-new-volume.png" alt-text="Screenshot showing the Create a Volume window for restoring a volume from a snapshot."::: 

4. Select **Review + create** then **Create**.   
    The Volumes page displays the new volume to which the snapshot restores. Refer to the **Originated from** field to see the name of the snapshot used to create the volume. The volume can be used by NFS and SMB clients immediately while the restore operation is completing in the background.

# [Elastic](#tab/elastic)

1. Navigate to the volume hosting the snapshot you want to restore. Select **Snapshots** from the Volume page to display the snapshot list. 

2. Right-click the snapshot to restore and select **Restore to new volume** from the menu option.  

    :::image type="content" source="./media/shared/snapshot-actions.png" alt-text="Screenshot showing the options when right-clicking a snapshot."::: 

3. In the **Restore to a new volume** page, provide a **Volume name** and **Quota** value in GiB. The capacity pool is preselected based on the capacity pool that contains the volume. 

    Optionally, select **Show advanced options** where you can assign a snapshot policy to the volume and choose to hide the snapshot path. 

    :::image type="content" source="./media/snapshots-restore-new-volume/elastic-restore-new-volume.png" alt-text="Screenshot Restore to a new field option.":::

    For information about the fields in the Create a Volume page, see: 
    * [Create an NFS volume](elastic-volume.md)  
    * [Create an SMB volume](elastic-volume-server-message-block.md)    

    <!-- By default, the new volume includes a reference to the snapshot that was used for the restore operation from the original volume from Step 2, referred to as the *base snapshot*. This base snapshot does *not* consume any additional space because of [how snapshots work](snapshots-introduction.md). -->

    Select **Next**.

1. The protocol is automatically selected; the new volume uses the same protocol that the snapshot uses. Enter the file path for the new volume then select **Review + create**. 

1. Select **Create** to begin the restore process. 

    The Volumes page displays the new volume to which the snapshot restores. Refer to the **Originated from** field to see the name of the snapshot used to create the volume. 

---

## Next steps

* [Learn more about snapshots](snapshots-introduction.md)
* [Monitor volume and snapshot metrics](azure-netapp-files-metrics.md#volumes)
* [Troubleshoot snapshot policies](troubleshoot-snapshot-policies.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Azure NetApp Files Snapshots 101 video](https://www.youtube.com/watch?v=uxbTXhtXCkw)
* [Azure NetApp Files Snapshot Overview](https://anfcommunity.com/2021/01/31/azure-netapp-files-snapshot-overview/)
