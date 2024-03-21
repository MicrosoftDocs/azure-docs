---
title: Develop Microsoft Sentinel Advanced Security Information Model (ASIM) parsers | Microsoft Docs
description: This article explains how to develop, test, and deploy Microsoft Sentinel Advanced Security Information Model (ASIM) parsers.
author: oshezaf
ms.topic: how-to
ms.date: 11/09/2021
ms.author: ofshezaf
--- 

# Develop Advanced Security Information Model (ASIM) parsers (Public preview)

Advanced Security Information Model (ASIM) users use *unifying parsers* instead of table names in their queries, to view data in a normalized format and to include all data relevant to the schema in the query. Unifying parsers, in turn, use *source-specific parsers* to handle the specific details of each source. 

Microsoft Sentinel provides built-in, source-specific parsers for many data sources. You may want to modify, or *develop*, these source-specific parsers in the following situations:

- When your device provides events that fit an ASIM schema, but a source-specific parser for your device and the relevant schema is not available in Microsoft Sentinel.

- When ASIM source-specific parsers are available for your device, but your device sends events in a method or a format different than expected by the ASIM parsers. For example:

  - Your source device may be configured to send events in a non-standard way. 

  - Your device may have a different version than the one supported by the ASIM parser.

  - The events might be collected, modified, and forwarded by an intermediary system.

To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Custom ASIM parser development process

The following workflow describes the high level steps in developing a custom ASIM, source-specific parser:

