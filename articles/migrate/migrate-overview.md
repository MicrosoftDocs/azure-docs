---
title: About Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migration Planner service.
services: migrate
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 7b313bb4-c8f4-43ad-883c-789824add3288
ms.service: migrate
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/25/2017
ms.author: raynew

---
# About Azure Migrate

The Azure Migrate service helps you to assess on-premises workloads for migration to Azure. The service assesses migration suitability, performance-based sizing, and cost estimations for running your on-premises machines in Azure. If you're contemplating lift-and-shift migrations, or are in early assessment stages of migration, this service is for you.

> [!NOTE]
> Azure Migrate is currently in preview.

## Why use Azure Migrate?

Azure Migrate helps you to assess the following:

- **Azure readiness**: Whether your on-premises machines are suitable for running in Azure. To increase confidence when creating groups of machines for assessment, you can verify machine dependencies using dependency visualization.
- **Size recommendations**: Recommended sizing for Azure VMs after migration, based on the performance history of on-premises VMs. 
- **Monthly costs**: Estimated costs for running on-premises machines in Azure.

## Current limitations

- Currently, you can assess on-premises VMware virtual machines (VMs) for migration to Azure VMs.
- VM you want to assess must be managed by a vCenter server, version 5.5 or 6.0.
- The Azure Migrate portal is currently available in English only.
- You can only create an Azure Migrate project in West Central US. However, you can assess VMs for a different target Azure location.
- Azure Migrate currently supports only [Locally Redundant Storage (LRS)](../storage/common/storage-introduction.md#replication) replication.



## What's in an assessment?

Azure Migrate assessments are based on the settings summarized in the table.

**Setting** | **Details**
--- | ---
**Target location** | The Azure location to which you want to migrate. By default, this is the location in which you create the Azure Migrate project. You can modify this setting.   
**Storage redundancy** | The type of storage that the Azure VMs will use after migration. LRS is the default.
**Pricing plans** | The assessment takes into account whether you're enrolled in software assurance, and cuse the [Azure Hybrid Use Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). It considers whether you have any Azure offers that should be applied, and allows you to specify any subscription-specific discount (in percentage), that you might be getting on top of the offer. 
**Pricing tier**: You can specify the [pricing tier (basic/standard)](../virtual-machines/windows/sizes-general.md) of Azure VMs. This helps you to migrate to a suitable Azure VM family, based on whether you're migrating a production environment. By default the [standard](../virtual-machines/windows/sizes-general.md) tier is used.
**Performance history** | By default, Azure Migrate evaluates the performance of on-premises machines using a month of history, with a 95% percentile value. You can modify this setting.
**Comfort factor** | Azure Migrate considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor is added to account for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, 10-core VM with 20% utilization will normally result in a 2-core VM. However, if we add a comfort factor of 2.0, the result will be a 4-core VM instead. The default comfort setting is 1.3.


## How does Azure Migrate work?

1.	You create an Azure Migrate project.
2.	Azure Migrate uses an on-premises VM called the collector appliance, to discover information about your on-premises machines. To create the appliance, you download the setup file in Open Virtualization Appliance (.ova) format, and import it as a VM on your on-premises vCenter server.
3.	You connect to the VM using read-only credentials for the vCenter server, and run the collector.
4.	The collector collects VM metadata using VMware PowerCLI cmdlets. Discovery is agentless, and doesn't install anything on VMware hosts or VMs. The collected metadata includes VM information, including cores, memory, disks, disk sizes, and network adapters. It also collects performance data for VMs, inlcuding CPU and memory usage, disk IOPS, disk throughput (MBps) and network output (MBps).
5.	The metadata is pushed to the Azure Migrate project. You can view it in the Azure portal.
6.	For the purposes of assessment, you gather VMs into groups. For example, you can group VMs that run the same app. You can group VMs using tagging in vCenter, or in the Azure portal.
7.	You run an assessment for a group.
8.	After the assessment finishes, you can view it in the portal, or download it in Excel format.



  ![Azure Planner architecture](./media/migration-planner-overview/overview-1.png)

## Next steps 
[Follow a tutorial](tutorial-assessment-vmware.md) to create an assessment for an on-premises VMware VM.
