---
title: Manage Azure NetApp Files standard storage with cool access 
description: Learn how to free up storage by configuring inactive data to move from Azure NetApp Files Standard service-level storage (the hot tier) to an Azure storage account (the cool tier).
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 10/20/2023
ms.author: anfdocs
---

# Manage Azure NetApp Files standard storage with cool access

Using Azure NetApp Files [standard storage with cool access](cool-access-introduction.md), you can configure inactive data to move from Azure NetApp Files Standard service-level storage (the *hot tier*) to an Azure storage account (the *cool tier*). In doing so, you reduce the total cost of ownership of your data stored in Azure NetApp Files.

The standard storage with cool access feature allows you to configure a Standard capacity pool with cool access. The Standard storage service level with cool access feature moves cold (infrequently accessed) data to the Azure storage account to help you reduce the cost of storage. Throughput requirements remain the same for the Standard service level enabled with cool access. However, there can be a difference in data access latency because the data needs to be read from the Azure storage account.

The standard storage with cool access feature provides options for the “coolness period” to optimize the network transfer cost, based on your workload and read/write patterns. This feature is provided at the volume level. See the [Set options for coolness period section](#modify_cool) for details. The standard storage with cool access feature also provides metrics on a per-volume basis. See the [Metrics section](cool-access-introduction.md#metrics) for details. 

## Considerations

* No guarantee is provided for any maximum latency for client workload for any of the service tiers. 
* This feature is available only at the **Standard** service level. It's not supported for the Ultra or Premium service level.  
* Although cool access is available for the Standard service level, how you're billed for using the feature differs from the Standard service level charges. See the [Billing section](cool-access-introduction.md#billing) for details and examples. 
* You can convert an existing Standard service-level capacity pool into a cool-access capacity pool to create cool access volumes. However, once the capacity pool is enabled for cool access, you can't convert it back to a non-cool-access capacity pool.  
* A cool-access capacity pool can contain both volumes with cool access enabled and volumes with cool access disabled. 
* After the capacity pool is configured with the option to support cool access volumes, the setting can't be disabled at the _capacity pool_ level. However, you can turn on or turn off the cool access setting at the volume level anytime. Turning off the cool access setting at the _volume_ level stops further tiering of data.  
* Standard storage with cool access is supported only on capacity pools of the **auto** QoS type.   
    * An auto QoS capacity pool enabled for standard storage with cool access cannot be converted to a capacity pool using manual QoS.
* You can't use large volumes with Standard storage with cool access.
* See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#resource-limits) for maximum number of volumes supported for cool access per subscription per region.
* Considerations for using cool access with [cross-region replication](cross-region-replication-requirements-considerations.md) (CRR) and [cross-zone replication](cross-zone-replication-introduction.md): 
    * If the volume is in a CRR relationship as a source volume, you can enable cool access on it only if the [mirror state](cross-region-replication-display-health-status.md#display-replication-status) is `Mirrored`. Enabling cool access on the source volume automatically enables cool access on the destination volume.
    * If the volume is in a CRR relationship as a destination volume (data protection volume), enabling cool access isn't supported for the volume.
    * The cool access setting is updated automatically on the destination volume to be the same as the source volume. When you update the cool access setting on the source volume, the same setting is applied at the destination volume.
* Considerations for using cool access with [Azure NetApp Files backup](backup-requirements-considerations.md): 
    * When a backup is in progress for a volume, you can’t enable cool access on the volume.  
    * If a volume already contains cool-tiered data, you can’t enable backup for the volume.
    * If backup is already enabled on a volume, you can enable cool access only if the baseline backup is complete.
* Considerations for using cool access with [snapshot restore](snapshots-restore-new-volume.md):
    * When restoring a snapshot of a cool access enabled volume to a new volume, the new volume inherits the cool access configuration from the parent volume. Once the new volume is created, the cool access settings can be modified.  
    * You can't restore from a snapshot of a non-cool-access volume to a cool access volume.  Likewise, you can't restore from a snapshot of a cool access volume to a non-cool-access volume.
* Considerations for [moving volumes to another capacity pool](dynamic-change-volume-service-level.md): 
    * If you move a cool access volume to another capacity pool (service level change), that pool must also be enabled for cool access. 
    * If you disable cool access and turn off tiering on a cool access volume (that is, the volume no longer uses cool access),  you can’t move it to a non-cool-access capacity pool.  In a cool access capacity pool, all volumes, *whether enabled for cool access or not*, can only be moved to another cool access capacity pool.  

## Register the feature
 
This feature is currently in preview. You need to register the feature before using it for the first time. After registration, the feature is enabled and works in the background. No UI control is required. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccess
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccess
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Enable cool access 

To use the Standard storage with cool access feature, you need to configure the feature at the capacity pool level and the volume level.  

### Configure the capacity pool for cool access

Before creating or enabling a cool-access volume, you need to configure a Standard service-level capacity pool with cool access. The capacity pool must use the auto [QoS type](azure-netapp-files-understand-storage-hierarchy.md#qos_types). You can do so in one of the following ways: 

* [Create a new Standard service-level capacity pool with cool access.](#enable-cool-access-new-pool) 
* [Modify an existing Standard service-level capacity pool to support cool-access volumes.](#enable-cool-access-existing-pool) 

#### <a name="enable-cool-access-new-pool"></a> Enable cool access on a new capacity pool  
1. [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md) with the **Standard** service level and the **auto** QoS type.  
1. Check the **Enable Cool Access** checkbox, then select **Create**. 
    When you select **Enable Cool Access**, the UI automatically selects the auto QoS type. The manual QoS type isn't supported for Standard service with cool access. 

    :::image type="content" source="../media/azure-netapp-files/cool-access-new-capacity-pool.png" alt-text="Screenshot that shows the New Capacity Pool window with the Enable Cool Access option selected." lightbox="../media/azure-netapp-files/cool-access-new-capacity-pool.png"::: 

#### <a name="enable-cool-access-existing-pool"></a> Enable cool access on an existing capacity pool  

You can enable cool access support on an existing Standard service-level capacity pool that uses the auto QoS type. This action allows you to add or modify volumes in the pool to use cool access.  

1. Right-click a **Standard** service-level capacity pool for which you want to enable cool access.   

2. Select **Enable Cool Access**: 

    :::image type="content" source="../media/azure-netapp-files/cool-access-existing-pool.png" alt-text="Screenshot that shows the right-click menu on an existing capacity pool. The menu enables you to select the Enable Cool Access option." lightbox="../media/azure-netapp-files/cool-access-existing-pool.png"::: 

### Configure a volume for cool access 

Standard storage with cool access can be enabled during the creation of a volume and on existing volumes that are part of a capacity pool that has cool access enabled. 

#### Enable cool access on a new volume 

1. Select the **Volumes** menu from the **Capacity Pools** menu. Select **+ Add volume** to create a new NFS, SMB, or dual-protocol volume. 
1. In the **Basics** tab of the **Create a Volume** page, set the following options to enable the volume for cool access: 

    * **Enable Cool Access**   
        This option specifies whether the volume will support cool access. 
 
    * **Coolness Period**
        This option specifies the period (in days) after which infrequently accessed data blocks (cold data blocks) are moved to the Azure storage account. The default value is 31 days. The supported values are between 7 and 183 days.    

    * **Cool Access Retrieval Policy**   

        This option specifies under which conditions data will be moved back to the hot tier. You can set this option to `Default`, `On-Read`, or `Never`.   

        The following list describes the data retrieval behavior with the cool access retrieval policy settings:

        * *Cool access is **enabled***:  
            * If no value is set for cool access retrieval policy:  
                The retrieval policy will be set to `Default`, and cold data will be retrieved to the hot tier only when performing random reads. Sequential reads will be served directly from the cool tier.
            * If cool access retrieval policy is set to `Default`:   
                Cold data will be retrieved only by performing random reads.
            * If cool access retrieval policy is set to `On-Read`:   
                Cold data will be retrieved by performing both sequential and random reads.
            * If cool access retrieval policy is set to `Never`:   
                Cold data will be served directly from the cool tier and not be retrieved to the hot tier.
        * *Cool access is **disabled**:*     
            You can't set cool access retrieval policy if cool access is disabled. If there's existing data in the cool tier from previous tiering when cool access was enabled on the volume, only random reads can be performed to get this data back to the hot tier. That is, the retrieval policy remains `Default` on the back end, and no further tiering will happen.

        The following limitations apply to the cool access retrieval policy settings:    
        
        * When the cool access setting is disabled on the volume, you can't modify the cool access retrieval policy setting on the volume. 
        * Once you disable the cool access setting on the volume, the cool access retrieval policy setting automatically reverts to `Default`.   

    :::image type="content" source="../media/azure-netapp-files/cool-access-new-volume.png" alt-text="Screenshot that shows the Create a Volume page. Under the basics tab, the Enable Cool Access checkbox is selected. The options for the cool access retrieval policy are displayed. " lightbox="../media/azure-netapp-files/cool-access-new-volume.png"::: 

1. Follow one of the following articles to complete the volume creation:   
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

#### Enable cool access on an existing volume 

In a Standard service-level, cool-access enabled capacity pool, you can enable an existing volume to support cool access.  

1. Right-click the volume for which you want to enable the cool access. 
1. In the **Edit** window that appears, set the following options for the volume: 
    * **Enable Cool Access**  
        This option specifies whether the volume will support cool access. 
    * **Coolness Period**  
        This option specifies the period (in days) after which infrequently accessed data blocks (cold data blocks) are moved to the Azure storage account. The default value is 31 days. The supported values are between 7 and 183 days. 
    * **Cool Access Retrieval Policy**   

        This option specifies under which conditions data will be moved back to the hot tier. You can set this option to `Default`, `On-Read`, or `Never`.   

        The following list describes the data retrieval behavior with the cool access retrieval policy settings:

        * *Cool access is **enabled***:  
            * If no value is set for cool access retrieval policy:  
                The retrieval policy will be set to `Default`, and cold data will be retrieved to the hot tier only when performing random reads. Sequential reads will be served directly from the cool tier.
            * If cool access retrieval policy is set to `Default`:   
                Cold data will be retrieved only by performing random reads.
            * If cool access retrieval policy is set to `On-Read`:   
                Cold data will be retrieved by performing both sequential and random reads.
            * If cool access retrieval policy is set to `Never`:   
                Cold data will be served directly from the cool tier and not be retrieved to the hot tier.
        * *Cool access is **disabled**:*     
            You can't set cool access retrieval policy if cool access is disabled. If there's existing data in the cool tier from previous tiering when cool access was enabled on the volume, only random reads can be performed to get this data back to the hot tier. That is, the retrieval policy remains `Default` on the back end, and no further tiering will happen.

        The following limitations apply to the cool access retrieval policy settings:    
        
        * When the cool access setting is disabled on the volume, you can't modify the cool access retrieval policy setting on the volume. 
        * Once you disable the cool access setting on the volume, the cool access retrieval policy setting automatically reverts to `Default`.   


    :::image type="content" source="../media/azure-netapp-files/cool-access-existing-volume.png" alt-text="Screenshot that shows the Enable Cool Access window with the Enable Cool Access field selected. " lightbox="../media/azure-netapp-files/cool-access-existing-volume.png"::: 

### <a name="modify_cool"></a>Modify cool access configuration for a volume

Based on the client read/write patterns, you can modify the cool access configuration as needed for a volume. 

1. Right-click the volume for which you want to modify the coolness configuration.  

1. In the **Edit** window that appears, update the **Coolness Period** and **Cool Access Retrieval Policy** fields as needed.   

## Next steps
* [Standard storage with cool access in Azure NetApp Files](cool-access-introduction.md)
