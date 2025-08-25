---
title: Assessment properties
description: Describes the components of an assessment in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 04/17/2025
monikerRange: migrate
# Customer intent: As a cloud architect, I want to configure assessment properties for workload migration, so that I can ensure optimal resource allocation, cost management, and security compliance in Azure.
---

# General assessment properties 

This article explains the assessment properties on the **General** tab that you can use when creating an assessment. These general properties apply to all workloads in an application or for cross-workload assessments. They also apply to individual workload assessments. 

| **Setting Category**  | **Default Setting** | **Details** |                
|-------------------|---------|--------  |                                                     
| **Target settings**   | **Target location**         | The Azure region to which you want to migrate. Azure target configuration and cost recommendations are based on the location that you specify. |
| **Target settings**   | **Default Environment**      | The environment for the target deployments to apply pricing applicable to Production or Dev/Test. |
| **Right-Sizing**      | **Sizing criteria**          | This attribute is used for right-sizing the target recommendations. <br> Use as-is on-premises sizing if you don't want to right-size the targets and identify the targets according to your configuration for on-premises workloads. Use **performance-based** sizing to calculate compute recommendation based on CPU and memory utilization data. Use the storage recommendation based on the input/output operations per second (IOPS) and throughput of the on-premises disks.  |
| **Right-Sizing**              | **Performance history**      | Used with performance-based sizing. Performance history specifies the duration used when performance data is evaluated. |
|  **Right-Sizing**               | **Percentile utilization**   | Used with performance-based sizing. Percentile utilization specifies the percentile value of the performance sample used for rightsizing. Learn more about [sampling mechanism](target-right-sizing.md). |
|  **Right-Sizing**                 | **Comfort factor**           | This is the buffer applied during assessment. It's a multiplying factor used with performance metrics of CPU, RAM, disk, and network data for VMs. It accounts for issues like seasonal usage, short performance history, and likely increases in future usage. The comfort factor is applied irrespective of type of assessment (As-is on premises or performance based). For **performance-based** assessment, it's multiplied with utilization value of the resources, whereas for **As-is on premises** assessment it's multiplied by allocated resources. <br> The default values change. <br>  For example, a 10-core VM with 20% utilization normally results in a two-core VM. With a comfort factor of 2.0, the result is a four-core VM instead. |
| **Pricing settings**  | **Default savings option**  | Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. </br> [Azure reservations](/azure/cost-management-billing/reservations/save-compute-costs-reservations?view=migrate&preserve-view=true) (One year or three years reserved) are a good option for the most consistently running resources. </br> [Azure Savings Plan](/azure/cost-management-billing/savings-plan/savings-plan-compute-overview?view=migrate&preserve-view=true) (One year or three years savings plan) provide additional flexibility and automated cost optimization. </br> When you select **None**, the Azure compute cost is based on the Pay-as-you-go rate considering 730 hours as VM uptime, unless specified otherwise in VM uptime attribute.|
| |**Offer/Licensing program**| The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer. Select one of the pay-as-you-go, Enterprise Agreement support, or pay-as-you-go Dev/Test. </br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than **None**, the *Discount (%)* and *VM uptime* properties aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended SKU.|
| |**Currency** | The billing currency for your account.| 
| |**Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. | 
| | **VM uptime** | The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration. The default values are 31 days per month and 24 hours per day. | 
| | **Azure Hybrid Benefit**| Specifies if you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) to use your existing OS licenses. For Azure VM assessments, you can bring in both Windows and Linux licenses. If the setting is enabled, Azure prices for selected operating systems aren't considered for VM costing.  |
|**Security** | **Security** | Specifies if you want to assess readiness and cost for security tooling on Azure. If the setting has the default value **Yes, with Microsoft Defender for Cloud**, it assesses security readiness and costs for your Azure VM with Microsoft Defender for Cloud. | 
|**VM Security Type** | | Specifies is you want to verify readiness for **Trusted Launch Virtual Machines (TVMs)**, Standard Virtual Machines, or both. By default, readiness is verified for both. We recommend to migrate eligible VMs to **Trusted Launch**, as TVMs provide enhanced security features, such as secure boot and virtual TPM at no extra cost.| 