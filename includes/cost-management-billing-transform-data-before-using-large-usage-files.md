---
title: include file
description: include file
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: include
ms.date: 10/09/2020
ms.author: banders
ms.reviwer: 
ms.custom: include file
---

## Transform data before using large usage files

Sometimes your usage or reconciliation file is too large to open. Or, you might need just a portion of the information to troubleshoot an issue. For example, you might want only information only a particular resource or just the consumption for few services or resource groups. You can transform the data to summarize it before you create pivot tables.

1. Open a blank workbook in Excel.
1. In the upper menu, select **Data** > **From Text/CSV**, select your usage file, and then select **Import**.
1. At the bottom of the window, select **Transform Data**. A new window shows a summary of the data.  
    :::image type="content" source="./media/cost-management-billing-transform-data-before-using-large-usage-files/summarized-data.png" alt-text="Example showing summarized data" lightbox="./media/cost-management-billing-transform-data-before-using-large-usage-files/summarized-data.png" :::
1. If you have a Microsoft Customer Agreement, skip this step and continue to the next because MCA usage files usually have the column titles in the first rows. Prepare the data by creating the table. Remove the top rows, leaving only the titles. Select **Remove Rows** > **Remove Top Rows**.  
     :::image type="content" source="./media/cost-management-billing-transform-data-before-using-large-usage-files/remove-top-rows.png" alt-text="Example showing where to remove top rows" :::
1. In the Remove Top Rows window, enter the number of rows to remove at the top. For EA usually 2, for CSP usually 1. Select **OK**.
1. Select **Use First Row as Headers**.  
    :::image type="content" source="./media/cost-management-billing-transform-data-before-using-large-usage-files/use-first-row-as-header.png" alt-text="Example showing Use First Row as Headers" :::
    
    The table view shows column titles at the top.
1. Next, add a filter. Use the selector arrows at the right of each column title to filter. Suggested filters are Subscription ID, Service Name (Meter category), Instance ID, resource group. You can use multiple filters in the same document. We recommend that you apply all possible filters to reduce the document size and help later work.
1. After you've applied your filters, select **Close & Load**.  
    :::image type="content" source="./media/cost-management-billing-transform-data-before-using-large-usage-files/close-and-load.png" alt-text="Example showing Close & Load" :::

The file loads and shows a table with filtered usage data. Now you can create a new pivot table to troubleshoot usage issues.