---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 11/28/2018
ms.author: raynew
ms.custom: mvc
---


# About Azure Migrate

The Azure Migrate service assesses on-premises workloads for migration to Azure. The service assesses the migration suitability of on-premises machines, performs performance-based sizing, and provides cost estimations for running on-premises machines in Azure. If you're contemplating lift-and-shift migrations, or are in the early assessment stages of migration, this service is for you. After the assessment, you can use services such as [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview) and [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview), to migrate the machines to Azure.

## Why use Azure Migrate?

Azure Migrate helps you to:

- **Assess Azure readiness**: Assess whether your on-premises machines are suitable for running in Azure.
- **Get size recommendations**: Get size recommendations for Azure VMs based on the performance history of on-premises VMs.
- **Estimate monthly costs**: Get estimated costs for running on-premises machines in Azure.  
- **Migrate with high confidence**: Visualize dependencies of on-premises machines to create groups of machines that you will assess and migrate together.

## Current limitations

- You can only assess on-premises VMware virtual machines (VMs) for migration to Azure VMs. The VMware VMs must be managed by vCenter Server (version 5.5, 6.0, or 6.5).
- If you want to assess Hyper-VMs and physical servers, use the [Azure Site Recovery Deployment Planner](https://aka.ms/asr-dp-hyperv-doc) for Hyper-V, and our [partner tools](https://azure.microsoft.com/migration/partners/) for physical machines.
- You can discover up to 1500 VMs in a single discovery and up to 1500 VMs in a single project. Additionally, you can assess up to 1500 VMs in a single assessment.
- If you want to discover a larger environment, you can split the discovery and create multiple projects. [Learn more](how-to-scale-assessment.md). Azure Migrate supports up to 20 projects per subscription.
- Azure Migrate only supports managed disks for migration assessment.
-  You can only create an Azure Migrate project in the United States geography. However, you can plan a migration to any target Azure location.
    - Only metadata discovered from the on-premises environment is stored in the migration project region.
    - Metadata is stored in one of the regions in the selected geography: West Central US/East US.
    - If you use dependency visualization by creating a new Log Analytics workspace, the workspace is created in the same region as the project.


## What do I need to pay for?

[Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.


## What's in an assessment?

Assessment settings can be customized based on your needs. Assessment properties are summarized in the following table.

**Property** | **Details**
--- | ---
**Target location** | The Azure location to which you want to migrate.<br/><br/>Azure Migrate currently supports 33 regions as migration target locations. [Check regions](https://azure.microsoft.com/global-infrastructure/services/). By default, the target region is set to West US 2.
**Storage type** | The type of managed disks you want to allocate for all VMs that are part of the assessment. If the sizing criterion is *as on-premises sizing* you can specify the target disk type either as premium disks (the default), standard SSD disks or standard HDD disks. For *performance-based sizing*, along with the above options, you also have the option to select Automatic which will ensure that the disk sizing recommendation is automatically done based on the performance data of the VMs. For example, if you want to achieve a [single instance VM SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/), you may want to specify the storage type as Premium managed disks which will ensure that all disks in the assessment will be recommended as Premium managed disks. Note that Azure Migrate only supports managed disks for migration assessment.
**Reserved Instances** |  Whether you have [reserved instances](https://azure.microsoft.com/pricing/reserved-vm-instances/) in Azure. Azure Migrate estimates the cost accordingly.
**Sizing criterion** | Sizing can be based on **performance history** of the on-premises VMs (the default), or **as on-premises**, without considering performance history.
**Performance history** | By default, Azure Migrate evaluates the performance of on-premises machines using performance history for the last day, with a 95% percentile value.
**Comfort factor** | Azure Migrate considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, a 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead. The default comfort setting is 1.3x.
**VM series** | The VM series used for size estimations. For example, if you have a production environment that you do not plan to migrate to A-series VMs in Azure, you can exclude A-series from the list or series. Sizing is based on the selected series only.   
**Currency** | Billing currency. Default is US dollars.
**Discount (%)** | Any subscription-specific discount you receive on top of the Azure offer. The default setting is 0%.
**VM uptime** | If your VMs are not going to be running 24x7 in Azure, you can specify the duration (number of days per month and number of hours per day) for which they would be running and the cost estimations will be done accordingly. The default value is 31 days per month and 24 hours per day.
**Azure offer** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled to. Azure Migrate estimates the cost accordingly.
**Azure Hybrid Benefit** | Whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/) with discounted costs.

## How does Azure Migrate work?

1.	You create an Azure Migrate project.
2.	Azure Migrate uses an on-premises VM called the collector appliance, to discover information about your on-premises machines. To create the appliance, you download a setup file in Open Virtualization Appliance (.ova) format, and import it as a VM on your on-premises vCenter Server.
3. You connect to the VM from the vCenter Server, and specify a new password for it while connecting.
4. You run the collector on the VM to initiate discovery.
5. The collector collects VM metadata using the VMware PowerCLI cmdlets. Discovery is agentless, and doesn't install anything on VMware hosts or VMs. The collected metadata includes VM information (cores, memory, disks, disk sizes, and network adapters). It also collects performance data for VMs, including CPU and memory usage, disk IOPS, disk throughput (MBps), and network output (MBps).
5.	The metadata is pushed to the Azure Migrate project. You can view it in the Azure portal.
6.	For the purposes of assessment, you gather the discovered VMs into groups. For example, you might group VMs that run the same application. For more precise grouping, you can use dependency visualization to view dependencies of a specific machine, or for all machines in a group and refine the group.
7.	After a group is defined, you create an assessment for it.
8.	After the assessment finishes, you can view it in the portal, or download it in Excel format.

  ![Azure Migrate architecture](./media/migration-planner-overview/overview-1.png)

## What are the port requirements?

The table summarizes the ports needed for Azure Migrate communications.

Component | Communicates with |  Details
--- | --- |---
Collector  | Azure Migrate service | The collector connects to the service over SSL port 443.
Collector | vCenter Server | By default the collector connects to the vCenter Server on port 443. If the server listens on a different port, configure it as an outgoing port on the collector VM.
On-premises VM | Log Analytics Workspace | [TCP 443] | [The Microsoft Monitoring Agent (MMA)](../log-analytics/log-analytics-windows-agent.md) uses TCP port 443 to connect to Log Analytics. You only need this port if you're using dependency visualization, that requires the MMA agent.


## What happens after assessment?

After you've assessed on-premises machines, you can use a couple of tools to perform the migration:

- **Azure Site Recovery**: You can use Azure Site Recovery to migrate to Azure. To do this, you [prepare the Azure components](../site-recovery/tutorial-prepare-azure.md) you need, including a storage account and virtual network. On-premises, you [prepare your VMware environment](../site-recovery/vmware-azure-tutorial-prepare-on-premises.md). When everything's prepared, you set up and enable replication to Azure, and migrate the VMs. [Learn more](../site-recovery/vmware-azure-tutorial.md).
- **Azure Database Migration**: If on-premises machines are running a database such as SQL Server, MySQL, or Oracle, you can use the [Azure Database Migration Service](../dms/dms-overview.md) to migrate them to Azure.


## Next steps

- [Follow the tutorial](tutorial-assessment-vmware.md) to create an assessment for an on-premises VMware VM.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
