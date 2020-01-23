---
title: Common questions about VMware disaster recovery with Azure Site Recovery 
description: Get answers to common questions about disaster recovery of on-premises VMware VMs to Azure by using Azure Site Recovery.
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.date: 11/14/2019
ms.topic: conceptual
ms.author: raynew
---
# Common questions about VMware to Azure replication

This article answers common questions that might come up when you deploy disaster recovery of on-premises VMware virtual machines (VMs) to Azure.

## General

### What do I need for VMware VM disaster recovery?

[Learn about the components involved](vmware-azure-architecture.md) in disaster recovery of VMware VMs.

### Can I use Site Recovery to migrate VMware VMs to Azure?

Yes. In addition to using Site Recovery to set up full disaster recovery for VMware VMs, you can also use Site Recovery to migrate on-premises VMware VMs to Azure. In this scenario, you replicate on-premises VMware VMs to Azure Storage. Then, you fail over from on-premises to Azure. After failover, your apps and workloads are available and running on Azure VMs. The process is like setting up full disaster recovery, except that in a migration you can't fail back from Azure.

### Does my Azure account need permissions to create VMs?

If you're a subscription administrator, you have the replication permissions you need. If you're not an administrator, you need permissions to take these actions:

- Create an Azure VM in the resource group and virtual network you that you specify when you configure Site Recovery.
- Write to the selected storage account or managed disk based on your configuration.

[Learn more](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines) about required permissions.

### What applications can I replicate?

