---
title: Parse text data in Azure Monitor logs | Microsoft Docs
description: Describes different options for parsing log data in Azure Monitor records when the data is ingested and when it's retrieved in a query, comparing the relative advantages for each.
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn
ms.service: log-analytics
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/04/2018
ms.author: bwren
---

# Parse text data in Azure Monitor logs
Some log data collected by Azure Monitor will include multiple pieces of information in a single property. Parsing this data into multiple properties make it easier to use in queries. A common example is a [custom log](../../log-analytics/log-analytics-data-sources-custom-logs.md) that collects an entire log entry with multiple values into a single property. By creating separate properties for the different values, you can search and aggregate on each.

This article describes different options for parsing log data in Azure Monitor when the data is ingested and when it's retrieved in a query, comparing the relative advantages for each.


## Parsing methods
You can parse data either at ingestion time when the data is collected or at query time when analyzing the data with a query. Each strategy has unique advantages as described below.

### Parse data at collection time
When you parse data at collection time, you configure [Custom Fields](../../log-analytics/log-analytics-custom-fields.md) that create new properties in the table. Queries don't have to include any parsing logic and simply use these properties as any other field in the table.

Advantages to this method include the following:

- Easier to query the collected data since you don't need to include parse commands in the query.
- Better query performance since the query doesn't need to perform parsing.
 
Disadvantages to this method include the following:

- Must be defined in advance. Can't include data that's already been collected.
- If you change the parsing logic, it will only apply to new data.
- Fewer parsing options than available in queries.
- Increases latency time for collecting data.
- Errors can be difficult to handle.


### Parse data at query time
When you parse data at query time, you include logic in your query to parse data into multiple fields. The actual table itself isn't modified.

Advantages to this method include the following:

- Applies to any data, including data that's already been collected.
- Changes in logic can be applied immediately to all data.
- Flexible parsing options including predefined logic for particular data structures.
 
Disadvantages to this method include the following:

