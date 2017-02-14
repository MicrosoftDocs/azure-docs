---
title: Azure Site Recovery deployment prerequisites | Microsoft Docs
description: This article describes the prerequisites for setting up replication with Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: tysonn

ms.assetid: e24eea6c-50a7-4cd5-aab4-2c5c4d72ee2d
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 12/04/2016
ms.author: raynew
---

# Site Recovery deployment prerequisites

Organizations need a BCDR strategy that determines how apps, workloads, and data stay running and available during planned and unplanned downtime, and recover to normal working conditions as soon as possible. Site Recovery is an Azure service that contributes to your BCDR strategy by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure), or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary location to keep apps and workloads available. You fail back to your primary location when it returns to normal operations. Learn more in [What is Site Recovery?](site-recovery-overview.md)

This article summarizes deployment prerequisites for Site Recovery replication scenarios.  

Post any comments at the bottom of the article, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).



## Azure deployment models

Azure has two different [deployment models](../azure-resource-manager/resource-manager-deployment-model.md) for creating and working with resources: the Azure Resource Manager mode, and the classic model. Azure also has two portals – the [Azure classic portal](https://manage.windowsazure.com/) that supports the classic deployment model, and the [Azure portal](https://ms.portal.azure.com/) with support for both deployment models.

New Site Recovery scenarios should be deployed in the [Azure portal](https://portal.azure.com). This portal provides new features and an improved deployment experience. Vaults can be maintained in the classic portal, but new vaults can't be created.


## Azure account requirements

**Requirement** | **Details**
--- | --- 
**Azure account** | A [Microsoft Azure](http://azure.microsoft.com/) account.<br/><br/> You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing.


## Azure storage requirements

Replicated data is stored in Azure storage, and Azure VMs are created when failover occurs.

**Requirement** | **Details**
--- | --- 
[Azure storage account](../storage/storage-introduction.md) | You can use [GRS](../storage/storage-redundancy.md#geo-redundant-storage) or LRS storage.<br/><br/> We recommend GRS so that data is resilient if a regional outage occurs, or if the primary region can't be recovered. [Learn more](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy)
**Azure portal** | In the Azure portal you can use Resource Manager storage, or a classic storage account.
**Premium storage** | [Premium storage](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage) is supported if you replicate VMware VMs or physical servers to Azure, using the Azure portal.<br/><br/> Premium storage is typically used for virtual machines that need a consistently high IO performance, and low latency to host IO intensive workloads.<br/><br/> If you do use premium storage, you also need a standard storage account to store replication logs that capture ongoing changes to on-premises data.
**Storage limitations** | The classic portal supported GRS only.<br/><br/> Storage accounts created in the Azure portal can't be moved across resource groups.<br/><br/> Replicating to premium storage accounts in Central India and South India isn't currently supported.

## Azure network requirements

You need an Azure network to which Azure VMs will connect when they're created after failover.

**Requirement** | **Details**
--- | ---
**Network region** | The network must be in the same region as the vault.
**Azure portal** | In the Azure portal you can use a Resource Manager network, or a classic network.
**Network mapping** | If you replicate from VMM to Azure, you will set up [network mapping](site-recovery-network-mapping.md) between VMM VM networks and Azure networks, to ensure that Azure VMs connect to appropriate networks after failover.


## VMware replication requirements (to Azure)

**Component** | **Requirement**
--- | ---
**Configuration server** | An on-premises physical or virtual machine running Windows Server 2012 R2. All on-premises Site Recovery components are installed on this machine.<br/><br/>For VMware VM replication, we recommend you deploy the server as a highly available VMware VM. <br/><br/>If the server is a VMware VM, the network adapter type should be VMXNET3. If you use a different type of network adapter, install a [VMware update](https://kb.vmware.com/selfservice/microsites/search.do?cmd=displayKC&docType=kc&externalId=2110245&sliceId=1&docTypeID=DT_KB_1_1&dialogID=26228401&stateId=1) on the vSphere 5.5 server.<br/><br/>The server should have a static IP address.<br/><br/>The server should not be a domain controller.<br/><br/>The host name of the server should contain 15 characters or less.<br/><br/>The operating system should be in English only.<br/><br/> Install VMware vSphere PowerCLI 6.0. server.<br/><br/>The configuration server needs internet access. Outbound access is required as follows:<br/><br/>Temporary access on HTTP 80 during setup of the Site Recovery components (to download MySQL)<br/><br/>Ongoing outbound access on HTTPS 443 for replication management<br/><br/>Ongoing outbound access on HTTPS 9443 for replication traffic (this port can be modified)<br/><br/> Allow this URL for the MySQL download: ``http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi``<br/><br/> The server also needs access to [these URLs](#requirements-for-url-access)
**Process server** | Installed by default on the configuration server<br/><br/> Acts as a replication gateway. It receives replication data from protected source machines, optimizes it with caching, compression, and encryption, and sends the data to Azure storage. It also handles push installation of the Mobility service to protected machines, and performs automatic discovery of VMware VMs. As your deployment grows you can add additional separate dedicated process servers to handle increasing volumes of replication traffic.
**Master target server** | Installed by default on the configuration server. Handles replication data during failback from Azure.
**vSphere hosts** | One or more VMware vSphere hypervisors.<br/><br/>Hypervisors should be running vSphere version 6.0, 5.5 or 5.1, with the latest updates.<br/><br/>We recommend that vSphere hosts and vCenter servers are located in the same network as the process server (this is the network in which the configuration server is located unless you’ve set up a dedicated process server). 
**vCenter servers** | We recommend that you deploy a VMware vCenter server, to manage your vSphere hosts. It should be running vCenter version 6.0 or 5.5, with the latest updates.<br/><br/>**Limitation**: Site Recovery doesn't support new vCenter and vSphere 6.0 features such as cross vCenter vMotion, virtual volumes, and storage DRS. Site Recovery support is limited to features that were also available in version 5.5

### VMware VM requirements (to Azure)

**Component** | **Requirement**
--- | ---
**VMware VMs** | Replicated VMs should have VMware tools installed and running.<br/><br/> VMs should conform with [Azure prerequisites](site-recovery-support-matrix.md#support-for-azure-vms) for creating Azure VMs.<br/><br/>Individual disk capacity on protected machines shouldn’t be more than 1023 GB. A VM can have up to 64 disks (thus up to 64 TB). <br/><br/>Minimum 2 GB of available space on the installation drive for component installation.<br/><br/>**Limitation**: Protection of VMs with encrypted disks is not supported.<br/><br/>**Limitation**: Shared disk guest clusters aren't supported.<br/><br/>**Port 20004** should be opened on the VM local firewall, if you want to enable multi-VM consistency.<br/><br/>Machines that have Unified Extensible Firmware Interface (UEFI)/Extensible Firmware Interface(EFI) boot is not supported.<br/><br/>Machine names should contain between 1 and 63 characters (letters, numbers, and hyphens). The name must start with a letter or number and end with a letter or number. After you've enabled replication for a machine, you can modify the Azure name.<br/><br/>If the source VM has NIC teaming it’s converted to a single NIC after failover to Azure.<br/><br/>If protected virtual machines have an iSCSI disk, then Site Recovery converts the protected VM iSCSI disk into a VHD file when the VM fails over to Azure. If the iSCSI target can be reached by the Azure VM, then it will connect to it and essentially see two disks – the VHD disk on the Azure VM, and the source iSCSI disk. In this case, you’ll need to disconnect the iSCSI target that appears on the Azure VM.
**VMs running Windows** | Windows machines should be running a [supported](site-recovery-support-matrix.md#support-for-replicated-machines) 64-bit operating system.<br/><br/> The operating system should be installed on the C:\ drive.<br/><br/> The OS disk should be a Windows basic disk and not dynamic. The data disk can be dynamic.<br/><br/> Site Recovery supports VMs with an RDM disk. During failback, Site Recovery reuses the RDM disk if the original source VM and RDM disk is available. If they aren’t available, during failback Site Recovery creates a new VMDK file for each disk.
**VMs running Linux** | Linux machines should be running a [supported operating system](site-recovery-support-matrix.md#support-for-replicated-machines).<br/><br/> /etc/hosts files on protected machines should contain entries that map the local host name to IP addresses associated with all network adapters.<br/><br/> The host name, mount points, device names, and Linux system paths and file names (eg /etc/; /usr) should be in English only.<br/><br/> Storage should be [supported](site-recovery-support-matrix.md#support-for-replicated-machines)<br/><br/> Site Recovery supports VMs with an RDM disk.  During failback for Linux, Site Recovery doesn’t reuse the RDM disk. Instead it creates a new VMDK file for each corresponding RDM disk.<br/><br/> Ensure that you set the disk.enableUUID=true setting in the configuration parameters of the VM in VMware. Create the entry if it doesn't exist. It's needed to provide a consistent UUID to the VMDK so that it mounts correctly. Adding this setting also ensures that only delta changes are transferred back to on-premises during failback, and not a full replication.



## Physical servers replication requirements (to Azure)

**Component** | **Requirement**
--- | ---
**Configuration server** | An on-premises physical or virtual machine running Windows Server 2012 R2. All on-premises Site Recovery components are installed on this machine.<br/><br/> For physical machine replication, the machine can be a physical server.<br/><br/>  The configuration server needs internet access. Outbound access is required as follows:<br/><br/> Temporary access on HTTP 80 during setup of the Site Recovery components (to download MySQL)<br/><br/>Ongoing outbound access on HTTPS 443 for replication management<br/><br/>Ongoing outbound access on HTTPS 9443 for replication traffic (this port can be modified)<br/><br/> Allow this URL for the MySQL download: ``http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi``<br/><br/> The server also needs access to [these URLs](#requirements-for-url-access)
**Failback** | Failback from Azure is always to VMware VMs, even if you replicated a physical server. If you don't deploy the configuration server as a VMware VM, you need to set up a VMware VM to receive failback traffic, before you fail back.

### Physical machine requirements (to Azure)

**Component** | **Requirement**
--- | ---
**Physical servers running Windows** | Windows machines should be running a [supported](site-recovery-support-matrix.md#support-for-replicated-machines) 64-bit operating system.<br/><br/> The operating system should be installed on the C:\ drive.<br/><br/> The OS disk should be a Windows basic disk and not dynamic. The data disk can be dynamic.<br/><br/> Site Recovery supports VMs with an RDM disk. During failback, Site Recovery reuses the RDM disk if the original source VM and RDM disk is available. If they aren’t available, during failback Site Recovery creates a new VMDK file for each disk.
**Physical servers running Linux** | Linux machines should be running a [supported operating system](site-recovery-support-matrix.md#support-for-replicated-machines).<br/><br/> /etc/hosts files on protected machines should contain entries that map the local host name to IP addresses associated with all network adapters.<br/><br/> The host name, mount points, device names, and Linux system paths and file names (eg /etc/; /usr) should be in English only.<br/><br/> Storage should be [supported](site-recovery-support-matrix.md#support-for-replicated-machines).

## Hyper-V replication requirements (to Azure)

**Component** | **Requirement**
--- | ---
**VMM (optional)** | You can optionally replicate VMs on Hyper-V hosts managed in VMM clouds.<br/><br/> If you're not using VMM, you gather one or more Hyper-V hosts or clusters into Hyper-V sites, and set up replication for a site.<br/><br/> If you are using VMM, it should be running on System Center 2012 R2.<br/><br/> If you're using VMM, each VMM server should have one or more clouds configured. A cloud should contain one or more VMM host groups, and one or more Hyper-V host servers or clusters in each host group.<br/><br/> The VMM server should be connected to the internet, with access to the [required URLs](#requirements-for-url-access).<br/><br/> If you have IP address-based firewall rules on the VMM server, check that the rules allow communication to Azure.<br/><br/> Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and the HTTPS (443) port.<br/><br/> Allow IP address ranges for the Azure region of your subscription, and for West US.
**Hyper-V hosts** | Hyper-V host servers must be running at least **Windows Server 2012 R2** with the Hyper-V role, or **Microsoft Hyper-V Server 2012 R2**, and have the latest updates installed.<br/><br/> A Hyper-V server should contain one or more VMs.<br/><br/>Hyper-V servers should be connected to the Internet, either directly or via a proxy.<br/><br/>Hyper-V servers should have fixes mentioned in article [2961977](https://support.microsoft.com/kb/2961977) installed.<br/><br/>Hyper-V host servers need internet access for data replication to Azure, including access to the [required URLs](#requirements-for-url-access). In addition, allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and the HTTPS (443) port.<br/><br/> Allow IP address ranges for the Azure region of your subscription, and for West US.<br/><br/> If Hyper-V hosts are in VMM clouds, make sure you install the fix described in [KB 2961977](https://support.microsoft.com/en-us/kb/2961977)

### Hyper-V VM requirements (to Azure)

**Component** | **Requirement**
--- | ---
**VM compliance** |Before you fail over a VM, make sure that the name that is assigned to the Azure VM complies with [Azure prerequisites](site-recovery-best-practices.md#azure-virtual-machine-requirements). You can modify the name after you've enabled replication for the VM.
**Disk** | Individual disk capacity on protected machines shouldn’t be more than 1023 GB. A VM can have up to 64 disks (thus up to 64 TB).<br/><br/> Shared disk guest clusters aren't supported.
**UEFI** | Unified Extensible Firmware Interface (UEFI)/Extensible Firmware Interface(EFI) boot isn't supported.
**NIC teaming** | If the source VM has NIC teaming it’s converted to a single NIC after failover to Azure.
**Linux static** | Protecting Hyper-V VMs running Linux with a static IP address isn't supported.



## VMware/physical servers replication requirements (secondary site)

This scenario is handled by the InMage product, which can be downloaded from the Site Recovery vault when you choose to replicate VMware VMs or physical servers to a secondary site. Note that this scenario isn't available in the Azure portal.

**Component** | **Requirement**
--- | ---
**Primary site** | You need a process server to handle caching, compression, and data optimization. This server also handles push installation of the unified agent that's needed on each machine you want to replicate.<br/><br/> If you want to replicate VMware VMs you need one or more VMware ESX/ESXi servers, and optionally a VMware vCenter server.
**Secondary site** | You need a configuration server set up in the secondary site, to configure and manage your environment.<br/><br/> A master target server is installed in the secondary site, to hold replicated data.<br/><br/> A vContinuum server is installed by default on the master target server, and provides a console to manage and monitor your environment.

### VMware VM/physical machine requirements (secondary site)

Verify the requirements in the [InMage support matrix](https://aka.ms/asr-scout-cm).


## Hyper-V replication requirements (secondary site)

**Component** | **Requirement**
--- | ---
**VMM** | To replicate Hyper-V VMs to a secondary site, Hyper-V host must be managed in System Center VMM clouds. <br/><br/> VMM must be running at least System Center 2012 SP1 with the latest updates.<br/><br/> We recommend a VMM server in the primary site, and another VMM server in the secondary site. You can replicate between [different clouds on the same VMM server](https://docs.microsoft.com/en-us/azure/site-recovery/site-recovery-single-vmm), but some manual configuration will be required in this scenario.<br/><br/> The VMM server should be connected to the internet, with access to the [required URLs](#requirements-for-url-access).<br/><br/> If you have IP address-based firewall rules on the VMM server, check that the rules allow communication to Azure.<br/><br/> Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653) and the HTTPS (443) port.<br/><br/> Allow IP address ranges for the Azure region of your subscription, and for West US.
**Hyper-V** | Hyper-V servers must be running at least Windows Server 2012 with the Hyper-V role, and the latest updates installed.<br/><br/> The Hyper-V server should contain one or more VMs<br/><br/> Hyper-V hosts should be located in host groups on the primary and secondary VMM servers.<br/><br/> If you run Hyper-V in a cluster on Windows Server 2012 R2, you should install update [2961977](https://support.microsoft.com/kb/2961977). If you have a Hyper-V cluster on Windows Server 2012, cluster broker isn't created automatically if you have a static IP address-based cluster. [Read more](http://social.technet.microsoft.com/wiki/contents/articles/18792.configure-replica-broker-role-cluster-to-cluster-replication.aspx) to configure manually.

### Hyper-V VM requirements (secondary site)

**Component** | **Details**
--- | ---
**VMM cloud** | VMs must be located on Hyper-V host in VMM clouds.






## URL access requirements

These URLs should be available from VMware, VMM, and Hyper-V host servers.

**URL** | **VMM to VMM** | **VMM to Azure** | **Hyper-V to Azure** | **VMware to Azure** 
--- | --- | --- | --- | ---
``*.accesscontrol.windows.net`` | Allow | Allow | Allow | Allow
``*.backup.windowsazure.com`` | Not required | Allow | Allow | Allow
``*.hypervrecoverymanager.windowsazure.com`` | Allow | Allow | Allow | Allow
``*.store.core.windows.net`` | Allow | Allow | Allow | Allow
``*.blob.core.windows.net`` | Not required | Allow | Allow | Allow
``https://www.msftncsi.com/ncsi.txt`` | Allow | Allow | Allow | Allow
``https://dev.mysql.com/get/archives/mysql-5.5/mysql-5.5.37-win32.msi`` | Not required | Not required | Not required | Allow for SQL download
``time.windows.com`` | Allow | Allow | Allow | Allow
``time.nist.gov`` | Allow | Allow | Allow | Allow

## Failover requirements

**Scenario** | **Test** | **Planned** | **Unplanned**
--- | --- | --- | ---
VMware to Azure | Supported | Unsupported | Supported
Physical to Azure | Supported | Unsupported | Supported
Hyper-V (VMM) to Azure | Supported | Supported | Supported
Hyper-V (no VMM) to Azure | Supported | Supported | Unsupported
Hyper-V (primary VMM/cloud) to secondary | Supported | Supported | Supported

## Failback requirements

**Scenario** | **Test** | **Planned** | **Unplanned**
--- | --- | --- | ---
**Azure to VMware** | Unsupported | Unsupported | Supported
**Azure to physical** | Unsupported | Unsupported | Supported to VMware only
**Azure to VMM** | Unsupported | Supported | Unsupported
**Azure to Hyper-V (no VMM)** | Unsupported | Supported | Unsupported
**Hyper-V (secondary VMM/cloud) to primary** | Supported | Supported | Supported

### Failback from Azure to VMware VMs

**Component** | **Details**
--- | ---
**Temporary process server in Azure** | If you want to fail back from Azure after failover you'll need to set up an Azure VM configured as a process server, to handle replication from Azure. You can delete this VM after failback finishes.
**VPN connection** | For failback you'll need a VPN connection (or Azure ExpressRoute) set up from the Azure network to the on-premises site.
**Separate on-premises master target server** | The on-premises master target server handles failback. The master target server is installed by default on the management server, but if you're failing back larger volumes of traffic you should set up a separate on-premises master target server for this purpose.



### Failback from Azure to physical machines

**Component** | **Details**
--- | ---
**Physical-to-physical failback** | This isn't supported. This means that if you fail over physical servers to Azure and then want to fail back, you must fail back to a VMware VM. You can't fail back to a physical server.
**VM** | You need a VMware VM on-premises to fail back to.
**Configuration server** | Ff you didn't deploy the on-premises configuration server as a VMware VM, you need to set up a separate master target server as a VMware VM. This is needed because the master target server interacts and attaches to VMware storage to restore the disks to a VMware VM.



## Deployment optimization

Use the following tips to optimize and scale your deployment.

- **Operating system volume size**: When you replicate a virtual machine to Azure the operating system volume must be less than 1TB. If you have more volumes than this you can manually move them to a different disk before you start deployment.
- **Data disk size**: If you're replicating to Azure you can have up to 64 data disks on a virtual machine, each with a maximum of 1 TB. You can effectively replicate and fail over a ~64 TB virtual machine.
- **Recovery plan limits**: Site Recovery can scale to thousands of virtual machines. Recovery plans are designed as a model for applications that should fail over together so we limit the number of machines in a recovery plan to 50.
- **Azure service limits**: Every Azure subscription comes with a set of default limits on cores, cloud services etc. We recommend that you run a test failover to validate the availability of resources in your subscription. You can modify these limits via Azure support.
- **Capacity planning**: Read about [capacity planning](site-recovery-capacity-planner.md) for Site Recovery.
- **Replication bandwidth**: If you're short on replication bandwidth note that:
- **ExpressRoute**: Site Recovery works with Azure ExpressRoute and WAN optimizers such as Riverbed. [Read more](http://blogs.technet.com/b/virtualization/archive/2014/07/20/expressroute-and-azure-site-recovery.aspx) about ExpressRoute.
- **Replication traffic**: Site Recovery uses performs a smart initial replication using only data blocks and not the entire VHD. Only changes are replicated during ongoing replication.
- **Network traffic**: You can control network traffic used for replication by setting up [Windows QoS](https://technet.microsoft.com/library/hh967468.aspx) with a policy based on the destination IP address and port.  In addition, if you're replicating to Azure Site Recovery using the Azure Backup agent you can configure throttling for that agent. [Read more](https://support.microsoft.com/kb/3056159).
- **RTO**: To measure the recovery time objective (RTO) you can expect with Site Recovery we suggest you run a test failover and view the Site Recovery jobs to analyze how much time it takes to complete the operations. If you're failing over to Azure, for the best RTO we recommend that you automate all manual actions by integrating with Azure automation and recovery plans.
- **RPO**: Site Recovery supports a near-synchronous recovery point objective (RPO) when you replicate to Azure. This assumes sufficient bandwidth between your datacenter and Azure.



## Next steps
After reviewing general deployment requirements, read the detailed prerequisites and deploy a scenario.

* [Replicate VMware virtual machines to Azure](site-recovery-vmware-to-azure.md)
* [Replicate physical servers to Azure](site-recovery-vmware-to-azure.md)
* [Replicate Hyper-V server in VMM clouds to Azure](site-recovery-vmm-to-azure.md)
* [Replicate Hyper-V virtual machines (without VMM) to Azure](site-recovery-hyper-v-site-to-azure.md)
* [Replicate Hyper-V VMs to a secondary site](site-recovery-vmm-to-vmm.md)
* [Replicate Hyper-V VMs to a secondary site with SAN](site-recovery-vmm-san.md)
* [Replicate Hyper-V VMs with a single VMM server](site-recovery-single-vmm.md)
