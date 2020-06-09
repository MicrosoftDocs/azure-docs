---
title: Azure Migrate appliance FAQ
description: Get answers to common questions about the Azure Migrate appliance.
ms.topic: conceptual
ms.date: 06/03/2020
---

# Azure Migrate appliance: Common questions

This article answers common questions about the Azure Migrate appliance. If you have other questions, check these resources:

- [General questions](resources-faq.md) about Azure Migrate
- Questions about [discovery, assessment, and dependency visualization](common-questions-discovery-assessment.md)
- Questions about [server migration](common-questions-server-migration.md)
- Get questions answered in the [Azure Migrate forum](https://aka.ms/AzureMigrateForum)

## What is the Azure Migrate appliance?

The Azure Migrate appliance is a lightweight appliance that the Azure Migrate: Server Assessment tool uses to discover and assess on-premises servers. The Azure Migrate: Server Migration tool also uses the appliance for agentless migration of on-premises VMware VMs.

Here's more information about the Azure Migrate appliance:

- The appliance is deployed on-premises as a VM or physical machine.
- The appliance discovers on-premises machines and continually sends machine metadata and performance data to Azure Migrate.
- Appliance discovery is agentless. Nothing is installed on discovered machines.

[Learn more](migrate-appliance.md) about the appliance.

## How can I deploy the appliance?

The appliance can be deployed as follows:

- Using a template for VMware VMs and Hyper-V VMs (OVA template for VMware or VHD for Hyper-V).
- If you don't want to use a template, or you're in Azure Government, you can deploy the appliance for VMware or Hyper-V using a PowerShell script.
- For physical servers, you always deploy the appliance using a script.


## How does the appliance connect to Azure?

The appliance can connect over the internet or by using Azure ExpressRoute with public/Microsoft peering.

## Does appliance analysis affect performance?

The Azure Migrate appliance profiles on-premises machines continuously to measure performance data. This profiling has almost no performance impact on profiled machines.

## Can I harden the appliance VM?

When you use the downloaded template to create the appliance VM, you can add components (antivirus, for example) to the template if you leave in place the communication and firewall rules that are required for the Azure Migrate appliance.

## What network connectivity is required?


The appliance needs access to Azure URLs. [Review](migrate-appliance.md#url-access) the URL list.

## What data does the appliance collect?

See the following articles for information about data that the Azure Migrate appliance collects on VMs:

- **VMware VM**: [Review](migrate-appliance.md#collected-data---vmware) collected data. [
- **Hyper-V VM**: [Review](migrate-appliance.md#collected-data---hyper-v) collected data.

## How is data stored?

Data that's collected by the Azure Migrate appliance is stored in the Azure location where you created the Azure Migrate project.

Here's more information about how data is stored:

- The collected data is securely stored in CosmosDB in a Microsoft subscription. The data is deleted when you delete the Azure Migrate project. Storage is handled by Azure Migrate. You can't specifically choose a storage account for collected data.
- If you use [dependency visualization](concepts-dependency-visualization.md), the data that's collected is stored in the United States in an Azure Log Analytics workspace created in your Azure subscription. The data is deleted when you delete the Log Analytics workspace in your subscription.

## How much data is uploaded during continuous profiling?

The volume of data that's sent to Azure Migrate depends on multiple parameters. As an example, an Azure Migrate project that has 10 machines (each with one disk and one NIC) sends approximately 50 MB of data per day. This value is approximate; the actual value varies depending on the number of data points for the disks and NICs. If the number of machines, disks, or NICs increases, the increase in data that's sent is nonlinear.

## Is data encrypted at rest and in transit?

Yes, for both:

- Metadata is securely sent to the Azure Migrate service over the internet via HTTPS.
- Metadata is stored in an [Azure Cosmos](../cosmos-db/database-encryption-at-rest.md) database and in [Azure Blob storage](../storage/common/storage-service-encryption.md) in a Microsoft subscription. The metadata is encrypted at rest for storage.
- The data for dependency analysis also is encrypted in transit (by secure HTTPS). It's stored in a Log Analytics workspace in your subscription. The data is encrypted at rest for dependency analysis.

## How does the appliance connect to vCenter Server?

These steps describe how the appliance connects to VMware vCenter Server:

1. The appliance connects to vCenter Server (port 443) by using the credentials you provided when you set up the appliance.
2. The appliance uses VMware PowerCLI to query vCenter Server to collect metadata about the VMs that are managed by vCenter Server.
3. The appliance collects configuration data about VMs (cores, memory, disks, NICs) and the performance history of each VM for the past month.
4. The collected metadata is sent to the Azure Migrate: Server Assessment tool (over the internet via HTTPS) for assessment.

## Can the Azure Migrate appliance connect to multiple vCenter Servers?

No. There's a one-to-one mapping between an [Azure Migrate appliance](migrate-appliance.md) and vCenter Server. To discover VMs on multiple vCenter Server instances, you must deploy multiple appliances. 

## Can an Azure Migrate project have multiple appliances?
A project can have multiple appliances attached to it. However, an appliance can only be associated with one project. 

## Can the Azure Migrate appliance/Replication appliance connect to the same vCenter?
Yes. You can add both the Azure Migrate appliance (used for assessment and agentless VMware migration), and the replication appliance (used for agent-based migration of VMware VMs) to the same vCenter server.


## How many VMs or servers can I discover with an appliance?

You can discover up to 10,000 VMware VMs, up to 5,000 Hyper-V VMs, and up to 250 physical servers with a single appliance. If you have more machines in your on-premises environment, read about [scaling a Hyper-V assessment](scale-hyper-v-assessment.md), [scaling a VMware assessment](scale-vmware-assessment.md), and [scaling a physical server assessment](scale-physical-assessment.md).

## Can I delete an appliance?

Currently, deleting an appliance from the project isn't supported.

The only way to delete the appliance is to delete the resource group that contains the Azure Migrate project that's associated with the appliance.

However, deleting the resource group also deletes other registered appliances, the discovered inventory, assessments, and all other Azure components in the resource group that are associated with the project.

## Can I use the appliance with a different subscription or project?

After you use the appliance to initiate discovery, you can't reconfigure the appliance to use with a different Azure subscription, and you can't use it in a different Azure Migrate project. You also can't discover VMs on a different instance of vCenter Server. Set up a new appliance for these tasks.

## Can I set up the appliance on an Azure VM?

No. Currently, this option isn't supported. 

## Can I discover on an ESXi host?

No. To discover VMware VMs, you must have vCenter Server.

## How do I update the appliance?

By default, the appliance and its installed agents are updated automatically. The appliance checks for updates every 24 hours. Updates that fail are retried. 

Only the appliance and the appliance agents are updated by these automatic updates. The operating system is not updated by Azure Migrate automatic updates. Use Windows Updates to keep the operating system up to date.

## Can I check agent health?

Yes. In the portal, go the **Agent health** page for the Azure Migrate: Server Assessment or Azure Migrate: Server Migration tool. There, you can check the connection status between Azure and the discovery and assessment agents on the appliance.

## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).
