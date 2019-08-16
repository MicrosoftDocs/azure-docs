---
title: Routing using Azure Maps | Microsoft Docs
description: Search for multiple viable routes using Azure Maps routing APIs.
author: walsehgal
ms.author: v-musehg
ms.date: 08/15/2019
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Routing with Azure Maps

Azure Maps offers a robust set of routing APIs that allows you to calculate routes between the desired set of points based on various conditions. In this tutorial, we will implement a scenario consisting of an electric vehicle with low charge and its driver who needs to find the closest possible charging station with respect to time.

In this tutorial you will:

> [!div class="checklist"]
> * Search for a reachable boundary, based on the electric vehicle's consumption model.
> * Search for electric vehicle charging stations within the boundary range.
> * Visualize the reachable range boundary and charging stations on a map.
> * Find and visualize route to the closest electric vehicle charging station based on time.


## Prerequisites 

To complete the steps in this tutorial, you first need to create an Azure Maps account subscription with S1 pricing tier and get your Azure Maps subscription key. To learn how to create an Azure Maps account subscription see, [manage account](https://docs.microsoft.com/azure/azure-maps/how-to-manage-account-keys). To learn how to get your subscription key, see [authentication details](https://docs.microsoft.com/azure/azure-maps/how-to-manage-authentication#view-authentication-details).

## Create an Azure Notebook

In order to follow along with this tutorial, you will need to create an Azure Notebook project and download and run the Jupyter notebook file here. The notebook file contains python code, which is an implementation of the scenario in this tutorial. Follow the steps below to create an Azure Notebook project and upload the Jupyter notebook document into it.

1. Go to [Azure Notebooks](https://notebooks.azure.com) and sign in. For more information, see [Quickstart](https://docs.microsoft.com/azure/notebooks/quickstart-sign-in-azure-notebooks).
2. From your public profile page, select **My Projects** at the top of the page.

    ![my project](./media/tutorial-maps-routing/myproject.png)

3. On the **My Projects** page, select **New Project**.
 
   ![new project](./media/tutorial-maps-routing/create-project.png)

4. In the **Create New Project** popup that appears, enter the following information and click **Create**:
    * Project Name
    * Project ID
 
    ![create project](./media/tutorial-maps-routing/create-project-window.png)

5. Once your project is created, select your project from the projects list on the **My Projects** page and click on **Upload** to upload the Jupyter notebook document file. Upload the file from your computer and click **Done**.

    ![upload notebook](./media/tutorial-maps-routing/upload-notebook.png)

6. Upon a successful upload, you will see your file in your project page. Click on the notebook file to open the file as a Jupyter Notebook.

In order to better understand the functionality implemented in the notebook file, we recommend you to run the code in the notebook one cell at a time. You can run the code in each cell by clicking on the **Run** button at the top in the notebook app.

  ![run](./media/tutorial-maps-routing/run.png)

## Install project level packages

You need to install packages at the project level in order to run the code in the notebook. Follow the steps below to install the required packages:

1. Download the "requirements.txt" file from the repo and upload it to your project.
2. On the project dashboard, select **Project Settings**. 
3. In the popup that appears, select the **Environment tab**, then select **Add**.
4. Under **Environment Setup Steps**, 
    * In the first drop-down control, choose **Requirements.txt**.
    * In the second drop-down control, choose your "requirements.txt" file.
    * In the third drop-down control, choose Python Version 3.6 as the python version.
7. Select **Save**.

    ![install packages](./media/tutorial-maps-routing/install-packages.png)

## Load required modules and frameworks

Run the following script to load all of the required modules and frameworks.

```python
import os
import json
import time
import aiohttp
import requests
from IPython.display import Image, display
```

## Search for a reachable boundary range

In the use case scenario, we implement the electric vehicle is low on charge and in order to search for reachable charging stations, we need to search for a set of locations that are within the reachable range and get the boundary information for that range. The following script calls the [Get route range API](https://docs.microsoft.com/rest/api/maps/route/getrouterange) of the Azure Maps routing service with parameters for the vehicle's consumption model and parses the response to create a polygon object of the geojson format representing the car's maximum reachable range.

Run the script below to get bounds for the electric vehicle's reachable range.

```python
subscriptionKey = "tTk1JVEaeNvDkxxnxHm9cYaCvqlOq1u-fXTvyXn2XkA"
currentLocation = "34.05220607655166,-118.24339270591734"
session = aiohttp.ClientSession()

routeRangeResponse = await (await session.get("https://atlas.microsoft.com/route/range/json?subscription-key={}&api-version=1.0&query={}&travelMode=car&vehicleEngineType=electric&energyBudgetInkWh=30&currentChargeInkWh=45&maxChargeInkWh=80&routeType=eco&constantSpeedConsumptionInkWhPerHundredkm=50,8.2:130,21.3".format(subscriptionKey,currentLocation))).json()

polyBounds = routeRangeResponse["reachableRange"]["boundary"]

for i in range(len(polyBounds)):
    coordList = list(polyBounds[i].values())
    coordList[0], coordList[1] = coordList[1], coordList[0]
    polyBounds[i] = coordList

polyBounds.pop()
polyBounds.append(polyBounds[0])

boundsData = {
               "geometry": {
                 "type": "Polygon",
                 "coordinates": 
                   [
                      polyBounds
                   ]
                }
             }
```

## Search electric vehicle charging stations

Once we have the reachable range for the electric vehicle, next we will search for charging stations in that range. The following script calls the Azure Maps search service endpoint via the [Post Search Inside Geometry API](https://docs.microsoft.com/rest/api/maps/search/postsearchinsidegeometry) to search for electric vehicle charging stations within bounds of the car's maximum reachable range, and then parses the response.

Run the following script to search for electric vehicle charging stations within reachable range.

```python
searchPolyResponse = await (await session.post(url = "https://atlas.microsoft.com/search/geometry/json?subscription-key={}&api-version=1.0&query=electric vehicle station&idxSet=POI".format(subscriptionKey), json = boundsData)).json() 

reachableLocations = []
for loc in range(len(searchPolyResponse["results"])):
                location = list(searchPolyResponse["results"][loc]["position"].values())
                location[0], location[1] = location[1], location[0]
                reachableLocations.append(location)

```

## Upload range and charging points to Azure Maps data service

In order to visualize the charging stations and boundary for the maximum reachable range of the electric vehicle, we need to upload the boundary and charging stations data as jeojson objects to the Azure Maps Data service, using the Data Upload API. 

Run the following two cells to upload the boundary and charging point data to the Azure Maps data service.

```python
rangeData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          polyBounds
        ]
      }
    }
  ]
}

uploadRangeResponse = await session.post("https://atlas.microsoft.com/mapData/upload?subscription-key={}&api-version=1.0&dataFormat=geojson".format(subscriptionKey), json = rangeData)

rangeUdidRequest = uploadRangeResponse.headers["Location"]+"&subscription-key={}".format(subscriptionKey)
# getRangeUdid = await (await session.get(rangeUdidRequest)).json()

while True:
    getRangeUdid = await (await session.get(rangeUdidRequest)).json()
    if 'udid' in getRangeUdid:
        break
    else:
        time.sleep(0.2)
rangeUdid = getRangeUdid["udid"]
```

```python
poiData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "MultiPoint",
            "coordinates": reachableLocations
        }
    }
  ]
}

uploadPOIsResponse = await session.post("https://atlas.microsoft.com/mapData/upload?subscription-key={}&api-version=1.0&dataFormat=geojson".format(subscriptionKey), json = poiData)
poiUdidRequest = uploadPOIsResponse.headers["Location"]+"&subscription-key={}".format(subscriptionKey)

while True:
    getPoiUdid = await (await session.get(poiUdidRequest)).json()
    if 'udid' in getPoiUdid:
        break
    else:
        time.sleep(0.2)

poiUdid = getPoiUdid["udid"]
```

## Visualize charging points and bounds on the map

Once we have the data uploaded to the data service, we will now run the following script to call the Render service, [Get Map Image API](https://docs.microsoft.com/en-us/rest/api/maps/render/getmapimage) to render the charging points and maximum reachable boundary on the map and get the resulting image.

```python
path = "lc0000FF|fc0000FF|lw3|la0.80|fa0.30||udid-{}".format(rangeUdid)
pins = "default|la-35+50|ls12|lc003C62|co9B2F15||udid-{}".format(poiUdid)

staticMapResponse =  await session.get("https://atlas.microsoft.com/map/static/png?api-version=1.0&subscription-key={}&pins={}&path={}&center=-117.96569824218749,34.31168124115256&zoom=6".format(subscriptionKey,pins,path))
poiRangeMap = await staticMapResponse.content.read()

display(Image(poiRangeMap))
```

![location range](./media/tutorial-maps-routing/location-range.png)


## Find the closest charging station

The following script calls the Azure Maps routing service endpoint via the [Matrix routing API](https://docs.microsoft.com/rest/api/maps/route/postroutematrixpreview) to get a matrix of route summaries from the electric vehicle's current position to all reachable charging stations. It then parses the response to get location for the closest reachable charging station with respect to time.

Run the following script to find the closest reachable charging station that can be reached in the minimum amount of time.

```python
locationData = {
            "origins": {
              "type": "MultiPoint",
              "coordinates": [[-122.1386142, 47.6422088]]
            },
            "destinations": {
              "type": "MultiPoint",
              "coordinates": reachableLocations
            }
         }

searchPolyRes = await session.post(url = "https://atlas.microsoft.com/route/matrix/json?subscription-key={}&api-version=1.0&routeType=shortest&waitForResults=false".format(subscriptionKey), json = locationData) 
routeMatrixResponse = await (await session.get(searchPolyRes.headers["Location"])).json()

distances = []
for dist in range(len(reachableLocations)):
    distances.append(routeMatrixResponse["matrix"][0][dist]["response"]["routeSummary"]["travelTimeInSeconds"])
    
minDistIndex = distances.index(min(distances))
reachableLocations[minDistIndex][0], reachableLocations[minDistIndex][1] = reachableLocations[minDistIndex][1], reachableLocations[minDistIndex][0]
closestChargeLoc = ",".join(str(i) for i in reachableLocations[minDistIndex])
```

## Get route to the closest charging station

After we have found the closest charging station, next we will call the [Get Route Directions API](https://docs.microsoft.com/en-us/rest/api/maps/route/getroutedirections) of the Azure Maps routing service to find the route from the electric vehicle's current location to the charging station.

Run the following script to get the route, and parse the response to create a geojson object of the route.

```python
routeResponse = await (await session.get("https://atlas.microsoft.com/route/directions/json?subscription-key={}&api-version=1.0&query={}:{}".format(subscriptionKey, currentLocation, closestChargeLoc))).json()

routeResponse
route = []
for loc in range(len(routeResponse["routes"][0]["legs"][0]["points"])):
                location = list(routeResponse["routes"][0]["legs"][0]["points"][loc].values())
                location[0], location[1] = location[1], location[0]
                route.append(location)

routeData = {
         "type": "LineString",
         "coordinates": route
     }
```

## Visualize the route

In order to visualize the route, we will first upload the route data as a geojson object into the Azure Maps data service using the Azure Maps [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview). And then call the Render service, [Get Map Image API](https://docs.microsoft.com/en-us/rest/api/maps/render/getmapimage) to render the route on the map and visualize it.

Run the following script to get the image for the rendered route on the map.

```python
routeUploadRequest = await session.post("https://atlas.microsoft.com/mapData/upload?subscription-key={}&api-version=1.0&dataFormat=geojson".format(subscriptionKey), json = routeData)

udidRequestURI = routeUploadRequest.headers["Location"]+"&subscription-key={}".format(subscriptionKey)

while True:
    udidRequest = await (await session.get(udidRequestURI)).json()
    if 'udid' in udidRequest:
        break
    else:
        time.sleep(0.2)

udid = udidRequest["udid"]

origin = currentLocation.split(",")
destination = closestChargeLoc.split(",")

path = "lc0000FF|lw4||udid-{}".format(udid)
pins = "default|la-35+50|ls12|lc003C62|co9B2F15||{} {}|{} {}".format(origin[1],origin[0],destination[1],destination[0])

staticMapResponse = await session.get("https://atlas.microsoft.com/map/static/png?api-version=1.0&subscription-key={}&&path={}&pins={}&center=-118.32447052001953,34.03615966431561&zoom=10".format(subscriptionKey,path,pins))
staticMapImage = await staticMapResponse.content.read()

await session.close()

display(Image(staticMapImage))
```

![route](./media/tutorial-maps-routing/route.png)