---
title: Billing Benefits Overview
description: Learn about the types of billing benefits that Microsoft offers. 
author: benshy
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 01/20/2026
ms.author: benshy
#customer intent: As a Microsoft Customer Agreement billing owner, I want to learn about the types of billing benefits that Microsoft offers so that I can optimize costs. 
service.tree.id: cf90d1aa-e8ca-47a9-a6d0-bc69c7db1d52
---

# Billing benefits overview

A *billing benefit* is any offer that provides customers with financial advantages by changing the effective cost associated with service usage or purchases. These offers can include discounts, credits, and cost-optimizing commitments. Billing benefits can help customers reduce spending, plan capacity confidently, and align purchasing with business needs.

Azure models billing benefits as Azure Resource Manager resources to enable consistent lifecycle management across the Azure portal, APIs, and SDKs. For more information, see [What is a cloud subscription?](../../cost-management-billing/manage/cloud-subscription.md)

## Types of billing benefits

Billing benefits typically fall into one of the following four categories.

### Commitments

Commitments are long-term agreements where customers commit to spending a certain amount or using certain resource types in exchange for lower prices or optimized billing.  

Examples include:

- [Microsoft Azure Consumption Commitments (MACCs)](../../marketplace/azure-consumption-commitment-benefit.md#determine-which-offers-are-eligible-for-azure-consumption-commitments-maccctc)
- [Reservations](../reservations/save-compute-costs-reservations.md)
- [Savings plans](../savings-plan/savings-plan-overview.md)

### Credits

Credits act like a monetary balance applied toward applicable Azure usage.  

Examples include:

- Promotional credits
- [Azure Credit Offers (ACOs)](credits/mca-check-azure-credits-balance.md)

### Discounts

Discounts lower the purchase price or usage charges of eligible resources.

### Free Azure services

Free services provide a set monthly amount to help you explore and test solutions at no cost.

For more information, see the [Azure page about choosing an account](https://azure.microsoft.com/pricing/purchase-options/azure-account).

## Management of billing benefits in Azure

You can view and manage billing benefits through multiple supported interfaces.

### Azure portal

You can view and manage billing benefits, including credits and discounts, in the Azure portal. The portal provides dedicated experiences within **Cost Management + Billing**, along with dedicated **Credits**, **Discounts**, and **Microsoft Azure Consumption Commitments** service views. The portal views summarize benefit metadata, balance (for credits), and usage impact.

### Azure Resource Manager

Most billing benefit types are implemented as Resource Manager resource types under the `Microsoft.BillingBenefits` provider.  

Examples include:

- `Microsoft.BillingBenefits/discounts`
- `Microsoft.BillingBenefits/credits`
- `Microsoft.BillingBenefits/savingsPlanOrders/savingsPlans`

### REST APIs

Developers can programmatically interact with billing benefits by using the Azure Billing Benefits REST API. It provides operations for managing benefits such as savings plans and discount-related resources.

### SDKs and CLI

Azure SDKs (.NET, Python, JavaScript) and the Azure CLI (`az billingbenefits`) support reading or managing billing benefits programmatically.  

See the [Azure PowerShell billing benefits module](/powershell/module/az.billingbenefits/).

## Related content

- [What are Azure reservations?](../reservations/save-compute-costs-reservations.md)
- [What are Azure savings plans for compute?](../savings-plan/savings-plan-overview.md)
- [Azure Consumption Commitment enrollment](../../marketplace/azure-consumption-commitment-benefit.md#determine-which-offers-are-eligible-for-azure-consumption-commitments-maccctc)
- [Azure Billing Benefits REST API](/rest/api/billingbenefits/operation-groups)
- [Resource provider: Microsoft.BillingBenefits (Azure Resource Manager reference)](/azure/templates/microsoft.billingbenefits/allversions)
