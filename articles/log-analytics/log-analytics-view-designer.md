---
title: Create views to analyze data in Azure Log Analytics | Microsoft Docs
description: View Designer in Log Analytics allows you to create custom Views that are displayed in the Azure portal and contain different visualizations of data in the Log Analytics workspace. This article contains an overview of View Designer and procedures for creating and editing custom views.
services: log-analytics
documentationcenter: ''
author: bwren
manager: jwhit
editor: ''

ms.assetid: ce41dc30-e568-43c1-97fa-81e5997c946a
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/18/2018
ms.author: bwren

---
# Use View Designer to create custom views in Log Analytics
The View Designer in [Log Analytics](log-analytics-overview.md) allows you to create custom views in the Azure portal that contain different visualizations of data in your Log Analytics workspace. This article contains an overview of View Designer and procedures for creating and editing custom views.

Other articles available for View Designer are:

* [Tile reference](log-analytics-view-designer-tiles.md) - Reference of the settings for each of the tiles available to use in your custom views.
* [Visualization part reference](log-analytics-view-designer-parts.md) - Reference of the settings for each of the tiles available to use in your custom views.

>[!NOTE]
> If your workspace has been upgraded to the [new Log Analytics query language](log-analytics-log-search-upgrade.md), then queries in all views must be written in the [new query language](https://go.microsoft.com/fwlink/?linkid=856078).  Any views that were created before the workspace was upgraded will be automtically converted.

## Concepts
Views are displayed on the **Overview** page of your Log Analytics workspace in the Azure portal.  The tile for each custom view will be displayed alphabetically with the tiles for the solutions installed the same workspace.

![Overview page](media/log-analytics-view-designer/overview-page.png)

Views created with the View Designer contain the elements in the following table.

| Part | Description |
|:--- |:--- |
| Tile |Displayed on the Overview page for your Log Analytics workspace.  Includes a visual summarizing of the information contained in the custom View.  Different Tile types provide different visualizations of records.  Click on the Tile to open the Custom View. |
| Custom View |Displayed when the user clicks on the Tile.  Contains one or more visualization parts. |
| Visualization Parts |Visualization of data in the Log Analytics workspace based on one or more [log searches](log-analytics-log-searches.md).  Most parts will include a Header that provides a high level visualization and a List of the top results.  Different part types provide different visualizations of records in the Log Analytics workspace.  Click on elements in the part to perform a log search providing detailed records. |


## Work with an existing view
When you open a view that was created with View Designer, it will have a menu with the options in the following table.

![Overview menu](media/log-analytics-view-designer/overview-menu.png)


| Option | Description |
|:--|:--|
| Refresh   | Refresh the view with the latest data. | 
| Analytics | Open the [Advanced Analytics portal](log-analytics-log-search-portals.md#advanced-analytics-portal) to analyze data with log searches.(log-analytics-log-search-portals.md#advanced-analytics-portal). |
| Filter    | Set a time filter for the data included in the view. |
| Edit      | Open the view in View Designer to edit its contents and configuration.   |
| Clone     | Create a new view and open it in the View Designer.  The new view has the same name as the original with "Copy" appended to the end of it. |


## Create a new view
Create a new view in the **View Designer** by clicking on the View Designer tile on the overview page of your Log Analytics workspace in the Azure portal.

![View Designer tile](media/log-analytics-view-designer/view-designer-tile.png)


## Working with View Designer
You'll work with View Designer whether you're creating a new view or editing an existing one.  

The View Designer has three panes.  The **Design** pane contains the custom view that you're creating or editing.  You add tiles and parts from the **Control** pane to the **Design** pane.  The **Properties** pane will display the properties for the tile or selected part.

![View Designer](media/log-analytics-view-designer/view-designer-screenshot.png)

### Configure view tile
A custom view can have only a single tile.  Select the **Tile** tab in the **Control** pane to view the current tile or select an alternate one.  The **Properties** pane will display the properties for the current tile.  Configure the tile properties according to the detailed information in the [Tile Reference](log-analytics-view-designer-tiles.md) and click **Apply** to save changes.

### Configure visualization parts
A view can include any number of visualization parts.  Select the **View** tab and then a visualization part to add to the view.  The **Properties** pane will display the properties for the selected part.  Configure the view properties according to the detailed information in the [Visualization part reference](log-analytics-view-designer-parts.md) and click **Apply** to save changes.

Views only have one row of visualization parts.  Rearrange existing parts in a view by clicking and dragging them to a new location.

You can remove a visualization part from the view by clicking the **X** button in the top right corner of the part.


### Menu options
When you're working with a view in edit mode, you have the menu options in the following table.

![Edit menu](media/log-analytics-view-designer/edit-menu.png)

| Option | Description |
|:--|:--|
| Save        | Save your changes and close the view. |
| Cancel      | Discard your changes and close the view. |
| Delete View | Delete the view. |
| Export      | Export the view to a [Resource Manager template](../azure-resource-manager/resource-group-authoring-templates.md) that you can import into another workspace.  The name of the file will be the name of the view with the extension *omsview*. |
| Import      | Import an *omsview* file that you exported from another workspace.  This will overwrite the configuration of the existing view. |
| Clone       | Create a new view and open it in the View Designer.  The new view has the same name as the original with "Copy" appended to the end of it. |
| Publish     | Export the view to a JSON file that can be inserted into a [Mangagement solution](../operations-management-suite/operations-management-suite-solutions-resources-views.md).  The name of the file will be the name of the view with the extension *json*. A second file is created with the extension *resjson* that includes values for resources defined in the JSON file.

## Next steps
* Add [Tiles](log-analytics-view-designer-tiles.md) to your custom view.
* Add [Visualization Parts](log-analytics-view-designer-parts.md) to your custom view.
