---
title: Azure Monitor workbooks with custom parameters 
description: Simplify complex reporting with prebuilt and custom parameterized workbooks
services: azure-monitor
author: mrbullwinkle
manager: carmonm

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/23/2019
ms.author: mbullwin
---

# Interactive Workbooks

Workbooks allow authors to create interactive reports and experiences for their consumers. Interactivity is supported in a number of ways.

## Parameter Changes
When a workbook user updates a parameter, any control that uses the parameter automatically refreshes and redraws to reflect the new state. This is how most of the Azure portal reports support interactivity. Workbooks provide this in a very straight forward manner with minimal user effort.

Learn more about [Parameters in Workbooks](workbooks-parameters.md)

## Grid row clicks
Workbooks allow authors to construct scenarios where clicking a row in a grid updates subsequent charts based on the content of the row. 

For instance, a user can have a grid that shows a list of requests and some stats like failure counts. They could set up it up such that clicking a row corresponding to a request, will result in detailed charts below updating to filter down to just that request.

### Setting up interactivity on grid row click
1. Switch the workbook to edit mode by clicking on the _Edit_ toolbar item.
2. Use the _Add query_ link to add a log query control to the workbook. 
3. Select the query type as _Log_, resource type (for example, Application Insights) and the resources to target.
4. Use the Query editor to enter the KQL for your analysis
    ```kusto
    requests
    | summarize AllRequests = count(), FailedRequests = countif(success == false) by Request = name
    | order by AllRequests desc    
    ```
5. `Run query` to see the results
6. Click on the _Advanced Settings_ icon on the query footer (the icon looks like a gear). This opens up the advanced settings pane 
7. Check the setting: `When an item is selected, export a parameter`
    1. Field to export: `Request`
    2. Parameter name: `SelectedRequest`
    3. Default value: `All requests`
    
    ![Image showing the advanced editor with settings for exporting fields as parameters](./media/workbooks-interactive/advanced-settings.png)

8. Click `Done Editing`.
9. Add another query control using steps 2 and 3.
10. Use the Query editor to enter the KQL for your analysis
    ```kusto
    requests
    | where name == '{SelectedRequest}' or 'All Requests' == '{SelectedRequest}'
    | summarize ['{SelectedRequest}'] = count() by bin(timestamp, 1h)
    ```
11. `Run query` to see the results.
12. Change _Visualization_ to `Area chart`
12. Click on a row in the first grid. Note how the area chart below filters to the selected request.

The resulting report looks like this in edit mode:

![Image showing the creation an interactive experience using grid row clicks](./media/workbooks-interactive//grid-click-create.png)

The image below shows a more elaborate interactive report in read mode based on the same principles. The report uses grid clicks to export parameters - which in turn is used in two charts and a text block.

![Image showing the creation an interactive experience using grid row clicks](./media/workbooks-interactive/grid-click-read-mode.png)

### Exporting the contents of an entire row
It is sometimes desirable to export the entire contents of the selected row instead of just a particular column. In such cases, leave the `Field to export` property unset in step 7.1 above. Workbooks will export the entire row contents as a json to the parameter. 

On the referencing KQL control, use the `todynamic` function to parse the json and access the individual columns.

 ## Grid Cell Clicks
Workbooks allow authors to add interactivity via a special type of grid column renderer called a `link renderer`. A link renderer converts a grid cell into a hyperlink based on the contents of the cell. Workbooks support many kinds of link renderers - including ones that allow opening resource overview blades, property bag viewers, App Insights search, usage, transaction tracing, etc.

### Setting up interactivity using grid cell clicks
1. Switch the workbook to edit mode by clicking on the _Edit_ toolbar item.
2. Use the _Add query_ link to add a log query control to the workbook. 
3. Select the query type as _Log_, resource type (for example, Application Insights) and the resources to target.
4. Use the Query editor to enter the KQL for your analysis
    ```kusto
    requests
    | summarize Count = count(), Sample = any(pack_all()) by Request = name
    | order by Count desc
    ```
5. `Run query` to see the results
6. Click _Column Settings_ to open the settings pane.
7. In the _Columns_ section, set:
    1. _Sample_ - Column Renderer: `Link`, View to open: `Cell Details`, Link Label: `Sample`
    2. _Count_ - Column Renderer: `Bar`, Color palette: `Blue`, Minimum value: `0`
    3. _Request_ - Column Renderer: `Automatic`
    4. Click _Save and Close_ to apply changes
8. Click on one of the `Sample` links in the grid. This opens up a property pane with the details of a sampled request.

    ![Image showing the creation an interactive experience using grid cell clicks](./media/workbooks-interactive/grid-cell-click-create.png)

### Link Renderer Actions
| Link action | Action on click |
|:------------- |:-------------|
| `Generic Details` | Shows the row values in a property grid context blade |
| `Cell Details` | Shows the cell value in a property grid context blade. Useful when the cell contains a dynamic type with information (for example, json with request properties like location, role instance, etc.). |
| `Cell Details` | Shows the cell value in a property grid context blade. Useful when the cell contains a dynamic type with information (for example, json with request properties like location, role instance, etc.). |
| `Custom Event Details` | Opens the Application Insights search details with the custom event ID (itemId) in the cell |
| `* Details` | Similar to Custom Event Details, except for dependencies, exceptions, page views, requests, and traces. |
| `Custom Event User Flows` | Opens the Application Insights User Flows experience pivoted on the custom event name in the cell |
| `* User Flows` | Similar to Custom Event User Flows except for exceptions, page views and requests |
| `User Timeline` | Opens the user timeline with the user ID (user_Id) in the cell |
| `Session Timeline` | Opens the Application Insights search experience for the value in the cell (for example, search for text 'abc' where abc is the value in the cell) |
| `Resource overview` | Open the resource's overview in the portal based on the resource ID value in the cell |

## Conditional Visibility
Workbook allows users to make certain controls appear or disappear based on values of the parameters. This allows authors to have reports look different based on user input or telemetry state. An example is showing consumers just a summary when things are good but show full details when something is wrong.

### Setting up interactivity using conditional visibility
1. Follow the steps in the `Setting up interactivity on grid row click` section to set up two interactive controls.
2. Add a new parameter at the top:
    1. Name: `ShowDetails`
    2. Parameter type: `Drop down`
    3. Required: `checked`
    4. Get data from: `JSON`
    5. JSON Input: `["Yes", "No"]`
    6. Save to commit changes.
3. Set parameter value to `Yes`
4. In the query control with the area chart, click the _Advanced Settings_ icon (gear icon)
5. Check the setting `Make this item conditionally visible`
    1. This item is visible if `ShowDetails` parameter value `equals` `Yes`
6. Click _Done Editing_ to commit changes.
7. Click _Done Editing_ on the workbook tool bar to enter read mode.
8. Switch the value of parameter `ShowDetails` to `No`. Notice that the chart below disappears.

The image below shows the visible case where `ShowDetails` is `Yes`

![Image showing the conditional visibility where the chart is visible](./media/workbooks-interactive/conditional-visibility.png)

The image below shows the hidden case where `ShowDetails` is `No`

![Image showing the conditional visibility where the chart is hidden](./media/workbooks-interactive/conditional-invisible.png)

## Next steps


* [Get started](workbooks-visualizations.md) learning more about workbooks many rich visualizations options.
* [Control](workbooks-access-control.md) and share access to your workbook resources.
