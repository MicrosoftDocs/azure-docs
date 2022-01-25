---
title: Develop Microsoft Sentinel Advanced SIEM Information Model (ASIM) parsers | Microsoft Docs
description: This article explains how to develop, test, and deploy Microsoft Sentinel Advanced SIEM Information Model (ASIM) parsers.
author: oshezaf
ms.topic: how-to
ms.date: 11/09/2021
ms.author: ofshezaf
--- 

# Develop Advanced SIEM Information Model (ASIM) parsers (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Advanced SIEM Information Model (ASIM) users use *unifying parsers* instead of table names in their queries, to view data in a normalized format and to include all data relevant to the schema in the query. Unifying parsers, in turn, use *source-specific parsers* to handle the specific details of each source. 

Microsoft Sentinel provides built-in, source-specific parsers for many data sources. You may want to modify, or *develop*, these source-specific parsers in the following situations:

- When your device provides events that fit an ASIM schema, but a source-specific parser for your device and the relevant schema is not available in Microsoft Sentinel.

- When ASIM source-specific parsers are available for your device, but your device sends events in a method or a format different than expected by the ASIM parsers. For example:

  - Your source device may be configured to send events in a non-standard way. 

  - Your device may have a different version than the one supported by the ASIM parser.

  - The events might be collected, modified, and forwarded by an intermediary system.

To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Custom parser development process

The following workflow describe the high level steps in developing a custom ASIM, source-specific parser:

1. Identify the schemas or schemas that the events sent from the source represent. For more information, see [Schema overview](normalization-about-schemas.md).

