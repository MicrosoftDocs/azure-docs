---
title: Cost Management automation overview
titleSuffix: Microsoft Cost Management
description: This article covers common scenarios for Cost Management automation and options available based on your situation.
author: bandersmsft
ms.author: banders
ms.date: 07/15/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Cost Management automation overview

You can use Cost Management automation and reporting to build a custom set of solutions to retrieve and manage cost data. This article covers what APIs are available for use and common scenarios for Cost Management automation.

## Available APIs

There are many different APIs that can be used to interact with Cost Management data. A summary of the available APIs and what they do is below. Multiple APIs may need to be used to achieve a specific scenario. Review the common scenarios outlined later to learn more. 

For contractual information about how to call each API, review the API specification articles.

### Cost Details APIs
The APIs below provide you with cost details data (formerly referred to as usage details). Cost Details are the most granular usage and cost records that are available to you within the Azure ecosystem. All Cost Management experiences in the Azure portal and the APIs are built upon the raw dataset. To learn more, see [cost details overview](automation-ingest-usage-details-overview.md).

- [Exports API](/rest/api/cost-management/exports/create-or-update) - Configure a recurring task to export your cost details data to Azure storage on a daily, weekly or monthly basis. Exported data is in CSV format. It's our recommended solution for ingesting cost data and is the most scalable for large enterprises. To learn more, see [Retrieve large cost datasets with exports](../costs/ingest-azure-usage-at-scale.md).

- [Generate Cost Details](/rest/api/cost-management/generate-cost-details-report) - Download a cost details CSV file on demand. It's useful for smaller, date range based datasets. For larger workloads, we strongly recommend that you use Exports. To learn more about using this API, see [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).

### Pricing APIs

- [Azure Retail Prices](/rest/api/cost-management/retail-prices/azure-retail-prices) - Get meter rates with pay-as-you-go pricing. You can use the returned information with your resource usage information to manually calculate the expected bill.

- [Price Sheet API](/rest/api/consumption/pricesheet) - Get custom pricing for all meters. Enterprises can use this data in combination with usage details and marketplace usage information to manually calculate costs by using usage and marketplace data.

### Budgets and Alerts APIs

- [Budgets API](/rest/api/consumption/budgets) - Create either cost budgets for resources, resource groups, or billing meters. When you've created budgets, you can configure alerts to notify you when you've exceeded defined budget thresholds. You can also configure actions to occur when you've reached budget amounts. For more information, see [Automate budget creation](automate-budget-creation.md) and [Configure budget based actions](../manage/cost-management-budget-scenario.md).

- [Alerts API](/rest/api/cost-management/alerts) - Manage all of the alerts that have been created by budgets and other Azure alerting systems.

### Invoicing APIs

- [Invoices API](/rest/api/billing/2020-05-01/invoices) - Get list of invoices. The API returns a summary of your invoices including total amount, payment status and a link to download a pdf copy of your invoice.

- [Transactions API](/rest/api/billing/2020-05-01/transactions/list-by-invoice) - Get invoice line-items for an invoice. You can use the API to get all purchases, refunds and credits that are included in your invoice. The API is only available for customers with Microsoft Customer Agreement or Microsoft Partner Agreement billing accounts.

### Reservation APIs

- [Reservation Details API](/rest/api/cost-management/generate-reservation-details-report) - Get the detailed resource consumption associated with your reservation purchases.

- [Reservation Transactions API](/rest/api/consumption/reservation-transactions) - Get reservation related purchase and management transactions.

- [Reservation Recommendations API](/rest/api/consumption/reservation-recommendations) - Get recommendations for reservation purchases to make in the future along with expected savings information.

- [Reservation Recommendation Details API](/rest/api/consumption/reservation-recommendation-details) - Get detailed information for specific reservation purchases to perform a what-if analysis.

## Common API scenarios

You can use the billing and cost management APIs in many scenarios to answer cost-related and usage-related questions. Common scenarios and how to use the different APIs to achieve those scenarios are outlined below.

### Invoice reconciliation

This scenario is used to address the following questions:

