# Get Usage Details as a legacy customer

If you are an MSDN, Pay-As-You-Go or Visual Studio customer we recommend that you utilize [Exports](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data?tabs=azure-portal) or the [Exports API](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/ingest-azure-usage-at-scale) to get usage details data. The Generate Detailed Cost Report API is not currently available for you to use.

If you need to download small datasets and don&#39;t wish to use Azure Storage, you can also utilize the Consumption Usage Details API. Instructions on how to use this API are below. Please note that the API is deprecated. The exact date for when it will be turned off is still to be determined.

## **Example Consumption Usage Details API requests**

The following example requests are used by Microsoft customers to address common scenarios that you might come across.

**Get Usage Details for a scope during specific date range**

The data that&#39;s returned by the request corresponds to the date when the usage was received by the billing system. It might include costs from multiple invoices. The call to use varies by your subscription type.

For legacy customers use the following call:

GET [https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?$filter=properties%2FusageStart%20ge%20&#39;2020-02-01&#39;%20and%20properties%2FusageEnd%20le%20&#39;2020-02-29&#39;&amp;$top=1000&amp;api-version=2019-10-01](https://management.azure.com/%7Bscope%7D/providers/Microsoft.Consumption/usageDetails?%24filter=properties%2FusageStart%20ge%20&#39;2020-02-01&#39;%20and%20properties%2FusageEnd%20le%20&#39;2020-02-29&#39;&amp;%24top=1000&amp;api-version=2019-10-01)

### **Get amortized cost details**

If you need actual costs to show purchases as they&#39;re accrued, change the _metric_ to ActualCost in the following request. To use amortized and actual costs, you must use version 2019-04-01-preview version or later.

GET [https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?metric=AmortizedCost&amp;$filter=properties/usageStart+ge+&#39;2019-04-01&#39;+AND+properties/usageEnd+le+&#39;2019-04-30&#39;&amp;api-version=2019-04-01-preview](https://management.azure.com/%7Bscope%7D/providers/Microsoft.Consumption/usageDetails?metric=AmortizedCost&amp;%24filter=properties/usageStart+ge+&#39;2019-04-01&#39;+AND+properties/usageEnd+le+&#39;2019-04-30&#39;&amp;api-version=2019-04-01-preview)

##