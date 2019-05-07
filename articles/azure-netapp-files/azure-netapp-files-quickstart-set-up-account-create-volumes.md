---
title: Set up Azure NetApp Files and create a volume | Microsoft Docs
description: Describes how to quickly set up Azure NetApp Files and create a volume.
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
ms.topic: quickstart 
ms.date: 2/20/2019
ms.author: b-juche
---
# Set up Azure NetApp Files and create a volume 

This article shows you how to quickly set up Azure NetApp Files and create a volume. 

## Before you begin 

You need to be part of the Public Preview program and whitelisted for accessing the Microsoft.NetApp Resource Provider. For details about joining the Public Preview program, see the [Azure NetApp Files Public Preview signup page](https://aka.ms/nfspublicpreview). 

## Register for Azure NetApp Files and NetApp Resource Provider

1. From the Azure portal, click the Azure Cloud Shell icon on the upper right-hand corner.

      ![Azure Cloud Shell icon](../media/azure-netapp-files/azure-netapp-files-azure-cloud-shell.png)

2. Specify the subscription that has been whitelisted for Azure NetApp Files:
    
        az account set --subscription <subscriptionId>

3. Register the Azure Resource Provider: 
    
        az provider register --namespace Microsoft.NetApp --wait  

    The registration process can take some time to complete.

## Create a NetApp account

1. In the Azure portal’s search box, enter **Azure NetApp Files** and then select **Azure NetApp Files (preview)** from the list that appears.

      ![Select Azure NetApp Files](../media/azure-netapp-files/azure-netapp-files-select-azure-netapp-files.png)

2. Click **+ Add** to create a new NetApp account.

     ![Create new NetApp account](../media/azure-netapp-files/azure-netapp-files-create-new-netapp-account.png)

3. In the New NetApp Account window, provide the following information: 
   1. Enter **myaccount1** for the account name. 
   2. Select your subscription.
   3. Select **Create new** to create new resource group. Enter **myRG1** for the resource group name. Click **OK**. 
   4. Select your account location.  

      ![New NetApp Account window](../media/azure-netapp-files/azure-netapp-files-new-account-window.png)  

      ![Resource group window](../media/azure-netapp-files/azure-netapp-files-resource-group-window.png)

4. Click **Create** to create your new NetApp account.

## Set up a capacity pool

1. From the Azure NetApp Files management blade, select your NetApp account (**myaccount1**).

    ![Select NetApp account](../media/azure-netapp-files/azure-netapp-files-select-netapp-account.png)  

2. From the Azure NetApp Files management blade of your NetApp account, click **Capacity pools**.

    ![Click Capacity pools](../media/azure-netapp-files/azure-netapp-files-click-capacity-pools.png)  

3. Click **+ Add pools**. 

    ![Click Add pools](../media/azure-netapp-files/azure-netapp-files-click-add-pools.png)  

4. Provide information for the capacity pool: 
    1. Enter **mypool1** as the pool name.
    2. Select **Premium** for the service level. 
    3. Specify **4 (TiB)** as the pool size. 

5. Click **OK**.

## Create a volume for Azure NetApp Files

1. From the Azure NetApp Files management blade of your NetApp account, click **Volumes**.

    ![Click Volumes](../media/azure-netapp-files/azure-netapp-files-click-volumes.png)  

2. Click **+ Add volume**.

    ![Click Add volumes](../media/azure-netapp-files/azure-netapp-files-click-add-volumes.png)  

3. In the Create a Volume window, provide information for the volume: 
   1. Enter **myvol1** as the volume name. 
   2. Enter **myfilepath1** as the file path that will be used to create the export path for the volume.
   3. Select your capacity pool (**mypool1**).
   4. Use the default value for quota. 
   5. Under virtual network, click **Create new** to create a new Azure virtual network (Vnet).  Then fill in the following information:
       * Enter **myvnet1** as the Vnet name.
       * Specify an address space for your setting, for example, 10.7.0.0/16
       * Enter **myANFsubnet** as the subnet name.
       * Specify the subnet address range, for example, 10.7.0.0/24. Note that you cannot share the dedicated subnet with other resources.
       * Select **Microsoft.NetApp/volumes** for subnet delegation.
       * Click **OK** to create the Vnet.
   6. In subnet, select the newly created Vnet (**myvnet1**) as the delegate subnet.

      ![Create a volume window](../media/azure-netapp-files/azure-netapp-files-create-volume-window.png)  

      ![Create virtual network window](../media/azure-netapp-files/azure-netapp-files-create-virtual-network-window.png)  

4. Click **Review + create**.

    ![Review and create window](../media/azure-netapp-files/azure-netapp-files-review-and-create-window.png)  

5. Review information for the volume, then click **Create**.  
    The created volume appears in the Volumes blade.

    ![Volume created](../media/azure-netapp-files/azure-netapp-files-create-volume-created.png)  

## Next steps  

* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Manage volumes by using Azure NetApp Files](azure-netapp-files-manage-volumes.md) 
