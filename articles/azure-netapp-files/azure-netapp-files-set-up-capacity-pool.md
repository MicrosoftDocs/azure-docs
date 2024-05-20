---
title: Create a capacity pool for Azure NetApp Files | Microsoft Docs
description: Describes how to create a capacity pool so that you can create volumes within it.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 10/23/2023
ms.author: anfdocs
---
# Create a capacity pool for Azure NetApp Files

Creating a capacity pool enables you to create volumes within it. 

## Before you begin 

* You need [a NetApp account](azure-netapp-files-create-netapp-account.md).   
* If you're using Azure CLI, ensure that you're using the latest version. For more information, see [How to update the Azure CLI](/cli/azure/update-azure-cli).
* If you're using PowerShell, ensure that you're using the latest version of the Az.NetAppFiles module. To update to the latest version, use the 'Update-Module Az.NetAppFiles' command. For more information, see [Update-Module](/powershell/module/powershellget/update-module).
* If you're using the Azure REST API, ensure that you specify the latest version.
* If you're creating 1-TiB capacity pool, you must first register the feature: 
    1. Register the feature: 
        ```azurepowershell-interactive
        Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANF1TiBPoolSize
        ```
    2. Check the status of the feature registration: 
        > [!NOTE]
        > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is **Registered** before continuing.
        ```azurepowershell-interactive
        Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANF1TiBPoolSize
        ```
        You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Steps 

1. In the Azure portal, go to your NetApp account. From the navigation pane, select **Capacity pools**.  
    
    ![Navigate to capacity pool](./media/azure-netapp-files-set-up-capacity-pool/azure-netapp-files-navigate-to-capacity-pool.png)

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
     Specify the size of the capacity pool that you're purchasing.        
     The minimum capacity pool size is 1 TiB. You can change the size of a capacity pool in 1-TiB increments.
    
    >[!NOTE]
    >[!INCLUDE [Limitations for capacity pool minimum of 1 TiB](includes/2-tib-capacity-pool.md)]

    * **Enable cool access**  *(for Standard service level only)*   
        This option specifies whether volumes in the capacity pool support cool access. This option is currently supported for the Standard service level only. For details about using this option, see [Manage Azure NetApp Files standard storage with cool access](manage-cool-access.md). 

    * **QoS**   
        Specify whether the capacity pool should use the **Manual** or **Auto** QoS type.  See [Storage Hierarchy](azure-netapp-files-understand-storage-hierarchy.md) and [Performance Considerations](azure-netapp-files-performance-considerations.md) to understand the QoS types.  

        > [!IMPORTANT] 
        > Setting **QoS type** to **Manual** is permanent. You cannot convert a manual QoS capacity pool to use auto QoS. However, you can convert an auto QoS capacity pool to use manual QoS. See [Change a capacity pool to use manual QoS](manage-manual-qos-capacity-pool.md#change-to-qos).   

    * **Encryption type** <a name="encryption_type"></a>      
        Specify whether you want the volumes in this capacity pool to use **single** or **double** encryption. See [Azure NetApp Files double encryption at rest](double-encryption-at-rest.md) for details.   

        > [!IMPORTANT] 
        > Azure NetApp Files double encryption at rest supports [Standard network features](azure-netapp-files-network-topologies.md#configurable-network-features), but not Basic network features. See [considerations](double-encryption-at-rest.md#considerations) for using Azure NetApp Files double encryption at rest.  
        >
        > After the capacity pool is created, you can’t modify the setting (switching between `single` or `double`) for the encryption type.  

        Azure NetApp Files double encryption at rest is currently in preview. If using this feature for the first time, you need to register the feature first.  

        1. Register the feature: 
            ```azurepowershell-interactive
            Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDoubleEncryption
            ```
        2. Check the status of the feature registration. `RegistrationState` may be in the `Registering` state for up to 60 minutes before changing to`Registered`. Wait until the status is `Registered` before continuing. 
            ```azurepowershell-interactive
            Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFDoubleEncryption
            ```   
        You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status.  

    :::image type="content" source="./media/shared/azure-netapp-files-new-capacity-pool.png" alt-text="Screenshot showing the New Capacity Pool window.":::

4. Select **Create**.

    The **Capacity pools** page shows the configurations for the capacity pool.  
    
## Next steps 

- [Storage Hierarchy](azure-netapp-files-understand-storage-hierarchy.md) 
- [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
- [Azure NetApp Files pricing page](https://azure.microsoft.com/pricing/details/storage/netapp/)
- [Manage a manual QoS capacity pool](manage-manual-qos-capacity-pool.md)
- [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md)
- [Azure NetApp Files double encryption at rest](double-encryption-at-rest.md)
