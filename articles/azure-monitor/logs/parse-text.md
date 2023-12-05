---
title: Parse text data in Azure Monitor logs | Microsoft Docs
description: This article describes options for parsing log data in Azure Monitor records when the data is ingested and when it's retrieved in a query and compares the relative advantages for each.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 10/20/2021

---

# Parse text data in Azure Monitor logs
Some log data collected by Azure Monitor will include multiple pieces of information in a single property. Parsing this data into multiple properties makes it easier to use in queries. A common example is a [custom log](../agents/data-sources-custom-logs.md) that collects an entire log entry with multiple values into a single property. By creating separate properties for the different values, you can search and aggregate on each one.

This article describes different options for parsing log data in Azure Monitor when the data is ingested and when it's retrieved in a query, comparing the relative advantages for each.

## Permissions required

- To parse data at collection time, you need `Microsoft.Insights/dataCollectionRuleAssociations/*` permissions, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.
- To parse data at query time, you need `Microsoft.OperationalInsights/workspaces/query/*/read` permissions, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example.

## Parsing methods
You can parse data either at ingestion time when the data is collected or at query time when you analyze the data with a query. Each strategy has unique advantages.

### Parse data at collection time
Use [transformations](../essentials/data-collection-transformations.md) to parse data at collection time and define which columns to send the parsed data to. 

**Advantages:**

- Easier to query the collected data because you don't need to include parse commands in the query.
- Better query performance because the query doesn't need to perform parsing.

**Disadvantages:**

- Must be defined in advance. Can't include data that's already been collected.
- If you change the parsing logic, it will only apply to new data.
- Increases latency time for collecting data.
- Errors can be difficult to handle.

### Parse data at query time
When you parse data at query time, you include logic in your query to parse data into multiple fields. The actual table itself isn't modified.

**Advantages:**

- Applies to any data, including data that's already been collected.
- Changes in logic can be applied immediately to all data.
- Flexible parsing options, including predefined logic for particular data structures.

**Disadvantages:**

