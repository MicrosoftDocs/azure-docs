---
title: Manage Azure NetApp Files storage with cool access
description: Learn how to free up storage by configuring inactive data to move from Azure NetApp Files Standard service-level storage (the hot tier) to an Azure storage account (the cool tier).
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 08/20/2024
ms.author: anfdocs
---

# Manage Azure NetApp Files storage with cool access

Using Azure NetApp Files [storage with cool access](cool-access-introduction.md), you can configure inactive data to move from Azure NetApp Files storage (the *hot tier*) to an Azure storage account (the *cool tier*). In doing so, you reduce the total cost of ownership of your data stored in Azure NetApp Files.

The cool access feature allows you to configure a capacity pool with cool access. The storage service level with cool access feature moves cold (infrequently accessed) data from the volume and the volume's snapshots to the Azure storage account to help you reduce the cost of storage. Throughput requirements remain the same for the service level (Standard, Premium, Ultra) enabled with cool access. However, there can be a difference in data access latency because the data needs to be read from the Azure storage account.

The storage with cool access feature provides options for the “coolness period” to optimize the network transfer cost, based on your workload and read/write patterns. This feature is provided at the volume level. See the [Set options for coolness period section](#modify_cool) for details. The storage with cool access feature also provides metrics on a per-volume basis. See the [Metrics section](cool-access-introduction.md#metrics) for details. 

## Considerations

* No guarantee is provided for any maximum latency for client workload for any of the service tiers. 
* Although cool access is available for the Standard, Premium, and Ultra service levels, how you're billed for using the feature differs from the hot tier service level charges. See the [Billing section](cool-access-introduction.md#billing) for details and examples. 
* You can convert an existing capacity pool into a cool-access capacity pool to create cool access volumes. However, once the capacity pool is enabled for cool access, you can't convert it back to a non-cool-access capacity pool.  
* A cool-access capacity pool can contain both volumes with cool access enabled and volumes with cool access disabled.
* To prevent data retrieval from the cool tier to the hot tier during sequential read operations (for example, antivirus or other file scanning operations), set the cool access retrieval policy to "Default" or "Never." For more information, see [Enable cool access on a new volume](#enable-cool-access-on-a-new-volume).
* After the capacity pool is configured with the option to support cool access volumes, the setting can't be disabled at the _capacity pool_ level. However, you can turn on or turn off the cool access setting at the volume level anytime. Turning off the cool access setting at the _volume_ level stops further tiering of data.  
* You can't use [large volume](large-volumes-requirements-considerations.md) with with cool access.
* See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#resource-limits) for maximum number of volumes supported for cool access per subscription per region.
* Considerations for using cool access with [cross-region replication](cross-region-replication-requirements-considerations.md) and [cross-zone replication](cross-zone-replication-introduction.md): 
    * The cool access setting on the destination is updated automatically to match the source volume whenever the setting is changed on the source volume or during authorizing or performing a reverse resync of the replication. Changes to the cool access setting on the destination volume don't affect the setting on the source volume.
* Considerations for using cool access with [snapshot restore](snapshots-restore-new-volume.md):
    * When restoring a snapshot of a cool access enabled volume to a new volume, the new volume inherits the cool access configuration from the parent volume. Once the new volume is created, the cool access settings can be modified.  
    * You can't restore from a snapshot of a non-cool-access volume to a cool access volume.  Likewise, you can't restore from a snapshot of a cool access volume to a non-cool-access volume.
* Considerations for [moving volumes to another capacity pool](dynamic-change-volume-service-level.md): 
    * If you move a cool access volume to another capacity pool (service level change), that pool must also be enabled for cool access. 
    * If you disable cool access and turn off tiering on a cool access volume (that is, the volume no longer uses cool access),  you can’t move it to a non-cool-access capacity pool.  In a cool access capacity pool, all volumes, *whether enabled for cool access or not*, can only be moved to another cool access capacity pool.  

## Enable cool access 

You must register for cool access before you can enable it at the capacity pool and volume levels. 

### Register the feature 

Azure NetApp Files storage with cool access is generally available. Before using cool access for the first time, you must register for the feature with the service level you intend to use it for. 

# [Standard](#tab/standard)

After registration, the feature is enabled and works in the background. No UI control is required. 

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

# [Premium](#tab/premium)

You must submit a [waitlist request](https://aka.ms/ANFcoolaccesssignup) before enabling Premium storage with cool access. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccessPremium
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.
    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccessPremium
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

# [Ultra](#tab/ultra)

You must submit a [waitlist request](https://aka.ms/ANFcoolaccesssignup) before enabling Ultra storage with cool access. 

1. Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccessUltra
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is **Registered** before continuing.
    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFCoolAccess
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

---

### Configure the capacity pool for cool access

Before creating or enabling a cool-access volume, you need to configure a capacity pool with cool access. You can do so in one of the following ways: 

* [Create a new capacity pool with cool access.](#enable-cool-access-new-pool) 
* [Modify an existing capacity pool to support cool-access volumes.](#enable-cool-access-existing-pool) 

#### <a name="enable-cool-access-new-pool"></a> Enable cool access on a new capacity pool  
1. [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md).  
1. Check the **Enable Cool Access** checkbox then select **Create**. 

#### <a name="enable-cool-access-existing-pool"></a> Enable cool access on an existing capacity pool  

You can enable cool access support on an existing capacity pool. This action allows you to add or modify volumes in the pool to use cool access.  

1. Right-click the capacity pool for which you want to enable cool access.   

2. Select **Enable Cool Access**: 

    :::image type="content" source="./media/manage-cool-access/cool-access-existing-pool.png" alt-text="Screenshot that shows the right-click menu on an existing capacity pool. The menu enables you to select the Enable Cool Access option." lightbox="./media/manage-cool-access/cool-access-existing-pool.png"::: 

### Configure a volume for cool access 

Azure NetApp Files storage with cool access can be enabled during the creation of a volume and on existing volumes that are part of a capacity pool that has cool access enabled. 

#### Enable cool access on a new volume 

1. Select the **Volumes** menu from the **Capacity Pools** menu. Select **+ Add volume** to create a new NFS, SMB, or dual-protocol volume. 
1. In the **Basics** tab of the **Create a Volume** page, set the following options to enable the volume for cool access: 

    * **Enable Cool Access**   
        This option specifies whether the volume supports cool access. 
 
    * **Coolness Period**
        This option specifies the period (in days) after which infrequently accessed data blocks (cold data blocks) are moved to the Azure storage account. The default value is 31 days. The supported values are between 2 and 183 days.    

    * **Cool Access Retrieval Policy**   

        This option specifies under which conditions data moves back to the hot tier. You can set this option to `Default`, `On-Read`, or `Never`.   

        The following list describes the data retrieval behavior with the cool access retrieval policy settings:

        * *Cool access is **enabled***:  
            * If no value is set for cool access retrieval policy:  
                The retrieval policy will be set to `Default`, and cold data will be retrieved to the hot tier only when performing random reads. Sequential reads will be served directly from the cool tier.
            * If cool access retrieval policy is set to `Default`:   
                Cold data will be retrieved only by performing random reads.
            * If cool access retrieval policy is set to `On-Read`:   
                Cold data will be retrieved by performing both sequential and random reads.
            * If cool access retrieval policy is set to `Never`:   
                Cold data is served directly from the cool tier and not be retrieved to the hot tier.
        * *Cool access is **disabled**:*     
            * You can set a cool access retrieval policy if cool access is disabled only if there's existing data on the cool tier. 
            * Once you disable the cool access setting on the volume, the cool access retrieval policy remains the same.    

    :::image type="content" source="./media/manage-cool-access/cool-access-new-volume.png" alt-text="Screenshot that shows the Create a Volume page. Under the basics tab, the Enable Cool Access checkbox is selected. The options for the cool access retrieval policy are displayed. " lightbox="./media/manage-cool-access/cool-access-new-volume.png"::: 

1. Follow one of the following articles to complete the volume creation:   
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

#### Enable cool access on an existing volume 

In a cool-access enabled capacity pool, you can enable an existing volume to support cool access.  

1. Right-click the volume for which you want to enable the cool access. 
1. In the **Edit** window that appears, set the following options for the volume: 
    * **Enable Cool Access**  
        This option specifies whether the volume will support cool access. 
    * **Coolness Period**  
        This option specifies the period (in days) after which infrequently accessed data blocks (cold data blocks) are moved to the Azure storage account. The default value is 31 days. The supported values are between 2 and 183 days. 
    * **Cool Access Retrieval Policy**   

        This option specifies under which conditions data moves back to the hot tier. You can set this option to `Default`, `On-Read`, or `Never`.   

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
            * You can set a cool access retrieval policy if cool access is disabled only if there's existing data on the cool tier. 
            * Once you disable the cool access setting on the volume, the cool access retrieval policy remains the same.    

    :::image type="content" source="./media/manage-cool-access/cool-access-existing-volume.png" alt-text="Screenshot that shows the Enable Cool Access window with the Enable Cool Access field selected. " lightbox="./media/manage-cool-access/cool-access-existing-volume.png"::: 

### <a name="modify_cool"></a>Modify cool access configuration for a volume

Based on the client read/write patterns, you can modify the cool access configuration as needed for a volume. 

1. Right-click the volume for which you want to modify the coolness configuration.  

1. In the **Edit** window that appears, update the **Coolness Period** and **Cool Access Retrieval Policy** fields as needed.   

## Next steps
* [Azure NetApp Files storage with cool access](cool-access-introduction.md)
