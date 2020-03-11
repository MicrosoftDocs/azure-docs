---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 02/27/2020
ms.author: orspodek
---

### Event system properties mapping

> [!Note]
> * System properties are supported for single-record events.
> * For `csv` mapping, properties are added at the beginning of the record. For `json` mapping, properties are added according to the name that appears in the drop-down list.

If you selected **Event system properties** in the **Data Source** section of the table, you must include the following properties in the table schema and mapping.

**Table schema example**

If your data includes three columns (`Timespan`, `Metric`, and `Value`) and the properties you include are `x-opt-enqueued-time` and `x-opt-offset`, create or alter the table schema by using this command:

```kusto
    .create-merge table TestTable (TimeStamp: datetime, Metric: string, Value: int, EventHubEnqueuedTime:datetime, EventHubOffset:string)
```

**CSV mapping example**

Run the following commands to add data to the beginning of the record. Note ordinal values.

```kusto
    .create table TestTable ingestion csv mapping "CsvMapping1"
    '['
    '   { "column" : "Timespan", "Properties":{"Ordinal":"2"}},'
    '   { "column" : "Metric", "Properties":{"Ordinal":"3"}},'
    '   { "column" : "Value", "Properties":{"Ordinal":"4"}},'
    '   { "column" : "EventHubEnqueuedTime", "Properties":{"Ordinal":"0"}},'
    '   { "column" : "EventHubOffset", "Properties":{"Ordinal":"1"}}'
    ']'
```
 
**JSON mapping example**

Data is added by using the system properties names as they appear in the **Data connection** blade **Event system properties** list. Run these commands:

```kusto
    .create table TestTable ingestion json mapping "JsonMapping1"
    '['
    '    { "column" : "Timespan", "Properties":{"Path":"$.timestamp"}},'
    '    { "column" : "Metric", "Properties":{"Path":"$.metric"}},'
    '    { "column" : "Value", "Properties":{"Path":"$.metric_value"}},'
    '    { "column" : "EventHubEnqueuedTime", "Properties":{"Path":"$.x-opt-enqueued-time"}},'
    '    { "column" : "EventHubOffset", "Properties":{"Path":"$.x-opt-offset"}}'
    ']'
```
