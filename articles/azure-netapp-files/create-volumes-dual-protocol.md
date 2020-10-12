---
title: Create a dual-protocol (NFSv3 and SMB) volume for Azure NetApp Files | Microsoft Docs
description: Describes how to create a volume that uses the dual protocol of NFSv3 and SMB with support for LDAP user mapping.
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
ms.topic: how-to
ms.date: 10/05/2020
ms.author: b-juche
---
# Create a dual-protocol (NFSv3 and SMB) volume for Azure NetApp Files

Azure NetApp Files supports creating volumes using NFS (NFSv3 and NFSv4.1), SMBv3, or dual protocol. This article shows you how to create a volume that uses the dual protocol of NFSv3 and SMB with support for LDAP user mapping.  


## Before you begin 

* You must have already set up a capacity pool.  
    See [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md).   
* A subnet must be delegated to Azure NetApp Files.  
    See [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md).

## Considerations

* Ensure that you meet the [Requirements for Active Directory connections](azure-netapp-files-create-volumes-smb.md#requirements-for-active-directory-connections). 
* Create a reverse lookup zone on the DNS server and then add a pointer (PTR) record of the AD host machine in that reverse lookup zone. Otherwise, the dual-protocol volume creation will fail.
* Ensure that the NFS client is up to date and running the latest updates for the operating system.
* Ensure that the Active Directory (AD) LDAP server is up and running on the AD. This is done by installing and configuring the [Active Directory Lightweight Directory Services (AD LDS)](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/hh831593(v=ws.11)) role on the AD machine.
* Ensure that a certificate authority (CA)  is created on the AD using the [Active Directory Certificate Services (AD CS)](/windows-server/networking/core-network-guide/cncg/server-certs/install-the-certification-authority) role to generate and export the self-signed root CA certificate.   
* Dual-protocol volumes do not currently support Azure Active Directory Domain Services (AADDS).  

## Create a dual-protocol volume

1.	Click the **Volumes** blade from the Capacity Pools blade. Click **+ Add volume** to create a volume. 

    ![Navigate to Volumes](../media/azure-netapp-files/azure-netapp-files-navigate-to-volumes.png) 

2.	In the Create a Volume window, click **Create**, and provide information for the following fields under the Basics tab:   
    * **Volume name**      
        Specify the name for the volume that you are creating.   

        A volume name must be unique within each capacity pool. It must be at least three characters long. You can use any alphanumeric characters.   

        You cannot use `default` or `bin` as the volume name.

    * **Capacity pool**  
        Specify the capacity pool where you want the volume to be created.

    * **Quota**  
        Specify the amount of logical storage that is allocated to the volume.  

        The **Available quota** field shows the amount of unused space in the chosen capacity pool that you can use towards creating a new volume. The size of the new volume must not exceed the available quota.  

    * **Throughput (MiB/S)**   
        If the volume is created in a manual QoS capacity pool, specify the throughput you want for the volume.   

        If the volume is created in an auto QoS capacity pool, the value displayed in this field is (quota x service level throughput).   

    * **Virtual network**  
        Specify the Azure virtual network (VNet) from which you want to access the volume.  

        The Vnet you specify must have a subnet delegated to Azure NetApp Files. The Azure NetApp Files service can be accessed only from the same Vnet or from a Vnet that is in the same region as the volume through Vnet peering. You can also access the volume from  your on-premises network through Express Route.   

    * **Subnet**  
        Specify the subnet that you want to use for the volume.  
        The subnet you specify must be delegated to Azure NetApp Files. 
        
        If you have not delegated a subnet, you can click **Create new** on the Create a Volume page. Then in the Create Subnet page, specify the subnet information, and select **Microsoft.NetApp/volumes** to delegate the subnet for Azure NetApp Files. In each Vnet, only one subnet can be delegated to Azure NetApp Files.   
 
        ![Create a volume](../media/azure-netapp-files/azure-netapp-files-new-volume.png)
    
        ![Create subnet](../media/azure-netapp-files/azure-netapp-files-create-subnet.png)

    * If you want to apply an existing snapshot policy to the volume, click **Show advanced section** to expand it, specify whether you want to hide the snapshot path, and select a snapshot policy in the pull-down menu. 

        For information about creating a snapshot policy, see [Manage snapshot policies](azure-netapp-files-manage-snapshots.md#manage-snapshot-policies).

        ![Show advanced selection](../media/azure-netapp-files/volume-create-advanced-selection.png)

3. Click **Protocol**, and then complete the following actions:  
    * Select **dual-protocol (NFSv3 and SMB)** as the protocol type for the volume.   

    * Select the **Active Directory** connection from the drop-down list.  
    The Active Directory you use must have a server root CA certificate. 

    * Specify the **Volume path** for the volume.   
    This volume path is the name of the shared volume. The name must start with an alphabetical character, and it must be unique within each subscription and each region.  

    * Specify the **Security Style** to use: NTFS (default) or UNIX.

    * Optionally, [configure export policy for the volume](azure-netapp-files-configure-export-policy.md).

    ![Specify dual-protocol](../media/azure-netapp-files/create-volume-protocol-dual.png)

4. Click **Review + Create** to review the volume details. Then click **Create** to create the volume.

    The volume you created appears in the Volumes page. 
 
    A volume inherits subscription, resource group, location attributes from its capacity pool. To monitor the volume deployment status, you can use the Notifications tab.

## Upload Active Directory Certificate Authority public root certificate  

1.	Follow [Install the Certification Authority](/windows-server/networking/core-network-guide/cncg/server-certs/install-the-certification-authority) to install and configure ADDS Certificate Authority. 

2.	Follow [View certificates with the MMC snap-in](/dotnet/framework/wcf/feature-details/how-to-view-certificates-with-the-mmc-snap-in) to use the MMC snap-in and the Certificate Manager tool.  
    Use the Certificate Manager snap-in to locate the root or issuing certificate for the local device. You should run the Certificate Management snap-in commands from one of the following settings:  
    * A Windows-based client that has joined the domain and has the root certificate installed 
    * Another machine in the domain containing the root certificate  

3. Export the root certificate.  
    Ensure that the certificate is exported in the Base-64 encoded X.509 (.CER) format: 

    ![Certificate Export Wizard](../media/azure-netapp-files/certificate-export-wizard.png)

4. Go to the NetApp account of the dual-protocol volume, click **Active Directory connections**, and upload the root CA certificate by using the **Join Active Directory** window:  

    ![Server root CA certificate](../media/azure-netapp-files/server-root-ca-certificate.png)

    Ensure that the certificate authority name can be resolved by DNS. This name is the "Issued By" or "Issuer" field on the certificate:  

    ![Certificate information](../media/azure-netapp-files/certificate-information.png)

## Manage LDAP POSIX Attributes

You can manage POSIX attributes such as UID, Home Directory, and other values by using the Active Directory Users and Computers MMC snap-in.  The following example shows the Active Directory Attribute Editor:  

![Active Directory Attribute Editor](../media/azure-netapp-files/active-directory-attribute-editor.png) 

You need to set the following attributes for LDAP users and LDAP groups: 
* Required attributes for LDAP users:   
    `uid`: Alice, `uidNumber`: 139, `gidNumber`: 555, `objectClass`: posixAccount
* Required attributes for LDAP groups:   
    `objectClass`: "posixGroup", `gidNumber`: 555

## Configure the NFS client 

Follow instructions in [Configure an NFS client for Azure NetApp Files](configure-nfs-clients.md) to configure the NFS client.  

## Next steps  

* [Dual-protocol FAQs](azure-netapp-files-faqs.md#dual-protocol-faqs)
* [Configure an NFS client for Azure NetApp Files](configure-nfs-clients.md)