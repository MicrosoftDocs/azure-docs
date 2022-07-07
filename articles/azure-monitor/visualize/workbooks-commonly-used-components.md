---
title: Sample Azure Workbooks components
description: See sample Azure workbook components
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 07/05/2022
ms.reviewer: gardnerjr 
---

# Common Workbook use cases
This article includes commonly used Azure Workbook components and instructions for how to implement them.

## Traffic light icons

You may want to summarize status using a simple visual indication instead of presenting the full range of data values. For example, you may want to categorize your computers by CPU utilization as Cold/Warm/Hot or categorize performance as satisfied/tolerating/frustrated. You can do this by showing an indicator or icon representing the status next to the underlying metric. 

:::image type="content" source="media/workbooks-samples/workbooks-traffic-light-sample.png" alt-text="Screenshot showing a grid with traffic light status using thresholds.":::

The example below shows how do setup a traffic light icon per computer based on the CPU utilization metric.

1. [Create a new empty workbook](workbooks-create-workbook.md).
1. [Add a parameters](workbooks-create-workbook.md#add-a-parameter-to-an-azure-workbook), make it a [time range parameter](workbooks-time.md), and name it **TimeRange**.
1. Select **Add query** to add a log query control to the workbook. 
1. Select the `log` query type, a `Log Analytics' resource type, and a Log Analytics workspace in your subscription that has VM performance data as a resource.
1. In the Query editor, enter:
    ```
    Perf
    | where ObjectName == 'Processor' and CounterName == '% Processor Time'
    | summarize Cpu = percentile(CounterValue, 95) by Computer
    | join kind = inner (Perf
        | where ObjectName == 'Processor' and CounterName == '% Processor Time'
        | make-series Trend = percentile(CounterValue, 95) default = 0 on TimeGenerated from {TimeRange:start} to {TimeRange:end} step {TimeRange:grain} by Computer
        ) on Computer
    | project-away Computer1, TimeGenerated
    | order by Cpu desc
    ```
1. Set the visualization to `Grid`.
1. Select **Column Settings**.
1. In the **Columns** section:
    - _Cpu -_ Column renderer: `Thresholds`, Custom number formatting: `checked`, Units: `Percentage`, Threshold settings (last two need to be in order):
        - Icon: `Success`, Operator: `Default`
        - Icon: `Critical`, Operator: `>`, Value: `80`
        - Icon: `Warning`, Operator: `>`, Value: `60`
    - _Trend -_ Column renderer: `Spark line`, Color paletter: `Green to Red`, Minimum value: `60`, Maximum value: `80`
9. Select **Save and Close** to commit changes.

:::image type="content" source="media/workbooks-samples/workbooks-traffic-light-settings.png" alt-text="Screenshot showing the creation of a grid with traffic light icons.":::


You can also pin this grid to a dashboard using the **Pin to dashboard** button in toolbar. The pinned grid automatically binds to the time range in the dashboard.

:::image type="content" source="media/workbooks-samples/workbooks-traffic-light-pinned.png" alt-text="Screenshot showing a grid with traffic light status using thresholds pinned to a dashboard.":::

## Capturing input to use in a query

You may want to capture user input using drop-down lists and use the selection in your queries. For example, you can have a drop-down to accept a set of virtual machines and then filter your KQL to include just the selected machines. In most cases, this is as simple as including the parameter's value in the query: 

```sql
    Perf
    | where Computer in ({Computers})
    | take 5
```

In more advanced scenarios, you may need to transform the parameter results before they can be used in queries. Take this OData filter payload:

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'Android' or OSFamily eq 'OS X') and (ComplianceState eq 'Compliant')"
}
```

The following example shows how to enable this scenario: Let's say you want the values of the `OSFamily` and `ComplianceState` filters to come from drop-downs in the workbook. The filter could include multiple values as in the `OsFamily` case above. It needs to also support the case where the user wants to include all dimension values, that is to say, with no filters.

### Setup parameters

1. Create a new empty workbook and [add a parameter component](workbooks-create-workbook.md#add-a-parameter-to-an-azure-workbook).
1. Select **Add parameter** to create a new parameter. Use the following settings:
    - Parameter name: `OsFilter`
    - Display name: `Operating system`
    - Parameter type: `drop-down`
    - Allow multiple selections: `Checked`
    - Delimiter: `or` (with spaces before and after)
    - Quote with: `<empty>`
    - Get data from: `JSON`
    - Json Input
        ```json
        [
            { "value": "OSFamily eq 'Android'", "label": "Android" },
            { "value": "OSFamily eq 'OS X'", "label": "OS X" }
        ]
        ```
    - In the **Include in the drop-down** section:
        - Select **All**
        - Select All Value: `OSFamily ne '#@?'`
    - Use the `Save` button in the toolbar to save this parameter. 
1. Add another parameter with these settings:
    - Parameter name: `ComplianceStateFilter`
    - Display name: `Complaince State`
    - Parameter type: `drop-down`
    - Allow multiple selections: `Checked`
    - Delimiter: `or` (with spaces before and after)
    - Quote with: `<empty>`
    - Get data from: `JSON`
    - Json Input
        ```json
        [
            { "value": "ComplianceState eq 'Compliant'", "label": "Compliant" },
            { "value": "ComplianceState eq 'Non-compliant'", "label": "Non compliant" }
        ]        
        ```
    - In the **Include in the drop-down** section:
        - Select **All**
        - Select All Value: `ComplianceState ne '#@?'`
    - Use the `Save` button in the toolbar to save this parameter. 

1. Use one of the `Add text` links to add a text block. In the `Markdown text to display` block, add:
    ```json
    {
        "name": "deviceComplianceTrend",
        "filter": "({OsFilter}) and ({ComplianceStateFilter})"
    }
    ```
    We will use this block to see the results of parameter selections.


This screenshot shows the parameter settings:
:::image type="content" source="media/workbooks-samples/workbooks-odata-parameters-settings.png" alt-text="Screenshot showing parameter settings for drop-down lists with parameter values.":::

### Single Filter Value
The simplest case is the selection of a single filter value in each of the dimensions. The drop-down control uses Json input field's value as the parameter's value.

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X') and (ComplianceState eq 'Compliant')"
}
```

:::image type="content" source="media/workbooks-samples/workbooks-odata-parameters-single-select.png" alt-text="Screenshot showing a drop-down lists with parameter values and a single value selected.":::

### Multiple Filter Values
If the user chooses multiple filter values (e.g. both Android and OS X operating systems), then parameters `Delimiter` and `Quote with` settings kicks in and produces this compound filter:

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X' or OSFamily eq 'Android') and (ComplianceState eq 'Compliant')"
}
```

:::image type="content" source="media/workbooks-samples/workbooks-odata-parameters-multi-select.png" alt-text="Screenshot showing a drop-down lists with parameter values and multiple values selected.":::

### No Filter Case
Another common case is having no filter for that dimension. This is equivalent to including all values of the dimensions as part of the result set. The way to enable it is by having an `All` option on the drop-down and have it return a filter expression that always evaluates to `true` (e.g. _ComplianceState eq '#@?'_).

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X' or OSFamily eq 'Android') and (ComplianceState ne '#@?')"
}
```
:::image type="content" source="media/workbooks-samples/workbooks-odata-parameters-no-select.png" alt-text="Screenshot showing a drop-down lists with parameter values and no filter selected.":::

