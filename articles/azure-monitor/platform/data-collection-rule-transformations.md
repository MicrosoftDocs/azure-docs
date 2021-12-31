---
title: Data Collection Rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/19/2021
ms.custom: references_region

---

# Data collection rule transformations
[Data collection rules (DCR)](data-collection-rule-overview.md)  in Azure Monitor allow you to filter and transform data before its stored in a Log Analytics workspace. This article describes the features and limitations of Kusto Query Language (KQL) used to write data transformations in DCRs to custom logs and Microsoft-provided tables.

## Basic concepts
Transformations are applied to each log entry individually. The input stream is represented by a virtual table, named *source*. The columns of the table as per input data stream definition in *streamDeclarations* section of the Data Collection Rule.

## Example
Following is a typical example of a transformation. This example filters the incoming data, adds a new column, and then modifies an existing column. 

```kusto
source
// Filter statements. Any records not matching the filter are discarded.
| where severity == "Critical"
// Parse columns containing JSON
| extend Properties = parse_json(properties)
// Form the output columns before storing in workspace.
| project
    TimeGenerated = todatetime(["time"]),
    Category = category,
    StatusDescription = StatusDescription,
    EventName = name,
    EventId = tostring(Properties.EventId)
```


## KQL limitations
Since the transformation is applied to each record individually, they can't use any KQL operators that act on multiple records. For example, [summarize](/azure/data-explorer/kusto/query/summarizeoperator) isn't supported since it summarizes multiple records. See [Supported KQL features](#supported-kql-features) for a complete list of supported features.

### Inline reference table
The [datatable](/azure/data-explorer/kusto/query/datatableoperator?pivots=azuremonitor) operator that would normally be used in KQL to define an inline query-time table is not supported in the subset of KQL available to use in transformations. Instead, use dynamic literals to work around this limitation.

For example, the following is not supported in a transformation:


```kusto
let galaxy = datatable (country:string,entity:string)['ES','Spain','US','United States'];
source
| join kind=inner (galaxy) on $left.Location == $right.country
| extend Galaxy_CF = ['entity']
```

Use the following which is supported and performs the same functionality:

```kusto
let galaxyDictionary = parsejson('{"ES": "Spain","US": "United States"}');
source
| extend Galaxy_CF = galaxyDictionary[Location]
```

### has operator
Transformations do not currently support [has](/azure/data-explorer/kusto/query/contains-operator). Use contains which is supported and performs similar functionality.


### Handling dynamic data
Since the properties of type [dynamic](/azure/data-explorer/kusto/query/scalar-data-types/dynamic) are not supported in the input stream schema, care should be taken when handling strings containing JSON. 

Consider the following input:

```json
{
    "TimeGenerated" : "2021-11-07T09:13:06.570354Z",
    "Message": "Houston, we have a problem",
    "AdditionalContext": {
        "Level": 2,
        "DeviceID": "apollo13"
    }
}
```

In order to access the properties within *AdditionalContext*, it should be defined as string-typed column in the input stream:

```json
"columns": [
    {
        "name": "TimeGenerated",
        "type": "datetime"
    },
    {
        "name": "Message",
        "type": "string"
    }, 
    {
        "name": "AdditionalContext",
        "type": "string"
    }
]
```

The content of *AdditionalContext* column now could be parsed and used within KQL transformation:

```kusto
source
| extend parsedAdditionalContext = parse_json(AdditionalContext)
| extend Level = toint (parsedAdditionalContext.Level)
| extend DeviceId = tostring(parsedAdditionalContext.DeviceID)
```



## Supported KQL features




## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.
