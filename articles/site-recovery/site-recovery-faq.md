---
title: General questions about the Azure Site Recovery service
description: This article discusses popular general questions about Azure Site Recovery.
ms.topic: conceptual
ms.date: 1/24/2020
ms.author: raynew

---
# General questions about Azure Site Recovery

This article summarizes frequently asked questions about Azure Site Recovery. For specific scenarios review these articles

- [Questions about Azure VM disaster recovery to Azure](azure-to-azure-common-questions.md)
- [Questions about VMware VM disaster recovery to Azure](vmware-azure-common-questions.md)
- [Questions about Hyper-V VM disaster recovery to Azure](hyper-v-azure-common-questions.md)
 
## General

### What does Site Recovery do?
Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy, by orchestrating and automating replication of Azure VMs between regions, on-premises virtual machines and physical servers to Azure, and on-premises machines to a secondary datacenter. [Learn more](site-recovery-overview.md).

### Can I protect a virtual machine that has a Docker disk?

No, this is an unsupported scenario.

## Service providers

### I'm a service provider. Does Site Recovery work for dedicated and shared infrastructure models?
Yes, Site Recovery supports both dedicated and shared infrastructure models.

### For a service provider, is the identity of my tenant shared with the Site Recovery service?
No. Tenant identity remains anonymous. Your tenants don't need access to the Site Recovery portal. Only the service provider administrator interacts with the portal.

### Will tenant application data ever go to Azure?
When replicating between service provider-owned sites, application data never goes to Azure. Data is encrypted in-transit, and replicated directly between the service provider sites.

If you're replicating to Azure, application data is sent to Azure storage but not to the Site Recovery service. Data is encrypted in-transit, and remains encrypted in Azure.

### Will my tenants receive a bill for any Azure services?
No. Azure's billing relationship is directly with the service provider. Service providers are responsible for generating specific bills for their tenants.

### If I'm replicating to Azure, do we need to run virtual machines in Azure at all times?
No, Data is replicated to Azure storage in your subscription. When you perform a test failover (DR drill) or an actual failover, Site Recovery automatically creates virtual machines in your subscription.

### Do you ensure tenant-level isolation when I replicate to Azure?
Yes.

