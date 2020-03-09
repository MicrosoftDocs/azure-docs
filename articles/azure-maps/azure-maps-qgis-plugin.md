---
title: Azure Maps plugin for QGIS | Microsoft Docs
description: Azure Maps plugin for QGIS - Private preview
author: farah-alyasari
ms.author: v-faalya
ms.date: 12/18/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Azure Maps plugin for QGIS

The Quantum Geographic Information System [(QGIS)](https://qgis.org/) Software is a professional and a Free and Open Source Software (FOSS) application. The Azure Maps plug-in for QGIS is part of "Private Atlas - Private Preview", and it provIDes users a way to visualize and QA Azure Maps Private Atlas data sets. It also lets users edits and apply changes to the data sets. Azure Maps QGIS plug-in is currently classified under the experimentation label in the QGIS plug-in store. This article guIDes you through the installation process of the Azure Maps QGIS plug-ins, and how to use the plugin to visualize and edit a dataset.

## Prerequisites

Before you can use the the Azure Maps QGIS plugin, you need to [make an Azure Account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account). Then, you need to [download the QGIS Desktop application](https://www.qgis.org/en/site/forusers/download.html), with a version of 3.8.* or higher.

## Install the Azure Maps QGIS plug-in

Follow the steps below to install the Azure Maps QGIS plugin for the QGIS Desktop application.

1. Launch the QGIS application.

   <center>

   ![Qgis application](./media/azure-maps-qgis-plugin/qgis.png)

   </center>

2. Click on **Plugins**, and select **Manage and Install Plugins**.

   <center>

   ![Plugins menu](./media/azure-maps-qgis-plugin/plugin-menu.png)

   </center>

3. In the **Plugins** window, select the **settings** tab. Enable the **Show also experimental plugins** option.

   <center>

   ![Settings](./media/azure-maps-qgis-plugin/enable-experimental-plugins.png)

   </center>

4. In the same **Plugins** window, select the **All** tab. Type "Azure Maps" in the search bar to find the Azure Maps plug-in. The Azure Maps plugin should be listed in the result, click on the **Install Plugin** button. Once the plug-in is installed, you can upgrade to a newer version, if available. Or, you may uninstall and reinstall the plug-in at any time. For more information on how to work with plugins in QGIS, visit the [QGIS plugin documentation](https://docs.qgis.org/3.4/en/docs/user_manual/plugins/plugins.html) page.

   <center>

   ![Install plugin](./media/azure-maps-qgis-plugin/install-plugin.png)

   </center>

## Use the Azure Maps QGIS Plugin

After the installation is complete, the Azure Maps plugin will be accessible via the QGIS plug-in toolbar.

   <center>

   ![Plugin icon](./media/azure-maps-qgis-plugin/plugin-icon.png)

   </center>

Click on the Azure Maps QGIS plugin icon to open the **Azure Maps** window. The **Private Atlas** tab provIDes the options to set the spatial extent for which features are needed. You also need to provIDe your **DataSet ID** in the this tab. And, you need to provIDe your Azure Maps account **primary subscription key** in the **Authentication** tab. ProvIDing the **DataSet ID** and the account **primary subscription key** lets you access and save the private atlas data set.

   <center>

   ![Private Atlas tab](./media/azure-maps-qgis-plugin/private-atlas-tab.png)
   ![Authentication tab](./media/azure-maps-qgis-plugin/authentication-tab.png)

   </center>

The **Floor Picker** tab provIDes options to select the floor number and visualize the selected floor. Before you can select the floor number, you'll need to load your data set.

   <center>

   ![Floor picker](./media/azure-maps-qgis-plugin/floor-picker.png)
   ![Layers panel](./media/azure-maps-qgis-plugin/layers-panel.png)

   </center>

 To load your data set, provIDe **DataSet ID**, and **primary subscription key**, then Press the **get features** button. Once this request completes processing, in the **Layers** panel, you'll see layers with the features of you data set. The layers reflect the content in your DWG package. For example, you will find a _unit_ layer and a _level_ layer. You can zoom into a layer or edit the layer by right clicking on the layer and choosing **Zoom to Layer** or **Open Attribute Table**, respectively. The **Layers** panel supports more features, see the [full list of collection features](#Full-list-of-feature-collections)

   <center>

   ![Layers panel options](./media/azure-maps-qgis-plugin/layer-panel-options.png)

   </center>

### Edit a datasets

Once you view the features, you might want to make minor modification or soft touches to keep your data fresh. Although the QGIS application lets you make geometry changes, add features, or delete features, we recommend that you use the application only to edit the properties of the features. In this section, we discuss common edits you'll likely perform on your data set.

#### Update a feature collection

The feature collection in your **Layers** panel is imported using the **DWG convert API**. All the features listed in the [Feature collection ID column of the features table](#Full-list-of-feature-collections) can be updated, except the _point_, _line_, and _area_element_ feature. Follow the steps below to change the name of a unit, assuming a scenario where the building space has been repurposed.

1. In the Azure Maps plugin, select the **Floor Picker** tab. Choose the floor where the unit to be edited is mapped. You may skip this step, but the list of units on all floors will appear in the next step.

2. In the **Layers** panel in the QGIS application, make sure the **unit** layer is selected. Right-click on the **unit** layer, and select **Open Attribute Table** from the menu.

   <center>

   ![Unit menu](./media/azure-maps-qgis-plugin/unit-menu.png)

   </center>

3. In the attribute table, click on the **edit** button near the top-left of the window. Double-click the name of the unit that you want to rename, and rename it. Click the **save** button in the toolbar menu.

   <center>

   ![Unit attribute table](./media/azure-maps-qgis-plugin/attribute-table.png)

   </center>

If the changes made to the data set were successful, you'll see a success message like the one below. In case your changes were not successful, you will see a failure message.

   <center>

   ![Success message](./media/azure-maps-qgis-plugin/success.png)

   </center>

#### Update project-specific features

You might want to add, edit or delete project-specific features, such as furniture and other point and line of interest. If you want to add an object to your map, then you need to first add a category for this object to your list of categories. If you already have a category for this object in your list of categories, then use the existing category ID assigned to it. The example below explain how to add a desk to your map. It's assumed that you don't have a desk category in your data set, so the steps show you how to first add a new category.

1. Add a new Category and obtain its ID

   1. Click on the **category** layer in the **Layers** panel, and click on the **edit** icon in the toolbar. Then, click the **Add Record** icon in the toolbar, it's next to the **edit** button.

      <center>

      ![Add category](./media/azure-maps-qgis-plugin/add-category.png)

      </center>

   2. In the **Feature Attribute** window, define the attributes for the category. The list of supported categories can be found [here](https://aka.ms/pa-indoor-spacecategories). In the example below we are adding the **furniture.desk** category, which will be used when creating an _area_element_ for the desk.

      <center>

      ![Category features](./media/azure-maps-qgis-plugin/category-feature-attributes.png)

      </center>

   3. Click the **Save Layer Edits** button, next to the **Add Record** button, to save the new category to the data set. Upon a successful save you will see a success message.

      <center>

      ![Add category](./media/azure-maps-qgis-plugin/plugin-save-icon.png)

      </center>

   4. To see the assigned category ID, reload the data set by clicking the **Get Features** button in the **Private Atlas** tab. If you to closed the **Azure Maps** window, that's okay, you can open the window again and click **Get Features**.

   5. Right click on the **category** layer in **Layers** panel. Click on **Open Attributes Table**, and you should be able to see the new category in the list along with its unique category ID. Copy the **ID** for the category, you may right click and select **Copy Cell Content**.

      <center>

      ![Category table](./media/azure-maps-qgis-plugin/categories-table.png)

      </center>

2. Next, we will acquire the unit ID, and we'll add the desk to this unit. Right click on the **unit** layer in the **Layers** panel. Click on **OpenAttribute Table**. Copy the **ID** of the desired unit.

      <center>

      ![Unit table](./media/azure-maps-qgis-plugin/unit-table.png)

      </center>

3. To add a desk to the unit, choose **area_element** in the **Layers** panel. Click the **edit** icon, then click on the **Add Polygon Feature** button in the toolbar. On the map, draw a polygon representing the desk in the unit you, and click **save** right-click to open the **Feature Attributes** window. In the **Feature Attributes** window, provIDe the following required information and click **OK**:

      | | |
      | :-- | :-- |
      | **original_ID** | Give an original ID of your choice |
      | **category_ID** | ProvIDe the category ID for the desk category |
      | **unit_ID** | ProvIDe the unit ID to add the desk to this unit |
      | **name** | Give a name for the element |

The information in the image below are possible options that you could choose.

   <center>

   ![Element features attributes](./media/azure-maps-qgis-plugin/feature-attributes.png)

   </center>

4. Once you provIDe the required information, you should be able to see the element on the map. Click the **Save Layer Edits** button in the toolbar to save changes to your data set.

   <center>

   ![Element map](./media/azure-maps-qgis-plugin/element-map.png)

   </center>

5. You should also be able to see the new category we generated in the previous steps. Right click on **area_element** layer in the **Layers** panel, and click on the **Open Attributes Table**, and see the new category in the list along with the unique category ID that we generated in the previous steps.

   <center>

    ![Element table](./media/azure-maps-qgis-plugin/element-table.png)

   <center>

These steps concludes the general processes to add an element for the `furniture.desk` feature type. You can follow similar steps to add an element of another feature type to the map. See the [list of feature collections](#Full-list-of-feature-collections) to learn more about more features can be added. And, see the [supported categories](https://atlas.microsoft.com/sdk/javascript/indoor/0.1/categories.json) that can describe the feature type.  

## Full list of feature collections

The feature collections is documented and exposed via the WFS API. The table below shows the full list of feature collections. 

| Feature collection ID | Description |
|---------|-------------|
| category | Category names. For example,  \"room.conference\". The _is_routable_ attribute puts a feature with that category on the routing graph. The _route_through_behavior_ attribute determines whether a feature can be used for through traffic or not.
| directory_info | Name, address, phone number, website, and hours of operation for a unit, facility, or an occupant of a unit or facility. |
| vertical_penetration | An area that, when used in a set, represents a method of navigating vertically between levels. It can be used to model stairs, elevators etc. Geometry can overlap units and other vertical penetration features. |
| zone | A virtual area. ex, wifi zone, emergency assembly area. Zones can be used as destinations but not meant for through traffic.|
| opening | A usually traversable boundary between two units, or a unit and vertical_penetration.|
| unit | A physical and non-overlapping area that might be occupied and traversed by a navigating agent. It can be a hallway, a room, a courtyard, etc. It is surrounded by physical obstruction, such as a wall, unless the _is_open_area_ attribute is equal to true. The user must add openings where the obstruction shouldn't be there. If _is_open_area_ attribute is equal to true, all the sIDes are assumed open to the surroundings and walls are to be added where needed. Walls for open areas are represented as a _line_element_ or an _area_element_ with _is_obstruction_ set to true. |
| level | An indication of the extent and vertical position of a set of features.|
| facility | An area of the site, such as a building footprint.|
| point_element | A point feature in a unit, such as a printer or a device. |
| line_element | A line feature in a unit, such as a divIDing wall or window.|
| area_element | A polygon feature in a unit, such as an area open to below, an obstruction like an island in a unit.|

## Known limitations

The following are limitations to keep in mind when using the Azure Maps QGIS plug-in to make edits to your data set.

1. Azure Maps QGIS plug-in doesn't currently support concurrent editing. It's recommended that only a single user at a time performs edits and apply changes to a dataset.

2. Before changing floors, make sure you save your edits for the current floor you're working on. Changes done on a given floor will be lost if you don't save before changing the floor.

## Next steps

Learn more about Indoor Maps from Azure Maps by reading the following articles:

> [!div class="nextstepaction"]
> [Indoor Maps data management](indoor-data-management.md)

> [!div class="nextstepaction"]
> [Indoor Maps dynamic styling](indoor-map-dynamic-styling.md)