1. [Develop](#developing-parsers) one or more ASIM parsers for your source. You'll need to develop a parser for each schema relevant to the source.

1. [Test](#test-parsers) your parser.

1. [Deploy](#deploy-parsers) the parsers into your Microsoft Sentinel workspaces.

1. Update the relevant ASIM unifying parser to reference the new custom parser. For more information, see [Managing ASIM parsers](normalization-manage-parsers.md). 

This article guides you through the process's development, testing, and deployment steps.

> [!TIP]
> Also watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the related [slide deck](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM). For more information, see [Next steps](#next-steps).
>


## Developing parsers

A custom parser is a KQL query developed in the Microsoft Sentinel **Logs** page. The parser query has three parts:

**Filter** > **Parse** > **Prepare fields**

### Prerequisites

To develop a custom ASIM parser, you must have access to a workspace that stores relevant events.

> [!TIP]
> Start a new custom parser using an existing parser for the same schema. Using an existing parser is especially important for filtering parsers to make sure they accept all the parameters required by the schema.
>


### Filtering

#### Filtering the relevant records

In many cases, a table in Microsoft Sentinel includes multiple types of events. For example:
* The Syslog table has data from multiple sources.
* Custom tables may include information from a single source that provides more than one event type and can fit various schemas.

Therefore, a parser should first filter only the records relevant to the target schema.

Filtering in KQL is done using the `where` operator. For example, **Sysmon event 1** reports process creation, and is therefore normalized to the **ProcessEvent** schema. The **Sysmon event 1** event is part of the `Event` table, so you would use the following filter:

```kusto
Event | where Source == "Microsoft-Windows-Sysmon" and EventID == 1
```

#### Filtering based on parser parameters

When developing [filtering parsers](normalization-about-parsers.md#optimized-parsers), make sure that your parser accepts the filtering parameters for the relevant schema, as documented in the reference article for that schema. Using an existing parser as a starting point ensures that your parser includes the correct function signature. In most cases, the actual filtering code is also similar for filtering parsers for the same schema.

When filtering, make sure that you:

- **Filter before parsing using physical fields**. If the filtered results are not accurate enough, repeat the test after parsing to fine-tune your results. For more information, see [filtering optimization](#optimization).
 - **Do not filter if the parameter is not defined and still has the default value**. 
  
The following examples show how to implement filtering for a string parameter, where the default value is usually '\*', and for a list parameter, where the default value is usually an empty list.

``` kusto
srcipaddr=='*' or ClientIP==srcipaddr
array_length(domain_has_any) == 0 or Name has_any (domain_has_any)
```

#### <a name="optimization"></a>Filtering optimization


To ensure the performance of the parser, note the following filtering recommendations:

- **Always filter on built-in rather than parsed fields**. While it is sometimes easier to filter using parsed fields, it dramatically impacts performance.
- **Use operators that provide optimized performance**. In particular, `==`, `has`, and `startswith`. Using operators such as `contains` or `matches regex` also dramatically impacts performance.

Filtering recommendations for performance may not always be easy to follow. For example, using `has` is less accurate than `contains`. In other cases, matching the built-in field, such as `SyslogMessage`, is less accurate than comparing an extracted field, such as `DvcAction`. In such cases, we recommend that you still pre-filter using a performance-optimizing operator over a built-in field and repeat the filter using more accurate conditions after parsing.

For an example, see the following [Infoblox DNS](https://aka.ms/AzSentinelInfobloxParser) parser snippet. The parser first checks that the SyslogMessage field `has` the word `client`. However, the term might be used in a different place in the message, so after parsing the `Log_Type` field, the parser checks again that the word `client` was indeed the field's value.

```kusto
Syslog | where ProcessName == "named" and SyslogMessage has "client"
…
      | extend Log_Type = tostring(Parser[1]),
      | where Log_Type == "client"
```

> [!NOTE]
> Parsers should not filter by time, as the query using the parser already filters for time.
>

### Parsing

Once the query selects the relevant records, it may need to parse them. Typically, parsing is needed if multiple event fields are conveyed in a single text field.

The KQL operators that perform parsing are listed below, ordered by their performance optimization. The first provides the most optimized performance, while the last provides the least optimized performance.

|Operator  |Description  |
|---------|---------|
|[split](/azure/data-explorer/kusto/query/splitfunction)     |    Parse a string of delimited values.     |
|[parse_csv](/azure/data-explorer/kusto/query/parsecsvfunction)     |     Parse a string of values formatted as a CSV (comma-separated values) line.    |
|[parse](/azure/data-explorer/kusto/query/parseoperator)     |    Parse multiple values from an arbitrary string using a pattern, which can be a simplified pattern with better performance, or a regular expression.     |
|[extract_all](/azure/data-explorer/kusto/query/extractallfunction)     | Parse single values from an arbitrary string using a regular expression. `extract_all` has a similar performance to `parse` if the latter uses a regular expression.        |
|[extract](/azure/data-explorer/kusto/query/extractfunction)     |    Extract a single value from an arbitrary string using a regular expression. <br><br>Using `extract` provides better performance than `parse` or `extract_all` if a single value is needed. However, using multiple activations of `extract` over the same source string is less efficient than a single `parse` or `extract_all` and should be avoided.      |
|[parse_json](/azure/data-explorer/kusto/query/parsejsonfunction)  | Parse the values in a string formatted as JSON. If only a few values are needed from the JSON, using `parse`, `extract`, or `extract_all` provides better performance.        |
|[parse_xml](/azure/data-explorer/kusto/query/parse-xmlfunction)     |    Parse the values in a string formatted as XML. If only a few values are needed from the XML, using `parse`, `extract`, or `extract_all` provides better performance.     |
| | |

In addition to parsing string, the parsing phase may require more processing of the original values, including:

- **Formatting and type conversion**. The source field, once extracted, may need to be formatted to fit the target schema field. For example, you may need to convert a string representing date and time to a datetime field.     Functions such as `todatetime` and `tohex` are helpful in these cases.

- **Value lookup**. The value of the source field, once extracted, may need to be mapped to the set of values specified for the target schema field. For example, some sources report numeric DNS response codes, while the schema mandates the more common text response codes. The functions `iff` and `case` can be helpful to map a few values.

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
> The transformation does not allow using only `lookup`, as multiple values are mapped to `Reserved for Private Use` or  `Unassigned`, and therefore the query uses both lookup and case.
> Even so, the query is still much more efficient than using `case` for all values.
>

### Prepare fields in the result set

The parser must prepare the fields in the results set to ensure that the normalized fields are used. 

>[!NOTE]
> We recommend that you do not remove any of the original fields that are not normalized from the result set, unless there is a compelling reason to do so, such as if they create confusion.
>

The following KQL operators are used to prepare fields in your results set:

|Operator  | Description  | When to use in a parser  |
|---------|---------|---------|
|**extend**     | Creates calculated fields and adds them to the record.        |  `Extend` is used if the normalized fields are parsed or transformed from the original data. <br><br>For more information, see the example in the [Parsing](#parsing) section above. |
|**project-rename**     | Renames fields.        |     If a field exists in the actual event and only needs to be renamed, use `project-rename`. <br><br>The renamed field still behaves like a built-in field, and operations on the field have much better performance.   |
|**project-away**     |      Removes fields.   |Use `project-away` for specific fields that you want to remove from the result set.         |
|**project**     |  Selects fields that existed before, or were created as part of the statement, and removes all other fields.       | Not recommended for use in a parser, as the parser should not remove any other fields that are not normalized. <br><br>If you need to remove specific fields, such as temporary values used during parsing, use `project-away` to remove them from the results.      |
| | | |

### Handle parsing variants

In many cases, events in an event stream include variants that require different parsing logic.

It is often tempting to build a parser from different subparsers, each handling another event variant that needs different parsing logic. Those subparsers, each a query by itself, are then unified using the `union` operator. This approach, while convenient, is *not* recommended as it significantly impacts the performance of the parser.

When handling variants, use the following guidelines:

|Scenario  |Handling  |
|---------|---------|
|The different variants represent *different* event types, commonly mapped to different schemas     |  Use separate parsers.      |
|The different variants represent the *same* event type but are structured differently.     |   If the variants are known, such as when there is a method to differentiate between the events before parsing, use the `case` operator to select the correct `extract_all` to run and field mapping. <br><br>Example: [Infoblox DNS parser](https://aka.ms/AzSentinelInfobloxParser)    |
|`union` is unavoidable     |  When you must use `union`, make sure to use the following guidelines:<br><br>-  Pre-filter using built-in fields in each one of the subqueries. <br>- Ensure that the filters are mutually exclusive. <br>- Consider not parsing less critical information, reducing the number of subqueries.       |
| | |


## Deploy parsers

Deploy parsers manually by copying them to the Azure Monitor Log page and saving your change. This method is useful for testing. For more information, see [Create a function](../azure-monitor/logs/functions.md).

To deploy a large number of parsers, we recommend using parser ARM templates, as follows:

1. Create a YAML file based on the relevant template for each schema and include your query in it. Start with the [YAML template](https://aka.ms/ASimYamlTemplates) relevant for your schema and parser type, filtering or parameter-less.

1. Use the [ASIM Yaml to ARM template converter](https://aka.ms/ASimYaml2ARM) to convert your YAML file to an ARM template. 

1. Deploy your template using the [Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md#edit-and-deploy-the-template) or [PowerShell](../azure-resource-manager/templates/deploy-powershell.md).

You can also combine multiple templates to a single deploy process using [linked templates](../azure-resource-manager/templates/linked-templates.md?tabs=azure-powershell#linked-template)

> [!TIP]
> ARM templates can combine different resources, so parsers can be deployed alongside connectors, analytic rules, or watchlists, to name a few useful options. For example, your parser can reference a watchlist deployed alongside it.
> 

## Test parsers

### Install ASIM testing tools

To test ASIM, [deploy the ASIM testing tool](https://aka.ms/ASimTestingTools) to a Microsoft Sentinel workspace where:
- Your parser is deployed.
- The source table used by the parser is available.
- The source table used by the parser is populated with a varied collection of relevant events.

### Validate the output schema

To make sure that your parser produces a valid schema, use the ASIM schema tester by running the following query in the Microsoft Sentinel **Logs** page:

  ```KQL
  <parser name> | getschema | invoke ASimSchemaTester('<schema>')
  ```

Handle the results as follows:

| Message | Action |
| ------- | ------ |
| **(0) Error: Missing mandatory field [\<Field\>]** | Add this field to your parser. In many cases, this would be a derived value or a constant value, and not a field already available from the source. |
| **(0) Error: Missing mandatory alias [\<Field\>] aliasing existing column [\<Field\>]** | Add this alias to your parser. |
| **(0) Error: Missing mandatory alias [\<Field\>] aliasing missing column [\<Field\>]** | This error accompanies a similar error for the aliased field. Correct the aliased field error and add this alias to your parser. |
| **(0) Error: Missing recommended alias [\<Field\>] aliasing existing column [\<Field\>]** | Add this alias to your parser. |
| **(0) Error: Missing optional alias [\<Field\>] aliasing existing column [\<Field\>]** | Add this alias to your parser. |
| **(0) Error: type mismatch for field [\<Field\>]. It is currently [\<Type\>] and should be [\<Type\>]** | Make sure that the type of normalized field is correct, usually by using a [conversion function](/azure/data-explorer/kusto/query/scalarfunctions#conversion-functions) such as `tostring`. |
| **(1) Warning: Missing recommended field [\<Field\>]** | Consider adding this field to your parser. |
| **(1) Warning: Missing recommended alias [\<Field\>] aliasing non-existent column [\<Field\>]** | If you add the aliased field to the parser, make sure to add this alias as well. |
| **(1) Warning: Missing optional alias [\<Field\>] aliasing non-existent column [\<Field\>]** | If you add the aliased field to the parser, make sure to add this alias as well. |
| **(2) Info: Missing optional field [\<Field\>]** | While optional fields are often missing, it is worth reviewing the list to determine if any of the optional fields can be mapped from the source. |
| **(2) Info: extra unnormalized field [\<Field\>]** | While unnormalized fields are valid, it is worth reviewing the list to determine if any of the unnormalized values can be mapped to an optional field. |
|||

> [!NOTE]
> Errors will prevent content using the parser from working correctly. Warnings will not prevent content from working, but may reduce the quality of the results.
>

### Validate the output values

To make sure that your parser produces valid values, use the ASIM data tester by running the following query in the Microsoft Sentinel **Logs** page:

  ```KQL
  <parser name> | limit <X> | invoke ASimDataTester('<schema>')
  ```

This test is resource intensive and may not work on your entire data set. Set X to the largest number for which the query will not timeout, or set the time range for the query using the time range picker.

Handle the results as follows:

| Message | Action |
| ------- | ------ |
| **(0) Error: type mismatch for column  [\<Field\>]. It is currently [\<Type\>] and should be [\<Type\>]** | Make sure that the type of normalized field is correct, usually by using a [conversion function](/azure/data-explorer/kusto/query/scalarfunctions#conversion-functions) such as `tostring`.  |
| **(0) Error: Invalid value(s) (up to 10 listed) for field [\<Field\>] of type [\<Logical Type\>]** | Make sure that the parser maps the correct source field to the output field. If mapped correctly, update the parser to transform the source value to the correct type, value or format. Refer to the [list of logical types](normalization-about-schemas.md#logical-types) for more information on the correct values and formats for each logical type. <br><br>Note that the testing tool lists only a sample of 10 invalid values.   |
| **(0) Error: Empty value in mandatory field [\<Field\>]** | Mandatory fields should be populated, not just defined. Check whether the field can be populated from other sources for records for which the current source is empty. |
| **(1) Error: Empty value in recommended field [\<Field\>]** | Recommended fields should usually be populated. Check whether the field can be populated from other sources for records for which the current source is empty. |
| **(1) Error: Empty value in alias [\<Field\>]** | Check whether the aliased field is mandatory or recommended, and if so, whether it can be populated from other sources. |
|||


> [!NOTE]
> Errors will prevent content using the parser from working correctly. Warnings will not prevent content from working, but may reduce the quality of the results.
>


### Check for incomplete parsing

Check that fields are populated:
- A field that is rarely or never populated may indicate incorrect parsing. 
- A field that is usually populated but not always may indicate less common variants of the event are not parsed correctly.

You can use the following query to test how sparsely populated each field is. 

```KQL
<parser name>
| where TimeGenerated > ago(<time period>)
| project p = pack_all()
| mv-expand f = p
| project f
| extend key = tostring(bag_keys(f)[0])
| summarize total=count(), empty=countif(strlen(f[key]) == 0) by key
| extend sparseness = todouble(empty)/todouble(total)
| sort by sparseness desc
``` 

Set the time period to the longest that performance will allow.

## <a name="next-steps"></a>Next steps

This article discusses developing ASIM parsers.

Learn more about ASIM parsers:

- [ASIM parsers overview](normalization-parsers-overview.md)
- [Use ASIM parsers](normalization-about-parsers.md)
- [Manage  ASIM parsers](normalization-manage-parsers.md)

Learn more about the ASIM in general: 

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced SIEM Information Model (ASIM) overview](normalization.md)
- [Advanced SIEM Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced SIEM Information Model (ASIM) content](normalization-content.md)