- Requires more complex queries. This drawback can be mitigated by using [functions to simulate a table](#use-a-function-to-simulate-a-table).
- Must replicate parsing logic in multiple queries. Can share some logic through functions.
- Can create overhead when you run complex logic against very large record sets (billions of records).

## Parse data as it's collected
For more information on parsing data as it's collected, see [Structure of transformation in Azure Monitor](../essentials/data-collection-transformations-structure.md). This approach creates custom properties in the table that can be used by queries like any other property.

## Parse data in a query by using patterns
When the data you want to parse can be identified by a pattern repeated across records, you can use different operators in the [Kusto Query Language](/azure/kusto/query/) to extract the specific piece of data into one or more new properties.

### Simple text patterns

Use the [parse](/azure/kusto/query/parseoperator) operator in your query to create one or more custom properties that can be extracted from a string expression. You specify the pattern to be identified and the names of the properties to create. This approach is useful for data with key-value strings with a form similar to `key=value`.

Consider a custom log with data in the following format:

```
Time=2018-03-10 01:34:36 Event Code=207 Status=Success Message=Client 05a26a97-272a-4bc9-8f64-269d154b0e39 connected
Time=2018-03-10 01:33:33 Event Code=208 Status=Warning Message=Client ec53d95c-1c88-41ae-8174-92104212de5d disconnected
Time=2018-03-10 01:35:44 Event Code=209 Status=Success Message=Transaction 10d65890-b003-48f8-9cfc-9c74b51189c8 succeeded
Time=2018-03-10 01:38:22 Event Code=302 Status=Error Message=Application could not connect to database
Time=2018-03-10 01:31:34 Event Code=303 Status=Error Message=Application lost connection to database
```

The following query would parse this data into individual properties. The line with `project` is added to only return the calculated properties and not `RawData`, which is the single property that holds the entire entry from the custom log.

```Kusto
MyCustomLog_CL
| parse RawData with * "Time=" EventTime " Event Code=" Code " Status=" Status " Message=" Message
| project EventTime, Code, Status, Message
```

This example breaks out the user name of a UPN in the `AzureActivity` table.

```Kusto
AzureActivity
| parse  Caller with UPNUserPart "@" * 
| where UPNUserPart != "" //Remove non UPN callers (apps, SPNs, etc)
| distinct UPNUserPart, Caller
```

### Regular expressions
If your data can be identified with a regular expression, you can use [functions that use regular expressions](/azure/kusto/query/re2) to extract individual values. The following example uses [extract](/azure/kusto/query/extractfunction) to break out the `UPN` field from `AzureActivity` records and then return distinct users.

```Kusto
AzureActivity
| extend UPNUserPart = extract("([a-z.]*)@", 1, Caller) 
| distinct UPNUserPart, Caller
```

To enable efficient parsing at large scale, Azure Monitor uses the re2 version of Regular Expressions, which is similar but not identical to some of the other regular expression variants. For more information, see the [re2 expression syntax](https://aka.ms/kql_re2syntax).

## Parse delimited data in a query
Delimited data separates fields with a common character, like a comma in a CSV file. Use the [split](/azure/kusto/query/splitfunction) function to parse delimited data by using a delimiter that you specify. You can use this approach with the [extend](/azure/kusto/query/extendoperator) operator to return all fields in the data or to specify individual fields to be included in the output.

> [!NOTE]
> Because split returns a dynamic object, the results might need to be explicitly cast to data types, such as string to be used in operators and filters.

Consider a custom log with data in the following CSV format:

```
2018-03-10 01:34:36, 207,Success,Client 05a26a97-272a-4bc9-8f64-269d154b0e39 connected
2018-03-10 01:33:33, 208,Warning,Client ec53d95c-1c88-41ae-8174-92104212de5d disconnected
2018-03-10 01:35:44, 209,Success,Transaction 10d65890-b003-48f8-9cfc-9c74b51189c8 succeeded
2018-03-10 01:38:22, 302,Error,Application could not connect to database
2018-03-10 01:31:34, 303,Error,Application lost connection to database
```

The following query would parse this data and summarize by two of the calculated properties. The first line splits the `RawData` property into a string array. Each of the next lines gives a name to individual properties and adds them to the output by using functions to convert them to the appropriate data type.

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
If your data is formatted in a known structure, you might be able to use one of the functions in the [Kusto Query Language](/azure/kusto/query/) for parsing predefined structures:

- [JSON](/azure/kusto/query/parsejsonfunction)
- [XML](/azure/kusto/query/parse-xmlfunction)
- [IPv4](/azure/kusto/query/parse-ipv4function)
- [URL](/azure/kusto/query/parseurlfunction)
- [URL query](/azure/kusto/query/parseurlqueryfunction)
- [File path](/azure/kusto/query/parsepathfunction)
- [User agent](/azure/kusto/query/parse-useragentfunction)
- [Version string](/azure/kusto/query/parse-versionfunction)

The following example query parses the `Properties` field of the `AzureActivity` table, which is structured in JSON. It saves the results to a dynamic property called `parsedProp`, which includes the individual named value in the JSON. These values are used to filter and summarize the query results.

```Kusto
AzureActivity
| extend parsedProp = parse_json(Properties) 
| where parsedProp.isComplianceCheck == "True" 
| summarize count() by ResourceGroup, tostring(parsedProp.tags.businessowner)
```

These parsing functions can be processor intensive. Only use them when your query uses multiple properties from the formatted data. Otherwise, simple pattern matching processing is faster.

The following example shows the breakdown of the domain controller `TGT Preauth` type. The type exists only in the `EventData` field, which is an XML string. No other data from this field is needed. In this case, [parse](/azure/kusto/query/parseoperator) is used to pick out the required piece of data.

```Kusto
SecurityEvent
| where EventID == 4768
| parse EventData with * 'PreAuthType">' PreAuthType '</Data>' * 
| summarize count() by PreAuthType
```

## Use a function to simulate a table
You might have multiple queries that perform the same parsing of a particular table. In this case, [create a function](../logs/functions.md) that returns the parsed data instead of replicating the parsing logic in each query. You can then use the function alias in place of the original table in other queries.

Consider the preceding comma-delimited custom log example. To use the parsed data in multiple queries, create a function by using the following query and save it with the alias `MyCustomCSVLog`.

```Kusto
MyCustomCSVLog_CL
| extend CSVFields = split(RawData, ',')
| extend DateTime  = tostring(CSVFields[0])
| extend Code      = toint(CSVFields[1]) 
| extend Status    = tostring(CSVFields[2]) 
| extend Message   = tostring(CSVFields[3]) 
```

You can now use the alias `MyCustomCSVLog` in place of the actual table name in queries like the following example:

```Kusto
MyCustomCSVLog
| summarize count() by Status,Code
```

## Next steps
Learn about [log queries](./log-query-overview.md) to analyze the data collected from data sources and solutions.