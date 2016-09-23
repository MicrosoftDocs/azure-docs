<properties 
	pageTitle="Search Traffic Analytics for Azure Search | Microsoft Azure" 
	description="Enable Search traffic analytics for Azure Search, a cloud hosted search service on Microsoft Azure, to unlock insights about your users and your data." 
	services="search" 
	documentationCenter="" 
	authors="bernitorres" 
	manager="pablocas" 
	editor=""
/>

<tags 
	ms.service="search" 
	ms.devlang="multiple" 
	ms.workload="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="07/19/2016" 
	ms.author="betorres"
/>


# Enabling and using Search Traffic Analytics

Search traffic analytics is an Azure Search feature that lets you gain visibility into your search service and unlock insights about your users and their behavior. When you enable this feature, your search service data is copied to a storage account of your choosing. This data includes your search service logs and aggregated operational metrics which you can process and manipulate for further analysis.

## How to enable Search Traffic Analytics

You will need a Storage account in the same region and subscription as your search service.

> [AZURE.IMPORTANT] Standard charges apply for this storage account

Once enabled, the data will start flowing into your storage account within 5-10 minutes into these 2 blob containers:

    insights-logs-operationlogs: search traffic logs
    insights-metrics-pt1m: aggregated metrics


### 1. Using the portal
Open your Azure Search service in the [Azure Portal](http://portal.azure.com). Under Settings, you will find the Search traffic analytics option. 

![][1]

Select this option and a new blade will open. Change the Status to **On**, select the Azure Storage account your data will be copied to, and choose the data you want to copy: Logs, Metrics or both. We recommend copying logs and metrics. 
You have the option to set the retention policy for your data from 1 to 365 days. If you don't want to apply any retention policy and retain the data forever, set retention (days) to 0.

![][2]

### 2. Using PowerShell

First, make sure you have the latest [Azure PowerShell cmdlets](https://github.com/Azure/azure-powershell/releases) installed.

Then, get the Resource Ids for your Search Service and your Storage account. You can find them in the portal navigating to Settings -> Properties -> ResourceId.

![][3]

```PowerShell
Login-AzureRmAccount
$SearchServiceResourceId = "Your Search service resource id"
$StorageAccountResourceId = "Your Storage account resource id"
Set-AzureRmDiagnosticSetting -ResourceId $SearchServiceResourceId StorageAccountId $StorageAccountResourceId -Enabled $true
```

## Understanding the data

The data is stored in Azure Storage blobs formatted as JSON.

There will be one blob, per hour, per container.
  
Example path: `resourceId=/subscriptions/<subscriptionID>/resourcegroups/<resourceGroupName>/providers/microsoft.search/searchservices/<searchServiceName>/y=2015/m=12/d=25/h=01/m=00/name=PT1H.json`

### Logs

The logs blobs contain your search service traffic logs.
Each blob has one root object called **records** that contains an array of log objects
Each blob has records on all the operation that took place during the same hour.

####Log schema

Name |Type |Example |Notes 
------|-----|----|-----
time |datetime |"2015-12-07T00:00:43.6872559Z" |Timestamp of the operation
resourceId |string |"/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/<br/>RESOURCEGROUPS/DEFAULT/PROVIDERS/<br/> MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" |Your ResourceId
operationName |string |"Query.Search" |The name of the operation
operationVersion |string |"2015-02-28"|The api-version used
category |string |"OperationLogs" |constant 
resultType |string |"Success" |Possible values: Success or Failure 
resultSignature |int |200 |HTTP result code 
durationMS |int |50 |Duration of the operation in milliseconds 
properties |object |see below |Object containing operation specific data

####Properties schema

|Name |Type |Example |Notes|
|------|-----|----|-----|
|Description|string |"GET /indexes('content')/docs" |The operation's endpoint |
|Query |string |"?search=AzureSearch&$count=true&api-version=2015-02-28" |The query parameters |
|Documents |int |42 |Number of documents processed|
|IndexName |string |"testindex"|Name of the index associated with the operation |

### Metrics

The metrics blobs contain aggregated values for your search service. 
Each file has one root object called **records** that contains an array of metric objects. This root object contains metrics for every minute for which data was available. 

Available metrics:

- SearchLatency: Time the search service needed to process search queries, aggregated per minute.
- SearchQueriesPerSecond: Number of search queries received per second, aggregated per minute.
- ThrottledSearchQueriesPercentage: Percentage of search queries that were throttled, aggregated per minute.

> [AZURE.IMPORTANT] Throttling occurs when too many queries are sent, exhausting the service's provisioned resource capacity. Consider adding more replicas to your service.

####Metrics schema

|Name |Type |Example |Notes|
|------|-----|----|-----|
|resourceId |string |"/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/<br/>RESOURCEGROUPS/DEFAULT/PROVIDERS/<br/>MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE"  |your resource id |
|metricName |string |"Latency" |the name of the metric |
|time|datetime |"2015-12-07T00:00:43.6872559Z" |the operation's timestamp |
|average |int |64|The average value of the raw samples in the metric time interval |
|minimum |int |37 |The minimum value of the raw samples in the metric time interval |
|maximum |int |78 |The maximum value of the raw samples in the metric time interval |
|total |int |258 |The total value of the raw samples in the metric time interval |
|count |int |4 |The number of raw samples used to generate the metric |
|timegrain |string |"PT1M" |The time grain of the metric in ISO 8601|

All metrics are reported in one-minute intervals. This means that each of the metrics will expose the minimum, maximum and average values per minute.

In the case of the SearchQueriesPerSecond metric, minimum will be the lowest value for search queries per second that was registered during that minute; same applies to the maximum value. Average, will be the the aggregate across the entire minute. 
Think about this scenario: during one minute you can have 1 second of very high load, which will be you maximum for SearchQueriesPerSecond, followed by 58 seconds of mid load, and then one second with only one query, which will be the minimum.

For ThrottledSearchQueriesPercentage, minimum, maximum, average and total will all be the same value, which is the percentage of search queries that were throttled, based on the total number of search queries during one minute.

## Analyzing your data

The data is in your own storage account and we encourage you to explore this data in the manner that works best for your case.

As a starting point, we recommend using [Power BI](https://powerbi.microsoft.com) to explore and visualize your data. You can easily connect to your Azure Storage Account and quickly start analyzing your data. 

#### Power BI Online

[Power BI Content Pack](https://app.powerbi.com/getdata/services/azure-search): Create a Power BI dashboard and a set of Power BI reports that automatically show your data and provide visual insights about your search service. See the [content pack help page](https://powerbi.microsoft.com/en-us/documentation/powerbi-content-pack-azure-search/).

![][4]

#### Power BI Desktop

[Power BI Desktop](https://powerbi.microsoft.com/en-us/desktop): Explore your data and create your own visualizations for your data. We provide a starter query below to help you.

1. Open a new PowerBI Desktop report
2. Select Get Data -> More...

	![][5]

3. Select Microsoft Azure Blob Storage and Connect

	![][6]

4. Enter the Name and Account Key of your storage account
5. Select "insight-logs-operationlogs" and "insights-metrics-pt1m", then click on Edit
6. The Query Editor will open, make sure "insight-logs-operationlogs" is selected on the left. Now open the Advanced Editor by selecting View -> Advanced Editor

	![][7]

7. Keep the first 2 lines and replace the rest with the following query:

	>     #"insights-logs-operationlogs" = Source{[Name="insights-logs-operationlogs"]}[Data],
	>     #"Sorted Rows" = Table.Sort(#"insights-logs-operationlogs",{{"Date modified", Order.Descending}}),
	>     #"Kept First Rows" = Table.FirstN(#"Sorted Rows",744),
	>     #"Removed Columns" = Table.RemoveColumns(#"Kept First Rows",{"Name", "Extension", "Date accessed", "Date modified", "Date created", "Attributes", "Folder Path"}),
	>     #"Parsed JSON" = Table.TransformColumns(#"Removed Columns",{},Json.Document),
	>     #"Expanded Content" = Table.ExpandRecordColumn(#"Parsed JSON", "Content", {"records"}, {"records"}),
	>     #"Expanded records" = Table.ExpandListColumn(#"Expanded Content", "records"),
	>     #"Expanded records1" = Table.ExpandRecordColumn(#"Expanded records", "records", {"time", "resourceId", "operationName", "operationVersion", "category", "resultType", "resultSignature", "durationMS", "properties"}, {"time", "resourceId", "operationName", "operationVersion", "category", "resultType", "resultSignature", "durationMS", "properties"}),
	>     #"Expanded properties" = Table.ExpandRecordColumn(#"Expanded records1", "properties", {"Description", "Query", "IndexName", "Documents"}, {"Description", "Query", "IndexName", "Documents"}),
	>     #"Renamed Columns" = Table.RenameColumns(#"Expanded properties",{{"time", "Datetime"}, {"resourceId", "ResourceId"}, {"operationName", "OperationName"}, {"operationVersion", "OperationVersion"}, {"category", "Category"}, {"resultType", "ResultType"}, {"resultSignature", "ResultSignature"}, {"durationMS", "Duration"}}),
	>     #"Added Custom2" = Table.AddColumn(#"Renamed Columns", "QueryParameters", each Uri.Parts("http://tmp" & [Query])),
	>     #"Expanded QueryParameters" = Table.ExpandRecordColumn(#"Added Custom2", "QueryParameters", {"Query"}, {"Query.1"}),
	>     #"Expanded Query.1" = Table.ExpandRecordColumn(#"Expanded QueryParameters", "Query.1", {"search", "$skip", "$top", "$count", "api-version", "searchMode", "$filter"}, {"search", "$skip", "$top", "$count", "api-version", "searchMode", "$filter"}),
	>     #"Removed Columns1" = Table.RemoveColumns(#"Expanded Query.1",{"OperationVersion"}),
	>     #"Changed Type" = Table.TransformColumnTypes(#"Removed Columns1",{{"Datetime", type datetimezone}, {"ResourceId", type text}, {"OperationName", type text}, {"Category", type text}, {"ResultType", type text}, {"ResultSignature", type text}, {"Duration", Int64.Type}, {"Description", type text}, {"Query", type text}, {"IndexName", type text}, {"Documents", Int64.Type}, {"search", type text}, {"$skip", Int64.Type}, {"$top", Int64.Type}, {"$count", type logical}, {"api-version", type text}, {"searchMode", type text}, {"$filter", type text}}),
	>     #"Inserted Date" = Table.AddColumn(#"Changed Type", "Date", each DateTime.Date([Datetime]), type date),
	>     #"Duplicated Column" = Table.DuplicateColumn(#"Inserted Date", "ResourceId", "Copy of ResourceId"),
	>     #"Split Column by Delimiter" = Table.SplitColumn(#"Duplicated Column","Copy of ResourceId",Splitter.SplitTextByEachDelimiter({"/"}, null, true),{"Copy of ResourceId.1", "Copy of ResourceId.2"}),
	>     #"Changed Type1" = Table.TransformColumnTypes(#"Split Column by Delimiter",{{"Copy of ResourceId.1", type text}, {"Copy of ResourceId.2", type text}}),
	>     #"Removed Columns2" = Table.RemoveColumns(#"Changed Type1",{"Copy of ResourceId.1"}),
	>     #"Renamed Columns1" = Table.RenameColumns(#"Removed Columns2",{{"Copy of ResourceId.2", "ServiceName"}}),
	>     #"Lowercased Text" = Table.TransformColumns(#"Renamed Columns1",{{"ServiceName", Text.Lower}}),
	>     #"Added Custom" = Table.AddColumn(#"Lowercased Text", "DaysFromToday", each Duration.Days(DateTimeZone.UtcNow() - [Datetime])),
	>     #"Changed Type2" = Table.TransformColumnTypes(#"Added Custom",{{"DaysFromToday", Int64.Type}})
	>     in
	>     #"Changed Type2"

8. Click Done

9. Select now "insights-metrics-pt1m" from the lest of queries on the left, and open the Advanced editor again. Keep the first 2 lines and replace the rest with the following query: 

	>     #"insights-metrics-pt1m1" = Source{[Name="insights-metrics-pt1m"]}[Data],
	>     #"Sorted Rows" = Table.Sort(#"insights-metrics-pt1m1",{{"Date modified", Order.Descending}}),
	>     #"Kept First Rows" = Table.FirstN(#"Sorted Rows",744),
    	#"Removed Columns" = Table.RemoveColumns(#"Kept First Rows",{"Name", "Extension", "Date accessed", "Date modified", "Date created", "Attributes", "Folder Path"}),
	>     #"Parsed JSON" = Table.TransformColumns(#"Removed Columns",{},Json.Document),
	>     #"Expanded Content" = Table.ExpandRecordColumn(#"Parsed JSON", "Content", {"records"}, {"records"}),
	>     #"Expanded records" = Table.ExpandListColumn(#"Expanded Content", "records"),
	>     #"Expanded records1" = Table.ExpandRecordColumn(#"Expanded records", "records", {"resourceId", "metricName", "time", "average", "minimum", "maximum", "total", "count", "timeGrain"}, {"resourceId", "metricName", "time", "average", "minimum", "maximum", "total", "count", "timeGrain"}),
	>     #"Filtered Rows" = Table.SelectRows(#"Expanded records1", each ([metricName] = "Latency")),
	>     #"Removed Columns1" = Table.RemoveColumns(#"Filtered Rows",{"timeGrain"}),
	>     #"Renamed Columns" = Table.RenameColumns(#"Removed Columns1",{{"time", "Datetime"}, {"resourceId", "ResourceId"}, {"metricName", "MetricName"}, {"average", "Average"}, {"minimum", "Minimum"}, {"maximum", "Maximum"}, {"total", "Total"}, {"count", "Count"}}),
	>     #"Changed Type" = Table.TransformColumnTypes(#"Renamed Columns",{{"ResourceId", type text}, {"MetricName", type text}, {"Datetime", type datetimezone}, {"Average", type number}, {"Minimum", Int64.Type}, {"Maximum", Int64.Type}, {"Total", Int64.Type}, {"Count", Int64.Type}}),
	>         Rounding = Table.TransformColumns(#"Changed Type",{{"Average", each Number.Round(_, 2)}}),
	>     #"Changed Type1" = Table.TransformColumnTypes(Rounding,{{"Average", type number}}),
	>     #"Inserted Date" = Table.AddColumn(#"Changed Type1", "Date", each DateTime.Date([Datetime]), type date)
	>     in
    	#"Inserted Date"

10. Click Done and then select Close&Apply in the Home tab.

11. Your data for the last 30 days is now ready to be consumed. Go ahead and create some [visualizations](https://powerbi.microsoft.com/en-us/documentation/powerbi-desktop-report-view/).

## Next Steps

Learn more about search syntax and query parameters. See [Search Documents (Azure Search REST API)](https://msdn.microsoft.com/library/azure/dn798927.aspx) for details.

Learn more about creating amazing reports. See [Getting started with Power BI Desktop](https://powerbi.microsoft.com/en-us/documentation/powerbi-desktop-getting-started/) for details

<!--Image references-->

[1]: ./media/search-traffic-analytics/SettingsBlade.png
[2]: ./media/search-traffic-analytics/DiagnosticsBlade.png
[3]: ./media/search-traffic-analytics/ResourceId.png
[4]: ./media/search-traffic-analytics/Dashboard.png
[5]: ./media/search-traffic-analytics/GetData.png
[6]: ./media/search-traffic-analytics/BlobStorage.png
[7]: ./media/search-traffic-analytics/QueryEditor.png

