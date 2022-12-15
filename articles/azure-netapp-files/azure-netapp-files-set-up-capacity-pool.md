---
title: Create a capacity pool for Azure NetApp Files | Microsoft Docs
description: Describes how to create a capacity pool so that you can create volumes within it.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 12/20/2022
ms.author: anfdocs
---
# Create a capacity pool for Azure NetApp Files

Creating a capacity pool enables you to create volumes within it.  

## Before you begin 

You must have already created a NetApp account.   

[Create a NetApp account](azure-netapp-files-create-netapp-account.md)

## 2 TiB capacity pool

Azure NetApp Files now supports a lower size limit of 2 TiB for capacity pools.

>[!IMPORTANT]
>Capacity pools smaller than 4 TiB are only supported for volumes configured with Standard network features.

The 2 TiB limit is currently in preview. If you wish to set your limit below 4 TiB for the first time, you must register the feature first:

1.  Register the feature: 

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANF2TiBPoolSize
    ```

2. Check the status of the feature registration: 

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANF2TiBPoolSize
    ```

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is **Registered** before continuing.

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Steps 

1. Go to the management blade for your NetApp account, and then, from the navigation pane, click **Capacity pools**.  
    
    ![Navigate to capacity pool](../media/azure-netapp-files/azure-netapp-files-navigate-to-capacity-pool.png)

2. Select **+ Add pools** to create a new capacity pool.   
    The New Capacity Pool window appears.

3. Provide the following information for the new capacity pool:  
   * **Name**  
     Specify the name for the capacity pool.  
     The capacity pool name must be unique for each NetApp account.

   * **Service level**   
     This field shows the target performance for the capacity pool.  
     Specify the service level for the capacity pool: [**Ultra**](azure-netapp-files-service-levels.md#Ultra), [**Premium**](azure-netapp-files-service-levels.md#Premium), or [**Standard**](azure-netapp-files-service-levels.md#Standard).

    * **Size**     
     Specify the size of the capacity pool that you are purchasing.        
     The minimum capacity pool size is 2 TiB. You can change the size of a capacity pool in 1-TiB increments.

    >[!NOTE]
    >2 TiB capacity pool sizing is currently in preview. If you want to set your capacity pool size below 4 TiB, you must first [register the 2 TiB capacity pool feature](#2-tib-capacity-pool).

   * **QoS**   
     Specify whether the capacity pool should use the **Manual** or **Auto** QoS type.  

     See [Storage Hierarchy](azure-netapp-files-understand-storage-hierarchy.md) and [Performance Considerations](azure-netapp-files-performance-considerations.md) to understand the QoS types.  

     > [!IMPORTANT] 
     > Setting **QoS type** to **Manual** is permanent. You cannot convert a manual QoS capacity pool to use auto QoS. However, you can convert an auto QoS capacity pool to use manual QoS. See [Change a capacity pool to use manual QoS](manage-manual-qos-capacity-pool.md#change-to-qos).   

    :::image type="content" source="../media/azure-netapp-files/azure-netapp-files-new-capacity-pool.png" alt-text="Screenshot of new capacity pool options.":::

4. Select **Create**.

## Next steps 

- [Storage Hierarchy](azure-netapp-files-understand-storage-hierarchy.md) 
- [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
- [Azure NetApp Files pricing page](https://azure.microsoft.com/pricing/details/storage/netapp/)
- [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
- [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md)
