---
title: Azure Migrate - Frequently Asked Questions (FAQ) | Microsoft Docs
description: Addresses frequently asked questions about Azure Migrate
author: snehaamicrosoft
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 09/03/2018
ms.author: snehaa
---

# Azure Migrate - Frequently Asked Questions (FAQ)

This article includes frequently asked questions about Azure Migrate. If you have any further queries after reading this article, post them on the [Azure Migrate forum](http://aka.ms/AzureMigrateForum).

## General

### Does Azure Migrate support assessment of only VMware workloads?

Yes, Azure Migrate currently only supports assessment of VMware workloads. Support for Hyper-V and physical servers will be enabled in future.

### Does Azure Migrate need vCenter Server to discover a VMware environment?

Yes, Azure Migrate requires vCenter Server to discover a VMware environment. It does not support discovery of ESXi hosts that are not managed by a vCenter Server.

### How is Azure Migrate different from Azure Site Recovery?

Azure Migrate is an assessment service that helps you discover your on-premises workloads and plan your migration to Azure. [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/migrate-tutorial-on-premises-azure), along with being a disaster recovery solution, helps you migrate on-premises workloads to IaaS VMs in Azure.

### What's the difference between using Azure Migrate for assessments and the Map Toolkit?

[Azure Migrate](migrate-overview.md) provides migration assessment specifically to assist with migration readiness and evaluation of on-premises workloads into Azure. [Microsoft Assessment and Planning (MAP) Toolkit](https://www.microsoft.com/en-us/download/details.aspx?id=7826) has other functionality. For example, migration planning for newer versions of Windows client and server operating systems, software usage tracking etc. For those scenarios, continue to use the MAP Toolkit.


### How is Azure Migrate different from Azure Site Recovery Deployment Planner?

Azure Migrate is a migration planning tool and Azure Site Recovery Deployment Planner is a disaster recovery (DR) planning tool.

**Migration from VMware to Azure**: If you intend to migrate your on-premises workloads to Azure, use Azure Migrate for migration planning. Azure Migrate assesses on-premises workloads and provides guidance, insights, and mechanisms to assist you in migrating to Azure. Once you are ready with your migration plan, you can use services such as Azure Site Recovery and Azure Database Migration Service to migrate the machines to Azure.
 
**Migration from Hyper-V to Azure**: Azure Migrate currently only supports assessment of VMware virtual machines for migration to Azure. Support for Hyper-V is on the roadmap for Azure Migrate. In the interim, you can use Site Recovery Deployment Planner. Once Hyper-V support is enabled in Azure Migrate, you can use Azure Migrate for planning migration of Hyper-V workloads.

**Disaster Recovery from VMware/Hyper-V to Azure**: If you intend to do disaster recovery (DR) on Azure using Azure Site Recovery (Site Recovery), use Site Recovery Deployment Planner for DR planning. Site Recovery Deployment Planner does a deep, ASR-specific assessment of your on-premises environment. It provides recommendations that are required by Site Recovery for successful DR operations such as replication, failover of your virtual machines.  

### Which Azure regions are supported by Azure Migrate?

Azure Migrate currently supports East US and West Central US as migration project locations. Note that even though you can only create migration projects in West Central US and East US, you can still assess your machines for [multiple target locations](https://docs.microsoft.com/azure/migrate/how-to-modify-assessment#edit-assessment-properties). The project location is only used to store the discovered data.

### How does the on-premises site connect to Azure Migrate?

The connection can be over the internet or use ExpressRoute with public peering.

### Can I harden the VM set up with the .OVA template?

Additional components (for example anti-virus) can be added into the .OVA template as long as the communication and firewall rules required for the Azure Migrate appliance to work are left as is.   

## Discovery and assessment

### What data is collected by Azure Migrate?

Azure Migrate supports two kinds of discovery, appliance-based discovery and agent-based discovery.
The appliance-based discovery collects metadata about the on-premises VMs, the complete list of metadata collected by the appliance is listed below:

**Configuration data of the VM**
- VM display name (on vCenter)
- VM inventory path (host/cluster/folder in vCenter)
- IP address
- MAC address
- Operating system
- Number of cores, disks, NICs
- Memory size, Disk sizes

**Performance data of the VM**
- CPU usage
- Memory usage
- For each disk attached to the VM:
  - Disk read throughput
  - Disk writes throughput
  - Disk read operations per sec
  - Disk writes operations per sec
- For each network adapter attached to the VM:
  - Network in
  - Network out

The agent-based discovery is an option available on top of the appliance-based discovery and helps customers [visualize dependencies](how-to-create-group-machine-dependencies.md) of the on-prem VMs. The dependency agents collect details like, FQDN, OS, IP address, MAC address, processes running inside the VM and the incoming/outgoing TCP connections from the VM. The agent-based discovery is optional and you can choose to not install the agents if you do not want to visualize the dependencies of the VMs.

### Would there be any performance impact on the analyzed ESXi host environment?

Since we collect the information via the vCenter server, there is no performance impact on the ESXi hosts. Even on the vCenter server, there is almost zero performance impact.

### Where is the collected data stored and for how long?

The data collected by the collector appliance is stored in the Azure location that you specify while creating the migration project. The data is securely stored in a Microsoft subscription and is deleted when the user deletes the Azure Migrate project.

For dependency visualization, if you install agents on the VMs, the data collected by the dependency agents is stored in the US in an OMS workspace created in user’s subscription. This data is deleted when you delete the OMS workspace in your subscription. [Learn more](https://docs.microsoft.com/azure/migrate/concepts-dependency-visualization).

### Is the data encrypted at rest and while in transit?

Yes, the collected data is encrypted both at rest and while in transit. The metadata collected by the appliance is securely sent to the Azure Migrate service over internet via https. The collected metadata is stored in [Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/database-encryption-at-rest) and in [Azure blob storage](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) in a Microsoft subscription and is encrypted at rest.

The data collected by the dependency agents is also encrypted in transit (secure https channel) and is stored in a Log Analytics workspace in the user’s subscription. It is also encrypted at rest.

### How does the collector communicate with the vCenter Server and the Azure Migrate service?

The collector appliance connects to the vCenter Server (port 443) using the credentials provided by the user in the appliance. It queries the vCenter Server using VMware PowerCLI to collect metadata about the VMs managed by vCenter Server. It collects both configuration data about VMs (cores, memory, disks, NIC etc.) as well as performance history of each VM for the last one month from vCenter Server. The collected metadata is then sent to the Azure Migrate service (over internet via https) for assessment. [Learn more](concepts-collector.md)

### Can I connect the same collector appliance to multiple vCenter servers?

Yes, a single collector appliance can be used to discover multiple vCenter Servers, but not concurrently. You need to run the discoveries one after another.

### Is the .OVA template used by Site Recovery integrated with the .OVA used by Azure Migrate?

Currently there is no integration. The .OVA template in Site Recovery is used to set up a Site Recovery configuration server for VMware VM/physical server replication. The .OVA used by Azure Migrate is used to discover VMware VMs managed by a vCenter server, for the purposes of migration assessment.

### I changed my machine size. Can I rerun the assessment?

If you change the settings on a VM you want to assess, trigger discover again using the collector appliance. In the appliance, use the **Start collection again** option to do this. After the collection is done, select the **Recalculate** option for the assessment in the portal, to get updated assessment results.

### How can I discover a multi-tenant environment in Azure Migrate?

If you have an environment that is shared across tenants and you do not want to discover the VMs of one tenant in another tenant's subscription, you can use the Scope field in the collector appliance to scope the discovery. If the tenants are sharing hosts, create a credential that has read-only access to only the VMs belonging to the specific tenant and then use this credential in the collector appliance and specify the Scope as the host to do the discovery. Alternatively, you can also create folders in vCenter Server (let's say folder1 for tenant1 and folder2 for tenant2), under the shared host, move the VMs for tenant1 into folder1 and for tenant2 into folder2 and then scope the discoveries in the collector accordingly by specifying the appropriate folder.

### How many virtual machines can be discovered in a single migration project?

You can discover 1500 virtual machines in a single migration project. If you have more machines in your on-premises environment, [learn more](how-to-scale-assessment.md) about how you can discover a large environment in Azure Migrate.

### Does Azure Migrate support Enterprise Agreement (EA) based cost estimation?

Azure Migrate currently does not support cost estimation for [Enterprise Agreement offer](https://azure.microsoft.com/offers/enterprise-agreement-support/). The workaround is to specify Pay-As-You-Go as the offer and manually specifying the discount percentage (applicable to the subscription) in the 'Discount' field of the assessment properties.

  ![Discount](./media/resources-faq/discount.png)

## Dependency visualization

### Do I need to pay to use the dependency visualization feature?

Azure Migrate is available at no additional charge. Learn more about Azure Migrate pricing [here](https://azure.microsoft.com/pricing/details/azure-migrate/).

### Can I use an existing workspace for dependency visualization?

Azure Migrate does not support using an existing workspace for dependency visualization, however, the Microsoft Monitoring Agent (MMA) supports multi-homing and enables you to send data to multiple workspaces. So if you already have the agents deployed and configured to a workspace, you can leverage multi-homing in the MMA agent and configure it to the Azure Migrate workspace (in addition to the existing workspace) and make it work. [Here](https://blogs.technet.microsoft.com/msoms/2016/05/26/oms-log-analytics-agent-multi-homing-support/) is a blog on how you can enable multi-homing in an MMA agent.

## Next steps

- Read the [Azure Migrate overview](migrate-overview.md)
- Learn how you can [discover and assess](tutorial-assessment-vmware.md) a VMware environment
