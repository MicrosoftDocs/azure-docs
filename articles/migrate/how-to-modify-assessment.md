---
title: Customize assessments for Azure Migrate Server Assessment | Microsoft Docs
description: Describes how to customize assessments created with Azure Migrate Server Assessment
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 07/09/2019
ms.author: raynew
---

# Customize an assessment

This article describes how to customize assessments created by Azure Migrate Server Assessment.

[Azure Migrate](migrate-services-overview.md) provides a central hub to track discovery, assessment, and migration of your on-premises apps and workloads, and private/public cloud VMs, to Azure. The hub provides Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.

You can use the Azure Migrate Server Assessment tool to create assessments for on-premises VMware VMs and Hyper-V VMs, in preparation for migration to Azure. 

## About assessments

There are two types of assessments you can run using Azure Migrate Server Assessment.

**Assessment** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on collected performance data | **Recommended VM size**: Based on CPU and memory utilization data.<br/><br/> **Recommended disk type (standard or premium managed disk)**: Based on the IOPS and throughput of the on-premises disks.
**As on-premises** | Assessments based on on-premises sizing. | **Recommended VM size**: Based on the on-premises VM size<br/><br> **Recommended disk type**: Based on the storage type setting you select for the assessment.


## How is an assessment done?

An Azure Migrate assessment has three stages. Assessment starts with a suitability analysis, followed by sizing, and lastly, a monthly cost estimation. A machine only moves along to a later stage if it passes the previous one. For example, if a machine fails the Azure suitability check, it’s marked as unsuitable for Azure, and sizing and costing won't be done.

## What's in an assessment?

**Property** | **Details**
--- | ---
**Target location** | The Azure location to which you want to migrate.<br/> Azure Migrate currently supports these target regions: Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China North, East Asia, East US, East US2, Germany Central, Germany Northeast, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, South India, UK South, UK West, US Gov Arizona, US Gov Texas, US Gov Virginia, West Central US, West Europe, West India, West US, and West US2.<br/> By default, the target region is set to West US 2.
**Storage type** | Standard HHD disks/Standard SSD disks/Premium.<br/> When you specify the storage type as automatic in an assessment, the disk recommendation is based on the performance data of the disks (IOPS and throughput).<br/> If you specify the storage type as Premium/Standard, the assessment recommends a disk SKU within the storage type selected.<br/> If you want to achieve a single instance VM SLA of 99.9%, you can set the storage type as Premium-managed disks. Then all disks in the assessment will be recommended as Premium-managed disks. <br/> Azure Migrate only supports managed disks for migration assessment.<br/> 
**Reserved Instances (RI)** | Specify this property if you have reserved instances in Azure. Cost estimations in the assessment will take RI discounts into account. Reserved instances are currently only supported for Pay-As-You-Go offers in Azure Migrate.
**Sizing criterion** | Used to right-size VMs. Sizing can be performance-based, or **as on-premises**, without considering performance history.
**Performance history** | The duration to consider for evaluating VM performance. This property is only applicable when sizing is performance-based.
**Percentile utilization** | The percentile value of the performance sample that is used for right-sizing VMs. This property is only applicable when sizing is performance-based.
**VM series** | The VM series used for size estimations. For example, if you have a production environment that you do not plan to migrate to A-series VMs in Azure, you can exclude A-series from the list or series. Sizing is based on the selected series only.
**Comfort factor** | Azure Migrate Server Assessment considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, a 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead.
**Offer** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) you're enrolled to. Azure Migrate estimates the cost accordingly.
**Currency** | Billing currency. 
**Discount (%)** | Any subscription-specific discount you receive on top of the Azure offer.<br/> The default setting is 0%.
**VM uptime** | If your VMs are not going to be running 24x7 in Azure, you can specify the duration (number of days per month and number of hours per day) for which they would be running and the cost estimations would be done accordingly.<br/> The default value is 31 days per month and 24 hours per day.
**Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If set to Yes, non-Windows Azure prices are considered for Windows VMs. | Default is Yes.


## Edit assessment properties

To edit assessment properties after creating an assessment, do the following:

1. In the Azure Migrate project, click **Servers**.
2. In **Azure Migrate: Server Assessment**, click the assessments count.
3. In **Assessment**, click the relevant assessment > **Edit properties**.
5. Customize the assessment properties in accordance with the table above.
6. Click **Save** to update the assessment.


You can also edit assessment properties when you're creating an assessment.


## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
