---
title: Sample Azure Workbooks components
description: This article includes commonly used Azure Workbooks components.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/21/2023
ms.reviewer: gardnerjr 
---

# Common workbook use cases

This article includes commonly used Azure Workbooks components and instructions for how to implement them.

## Traffic light icons

You can summarize status by using a simple visual indication instead of presenting the full range of data values. For example, you can categorize your computers by CPU utilization as cold, warm, or hot and categorize performance as satisfied, tolerated, or frustrated. You can use an indicator or icon that represents the status next to the underlying metric.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-sample.png" alt-text="Screenshot that shows a grid with traffic light status by using thresholds.":::

The following example shows how to set up a traffic light icon per computer based on the CPU utilization metric.

1. [Create a new empty workbook](workbooks-create-workbook.md).
1. [Add a parameter](workbooks-create-workbook.md#add-parameters), make it a [time range parameter](workbooks-time.md), and name it **TimeRange**.
1. Select **Add query** to add a log query control to the workbook.
1. For **Query type**, select `Logs`, and for **Resource type**, select `Log Analytics`. Select a Log Analytics workspace in your subscription that has VM performance data as a resource.
1. In the query editor, enter:

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

1. Set **Visualization** to `Grid`.
1. Select **Column Settings**.
1. In the **Columns** section, set:
    - **Cpu**
       - **Column renderer**: `Thresholds`
       - **Custom number formatting**: `checked`
       - **Units**: `Percentage`
       - **Threshold settings** (last two need to be in order):
           - **Icon**: `Success`, **Operator**: `Default`
           - **Icon**: `Critical`, **Operator**: `>`, **Value**: `80`
           - **Icon**: `Warning`, **Operator**: `>`, **Value**: `60`
    - **Trend**
       - **Column renderer**: `Spark line`
       - **Color palette**: `Green to Red`
       - **Minimum value**: `60`
       - **Maximum value**: `80`
1. Select **Save and Close** to commit the changes.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-settings.png" alt-text="Screenshot that shows the creation of a grid with traffic light icons.":::

You can also pin this grid to a dashboard by using **Pin to dashboard**. The pinned grid automatically binds to the time range in the dashboard.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-pinned.png" alt-text="Screenshot that shows a grid with traffic light status by using thresholds pinned to a dashboard.":::

## Capture user input to use in a query

You can capture user input by using dropdown lists and use the selections in your queries. For example, you can have a dropdown list to accept a set of virtual machines and then filter your KQL to include just the selected machines. In most cases, this step is as simple as including the parameter's value in the query:

```sql
    Perf
    | where Computer in ({Computers})
    | take 5
```

In more advanced scenarios, you might need to transform the parameter results before they can be used in queries. Take this OData filter payload:

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'Android' or OSFamily eq 'OS X') and (ComplianceState eq 'Compliant')"
}
```

The following example shows how to enable this scenario. Let's say you want the values of the `OSFamily` and `ComplianceState` filters to come from dropdown lists in the workbook. The filter could include multiple values as in the preceding `OsFamily` case. It needs to also support the case where you want to include all dimension values, that is to say, with no filters.

### Set up parameters

1. [Create a new empty workbook](workbooks-create-workbook.md) and [add a parameter component](workbooks-create-workbook.md#add-parameters).
1. Select **Add parameter** to create a new parameter. Use the following settings:
    - **Parameter name**: `OsFilter`
    - **Display name**: `Operating system`
    - **Parameter type**: `drop-down`
    - **Allow multiple selections**: `Checked`
    - **Delimiter**: `or` (with spaces before and after)
    - **Quote with**: `<empty>`
    - **Get data from**: `JSON`
    - **JSON Input**:

        ```json
        [
            { "value": "OSFamily eq 'Android'", "label": "Android" },
            { "value": "OSFamily eq 'OS X'", "label": "OS X" }
        ]
        ```

    - In the **Include in the drop down** section:
        - Select the **All** checkbox.
        - **Select All value**: `OSFamily ne '#@?'`
    - Select **Save** to save this parameter.
1. Add another parameter with these settings:
    - **Parameter name**: `ComplianceStateFilter`
    - **Display name**: `Compliance State`
    - **Parameter type**: `drop-down`
    - **Allow multiple selections**: `Checked`
    - **Delimiter**: `or` (with spaces before and after)
    - **Quote with**: `<empty>`
    - **Get data from**: `JSON`
    - **JSON Input**:

        ```json
        [
            { "value": "ComplianceState eq 'Compliant'", "label": "Compliant" },
            { "value": "ComplianceState eq 'Non-compliant'", "label": "Non compliant" }
        ]        
        ```
    - In the **Include in the drop down** section:
        - Select the **All** checkbox.
        - **Select All value**: `ComplianceState ne '#@?'`
    - Select **Save** to save this parameter.

1. Select **Add text** to add a text block. In the **Markdown text to display** block, add:

    ```json
    {
        "name": "deviceComplianceTrend",
        "filter": "({OsFilter}) and ({ComplianceStateFilter})"
    }
    ```

   This screenshot shows the parameter settings:

   :::image type="content" source="media/workbooks-commonly-used-components/workbooks-odata-parameters-settings.png" alt-text="Screenshot that shows parameter settings for dropdown lists with parameter values.":::

### Single filter value

The simplest case is the selection of a single filter value in each of the dimensions. The dropdown control uses the JSON input field's value as the parameter's value.

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X') and (ComplianceState eq 'Compliant')"
}
```

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-odata-parameters-single-select.png" alt-text="Screenshot that shows a dropdown list with parameter values and a single value selected.":::

