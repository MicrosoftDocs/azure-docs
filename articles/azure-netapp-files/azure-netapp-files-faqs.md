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
ms.date: 04/22/2021
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

Data traffic between NFSv4.1 clients and Azure NetApp Files volumes can be encrypted using Kerberos with AES-256 encryption. See [Configure NFSv4.1 Kerberos encryption for Azure NetApp Files](configure-kerberos-encryption.md) for details.   

Data traffic between NFSv3 or SMB3 clients to Azure NetApp Files volumes is not encrypted. However, the traffic from an Azure VM (running an NFS or SMB client) to Azure NetApp Files is as secure as any other Azure-VM-to-VM traffic. This traffic is local to the Azure data-center network. 

### Can the storage be encrypted at rest?

All Azure NetApp Files volumes are encrypted using the FIPS 140-2 standard. All keys are managed by the Azure NetApp Files service. 

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

## NFS FAQs

### I want to have a volume mounted automatically when an Azure VM is started or rebooted.  How do I configure my host for persistent NFS volumes?

For an NFS volume to automatically mount at VM start or reboot, add an entry to the `/etc/fstab` file on the host. 

See [Mount or unmount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) for details.  

### Why does the DF command on NFS client not show the provisioned volume size?

The volume size reported in DF is the maximum size the Azure NetApp Files volume can grow to. The size of the Azure NetApp Files volume in DF command is not reflective of the quota or size of the volume.  You can get the Azure NetApp Files volume size or quota through the Azure portal or the API.

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

Azure NetApp Files does not support multiple Active Directory (AD) connections in a single *region*, even if the AD connections are in different NetApp accounts. However, you can have multiple AD connections in a single *subscription*, as long as the AD connections are in different regions. If you need multiple AD connections in a single region, you can use separate subscriptions to do so. 

An AD connection is configured per NetApp account; the AD connection is visible only through the NetApp account it is created in.

### Does Azure NetApp Files support Azure Active Directory? 

