<properties 
	pageTitle="Enabling and using Search Traffic Analytics | Microsoft Azure | Hosted cloud search service" 
	description="Enable Search traffic analytics for Azure Search, a cloud hosted search service on Microsoft Azure." 
	services="search" 
	documentationCenter="" 
	authors="betorres" 
	manager="pablocas" 
	editor=""
/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="12/10/2015" 
	ms.author="betorres"
/>

# Enabling and using Search Traffic Analytics #

Search traffic analytics is an Azure Search feature that lets you gain visibility into your search service and unlock insights about your users and their behavior. When you enable this feature, your search service traffic logs and some pre-calculated metrics are copied to a storage account of your choosing. Once there, the data is yours for you to analyze and manipulate as is more convenient to  you.

The data is stored in Azure Storage blob containers in JSON files.

## How to enable Search Traffic Analytics ##

### 1. Using the portal ###
Open your Azure Search service in the [Azure Portal](http://portal.azure.com). Under Settings, you will find the Search Traffic Analytics option. 

 ![][1]

Select this option and a new blade will open. Change the Status to **On**, select the Azure storage account your data will be copied to and choose if you want to copy Logs, Metrics or both.

![][2]


> [AZURE.NOTE] The storage account needs to be in the same region and same subscription as your search service. Standard costs apply for this storage account

### 2. Using PowerShell ###

You can also enable this feature by running the following PowerShell cmdlets.

    Login-AzureRmAccount
    Set-AzureRmDiagnosticSetting -ResourceId <SearchService ResourceId> StorageAccountId <StorageAccount ResourceId> -Enabled $true

-   SearchService ResourceId:
 `/subscriptions/<your subscription ID>/resourceGroups/<your resource group>/providers/Microsoft.Search/searchServices/<your search service name>`  
 
-  StorageAccount ResourceId:
  You can find it in the portal in Settings -> Properties -> ResourceId 
 `New: /subscriptions/<your subscription ID>/resourcegroups/your resource group>/providers/Microsoft.Storage/storageAccounts/your storage account name>` 
 OR
  `Classic: /subscriptions/<your subscription ID>/resourceGroups/your resource group>/providers/Microsoft.ClassicStorage/storageAccounts/<your storage account name>`   

----------

One enabled, the data will start flowing to your storage account within 5-10 minutes. Two new containers will be created:

    insights-logs-operationlogs: contains your search service traffic logs
    insights-metrics-pt1m: contains your pre computed metrics

There will be one blob per hour per container.  
Example path: `resourceId=/subscriptions/<your subscription ID>/resourcegroups/<your resource group>/providers/microsoft.search/searchservices/<your search service name>/y=2015/m=12/d=25/h=01/m=00/name=PT1H.json`

## Understanding the data ##

### Logs ###

The logs blobs contain your search service traffic logs. Anything that can be called with the Public API will appear in these files.

Each file has a a **records** object that contains an array of log objects

Log schema
|Name | Type | Example | Notes| 
|------|-----|----|-----|
|time| datetime | "2015-12-07T00:00:43.6872559Z" | the operation's timestamp |
|resourceId | string | "/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/RESOURCEGROUPS/DEFAULT/PROVIDERS/MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" | your resource id |
| operationName | string | "Query.Search" | |
| operationVersion | string | "2015-02-28"| the api-version used in this operation |
| category | string | "OperationLogs" | this is always the same value |
| resultType | string | "Success" | Only 2 possible values: Success or Failure | 
| resultSignature | int | 200 | HTTP result code |
| durationMS | int | 50 | duration of the operation in milliseconds |
| properties | object |  see below | object that contains the operation specific data|

Properties schema
|Name | Type | Example | Notes| 
|------|-----|----|-----|
|Description| string | "GET /indexes('content')/docs" | The operation that was called |
|Query | string | "?search=AzureSearch&$count=true&api-version=2015-02-28" | the query parameters |
| Documents | int | 42 | Number of documents processed|
| IndexName | string | "testindex"| the name of the index associated with the operation |

### Metrics ###

The metrics blobs contain aggregated values for your search service.

Available metrics:

- Latency


Each file has a a **records** object that contains an array of metric objects

Metrics schema
|Name | Type | Example | Notes| 
|------|-----|----|-----|
| resourceId | string | "/SUBSCRIPTIONS/11111111-1111-1111-1111-111111111111/RESOURCEGROUPS/DEFAULT/PROVIDERS/MICROSOFT.SEARCH/SEARCHSERVICES/SEARCHSERVICE" | your resource id |
| metricName | string | "Latency" | the name of the metric |
| time| datetime | "2015-12-07T00:00:43.6872559Z" | the operation's timestamp |
| average | int | 64| The average value of the raw samples in the metric time interval |
| minimum | int | 37 | The minimum value of the raw samples in the metric time interval |
| maximum | int | 78 | The maximum value of the raw samples in the metric time interval | 
| total | int | 258 | The total value of the raw samples in the metric time interval |
| count | int | 4 | The number of raw samples used to generate the metric |
| timegrain | string | "PT1m" | The time grain of the metric in ISO 8601|

## Analyzing your data ##

The data is in your own storage account and we encourage you to explore this data in the manner that works best for your case.

As a starting point, we recommend using [PowerBI Desktop](https://powerbi.microsoft.com/en-us/desktop) to explore and visualize your data. You can easily connect to your Blob Storage Account and quickly start analyzing your data.

To simplify this process, we present below a Sample Query that will let you start creating your own visualizations.

### Instructions ###

1. Open a new PowerBI Desktop report
2. Select Get Data -> More...

![][3]

3. Select Microsoft Azure Blob Storage and Connect

![][4]

4. Enter the Name and Account Key of your storage account
5. Right click insight-logs-operationlogs and select Load
6. The Query Editor will open. Select View -> Advanced Editor

![][5]

7. Replace the **red** rectangle with the following code:

>     #"insights-logs-operationlogs" = Source{[Name="insights-logs-operationlogs"]}[Data],
>     #"Sorted Rows" = Table.Sort(#"insights-logs-operationlogs",{{"Date modified", Order.Descending}}),
>     #"Kept First Rows" = Table.FirstN(#"Sorted Rows",288),
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

8. Select Done, and the Close&Apply in Home

9. Your data is now ready to be consumed.


<!--Image references-->

[1]: ./SettingsBlade.PNG
[2]: ./DiagnosticsBlade.PNG
[3]: ./GetData.PNG
[4]: ./BlobStorage.PNG
[5]: ./QueryEditor.PNG
