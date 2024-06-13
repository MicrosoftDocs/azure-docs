---
title: Troubleshoot Azure EA billing issues with usage file pivot tables
description: This article helps you troubleshoot Enterprise Agreement (EA) billing issues using pivot tables created from your CSV usage files.
author: banders
ms.reviewer: isvargas
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting
ms.date: 03/21/2024
ms.author: banders
---

# Troubleshoot EA billing issues with usage file pivot tables

This article helps you troubleshoot EA billing issues using pivot tables in your usage files. Azure usage files contain all your Azure usage and consumption information. The information in the file can help you understand:

- Understand how Azure reservations are getting used and applied
- Reconcile information in Cost Management with your billed invoice
- Troubleshoot a cost spike
- Calculate a refund amount for a service level agreement

By using the information from your usage files, you can get a better understanding of usage issues and diagnose them. Usage files are generated in comma delimited (CSV) format. Because the usage files might be large CSV files, they're easier to manipulate and view as pivot tables in a spreadsheet application like Excel. Examples in this article use Excel, but you can use any spreadsheet application that you want.

Only EA admins, Account Owners, and Department Admins have access to download usage files.

## Get the data and format it

Because Azure usage files are in CSV format, you need to prepare the data for use in Excel. Use the following steps to format the data as table.

1. Download the Usage Details Version 2 with All Charges (usage and purchases) file using the instructions at [Download usage for EA customers](../understand/download-azure-daily-usage.md).
1. Open the file in Excel.
1. The unformatted data resembles the following example.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/raw-csv-data-ea.png" alt-text="Screenshot showing unformatted data in Excel." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/raw-csv-data-ea.png" :::
1. Select the first field in the table, the one containing the first column title, **BillingAccountID**.
1. Press Ctrl + Shift + Down arrow and then Ctrl + Shift + Right Arrow to select all the information in the table.
1. In the top menu, select **Insert** > **Table**. In the Create table box, select **My table has headers** and then select **OK**.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/create-table-dialog.png" alt-text="Screenshot showing the Create Table dialog." :::
1. In top menu, select **Insert** > **Pivot Table** and then select **OK**. The action creates a new sheet in the file. It takes you to the pivot table area on the right side of the sheet.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-fields.png" alt-text="Screenshot showing the PivotTable fields area." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-fields.png" :::

The PivotTable Fields area is a drag-and-drop area. Continue to the next section to create the pivot table.

## Create pivot table to view Azure costs by resources

In this section, you create a pivot table where you can troubleshoot overall general Azure usage. The example table can help you investigate which service consumes the most resources. Or you can view the resources that incur the most cost and how a service is getting charged.

1. In the PivotTable Fields area, drag **Meter Category** and **Product** to the **Rows** section. Put **Product** below **Meter Category**.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/rows-section.png" alt-text="Screenshot showing Meter Category and Product in Rows." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/rows-section.png" :::
1. Next, add the **Cost** column to the **Values** section. You can also use the Consumed Quantity column instead to get information about consumption units and transactions. For example, GB and Hours. Or, transactions instead of cost in different currencies like USD, EUR, and INR.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/add-pivot-table-fields.png" alt-text="Screenshot showing columns added to pivot table fields." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/add-pivot-table-fields.png" :::
1. Now you have a dashboard for generalized consumption investigation. You can filter for a specific service using the filtering options in the pivot table.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-filter-option-row-label.png" alt-text="Screenshot showing the pivot table filter option for row label." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-filter-option-row-label.png" :::
    To filter a second level in a pivot table, for example a resource, select a second-level item in the table.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-filter-option-select-field.png" alt-text="Screenshot showing filter options for Select field." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-filter-option-select-field.png" :::
1. Drag the **ResourceID** column to the **Rows** area under **Product** to see the cost of each service by resource. To view detailed pricing information, view your organization's UnitPrice and search for **Product** in the first column of the price list.
1. Add the **Date** column to the **Columns** area to see daily consumption for the product.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-date.png" alt-text="Screenshot showing where to put Date in the columns area." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-date.png" :::
1. Expand and collapse months with the **+** symbols for each month's column.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-month-expand-collapse.png" alt-text="Screenshot showing the + symbol." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-month-expand-collapse.png" :::  
    Adding both the **Cost** and **Quantity** columns in the **Values** area is optional. Doing so creates two columns for each data section below each month and day when the Date column is in the Columns section of the pivot table.
1. For additional filters, you can add the SubscriptionID, Department, ResourceGroup, Tags, or Cost Center columns to the **Filters** area and select the item you want.

## Create pivot table to view cost for a specific resource

A single resource can incur several charges for different services. For example, a virtual machine can incur Compute charges, OS licensing, Bandwidth (Data transfers), RI usage, and storage for snapshots. Whenever you want to review the overall usage for specific resources, the following steps guide you through creating a dashboard to view overall usage with your usage files.

1. In the right menu, drag **ResourceID** to the **Filter** section in the pivot table menu.
1. Select the resource that you want to see the cost for. Type in the **Search** box to find a resource name.
1. Add **Meter Category** and **Product** to the Rows section. Put **Product** below **Meter Category**.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-fields-meter-category.png" alt-text="Screenshot showing where to put Meter Category in the pivot table field area." lightbox="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-fields-meter-category.png" :::
1. Next, add the **Cost** column to the **Values** section. You can also use the Consumed Quantity column instead to get information about consumption units and transactions. For example, GB and Hours. Or, transactions instead of cost in different currencies like USD, EUR, and INR. Now you have a dashboard that shows all the services that the resource consumes.
1. Add the **Date** column to the **Columns** section. It shows the daily consumption.
1. You can expand and reduce using the **+** symbols in each month's column.  
    :::image type="content" source="./media/troubleshoot-ea-billing-issues-usage-file-pivot-tables/pivot-table-month-expand-collapse.png" alt-text="Screenshot showing the + symbol." :::

[!INCLUDE [Transform data before using large usage files](../../../includes/cost-management-billing-transform-data-before-using-large-usage-files.md)]

[!INCLUDE [Troubleshoot usage spikes](../../../includes/cost-management-billing-troubleshoot-usage-spikes.md)]

## Next steps

- [Explore and analyze costs with cost analysis](../costs/quick-acm-cost-analysis.md).