---
title: Understanding your bill for Azure | Microsoft Docs
description: Learn how to read and understand the usage and bill for your Azure subscription
services: ''
documentationcenter: ''
author: tonguyen
manager: tonguyen
editor: ''
tags: billing

ms.assetid: 32eea268-161c-4b93-8774-bc435d78a8c9
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/29/2017
ms.author: toguyen

---
# Understand your bill for Microsoft Azure
To understand your Azure bill, we have provided three options for you to
verify your charges and usage:

1.  **An invoice with the summary of usage and charges in PDF format**

     For invoice download, see [How to get your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md). For detailed terms and descriptions, see [Breakdown of your Microsoft Azure invoice](billing-breakdown-your-invoice.md) here.

2.  **A separate detailed daily usage file in CSV format**

    For CSV download, see [How to get your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md). For detailed terms and descriptions, see [Breakdown of your Microsoft Azure detailed usage](billing-breakdown-your-usage.md) here.

3.  **Online through the Azure portal**

    For details, see [Azure portal cost management](https://docs.microsoft.com/en-us/azure/billing/billing-getting-started).

## <a name="reconcile"></a>How do I ensure that the charges in my invoice are correct?
If there is a charge on your invoice that you would like more details
on, there are a couple of options:

-   **Review your invoice and compare the usage and costs with the
    detailed usage CSV file**

    The detailed usage CSV file provides your charges by billing
    period and daily usage. To get your detailed usage CSV file, see
    [How to get your Azure billing invoice and daily usage
    data](https://docs.microsoft.com/en-us/azure/billing/billing-download-azure-invoice-daily-usage-date).

    Your usage charges are displayed at the meter level. Your invoice is
    related to the detailed usage CSV file by the following table:

      | Invoice headers (PDF) | Detailed usage headers (CSV)|
      | --- | --- |
      |Billing cycle | Billing Period |
      |Name |Meter Category |
      |Type |Meter Sub-category |
      |Resource |Meter Name |
      |Region |Meter Region |
      |Consumed |Consumed Quantity |
      |Included |Included Quantity |
      |Billable |Overage Quantity |
      |Rate |Rate |
      |Value |Value |

   The usage charges section of your invoice should have the total value
   for each meter that is consumed during your billing period, as highlighted in the screenshot below:

  <kbd>![Invoice usage charges](./media/billing-understand-your-bill/1.png)</kbd>

   The same charge is shown in the statement section of your detailed
   usage CSV.

   <kbd>![CSV usage charges](./media/billing-understand-your-bill/2.png)</kbd>

   Additionally, there is a daily usage section in the detailed usage CSV
   file. The section has line items for each day that the meter was
   consumed. These line items should add up to the consumed quantity for
   the meter during the billing period.

   For detailed sections, terms and descriptions of the invoice. See
   [here](billing-breakdown-your-invoice.md).

   For detailed sections, terms and descriptions of the detailed daily
   usage file, see [here](billing-breakdown-your-usage.md).

  -   **Review your invoice and compare with the usage and costs in the
      Azure portal**

      The Azure portal can also help you verify your charges. The Azure
      portal provides cost management charts for quick overviews of your
      usage and charges on your invoice.

      Some examples of cost management tools available in the Azure
      portal:
      
      ![Cost by resource in the Azure portal](./media/billing-understand-your-bill/3.png)
      
      This chart provides current costs by resource.

      ![Spending rate and forecast in the Azure portal](./media/billing-understand-your-bill/4.png)

      This chart shows the current costs on this subscription and forecasts cost for the rest of the billing period.

      ![Cost analysis view in Azure portal](./media/billing-understand-your-bill/5.png)

      The cost analysis provides resource and meter level usage for various billing periods.

      To learn more, see [Prevent unexpected costs with Azure billing and cost management](billing-getting-started.md#costs).

## <a name="external"></a>What about external service charges?
External services (also known as Marketplace orders) are provided by independent service vendors and are billed separately. The charges don't show up on the Azure invoice. To learn more, see [Understand your Azure external service charges](billing-understand-your-azure-marketplace-charges.md).

## <a name="payment"></a>How do I make a payment?
If you set up a credit card or a debit card as your payment method, the payment is made automatically. On your credit card statement, the line item would say **MSFT Azure**.

If you use an [invoice method of payment](https://azure.microsoft.com/pricing/invoicing/), send your payment to the location listed at the bottom of your invoice. For more help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## How do I check the status of a payment made by credit card?
[Create a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to ask for the status of your payment. 

## Tips for cost management
- Estimate costs using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/), [total cost of ownership calculator](https://aka.ms/azure-tco-calculator), and when you add a service
- [Set up billing alerts](billing-set-up-alerts.md)
- [Review your usage and costs regularly in Azure portal](billing-getting-started.md#costs)

## Need help? Contact support. 
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