### Multiple filter values

If you choose multiple filter values, for example, both Android and OS X operating systems, the `Delimiter` and `Quote with` parameter settings kick in and produce this compound filter:

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X' or OSFamily eq 'Android') and (ComplianceState eq 'Compliant')"
}
```

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-odata-parameters-multi-select.png" alt-text="Screenshot that shows a dropdown list with parameter values and multiple values selected.":::

### No filter case

Another common case is having no filter for that dimension. This scenario is equivalent to including all values of the dimensions as part of the result set. The way to enable it is by having an `All` option on the dropdown and have it return a filter expression that always evaluates to `true`. An example is _ComplianceState eq '#@?'_.

```json
{
    "name": "deviceComplianceTrend",
    "filter": "(OSFamily eq 'OS X' or OSFamily eq 'Android') and (ComplianceState ne '#@?')"
}
```

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-odata-parameters-no-select.png" alt-text="Screenshot that shows a dropdown list with parameter values and no filter selected.":::

## Reuse query data in different visualizations

There are times where you want to visualize the underlying dataset in different ways without having to pay the cost of the query each time. This sample shows you how to do so by using the `Merge` option in the query control.

### Set up the parameters

1. [Create a new empty workbook](workbooks-create-workbook.md).
1. Select **Add query** to create a query control, and enter these values:
    - **Data source**: `Logs`
    - **Resource type**: `Log Analytics`
    - **Log Analytics workspace**: _Pick one of your workspaces that has performance data_
    - **Log Analytics workspace logs query**:

        ```sql
        Perf
        | where CounterName == '% Processor Time'
        | summarize CpuAverage = avg(CounterValue), CpuP95 = percentile(CounterValue, 95) by Computer
        | order by CpuAverage desc
        ```

1. Select **Run Query** to see the results.

   This result dataset is the one we want to reuse in multiple visualizations.

    :::image type="content" source="media/workbooks-commonly-used-components/workbooks-reuse-data-resultset.png" alt-text="Screenshot that shows the result of a workbooks query." lightbox="media/workbooks-commonly-used-components/workbooks-reuse-data-resultset.png":::

1. Go to the **Advanced settings** tab, and for the name, enter `Cpu data`.
1. Select **Add query** to create another query control.
1. For **Data source**, select `Merge`.
1. Select **Add Merge**.
1. In the settings pane, set:
    - **Merge Type**: `Duplicate table`
    - **Table**: `Cpu data`
1. Select **Run Merge**. You'll get the same result as the preceding.

   :::image type="content" source="media/workbooks-commonly-used-components/workbooks-reuse-data-duplicate.png" alt-text=" Screenshot that shows duplicate query results in a workbook." lightbox="media/workbooks-commonly-used-components/workbooks-reuse-data-duplicate.png":::

1. Set the table options:
    - Use the **Name After Merge** column to set friendly names for your result columns. For example, you can rename `CpuAverage` to `CPU utilization (avg)`, and then use **Run Merge** to update the result set.
    - Use **Delete** to remove a column.
        - Select the `[Cpu data].CpuP95` row.
        - Use **Delete** in the query control toolbar.
        - Use **Run Merge** to see the result set without the CpuP95 column
1. Change the order of the columns by selecting **Move up** or **Move down**.
1. Add new columns based on values of other columns by selecting **Add new item**.
1. Style the table by using the options in **Column settings** to get the visualization you want.
1. Add more query controls working against the `Cpu data` result set if needed.

This example shows Average and P95 CPU utilization side by side:

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-reuse-data-two-controls.png" alt-text="Screenshot that shows two workbook controls using the same query." lightbox="media/workbooks-commonly-used-components/workbooks-reuse-data-two-controls.png":::

## Use Azure Resource Manager to retrieve alerts in a subscription

This sample shows you how to use the Azure Resource Manager query control to list all existing alerts in a subscription. This guide will also use JSON Path transformations to format the results. See the [list of supported Resource Manager calls](/rest/api/azure/).

### Set the parameters

1. [Create a new empty workbook](workbooks-create-workbook.md).
1. Select **Add parameter**, and set:
    - **Parameter name**: `Subscription`
    - **Parameter type**: `Subscription picker`
    - **Required**: `Checked`
    - **Get data from**: `Default Subscriptions`
1. Select **Save**.
1. Select **Add query** to create a query control, and use these settings. For this example, we're using the [Alerts Get All REST call](/rest/api/monitor/alertsmanagement/alerts/getall) to get a list of existing alerts for a subscription. For supported api-versions, see the [Azure REST API reference](/rest/api/azure/).
    - **Data source**: `Azure Resource Manager (Preview)`
    - **Http Method**: `GET`
    - **Path**: `/subscriptions/{Subscription:id}/providers/Microsoft.AlertsManagement/alerts`
    - Add the api-version parameter on the **Parameters** tab and set:
      - **Parameter**: `api-version`
      - **Value**: `2018-05-05`

1. Select a subscription from the created subscription parameter, and select **Run Query** to see the results.

   This raw JSON is returned from Resource Manager:

   :::image type="content" source="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-no-formatting.png" alt-text="Screenshot that shows an alert data JSON response in workbooks by using a Resource Manager provider." lightbox="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-no-formatting.png":::

### Format the response

You might be satisfied with the information here. But let's extract some interesting properties and format the response in a way that's easy to read.

1. Go to the **Result Settings** tab.
1. Switch **Result Format** from `Content` to `JSON Path`. [JSON Path](workbooks-jsonpath.md) is a workbook transformer.
1. In the JSON Path settings, set **JSON Path Table** to `$.value.[*].properties.essentials`. This extracts all `"value.*.properties.essentials"` fields from the returned JSON.
1. Select **Run Query** to see the grid.

  :::image type="content" source="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-grid.png" alt-text="Screenshot that shows alert data in a workbook in grid format by using a Resource Manager provider." lightbox="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-grid.png":::

### Filter the results

JSON Path also allows you to choose information from the generated table to show as columns.

For example, if you want to filter the results to the columns **TargetResource**, **Severity**, **AlertState**, **AlertRule**, **Description**, **StartTime**, and **ResolvedTime**, you could add the following rows in the columns table in JSON Path:

| Column ID | Column JSON Path |
| :------------- | :----------: |
| TargetResource | $.targetResource |
| Severity | $.severity |
| AlertState | $.alertState |
| AlertRule | $.alertRule |
| Description | $.description |
| StartTime  | $.startDateTime |
| ResolvedTime  | $.monitorConditionResolvedDateTime |

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-final.png" alt-text="Screenshot that shows the final query results in grid format by using a Resource Manager provider." lightbox="media/workbooks-commonly-used-components/workbooks-arm-alerts-query-final.png":::

## Next steps

[Get started with Azure Workbooks](workbooks-getting-started.md)
