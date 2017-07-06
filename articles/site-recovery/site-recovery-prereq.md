---
title: Prerequisites for replication to Azure by using Azure Site Recovery | Microsoft Docs
description: Learn about the prerequisites for replicating VMs and physical machines to Azure by using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rajani-janaki-ram
manager: jwhit
editor: tysonn

ms.assetid: e24eea6c-50a7-4cd5-aab4-2c5c4d72ee2d
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/23/2017
ms.author: rajanaki
---

#  Prerequisites for replication from on-premises to Azure by using Azure Site Recovery

> [!div class="op_single_selector"]
> * [Replicate from Azure to Azure](site-recovery-azure-to-azure-prereq.md)
> * [Replicate from on-premises to Azure](site-recovery-prereq.md)

Azure Site Recovery helps support your business continuity and disaster recovery (BCDR) strategy by orchestrating replication of an Azure virtual machine (VM) to another Azure region. Site Recovery also replicates on-premises physical servers and VMs to the cloud (Azure), or to a secondary datacenter. If an outage occurs at your primary location, you can fail over to a secondary location to keep apps and workloads available. You can fail back to your primary location when it returns to normal operation. For more information about Site Recovery, see [What is Site Recovery](site-recovery-overview.md).

In this article, we summarize the prerequisites for beginning Site Recovery replication from on-premises to Azure.

Post any comments at the bottom of the article, or ask technical questions in the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Azure requirements

