---
title: Search with Azure Maps | Microsoft Docs
description: Search nearby point of interest using Azure Maps
author: dsk-2015
ms.author: dkshir
ms.date: 10/02/2018
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Search nearby points of interest using Azure Maps

This tutorial shows how to set up an account with Azure Maps, then use the Maps APIs to search for a point of interest. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Maps account
> * Retrieve the primary key for your Maps account
> * Create a new web page using the map control API
> * Use the Maps search service to find a nearby point of interest

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

<a id="createaccount"></a>

## Create an account with Azure Maps

Create a new Maps account with the following steps:

1. In the upper left-hand corner of the [Azure portal](https://portal.azure.com), click **Create a resource**.
2. In the *Search the Marketplace* box, type **Maps**.
3. From the *Results*, select **Maps**. Click **Create** button that appears below the map.
4. On the **Create Maps Account** page, enter the following values:
    * The *Name* of your new account.
    * The *Subscription* that you want to use for this account.
    * The *Resource group* name for this account. You may choose to *Create new* or *Use existing* resource group.
    * Select the *Resource group location*.
    * Read the *License* and *Privacy Statement*, and check the checkbox to accept the terms.
    * Click the **Create** button.

    ![Create Maps account in portal](./media/tutorial-search-location/create-account.png)

<a id="getkey"></a>

## Get the primary key for your account

Once your Maps account is successfully created, retrieve the key that enables you to query the Maps APIs.

1. Open your Maps account in the portal.
2. In the settings section, select **Keys**.
3. Copy the **Primary Key** to your clipboard. Save it locally to use later in this tutorial.

    ![Get Primary Key in portal](./media/tutorial-search-location/get-key.png)

<a id="createmap"></a>

## Create a new map

The Map Control API is a convenient client library that allows you to easily integrate Maps into your web application. It hides the complexity of the bare REST service calls and boosts your productivity with styleable and customizable components. The following steps show you how to create a static HTML page embedded with the Map Control API.

1. On your local machine, create a new file and name it **MapSearch.html**.
2. Add the following HTML components to the file:

    ```HTML
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <title>Map Search</title>

        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1"></script>
        <script src="https://atlas.microsoft.com/sdk/js/atlas-service.min.js?api-version=1"></script>

        <style>
            html,
            body {
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
            }

            #map {
                width: 100%;
                height: 100%;
            }
        </style>
    </head>

    <body>
        <div id="map"></div>
        <script>
            // Embed Map Control JavaScript code here
        </script>
    </body>

    </html>
    ```
    Notice that the HTML header includes the CSS and JavaScript resource files hosted by the Azure Map Control library. Note the *script* segment added to the *body* of the HTML file. This segment will contain the inline JavaScript code to access the Azure Maps APIs.

3. Add the following JavaScript code to the *script* block of the HTML file. Replace the string **\<your account key\>** with the primary key that you copied from your Maps account.

    ```JavaScript
    // Instantiate map to the div with id "map"
    var MapsAccountKey = "<your account key>";
    var map = new atlas.Map("map", {
        "subscription-key": MapsAccountKey
    });
    ```
    This segment initializes the Map Control API for your Azure Maps account key. **Atlas** is the namespace that contains the API and related visual components. **Atlas.Map** provides the control for a visual and interactive web map.

4. Save your changes to the file and open the HTML page in a browser. This is the most basic map that you can make by calling **atlas.map** using your account key.

   ![View the map](./media/tutorial-search-location/basic-map.png)

<a id="usesearch"></a>

## Add search capabilities

This section shows how to use the Maps Search API to find a point of interest on your map. It's a RESTful API designed for developers to search for addresses, points of interest, and other geographical information. The Search service assigns a latitude and longitude information to a specified address. The **Service Module** explained below can be used to search for a location using the Maps Search API.

### Service Module

1. Add a new layer to your map to display the search results. Add the following Javascript code to the script block, after the code that initializes the map.

    ```JavaScript
    // Initialize the pin layer for search results to the map
    var searchLayerName = "search-results";
    ```

2. To instantiate the client service, add the following Javascript code to the script block, after the code that initializes the map.

    ```JavaScript
    var client = new atlas.service.Client(MapsAccountKey);
    ```

3. All functions on the map should be loaded after the map is loaded. You can ensure that by putting all map functions inside the map eventListener block. Add the following lines of code to add an [eventListener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addeventlistener) to the map to ensure that the map gets loaded fully before adding functionalities.
    
    ```JavaScript
         map.addEventListener("load", function() {
         });
    ```

4. Add the following script block **within the map load eventListener** to build the query. It uses the Fuzzy Search Service, which is a basic search API of the Search Service. Fuzzy Search Service handles most fuzzy inputs like any combination of address and point of interest (POI) tokens. It searches for nearby Gasoline Stations within the specified radius. The response is then parsed into GeoJSON format and converted into point features, which are added to the map as pins. The last part of the script adds camera bounds for the map by using the Map's [setCameraBounds](https://docs.microsoft.com/javascript/api/azure-maps-control/models.cameraboundsoptions?view=azure-iot-typescript-latest) property.

    ```JavaScript

            // Execute a POI search query then add pins to the map for each result once a response is received
            client.search.getSearchFuzzy("gasoline station", {
            lat: 47.6292,
            lon: -122.2337,
            radius: 100000
            }).then(response => {
       
            // Parse the response into GeoJSON 
            var geojsonResponse = new atlas.service.geojson.GeoJsonSearchResponse(response);

            // Create the point features that will be added to the map as pins
            var searchPins = geojsonResponse.getGeoJsonResults().features.map(poiResult => {
               var poiPosition = [poiResult.properties.position.lon, poiResult.properties.position.lat];
               return new atlas.data.Feature(new atlas.data.Point(poiPosition), {
                name: poiResult.properties.poi.name,
                address: poiResult.properties.address.freeformAddress,
                position: poiPosition[1] + ", " + poiPosition[0]
               });
            });

            // Add pins to the map for each POI
            map.addPins(searchPins, {
               name: searchLayerName,
               cluster: false, 
               icon: "pin-round-darkblue" 
            });

            // Set the camera bounds
            map.setCameraBounds({
               bounds: geojsonResponse.getGeoJsonResults().bbox,
               padding: 50
            );
        });
    ```
5. Save the **MapSearch.html** file and refresh your browser. You should now see that the map is centered on Seattle with blue pins marking the locations of gasoline stations in the area.

   ![View the map with search results](./media/tutorial-search-location/pins-map.png)

6. You can see the raw data that the map is rendering by entering the following HTTPRequest in your browser. Replace \<your account key\> with your primary key.

   ```http
   https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&query=gasoline%20station&subscription-key=<your account key>&lat=47.6292&lon=-122.2337&radius=100000
   ```

At this point, the MapSearch page can display the locations of points of interest that are returned from a fuzzy search query. Let's add some interactive capabilities and more information about the locations.

## Add interactive data

The map that we've made so far only looks at the latitude/longitude data for the search results. If you look at the raw JSON that the Maps Search service returns, however, you see that it contains additional information about each gas station, including the name and street address. You can incorporate that data into the map with interactive pop-up boxes.

1. Add the following lines to the *script* block, to create pop-ups for the points of interest returned by the Search Service:

    ```JavaScript
    // Add a popup to the map which will display some basic information about a search result on hover over a pin
    var popup = new atlas.Popup();
    map.addEventListener("mouseover", searchLayerName, (e) => {
        var popupContentElement = document.createElement("div");
        popupContentElement.style.padding = "5px";

        var popupNameElement = document.createElement("div");
        popupNameElement.innerText = e.features[0].properties.name;
        popupContentElement.appendChild(popupNameElement);

        var popupAddressElement = document.createElement("div");
        popupAddressElement.innerText = e.features[0].properties.address;
        popupContentElement.appendChild(popupAddressElement);

        var popupPositionElement = document.createElement("div");
        popupPositionElement.innerText = e.features[0].properties.position;
        popupContentElement.appendChild(popupPositionElement);

        popup.setPopupOptions({
            position: e.features[0].geometry.coordinates,
            content: popupContentElement
        });

        popup.open(map);
    });
    ```
    The API **atlas.Popup** provides an information window anchored at the required position on the map. This code snippet sets the content and position for the popup. It also adds an event listener to the `map` control that will wait for the _mouse_ to roll over the popup.

2. Save the file and refresh your browser. Now the map in the browser shows information pop-ups when you hover over any of the search pins.

    ![Azure Map Control and Search Service](./media/tutorial-search-location/popup-map.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an account with Azure Maps
> * Get the primary key for your account
> * Create new web page using Map Control API
> * Use Search Service to find nearby point of interest

You can access the code sample for this tutorial here:

> [Search location with Azure Maps](https://github.com/Azure-Samples/azure-maps-samples/blob/master/src/search.html)

The next tutorial demonstrates how to display a route between two locations.

> [!div class="nextstepaction"]
> [Route to a destination](./tutorial-route-location.md)
