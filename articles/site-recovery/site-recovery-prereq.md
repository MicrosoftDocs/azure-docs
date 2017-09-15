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

#  Prerequisites for replication from on-premises to Azure by using Site Recovery

> [!div class="op_single_selector"]
> * [Replicate from Azure to Azure](site-recovery-azure-to-azure-prereq.md)
> * [Replicate from on-premises to Azure](site-recovery-prereq.md)

Azure Site Recovery can help you support your business continuity and disaster recovery (BCDR) strategy by orchestrating replication of an Azure virtual machine (VM) to another Azure region. Site Recovery also replicates on-premises physical servers and VMs to the cloud (Azure), or to a secondary datacenter. If an outage occurs at your primary location, you can fail over to a secondary location to keep apps and workloads available. You can fail back to your primary location when the primary location returns to normal operations. For more information about Site Recovery, see [What is Site Recovery?](site-recovery-overview.md).

In this article, we summarize the prerequisites for beginning Site Recovery replication from an on-premises machine to Azure.

You can post any comments at the bottom of the article. You also can ask technical questions in the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Azure requirements

**Requirement** | **Details**
--- | ---
**Azure account** | A [Microsoft Azure account](http://azure.microsoft.com/). You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
**Site Recovery service** | For more information about pricing for the Azure Site Recovery service, see [Site Recovery pricing](https://azure.microsoft.com/pricing/details/site-recovery/). |
**Azure Storage** | You need an Azure Storage account to store replicated data. The storage account must be in the same region as the Azure Recovery Services vault. Azure VMs are created when failover occurs.<br/><br/> Depending on the resource model you want to use for Azure VM failover, you can set up an account by using the [Azure Resource Manager deployment model](../storage/common/storage-create-storage-account.md) or the [classic deployment model](../storage/common/storage-create-storage-account.md).<br/><br/>You can use [geo-redundant storage](../storage/common/storage-redundancy.md#geo-redundant-storage) or locally redundant storage. We recommend geo-redundant storage. With geo-redundant storage, data is resilient if a regional outage occurs, or if the primary region can't be recovered.<br/><br/> You can use a standard Azure storage account, or you can use Azure Premium Storage. [Premium storage](https://docs.microsoft.com/azure/storage/storage-premium-storage) typically is used for VMs that need a consistently high I/O performance and low latency. With premium storage, a VM can host I/O-intensive workloads. If you use premium storage for replicated data, you also need a standard storage account. A standard storage account stores replication logs that capture ongoing changes to on-premises data.<br/><br/>
**Storage limitations** | You can't move storage accounts that you use in Site Recovery to a different resource group, or move to or use with another subscription.<br/><br/> Currently, replicating to premium storage accounts in Central India and South India isn't available.
**Azure network** | You need an Azure network, to which Azure VMs connect after failover. The Azure network must be in the same region as the Recovery Services vault.<br/><br/> In the Azure portal, you can create an Azure network by using the [Resource Manager deployment model](../virtual-network/virtual-networks-create-vnet-arm-pportal.md) or the [classic deployment model](../virtual-network/virtual-networks-create-vnet-classic-pportal.md).<br/><br/> If you replicate from System Center Virtual Machine Manager (VMM) to Azure, you must set up network mapping between VMM VM networks and Azure networks. This ensures that Azure VMs connect to appropriate networks after failover.
**Network limitations** | You can't move network accounts that you use in Site Recovery to a different resource group, or move to or use with another subscription.
**Network mapping** | If you replicate Microsoft Hyper-V VMs in VMM clouds, you must set up network mapping. This ensures that Azure VMs connect to appropriate networks when they're created after failover.

> [!NOTE]
> The following sections describe the prerequisites for various components of the customer environment. For more information about support for specific configurations, see the [support matrix](site-recovery-support-matrix.md).
>

## Disaster recovery of VMware VMs or physical Windows or Linux servers to Azure
The following components are required for disaster recovery of VMware VMs or physical Windows or Linux servers. These are in addition to the ones described in [Azure requirements](#azure-requirements).


### Configuration server or additional process server

Set up an on-premises machine as the configuration server to orchestrate communication between the on-premises site and Azure. The below table talks about the system and software requirements of a virtual machine that can be configured as a configuration server.

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

### VMware vCenter or vSphere host prerequisites

    | **Component** | **Requirements** |
    | --- | --- |
    | **vSphere** | You must have one or more VMware vSphere hypervisors.<br/><br/>Hypervisors must be running vSphere version 6.0, 5.5, or 5.1, with the latest updates.<br/><br/>We recommend that vSphere hosts and vCenter servers both be in the same network as the process server. Unless you’ve set up a dedicated process server, this is the network where the configuration server is located. |
    | **vCenter** | We recommend that you deploy a VMware vCenter server to manage your vSphere hosts. It must be running vCenter version 6.0 or 5.5, with the latest updates.<br/><br/>**Limitation**: Site Recovery does not support replication between instances of vCenter vMotion. Storage DRS and Storage vMotion also are not supported on a master target VM after a reprotect operation.||

### Replicated machine prerequisites

    | **Component** | **Requirements** |
    | --- | --- |
    | **On-premises machines** (VMware VMs) | Replicated VMs must have VMware tools installed and running.<br/><br/> VMs must meet [Azure prerequisites](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements) for creating an Azure VM.<br/><br/>Disk capacity on each protected machine can't be more than 1,023 GB. <br/><br/>A minimum 2 GB of available space on the installation drive is required for component installation.<br/><br/>If you want to enable multi-VM consistency, port 20004 must be opened on the VM local firewall.<br/><br/>Machine names must be between 1 and 63 characters long (you can use letters, numbers, and hyphens). The name must start with a letter or number, and end with a letter or number. <br/><br/>After you've enabled replication for a machine, you can modify the Azure name.<br/><br/> |
    | **Windows machines** (physical or VMware) | The machine must be running one of the following supported 64-bit operating systems: <br/>- Windows Server 2012 R2<br/>- Windows Server 2012<br/>- Windows Server 2008 R2 with SP1 or a later version<br/><br/> The operating system must be installed on drive C. The OS disk must be a Windows basic disk, and not dynamic. The data disk can be dynamic.<br/><br/>|
    | **Linux machines** (physical or VMware) | The machine must be running one of the following supported 64-bit operating systems: <br/>- Red Hat Enterprise Linux 5.2 to 5.11, 6.1 to 6.9, 7.0 to 7.3<br/>- CentOS 5.2 to 5.11, 6.1 to 6.9, 7.0 to 7.3<br/>- Ubuntu 14.04 LTS server (for a list of supported kernel versions for Ubuntu, see [supported operating systems](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions))<br/>- Ubuntu 16.04 LTS server (for a list of supported kernel versions for Ubuntu, see [supported operating systems](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions))<br/>-  Debian 7 or Debian 8<br/>-  Oracle Enterprise Linux 6.5 or 6.4, running either the Red Hat-compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3)<br/>- SUSE Linux Enterprise Server 11 SP4 or SUSE Linux Enterprise Server 11 SP3<br/><br/>Your /etc/hosts files on protected machines must have entries that map the local host name to IP addresses associated with all network adapters.<br/><br/>After failover, if you want to connect to an Azure VM that's running Linux by using a Secure Shell (SSH) client, ensure that the SSH service on the protected machine is set to start automatically on system start. Ensure also that firewall rules allow an SSH connection to the protected machine.<br/><br/>The host name, mount points, device names, and Linux system paths and file names (for example, /etc/ and /usr) must be in English only.<br/><br/>The following directories (if set up as separate partitions or file systems) must all be on the same disk (the OS disk) on the source server:<br/>- / (root)<br/>- /boot<br/>- /usr<br/>- /usr/local<br/>- /var<br/>- /etc<br/><br/>Currently, XFS v5 features, like metadata checksum, are not supported by Site Recovery on XFS file systems. Ensure that your XFS file systems aren't using any v5 features. You can use the xfs_info utility to check the XFS superblock for the partition. If **ftype** is set to **1**, XFS v5 features are being used.<br/><br/>On Red Hat Enterprise Linux 7 and CentOS 7 servers, the lsof utility must be installed and available.<br/><br/>


## Disaster recovery of Hyper-V VMs to Azure (no VMM)

The following components are required for disaster recovery of Hyper-V VMs in VMM clouds. These are in addition to the ones described in [Azure requirements](#azure-requirements).

| **Prerequisite** | **Details** |
| --- | --- |
| **Hyper-V host** |One or more on-premises servers must be running Windows Server 2012 R2 with the latest updates and the Hyper-V role enabled, or Microsoft Hyper-V Server 2012 R2.<br/><br/>Hyper-V servers must have one or more VMs.<br/><br/>Hyper-V servers must be connected to the Internet, either directly or via a proxy.<br/><br/>Hyper-V servers must have the fixes described in the Knowledge Base article [2961977](https://support.microsoft.com/kb/2961977) installed.
|**Provider and agent**| During Site Recovery deployment, you install the Azure Site Recovery provider. The provider installation also installs the Azure Recovery Services agent on each Hyper-V server that's running VMs that you want to protect. <br/><br/>All Hyper-V servers in a Site Recovery vault must have the same versions of the provider and the agent.<br/><br/>The provider needs to connect to Site Recovery over the Internet. Traffic can be sent directly or through a proxy. HTTPS-based proxy is not supported. The proxy server must allow access to the following URLs:<br/><br/> [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]<br/><br/>If you have IP address-based firewall rules on the server, ensure that the rules allow communication to Azure.<br/><br/> Allow the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and HTTPS (port 443).<br/><br/> Allow IP address ranges for the Azure region of your subscription, and for the Western US (used for access control and identity management).


## Disaster recovery of Hyper-V VMs in VMM clouds to Azure

The following components are required for disaster recovery of Hyper-V VMs in VMM clouds. These are in addition to the ones described in [Azure requirements](#azure-requirements).

| **Prerequisite** | **Details** |
| --- | --- |
| **Virtual Machine Manager** |You must have one or more VMM servers running on System Center 2012 R2 or a later version. Each VMM server must have one or more clouds configured. <br/><br/>A cloud must have:<br/>- One or more VMM host groups.<br/>- One or more Hyper-V host servers or clusters in each host group.<br/><br/>For more information about setting up VMM clouds, see [How to create a cloud in Virtual Machine Manager 2012](http://social.technet.microsoft.com/wiki/contents/articles/2729.how-to-create-a-cloud-in-vmm-2012.aspx). |
| **Hyper-V** |Hyper-V host servers must be running at least Windows Server 2012 R2 with the Hyper-V role enabled, or Microsoft Hyper-V Server 2012 R2. The latest updates must be installed.<br/><br/> A Hyper-V server must have one or more VMs.<br/><br/> A Hyper-V host server or cluster that includes VMs that you want to replicate must be managed in a VMM cloud.<br/><br/>Hyper-V servers must be connected to the Internet, either directly or via a proxy.<br/><br/>Hyper-V servers must have the fixes described in the Knowledge Base article [2961977](https://support.microsoft.com/kb/2961977) installed.<br/><br/>Hyper-V host servers need Internet access for data replication to Azure. |
| **Provider and agent** |During Azure Site Recovery deployment, install Azure Site Recovery Provider on the VMM server. Install Recovery Services Agent on Hyper-V hosts. The provider and agent need to connect to Azure directly over the Internet or through a proxy. An HTTPS-based proxy isn't supported. The proxy server on the VMM server and Hyper-V hosts must allow access to: <br/><br/>[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)] <br/><br/>If you have IP address-based firewall rules on the VMM server, ensure that the rules allow communication to Azure.<br/><br/> Allow the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and HTTPS (port 443).<br/><br/>Allow IP address ranges for the Azure region for your subscription, and for the Western US (used for access control and identity management).<br/><br/> |

### Replicated machine prerequisites

| **Component** | **Details** |
| --- | --- |
| **Protected VMs** | Site Recovery supports all operating systems that are supported by [Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx).<br/><br/>VMs must meet the [Azure prerequisites](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements) for creating an Azure VM. Machine names must be between 1 and 63 characters long (you can use letters, numbers, and hyphens). The name must start with a letter or number, and end with a letter or number. <br/><br/>You can modify the VM name after you've enabled replication for the VM. <br/><br/> Disk capacity for each protected machine can't be more than 1,023 GB. A VM can have up to 16 disks (up to 16 TB).<br/><br/>


## Disaster recovery of Hyper-V VMs in VMM clouds to a customer-owned site

The following components are required for disaster recovery of Hyper-V VMs in VMM clouds to a customer-owned site. These are in addition to the ones described in [Azure requirements](#azure-requirements).

| **Component** | **Details** |
| --- | --- |
| **Virtual Machine Manager** |  We recommend that you deploy a VMM server on both the primary site and the secondary site.<br/><br/> You can [replicate between clouds on a single VMM server](site-recovery-vmm-to-vmm.md#prepare-for-single-server-deployment). To replicate between clouds on a single VMM server, you need at least two clouds configured on the VMM server.<br/><br/> VMM servers must be running at least System Center 2012 SP1, with the latest updates.<br/><br/> Each VMM server must have one or more clouds. All clouds must have the Hyper-V Capacity Profile set. <br/><br/>Clouds must have one or more VMM host groups. For more information about setting up VMM clouds, see [Prepare for Azure Site Recovery deployment](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric). |
| **Hyper-V** | Hyper-V servers must be running at least Windows Server 2012 with the Hyper-V role enabled, and have the latest updates installed.<br/><br/> A Hyper-V server must have one or more VMs.<br/><br/>  Hyper-V host servers must be located in host groups in the primary and secondary VMM clouds.<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012 R2, we recommend that you install the update described in Knowledge Base article [2961977](https://support.microsoft.com/kb/2961977).<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012 and have a static IP address-based cluster, a cluster broker isn't automatically created. You must manually configure the cluster broker. For more information about the cluster broker, see [Configure the replica broker role for cluster-to-cluster replication](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx). |
| **Provider** | During Site Recovery deployment, install the Azure Site Recovery provider on VMM servers. The provider communicates with Site Recovery over HTTPS (port 443) to orchestrate replication. Data replication occurs between the primary and secondary Hyper-V servers over the LAN or through a VPN connection.<br/><br/> The provider that's running on the VMM server needs access to the following URLs:<br/><br/>[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)] <br/><br/>The Site Recovery provider must allow firewall communication from the VMM servers to the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and allow the HTTPS (port 443) protocol. |


## URL access
These URLs must be available from VMware, VMM, and Hyper-V host servers:

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
