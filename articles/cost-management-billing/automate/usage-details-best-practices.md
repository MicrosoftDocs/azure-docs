**Usage details best practices**

There are multiple ways to work with the usage details dataset. If your organization has a large Azure presence across many resources or subscriptions, you&#39;ll have a large amount of usage details data. Excel often can&#39;t load such large files. In this situation, we recommend the options below.

**Exports**

Exports is our recommended solution for ingesting usage details data. This solution is the most scalable for large enterprises moving forward. Exports can be [configured in the Azure portal](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data?tabs=azure-portal) or using the [Exports API](https://docs.microsoft.com/en-us/rest/api/cost-management/exports).

To learn more about how to properly call this API and ingest usage details at scale, see [Retrieve large datasets with exports](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/ingest-azure-usage-at-scale).

**Generate Detailed Cost Report API**

Consider using the Generate Detailed Cost Report API \&lt;need link\&gt; if you have a small cost data set. If you have a large amount of cost data, you should request the smallest amount of usage data as possible for a period. To do so, specify either a small time range or use a filter in your request. For example, in a scenario where you need three years of cost data, the API does better when you make multiple calls for different time ranges rather than with a single call. From there, you can load the data into Excel for further analysis.

To learn more about how to properly call the Generate Detailed Cost Report API \&lt;need link\&gt;, see Get small usage data sets on demand\&lt;need link to UD doc\&gt;.

Please note that the Generate Detailed Cost Report API \&lt;need link\&gt; is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you are an MSDN, Pay-As-You-Go or Visual Studio customer, please see Get usage details as a legacy customer. \&lt;need link\&gt;

**Power BI**

Power BI is another solution that can be used to work with Usage Details data. The following solutions are available:

- _Azure Cost Management Template App:_ If you&#39;re an Enterprise Agreement or Microsoft Customer Agreement customer, you can use the Power BI template app to analyze costs for your billing account. This is an out of the box set of reports that are built on top of the Usage Details dataset, among others. For more information, see [Analyze Azure costs with the Power BI template app](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/analyze-cost-data-azure-cost-management-power-bi-template-app).
- _Azure Cost Management Connector:_ If you want to analyze your data daily, you can use the [Power BI data connector](https://docs.microsoft.com/en-us/power-bi/connect-data/desktop-connect-azure-cost-management) to get data for detailed analysis. Any reports that you create are kept up to date by the connector as more costs accrue.

**Azure Portal Download**

Only [download your usage from the Azure Portal](https://docs.microsoft.com/en-us/azure/cost-management-billing/understand/download-azure-daily-usage) if you have a small usage details dataset that is capable of being loaded in Excel. Usage files that are larger than 1 or 2Gb may take a very long time to generate on demand from the Azure Portal and even longer to transfer over the network to your local computer. We recommend using one of the above solutions if you have a large usage dataset month-to-month.

## **Next steps**

- Get an overview of how to ingest usage data \&lt;Link needed\&gt;
- [Create and manage exported data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data) in the Azure Portal with Exports.
- [Automate Export creation](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/ingest-azure-usage-at-scale) and ingestion at scale using the API.
- Understand usage details fields \&lt;Link needed\&gt;
- Learn how to get small usage datasets on demand \&lt;Link needed\&gt;