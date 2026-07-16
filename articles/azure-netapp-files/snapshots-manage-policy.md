---
title: Manage snapshot policies in Azure NetApp Files
description: Describes how to create, manage, modify, and delete snapshot policies by using Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 11/17/2025
ms.author: anfdocs
# Customer intent: As a system administrator, I want to create and manage snapshot policies for Azure NetApp Files, so that I can ensure point-in-time recovery of volumes and streamline data management.
---

# Manage snapshot policies in Azure NetApp Files

[Snapshots](snapshots-introduction.md) enable point-in-time recovery of volumes. You can schedule for [volume snapshots](snapshots-introduction.md) to be taken automatically by using snapshot policies. You can also modify a snapshot policy as needed, or delete a snapshot policy that you no longer need.  

>[!NOTE]
>You can't apply a snapshot policy to a destination volume in cross-region replication.  

## Create a snapshot policy 

A snapshot policy enables you to specify the snapshot creation frequency in hourly, daily, weekly, or monthly cycles. You also need to specify the maximum number of snapshots to retain for the volume.  
   
> [!NOTE] 
> Azure NetApp Files might sporadically skip the creation of a scheduled snapshot during a maintenance service event.
       
1. From your NetApp account, select **Snapshot policy**.

    ![Screenshot that shows how to navigate to Snapshot Policy.](./media/snapshots-manage-policy/snapshot-policy-navigation.png)

2. In the Snapshot Policy window, set Policy State to **Enabled**. 

3. Select the **Hourly**, **Daily**, **Weekly**, or **Monthly** tab to create hourly, daily, weekly, or monthly snapshot policies. Specify the **Number of snapshots to keep**.  

    > [!IMPORTANT] 
    > For *monthly* snapshot policy definition, specify a day that works for all intended months. If you intend for the monthly snapshot configuration to work for all months in the year, pick a day of the month between 1 and 28.  For example, if you specify `31` (day of the month), the monthly snapshot configuration is skipped for the months that have less than 31 days. 
    > 
        
    > [!NOTE] 
    > Using policy-based backups for Azure NetApp Files might affect the number of snapshots to keep. Backup policies involve snapshot policies. And Azure NetApp Files prevents you from deleting the latest backup.
    
    <!-- fix-->
    See [Resource limits for Azure NetApp Files](./azure-netapp-files-resource-limits.md) about the maximum number of snapshots allowed for a volume. 

    The following example shows hourly snapshot policy configuration. 

    ![Screenshot that shows the hourly snapshot policy.](./media/snapshots-manage-policy/snapshot-policy-hourly.png)

    The following example shows daily snapshot policy configuration.

    ![Screenshot that shows the daily snapshot policy.](./media/snapshots-manage-policy/snapshot-policy-daily.png)

    The following example shows weekly snapshot policy configuration.

    ![Screenshot that shows the weekly snapshot policy.](./media/snapshots-manage-policy/snapshot-policy-weekly.png)

    The following example shows monthly snapshot policy configuration.

    ![Screenshot that shows the monthly snapshot policy.](./media/snapshots-manage-policy/snapshot-policy-monthly.png) 

4.	Select **Save**.  

If you need to create more snapshot policies, repeat Step 3.
The policies you created appear in the Snapshot policy page.

If you want a volume to use the snapshot policy, you need to [apply the policy to the volume](#apply-a-snapshot-policy-to-a-volume). 

## Apply a snapshot policy to a volume

If you want a volume to use a snapshot policy that you created, you need to apply the policy to the volume. 

1. Go to the **Volumes** page then select the volume you want to apply a policy to. 

1. In the volume's overview page, select **Edit**. 

2. In the Edit window, under **Snapshot policy**, select a policy to use for the volume. Select **OK** to apply the policy.  
    ![Screenshot that shows the Snapshot policy menu.](./media/snapshots-manage-policy/snapshot-policy-edit.png) 

## Modify a snapshot policy 

You can modify an existing snapshot policy to change the policy state, snapshot frequency (hourly, daily, weekly, or monthly), or number of snapshots to keep.

<!-- 
>[!IMPORTANT]
>When modifying a snapshot policy, note the naming format. Snapshots created with policies modified before March 2022 have a long name, for example `daily-0-min-past-1am.2022-11-03_0100`, while snapshots created with policies after March 2022 have a shorter name, for example `daily.2022-11-29_0100`.
>
> If your snapshot policy is creating snapshots using the long naming convention, modifications to the snapshot policy aren't applied to existing snapshots. The snapshots created with the previous schedule aren't deleted or overwritten by the new schedule. You have to manually delete the old snapshots.
>
> If your snapshot policy is creating snapshots using the short naming convention, policy modifications are applied to the existing snapshots. -->
 
1. From your NetApp account, select **Snapshot policy**.
2. Right-click the snapshot policy you want to modify, then select **Edit**.
    ![Screenshot that shows the Snapshot policy right-click menu.](./media/snapshots-manage-policy/snapshot-policy-right-click-menu.png) 

3. Make the changes in the Snapshot Policy window that appears, then select **Save**. 

4. A prompt asks you to confirm you want to update the Snapshot Policy. Select **Yes** to confirm your choice. 

## Delete a snapshot policy 

Before deleting a snapshot policy, the policy should be removed from all volumes. 

1. From the NetApp Account view, select **Snapshot policy**.
2. Right-click the snapshot policy you want to modify, then select **Delete**.
    ![Screenshot that shows the Delete menu item.](./media/snapshots-manage-policy/snapshot-policy-right-click-menu.png) 

3. Select **Yes** to confirm that you want to delete the snapshot policy.   
    ![Screenshot that shows snapshot policy delete confirmation.](./media/snapshots-manage-policy/snapshot-policy-delete-confirm.png) 
    
## Edit the Hide snapshot path option

The Hide snapshot path option controls whether the snapshot path of a volume is visible. During the creation of an [NFS](azure-netapp-files-create-volumes.md#create-an-nfs-volume) or [SMB](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) volume, you can specify whether the snapshot path should be hidden. After creating the volume, you can edit the Hide snapshot path option as needed.  

> [!NOTE]
> For a [destination volume](cross-region-replication-create-peering.md#create-the-data-replication-volume-the-destination-volume) in cross-region replication, the Hide snapshot path option is disabled by default. The setting isn't modifiable. 

>[!NOTE]
>For Elastic service level volumes, you need to remount the volume after modifying this setting. 

### Settings

1. To view the Hide snapshot path option setting of a volume, select the volume. The **Hide snapshot path** field shows whether the option is enabled.   
    ![Screenshot that describes the Hide snapshot path field.](./media/snapshots-manage-policy/hide-snapshot-path-field.png) 
2. To edit the Hide Snapshot Path option, select **Edit** on the volume page. Modify the **Hide snapshot path** option as needed.   
    ![Screenshot that describes the Edit volume snapshot option.](./media/snapshots-manage-policy/volume-edit-snapshot-options.png) 

## Next steps

* [Troubleshoot snapshot policies](troubleshoot-snapshot-policies.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Learn more about snapshots](snapshots-introduction.md)
