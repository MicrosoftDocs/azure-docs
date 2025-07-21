---
title: Manage Azure NetApp Files storage with cool access
description: Learn how to free up storage by configuring inactive data to move from Azure NetApp Files Standard service-level storage (the hot tier) to an Azure storage account (the cool tier).
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 06/06/2025
ms.author: anfdocs
ms.custom:
  - build-2025
# Customer intent: "As a cloud storage administrator, I want to configure inactive data to transition from hot to cool storage, so that I can optimize costs while managing data efficiently in Azure NetApp Files."
---

# Manage Azure NetApp Files storage with cool access

When you use Azure NetApp Files [storage with cool access](cool-access-introduction.md), you can configure inactive data to move from Azure NetApp Files storage (the *hot tier*) to an Azure storage account (the *cool tier*). In doing so, you reduce the total cost of ownership of your data stored in Azure NetApp Files.

The cool access feature allows you to configure a capacity pool with cool access. The storage service level with cool access feature moves cold (infrequently accessed) data from the volume and the volume's snapshots to the Azure storage account to help you reduce the cost of storage. There can be a difference in data access latency because the data needs to be read from the Azure storage account.

The storage with cool access feature provides options for the "coolness period" to optimize the network transfer cost, based on your workload and read/write patterns. This feature is provided at the volume level. For more information, see [Set options for coolness period section](#modify_cool). The storage with cool access feature also provides metrics on a per-volume basis. For more information, see the [Metrics section](cool-access-introduction.md#metrics).

## Considerations

There are several considerations to be aware of when using cool access.

### General considerations for cool access

* No guarantee is provided for any maximum latency for client workload for any of the service tiers.
* Although cool access is available for the Standard, Premium, and Ultra service levels, how you're billed for using the feature differs from the hot tier service-level charges. For details and examples, see the [Billing section](cool-access-introduction.md#billing).
* Cool access supports two tiering policies: `Auto` and `SnapshotOnly`. The `SnapshotOnly` policy limits data tiering to data in snapshots, while all data blocks associated with files in the active file system remain in the hot tier. The `Auto` policy encompasses both snapshot copy data and data in the active file system.
    Throughput is based on the [the service level](azure-netapp-files-service-levels.md#supported-service-levels) for both the `Auto` and `SnapshotOnly` tiering policies.
* To prevent data retrieval from the cool tier to the hot tier during sequential read operations (for example, antivirus or other file scanning operations), set the cool access retrieval policy to **Default** or **Never**. For more information about the retrieval policy, see [Enable cool access on a new volume](#enable-cool-access-on-a-new-volume).
* Files moved to the cool tier remains there after you disable cool access on a volume. You must perform an I/O operation on _each_ file to return it to the warm tier. 
* For the maximum number of volumes supported for cool access per subscription per region, see [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#resource-limits).
* Cool access is supported with large volumes. Confirm that you're [registered to use large volumes](large-volumes-requirements-considerations.md#register-the-feature) before creating a cool-access-enabled large volume. 

### Considerations for cool access-enabled capacity pools 

* You can convert an existing capacity pool into a cool-access capacity pool to create cool access volumes. After the capacity pool is enabled for cool access, you can't convert it back to a non-cool-access capacity pool.  
    * When you enable cool access, data that satisfies the conditions set by the coolness period moves to the cool tier. For example, if the coolness period is set to 30 days, any data that has been cool for at least 30 days moves to the cool tier _when_ you enable cool access. Once the coolness period is reached, background jobs can take up to 48 hours to initiate the data transfer to the cool tier. 
* A cool-access capacity pool can contain both volumes with cool access enabled and volumes with cool access disabled.
* After the capacity pool is configured with the option to support cool access volumes, the setting can't be disabled at the _capacity pool_ level. You can turn on or turn off the cool access setting at the _volume_ level anytime. Turning off the cool access setting at the volume level stops further tiering of data.  

#### Considerations for moving volumes to another capacity pool

* Volumes enabled for cool access can be moved between capacity pools only if those capacity pools are enabled for cool access. When a volume is enabled for cool access, it can only reside in a cool access-enabled capacity pool even if cool access has been disabled on the volume. 
* If you [move a cool access volume to another capacity pool (service level change)](dynamic-change-volume-service-level.md), you must also enable that pool for cool access.
* If you disable cool access and turn off tiering on a cool access volume (that is, the volume no longer uses cool access), you can't move it to a non-cool-access capacity pool. In a cool access capacity pool, you can move all volumes, *whether they're enabled for cool access or not*, only to another cool access capacity pool.  

### Considerations for throughput in Premium and Ultra service level volumes with cool access

- Enabling cool access on volumes in Premium and Ultra capacity pools results in reduced throughput: 
    - For the Premium service level, throughput is 36 MiB/s per 1 TiB (compared to 64 MiB/s per 1 TiB without cool access) 
    - For the Ultra service level, throughput is 68 MiB/second per 1 TiB (compared to 128 MiB/second per 1 TiB without cool access) 
    - Reduced throughput limits are applicable to the `Auto` and `SnapshotOnly` tiering policies.
- This reduced throughput remains in effect even if the cool access feature is subsequently turned off for the volume.  
- When cool access is enabled on a volume, you benefit from a reduced price. You don't receive additional discounts specifically for the reduced bandwidth. Instead, you pay the cool access price, which inherently includes the reduced throughput. 

### Considerations for deleting data on a cool access enabled volume

- When a volume containing data in the cool tier is deleted, the deletion process occurs directly from the cool tier without rehydrating the data to the hot tier. The data marked for deletion is cleaned up according to the job scheduled in the service.  

    When the volume is deleted in Azure NetApp Files, the data in the associated Azure Blob storage is marked for deletion. Although the data remains in Azure Blob storage until the cleanup job finishes, you aren't charged for the deleted volume. The service manages billing details. After the volume is deleted, you don't incur costs for the data pending deletion in Azure storage.  

- **Data rehydration:** Data isn't rehydrated to the hot tier when the volume is deleted, ensuring the deletion process is efficient and mitigating unnecessary data movement. 
    - The only way to rehydrate data from the cool tier to the hot tier is for the client or application to read the data block. 


### Considerations for cross-region and cross-zone replication 

* With [cross-region](cross-region-replication-introduction.md) and [cross-zone](cross-zone-replication-introduction.md) replication, the cool access setting on the destination volume is updated automatically to match the source volume. This update occurs whenever the setting is changed on the source volume or during authorization. The setting is also updated automatically when a reverse resync of the replication is performed, but only if the destination volume is in a cool access-enabled capacity pool. Changes to the cool access setting on the destination volume don't affect the setting on the source volume.
* In a cross-region or cross-zone replication configuration, you can enable cool access exclusively for destination volumes to enhance data protection and create cost savings without affecting latency in source volumes.

### Considerations for snapshot restore

* When you [restore a snapshot of a cool access-enabled volume to a new volume](snapshots-restore-new-volume.md), the new volume inherits the cool access configuration from the parent volume. After the new volume is created, you can modify the cool access settings.  
* You can't restore from a snapshot of a non-cool-access volume to a cool access volume. Likewise, you can't restore from a snapshot of a cool access volume to a non-cool-access volume.

## Enable cool access 

You must register for cool access with the Premium or Ultra service levels before you can enable it at the capacity pool and volume levels. No registration is required for the Standard service level. 

### Register the feature 

# [Ultra](#tab/ultra)

Before using cool access at the Ultra service level for the first time, you need to register the feature. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccessUltra 
    ```

2. Check the status of the feature registration: 

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccessUltra
    ```
    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is **Registered** before continuing.

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

# [Premium](#tab/premium)

Before using cool access at the Premium service level for the first time, you need to register the feature. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccessPremium 
    ```

2. Check the status of the feature registration: 

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccessPremium
    ```
    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is **Registered** before continuing.

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

# [Standard](#tab/standard)

No registration is required to use cool access at the Standard service level.

---

### Configure the capacity pool for cool access

Before you create or enable a cool-access volume, configure a capacity pool with cool access. You can do so in one of the following ways: 

* [Create a new capacity pool with cool access](#enable-cool-access-new-pool) 
* [Modify an existing capacity pool to support cool-access volumes](#enable-cool-access-existing-pool) 

#### <a name="enable-cool-access-new-pool"></a> Enable cool access on a new capacity pool

1. [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md).  
1. Select the **Enable Cool Access** checkbox, and then select **Create**.

#### <a name="enable-cool-access-existing-pool"></a> Enable cool access on an existing capacity pool  

You can enable cool access support on an existing capacity pool. You can then add or modify volumes in the pool to use cool access.  

1. Right-click the capacity pool for which you want to enable cool access.

1. Select **Enable Cool Access**.

    :::image type="content" source="./media/manage-cool-access/cool-access-existing-pool.png" alt-text="Screenshot that shows the right-click menu on an existing capacity pool where you can select the Enable Cool Access option." lightbox="./media/manage-cool-access/cool-access-existing-pool.png"::: 

### Configure a volume for cool access 

You can enable Azure NetApp Files storage with cool access during the creation of a volume and on existing volumes that are part of a capacity pool with cool access enabled.

#### Enable cool access on a new volume

1. On the **Capacity Pools** menu, select **Volumes**. Select **+ Add volume** to create a new network file system (NFS), server message block (SMB), or dual-protocol volume.
1. On the **Create a volume** page, on the **Basics** tab, set the following options to enable the volume for cool access:

    [!INCLUDE [Cool access configuration settings](includes/cool-access-options.md)]

    :::image type="content" source="./media/manage-cool-access/cool-access-new-volume.png" alt-text="Screenshot that shows the Create a volume page. On the Basics tab, the Enable Cool Access checkbox is selected. The options for the cool access retrieval policy are displayed. " lightbox="./media/manage-cool-access/cool-access-new-volume.png"::: 

1. To finish creating the volume, follow the instructions for the relevant protocol:

    * [Create an NFS volume](azure-netapp-files-create-volumes.md)
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

#### Enable cool access on an existing volume

In a capacity pool enabled for cool access, you can enable an existing volume to support cool access.  

>[!NOTE]
> If cool access is disabled, you can only set a retrieval policy if there's existing data on the cool tier.
>
> If you disable cool access, the cool access setting on the volume, the cool access retrieval policy remains the same.

1. Right-click the volume for which you want to enable the cool access.
1. On the **Edit** window that appears, set the following options for the volume:

    [!INCLUDE [Cool access configuration settings](includes/cool-access-options.md)]

    :::image type="content" source="./media/manage-cool-access/cool-access-existing-volume.png" alt-text="Screenshot that shows the Enable Cool Access checkbox selected. " lightbox="./media/manage-cool-access/cool-access-existing-volume.png"::: 

1. Select **OK** to confirm the changes. 

### <a name="modify_cool"></a>Modify cool access configuration for a volume

Based on the client read/write patterns, you can modify the cool access configuration as needed for a volume.

1. Right-click the volume for which you want to modify the coolness configuration.  

1. On the **Edit** window that appears, update the **Coolness Period** and **Cool Access Retrieval Policy** fields as needed.

## Related content

* [Azure NetApp Files storage with cool access](cool-access-introduction.md)
* [Performance considerations for Azure NetApp Files storage with cool access](performance-considerations-cool-access.md)
