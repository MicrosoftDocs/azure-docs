---
title: Manage snapshots by using Azure NetApp Files | Microsoft Docs
description: Describes how to create and manage snapshots by using Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 07/24/2020
ms.author: b-juche
---
# Manage snapshots by using Azure NetApp Files

Azure NetApp Files supports creating on-demand snapshots and using snapshot policies to schedule automatic snapshot creation.  You can also restore a snapshot to a new volume.  

## Create an on-demand snapshot for a volume

You can create volume snapshots on demand. 

1.	Go to the volume that you want to create a snapshot for. Click **Snapshots**.

    ![Navigate to snapshots](../media/azure-netapp-files/azure-netapp-files-navigate-to-snapshots.png)

2.  Click **+ Add snapshot** to create an on-demand snapshot for a volume.

    ![Add snapshot](../media/azure-netapp-files/azure-netapp-files-add-snapshot.png)

3.	In the New Snapshot window, provide a name for the new snapshot that you are creating.   

    ![New snapshot](../media/azure-netapp-files/azure-netapp-files-new-snapshot.png)

4. Click **OK**. 

## Manage snapshot policies

You can schedule for volume snapshots to be taken automatically by using snapshot policies. You can also modify a snapshot policy as needed, or delete a snapshot policy that you no longer need.  

### Register the feature

The **snapshot policy** feature is currently in preview. If you are using this feature for the first time, you need to register the feature first. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFSnapshotPolicy
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for several minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFSnapshotPolicy
    ```

### Create a snapshot policy 

A snapshot policy enables you to specify the snapshot creation frequency in hourly, daily, weekly, or monthly cycles. You also need to specify the maximum number of snapshots to retain for the volume.  

1.	From the NetApp Account view, click **Snapshot policy**.

    ![Snapshot policy navigation](../media/azure-netapp-files/snapshot-policy-navigation.png)

2.	In the Snapshot Policy window, set Policy State to **Enabled**. 

3.	Click the **Hourly**, **Daily**, **Weekly**, or **Monthly** tab to create hourly, daily, weekly, or monthly snapshot policies. Specify the **Number of snapshots to keep**.  

    See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md) about the maximum number of snapshots allowed for a volume. 

    The following example shows hourly snapshot policy configuration. 

    ![Snapshot policy hourly](../media/azure-netapp-files/snapshot-policy-hourly.png)

    The following example shows daily snapshot policy configuration.

    ![Snapshot policy daily](../media/azure-netapp-files/snapshot-policy-daily.png)

    The following example shows weekly snapshot policy configuration.

    ![Snapshot policy weekly](../media/azure-netapp-files/snapshot-policy-weekly.png)

    The following example shows monthly snapshot policy configuration.

    ![Snapshot policy monthly](../media/azure-netapp-files/snapshot-policy-monthly.png) 

4.	Click **Save**.  

If you need to create additional snapshot policies, repeat Step 3.
The policies you created appear in the Snapshot policy page.

If you want a volume to use the snapshot policy, you need to [apply the policy to the volume](azure-netapp-files-manage-snapshots.md#apply-a-snapshot-policy-to-a-volume). 

### Apply a snapshot policy to a volume

If you want a volume to use a snapshot policy that you created, you need to apply the policy to the volume. 

1.	Go to the **Volumes** page, right-click the volume that you want to apply a snapshot policy to, and select **Edit**.

    ![Volumes right-click menu](../media/azure-netapp-files/volume-right-cick-menu.png) 

2.	In the Edit window, under **Snapshot policy**, select a policy to use for the volume.  Click **OK** to apply the policy.  

    ![Snapshot policy edit](../media/azure-netapp-files/snapshot-policy-edit.png) 

### Modify a snapshot policy 

You can modify an existing snapshot policy to change the policy state, snapshot frequency (hourly, daily, weekly, or monthly), or number of snapshots to keep.  
 
1.	From the NetApp Account view, click **Snapshot policy**.

2.	Right click the snapshot policy you want to modify, then select **Edit**.

    ![Snapshot policy right-click menu](../media/azure-netapp-files/snapshot-policy-right-click-menu.png) 

3.	Make the changes in the Snapshot Policy window that appears, then click **Save**. 

### Delete a snapshot policy 

You can delete a snapshot policy that you no longer want to keep.   

1.	From the NetApp Account view, click **Snapshot policy**.

2.	Right click the snapshot policy you want to modify, then select **Delete**.

    ![Snapshot policy right-click menu](../media/azure-netapp-files/snapshot-policy-right-click-menu.png) 

3.	Click **Yes** to confirm that you want to delete the snapshot policy.   

    ![Snapshot policy delete confirmation](../media/azure-netapp-files/snapshot-policy-delete-confirm.png) 

## Restore a snapshot to a new volume

Currently, you can restore a snapshot only to a new volume. 
1. Select **Snapshots** from the Volume blade to display the snapshot list. 
2. Right-click the snapshot to restore and select **Restore to new volume** from the menu option.  

    ![Restore snapshot to new volume](../media/azure-netapp-files/azure-netapp-files-snapshot-restore-to-new-volume.png)

3. In the Create a Volume window, provide information for the new volume:  
    * **Name**   
        Specify the name for the volume that you are creating.  
        
        The name must be unique within a resource group. It must be at least three characters long.  It can use any alphanumeric characters.

    * **Quota**  
        Specify the amount of logical storage that you want to allocate to the volume.  

    ![Restore to new volume](../media/azure-netapp-files/snapshot-restore-new-volume.png) 

4. Click **Review+create**.  Click **Create**.   
    The new volume uses the same protocol that the snapshot uses.   
    The new volume to which the snapshot is restored appears in the Volumes blade.

## Next steps

* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
