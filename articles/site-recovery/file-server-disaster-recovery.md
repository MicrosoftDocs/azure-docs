---
title: Protect a file server by using Azure Site Recovery 
description: This article describes how to help protect a file server by using Azure Site Recovery 
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
# Protect a file server by using Azure Site Recovery 

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps available during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery of various workloads.

This article describes how to help protect a file server by using Azure Site Recovery and other recommendations to suit various environments.

## File server architecture
An open, distributed file-sharing system provides an environment where geographically distributed users can collaborate on files without compromising integrity requirements. 

A typical on-premises file server ecosystem that supports a high number of concurrent users and content items uses Distributed File System Replication (DFSR) for replication scheduling and bandwidth throttling. DFSR uses the Remote Differential Compression (RDC) compression algorithm, which can be used to efficiently update files over a limited-bandwidth network. RDC detects insertions, removals, and rearrangements of data in files. It enables DFSR to replicate only the changed file blocks when files are updated. 

In some file server environments, daily backups are taken at non-peak times for disaster recovery. These environments don't use DFSR.

The following topology illustrates a file server environment with DFSR implemented:
				
![DFSR architecture](media/site-recovery-file-server/dfsr-architecture.JPG)

In the figure, multiple file servers (referred to as members) actively participate in replicating files across a replication group. The contents in the replicated folder are available to all the clients that are sending requests to either of the members, even if one of the members goes offline.

## Disaster recovery strategies for file servers

- **Replicate a file server to Azure by using Azure Site Recovery**: When one or more of the on-premises file servers are inaccessible, the recovery VMs can be brought up in Azure. The recovery VMs can then serve requests from clients, on-premises, if there’s site-to-site VPN connectivity and Active Directory is configured in Azure. You can do this in a DFSR-configured environment or in a simple file server environment with no DFSR. 

- **Extend DFSR to an Azure IaaS VM**: In a clustered file server environment with DFSR implemented, one suggested approach is to extend the on-premises DFSR to Azure. An Azure virtual machine can then perform the file server role. 

    After the dependencies of site-to-site VPN connectivity and Active Directory are handled and DFSR is in place, when one or more of the on-premises file servers are inaccessible, the clients can still connect to the Azure VM. The Azure VM serves the requests.

    We suggest this approach if your VMs have configurations that Azure Site Recovery doesn't support. An example of such a configuration is a shared cluster disk that is commonly used in file server environments. DFSR also works well in low-bandwidth environments with medium churn rate. With this approach, you need to accommodate for the additional cost of having an Azure VM up and running all the time.  

- **Use Azure File Sync to replicate your files**: If you are preparing for your journey to the cloud, or are already using an Azure VM, we suggest the use of Azure File Sync. This service offers syncing of fully managed file shares in the cloud that are accessible via the industry-standard [Server Message Block ](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx)(SMB) protocol. You can then mount Azure file shares concurrently by cloud or by on-premises deployments of Windows, Linux, and macOS. 

The following diagram can help you decide what strategy to use for your file server environment:

![Decision tree](media/site-recovery-file-server/decisiontree.png)


### Factors for making a disaster recovery decision

