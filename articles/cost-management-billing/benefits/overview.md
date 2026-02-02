---
title: Billing benefits overview
description: Quick primer to learn how about the different types of billing benefits offered by Microsoft 
author: benshy
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/20/2026
ms.author: benshy
#customer intent: As a Microsoft Customer Agreement billing owner, I want to learn about the different types billing benefits offered 
service.tree.id: cf90d1aa-e8ca-47a9-a6d0-bc69c7db1d52
---

# Billing benefits overview

Billing benefits are a set of offers - such as discounts, credits, and cost-optimizing commitments that provide customers with financial advantages. These billing benefits can help customers reduce spend, plan capacity confidently, and align purchasing with business needs

Azure models billing benefits as **Azure Resource Manager (ARM) resources**, enabling consistent lifecycle management across the Azure portal, APIs, and SDKs. For more information, see: [What is a cloud subscription?](../../cost-management-billing/manage/cloud-subscription.md)

---

## What are billing benefits?

A *billing benefit* is any offer that changes the effective cost associated with service usage or purchases. These benefits typically fall into one of four categories:


### Commitments

Long-term agreements where customers commit to spending a certain amount or using certain resource types in exchange for lower prices or optimized billing.  

Examples:

- [Microsoft Azure Consumption Commitment (MACC)](../../marketplace/azure-consumption-commitment-benefit.md#determine-which-offers-are-eligible-for-azure-consumption-commitments-maccctc)
- [Reservations](../reservations/save-compute-costs-reservations.md)
- [Savings plan](../savings-plan/savings-plan-compute-overview.md)


### Credits

Credits act like a monetary balance applied toward applicable Azure usage.  

Examples:

- Promotional credits
- [Azure Credit Offers (ACO)](credits/mca-check-azure-credits-balance.md)


### Discounts

Discounts lower the purchase price or usage charges of eligible resources.


### Free Azure services

Free services provide a set monthly amount to help you explore and test solutions at no cost.

For more information, see: [Create Your Azure Free Account Or Pay As You Go](https://azure.microsoft.com/pricing/purchase-options/azure-account)

---

## Manage billing benefits in Azure

Billing benefits can be viewed and managed through multiple supported interfaces:

### Azure portal

Customers can view and manage billing benefits—including credits and discounts—in dedicated experiences within **Cost Management + Billing** and dedicated **Credits**, **Discounts**, and **Microsoft Azure Consumption Commitments** service views. The portal views summarize benefit metadata, balance (for credits), and usage impact.

### Azure Resource Manager

Most billing benefit types are implemented as Azure Resource Manager resource types under the Microsoft.BillingBenefits provider.  
Examples:

- `Microsoft.BillingBenefits/discounts`
- `Microsoft.BillingBenefits/credits`
- `Microsoft.BillingBenefits/savingsPlanOrders/savingsPlans`


### REST APIs

Developers can programmatically interact with billing benefits using the **Azure Billing Benefits REST API**, which provides operations for managing benefits such as savings plans and discount-related resources.


### SDKs and CLI

Azure SDKs (.NET, Python, JavaScript) and the Azure CLI (`az billingbenefits`) support reading or managing billing benefits programmatically.  

See: [Azure PowerShell Billing Benefits Module](/powershell/module/az.billingbenefits/)

---

## Related content

- [What are Azure Reservations?](../reservations/save-compute-costs-reservations.md)
- [What is Azure savings plans for compute?](../savings-plan/savings-plan-compute-overview.md)
- [Azure Consumption Commitment Benefit](../../marketplace/azure-consumption-commitment-benefit.md#determine-which-offers-are-eligible-for-azure-consumption-commitments-maccctc)
- [Azure Billing Benefits REST API](/rest/api/billingbenefits/operation-groups)
- [Resource Provider: Microsoft.BillingBenefits (Azure Resource Manager reference)](/azure/templates/microsoft.billingbenefits/allversions)
