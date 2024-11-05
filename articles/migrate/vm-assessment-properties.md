---
title: VM Assessment properties
description: Describes the components of an Azure VM assessment in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 11/05/2024
---

# Customise VM assessment properties 

In this article we will look at VM assessment properties that you can use to customize the assessment to fit your requirements. Please take a look at general assessment properties that will be applicable for all workloads in cross-workload assessment at: general assessment properties.  

Setting Category 

Setting 

Details 

Target settings 

Target VM series  

The Azure VM series that you want to consider for rightsizing. For example, if you don't have a production environment that needs A-series VMs in Azure, you can exclude A-series from the list of series. The availability of VM series depends on the target location selected. Learn more about VM families.  

Target settings 

Target storage disk  

Specifies the type of target storage disk as Premium-managed, Standard HDD-managed, Standard SSD-managed, or Ultra disk. 
 
Premium or Standard or Ultra disk: The assessment recommends a disk SKU within the storage type selected. 
 
If you want a single-instance VM service-level agreement (SLA) of 99.9%, consider using Premium-managed disks. This would ensure that all disks are recommended as Premium-managed disks. 
 
If you're looking to run data-intensive workloads that need high throughput, high IOPS, and consistent low latency disk storage, consider using Ultra disks. 
 
Azure Migrate supports only managed disks for migration assessment. 

Right-Sizing  

Sizing criteria 

This attribute is used for right-sizing the target recommendations.  
Use as-is on-premises sizing if you do not want to right-size the targets and identify the targets according to your configuration for on-premises workloads. Use performance-based sizing to calculate compute recommendation based on CPU and memory utilization data and storage recommendation based on the input/output operations per second (IOPS) and throughput of the on-premises disks. 

 

VM uptime 

The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration. 
The default values are 31 days per month and 24 hours per day. 

 

Azure Hybrid Benefit 

Specifies whether you have software assurance and are eligible for Azure Hybrid Benefit to use your existing OS licenses. For Azure VM assessments you can bring in both Windows as well as Linux licenses.  
If the setting is enabled, Azure prices for selected operating systems are not considered for VM costing. 

Note 

In Azure Government, review the supported target assessment locations. Note that VM size recommendations in assessments will use the VM series specifically for Government Cloud regions. Learn more about VM types. 

Review the best practices for creating an assessment with Azure Migrate. 