---
title: Understand the charges on your Microsoft Partner Agreement's invoice - Azure
description: Learn how to read and understand the charges on your invoice.
author: jureid
manager: jureid
tags: billing
ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/10/2019
ms.author: banders
---
# Understand charges on your Microsoft Partner Agreement invoice

 In the billing account for a Microsoft Partner Agreement, an invoice is generated every month for each billing profile. The invoice includes all customer charges from the previous month. You can understand the charges on your invoice by analyzing the individual transactions in the Azure portal. You can also view your invoices in the Azure portal. For more information, see [how to download invoices from the Azure portal](billing-download-azure-invoice.md).

This article applies to a billing account for a Microsoft Partner Agreement. [Check if you have access to a Microsoft Partner Agreement](#check-access-to-a-microsoft-partner-agreement).

## View transactions for an invoice in the Azure portal

1. Sign in to the [Azure portal](https://www.azure.com).

2. Search for *Cost Management + Billing*.

   <!--  ![Screenshot that shows Azure portal search for cost management + billing](./media/billing-understand-your-bill-mca/billing-search-cost-management-billing.png) -->

3. Select **All transactions** from the left side of the page. Depending on your access, you might have to select a billing account, billing profile, or a customer and then select **All transactions**.

4. The All transactions page displays the following information:

    <!-- ![Screenshot that shows the billed transactions list](./media/billing-mpa-understand-your-bill/mpa-billing-profile-all-transactions.png) -->

    |Column  |Definition  |
    |---------|---------|
    |Date     | The date of transaction  |
    |Invoice ID     | The identifier for the invoice on which the transaction got billed. If you submit a support request, share the ID with Azure support to expedite your support request |
    |Transaction type     |  The type of transaction like purchase, cancel, and usage charges  |
    |Product family     | The category of product like compute for Virtual machines or database for Azure SQL database|
    |Product sku     | A unique code identifying the instance of your product |
    |Amount     |  The amount of transaction      |
    |Billing profile     | The transaction shows up on this billing profile's invoice |

5. Search for invoice ID to filter the transactions for the invoice.

## Review pending charges to estimate your next invoice

Charges are estimated and considered pending until they are invoiced. You can view pending charges for your Microsoft Partner Agreement billing profile in the Azure portal to estimate your next invoice. Pending charges are estimated and they don't include tax. The actual charges on your next invoice will vary from the pending charges.

### View pending transactions

When you identify pending charges, you can understand the charges by analyzing the individual transactions that contributed to the charges. At this point, pending usage charges aren't displayed on the All transaction page. You can view the pending usage charges on the Azure subscriptions page. For more information, see [view pending usage charges](#view-pending-usage-charges)

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for *Cost Management + Billing*.

   <!-- ![Screenshot that shows Azure portal search for cost management + billing](./media/billing-understand-your-bill-mca/billing-search-cost-management-billing.png) -->

3. Select a billing profile. Depending on your access, you may have to select a billing account. From the billing account, select **Billing profiles** then select a billing profile.

4. Select **All transactions** from the left side of the page.

5. Search for *pending*. Use the **Timespan** filter to view pending charges for current or last month.

   <!-- ![Screenshot that shows the pending transactions list](./media/billing-mpa-understand-your-bill/mpa-billing-profile-pending-transactions.png) -->

### View pending charges by customer

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for *Cost Management + Billing*.

3. Select a billing profile. Depending on your access, you may have to select a billing account. From the billing account, select **Billing profiles** then select a billing profile.

4. Select **Customers** on the left side of the page.

    <!-- ![screenshot of billing profile customers list](./media/billing-mpa-understand-your-bill/mpa-billing-profile-customers.png) -->

5. The Customers page displays the current and last month's charges for each customer associated with the billing profile. The month-to-date charges are the pending charges for the current month and are billed when the invoice is generated for the month. If the invoice for last month is still not generated, then last month's charges are also pending.

### View pending usage charges

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for *Cost Management + Billing*.

3. Select a billing profile. Depending on your access, you may have to select a billing account. From the billing account, select **Billing profiles** then select a billing profile.

4. Select **Azure subscriptions** on the left side of the page.

5. The Azure subscriptions page displays the current and last month's charges for each subscription in the billing profile. The month-to-date charges are the pending charges for the current month and are billed when the invoice is generated for the month. If the invoice for last month is still not generated, then last month's charges are also pending.

<!--     ![Screenshot that shows the Azure subscriptions list for MPA billing profile](./media/billing-mpa-understand-your-bill/mpa-billing-profile-subscriptions-list.png) -->

## Analyze your Azure usage charges

Use the Azure usage and charges CSV file to analyze your usage-based charges. You can [download your Azure usage and charges CSV from the Azure portal](billing-download-azure-daily-usage.md).

You can filter the Azure usage and charges file to reconcile the usage charges for each product listed in the invoice pdf. To view detailed usage charges for a particular product, filter **product** column in the Azure usage and charges CSV file to only include the name of that product.

You can also filter the **customerName** column in the Azure usage and charges CSV file to view the daily usage charges for each of your customers. If you want to view the daily usage charges by Azure subscription, filter the **subscriptionName** column.


## Pay your bill

Instructions for paying your bill are shown at the bottom of the invoice. You can pay by wire or by check within 60 days of your invoice date.

If you've already paid your bill, you can check the status of the payment on the Invoices page in the Azure portal.

## Check access to a Microsoft Partner Agreement
[!INCLUDE [billing-check-mpa](../../includes/billing-check-mpa.md)]

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about your invoice and detailed usage, see:
