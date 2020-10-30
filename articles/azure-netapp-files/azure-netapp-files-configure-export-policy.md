---
title: Configure export policy for NFS volume - Azure NetApp Files
description: Describes how to configure export policy to control access to an NFS volume using Azure NetApp Files
services: azure-netapp-files
author: b-juche
ms.author: b-juche
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 07/27/2020
---
# Configure export policy for an NFS volume

You can configure export policy to control access to an Azure NetApp Files volume. Azure NetApp Files export policy supports volumes that use the NFS protocol (both NFSv3 and NFSv4.1) and the dual protocol (NFSv3 and SMB). 

You can create up to five export policy rules.

## Steps 

1.	From the Volumes page, select the volume for which you want to configure the export policy, and click **Export policy**. 

    You can also configure the export policy during the creation of the volume.

2.	Specify information for the following fields to create an export policy rule:   
    *  **Index**   
        Specify the index number for the rule.  
        An export policy can consist of up to five rules. Rules are evaluated according to their order in the list of index numbers. Rules with lower index numbers are evaluated first. For example, the rule with index number 1 is evaluated before the rule with index number 2. 

    * **Allowed Clients**   
        Specify the value in one of the following formats:  
        * IPv4 address, for example, `10.1.12.24`
        * IPv4 address with a subnet mask expressed as a number of bits, for example, `10.1.12.10/4`
        * Rule supports comma separated IP addresses. You can enter multiple hosts IPs in single rule by separating them buy comma"," for example '10.1.12.25,10.1.12.28,10.1.12.29"

    * **Access**  
        Select one of the following access types:  
        * No Access 
        * Read & Write
        * Read Only

    * **Read-only** and **Read/Write**  
        If you use Kerberos encryption with NFSv4.1, follow the instructions in [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md).  For performance impact of Kerberos, see [Performance impact of Kerberos on NFSv4.1](configure-kerberos-encryption.md#kerberos_performance). 

        ![Kerberos security options](../media/azure-netapp-files/kerberos-security-options.png) 

    * **Root Access**  
        Specify whether the `root` account can access the volume.  By default, Root Access is set to **On**, and the `root` account has access to the volume.

![Export policy](../media/azure-netapp-files/azure-netapp-files-export-policy.png) 



## Next steps 
* [Mount or unmount a volume for virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
* [Manage snapshots](azure-netapp-files-manage-snapshots.md)
