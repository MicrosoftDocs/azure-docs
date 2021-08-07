---
title: FAQs About Azure NetApp Files | Microsoft Docs
description: Review frequently asked questions about Azure NetApp Files, such as networking, security, performance, capacity management, and data migration/protection.
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
ms.date: 07/27/2021
ms.author: b-juche
---
# FAQs About Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files. 

## Networking FAQs

### Does the data path for NFS or SMB go over the Internet?  

No. The data path for NFS or SMB does not go over the Internet. Azure NetApp Files is an Azure native service that is deployed into the Azure Virtual Network (VNet) where the service is available. Azure NetApp Files uses a delegated subnet and provisions a network interface directly on the VNet. 

See [Guidelines for Azure NetApp Files network planning](./azure-netapp-files-network-topologies.md) for details.  

### Can I connect a VNet that I already created to the Azure NetApp Files service?

Yes, you can connect VNets that you created to the service. 

See [Guidelines for Azure NetApp Files network planning](./azure-netapp-files-network-topologies.md) for details.  

### Can I mount an NFS volume of Azure NetApp Files using DNS FQDN name?

Yes, you can, if you create the required DNS entries. Azure NetApp Files supplies the service IP for the provisioned volume. 

> [!NOTE] 
> Azure NetApp Files can deploy additional IPs for the service as needed.  DNS entries may need to be updated periodically.

### Can I set or select my own IP address for an Azure NetApp Files volume?  

No. IP assignment to Azure NetApp Files volumes is dynamic. Static IP assignment is not supported. 

### Does Azure NetApp Files support dual stack (IPv4 and IPv6) VNet?

No, Azure NetApp Files does not currently support dual stack (IPv4 and IPv6) VNet.  
 
## Security FAQs

### Can the network traffic between the Azure VM and the storage be encrypted?

Azure NetApp Files data traffic is inherently secure by design, as it does not provide a public endpoint and data traffic stays within customer-owned VNet. Data-in-flight is not encrypted by default. However, data traffic from an Azure VM (running an NFS or SMB client) to Azure NetApp Files is as secure as any other Azure-VM-to-VM traffic. 

NFSv3 protocol does not provide support for encryption, so this data-in-flight cannot be encrypted. However, NFSv4.1 and SMB3 data-in-flight encryption can optionally be enabled. Data traffic between NFSv4.1 clients and Azure NetApp Files volumes can be encrypted using Kerberos with AES-256 encryption. See [Configure NFSv4.1 Kerberos encryption for Azure NetApp Files](configure-kerberos-encryption.md) for details. Data traffic between SMB3 clients and Azure NetApp Files volumes can be encrypted using the AES-CCM algorithm on SMB 3.0, and the AES-GCM algorithm on SMB 3.1.1 connections. See [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md) for details. 

### Can the storage be encrypted at rest?

All Azure NetApp Files volumes are encrypted using the FIPS 140-2 standard. All keys are managed by the Azure NetApp Files service. 

### Is Azure NetApp Files cross-region replication traffic encrypted?

Azure NetApp Files cross-region replication uses TLS 1.2 AES-256 GCM encryption to encrypt all data transferred between the source volume and destination volume. This encryption is in addition to the [Azure MACSec encryption](../security/fundamentals/encryption-overview.md) that is on by default for all Azure traffic, including Azure NetApp Files cross-region replication. 

### How are encryption keys managed? 

Key management for Azure NetApp Files is handled by the service. A unique XTS-AES-256 data encryption key is generated for each volume. An encryption key hierarchy is used to encrypt and protect all volume keys. These encryption keys are never displayed or reported in an unencrypted format. Encryption keys are deleted immediately when a volume is deleted.

Support for customer-managed keys (Bring Your Own Key) using Azure Dedicated HSM is available on a controlled basis in the East US, South Central US, West US 2, and US Gov Virginia regions. You can request access at [anffeedback@microsoft.com](mailto:anffeedback@microsoft.com). As capacity becomes available, requests will be approved.

### Can I configure the NFS export policy rules to control access to the Azure NetApp Files service mount target?

Yes, you can configure up to five rules in a single NFS export policy.

### Does Azure NetApp Files support Network Security Groups?

No, currently you cannot apply Network Security Groups to the delegated subnet of Azure NetApp Files or the network interfaces created by the service.

