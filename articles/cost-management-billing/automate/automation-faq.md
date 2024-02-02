---
title: Microsoft Cost Management automation FAQ
description: This FAQ is a list of frequently asked questions and answers about Cost Management automation.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Cost Management automation FAQ

The following sections cover the most commonly asked questions and answers about Cost Management automation.

### What are Cost Details versus Usage Details?

Both are different names for the same dataset. Usage Details is the original name of the dataset back when only Azure consumption resource usage records were present. Over time, more types of cost have been added to the dataset, including marketplace usage, Azure purchases (such as Reservations), marketplace purchases and even Microsoft 365 costs. Cost Details is the name being used moving forward for the dataset.

### Why do I get Usage Details API timeouts?

Cost datasets available from the Usage Details API can often be overly large (multiple GBs or more). The larger the size of the dataset that you request, the longer the service takes to compile the data before sending it to you. Because of the delay, synchronous API solutions like the paginated [JSON Usage Details API](/rest/api/consumption/usage-details/list) might time out before your data is provided. If you encounter timeouts or have processes that frequently need to pull a large amount of cost data, see [Retrieve large cost datasets recurringly with Exports](../costs/tutorial-export-acm-data.md).

### What is the difference between legacy and modern usage details?

A legacy versus modern usage details record is identified by the kind field in the [Usage Details API](/rest/api/consumption/usage-details/list). The field is used to distinguish between data that’s returned for different customer types. The call patterns to obtain legacy and modern usage details are essentially the same. The granularity of the data is the same. The main difference is the fields available in the usage details records themselves. If you’re an EA customer, you’ll always get legacy usage details records. If you’re a Microsoft Customer Agreement customer, you'll always get modern usage details records.

### How do I see my recurring charges?

Recurring charges are available in the [Cost Details](/rest/api/cost-management/generate-cost-details-report) report when viewing Actual Cost.

### Where can I see tax information in Cost Details?

Cost details data is all pre-tax. Tax related charges are only available on your invoice.

### Why is PAYGPrice zero in my cost details file?

If you’re an EA customer, we don’t currently support showing pay-as-you-go prices directly in the usage details data. To see the pricing, use the [Retail Prices API](/rest/api/cost-management/retail-prices/azure-retail-prices).

### Does Cost Details have Reservation charges?

Yes it does. You can see those charges according to when the actual charges occurred (Actual Cost). Or, you can see the charges spread across the resources that consumed the Reservation (Amortized Cost). For more information, see [Get Azure consumption and reservation usage data using API](../reservations/understand-reserved-instance-usage-ea.md#get-azure-consumption-and-reservation-usage-data-using-api).

### Am I charged for using the Cost Details API?

No the Cost Details API is free. Make sure to abide by the rate-limiting policies, however. 

<!--- For more information, see [Data latency and rate limits](api-latency-rate-limits.md). -->

### What's the difference between the Invoices API, the Transactions API, and the Cost Details API?

These APIs provide a different view of the same data:

- The [Invoices API](/rest/api/billing/2019-10-01-preview/invoices) provides an aggregated view of your monthly charges.
- The [Transactions API](/rest/api/billing/2020-05-01/transactions/list-by-invoice) provides a view of your monthly charges aggregated at product/service family level.
- The [Cost Details](/rest/api/cost-management/generate-cost-details-report) report provides a granular view of the usage and cost records for each day. The Cost Details API is available for Enterprise Agreement and Microsoft Customer Agreement accounts. For pay-as-you-go subscriptions, use the Exports API. If Exports don't meet your needs and you need an on-demand solution, see [Get Cost Details for a pay-as-you-go subscription](get-usage-details-legacy-customer.md).

### I recently migrated from an EA to an MCA agreement. How do I migrate my API workloads?

See [Migrate from EA to MCA APIs](../costs/migrate-cost-management-api.md).

### When will the [Enterprise Reporting APIs](../manage/enterprise-api.md) get turned off?

The Enterprise Reporting APIs are deprecated. The date that the API will be turned off is still being determined. We recommend that you migrate away from the APIs as soon as possible. For more information, see [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs](../automate/migrate-ea-reporting-arm-apis-overview.md).

### When will the [Consumption Usage Details API](/rest/api/consumption/usage-details/list) get turned off?

The Consumption Usage Details API is deprecated. The date that the API will bet turned off is still being determined. We recommend that you migrate away from the API as soon as possible. For more information, see [Migrate from Consumption Usage Details API](migrate-consumption-usage-details-api.md).

### When will the [Consumption Marketplaces API](/rest/api/consumption/marketplaces/list) get turned off?

The Marketplaces API is deprecated. The date that the API will be turned off is still being determined. Data from the API is available in the [Cost Details](/rest/api/cost-management/generate-cost-details-report) report. We recommend that you migrate to it as soon as possible. For more information, see [Migrate from Consumption Marketplaces API](migrate-consumption-marketplaces-api.md).

### When will the [Consumption Forecasts API](/rest/api/consumption/) get turned off?

The Forecasts API is deprecated. The date that the API will be turned off is still being determined. Data from the API is available in the [Cost Management Forecast API](/rest/api/cost-management/forecast). We recommend that you migrate to it as soon as possible.

## Next steps

- Learn more about Cost Management + Billing automation at [Cost Management automation overview](automation-overview.md).