- Requires more complex queries. This can be mitigated by using [functions to simulate a table](#use-function-to-simulate-a-table).
- Must replicate parsing logic in multiple queries. Can share some logic through functions.
- Can create overhead when running complex logic against very large record sets (billions of records).

## Parse data as it's collected
See [Create custom fields in Azure Monitor](../platform/custom-fields.md) for details on parsing data as it's collected. This creates custom properties in the table that can be used by queries just like any other property.

## Parse data in query using patterns
When the data you want to parse can be identified by a pattern repeated across records, you can use different operators in the [Kusto query language](/azure/kusto/query/) to extract the specific piece of data into one or more new properties.

### Simple text patterns

Use the [parse](/azure/kusto/query/parseoperator) operator in your query to create one or more custom properties that can be extracted from a string expression. You specify the pattern to be identified and the names of the properties to create. This is particularly useful for data with key-value strings with a form similar to _key=value_.

Consider a custom log with data in the following format.

```
Time=2018-03-10 01:34:36 Event Code=207 Status=Success Message=Client 05a26a97-272a-4bc9-8f64-269d154b0e39 connected
Time=2018-03-10 01:33:33 Event Code=208 Status=Warning Message=Client ec53d95c-1c88-41ae-8174-92104212de5d disconnected
Time=2018-03-10 01:35:44 Event Code=209 Status=Success Message=Transaction 10d65890-b003-48f8-9cfc-9c74b51189c8 succeeded
Time=2018-03-10 01:38:22 Event Code=302 Status=Error Message=Application could not connect to database
Time=2018-03-10 01:31:34 Event Code=303 Status=Error Message=Application lost connection to database
```

The following query would parse this data into individual properties. The line with _project_ is added to only return the calculated properties and not _RawData_, which is the single property holding the entire entry from the custom log.

```Kusto
MyCustomLog_CL
| parse RawData with * "Time=" EventTime " Event Code=" Code " Status=" Status " Message=" Message
| project EventTime, Code, Status, Message
```

Following is another example that breaks out the user name of a UPN in the _AzureActivity_ table.

```Kusto
AzureActivity
| parse  Caller with UPNUserPart "@" * 
| where UPNUserPart != "" //Remove non UPN callers (apps, SPNs, etc)
| distinct UPNUserPart, Caller
```


### Regular expressions
If your data can be identified with a regular expression, you can use [functions that use regular expressions](/azure/kusto/query/re2) to extract individual values. The following example uses [extract](/azure/kusto/query/extractfunction) to break out the _UPN_ field from _AzureActivity_ records and then return distinct users.

```Kusto
AzureActivity
| extend UPNUserPart = extract("([a-z.]*)@", 1, Caller) 
| distinct UPNUserPart, Caller
```

To enable efficient parsing at large scale, Azure Monitor uses re2 version of Regular Expressions, which is similar but not identical to some of the other regular expression variants. Refer to the [re2 expression syntax](https://aka.ms/kql_re2syntax) for details.


## Parse delimited data in a query
Delimited data separates fields with a common character such as a comma in a CSV file. Use the [split](/azure/kusto/query/splitfunction) function to parse delimited data using a delimiter that you specify. You can use this with [extend](/azure/kusto/query/extendoperator) operator to return all fields in the data or to specify individual fields to be included in the output.

> [!NOTE]
> Since split returns a dynamic object, the results may need to be explicitly cast to data types such as string to be used in operators and filters.

Consider a custom log with data in the following CSV format.

```
2018-03-10 01:34:36, 207,Success,Client 05a26a97-272a-4bc9-8f64-269d154b0e39 connected
2018-03-10 01:33:33, 208,Warning,Client ec53d95c-1c88-41ae-8174-92104212de5d disconnected
2018-03-10 01:35:44, 209,Success,Transaction 10d65890-b003-48f8-9cfc-9c74b51189c8 succeeded
2018-03-10 01:38:22, 302,Error,Application could not connect to database
2018-03-10 01:31:34, 303,Error,Application lost connection to database
```

The following query would parse this data and summarize by two of the calculated properties. The first line splits the  _RawData_ property into a string array. Each of the next lines gives a name to individual properties and adds them to the output using functions to convert them to the appropriate data type.

```Kusto
MyCustomCSVLog_CL
| extend CSVFields  = split(RawData, ',')
| extend EventTime  = todatetime(CSVFields[0])
| extend Code       = toint(CSVFields[1]) 
| extend Status     = tostring(CSVFields[2]) 
| extend Message    = tostring(CSVFields[3]) 
| where getyear(EventTime) == 2018
| summarize count() by Status,Code
```

## Parse predefined structures in a query
If your data is formatted in a known structure, you may be able to use one of the functions in the [Kusto query language](/azure/kusto/query/) for parsing predefined structures:

- [JSON](/azure/kusto/query/parsejsonfunction)
- [XML](/azure/kusto/query/parse-xmlfunction)
- [IPv4](/azure/kusto/query/parse-ipv4function)
- [URL](/azure/kusto/query/parseurlfunction)
- [URL query](/azure/kusto/query/parseurlqueryfunction)
- [File path](/azure/kusto/query/parsepathfunction)
- [User agent](/azure/kusto/query/parse-useragentfunction)
- [Version string](/azure/kusto/query/parse-versionfunction)

The following example query parses the _Properties_ field of the _AzureActivity_ table, which is structured in JSON. It saves the results to a dynamic property called _parsedProp_, which includes the individual named value in the JSON. These values are used to filter and summarize the query results.

```Kusto
AzureActivity
| extend parsedProp = parse_json(Properties) 
| where parsedProp.isComplianceCheck == "True" 
| summarize count() by ResourceGroup, tostring(parsedProp.tags.businessowner)
```

These parsing functions can be processor intensive, so they should be used only when your query uses multiple properties from the formatted data. Otherwise, simple pattern matching processing will be faster.

The following example shows the breakdown of domain controller TGT Preauth type. The type exists only in the EventData field, which is an XML string, but no other data from this field is needed. In this case, [parse](/azure/kusto/query/parseoperator) is used to pick out the required piece of data.

```Kusto
SecurityEvent
| where EventID == 4768
| parse EventData with * 'PreAuthType">' PreAuthType '</Data>' * 
| summarize count() by PreAuthType
```

## Use function to simulate a table
You may have multiple queries that perform the same parsing of a particular table. In this case, [create a function](functions.md) that returns the parsed data instead of replicating the parsing logic in each query. You can then use the function alias in place of the original table in other queries.

Consider the comma-delimited custom log example above. In order to use the parsed data in multiple queries, create a function using the following query and save it with the alias _MyCustomCSVLog_.

```Kusto
MyCustomCSVLog_CL
| extend CSVFields = split(RawData, ',')
| extend DateTime  = tostring(CSVFields[0])
| extend Code      = toint(CSVFields[1]) 
| extend Status    = tostring(CSVFields[2]) 
| extend Message   = tostring(CSVFields[3]) 
```

You can now use the alias _MyCustomCSVLog_ in place of the actual table name in queries like the following.

```Kusto
MyCustomCSVLog
| summarize count() by Status,Code
```


## Next steps
* Learn about [log queries](log-query-overview.md) to analyze the data collected from data sources and solutions.