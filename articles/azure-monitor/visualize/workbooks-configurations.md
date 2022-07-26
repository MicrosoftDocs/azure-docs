---
title: Azure Monitor workbooks with custom parameters 
description: Simplify complex reporting with prebuilt and custom parameterized workbooks
services: azure-monitor
manager: carmonm

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/05/2022
---

# Workbook configuration options
There are several ways you can configure Workbooks to suit your needs using the settings in the **Settings** tab. When query or metrics steps are displaying time based data, more settings are available in the **Advanced settings** tab.

## Workbook settings
The workbooks settings has these tabs to help you configure your workbook.


|Settings tab  |Description  |
|---------|---------|
|Resources|This tab contains the resources that appear as default selections in this workbook.<br>The resource marked as the **Owner** resource is where the workbook will be saved, and the location of the workbooks and templates you'll see when browsing. The owner resource can't be removed.<br> You can add a default resource by selecting **Add Resources**. You can remove resources by selecting a resource or several resources, and selecting **Remove Selected Resources**. When you're done adding and removing resources, select **Apply Changes**.|
|Versions| This tab contains a list of all the available versions of this workbook. Select a version and use the toolbar to compare, view, or restore versions. Previous workbook versions are available for 90 days.<br><ul><li>**Compare**: Compare the JSON of the previous workbook to the most recently saved version.</li><li>**View**: Opens the selected version of the workbook in a context pane.</li><li>**Restore**: Saves a new copy of the workbook with the contents of the selected version and overwrites any existing current content. You'll be prompted to confirm this action.</li></ul><br>|
|Style     |In this tab, you can set a padding and spacing style for the whole workbook. The possible options are `Wide`, `Standard`, `Narrow`, `None`. `Standard` is the default style setting.|
|Pin     |While in pin mode, you can select **Pin Workbook** to pin a component from this workbook to a dashboard. Select **Link to Workbook**, to pin a static link to this workbook on your dashboard. You can choose a specific component in your workbook to pin.|
|Trusted hosts     |In this tab, you can enable a trusted source or mark this workbook as trusted in this browser. See [trusted hosts](#trusted-hosts) for detailed information. |

> [!NOTE]
> Version history is not available for [Bring your own storage](workbooks-bring-your-own-storage.md) workbooks.

**Versions tab**

:::image type="content" source="media/workbooks-configurations/workbooks-versions.png" alt-text="Screenshot showing the versions tab of the workbook settings pane.":::

**Comparing versions**
:::image type="content" source="media/workbooks-configurations/workbooks-compare-versions.png" alt-text="Screenshot showing version comparison in the workbooks settings pane.":::

### Trusted hosts
Enable trusted source or mark this workbook as trusted in this browser.

| Control      | Definition |
| ----------- | ----------- |
| Mark Workbook as trusted      | If enabled, this Workbook will be able to call any endpoint, whether the host is marked as trusted or not. A workbook is trusted if it's a new workbook, an existing workbook is saved, or it's explicitly marked as a trusted workbook   |
| URL grid   | A grid to explicitly add trusted hosts.        |

## Time brushing

Time range brushing allows a user to "brush" or "scrub" a range on a chart, and have that range be output as a parameter value.

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-metrics-settings.png" alt-text="Screenshot showing Workbooks timebrush settings.":::

You can also choose to only export a parameter when a range is explicitly brushed. 
 - If this setting is unchecked (default), the parameter always has a value. When the parameter is not brushed, the value is the full time range displayed in the chart.
 - If this setting is checked, the parameter has no value before the user brushes the parameter, and is only set after a user brushes the parameter.

### Brushing in a metrics chart

When time brushing is enabled on a metrics chart, the user can "brush" a time by dragging the mouse on the time chart:

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-metrics-brushing.png" alt-text="Screenshot of a metrics timebrush in progress.":::

Once the brush has stopped, the metrics chart zooms in to that range, and exports that range as a time range parameter.
An icon in the toolbar in the upper right corner is active, to reset the time range back to its original, un-zoomed time range.


### Brushing in a query chart

When time brushing is enabled on a query chart, indicators appear that the user can drag, or the user can "brush" a range on the time chart:

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-query-brushing.png" alt-text="Screenshot of timebrushing a query chart.":::

Once the brush has stopped, the query chart shows that range as a time range parameter, but will not zoom in. This behavior is different than the behavior of metrics charts. Because of the complexity of user written queries, it may not be possible for workbooks to correctly update the range used by the query in the query content directly. If the query is using a time range parameter, it is possible to get this behavior by using a [global parameter](workbooks-parameters.md#global-parameters) instead.

An icon in the toolbar in the upper right corner is active, to reset the time range back to its original, un-zoomed time range.

## Interactivity

There are several ways that you can create interactive reports and experiences in workbooks.
 - **Parameters**: When a user updates a [parameter](workbooks-parameters.md), any control that uses the parameter automatically refreshes and redraws to reflect the new value. This is how most of the Azure portal reports support interactivity. Workbooks provide this functionality in a straight-forward manner with minimal user effort.
 - **Grid, tile, and chart selections**: You can construct scenarios where clicking a row in a grid updates subsequent charts based on the content of the row. For example, if you have a grid that shows a list of requests and some statistics like failure counts, you can set it up so that if you click on the row of a request, the detailed charts below update to show only that request. Learn how to [set up a grid row click](#set-up-a-grid-row-click).
 - **Grid Cell Clicks**: You to add interactivity with a special type of grid column renderer called a [link renderer](#link-renderer-actions). A link renderer converts a grid cell into a hyperlink based on the contents of the cell. Workbooks support many kinds of link renderers including renderers that open resource overview blades, property bag viewers, App Insights search, usage, transaction tracing, etc. Learn how to [set up a grid cell click](#set-up-grid-cell-clicks).
 - **Conditional Visibility**: You can make controls appear or disappear based on the values of parameters. This allows you to have reports that look different based on user input or telemetry state. For example, you can show consumers a summary when there are no issues, and show detailed information when there's something wrong. Learn how to [set up conditional visibility](#set-conditional-visibility).
 - **Export parameters with multi-selections**:  You can export parameters from query and metrics workbook components when a row or multiple rows are selected.Learn how to [set up multi-selects in grids and charts](#set-up-multi-selects-in-grids-and-charts).


### Set up a grid row click

1. Make sure you are in **Edit** mode by selecting the **Edit** in the toolbar.
1. Select **Add query** to add a log query control to the workbook.
1. Select the `log` query type, the resource type, and the target resources.
1. Use the Query editor to enter the KQL for your analysis:

    ```kusto
    requests
    | summarize AllRequests = count(), FailedRequests = countif(success == false) by Request = name
    | order by AllRequests desc
    ```

1. Select **Run query** to see the results.
1. Select **Advanced Settings** icon in query footer. This opens up the advanced settings pane.
1. Select the **When an item is selected, export a parameter** checkbox.
1. Select **Add Parameter** and fill in the following information:
    - **Field to export**: `Request`
    - **Parameter name**: `SelectedRequest`
    - **Default value**: `All requests`
    
     :::image type="content" source="media/workbooks-configurations/workbooks-export-parameters-add.png" alt-text="Screenshot showing the advanced workbooks editor with settings for exporting fields as parameters.":::

1. (Optional.) If you want to export the entire contents of the selected row instead of just a particular column, leave the `Field to export` property unset. The entire row contents is exported as json to the parameter. On the referencing KQL control, use the `todynamic` function to parse the json and access the individual columns.
1. Select **Save**.   
1. Select **Done Editing**.
1. Add another query control as in the steps above.
1. Use the Query editor to enter the KQL for your analysis.
    ```kusto
    requests
    | where name == '{SelectedRequest}' or 'All Requests' == '{SelectedRequest}'
    | summarize ['{SelectedRequest}'] = count() by bin(timestamp, 1h)
    ```
1. Select **Run query** to see the results.
1. Change **Visualization** to `Area chart`.
1. Choose a row to select in the first grid. Note how the area chart below filters to the selected request.

The resulting report looks like this in edit mode:
  
  :::image type="content" source="media/workbooks-configurations/workbooks-interactivity-grid-create.png" alt-text="Screenshot showing workbooks with the first two queries in edit mode.":::

The following image shows a more elaborate interactive report in read mode based on the same principles. The report uses grid clicks to export parameters, which in turn is used in two charts and a text block.

   :::image type="content" source="media/workbooks-configurations/workbooks-interactivity-grid-read.png" alt-text="Screenshot showing a workbook report using grid clicks.":::

### Set up grid cell clicks

1. Make sure you are in **Edit** mode by selecting the **Edit** in the toolbar.
1. Select **Add query** to add a log query control to the workbook.
1. Select the `log` query type, resource type and the target resources.
1. Use the Query editor to enter the KQL for your analysis:

    ```kusto
    requests
    | summarize Count = count(), Sample = any(pack_all()) by Request = name
    | order by Count desc
    ```

1. Select **Run query** to see the results.
1. Select **Column Settings** to open the settings pane.
1. In the **Columns** section, set:
    - Sample - Column Renderer: `Link`, View to open: `Cell Details`, Link Label: `Sample`
    - Count - Column Renderer: `Bar`, Color palette: `Blue`, Minimum value: `0`
    - Request - Column Renderer: `Automatic`
    - Select **Save and Close** to apply changes.

    :::image type="content" source="media/workbooks-configurations/workbooks-column-settings.png" alt-text="Screenshot showing the workbooks column setting's tab.":::

1. Select a **Sample** link in the grid to open a pane with the details of a sampled request.

    :::image type="content" source="media/workbooks-configurations/workbooks-grid-link-details.png" alt-text="Screenshot showing the detail pane of the sampled request in workbooks.":::

### Link Renderer Actions
Learn about how [Link actions](workbooks-link-actions.md) work to enhance workbook interactivity.

### Set conditional visibility

1. Follow the steps in the [setting up interactivity on grid row click](#set-up-a-grid-row-click) section to set up two interactive controls.
1. Add a new parameter with these values:
    - Name: `ShowDetails`
    - Parameter type: `Drop down`
    - Required: `checked`
    - Get data from: `JSON`
    - JSON Input: `["Yes", "No"]`
    - Save to commit changes.

    :::image type="content" source="media/workbooks-configurations/workbooks-edit-parameter.png" alt-text="Screenshot showing editing an interactive parameter in workbooks.":::

1. Set the parameter value to `Yes`.
  
   :::image type="content" source="media/workbooks-configurations/workbooks-set-parameter.png" alt-text="Screenshot showing setting an interactive parameter value in workbooks.":::

1. In the query control with the area chart, select **Advanced Settings** (the gear icon).
1. If the `ShowDetails` parameter value is set to `Yes`, select **Make this item conditionally visible**.
1. Select **Done Editing** to commit the changes.
1. On the workbook toolbar, select **Done Editing**.
1. Switch the value of `ShowDetails` parameter to `No`. Notice that the chart below disappears.

The following image shows the case where `ShowDetails` is `Yes`:

  :::image type="content" source="media/workbooks-configurations/workbooks-conditional-visibility-visible.png" alt-text="Screenshot showing a workbook with a conditional component that is visible.":::

The image below shows the hidden case where `ShowDetails` is `No`:

:::image type="content" source="media/workbooks-configurations/workbooks-conditional-visibility-invisible.png" alt-text="Screenshot showing a workbook with a conditional component that is hidden.":::

### Set up multi-selects in grids and charts

Query and metrics components can export parameters when a row or multiple rows are selected.

:::image type="content" source="media/workbooks-configurations/workbooks-export-parameters.png" alt-text="Screenshot showing the workbooks export parameters settings with multiple parameters.":::

1. In the query component displaying the grid, select **Advanced settings**.
2. Select the `When items are selected, export parameters` checkbox. 
1. Select the `allow selection of multiple values` checkbox.
    - The displayed visualization allows multi-selecting and the exported parameter's values will be arrays of values, like when using multi-select dropdown parameters.
    - If unchecked, the display visualization only captures the last selected item and only exports a single value at a time.
1. Use the **Add Parameter** button for each parameter you want to export. A pop-up window appears with the settings for the parameter to be exported.

When single selection is enabled, you can specify which field of the original data to export. Fields include parameter name, parameter type, and default value to use if nothing is selected.

When multi-selection is enabled, you specify which field of the original data to export. Fields include parameter name, parameter type, quote with and delimiter. The quote with and delimiter values are used when turning arrow values into text when being replaced in a query. In multi-selection, if no values are selected, the default value is an empty array.

> [!NOTE]
> For multi-select, only unique values are exported. For example, you will not see output array values like " 1,1,2,1". The array output will be get "1,2".

If you leave the `Field to export` setting empty in the export settings, all the available fields in the data will be exported as a stringified JSON object of key:value pairs. For grids and titles, the string includes the fields in the grid. For charts, the available fields are x,y,series, and label (depending on the type of chart).

While the default behavior is to export a parameter as text, if you know that the field is a subscription or resource ID, use that as the export parameter type. This allows the parameter to be used downstream in places that require those types of parameters.
