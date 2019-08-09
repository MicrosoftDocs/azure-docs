---
title: Create an SMB volume for Azure NetApp Files | Microsoft Docs
description: Describes how to create an SMB volume for Azure NetApp Files.
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
ms.date: 7/9/2019
ms.author: b-juche
---
# Create an SMB volume for Azure NetApp Files

Azure NetApp Files supports NFS and SMBv3 volumes. A volume's capacity consumption counts against its pool's provisioned capacity. This article shows you how to create an SMBv3 volume. If you want to create an NFS volume, see [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md). 

## Before you begin 
You must have already set up a capacity pool.   
[Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)   
A subnet must be delegated to Azure NetApp Files.  
[Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md)

## Requirements for Active Directory connections

 You need to create Active Directory connections before creating an SMB volume. The requirements for Active Directory connections are as follows: 

* The admin account you use must be able to create machine accounts in the organizational unit (OU) path that you will specify.  

* Proper ports must be open on the applicable Windows Active Directory (AD) server.  
    The required ports are as follows: 

    |     Service           |     Port     |     Protocol     |
    |-----------------------|--------------|------------------|
    |    AD Web Services    |    9389      |    TCP           |
    |    DNS                |    53        |    TCP           |
    |    DNS                |    53        |    UDP           |
    |    ICMPv4             |    N/A       |    Echo Reply    |
    |    Kerberos           |    464       |    TCP           |
    |    Kerberos           |    464       |    UDP           |
    |    Kerberos           |    88        |    TCP           |
    |    Kerberos           |    88        |    UDP           |
    |    LDAP               |    389       |    TCP           |
    |    LDAP               |    389       |    UDP           |
    |    LDAP               |    3268      |    TCP           |
    |    NetBIOS name       |    138       |    UDP           |
    |    SAM/LSA            |    445       |    TCP           |
    |    SAM/LSA            |    445       |    UDP           |
    |    Secure LDAP        |    636       |    TCP           |
    |    Secure LDAP        |    3269      |    TCP           |
    |    w32time            |    123       |    UDP           |

## Create an Active Directory connection

1. From your NetApp account, click **Active Directory connections**, then click **Join**.  

    ![Active Directory Connections](../media/azure-netapp-files/azure-netapp-files-active-directory-connections.png)

2. In the Join Active Directory window, provide the following information:

    * **Primary DNS**  
        This is the DNS that is required for the Active Directory domain join and SMB authentication operations. 
    * **Secondary DNS**   
        This is the secondary DNS server for ensuring redundant name services. 
    * **Domain**  
        This is the domain name of your Active Directory Domain Services that you want to join.
    * **SMB server (computer account) prefix**  
        This is the naming prefix for the machine account in Active Directory that Azure NetApp Files will use for creation of new accounts.

        For example, if the naming standard that your organization uses for file servers is NAS-01, NAS-02..., NAS-045, then you would enter “NAS” for the prefix. 

        The service will create additional machine accounts in Active Directory as needed.

    * **Organizational unit path**  
        This is the LDAP path for the organizational unit (OU) where SMB server machine accounts will be created. That is, OU=second level, OU=first level. 
    * Credentials, including your **username** and **password**

    ![Join Active Directory](../media/azure-netapp-files/azure-netapp-files-join-active-directory.png)

3. Click **Join**.  

    The Active Directory connection you created appears.

    ![Active Directory Connections](../media/azure-netapp-files/azure-netapp-files-active-directory-connections-created.png)

## Add an SMB volume

1. Click the **Volumes** blade from the Capacity Pools blade. 

    ![Navigate to Volumes](../media/azure-netapp-files/azure-netapp-files-navigate-to-volumes.png)

2. Click **+ Add volume** to create a volume.  
    The Create a Volume window appears.

3. In the Create a Volume window, click **Create** and provide information for the following fields:   
    * **Volume name**      
        Specify the name for the volume that you are creating.   

        A volume name must be unique within each capacity pool. It must be at least three characters long. You can use any alphanumeric characters.

    * **Capacity pool**  
        Specify the capacity pool where you want the volume to be created.

    * **Quota**  
        Specify the amount of logical storage that is allocated to the volume.  

        The **Available quota** field shows the amount of unused space in the chosen capacity pool that you can use towards creating a new volume. The size of the new volume must not exceed the available quota.  

    * **Virtual network**  
        Specify the Azure virtual network (Vnet) from which you want to access the volume.  

        The Vnet you specify must have a subnet delegated to Azure NetApp Files. The Azure NetApp Files service can be accessed only from the same Vnet or from a Vnet that is in the same region as the volume through Vnet peering. You can also access the volume from  your on-premises network through Express Route.   

    * **Subnet**  
        Specify the subnet that you want to use for the volume.  
        The subnet you specify must be delegated to Azure NetApp Files. 
        
        If you have not delegated a subnet, you can click **Create new** on the Create a Volume page. Then in the Create Subnet page, specify the subnet information, and select **Microsoft.NetApp/volumes** to delegate the subnet for Azure NetApp Files. In each Vnet, only one subnet can be delegated to Azure NetApp Files.   
 
        ![Create a volume](../media/azure-netapp-files/azure-netapp-files-new-volume.png)
    
        ![Create subnet](../media/azure-netapp-files/azure-netapp-files-create-subnet.png)

4. Click **Protocol** and complete the following information:  
    * Select **SMB** as the protocol type for the volume. 
    * Select your **Active Directory** connection from the drop-down list.
    * Specify the name of the shared volume in  **Share name**.

    ![Specify SMB protocol](../media/azure-netapp-files/azure-netapp-files-protocol-smb.png)

5. Click **Review + Create** to review the volume details.  Then click **Create** to create the SMB volume.

    The volume you created appears in the Volumes page. 
 
    A volume inherits subscription, resource group, location attributes from its capacity pool. To monitor the volume deployment status, you can use the Notifications tab.

## Next steps  

* [Mount or unmount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Learn about virtual network integration for Azure services](https://docs.microsoft.com/azure/virtual-network/virtual-network-for-azure-services)
