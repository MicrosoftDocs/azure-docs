---
title: Troubleshoot savings plan utilization
titleSuffix: Microsoft Cost Management
description: This article helps you understand why savings plans can temporarily have utilization greater than 100% in usage reporting UIs and APIs.
author: nwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: troubleshooting
ms.date: 10/29/2026
ms.author: onwokolo
---

# Troubleshoot savings plan utilization

This article helps you understand why savings plans can temporarily have high utilization.

## Why is my savings plan utilization lower than expected?

Only usage from eligible Azure resources can receive savings plan benefits. Resources must meet both of the following eligibility criteria:
1. Benefit scope - The resource must be within the savings plan's benefit scope. To learn more, see [Savings plan scopes](scope-savings-plan.md).
2. Product inclusion - The resource must be an instance of a product included in the savings plan model. To learn which products are eligible for a savings plan, follow the instructions in [Download your savings plan price sheet](download-savings-plan-price-sheet.md).

There are several reasons a savings plan might be underutilized, as shown in the following examples. In some cases, broadening the savings plan's benefit scope can increase utilization.
- **Custom hourly commitment too large** - Follow the purchase recommendations provided through Azure Advisor, the savings plan purchase experience in the Azure portal, and the Savings plan benefit recommendations API. Purchasing a commitment greater than the recommended value might result in underutilization and reduce your cost savings. To learn more, see [Savings plan recommendations](purchase-recommendations.md).
- **Recent changes in resource usage** - Your savings plan-eligible usage might have recently decreased. Reasons for these changes include:
  - ***VM rightsizing*** - To learn more, see [VM shutdown recommendations](/azure/advisor/advisor-cost-recommendations#shutdown-recommendations)
  - ***VM shutdowns*** - To learn more, see [Resize SKU recommendations](/azure/advisor/advisor-cost-recommendations#resize-sku-recommendations)
  - ***Switch to ineligible products*** - To learn which products are savings plan-eligible, compare your usage with the list of eligible products in your price sheet. Follow the instructions in [Download your savings plan price sheet](download-savings-plan-price-sheet.md).
- **Recent savings plan or reservation purchase** - Savings plans and Azure reservations can provide savings for some of the same products. A recently purchased or rescoped reservation might provide benefits for usage previously covered by your savings plan. Review the benefit scopes of any recently purchased savings plans or reservations and consider adjusting them.
- **Narrow benefit scope** - Your savings plan's scope may be excluding more usage than you intend. To learn more, see [Savings plan scopes](scope-savings-plan.md).

## Why am I incurring on-demand charges while my savings plan utilization is less than 100%?

A savings plan is an hourly benefit, so each of the 24 hours in a day is a separate benefit window. In some hours, you might underutilize your savings plan benefits. In other hours, you might fully utilize your savings plan and also incur on-demand charges. When you view daily usage, you might see both plan underutilization and on-demand charges for the same day.

## Why is my savings plan utilization greater than 100%?

Savings plans can temporarily have utilization greater than 100%, as shown in the Azure portal and from APIs.

Savings plan benefits are flexible and cover usage across various products and regions. Azure first applies plan benefits to the usage with the largest percentage discount from its pay-as-you-go rate, continuing until your hourly commitment is reached.

The Azure usage and billing systems determine your hourly cost by examining your usage for each hour. Usage for all services you used in the previous hour is reported to the Azure billing systems. However, usage isn't always reported immediately, which makes it difficult to determine which resources should receive the benefit. To compensate, Azure temporarily applies the maximum benefit to all usage received. This process might result in benefits that exceed the hourly commitment. Azure then performs additional processing to reconcile utilization back to 100%. Periods of overutilization are most likely to appear immediately after a usage hour.

## Next steps

- Learn more about [savings plans](index.yml).
