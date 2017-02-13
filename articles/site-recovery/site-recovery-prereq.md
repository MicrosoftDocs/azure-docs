---
title: Prerequisites for replication using Azure Site Recovery | Microsoft Docs
description: This article summarizes prerequisites for replicating VMs and physical machines to Azure using the Azure Site Recovery service.
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
ms.date: 12/11/2016
ms.author: rajanaki
---

#  Prerequisites for replication using Azure Site Recovery

 Site Recovery is an Azure service that contributes to your BCDR strategy by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure), or to a secondary datacenter. When outages occur in your primary location, you can fail over to a secondary location to keep apps and workloads available. You can failback to your primary location when it returns to normal operations. Learn more in [What is Site Recovery?](site-recovery-overview.md)

This article summarizes the prerequisites required to begin Site Recovery replication to Azure.

Post any comments at the bottom of the article, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Azure requirements

**Requirement** | **Details**
--- | ---
**Azure account** | A [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
**Site Recovery service** | [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing. |
**Azure storage** | You need an Azure storage account to store replicated data and it must be in the same region as the Recovery Services vault. Replicated data is stored in Azure storage, and Azure VMs are created when failover occurs.<br/><br/> Depending on the resource model you want to use for failed over Azure VMs, you can set up an account in [Resource Manager model](../storage/storage-create-storage-account.md) or [Classic model](../storage/storage-create-storage-account-classic-portal.md).<br></br>You can use [GRS](../storage/storage-redundancy.md#geo-redundant-storage) or LRS storage. We recommend GRS so that data is resilient if a regional outage occurs, or if the primary region can't be recovered.<br/><br/> If you replicate VMware VMs or physical servers in the Azure portal, premium storage is supported. [Premium storage](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage) is typically used for virtual machines that need a consistently high IO performance, and low latency to host IO intensive workloads. If you use premium storage for replicated data, you also need a standard storage account to store replication logs that capture ongoing changes to on-premises data.<br/><br/>
**Storage limitations** | You can't move storage accounts used in Site Recovery across resource groups, within or across subscriptions.<br/><br/> Replicating to premium storage accounts in Central India and South India isn't currently supported.
**Azure network** | You need an Azure network to which Azure VMs will connect to, after failover and it must be in the same region as the Recovery Services vault.<br/><br/> In the Azure portal, you can create networks in the [Resource Manager model](../virtual-network/virtual-networks-create-vnet-arm-pportal.md) or [classic model](../virtual-network/virtual-networks-create-vnet-classic-pportal.md).<br/><br/> If you replicate from VMM to Azure, you will set up [network mapping](site-recovery-network-mapping.md) between VMM VM networks and Azure networks, to ensure that Azure VMs connect to appropriate networks after failover.
**Network limitations** | You can't move network accounts used in Site Recovery across resource groups, within or across subscriptions.
**Network mapping** | If you replicate Hyper-V VMs in VMM clouds, you need to set up [network mapping](site-recovery-network-mapping.md), so that Azure VMs are connected to appropriate networks when they're created after failover.

>[!NOTE]
>The below sections describe the prerequisites for various components in the customer environment. For more information on support for specific configurations, please read the [support matrix.](site-recovery-support-matrix.md)
>

## Disaster Recovery of VMware virtual machines or physical Windows/Linux servers to Azure
Below are the required components that are needed for disaster recovery of VMware virtual machines or physical Windows/Linux servers in addition to the ones mentioned [above.](#Azure requirements)


1. **Configuration server or additional process server**: You will need to set up an on-premises machine as the configuration server to coordinate communications between the on-premises site and Azure, and to manage data replication. <br></br>

2. **VMware vCenter/vSphere host**

| **Component** | **Requirements** |
| --- | --- |
| **vSphere** | One or more VMware vSphere hypervisors.<br/><br/>Hypervisors should be running vSphere version 6.0, 5.5 or 5.1, with the latest updates.<br/><br/>We recommend that vSphere hosts and vCenter servers are located in the same network as the process server (this is the network in which the configuration server is located unless you’ve set up a dedicated process server). |
| **vCenter** | We recommend that you deploy a VMware vCenter server, to manage your vSphere hosts. It should be running vCenter version 6.0 or 5.5, with the latest updates.<br/><br/>**Limitation**: Site Recovery doesn't support new vCenter and vSphere 6.0 features such as cross vCenter vMotion, virtual volumes, and storage DRS. Site Recovery support is limited to features that were also available in version 5.5.||

3.**Replicated machine prerequisites**


| **Component** | **Requirements** |
| --- | --- |
| **On-premises (VMware VMs)** | Replicated VMs should have VMware tools installed and running.<br/><br/> VMs should conform with [Azure prerequisites](site-recovery-best-practices.md#azure-virtual-machine-requirements) for creating Azure VMs.<br/><br/>Individual disk capacity on protected machines shouldn’t be more than 1023 GB. <br/><br/>Minimum 2 GB of available space on the installation drive for component installation.<br/><br/>**Port 20004** should be opened on the VM local firewall, if you want to enable multi-VM consistency.<br/><br/>Machine names should contain between 1 and 63 characters (letters, numbers, and hyphens). The name must start with a letter or number and end with a letter or number. After you've enabled replication for a machine, you can modify the Azure name.<br/><br/> |
| **Windows machines (physical or VMware)** | The machine should be running a supported 64-bit operating system: Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 with at least SP1.<br/><br/> The operating system should be installed on the C:\ drive. The OS disk should be a Windows basic disk and not dynamic. The data disk can be dynamic.<br/><br/>|
| **Linux machines** (physical or VMware) | You need a supported 64-bit operating system: Red Hat Enterprise Linux 6.7,7.1,7.2; Centos 6.5, 6.6,6.7,7.0,7.1,7.2; Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3), SUSE Linux Enterprise Server 11 SP3.<br/><br/>/etc/hosts files on protected machines should contain entries that map the local host name to IP addresses associated with all network adapters.<br/><br/>If you want to connect to an Azure virtual machine running Linux after failover using a Secure Shell client (ssh), ensure that the Secure Shell service on the protected machine is set to start automatically on system boot, and that firewall rules allow an ssh connection to it.<br/><br/>The host name, mount points, device names, and Linux system paths and file names (eg /etc/; /usr) should be in English only.<br/><br/>

## Disaster Recovery of Hyper-V virtual machines to Azure (no VMM)

Below are the required components that are needed for disaster recovery of Hyper-V virtual machines in VMM clouds  in addition to the ones mentioned [above.](#Azure requirements)

| **Prerequisite** | **Details** |
| --- | --- |
| **Hyper-V host** |One or more on-premises servers running Windows Server 2012 R2 with latest updates and the Hyper-V role enabled or Microsoft Hyper-V Server 2012 R2.<br></br>The Hyper-V server should contain one or more virtual machines.<br></br>Hyper-V servers should be connected to the Internet, either directly or via a proxy.<br></br>Hyper-V servers should have fixes mentioned in [KB2961977](https://support.microsoft.com/en-us/kb/2961977) installed.
|**Provider and agent**| During Azure Site Recovery deployment you’ll install the Azure Site Recovery Provider. The Provider installation will also install the Azure Recovery Services Agent on each Hyper-V server running virtual machines you want to protect. <br></br>All Hyper-V servers in a Site Recovery vault should have the same versions of the Provider and agent.<br></br>The Provider will need to connect to Azure Site Recovery over the Internet. Traffic can be sent directly or through a proxy. Note that HTTPS based proxy is not supported. The proxy server should allow access to:<br/><br/> [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]<br/><br/>If you have IP address-based firewall rules on the server, check that the rules allow communication to Azure.<br></br> Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.<br></br> Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).


## Disaster Recovery of Hyper-V virtual machines in VMM clouds to Azure

Below are the required components that are needed for disaster recovery of Hyper-V virtual machines in VMM clouds  in addition to the ones mentioned [above.](#Azure requirements)

| **Prerequisite** | **Details** |
| --- | --- |
| **VMM** |One or more VMM servers running on **System Center 2012 R2 or above**. Each VMM server should have one or more clouds configured. <br></br>A cloud should contain<br>- One or more VMM host groups.<br/>- One or more Hyper-V host servers or clusters in each host group.<br/><br/>[Learn more](http://social.technet.microsoft.com/wiki/contents/articles/2729.how-to-create-a-cloud-in-vmm-2012.aspx) about setting up VMM clouds. |
| **Hyper-V** |Hyper-V host servers must be running at least **Windows Server 2012 R2** with Hyper-V role or **Microsoft Hyper-V Server 2012 R2** and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/> A Hyper-V host server or cluster that includes VMs you want to replicate must be managed in a VMM cloud.<br/><br/>Hyper-V servers should be connected to the Internet, either directly or via a proxy.<br/><br/>Hyper-V servers should have fixes mentioned in article [2961977](https://support.microsoft.com/kb/2961977) installed.<br/><br/>Hyper-V host servers need internet access for data replication to Azure. |
| **Provider and agent** |During Azure Site Recovery deployment, you install the Azure Site Recovery Provider on the VMM server, and the Recovery Services agent on Hyper-V hosts. The Provider and agent need to connect to Azure over the internet directly, or through a proxy. An HTTPS-based proxy isn't supported. The proxy server on the VMM server and Hyper-V hosts should allow access to: <br/><br/>[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)] <br/><br/>If you have IP address-based firewall rules on the VMM server, check that the rules allow communication to Azure.<br/><br/> Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and the HTTPS (443) port.<br/><br/> Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).<br/><br/> |

### Replicated machine prerequisites
| **Component** | **Details** |
| --- | --- |
| **Protected VMs** | Site Recovery supports all operating systems that are supported by [Azure](https://technet.microsoft.com/library/cc794868%28v=ws.10%29.aspx).<br></br>VMs should conform with [Azure prerequisites](site-recovery-best-practices.md#azure-virtual-machine-requirements) for creating Azure VMs. Machine names should contain between 1 and 63 characters (letters, numbers, and hyphens). The name must start with a letter or number and end with a letter or number. <br></br>You can modify the name after you've enabled replication for the VM. <br/><br/> Individual disk capacity on protected machines shouldn’t be more than 1023 GB. A VM can have up to 16 disks (thus up to 16 TB).<br/><br/>


## Disaster Recovery of Hyper-V virtual machines in VMM clouds to a customer owned site

Below are the required components that are needed for disaster recovery of Hyper-V virtual machines in VMM clouds to a customer owned site, in addition to the ones mentioned [above.](#Azure requirements)

| **Components** | **Details** |
| --- | --- |
| **VMM** |  We recommend you deploy a VMM server in the primary site and a VMM server in the secondary site.<br/><br/> You can [replicate between clouds on a single VMM server](site-recovery-single-vmm.md). To do this you need at least two clouds configured on the VMM server.<br/><br/> VMM servers should be running **at least System Center 2012 SP1** with the latest updates.<br/><br/> Each VMM server must have at least one or more clouds. All clouds must have the Hyper-V Capacity profile set. <br/><br/>Clouds must contain one or more VMM host groups. [Learn more](https://msdn.microsoft.com/library/azure/dn469075.aspx#BKMK_Fabric) about setting up VMM clouds.<br/><br/> VMM servers need internet access. |
| **Hyper-V** | Hyper-V servers must be running **at least Windows Server 2012 with the Hyper-V role**, and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/>  Hyper-V host servers should be located in host groups in the primary and secondary VMM clouds.<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012 R2, you should install [update 2961977](https://support.microsoft.com/kb/2961977)<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012, note that cluster broker isn't created automatically if you have a static IP address-based cluster. You need to configure the cluster broker manually. [Read more](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx). |
| **Provider** | During Site Recovery deployment, you install the Azure Site Recovery Provider on VMM servers. The Provider communicates with Site Recovery over HTTPS 443, to orchestrate replication. Data replication occurs between the primary and secondary Hyper-V servers, over the LAN or a VPN connection.<br/><br/> The Provider running on the VMM server needs access to these URLs:<br/><br/>[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)] <br/><br/>Allow firewall communication from the VMM servers to the [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and allow the HTTPS (443) protocol. |
