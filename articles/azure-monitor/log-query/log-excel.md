---
title: Integrate Log Analytics and excel step by step
description: 
ms.subservice: logs
ms.topic: conceptual
author: rboucher
ms.author: robb
ms.date: 09/29/2020

---

# Integrate Log Analytics and excel step by step

1.	Integrating Log Analytics with excel
Azure Monitor Log analytics allows integration of query results to Excel using M query.
This integration will allow excel to run Log Analytics queries via API, allowing the ingestion of up to 500,000 records to excel.
Please note, since excel is a local application, hardware limitations and other limitations will impact performance and the client side ability to process large sets of data.
2.	Create your M query in Log analytics 
2.1.	Create and run your query in Log Analytics 
Create and run your query in Log analytics as you normally would.
Don’t worry if you hit the 10,000 records limitation in the UI.
Please take note as to the dates you use in the query – recommendation is to use relative dates – like the ‘ago’ function or the UI’s time picker so excel refreshes on the right set of data:
  
2.2.	Export your M query
Once you are happy with the query and it’s results, export the query to M using Log Analytics “Export to Power BI (M query)” function located in the “export” menu:
 
This will download a .txt file containing the M code you can use in Excel,
Here’s an example of the M code exported for the query in our example:
/*
The exported Power Query Formula Language (M Language ) can be used with Power Query in Excel
and Power BI Desktop.
For Power BI Desktop follow the instructions below: 
1) Download Power BI Desktop from https://powerbi.microsoft.com/desktop/
2) In Power BI Desktop select: 'Get Data' -> 'Blank Query'->'Advanced Query Editor'
3) Paste the M Language script into the Advanced Query Editor and select 'Done'
*/


let AnalyticsQuery =
let Source = Json.Document(Web.Contents("https://api.loganalytics.io/v1/workspaces/ddcfc599-cae0-48ee-9026-2ec12172512f/query", 
[Query=[#"query"="

Heartbeat 
| summarize dcount(ComputerIP) by bin(TimeGenerated, 1h)    
| render timechart
",#"x-ms-app"="OmsAnalyticsPBI",#"timespan"="P1D",#"prefer"="ai.response-thinning=true"],Timeout=#duration(0,0,4,0)])),
TypeMap = #table(
{ "AnalyticsTypes", "Type" }, 
{ 
{ "string",   Text.Type },
{ "int",      Int32.Type },
{ "long",     Int64.Type },
{ "real",     Double.Type },
{ "timespan", Duration.Type },
{ "datetime", DateTimeZone.Type },
{ "bool",     Logical.Type },
{ "guid",     Text.Type },
{ "dynamic",  Text.Type }
}),
DataTable = Source[tables]{0},
Columns = Table.FromRecords(DataTable[columns]),
ColumnsWithType = Table.Join(Columns, {"type"}, TypeMap , {"AnalyticsTypes"}),
Rows = Table.FromRows(DataTable[rows], Columns[name]), 
Table = Table.TransformColumnTypes(Rows, Table.ToList(ColumnsWithType, (c) => { c{0}, c{3}}))
in
Table
in AnalyticsQuery
3.	Connect to excel 
Open Microsoft Excel.
In excel go to the “data” menu in the ribbon, select “get data” and “From other sources” select “blank query”:
 
In the Power query window select “advanced editor”:
 
Replace the text in the advanced editor with the query exported from Log Analytics:
 
Click “done” 
Click “Load and close”
Excel will now execute the query using Log analytics API. The result set will now be available in excel:
 
4.	Refreshing your data
You can refresh your data directly from excel.
To refresh your data click the refresh button from Excel’s “data” group in the ribbon:
 

5.	More resources and additional reading
Read more about Excel’s integrations with external data sources here: https://support.office.com/en-us/article/import-data-from-external-data-sources-power-query-be4330b3-5356-486c-a168-b68e9e616f5a