**Requirement** | **Details**
--- | ---
**Azure account** | A [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
**Site Recovery service** | For more information about Site Recovery pricing, see [Site Recovery pricing](https://azure.microsoft.com/pricing/details/site-recovery/). |
**Azure Storage** | You need an Azure Storage account to store replicated data. The storage account must be in the same region as the Azure Recovery Services vault. Replicated data is stored in Azure storage. Azure VMs are created when failover occurs.<br/><br/> Depending on the resource model you want to use for failover Azure VMs, you can set up an account in the [Azure Resource Manager deployment model](../storage/storage-create-storage-account.md) or in the [classic deployment model](../storage/storage-create-storage-account-classic-portal.md).<br/><br/>You can use [geo-redundant storage](../storage/storage-redundancy.md#geo-redundant-storage) or locally redundant storage. We recommend geo-redundant storage so that data is resilient if a regional outage occurs or if the primary region can't be recovered.<br/><br/> You can use standard or premium storage. [Premium storage](https://docs.microsoft.com/azure/storage/storage-premium-storage) typically is used for virtual machines that need a consistently high I/O performance and low latency, so they can host I/O-intensive workloads. If you use premium storage for replicated data, you also need a standard storage account. A standard storage account stores replication logs that capture ongoing changes to on-premises data.<br/><br/>
**Storage limitations** | You can't move storage accounts used in Site Recovery across resource groups, or within or across subscriptions.<br/><br/> Currently, replicating to premium storage accounts in Central India and South India isn't supported.
**Azure network** | You need an Azure network to which Azure VMs will connect after failover. The Azure network must be in the same region as the Recovery Services vault.<br/><br/> In the Azure portal, you can create networks by using the [Resource Manager deployment model](../virtual-network/virtual-networks-create-vnet-arm-pportal.md) or the [classic deployment model](../virtual-network/virtual-networks-create-vnet-classic-pportal.md).<br/><br/>. If you replicate from System Center Virtual Machine Manager to Azure, you must set up network mapping between Virtual Machine Manager VM networks and Azure networks to ensure that Azure VMs connect to appropriate networks after failover.
**Network limitations** | You can't move network accounts used in Site Recovery across resource groups, or within or across subscriptions.
**Network mapping** | If you replicate Hyper-V VMs in Virtual Machine Manager clouds, you must set up network mapping so that Azure VMs are connected to appropriate networks when they're created after failover.

> [!NOTE]
> The following sections describe the prerequisites for various components in the customer environment. For more details about support for specific configurations, see the [support matrix](site-recovery-support-matrix.md).
>

## Disaster recovery of VMware virtual machines or physical Windows or Linux servers to Azure
Following are the required components for disaster recovery of VMware virtual machines or physical Windows or Linux servers in addition to the ones mentioned in [Azure requirements](#Azure requirements).


### **Configuration server or additional process server**: You will need to set up an on-premises machine as the configuration server to coordinate communications between the on-premises site and Azure, and to manage data replication. <br></br>

1. **VMware vCenter or vSphere host**

| **Component** | **Requirements** |
| --- | --- |
| **vSphere** | One or more VMware vSphere hypervisors.<br/><br/>Hypervisors should be running vSphere version 6.0, 5.5, or 5.1 with the latest updates.<br/><br/>We recommend that vSphere hosts and vCenter servers are located in the same network as the process server. This is the network in which the configuration server is located, unless you’ve set up a dedicated process server. |
| **vCenter** | We recommend that you deploy a VMware vCenter server to manage your vSphere hosts. It should be running vCenter version 6.0 or 5.5, with the latest updates.<br/><br/>**Limitation**: Site Recovery does not support cross vCenter vMotion. Storage DRS and Storage vMotion is also not supported on Master target virtual machine post a reprotect operation.||

1. **Replicated machine prerequisites**


| **Component** | **Requirements** |
| --- | --- |
| **On-premises** (VMware VMs) | Replicated VMs should have VMware tools installed and running.<br/><br/> VMs should conform with [Azure prerequisites](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements) for creating Azure VMs.<br/><br/>Individual disk capacity on protected machines shouldn’t be more than 1,023 GB. <br/><br/>A minimum 2 GB of available space on the installation drive is required for component installation.<br/><br/>Port 20004 should be opened on the VM local firewall if you want to enable multi-VM consistency.<br/><br/>Machine names should contain between 1 and 63 characters (letters, numbers, and hyphens). The name must start with a letter or number and end with a letter or number. After you've enabled replication for a machine, you can modify the Azure name.<br/><br/> |
| **Windows machines** (physical or VMware) | The machine should be running a supported 64-bit operating system: Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 with at least SP1.<br/><br/> The operating system should be installed on drive C. The OS disk should be a Windows basic disk and not dynamic. The data disk can be dynamic.<br/><br/>|
| **Linux machines** (physical or VMware) | You need a supported 64-bit operating system: Red Hat Enterprise Linux 6.7, 6.8, 7.1, or 7.2; Centos 6.5, 6.6, 6.7, 6.8, 7.0, 7.1, or 7.2; Ubuntu 14.04 LTS server(for a list of supported kernel versions with Ubuntu see [supported operating systems](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions)); Oracle Enterprise Linux 6.4 or 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3), SUSE Linux Enterprise Server 11 SP3, SUSE Linux Enterprise Server 11 SP4.<br/><br/>Your /etc/hosts files on protected machines should contain entries that map the local host name to IP addresses associated with all network adapters.<br/><br/>If you want to connect to an Azure virtual machine running Linux after failover by using a Secure Shell client (ssh), ensure that the Secure Shell service on the protected machine is set to start automatically on system boot and that firewall rules allow an ssh connection to it.<br/><br/>The host name, mount points, device names, and Linux system paths and file names (for example, /etc/; /usr) should be in English only.<br/><br/>The following directories (if set up as separate partitions/file-systems) must all be on the same disk (the OS disk) on the source server:   / (root), /boot, /usr, /usr/local, /var, /etc<br/><br/>XFS v5 features such as metadata checksum are currently not supported by ASR on XFS filesystems. Ensure that your XFS filesystems aren't using any v5 features. You can use the xfs_info utility to check the XFS superblock for the partition. If ftype is set to 1, then XFSv5 features are being used.<br/><br/>On Red Hat Enterprise Linux 7 and CentOS 7 servers, the lsof utility must be installed and available.<br/><br/>


## Disaster recovery of Hyper-V virtual machines to Azure (no Virtual Machine Manager)

Following are the required components for disaster recovery of Hyper-V virtual machines in Virtual Machine Manager clouds, in addition to the ones mentioned in [Azure requirements](#Azure requirements).

| **Prerequisite** | **Details** |
| --- | --- |
| **Hyper-V host** |One or more on-premises servers running Windows Server 2012 R2 with the latest updates and the Hyper-V role enabled, or Microsoft Hyper-V Server 2012 R2.<br/><br/>The Hyper-V servers should contain one or more virtual machines.<br/><br/>Hyper-V servers should be connected to the Internet, either directly or via a proxy.<br/><br/>Hyper-V servers should have fixes mentioned in [KB2961977](https://support.microsoft.com/kb/2961977) installed.
|**Provider and agent**| During Azure Site Recovery deployment, you’ll install Azure Site Recovery Provider. The Provider installation will also install Azure Recovery Services Agent on each Hyper-V server running virtual machines you want to protect. <br/><br/>All Hyper-V servers in a Site Recovery vault should have the same versions of the Provider and agent.<br/><br/>The Provider will need to connect to Azure Site Recovery over the Internet. Traffic can be sent directly or through a proxy. HTTPS-based proxy is not supported. The proxy server should allow access to:<br/><br/> [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]<br/><br/>If you have IP address-based firewall rules on the server, ensure that the rules allow communication to Azure.<br/><br/> Allow the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.<br/><br/> Allow IP address ranges for the Azure region of your subscription, and for the western US (used for access control and identity management).


## Disaster recovery of Hyper-V virtual machines in Virtual Machine Manager clouds to Azure

Following are the required components for disaster recovery of Hyper-V virtual machines in Virtual Machine Manager clouds, in addition to the ones mentioned in [Azure requirements](#Azure requirements).

| **Prerequisite** | **Details** |
| --- | --- |
| **Virtual Machine Manager** |One or more Virtual Machine Manager servers running on **System Center 2012 R2 or later**. Each Virtual Machine Manager server should have one or more clouds configured. <br/><br/>A cloud should contain:<br>- One or more Virtual Machine Manager host groups.<br/>- One or more Hyper-V host servers or clusters in each host group.<br/><br/>For more about setting up Virtual Machine Manager clouds, see [How to create a cloud in VMM 2012](http://social.technet.microsoft.com/wiki/contents/articles/2729.how-to-create-a-cloud-in-vmm-2012.aspx). |
| **Hyper-V** |Hyper-V host servers must be running at least Windows Server 2012 R2 with Hyper-V role or Microsoft Hyper-V Server 2012 R2 and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/> A Hyper-V host server or cluster that includes VMs you want to replicate must be managed in a Virtual Machine Manager cloud.<br/><br/>Hyper-V servers must be connected to the Internet, either directly or via a proxy.<br/><br/>Hyper-V servers must have the fixes mentioned in article [2961977](https://support.microsoft.com/kb/2961977) installed.<br/><br/>Hyper-V host servers need Internet access for data replication to Azure. |
| **Provider and agent** |During Azure Site Recovery deployment, install Azure Site Recovery Provider on the Virtual Machine Manager server, and install Recovery Services Agent on Hyper-V hosts. The Provider and agent need to connect to Azure over the Internet directly or through a proxy. An HTTPS-based proxy isn't supported. The proxy server on the Virtual Machine Manager server and Hyper-V hosts should allow access to: <br/><br/>[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)] <br/><br/>If you have IP address-based firewall rules on the Virtual Machine Manager server, ensure that the rules allow communication to Azure.<br/><br/> Allow the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and the HTTPS (443) port.<br/><br/>Allow IP address ranges for the Azure region of your subscription, and for the western US (used for access control and identity management).<br/><br/> |

### Replicated machine prerequisites
| **Component** | **Details** |
| --- | --- |
| **Protected VMs** | Site Recovery supports all operating systems that are supported by [Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx).<br/><br/>VMs should conform with [Azure prerequisites](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements) for creating Azure VMs. Machine names should contain between 1 and 63 characters (letters, numbers, and hyphens). The name must start with a letter or number and end with a letter or number. <br/><br/>You can modify the name after you've enabled replication for the VM. <br/><br/> Individual disk capacity on protected machines shouldn’t be more than 1,023 GB. A VM can have up to 16 disks (thus up to 16 TB).<br/><br/>


## Disaster recovery of Hyper-V virtual machines in Virtual Machine Manager clouds to a customer-owned site

Following are the required components for disaster recovery of Hyper-V virtual machines in Virtual Machine Manager clouds to a customer-owned site, in addition to the ones mentioned in [Azure requirements](#Azure requirements).

| **Components** | **Details** |
| --- | --- |
| **Virtual Machine Manager** |  We recommend that you deploy a Virtual Machine Manager server in the primary site and a Virtual Machine Manager server in the secondary site.<br/><br/> You can [replicate between clouds on a single VMM server](site-recovery-vmm-to-vmm.md#prepare-for-single-server-deployment). To do this, you need at least two clouds configured on the Virtual Machine Manager server.<br/><br/> Virtual Machine Manager servers should be running at least System Center 2012 SP1 with the latest updates.<br/><br/> Each Virtual Machine Manager server must have at least one or more clouds. All clouds must have the Hyper-V Capacity profile set. <br/><br/>Clouds must contain one or more Virtual Machine Manager host groups. For more about setting up Virtual Machine Manager clouds, see [Prepare for Azure Site Recovery deployment](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric). |
| **Hyper-V** | Hyper-V servers must be running at least Windows Server 2012 with the Hyper-V role, and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/>  Hyper-V host servers should be located in host groups in the primary and secondary VMM clouds.<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012 R2, we recommend installing [update 2961977](https://support.microsoft.com/kb/2961977).<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012 and have a static IP address-based cluster, cluster broker isn't created automatically. You must configure the cluster broker manually. For more about the cluster broker, see [Configure replica broker role cluster to cluster replication](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx). |
| **Provider** | During Site Recovery deployment, install Azure Site Recovery Provider on Virtual Machine Manager servers. The Provider communicates with Site Recovery over HTTPS 443 to orchestrate replication. Data replication occurs between the primary and secondary Hyper-V servers over the LAN or a VPN connection.<br/><br/> The Provider running on the Virtual Machine Manager server needs access to these URLs:<br/><br/>[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)] <br/><br/>The Provider must allow firewall communication from the Virtual Machine Manager servers to the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and allow the HTTPS (443) protocol. |


## URL access
These URLs should be available from VMware, VMM, and Hyper-V host servers.

|**URL** | **VMM to VMM** | **VMM to Azure** | **Hyper-V to Azure** | **VMware to Azure** |
|--- | --- | --- | --- | --- |
|``*.accesscontrol.windows.net`` | Allow | Allow | Allow | Allow |
|``*.backup.windowsazure.com`` | Not required | Allow | Allow | Allow |
|``*.hypervrecoverymanager.windowsazure.com`` | Allow | Allow | Allow | Allow |
|``*.store.core.windows.net`` | Allow | Allow | Allow | Allow |
|``*.blob.core.windows.net`` | Not required | Allow | Allow | Allow |
|``https://dev.mysql.com/get/archives/mysql-5.5/mysql-5.5.37-win32.msi`` | Not required | Not required | Not required | Allow for SQL download |
|``time.windows.com`` | Allow | Allow | Allow | Allow|
|``time.nist.gov`` | Allow | Allow | Allow | Allow |
