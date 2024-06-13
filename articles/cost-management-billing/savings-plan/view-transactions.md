---
title: View Azure savings plan purchase transactions
titleSuffix: Microsoft Cost Management
description: Learn how to view saving plan purchase transactions and details.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 11/17/2023
ms.author: banders
---

# View Azure savings plan purchase transactions

You can view savings plan purchase and refund transactions in the Azure portal.

## View savings plan purchases in the Azure portal

Enterprise Agreement and Microsoft Customer Agreement billing readers can view accumulated purchases for reservations in cost analysis.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to **Cost Management + Billing**.
3. Select **Cost analysis** in the left menu.
4. Apply a filter for **Pricing Model** and then select **SavingsPlan**.
5. To view purchases for reservations, apply a filter for **Charge Type** and then select  **purchase**.
6. Set the **Granularity** to **Monthly**.
7. Set the chart type to **Column (Stacked)**.  
    :::image type="content" source="./media/view-transactions/accumulated-costs-cost-analysis.png" alt-text="Screenshot showing accumulated cost in cost analysis." lightbox="./media/view-transactions/accumulated-costs-cost-analysis.png" :::


## View payments made

You can view payments that were made using APIs, usage data, and cost analysis. For savings plans paid for monthly, the frequency value is shown as  **recurring** in the usage data and the Savings Plan Charges API. For savings plans paid up front, the value is shown as **onetime**.

Cost analysis shows monthly purchases in the default view. Apply the **purchase** filter to **Charge type** and **recurring** for **Frequency** to see all purchases. To view only savings plans, apply a filter for **Savings Plan**.

:::image type="content" source="./media/buy-savings-plan/cost-analysis-savings-plan-costs.png" alt-text="Screenshot showing saving plan costs in cost analysis." lightbox="./media/buy-savings-plan/cost-analysis-savings-plan-costs.png" :::

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

- To learn how to manage a reservation, see [Manage Azure Savings plans](manage-savings-plan.md).
