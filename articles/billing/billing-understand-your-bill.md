---
title: Understand your bill for Azure | Microsoft Docs
description: Learn how to read and understand your usage and bill for your Azure subscription
services: ''
documentationcenter: ''
author: tonguyen10
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
ms.author: tonguyen

---
# Understand your bill for Microsoft Azure
To understand your Azure bill, compare your invoice with the detailed daily usage file and the cost management reports in the Azure portal.

To obtain a PDF of your invoice and a copy of your detailed daily usage file CSV download, see [Get your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md). 

For a list of detailed terms, a description of your invoice, and a detailed daily usage file, see [Understand terms on your Microsoft Azure invoice](billing-understand-your-invoice.md) and [Understand terms on your Microsoft Azure detailed usage](billing-understand-your-usage.md).

For details on the cost management reports, see [Azure portal cost management](https://docs.microsoft.com/en-us/azure/billing/billing-getting-started).

## <a name="reconcile"></a>How do I make sure that the charges in my invoice are correct?
If there is a charge on your invoice that you want more details
on, there are a couple of options.

### Review your invoice and compare the usage and costs with the detailed usage CSV file

The detailed usage CSV file shows your charges by billing
period and daily usage. To get your detailed usage CSV file, see
[Get your Azure billing invoice and daily usage
data](https://docs.microsoft.com/en-us/azure/billing/billing-download-azure-invoice-daily-usage-date).

Your usage charges are displayed at the meter level. The following terms mean the same thing in both the invoice and the detailed usage file. For example, the billing cycle on the invoice is equivalent to the billing period shown in the detailed usage file.

 | Invoice (PDF) | Detailed usage (CSV)|
 | --- | --- |
 |Billing cycle | Billing Period |
 |Name |Meter Category |
 |Type |Meter Sub-category |
 |Resource |Meter Name |
 |Region |Meter Region |
 |Consumed |Consumed Quantity |
 |Included |Included Quantity |
 |Billable |Overage Quantity |

The usage charges section of your invoice has the total value
for each meter that was consumed during your billing period. For example, the following screenshot shows a usage charge for the Azure Scheduler service.

![Invoice usage charges](./media/billing-understand-your-bill/1.png)

The same charge is shown in the statement section of your detailed
usage CSV file.

![CSV usage charges](./media/billing-understand-your-bill/2.png)

Additionally, there is a daily usage section in the detailed usage CSV
file. This section has line items for each day that the meter was
consumed. These line items should add up to the consumed quantity for
the meter during the billing period.

For detailed sections, terms, and descriptions of your invoice, see
[Understand your invoice](billing-understand-your-invoice.md).

For detailed sections, terms, and descriptions of your detailed daily
usage file, see [Understand your usage](billing-understand-your-usage.md).

### Review your invoice and compare it with the usage and costs in the Azure portal

The Azure portal can also help you verify your charges. The Azure
portal provides cost management charts for a quick overview of your
usage and charges on your invoice.

Here are some examples of the cost management tools available in the Azure
portal.

This chart provides the current costs by resource:

![Cost by resource in the Azure portal](./media/billing-understand-your-bill/3.png)

This chart shows the current costs on this subscription and forecasts the cost for the rest of the billing period:

![Spending rate and forecast in the Azure portal](./media/billing-understand-your-bill/4.png)

The cost analysis provides resource and meter-level usage for various billing periods:

![Cost analysis view in Azure portal](./media/billing-understand-your-bill/5.png)


To learn more, see [Prevent unexpected costs with Azure billing and cost management](billing-getting-started.md#costs).

## <a name="external"></a>What about external service charges?
External services (also known as Azure Marketplace orders) are provided by independent service vendors and are billed separately. The charges don't show up on your Azure invoice. To learn more, see [Understand your Azure external service charges](billing-understand-your-azure-marketplace-charges.md).

## <a name="payment"></a>How do I make a payment?
If you set up a credit card or a debit card as your payment method, the payment is made automatically. On your credit card statement, the line item would say **MSFT Azure**.

If you use an [invoice method of payment](https://azure.microsoft.com/pricing/invoicing/), send your payment to the location listed at the bottom of your invoice. For more help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## How do I check the status of a payment made by credit card?
[Create a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to ask for the status of your payment. 

## Tips for cost management
- Estimate costs by using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/), [total cost of ownership calculator](https://aka.ms/azure-tco-calculator), and the cost when you add a service.
- [Set up billing alerts](billing-set-up-alerts.md).
- [Review your usage and costs regularly in the Azure portal](billing-getting-started.md#costs).

## Need help? Contact support. 
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
