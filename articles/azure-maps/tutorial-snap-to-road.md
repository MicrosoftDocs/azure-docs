---
title: 'Tutorial: Analyze trip data using Snap to Roads in Microsoft Fabric notebook.'
description: Tutorial on how to Create a snap to road route using Microsoft Azure Maps routing APIs and Microsoft Fabric notebooks.
author: farazgis
ms.author: fsiddiqui
ms.date: 11/11/2024
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
ms.custom: mvc, devx-track-python
---

# Tutorial: Analyze trip data using Snap to Roads in Microsoft Fabric notebook

Snap to Roads is an Azure Maps service that processes a set of GPS points collected along a route and snaps them to the most probable roads the vehicle traveled. This feature is useful in determining the exact path followed by a vehicle, even when the GPS data collected is off slightly.

This tutorial explains how to use Azure Maps [Snap to Roads] API with Microsoft Fabric to analyze GPS data from moving assets, even when the data is inaccurate or incomplete due to signal loss. It walks you through making calls to the Azure Maps Snap to Roads API from a Microsoft Fabric notebook to snap the GPS points to the nearest road, fill missing points using interpolated data points and enhance them with additional attributes such as road names and speed limits.

In this tutorial, you will:

> [!div class="checklist"]
>
> * Create a [Microsoft Fabric Lakehouse] and import a vechicle's raw GPS data into it.
> * Create a [Microsoft Fabric notebook] that takes raw GPS data and returns the requested snapped coordinate information using the Azure Maps [Snap to Roads] API.
> * Create an [eventhouse] and [KQL database] and import the snapped GPS data into it.
> * Create a [Real-Time Dashboard] using the snapped GPS data in the Kusto Database.
> * Query KQL data and display the snapped GPS data in a Map Visual.

## Prerequisites

* An [Azure Maps account]
* A [subscription key]
* A [Microsoft Fabric account]
* Basic understanding of [Microsoft Fabric].

> [!NOTE]
> For more information on authentication in Azure Maps, see [manage authentication in Azure Maps].

## Create a Microsoft Fabric notebook and lakehouse

Follow these steps to create a Microsoft Fabric notebook:

1. Go to your [My Workspace] and select **New item**.

    :::image type="content" source="./media/tutorial-snap-to-road/new-item.png" lightbox="./media/tutorial-snap-to-road/new-item.png" alt-text="A screenshot of the My Workspace page in Microsoft Fabric with the new item button highlighted.":::

1. When the **New item** screen appears, scroll down and select **Notebook**.

    :::image type="content" source="./media/tutorial-snap-to-road/new-notebook.png" lightbox="./media/tutorial-snap-to-road/new-notebook.png" alt-text="A screenshot showing the notebook option in the new item screen in Microsoft Fabric.":::

1. In the notebook **Explorer** screen, select the **Lakehouses** arrow **>**.

    :::image type="content" source="./media/tutorial-snap-to-road/select-lakehouse.png" lightbox="./media/tutorial-snap-to-road/select-lakehouse.png" alt-text="A screenshot showing the select lakehouse arrow.":::

1. Select the **Add** button.

    :::image type="content" source="./media/tutorial-snap-to-road/add-lakehouse.png" lightbox="./media/tutorial-snap-to-road/add-lakehouse.png" alt-text="A screenshot showing the add lakehouse button.":::

1. In the **Add lakehouse** dialog, select **New Lakehouse** then the **Add** button.

1. In the **New lakehouse** dialog, enter a name "_Azure_Maps_Data_" then select the **Create** button.

## Add a data file to the lakehouse

Snap to Roads takes GPS point data (lat, lon), and returns a list of objects that form a route snapped to the roads on a map. A data file containing the required GPS data can be added as a file to the lakehouse and referenced by the python code in your notebook.

### Download data file

Download the sample data (mockData_20240919.csv) from GitHub to your local storage device to upload into lakehouse in the next section. This file contains an array of GPS coordinates that the Snap to Roads service modifies as needed to ensure that each coordinate points to a valid road.

1. Open the file [mockData_20240919.csv] in GitHub.
1. Select the **Download raw file** button in the upper-right corner of the screen and save the file locally.

    :::image type="content" source="./media/tutorial-snap-to-road/download-mock-data.png" alt-text="A screenshot showing how to download the data file named mockData_20240919.csv from the GitHub repository.":::

### Upload data file into lakehouse

The following steps explain how to add a data source to lakehouse.

1. From the **Files** folder in lakehouse, select **Upload > Upload files**.

    :::image type="content" source="./media/tutorial-snap-to-road/file-upload.png" lightbox="./media/tutorial-snap-to-road/file-upload.png" alt-text="A screenshot showing the upload files menu option.":::

