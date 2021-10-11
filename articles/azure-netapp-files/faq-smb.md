---
title: SMB FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about the SMB protocol of Azure NetApp Files.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-juche
ms.author: b-juche
ms.date: 10/11/2021
---
# SMB FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about the SMB protocol of Azure NetApp Files.

## Which SMB versions are supported by Azure NetApp Files?

Azure NetApp Files supports SMB 2.1 and SMB 3.1 (which includes support for SMB 3.0). 

## Is an Active Directory connection required for SMB access? 

Yes, you must create an Active Directory connection before deploying an SMB volume. The specified Domain Controllers must be accessible by the delegated subnet of Azure NetApp Files for a successful connection.  See [Create an SMB volume](./azure-netapp-files-create-volumes-smb.md) for details. 

## How many Active Directory connections are supported?

You can configure only one Active Directory (AD) connection per subscription and per region. See [Requirements for Active Directory connections](create-active-directory-connections.md#requirements-for-active-directory-connections) for additional information. 

However, you can map multiple NetApp accounts that are under the same subscription and same region to a common AD server created in one of the NetApp accounts. See [Map multiple NetApp accounts in the same subscription and region to an AD connection](create-active-directory-connections.md#shared_ad). 

## Does Azure NetApp Files support Azure Active Directory? 

Both [Azure Active Directory (AD) Domain Services](../active-directory-domain-services/overview.md) and [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) are supported. You can use existing Active Directory domain controllers with Azure NetApp Files. Domain controllers can reside in Azure as virtual machines, or on premises via ExpressRoute or S2S VPN. Azure NetApp Files does not support AD join for [Azure Active Directory](https://azure.microsoft.com/resources/videos/azure-active-directory-overview/) at this time.

If you are using Azure NetApp Files with Azure Active Directory Domain Services, the organizational unit path is `OU=AADDC Computers` when you configure Active Directory for your NetApp account.

## What versions of Windows Server Active Directory are supported?

Azure NetApp Files supports Windows Server 2008r2SP1-2019 versions of Active Directory Domain Services.

## I’m having issues connecting to my SMB share. What should I do?

As a best practice, set the maximum tolerance for computer clock synchronization to five minutes. For more information, see [Maximum tolerance for computer clock synchronization](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852172(v=ws.11)). 

## Can I manage `SMB Shares`, `Sessions`, and `Open Files` through Computer Management Console (MMC)?

Management of `SMB Shares`, `Sessions`, and `Open Files` through Computer Management Console (MMC) is currently not supported.

## How can I obtain the IP address of an SMB volume via the portal?

Use the **JSON View** link on the volume overview pane, and look for the **startIp** identifier under **properties** -> **mountTargets**.

## Can an Azure NetApp Files SMB share act as an DFS Namespace (DFS-N) root?

No. However, Azure NetApp Files SMB shares can serve as a DFS Namespace (DFS-N) folder target.   
To use an Azure NetApp Files SMB share as a DFS-N folder target, provide the Universal Naming Convention (UNC) mount path of the Azure NetApp Files SMB share by using the [DFS Add Folder Target](/windows-server/storage/dfs-namespaces/add-folder-targets#to-add-a-folder-target) procedure.  

## Can the SMB share permissions be changed?   

No, the share permissions cannot be changed. However, the NTFS permissions of the `root` volume can be changed using the [NTFS file and folder permissions](azure-netapp-files-create-volumes-smb.md#ntfs-file-and-folder-permissions) procedure. 


## Next steps  

- [FAQs about SMB performance for Azure NetApp Files](azure-netapp-files-smb-performance.md)
- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Product FAQs](faq-product.md)
