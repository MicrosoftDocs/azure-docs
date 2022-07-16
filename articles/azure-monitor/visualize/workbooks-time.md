---
title: Azure Monitor workbooks time parameters 
description: Learn how to set time parameters to allow users to set the time context of analysis. The time parameters are used by almost all reports.
services: azure-monitor
manager: carmonm

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/05/2022
---

# Workbook time parameters

Time parameters allow users to set the time context of analysis and is used by almost all reports. It is relatively simple to setup and use - allowing authors to specify the time ranges to show in the drop-down, including the option for custom time ranges. 

## Create a time parameter

1. Start with an empty workbook in edit mode.
1. Choose **Add parameters** from the links within the workbook.
1. Select **Add Parameter**.
1. In the new parameter pane that pops up enter:
    - Parameter name: `TimeRange`
    - Parameter type: `Time range picker`
    - Required: `checked`
    - Available time ranges: Last hour, Last 12 hours, Last 24 hours, Last 48 hours, Last 3 days, Last 7 days and Allow custom time range selection
1. Select **Save** to create the parameter.

    :::image type="content" source="media/workbooks-time/time-settings.png" alt-text="Screenshot showing the creation of a workbooks time range parameter.":::

This is what the workbook looks like in read-mode.

:::image type="content" source="media/workbooks-time/parameters-time.png" alt-text="Screenshot showing a time range parameter in read mode.":::

## Referencing a time parameter
### Referencing a time parameter with bindings

1. Add a query control to the workbook and select an Application Insights resource.
1. Most workbook controls support a _Time Range_ scope picker. Open the _Time Range_ drop-down and select the `{TimeRange}` in the time range parameters group at the bottom.
1. This binds the time range parameter to the time range of the chart. The time scope of the sample query is now Last 24 hours.
1. Run query to see the results

    :::image type="content" source="media/workbooks-time/time-binding.png" alt-text="Screenshot showing a workbooks time range parameter referenced via bindings.":::

### Referencing a time parameter with KQL

1. Add a query control to the workbook and select an Application Insights resource.
2. In the KQL, enter a time scope filter using the parameter: `| where timestamp {TimeRange}`
3. This expands on query evaluation time to `| where timestamp > ago(1d)`, which is the time range value of the parameter.
4. Run query to see the results

    :::image type="content" source="media/workbooks-time/time-in-code.png" alt-text="Screenshot showing a time range referenced in KQL.":::

### Referencing a time parameter in text 

1. Add a text control to the workbook.
2. In the markdown, enter `The chosen time range is {TimeRange:label}`
3. Choose _Done Editing_
4. The text control will show text: _The chosen time range is Last 24 hours_

## Time parameter options

| Parameter | Explanation | Example |
| ------------- |:-------------|:-------------|
| `{TimeRange}` | Time range label | Last 24 hours |
| `{TimeRange:label}` | Time range label | Last 24 hours |
| `{TimeRange:value}` | Time range value | > ago(1d) |
| `{TimeRange:query}` | Time range query | > ago(1d) |
| `{TimeRange:start}` | Time range start time | 3/20/2019 4:18 PM |
| `{TimeRange:end}` | Time range end time | 3/21/2019 4:18 PM |
| `{TimeRange:grain}` | Time range grain | 30 m |


### Using parameter options in a query

```kusto
requests
| make-series Requests = count() default = 0 on timestamp from {TimeRange:start} to {TimeRange:end} step {TimeRange:grain}
```

## Next steps

 - [Getting started with Azure Workbooks](workbooks-getting-started.md).
