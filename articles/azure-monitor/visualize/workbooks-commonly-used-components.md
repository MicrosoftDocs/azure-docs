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

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-sample.png" alt-text="Screenshot showing a grid with traffic light status using thresholds.":::

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
    - _Trend -_ Column renderer: `Spark line`, Color palette: `Green to Red`, Minimum value: `60`, Maximum value: `80`
9. Select **Save and Close** to commit changes.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-settings.png" alt-text="Screenshot showing the creation of a grid with traffic light icons.":::


You can also pin this grid to a dashboard using the **Pin to dashboard** button in toolbar. The pinned grid automatically binds to the time range in the dashboard.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-pinned.png" alt-text="Screenshot showing a grid with traffic light status using thresholds pinned to a dashboard.":::

## Capturing user input to use in a query

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

1. [Create a new empty workbook](workbooks-create-workbook.md) and [add a parameter component](workbooks-create-workbook.md#add-a-parameter-to-an-azure-workbook).
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
    - Select **Save** in the toolbar to save this parameter. 
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
    - Select **Save** in the toolbar to save this parameter. 

1. Select **Add text** to add a text block. In the `Markdown text to display` block, add:
    ```json
    {
        "name": "deviceComplianceTrend",
        "filter": "({OsFilter}) and ({ComplianceStateFilter})"
    }
    ```
   
   This screenshot shows the parameter settings:

   :::image type="content" source="media/workbooks-commonly-used-components/workbooks-odata-parameters-settings.png" alt-text="Screenshot showing parameter settings for drop-down lists with parameter values.":::

### Single Filter Value
The simplest case is the selection of a single filter value in each of the dimensions. The drop-down control uses Json input field's value as the parameter's value.

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X') and (ComplianceState eq 'Compliant')"
}
```

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-odata-parameters-single-select.png" alt-text="Screenshot showing a drop-down list with parameter values and a single value selected.":::

### Multiple Filter Values
If the user chooses multiple filter values (e.g. both Android and OS X operating systems), then parameters `Delimiter` and `Quote with` settings kicks in and produces this compound filter:

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X' or OSFamily eq 'Android') and (ComplianceState eq 'Compliant')"
}
```

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-odata-parameters-multi-select.png" alt-text="Screenshot showing a drop-down list with parameter values and multiple values selected.":::

### No Filter Case
Another common case is having no filter for that dimension. This is equivalent to including all values of the dimensions as part of the result set. The way to enable it is by having an `All` option on the drop-down and have it return a filter expression that always evaluates to `true` (e.g. _ComplianceState eq '#@?'_).

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X' or OSFamily eq 'Android') and (ComplianceState ne '#@?')"
}
```
:::image type="content" source="media/workbooks-commonly-used-components/workbooks-odata-parameters-no-select.png" alt-text="Screenshot showing a drop-down list with parameter values and no filter selected.":::

## Reusing query data in different visualizations

There are times where you want to visualize the underlying data set in different ways without having to pay the cost of the query each time. This sample shows you how to do so using the `Merge` option in the query control.

### Set up the parameters

1. [Create a new empty workbook](workbooks-create-workbook.md).
1. Select **Add query** to create a query control, and enter these values:
    - Data source: `Logs`
    - Resource type: `Log Analytics`
    - Log Analytics workspace: _Pick one of your workspaces that has performance data_
    - Log Analytics workspace Logs Query
        ```sql
        Perf
        | where CounterName == '% Processor Time'
        | summarize CpuAverage = avg(CounterValue), CpuP95 = percentile(CounterValue, 95) by Computer
        | order by CpuAverage desc
        ```
1. Select **Run Query** to see the results. 
   
   This is the result data set that we want to reuse in multiple visualizations.
 
    :::image type="content" source="media/workbooks-commonly-used-components/workbooks-reuse-data-resultset.png" alt-text="Screenshot showing the result of a workbooks query." lightbox="media/workbooks-commonly-used-components/workbooks-reuse-data-resultset.png":::

1. Go to the `Advanced settings` tab, and in the name, enter `Cpu data`. 
1. Select **Add query** to create another query control.
1. For the **Data source**, select `Merge`.
1. Select **Add Merge**.
1. In the settings pop-up, set:
    - Merge Type: `Duplicate table`
    - Table: `Cpu data`
1. Select **Run Merge** in the toolbar. You will get the same result as above:
    
   :::image type="content" source="media/workbooks-commonly-used-components/workbooks-reuse-data-duplicate.png" alt-text=" Screenshot showing duplicate query results in a workbook." lightbox="media/workbooks-commonly-used-components/workbooks-reuse-data-duplicate.png":::

1. Set the table options:
    - Use the `Name After Merge` column to set friendly names for your result columns. For example, you can rename `CpuAverage` to `CPU utilization (avg)`, and then use the `Run Merge` button to update the result set.
    - Use the `Delete` button to remove a column.
        - Select the `[Cpu data].CpuP95 row
        - Use the `Delete` button in the query control toolbar.
        - Use the `Run Merge` button to see the result set without the CpuP95 column
