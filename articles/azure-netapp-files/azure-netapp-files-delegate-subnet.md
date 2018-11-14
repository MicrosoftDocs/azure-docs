---
title: Delegate a subnet to Azure NetApp Files | Microsoft Docs
description: Describes how to delegate a subnet to Azure NetApp Files.
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
ms.topic: get-started-article
ms.date: 11/13/2018
ms.author: b-juche
---
# Delegate a subnet to Azure NetApp Files 

You need to delegate a subnet to Azure NetApp Files.   When you create a volume, you will need to specify the delegated subnet.

## Steps 
1.	Go to the **Virtual networks** blade from the Azure portal and select the virtual network you want to use for Azure NetApp Files.     

1. Select **Subnets** from the Virtual network blade and click the **+Subnet** button. 

1. Create a new subnet to use for Azure NetApp Files by completing the following required fields in the Add Subnet page:
    * **Name**: Specify the subnet name.
    * **Address range**: Specify the IP address range.
    * **Subnet delegation**: Select **Microsoft.NetApp/volumes**. 

      ![Subnet delegation](../media/azure-netapp-files/azure-netapp-files-subnet-delegation.png)
    
    

> [!NOTE] 
> You can also create and delegate a subnet when you [create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md). 

## Next steps  
* [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Learn about virtual network integration for Azure services](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-for-azure-services)


