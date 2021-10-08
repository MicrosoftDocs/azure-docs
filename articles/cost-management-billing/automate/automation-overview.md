# ACM Automation Overview

You can use Cost Management + Billing automation and reporting to build a custom set of solutions to retrieve and manage cost data. This article covers common scenarios for Cost Management automation and options available based on your situation.

**Common scenarios**

You can use the billing and cost management APIs in several scenarios to answer cost-related and usage-related questions. Here's an outline of common scenarios:

- **Invoice reconciliation** : Did Microsoft charge me the right amount? What's my bill, and can I calculate it myself?
- **Cross-charges** : Now that I know how much I'm being charged, who in my organization needs to pay?
- **Cost optimization** : I know how much I've been charged. How can I get more out of the money I'm spending on Azure?
- **Cost tracking** : I want to see how much I'm spending and using Azure over time. What are the trends? How can I do better?
- **Azure spending during the month** : How much is my current month's spending to date? Do I need to make any changes in my spending and/or usage of Azure? When during the month am I consuming Azure the most?
- **Alerts** : How can I set up resource-based consumption or monetary-based alerts?

## Scenario-to-API mapping

| **API** | **Invoice reconciliation** | **Cross-charges** | **Cost optimization** | **Cost tracking** | **Midmonth spending** | **Alerts** |
|---|---|---|---|---|---|---|
| Exports | X | X | X | X | X | X |
| Generate Detailed Cost Report | X | X | X | X | X | X |
| Invoices | X | X | X | X | |  |
| Transactions | X | X | | X | | |
| Budgets | | | X | | | X |
| Price Sheet | X | X | X | X | X |  |
| Azure Retail Prices | X | | X | X | | |

If you are interested in learning more about reservation specific automation scenarios, please see [APIs for Azure reservation automation](https://docs.microsoft.com/en-us/azure/cost-management-billing/reservations/reservation-apis).

## API summaries

- Usage Details APIs: The APIs below provide you with usage details data. Usage Details are the most granular usage and cost records that are available to you within the Azure ecosystem. To learn more about usage details best practices, see Automate the ingestion of your usage and charges `link needed`.
  - [Exports API](https://docs.microsoft.com/en-us/rest/api/cost-management/exports/create-or-update): Configure a recurring task to export your usage details data to Azure storage on a daily, weekly or monthly basis. Exported data is in CSV format. This is our recommended solution for ingesting usage and charges and is the most scalable for large enterprises. To learn more, see Retrieve large usage datasets with Exports. `need link`
  - Generate Detailed Cost Report API `need link`: Download a usage details csv on demand. This is useful for smaller, date range based datasets. For larger workloads we strongly recommend that you use Exports. To learn more, see Download usage details on demand.
- [Azure Retail Prices](https://docs.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices): Get meter rates with pay-as-you-go pricing. You can then use the returned information with your resource usage information to manually calculate the expected bill.
- [Price Sheet API](https://docs.microsoft.com/en-us/rest/api/consumption/pricesheet): Get custom pricing for all meters. Enterprises can use this data in combination with usage details and marketplace usage information to calculate costs by using usage and marketplace data.
- [Budgets API](https://docs.microsoft.com/en-us/rest/api/consumption/budgets): Create either cost or usage budgets for resources, resource groups, or billing meters. When you've created budgets, you can configure alerts to notify you when you've exceeded defined budget thresholds. You can also configure actions to occur when you've reached budget amounts. To learn more, see Automate budget creation. `need link`

### Billing

- [Invoices API](https://docs.microsoft.com/rest/api/billing/2020-05-01/invoices): Get list of invoices. The API returns a summary of your invoices including total amount, payment status and a link to download a pdf copy of your invoice.
- [Transactions API](https://docs.microsoft.com/rest/api/billing/2020-05-01/transactions/list-by-invoice): Get invoice line-items for an invoice. You can use the API to get all purchases, refunds and credits that are included in your invoice. The API is only available for customers with Microsoft Customer Agreement or Microsoft Partner Agreement billing accounts.

## Next steps

- To learn more about how to assign the proper permissions to call our APIs programatically, see ACM API permission `need link`.
- To learn more about working with Usage Details, see Automate the ingestion of your usage and charges `link needed`.

- To learn more about budget automation, see Automate budget creation `need link`.
- For information about using REST APIs retrieve prices for all Azure services, see [Azure Retail Prices overview](https://docs.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices).

- To compare your invoice with the detailed daily usage file and the cost management reports in the Azure portal, see [Understand your bill for Microsoft Azure](https://docs.microsoft.com/en-us/azure/cost-management-billing/understand/review-individual-bill).
- If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).