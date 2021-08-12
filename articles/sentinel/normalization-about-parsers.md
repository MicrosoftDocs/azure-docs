---
title: Azure Sentinel Information Model (ASIM) Parsers | Microsoft Docs
description: This article explains how to use KQL functions as query timem parsers to implement the Azure Sentinel Infomration Model (ASIM)
services: sentinel
cloud: na
documentationcenter: na
author: ofshezaf
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/11/2021
ms.author: oshezaf

--- 

# Azure Sentinel Information Model (ASIM) Parsers

In Azure Sentinel, parsing and [normalizing](normalization.md) happens at query time. Parsers are built as [KQL user-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) that transform data in existing tables, such as **CommonSecurityLog**, custom logs tables, or Syslog, into the normalized schema. Once the parser is saved as a workspace function, it can be used like any other Azure Sentinel table.

## Source agnostic and source specific parsers

ASIM includes  two levels of parsers: **source-agnostic** and **source-specific** parsers:

- A **source-agnostic parser** combines all the sources normalized to the same schema and can be used to query all of them using normalized fields. The source agnostic parser name is `im<schema>`, where `<schema>` stands for the specific schema it serves.

    For example, the following query uses the source-agnostic DNS parser to query DNS events using the `ResponseCodeName`, `SrcIpAddr`, and `TimeGenerated` normalized fields:

    ```kusto
    imDns
      | where isnotempty(ResponseCodeName)
      | where ResponseCodeName =~ "NXDOMAIN"
      | summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
    ```

    A source-agnostic parser can combine several source-specific normalized parsers using the `union` KQL operator. The name of a source-specific normalized parser is `vim<schema><vendor><product>`. Therefore, the `imDns` parser looks as follows:

    ```kusto
    union isfuzzy=true
    vimDnsEmpty,
    vimDnsCiscoUmbrella,
    vimDnsInfobloxNIOS,
    vimDnsMicrosoftOMS
    ```

- Adding **source-specific** normalized parsers to the source-agnostic parser enables you to include custom sources in built-in queries that use the source agnostic parsers.

    Source-specific parsers enable you to get immediate value from built-in content, such as analytics, workbooks, insights for your custom data.

    The source-specific parsers can also be used independently. For example, in an Infoblox-specific workbook, use the `vimDnsInfobloxNIOS` parser.

## Writing parsers

A parser is a KQL query saved as a workspace function. Once saved, it can be used like built-in tables. The parser query includes the following parts:

**Filter** > **Parse** > **Prepare fields**

### Filtering

In many cases, a table includes multiple types of events. For example:
* The Syslog table has data from multiple sources.
* Custom tables may include information from a single source that provides more than one event type and can fit various schemas.

Therefore, a parser should first filter only the records that are relevant to the target schema.

Filtering in KQL is done using the `where` operator. For example, **Sysmon event 1** reports process creation and should be normalized to the **ProcessEvent** schema. The **Sysmon event 1** event is part of the `Event` table, and the following filter should be used:

```kusto
Event | where Source == "Microsoft-Windows-Sysmon" and EventID == 1
```

To ensure the performance of the parser, note the following filtering recommendations:

-	Always filter on built-in rather than parsed fields. While it's sometimes easier to filter using parsed fields, it has a dramatic impact on performance.
-	Use operators that provide optimized performance. In particular, `==`, `has`, and `startswith`. Using operators such as `contains` or `matches regex` also dramatically impacts performance.

Filtering recommendations for performance may not always be trivial to follow. For example, using `has` is less accurate than `contains`. In other cases, matching the built-in field, such as `SyslogMessage`, is less accurate than comparing an extracted field, such as `DvcAction`. In such cases, we recommend that you still pre-filter using a performance-optimizing operator over a built-in field, and repeat the filter using more accurate conditions after parsing.

For an example, see to the following [Infoblox DNS](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASimDns/ARM/Infoblox) parser snippet. The parser first checks that the SyslogMessage field `has` the word `client`. However, the term might be used in a different place in the message. Therefore, after parsing the `Log_Type` field, the parser checks again that the word `client` was indeed the field's value.

```kusto
Syslog | where ProcessName == "named" and SyslogMessage has "client"
…
      | extend Log_Type = tostring(Parser[1]),
      | where Log_Type == "client"
```

> [!NOTE]
> Parsers should not filter by time, as the query that's using the parser filters for time.
> 

<a name=parsing></a>### Parsing

Once the query selects the relevant records, it may need to parse them. Typically, parsing is needed if much of the event information is conveyed in a single text field.

The KQL operators that perform parsing are listed below, ordered by their performance optimization. The first provides the most optimized performance, while the last provides the least optimized performance.

|Operator  |Description  |
|---------|---------|
|[split](/azure/data-explorer/kusto/query/splitfunction)     |    Parse a string of values delimited by a delimiter     |
|[parse_csv](/azure/data-explorer/kusto/query/parsecsvfunction)     |     Parse a string of values formatted as a CSV (comma-separated values) line.    |
|[parse](/azure/data-explorer/kusto/query/parseoperator)     |    Parse multiple values from an arbitrary string using a pattern, which can be a simplified pattern with better performance, or a regular expression.     |
|[extract_all](/azure/data-explorer/kusto/query/extractallfunction)     | Parse single values from an arbitrary string using a regular expression. `extract_all` has a similar performance to `parse` if the latter uses a regular expression.        |
|[extract](/azure/data-explorer/kusto/query/extractfunction)     |    Extract a single value from an arbitrary string using a regular expression. <br><br>Using `extract` provides better performance than `parse` or `extract_all` if a single value is needed. However, using multiple activations of `extract` over the same source string is significantly less efficient than a single `parse` or `extract_all` and should be avoided.      |
|[parse_json](/azure/data-explorer/kusto/query/parsejsonfunction)  | Parse the values in a string formatted as JSON. If only a few values are needed from the JSON, using `parse`, `extract`, or `extract_all` provides better performance.        |
|[parse_xml](/azure/data-explorer/kusto/query/parse-xmlfunction)     |    Parse the values in a string formatted as XML. If only a few values are needed from the XML, using `parse`, `extract`, or `extract_all` provides better performance.     |

