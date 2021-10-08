# Automation FAQ

## **Frequently asked questions**

### _What&#39;s the difference between the Invoice API, the Transaction API, and the Usage Details API?_

These APIs provide a different view of the same data:

- The [Invoice API](https://docs.microsoft.com/en-us/rest/api/billing/2019-10-01-preview/invoices) provides an aggregated view of your monthly charges.
- The [Transactions API](https://docs.microsoft.com/rest/api/billing/2020-05-01/transactions/list-by-invoice) provides a view of your monthly charges aggregated at product/service family level.
- The Generate Detailed Cost Report API \&lt;need link to new API swagger\&gt; provides a granular view of the usage/cost records for each day. Both Enterprise and Microsoft Customer Agreement customers can use it. \&lt;Need snippet on what WD customers can use.\&gt;

### _I recently migrated from an EA to an MCA agreement. How do I migrate my API workloads?_

Please see[Migrate from EA to MCA APIs](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/migrate-cost-management-api).

### _When are the_ [_Enterprise Reporting APIs_](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/enterprise-api) _being turned off?_

The Enterprise Reporting APIs are deprecated. The exact date for this API to be turned off is still to be determined. We recommend that you migrate off of these APIs at your earliest convenience. To learn more, please see [Migrate from Enterprise Reporting to Azure Resource Manager APIs.](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/migrate-from-enterprise-reporting-to-azure-resource-manager-apis)

_When is the_ [_Consumption Usage Details API_](https://docs.microsoft.com/en-us/rest/api/consumption/usage-details/list) _being turned off?_

The Consumption Usage Details API is deprecated. The exact date for this API to be turned off is still to be determined. We recommend that you migrate off of this API at your earliest convenience. To learn more, see Migrate from Consumption Usage Details API. \&lt;link needed\&gt;

_When is the_ [_Consumption Marketplaces API_](https://docs.microsoft.com/en-us/rest/api/consumption/marketplaces/list) _being turned off?_

The Marketplaces API is deprecated. The exact date for this API to be turned off is still to be determined. The data in this API is available in the Generate Detailed Cost Report API. We recommend that you migrate to using this API at your earliest convenience. To learn more, see Migrate from Consumption Marketplaces API. \&lt;link needed\&gt;

_When is the_ [_Consumption Forecasts API_](https://docs.microsoft.com/en-us/rest/api/consumption/forecasts/list) _being turned off?_

The Forecasts API is deprecated. The exact date for this API to be turned off is still to be determined. The data in this API is available in the [Cost Management Forecast API](https://docs.microsoft.com/en-us/rest/api/cost-management/forecast). We recommend that you migrate to using this API at your earliest convenience. To learn more, see Migrate from Consumption Forecasts API. \&lt;link needed\&gt;