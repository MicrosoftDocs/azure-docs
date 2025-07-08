---
title: VM Assessment properties
description: Describes the components of an Azure VM assessment in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 04/17/2025
monikerRange: migrate
# Customer intent: As a cloud architect, I want to customize VM assessment properties in Azure Migrate, so that I can tailor the assessment to the specific needs of my workloads and optimize resource allocation for migration.
---

# Customize VM assessment properties 

This article describes VM assessment properties that you can use to customize the assessment to fit your requirements. Also, see the [general assessment properties](assessment-properties.md) that are applicable for all workloads in cross-workload assessment.

## Assessment properties
This section describes the components that are part of an assessment.

| **Setting Category**  | **Setting** | **Details** |                
|-------------------|---------|--------  |                                                     
| **Target settings**   | **Target VM series**         | The Azure VM series that you want to consider for rightsizing. For example, if you don't have a production environment that needs A-series VMs in Azure, you can exclude A-series from the list of series. The availability of VM series depends on the target location selected. [Learn more](/azure/virtual-machines/sizes/overview?branch=main&branchFallbackFrom=release-migrate-new-structure&tabs=breakdownseries,generalsizelist,computesizelist,memorysizelist,storagesizelist,gpusizelist,fpgasizelist,hpcsizelist). |
| **Target settings**   | **Target storage disk**      | Specifies the type of target storage disk as Premium-managed, Standard HDD-managed, Standard SSD-managed, or Ultra disk. <br> **Premium or Standard or Ultra disk**: The assessment recommends a disk SKU within the storage type selected. <br>If you want a single-instance VM service level agreement (SLA) of 99.9%, consider using Premium-managed disks. This ensures that all disks are recommended as Premium-managed disks. <br> If you're looking to run data-intensive workloads that need high throughput, high IOPS, and consistent low latency disk storage, consider using Ultra disks. <br> Azure Migrate supports only Managed disks for migration assessment.  |
| **Right-Sizing**      | **Sizing criteria**          | This attribute is used for right-sizing the target recommendations. <br> Use **as-is on-premises** sizing if you don't want to right size the targets and identify the targets according to your configuration for on-premises workloads. Use **performance-based** sizing to calculate compute recommendation based on CPU and memory utilization data and storage recommendation based on the input/output operations per second (IOPS) and throughput of the on-premises disks.  |
| | **VM uptime** | The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration. The default values are 31 days per month and 24 hours per day. | 
| | **Azure Hybrid Benefit**| Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) to use your existing OS licenses. For Azure VM assessments, you can bring in both Windows and Linux licenses. If the setting is enabled, Azure prices for selected operating systems aren't considered for VM costing.  |

> [!Note] 
> * Azure Migrate supports only Managed disks for migration assessment. 
> * In Azure Government, it is recommended to review the [[supported target](supported-geographies.md)] assessment locations. VM size recommendations in assessments will use the VM series specifically designed for Government Cloud regions.  [Learn more](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia&products=virtual-machines).

## Next Steps
[Review](best-practices-assessment.md) the best practices for creating an assessment with Azure Migrate. 