---
title: Manage default and individual user and group quotas for Azure NetApp Files volumes  | Microsoft Docs 
description: Describes the considerations and steps for managing user and group quotas for Azure NetApp Files volumes.
services: azure-netapp-files
author: b-hchen
ms.author: anfdocs
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 07/13/2022
---
# Manage default and individual user and group quotas for a volume 

This article explains the considerations and steps for managing user and group quotas on Azure NetApp Files volumes. To understand the use cases for this feature, see [Understand default and individual user and group quotas](default-individual-user-group-quotas-introduction.md).

## Quotas in cross-region replication relationships

Quota rules will be synced from cross-region replication (CRR) source to destination volumes. Quota rules created, deleted, or updated on a CRR source volume will automatically be applied on CRR destination volume.

Quota rules will only come into effect on the CRR destination volume after the replication relationship is deleted because the destination volume is read-only. To learn how to break the replication relationship, see [Delete volume replications](cross-region-replication-delete.md#delete-volume-replications). If source volumes have quota rules and the CRR destination volume is created at the same time as the source volume, all the quota rules will be created on destination volume.

## Considerations 

* A quota rule is specific to a volume and is applied to an existing volume.  
* Deleting a volume results in deleting all the associated quota rules for that volume. 
* You can create a maximum number of 100 quota rules for a volume. You can [request limit increase](azure-netapp-files-resource-limits.md#request-limit-increase) through the portal.
* Individual group quota and default group quota aren't supported for SMB and dual protocol volumes.
* Group quotas track the consumption of disk space for files owned by a particular group. A file can only be owned by exactly one group. 
* Auxiliary groups only help in permission checks and cannot be used to restrict the quota (disk space) for a file.
* In a cross-region replication (CRR) setting:
    * Currently, syncing quota rules to the destination (data protection) volume isn't supported.   
    * You can’t create quota rules on the destination volume until the [replication is deleted](cross-region-replication-delete.md).  
    * You need to manually create quota rules on the destination volume if you want them for the volume, and you can do so only after the replication is deleted.
    * If a quota rule is in the error state after you delete the replication relationship, it must be deleted and recreated on the destination volume. 
    * During sync or reverse resync operations:
        * If you create, update, or delete a rule on a source volume, you must perform the same operation on the destination volume. 
        * Any new rule that is created or existing rule that is updated or deleted on a destination volume following the deletion of the replication relationship will be reverted to keep the  source and destination volumes in sync. 

## Register the feature  

The feature to manage user and group quotas is currently in preview. Before using this feature for the first time, you need to register it. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFEnableVolumeUserGroupQuota 
    ```

2. Check the status of the feature registration: 

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFEnableVolumeUserGroupQuota
    ```
    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is **Registered** before continuing.

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Create new quota rules 

1. From the Azure portal, navigate to the volume for which you want to create a quota rule. Select **User and group quotas** in the navigation pane, then click **Add** to create a quota rule for a volume.  

    ![Screenshot that shows the New Quota window of Users and Group Quotas.](../media/azure-netapp-files/user-group-quotas-new-quota.png) 

2. In the **New quota** window that appears, provide information for the following fields, then click **Create**.

    * **Quota rule name**:   
        The name must be unique within the volume. 

    * **Quota type**:  
        Select one of the following options. For details, see [Understand default and individual user and group quotas](default-individual-user-group-quotas-introduction.md).   
        * `Default user quota`
        * `Default group quota` 
        * `Individual user quota` 
        * `Individual group quota`

    * **Quota target**:   
        * NFS volumes:  
            For individual user quota and individual group quota, specify a value in the range of `0` to `4294967295`.  
            For default quota, specify the value as `""`. 
        * SMB volumes:   
            For individual user quota, specify the range in the `^S-1-[0-59]-\d{2}-\d{8,10}-\d{8,10}-\d{8,10}-[1-9]\d{3}` format.  
        * Dual-protocol volumes:   
            For individual user quota using the SMB protocol, specify the range in the `^S-1-[0-59]-\d{2}-\d{8,10}-\d{8,10}-\d{8,10}-[1-9]\d{3}` format.  
            For individual user quota using the NFS protocol, specify a value in the range of `0` to `4294967295`.

    * **Quota limit**:    
        Specify the limit in the range of `4` to `1125899906842620`.  
        Select `KiB`, `MiB`, `GiB`, or `TiB` from the pulldown. 

## Edit or delete quota rules

1. On the Azure portal, navigate to the volume whose quota rule you want to edit or delete.  Select `…` at the end of the quota rule row, then select **Edit** or **Delete** as appropriate. 

    ![Screenshot that shows the Edit and Delete options of Users and Group Quotas.](../media/azure-netapp-files/user-group-quotas-delete-edit.png) 

2. If you are editing a quota rule, update **Quota Limit** in the Edit User Quota Rule window that appears.

    ![Screenshot that shows the Edit User Quota Rule window of Users and Group Quotas.](../media/azure-netapp-files/user-group-quotas-edit-rule.png) 

3. If you are deleting a quota rule, confirm the deletion by selecting **Yes**.  

    ![Screenshot that shows the Confirm Delete window of Users and Group Quotas.](../media/azure-netapp-files/user-group-quotas-confirm-delete.png) 

## Next steps 
* [Understand default and individual user and group quotas](default-individual-user-group-quotas-introduction.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
