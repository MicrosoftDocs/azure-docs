---
title: Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs overview
titleSuffix: Microsoft Cost Management
description: This article provides an overview about migrating from Azure Enterprise Reporting to Microsoft Cost Management APIs.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs overview

This article informs developers that have built custom solutions using the [Azure Enterprise Reporting APIs](../manage/enterprise-api.md) about important changes. The newer Microsoft Cost Management APIs now offer enhanced capabilities and support for service principals, making them a more robust choice for your projects.

**Key points**:
- Migration recommended - We strongly recommend that you consider migrating your custom solutions to the Microsoft Cost Management APIs. They're actively being developed and offer improved functionality.
- Retirement date - The Azure Enterprise Reporting APIs will be retired on **May 1, 2024**. After this date, the APIs will stop responding to requests.

**This article provides**:
- An overview of the differences between [Azure Enterprise Reporting APIs](../manage/enterprise-api.md) and Cost Management APIs.
- Guidance about what to expect when migrating to the Cost Management APIs.
- Insight into the new capabilities available with the Cost Management APIs.

**Call to action**:
- To ensure a smooth transition, we encourage you to begin planning your migration to the Cost Management APIs well in advance of the retirement date.

## API differences

The following information describes the differences between the older Azure Enterprise Reporting APIs and the newer Cost Management APIs.

| Use | Azure Enterprise Reporting APIs | Microsoft Cost Management APIs |
| --- | --- | --- |
| Authentication | API key provisioned in the Enterprise Agreement (EA) portal | Microsoft Entra authentication using user tokens or service principals. Service principals take the place of API keys. |
| Scopes and permissions | All requests are at the enrollment scope. API Key permission assignments will determine whether data for the entire enrollment, a department, or a specific account is returned. No user authentication. | Users or service principals are assigned access to the enrollment, department, or account scope. |
| URI Endpoint | `https://consumption.azure.com` | `https://management.azure.com` |
| Development status | In maintenance mode. On the path to deprecation. | In active development |
| Available APIs | Limited to what's currently available | Equivalent APIs are available to replace each EA API. Additional [Cost Management APIs](/rest/api/cost-management/) are also available, including: <br>- Budgets<br>- Alerts<br>- Exports |

## Migration checklist

- Familiarize yourself with the [Azure Resource Manager REST APIs](/rest/api/azure).
- Determine which Enterprise Reporting APIs you use and see which Cost Management APIs to move to at [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs](../automate/migrate-ea-reporting-arm-apis-overview.md).
- Configure service authorization and authentication for the Cost Management APIs. For more information, see [Assign permission to ACM APIs](cost-management-api-permissions.md).
- Test the APIs and then update any programming code to replace Enterprise Reporting API calls with Cost Management API calls.
- Update error handling to use new error codes. Some considerations include:
    - Cost Management APIs have a timeout period of 60 seconds.
    - Cost Management APIs have rate limiting in place. This results in a `429 throttling error` if rates are exceeded. Build your solutions so that you don't make too many API calls in a short time period.
- Review the other Cost Management APIs available through Azure Resource Manager and assess for use later. For more information, see [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs](../automate/migrate-ea-reporting-arm-apis-overview.md).

## Enterprise Reporting API mapping to new Cost Management APIs

Use the following information to identify the Enterprise Reporting APIs that you currently use and the replacement Cost Management API to use instead.

| Scenario | Enterprise Reporting APIs | Cost Management APIs |
| --- | --- | --- |
| [Migrate from EA Usage Details APIs](migrate-ea-usage-details-api.md)  | [/usagedetails/download](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)<br>[/usagedetails/submit](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)<br>[/usagedetails](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)<br>[/usagedetailsbycustomdate](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail) | Use [Microsoft.CostManagement/Exports](/rest/api/cost-management/exports/create-or-update) for all recurring data ingestion workloads. <br>Use the [Cost Details](/rest/api/cost-management/generate-cost-details-report) report for small on-demand datasets. |
| [Migrate from EA Balance Summary APIs](migrate-ea-balance-summary-api.md) | [/balancesummary](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) | [Microsoft.Consumption/balances](/rest/api/consumption/balances/getbybillingaccount) |
| [Migrate from EA Price Sheet APIs](migrate-ea-price-sheet-api.md) | [/pricesheet](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) | For negotiated prices, use [Microsoft.Consumption/pricesheets/default](/rest/api/consumption/pricesheet) <br> For retail prices, use [Retail Prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) |
| [Migrate from EA Reserved Instance Usage Details API](migrate-ea-reserved-instance-usage-details-api.md) | [/reservationdetails](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) | [Microsoft.CostManagement/generateReservationDetailsReport](/rest/api/cost-management/generatereservationdetailsreport) |
| [Migrate from EA Reserved Instance Usage Summary APIs](migrate-ea-reserved-instance-usage-summary-api.md) | [/reservationsummaries](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) | [Microsoft.Consumption/reservationSummaries](/rest/api/consumption/reservationssummaries/list#reservationsummariesdailywithbillingaccountid) |
| [Migrate from EA Reserved Instance Recommendations APIs](migrate-ea-reserved-instance-recommendations-api.md) | [/SharedReservationRecommendations](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation)<br>[/SingleReservationRecommendations](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation) | [Microsoft.Consumption/reservationRecommendations](/rest/api/consumption/reservationrecommendations/list) |
| [Migrate from EA Reserved Instance Charges APIs](migrate-ea-reserved-instance-charges-api.md) | [/reservationcharges](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges) | [Microsoft.Consumption/reservationTransactions](/rest/api/consumption/reservationtransactions/list) |

## Use additional Cost Management APIs

After you've migrated to the Cost Management APIs for your existing reporting scenarios, you can use many other APIs, too. The APIs are also available through Azure Resource Manager and can be automated using service principal-based authentication. Here's a quick summary of the new capabilities that you can use.

- [Budgets](/rest/api/consumption/budgets/createorupdate) - Use to set thresholds to proactively monitor your costs, alert relevant stakeholders, and automate actions in response to threshold breaches.
- [Alerts](/rest/api/cost-management/alerts) - Use to view alert information including, but not limited to, budget alerts, invoice alerts, credit alerts, and quota alerts.
- [Exports](/rest/api/cost-management/exports) - Use to schedule recurring data export of your charges to an Azure Storage account of your choice. It's the recommended solution for customers with a large Azure presence who want to analyze their data and use it in their own internal systems.

## Next steps

- Familiarize yourself with the [Azure Resource Manager REST APIs](/rest/api/azure).
- If needed, determine which Enterprise Reporting APIs you use and see which Cost Management APIs to move to at [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs](../automate/migrate-ea-reporting-arm-apis-overview.md).
- If you're not already using Azure Resource Manager APIs, [register your client app with Microsoft Entra ID](/rest/api/azure/#register-your-client-application-with-azure-ad).
- If needed, update any of your programming code to use [Microsoft Entra authentication](/rest/api/azure/#create-the-request) with your service principal.
