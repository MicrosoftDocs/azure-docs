---
title: Migrate from EA Reporting to Azure Resource Manager APIs overview
description: This article provides and overview about migrating from EA Reporting to Azure Resource Manager APIs.
author: bandersmsft
ms.author: banders
ms.date: 05/18/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Migrate from EA Reporting to Azure Resource Manager APIs overview

This article helps developers that have built custom solutions using the [Azure Reporting APIs for Enterprise Customers](../manage/enterprise-api.md) to migrate to Azure Resource Manager APIs for Cost Management. Service principal support for the newer Azure Resource Manager APIs. Azure Resource Manager APIs are still in active development. Consider migrating to them instead of using the older Azure Reporting APIs for Enterprise customers. The older APIs are being deprecated. This article helps you understand the differences between the Reporting APIs and the Azure Resource Manager APIs, what to expect when you migrate to the Azure Resource Manager APIs, and the new capabilities that are available with the new Azure Resource Manager APIs.

## API differences

The following information describes the differences between the older Reporting APIs for Enterprise Customers and the newer Azure Resource Manager APIs.

| Use | Enterprise Agreement APIs | Azure Resource Manager APIs |
| --- | --- | --- |
| Authentication | API key provisioned in the Enterprise Agreement (EA) portal | Azure Active Directory (Azure AD) Authentication using user tokens or service principals. Service principals take the place of API keys. |
| Scopes and permissions | All requests are at the enrollment scope. API Key permission assignments will determine whether data for the entire enrollment, a department, or a specific account is returned. No user authentication. | Users or service principals are assigned access to the enrollment, department, or account scope. |
| URI Endpoint | [https://consumption.azure.com](https://consumption.azure.com/) | [https://management.azure.com](https://management.azure.com/) |
| Development status | In maintenance mode. On the path to deprecation. | In active development |
| Available APIs | Limited to what's currently available | Equivalent APIs are available to replace each EA API. Additional [Cost Management APIs](/rest/api/cost-management/) are also available, including: <ul><li>Budgets<li>Alerts<li>Exports</ul> |

## Migration checklist

- Familiarize yourself with the [Azure Resource Manager REST APIs](/rest/api/azure).
- Determine which EA APIs you use and see which Azure Resource Manager APIs to move to at [EA API mapping to new Azure Resource Manager APIs](../costs/migrate-from-enterprise-reporting-to-azure-resource-manager-apis.md#ea-api-mapping-to-new-azure-resource-manager-apis).
- Configure service authorization and authentication for the Azure Resource Manager APIs. For more information, see [Assign permission to ACM APIs](cost-management-api-permissions.md).
- Test the APIs and then update any programming code to replace EA API calls with Azure Resource Manager API calls.
- Update error handling to use new error codes. Some considerations include:
    - Azure Resource Manager APIs have a timeout period of 60 seconds.
    - Azure Resource Manager APIs have rate limiting in place. This results in a `429 throttling error` if rates are exceeded. Build your solutions so that you don't make too many API calls in a short time period.
- Review the other Cost Management APIs available through Azure Resource Manager and assess for use later. For more information, see [Use additional Cost Management APIs](../costs/migrate-from-enterprise-reporting-to-azure-resource-manager-apis.md#use-additional-cost-management-apis).

## EA API mapping to new Azure Resource Manager APIs

Use the following information to identify the EA APIs that you currently use and the replacement Azure Resource Manager API to use instead.

| Scenario | EA APIs | Azure Resource Manager APIs |
| --- | --- | --- |
| [Migrate from EA Usage Details APIs](migrate-ea-usage-details-api.md)  | [/usagedetails/download](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)<br>[/usagedetails/submit](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)<br>[/usagedetails](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)<br>[/usagedetailsbycustomdate](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail) | Use [Microsoft.CostManagement/Exports](/rest/api/cost-management/exports/create-or-update) for all recurring data ingestion workloads. <br>Use [Cost Details API-UNPUBLISHED-UNPUBLISHED](../index.yml) for small on demand datasets. |
| [Migrate from EA Balance Summary APIs](migrate-ea-balance-summary-api.md) | [/balancesummary](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) | [Microsoft.Consumption/balances](/rest/api/consumption/balances/getbybillingaccount) |
| [Migrate from EA Price Sheet APIs](migrate-ea-price-sheet-api.md) | [/pricesheet](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) | For negotiated prices, use [Microsoft.Consumption/pricesheets/default](/rest/api/consumption/pricesheet) <br> For retail prices, use [Retail Prices API](/rest/api/cost-management/retail-prices/azure-retail-prices) |
| [Migrate from EA Reserved Instance Usage Details API](migrate-ea-reserved-instance-usage-details-api.md) | [/reservationdetails](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) | [Microsoft.CostManagement/generateReservationDetailsReport](/rest/api/cost-management/generatereservationdetailsreport) |
| [Migrate from EA Reserved Instance Usage Summary APIs](migrate-ea-reserved-instance-usage-summary-api.md) | [/reservationsummaries](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) | [Microsoft.Consumption/reservationSummaries](/rest/api/consumption/reservationssummaries/list#reservationsummariesdailywithbillingaccountid) |
| [Migrate from EA Reserved Instance Recommendations APIs](migrate-ea-reserved-instance-recommendations-api.md) | [/SharedReservationRecommendations](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation)<br>[/SingleReservationRecommendations](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation) | [Microsoft.Consumption/reservationRecommendations](/rest/api/consumption/reservationrecommendations/list) |
| [Migrate from EA Reserved Instance Charges APIs](migrate-ea-reserved-instance-charges-api.md) | [/reservationcharges](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges) | [Microsoft.Consumption/reservationTransactions](/rest/api/consumption/reservationtransactions/list) |

## Use additional Cost Management APIs

After you've migrated to Azure Resource Manager APIs for your existing reporting scenarios, you can use many other APIs, too. The APIs are also available through Azure Resource Manager and can be automated using service principal-based authentication. Here's a quick summary of the new capabilities that you can use.

- [Budgets](/rest/api/consumption/budgets/createorupdate) - Use to set thresholds to proactively monitor your costs, alert relevant stakeholders, and automate actions in response to threshold breaches.
- [Alerts](/rest/api/cost-management/alerts) - Use to view alert information including, but not limited to, budget alerts, invoice alerts, credit alerts, and quota alerts.
- [Exports](/rest/api/cost-management/exports) - Use to schedule recurring data export of your charges to an Azure Storage account of your choice. It's the recommended solution for customers with a large Azure presence who want to analyze their data and use it in their own internal systems.

## Next steps

- Familiarize yourself with the [Azure Resource Manager REST APIs](/rest/api/azure).
- If needed, determine which EA APIs you use and see which Azure Resource Manager APIs to move to at [EA API mapping to new Azure Resource Manager APIs](../costs/migrate-from-enterprise-reporting-to-azure-resource-manager-apis.md#ea-api-mapping-to-new-azure-resource-manager-apis).
- If you're not already using Azure Resource Manager APIs, [register your client app with Azure AD](/rest/api/azure/#register-your-client-application-with-azure-ad).
- If needed, update any of your programming code to use [Azure AD authentication](/rest/api/azure/#create-the-request) with your service principal.