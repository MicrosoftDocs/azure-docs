---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 03/27/2018
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

The Azure Migrate service assesses on-premises workloads for migration to Azure. The service assesses the migration suitability of on-premises machines, performance-based sizing, and provides cost estimations for running your on-premises machines in Azure. If you're contemplating lift-and-shift migrations, or are in the early assessment stages of migration, this service is for you. After the assessment, you can use services such as [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview) and [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview), to migrate the machines to Azure.

## Why use Azure Migrate?

Azure Migrate helps you to:

- **Assess Azure readiness**: Assess whether your on-premises machines are suitable for running in Azure. 
- **Get size recommendations**: Get size recommendations for Azure VMs based on the performance history of on-premises VMs. 
- **Estimate monthly costs**: Get estimated costs for running on-premises machines in Azure.  
- **Migrate with high confidence**: Visualize dependencies of on-premises machines to create groups of machines that you will assess and migrate together. 

## Current limitations

- Currently, you can only assess on-premises VMware virtual machines (VMs) for migration to Azure VMs. The VMware VMs must be managed by vCenter Server (version 5.5, 6.0, or 6.5).
- Support for Hyper-V is on our roadmap. In the interim, we recommend that you use [Azure Site Recovery Deployment Planner](http://aka.ms/asr-dp-hyperv-doc) to plan migration of Hyper-V workloads. 
- You can discover up to 1000 VMs in a single discovery and up to 1500 VMs in a single project. Additionally, you can assess up to 400 VMs in a single assessment. If you need to discover or assess more, you can increase the number of discoveries or assessments. [Learn more](how-to-scale-assessment.md).
- You can only create an Azure Migrate project in West Central US or East US region. However, this does not impact your ability to plan your migration for a different target Azure location. The location of the migration project is used only to store the metadata discovered from the on-premises environment.
- Azure Migrate only supports managed disks for migration assessment.


## What do I need to pay for?

Learn more about Azure Migrate pricing [here](https://azure.microsoft.com/en-in/pricing/details/azure-migrate/).


## What's in an assessment?

An assessment helps you identify the Azure suitability of on-premises VMs, get right-sizing recommendations and cost estimates for running the VMs in Azure. Assessments can be customized based on your needs by changing the properties of the assessment. Below are the properties that are considered while creating an assessment. 

**Property** | **Details**
--- | ---
**Target location** | The Azure location to which you want to migrate.<br/><br/>Azure Migrate currently supports 30 regions including Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China North, East Asia, East US, Germany Central, Germany Northeast, East US 2, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, South India, UK South, UK West, West Central US, West Europe, West India, West US, and West US2. By default, the target location is set to West US 2. 
**Storage redundancy** | The type of [storage redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy) that the Azure VMs will use after migration. Locally Redundant Storage (LRS) is the default. Note that Azure Migrate only supports managed disks-based assessments and managed disks only support LRS, hence the property currently only has the LRS option. 
**Sizing Criterion** | The criterion to be used by Azure Migrate to right-size VMs for Azure. You can do sizing either based on *performance history* of the on-premises VMs or size the VMs *as on-premises* for Azure without considering the performance history. The default value is performance-based sizing.
**Pricing plans** | For cost calculations, an assessment considers whether you have software assurance, and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). It also considers [Azure Offers](https://azure.microsoft.com/support/legal/offer-details/) that you might be enrolled to, and allows you to specify any subscription-specific discounts (%), that you may get on top of the offer. 
**Pricing tier** | You can specify the [pricing tier (Basic/Standard)](../virtual-machines/windows/sizes-general.md) for the target Azure VMs. For example, if you are planning to migrate a production environment, you would like to consider the Standard tier, which provides VMs with low latency but may cost more. On the other hand, if you have a Dev-Test environment, you may want to consider the Basic tier that has VMs with higher latency and lower costs. By default the [Standard](../virtual-machines/windows/sizes-general.md) tier is used.
**Performance history** | Applicable only if the sizing criterion is performance-based. By default, Azure Migrate evaluates the performance of on-premises machines using the performance history of the last one day, with a 95% percentile value. You can modify these values in the assessment properties. 
**Comfort factor** | Azure Migrate considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead. The default comfort setting is 1.3x.


## How does Azure Migrate work?

1.	You create an Azure Migrate project.
2.	Azure Migrate uses an on-premises VM called the collector appliance, to discover information about your on-premises machines. To create the appliance, you download a setup file in Open Virtualization Appliance (.ova) format, and import it as a VM on your on-premises vCenter Server.
3.	You connect to the VM using console connection in vCenter Server, specify a new password for the VM while connecting and then run the collector application in the VM to initiate discovery.
4.	The collector collects VM metadata using VMware PowerCLI cmdlets. Discovery is agentless, and doesn't install anything on VMware hosts or VMs. The collected metadata includes VM information (cores, memory, disks, disk sizes, and network adapters). It also collects performance data for VMs, including CPU and memory usage, disk IOPS, disk throughput (MBps), and network output (MBps).
5.	The metadata is pushed to the Azure Migrate project. You can view it in the Azure portal.
6.	For the purposes of assessment, you gather the discovered VMs into groups. For example, you might group VMs that run the same application. For more precise grouping, you can use dependency visualization to view dependencies of a specific machine, or for all machines in a group and refine the group.
7.	Once your group is formed, you create an assessment for the group. 
8.	After the assessment finishes, you can view it in the portal, or download it in Excel format.



  ![Azure Planner architecture](./media/migration-planner-overview/overview-1.png)

## What are the port requirements?

The table summarizes the ports needed for Azure Migrate communications.

|Component          |To communicate with     |Port required  |Reason   |
|-------------------|------------------------|---------------|---------|
|Collector          |Azure Migrate service   |TCP 443        |The collector connects to the service over SSL port 443|
|Collector          |vCenter Server          |Default 9443   | By default the collector connects to the vCenter Server on port 9443. If the server listens on a different port, it should be configured as an outgoing port on the collector VM. |
|On-premises VM     | Operations Management Suite (OMS) Workspace          |[TCP 443](../log-analytics/log-analytics-windows-agent.md) |The MMA agent uses TCP 443 to connect to Log Analytics. You only need this port if you're using the dependency visualization feature, and are installing the Microsoft Monitoring Agent (MMA). |


  
## What happens after assessment?

After you've assessed on-premises machines for migration with the Azure Migrate service, you can use a couple of tools to perform the migration:

- **Azure Site Recovery**: You can use Azure Site Recovery to migrate to Azure, as follows:
  - Prepare Azure resources, including an Azure subscription, an Azure virtual network, and a storage account.
  - Prepare your on-premises VMware servers for migration. You verify VMware support requirements for Site Recovery, prepare VMware servers for discovery, and prepare to install the Site Recovery Mobility service on VMs that you want to migrate. 
  - Set up migration. You set up a Recovery Services vault, configure source and target migration settings, set up a replication policy, and enable replication. You can run a disaster recovery drill to check that migration of a VM to Azure is working correctly.
  - Run a failover to migrate on-premises machines to Azure. 
  - [Learn more](../site-recovery/tutorial-migrate-on-premises-to-azure.md) in the Site Recovery migration tutorial.

- **Azure Database Migration**: If your on-premises machines are running a database such as SQL Server, MySQL, or Oracle, you can use the Azure Database Migration Service to migrate them to Azure. [Learn more](https://azure.microsoft.com/campaigns/database-migration/).



## Next steps 
[Follow a tutorial](tutorial-assessment-vmware.md) to create an assessment for an on-premises VMware VM.