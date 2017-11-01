---
title: Protect a File Server using Azure Site Recovery 
description: This article describes how to protect a File Server using Azure Site Recovery 
services: site-recovery
author: rajani-janaki-ram
manager: gauravd

ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/23/2017
ms.author: rajanaki
ms.custom: mvc
---
# Protect a File Server using Azure Site Recovery 

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running available during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery of various workloads.

This article describes how to protect a File Server using Azure Site Recovery and other recommendations to suit various environments. 

- [Protect Azure IaaS file server machines](#disaster-recovery-recommendation-for-azure-iaas-virtual-machines)
- [Protect on-premises file servers](#replicate-an-onpremises-file-server-using-azure-site-recovery)


## File Server architecture
The aim of an open distributed file sharing system is to provide an environment where a group of geographically distributed users can collaborate to efficiently work on files and be guaranteed that their integrity requirements are enforced. A typical on-premises File Server ecosystem that supports a high number of concurrent users and a large number of content items use Distributed File System Replication (DFSR) for replication scheduling and bandwidth throttling. DFSR uses a compression algorithm known as Remote Differential Compression (RDC), that can be used to efficiently update files over a limited-bandwidth network. It detects insertions, removals, and rearrangements of data in files, enabling DFSR to replicate only the changed file blocks when files are updated. There are also File Server environments, where daily backups are taken in non-peak timings, which cater to disaster needs and there is no implementation of DFSR.

The following topology illustrates the File Server environment with DFSR implemented.
				
![dfsr-architexture](media/site-recovery-file-server/dfsr-architecture.JPG)

In the above reference, multiple file servers referred to as members, actively participate in replicating files across a  replication group. The contents in the replicated folder will be available to all the clients sending requests to either of the members, even in the event of one of the members going offline.

## Disaster recovery recommendation for file servers:

1.	Replicate a file server using Azure Site Recovery: The file servers can be replicated to Azure using Azure Site Recovery. When one or more of the file servers on-premises is inaccessible, the recovery VMs can be brought up in Azure, which can then serve requests from clients, on-premises, provided there’s Site-to-Site VPN connectivity and Active directory configured in Azure. This can be done in case of a DFSR configured environment or a simple file server environment with no DFSR. 

2.	Extend DFSR to an Azure Iaas VM:-  In a clustered file server environment with DFSR implemented, one suggested approach is to extend the on-premises DFSR to Azure. An Azure virtual machine is then enabled to perform the file server role. 

    Once the dependencies of Site-to-Site VPN connectivity and Active directory are handled and DFSR is in place, when one or more of the file servers on-premises is inaccessible, the clients can still connect to the Azure VM, which will serve the requests.

    This approach is suggested in case your VMs have configurations that are not supported by Azure Site Recovery, like for example: shared cluster disk which is sometimes commonly used in File Server environments.  DFSR also works  well in low-bandwidth environments with medium churn rate. The additional cost of having an Azure VM up and running all the time also needs to be accommodated with this.  

3.	Use Azure File Sync service to replicate your files: If you are preparing for your journey to the cloud, or are already using an Azure VM, then we suggest the use of Azure File sync service, which offers syncing of fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block ](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx)(SMB) protocol. Azure File shares can then be mounted concurrently by cloud or on-premises deployments of Windows, Linux, and macOS. 

Below diagram, gives a pictorial representation aimed at easing out the decision of what strategy to use for your file server environment.

![decision tree](media/site-recovery-file-server/decisiontree.png)


### Factors to consider while making disaster recovery decision

|Environment  |Recommendation  |Points to consider |
|---------|---------|---------|
|File Server environment with/without DFSR|   [Use Azure Site Recovery for replication](#replicate-an-onpremises-file-servers-using-azure-site-recovery)   |    Site Recovery does not support shared disk cluster, NAS. If your environment uses any of these configurations, use any of the other approaches as appropriate. <br> Azure Site Recovery doesn’t support SMB 3.0, which means that only when the changes made to the files are updated in original location of the file will the replicated VM incorporate the changes.
|File Server environment with DFSR     |  [Extend DFSR to an Azure IaaS virtual machine:](#extend-dfsr-to-an-azure-iaas-virtual-machine)  |  	DFSR works well in extremely bandwidth crunched environments, this approach however requires to have an Azure VM up and running all the time. The cost of the VM needs to be accounted for in your planning.         |
|Azure Iaas VM     |     [Azure File Sync ](#use-azure-file-sync-service-to-replicate-your-files)   |     In a DR scenario if you are using Azure File Sync, during failover manual actions need to be taken to ensure that the file shares as accessible in a transparent way to the client machine. AFS requires port 445 to be open from the client machine.     |


### Site Recovery support
As Site Recovery replication is application agnostic, the recommendations provided here are expected to hold true for the following scenarios:
| Source	|To a secondary site	|To Azure
|---------|---------|---------|
|Azure|	-|Yes|
|Hyper-V|	Yes	|Yes
|VMware	|Yes|	Yes
|Physical server|	Yes	|Yes
 

> [!IMPORTANT]
> Before you proceed with any of the below three approaches, ensure that the following dependencies are taken care of:

**Site-to-Site connectivity**: Direct connection between the on-premises site and the Azure network must be established to allow communication between servers.  This can be ensured by a secure Site-to-Site VPN connection to a Windows Azure Virtual Network that will be used as the DR site.  
Refer: [Establish Site-to-Site VPN connection between on-premises site and Azure network  ](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal)

**Active Directory**:  DFSR depends on Active Directory.  This means that the Active Directory forest with local domain controllers is extended to the DR site in Azure. Even if you are not using DFSR if the intended users need to be granted/ verified for access like in most organization, these steps need to be performed.
Refer: [Extend on-premises Active Directory to Azure](https://docs.microsoft.com/azure/site-recovery/site-recovery-active-directory).

## Disaster recovery recommendation for Azure IaaS virtual machines

If you are configuring anf managing disaster recovery of File Servers hosted on Azure IaaS Vms, you can choose between two options, based on whether you want to move to [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction).

1. [Use Azure File Sync](#use-azure-file-sync-service-to-replicate-files-hosted-on-iaas-virtual-machine)
2. [Use Azure Site Recovery](#replicate-an-iaas-file-server-virtual-machine-using-azure-site-recovery)

## Use Azure File Sync service to replicate files hosted on IaaS virtual machine

**Azure Files** can be used to completely replace or supplement traditional on-premises file servers or NAS devices. Azure File shares can also be replicated with Azure File Sync to Windows Servers, either on-premises or in the cloud, for performant and distributed caching of the data where it's being used. Below steps detail the DR recommendation for Azure VMs that perform same functionality as traditional File Servers:
1.	Protect machines using Azure Site Recovery using steps mentioned here
2.	Use Azure File Sync to replicate files from the VM that acts as the file server, to the cloud.
3.	Use Azure Site Recovery’s recovery plan feature to add scripts to [mount the Azure File share](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-windows) and access the share in your virtual machine.

The below steps describe briefly how to use Azure File Sync service:

1. [Create a storage account in Azure](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account?toc=%2fazure%2fstorage%2ffiles%2ftoc.json). If you chose Read-access geo-redundant storage (RA-GRS) for your storage accounts, you will get read access to your data from the secondary region in case of a disaster. Please refer to the [Azure File share disaster recovery strategies](https://docs.microsoft.com/azure/storage/common/storage-disaster-recovery-guidance?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for further info.

2. [Create a file share](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-file-share)

3. [Deploy Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide) on your Azure file server.

4. Create a Sync Group: Endpoints within a Sync Group will be kept in sync with each other. A Sync Group must contain at least one Cloud Endpoint, which represents an Azure File share, and one Server Endpoint, which represents a path on a Windows Server.
5.	Your files will now be kept in sync across your Azure File share and your on-premises server.
6.	In the event of a disaster in your on-premises environment, perform as failover using a recovery plan and add the script to [mount the Azure File share](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-windows) and access the share in your virtual machine.

### Replicate an IaaS file server virtual machine using Azure Site Recovery

If you have on-premises clients accessing the IaaS file server virtual machine perform the first 2 steps as well, else proceed to step 3.

1. Establish Site-to-Site VPN connection between on-premises site and Azure network.  
2. Extend on-premises Active Directory.
3. [Set up disaster recovery](azure-to-azure-tutorial-enable-replication.md) for the IaaS file server machine to a secondary region.


For more information on disaster recovery to a secondary region, refer [here](concepts-azure-to-azure-architecture.md).


## Replicate an on-premises file server using Azure Site Recovery
The below steps detail replication for a VMware VM, for steps to replicate a Hyper-V VM, refer here.

1.	[Prepare Azure resources](tutorial-prepare-azure.md) for replication of on-premises machines.
2.	Establish Site-to-Site VPN connection between on-premises site and Azure network.  
3. Extend on-premises Active Directory.
4.	[Prepare on-premises VMware servers](tutorial-prepare-on-premises-vmware.md).
5.	[Set up disaster recovery](tutorial-vmware-to-azure.md) to Azure for on-premises VMs.

## Extend DFSR to an Azure IaaS virtual machine:

1.	Establish Site-to-Site VPN connection between on-premises site and Azure network. 
2.	Extend on-premises Active Directory.
3.	[Create and provision a file server VM](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal?toc=%2Fazure%2Fvirtual-machines%2Fwindows%2Ftoc.json) on the Windows Azure Virtual Network.

    Ensure that the virtual machine is added to the same Windows Azure Virtual Network, which has the cross connectivity with the on-premises environment. 

4.	Install and [configure DFS Replication](https://blogs.technet.microsoft.com/b/filecab/archive/2013/08/21/dfs-replication-initial-sync-in-windows-server-2012-r2-attack-of-the-clones.aspx) on Windows Server.

5.	[Implement a DFS Namespace](https://docs.microsoft.com/windows-server/storage/dfs-namespaces/deploying-dfs-namespaces).
6.	With the DFS Namespace implemented, failover of shared folders from production to DR sites can be done by updating the DFS Namespace folder targets.  Once these DFS Namespace changes replicate via Active Directory, users are connected to the appropriate folder targets transparently.

## Use Azure File Sync service to replicate your on-premises files:
Using the Azure File Sync service, you can replicate the desired files to the cloud, so that in the event of a disaster and unavailability of your on-premises file server, you can mount the desired file locations from the cloud on to and continue to service requests from the client machines.
The suggested approach of integrating Azure File Sync with Azure Site Recovery is
1.	Protect the file server machines using Azure Site Recovery using steps mentioned [here](tutorial-vmware-to-azure.md)
2.	Use Azure File Sync to replicate files from the machine that serves as a File Server, to the cloud.
3.	Use Azure Site Recovery’s recovery plan feature to add scripts to mount the Azure File share on the failed over FileServer VM in Azure.

The below steps detail using Azure File Sync service:

1. [Create a storage account in Azure](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account?toc=%2fazure%2fstorage%2ffiles%2ftoc.json). If you chose Read-access geo-redundant storage (RA-GRS) (recommended) for your storage accounts, you will have read access to your data from the secondary region in case of a disaster. Please refer to the [Azure File share disaster recovery strategies](https://docs.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for further info.

2. [Create a file share](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-file-share)

3. [Deploy Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide) in your on-premises file server.

4. Create a Sync Group: Endpoints within a Sync Group will be kept in sync with each other. A Sync Group must contain at least one Cloud Endpoint, which represents an Azure File share, and one Server Endpoint, which represents a path on the on-premises Windows Server.

1. Your files will now be kept in sync across your Azure File share and your on-premises server.
6.	In the event of a disaster in your on-premises environment, perform as failover using a recovery plan and add the script to mount the Azure File share and access the share in your virtual machine.

> [!NOTE]
> Ensure port 445 is open: Azure Files uses SMB protocol. SMB communicates over TCP port 445 - check to see if your firewall is not blocking TCP ports 445 from client machine.


## Doing a test failover

1.	Go to Azure portal and select your Recovery Service vault.
2.	Click on the recovery plan created for the FileServer environment.
3.	Click on 'Test Failover'.
4.	Select recovery point and Azure virtual network to start the test failover process.
5.	Once the secondary environment is up, you can perform your validations.
6.	Once the validations are complete, you can click 'Cleanup test failover' on the recovery plan and the test failover environment is cleaned.

For more information on performing test failover, refer [here](site-recovery-test-failover-to-azure.md).

For guidance on doing test failover for AD and DNS, refer to [test failover considerations for AD and DNS](site-recovery-active-directory.md).

## Doing a failover

1.	Go to Azure portal and select your Recovery Services vault.
2.	Click on the recovery plan created for the FileServer environment.
3.	Click on 'Failover'.
4.	Select recovery point to start the failover process.

For more information on performing test failover, refer [here](site-recovery-failover.md).
