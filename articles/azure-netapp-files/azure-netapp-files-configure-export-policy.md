---
title: Configure export policy for an NFS volume using Azure NetApp Files | Microsoft Docs
description: Describes how to configure export policy to control access to an NFS volume using Azure NetApp Files
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
ms.date: 03/20/2019
ms.author: b-juche
---
# Configure export policy for an NFS volume

You can optionally configure export policy to control access to an Azure NetApp Files volume. Export policy is support only for NFS volumes. 

## Steps 

1.	Click the **Create Export Policy** blade from the Manage Volume blade. 

2.	Specify information for the following fields to create an export policy rule:   
    *  **Index**   
        Specify the index number for the rule.  
        An export policy can consist of up to five rules. Rules are evaluated according to their order in the list of index numbers. Rules with lower index numbers are evaluated first. For example, the rule with index number 1 is evaluated before the rule with index number 2. 

    * **Allowed Clients**   
        Specify the value in one of the following formats:  
        * IPv4 address, for example, `10.1.12.24` 
        * IPv4 address with a subnet mask expressed as a number of bits, for example, `10.1.12.10/4`

    * **Access**  
        Select one of the following access types:  
        * No Access 
        * Read & Write
        * Read Only

    * **Protocols**   
        Specify the protocol to use for the export policy.   
        Currently, Azure NetApp Files export policy supports only NFSv3.

    ![Export policy](../media/azure-netapp-files/azure-netapp-files-export-policy.png) 


## Next steps 
* [Manage volumes](azure-netapp-files-manage-volumes.md)
* [Mount or unmount a volume for virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
* [Manage snapshots](azure-netapp-files-manage-snapshots.md)
