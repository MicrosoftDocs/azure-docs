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
> * For `csv` mapping, properties are added at the beginning of the record. For `json` mapping, properties are added to according to name that appears in drop-down list.

If you selected **Event system properties** in the **Data Source** section of the table above you need to include these properties in table schema and mapping.

**Table schema example**
If your data include 3 columns: `Timespan`, `Metric` and `Value`, And the properties you would like to include are `x-opt-enqueued-time` and `x-opt-offset`. Create or alter table schema as follows:

```kusto
    .create-merge table TestTable (TimeStamp: datetime, Metric: string, Value: int, EventHubEnqueuedTime:datetime, EventHubOffset:string)
```

**CSV mapping example**
Data is added to the begining of the record, notice ordinal values:

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
Data is added with system properties names, as they appear on the connection creation properties list:

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