1. [Collect sample logs](#collect-sample-logs).

1. Identify the schemas or schemas that the events sent from the source represent. For more information, see [Schema overview](normalization-about-schemas.md).

1. [Map](#planning-mapping) the source event fields to the identified schema or schemas. 

1. [Develop](#developing-parsers) one or more ASIM parsers for your source. You'll need to develop a filtering parser and a parameter-less parser for each schema relevant to the source.

1. [Test](#test-parsers) your parser.

1. [Deploy](#deploy-parsers) the parsers into your Microsoft Sentinel workspaces.

1. Update the relevant ASIM unifying parser to reference the new custom parser. For more information, see [Managing ASIM parsers](normalization-manage-parsers.md). 

1. You might also want to [contribute your parsers](#contribute-parsers) to the primary ASIM distribution. Contributed parsers may also be made available in all workspaces as built-in parsers.  

This article guides you through the process's development, testing, and deployment steps.

> [!TIP]
> Also watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the related [slide deck](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM). For more information, see [Next steps](#next-steps).
>

### Collect sample logs

To build effective ASIM parsers, you need a representative set of logs, which in most case will require setting up the source system and connecting it to Microsoft Sentinel. If you do not have the source device available, cloud pay-as-you-go services let you deploy many devices for development and testing.

In addition, finding the vendor documentation and samples for the logs can help accelerate development and reduce mistakes by ensuring broad log format coverage.

A representative set of logs should include:
- Events with different event results.
- Events with different response actions.
- Different formats for username, hostname and IDs, and other fields that require value normalization.

> [!TIP]
> Start a new custom parser using an existing parser for the same schema. Using an existing parser is especially important for filtering parsers to make sure they accept all the parameters required by the schema.
>


## Planning mapping

Before you develop a parser, map the information available in the source event or events to the schema you identified:

- Map all mandatory fields and preferably also recommended fields.
- Try to map any information available from the source to normalized fields. If not available as part of th selected schema, consider mapping to fields available in other schemas.
- Map values for fields at the source to the normalized values allowed by ASIM. The original value is stored in a separate field, such as `EventOriginalResultDetails`. 


## Developing parsers

Develop both a filtering and a parameter-less parser for each relevant schema.

A custom parser is a KQL query developed in the Microsoft Sentinel **Logs** page. The parser query has three parts:

**Filter** > **Parse** > **Prepare fields**


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

> [!IMPORTANT]
> A parser should not filter by time. The query which uses the parser will apply a time range. 

#### Filtering by source type using a Watchlist

In some cases, the event itself does not contain information that would allow filtering for specific source types.

For example, Infoblox DNS events are sent as Syslog messages, and are hard to distinguish from Syslog messages sent from other sources. In such cases, the parser relies on a list of sources that defines the relevant events. This list is maintained in the [**Sources_by_SourceType**](normalization-manage-parsers.md#configure-the-sources-relevant-to-a-source-specific-parser) watchlist.

To use the ASimSourceType watchlist in your parsers, use the `_ASIM_GetSourceBySourceType` function in the parser filtering section. For example, the Infoblox DNS parser includes the following in the filtering section:

```KQL
  | where Computer in (_ASIM_GetSourceBySourceType('InfobloxNIOS'))
```

To use this sample in your parser:

 * Replace `Computer` with the name of the field that includes the source information for your source. You can keep this as `Computer` for any parsers based on Syslog.

 * Replace the `InfobloxNIOS` token with a value of your choice for your parser. Inform parser users that they must update the `ASimSourceType` watchlist using your selected value, as well as the list of sources that send events of this type.

#### Filtering based on parser parameters

When developing [filtering parsers](normalization-about-parsers.md#optimizing-parsing-using-parameters), make sure that your parser accepts the filtering parameters for the relevant schema, as documented in the reference article for that schema. Using an existing parser as a starting point ensures that your parser includes the correct function signature. In most cases, the actual filtering code is also similar for filtering parsers for the same schema.

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
|[parse-kv](/azure/data-explorer/kusto/query/parse-kv-operator)     |     Extracts structured information from a string expression and represents the information in a key/value form.    |
|[parse](/azure/data-explorer/kusto/query/parseoperator)     |    Parse multiple values from an arbitrary string using a pattern, which can be a simplified pattern with better performance, or a regular expression.     |
|[extract_all](/azure/data-explorer/kusto/query/extractallfunction)     | Parse single values from an arbitrary string using a regular expression. `extract_all` has a similar performance to `parse` if the latter uses a regular expression.        |
|[extract](/azure/data-explorer/kusto/query/extractfunction)     |    Extract a single value from an arbitrary string using a regular expression. <br><br>Using `extract` provides better performance than `parse` or `extract_all` if a single value is needed. However, using multiple activations of `extract` over the same source string is less efficient than a single `parse` or `extract_all` and should be avoided.      |
|[parse_json](/azure/data-explorer/kusto/query/parsejsonfunction)  | Parse the values in a string formatted as JSON. If only a few values are needed from the JSON, using `parse`, `extract`, or `extract_all` provides better performance.        |
|[parse_xml](/azure/data-explorer/kusto/query/parse-xmlfunction)     |    Parse the values in a string formatted as XML. If only a few values are needed from the XML, using `parse`, `extract`, or `extract_all` provides better performance.     |


### Normalizing

#### Mapping field names

The simplest form of normalization is renaming an original field to its normalized name. Use the operator `project-rename` for that. Using project-rename ensures that the field is still managed as a physical field and handling the field is more performant. For example:

```KQL
 | project-rename
    ActorUserId = InitiatingProcessAccountSid,
    ActorUserAadId = InitiatingProcessAccountObjectId,
    ActorUserUpn = InitiatingProcessAccountUpn,
``` 

#### Normalizing fields format and type

In many cases, the original value extracted needs to be normalized. For example, in ASIM a MAC address uses colons as separator, while the source may send a hyphen delimited MAC address. The primary operator for transforming values is `extend`, alongside a broad set of KQL string, numerical and date functions.

Also, ensuring that parser output fields matches type defined in the schema is critical for parsers to work.  For example, you may need to convert a string representing date and time to a datetime field. Functions such as `todatetime` and `tohex` are helpful in these cases.

For example, the original unique event ID may be sent as an integer, but ASIM requires the value to be a string, to ensure broad compatibility among data sources. Therefore, when assigning the source field use `extend` and `tostring` instead of `project-rename`:

```KQL
  | extend EventOriginalUid = tostring(ReportId),
```

#### Derived fields and values

The value of the source field, once extracted, may need to be mapped to the set of values specified for the target schema field. The functions `iff`, `case`, and `lookup` can be helpful to map available data to target values.

For example, the Microsoft DNS parser assigns the `EventResult` field based on the Event ID and Response Code using an `iff` statement, as follows:

```KQL
   extend EventResult = iff(EventId==257 and ResponseCode==0 ,'Success','Failure')
```

To map several values, define the mapping using the `datatable` operator and use `lookup` to perform the mapping. For example, some sources report numeric DNS response codes and the network protocol, while the schema mandates the more common text labels representation for both. The following example demonstrates how to derive the needed values using `datatable` and `lookup`:

```KQL
   let NetworkProtocolLookup = datatable(Proto:real, NetworkProtocol:string)[
        6, 'TCP',
        17, 'UDP'
   ];
    let DnsResponseCodeLookup=datatable(DnsResponseCode:int,DnsResponseCodeName:string)[
      0,'NOERROR',
      1,'FORMERR',
      2,'SERVFAIL',
      3,'NXDOMAIN',
      ...
   ];
   ...
   | lookup DnsResponseCodeLookup on DnsResponseCode
   | lookup NetworkProtocolLookup on Proto
```

Notice that lookup is useful and efficient also when the mapping has only two possible values. 

When the mapping conditions are more complex combine `iff`, `case`, and `lookup`. The example below shows how to combine `lookup` and `case`. The `lookup` example above returns an empty value in the field `DnsResponseCodeName` if the lookup value is not found. The `case` example below augments it by using the result of the `lookup` operation if available, and specifying additional conditions otherwise. 

```KQL
   | extend DnsResponseCodeName = 
      case (
        DnsResponseCodeName != "", DnsResponseCodeName,
        DnsResponseCode between (3841 .. 4095), 'Reserved for Private Use',
        'Unassigned'
      )

```

Microsoft Sentinel provides handy functions for common lookup values. For example, the `DnsResponseCodeName` lookup above, can be implemented using one of the following functions:

```KQL

| extend DnsResponseCodeName = _ASIM_LookupDnsResponseCode(DnsResponseCode)

| invoke _ASIM_ResolveDnsResponseCode('DnsResponseCode')
```

The first option accepts as a parameter the value to lookup and let you choose the output field and therefore useful as a general lookup function. The second option is more geared towards parsers, takes as input the name of the source field, and updates the needed ASIM field, in this case `DnsResponseCodeName`.

For a full list of ASIM help functions, refer to [ASIM functions](normalization-functions.md)


#### Enrichment fields

In addition to the fields available from the source, a resulting ASIM event includes enrichment fields that the parser should generate. In many cases, the parsers can assign a constant value to the fields, for example:

```KQL
  | extend                  
     EventCount = int(1),
     EventProduct = 'M365 Defender for Endpoint',
     EventVendor = 'Microsoft',
     EventSchemaVersion = '0.1.0',
     EventSchema = 'ProcessEvent'
```

Another type of enrichment fields that your parsers should set are type fields, which designate the type of the value stored in a related field. For example, the `SrcUsernameType` field designates the type of value stored in the `SrcUsername` field. You can find more information about type fields in the [entities description](normalization-about-schemas.md#entities).

In most cases, types are also assigned a constant value. However, in some cases the type has to be determined based on the actual value, for example:

```KQL
   DomainType = iif (array_length(SplitHostname) > 1, 'FQDN', '')
```

<a name="resolvefqnd"></a>Microsoft Sentinel provides useful functions for handling enrichment. For example, use the following function to automatically assign the fields `SrcHostname`, `SrcDomain`, `SrcDomainType` and `SrcFQDN` based on the value in the field `Computer`. 

```KQL
  | invoke _ASIM_ResolveSrcFQDN('Computer')
```

This function will set the fields as follows:

| Computer field | Output fields |
| -------------- | ------------- | 
| server1 | SrcHostname: server1<br>SrcDomain, SrcDomainType, SrcFQDN all empty |
| server1.microsoft.com | SrcHostname: server1<br>SrcDomain: microsoft.com<br> SrcDomainType: FQDN<br>SrcFQDN:server1.microsoft.com |


The functions `_ASIM_ResolveDstFQDN` and `_ASIM_ResolveDvcFQDN` perform a similar task populating the related `Dst` and `Dvc` fields.For a full list of ASIM help functions, refer to [ASIM functions](normalization-functions.md)

### Select fields in the result set

The parser can optionally select fields in the results set. Removing unneeded fields can improve performance and add clarity by avoiding confusing between normalized fields and remaining source fields.  

The following KQL operators are used to select fields in your results set:

|Operator  | Description  | When to use in a parser  |
|---------|---------|---------|
|**project-away**     |      Removes fields.   | Use `project-away` for specific fields that you want to remove from the result set. We recommend not removing the original fields that are not normalized from the result set, unless they create confusion or are very large and may have performance implications.   |
|**project**     |  Selects fields that existed before, or were created as part of the statement, and removes all other fields.       | Not recommended for use in a parser, as the parser should not remove any other fields that are not normalized. <br><br>If you need to remove specific fields, such as temporary values used during parsing, use `project-away` to remove them from the results.      |

For example, when parsing a custom log table, use the following to remove the remaining original fields that still have a type descriptor:

```KQL
    | project-away
        *_d, *_s, *_b, *_g
``` 

### Handle parsing variants

>[!IMPORTANT]
> The different variants represent *different* event types, commonly mapped to different schemas, develop separate parsers

In many cases, events in an event stream include variants that require different parsing logic. To parse different variants in a single parser either use conditional statements such as `iff` and `case`, or use a union structure.

To use `union` to handle multiple variants, create a separate function for each variant and use the union statement to combine the results:

``` Kusto
let AzureFirewallNetworkRuleLogs = AzureDiagnostics
    | where Category == "AzureFirewallNetworkRule"
    | where isnotempty(msg_s);
let parseLogs = AzureFirewallNetworkRuleLogs
    | where msg_s has_any("TCP", "UDP")
    | parse-where
        msg_s with           networkProtocol:string 
        " request from "     srcIpAddr:string
        ":"                  srcPortNumber:int
    …
    | project-away msg_s;
let parseLogsWithUrls = AzureFirewallNetworkRuleLogs
    | where msg_s has_all ("Url:","ThreatIntel:")
    | parse-where
        msg_s with           networkProtocol:string 
        " request from "     srcIpAddr:string
        " to "               dstIpAddr:string
    …
union parseLogs,  parseLogsWithUrls…
```

To avoid duplicate events and excessive processing, make sure each function starts by filtering, using native fields, only the events that it is intended to parse. Also, if needed, use project-away at each branch, before the union.

## Deploy parsers

Deploy parsers manually by copying them to the Azure Monitor Log page and saving the query as a function. This method is useful for testing. For more information, see [Create a function](../azure-monitor/logs/functions.md).

To deploy a large number of parsers, we recommend using parser ARM templates, as follows:

1. Create a YAML file based on the relevant template for each schema and include your query in it. Start with the [YAML template](https://aka.ms/ASimYamlTemplates) relevant for your schema and parser type, filtering or parameter-less.

1. Use the [ASIM Yaml to ARM template converter](https://aka.ms/ASimYaml2ARM) to convert your YAML file to an ARM template. 

1. If deploying an update, delete older versions of the functions using the portal or the [function delete PowerShell tool](https://aka.ms/ASimDelFunctionScript). 

1. Deploy your template using the [Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md#edit-and-deploy-the-template) or [PowerShell](../azure-resource-manager/templates/deploy-powershell.md).

You can also combine multiple templates to a single deploy process using [linked templates](../azure-resource-manager/templates/linked-templates.md?tabs=azure-powershell#linked-template)

> [!TIP]
> ARM templates can combine different resources, so parsers can be deployed alongside connectors, analytic rules, or watchlists, to name a few useful options. For example, your parser can reference a watchlist deployed alongside it.
> 

## Test parsers

This section describes that testing tools ASIM provides that enables you to test your parsers. That said, parsers are code, sometimes complex, and standard quality assurance practices such as code reviews are recommended in addition to automated testing.

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

| Error | Action |
| ----- | ------ |
| Missing mandatory field [\<Field\>] | Add the field to your parser. In many cases, this would be a derived value or a constant value, and not a field already available from the source. |
| Missing field [\<Field\>] is mandatory when mandatory column [\<Field\>] exists | Add the field to your parser. In many cases this field denotes the types of the existing column it refers to. |
| Missing field [\<Field\>] is mandatory when column [\<Field\>] exists | Add the field to your parser. In many cases this field denotes the types of the existing column it refers to. |
| Missing mandatory alias [\<Field\>] aliasing existing column [\<Field\>] | Add the alias to your parser |
| Missing recommended alias [\<Field\>] aliasing existing column [\<Field\>] | Add the alias to your parser |
| Missing optional alias [\<Field\>] aliasing existing column [\<Field\>] | Add the alias to your parser |
| Missing mandatory alias [\<Field\>] aliasing missing column [\<Field\>] | This error accompanies a similar error for the aliased field. Correct the aliased field error and add this alias to your parser. |
| Type mismatch for field [\<Field\>]. It is currently [\<Type\>] and should be [\<Type\>] | Make sure that the type of normalized field is correct, usually by using a [conversion function](/azure/data-explorer/kusto/query/scalarfunctions#conversion-functions) such as `tostring`. |

| Info | Action |
| ----- | ------ |
| Missing recommended field [\<Field\>] | Consider adding this field to your parser. |

| Info | Action |
| ----- | ------ |
| Missing recommended alias [\<Field\>] aliasing non-existent column [\<Field\>] | If you add the aliased field to the parser, make sure to add this alias as well. |
| Missing optional alias [\<Field\>] aliasing non-existent column [\<Field\>] | If you add the aliased field to the parser, make sure to add this alias as well. |
  Missing optional field [\<Field\>] | While optional fields are often missing, it is worth reviewing the list to determine if any of the optional fields can be mapped from the source. |
| Extra unnormalized field [\<Field\>] | While unnormalized fields are valid, it is worth reviewing the list to determine if any of the unnormalized values can be mapped to an optional field. |

> [!NOTE]
> Errors will prevent content using the parser from working correctly. Warnings will not prevent content from working, but may reduce the quality of the results.
>

### Validate the output values

To make sure that your parser produces valid values, use the ASIM data tester by running the following query in the Microsoft Sentinel **Logs** page:

  ```KQL
  <parser name> | limit <X> | invoke ASimDataTester ('<schema>')
  ```

Specifying a schema is optional. If a schema is not specified, the `EventSchema` field is used to identify the schema the event should adhere to. Ig an event does not include an `EventSchema` field, only common fields will be verified. If a schema is specified as a parameter, this schema will be used to test all records. This is useful for older parsers that do not set the `EventSchema` field. 

> [!NOTE]
> Even when a schema is not specified, empty parentheses are needed after the function name.
>

This test is resource intensive and may not work on your entire data set. Set X to the largest number for which the query will not time out, or set the time range for the query using the time range picker.

Handle the results as follows:

| Message | Action |
| ------- | ------ |
| **(0) Error: type mismatch for column  [\<Field\>]. It is currently [\<Type\>] and should be [\<Type\>]** | Make sure that the type of normalized field is correct, usually by using a [conversion function](/azure/data-explorer/kusto/query/scalarfunctions#conversion-functions) such as `tostring`.  |
| **(0) Error: Invalid value(s) (up to 10 listed) for field [\<Field\>] of type [\<Logical Type\>]** | Make sure that the parser maps the correct source field to the output field. If mapped correctly, update the parser to transform the source value to the correct type, value or format. Refer to the [list of logical types](normalization-about-schemas.md#logical-types) for more information on the correct values and formats for each logical type. <br><br>Note that the testing tool lists only a sample of 10 invalid values.   |
| **(1) Warning: Empty value in mandatory field [\<Field\>]** | Mandatory fields should be populated, not just defined. Check whether the field can be populated from other sources for records for which the current source is empty. |
| **(2) Info: Empty value in recommended field [\<Field\>]** | Recommended fields should usually be populated. Check whether the field can be populated from other sources for records for which the current source is empty. |
| **(2) Info: Empty value in optional field [\<Field\>]** | Check whether the aliased field is mandatory or recommended, and if so, whether it can be populated from other sources. |

Many of the messages also report the number of records which generated the message and their percentage of the total sample. This percentage is a good indicator of the importance of the issue. For example, for a recommended field:
- 90% empty values may indicate a general parsing issue.
- 25% empty values may indicate an event variant that was not parsed correctly.
- A handful of empty values may be a negligible issue.

> [!NOTE]
> Errors will prevent content using the parser from working correctly. Warnings will not prevent content from working, but may reduce the quality of the results.
>

## Contribute parsers

You may want to contribute the parser to the primary ASIM distribution. If accepted, the parsers will be available to every customer as ASIM built-in parsers.

To contribute your parsers:

- Develop both a filtering parser and a parameter-less parser.
- Create a YAML file for the parser as described in [Deploying Parsers](#deploy-parsers) above.
- Make sure that your parsers pass all [testings](#test-parsers) with no errors. If any warnings are left, [document them](#documenting-accepted-warnings) in the parser YAML file.
- Create a pull request against the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel), including:
  - Your parsers YAML files in the ASIM parser folders (`/Parsers/ASim<schema>/Parsers`)
  - Representative sample data according to the [samples submission guidelines](#samples-submission-guidelines).
  - Test results according to the [test results submission guidelines](#test-results-submission-guidelines).

### Documenting accepted warnings

If warnings listed by the ASIM testing tools are considered valid for a parser, document the accepted warnings in parser YAML file using the Exceptions section as shown in the example below.

``` YAML
Exceptions:
- Field: DnsQuery 
  Warning: Invalid value
  Exception: May have values such as "1164-ms-7.1440-9fdc2aab.3b2bd806-978e-11ec-8bb3-aad815b5cd42" which are not valid domains names. Those are related to TKEY RR requests.
- Field: DnsQuery
  Warning: Empty value in mandatory field
  Exception: May be empty for requests for root servers and for requests for RR type DNSKEY
```

The warning specified in the YAML file should be a short form of the warning message uniquely identifying. The value is used to match warning messages when performing automated testings and ignore them.  

### Samples submission guidelines

Sample data is needed when troubleshooting parser issues and for ensuring future updates to the parser conform to older samples. The samples you submit should include any event variant that the parser supports. Make sure that the sample events include all possible event types, event formats and variations such as events representing successful and failed activity. Also make sure that variations in value formats are represented. For example, if a hostname can be represented as an FQDN or a simple hostname, the sample events should include both formats.

To submit the event samples, use the following steps:

- In the `Logs` screen, run a query that will extract from the source table only the events selected by the parser. For example, for the [Infoblox DNS parser](https://github.com/Azure/Azure-Sentinel/blob/master/Parsers/ASimDns/Parsers/ASimDnsInfobloxNIOS.yaml), use the following query:

``` KQL
    Syslog
    | where ProcessName == "named"
```

- Export the results using the **Export to CSV** option to a file named `<EventVendor>_<EventProduct>_<EventSchema>_IngestedLogs.csv`, Where `EventProduct`, `EventProduct`, and `EventSchema` are the values assigned by the parser to those fields.

- In the `Logs` screen, run a query that will output the schema or the parser input table. For example, for the same Infoblox DNS parser, the query is:

``` KQL
    Syslog
    | getschema
```

- Export the results using the **Export to CSV** option to a file named `<TableName>_schema.csv`, where `TableName` is the name of source table the parser uses.

- Include both files in your PR in the folder `/Sample Data/ASIM`. If the file already exists, add your GitHub handle to the name, for example: `<EventVendor>_<EventProduct>_<EventSchema>_SchemaTest_<GitHubHanlde>.csv`

### Test results submission guidelines

Test results are important to verify the correctness of the parser and understand any reported exception. 

To submit your test results, use the following steps:

- Run the parser tests and described in the [testings](#test-parsers) section.

- and export the tests results using the **Export to CSV** option to files named `<EventVendor>_<EventProduct>_<EventSchema>_SchemaTest.csv` and `<EventVendor>_<EventProduct>_<EventSchema>_DataTest.csv` respectively.

- Include both files in your PR in the folder `/Parsers/ASim<schema>/Tests`.


## Next steps

This article discusses developing ASIM parsers.

Learn more about ASIM parsers:

- [ASIM parsers overview](normalization-parsers-overview.md)
- [Use ASIM parsers](normalization-about-parsers.md)
- [Manage  ASIM parsers](normalization-manage-parsers.md)
- [The ASIM parsers list](normalization-parsers-list.md)

Learn more about the ASIM in general: 

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
