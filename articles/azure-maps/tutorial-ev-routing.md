---
title: 'Tutorial: Route electric vehicles using Jupyter Notebooks (Python) with Microsoft Azure Maps'
description: Tutorial on how to route electric vehicles by using Microsoft Azure Maps routing APIs and Jupyter Notebooks in VS Code.
author: farazgis
ms.author: fsiddiqui
ms.date: 10/11/2024
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps

ms.custom: mvc, devx-track-python
---

# Tutorial: Route electric vehicles using Jupyter Notebooks (Python)

Azure Maps is a portfolio of geospatial service APIs integrated into Azure, enabling developers to create location-aware applications for various scenarios like IoT, mobility, and asset tracking.

Azure Maps REST APIs support languages like Python and R for geospatial data analysis and machine learning, offering robust [routing APIs] for calculating routes based on conditions such as vehicle type or reachable area.

This tutorial guides users through routing electric vehicles using Azure Maps APIs along with [Jupyter Notebooks in VS Code] and Python to find the closest charging station when the battery is low.

In this tutorial, you will:

> [!div class="checklist"]
>
> * Create and run a [Jupyter Notebook in VS Code].
> * Call Azure Maps REST APIs in Python.
> * Search for a reachable range based on the electric vehicle's consumption model.
> * Search for electric vehicle charging stations within the reachable range, or [isochrone].
> * Render the reachable range boundary and charging stations on a map.
> * Find and visualize a route to the closest electric vehicle charging station based on drive time.

## Prerequisites

* An [Azure Maps account]
* A [subscription key]
* [Visual Studio Code]
* A working knowledge of [Jupyter Notebooks in VS Code]
* Environment set up to work with Python in Jupyter Notebooks. For more information, see [Setting up your environment].

> [!NOTE]
> For more information on authentication in Azure Maps, see [manage authentication in Azure Maps].

## Install project level packages

The _EV Routing and Reachable Range_ project has dependencies on the [aiohttp] and [IPython] python libraries. You can install these in the Visual Studio terminal using pip:

```python
pip install aiohttp
pip install ipython
```

## Open Jupyter Notebook in Visual Studio Code

Download then open the Notebook used in this tutorial:

1. Open the file [EVrouting.ipynb] in the [AzureMapsJupyterSamples] repository in GitHub.
1. Select the **Download raw file** button in the upper-right corner of the screen to save the file locally.

    :::image type="content" source="./media/tutorial-ev-routing/download-notebook.png"alt-text="A screenshot showing how to download the Notebook file named EVrouting.ipynb from the GitHub repository.":::

1. Open the downloaded Notebook in Visual Studio Code by right-clicking on the file then selecting **Open with > Visual Studio Code**, or through the VS Code File Explorer.

## Load the required modules and frameworks

Once your code is added, you can run a cell using the **Run** icon to the left of the cell and the output is displayed below the code cell.

Run the following script to load all the required modules and frameworks.

```Python
import time
import aiohttp
import urllib.parse
from IPython.display import Image, display
```

:::image type="content" source="./media/tutorial-ev-routing/import-libraries.png"alt-text="A screenshot showing how to download the first cell in the Notebook containing the required import statements with the run button highlighted.":::

## Request the reachable range boundary

A package delivery company operates a fleet that includes some electric vehicles. These vehicles need to be recharged during the day without returning to the warehouse. When the remaining charge drops below an hour, a search is conducted to find charging stations within a reachable range. The boundary information for the range of these charging stations is then obtained.

The requested `routeType` is _eco_ to balance economy and speed. The following script calls the [Get Route Range] API of the Azure Maps routing service, using parameters related to the vehicle's consumption model. The script then parses the response to create a polygon object in GeoJSON format, representing the car's maximum reachable range.