You can replicate any app or workload running on a VMware VM that meets the [replication requirements](vmware-physical-azure-support-matrix.md#replicated-machines).

- Site Recovery supports application-aware replication, so that apps can be failed over and failed back to an intelligent state.
- Site Recovery integrates with Microsoft applications such as SharePoint, Exchange, Dynamics, SQL Server, and Active Directory. It also works closely with leading vendors, including Oracle, SAP, IBM, and Red Hat.

[Learn more](site-recovery-workload.md) about workload protection.

### Can I use a guest OS server license on Azure?

Yes, Microsoft Software Assurance customers can use [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) to save on licensing costs for Windows Server machines that are migrated to Azure, or to use Azure for disaster recovery.

## Security

### What access to VMware servers does Site Recovery need?

Site Recovery needs access to VMware servers to:

- Set up a VMware VM running the Site Recovery configuration server.
- Automatically discover VMs for replication.

### What access to VMware VMs does Site Recovery need?

- To replicate, a VMware VM must have the Site Recovery Mobility service installed and running. You can deploy the tool manually, or you can specify that Site Recovery do a push installation of the service when you enable replication for a VM.
- During replication, VMs communicate with Site Recovery as follows:
    - VMs communicate with the configuration server on HTTPS port 443 for replication management.
    - VMs send replication data to the process server on HTTPS port 9443. (This setting can be modified.)
    - If you enable multi-VM consistency, VMs communicate with each other over port 20004.

### Is replication data sent to Site Recovery?

No, Site Recovery doesn't intercept replicated data and doesn't have any information about what's running on your VMs. Replication data is exchanged between VMware hypervisors and Azure Storage. Site Recovery has no ability to intercept that data. Only the metadata needed to orchestrate replication and failover is sent to the Site Recovery service.  

Site Recovery is certified for ISO 27001:2013 and 27018, HIPAA, and DPA. It's in the process of SOC2 and FedRAMP JAB assessments.

## Pricing

### How do I calculate approximate charges for VMware disaster recovery?

Use the [pricing calculator](https://aka.ms/asr_pricing_calculator) to estimate costs while using Site Recovery.

For a detailed estimate of costs, run the deployment planner tool for [VMware](https://aka.ms/siterecovery_deployment_planner) and use the [cost estimation report](https://aka.ms/asr_DP_costreport).

### Is there any difference in cost between replicating to storage or directly to managed disks?

Managed disks are charged slightly differently from storage accounts. [Learn more](https://azure.microsoft.com/pricing/details/managed-disks/) about managed-disk pricing.

### Is there any difference in cost when replicating to General Purpose v2 storage account?

You will typically see an increase in the transactions cost incurred on GPv2 storage accounts since Azure Site Recovery is transactions heavy. [Read more](../storage/common/storage-account-upgrade.md#pricing-and-billing) to estimate the change.

## Mobility service

### Where can I find the Mobility service installers?

The installers are in the %ProgramData%\ASR\home\svsystems\pushinstallsvc\repository folder on the configuration server.

## How do I install the Mobility service?

On each VM that you want to replicate, install the service by one of several methods:

- [Push installation](vmware-physical-mobility-service-overview.md#push-installation)
- [Manual installation](vmware-physical-mobility-service-overview.md#install-mobility-agent-through-ui) from the UI or PowerShell
- Deployment by using a deployment tool such as [Configuration Manager](vmware-azure-mobility-install-configuration-mgr.md)

## Managed disks

### Where does Site Recovery replicate data to?

Site Recovery replicates on-premises VMware VMs and physical servers to managed disks in Azure.

- The Site Recovery process server writes replication logs to a cache storage account in the target region.
- These logs are used to create recovery points on Azure-managed disks that have prefix of **asrseeddisk**.
- When failover occurs, the recovery point you select is used to create a new target managed disk. This managed disk is attached to the VM in Azure.
- VMs that were previously replicated to a storage account (before March 2019) aren't affected.

### Can I replicate new machines to storage accounts?

No. Beginning in March 2019, in the Azure portal, you can replicate only to Azure managed disks.

Replication of new VMs to a storage account is available only by using PowerShell or the REST API (version 2018-01-10 or 2016-08-10).

### What are the benefits of replicating to managed disks?

[Learn how](https://azure.microsoft.com/blog/simplify-disaster-recovery-with-managed-disks-for-vmware-and-physical-servers/) Site Recovery simplifies disaster recovery with managed disks.

### Can I change the managed-disk type after a machine is protected?

Yes, you can easily [change the type of managed disk](https://docs.microsoft.com/azure/virtual-machines/windows/convert-disk-storage) for ongoing replications. Before changing the type, ensure that no shared access signature URL is generated on the managed disk:

1. Go to the **Managed Disk** resource on the Azure portal and check whether you have a shared access signature URL banner on the **Overview** blade.
1. If the banner is present, select it to cancel the ongoing export.
1. Change the type of the disk within the next few minutes. If you change the managed-disk type, wait for fresh recovery points to be generated by Azure Site Recovery.
1. Use the new recovery points for any test failover or failover in the future.

### Can I switch replication from managed disks to unmanaged disks?

No. Switching from managed to unmanaged isn't supported.

## Replication

### What are the replicated VM requirements?

[Learn more](vmware-physical-azure-support-matrix.md#replicated-machines) about support requirements for VMware VMs and physical servers.

### How often can I replicate to Azure?

Replication is continuous when replicating VMware VMs to Azure.

### Can I extend replication?

Extended or chained replication isn't supported. Request this feature in the [feedback forum](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6097959).

### Can I do an offline initial replication?

Offline replication isn't supported. Request this feature in the [feedback forum](https://feedback.azure.com/forums/256299-site-recovery/suggestions/6227386-support-for-offline-replication-data-transfer-from).

### What is asrseeddisk?

For every source disk, data is replicated to a managed disk in Azure. This disk has the prefix of **asrseeddisk**. It stores the copy of the source disk and all the recovery point snapshots.

### Can I exclude disks from replication?

Yes, you can exclude disks.

### Can I replicate VMs that have dynamic disks?

Dynamic disks can be replicated. The operating system disk must be a basic disk.

### If I use replication groups for multi-VM consistency, can I add a new VM to an existing replication group?

Yes, you can add new VMs to an existing replication group when you enable replication for them. However:

- You can't add a VM to an existing replication group after replication has begun.
- You can't create a replication group for existing VMs.

### Can I modify VMs that are replicating by adding or resizing disks?

For VMware replication to Azure, you can modify disk size of source VMs. If you want to add new disks, you must add the disk and reenable protection for the VM.

### Can I migrate on-premises machines to a new vCenter Server without impacting ongoing replication?

No. A change of VMware Vcenter or migration will impact ongoing replication. Set up Site Recovery with the new vCenter Server and enable replication for machines again.

### Can I replicate to a cache or target storage account that has a virtual network (with Azure Firewalls) configured on it?

No, Site Recovery doesn't support replication to Azure Storage on virtual networks.

## Component upgrade

### My version of the Mobility services agent or configuration server is old, and my upgrade failed. What do I do?

Site Recovery follows the N-4 support model. [Learn more](https://aka.ms/asr_support_statement) about how to upgrade from very old versions.

### Where can I find the release notes and update rollups for Azure Site Recovery?

[Learn about new updates](site-recovery-whats-new.md), and [get rollup information](service-updates-how-to.md).

### Where can I find upgrade information for disaster recovery to Azure?

[Learn about upgrading](https://aka.ms/asr_vmware_upgrades).

## Do I need to reboot source machines for each upgrade?

A reboot is recommended but not mandatory for each upgrade. [Learn more](https://aka.ms/asr_vmware_upgrades).

## Configuration server

### What does the configuration server do?

The configuration server runs the on-premises Site Recovery components, including:

- The configuration server itself. The server coordinates communications between on-premises components and Azure, and manages data replication.
- The process server, which acts as a replication gateway. This server:
    1. Receives replication data.
    2. Optimizes the data with caching, compression, and encryption.
    3. Sends the data to Azure Storage.
  The process server also does a push install of the Mobility Service on VMs and performs automatic discovery of on-premises VMware VMs.
- The master target server, which handles replication data during failback from Azure.

[Learn more](vmware-azure-architecture.md) about the configuration server components and processes.

### Where do I set up the configuration server?

You need a single, highly available, on-premises VMware VM for the configuration server. For physical server disaster recovery, install the configuration server on a physical machine.

### What do I need for the configuration server?

Review the [prerequisites](vmware-azure-deploy-configuration-server.md#prerequisites).

### Can I manually set up the configuration server instead of using a template?

We recommend that you [create the configuration server VM](vmware-azure-deploy-configuration-server.md) by using the latest version of the Open Virtualization Format (OVF) template. If you can't use the template (for example, if you don't have access to the VMware server), [download](physical-azure-set-up-source.md) the setup file from the portal and set up the configuration server.

### Can a configuration server replicate to more than one region?

No. To replicate to more than one region, you need a configuration server in each region.

### Can I host a configuration server in Azure?

Although it's possible, the Azure VM running the configuration server would need to communicate with your on-premises VMware infrastructure and VMs. This communication adds latency and impacts ongoing replication.

### How do I update the configuration server?

[Learn](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server) how to update the configuration server.

- You can find the latest update information on the [Azure updates page](https://azure.microsoft.com/updates/?product=site-recovery).
- You can download the latest version from the portal. Or, you can download the latest version of the configuration server directly from the [Microsoft Download Center](https://aka.ms/asrconfigurationserver).
- If your version is more than four versions older than the current version, see the [support statement](https://aka.ms/asr_support_statement) for upgrade guidance.

### Should I back up the configuration server?

We recommend taking regular scheduled backups of the configuration server.

- For successful failback, the VM being failed back must exist in the configuration server database.
- The configuration server must be running and in a connected state.
- [Learn more](vmware-azure-manage-configuration-server.md) about common configuration server management tasks.

### When I'm setting up the configuration server, can I download and install MySQL manually?

Yes. Download MySQL and place it in the C:\Temp\ASRSetup folder. Then, install it manually. When you set up the configuration server VM and accept the terms, MySQL will be listed as **Already installed** in **Download and install**.

### Can I avoid downloading MySQL but let Site Recovery install it?

Yes. Download the MySQL installer and place it in the C:\Temp\ASRSetup folder. When you set up the configuration server VM, accept the terms and select **Download and install**. The portal will use the installer that you added to install MySQL.

### Can I use the configuration server VM for anything else?

No. Use the VM only for the configuration server.

### Can I clone a configuration server and use it for orchestration?

No. Set up a fresh configuration server to avoid registration issues.

### Can I change the vault in which the configuration server is registered?

No. After a vault is associated with the configuration server, it can't be changed. [Learn](vmware-azure-manage-configuration-server.md#register-a-configuration-server-with-a-different-vault) about registering a configuration server with a different vault.

### Can I use the same configuration server for disaster recovery of both VMware VMs and physical servers?

Yes, but note that physical machine can be failed back only to a VMware VM.

### Where can I download the passphrase for the configuration server?

[Learn](vmware-azure-manage-configuration-server.md#generate-configuration-server-passphrase) how to download the passphrase.

### Where can I download vault registration keys?

In the Recovery Services vault, select **Configuration Servers** in **Site Recovery Infrastructure** > **Manage**. Then, in **Servers**, select **Download registration key** to download the vault credentials file.

### Can a single configuration server be used to protect multiple vCenter instances?

Yes, a single configuration server can protect VMs accross multiple vCenters.  There is not limit on how many vCenter instances can be added to the configuration server, however the limits for how many VMs a single configuration server can protect do apply.

### Can a single configuration server protect multiple clusters within vCenter?

Yes, Azure Site Recovery can protect VMs across different clusters.

## Process server

### Why am I unable to select the process server when I enable replication?

Updates in versions 9.24 and later now display the [health of the process server when you enable replication](vmware-azure-enable-replication.md#enable-replication). This feature helps to avoid process-server throttling and to minimize the use of unhealthy process servers.

### How do I update the process server to version 9.24 or later for accurate health information?

Beginning with [version 9.24](service-updates-how-to.md#links-to-currently-supported-update-rollups), more alerts have been added to indicate the health of the process server. [Update your Site Recovery components to version 9.24 or later](service-updates-how-to.md#links-to-currently-supported-update-rollups) so that all alerts are generated.

## Failover and failback

### Can I use the on-premises process server for failback?

We strongly recommend creating a process server in Azure for failback purposes, to avoid data transfer latencies. Additionally, in case you separated the source VMs network with the Azure facing network in the configuration server, it's essential to use the process server created in Azure for failback.

### Can I keep the IP address on failover?

Yes, you can keep the IP address on failover. Ensure that you specify the target IP address in the **Compute and Network** settings for the VM before failover. Also, shut down machines at the time of failover to avoid IP address conflicts during failback.

### Can I change the target VM size or VM type before failover?

Yes, you can change the type or size of the VM at any time before failover. In the portal, use the **Compute and Network** settings for the replicated VM.

### How far back can I recover?

For VMware to Azure, the oldest recovery point you can use is 72 hours.

### How do I access Azure VMs after failover?

After failover, you can access Azure VMs over a secure internet connection, over a site-to-site VPN, or over Azure ExpressRoute. To connect, you must prepare several things. [Learn more](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover).

### Is failed-over data resilient?

Azure is designed for resilience. Site Recovery is engineered for failover to a secondary Azure datacenter, as required by the Azure service-level agreement (SLA). When failover occurs, we make sure your metadata and vaults remain in the same geographic region that you chose for your vault.

### Is failover automatic?

[Failover](site-recovery-failover.md) isn't automatic. You start a failover by making a single selection in the portal, or you can use [PowerShell](/powershell/module/az.recoveryservices) to trigger a failover.

### Can I fail back to a different location?

Yes. If you failed over to Azure, you can fail back to a different location if the original one isn't available. [Learn more](concepts-types-of-failback.md#alternate-location-recovery-alr).

### Why do I need a VPN or ExpressRoute with private peering to fail back?

When you fail back from Azure, data from Azure is copied back to your on-premises VM, and private access is required.


## Automation and scripting

### Can I set up replication with scripting?

Yes. You can automate Site Recovery workflows by using the Rest API, PowerShell, or the Azure SDK. [Learn more](vmware-azure-disaster-recovery-powershell.md).

## Performance and capacity

### Can I throttle replication bandwidth?

Yes. [Learn more](site-recovery-plan-capacity-vmware.md).

## Next steps

- [Review](vmware-physical-azure-support-matrix.md) support requirements.
- [Set up](vmware-azure-tutorial.md) VMware to Azure replication.
