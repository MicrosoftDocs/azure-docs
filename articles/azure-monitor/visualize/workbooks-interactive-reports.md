---
title: Create interactive reports with Azure Monitor Workbooks 
description: This article explains how to create interactive reports in Azure Workbooks.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 01/08/2024
ms.author: abbyweisberg
ms.reviewer: gardnerjr
---

# Create interactive reports with Azure Monitor Workbooks

There are several ways that you can create interactive reports and experiences in workbooks:

 - **Parameters**: When you update a [parameter](workbooks-parameters.md), any control that uses the parameter automatically refreshes and redraws to reflect the new value. This behavior is how most of the Azure portal reports support interactivity. Workbooks provide this functionality in a straightforward manner with minimal user effort.
 - **Grid, tile, and chart selections**: You can construct scenarios where selecting a row in a grid updates subsequent charts based on the content of the row. For example, you might have a grid that shows a list of requests and some statistics like failure counts. You can set it up so that if you select the row of a request, the detailed charts below update to show only that request. Learn how to [set up a grid row click](#set-up-a-grid-row-click).
 - **Grid cell clicks**: You can add interactivity with a special type of grid column renderer called a [link renderer](#link-renderer-actions). A link renderer converts a grid cell into a hyperlink based on the contents of the cell. Workbooks support many kinds of link renderers including renderers that open resource overview panes, property bag viewers, and Application Insights search, usage, and transaction tracing. Learn how to [set up a grid cell click](#set-up-grid-cell-clicks).
 - **Conditional visibility**: You can make controls appear or disappear based on the values of parameters. This way you can have reports that look different based on user input or telemetry state. For example, you can show consumers a summary when there are no issues. You can also show detailed information when there's something wrong. Learn how to [set up conditional visibility](#set-conditional-visibility).
 - **Export parameters with multi-selections**: You can export parameters from query and metrics workbook components when a row or multiple rows are selected. Learn how to [set up multi-selects in grids and charts](#set-up-multi-selects-in-grids-and-charts).

## Set up a grid row click

1. Make sure you're in edit mode by selecting **Edit**.
1. Select **Add query** to add a log query control to the workbook.
1. Select the log query type, the resource type, and the target resources.
1. Use the query editor to enter the KQL for your analysis:

    ```kusto
    requests
    | summarize AllRequests = count(), FailedRequests = countif(success == false) by Request = name
    | order by AllRequests desc
    ```

1. Select **Run query** to see the results.
1. Select **Advanced Settings** to open the **Advanced Settings** pane.
1. Select the **When an item is selected, export a parameter** checkbox.
1. Select **Add Parameter** and fill in the following information:
    - **Field to export**: `Request`
    - **Parameter name**: `SelectedRequest`
    - **Default value**: `All requests`
    
     :::image type="content" source="media/workbooks-configurations/workbooks-export-parameters-add.png" alt-text="Screenshot that shows the Advanced Settings workbook editor with settings for exporting fields as parameters.":::

1. Optional. If you want to export the entire contents of the selected row instead of a specific column, leave **Field to export** unset. The entire row's contents are exported as JSON to the parameter. On the referencing KQL control, use the `todynamic` function to parse the JSON and access the individual columns.
1. Select **Save**.
1. Select **Done Editing**.
1. Add another query control as in the preceding steps.
1. Use the query editor to enter the KQL for your analysis.

    ```kusto
    requests
    | where name == '{SelectedRequest}' or 'All Requests' == '{SelectedRequest}'
    | summarize ['{SelectedRequest}'] = count() by bin(timestamp, 1h)
    ```

1. Select **Run query** to see the results.
1. Change **Visualization** to **Area chart**.
1. Choose a row to select in the first grid. Note how the area chart below filters to the selected request.

The resulting report looks like this example in edit mode:
  
  :::image type="content" source="media/workbooks-configurations/workbooks-interactivity-grid-create.png" alt-text="Screenshot that shows workbooks with the first two queries in edit mode.":::

The following image shows a more elaborate interactive report in read mode based on the same principles. The report uses grid clicks to export parameters, which in turn are used in two charts and a text block.

   :::image type="content" source="media/workbooks-configurations/workbooks-interactivity-grid-read.png" alt-text="Screenshot that shows a workbook report using grid clicks.":::

## Set up grid cell clicks

1. Make sure you're in edit mode by selecting **Edit**.
1. Select **Add query** to add a log query control to the workbook.
1. Select the log query type, resource type, and target resources.
1. Use the query editor to enter the KQL for your analysis:

    ```kusto
    requests
    | summarize Count = count(), Sample = any(pack_all()) by Request = name
    | order by Count desc
    ```

1. Select **Run query** to see the results.
1. Select **Column Settings** to open the settings pane.
1. In the **Columns** section, set:
    - **Sample**
       - **Column renderer**: `Link`
       - **View to open**: `Cell Details`
       - **Link label**: `Sample`
    - **Count**
        - **Column renderer**: `Bar`
        - **Color palette**: `Blue`
        - **Minimum value**: `0`
    - **Request**
       - **Column renderer**: `Automatic`
1. Select **Save and Close** to apply changes.

    :::image type="content" source="media/workbooks-configurations/workbooks-column-settings.png" alt-text="Screenshot that shows the Edit column settings pane.":::

1. Select a **Sample** link in the grid to open a pane with the details of a sampled request.

    :::image type="content" source="media/workbooks-configurations/workbooks-grid-link-details.png" alt-text="Screenshot that shows the Details pane of the sample request.":::

## Link renderer actions

Learn about how [link actions](workbooks-link-actions.md) work to enhance workbook interactivity.

## Set conditional visibility

1. Follow the steps in the [Set up a grid row click](#set-up-a-grid-row-click) section to set up two interactive controls.
1. Add a new parameter with these values:
    - **Parameter name**: `ShowDetails`
    - **Parameter type**: `Drop down`
    - **Required**: `checked`
    - **Get data from**: `JSON`
    - **JSON Input**: `["Yes", "No"]`
1. Select **Save** to commit changes.

    :::image type="content" source="media/workbooks-configurations/workbooks-edit-parameter.png" alt-text="Screenshot that shows editing an interactive parameter in workbooks.":::

1. Set the parameter value to `Yes`.
  
   :::image type="content" source="media/workbooks-configurations/workbooks-set-parameter.png" alt-text="Screenshot that shows setting an interactive parameter value in a workbook.":::

1. In the query control with the area chart, select **Advanced Settings** (the gear icon).
1. If **ShowDetails** is set to `Yes`, select **Make this item conditionally visible**.
1. Select **Done Editing** to commit the changes.
1. On the workbook toolbar, select **Done Editing**.
1. Switch the value of **ShowDetails** to `No`. Notice that the chart below disappears.

The following image shows the case where **ShowDetails** is `Yes`:

  :::image type="content" source="media/workbooks-configurations/workbooks-conditional-visibility-visible.png" alt-text="Screenshot that shows a workbook with a conditional component that's visible.":::

The following image shows the hidden case where **ShowDetails** is `No`:

:::image type="content" source="media/workbooks-configurations/workbooks-conditional-visibility-invisible.png" alt-text="Screenshot that shows a workbook with a conditional component that's hidden.":::

## Set up multi-selects in grids and charts

Query and metrics components can export parameters when a row or multiple rows are selected.

:::image type="content" source="media/workbooks-configurations/workbooks-export-parameters.png" alt-text="Screenshot that shows the workbooks export parameters settings with multiple parameters.":::

1. In the query component that displays the grid, select **Advanced settings**.
1. Select the **When items are selected, export parameters** checkbox.
1. Select the **Allow selection of multiple values** checkbox.
    - The displayed visualization allows multi-selecting and the exported parameter's values will be arrays of values, like when using multi-select dropdown parameters.
    - If cleared, the display visualization only captures the last selected item and exports only a single value at a time.
1. Use **Add Parameter** for each parameter you want to export. A pop-up window appears with the settings for the parameter to be exported.

When you enable single selection, you can specify which field of the original data to export. Fields include parameter name, parameter type, and default value to use if nothing is selected.

When you enable multi-selection, you specify which field of the original data to export. Fields include parameter name, parameter type, quote with, and delimiter. The quote with and delimiter values are used when turning arrow values into text when they're being replaced in a query. In multi-selection, if no values are selected, the default value is an empty array.

> [!NOTE]
> For multi-selection, only unique values are exported. For example, you won't see output array values like "1,1,2,1". The array output will be "1,2".

If you leave the **Field to export** setting empty in the export settings, all the available fields in the data will be exported as a stringified JSON object of key:value pairs. For grids and titles, the string includes the fields in the grid. For charts, the available fields are x,y,series, and label, depending on the type of chart.

While the default behavior is to export a parameter as text, if you know the field is a subscription or resource ID, use that information as the export parameter type. Then the parameter can be used downstream in places that require those types of parameters.

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

* [Learn about the types of visualizations you can use to create rich visual reports with Azure Workbooks](workbooks-visualizations.md).
* [Use drop down parameters to simplify complex reporting](workbooks-dropdowns.md).
