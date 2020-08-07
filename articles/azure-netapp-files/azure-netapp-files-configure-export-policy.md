---
title: Configure export policy for NFS volume - Azure NetApp Files
description: Describes how to configure export policy to control access to an NFS volume using Azure NetApp Files
services: azure-netapp-files
author: b-juche
ms.author: b-juche
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 10/18/2019
---
# Configure export policy for an NFS volume

You can optionally configure export policy to control access to an Azure NetApp Files volume. Azure NetApp Files export policy supports NFS volumes only.  Both NFSv3 and NFSv4 are supported. 

## Steps 

1.	Click **Export policy** from the Azure NetApp Files navigation pane. 

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

    ![Export policy](../media/azure-netapp-files/azure-netapp-files-export-policy.png) 


## Next steps 
* [Manage volumes](azure-netapp-files-manage-volumes.md)
* [Mount or unmount a volume for virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
* [Manage snapshots](azure-netapp-files-manage-snapshots.md)
