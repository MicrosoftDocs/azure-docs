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

With time parameters, you can set the time context of analysis, which is used by almost all reports. Time parameters are relatively simple to set up and use. You can use them to specify the time ranges to show in the dropdown. You also have an option for custom time ranges.

## Create a time parameter

1. Start with an empty workbook in edit mode.
1. Select **Add parameters** from the links within the workbook.
1. Select the **Add Parameter** button.
1. In the new parameter pane that opens, enter:
    1. **Parameter name**: `TimeRange`
    1. **Parameter type**: `Time range picker`
    1. **Required**: `checked`
    1. **Available time ranges**: `Last hour`, `Last 12 hours`, `Last 24 hours`, `Last 48 hours`, `Last 3 days`, `Last 7 days`, and `Allow custom time range selection`.
1. Select **Save** on the toolbar to create the parameter.

    :::image type="content" source="media/workbooks-time/time-settings.png" alt-text="Screenshot that shows the creation of a time range parameter.":::

The workbook in read mode:

:::image type="content" source="media/workbooks-time/parameters-time.png" alt-text="Screenshot that shows a time range parameter in read mode.":::

## Reference a time parameter

Review the time parameter options.

### Via bindings

1. Add a query control to the workbook and select an Application Insights resource.
1. Most workbook controls support a **Time Range** scope picker. Open the **Time Range** dropdown and select the `{TimeRange}` in the **Time Range Parameters** group at the bottom:

   * This control binds the time range parameter to the time range of the chart.
   * The time scope of the sample query is now **Last 24 hours**.

1. Run the query to see the results.

    :::image type="content" source="media/workbooks-time/time-binding.png" alt-text="Screenshot that shows a time range parameter referenced via bindings.":::

### In KQL

1. Add a query control to the workbook and select an Application Insights resource.
1. In the KQL, enter a time scope filter by using the parameter `| where timestamp {TimeRange}`:

   * This parameter expands on the query evaluation time to `| where timestamp > ago(1d)`.
   * This option is the time range value of the parameter.

1. Run the query to see the results.

    :::image type="content" source="media/workbooks-time/time-in-code.png" alt-text="Screenshot that shows a time range referenced in KQL.":::

### In text

1. Add a text control to the workbook.
1. In the Markdown, enter `The chosen time range is {TimeRange:label}`.
1. Select **Done Editing**.
1. The text control shows the text *The chosen time range is Last 24 hours*.

## Time parameter options

| Parameter | Description | Example |
| ------------- |:-------------|:-------------|
| `{TimeRange}` | Time range label | Last 24 hours |
| `{TimeRange:label}` | Time range label | Last 24 hours |
| `{TimeRange:value}` | Time range value | > ago (1d) |
| `{TimeRange:query}` | Time range query | > ago (1d) |
| `{TimeRange:start}` | Time range start time | 3/20/2019 4:18 PM |
| `{TimeRange:end}` | Time range end time | 3/21/2019 4:18 PM |
| `{TimeRange:grain}` | Time range grain | 30 m |

### Use parameter options in a query

```kusto
requests
| make-series Requests = count() default = 0 on timestamp from {TimeRange:start} to {TimeRange:end} step {TimeRange:grain}
```

## Next steps

 - [Getting started with Azure Workbooks](workbooks-getting-started.md).
