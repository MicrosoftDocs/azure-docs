# Get Small Usage Datasets On Demand

Use the Generate Detailed Cost Report API \&lt;link needed\&gt; to get raw, unaggregated cost data that corresponds to your Azure bill. The API is useful when your organization needs a programmatic data retrieval solution. Consider using the API if you&#39;re looking to analyze smaller cost data sets. However, you should use Exports for ongoing data ingestion workloads and for the download of larger datasets.

If you want to get large amounts of exported data regularly, see [Retrieve large cost datasets recurringly with exports](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/ingest-azure-usage-at-scale).

To learn more about the data in usage details, see Automate the ingestion of usage details. \&lt;link needed\&gt;

The Generate Detailed Cost Report API \&lt;need link\&gt; is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you are an MSDN, Pay-As-You-Go or Visual Studio customer, please see Get usage details as a legacy customer. \&lt;need link\&gt;

**Generate Detailed Cost Report API suggestions**

**Request schedule**

We recommend that you make _no more than one request_ to the API per day. For more information about how often cost data is refreshed and how rounding is handled, see [Understand cost management data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data).

**Target top-level scopes without filtering**

Use the API to get all the data you need at the highest-level scope available. Wait until all needed data is ingested before doing any filtering, grouping, or aggregated analysis. To learn more about scopes available in Cost Management, see [Understand and work with scopes](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/understand-work-scopes). Once you&#39;ve downloaded the needed data for a scope, use Excel to analyze data further with filters and pivot tables.

**Latency and rate limits**

Please keep in mind that on demand calls to this API are rate limited. The time it will take to generate your usage details file will also be directly correlated with the amount of data in the file. To understand the expected amount of time before your file will become available for download you can utilize the retry-after header in the API response.

To learn more, see Cost Management API latency and rate limits. \&lt;need link to doc\&gt;

## **Example Generate Detailed Cost Report API requests**

The following example requests are used by Microsoft customers to address common scenarios that you might come across.

**Get Usage Details for a scope during specific date range**

The data that&#39;s returned by the request corresponds to the date when the usage was received by the billing system. It might include costs from multiple invoices. Please note that this is an Asynchronous API. As such, you place an initial call to request your report and receive a polling link in the response header. From there, you can poll the link provided until the report is available for you.

Please utilize the retry-after header in the API response to dictate when to poll the API next. This header will provide an estimated minimum time that your report will take to generate.

To learn more about the API contract, see Generate Detailed Cost Report API. \&lt;need link\&gt;

**Actual Cost versus Amortized Cost**

You can control whether you would like to see an Actual Cost or Amortized Cost report by changing the value used for the metric field in the initial request body. The available metric values are ActualCost or AmortizedCost.

Amortized cost breaks down your reservation purchases into daily chunks and spreads them over the duration of the reservation term. For example, instead of seeing a $365 purchase on January 1, you&#39;ll see a $1.00 purchase every day from January 1 to December 31. In addition to basic amortization, these costs are also reallocated and associated by using the specific resources that used the reservation. For example, if that $1.00 daily charge was split between two virtual machines, you&#39;d see two $0.50 charges for the day. If part of the reservation isn&#39;t utilized for the day, you&#39;d see one $0.50 charge associated with the applicable virtual machine and another $0.50 charge with a charge type of UnusedReservation. Unused reservation costs can be seen only when viewing amortized cost.

Because of the change in how costs are represented, it&#39;s important to note that actual cost and amortized cost views will show different total numbers. In general, the total cost of months with a reservation purchase will decrease when viewing amortized costs, and months following a reservation purchase will increase. Amortization is available only for reservation purchases and doesn&#39;t apply to Azure Marketplace purchases at this time.

**Initial Request to Create Report**

POST https://management.azure.com/{scope}/providers/Microsoft.CostManagement/generateDetailedCostReport?api-version=2021-10-01

**Request Body:**

{

metric: ActualCost,

timePeriod: {

start: &quot;2021-09-01&quot;,

end: &quot;2021-09-05&quot;

}

}

**Response Status: 202 – Accepted:** This indicates that the request will be processed. Use the Location header to check the status.

_Response Headers_

| Name | Type | Format | Description |
| --- | --- | --- | --- |
| Location | String |
 | The URL to check the result of the asynchronous operation. |
| Azure-Consumption-AsyncOperation | String |
 | The URL to check the status of the asynchronous operation. |
| Azure-AsyncOperation | String |
 | The URL to check the status of the asynchronous operation. |
| Retry-After | Integer | Int32 | The expected time for your report to be generated. Wait for this duration before polling again. |

**Report Polling Request**

GET https://management.azure.com/{scope}/providers/Microsoft.CostManagement/operationStatus/{operationId}?api-version=2021-10-01

**Response Status 200 – Succeeded:** This indicates that the request has succeeded.

{

&quot;id&quot;: &quot;{scope}/providers/Microsoft.CostManagement/operationStatus/{operationId}&quot;,

&quot;name&quot;: &quot;{operationId}&quot;,

&quot;status&quot;: &quot;Completed&quot;,

&quot;startTime&quot;: &quot;2021-09-23T18:17:52.8762706Z&quot;,

&quot;endTime&quot;: &quot;2021-09-23T18:18:49.8498271Z&quot;,

&quot;properties&quot;: {

&quot;downloadUrl&quot;: &quot;{downloadUrl},

&quot;validTill&quot;: &quot;2021-09-24T06:20:19.9295378Z&quot;

},

&quot;error&quot;: {

&quot;code&quot;: 0,

&quot;message&quot;: **null**

}

}

## **Next steps**

- Get an overview of how to ingest usage data \&lt;Link needed\&gt;
- Learn more about usage details best practices \&lt;Link needed\&gt;
- Understand usage details fields \&lt;Link needed\&gt;
- [Create and manage exported data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data) in the Azure Portal with Exports.
- [Automate Export creation](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/ingest-azure-usage-at-scale) and ingestion at scale using the API.