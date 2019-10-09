---
title: Electric vehicle routing using Azure Notebooks (Python) | Microsoft Docs
description: EV Routing using Azure Maps routing APIs and Azure Notebooks.
author: walsehgal
ms.author: v-musehg
ms.date: 10/01/2019
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Electric vehicle routing using Azure Notebooks (Python)

Azure Maps is a portfolio of geospatial service APIs natively integrated into Azure that enable developers, enterprises, and ISVs to create location aware apps and IoT, mobility, logistics, and asset tracking solutions. The Azure Maps REST APIs can be called from languages like Python and R to enable geospatial data analysis and machine learning scenarios. Azure Maps offers a robust set of [routing APIs](https://docs.microsoft.com/rest/api/maps/route) that allows users to calculate routes between several data points based on various conditions such as vehicle type or reachable area. In this tutorial, we will walk through a scenario to help an electric vehicle driver, whose vehicle is low on battery charge, to find the closest possible charging station with respect to drive time.

In this tutorial you will:

> [!div class="checklist"]
> *	Create and run a Jupyter Notebook on [Azure Notebooks](https://docs.microsoft.com/azure/notebooks) in the cloud
> *	Call Azure Maps REST APIs in Python
> *	Search for a reachable range based on the electric vehicle's consumption model.
> *	Search for electric vehicle charging stations within the reachable range (or isochrone).
> *	Render the reachable range boundary and charging stations on a map.
> *	Find and visualize route to the closest electric vehicle charging station based on time.


## Prerequisites 

To complete the steps in this tutorial, you first need to create an Azure Maps account and get your primary key (subscription key). Follow instructions in [manage account](https://docs.microsoft.com/azure/azure-maps/how-to-manage-account-keys#create-a-new-account) to create an Azure Maps account subscription with S1 pricing tier and follow the steps in [get primary key](./tutorial-search-location.md#getkey) to get the primary subscription key for your account.

## Create an Azure Notebook

In order to follow along with this tutorial, you will need to create an Azure Notebook project and download and run the Jupyter notebook file. The notebook file contains Python code, which implements the scenario in this tutorial. Follow the steps below to create an Azure Notebook project and upload the Jupyter notebook document into it.

1. Go to [Azure Notebooks](https://notebooks.azure.com) and sign in. For more information, see [Quickstart](https://docs.microsoft.com/azure/notebooks/quickstart-sign-in-azure-notebooks).
2. From your public profile page, select **My Projects** at the top of the page.

    ![my project](./media/tutorial-ev-routing/myproject.png)

3. On the **My Projects** page, select **New Project**.
 
   ![new project](./media/tutorial-ev-routing/create-project.png)

4. In the **Create New Project** popup that appears, enter the following information and click **Create**:
    * Project Name
    * Project ID
 
    ![create project](./media/tutorial-ev-routing/create-project-window.png)

5. Once your project is created, download the [Jupyter notebook document file](https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook/blob/master/AzureMapsJupyterSamples/Tutorials/EV%20Routing%20and%20Reachable%20Range/EVrouting.ipynb) from the [Azure Maps Jupyter Notebook repository](https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook). 

6. Select your project from the projects list on the **My Projects** page and click on **Upload** to upload the Jupyter notebook document file. Upload the file from your computer and click **Done**.

    ![upload notebook](./media/tutorial-ev-routing/upload-notebook.png)

7. Upon a successful upload, you will see your file in your project page. Click on the notebook file to open it as a Jupyter Notebook.

In order to better understand the functionality implemented in the notebook file, we recommend you to run the code in the notebook one cell at a time. You can run the code in each cell by clicking on the **Run** button at the top in the notebook app.

  ![run](./media/tutorial-ev-routing/run.png)

## Install project level packages

In order to run the code in the notebook, you will have to install packages at the project level. Follow the steps below to install the required packages:

1. Download the ["requirements.txt"](https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook/blob/master/AzureMapsJupyterSamples/Tutorials/EV%20Routing%20and%20Reachable%20Range/requirements.txt) file from the [Azure Maps Jupyter Notebook repository](https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook) and upload it to your project.
2. On the project dashboard, select **Project Settings**. 
3. In the popup that appears, select the **Environment tab**, then select **Add**.
4. Under **Environment Setup Steps**, 
    * In the first drop-down control, choose **Requirements.txt**.
    * In the second drop-down control, choose your "requirements.txt" file.
    * In the third drop-down control, choose Python Version 3.6 as the python version.
7. Select **Save**.

    ![install packages](./media/tutorial-ev-routing/install-packages.png)

## Load required modules and frameworks

Run the following script to load all of the required modules and frameworks.

```python
import time
import aiohttp
import urllib.parse
from IPython.display import Image, display
```

## Request for reachable range boundary

In our scenario, a package delivery company has some electric vehicles in their fleet. During the day, electric vehicles need to be recharged without having to return to the warehouse. Every time the current remaining charge for the electric vehicle gets less than an hour (electric vehicle is low on charge), we need to search for a set of charging stations that are within the reachable range and get the boundary information for that range. Because company prefers to use routes balanced by economy and speed, the requested routeType is 'eco'. The following script calls the [Get Route Range API](https://docs.microsoft.com/rest/api/maps/route/getrouterange) of the Azure Maps routing service with parameters for the vehicle's consumption model and parses the response to create a polygon object of the geojson format representing the car's maximum reachable range.

Run the script in the cell below to get bounds for the electric vehicle's reachable range.

```python
subscriptionKey = "Your Azure Maps primary subscription key"
currentLocation = [34.028115,-118.5184279]
session = aiohttp.ClientSession()

# Parameters for the vehicle consumption model 
travelMode = "car"
vehicleEngineType = "electric"
currentChargeInkWh=45
maxChargeInkWh=80
timeBudgetInSec=550
routeType="eco"
constantSpeedConsumptionInkWhPerHundredkm="50,8.2:130,21.3"


# Get bounds for the electric vehicle's reachable range.
routeRangeResponse = await (await session.get("https://atlas.microsoft.com/route/range/json?subscription-key={}&api-version=1.0&query={}&travelMode={}&vehicleEngineType={}&currentChargeInkWh={}&maxChargeInkWh={}&timeBudgetInSec={}&routeType={}&constantSpeedConsumptionInkWhPerHundredkm={}"
                                              .format(subscriptionKey,str(currentLocation[0])+","+str(currentLocation[1]),travelMode, vehicleEngineType, currentChargeInkWh, maxChargeInkWh, timeBudgetInSec, routeType, constantSpeedConsumptionInkWhPerHundredkm))).json()

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

## Search electric vehicle charging stations within reachable range

Once we have the reachable range (isochrone) for the electric vehicle, we can search for charging stations in that range. The following script calls the Azure Maps [Post Search Inside Geometry API](https://docs.microsoft.com/rest/api/maps/search/postsearchinsidegeometry) to search for electric vehicle charging stations within bounds of the car's maximum reachable range, and then parses the response to an array of reachable locations.

Run the following script to search for electric vehicle charging stations within reachable range.

```python
# Search for EV stations within reachable range.
searchPolyResponse = await (await session.post(url = "https://atlas.microsoft.com/search/geometry/json?subscription-key={}&api-version=1.0&query=electric vehicle station&idxSet=POI&limit=50".format(subscriptionKey), json = boundsData)).json() 

reachableLocations = []
for loc in range(len(searchPolyResponse["results"])):
                location = list(searchPolyResponse["results"][loc]["position"].values())
                location[0], location[1] = location[1], location[0]
                reachableLocations.append(location)
```

## Upload reachable range and charging points to Azure Maps Data service

In order to visualize the charging stations and boundary for the maximum reachable range of the electric vehicle on the map, we need to upload the boundary data and charging stations data as geojson objects to the Azure Maps Data service, using the [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview). 

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

# Upload range data to Azure Maps data service.
uploadRangeResponse = await session.post("https://atlas.microsoft.com/mapData/upload?subscription-key={}&api-version=1.0&dataFormat=geojson".format(subscriptionKey), json = rangeData)

rangeUdidRequest = uploadRangeResponse.headers["Location"]+"&subscription-key={}".format(subscriptionKey)

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

# Upload EV charging stations data to Azure Maps data service.
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

## Render charging stations and reachable range on map

Once we have the data uploaded to the data service, we will now run the following script to call the Azure Maps [Get Map Image service](https://docs.microsoft.com/rest/api/maps/render/getmapimage) to render the charging points and maximum reachable boundary on the static map image.

```python
# Get bounds for bounding box.
def getBounds(polyBounds):
    maxLon = max(map(lambda x: x[0], polyBounds))
    minLon = min(map(lambda x: x[0], polyBounds))

    maxLat = max(map(lambda x: x[1], polyBounds))
    minLat = min(map(lambda x: x[1], polyBounds))
    
    # Buffer the bounding box by 10% to account for the pixel size of pins at the ends of the route.
    lonBuffer = (maxLon-minLon)*0.1
    minLon -= lonBuffer
    maxLon += lonBuffer

    latBuffer = (maxLat-minLat)*0.1
    minLat -= latBuffer
    maxLat += latBuffer
    
    return [minLon, maxLon, minLat, maxLat]

minLon, maxLon, minLat, maxLat = getBounds(polyBounds)

path = "lcff3333|lw3|la0.80|fa0.35||udid-{}".format(rangeUdid)
pins = "custom|an15 53||udid-{}||https://raw.githubusercontent.com/Azure-Samples/AzureMapsCodeSamples/master/AzureMapsCodeSamples/Common/images/icons/ev_pin.png".format(poiUdid)

encodedPins = urllib.parse.quote(pins, safe='')

# Render range and EV charging points on the map.
staticMapResponse =  await session.get("https://atlas.microsoft.com/map/static/png?api-version=1.0&subscription-key={}&pins={}&path={}&bbox={}&zoom=12".format(subscriptionKey,encodedPins,path,str(minLon)+", "+str(minLat)+", "+str(maxLon)+", "+str(maxLat)))

poiRangeMap = await staticMapResponse.content.read()

display(Image(poiRangeMap))
```

![location range](./media/tutorial-ev-routing/location-range.png)


## Find the optimal charging station to stop

After we have all the potential charging stations within the reachable range, we want to know which one of the stations can be reached in the minimum amount of time. The following script calls the Azure Maps [Matrix routing API](https://docs.microsoft.com/rest/api/maps/route/postroutematrixpreview) returning for the given vehicle location the travel time and distance to every given charging station location. The script in the next cell, parses the response to get location for the closest reachable charging station with respect to time.

Run the following cell to find the closest reachable charging station that can be reached in the minimum amount of time.

```python
locationData = {
            "origins": {
              "type": "MultiPoint",
              "coordinates": [[currentLocation[1],currentLocation[0]]]
            },
            "destinations": {
              "type": "MultiPoint",
              "coordinates": reachableLocations
            }
         }

# Get the travel time and distance to every given charging station location.
searchPolyRes = await (await session.post(url = "https://atlas.microsoft.com/route/matrix/json?subscription-key={}&api-version=1.0&routeType=shortest&waitForResults=true".format(subscriptionKey), json = locationData)).json()

distances = []
for dist in range(len(reachableLocations)):
    distances.append(searchPolyRes["matrix"][0][dist]["response"]["routeSummary"]["travelTimeInSeconds"])

minDistLoc = []
minDistIndex = distances.index(min(distances))
minDistLoc.extend([reachableLocations[minDistIndex][1], reachableLocations[minDistIndex][0]])
closestChargeLoc = ",".join(str(i) for i in minDistLoc)
```

## Calculate route to the closest charging station

Now that we have found the closest charging station, next we will call the [Get Route Directions API](https://docs.microsoft.com/rest/api/maps/route/getroutedirections) to request the detailed route from the electric vehicle's current location to the charging station.

Run the script in the following cell to get the route, and parse the response to create a geojson object representing the route.

```python
# Get route from current location to the closest charging station. 
routeResponse = await (await session.get("https://atlas.microsoft.com/route/directions/json?subscription-key={}&api-version=1.0&query={}:{}".format(subscriptionKey, str(currentLocation[0])+","+str(currentLocation[1]), closestChargeLoc))).json()

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

In order to visualize the route, we will first upload the route data as a geojson object into the Azure Maps Data service using the Azure Maps [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview). And then call the Render service, [Get Map Image API](https://docs.microsoft.com/rest/api/maps/render/getmapimage) to render the route on the map and visualize it.

Run the following script to get an image for the rendered route on the map.

```python
# Upload route data to Azure data service.
routeUploadRequest = await session.post("https://atlas.microsoft.com/mapData/upload?subscription-key={}&api-version=1.0&dataFormat=geojson".format(subscriptionKey), json = routeData)

udidRequestURI = routeUploadRequest.headers["Location"]+"&subscription-key={}".format(subscriptionKey)

while True:
    udidRequest = await (await session.get(udidRequestURI)).json()
    if 'udid' in udidRequest:
        break
    else:
        time.sleep(0.2)

udid = udidRequest["udid"]

destination = route[-1]

destination[1], destination[0] = destination[0], destination[1]

path = "lc0f6dd9|lw6||udid-{}".format(udid)
pins = "default|codb1818||{} {}|{} {}".format(str(currentLocation[1]),str(currentLocation[0]),destination[1],destination[0])


# Get bounds for bounding box.
minLat, maxLat = (float(destination[0]),currentLocation[0]) if float(destination[0])<currentLocation[0] else (currentLocation[0], float(destination[0]))
minLon, maxLon = (float(destination[1]),currentLocation[1]) if float(destination[1])<currentLocation[1] else (currentLocation[1], float(destination[1]))

#Buffer the bounding box by 10% to account for the pixel size of pins at the ends of the route.
lonBuffer = (maxLon-minLon)*0.1
minLon -= lonBuffer
maxLon += lonBuffer

latBuffer = (maxLat-minLat)*0.1
minLat -= latBuffer
maxLat += latBuffer

# Render route on the map.
staticMapResponse = await session.get("https://atlas.microsoft.com/map/static/png?api-version=1.0&subscription-key={}&&path={}&pins={}&bbox={}&zoom=16".format(subscriptionKey,path,pins,str(minLon)+", "+str(minLat)+", "+str(maxLon)+", "+str(maxLat)))

staticMapImage = await staticMapResponse.content.read()

await session.close()
display(Image(staticMapImage))
```

![route](./media/tutorial-ev-routing/route.png)

## Next steps

In this tutorial, you learned how to call Azure Maps REST APIs directly and visualize Azure Maps data using Python.

To explore Azure Maps APIs used in this tutorial, see:

* [Get Route Range](https://docs.microsoft.com/rest/api/maps/route/getrouterange)
* [Post Search Inside Geometry](https://docs.microsoft.com/rest/api/maps/search/postsearchinsidegeometry)
* [Data Upload](https://docs.microsoft.com/rest/api/maps/data/uploadpreview)
* [Render - Get Map Image](https://docs.microsoft.com/rest/api/maps/render/getmapimage)
* [Post Route Matrix](https://docs.microsoft.com/rest/api/maps/route/postroutematrixpreview)
* [Get Route Directions](https://docs.microsoft.com/rest/api/maps/route/getroutedirections)

For a complete list of Azure Maps REST APIs, see:

* [Azure Maps REST APIs](https://docs.microsoft.com/azure/azure-maps/#reference)

To learn more about Azure Notebooks, see:

* [Azure Notebooks](https://docs.microsoft.com/azure/notebooks)