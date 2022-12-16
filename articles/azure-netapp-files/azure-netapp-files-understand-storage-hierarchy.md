---
title: Storage hierarchy of Azure NetApp Files | Microsoft Docs
description: Describes the storage hierarchy, including Azure NetApp Files accounts, capacity pools, and volumes.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: overview
ms.date: 12/15/2022
ms.author: anfdocs
---
# Storage hierarchy of Azure NetApp Files

Before creating a volume in Azure NetApp Files, you must purchase and set up a pool for provisioned capacity.  To set up a capacity pool, you must have a NetApp account. Understanding the storage hierarchy helps you set up and manage your Azure NetApp Files resources.

> [!IMPORTANT] 
> Azure NetApp Files currently does not support resource migration between subscriptions.

## <a name="conceptual_diagram_of_storage_hierarchy"></a>Conceptual diagram of storage hierarchy 
The following example shows the relationships of the Azure subscription, NetApp accounts, capacity pools,  and volumes.   

  :::image type="content" source="../media/azure-netapp-files/azure-netapp-files-storage-hierarchy.png" alt-text="Diagram of storage hierarchy in Azure NetApp Files." lightbox="../media/azure-netapp-files/azure-netapp-files-storage-hierarchy.png":::

## <a name="azure_netapp_files_account"></a>NetApp accounts

- A NetApp account serves as an administrative grouping of the constituent capacity pools.  
- A NetApp account is not the same as your general Azure storage account. 
- A NetApp account is regional in scope.   
- You can have multiple NetApp accounts in a region, but each NetApp account is tied to only a single region.

## <a name="capacity_pools"></a>Capacity pools

Understanding how capacity pools work helps you select the right capacity pool types for your storage needs. 

### General rules of capacity pools

- A capacity pool is measured by its provisioned capacity.   
    For more information, see [QoS types](#qos_types).  
- The capacity is provisioned by the fixed SKUs that you purchased (for example, a 4-TiB capacity).
- A capacity pool can have only one service level.  
- Each capacity pool can belong to only one NetApp account. However, you can have multiple capacity pools within a NetApp account.  
- A capacity pool cannot be moved across NetApp accounts.   
  For example, in the [Conceptual diagram of storage hierarchy](#conceptual_diagram_of_storage_hierarchy) below, Capacity Pool 1 cannot be moved from US East NetApp account to US West 2 NetApp account.  
- A capacity pool cannot be deleted until all volumes within the capacity pool have been deleted.

### <a name="qos_types"></a>Quality of Service (QoS) types for capacity pools

The QoS type is an attribute of a capacity pool. Azure NetApp Files provides two QoS types of capacity pools: *auto (default)* and *manual*. 

#### *Automatic (or auto)* QoS type  

When you create a capacity pool, the default QoS type is auto.

In an auto QoS capacity pool, throughput is assigned automatically to the volumes in the pool, proportional to the size quota assigned to the volumes. 

The maximum throughput allocated to a volume depends on the service level of the capacity pool and the size quota of the volume. See [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md) for example calculations.

For performance considerations about QoS types, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

#### *Manual* QoS type  

When you [create a capacity pool](azure-netapp-files-set-up-capacity-pool.md), you can specify for the capacity pool to use the manual QoS type. You can also [change an existing capacity pool](manage-manual-qos-capacity-pool.md#change-to-qos) to use the manual QoS type. *Setting the capacity type to manual QoS is a permanent change.* You cannot convert a manual QoS type capacity tool to an auto QoS capacity pool. 

In a manual QoS capacity pool, you can assign the capacity and throughput for a volume independently. For minimum and maximum throughput levels, see [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#resource-limits). The total throughput of all volumes created with a manual QoS capacity pool is limited by the total throughput of the pool. It's determined by the combination of the pool size and the service-level throughput.  For instance, a 4-TiB capacity pool with the Ultra service level has a total throughput capacity of 512 MiB/s (4 TiB x 128 MiB/s/TiB) available for the volumes.

##### Example of using manual QoS

When you use a manual QoS capacity pool with, for example, an SAP HANA system, an Oracle database, or other workloads requiring multiple volumes, the capacity pool can be used to create these application volumes.  Each volume can provide the individual size and throughput to meet the application requirements. See [Throughput limit examples of volumes in a manual QoS capacity pool](azure-netapp-files-service-levels.md#throughput-limit-examples-of-volumes-in-a-manual-qos-capacity-pool) for details about the benefits.  

## <a name="volumes"></a>Volumes

- A volume is measured by logical capacity consumption and is scalable. 
- A volume's capacity consumption counts against its pool's provisioned capacity.
- A volume’s throughput consumption counts against its pool’s available throughput. See [Manual QoS type](#manual-qos-type).
- Each volume belongs to only one pool, but a pool can contain multiple volumes. 
- Volumes contain a capacity of between 4 TiB and 100 TiB. You can create a [large volume](#large-volumes) with a size of between 100 TiB and 500 TiB.

## <a name="large-volumes"></a>Large volumes (preview)

Azure NetApp Files allows you to create volumes up to 500 TiB in size, exceeding the previous 100-TiB limit. Large volumes begin at a capacity of 102,401 GiB and scale up to 500 TiB, whereas regular Azure NetApp Files volumes, which are offered between 100 GiB and 102,400 GiB. 

### Register the feature 

The large volumes feature for Azure NetApp Files is currently in public preview. This preview is offered under the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) and is controlled via Azure Feature Exposure Control (AFEC) settings on a per subscription basis. To access this feature, contact your account team. 

Follow the registration steps if you're using the feature for the first time.

1.  Register the feature by running the following commands:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumes
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumes
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

### Considerations and requirements for large volumes

* Existing volumes cannot be resized over 100 TiB. You cannot convert Azure NetApp Files to large volumes.
* Large volumes must be created at a size greater than 100 TiB. A single volume cannot exceed 500 TiB.  
* Large volume cannot be resized below 100 TiB and can only be resized up to 30% of lowest provisioned size. 
* You cannot use large volumes in a cross-region replication relationship.
* You cannot create a large volume from a backup.
* You cannot create a backup from a large volume.
* You cannot use Standard storage with cool access with large volumes.
* You cannot create a large volume with application volume groups.
* Large volumes are not currently supported with [cross-zone replication](cross-zone-replication-introduction.md).
* Large volumes in a cross-region replication require additional configuration.   
* Throughput ceilings for the three performance tiers (Standard, Premium, and Ultra) of large volumes are based on the existing 100-TiB maximum capacity targets. You'll be able to grow to 500 TiB with the throughput ceiling as per the table below. 

| Capacity tier | Volume size (TiB) | Throughput (MiB/s) |
| --- | --- | --- |
| Standard | 100 to 500 | 1,600 |
| Premium | 100 to 500 | 6,400 | 
| Ultra | 100 to 500 | 10,240 | 

### Configure large volumes 

>[!IMPORTANT]
>Before you can use large volumes, you must first request [an increase in regional capacity quota](azure-netapp-files-resource-limits.md#request-limit-increase).
>
>When creating the request, you should note if you intend to use large volumes in a cross-region replication relationship. <!-- need more info here -->

Once your capacity quota has increased, you can create volumes that are up to 500 TiB in size. When creating a volume, after you designate the volume quota, you must select **Yes** for the **Large volume** field. Once created, you can manage your large volumes in the same manner as regular volumes. 

## Next steps

- [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
- [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
- [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md)
- [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
- [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
