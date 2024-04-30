---
title: Review your Microsoft Customer Agreement bill - Azure
description: Learn how to review your bill and resource usage and to verify charges for your Microsoft Customer Agreement invoice.
author: bandersmsft
ms.reviewer: lishepar
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: tutorial
ms.date: 03/21/2024
ms.author: banders
---

# Tutorial: Review your Microsoft Customer Agreement invoice

You can review the charges on your invoice by analyzing the individual transactions. In the billing account for a Microsoft Customer Agreement, an invoice is generated every month for each billing profile. The invoice includes all charges from the previous month. You can view your invoices in the Azure portal and compare the charges to the usage detail file.

This tutorial applies only to Azure customers with a Microsoft Customer Agreement.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Review invoiced transactions in the Azure portal
> * Review pending charges to estimate your next invoice
> * Analyze your Azure usage charges

## Prerequisites

You must have a billing account for a Microsoft Customer Agreement.

You must have access to a Microsoft Customer Agreement. You must be a billing profile Owner, Contributor, Reader, or Invoice manager to view billing and usage information. To learn more about billing roles for Microsoft Customer Agreements, see [Billing profile roles and tasks](../manage/understand-mca-roles.md#billing-profile-roles-and-tasks).

It must be more than 30 days from the day that you subscribed to Azure. Azure bills you at the end of your invoice period.

## Sign in to Azure

- Sign in to the [Azure portal](https://portal.azure.com).

## Check access to a Microsoft Customer Agreement

Check the agreement type to determine whether you have access to a billing account for a Microsoft Customer Agreement.

In the Azure portal, type *cost management + billing* in the search box and then select **Cost Management + Billing**.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/billing-search-cost-management-billing.png" alt-text="Screenshot showing an Azure portal search for Cost Management + Billing.":::

If you have access to just one billing scope, select **Properties** from the left-hand side. You have access to a billing account for a Microsoft Customer Agreement if the billing account type is **Microsoft Customer Agreement**.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/billing-mca-property.png" alt-text="Screenshot showing the Microsoft Customer Agreement properties page.":::

If you have access to multiple billing scopes, check the type in the billing account column. You have access to a billing account for a Microsoft Customer Agreement if the billing account type for any of the scopes is **Microsoft Customer Agreement**.

In the billing scopes page, select **Billing scopes** and then select the billing account, which would be used to pay for the subscriptions' usage. The billing account should be of type **Microsoft Customer Agreement**.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/billing-mca-in-the-list.png" alt-text="Screenshot showing the Microsoft Customer Agreement type on the Billing Accounts page.":::

## Review invoiced transactions in the Azure portal

In the Azure portal, select **All transactions** from the left side of the page. Depending on your access, you might have to select a billing account, billing profile, or an invoice section and then select **All transactions**.

The All transactions page displays the following information:

:::image type="content" border="true" source="./media/review-customer-agreement-bill/mca-billed-transactions-list.png" alt-text="Screenshot that shows the billed transactions list.":::

|Column  |Definition  |
|---------|---------|
|Date     | The date of transaction  |
|Invoice ID     | The identifier for the invoice on which the transaction got billed. If you submit a support request, share the ID with Azure support to expedite your support request |
|Transaction type     |  The type of transaction like purchase, cancel, and usage charges  |
|Product family     | The category of product like compute for Virtual machines or database for Azure SQL database|
|Product sku     | A unique code identifying the instance of your product |
|Amount     |  The amount of transaction      |
|Invoice section     | The transaction shows up on this section of billing profile's invoice |
|Billing profile     | The transaction shows up on this billing profile's invoice |

Search for an invoice ID to filter the transactions for the invoice.

### View transactions by invoice sections

Invoice sections help you organize the costs for a billing profile's invoice. For more information. When an invoice is generated, charges for all the sections in the billing profile are shown on the invoice.

The following image shows charges for the Accounting Dept invoice section on a sample invoice.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/invoicesection-details.png" alt-text="Screenshot showing the details by invoice section information.":::

When you've identified the charges for an invoice section, you can view the transactions in the Azure portal to understand the charges.

Go to the All transactions page in the Azure portal to view transactions for an invoice.

Filter by the invoice section name to view transactions.

## Review pending charges to estimate your next invoice

In the billing account for a Microsoft Customer Agreement, charges are estimated and considered pending until they're invoiced. You can view pending charges in the Azure portal to estimate your next invoice. Pending charges are estimated and they don't include tax. The actual charges on your next invoice will vary from the pending charges.

### View summary of pending charges

Sign in to the [Azure portal](https://portal.azure.com).

Select a billing profile. Depending on your access, you may have to select a billing account. From the billing account, select **Billing profiles** then select a billing profile.

Select the **Summary** tab from the top of the screen.

The charges section display the month-to-date and last month's charges.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/mca-billing-profile-summary.png" alt-text="Screenshot showing a billing profile summary.":::

The month-to-date charges are the pending charges for the current month and are billed when the invoice is generated for the month. If the invoice for last month is still not generated, then last month's charges are also pending and will appear on your next invoice.

### View pending transactions

When you identify pending charges, you can understand the charges by analyzing the individual transactions that contributed to the charges. At this point, pending usage charges aren't displayed on the All transaction page. You can view the pending usage charges on the Azure subscriptions page.

Sign in to the [Azure portal](https://portal.azure.com).

In the Azure portal, type *cost management + billing* in the search box and then select **Cost Management + Billing**.

Select a billing profile. Depending on your access, you may have to select a billing account. From the billing account, select **Billing profiles** then select a billing profile.

Select **All transactions** from the left side of the page.

Search for *pending*. Use the **Timespan** filter to view pending charges for current or last month.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/mca-pending-transactions-list.png" alt-text="Screenshot showing the pending transactions list.":::

### View pending usage charges

Sign in to the [Azure portal](https://portal.azure.com).

In the Azure portal, type *cost management + billing* in the search box and then select **Cost Management + Billing**.

Select a billing profile. Depending on your access, you may have to select a billing account. From the billing account, select **Billing profiles** then select a billing profile.

Select **All subscriptions** on the left side of the page.

The Azure subscriptions page displays the current and last month's charges for each subscription in the billing profile. The month-to-date charges are the pending charges for the current month and are billed when the invoice is generated for the month. If the invoice for last month is still not generated, then last month's charges are also pending.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/mca-billing-profile-subscriptions-list.png" alt-text="Screenshot showing subscriptions with month-to-date charges and last month's charges.":::

## Analyze your Azure usage charges

Use the Azure usage and charges CSV file to analyze your usage-based charges. You can download the file for an invoice or for pending charges.

### Download your invoice and usage details

Depending on your access, you might need to select a billing account or billing profile in Cost Management + Billing. In the left menu, select **Invoices** under **Billing**. In the invoice grid, find the row of the invoice you want to download. Select the download symbol or ellipsis (...) at the end of the row. In the **Download** box, download the usage details file and invoice.

### View detailed usage by invoice section

You can filter the Azure usage and charges file to reconcile the usage charges for your invoice sections.

The following information walks you through reconciling compute charges for the Accounting Dept invoice section:

:::image type="content" border="true" source="./media/review-customer-agreement-bill/invoicesection-details.png" alt-text="Screenshot showing the details by invoice section.":::

| Invoice PDF | Azure usage and charges CSV |
| --- | --- |
|Accounting Dept |invoiceSectionName |
|Usage Charges - Microsoft Azure Plan |productOrderName |
|Compute |serviceFamily |

Filter the **invoiceSectionName** column in the CSV file to **Accounting Dept**. Then, filter the **productOrderName** column in the CSV file to **Microsoft Azure Plan**. Next, filter the **serviceFamily** column in the CSV file to **Microsoft.Compute**.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/billing-usage-file-filtered-by-invoice-section.png" alt-text="Screenshot showing the usage and charges file filtered by invoice section.":::

### View detailed usage by subscription

You can filter the Azure usage and charges CSV file to reconcile usage charges for your subscriptions. When you identify charges for a subscription, use the Azure usage and charges CSV file to analyze the charges.

The following image shows the list of subscriptions in the Azure portal.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/mca-billing-profile-subscriptions-list-highlighted.png" alt-text="Screenshot showing the list of subscriptions in the Azure portal with one subscription called out.":::

Filter the **subscriptionName** column in the Azure usage and charges CSV file to **WA_Subscription** to view the detailed usage charges for WA_Subscription.

:::image type="content" border="true" source="./media/review-customer-agreement-bill/billing-usage-file-filtered-by-subscription.png" alt-text="Screenshot that shows the usage and charges file filtered by subscription.":::

## Pay your bill

Instructions for paying your bill are shown at the bottom of the invoice. [Learn how to pay](mca-understand-your-invoice.md#how-to-pay).

If you've already paid your bill, you can check the status of the payment on the Invoices page in the Azure portal.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Review invoiced transactions in the Azure portal
> * Review pending charges to estimate your next invoice
> * Analyze your Azure usage charges

Complete the quickstart to start using cost analysis.

> [!div class="nextstepaction"]
> [Start analyzing costs](../costs/quick-acm-cost-analysis.md)
