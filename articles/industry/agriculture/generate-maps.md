---
title: Generate maps
description: Describes how to generate maps in FarmBeats
author: uhabiba04
ms.topic: article
ms.date: 11/04/2019
ms.author: v-umha
---

# Generate maps

Using Azure FarmBeats, you can generate the following maps by using satellite imagery and sensor data inputs. Maps help you in viewing the geographical location of your farm, and identify the appropriate location for your devices.

  -  **Sensor Placement map** – provides recommendations on how many sensors to use and where to place them in a farm.
  - **Satellite Indices map** – shows vegetation index and water index for a farm.
  - **Soil Moisture map** – shows soil moisture distribution by fusing satellite data and sensor data.

## Sensor Placement maps

FarmBeats Sensor Placement map assists you with the placement of soil moisture sensors. The map output consists of a list of coordinates for sensor deployment. The inputs from these sensors are used along with satellite imagery to generate the Soil Moisture Heatmap.  

This map is derived by segmenting the canopy as seen over multiple dates throughout the year, even bare soil and buildings are part of the canopy. You can remove sensors that are not required on the location. This map is for guidance and you can alter the position and numbers slightly based on your custom knowledge (adding sensors will not regress soil moisture heat map results but there is a possibility of deterioration in heat map accuracy if sensor number is reduced).  

## Before you begin  

Ensure the following before you attempt to generate a Sensor Placement map:

- Farm size must be more than one acre.
- The number of cloud-free Sentinel scenes must be more than six for the selected date range.  
- At least six cloud-free Sentinel scenes must have NDVI>=0.3.

    > [!NOTE]
    > Sentinel allows only two concurrent threads per user. As a result, jobs will get queued and might take longer to complete.

### Dependencies on sentinel  

The following are Sentinel dependencies:

- We depend on Sentinel performance for downloading satellite images. Check Sentinel performance status and maintenance [activities](https://scihub.copernicus.eu/twiki/do/view/SciHubNews/WebHome).
- Sentinel allows only two concurrent [downloads threads](https://sentinels.copernicus.eu/web/sentinel/sentinel-data-access/typologies-and-services) per user.
- Precision map generation will be affected by [Sentinel coverage and revisit frequency]( https://sentinel.esa.int/web/sentinel/user-guides/sentinel-2-msi/revisit-coverage).

## Create Sensor Placement map
The section details the procedures for creating Sensor Placement maps.

> [!NOTE]
> You can initiate Sensor Placement from the **Maps** page or from the  **Generate Precision Maps** drop-down menu on the **Farm Details** page.

Use the following steps:

1. On the home page, go to **Maps** from the left navigation menu.
2. Select **Create Maps** and select **Sensor Placement** from drop-down menu.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/create-maps-drop-down-1.png)

3. Select **Sensor Placement**.
  The Sensor Placement window displays.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/sensor-placement-1.png)

4. Select a farm from the **Farm** drop-down menu.  
   To search and select your farm, you can either scroll in the drop-down list or type the name of the farm in the text box.
5. If you want to generate a map for the last year, select **Recommended** option.
6. If you want to generate a map for a custom date range, select **Select Date Range**, and provide the start and end date for which you want to generate the Sensor Placement map.
7. Select **Generate Maps**.
 A confirmation message with job details appears.

  For information on job status, see the section **View Jobs**. If the job status shows *Failed*, a detailed error message is displayed on the tooltip of the *Failed* status.. In this case, repeat the steps listed above and try again.

  If the issue persists, see the [Troubleshoot](troubleshoot-project-farmbeats.md) section or contact [Azure FarmBeats forum for support](https://aka.ms/FarmBeatsMSDN) with relevant logs.

### View and download Sensor Placement map

Use the following steps:

1. On the home page, go to **Maps** from the left navigation menu.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/view-download-sensor-placement-map-1.png)

2. Select **Filter** from the left navigation of the window.
  The **Filter** window displays search criteria.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/view-download-filter-1.png)

3. Select **Type**, **Date** and **Name** from the drop-down menu and then select **Apply** to search for the map you want to view.
  The date on which the job was created is shown in the format type_farmname_YYYY-MM-DD.
4. Scroll through the list of maps available using the navigation bars at the end of the page.
5. Select the map you want to view. A pop-up window displays the preview for the selected map.
6. Select **Download**, and download the GeoJSON file of sensor coordinates.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/download-sensor-placement-map-1.png)

## Satellite Indices map

The following sections explain the procedures involved in creating and viewing Satellite Indices map.

> [!NOTE]
> You can initiate Satellite Indices map from the **Maps** page or from the  **Generate Precision Maps** drop-down menu on the **Farm Details** page.

FarmBeats provides you with the ability to generate Normalized Difference Vegetation Index (NDVI), Enhanced Vegetation Index (EVI) and Normalized Difference Water Index (NDWI) maps for farms. These indices help determine how the crop is currently growing, or has grown in the past, and the representative water levels in the ground.


> [!NOTE]
> A Sentinel image is required for the days for which the map is generated.


## Create Satellite Indices map

Use the following steps:

1. On the home page, go to **Maps** from the left navigation menu.
2. Select **Create Maps** and select **Satellite Indices** from the drop-down menu.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/create-maps-drop-down-satellite-indices-1.png)

