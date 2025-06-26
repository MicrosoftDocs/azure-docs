--- 
title: Cost estimation of assessments in Azure Migrate  
description: Learn about cost estimation in assessments in Azure Migrate  
author: ankitsurkar06
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 04/17/2025
ms.custom: engagement-fy24
monikerRange: migrate
---

# Cost estimation of Assessment in Azure Migrate

Azure Migrate assessments provide you with an estimated cost of hosting the recommended targets on Azure. These costs are identified for each right-sized target on Azure. 

> [!NOTE]
> The cost estimates are dependent on the rates in the specified region, any applicable offers, and the licensing program selected by you. 

This article describes Azure Migrate assessments, which estimate hosting costs for recommended targets on Azure, based on region rates, applicable offers, and selected licensing programs.

## Pricing settings 

The following assessment attributes affect your cost estimates: 

| **Setting** | **Details** |
| --- | ---  |
| **Savings options (compute)** | Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. </br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (One year or three years reserved) are a good option for the most consistently running resources. </br> [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (One year or three years savings plan) provide additional flexibility and automated cost optimization. </br>When you select **None**, the Azure compute cost is based on the Pay as you go rate considering 730 hours as VM uptime, unless specified otherwise in VM uptime attribute. |
|**Offer/Licensing program**| The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer. Select one of the pay-as-you-go, Enterprise Agreement support, or pay-as-you-go Development/Testing. </br>You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than **None**, the *Discount (%)* and *VM uptime* properties aren't applicable. The monthly cost estimates are calculated by multiplying 744 hours in the VM uptime field with the hourly price of the recommended subscription. |
|**Currency** | The billing currency for your account.| 
|**Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. | 
| **VM uptime** | The duration in days per month and hours per day for Azure VMs that won't run continuously. Cost estimates are based on that duration. The default values are 31 days per month and 24 hours per day. | 
| **Azure Hybrid Benefit** | Specifies whether you have software assurance and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/) to use your existing OS licenses. For Azure VM assessments, you can bring in both Windows and Linux licenses. If the setting is enabled, Azure prices for selected operating systems aren't considered for VM costing. | 

## Next steps 

- Learn about discovering servers running in [VMware](./tutorial-discover-vmware.md) and [Hyper-V ](./tutorial-discover-hyper-v.md) environment, and [physical servers](./tutorial-discover-physical.md). 
 
