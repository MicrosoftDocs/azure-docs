---
title: Customize Azure Migrate assessment settings | Microsoft Docs
description: Describes how to set up and run an assessment for migrating VMware VMs to Azure using the Azure Migration Planner
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 01/10/2019
ms.author: raynew
---

# Customize an assessment

[Azure Migrate](migrate-overview.md) creates assessments with default properties. After creating an assessment, you can modify the default properties using the instructions in this article.


## Edit assessment properties

1. In the **Assessments** page of the migration project, select the assessment, and click **Edit properties**.
2. Customize the assessment properties based on the following details:

    **Setting** | **Details** | **Default**
    --- | --- | ---
    **Target location** | The Azure location to which you want to migrate.<br/><br/> Azure Migrate currently supports 30 regions including Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central India, Central US, China East, China North, East Asia, East US, Germany Central, Germany Northeast, East US 2, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, South Central US, Southeast Asia, South India, UK South, UK West, US Gov Arizona, US Gov Texas, US Gov Virginia, West Central US, West Europe, West India, West US, and West US2. |  West US 2 is the default location.
    **Storage type** | You can use this property to specify the type of disks you want to move to in Azure. For as-on premises sizing,  you can specify the target disk type either as Premium-managed disks or Standard-managed disks. For performance-based sizing, you can specify the target disk type either as Automatic, Premium-managed disks or Standard-managed disks. When you specify the storage type as automatic, the disk recommendation is done based on the performance data of the disks (IOPS and throughput). For example, if you want to achieve a [single instance VM SLA of 99.9%](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/), you may want to specify the storage type as Premium-managed disks. This ensures that all disks in the assessment are recommended as Premium-managed disks. Note that Azure Migrate only supports managed disks for migration assessment. | The default value is Premium-managed disks (with Sizing criterion as *as on-premises sizing*).
    **Reserved Instances** |  You can also specify if you have [reserved instances](https://azure.microsoft.com/pricing/reserved-vm-instances/) in Azure and Azure Migrate will estimate the cost accordingly. Reserved instances are currently only supported for Pay-As-You-Go offer in Azure Migrate. | The default value for this property is 3-years reserved instances.
    **Sizing criterion** | The criterion to be used by Azure Migrate to right-size VMs for Azure. You can do either do *performance-based* sizing or size the VMs *as on-premises*, without considering the performance history. | Performance-based sizing is the default option.
    **Performance history** | The duration to consider for evaluating the performance of the VMs. This property is only applicable when sizing criterion is *performance-based sizing*. | Default is one day.
    **Percentile utilization** | The percentile value of the performance sample set to be considered for right-sizing. This property is only applicable when sizing criterion is *performance-based sizing*.  | Default is 95th percentile.
    **VM series** | You can specify the VM series that you would like to consider for right-sizing. For example, if you have a production environment that you do not plan to migrate to A-series VMs in Azure, you can exclude A-series from the list or series and the right-sizing is done only in the selected series. | By default, all VM series are selected.
    **Comfort factor** | Azure Migrate considers a buffer (comfort factor) during assessment. This buffer is applied on top of machine utilization data for VMs (CPU, memory, disk, and network). The comfort factor accounts for issues such as seasonal usage, short performance history, and likely increases in future usage.<br/><br/> For example, 10-core VM with 20% utilization normally results in a 2-core VM. However, with a comfort factor of 2.0x, the result is a 4-core VM instead. | Default setting is 1.3x.
    **Offer** | [Azure Offer](https://azure.microsoft.com/support/legal/offer-details/) that you are enrolled to. | [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/) is the default.
    **Currency** | Billing currency. | Default is US dollars.
    **Discount (%)** | Any subscription-specific discount you receive on top of the Azure offer. | The default setting is 0%.
    **VM uptime** | If your VMs are not going to be running 24x7 in Azure, you can specify the duration (number of days per month and number of hours per day) for which they would be running and the cost estimations would be done accordingly. | The default value is 31 days per month and 24 hours per day.
    **Azure Hybrid Benefit** | Specify if you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If set to Yes, non-Windows Azure prices are considered for Windows VMs. | Default is Yes.

3. Click **Save** to update the assessment.

## FAQs on assessment properties

### What is the difference between as-on-premises sizing and performance-based sizing?

When you specify the sizing criterion to be as-on-premises sizing, Azure Migrate does not consider the performance data of the VMs and sizes the VMs based on the on-premises configuration. If the sizing criterion is performance-based, the sizing is done based on utilization data. For example, if there is an on-premises VM with 4 cores and 8-GB memory with 50% CPU utilization and 50% memory utilization. If the sizing criterion is as on-premises sizing an Azure VM SKU with 4 cores and 8-GB memory is recommended, however, if the sizing criterion is performance-based as VM SKU of 2 cores and 4 GB would be recommended as the utilization percentage is considered while recommending the size.

Similarly, for disks, the disk sizing depends on two assessment properties - sizing criterion and storage type. If the sizing criterion is performance-based and storage type is automatic, the IOPS and throughput values of the disk are considered to identify the target disk type (Standard or Premium). If the sizing criterion is performance-based and storage type is premium, a premium disk is recommended, the premium disk SKU in Azure is selected based on the size of the on-premises disk. The same logic is used to do disk sizing when the sizing criterion is as on-premises sizing and storage type is standard or premium.

### What impact does performance history and percentile utilization have on the size recommendations?

These properties are only applicable for performance-based sizing. Azure Migrate collects performance history of on-premises machines and uses it to recommend the VM size and disk type in Azure.

- The collector appliance continuously profiles the on-premises environment to gather real-time utilization data every 20 seconds.
- The appliance rolls up the 20-second samples, and creates a single data point for every 15 minutes. To create the single data point, the appliance selects the peak value from all the 20-second samples, and sends it to Azure.
- When you create an assessment in Azure, based on the performance duration and performance history percentile value, Azure Migrate calculates the effective utilization value and uses it for sizing.

For example, if you have set the performance duration to be 1 day and percentile value to 95 percentile, Azure Migrate uses the 15-min sample points sent by collector for the last one day, sorts them in ascending order and picks the 95th percentile value as the effective utilization. The 95th percentile value ensures that you are ignoring any outliers, which may come if you pick the 99th percentile. If you want to pick the peak usage for the period and do not want to miss any outliers, you should select the 99th percentile.

## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
