---
title: Azure Maps plugin for QGIS | Microsoft Docs
description: Azure Maps plugin for QGIS - Private preview
author: walsehgal
ms.author: v-musehg
ms.date: 12/18/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Azure Maps plugin for QGIS

The Quantum Geographic Information System [(QGIS)](https://qgis.org/) Software is a professional and a Free and Open Source Software (FOSS) application. The Azure Maps plug-in for QGIS is part of "Private Atlas - Private Preview", and it provides users a way to visualize and QA Azure Maps Private Atlas data sets. It also lets users edits and apply changes to the data sets. Azure Maps QGIS plug-in is currently classified under the experimentation label in the QGIS plug-in store. This article guides you through the installation process of Azure Maps QGIS plug-ins, and how to use the plugin to visualize and edit a chosen set of data.

## Prerequisites

Before you can use the the Azure Maps QGIS plugin, you need to [make an Azure Account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [obtain a subscription key](). Then, you need to [download the QGIS Desktop application](https://www.qgis.org/en/site/forusers/download.html), with a version of 3.8.* or higher.

## Install the Azure Maps QGIS plug-in

Follow the steps below to install the Azure Maps QGIS plugin for the QGIS Desktop application.

1. Launch the QGIS application.
    
   ![Qgis application](./media/azure-maps-qgis-plugin/qgis.png)

2. Click on **plugins**, and select **Manage and Install Plugins**.

   ![Plugins menu](./media/azure-maps-qgis-plugin/plugin-menu.png)

3. In the plugins window, select the **settings** tab. Enable the **Show also experimental plugins** option.

   ![Settings](./media/azure-maps-qgis-plugin/enable-experimental-plugins.png)


4. In the same **plugins** window, select the **All** tab. Type "Azure Maps" in the search bar to find the Azure Maps plug-in. The Azure Maps plugin should be listed in the result, click on the **Install Plugin** button. Once the plug-in is installed, you can upgrade to a newer version if available. Or, you may uninstall and reinstall the plug-in at any time. For more information on how to work with plugins in QGIS, visit the [QGIS plugin documentation](https://docs.qgis.org/3.4/en/docs/user_manual/plugins/plugins.html) page.

   ![Install plugin](./media/azure-maps-qgis-plugin/install-plugin.png)

## Use the Azure Maps QGIS Plugin

After installing the Azure Maps plugin, this Azure Maps tool will be accessible via the QGIS plug-in toolbar.

   ![Plugin icon](./media/azure-maps-qgis-plugin/plugin-icon.png)

Click on the plugin button to access the toolbar. The toolbar contains three tabs. You need to provide your dataset ID in the **Private Atlas** tab. You also need to provide your Azure Maps account primary subscription key in the **Authentication** tab. Providing the dataset ID and the account primary subscription key lets you access and save the private atlas dataset. 

The plugin also lets users set the spatial extent for which features are needed. Press the **get features** button in the **Private Atlas** tab. Once this request completes processing, you'll see a layer table of content. This table should rreflect the content in your DWG package. For example, you will find a Units layer and a Level layer, those layers reflect what you configured in the process of converting the DWG packages.

   ![Private Atlas tab](./media/azure-maps-qgis-plugin/private-atlas-tab.png) ![Authentication tab](./media/azure-maps-qgis-plugin/authentication-tab.png) ![Floor picker](./media/azure-maps-qgis-plugin/floor-picker.png)

After getting the features, a new **Floor Picker** tab appears. This tab provides options to select the floor number and visualize the selected floor.

You should also be able to see the list of feature collections in the **Layers** Panel of the QGIS application. You can zoom into a layer or edit a layer by right clicking on the layer and choosing **Zoom to Layer** or **Open Attribute Table**,respectively.

   ![Layers panel](./media/azure-maps-qgis-plugin/layers-panel.png)


The list of feature collections is also documented and exposed via a WFS API. The full list of feature collections is as follows:

| Feature collection ID | Description |
|---------|-------------|
| category | Category names. For example,  \"room.conference\". The _is_routable_ attribute puts a feature with that category on the routing graph. The _route_through_behavior_ attribute determines whether a feature can be used for through traffic or not.
| directory_info | Name, address, phone number, website, and hours of operation for a unit, facility, or an occupant of a unit or facility. |
| vertical_penetration | An area that, when used in a set, represents a method of navigating vertically between levels. It can be used to model stairs, elevators etc. Geometry can overlap units and other vertical penetration features. |
| zone | A virtual area. ex, wifi zone, emergency assembly area. Zones can be used as destinations but not meant for through traffic.|
| opening | A usually traversable boundary between two units, or a unit and vertical_penetration.|
| unit | A physical and non-overlapping area that might be occupied and traversed by a navigating agent. It can be a hallway, a room, a courtyard, etc. It is surrounded by physical obstruction, such as a wall, unless the _is_open_area_ attribute is equal to true. The user must add openings where the obstruction shouldn't be there. If _is_open_area_ attribute is equal to true, all the sides are assumed open to the surroundings and walls are to be added where needed. Walls for open areas are represented as a _line_element_ or an _area_element_ with _is_obstruction_ set to true. |
| level | An indication of the extent and vertical position of a set of features.|
| facility | An area of the site, such as a building footprint.|
| point_element | A point feature in a unit, such as a printer or a device. |
| line_element | A line feature in a unit, such as a dividing wall or window.|
| area_element | A polygon feature in a unit, such as an area open to below, an obstruction like an island in a unit.|


### Edit a datasets

Once you view the features, you might want to make minor modification or soft touches to keep your data fresh. Although the QGIS application lets you make geometry changes, add features, or delete features, we recommend that you use the application only to edit the properties of the features. In this section, we discuss common edits you'll likely perform on your dataset.

#### Update a feature collection

You may update any feature collection imported via the **DWG convert API**. This includes all the features listed in the "Feature collection ID" table, except the _point_, _line_, and _area_element_ feature. Follow the steps below to change unit name, assuming a scenario where the building space has been repurposed. 

1. In the Azure Maps plugin, select the **Floor Picker** tab. Choose the floor where the unit to be edited is mapped.
    
2. In the **Layers** panel in the QGIS application, make sure the **unit** layer is selected. Right-click on the **unit** layer, and select **Open Attribute Table** from the menu.

   ![Unit menu](./media/azure-maps-qgis-plugin/unit-menu.png)

3. In the attribute table, click on the **edit** button near the top-left of the window. Double-click the name of the unit that you want to rename, and rename it. Click the **save** button in the toolbar menu.
    
   ![Unit attribute table](./media/azure-maps-qgis-plugin/attribute-table.png)

If the changes made to the dataset were successful, you will see a success message like the one below. In case your changes were not successful, you will see a failure message.


<center>

![Success message](./media/azure-maps-qgis-plugin/success.png)</center>

#### Update project-specific features

You might also face a scenario where you want to add, edit or delete project-specific features, such as furniture and other point and line of interest. If you want to add an object to your map, then you need to first add a category for this object to your list of categories. But, if you already have a category for this object in your list of categories, then use the existing category ID assigned to it. The example below explain how to add a desk to your map. It's assumed that you don't have a desk category in your dataset, so the steps show you how to add a new category and obtain its category ID.

1. Add a new Category and obtain its ID

   1. Right click on the **category** layer in the **Layers** panel. Click on the **edit** button in the toolbar. Then, click the **Add Record** button in the toolbar, it's next to the **edit** button.

      ![Add category](./media/azure-maps-qgis-plugin/add-category.png)

   2. In the feature attribute window, define the attributes for the category. The list of supported categories can be found [here](https://aka.ms/pa-indoor-spacecategories). In the example below we are adding the **furniture.desk** category, which will then used be when creating an _area_element_ feature for the desk.

      ![Category features](./media/azure-maps-qgis-plugin/category-feature-attributes.png)

   3. Click the **Save Layer Edits** button, next to the **Add Record** button, to save the new category to the dataset. Upon a successful save you will see a success message.

   4. To see the assigned category Id, reload the dataset by clicking the **Get Features** button in the **Private Atlas** tab of the plugin window. 

   5. Right click on the **category** layer in **Layers** panel. Click on **Show Attributes Table**, and you should be able to see the new category in the list along with its unique category ID. Copy the category ID.

      ![Category table](./media/azure-maps-qgis-plugin/categories-table.png)


2. Next, we will acquire the unit Id of the unit we want to add the desk to. Right click on the **unit** layer in the **Layers** panel to obtain the unit Id. Click on **OpenAttribute Table**. From the table, copy the unit Id of the unit you want to add the desk to.

    ![Unit table](./media/azure-maps-qgis-plugin/unit-table.png)

3. To add a desk to the unit, choose **area_element** in the **Layers** panel. Click on the **Add Polygon Feature** button in the toolbar. On the map, draw a polygon representing the desk in the unit you want the desk to be in, and right-click to open the Feature Attributes window. In the Feature Attributes window provide the following required information and click **OK**:

        | | |
        | :-- | :-- |
        | **original_id** | Give an original ID of your choice |
        | **category_id** | Provide the category ID for the desk category |
        | **unit_id** | Provide the unit ID to add the desk to this unit |
        | **name** | Give a name for the element |

    ![Element features attributes](./media/azure-maps-qgis-plugin/feature-attributes.png)

4. Once you provide the required information, you should be able to see the element on the map. Click the **Save Layer Edits** button in the toolbar to save changes to your dataset.

    ![Element map](./media/azure-maps-qgis-plugin/element-map.png)

5. Reload the dataset and choose the floor where you added the element. Right click on **area_element** layer in the **Layers** panel. Click on **Show Attributes Table**, you should be able to see the new category in the list along with the unique category ID.

    ![Element table](./media/azure-maps-qgis-plugin/element-table.png)

## Known limitations

The following are limitations to keep in mind when using the Azure Maps QGIS plug-in to make edits to your dataset.

1. Azure Maps QGIS plug-in doesn't currently support concurrent editing. It's recommended that only a single user at a time performs edits and apply changes to a dataset.

2. Before changing floors, make sure you save your edits for the current floor you're working on. Changes done on a given floor will be lost if you don't save before changing the floor. 