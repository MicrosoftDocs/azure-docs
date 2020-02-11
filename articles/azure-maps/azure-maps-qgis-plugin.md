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

[QGIS](https://www.qgis.org/en/site/about/index.html) is a Free and Open Source Software (FOSS) professional GIS application available at https://qgis.org/. The Azure Maps plugin is part of Private Atlas - Private Preview and provides you a way to visualize and QA Azure Maps Private Atlas datasets as well as make edits and apply changes to datasets. The plugin is classified experimentation in the QGIS plugin store. This article guides you through how to install Azure Maps QGIS plugin and visualize and edit your dataset using it.


## System requirements and Installation steps

The Azure Maps plugin requires an installation of QGIS Desktop version 3.8.* or newer versions. 

In order to install the plug-in, follow the steps below.

1. Launch QGIS application.
    
   ![Qgis application](./media/azure-maps-qgis-plugin/qgis.png)

2. Click on **plugins**, and select **Manage and Install Plugins...**.

   ![Plugins menu](./media/azure-maps-qgis-plugin/plugin-menu.png)

3. In the plugins window, select **settings** tab and enable **Show also experimental plugins**.

   ![Settings](./media/azure-maps-qgis-plugin/enable-experimental-plugins.png)    


4. Select the **All** tab and search for the Azure Maps plugin by typing "Azure Maps" in the search bar. The Azure Maps plugin should be listed in the result, click on **Install Plugin** button to install the plugin. Once installed you can upgrade to a newer version if available or uninstall and reinstall as well. For more information on how to work with plugins in QGIS, visit the [QGIS plugin documentation page](https://docs.qgis.org/3.4/en/docs/user_manual/plugins/plugins.html).

   ![Install plugin](./media/azure-maps-qgis-plugin/install-plugin.png)
    
## Azure Maps Plugin

After installing the Azure Maps plugin, a new Azure Maps tool will be accessible via the QGIS plugin toolbar.

   ![Plugin icon](./media/azure-maps-qgis-plugin/plugin-icon.png)

To access the plugin toolbar, click on the plugin button. The toolbar contains three tabs. In order to access and eventually save the private atlas dataset, you need to provide your dataset ID in the **Private Atlas** tab and provide your Azure Maps account key in the **Authentication** tab. Optionally the plugin allows you to set the spatial extent for which features are needed. Press **get features** button in the **Private Atlas** tab and what you will get, at the end of the process, is a layer table of content that should reflect familiar concepts. You will find, for example, a Units layer and a Level layer, which reflect what you configured through the process of converting DWG packages. The **Floor Picker** tab allows you to select the floor number and visualize it.

   ![Private Atlas tab](./media/azure-maps-qgis-plugin/private-atlas-tab.png) ![Authentication tab](./media/azure-maps-qgis-plugin/authentication-tab.png) ![Floor picker](./media/azure-maps-qgis-plugin/floor-picker.png)

After getting the features, you should be able to see the list of feature collections in the **Layers** Panel of the QGIS application. You can zoom into or edit a layer by doing a right click on the layer and choosing **Zoom to Layer** or **Open Attribute Table** respectively.

   ![Layers panel](./media/azure-maps-qgis-plugin/layers-panel.png)


The list of feature collections is also documented and exposed via the WFS API. The full list of feature collections is as follows:

| Feature collection ID | Description |
|---------|-------------|
| category | Category names. For example,  \"room.conference\". The is_routable attribute puts a feature with that category on the routing graph. The route_through_behavior attribute determines whether a feature can be used for through traffic or not.
| directory_info | Name, address, phone number, website, and hours of operation for a unit, facility, or an occupant of a unit or facility. |
| vertical_penetration | An area that, when used in a set, represents a method of navigating vertically between levels. It can be used to model stairs, elevators etc. Geometry can overlap units and other vertical penetration features. |
| zone | A virtual area. ex, wifi zone, emergency assembly area. Zones can be used as destinations but not meant for through traffic.|
| opening | A usually traversable boundary between two units, or a unit and vertical_penetration.|
| unit | A physical and non-overlapping area that might be occupied and traversed by a navigating agent. Can be a hallway, a room, a courtyard, etc. It is surrounded by physical obstruction (wall), unless the is_open_area attribute is equal to true, and one must add openings where the obstruction shouldn't be there. If is_open_area attribute is equal to true, all the sides are assumed open to the surroundings and walls are to be added where needed. Walls for open areas are represented as a line_element or area_element with is_obstruction equal to true. |
| level | An indication of the extent and vertical position of a set of features.|
| facility | Area of the site, building footprint etc.|
| point_element | A point feature in a unit, such as a printer or a device. |
| line_element | A line feature in a unit, such as a dividing wall, window.|
| area_element | A polygon feature in a unit, such as an area open to below, an obstruction like an island in a unit.|


### Editing datasets

Once you get the features, you might want to edit your dataset for minor changes or additions. Below we discuss some scenarios you might want to accomplish.

> [!Note]
> While the application allows you to, but we recommend you to limit your editing to property changes only i.e no geometry changes and adding or deleting features.

There may be a scenario where you might want to make some soft touches to keep your data up to date. This applies to any feature collection that was imported via **DWG convert API**, which includes all the features listed in the table above except point/line/area_element. Lets take an example where we want to change unit name because the space has been repurposed. Follow the steps below to make this change.

1. In the Azure Maps plugin, select the **Floor Picker** tab and choose the floor where the unit to be edited is mapped.
    
2. In the **Layers** panel in the QGIS application, right-click on the **unit** layer (make sure it is checked/selected) and select **Open Attribute Table** from the menu.

   ![Unit menu](./media/azure-maps-qgis-plugin/unit-menu.png)

3. In the attribute table window, click on the edit button on the top left of the window and then double-click the name of the unit that you want to rename, rename it and click the save button in the toolbar menu.
    
   ![Unit attribute table](./media/azure-maps-qgis-plugin/attribute-table.png)

If the changes made to the dataset are successfull, you will see a success message like the one below. In case your changes were not successful, you will get a failure message.


<center>

![Success message](./media/azure-maps-qgis-plugin/success.png)</center>


You might also face a scenario where you want to add, edit or delete project-specific features, such as furniture and other point and line of interest. Lets take an example where you want to add a desk to your map, if the desk category doesn't currently exists in your categories, you might want to first add a category to the list of categories. In case you want to add an object type that is already in your category list, use the existing category ID assigned to it. Below we explain how to add a new category to your dataset and ultimately add a desk.

1. In order to add a desk to the dataset we will add an area element, and to do so we add a new category to the list of categories. The following steps show you how to add a new category:

   1. Right click on **category** layer in **Layers** panel, and click on the edit button in the toolbar. Click the **Add Record** button in the toolbar next to the edit button.
    
      ![Add category](./media/azure-maps-qgis-plugin/add-category.png)
        
   2. In the feature attribute window, define the attributes for the category. The list of supported categories can be found [here](https://aka.ms/pa-indoor-spacecategories), for example below we are adding furniture.desk that will be then used when creating area_element features for desks

      ![Category features](./media/azure-maps-qgis-plugin/category-feature-attributes.png)

   3. Click the **Save Layer Edits** button next to the **Add Record** button to save the category to the dataset. Upon a successful save you will get a success message.

   4. To see the assigned category Id, reload the dataset by clicking the **Get Features** button of the **Private Atlas** tab of the plugin. 
          
   5. Right click on **category** layer in **Layers** panel and click on **Show Attributes Table**, you should be able to see the new category in the list along with the unique category ID.

      ![Category table](./media/azure-maps-qgis-plugin/categories-table.png)


2. Next, we will get the unit Id of the unit we want to add the desk to. To get the unit Id, right click on **unit** layer in **Layers** panel and click on **OpenAttribute Table**. From the table, copy the unit Id of the unit you want to add the desk to. 
    ![Unit table](./media/azure-maps-qgis-plugin/unit-table.png)

3. To add a desk to the unit, choose **area_element** in **Layers** panel and then click on the **Add Polygon Feature** button in the toolbar. On the map, draw a polygon representing the desk in the unit you want the desk to be in and right-click to open the Feature Attributes window. In the Feature Attributes window provide the following required information and click **OK**:
        * **original_id**: You can provide an original ID of your choice.
        * **category_id**: Provide category ID for the desk category we created earlier.
        * **unit_id**: Provide use the unit ID copied from the unit table.
        * **name**: Enter a name for the element.
    
    ![Element features attributes](./media/azure-maps-qgis-plugin/feature-attributes.png)

4. Once you provide the required information, you should be able to see te element on the map. Click the **Save Layer Edits** button in the toolbar to save changes to your dataset.

    ![Element map](./media/azure-maps-qgis-plugin/element-map.png)

5. Reload the dataset and choose the floor where you added the element. Right click on **area_element** layer in **Layers** panel and click on **Show Attributes Table**, you should be able to see the new category in the list along with the unique category ID.
    
    ![Element table](./media/azure-maps-qgis-plugin/element-table.png)

## Known limitations

Following are the limitations to Keep in mind when using the Azure Maps QGIS plugin to make edits to your dataset.

1. No concurrent data editing supported at this stage. It’s recommended that a single user at the time performs edits and apply changes to a dataset.

2. Use an edit and save process for each floor you will be working on, changes done on a given floor will be lost when changing floor.