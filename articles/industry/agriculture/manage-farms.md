---
title: Manage Farms
description: Describes how to manage farms
author: uhabiba04
ms.topic: article
ms.date: 10/04/2019
ms.author: v-umha
---


# Manage farms

  You can manage your farms in the FarmBeats project. This article provides the information create farms, install devices, sensors, and drones to the individual farms.

## Create farms

Follow the steps:

  1.	Login to the Farm Accelerator, the **Farms** page displays.

    > [!NOTE]
    > The Farms page displays the list of farms in case they have already been created in subscription.

    ![Project Farm Beats](./media/create-farms/create-farm-main-page.png)

  2. Select **Create Farm** and provide **Name**, **Crops** and **Address**.
  3. In the **Define Farm Boundary**, select either **Mark on Map** or **Paste GeoJSON code**, which is a mandatory field.

  There are two ways to define farm boundary:

    1.	**Mark on Map**: Use the map control tool to draw and mark the boundary of the farm. To mark the boundaries, click ![Project Farm Beats](./media/create-farms/pencil-icon.png) and mark the exact boundaries.

      ![Project Farm Beats](./media/create-farms/create-farm-mark-on-map.png)

    2.	**Paste GeoJson Code**: The GeoJSON is a format for encoding geographical data structures, using JavaScript Object Notation (JSON). This option displays a text box where a GeoJSON string can be entered to mark the farm boundaries. You can also create GeoJSON code from GeoJSON.io.

      ![Project Farm Beats](./media/create-farms/create-new-farm.png)

    3.	Use the tooltips to help fill in the information.
    4.	Click **Submit** to create a farm. A new farm is created and displayed in the Farms page.

## View farm

  The Farm list page displays a list of created farms. Select a farm to view the list of:

  1.	**Device count** — displays the number and status of devices deployed within the farm.
  2.	**Map** — map of the farm with the devices deployed in the farm.
  3.	**Telemetry** — displays the telemetry from the sensors deployed in the farm.
  4.	**Latest Precision Maps** — displays the latest Satellite Indices (EVI, NDWI), soil moisture
  and sensor placement map.


## Edit farm

  The **Farms** page displays a list of created farms.
  1.	Select a farm to view and edit the farm.
  2.	Click **Edit Farm** to edit the farm information. In the **Farm Details** window, you can edit **Name**, **Crops**, **Address**, and **Farm Boundary** fields.

    ![Project Farm Beats](./media/create-farms/edit-farm.png)

  3.	Click **Submit** to save the details edited.

## Delete farm

  The **Farms** page displays a list of created farms.
  1.	Select a farm from the list to delete farm details.
  2.	Click **Delete Farm** to delete the farm.

    ![Project Farm Beats](./media/create-farms/delete-farm.png)

    > [!NOTE]
    > All the associated devices and maps with the farm will not be deleted. However, the farm details on these devices and maps are invalid. The devices, telemetry and the maps can still be viewed from the application.


## Next steps

You have created your Farm now. See how you can get sensor data flowing into your farm