```python
subscriptionKey = "Your Azure Maps key"
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

# Get boundaries for the electric vehicle's reachable range.
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

## Search for electric vehicle charging stations within the reachable range

After determining the electric vehicle's reachable range ([isochrone]), you can search for charging stations within that area.

The following script uses the Azure Maps [Post Search Inside Geometry] API to find charging stations within the vehicle’s maximum reachable range. It then parses the response into an array of reachable locations.

```python
# Search for electric vehicle stations within reachable range.
searchPolyResponse = await (await session.post(url = "https://atlas.microsoft.com/search/geometry/json?subscription-key={}&api-version=1.0&query=electric vehicle station&idxSet=POI&limit=50".format(subscriptionKey), json = boundsData)).json() 

reachableLocations = []
for loc in range(len(searchPolyResponse["results"])):
                location = list(searchPolyResponse["results"][loc]["position"].values())
                location[0], location[1] = location[1], location[0]
                reachableLocations.append(location)
```

## Render the charging stations and reachable range on a map

Call the Azure Maps [Get Map Image service] to render the charging points and maximum reachable boundary on the static map image by running the following script:

```python
# Get boundaries for the bounding box.
def getBounds(polyBounds):
    maxLon = max(map(lambda x: x[0], polyBounds))
    minLon = min(map(lambda x: x[0], polyBounds))

    maxLat = max(map(lambda x: x[1], polyBounds))
    minLat = min(map(lambda x: x[1], polyBounds))
    
    # Buffer the bounding box by 10 percent to account for the pixel size of pins at the ends of the route.
    lonBuffer = (maxLon-minLon)*0.1
    minLon -= lonBuffer
    maxLon += lonBuffer

    latBuffer = (maxLat-minLat)*0.1
    minLat -= latBuffer
    maxLat += latBuffer
    
    return [minLon, maxLon, minLat, maxLat]

minLon, maxLon, minLat, maxLat = getBounds(polyBounds)
polyBoundsFormatted = ('|'.join(map(str, polyBounds))).replace('[','').replace(']','').replace(',','')
reachableLocationsFormatted = ('|'.join(map(str, reachableLocations))).replace('[','').replace(']','').replace(',','')

path = "lcff3333|lw3|la0.80|fa0.35||{}".format(polyBoundsFormatted)
pins = "custom|an15 53||{}||https://raw.githubusercontent.com/Azure-Samples/AzureMapsCodeSamples/e3a684e7423075129a0857c63011e7cfdda213b7/Static/images/icons/ev_pin.png".format(reachableLocationsFormatted)

encodedPins = urllib.parse.quote(pins, safe='')

# Render the range and electric vehicle charging points on the map.
staticMapResponse =  await session.get("https://atlas.microsoft.com/map/static/png?api-version=2022-08-01&subscription-key={}&pins={}&path={}&bbox={}&zoom=12".format(subscriptionKey,encodedPins,path,str(minLon)+", "+str(minLat)+", "+str(maxLon)+", "+str(maxLat)))

poiRangeMap = await staticMapResponse.content.read()

display(Image(poiRangeMap))
```

:::image type="content" source="./media/tutorial-ev-routing/location-range.png"alt-text="A screenshot that shows the location range.":::

## Find the optimal charging station

First, identify all the potential charging stations within the vehicle’s reachable range. Next, determine which of these stations can be accessed in the shortest possible time.

The following script calls the Azure Maps [Matrix Routing] API. It returns the vehicle's location, travel time, and distance to each charging station. The subsequent script parses this response to identify the closest charging station that can be reached in the least amount of time.

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

# Get the travel time and distance to each specified charging station.
searchPolyRes = await (await session.post(url = "https://atlas.microsoft.com/route/matrix/json?subscription-key={}&api-version=1.0&routeType=shortest&waitForResults=true".format(subscriptionKey), json = locationData)).json()

distances = []
for dist in range(len(reachableLocations)):
    distances.append(searchPolyRes["matrix"][0][dist]["response"]["routeSummary"]["travelTimeInSeconds"])

minDistLoc = []
minDistIndex = distances.index(min(distances))
minDistLoc.extend([reachableLocations[minDistIndex][1], reachableLocations[minDistIndex][0]])
closestChargeLoc = ",".join(str(i) for i in minDistLoc)
```

## Calculate the route to the closest charging station

After locating the nearest charging station, use the [Get Route Directions] API to obtain detailed directions from the vehicles current location. Run the script in the next cell to generate and parse a GeoJSON object representing the route.