<br>

In addition to parsing string, the parsing phase may require more processing of the original values, including:

- **Formatting and type conversion**. The source field, once extracted, may need to be formatted to fit the target schema field. For example, you may need to convert a string representing date and time to a datetime field.     Functions such as `todatetime` and `tohex` are helpful in these cases.

- **Value lookup**. The value of the source field, once extracted, may need to be mapped to the set of values specified for the target schema field. For example, some sources report numeric DNS response codes, while the schema mandates the more common text response codes. For mapping a small number of values, the functions `iff` and `case` can be useful.

    For example, the Microsoft DNS parser assigns the `EventResult` field based on the Event ID and Response Code using an `iff` statement, as follows:

    ```kusto
    extend EventResult = iff(EventId==257 and ResponseCode==0 ,'Success','Failure')
    ```

    For several values, use `datatable` and `lookup`, as demonstrated in the same DNS parser:

    ```kusto
    let RCodeTable = datatable(ResponseCode:int,ResponseCodeName:string) [ 0, 'NOERROR', 1, 'FORMERR'....];
    ...
     | lookup RCodeTable on ResponseCode
     | extend EventResultDetails = case (
         isnotempty(ResponseCodeName), ResponseCodeName, 
         ResponseCode between (3841 .. 4095), 'Reserved for Private Use', 
         'Unassigned')
    ```

> [!NOTE]
> The transformation does not allow using only `lookup`, as multiple values are mapped to `Reserved for Private Use`, `Unassigned` and therefore the query uses both lookup and case. 
> Even so, the query is still much more efficient than using `case` for all values.
>

### Prepare fields in the result set

The parser has to prepare the fields in the result set to ensure that the normalized fields are used. As a guideline, original fields that are not normalized should not be removed from the result set unless there is a compelling reason to do so, such as if they create confusion.

The following KQL operators are used to prepare fields:

|Operator  | Description  | When to use in a parser  |
|---------|---------|---------|
|**extend**     | Creates calculated fields and adds them to the record        |  `Extend` is used if the normalized fields are parsed or transformed from the original data. For more information, see the example in the [Parsing](#parsing) section above.     |
|**project-rename**     | Renames fields        |     If a field exists in the original event and only needs to be renamed, use `project-rename`. <br><br>The renamed field still behaves like a built-in field, and operations on the field have much better performance.   |
|**project-away**     |      Removes fields.   |Use `project-away` for specific fields that you want to remove from the result set.         |
|**project**     |  Selects fields that were either existing before, or were created as part of the statement. Removes all other fields.       | Not recommended for use in a parser, as the parser should not remove any other fields that are not normalized. <br><br>If you need to remove specific fields, such as temporary values used during parsing, use `project-away` to remove them from the results.      |

<br>

## Handle parsing variants

In many cases, events in an event stream include variants that require different parsing logic. 

It's often tempting to build a parser from different subparsers, each handling another variant of the events that needs different parsing logic. Those subparsers, each a query by itself, are then unified using the `union` operator. This approach, while convenient, is *not* recommended as it significantly impacts the performance of the parser.

When handling variants, use the following guidelines:

|Scenario  |Handling  |
|---------|---------|
|The different variants represent *different* event types, commonly mapped to different schemas     |  Use separate parsers       |
|The different variants represent the *same* event type, but are structured differently.     |   If the variants are known, such as when there is a method to differentiate between the events before parsing, use the `case` operator to select the correct `extract_all` to run and field mapping, as demonstrated in the [Infoblox DNS parser](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASimDns/ARM/Infoblox).      |
|If `union` is unavoidable     |  When using `union` is unavoidable, make sure to use the following guidelines:<br><br>-	Pre-filter using built-in fields in each one of the subqueries. <br>-	Ensure that the filters are mutually exclusive. <br>-	Consider not parsing less critical information, reducing the number of subqueries.       |

<br>

## Deploy parsers

Deploy parsers manually by copying them to the Azure Monitor **Log** page and saving your change. This method is useful for testing. For more information, see [Create a function](../azure-monitor/logs/functions.md).

However, to deploy a large number of parsers, we recommend that you use an ARM template. For example, you may want to use an ARM template when deploying a complete normalization solution that includes a source-agnostic parser and several source-specific parsers, or when deploying multiple parsers for different schemas for a source.

For more information, see the [generic parser ARM template](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/ARM-Templates/ParserQuery). Use this template as a starting point and deploy your parser by pasting it in at the relevant point during the template deployment process. For example, see the [DNS parsers ARM template](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASimDns/ARM).

> [!TIP]
> ARM templates can include different resources, so your parsers can be deployed alongside connectors, analytic rules, or watchlists, to name a few useful options. For example, your parser can reference a watchlist that will be deployed alongside it.
>


## Next steps

This article discusses the Azure Sentinel Information Model (ASIM) parsers.

For more information, see:

- [Azure Sentinel Information Model overview](normalization.md)
- [Azure Sentinel Information Model schemas](normalization-about-schemas.md)
- [Azure Sentinel Information Model content](normalization-content.md)