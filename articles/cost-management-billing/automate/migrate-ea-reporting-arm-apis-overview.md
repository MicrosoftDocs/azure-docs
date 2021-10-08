# Migrate from EA Reporting to ARM APIs – Overview

This article helps developers who have built custom solutions using the [Azure Reporting APIs for Enterprise Customers](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/enterprise-api) to migrate onto the Azure Resource Manager APIs for Cost Management. Service Principal support for the newer Azure Resource Manager APIs is now generally available. Azure Resource Manager APIs are in active development. Consider migrating to them instead of using the older Azure Reporting APIs for Enterprise Customers. The older APIs are being deprecated. This article helps you understand the differences between the Reporting APIs and the Azure Resource Manager APIs, what to expect when you migrate to the Azure Resource Manager APIs, and the new capabilities that are available with the new Azure Resource Manager APIs.

## **API differences**

The following information describes the differences between the older Reporting APIs for Enterprise Customers and the newer Azure Resource Manager APIs.

API DIFFERENCES

| **Use** | **Enterprise Agreement APIs** | **Azure Resource Manager APIs** |
| --- | --- | --- |
| Authentication | API Key provisioned in the Enterprise Agreement (EA) portal | Azure Active Directory (Azure AD) Authentication using User tokens or Service Principals. Service Principals take the place of API Keys. |
| Scopes and Permissions | All requests are at the Enrollment scope. The API Key permission assignments will determine whether data for the entire Enrollment, a Department, or a specific Account is returned. No user authentication. | Users or Service Principals are assigned access to the Enrollment, Department, or Account scope. |
| URI Endpoint | [https://consumption.azure.com](https://consumption.azure.com/) | [https://management.azure.com](https://management.azure.com/) |
| Development Status | In maintenance mode. On the path to deprecation. | Actively being developed |
| Available APIs | Limited to what is available currently | Equivalent APIs are available to replace each EA API.Additional [Cost Management APIs](https://docs.microsoft.com/en-us/rest/api/cost-management/) are also available to you, including:
- Budgets
- Alerts
- Exports
 |

## **Migration checklist**

- Familiarize yourself with the [Azure Resource Manager REST APIs](https://docs.microsoft.com/en-us/rest/api/azure).
- Determine which EA APIs you use and see which Azure Resource Manager APIs to move to at [EA API mapping to new Azure Resource Manager APIs](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/migrate-from-enterprise-reporting-to-azure-resource-manager-apis#ea-api-mapping-to-new-azure-resource-manager-apis).
- Configure service authorization and authentication for the Azure Resource Manager APIs. For more information, see Assign permission to ACM APIs. \&lt;need link\&gt;
- Test the APIs and then update any programming code to replace EA API calls with Azure Resource Manager API calls.
- Update error handling to use new error codes. Some considerations include:

  - Azure Resource Manager APIs have a timeout period of 60 seconds.
  - Azure Resource Manager APIs have rate limiting in place. This results in a 429 throttling error if rates are exceeded. Build your solutions so that you don&#39;t place too many API calls in a short time period.

- Review the other Cost Management APIs available through Azure Resource Manager and assess for use later. For more information, see [Use additional Cost Management APIs](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/migrate-from-enterprise-reporting-to-azure-resource-manager-apis#use-additional-cost-management-apis).

## **EA API mapping to new Azure Resource Manager APIs**

Use the table below to identify the EA APIs that you currently use and the replacement Azure Resource Manager API to use instead.

EA API MAPPING TO NEW AZURE RESOURCE MANAGER APIS

\&lt;note: Added usage details API info\&gt;

| **Scenario** | **EA APIs** | **Azure Resource Manager APIs** |
| --- | --- | --- |
| Usage Details – Migration Info \&lt;link needed\&gt; | [/usagedetails/download](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)[/usagedetails/submit](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)[/usagedetails](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-usage-detail)[/usagedetailsbycustomdate](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-usage-detail) | [Microsoft.CostManagement/Exports](https://docs.microsoft.com/en-us/rest/api/cost-management/exports/create-or-update) - use for all recurring data ingestion workloadsMicrosoft.CostManagement/generateDetailedCostReport - use for on demand, small datasets \&lt;link needed\&gt; |
| Balance Summary – Migration Info \&lt;link needed\&gt; | [/balancesummary](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-balance-summary) | [Microsoft.Consumption/balances](https://docs.microsoft.com/en-us/rest/api/consumption/balances/getbybillingaccount) |
| Price Sheet – Migration Info \&lt;link needed\&gt; | [/pricesheet](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-pricesheet) | [Microsoft.Consumption/pricesheets/default](https://docs.microsoft.com/en-us/rest/api/consumption/pricesheet) – use for negotiated prices[Retail Prices API](https://docs.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices) – use for retail prices |
| Reserved Instance Details – Migration Info \&lt;link needed\&gt; | [/reservationdetails](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) | [Microsoft.CostManagement/generateReservationDetailsReport](https://docs.microsoft.com/en-us/rest/api/cost-management/generatereservationdetailsreport) |
| Reserved Instance Summary – Migration Info \&lt;link needed\&gt; | [/reservationsummaries](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage) | [Microsoft.Consumption/reservationSummaries](https://docs.microsoft.com/en-us/rest/api/consumption/reservationssummaries/list#reservationsummariesdailywithbillingaccountid) |
| Reserved Instance Recommendations – Migration Info \&lt;link needed\&gt; | [/SharedReservationRecommendations](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation)[/SingleReservationRecommendations](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation) | [Microsoft.Consumption/reservationRecommendations](https://docs.microsoft.com/en-us/rest/api/consumption/reservationrecommendations/list) |
| Reserved Instance Charges – Migration Info \&lt;link needed\&gt; | [/reservationcharges](https://docs.microsoft.com/en-us/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges) | [Microsoft.Consumption/reservationTransactions](https://docs.microsoft.com/en-us/rest/api/consumption/reservationtransactions/list) |

## **Use additional Cost Management APIs**

After you&#39;ve migrated to Azure Resource Manager APIs for your existing reporting scenarios, you can use many other APIs, too. The APIs are also available through Azure Resource Manager and can be automated using Service Principal-based authentication. Here&#39;s a quick summary of the new capabilities that you can use.

- [Budgets](https://docs.microsoft.com/en-us/rest/api/consumption/budgets/createorupdate) - Use to set thresholds to proactively monitor your costs, alert relevant stakeholders, and automate actions in response to threshold breaches.
- [Alerts](https://docs.microsoft.com/en-us/rest/api/cost-management/alerts) - Use to view alert information including, but not limited to, budget alerts, invoice alerts, credit alerts, and quota alerts.
- [Exports](https://docs.microsoft.com/en-us/rest/api/cost-management/exports) - Use to schedule recurring data export of your charges to an Azure Storage account of your choice. It&#39;s the recommended solution for customers with a large Azure presence who want to analyze their data and use it in their own internal systems.

## **Next steps**

- Familiarize yourself with the [Azure Resource Manager REST APIs](https://docs.microsoft.com/en-us/rest/api/azure).
- If needed, determine which EA APIs you use and see which Azure Resource Manager APIs to move to at [EA API mapping to new Azure Resource Manager APIs](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/migrate-from-enterprise-reporting-to-azure-resource-manager-apis#ea-api-mapping-to-new-azure-resource-manager-apis).
- If you&#39;re not already using Azure Resource Manager APIs, [register your client app with Azure AD](https://docs.microsoft.com/en-us/rest/api/azure/#register-your-client-application-with-azure-ad).
- If needed, update any of your programming code to use [Azure AD authentication](https://docs.microsoft.com/en-us/rest/api/azure/#create-the-request) with your Service Principal.