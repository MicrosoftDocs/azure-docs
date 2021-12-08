---
title: Revenue dashboard common questions | Azure Marketplace
description: This article provides answers to common questions for the Revenue dashboard in Microsoft Partner Center. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: smannepalle
ms.author: smannepalle
ms.reviewer: sroy
ms.date: 12/08/2021
---

# Revenue dashboard common questions

This article addresses commonly asked questions about the revenue dashboard in Partner Center.

## Is estimated revenue the billed sales or amount invoiced to customers?

Estimated revenue is the amount billed to the customer who purchased an offer or consumed services.

## What does Total revenue and Others revenue mean?

_Total revenue_ represents the billed sales of purchases or consumption that have entries in the transaction history report. This represents the total billed sales for the following statuses only:
- Sent
- Unprocessed
- Upcoming
- 
You can find corresponding detailed earnings entries in the transaction history report.

There can be some revenue portion that is not yet processed by Microsoft and sent to partners. These revenue amounts are also not captured in the existing transaction history report. The Other revenue section brings visibility to this revenue portion.

## What do different transaction statuses under “Total” mean?

This list defines the different transaction statuses under Total:

- **Sent**: Represents the revenue portion for which earnings have been sent to the partners
- **Unprocessed**: Represents the revenue portion for which earnings are in an unprocessed state
- **Upcoming**: Represents the revenue portion for which earnings are in an upcoming state

## What do different transaction statuses under “Others” mean?

This list defines the different transaction statuses under Others:

- **Uncollected**: Represents the billed sales of an offer purchase or consumption for which a customer has not made full payment or has defaulted. This status represents a revenue portion yet to be collected from customers.
- **Unreconciled**: Offer purchase or consumption with entries that cannot be reconciled between the revenue dashboard and the transaction history report are marked with the unreconciled status. It means that these entries have purchase record id and line-item id entries in the revenue dashboard but not in the transaction history report. This can occur for multiple reasons:
    - Estimated revenue is generated but earnings are not yet posted
    - Some issues with software systems

- **Rejected**: The revenue for which payments or safe approval were rejected.
- **Reprocessed**: The revenue under-reprocessing due to various reasons. For example, invoice cancellation or safe approval cancelation, and so on.
- **Not eligible**: The overall revenue for which a partner isn't eligible to receive pay outs. To learn more about eligibility, see [Payout statements](/partner-center/payout-statement).

## Is Purchase record id same as Order id in transaction history report?

Yes, the Purchase record id refers to the same “order id” data field.

## Why is customer information such as email and customer name blank in many rows of the revenue report?

This could be due to a customer not providing consent to share their personally identifiable information. In some cases, this could be due to a known technical limitation that is being addressed.

## Does customer name represent bill to account, the end-customer, or the reseller information?

Customer name represents the bill to account details. For individuals, the customer name will be the end-customer’s name. For a cloud service provider (CSP), the customer name will be the name of the CSP.

## Is it possible use an API to download data from the revenue dashboard?

Yes. To learn about the analytics APIs, see [Get started with programmatic access to analytics data](analytics-get-started.md).

## How does the first free month appear in the report?

If a partner selects offer listing as “Free” as the dashboard filter, all offer purchases or consumption with free trial will be displayed in the dashboard. The revenue figures for the first month shows $0.

## Is there a suggested specific date for us to download the reports every month?

Yes. You can download the reports on the 4th day of each month to view accurate revenue figures for the offer purchases and consumption from the previous month.

> [!NOTE]
> Revenue figures for subscription-based products are available in the same month of purchase.

## Can the revenue dashboard show information on who is the end-user customer, the reseller, and the distributor?

You can use the _Sales channel_ field to infer whether the customer was an end-customer or a cloud solution provider.

## Do we have “ship-to” address information (country, state, city, zip code) in the revenue dashboard?

The download report has the billed to address of customers. In future, we plan to show “ship-to” address as well.

## What does “Billed Month” refer to?

Billed Month refers to the order purchase month or the offer usage month for which the billing is done.

## Why do I see a steep drop in estimated revenue trend for current month?

A blue dotted line in the revenue trend represents figures for the current month. The steep drop could be due to the open month for usage-based offers for which billed sales is not yet generated.

## Can I sort the records in the customer leaderboard and the geographic spread widget?

Yes, you sort a column in the widget in ascending or descending order.

## How should I read growth percentage change for “Total” and “Others” estimated revenue?

The growth percentage change in the revenue dashboard is defined in a similar way to other reports. It is the percentage change between the value at the end of the selected month range and the value at the beginning of the selected month range.

## Why does the estimated revenue timeline not change for different month range selections?

This is expected because all figures for future months are shown for the unprocessed and upcoming revenues till date.

## Where can I find my downloaded reports?

To find your downloaded reports, go to the **CMP Analyze** > **Downloads** section. The reports are available in .csv/.tsv format. To learn more about downloading reports, see [Downloads dashboard in commercial marketplace analytics](downloads-dashboard.md).

## Can I apply filters to the report?

Yes, you can use the dashboard filters to view the widgets on the dashboard based on the filtered criteria you choose.

## Next steps

- [Revenue dashboard in commercial marketplace analytics](revenue-dashboard.md)
