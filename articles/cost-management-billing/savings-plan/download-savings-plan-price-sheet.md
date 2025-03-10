---
title: Download your savings plan price sheet
titleSuffix: Microsoft Cost Management
description: This article explains how you can download the price sheet for an Enterprise Agreement (EA) or Microsoft Customer Agreement (MCA).
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 01/07/2025
ms.author: banders
---

# Download your savings plan price sheet

This article explains how you can download the price sheet for an Enterprise Agreement (EA) or Microsoft Customer Agreement (MCA) via the Azure portal. Included in the price sheet is the list of products that are eligible for savings plans, as well as the 1- and 3-year savings plans prices for these products.

## Download EA price sheet

To download your EA price sheet via Azure portal, do the following tasks.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for **Cost Management + Billing**.
3. Select your billing profile.
4. In the left menu under Billing, select **Usage + charges**.
5. Select the desired month and select the corresponding **Download** link.
6. In the Download Usage + Charges window, under Price Sheet, select **Prepare Download Azure**. File generation may take a few moments.
7. After you receive a notification that the price sheet is ready, select **Download csv**.
8. Open the file and filter on `Price type` to see `SavingsPlan` price records.

## Download MCA price sheet

To download your MCA price sheet via Azure portal, do the following tasks.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for **Cost Management + Billing**.
3. Select your billing account.
4. At the bottom of the page in the **Shortcuts** section, select **Download usage and prices**.
5. Select **Download Azure price sheet for** _current month and year_. File generation may take a few moments.
6. Open the file and filter on `priceType` to see `SavingsPlan` plan price records.

## Download price sheet using APIs
To learn more about downloading your price sheet using price sheet APIs, see the following articles:
  - [Learn more about EA price sheet](/rest/api/cost-management/price-sheet).
  - [Learn more about MCA price sheet](/rest/api/consumption/price-sheet).
  - [Learn more about retail price sheet](/rest/api/cost-management/retail-prices/azure-retail-prices).


## Need help? Contact us.

If you have questions about Azure savings plan for compute, contact your account team or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides expert support for Azure savings plan for compute in English.

## Next steps

- To learn more about Azure Savings plans, see the following articles:
  - [What are Azure Savings plans?](savings-plan-compute-overview.md)
  - [Manage Azure savings plans](manage-savings-plan.md)
  - [How saving plan discount is applied](discount-application.md)
  - [Understand savings plan costs and usage](utilization-cost-reports.md)
  - [Software costs not included with Azure savings plans](software-costs-not-included.md)
