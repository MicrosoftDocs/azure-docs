---
title: Understanding your bill for Azure | Microsoft Docs
description: Learn how to read and understand the usage and bill for your Azure subscription
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
ms.date: 07/14/2017
ms.author: tonguyen

---
# Understand your bill for Microsoft Azure

To understand your Azure bill, compare your invoice with the detailed daily usage file, and the cost management reports in the Azure portal.

For invoice PDF and detailed daily usage file CSV download, see [How to get your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md). 

For detailed terms and descriptions of your invoice and detailed daily usage file, see [Understand terms on your Microsoft Azure invoice](billing-understand-your-invoice.md) and [Understand terms on your Microsoft Azure detailed usage](billing-understand-your-usage.md).

For details on the cost management reports, see [Azure portal cost management](https://docs.microsoft.com/en-us/azure/billing/billing-getting-started).

## <a name="charges"></a>How do I make sure that the charges in my invoice are correct?

If there is a charge on your invoice that you would like more details
on, there are a couple of options:

### Option 1: Review your invoice and compare the usage and costs with the detailed usage CSV file

The detailed usage CSV file provides your charges by billing
period and daily usage. To get your detailed usage CSV file, see
[How to get your Azure billing invoice and daily usage
data](https://docs.microsoft.com/en-us/azure/billing/billing-download-azure-invoice-daily-usage-date).

Your usage charges are displayed at the meter level. The following list of terms mean the same thing between the invoice and the detailed usage file. For example, the billing cycle on the invoice is equivalent to the billing period shown on the detailed usage file.

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

The **Usage Charges** section of your invoice has the total value for each meter that was consumed during your billing period. For example, the following screenshot shows a usage charge for the Azure Scheduler service.

![Invoice usage charges](./media/billing-understand-your-bill/1.png)

The **Statement** section of your detailed usage CSV shows the same charge. Both the *Consumed* amount and *Value* match the invoice.

![CSV usage charges](./media/billing-understand-your-bill/2.png)

To see a breakdown of this charge on a daily basis, go to the **Daily Usage** section of the CSV. Filter for "Scheduler" under *Meter Category* and you can see which days the meter was used and how much was consumed. The *Resource* and *Resource group* information is also listed for comparison. The *Consumed* values should add up to what's shown on the invoice.

![Daily Usage section in the CSV](./media/billing-understand-your-bill/3.png)

To get the cost per day, multiply the *Consumed* amounts with the *Rate* value from the **Statement** section.

To learn more about the invoice, see [Understand your Azure invoice](billing-understand-your-invoice.md).

To learn about each of the columns in the CSV, see [Understand your Azure detailed usage](billing-understand-your-invoice.md).

### Option 2: Review your invoice and compare with the usage and costs in the Azure portal

The Azure portal can also help you verify your charges. The Azure
portal provides cost management charts for quick overviews of your
usage and charges on your invoice.

To continue with the example from above, visit the [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade), select your subscription, and then choose **Cost analysis**. From there, you can specify the time-span and see usage charge for the Azure Scheduler service.

![Cost analysis view in Azure portal](./media/billing-understand-your-bill/4.png)

To see the daily cost breakdown in **Cost history**, click the row.

![Cost history view in Azure portal](./media/billing-understand-your-bill/5.png)

To learn more, see [Prevent unexpected costs with Azure billing and cost management](billing-getting-started.md#costs).

## <a name="external"></a>What about external service charges?

External services (also known as Marketplace orders) are provided by independent service vendors and are billed separately. The charges don't show up on the Azure invoice. To learn more, see [Understand your Azure external service charges](billing-understand-your-azure-marketplace-charges.md).

## <a name="payment"></a>How do I make a payment?

If you set up a credit card or a debit card as your payment method, the payment is charged automatically within 10 days after the billing period ends. On your credit card statement, the line item would say **MSFT Azure**.

If you [pay by invoicing](billing-how-to-pay-by-invoice.md), send your payment to the location listed at the bottom of your invoice. For more help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## How do I check the status of a payment made by credit card?

[Create a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to ask for the status of your payment. 

## Tips for cost management

- Estimate costs using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/), [total cost of ownership calculator](https://aka.ms/azure-tco-calculator), and when you add a service
- [Set up billing alerts](billing-set-up-alerts.md)
- [Review your usage and costs regularly in Azure portal](billing-getting-started.md#costs)

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