### What platforms do you currently support?
We support Azure Pack, Cloud Platform System, and System Center based (2012 and higher) deployments. [Learn more](https://technet.microsoft.com/library/dn850370.aspx) about Azure Pack and Site Recovery integration.

### Do you support single Azure Pack and single VMM server deployments?
Yes, you can replicate Hyper-V virtual machines to Azure, or between service provider sites.  Note that if you replicate between service provider sites, Azure runbook integration isn't available.

## Pricing

### Where can I find pricing information?
Review [Site Recovery pricing](https://azure.microsoft.com/pricing/details/site-recovery/) details.


### How can I calculate approximate charges during the use of Site Recovery?

You can use the [pricing calculator](https://aka.ms/asr_pricing_calculator) to estimate costs while using Site Recovery.

For detailed estimate on costs, run the deployment planner tool for [VMware](https://aka.ms/siterecovery_deployment_planner) or [Hyper-V](https://aka.ms/asr-deployment-planner), and use the [cost estimation report](https://aka.ms/asr_DP_costreport).


### Managed disks are now used to replicate VMware VMs and physical servers. Do I incur additional charges for the cache storage account with managed disks?

No, there are no additional charges for cache. When you replicate to standard storage account, this cache storage is part of the same target storage account.

### I have been an Azure Site Recovery user for over a month. Do I still get the first 31 days free for every protected instance?

Yes. Every protected instance incurs no Azure Site Recovery charges for the first 31 days. For example, if you have been protecting 10 instances for the last 6 months and you connect an 11th instance to Azure Site Recovery, there are no charges for the 11th instance for the first 31 days. The first 10 instances continue to incur Azure Site Recovery charges since they've been protected for more than 31 days.

### During the first 31 days, will I incur any other Azure charges?

Yes, even though Site Recovery is free during the first 31 days of a protected instance, you might incur charges for Azure Storage, storage transactions, and data transfer. A recovered virtual machine might also incur Azure compute charges.


### Is there a cost associated to perform disaster recovery drills/test failover?

There is no separate cost for DR drill. There will be compute charges after the VM is created after the test failover.



## Security

### Is replication data sent to the Site Recovery service?
No, Site Recovery doesn't intercept replicated data, and doesn't have any information about what's running on your virtual machines or physical servers.
Replication data is exchanged between on-premises Hyper-V hosts, VMware hypervisors, or physical servers and Azure storage or your secondary site. Site Recovery has no ability to intercept that data. Only the metadata needed to orchestrate replication and failover is sent to the Site Recovery service.  

Site Recovery is ISO 27001:2013, 27018, HIPAA, DPA certified, and is in the process of SOC2 and FedRAMP JAB assessments.

### For compliance reasons, even our on-premises metadata must remain within the same geographic region. Can Site Recovery help us?
Yes. When you create a Site Recovery vault in a region, we ensure that all metadata that we need to enable and orchestrate replication and failover remains within that region's geographic boundary.

### Does Site Recovery encrypt replication?
For virtual machines and physical servers, replicating between on-premises sites encryption-in-transit is supported. For virtual machines and physical servers replicating to Azure, both encryption-in-transit and [encryption-at-rest (in Azure)](https://docs.microsoft.com/azure/storage/storage-service-encryption) are supported.

### Does Azure-to-Azure Site Recovery use TLS 1.2 for all communications across microservices of Azure?
Yes, TLS 1.2 protocol is enforced by default for Azure-to-Azure Site Recovery scenario. 

### How can I enforce TLS 1.2 on VMware-to-Azure and Physical Server-to-Azure Site Recovery scenarios?
Mobility agents installed on the replicated items communicate to Process Server only on TLS 1.2. However, communication from Configuration Server to Azure and from Process Server to Azure could be on TLS 1.1 or 1.0. Please follow the [guidance](https://support.microsoft.com/en-us/help/3140245/update-to-enable-tls-1-1-and-tls-1-2-as-default-secure-protocols-in-wi) to enforce TLS 1.2 on all Configuration Servers and Process Servers set up by you.

### How can I enforce TLS 1.2 on HyperV-to-Azure Site Recovery scenarios?
All communication between the microservices of Azure Site Recovery happens on TLS 1.2 protocol. Site Recovery uses security providers configured in the system (OS) and uses the latest available TLS protocol. One will need to explicitly enable the TLS 1.2 in the Registry and then Site Recovery will start using TLS 1.2 for communication with services. 

## Disaster recovery

### What can Site Recovery protect?
* **Azure VMs**: Site Recovery can replicate any workload running on a supported Azure VM
* **Hyper-V virtual machines**: Site Recovery can protect any workload running on a Hyper-V VM.
* **Physical servers**: Site Recovery can protect physical servers running Windows or Linux.
* **VMware virtual machines**: Site Recovery can protect any workload running in a VMware VM.

### What workloads can I protect with Site Recovery?
You can use Site Recovery to protect most workloads running on a supported VM or physical server. Site Recovery provides support for application-aware replication, so that apps can be recovered to an intelligent state. It integrates with Microsoft applications such as SharePoint, Exchange, Dynamics, SQL Server and Active Directory, and works closely with leading vendors, including Oracle, SAP, IBM and Red Hat. [Learn more](site-recovery-workload.md) about workload protection.

### Can I manage disaster recovery for my branch offices with Site Recovery?
Yes. When you use Site Recovery to orchestrate replication and failover in your branch offices, you'll get a unified orchestration and view of all your branch office workloads in a central location. You can easily run failovers and administer disaster recovery of all branches from your head office, without visiting the branches.


### Is disaster recovery supported for Azure VMs?

Yes, Site Recovery supports disaster for Azure VMs between Azure regions. [Review common questions](azure-to-azure-common-questions.md) about Azure VM disaster recovery. If you want to replicate between two Azure regions on the same continent, please use our Azure to Azure DR offering. No need to set up configuration server/process server and ExpressRoute connections.

### Is disaster recovery supported for VMware VMs?

Yes, Site Recovery supports disaster recovery of on-premises VMware VMs. [Review common questions](vmware-azure-common-questions.md) for disaster recovery of VMware VMs.

### Is disaster recovery supported for Hyper-V VMs?
Yes, Site Recovery supports disaster recovery of on-premises Hyper-V VMs. [Review common questions](hyper-v-azure-common-questions.md) for disaster recovery of Hyper-V VMs.

## Is disaster recovery supported for physical servers?
Yes, Site Recovery supports disaster recovery of on-premises physical servers running Windows and Linux to Azure or to a secondary site. Learn about requirements for disaster recovery to [Azure](vmware-physical-azure-support-matrix.md#replicated-machines), and to[a secondary site](vmware-physical-secondary-support-matrix.md#replicated-vm-support).
Note that physical servers will run as VMs in Azure after failover. Failback from Azure to an on-premises physical server isn't currently supported. You can only fail back to a VMware virtual machine.





## Replication

### Can I replicate over a site-to-site VPN to Azure?
Azure Site Recovery replicates data to an Azure storage account or managed disks, over a public endpoint. Replication isn't over a site-to-site VPN. 

### Why can't I replicate over VPN?

When you replicate to Azure, replication traffic reaches the public endpoints of an Azure Storage. Thus you can only replicate over the public internet or via ExpressRoute (Microsoft peering or an existing public peering).

### Can I use Riverbed SteelHeads for replication?

Our partner, Riverbed, provides detailed guidance on working with Azure Site Recovery. Review their [solution guide](https://community.riverbed.com/s/article/DOC-4627).

### Can I use ExpressRoute to replicate virtual machines to Azure?
Yes, [ExpressRoute can be used](concepts-expressroute-with-site-recovery.md) to replicate on-premises virtual machines to Azure.

- Azure Site Recovery replicates data to an Azure Storage over a public endpoint. You need to set up [Microsoft peering](../expressroute/expressroute-circuit-peerings.md#microsoftpeering) or use an existing [public peering](../expressroute/about-public-peering.md) (deprecated for new circuits)  to use ExpressRoute for Site Recovery replication.
- Microsoft peering is the recommended routing domain for replication.
- Replication is not supported over private peering.
- If you're protecting VMware machines or physical machines, ensure that the [Networking Requirements](vmware-azure-configuration-server-requirements.md#network-requirements) for Configuration Server are also met. Connectivity to specific URLs is required by Configuration Server for orchestration of Site Recovery replication. ExpressRoute cannot be used for this connectivity.
- After the virtual machines have been failed over to an Azure virtual network you can access them using the [private peering](../expressroute/expressroute-circuit-peerings.md#privatepeering) setup with the Azure virtual network.


### If I replicate to Azure, what kind of storage account or managed disk do I need?

You need an LRS or GRS storage. We recommend GRS so that data is resilient if a regional outage occurs, or if the primary region can't be recovered. The account must be in the same region as the Recovery Services vault. Premium storage is supported for VMware VM, Hyper-V VM, and physical server replication, when you deploy Site Recovery in the Azure portal. Managed disks only support LRS.

### How often can I replicate data?
* **Hyper-V:** Hyper-V VMs can be replicated every 30 seconds (except for premium storage), five minutes or 15 minutes.
* **Azure VMs, VMware VMs, physical servers:** A replication frequency isn't relevant here. Replication is continuous.

### Can I extend replication from existing recovery site to another tertiary site?
Extended or chained replication isn't supported. Request this feature in [feedback forum](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6097959).

### Can I do an offline replication the first time I replicate to Azure?
This isn't supported. Request this feature in the [feedback forum](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6227386-support-for-offline-replication-data-transfer-from).

### Can I exclude specific disks from replication?
This is supported when you're replicating VMware VMs and Hyper-V VMs to Azure, using the Azure portal.

### Can I replicate virtual machines with dynamic disks?
Dynamic disks are supported when replicating Hyper-V virtual machines, and when replicating VMware VMs and physical machines to Azure. The operating system disk must be a basic disk.


### Can I throttle bandwidth allotted for replication traffic?
Yes. You can read more about throttling bandwidth in these articles:

* [Capacity planning for replicating VMware VMs and physical servers](site-recovery-plan-capacity-vmware.md)
* [Capacity planning for replicating Hyper-V VMs to Azure](site-recovery-capacity-planning-for-hyper-v-replication.md)

### Can I enable replication with app-consistency in Linux servers? 
Yes. Azure Site Recovery for Linux Operation System supports application custom scripts for app-consistency. The custom script with pre and post-options will be used by the Azure Site Recovery Mobility Agent during app-consistency. Below are the steps to enable it.

1. Sign in as root into the machine.
2. Change directory to Azure Site Recovery Mobility Agent install location. Default is "/usr/local/ASR"<br>
    `# cd /usr/local/ASR`
3. Change directory to "VX/scripts" under install location<br>
    `# cd VX/scripts`
4. Create a bash shell script named "customscript.sh" with execute permissions for root user.<br>
    a. The script should support "--pre" and "--post" (Note the double dashes) command-line options<br>
    b. When the script is called with pre-option, it should freeze the application input/output and when called with post-option, it should thaw the application input/output.<br>
    c. A sample template -<br>

    `# cat customscript.sh`<br>

```
    #!/bin/bash

    if [ $# -ne 1 ]; then
        echo "Usage: $0 [--pre | --post]"
        exit 1
    elif [ "$1" == "--pre" ]; then
        echo "Freezing app IO"
        exit 0
    elif [ "$1" == "--post" ]; then
        echo "Thawed app IO"
        exit 0
    fi
```

5. Add the freeze and unfreeze input/output commands in pre and post-steps for the applications requiring app-consistency. You can choose to add another script specifying those and invoke it from "customscript.sh" with pre and post-options.

>[!Note]
>The Site Recovery agent version should be 9.24 or above to support custom scripts.

## Failover
### If I'm failing over to Azure, how do I access the Azure VMs after failover?

You can access the Azure VMs over a secure Internet connection, over a site-to-site VPN, or over Azure ExpressRoute. You need to prepare a number of things in order to connect. [Learn more](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover).


### If I fail over to Azure how does Azure make sure my data is resilient?
Azure is designed for resilience. Site Recovery is already engineered for failover to a secondary Azure datacenter, in accordance with the Azure SLA. If this happens, we make sure your metadata and vaults remain within the same geographic region that you chose for your vault.  

### If I'm replicating between two datacenters what happens if my primary datacenter experiences an unexpected outage?
You can trigger an unplanned failover from the secondary site. Site Recovery doesn't need connectivity from the primary site to perform the failover.

### Is failover automatic?
Failover isn't automatic. You initiate failovers with single click in the portal, or you can use [Site Recovery PowerShell](/powershell/module/az.recoveryservices) to trigger a failover. Failing back is a simple action in the Site Recovery portal.

To automate you could use on-premises Orchestrator or Operations Manager to detect a virtual machine failure, and then trigger the failover using the SDK.

* [Read more](site-recovery-create-recovery-plans.md) about recovery plans.
* [Read more](site-recovery-failover.md) about failover.
* [Read more](site-recovery-failback-azure-to-vmware.md) about failing back VMware VMs and physical servers

### If my on-premises host is not responding or crashed, can I fail back to a different host?
Yes, you can use the alternate location recovery to failback to a different host from Azure.

* [For VMware virtual machines](concepts-types-of-failback.md#alternate-location-recovery-alr)
* [For Hyper-V virtual machines](hyper-v-azure-failback.md#fail-back-to-an-alternate-location)

## Automation

### Can I automate Site Recovery scenarios with an SDK?
Yes. You can automate Site Recovery workflows using the Rest API, PowerShell, or the Azure SDK. Currently supported scenarios for deploying Site Recovery using PowerShell:

* [Replicate Hyper-V VMs in VMMs clouds to Azure PowerShell Resource Manager](hyper-v-vmm-powershell-resource-manager.md)
* [Replicate Hyper-V VMs without VMM to Azure PowerShell Resource Manager](hyper-v-azure-powershell-resource-manager.md)
* [Replicate VMware to Azure with PowerShell Resource Manager](vmware-azure-disaster-recovery-powershell.md)

## Component/provider upgrade

### Where can I find the release notes/update rollups of Site Recovery upgrades

[Learn](site-recovery-whats-new.md) about new updates, and [get rollup information](service-updates-how-to.md).

## Next steps
* Read the [Site Recovery overview](site-recovery-overview.md)

