---
title: Troubleshoot Azure savings plan utilization
titleSuffix: Microsoft Cost Management
description: This article helps you understand why Azure savings plans can temporarily have utilization greater than 100% in usage reporting UIs and APIs.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: troubleshooting
ms.date: 11/17/2023
ms.author: banders
---

# Troubleshoot Azure savings plan utilization

This article helps you understand why Azure savings plans can temporarily have high utilization.

## Why is my savings plan utilization lower than expected?

Only usage from eligible Azure resources may receive cost savings through Azure savings plan. Resource eligibility requires both of the following criteria to be met:
1. Benefit scope - the resource must be within the benefit scope of the savings plan. To learn more, see [Savings plan scopes](scope-savings-plan.md)
2. Product inclusion - the resource must be an instance of a product that is included in the savings plan model. To learn which products are eligible for savings plan, follow the instruction in [Download your savings plan price sheet](download-savings-plan-price-sheet.md)

There are numerous reasons that an Azure saving plan may be underutilized. Examples are listed below. In some cases, broadening the savings plan benefit scope can result in greater utilization.
- **Custom hourly commitment too large** - it is important to follow purchase recommendations provided through Azure Advisor, the savings plan purchase experience in Azure portal, and through the Savings plan benefit recommendations API. Purchasing an amount greater than the recommended value may result in underutilization, and negatively impact your cost savings goals. To learn more, see [Azure savings plans recommendations](purchase-recommendations.md).
- **Recent changes in resource usage** - your savings plan-eligible usage may have recently decreased. Reasons for these changes include:
  - ***VM rightsizing*** - To learn more, see [VM shutdown recommendations](../../advisor/advisor-cost-recommendations.md#shutdown-recommendations)
  - ***VM shutdowns*** - To learn more, see [Resize SKU recommendations](../../advisor/advisor-cost-recommendations.md#resize-sku-recommendations)
  - ***switch to non-eligible products*** - To learn which products are savings plan-eligible, compare your usage to the list of saving plan-eligible products in your price sheet. See instructions to [Download your savings plan price sheet](download-savings-plan-price-sheet.md)
- **Recent savings plan/reservation purchase** - Savings plans and Azure reservations can provide cost savings benefits to some of the same types of products. A recently purchased/re-scoped reservation may be providing benefits to usage that was previously covered by your savings plan. Please review, and consider adjusting, the benefit scope(s) of any recently purchased savings plan(s) or reservations(s).
- **Narrow benefit scope** - Your savings plan's scope may be excluding more usage than you intend. To learn more, see [Savings plan scopes](scope-savings-plan.md).

## Why am I incurring on-demand charges while my savings plan utilization is less than 100%?

Azure saving plan is an hourly benefit - this means each of the 24 hours in a day is a separate benefit window. In some hours, you may be underutilizing your savings plan benefits. In other hours, you may be fully utilizing your savings plan, and also incurring on-demand charges. When viewed from the daily usage perspective, you may see both plan underutilization and, on-demand charges, for the same day.

## Why is my savings plan utilization greater than 100%?

Azure savings plans can temporarily have utilization greater than 100%, as shown in the Azure portal and from APIs.

Azure saving plan benefits are flexible and cover usage across various products and regions. Under an Azure savings plan, Azure applies plan benefits to your usage that has the largest percentage discount off its pay-as-you-go rate first, until we reach your hourly commitment.

The Azure usage and billing systems determine your hourly cost by examining your usage for each hour. Usage of all services that you used in the previous hour is reported to the Azure billing systems. However, usage isn't always sent instantly, which makes it difficult to determine which resources should receive the benefit. To compensate, Azure temporarily applies the maximum benefit to all usage received. This may result in Azure applying benefits that are greater than the hourly commitment. Azure then does extra processing to quickly reconcile utilization back down to 100%. Periods of such overutilization are most likely to appear immediately after a usage hour.

## Next steps

- Learn more about [Azure saving plans](index.yml).
