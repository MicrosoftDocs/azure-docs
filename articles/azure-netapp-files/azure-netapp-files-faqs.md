---
title: FAQs About Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions about Azure NetApp Files.
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
ms.date: 01/03/2020
ms.author: b-juche
---
# FAQs About Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files. 

## Networking FAQs

### Does the NFS data path go over the Internet?  

No. The NFS data path does not go over the Internet. Azure NetApp Files is an Azure native service that is deployed into the Azure Virtual Network (VNet) where the service is available. Azure NetApp Files uses a delegated subnet and provisions a network interface directly on the VNet. 

See [Guidelines for Azure NetApp Files network planning](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-network-topologies) for details.  

### Can I connect a VNet that I already created to the Azure NetApp Files service?

Yes, you can connect VNets that you created to the service. 

See [Guidelines for Azure NetApp Files network planning](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-network-topologies) for details.  

### Can I mount an NFS volume of Azure NetApp Files using DNS FQDN name?

Yes, you can, if you create the required DNS entries. Azure NetApp Files supplies the service IP for the provisioned volume. 

> [!NOTE] 
> Azure NetApp Files can deploy additional IPs for the service as needed.  DNS entries may need to be updated periodically.

## Security FAQs

### Can the network traffic between the Azure VM and the storage be encrypted?

Data traffic (traffic from the NFSv3, NFSv4.1, or SMBv3 client to Azure NetApp Files volumes) is not encrypted. However, the traffic from an Azure VM (running an NFS or SMB client) to Azure NetApp Files is as secure as any other Azure-VM-to-VM traffic. This traffic is local to the Azure data-center network. 

### Can the storage be encrypted at rest?

All Azure NetApp Files volumes are encrypted using the FIPS 140-2 standard. All keys are managed by the Azure NetApp Files service. 

### How are encryption keys managed? 

Key management for Azure NetApp Files is handled by the service. A unique XTS-AES-256 data encryption key is generated for each volume. An encryption key hierarchy is used to encrypt and protect all volume keys. These encryption keys are never displayed or reported in an unencrypted format. Encryption keys are deleted immediately when a volume is deleted.

Currently, user-managed keys (Bring Your Own Keys) are not supported.

### Can I configure the NFS export policy rules to control access to the Azure NetApp Files service mount target?


Yes, you can configure up to five rules in a single NFS export policy.

### Does Azure NetApp Files support Network Security Groups?

No, currently you cannot apply Network Security Groups to the delegated subnet of Azure NetApp Files or the network interfaces created by the service.

### Can I use Azure IAM with Azure NetApp Files?

Yes, Azure NetApp Files supports RBAC features with Azure IAM.

## Performance FAQs

### What should I do to optimize or tune Azure NetApp Files performance?

You can take the following actions per the performance requirements: 
- Ensure that the Virtual Machine is sized appropriately.
- Enable Accelerated Networking for the VM.
- Select the desired service level and size for the capacity pool.
- Create a volume with the desired quota size for the capacity and performance.

### How do I convert throughput-based service levels of Azure NetApp Files to IOPS?

You can convert MB/s to IOPS by using the following formula:  

`IOPS = (MBps Throughput / KB per IO) * 1024`

### How do I change the service level of a volume?

Changing the service level of a volume is not currently supported.

### How do I monitor Azure NetApp Files performance?

Azure NetApp Files provides volume performance metrics. You can also use Azure Monitor for monitoring usage metrics for Azure NetApp Files.  See [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md) for the list of performance metrics for Azure NetApp Files.

## NFS FAQs

### I want to have a volume mounted automatically when an Azure VM is started or rebooted.  How do I configure my host for persistent NFS volumes?

For an NFS volume to automatically mount at VM start or reboot, add an entry to the `/etc/fstab` file on the host. 

See [Mount or unmount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) for details.  

### Why does the DF command on NFS client not show the provisioned volume size?

The volume size reported in DF is the maximum size the Azure NetApp Files volume can grow to. The size of the Azure NetApp Files volume in DF command is not reflective of the quota or size of the volume.  You can get the Azure NetApp Files volume size or quota through the Azure portal or the API.

### What NFS version does Azure NetApp Files support?

Azure NetApp Files supports NFSv3 and NFSv4.1. You can create a volume using either NFS version. 

> [!IMPORTANT] 
> Access to the NFSv4.1 feature requires whitelisting.  To request whitelisting, submit a request to <anffeedback@microsoft.com>. 


### How do I enable root squashing?

Root squashing is currently not supported.

## SMB FAQs

### Is an Active Directory connection required for SMB access? 

Yes, you must create an Active Directory connection before deploying an SMB volume. The specified Domain Controllers must be accessible by the delegated subnet of Azure NetApp Files for a successful connection.  See [Create an SMB volume](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-volumes-smb) for details. 

### How many Active Directory connections are supported?

