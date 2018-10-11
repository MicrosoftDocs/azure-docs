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
ms.date: 10/10/2018
ms.author: b-juche
---
# Delegate a subnet to Azure NetApp Files 

You need to delegate a subnet to Azure NetApp Files.   When you create a volume, you will need to specify the delegated subnet.

## Steps 
1.	From the Subnet delegation drop-down menu, select the **Microsoft.Netapp/volumes** service.   

    ![Subnet delegation](../media/azure-netapp-files/azure-netapp-files-subnet-delegation.png)


## Next steps  
* [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Learn about virtual network integration for Azure services](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-for-azure-services)