1. Change the order of the columns using the `Move up` or `Move down` buttons in the toolbar.
1. Add new columns based on values of other columns using the `Add new item` button in the toolbar.
1. Style the table using the options in the `Column settings` to get the visualization you want.
1. Add more query controls working against the `Cpu data` result set if needed.

Here is an example that shows Average and P95 CPU utilization side by side.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-reuse-data-two-controls.png" alt-text="Screenshot showing two workbook controls using the same query." lightbox="media/workbooks-commonly-used-components/workbooks-reuse-data-two-controls.png":::  

##  Using Azure Resource Manager (ARM) to retrieve alerts in a subscription

This sample shows you how to use the Azure Resource Manager query control to list all existing alerts in a subscription. This guide will also use JSON Path transformations to format the results. See the [list of supported ARM calls](/rest/api/azure/).
### Set up the parameters

1. [Create a new empty workbook](workbooks-create-workbook.md).
1. Select **Add parameter**, and use the following settings:
    - Parameter name: `Subscription`
    - Parameter type: `Subscription picker`
    - Required: `Checked`
    - Get data from: `Default Subscriptions`
1. Select **Save**. 
1. Select **Add query** to create a query control,and use these settings. For this example, we are using the [Alerts Get All REST call](/rest/api/monitor/alertsmanagement/alerts/getall) to get a list of existing alerts for a subscription. See the [Azure REST API Reference](/rest/api/azure/) for supported api-versions.
    - Data source: `Azure Resource Manager (Preview)`
    - Http Method: `GET`
    - Path: `/subscriptions/{Subscription:id}/providers/Microsoft.AlertsManagement/alerts`
    - Add the api-version parameter in the `Parameters` tab
    - Parameter: `api-version`
    - Value: `2018-05-05`        
1. Select a subscription from the created subscription parameter and select **Run Query** to see the results.

   This is the raw JSON returned from Azure Resource Manager (ARM).

   :::image type="content" source="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-no-formatting.png" alt-text="Screenshot showing an alert data JSON response in workbooks using an ARM provider." lightbox="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-no-formatting.png":::

### Format the response

You may be satisfied with the information here. However, let us extract some interesting properties and format the response in an easy to read way.

1. Go to the **Result settings** tab.
1. Switch the Result Format from `Content` to `JSON Path`. [JSON path](workbooks-jsonpath.md) is a Workbook transformer.
1. In the JSON Path settings, set the JSON Path Table to `$.value.[*].properties.essentials`. This extracts all "value.*.properties.essentials" fields from the returned JSON.
1. Select **Run Query** to see the grid.

  :::image type="content" source="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-grid.png" alt-text="Screenshot showing alert data in a workbook in grid format using an ARM provider." lightbox="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-grid.png":::

### Filter the results

JSON Path also allows you to pick and choose information from the generated table to show as columns. 

For example, if you would like to filter the results to these columns: `TargetResource`, `Severity`, `AlertState`, `Description`, `AlertRule`, `StartTime`, `ResolvedTime`, you could add the following rows in the columns table in JSON Path:

| Column ID | Column JSON Path |
| :------------- | :----------: |
| TargetResource | $.targetResource |
| Severity | $.severity |
| AlertState | $.alertState |
| AlertRule | $.alertRule |
| Description | $.description |
| StartTime  | $.startDateTime |
| ResolvedTime  | $.monitorConditionResolvedDateTime |

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-final.png" alt-text="Screenshot showing the final query results in grid format using an ARM provider." lightbox="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-final.png":::

## Next steps
- [Getting started with Azure Workbooks](workbooks-getting-started.md)
