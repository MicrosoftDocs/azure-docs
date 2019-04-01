---
title: 'Common questions - VMware to Azure disaster recovery with Azure Site Recovery | Microsoft Docs'
description: This article summarizes common questions when you set up disaster recovery of on-premises VMware VMs to Azure using Azure Site Recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
services: site-recovery
ms.date: 03/21/2019
ms.topic: conceptual
ms.author: raynew
---
# Common questions - VMware to Azure replication

This article provides answers to common questions we see when deploying disaster recovery of on-premises VMware VMs to Azure. If you have questions after reading this article, post them on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr).


## General
### How is Site Recovery priced?
Review [Azure Site Recovery pricing](https://azure.microsoft.com/pricing/details/site-recovery/) details.

### How do I pay for Azure VMs?
During replication, data is replicated to Azure storage, and you don't pay any VM changes. When you run a failover to Azure, Site Recovery automatically creates Azure IaaS virtual machines. After that you're billed for the compute resources that you consume in Azure.

### What can I do with VMware to Azure replication?
- **Disaster recovery**: You can set up full disaster recovery. In this scenario, you replicate on-premises VMware VMs to Azure storage. Then, if your on-premises infrastructure is unavailable, you can fail over to Azure. When you fail over, Azure VMs are created using the replicated data. You can access apps and workloads on the Azure VMs, until your on-premises datacenter is available again. Then, you can fail back from Azure to your on-premises site.
- **Migration**: You can use Site Recovery to migrate on-premises VMware VMs to Azure. In this scenario you replicate on-premises VMware VMs to Azure storage. Then, you fail over from on-premises to Azure. After failover, your apps and workloads are available and running on Azure VMs.

## Azure
### What do I need in Azure?
You need an Azure subscription, a Recovery Services vault, a cache storage account, managed disk(s) and a virtual network. The vault, cache storage account, managed disk(s) and network must be in the same region.

### Does my Azure account need permissions to create VMs?
If you're a subscription administrator, you have the replication permissions you need. If you're not, you need permissions to create an Azure VM in the resource group and virtual network you specify when you configure Site Recovery, and permissions to write to the selected storage account or managed disk based on your configuration. [Learn more](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines).

### Can I use Guest OS server license on Azure?
Yes, Microsoft Software Assurance customers can use [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) to save on licensing costs for **Windows Server machines** that are migrated to Azure, or to use Azure for disaster recovery.

## Pricing

### How are licensing charges handled during replication, after failover?

Please refer to our FAQ on licensing [here](https://aka.ms/asr_pricing_FAQ) for more information.

### How can I calculate approximate charges during the use of Site Recovery?

You can use [pricing calculator](https://aka.ms/asr_pricing_calculator) to estimate costs while using Azure Site Recovery. For detailed estimate on costs, run the deployment planner tool(https://aka.ms/siterecovery_deployment_planner) and analyze the [cost estimation report](https://aka.ms/asr_DP_costreport).

### Is there any difference in cost when I replicate directly to managed disk?

Managed disks are charged slightly different than storage accounts. Please see example below for a source disk of size 100 GiB. The example is specific to differential cost of storage. This cost does not include the cost for snapshots, cache storage and transactions.

* Standard storage account Vs. Standard HDD Managed Disk

    - **Provisioned storage disk by Azure Site Recovery**: S10
    - **Standard storage account charged on consumed volume**: $5 per month
    - **Standard managed disk charged on provisioned volume**: $5.89 per month

* Premium storage account Vs. Premium SSD Managed Disk 
    - **Provisioned storage disk by Azure Site Recovery**: P10
    - **Premium storage account charged on provisioned volume**: $17.92 per month
    - **Premium managed disk charged on provisioned volume**: $17.92 per month

Learn more on [detailed pricing of managed disks](https://azure.microsoft.com/pricing/details/managed-disks/).

### Do I incur additional charges for Cache Storage Account with managed disks?

No, you do not incur additional charges for cache. Cache is always part of VMware to Azure architecture. When you replicate to standard storage account, this cache storage is part of the same target storage account.

### I have been an Azure Site Recovery user for over a month. Do I still get the first 31 days free for every protected instance?

Yes, it does not matter how long you have been using Azure Site Recovery. Every protected instance incurs no Azure Site Recovery charges for the first 31 days. For example, if you have been protecting 10 instances for the last 6 months and you connect an 11th instance to Azure Site Recovery, there will be no Azure Site Recovery charges for the 11th instance for the first 31 days. The first 10 instances continue to incur Azure Site Recovery charges since they have been protected for more than 31 days.

### During the first 31 days, will I incur any other Azure charges?

Yes, even though Azure Site Recovery is free during the first 31 days of a protected instance, you might incur charges for Azure Storage, storage transactions, and data transfer. A recovered virtual machine might also incur Azure compute charges.

### What charges do I incur while using Azure Site Recovery?

Refer to our [FAQ on costs incurred](https://aka.ms/asr_pricing_FAQ) for detailed information.

### Is there a cost associated to perform DR Drills/test failover?

There is no separate cost for DR drill. There will be compute charges after the virtual machine is created post test failover.

## Azure Site Recovery components upgrade

### My Mobility agent/Configuration Server/Process server version is very old and my upgrade has failed. How should I upgrade to latest version?

Azure Site Recovery follows N-4 support model. Refer to our [support statement](https://aka.ms/asr_support_statement) to understand the details on how to upgrade from very old versions.

### Where can I find the release notes/update rollups of Azure Site Recovery?

Refer to the [document](https://aka.ms/asr_update_rollups) for release notes information. You can find installation links of respective components in each update roll-up.

### How should I upgrade Site Recovery components for on-premises VMware or Physical site to Azure?

Refer to our guidance provided [here](https://aka.ms/asr_vmware_upgrades) to upgrade your components.

## Is reboot of source machine mandatory for each upgrade?

Though recommended, it is not mandatory for each upgrade. Refer [here](https://aka.ms/asr_vmware_upgrades) for clear guidelines.

## On-premises

### What do I need on-premises?

On on-premises you need:
- Site Recovery components, installed on a single VMware VM.
- A VMware infrastructure, with at least one ESXi host, and we recommend a vCenter server.
- One or more VMware VMs to replicate.

[Learn more](vmware-azure-architecture.md) about VMware to Azure architecture.

The on-premises configuration server can be deployed as follows:

- We recommend you deploy the configuration server as a VMware VM using an OVA template with the configuration server pre-installed.
- If for any reason you can't use a template, you can set up the configuration server manually. [Learn more](physical-azure-disaster-recovery.md#set-up-the-source-environment).



### Where do on-premises VMs replicate to?
Data replicates to Azure storage. When you run a failover, Site Recovery automatically creates Azure VMs from the storage account or managed disk based on your configuration.

## Replication

### What applications can I replicate?
You can replicate any app or workload running on a VMware VM that complies with [replication requirements](vmware-physical-azure-support-matrix.md##replicated-machines). Site Recovery provides support for application-aware replication, so that apps can be failed over and failed back to an intelligent state. Site Recovery integrates with Microsoft applications such as SharePoint, Exchange, Dynamics, SQL Server and Active Directory, and works closely with leading vendors, including Oracle, SAP, IBM and Red Hat. [Learn more](site-recovery-workload.md) about workload protection.

### Can I protect a virtual machine that has Docker disk configuration?

No, this is an unsupported scenario.

### Can I replicate to Azure with a site-to-site VPN?
Site Recovery replicates data from on-premises to Azure storage over a public endpoint, or using ExpressRoute public peering. Replication over a site-to-site VPN network isn't supported.

### Can I replicate to Azure with ExpressRoute?
Yes, ExpressRoute can be used to replicate VMs to Azure. Site Recovery replicates data to Azure Storage over a public endpoint. You need to set up [public peering](../expressroute/expressroute-circuit-peerings.md#publicpeering) or [Microsoft peering](../expressroute/expressroute-circuit-peerings.md#microsoftpeering) to use ExpressRoute for Site Recovery replication. Microsoft peering is the recommended routing domain for replication. Ensure that the [Networking Requirements](vmware-azure-configuration-server-requirements.md#network-requirements) are also met for replication. After VMs fail over to an Azure virtual network, you can access them using [private peering](../expressroute/expressroute-circuit-peerings.md#privatepeering).

### How can I change storage account after machine is protected?

You need to disable and enable replication to either upgrade or downgrade the storage account type.

### Can I replicate to storage accounts for new machine?

No, beginning Mar'19, you can replicate to managed disks on Azure from the portal. 
Replication to storage accounts for a new machine is only available via REST API and Powershell. Use API version 2016-08-10 or 2018-01-10 for replicating to storage accounts.

### What are the benefits in replicating to managed disks?

Read the article on how [Azure Site Recovery simplifies disaster recovery with managed disks](https://azure.microsoft.com/blog/simplify-disaster-recovery-with-managed-disks-for-vmware-and-physical-servers/).

### How can I change Managed Disk type after machine is protected?

Yes, you can easily change the type of managed disk. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/convert-disk-storage). However, once you change the managed disk type, ensure that you wait for fresh recovery points to be generated if you need to do test failover or failover post this activity.

### Can I switch the replication from managed disks to unmanaged disks?

No, switching from managed to unmanaged is not supported.

### Why can't I replicate over VPN?

When you replicate to Azure, replication traffic reaches the public endpoints of an Azure Storage, Thus you can only replicate over the public internet with ExpressRoute (public peering), and VPN doesn't work.

### Can I use Riverbed SteelHeads for replication?

Our partner, Riverbed, provides a detailed guidance on working with Azure Site Recovery. Please refer their [solution guide](https://community.riverbed.com/s/article/DOC-4627).

### What are the replicated VM requirements?

For replication, a VMware VM must be running a supported operating system. In addition, the VM must meet the requirements for Azure VMs. [Learn more](vmware-physical-azure-support-matrix.md##replicated-machines) in the support matrix.

### How often can I replicate to Azure?
Replication is continuous when replicating VMware VMs to Azure.

### Can I retain the IP address on failover?
Yes, you can retain the IP address on failover. Ensure that you mention the target IP address on 'Compute and Network' blade before failover. Also, ensure to shut down the machines at the time of failover to avoid IP conflicts at the time of failback.

### Can I extend replication?
Extended or chained replication isn't supported. Request this feature in [feedback forum](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6097959).

### Can I do an offline initial replication?
This isn't supported. Request this feature in the [feedback forum](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6227386-support-for-offline-replication-data-transfer-from).

### Can I exclude disks?
Yes, you can exclude disks from replication.

### Can I change the target VM size or VM type before failover?
Yes, you can change the type or size of the VM any time before failover by going to Compute and Network settings of the replication item from the portal.

### Can I replicate VMs with dynamic disks?
Dynamic disks can be replicated. The operating system disk must be a basic disk.

### If I use replication groups for multi-VM consistency, can I add a new VM to an existing replication group?
Yes, you can add new VMs to an existing replication group when you enable replication for them. You can't add a VM to an existing replication group after replication is initiated, and you can't create a replication group for existing VMs.

### Can I modify VMs that are replicating by adding or resizing disks?

For VMware replication to Azure you can modify disk size. If you want to add new disks you need to add the disk and reenable protection for the VM.

### Can I migrate on premises machines to a new Vcenter without impacting ongoing replication?
No, change of Vcenter or migration will impact ongoing replication. You need to set up Azure Site Recovery with the new Vcenter and enable replication for machines.

### Can I replicate to cache/target storage account which has a Vnet (with Azure storage firewalls) configured on it?
No, Azure Site Recovery does not support replication to Storage on Vnet.

## Configuration server

### What does the configuration server do?
The configuration server runs the on-premises Site Recovery components, including:
- The configuration server that coordinates communications between on-premises and Azure and manages data replication.
- The process server that acts as a replication gateway. It receives replication data; optimizes it with caching, compression, and encryption; and sends it to Azure storage.,The process server also installs Mobility Service on VMs you want to replicate and performs automatic discovery of on-premises VMware VMs.
- The master target server that handles replication data during failback from Azure.

[Learn more](vmware-azure-architecture.md) about the configuration server components and processes.

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

### How do I update the configuration server?
[Learn about](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server) updating the configuration server. You can find the latest update information in the [Azure updates page](https://azure.microsoft.com/updates/?product=site-recovery). You can also directly download the latest version of the configuration server from [Microsoft Download Center](https://aka.ms/asrconfigurationserver). If your version is older than 4 versions from current version, refer to our [support statement](https://aka.ms/asr_support_statement) for upgrade guidance.

### Should I backup the deployed configuration server?
We recommend taking regular scheduled backups of the configuration server. For successful failback, the virtual machine being failed back must exist in the configuration server database, and the configuration server must be running and in a connected state. You can learn more about common configuration server management tasks [here](vmware-azure-manage-configuration-server.md).

### When I'm setting up the configuration server, can I download and install MySQL manually?

Yes. Download MySQL and place it in the **C:\Temp\ASRSetup** folder. Then install it manually. When you set up the configuration server VM and accept the terms, MySQL will be listed as **Already installed** in **Download and install**.

### Can I avoid downloading MySQL but let Site Recovery install it?

Yes. Download the MySQL installer and place it in the **C:\Temp\ASRSetup** folder.  When you set up the configuration server VM, accept the terms, and click on **Download and install**, the portal will use the installer you added to install MySQL.
 
### Can I use the configuration server VM for anything else?
No, you should only use the VM for the configuration server. 

### Can I clone a configuration server and use it for orchestration?
No, you should setup a fresh configuration server to avoid registration issues.

### Can I change the vault registered in the configuration server?
No. After a vault is registered with configuration server, it can't be changed. Review [this article](vmware-azure-manage-configuration-server.md#register-a-configuration-server-with-a-different-vault) for re-registration steps.

### Can I use the same configuration server for disaster recovery of both VMware VMs and physical servers
Yes, but note that physical machine can be only be failed back to a VMware VM.

### Where can I download the passphrase for the configuration server?
[Review this article](vmware-azure-manage-configuration-server.md#generate-configuration-server-passphrase) to learn about downloading the passphrase.

### Where can I download vault registration keys?

In the **Recovery Services Vault**, **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**. In **Servers**, select **Download registration key** to download the vault credentials file.



## Mobility service

### Where can I find the Mobility service installers?
The installers are held in the **%ProgramData%\ASR\home\svsystems\pushinstallsvc\repository** folder on the configuration server.

## How do I install the Mobility service?
You install on each VM you want to replicate, using a [push installation](vmware-physical-mobility-service-overview.md#push-installation), or [manual installation](vmware-physical-mobility-service-overview.md#install-mobility-agent-through-ui) from the UI or Powershell. Alternatively, you can deploy using a deployment tool such as [System Center Configuration Manager](vmware-azure-mobility-install-configuration-mgr.md).



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
### Can I use the process server at on-premises for failback?
It is strongly recommended to create a process server in Azure for failback purpose to avoid data transfer latencies. Additionally, in case you separated the source VMs network with the Azure facing network at Configuration server, then it is essential to use the Process Server created in Azure for failback.

### How far back can I recover?
For VMware to Azure the oldest recovery point you can use is 72 hours.

### How do I access Azure VMs after failover?
After failover, you can access Azure VMs over a secure Internet connection, over a site-to-site VPN, or over Azure ExpressRoute. You'll need to prepare a number of things in order to connect. [Learn more](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover)

### Is failed over data resilient?
Azure is designed for resilience. Site Recovery is engineered for failover to a secondary Azure datacenter, in accordance with the Azure SLA. When failover occurs, we make sure your metadata and vaults remain within the same geographic region that you chose for your vault.

### Is failover automatic?
[Failover](site-recovery-failover.md) isn't automatic. You initiate failovers with single click in the portal, or you can use [PowerShell](/powershell/module/azurerm.siterecovery) to trigger a failover.

### Can I fail back to a different location?
Yes, if you failed over to Azure, you can fail back to a different location if the original one isn't available. [Learn more](concepts-types-of-failback.md#alternate-location-recovery-alr).

### Why do I need a VPN or ExpressRoute to fail back?
When you fail back from Azure, data from Azure is copied back to your on-premises VM and private access is required.

### Can I resize the Azure VM after failover?
No, you cannot change the size or type of the target VM after the failover.


## Automation and scripting

### Can I set up replication with scripting?
Yes. You can automate Site Recovery workflows using the Rest API, PowerShell, or the Azure SDK.[Learn more](vmware-azure-disaster-recovery-powershell.md).

## Performance and capacity
### Can I throttle replication bandwidth?
Yes. [Learn more](site-recovery-plan-capacity-vmware.md).


## Next steps
* [Review](vmware-physical-azure-support-matrix.md) support requirements.
* [Set up](vmware-azure-tutorial.md) VMware to Azure replication.
