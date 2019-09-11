---
title: Azure enterprise enrollment invoices
description: This article explains how to manage and act on your Azure Enterprise invoice.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/09/2019
ms.topic: conceptual
ms.service: billing
manager: boalcsva
---

# Azure enterprise enrollment invoices

This article explains how to manage and act on your Azure Enterprise invoice. Your invoice is a representation of your bill, so you should review it for accuracy. You should also get familiar with other tasks that might be needed to manage your invoice.

## Incorrect overage invoice

If you think you have an incorrect overage invoice, see [Understand your Azure Enterprise Agreement bill](billing-understand-your-bill-ea.md) to help you reconcile your Azure usage charges. If you think there's a mistake in the overage that Microsoft charged you, contact support.

## Change a PO number for an overage invoice

The Azure EA portal automatically generates a default purchase order (PO) number unless the EA admin sets one before the invoice date. An EA admin can update the PO number in the Azure EA portal by signing in and navigating to **Reports**. An EA admin can update the PO number. In the top-right section showing the PO number, click the pencil symbol and update the information.

An EA admin can update the PO number during the current billing quarter before an invoice is created. They can also update the PO number up to seven days after receiving an automated invoice notification email.

If the EA Admin didn't update the PO number and a new PO number is needed, the only option is to complete a credit and rebill. If a customer must update the PO number, contact your partner for assistance.

## Adjust billing frequency

A customer's billing frequency is annual, quarterly, or monthly. The billing cycle is determined when a customer signs their agreement. Monthly billing is smallest billing interval.

Approval from enterprise admin is required to change a billing cycle change from annual to quarterly for direct enrollments. Approval from a partner admin is required for indirect enrollments. The change becomes effective at the end of the current billing quarter.

To change a billing cycle annual or quarterly to monthly, an amendment to the agreement is required.  Any change to the existing enrollment billing cycle requires approval of an enterprise admin or from the individual identified as the _Bill to Contact_ in your agreement. You can submit your approval in the [Azure EA Portal Support](https://support.microsoft.com/supportrequestform/cf791efa-485b-95a3-6fad-3daf9cd4027c) and then select the Issue Category **Billing and Invoicing**.  The change becomes effective at the end of the current billing quarter.

If an Amendment M503 is signed, you can move any agreement from any frequency to monthly billing. ​

## Credits and adjustments

All credits or adjustments that are applied to your enrollment are visible at [https://www.ea.azure.com](https://www.ea.azure.com) in the **Reports** section. If you have a specific question about an actual credit amount, contact [Azure EA Portal Support](https://support.microsoft.com/supportrequestform/cf791efa-485b-95a3-6fad-3daf9cd4027c).

## Request an invoice copy

To request a copy of your invoice, contact your partner.

## Understand your bill

For information about understanding your invoice and charges, see [Understand your Azure Enterprise Agreement bill](billing-understand-your-bill-ea.md).

## Overage offset by customers

If the customer has overages that they want to use with monetary commitment, the following criteria must be met:

- The customer should have overage charges that were incurred but haven't been paid and are within one year of the billed service's end date.
- The available monetary commitment amount should cover the full number of incurred charges, including all past nonpaid Azure invoices.
- The Billing term being requested to complete must be fully closed. Billing fully closes after the fifth day of each month.
- The billing period being requested to offset must be fully closed.
- ACD discounting is based on the actual new commitment minus any funds planned for the previous consumption. This requirement applies only to overage charges incurred. This only works for services that consume monetary commitment, so you can't cover marketplace charges. Marketplace charges are billed separately.
- If a customer wants to complete an overage offset, they can open a support request. Or, the account team can open the support request. To complete the process, email approval from the Customer's EA Admin or the Bill to Contact is required.

## View price sheet information

Enterprise admins can view the price list associated with their enrollment for Azure services.

To View the current Price Sheet:

1. In the Azure EA portal, click **Reports** and then click **Price Sheet**.
2. View the price sheet or click **Download**.

![Example showing price sheet information](./media/billing-ea-portal-enrollment-invoices/ea-create-view-price-sheet-information.png)

To download a historical price list:

1. In the Azure EA portal, click **Reports** and then click **Download usage**.
2. Download the price sheet.

![Example showing where to download an older price sheet](./media/billing-ea-portal-enrollment-invoices/create-ea-view-price-sheet-download-historical-price-list.png)

If you have questions about why there's a discrepancy in pricing, some reasons include:

Pricing might have changed between the previous enrollment and the new enrollment. Price changes occur because pricing is contractual for specific enrollment from the start date to end date of an agreement. When an enrollment is transferred to new enrollment, it follows the pricing of a new agreement. The pricing is defined by the customer's price sheet. So, prices might be higher in the new enrollment.

If an enrollment goes into an extended term, the pricing also changes. Prices change to pay-as-you-go rates.

## Request detailed usage information

Enterprise admins can view a summary of their usage data, monetary commitment consumed, and charges associated with additional usage in the Azure EA portal. The charges are presented at the summary level across all accounts and subscriptions.

To view detailed usage in specific accounts, you can download the Usage Detail report by navigating to **Reports** > **Download Usage**. The report doesn't include any applicable taxes. There might be a latency of up to eight hours from the time when usage was incurred to when it's reflected on the report.

For indirect enrollments, your partner needs to enable the markup function before you can see any cost-related information.

## Move usage data to another enrollment

Usage data is only moved when a transfer is backdated. There are two options to move usage data from one enrollment to another:

- Account transfers from one enrollment to another enrollment
- Enrollment transfer from one enrollment to another enrollment

For either option, you must submit a [support request](https://support.microsoft.com/supportrequestform/cf791efa-485b-95a3-6fad-3daf9cd4027c) to the EA Support Team for assistance. ​

## Monetary commitment and unbilled usage

Azure monetary commitment is an amount paid up front for Azure services. The monetary commitment is consumed as services are used. First-party Azure services use the monetary commitment. However, there are exceptions for charges billed separately and marketplace services.

_Charges Billed Separately_ and _Azure Marketplace Services_ are third-party services that are deployed from the Azure Marketplace platform. The main difference between the two services is how they're invoiced, based on the agreement structure established with third-party publishers.

Third-party usage appears on your invoice under **Charges Billed Separately**. The usage consumes your Azure monetary commitment balance. To view the list of third-party services, see [Azure Marketplace third-party reseller services now use Azure monetary commitment](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment/).

Usage on your invoice that appears under **Azure Marketplace** is charged separately. It is not covered by any monetary commitment. However, all charges including marketplace, overage, and charges billed separately are consolidated on a single invoice.

You receive a single invoice for Azure first-party overage and Azure third-party marketplace purchases.

When your monetary commitment is fully consumed, usage is billed on a monthly or quarterly basis. If your enrollment started before May 2018, then a 150% monetary commitment threshold rule applies and you're billed for overages quarterly. If your enrollment started after May 2018, then all overages are billed monthly.

## Next steps
- For information about understanding your invoice and charges, see [Understand your Azure Enterprise Agreement bill](billing-understand-your-bill-ea.md).
- To start using the Azure EA portal, see [Get started with the Azure EA portal](billing-ea-portal-get-started.md).
