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
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/14/2018
ms.author: cwatson

---
# Understand your bill for Microsoft Azure
To understand your Azure bill, compare your invoice with the detailed daily usage file and the cost management reports in the Azure portal.

>[!NOTE]
>This article does not apply to Enterprise Agreement (EA) customers. If you’re an EA customer, [you can find invoice documentation on the Enterprise Portal.](https://ea.azure.com/helpdocs/understandingYourInvoice)  

To obtain a PDF of your invoice and a copy of your detailed daily usage file CSV download, see [Get your Azure billing invoice and daily usage data](billing-download-azure-invoice-daily-usage-date.md). 

For detailed terms and descriptions of your invoice and detailed daily usage file, see [Understand terms on your Microsoft Azure invoice](billing-understand-your-invoice.md) and [Understand terms on your Microsoft Azure detailed usage](billing-understand-your-usage.md). 

For details on the cost management reports, see [Azure portal cost management](https://docs.microsoft.com/azure/billing/billing-getting-started).

> [!div class="nextstepaction"]
> [Help improve Azure billing docs](https://go.microsoft.com/fwlink/p/?linkid=2010091)

## <a name="charges"></a>How do I make sure that the charges in my invoice are correct?

>[!VIDEO https://www.youtube.com/embed/3YegFD769Pk]

If there is a charge on your invoice that you want more details
on, there are a couple of options.

### Option 1: Review your invoice and compare the usage and costs with the detailed usage CSV file

The detailed usage CSV file shows your charges by billing
period and daily usage. To get your detailed usage CSV file, see
[Get your Azure billing invoice and daily usage
data](https://docs.microsoft.com/azure/billing/billing-download-azure-invoice-daily-usage-date).

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

The Azure portal can also help you verify your charges.The Azure
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

## Are there different Azure customer types? How do I know what customer-type I am?
There are different types of Azure customers. To better understand your pricing and bill, see the following customer-type descriptions.

- **Enterprise**: Enterprise customers have signed an Enterprise Agreement with Azure to make negotiated monetary commitments and gain access to custom pricing for Azure resources.
- **Web Direct**: Web Direct customers have not signed any custom agreement with Azure. These customers have signed up for Azure via azure.com and receive public facing prices for all Azure resources.
- **Cloud Service Provider**: Cloud Service Providers are typically companies that have been hired by an end-customer to build solutions on top of Azure.

## Why don’t I see the cost the resource I have created in my bill?
Azure does not bill directly based on resource cost. Billing is done based off one or more meters that are used to track a resource’s usage throughout its lifetime. These meters are then used to calculate the bill. See more about Azure metering below.

## How does Azure charge metering work?
When you spin up a single Azure resource, such as a virtual machine, it will have one or multiple meter instances created as well. These meters are used to track the usage of the resource over time. Each meter emits usage records which are then used by Azure in our cost metering system to calculate the bill. 

For example, a single virtual machine created in Azure may have the following meters created to track its usage:

- Compute Hours
- IP Address Hours
- Data Transfer In
- Data Transfer Out
- Standard Managed Disk
- Standard Managed Disk Operations
- Standard IO-Disk
- Standard IO-Block Blob Read
- Standard IO-Block Blob Write
- Standard IO-Block Blob Delete

Once the VM is created, each one of the meters above will begin emitting usage records. This usage will then be used in Azure’s metering system along with the meter’s price to determine how much a customer is charged.

> [!Note]
> The example meters above may only be a subset of the meters created a VM that is created.

## What is the difference between Azure 1st party charges and Azure Marketplace charges?
Azure 1st party charges are for resources that are directly developed and offered by Azure. Azure Marketplace charges are for resources that have been created by third party software vendors that are available for use via the Azure marketplace. For example, a Barracuda Firewall is an Azure marketplace resource offered by a third party. All charges for the firewall and its corresponding meters will appear as marketplace charges. 

## Tips for cost management
- Estimate costs by using the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) and [total cost of ownership calculator](https://aka.ms/azure-tco-calculator), and get the [detailed pricing information for each service](https://azure.microsoft.com/pricing/).
- [Review your usage and costs regularly in the Azure portal](billing-getting-started.md#costs).

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