Azure NetApp Files currently supports only one Active Directory connection per NetApp account, per subscription, and in each region; the connection is not shared across NetApp accounts.

### Does Azure NetApp Files support Azure Active Directory? 

Both [Azure Active Directory (AD) Domain Services](https://docs.microsoft.com/azure/active-directory-domain-services/overview) and [Active Directory Domain Services (AD DS)](https://docs.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) are supported. You can use existing Active Directory domain controllers with Azure NetApp Files. Domain controllers can reside in Azure as virtual machines, or on premises via ExpressRoute or S2S VPN. Azure NetApp Files does not support AD join for [Azure Active Directory](https://azure.microsoft.com/resources/videos/azure-active-directory-overview/) at this time.

If you are using Azure NetApp Files with Azure Active Directory Domain Services, the organizational unit path is `OU=AADDC Computers` when you configure Active Directory for your NetApp account.

### What versions of Windows Server Active Directory are supported?

Azure NetApp Files supports Windows Server 2008r2SP1-2019 versions of Active Directory Domain Services.

### Why does the available space on my SMB client not show the provisioned size?

The volume size reported by the SMB client is the maximum size the Azure NetApp Files volume can grow to. The size of the Azure NetApp Files volume as shown on the SMB client is not reflective of the quota or size of the volume. You can get the Azure NetApp Files volume size or quota through the Azure portal or the API.

## Capacity management FAQs

### How do I monitor usage for capacity pool and volume of Azure NetApp Files? 

Azure NetApp Files provides capacity pool and volume usage metrics. You can also use Azure Monitor to monitor usage for Azure NetApp Files. See [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md) for details. 

### Can I manage Azure NetApp Files through Azure Storage Explorer?

No. Azure NetApp Files is not supported by Azure Storage Explorer.

## Data migration and protection FAQs

### How do I migrate data to Azure NetApp Files?
Azure NetApp Files provides NFS and SMB volumes.  You can use any file-based copy tool to migrate data to the service. 

NetApp offers a SaaS-based solution, [NetApp Cloud Sync](https://cloud.netapp.com/cloud-sync-service).  The solution enables you to replicate NFS or SMB data to Azure NetApp Files NFS exports or SMB shares. 

You can also use a wide array of free tools to copy data. For NFS, you can use workloads tools such as [rsync](https://rsync.samba.org/examples.html) to copy and synchronize source data into an Azure NetApp Files volume. For SMB, you can use workloads [robocopy](https://docs.microsoft.com/windows-server/administration/windows-commands/robocopy) in the same manner.  These tools can also replicate file or folder permissions. 

The requirements for data migration from on premises to Azure NetApp Files are as follows: 

- Ensure Azure NetApp Files is available in the target Azure region.
- Validate network connectivity between the source and the Azure NetApp Files target volume IP address. Data transfer between on premises and the Azure NetApp Files service is supported over ExpressRoute.
- Create the target Azure NetApp Files volume.
- Transfer the source data to the target volume by using your preferred file copy tool.

### How do I create a copy of an Azure NetApp Files volume in another Azure region?
	
Azure NetApp Files provides NFS and SMB volumes.  Any file based-copy tool can be used to replicate data between Azure regions. 

NetApp offers a SaaS based solution, [NetApp Cloud Sync](https://cloud.netapp.com/cloud-sync-service).  The solution enables you to replicate NFS or SMB data to Azure NetApp Files NFS exports or SMB shares. 

You can also use a wide array of free tools to copy data. For NFS, you can use workloads tools such as [rsync](https://rsync.samba.org/examples.html) to copy and synchronize source data into an Azure NetApp Files volume. For SMB, you can use workloads [robocopy](https://docs.microsoft.com/windows-server/administration/windows-commands/robocopy) in the same manner.  These tools can also replicate file or folder permissions. 

The requirements for replicating an Azure NetApp Files volume to another Azure region are as follows: 
- Ensure Azure NetApp Files is available in the target Azure region.
- Validate network connectivity between VNets in each region. Currently, global peering between VNets is not supported.  You can establish connectivity between VNets by linking with an ExpressRoute circuit or using a S2S VPN connection. 
- Create the target Azure NetApp Files volume.
- Transfer the source data to the target volume by using your preferred file copy tool.

### Is migration with Azure Data Box supported?

No. Azure Data Box does not support Azure NetApp Files currently. 

### Is migration with Azure Import/Export service supported?

No. Azure Import/Export service does not support Azure NetApp Files currently.

## Next steps  

- [Microsoft Azure ExpressRoute FAQs](https://docs.microsoft.com/azure/expressroute/expressroute-faqs)
- [Microsoft Azure Virtual Network FAQ](https://docs.microsoft.com/azure/virtual-network/virtual-networks-faq)
- [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request)
- [Azure Data Box](https://docs.microsoft.com/azure/databox-family/)
- [FAQs about SMB performance for Azure NetApp Files](azure-netapp-files-smb-performance.md)