1. Bring up the file open dialog by selecting the _folder_ icon. Select the mockData_20240919.csv file you downloaded in the [previous section](#download-data-file) then the **Open** button. Once the file open dialog box closes and the correct filename appears in the **Upload files** control, select the **Upload** button to upload the file into lakehouse.

    :::image type="content" source="./media/tutorial-snap-to-road/upload-files.png" lightbox="./media/tutorial-snap-to-road/upload-files.png" alt-text="A screenshot showing the upload files panel.":::

## Add code to notebook

You need to add and execute four cells of code into your notebook to perform the _Snap to Roads_ scenario. The following sections walk you through this.

### Install packages

You first need to load the required packages:

```python
!pip install geopandas
!pip install geojson
```

Enter the pip install statements into the first cell of your notebook, then execute the statements by selecting the _run arrow_.

:::image type="content" source="./media/tutorial-snap-to-road/install-packages.png" lightbox="./media/tutorial-snap-to-road/install-packages.png" alt-text="A screenshot showing the install packages code in a cell of the notebook.":::

### Load data

Next, load the sample data you [previously uploaded](#upload-data-file-into-lakehouse) into your lakehouse.

1. Hover your pointer just below the cell used to install the packages. Options appear to add code or markdown. Select **Code** to add another code cell to your notebook.

    :::image type="content" source="./media/tutorial-snap-to-road/add-code-cell.png" lightbox="./media/tutorial-snap-to-road/add-code-cell.png" alt-text="A screenshot showing the add code link in the notebook.":::

1. Once the new cell is created, add the following code.

    ```python
    import geopandas as gpd
    import pandas as pd
    
    lakehouseFilePath = "/lakehouse/default/Files/"
    
    mockdata_df = gpd.read_file(lakehouseFilePath + "mockData_20240919.csv")
    mockdata_df = gpd.GeoDataFrame(
        mockdata_df, geometry=gpd.points_from_xy(mockdata_df.longitude, mockdata_df.latitude), crs="EPSG:4326"
    )
    
    mockdata_df.head()

    mockdata_df.tripID.unique()
    ```

1. Execute the code by selecting the _run arrow_. This loads your sample data.

### Enhance with Snap to Roads

The code in this notebook cell reads raw GPS data from the data file in lakehouse and passes it to the Azure Maps Snap to Road API. With interpolation enabled, the API adds points between GPS locations to complete the route path along the road. It also provides attributes like road names and speed limits when available.

1. Hover your pointer just below the cell used to install the packages in the previous step. Options appear to add code or markdown. Select **Code** to add another code cell to your notebook.
1. Once the new cell is created, add the following code. Make sure you add your subscription key.

    ```python
    import requests
    import json
    
    az_maps_subkey = ""
    az_maps_snaproads_url = "https://atlas.microsoft.com/route/snapToRoads?api-version=2024-07-01-preview&subscription-key=" + az_maps_subkey
    
    # Function to process snap to road for each given trip
    def process_route(df, outputFilePath):
        # List to store successful responses
        successful_responses = []
    
        # Function to send a chunk of features
        def send_chunk_snaproads(chunk):
            geojson_data = chunk.to_json()
            # Convert the JSON string to a Python dictionary
            geojson_dict = json.loads(geojson_data)
    
            # Add the new fields at the end of the dictionary
            geojson_dict['includeSpeedLimit'] = True
            geojson_dict['interpolate'] = True
            geojson_dict['travelMode'] = "driving"
    
            # Convert the dictionary back to a JSON string
            updated_geojson_data = json.dumps(geojson_dict)
    
            response = requests.post(
            az_maps_snaproads_url, 
            headers={'Content-Type': 'application/json'}, 
            data=updated_geojson_data
            )
    
            if response.status_code == 200:
                print('Chunk request was successful...')
                successful_responses.append(response.json())
            else:
                print(f'Failed to send request. Status code: {response.status_code}')
                print('Response body:', response.text)
    
        # Loop over the GeoDataFrame in chunks of 100
        chunk_size = 100
        for start in range(0, len(df), chunk_size):
            end = start + chunk_size
            chunk = df.iloc[start:end]
            send_chunk_snaproads(chunk)
    
        # Extract features with geometry from successful responses
        features_with_geometry = []
        for response in successful_responses:
            if 'features' in response:
                for feature in response['features']:
                    if 'geometry' in feature:
                        longitude = feature['geometry']['coordinates'][0]
                        latitude = feature['geometry']['coordinates'][1]
                        feature['properties']['latitude'] = latitude
                        feature['properties']['longitude'] = longitude
                        features_with_geometry.append(feature)
    
        # Convert the list of features with geometry to a GeoDataFrame
        if features_with_geometry:
            responses_gdf = gpd.GeoDataFrame.from_features(features_with_geometry)
    
            # Write successful responses to a cvs file
            #responses_gdf.to_file(outputFilePath, driver='GeoJSON')
            responses_gdf.to_csv(outputFilePath, encoding='utf-8', index=False)
    
            print(f'Successful responses written to {outputFilePath}')
        else:
            print('No valid features with geometry found in the responses.')
    ```

1. Execute the code by selecting the _run arrow_.

### Create file with enhanced data

The following code takes the output created in the previous code cell and creates a new CSV file in the lakehouse named _SnapRoadResponses.csv_. This new data file contains updated GPS coordinates that are aligned with the appropriate road, it also includes street names and speed limits when available. _SnapRoadResponses.csv_ will be imported into an eventhouse and used to create a map visual later in this tutorial.

1. Hover your pointer just below the cell used to [Enhance with Snap to Roads](#enhance-with-snap-to-roads) in the previous step. Options appear to add code or markdown. Select **Code** to add another code cell to your notebook.

1. Once the new cell is created, add the following code.

    ```python
    lakehouseFilePath = "/lakehouse/default/Files/"
    #execute snap to road
    outputFilePath = lakehouseFilePath + "SnapRoadResponses" + ".csv"
    df = mockdata_df.sort_values(by='timeStamp').reset_index(drop=True)
    process_route(df, outputFilePath)
    ```

1. Execute the code by selecting the _run arrow_. This saves _SnapRoadResponses.csv_ with updated GPS coordinates to the lakehouse.

> [!TIP]
> If the new file does not appear after running the notebook code, you may need to refresh your browser.

### Copy file path

The _ABFS path_ to  _SnapRoadResponses.csv_ is required later in this tutorial when you create the eventhouse. To get the ABFS path to this file, select the ellipse (**...**) next to the file, then from the popup menu, select **Copy ABFS Path**. Once copied, save it for later.

:::image type="content" source="./media/tutorial-snap-to-road/file-path.png" lightbox="./media/tutorial-snap-to-road/file-path.png" alt-text="A screenshot showing how to copy an ABFS path to the data file stored in lakehouse.":::

## Create eventhouse and link to data in lakehouse

Create an eventhouse to manage the telemetry data for your fleet or moving assets. A KQL database is created automatically by default. In this tutorial, you'll import the snapped data from the lake house into the KQL database. For real-time analytics, add streaming data. Once the data is uploaded, you can query your data using Kusto Query Language in a KQL queryset.

1. Go to your [My Workspace] and select **New item**.
1. When the **New item** screen appears, scroll down and select **Eventhouse**.
1. In the **New Eventhouse** screen, enter a name for your new eventhouse, such as _SnapToRoadDemo_.

    Next, link the lakehouse you created previously to your new eventhouse.

1. Select the ellipse next to your new eventhouse, then **Get data > OneLake** from the popup menu.

    :::image type="content" source="./media/tutorial-snap-to-road/link-onelake-to-eventhouse.png" lightbox="./media/tutorial-snap-to-road/link-onelake-to-eventhouse.png" alt-text="A screenshot showing OneLake in the popup menu.":::

1. Select **New table**, name it **GPSData** then select **Next**.

    :::image type="content" source="./media/tutorial-snap-to-road/new-table.png" lightbox="./media/tutorial-snap-to-road/new-table.png" alt-text="A screenshot showing the new table option.":::

1. Enter the ABFS path to the Lakehouse data file (_SnapRoadResponses.csv_) in the **OneLake file** control that you [saved previously](#copy-file-path), then select the plus sign (**+**) to add it to the list.

    :::image type="content" source="./media/tutorial-snap-to-road/select-file.png" lightbox="./media/tutorial-snap-to-road/select-file.png" alt-text="A screenshot showing entering a OneLake filename with the next button highlighted.":::

1. Select **Next**.

1. After verifying the data in the **Inspect the data** screen, select **Finish**.

    :::image type="content" source="./media/tutorial-snap-to-road/inspect-data.png" lightbox="./media/tutorial-snap-to-road/inspect-data.png" alt-text="A screenshot showing the inspect the data screen.":::

1. Select **Close** to close **Summary** page.

    :::image type="content" source="./media/tutorial-snap-to-road/get-data-summary.png" lightbox="./media/tutorial-snap-to-road/get-data-summary.png" alt-text="A screenshot showing the get data summary screen.":::

The eventhouse should now be created and contain the GPS data.

:::image type="content" source="./media/tutorial-snap-to-road/snap-to-road-eventhouse.png" lightbox="./media/tutorial-snap-to-road/snap-to-road-eventhouse.png" alt-text="A screenshot showing the eventhouse with the GPS data.":::

## Create Real-Time Dashboard

A [Real-Time Dashboard] can be created to connect to your dataset in the eventhouse. The input in this tutorial is static data, not a real-time stream, but the tiles in the dashboard, such as Azure Maps Visual, can be used for visual representation and analytics.

### Add data source

1. Go to your [My Workspace] and select **New item**.
1. When the **New item** screen appears, search for, or scroll down and select **Real-Time Dashboard**.
1. In the **New Real-Time Dashboard** screen, enter the name _SnapToRoadDashboard_, then select **Create**.
1. In the new **Real-Time Dashboard** screen, select **New data source**.
1. Select the **Add** button, then select **OneLake data hub**.

    :::image type="content" source="./media/tutorial-snap-to-road/real-time-dashboard-data-source.png" lightbox="./media/tutorial-snap-to-road/real-time-dashboard-data-source.png" alt-text="A screenshot showing the Real-Time Dashboard add data source screen.":::

1. Select your data source, then **Connect**.

    :::image type="content" source="./media/tutorial-snap-to-road/connect-data-source.png" lightbox="./media/tutorial-snap-to-road/connect-data-source.png" alt-text="A screenshot showing the data file selected with the connect button highlighted.":::

1. Enter a **Display name** then select **Add**.

    :::image type="content" source="./media/tutorial-snap-to-road/create-new-data-source.png" lightbox="./media/tutorial-snap-to-road/create-new-data-source.png" alt-text="A screenshot showing the create a new data source screen with the add button highlighted.":::

1. Close the **Data sources** panel.

Now that you have added the datasource for your real-time dashboard, you can add a query and map visual.

### Add query and map visual

1. Select **Add tile**.

    :::image type="content" source="./media/tutorial-snap-to-road/add-tile.png" lightbox="./media/tutorial-snap-to-road/add-tile.png" alt-text="A screenshot showing the add tile button highlighted.":::

1. Enter `GPSData` in the query then select **Run**. Once you verified that the query works, select **Add visual**.

    :::image type="content" source="./media/tutorial-snap-to-road/run-query.png" lightbox="./media/tutorial-snap-to-road/run-query.png" alt-text="A screenshot showing the results in the run query screen.":::

1. In the **Visual formatting** panel, select **Map** from the **Visual type** drop-down.
1. Next, set your values in the **Data** section:

    | Data setting       | value                  |
    |--------------------|------------------------|
    | Define by location | Latitude and longitude |
    | Latitude column    | latitude (real)        |
    | Longitude column   | longitude (real)       |

1. Update the map info card by selecting a value from the **Label column** drop-down. Select **SpeedLimitInKilometersPerHour**.
1. Select **Apply changes**

Your map visual appears. You can select any point on the map to get the coordinates and _Speed Limit In Kilometers Per Hour_ for that location.

:::image type="content" source="./media/tutorial-snap-to-road/map-visual.png" lightbox="./media/tutorial-snap-to-road/map-visual.png" alt-text="A screenshot showing the completed map visual with an info card displayed showing the speed limit in kilometers per hour.":::

## Next steps

To learn more about Microsoft Fabric notebooks:

> [!div class="nextstepaction"]
> [How to use Microsoft Fabric notebooks]

This tutorial created a dashboard for post trip route analysis. For a step-by-step guide to building real-time dashboards in Microsoft Fabric:

> [!div class="nextstepaction"]
> [Real-Time Intelligence]

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[eventhouse]: /fabric/real-time-intelligence/eventhouse
[How to use Microsoft Fabric notebooks]: /fabric/data-engineering/how-to-use-notebook
[KQL database]: /fabric/real-time-intelligence/create-database
[manage authentication in Azure Maps]: how-to-manage-authentication.md
[Microsoft Fabric account]: https://www.microsoft.com/en-us/microsoft-fabric/getting-started
[Microsoft Fabric Lakehouse]: /fabric/data-engineering/lakehouse-overview
[Microsoft Fabric notebook]: /fabric/data-engineering/how-to-use-notebook
[Microsoft Fabric]: https://www.microsoft.com/en-us/microsoft-fabric/getting-started#Resources
[mockData_20240919.csv]: https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook/blob/master/AzureMapsJupyterSamples/Tutorials/Snap%20to%20Roads/mockData_20240919.csv
[My Workspace]: https://msit.powerbi.com/groups/me/list?experience=power-bi
[Real-Time Dashboard]: /fabric/real-time-intelligence/dashboard-real-time-create
[Real-Time Intelligence]: /fabric/real-time-intelligence/overview
[Snap to Roads]: /rest/api/maps/route/post-snap-to-roads
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
