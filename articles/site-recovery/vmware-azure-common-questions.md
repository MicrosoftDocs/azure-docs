---
title: 'Common questions - VMware to Azure replication with Azure Site Recovery | Microsoft Docs'
description: This article summarizes common questions when you replicate on-premises VMware VMs to Azure using Azure Site Recovery
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.date: 07/19/2018
ms.topic: conceptual
ms.author: raynew

---
# Common questions - VMware to Azure replication

This article provides answers to common questions we see when replicating on-premises VMware VMs to Azure. If you have questions after reading this article, post them on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr).


## General
### How is Site Recovery priced?
Review [Azure Site Recovery pricing](https://azure.microsoft.com/en-in/pricing/details/site-recovery/) details.

### How do I pay for Azure VMs?
During replication, data is replicated to Azure storage, and you don't pay any VM changes. When you run a failover to Azure, Site Recovery automatically creates Azure IaaS virtual machines. After that you're billed for the compute resources that you consume in Azure.

### What can I do with VMware to Azure replication?
- **Disaster recovery**: You can set up full disaster recovery. In this scenario, you replicate on-premises VMware VMs to Azure storage. Then, if your on-premises infrastructure is unavailable, you can fail over to Azure. When you fail over, Azure VMs are created using the replicated data. You can access apps and workloads on the Azure VMs, until your on-premises datacenter is available again. Then, you can fail back from Azure to your on-premises site.
- **Migration**: You can use Site Recovery to migrate on-premises VMware VMs to Azure. In this scenario you replicate on-premises VMware VMs to Azure storage. Then, you fail over from on-premises to Azure. After failover, your apps and workloads are available and running on Azure VMs.



## Azure
### What do I need in Azure?
You need an Azure subscription, a Recovery Services vault, a storage account, and a virtual network. The vault, storage account and network must be in the same region.

### What Azure storage account do I need?
You need an LRS or GRS storage account. We recommend GRS so that data is resilient if a regional outage occurs, or if the primary region can't be recovered. Premium storage is supported.

### Does my Azure account need permissions to create VMs?
If you're a subscription administrator, you have the replication permissions you need. If you're not, you need permissions to create an Azure VM in the resource group and virtual network you specify when you configure Site Recovery, and permissions to write to the selected storage account. [Learn more](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines).



## On-premises

### What do I need on-premises?
On on-premises you need Site Recovery components, installed on a single VMware VM. You also need a VMware infrastructure, with at least one ESXi host, and we recommend a vCenter server. In addition, you need one or more VMware VMs to replicate. [Learn more](vmware-azure-architecture.md) about VMware to Azure architecture.

The on-premises configuration server can be deployed in one of the two following ways

1. Deploy it using a VM template that has the configuration server pre-installed. [Read more here](vmware-azure-tutorial.md#download-the-vm-template).
2. Deploy it using the setup on a Windows Server 2016 machine of your choice. [Read more here](physical-azure-disaster-recovery.md#set-up-the-source-environment).

To discover the getting started steps of deploying the configuration server on your own Windows Server machines, in the Protection goal of enable protection, choose **To Azure > Not virtualized/Other**.

### Where do on-premises VMs replicate to?
Data replicates to Azure storage. When you run a failover, Site Recovery automatically creates Azure VMs from the storage account.

### What apps can I replicate?
You can replicate any app or workload running on a VMware VM that complies with [replication requirements](vmware-physical-azure-support-matrix.md##replicated-machines). Site Recovery provides support for application-aware replication, so that apps can be failed over and failed back to an intelligent state. Site Recovery integrates with Microsoft applications such as SharePoint, Exchange, Dynamics, SQL Server and Active Directory, and works closely with leading vendors, including Oracle, SAP, IBM and Red Hat. [Learn more](site-recovery-workload.md) about workload protection.

### Can I replicate to Azure with a site-to-site VPN?
Site Recovery replicates data from on-premises to Azure storage over a public endpoint, or using ExpressRoute public peering. Replication over a site-to-site VPN network isn't supported.

### Can I replicate to Azure with ExpressRoute?
Yes, ExpressRoute can be used to replicate VMs to Azure. Site Recovery replicates data to an Azure Storage Account over a public endpoint, and you need to set up [public peering](../expressroute/expressroute-circuit-peerings.md#azure-public-peering) for Site Recovery replication. After VMs fail over to an Azure virtual network, you can access them using [private peering](../expressroute/expressroute-circuit-peerings.md#azure-private-peering).


### Why can't I replicate over VPN?

When you replicate to Azure, replication traffic reaches the public endpoints of an Azure Storage account, Thus you can only replicate over the public internet with ExpressRoute (public peering), and VPN doesn't work.



## What are the replicated VM requirements?

For replication, a VMware VM must be running a supported operating system. In addition, the VM must meet the requirements for Azure VMs. [Learn more](vmware-physical-azure-support-matrix.md##replicated-machines) in the support matrix.

## How often can I replicate to Azure?
Replication is continuous when replicating VMware VMs to Azure.

## Can I extend replication?
Extended or chained replication isn't supported. Request this feature in [feedback forum](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6097959-support-for-exisiting-extended-replication).

## Can I do an offline initial replication?
This isn't supported. Request this feature in the [feedback forum](http://feedback.azure.com/forums/256299-site-recovery/suggestions/6227386-support-for-offline-replication-data-transfer-from).

### Can I exclude disks?
Yes, you can exclude disks from replication.

### Can I replicate VMs with dynamic disks?
Dynamic disks can be replicated. The operating system disk must be a basic disk.

### If I use replication groups for multi-VM consistency, can I add a new VM to an existing replication group?
Yes, you can add new VMs to an existing replication group when you enable replication for them. You can't add a VM to an existing replication group after replication is initiated, and you can't create a replication group for existing VMs.

### Can I modify VMs that are replicating by adding or resizing disks?

For VMware replication to Azure you can modify disk size. If you want to add new disks you need to add the disk and reenable protection for the VM.

## Configuration server

### What does the configuration server do?
The configuration server runs the on-premises Site Recovery components, including:
- The configuration server that coordinates communications between on-premises and Azure and manages data replication.
- The process server that acts as a replication gateway. It receives replication data; optimizes it with caching, compression, and encryption; and sends it to Azure storage.,The process server also installs Mobility Service on VMs you want to replicate and performs automatic discovery of on-premises VMware VMs.
- The master target server that handles replication data during failback from Azure.

### Where do I set up the configuration server?
You need a single highly available on-premises VMware VM for the configuration server.

### What are the requirements for the configuration server?

Review the [prerequisites](vmware-azure-deploy-configuration-server.md#prerequisites).

### Can I manually set up the configuration server instead of using a template?
We recommend that you use the latest version of the OVF template to [create the configuration server VM](vmware-azure-deploy-configuration-server.md). If for some reason you can't, for example you don't have access to the VMware server, you can [download the Unified Setup file](physical-azure-set-up-source.md) from the portal, and run it on a VM.

### Can a configuration server replicate to more than one region?
No. To do this, you need to set up a configuration server in each region.

### Can I host a configuration server in Azure?
While possible, the Azure VM running the configuration server would need to communicate with your on-premises VMware infrastructure and VMs. This can add latencies and impact ongoing replication.


### Where can I get the latest version of the configuration server template?
Download the latest version from the [Microsoft Download Center](https://aka.ms/asrconfigurationserver).

### How do I update the configuration server?
You install update rollups. You can find the latest update information in the [wiki updates page](https://social.technet.microsoft.com/wiki/contents/articles/38544.azure-site-recovery-service-updates.aspx).

### Should I backup the deployed configuration server?
We recommend taking regular scheduled backups of the configuration server. For successful failback, the virtual machine being failed back must exist in the configuration server database, and the configuration server must be running and in a connected state. You can learn more about common configuration server management tasks [here](vmware-azure-manage-configuration-server.md).

## Mobility service

### Where can I find the Mobility service installers?
The installers are held in the **%ProgramData%\ASR\home\svsystems\pushinstallsvc\repository** folder on the configuration server.

## How do I install the Mobility service?
You install on each VM you want to replicate, using a [push installation](vmware-azure-install-mobility-service.md#install-mobility-service-by-push-installation-from-azure-site-recovery), or manual installation from [the UI](vmware-azure-install-mobility-service.md#install-mobility-service-manually-by-using-the-gui), or [using PowerShell](vmware-azure-install-mobility-service.md#install-mobility-service-manually-at-a-command-prompt). Alternatively, you can deploy using a deployment tool such as [System Center Configuration Manager](vmware-azure-mobility-install-configuration-mgr.md), or [Azure Automation and DSC](vmware-azure-mobility-deploy-automation-dsc.md).



## Security

### What access does Site Recovery need to VMware servers?
Site Recovery needs access to VMware servers to:

- Set up a VMware VM running the configuration server, and other on-premises Site Recovery components. [Learn more](vmware-azure-deploy-configuration-server.md)
- Automatically discover VMs for replication. Learn about preparing an account for automatic discovery. [Learn more](vmware-azure-tutorial-prepare-on-premises.md#prepare-an-account-for-automatic-discovery)


### What access does Site Recovery need to VMware VMs?

- In order to replicate, an VMware VM must have the Site Recovery Mobility service installed and running. You can deploy the tool manually, or specify that Site Recovery should do a push installation of the service when you enable replication for a VM. For the push installation, Site Recovery needs an account that it can use to install the service component. [Learn more](vmware-azure-tutorial-prepare-on-premises.md#prepare-an-account-for-mobility-service-installation). The process server (running by default on the configuration server) performs this installation. [Learn more](vmware-azure-install-mobility-service.md) about Mobility service installation.
- During replication, VMs communicate with Site Recovery as follows:
    - VMs communicate with the configuration server on port HTTPS 443 for replication management.
    - VMs send replication data to the process server on port HTTPS 9443 (can be modified).
    - If you enable multi-VM consistency, VMs communicate with each other over port 20004.


### Is replication data sent to Site Recovery?
No, Site Recovery doesn't intercept replicated data, and doesn't have any information about what's running on your VMs. Replication data is exchanged between VMware hypervisors and Azure storage. Site Recovery has no ability to intercept that data. Only the metadata needed to orchestrate replication and failover is sent to the Site Recovery service.  

Site Recovery is ISO 27001:2013, 27018, HIPAA, DPA certified, and is in the process of SOC2 and FedRAMP JAB assessments.

### Can we keep on-premises metadata within a geographic regions?
Yes. When you create a vault in a region, we ensure that all metadata used by Site Recovery remains within that region's geographic boundary.

### Does Site Recovery encrypt replication?
Yes, both encryption-in-transit and [encryption in Azure](https://docs.microsoft.com/azure/storage/storage-service-encryption) are supported.


## Failover and failback
### How far back can I recover?
For VMware to Azure the oldest recovery point you can use is 72 hours.

### How do I access Azure VMs after failover?
After failover, you can access Azure VMs over a secure Internet connection, over a site-to-site VPN, or over Azure ExpressRoute. You'll need to prepare a number of things in order to connect. [Learn more](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover)

### Is failed over data resilient?
Azure is designed for resilience. Site Recovery is engineered for failover to a secondary Azure datacenter, in accordance with the Azure SLA. When failover occurs, we make sure your metadata and vaults remain within the same geographic region that you chose for your vault.

### Is failover automatic?
[Failover](site-recovery-failover.md) isn't automatic. You initiate failovers with single click in the portal, or you can use [ PowerShell](/powershell/module/azurerm.siterecovery) to trigger a failover.

### Can I fail back to a different location?
Yes, if you failed over to Azure, you can fail back to a different location if the original one isn't available. [Learn more](concepts-types-of-failback.md#alternate-location-recovery-alr).

### Why do I need a VPN or ExpressRoute to fail back?

When you fail back from Azure, data from Azure is copied back to your on-premises VM and private access is required.



## Automation and scripting

### Can I set up replication with scripting?
Yes. You can automate Site Recovery workflows using the Rest API, PowerShell, or the Azure SDK.[Learn more](vmware-azure-disaster-recovery-powershell.md).

## Performance and capacity
### Can I throttle replication bandwidth?
Yes. [Learn more](site-recovery-plan-capacity-vmware.md).


## Next steps
* [Review](vmware-physical-azure-support-matrix.md) support requirements.
* [Set up](vmware-azure-tutorial.md) VMware to Azure replication.
