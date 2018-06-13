---
title: Customize Azure Migrate assessment settings | Microsoft Docs
description: Describes how to set up and run an assessment for migrating VMware VMs to Azure using the Azure Migration Planner
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 05/31/2018
ms.author: raynew
---

# Customize an assessment

[Azure Migrate](migrate-overview.md) creates assessments with default properties. After creating an assessment, you can modify the default properties using the instructions in this article.


## Edit assessment properties

1. In the **Assessments** page of the migration project, select the assessment, and click **Edit properties**.
2. Modify the properties in accordance with the following table:

    **Setting** | **Details** | **Default**
    --- | --- | ---
    **Target location** | The Azure location to which you want to migrate.<br/><br/> Azure Migrate currently supports 30 regions including Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China North, East Asia, East US, Germany Central, Germany Northeast, East US 2, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, South India, UK South, UK West, US Gov Arizona, US Gov Texas, US Gov Virginia, West Central US, West Europe, West India, West US, and West US2. |  West US 2 is the default location.
    **Storage type** | You can specify the type of disks you want to allocate in Azure. This property is applicable when the sizing criterion is as on-premises sizing. You can specify the target disk type either as Premium managed disks or Standard managed disks. For performance-based sizing, the disk recommendation is automatically done based on the performance data of the VMs. Note that Azure Migrate only supports managed disks for migration assessment. | The default value is Premium managed disks (with Sizing criterion as *as on-premises sizing*).
    **Sizing criterion** | The criterion to be used by Azure Migrate to right-size VMs for Azure. You can do either do *performance-based* sizing or size the VMs *as on-premises*, without considering the performance history. | Performance-based sizing is the default option.
    **Performance history** | The duration to consider for evaluating the performance of the VMs. This property is only applicable when sizing criterion is *performance-based sizing*. | Default is one day.
    **Percentile utilization** | The percentile value of the performance sample set to be considered for right-sizing. This property is only applicable when sizing criterion is *performance-based sizing*.  | Default is 95th percentile.
    **VM series** | You can specify the VM series that you would like to consider for right-sizing. For example, if you have a production environment that you do not plan to migrate to A-series VMs in Azure, you can exclude A-series from the list or series and the right-sizing will be done only in the selected series. | By default, all VM series are selected.
    **Pricing tier** | You can specify the [pricing tier (Basic/Standard)](../virtual-machines/windows/sizes-general.md) for the target Azure VMs. For example, if you are planning to migrate a production environment, you would like to consider the Standard tier, which provides VMs with low latency but may cost more. On the other hand, if you have a Dev-Test environment, you may want to consider the Basic tier that has VMs with higher latency and lower costs. | By default the [Standard](../virtual-machines/windows/sizes-general.md) tier is used.
    **Comfort factor** | Azure Migrate considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead. | Default setting is 1.3x.
    **Offer** | [Azure Offer](https://azure.microsoft.com/support/legal/offer-details/) that you are enrolled to. | [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/) is the default.
    **Currency** | Billing currency. | Default is US dollars.
    **Discount (%)** | Any subscription-specific discount you receive on top of the Azure offer. | The default setting is 0%.
    **Azure Hybrid Benefit** | Specify if you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If set to Yes, non-Windows Azure prices are considered for Windows VMs. | Default is Yes.

3. Click **Save** to update the assessment.


## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