```python
# Get the route from the electric vehicle's current location to the closest charging station. 
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

To visualize the route, use the [Get Map Image] API to render it on the map.

```python
destination = route[-1]

#destination[1], destination[0] = destination[0], destination[1]

routeFormatted = ('|'.join(map(str, route))).replace('[','').replace(']','').replace(',','')
path = "lc0f6dd9|lw6||{}".format(routeFormatted)
pins = "default|codb1818||{} {}|{} {}".format(str(currentLocation[1]),str(currentLocation[0]),destination[0],destination[1])


# Get boundaries for the bounding box.
minLon, maxLon = (float(destination[0]),currentLocation[1]) if float(destination[0])<currentLocation[1] else (currentLocation[1], float(destination[0]))
minLat, maxLat = (float(destination[1]),currentLocation[0]) if float(destination[1])<currentLocation[0] else (currentLocation[0], float(destination[1]))

# Buffer the bounding box by 10 percent to account for the pixel size of pins at the ends of the route.
lonBuffer = (maxLon-minLon)*0.1
minLon -= lonBuffer
maxLon += lonBuffer

latBuffer = (maxLat-minLat)*0.1
minLat -= latBuffer
maxLat += latBuffer

# Render the route on the map.
staticMapResponse = await session.get("https://atlas.microsoft.com/map/static/png?api-version=2022-08-01&subscription-key={}&&path={}&pins={}&bbox={}&zoom=16".format(subscriptionKey,path,pins,str(minLon)+", "+str(minLat)+", "+str(maxLon)+", "+str(maxLat)))

staticMapImage = await staticMapResponse.content.read()

await session.close()
display(Image(staticMapImage))
```

:::image type="content" source="./media/tutorial-ev-routing/route.png"alt-text="A screenshot that shows a map showing the route.":::

In this tutorial, you learned how to call Azure Maps REST APIs directly and visualize Azure Maps data by using Python.

For more information on the Azure Maps APIs used in this tutorial, see:

* [Get Route Directions]
* [Get Route Range]
* [Post Route Matrix]
* [Post Search Inside Geometry]
* [Render - Get Map Image]

For a complete list of Azure Maps REST APIs, see [Azure Maps REST APIs].

## Next steps

> [!div class="nextstepaction"]
> [Learn more about all the notebooks experiences from Microsoft and GitHub](https://visualstudio.microsoft.com/vs/features/notebooks-at-microsoft)

[aiohttp]: https://pypi.org/project/aiohttp/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps REST APIs]: /rest/api/maps
[AzureMapsJupyterSamples]: https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook
[EVrouting.ipynb]: https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook/blob/master/AzureMapsJupyterSamples/Tutorials/EV%20Routing%20and%20Reachable%20Range/EVrouting.ipynb
[Get Map Image service]: /rest/api/maps/render/get-map-static-image
[Get Map Image]: /rest/api/maps/render/get-map-static-image
[Get Route Directions]: /rest/api/maps/route/getroutedirections
[Get Route Range]: /rest/api/maps/route/getrouterange
[IPython]: https://ipython.readthedocs.io/en/stable/index.html
[isochrone]: glossary.md#isochrone
[Jupyter Notebook in VS Code]: https://code.visualstudio.com/docs/datascience/jupyter-notebooks
[Jupyter Notebooks in VS Code]: https://code.visualstudio.com/docs/datascience/jupyter-notebooks
[manage authentication in Azure Maps]: how-to-manage-authentication.md
[Matrix Routing]: /rest/api/maps/route/postroutematrix
[Post Route Matrix]: /rest/api/maps/route/postroutematrix
[Post Search Inside Geometry]: /rest/api/maps/search/postsearchinsidegeometry?view=rest-maps-1.0&preserve-view=true
[Render - Get Map Image]: /rest/api/maps/render/get-map-static-image
[routing APIs]: /rest/api/maps/route
[Setting up your environment]: https://code.visualstudio.com/docs/datascience/jupyter-notebooks#_setting-up-your-environment
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Visual Studio Code]: https://code.visualstudio.com/
