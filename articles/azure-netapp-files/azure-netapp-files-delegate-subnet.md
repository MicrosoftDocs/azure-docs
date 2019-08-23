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
ms.topic: conceptual
ms.date: 03/25/2019
ms.author: b-juche
---
# Delegate a subnet to Azure NetApp Files 

You must delegate a subnet to Azure NetApp Files.   When you create a volume, you need to specify the delegated subnet.

## Considerations
* The wizard for creating a new subnet defaults to a /24 network mask, which provides for 251 available IP addresses. Using a /28 network mask, which provides for 16 usable IP addresses, is sufficient for the service.
* In each Azure Virtual Network (Vnet), only one subnet can be delegated to Azure NetApp Files.
* You cannot designate a network security group or service endpoint in the delegated subnet. Doing so causes the subnet delegation to fail.
* Access to a volume from a globally peered virtual network is not currently supported.
* Creating [user-defined custom routes](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#custom-routes) on VM subnets with address prefix (destination) to a subnet delegated to Azure NetApp Files is unsupported. Doing so will impact VM connectivity.

## Steps 
1.	Go to the **Virtual networks** blade from the Azure portal and select the virtual network that you want to use for Azure NetApp Files.    

1. Select **Subnets** from the Virtual network blade and click the **+Subnet** button. 

1. Create a new subnet to use for Azure NetApp Files by completing the following required fields in the Add Subnet page:
    * **Name**: Specify the subnet name.
    * **Address range**: Specify the IP address range.
    * **Subnet delegation**: Select **Microsoft.NetApp/volumes**. 

      ![Subnet delegation](../media/azure-netapp-files/azure-netapp-files-subnet-delegation.png)
    
You can also create and delegate a subnet when you [create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md). 

## Next steps  
* [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Learn about virtual network integration for Azure services](https://docs.microsoft.com/azure/virtual-network/virtual-network-for-azure-services)


