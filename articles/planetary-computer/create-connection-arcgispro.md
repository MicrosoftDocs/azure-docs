---
title: Connect ArcGIS Pro to Microsoft Planetary Computer Pro
description: "This article provides step-by-step instructions for connecting ESRI ArcGIS Pro to Microsoft Planetary Computer Pro and accessing geospatial data."
author: prasadko
ms.author: prasadkomma
ms.service: azure
ms.topic: how-to #Don't change
ms.date: 04/23/2025

#customer intent: As a GIS analyst or data scientist, I want to connect ArcGIS Pro to Microsoft Planetary Computer Pro so that I can access and analyze geospatial datasets.

---

# Connect ArcGIS Pro to Microsoft Planetary Computer Pro

This article provides step-by-step instructions for connecting ESRI ArcGIS Pro to Microsoft Planetary Computer Pro (MPC Pro). By integrating ArcGIS Pro with MPC Pro, you can access, visualize, and analyze petabyte-scale geospatial datasets directly within your familiar GIS environment.

## Prerequisites

- ESRI ArcGIS Pro (version 3.0 or later) installed on your workstation
- An active ArcGIS Pro license
- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
- An existing [GeoCatalog resource](./deploy-geocatalog-resource.md)
- [Role-based access](./manage-access.md) to your GeoCatalog

## Configure authentication in ArcGIS Pro

To connect ArcGIS Pro to Microsoft Planetary Computer Pro, you need to set up Microsoft Entra ID authentication:

1. Open ArcGIS Pro on your workstation.
2. Select the **Project** tab and click on **Options**.
3. In the Options dialog, select **Connections** from the left sidebar.
4. Click on **Add Connection** and select **Microsoft Planetary Computer Pro** from the dropdown.
5. In the connection dialog, enter the following information:
   - **Connection Name**: A descriptive name for your connection
   - **GeoCatalog URI**: The URI of your GeoCatalog (format: `https://<your-geocatalog-name>.geocatalog.<region>.azureplanetary.microsoft.com`)
   - **Authentication Type**: Select **Microsoft Entra ID**
6. Click **Sign In** and follow the prompts to authenticate with your Microsoft Entra credentials.
7. Click **Test Connection** to verify connectivity.
8. Click **Save** to create the connection.

## Access MPC Pro data in ArcGIS Pro

After setting up the connection, you can access MPC Pro data in ArcGIS Pro:

1. In ArcGIS Pro, create a new map or open an existing project.
2. Open the **Catalog** pane.
3. Expand the **Connections** section to find your MPC Pro connection.
4. Expand your connection to browse available collections.
5. Right-click on a collection or item and select **Add to Current Map** to visualize the data.

## Working with STAC collections

Microsoft Planetary Computer Pro organizes data using the Spatiotemporal Asset Catalog (STAC) specification:

1. To search for specific data, right-click on your MPC Pro connection and select **Search STAC Catalog**.
2. In the search dialog, you can filter by:
   - Date range
   - Geographical extent (drawn on map or coordinates)
   - Cloud cover percentage
   - Collection type
   - Other STAC properties
3. Click **Search** to find matching items.
4. Select items from the results and click **Add to Map** to visualize them.

## Processing MPC Pro data in ArcGIS Pro

You can perform analysis on MPC Pro data directly in ArcGIS Pro:

1. With MPC Pro data added to your map, navigate to the **Analysis** tab.
2. Choose from available geoprocessing tools.
3. Configure processing parameters as needed.
4. Select **Run** to execute the analysis.

> [!NOTE]
> For large datasets, processing may be performed in the cloud on Azure, reducing the need to download large volumes of data to your local machine.

## Saving results

After analyzing MPC Pro data, you can save results:

1. Right-click on the output layer in the **Contents** pane.
2. Select **Save As**.
3. Choose a destination:
   - **File** - Save locally
   - **Microsoft Planetary Computer Pro** - Save back to your GeoCatalog
   - **ArcGIS Online** - Share with your organization
4. Enter metadata and click **Save**.

## Automating workflows with ArcGIS Python API

You can automate MPC Pro workflows using the ArcGIS Python API:

```python
from arcgis.gis import GIS
import arcpy

# Connect to ArcGIS Pro
gis = GIS("pro")

# Connect to MPC Pro
mpc_connection = gis.connections.add_planetary_computer_connection(
    name="My MPC Connection",
    uri="https://my-geocatalog.geocatalog.eastus.azureplanetary.microsoft.com",
    auth_type="entra"
)

# Search for Landsat imagery
landsat_items = mpc_connection.search(
    collection="landsat-c2-l2",
    datetime="2022-01-01/2022-12-31",
    bbox=[-122.5, 37.5, -121.5, 38.5]
)

# Add to map and perform analysis
map_view = gis.map()
landsat_layer = map_view.add(landsat_items[0])
ndvi = arcpy.imagery.CalculateNDVI(landsat_layer)
map_view.add(ndvi)
```

## Next steps

> [!div class="nextstepaction"]
> [Perform geospatial analysis with Microsoft Planetary Computer Pro](./analyze-data.md)
> [Visualize data in the Explorer](./use-explorer.md)
> [Learn about STAC collections](./stac-overview.md)