### Can I use Azure RBAC with Azure NetApp Files?

Yes, Azure NetApp Files supports Azure RBAC features. Along with the built-in Azure roles, you can [create custom roles](../role-based-access-control/custom-roles.md) for Azure NetApp Files. 

For the complete list of Azure NetApp Files permissions, see Azure resource provider operations for [`Microsoft.NetApp`](../role-based-access-control/resource-provider-operations.md#microsoftnetapp).

### Are Azure Activity Logs supported on Azure NetApp Files?

Azure NetApp Files is an Azure native service. All PUT, POST, and DELETE APIs against Azure NetApp Files are logged. For example, the logs show activities such as who created the snapshot, who modified the volume, and so on.

For the complete list of API operations, see [Azure NetApp Files REST API](/rest/api/netapp/).

### Can I use Azure policies with Azure NetApp Files?

Yes, you can create [custom Azure policies](../governance/policy/tutorials/create-custom-policy-definition.md). 

However, you cannot create Azure policies (custom naming policies) on the Azure NetApp Files interface. See [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md#considerations).

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

You can change the service level of an existing volume by moving the volume to another capacity pool that uses the [service level](azure-netapp-files-service-levels.md) you want for the volume. See [Dynamically change the service level of a volume](dynamic-change-volume-service-level.md). 

### How do I monitor Azure NetApp Files performance?

Azure NetApp Files provides volume performance metrics. You can also use Azure Monitor for monitoring usage metrics for Azure NetApp Files.  See [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md) for the list of performance metrics for Azure NetApp Files.

### What’s the performance impact of Kerberos on NFSv4.1?

See [Performance impact of Kerberos on NFSv4.1 volumes](performance-impact-kerberos.md) for information about security options for NFSv4.1, the performance vectors tested, and the expected performance impact. 

### Does Azure NetApp Files support SMB Direct?

No, Azure NetApp Files does not support SMB Direct. 

### Is NIC Teaming supported in Azure?

NIC Teaming is not supported in Azure. Although multiple network interfaces are supported on Azure virtual machines, they represent a logical rather than a physical construct. As such, they provide no fault tolerance.  Also, the bandwidth available to an Azure virtual machine is calculated for the machine itself and not any individual network interface.

### Are jumbo frames supported?

Jumbo frames are not supported with Azure virtual machines.

## NFS FAQs

### I want to have a volume mounted automatically when an Azure VM is started or rebooted.  How do I configure my host for persistent NFS volumes?

For an NFS volume to automatically mount at VM start or reboot, add an entry to the `/etc/fstab` file on the host. 

See [Mount or unmount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) for details.  

### What NFS version does Azure NetApp Files support?

Azure NetApp Files supports NFSv3 and NFSv4.1. You can [create a volume](azure-netapp-files-create-volumes.md) using either NFS version. 

### How do I enable root squashing?

You can specify whether the root account can access the volume or not by using the volume’s export policy. See [Configure export policy for an NFS volume](azure-netapp-files-configure-export-policy.md) for details.

### Can I use the same file path (volume creation token) for multiple volumes?

Yes, you can. However, the file path must be used in either a different subscription or a different region.   

For example, you create a volume called `vol1`. And then you create another volume also called `vol1` in a different capacity pool but in the same subscription and region. In this case, using the same volume name `vol1` will cause an error. To use the same file path, the name must be in a different region or subscription.

### When I try to access NFS volumes through a Windows client, why does the client take a long time to search folders and subfolders?

Make sure that `CaseSensitiveLookup` is enabled on the Windows client to speed up the look-up of folders and subfolders:

1. Use the following PowerShell command to enable CaseSensitiveLookup:   
	`Set-NfsClientConfiguration -CaseSensitiveLookup 1`    
2. Mount the volume on the Windows server.   
	Example:   
	`Mount -o rsize=1024 -o wsize=1024 -o mtype=hard \\10.x.x.x\testvol X:*`

### How does Azure NetApp Files support NFSv4.1 file-locking? 

For NFSv4.1 clients, Azure NetApp Files supports the NFSv4.1 file-locking mechanism that maintains the state of all file locks under a lease-based model. 

Per RFC 3530, Azure NetApp Files defines a single lease period for all state held by an NFS client. If the client does not renew its lease within the defined period, all states associated with the client's lease will be released by the server.  

For example, if a client mounting a volume becomes unresponsive or crashes beyond the timeouts, the locks will be released. The client can renew its lease explicitly or implicitly by performing operations such as reading a file.   

A grace period defines a period of special processing in which clients can try to reclaim their locking state during a server recovery. The default timeout for the leases is 30 seconds with a grace period of 45 seconds. After that time, the client's lease will be released.   

## SMB FAQs

### Which SMB versions are supported by Azure NetApp Files?

Azure NetApp Files supports SMB 2.1 and SMB 3.1 (which includes support for SMB 3.0).    

### Is an Active Directory connection required for SMB access? 

Yes, you must create an Active Directory connection before deploying an SMB volume. The specified Domain Controllers must be accessible by the delegated subnet of Azure NetApp Files for a successful connection.  See [Create an SMB volume](./azure-netapp-files-create-volumes-smb.md) for details. 

### How many Active Directory connections are supported?

You can configure only one Active Directory (AD) connection per subscription and per region. See [Requirements for Active Directory connections](create-active-directory-connections.md#requirements-for-active-directory-connections) for additional information. 

However, you can map multiple NetApp accounts that are under the same subscription and same region to a common AD server created in one of the NetApp accounts. See [Map multiple NetApp accounts in the same subscription and region to an AD connection](create-active-directory-connections.md#shared_ad). 

### Does Azure NetApp Files support Azure Active Directory? 

Both [Azure Active Directory (AD) Domain Services](../active-directory-domain-services/overview.md) and [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) are supported. You can use existing Active Directory domain controllers with Azure NetApp Files. Domain controllers can reside in Azure as virtual machines, or on premises via ExpressRoute or S2S VPN. Azure NetApp Files does not support AD join for [Azure Active Directory](https://azure.microsoft.com/resources/videos/azure-active-directory-overview/) at this time.

If you are using Azure NetApp Files with Azure Active Directory Domain Services, the organizational unit path is `OU=AADDC Computers` when you configure Active Directory for your NetApp account.

### What versions of Windows Server Active Directory are supported?

Azure NetApp Files supports Windows Server 2008r2SP1-2019 versions of Active Directory Domain Services.

### I’m having issues connecting to my SMB share. What should I do?

As a best practice, set the maximum tolerance for computer clock synchronization to five minutes. For more information, see [Maximum tolerance for computer clock synchronization](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852172(v=ws.11)). 

### Can I manage `SMB Shares`, `Sessions`, and `Open Files` through Computer Management Console (MMC)?

Management of `SMB Shares`, `Sessions`, and `Open Files` through Computer Management Console (MMC) is currently not supported.

### How can I obtain the IP address of an SMB volume via the portal?

Use the **JSON View** link on the volume overview pane, and look for the **startIp** identifier under **properties** -> **mountTargets**.

### Can an Azure NetApp Files SMB share act as an DFS Namespace (DFS-N) root?

No. However, Azure NetApp Files SMB shares can serve as a DFS Namespace (DFS-N) folder target.   
To use an Azure NetApp Files SMB share as a DFS-N folder target, provide the Universal Naming Convention (UNC) mount path of the Azure NetApp Files SMB share by using the [DFS Add Folder Target](/windows-server/storage/dfs-namespaces/add-folder-targets#to-add-a-folder-target) procedure.  

## Capacity management FAQs

### How do I monitor usage for capacity pool and volume of Azure NetApp Files? 

Azure NetApp Files provides capacity pool and volume usage metrics. You can also use Azure Monitor to monitor usage for Azure NetApp Files. See [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md) for details. 

### How do I determine if a directory is approaching the limit size?

You can use the `stat` command from a client to see whether a directory is approaching the [maximum size limit](azure-netapp-files-resource-limits.md#resource-limits) for directory metadata (320 MB).
See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#directory-limit) for the limit and calculation. 

<!-- 
You can use the `stat` command from a client to see whether a directory is approaching the maximum size limit for directory metadata (320 MB).   

For a 320-MB directory, the number of blocks is 655360, with each block size being 512 bytes.  (That is, 320x1024x1024/512.)  This number translates to approximately 4 million files maximum for a 320-MB directory. However, the actual number of maximum files might be lower, depending on factors such as the number of files containing non-ASCII characters in the directory. As such, you should use the `stat` command as follows to determine whether your directory is approaching its limit.  

Examples:

```console
[makam@cycrh6rtp07 ~]$ stat bin
File: 'bin'
Size: 4096            Blocks: 8          IO Block: 65536  directory

[makam@cycrh6rtp07 ~]$ stat tmp
File: 'tmp'
Size: 12288           Blocks: 24         IO Block: 65536  directory
 
[makam@cycrh6rtp07 ~]$ stat tmp1
File: 'tmp1'
Size: 4096            Blocks: 8          IO Block: 65536  directory
```
--> 

### Does snapshot space count towards the usable / provisioned capacity of a volume?

Yes, the [consumed snapshot capacity](azure-netapp-files-cost-model.md#capacity-consumption-of-snapshots) counts towards the provisioned space in the volume. In case the volume runs full, consider taking the following actions:

* [Resize the volume](azure-netapp-files-resize-capacity-pools-or-volumes.md).
* [Remove older snapshots](azure-netapp-files-manage-snapshots.md#delete-snapshots) to free up space in the hosting volume. 

### Does Azure NetApp Files support auto-grow for volumes or capacity pools?

No, Azure NetApp Files volumes and capacity pool do not auto-grow upon filling up. See [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md).   

You can use the community supported [Logic Apps ANFCapacityManager tool](https://github.com/ANFTechTeam/ANFCapacityManager) to manage capacity-based alert rules. The tool can automatically increase volume sizes to prevent your volumes from running out of space.

### Does the destination volume of a replication count towards hard volume quota?  

No, the destination volume of a replication does not count towards hard volume quota.

### Can I manage Azure NetApp Files through Azure Storage Explorer?

No. Azure NetApp Files is not supported by Azure Storage Explorer.

## Data migration and protection FAQs

### How do I migrate data to Azure NetApp Files?
Azure NetApp Files provides NFS and SMB volumes.  You can use any file-based copy tool to migrate data to the service. 

NetApp offers a SaaS-based solution, [NetApp Cloud Sync](https://cloud.netapp.com/cloud-sync-service).  The solution enables you to replicate NFS or SMB data to Azure NetApp Files NFS exports or SMB shares. 

You can also use a wide array of free tools to copy data. For NFS, you can use workloads tools such as [rsync](https://rsync.samba.org/examples.html) to copy and synchronize source data into an Azure NetApp Files volume. For SMB, you can use workloads [robocopy](/windows-server/administration/windows-commands/robocopy) in the same manner.  These tools can also replicate file or folder permissions. 

The requirements for data migration from on premises to Azure NetApp Files are as follows: 

- Ensure Azure NetApp Files is available in the target Azure region.
- Validate network connectivity between the source and the Azure NetApp Files target volume IP address. Data transfer between on premises and the Azure NetApp Files service is supported over ExpressRoute.
- Create the target Azure NetApp Files volume.
- Transfer the source data to the target volume by using your preferred file copy tool.

### Where does Azure NetApp Files store customer data?   

By default, your data stays within the region where you deploy your Azure NetApp Files volumes. However, you can choose to replicate your data on a volume-by-volume basis to available destination regions using [cross-region replication](cross-region-replication-introduction.md).

### How do I create a copy of an Azure NetApp Files volume in another Azure region?
	
Azure NetApp Files provides NFS and SMB volumes.  Any file based-copy tool can be used to replicate data between Azure regions. 

The [cross-region replication](cross-region-replication-introduction.md) functionality enables you to asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region.  Additionally, you can [create a new volume by using a snapshot of an existing volume](azure-netapp-files-manage-snapshots.md#restore-a-snapshot-to-a-new-volume).

NetApp offers a SaaS based solution, [NetApp Cloud Sync](https://cloud.netapp.com/cloud-sync-service).  The solution enables you to replicate NFS or SMB data to Azure NetApp Files NFS exports or SMB shares. 

You can also use a wide array of free tools to copy data. For NFS, you can use workloads tools such as [rsync](https://rsync.samba.org/examples.html) to copy and synchronize source data into an Azure NetApp Files volume. For SMB, you can use workloads [robocopy](/windows-server/administration/windows-commands/robocopy) in the same manner.  These tools can also replicate file or folder permissions. 

The requirements for replicating an Azure NetApp Files volume to another Azure region are as follows: 
- Ensure Azure NetApp Files is available in the target Azure region.
- Validate network connectivity between VNets in each region. Currently, global peering between VNets is not supported.  You can establish connectivity between VNets by linking with an ExpressRoute circuit or using a S2S VPN connection. 
- Create the target Azure NetApp Files volume.
- Transfer the source data to the target volume by using your preferred file copy tool.

### Is migration with Azure Data Box supported?

No. Azure Data Box does not support Azure NetApp Files currently. 

### Is migration with Azure Import/Export service supported?

No. Azure Import/Export service does not support Azure NetApp Files currently.

## Azure NetApp Files backup FAQs

This section answers questions about the [Azure NetApp Files backup](backup-introduction.md) feature. 

### When do my backups occur?   

Azure NetApp Files backups start within a randomized time frame after the frequency of a backup policy is entered. For example, weekly backups are initiated Sunday within a randomly assigned interval after 12:00 a.m. midnight. This timing cannot be modified by the users at this time. The baseline backup is initiated as soon as you assign the backup policy to the volume.

### What happens if a backup operation encounters a problem?

If a problem occurs during a backup operation, Azure NetApp Files backup automatically retries the operation, without requiring user interaction. If the retries continue to fail, Azure NetApp Files backup will report the failure of the operation.

### Can I change the location or storage tier of my backup vault?

No, Azure NetApp Files automatically manages the backup data location within Azure storage, and this location or Azure storage tier cannot be modified by the user.

### What types of security are provided for the backup data?

Azure NetApp Files uses AES-256 bit encryption during the encoding of the received backup data. In addition, the encrypted data is securely transmitted to Azure storage using HTTPS TLSv1.2 connections. Azure NetApp Files backup depends on the Azure Storage account’s built-in encryption at rest functionality for storing the backup data.

### What happens to the backups when I delete a volume or my NetApp account? 

 When you delete an Azure NetApp Files volume, the backups are retained. If you don’t want the backups to be retained, disable the backups before deleting the volume. When you delete a NetApp account, the backups are still retained and displayed under other NetApp accounts of the same subscription, so that it’s still available for restore. If you delete all the NetApp accounts under a subscription, you need to make sure to disable backups before deleting all volumes under all the NetApp accounts.

### What’s the system’s maximum backup retries for a volume?  

The system makes ten retries when processing a scheduled backup job. If the job fails, then the system fails the backup operation. In case of scheduled backups (based on the configured policy), the system tries to back up the data once every hour. If new snapshots are available that were not transferred (or failed during the last try), those snapshots will be considered for transfer. 

## Product FAQs

### Can I use Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

You can mount Azure NetApp Files NFS volumes on AVS Windows VMs or Linux VMs. You can map Azure NetApp Files SMB shares on AVS Windows VMs. For more details, see [Azure NetApp Files with Azure VMware Solution]( ../azure-vmware/netapp-files-with-azure-vmware-solution.md).  

### What regions are supported for using Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Using Azure NetApp Files NFS or SMB volumes with AVS is supported in the following regions - East US, West US , West Europe, and Australia East.

### Does Azure NetApp Files work with Azure Policy?

Yes. Azure NetApp Files is a first-party service. It fully adheres to Azure Resource Provider standards. As such, Azure NetApp Files can be integrated into Azure Policy via *custom policy definitions*. For information about how to implement custom policies for Azure NetApp Files, see 
[Azure Policy now available for Azure NetApp Files](https://techcommunity.microsoft.com/t5/azure/azure-policy-now-available-for-azure-netapp-files/m-p/2282258) on Microsoft Tech Community. 

### Which Unicode Character Encoding is supported by Azure NetApp Files for the creation and display of file and directory names?   

Azure NetApp Files only supports file and directory names that are encoded with the UTF-8 Unicode Character Encoding format for both NFS and SMB volumes.

If you try to create files or directories with names that use supplementary characters or surrogate pairs such as non-regular characters and emoji that are not supported by UTF-8, the operation will fail. In this case, an error from a Windows client might read “The file name you specified is not valid or too long. Specify a different file name.” 

## Next steps  

- [Microsoft Azure ExpressRoute FAQs](../expressroute/expressroute-faqs.md)
- [Microsoft Azure Virtual Network FAQ](../virtual-network/virtual-networks-faq.md)
- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Azure Data Box](../databox/index.yml)
- [FAQs about SMB performance for Azure NetApp Files](azure-netapp-files-smb-performance.md)