3. Select **Satellite Indices**.
  The Satellite Indices window displays.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/satellitte-indices-1.png)

4. Select a farm from the drop-down menu.  
   To search and select your farm, you can either scroll in the drop-down list or type the name of the farm.   
5. If you want to generate a map for the last week, select **This Week** option.
6. If you want to generate a map for custom date range, select **Select Date Range**, and provide the start and end date for which you want to generate the Satellite Indices map.
7. Select **Generate Maps**.
    A confirmation message with job details appears.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/successful-satellitte-indices-1.png)

    For information on job status, see the section **View Jobs**. If the job status shows *Failed*, a detailed error message is displayed on the tooltip of the *Failed* status. In this case, repeat the steps listed above and try again.

    If the issue persists, see the [Troubleshoot](troubleshoot-project-farmbeats.md) section or contact [Azure FarmBeats forum for support](https://aka.ms/FarmBeatsMSDN) with relevant logs.

### View and download map

Use the following steps:

1. On the home page, go to **Maps** from the left navigation menu.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/view-download-sensor-placement-map-1.png)

2. Select **Filter** from the left navigation of the window, the **Filter** window displays search criteria.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/view-download-filter-1.png)

3. Select **Type**, **Date** and **Name** from the drop-down menu and then select **Apply** to search for the map you want to view.
  The date on which the job was created is shown in the format type_farmname_YYYY-MM-DD.

4. Scroll through the list of maps available using the navigation bars at the end of the page.
5. For each combination of **Farm Name** and **Date**, the following three maps are available:
    - NDVI
    - EVI
    - NDWI
6. Select the map you want to view. A pop-up window displays the preview for the selected map.
7. Select **Download** drop-down menu to select the download format and the map is downloaded and stored in your local folder on your computer.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/download-satellite-indices-map-1.png)

## Get Soil Moisture Heatmap

Soil moisture is the water that is held in the spaces between soil particles. The Soil Moisture Heatmap helps you understand the soil moisture data at any depth, at high resolution within your farms. To generate an accurate and usable Soil Moisture Heatmap, a uniform deployment of sensors is required, wherein all the sensors are from the same provider. Different providers will have differences in the way soil moisture is measured along with differences in calibration. The Heatmap is generated for a particular depth using the sensors deployed at that depth.

### Before you begin  

Ensure the following before you attempt to generate a Soil Moisture Heatmap:

- At least three soil moisture sensors must be deployed. Microsoft recommends that you do not try to create a Soil Moisture map before sensors are deployed and associated with the farm.  
- Generate Soil Moisture Heatmap is influenced by Sentinel's path coverage, cloud cover and cloud shadow. At least one cloud free Sentinel Scene must be available for the last 120 days, from the day for which the Soil Moisture map was requested.
- At least half of the sensors deployed on the farm must be online and have data streaming to the Data hub.
- The Heatmap should be generated using sensor measures from the same provider.


## Create Soil Moisture Heatmap

Use the following steps:

1. On the home page, go to **Maps** from the left navigation menu to view the Maps page.
2. Select **Create Maps** and select **Soil Moisture** from drop-down menu.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/create-maps-drop-down-soil-moisture-1.png)

3. Select **Soil Moisture**.
    The Soil Moisture window displays.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/soil-moisture-1.png)

4. Select a farm from the **Farm** drop-down menu.  
   To search and select your farm, you can either scroll from the drop-down list or type the name of the farm in the Select Farm drop-down menu.
5. In the **Select Soil Moisture Sensor Measure** drop-down menu, select the soil moisture sensor measure (depth) for which you want to generate the map.
To find the sensor measure, go to **Sensors**, select any soil moisture sensor. Then, under **Sensor Properties** section use the value against in **Measure Name**
6. If you want to generate for **Today** or **This Week**, select one of the options.
7. If you want to generate for a custom date range, select **Select Date Range**, and provide the start and end date for which you want to generate the Soil Moisture map.
8. Select **Generate Maps**.
 A confirmation message with job details appears.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/successful-soil-moisture-1.png)

    For information on job status, see the section **View Jobs**. If the job status shows *Failed*, a detailed error message is displayed on the tooltip of the *Failed* status. In this case, repeat the steps listed above and try again.

    If the issue persists, see the [Troubleshoot](troubleshoot-project-farmbeats.md) section or contact [Azure FarmBeats forum for support](https://aka.ms/FarmBeatsMSDN) with relevant logs.

### View and download map

Use the following steps:

1. On the home page, go to **Maps** from the left navigation menu.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/view-download-sensor-placement-map-1.png)

2. Select **Filter** from the left navigation of the window, the **Filter** window displays from where you can search for maps.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/view-download-filter-1.png)

3.  Select **Type**, **Date** and **Name** from the drop-down menu and then select **Apply** to search for the map you want to view. The date on which the job was created is shown in the format type_farmname_YYYY-MM-DD.
4. Select the **Sort** icon next to the table headers to sort according to Farm, Date, Created On, Job ID, and Job Type.
5. Scroll through the list of maps available using the navigation buttons at the end of the page.
6. Select the map you want to view. A pop-up window displays the preview for the selected map.
7. Select **Download** drop-down menu to select the download format and the map is downloaded and stored in the specified folder.

    ![Project Farm Beats](./media/get-sensor-data-from-sensor-partner/download-soil-moisture-map-1.png)
