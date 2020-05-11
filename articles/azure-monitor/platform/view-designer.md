---
title: Create views to analyze log data in Azure Monitor | Microsoft Docs
description: By using View Designer in Azure Monitor, you can create custom views that are displayed in the Azure portal and contain a variety of visualizations on data in the Log Analytics workspace. This article contains an overview of View Designer and presents procedures for creating and editing custom views.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/10/2019

---

# Create custom views by using View Designer in Azure Monitor
By using View Designer in Azure Monitor, you can create a variety of custom views in the Azure portal that can help you visualize data in your Log Analytics workspace. This article presents an overview of View Designer and procedures for creating and editing custom views.

> [!IMPORTANT]
> Views in Azure Monitor are being phased out and replaced with [workbooks](workbooks-overview.md) which provide additional functionality. See [Azure Monitor view designer to workbooks transition guide](view-designer-conversion-overview.md) for details on converting your existing views to workbooks.

For more information about View Designer, see:

* [Tile reference](view-designer-tiles.md): Provides a reference guide to the settings for each of the available tiles in your custom views.
* [Visualization part reference](view-designer-parts.md): Provides a reference guide to the settings for the visualization parts that are available in your custom views.


## Concepts
Views are displayed in the Azure Monitor **Overview** page in the Azure portal. Open this page from the **Azure Monitor** menu by clicking **More** under the **Insights** section. The tiles in each custom view are displayed alphabetically, and the tiles for the monitoring solutions are installed the same workspace.

![Overview page](media/view-designer/overview-page.png)

The views that you create with View Designer contain the elements that are described in the following table:

| Part | Description |
|:--- |:--- |
| Tiles | Are displayed on your Azure Monitor **Overview** page. Each tile displays a visual summary of the custom view it represents. Each tile type provides a different visualization of your records. You select a tile to display a custom view. |
| Custom view | Displayed when you select a tile. Each view contains one or more visualization parts. |
| Visualization parts | Present a visualization of data in the Log Analytics workspace based on one or more [log queries](../log-query/log-query-overview.md). Most parts include a header, which provides a high-level visualization, and a list, which displays the top results. Each part type provides a different visualization of the records in the Log Analytics workspace. You select elements in the part to perform a log query that provides detailed records. |

## Required permissions
You require at least [contributor level permissions](manage-access.md#manage-access-using-azure-permissions) in the Log Analytics workspace to create or modify views. If you don't have this permission, then the View Designer option won't be displayed in the menu.


## Work with an existing view
Views that were created with View Designer display the following options:

![Overview menu](media/view-designer/overview-menu.png)

The options are described in the following table:

| Option | Description |
|:--|:--|
| Refresh   | Refreshes the view with the latest data. | 
| Logs      | Opens the [Log Analytics](../log-query/portals.md) to analyze data with log queries. |
| Edit       | Opens the view in View Designer to edit its contents and configuration.  |
| Clone      | Creates a new view and opens it in View Designer. The name of the new view is the same as the original name, but with *Copy* appended to it. |
| Date range | Set the date and time range filter for the data that's included in the view. This date range is applied before any date ranges set in queries in the view.  |
| +          | Define a custom filter that's defined for the view. |


## Create a new view
You can create a new view in View Designer by selecting **View Designer** in the menu of your Log Analytics workspace.

![View Designer tile](media/view-designer/view-designer-tile.png)


## Work with View Designer
You use View Designer to create new views or edit existing ones. 

View Designer has three panes: 
* **Design**: Contains the custom view that you're creating or editing. 
* **Controls**: Contains the tiles and parts that you add to the **Design** pane. 
* **Properties**: Displays the properties of the tiles or selected parts.

![View Designer](media/view-designer/view-designer-screenshot.png)

### Configure the view tile
A custom view can have only a single tile. To view the current tile or select an alternate one, select the **Tile** tab in the **Control** pane. The **Properties** pane displays the properties of the current tile. 

You can configure the tile properties according to the information in the [Tile reference](view-designer-tiles.md) and then click **Apply** to save the changes.

### Configure the visualization parts
A view can include any number of visualization parts. To add parts to a view, select the **View** tab, and then select a visualization part. The **Properties** pane displays the properties of the selected part. 

You can configure the view properties according to the information in the [Visualization part reference](view-designer-parts.md) and then click **Apply** to save the changes.

Views have only one row of visualization parts. You can rearrange the existing parts by dragging them to a new location.

You can remove a visualization part from the view by selecting the **X** at the top right of the part.


### Menu options
The options for working with views in edit mode are described in the following table.

![Edit menu](media/view-designer/edit-menu.png)

| Option | Description |
|:--|:--|
| Save        | Saves your changes and closes the view. |
| Cancel      | Discards your changes and closes the view. |
| Delete View | Deletes the view. |
| Export      | Exports the view to an [Azure Resource Manager template](../../azure-resource-manager/templates/template-syntax.md) that you can import into another workspace. The name of the file is the name of the view, and it has an *omsview* extension. |
| Import      | Imports the *omsview* file that you exported from another workspace. This action overwrites the configuration of the existing view. |
| Clone       | Creates a new view and opens it in View Designer. The name of the new view is the same as the original name, but with *Copy* appended to it. |

## Next steps
* Add [Tiles](view-designer-tiles.md) to your custom view.
* Add [Visualization parts](view-designer-parts.md) to your custom view.
