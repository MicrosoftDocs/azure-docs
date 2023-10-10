---
title: Manage Azure NetApp Files Standard service level with cool access | Microsoft Docs
description: Learn how to free up storage by configuring inactive data to move from Azure NetApp Files Standard service-level storage to an Azure storage account (the cool tier).
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
ms.date: 05/28/2023
ms.author: anfdocs
---

# Manage Azure NetApp Files Standard service level with cool access

Using Azure NetApp Files Standard service level with [cool access](cool-access-introduction.md), you can configure inactive data to move from Azure NetApp Files Standard service-level storage to an Azure storage account (the cool tier). In doing so, you free up storage that resides within Azure NetApp Files, resulting in cost saving.

The Standard service level with cool access allows you to configure a Standard capacity pool with cool access. The Standard storage service level with cool access feature moves cold (infrequently accessed) data to the Azure storage account to help you reduce the cost of storage. Throughput requirements remain the same for the Standard service level enabled with cool access. However, there can be a difference in data access latency because the data is tiered to the Azure storage account.

The Standard service level with cool access feature provides options for the “coolness period” to optimize the network transfer cost, based on your workload and read/write patterns. This feature is provided at the volume level. See the [Set options for coolness period section](#modify_cool) for details. The Standard service level with cool access feature also provides metrics on a per-volume basis. See the [Metrics section](cool-access-introduction.md#metrics) for details. 

## Considerations

* No guarantee is provided for any maximum latency for client workload for any of the service tiers. 
* This feature is available only at the **Standard** service level. It is not supported for the Ultra or Premium service level.  
* Although cool access is available for the Standard service level, how you're billed for using the feature will differ from the Standard service level charges. See the [Billing section](cool-access-introduction.md#billing) for details and examples. 
* You can convert an existing Standard service-level capacity pool into a cool-access capacity pool to create cool access volumes. However, once the capacity pool is enabled for the cool access feature, you cannot convert it back to a non-cool-access capacity pool.  
* A cool-access capacity pool can contain both volumes with cool access enabled and volumes with cool access disabled. 
* After the capacity pool is configured with the option to support cool access volumes, the setting cannot be disabled at the _capacity pool_ level. However, you can turn on or turn off the cool access setting at the volume level anytime. Turning off the cool access setting at the _volume_ level will stop further tiering of data.  
* Standard storage with cool access is supported only on capacity pools of the **auto** QoS type.   
* You can't use large volumes with Standard storage with cool access.
* See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#resource-limits) for maximum number of volumes supported for cool access per subscription per region.
* Considerations for using cool access with [cross-region replication](cross-region-replication-requirements-considerations.md) (CRR): 
    * If the volume is in a CRR relationship as a source volume, you can enable cool access on it only if the [mirror state](cross-region-replication-display-health-status.md#display-replication-status) is `Mirrored`. Enabling cool access on the source volume automatically enables cool access on the destination volume.
    * If the volume is in a CRR relationship as a destination volume (data protection volume), enabling cool access is not supported for the volume.
    * The cool access setting is updated automatically on the destination volume to be the same as the source volume. When you update the cool access setting on the source volume, the same setting is applied at the destination volume.
* Considerations for using cool access with [Azure NetApp Files backup](backup-requirements-considerations.md): 
    * When a backup is in progress for a volume, you can’t enable cool access on the volume.  
    * If a volume already contains cool-tiered data, you can’t enable backup for the volume.
    * If backup is already enabled on a volume, you can enable cool access only if the baseline backup is complete.
* Considerations for using cool access with [snapshot restore](snapshots-restore-new-volume.md):
    * Restoring from a snapshot of a cool access volume is supported only if the restored volume is also enabled for cool access with the same coolness period.  
    * You can’t restore from a snapshot of a non-cool-access volume to a cool access volume.  Likewise, you can’t restore from a snapshot of a cool access volume to a non-cool-access volume.
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

* [Create a new Standard service-level capacity pool with cool access.](#enable-cool-access-new-volume) 
* [Modify an existing Standard service-level capacity pool to support cool-access volumes.](#enable-cool-access-existing-pool) 

#### <a name="enable-cool-access-new-volume"></a> Enable cool access on a new volume  
1. [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md) with the **Standard** service level and the **auto** QoS type.  
1. Check the **Enable Cool Access** checkbox, then select **Create**. 
    When you select **Enable Cool Access**, the UI automatically selects the auto QoS type. The manual QoS type is not supported for Standard service with cool access. 

    :::image type="content" source="../media/azure-netapp-files/cool-access-new-capacity-pool.png" alt-text="The new capacity pool menu includes an option Enable Cool Access, with a selected checkbox. This is the penultimate field, before QoS Type." lightbox="../media/azure-netapp-files/cool-access-new-capacity-pool.png"::: 

#### <a name="enable-cool-access-existing-pool"></a> Enable cool access on an existing capacity pool  

You can enable cool access support on an existing Standard service-level capacity pool that uses the auto QoS type. This action allows you to add or modify volumes in the pool to use cool access.  

1. Right-click a **Standard** service-level capacity pool for which you want to enable cool access.   

2. Select **Enable Cool Access**: 

    :::image type="content" source="../media/azure-netapp-files/cool-access-existing-pool.png" alt-text="After right-clicking on an existing capacity pool, a menu pops up with the option to Enable Cool Access." lightbox="../media/azure-netapp-files/cool-access-existing-pool.png"::: 

### Configure a volume for cool access 

Standard service with cool access can be enabled during the creation of a new volume or on an existing volume. 

#### Enable cool access on a new volume 

1. Select the **Volumes** menu from the **Capacity Pools** menu. Select **+ Add volume** to create a new NFS, SMB, or dual-protocol volume. 
1. In the **Basics** tab of the **Create a Volume** page, set the following options to enable the volume for cool access: 

    * **Enable Cool Access**   
        This option specifies whether the volume will support cool access. 
 
    * **Coolness Period**
        This option specifies the period (in days) after which infrequently accessed data blocks (cold data blocks) are moved to the Azure storage account. The default value is 31 days. The supported values are between 2 and 183 days.    

    * **Cool Access Retrieval Policy**   
        This option defines how data is retrieved from the cool tier, whether it is sent to both the performance tier (Azure NetApp Files Standard service-level storage) and the client, or sent to only the client.
        * `Default`: There is no change to the retrieval behavior of cool data with this value. Data is retrieved from the cool tier on reads. 
        * `On-Read`: On reads, data is sent from the cool tier to both the performance tier and the client. 
        * `Never`: On reads, data is sent from the cool tier to only the client, without being stored in the performance tier.

    :::image type="content" source="../media/azure-netapp-files/cool-access-new-volume.png" alt-text="Image showing the Create a volume field. Under the basics tab, there's an option to Enable Cool Access with a checkbox selected. There's a coolness period field which accesses a numerical string between 7 and 63 days. The image shows 31 as the value in the field. " lightbox="../media/azure-netapp-files/cool-access-new-volume.png"::: 

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
        This option specifies the period (in days) after which infrequently accessed data blocks (cold data blocks) are moved to the Azure storage account. The default value is 31 days. The supported values are between 7 and 63 days. 
    * **Cool Access Retrieval Policy**   
        This option defines how data is retrieved from the cool tier, whether it is sent to both the performance tier (Azure NetApp Files Standard service-level storage) and the client, or sent to only the client.
        * `Default`: There is no change to the retrieval behavior of cool data with this value. Data is retrieved from the cool tier on reads. 
        * `On-Read`: On reads, data is sent from the cool tier to both the performance tier and the client. 
        * `Never`: On reads, data is sent from the cool tier to only the client, without being stored in the performance tier.

    :::image type="content" source="../media/azure-netapp-files/cool-access-existing-volume.png" alt-text="The Edit window: Enable Cool Access is a field with a checked checkbox. The coolness period is set to 31 days. " lightbox="../media/azure-netapp-files/cool-access-existing-volume.png"::: 

### <a name="modify_cool"></a>Modify cool access configuration for a volume

Based on the client read/write patterns, you can modify the cool access configuration as needed for a volume. 

1. Right-click the volume for which you want to modify the coolness configuration.  

1. In the **Edit** window that appears, update the **Coolness Period** and **Cool Access Retrieval Policy** fields as needed.   

## Next steps
* [Standard storage with cool access in Azure NetApp Files](cool-access-introduction.md)