|Environment  |Recommendation  |Points to consider |
|---------|---------|---------|
|File server environment with or without DFSR|   [Use Azure Site Recovery for replication](#replicate-an-on-premises-file-server-by-using-azure-site-recovery)   |    Site Recovery does not support shared disk clusters or NAS. If your environment uses one of these configurations, use any of the other approaches as appropriate. <br> Azure Site Recovery doesn’t support SMB 3.0. The replicated VM will incorporate changes made to files only when the changes are updated in the original location of the file. 
|File server environment with DFSR     |  [Extend DFSR to an Azure IaaS virtual machine](#extend-dfsr-to-an-azure-iaas-virtual-machine)  |  	DFSR works well in bandwidth-crunched environments. This approach, however, requires you to have an Azure VM up and running all the time. Your planning needs to account for the cost of the VM.         |
|Azure IaaS VM     |     [Use Azure File Sync ](#use-azure-file-sync-to-replicate-your-on-premises-files)   |     In a disaster recovery scenario, if you are using Azure File Sync during failover, you must take manual actions to ensure that the file shares are accessible in a transparent way to the client machine. Azure File Sync requires port 445 to be open from the client machine.     |


### Site Recovery support
Because Site Recovery replication is application agnostic, the recommendations provided here are expected to hold true for the following scenarios:
| Source	|To a secondary site	|To Azure
|---------|---------|---------|
|Azure|	-|Yes|
|Hyper-V|	Yes	|Yes
|VMware	|Yes|	Yes
|Physical server|	Yes	|Yes
 

> [!IMPORTANT]
> Before you proceed with any of the following approaches, be sure to address dependencies.

**Site-to-Site connectivity**: A direct connection between the on-premises site and the Azure network must be established to allow communication between servers. You can use a secure site-to-site VPN connection to an Azure virtual network that will be used as the disaster recovery site. For more information, see [Create a Site-to-Site connection in the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal).

**Active Directory**: DFSR depends on Active Directory. This means that the Active Directory forest with local domain controllers is extended to the disaster recovery site in Azure. Even if you're not using DFSR, if the intended users need to be granted/verified for access, you must perform these steps.
For more information, see [Extend on-premises Active Directory to Azure](https://docs.microsoft.com/azure/site-recovery/site-recovery-active-directory).

## Disaster recovery recommendations for Azure IaaS virtual machines

If you are configuring and managing disaster recovery of file servers hosted on Azure IaaS VMs, you can choose between two options: Azure File Sync and Azure Site Recovery. The decision depends on whether you want to move to [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction).

### Use Azure File Sync to replicate files hosted on IaaS virtual machines

You can use Azure Files to completely replace or supplement traditional on-premises file servers or NAS devices. Azure file shares can also be replicated with Azure File Sync to Windows servers, either on-premises or in the cloud, for performant and distributed caching of the data where it's being used. 

The following steps detail the disaster recovery recommendation for Azure VMs that perform the same function as traditional file servers:
1. Protect machines by using Azure Site Recovery, through the steps mentioned here.

2. Use Azure File Sync to replicate files from the VM that acts as the file server, to the cloud.

3. Use the [recovery plan](https://docs.microsoft.com/en-us/azure/site-recovery/site-recovery-create-recovery-plans) feature in Azure Site Recovery to add scripts to [mount the Azure file share](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-windows) and access the share in your virtual machine.

The following steps briefly describe how to use the Azure File Sync service:

1. [Create a storage account in Azure](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account?toc=%2fazure%2fstorage%2ffiles%2ftoc.json). If you chose read-access geo-redundant storage for your storage accounts, you will get read access to your data from the secondary region in case of a disaster. For more information, see [Azure File share disaster recovery strategies](https://docs.microsoft.com/azure/storage/common/storage-disaster-recovery-guidance?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

2. [Create a file share](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-file-share).

3. [Deploy Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide) on your Azure file server.

4. Create a sync group. Endpoints within a sync group will stay in sync with each other. A sync group must contain at least one cloud endpoint, which represents an Azure File share, and one server endpoint, which represents a path on a Windows server.  
    Your files will now stay in sync across your Azure file share and your on-premises server.

5. If there's a disaster in your on-premises environment, perform a failover by using a recovery plan. Add the script to [mount the Azure file share](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-windows) and access the share in your virtual machine.

### Replicate an IaaS file server virtual machine by using Azure Site Recovery

If you have on-premises clients that access the IaaS file server virtual machine, perform all the following steps. Otherwise, perform only step 3.

1. Establish a site-to-site VPN connection between the on-premises site and the Azure network.  

2. Extend on-premises Active Directory.

3. [Set up disaster recovery](azure-to-azure-tutorial-enable-replication.md) for the IaaS file server machine to a secondary region.

For more information on disaster recovery to a secondary region, see [Azure-to-Azure replication architecture](concepts-azure-to-azure-architecture.md).

## Disaster recovery recommendations for on-premises virtual machines 

### Replicate an on-premises file server by using Azure Site Recovery
The following steps detail replication for a VMware VM. For steps to replicate a Hyper-V VM, see [Set up disaster recovery of on-premises Hyper-V VMs to Azure](https://docs.microsoft.com/en-us/azure/site-recovery/tutorial-hyper-v-to-azure).

1. [Prepare Azure resources](tutorial-prepare-azure.md) for replication of on-premises machines.

2. Establish a site-to-site VPN connection between the on-premises site and the Azure network.  

3. Extend on-premises Active Directory.

4. [Prepare on-premises VMware servers](tutorial-prepare-on-premises-vmware.md).

5. [Set up disaster recovery](tutorial-vmware-to-azure.md) to Azure for on-premises VMs.

### Extend DFSR to an Azure IaaS virtual machine

1. Establish a site-to-site VPN connection between the on-premises site and the Azure network. 

2. Extend on-premises Active Directory.

3. [Create and provision a file server VM](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal?toc=%2Fazure%2Fvirtual-machines%2Fwindows%2Ftoc.json) on the Azure virtual network.  
    Ensure that the virtual machine is added to the same Azure virtual network, which has cross-connectivity with the on-premises environment. 

4. Install and [configure DFS Replication](https://blogs.technet.microsoft.com/b/filecab/archive/2013/08/21/dfs-replication-initial-sync-in-windows-server-2012-r2-attack-of-the-clones.aspx) on Windows Server.

5. [Implement a DFS namespace](https://docs.microsoft.com/windows-server/storage/dfs-namespaces/deploying-dfs-namespaces).

6. With the DFS namespace implemented, you can fail over shared folders from production to disaster recovery sites by updating the DFS namespace folder targets. After these DFS namespace changes replicate via Active Directory, users are connected to the appropriate folder targets transparently.

### Use Azure File Sync to replicate your on-premises files
By using the Azure File Sync service, you can replicate the desired files to the cloud. In the event of a disaster and unavailability of your on-premises file server, you can then mount the desired file locations from the cloud and continue to service requests from the client machines.

The suggested approach of integrating Azure File Sync with Azure Site Recovery is:
1. Protect the file server machines by using Azure Site Recovery. Follow the steps in [Set up disaster recovery to Azure for on-premises VMware VMs](tutorial-vmware-to-azure.md).

2. Use Azure File Sync to replicate files from the machine that serves as a file server, to the cloud.

3. Use the recovery plan feature in Azure Site Recovery to add scripts to mount the Azure file share on the failed-over file server VM in Azure.

The following steps detail using the Azure File Sync service:

1. [Create a storage account in Azure](https://docs.microsoft.com/en-us/azure/storage/common/storage-create-storage-account?toc=%2fazure%2fstorage%2ffiles%2ftoc.json). If you chose read-access geo-redundant storage (recommended) for your storage accounts, you will have read access to your data from the secondary region in case of a disaster. For more information, see [Azure File share disaster recovery strategies](https://docs.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

2. [Create a file share](https://docs.microsoft.com/azure/storage/files/storage-how-to-create-file-share).

3. [Deploy Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-deployment-guide) in your on-premises file server.

4. Create a sync group. Endpoints within a sync group will stay in sync with each other. A sync group must contain at least one cloud endpoint, which represents an Azure file share, and one server endpoint, which represents a path on the on-premises Windows server.  
    Your files will now stay in sync across your Azure file share and your on-premises server.

5. If there's a disaster in your on-premises environment, perform a failover by using a recovery plan. Add the script to mount the Azure file share and access the share in your virtual machine.

> [!NOTE]
> Ensure that port 445 is open. Azure Files uses the SMB protocol. SMB communicates over TCP port 445. Check to see if your firewall is blocking port 445 from the client machine.


## Perform a test failover

1. Go to the Azure portal and select your Recovery Services vault.

2. Select the recovery plan created for the file server environment.

3. Select **Test Failover**.

4. Select the recovery point and Azure virtual network to start the test failover process.

5. When the secondary environment is up, perform your validations.

6. When the validations are complete, you can select **Cleanup test failover** on the recovery plan, and the test failover environment is cleaned.

For more information about performing a test failover, see [Test 	failover to Azure in Site Recovery](site-recovery-test-failover-to-azure.md).

For guidance on performing test failover for Active Directory and DNS, see [Test failover considerations for Active Directory and DNS](site-recovery-active-directory.md).

## Perform a failover

1. Go to the Azure portal and select your Recovery Services vault.

2. Select the recovery plan created for the file server environment.

3. Select **Failover**.

4. Select the recovery point to start the failover process.

For more information about performing a failover, see [Failover in Site Recovery](site-recovery-failover.md).