Both [Azure Active Directory (AD) Domain Services](../active-directory-domain-services/overview.md) and [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) are supported. You can use existing Active Directory domain controllers with Azure NetApp Files. Domain controllers can reside in Azure as virtual machines, or on premises via ExpressRoute or S2S VPN. Azure NetApp Files does not support AD join for [Azure Active Directory](https://azure.microsoft.com/resources/videos/azure-active-directory-overview/) at this time.

If you are using Azure NetApp Files with Azure Active Directory Domain Services, the organizational unit path is `OU=AADDC Computers` when you configure Active Directory for your NetApp account.

### What versions of Windows Server Active Directory are supported?

Azure NetApp Files supports Windows Server 2008r2SP1-2019 versions of Active Directory Domain Services.

### Why does the available space on my SMB client not show the provisioned size?

The volume size reported by the SMB client is the maximum size the Azure NetApp Files volume can grow to. The size of the Azure NetApp Files volume as shown on the SMB client is not reflective of the quota or size of the volume. You can get the Azure NetApp Files volume size or quota through the Azure portal or the API.

### I’m having issues connecting to my SMB share. What should I do?

As a best practice, set the maximum tolerance for computer clock synchronization to five minutes. For more information, see [Maximum tolerance for computer clock synchronization](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852172(v=ws.11)). 

### Can I manage `SMB Shares`, `Sessions`, and `Open Files` through Computer Management Console (MMC)?

Management of `SMB Shares`, `Sessions`, and `Open Files` through Computer Management Console (MMC) is currently not supported.

### How can I obtain the IP address of an SMB volume via the portal?

Use the **JSON View** link on the volume overview pane, and look for the **startIp** identifier under **properties** -> **mountTargets**.

### Can an Azure NetApp Files SMB share act as an DFS Namespace (DFS-N) root?

No. However, Azure NetApp Files SMB shares can serve as a DFS Namespace (DFS-N) folder target.   
To use an Azure NetApp Files SMB share as a DFS-N folder target, provide the Universal Naming Convention (UNC) mount path of the Azure NetApp Files SMB share by using the [DFS Add Folder Target](/windows-server/storage/dfs-namespaces/add-folder-targets#to-add-a-folder-target) procedure.  

### SMB encryption FAQs

This section answers commonly asked questions about SMB encryption (SMB 3.0 and SMB 3.1.1).

#### What is SMB encryption?  

[SMB encryption](/windows-server/storage/file-server/smb-security) provides end-to-end encryption of SMB data and protects data from eavesdropping occurrences on untrusted networks. SMB encryption is supported on SMB 3.0 and greater. 

#### How does SMB encryption work?

When sending a request to the storage, the client encrypts the request, which the storage then decrypts. Responses are similarly encrypted by the server and decrypted by the client.

#### Which clients support SMB encryption?

Windows 10, Windows 2012, and later versions support SMB encryption.

#### With Azure NetApp Files, at what layer is SMB encryption enabled?  

SMB encryption is enabled at the share level.

#### What forms of SMB encryption are used by Azure NetApp Files?

SMB 3.0 employs AES-CCM algorithm, while SMB 3.1.1 employs the AES-GCM algorithm

#### Is SMB encryption required?

SMB encryption is not required. As such, it is only enabled for a given share if the user requests that Azure NetApp Files enable it. Azure NetApp Files shares are never exposed to the internet. They are only accessible from within a given VNet, over VPN or express route, so Azure NetApp Files shares are inherently secure. The choice to enable SMB encryption is entirely up to the user. Be aware of the anticipated performance penalty before enabling this feature.

#### <a name="smb_encryption_impact"></a>What is the anticipated impact of SMB encryption on client workloads?

Although SMB encryption has impact to both the client (CPU overhead for encrypting and decrypting messages) and the storage (reductions in throughput), the following table highlights storage impact only. You should test the encryption performance impact against your own applications before deploying workloads into production.

|     I/O profile    	|     Impact    	|
|-	|-	|
|     Read and write workloads    	|     10% to 15%     	|
|     Metadata intensive    	|     5%  	|

## Capacity management FAQs

### How do I monitor usage for capacity pool and volume of Azure NetApp Files? 

Azure NetApp Files provides capacity pool and volume usage metrics. You can also use Azure Monitor to monitor usage for Azure NetApp Files. See [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md) for details. 

### Can I manage Azure NetApp Files through Azure Storage Explorer?

No. Azure NetApp Files is not supported by Azure Storage Explorer.

### How do I determine if a directory is approaching the limit size?

See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#directory-limit) for the limit and calculation. 

<!-- You can use the `stat` command from a client to see whether a directory is approaching the maximum size limit for directory metadata (320 MB).   

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

### How do I create a copy of an Azure NetApp Files volume in another Azure region?
	
Azure NetApp Files provides NFS and SMB volumes.  Any file based-copy tool can be used to replicate data between Azure regions. 

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

## Product FAQs

### Can I use Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

You can mount Azure NetApp Files NFS volumes on AVS Windows VMs or Linux VMs. You can map Azure NetApp Files SMB shares on AVS Windows VMs. For more details, see [Azure NetApp Files with Azure VMware Solution]( ../azure-vmware/netapp-files-with-azure-vmware-solution.md).  

### What regions are supported for using Azure NetApp Files NFS or SMB volumes with Azure VMware Solution (AVS)?

Using Azure NetApp Files NFS or SMB volumes with AVS is supported in the following regions - East US, West US , West Europe, and Australia East.

## Next steps  

- [Microsoft Azure ExpressRoute FAQs](../expressroute/expressroute-faqs.md)
- [Microsoft Azure Virtual Network FAQ](../virtual-network/virtual-networks-faq.md)
- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Azure Data Box](../databox/index.yml)
- [FAQs about SMB performance for Azure NetApp Files](azure-netapp-files-smb-performance.md)