- Did Microsoft charge me the right amount on my invoice?
- What's my bill, and can I calculate it myself using the raw data?

To answer these questions, follow the steps below.

1. Call the [Invoices API](/rest/api/billing/2020-05-01/invoices) to get the info needed to download an invoice. If you're a Microsoft Customer Agreement customer and just wish to get the specific line items seen on your invoice automatically, you can also utilize the [Transactions API](/rest/api/billing/2020-05-01/transactions/list-by-invoice) to get those line items in an API-readable format.

2. Use either [Exports](/rest/api/cost-management/exports) or the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API to download the raw usage file.

3. Analyze the data in the raw usage file to compare it against the costs that are present on the invoice. For Azure consumption, the data in your invoice is rolled up based on the meter associated with your usage.

### Cross-charging

Once there's a good understanding of spending for a given month, organizations next need to determine what teams or divisions need to pay for the various charges accrued. Follow the steps below.

1. Use either [Exports](/rest/api/cost-management/exports) or the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API to download the raw usage file. 

2. Analyze the data in the raw usage file and allocate it based on the organizational hierarchy that you have in place. Allocation could be based on resource groups, subscriptions, cost allocation rules, tags or other Azure organization hierarchies. 
   - To learn more about best practices to consider when configuring your Azure environments, see [Cost management best practices](../costs/cost-mgt-best-practices.md). 
   - To learn more about the scopes and the organizational structures available to you, see [Understand and work with scopes](../costs/understand-work-scopes.md).
   - To set up allocation directly in Azure, see [Allocate costs](../costs/allocate-costs.md). 

### Azure spending prior to invoice closure

It's important to keep tabs on how costs are accruing throughout the month. Proactive analysis before the invoice is closed can provide opportunities to change spending patterns and get an invoice's projected costs down. To ingest all of the raw data that has accrued month-to-date, use [Exports API](/rest/api/cost-management/exports). 

Configuring automatic alerting can also ensure that spending doesn't unexpectedly get out of hand and removes the need for manual cost monitoring throughout the month. To ensure your costs don't breach thresholds or aren't forecasted to breach thresholds, use the [Budgets API](/rest/api/consumption/budgets).

### Cost trend reporting

Often it's useful to understand how much an organization is spending over time. Understanding cost over time helps identify trends and areas for cost optimization improvement. Follow the steps below to set up a cost dataset that can be used for reporting cost over time at scale.

1. Extract the historical costs for prior months. See [Seed a historical cost dataset with the Exports API](tutorial-seed-historical-cost-dataset-exports-api.md) to learn more.
2. Ingest your historical data from the Azure storage account associated with your Exports into a queryable store. We recommend SQL or Azure Synapse.
3. Configure a month-to-date Export to storage at a scope with the costs that need to be analyzed. Export to storage is done in the Azure portal. See [Export costs](../costs/tutorial-export-acm-data.md). The month-to-date Export will be used to properly extract costs moving forward.
4. Configure a data pipeline to ingest cost data for the open month into your queryable store. This pipeline should be used with the month-to-date Export that you've configured. Azure Data Factory provides good solutions for this kind of ingestion scenario.
5. Perform reporting as needed using reports built with your queryable store. Power BI can be good for this scenario. If you're looking for a more out of the box solution, see our [Power BI Template App](../costs/analyze-cost-data-azure-cost-management-power-bi-template-app.md).

### Reservation related investigations

For more information about reservation-specific automation scenarios, see [APIs for Azure reservation automation](../reservations/reservation-apis.md).

## Next steps

- To learn more about how to assign the proper permissions to call our APIs programatically, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).
- To learn more about working with cost details, see [Ingest usage details data](automation-ingest-usage-details-overview.md).

- To learn more about budget automation, see [Automate budget creation](automate-budget-creation.md).
- For information about using REST APIs retrieve prices for all Azure services, see [Azure Retail Prices overview](/rest/api/cost-management/retail-prices/azure-retail-prices).

- To compare your invoice with the detailed daily usage file and the cost management reports in the Azure portal, see [Understand your bill for Microsoft Azure](../understand/review-individual-bill.md).
- If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
