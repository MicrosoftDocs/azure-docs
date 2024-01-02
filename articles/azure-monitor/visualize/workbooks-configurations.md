---
title: Azure Monitor workbooks with custom parameters 
description: Simplify complex reporting with prebuilt and custom parameterized workbooks.
services: azure-monitor
manager: carmonm

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
---

# Workbook configuration options

You can configure workbooks to suit your needs by using the settings in the **Settings** tab. If query or metrics steps display time-based data, more settings are available on the **Advanced settings** tab.

## Workbook settings

Workbook settings have these tabs to help you configure your workbook.

|Settings tab  |Description  |
|---------|---------|
|Resources|This tab contains the resources that appear as default selections in this workbook.<br>The resource marked as the **Owner** is where the workbook will be saved and the location of the workbooks and templates you'll see when you're browsing. The owner resource can't be removed.<br> You can add a default resource by selecting **Add Resources**. You can remove resources by selecting a resource or several resources and selecting **Remove Selected Resources**. When you're finished adding and removing resources, select **Apply Changes**.|
|Versions| This tab contains a list of all the available versions of this workbook. Select a version and use the toolbar to compare, view, or restore versions. Previous workbook versions are available for 90 days.<br><ul><li>**Compare**: Compares the JSON of the previous workbook to the most recently saved version.</li><li>**View**: Opens the selected version of the workbook in a context pane.</li><li>**Restore**: Saves a new copy of the workbook with the contents of the selected version and overwrites any existing current content. You'll be prompted to confirm this action.</li></ul><br>|
|Style     |On this tab, you can set a padding and spacing style for the whole workbook. The possible options are **Wide**, **Standard**, **Narrow**, and **None**. The default style setting is **Standard**.|
|Pin     |While in pin mode, you can select **Pin Workbook** to pin a component from this workbook to a dashboard. Select **Link to Workbook** to pin a static link to this workbook on your dashboard. You can choose a specific component in your workbook to pin.|
|Trusted hosts     |On this tab, you can enable a trusted source or mark this workbook as trusted in this browser. For more information, see [Trusted hosts](#trusted-hosts). |

> [!NOTE]
> Version history isn't available for [bring-your-own-storage](workbooks-bring-your-own-storage.md) workbooks.

#### Versions tab

:::image type="content" source="media/workbooks-configurations/workbooks-versions.png" alt-text="Screenshot that shows the versions tab of the workbook's Settings pane.":::

#### Compare versions

:::image type="content" source="media/workbooks-configurations/workbooks-compare-versions.png" alt-text="Screenshot that shows version comparison in the Compare Workbook Versions screen.":::

### Trusted hosts

Enable a trusted source or mark this workbook as trusted in this browser.

| Control      | Definition |
| ----------- | ----------- |
| Mark workbook as trusted      | If enabled, this workbook can call any endpoint, whether the host is marked as trusted or not. A workbook is trusted if it's a new workbook, an existing workbook that's saved, or is explicitly marked as a trusted workbook.   |
| URL grid   | A grid to explicitly add trusted hosts.        |

## Time brushing

Time range brushing allows a user to "brush" or "scrub" a range on a chart and have that range output as a parameter value.

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-metrics-settings.png" alt-text="Screenshot that shows workbook time-brush settings.":::

You can also choose to only export a parameter when a range is explicitly brushed:

 - If this setting is cleared (default), the parameter always has a value. When the parameter isn't brushed, the value is the full time range displayed in the chart.
 - If this setting is selected, the parameter has no value before the user brushes the parameter. The value is only set after a user brushes the parameter.

### Brushing in a metrics chart

When you enable time brushing on a metrics chart, you can "brush" a time by dragging the mouse on the time chart.

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-metrics-brushing.png" alt-text="Screenshot of a metrics time-brush in progress.":::

After the brush has stopped, the metrics chart zooms in to that range and exports the range as a time range parameter.
An icon on the toolbar in the upper-right corner is active to reset the time range back to its original, unzoomed time range.

### Brushing in a query chart

When you enable time brushing on a query chart, indicators appear that you can drag, or you can brush a range on the time chart.

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-query-brushing.png" alt-text="Screenshot of time-brushing a query chart.":::

After the brush has stopped, the query chart shows that range as a time range parameter but won't zoom in. This behavior is different than the behavior of metrics charts. Because of the complexity of user-written queries, it might not be possible for workbooks to correctly update the range used by the query in the query content directly. If the query is using a time range parameter, it's possible to get this behavior by using a [global parameter](workbooks-parameters.md#global-parameters) instead.

An icon on the toolbar in the upper-right corner is active to reset the time range back to its original, unzoomed time range.

## Interactivity

There are several ways that you can create interactive reports and experiences in workbooks:

 - **Parameters**: When you update a [parameter](workbooks-parameters.md), any control that uses the parameter automatically refreshes and redraws to reflect the new value. This behavior is how most of the Azure portal reports support interactivity. Workbooks provide this functionality in a straightforward manner with minimal user effort.
 - **Grid, tile, and chart selections**: You can construct scenarios where selecting a row in a grid updates subsequent charts based on the content of the row. For example, you might have a grid that shows a list of requests and some statistics like failure counts. You can set it up so that if you select the row of a request, the detailed charts below update to show only that request. Learn how to [set up a grid row click](#set-up-a-grid-row-click).
 - **Grid cell clicks**: You can add interactivity with a special type of grid column renderer called a [link renderer](#link-renderer-actions). A link renderer converts a grid cell into a hyperlink based on the contents of the cell. Workbooks support many kinds of link renderers including renderers that open resource overview panes, property bag viewers, and Application Insights search, usage, and transaction tracing. Learn how to [set up a grid cell click](#set-up-grid-cell-clicks).
 - **Conditional visibility**: You can make controls appear or disappear based on the values of parameters. This way you can have reports that look different based on user input or telemetry state. For example, you can show consumers a summary when there are no issues. You can also show detailed information when there's something wrong. Learn how to [set up conditional visibility](#set-conditional-visibility).
 - **Export parameters with multi-selections**: You can export parameters from query and metrics workbook components when a row or multiple rows are selected. Learn how to [set up multi-selects in grids and charts](#set-up-multi-selects-in-grids-and-charts).

### Set up a grid row click

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

### Set up grid cell clicks

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

### Link renderer actions

Learn about how [link actions](workbooks-link-actions.md) work to enhance workbook interactivity.

### Set conditional visibility

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

### Set up multi-selects in grids and charts

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
