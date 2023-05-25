---
title: Calculate Enterprise Agreement (EA) savings plan cost savings
titleSuffix: Microsoft Cost Management
description: Learn how Enterprise Agreement users manually calculate their savings plan savings.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 04/03/2023
ms.author: banders
---

# Calculate EA savings plan cost savings

This article helps Enterprise Agreement (EA) users manually calculate their savings plan savings. In this article, you download your amortized usage and charges file, prepare an Excel worksheet, and then do some calculations to determine your savings. There are several steps involved and we walk you through the process. Although the example process shown in this article uses Excel, you can use the spreadsheet application of your choice.

> [!NOTE]
> The prices shown in this article are for example purposes only.

This article is specific to EA users. Microsoft Customer Agreement (MCA) users can use similar steps to calculate their savings plan savings through invoices. However, the MCA amortized usage file doesn't contain UnitPrice (on-demand pricing) for savings plans. Other resources in the file do. For more information, see [Download usage for your Microsoft Customer Agreement](../savings-plan/utilization-cost-reports.md).

## Required permissions

To view and download usage data as an EA customer, you must be an Enterprise Administrator, Account Owner, or Department Admin with the view charges policy enabled.

## Download all usage amortized charges

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for _Cost Management + Billing_.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/search-cost-management.png" alt-text="Screenshot showing search for cost management." lightbox="./media/calculate-ea-savings-plan-savings/search-cost-management.png" :::
3. If you have access to multiple billing accounts, select the billing scope for your EA billing account.
4. Select **Usage + charges**.
5. For the month you want to download, select **Download**.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/download-usage-ea.png" alt-text="Screenshot showing Usage + charges download." lightbox="./media/calculate-ea-savings-plan-savings/download-usage-ea.png" :::
6. On the Download Usage + Charges page, under Usage Details, select **Amortized charges (usage and purchases)**.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/select-usage-detail-charge-type-small.png" alt-text="Screenshot showing the Download usage + charges window." lightbox="./media/calculate-ea-savings-plan-savings/select-usage-detail-charge-type.png" :::
7. Select **Prepare document**.
8. It could take a while for Azure to prepare your download, depending on your monthly usage. When it's ready for download, select **Download csv**.

## Prepare data and calculate savings

Because Azure usage files are in CSV format, you need to prepare the data for use in Excel. Then you calculate your savings.

1. Open the amortized cost file in Excel and save it as an Excel workbook.
2. The data resembles the following example.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/unformatted-data.png" alt-text="Example screenshot of the unformatted amortized usage file." lightbox="./media/calculate-ea-savings-plan-savings/unformatted-data.png" :::
3. In the Home ribbon, select **Format as Table**.
4. In the Create Table window, select **My table has headers**.
5. In the **benefitName** column, set a filter to clear **Blanks**.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/savings-plan-name-clear-blanks.png" alt-text="Screenshot showing clear Blanks data." lightbox="./media/calculate-ea-savings-plan-savings/savings-plan-name-clear-blanks.png" :::
6. Find the **ChargeType** column and then to the right of the column name, select the sort and filter symbol (the down arrow).
7. For the **ChargeType** column, set a filter on it to select only **Usage**. Clear any other selections.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/charge-type-selection-small.png" alt-text="Screenshot showing ChargeType selection." lightbox="./media/calculate-ea-savings-plan-savings/charge-type-selection.png" :::
8. To the right of **UnitPrice** , insert add a column and label it with a title like **TotalUsedSavings**.
9. In the first cell under **TotalUsedSavings**, create a formula that calculates (_UnitPrice – EffectivePrice) \* Quantity_.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/total-used-savings-formula.png" alt-text="Screenshot showing the TotalUsedSavings formula." lightbox="./media/calculate-ea-savings-plan-savings/total-used-savings-formula.png" :::
10. Copy the formula to all the other empty **TotalUsedSavings** cells.
11. At the bottom of the **TotalUsedSavings** column, sum the column's values.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/total-used-savings-summed.png" alt-text="Screenshot showing the summed values." lightbox="./media/calculate-ea-savings-plan-savings/total-used-savings-summed.png" :::
12. Somewhere under your data, create a cell named _TotalUsedSavingsValue_. Next to it, copy the **TotalUsed** cell and paste it as **Values**. This step is important because the next step will change the applied filter and affect the summed total.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/paste-value-used.png" alt-text="Screenshot showing pasting the TotalUsedSavings cell as Values." lightbox="./media/calculate-ea-savings-plan-savings/paste-value-used.png" :::
13. For the **ChargeType** column, set a filter on it to select only **UnusedSavingsPlan**. Clear any other selections.
14. To the right of the **TotalUsedSavings** column, insert a column and label it with a title like **TotalUnused**.
15. In the first cell under **TotalUnused**, create a formula that calculates _EffectivePrice \* Quantity_.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/total-unused-formula.png" alt-text="Screenshot showing the TotalUnused formula." lightbox="./media/calculate-ea-savings-plan-savings/total-unused-formula.png" :::
16. At the bottom of the TotalUnused column, sum the column's values.
17. Somewhere under your data, create a cell named _TotalUnusedValue_. Next to it, copy the TotalUnused cell and paste it as **Values**.
18. Under the TotalUsedSavingsValue and TotalUnusedValue cells, create a cell named _SavingsPlanSavings_. Next to it, subtract TotalUnusedValue from TotalUsedSavingsValue. The calculation result is your savings plan savings.  
    :::image type="content" source="./media/calculate-ea-savings-plan-savings/savings-plan-savings.png" alt-text="Screenshot showing the SavingsPlanSavings calculation and final savings." lightbox="./media/calculate-ea-savings-plan-savings/savings-plan-savings.png" :::

If you see a negative savings value, then you're likely to have  unused savings plans. You should review your savings plan usage. For more information, see [View savings plan utilization after purchase](view-utilization.md).

## Other ways to get data and see savings

Using the preceding steps, you can repeat the process for any number of months. Doing so allows you to see your savings over a longer period.

Instead of downloading usage files, one per month, you can get all your usage data for a specific date range using exports from Cost Management and output the data to Azure Storage. Doing so allows you to see your savings over a longer period. For more information about creating an export, see [Create and manage exported data](../costs/tutorial-export-acm-data.md).

## Next steps

- If you have any unused savings plans, read [View savings plan utilization after purchase](view-utilization.md).
- Learn more about creating an export at [Create and manage exported data](../costs/tutorial-export-acm-data.md).