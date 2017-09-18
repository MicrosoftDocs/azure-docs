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
ms.date: 08/31/2017
ms.author: tonguyen

---
# Understand your bill for Microsoft Azure
To understand your Azure bill, compare your invoice with the detailed daily usage file and the cost management reports in the Azure portal.

>[!NOTE]
>This article does not apply to Enterprise Agreement (EA) customers. If you’re an EA customer, [you can find invoice documentation on the Enterprise Portal.](https://ea.azure.com/helpdocs/understandingYourInvoice)  

To obtain a PDF of your invoice and a copy of your detailed daily usage file CSV download, see [Get your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md). 

For detailed terms and descriptions of your invoice and detailed daily usage file, see [Understand terms on your Microsoft Azure invoice](billing-understand-your-invoice.md) and [Understand terms on your Microsoft Azure detailed usage](billing-understand-your-usage.md). 

For details on the cost management reports, see [Azure portal cost management](https://docs.microsoft.com/en-us/azure/billing/billing-getting-started).

## <a name="charges"></a>How do I make sure that the charges in my invoice are correct?
<div style="padding-top: 56.25%; position: relative; width: 100%;">
<iframe style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;" width="100%" height="100%" src="https://www.youtube.com/embed/3YegFD769Pk" frameborder="0" allowfullscreen></iframe>
</div>

If there is a charge on your invoice that you want more details
on, there are a couple of options.

### Option 1: Review your invoice and compare the usage and costs with the detailed usage CSV file

The detailed usage CSV file shows your charges by billing
period and daily usage. To get your detailed usage CSV file, see
[Get your Azure billing invoice and daily usage
data](https://docs.microsoft.com/en-us/azure/billing/billing-download-azure-invoice-daily-usage-date).

Your usage charges are displayed at the meter level. The following terms mean the same thing in both the invoice and the detailed usage file. For example, the billing cycle on the invoice is equivalent to the billing period shown in the detailed usage file.

 | Invoice (PDF) | Detailed usage (CSV)|
 | --- | --- |
|Billing cycle | Billing Period |
 |Name |Meter Category |
 |Type |Meter Subcategory |
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
portal provides cost management charts for a quick overview of your
usage and the charges on your invoice.

To continue with the example from above, visit the [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade), select your subscription, and then choose **Cost analysis**. From there, you can specify the time-span and see usage charge for the Azure Scheduler service.

![Cost analysis view in Azure portal](./media/billing-understand-your-bill/4.png)

To see the daily cost breakdown in **Cost history**, click the row.

![Cost history view in Azure portal](./media/billing-understand-your-bill/5.png)

To learn more, see [Prevent unexpected costs with Azure billing and cost management](billing-getting-started.md#costs).

## <a name="external"></a>What about external service charges?
External services (also known as Azure Marketplace orders) are provided by independent service vendors and are billed separately. The charges don't show up on your Azure invoice. To learn more, see [Understand your Azure external service charges](billing-understand-your-azure-marketplace-charges.md).

## <a name="payment"></a>How do I make a payment?

If you set up a credit card or a debit card as your payment method, the payment is charged automatically within 10 days after the billing period ends. On your credit card statement, the line item would say **MSFT Azure**.

If you [pay by invoicing](billing-how-to-pay-by-invoice.md), send your payment to the location listed at the bottom of your invoice. For more help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## How do I check the status of a payment made by credit card?

[Create a support ticket](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to ask for the status of your payment. 

## Tips for cost management
- Estimate costs by using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) and [total cost of ownership calculator](https://aka.ms/azure-tco-calculator), and get the [detailed pricing information for each service](https://azure.microsoft.com/en-us/pricing/).
- [Set up billing alerts](billing-set-up-alerts.md).
- [Review your usage and costs regularly in the Azure portal](billing-getting-started.md#costs).

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
