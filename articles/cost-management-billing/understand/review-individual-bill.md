---
title: Review your individual Azure subscription bill
description: Learn how to understand your bill and resource usage and to verify charges for your individual Azure subscription, including pay-as-you-go.
author: bandersmsft
ms.reviewer: judupont
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: tutorial
ms.date: 03/21/2024
ms.author: banders
---

# Tutorial: Review your individual Azure subscription bill

This article helps you understand and review the bill for your pay-as-you-go or Visual Studio Azure subscription, including pay-as-you-go and Visual Studio. For each billing period, you normally receive an invoice in email. The invoice is a representation of your Azure bill. The same cost information on the invoice is available in the Azure portal. In this tutorial you will compare your invoice with the detailed daily usage file and with cost analysis in the Azure portal.

This tutorial applies only to Azure customers with an individual subscription. Common individual subscriptions are those with pay-as-you-go rates purchased directly from the Azure website.

If you need help understanding unexpected charges, see [Analyze unexpected charges](analyze-unexpected-charges.md). Or, if you need to cancel your Azure subscription, see [Cancel your Azure subscription](../manage/cancel-azure-subscription.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Compare invoiced charges with usage file
> * Compare charges and usage in cost analysis

## Prerequisites

You must have a paid *Microsoft Online Services Program* billing account. The account is created when you sign up for Azure through the Azure website. For example, if you have an account with pay-as-you-go rates or if you are a Visual Studio subscriber.

Invoices for Azure Free Accounts are created only when the monthly credit amount is exceeded.

It must be more than 30 days from the day that you subscribed to Azure. Azure bills you at the end of your invoice period.

## Sign in to Azure

- Sign in to the [Azure portal](https://portal.azure.com).

## Compare billed charges with your usage file

<a name="charges"></a>

The first step to compare usage and costs is to download your invoice and usage files. The detailed usage CSV file shows your charges by billing period and daily usage. It doesn't include any tax information. In order to download the files, you must be an account administrator or have the Owner role.

In the Azure portal, type *subscriptions* in the search box and then select **Subscriptions**.

:::image type="content" border="true" source="./media/review-individual-bill/navigate-subscriptions.png" lightbox="./media/review-individual-bill/navigate-subscriptions.png" alt-text="Screenshot showing navigation to subscriptions.":::

In the list of subscriptions, select the subscription.

Under **Billing**, select **Invoices**.

In the list of invoices, look for the one that you want to download then select the download symbol. You might need to change the timespan to view older invoices. It might take a few minutes to generate the usage details file and invoice.

:::image type="content" border="true" source="./media/review-individual-bill/download-invoice.png" alt-text="Screenshot that shows billing periods, the download option, and total charges for each billing period.":::

In the Download Usage + Charges window, select **Download csv** and **Download invoice**.

:::image type="content" border="true" source="./media/review-individual-bill/usageandinvoice.png" alt-text="Screenshot that shows the Download invoice and usage page.":::

If it says **Not available** there are several reasons that you don't see usage details or an invoice:

- It's less than 30 days from the day you subscribed to Azure.
- There's no usage for the billing period.
- An invoice isn't generated yet. Wait until the end of the billing period.
- You don't have permission to view invoices. You might not see old invoices unless you're the Account Administrator.
- If you have a Free Trial or a monthly credit amount with your subscription that you didn't exceed, you won't get an invoice unless you have a Microsoft Customer Agreement.

Next, you review the charges. Your invoice shows values for taxes and your usage charges.

:::image type="content" border="true" source="./media/review-individual-bill/invoice-usage-charge.png" alt-text="Screenshot showing an example Azure Invoice.":::

Open the CSV usage file that you downloaded. At the end of the file, sum the value for all items in the *Cost* column.

:::image type="content" border="true" source="./media/review-individual-bill/usage-file-usage-charges.png" alt-text="Screenshot showing an example CSV usage file with summed cost.":::

 The summed *Cost* value should match precisely to the *usage charges* cost on your invoice.

Your usage charges are displayed at the meter level. The following terms mean the same thing in both the invoice and the detailed usage file. For example, the billing cycle on the invoice is the same as the billing period shown in the detailed usage file.

| Invoice (PDF) | Detailed usage (CSV)|
| --- | --- |
|Billing cycle | BillingPeriodStartDate BillingPeriodEndDate |
|Name |Meter Category |
|Type |Meter Subcategory |
|Resource |MeterName |
|Region |MeterRegion |
|Consumed | Quantity |
|Billable |Overage Quantity |
|Rate | EffectivePrice|
| Value | Cost |

The **Usage Charges** section of your invoice shows the total value (cost) for each meter that was consumed during your billing period. For example, the following image shows a usage charge for the Azure Storage service for the *P10 Disks* resource.

:::image type="content" border="true" source="./media/review-individual-bill/invoice-usage-charges.png" alt-text="Screenshot showing usage charges in an invoice.":::

In your CSV usage file, filter by *MeterName* for the corresponding Resource shown on you invoice. Then, sum the *Cost* value for items in the column. Here's an example that focuses on the meter name (P10 disks) that corresponds to the same line item on the invoice.

To reconcile your reservation purchase charges, in your CSV usage file, filter by *ChargeType* as Purchase, it will show all the reservation purchases charges for the month. You can compare these charges by looking at *MeterName* and *MeterSubCategory* in the usage file to Resource and Type in your invoice respectively.

:::image type="content" border="true" source="./media/review-individual-bill/usage-file-usage-charge-resource.png" alt-text="Screenshot showing the summed value for MeterName.":::

The summed *Cost* value should match precisely to the *usage charges* cost for the individual resource charged on your invoice.

## Compare billed charges and usage in cost analysis

Cost analysis in the Azure portal can also help you verify your charges. To get a quick overview of your invoiced usage and charges, select your subscription from the Subscriptions page in the Azure portal. Next, select **Cost analysis** and then in the views list, select **Invoice details**.

:::image type="content" border="true" source="./media/review-individual-bill/cost-analysis-select-invoice-details.png" alt-text="Screenshot showing the invoice details selection.":::

Next, in the date range list, select a time period for you invoice. Add a filter for invoice number and then select the InvoiceNumber that matches the one on your invoice. Cost analysis shows cost details for your invoiced items.

:::image type="content" border="true" source="./media/review-individual-bill/cost-analysis-service-usage-charges.png" alt-text="Screenshot showing invoiced cost details in cost analysis.":::

Costs shown in cost analysis should match precisely to the *usage charges* cost for the individual resource charged on your invoice.

:::image type="content" border="true" source="./media/review-individual-bill/invoice-usage-charges.png" alt-text="Screenshot showing invoice usage charges.":::

## External Marketplace services

<a name="external"></a>

External services or marketplace charges are for resources that have been created by third-party software vendors. Those resources are available for use from the Azure Marketplace. For example, a Barracuda Firewall is an Azure Marketplace resource offered by a third-party. All charges for the firewall and its corresponding meters appear as external service charges.

External service charges appear on a separate invoice.

### Resources are billed by usage meters

Azure doesn't directly bill based on the resource cost. Charges for a resource are calculated by using one or more meters. Meters are used to track a resource’s usage throughout its lifetime. These meters are then used to calculate the bill.

When you create a single Azure resource, like a virtual machine, it has one or more meter instances created. Meters are used to track the usage of the resource over time. Each meter emits usage records that are used by Azure to calculate the bill.

For example, a single virtual machine (VM) created in Azure may have the following meters created to track its usage:

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

When the VM is created, each meter begins emitting usage records. This usage and the meter's price is tracked in the Azure metering system.

You can see the meters that were used to calculate your bill in the usage CSV file, like in the earlier example.

## Pay your bill

<a name="payment"></a>

If you set up a credit card as your payment method, the payment is charged automatically within 10 days after the billing period ends. On your credit card statement, the line item would say **MSFT Azure**.

To change the credit card that's charged, see [Add, update, or remove a credit card for Azure](../manage/change-credit-card.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Compare invoiced charges with usage file
> * Compare charges and usage in cost analysis

Complete the quickstart to start using cost analysis.

> [!div class="nextstepaction"]
> [Start analyzing costs](../costs/quick-acm-cost-analysis.md)
