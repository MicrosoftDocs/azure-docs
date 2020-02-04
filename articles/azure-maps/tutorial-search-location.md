---
title: 'Tutorial: Search for nearby locations on a map | Microsoft Azure Maps'
description: In this tutorial, you will learn how to search for points of interest on a map using Microsoft Azure Maps.
author: walsehgal
ms.author: v-musehg
ms.date: 1/15/2020
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Tutorial: Search nearby points of interest using Azure Maps

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
    * The *Subscription* that you want to use for this account.
    * The *Resource group* name for this account. You may choose to *Create new* or *Use existing* resource group.
    * The *Name* of your new account.
    * The *Pricing tier* for this account.
    * Read the *License* and *Privacy Statement*, and check the checkbox to accept the terms.
    * Click the **Create** button.

![Create Azure Maps account in Azure portal](./media/tutorial-search-location/create-account.png)

<a id="getkey"></a>

## Get the primary key for your account

Once your Maps account is successfully created, retrieve the key that enables you to query the Maps APIs. We recommend using your account's primary key as the subscription key when calling Azure Maps services.

1. Open your Maps account in the portal.
2. In the settings section, select **Authentication**.
3. Copy the **Primary Key** to your clipboard. Save it locally to use later in this tutorial.

![Get Primary Key in Azure portal](./media/tutorial-search-location/get-key.png)

For more information on authentication in Azure Maps, see [manage authentication in Azure Maps](how-to-manage-authentication.md).

<a id="createmap"></a>

## Create a new map

The Map Control API is a convenient client library. This API allows you to easily integrate Maps into your web application. It hides the complexity of the bare REST service calls and boosts your productivity with customizable components. The following steps show you how to create a static HTML page embedded with the Map Control API.

1. On your local machine, create a new file and name it **MapSearch.html**.
2. Add the following HTML components to the file:

   ```HTML
    <!DOCTYPE html>
    <html>
    <head>
        <title>Map Search</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css">
        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>

        <!-- Add a reference to the Azure Maps Services Module JavaScript file. -->
        <script src="https://atlas.microsoft.com/sdk/javascript/service/2/atlas-service.min.js"></script>

        <script>
        function GetMap(){
            //Add Map Control JavaScript code here.
        }
        </script>

        <style>
            html,
            body {
                width: 100%;
                height: 100%;
                padding: 0;
                margin: 0;
            }

            #myMap {
                width: 100%;
                height: 100%;
            }
        </style>
    </head>
    <body onload="GetMap()">
        <div id="myMap"></div>
    </body>
    </html>
    ```

   Notice that the HTML header includes the CSS and JavaScript resource files hosted by the Azure Map Control library. Note the `onload` event on the body of the page, which will call the `GetMap` function when the body of the page has loaded. The `GetMap` function will contain the inline JavaScript code to access the Azure Maps APIs.

3. Add the following JavaScript code to the `GetMap` function of the HTML file. Replace the string `<Your Azure Maps Key>` with the primary key that you copied from your Maps account.

    ```JavaScript
    //Instantiate a map object
    var map = new atlas.Map("myMap", {
        //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: '<Your Azure Maps Key>'
        }
    });
    ```

   This segment initializes the Map Control API for your Azure Maps account key. `atlas` is the namespace that contains the API and related visual components. `atlas.Map` provides the control for a visual and interactive web map.

4. Save your changes to the file and open the HTML page in a browser. The map shown is the most basic map that you can make by calling `atlas.Map` using your account key.

   ![View the map](./media/tutorial-search-location/basic-map.png)

5. In the `GetMap` function, after initializing the map, add the following JavaScript code.

    ```JavaScript
    //Wait until the map resources are ready.
    map.events.add('ready', function() {

        //Create a data source and add it to the map.
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        //Add a layer for rendering point data.
        var resultLayer = new atlas.layer.SymbolLayer(datasource, null, {
            iconOptions: {
                image: 'pin-round-darkblue',
                anchor: 'center',
                allowOverlap: true
            },
            textOptions: {
                anchor: "top"
            }
        });

        map.layers.add(resultLayer);
    });
    ```

   In this code segment, a `ready` event is added to the map, which will fire when the map resources have been loaded and the map is ready to be accessed. In the map `ready` event handler, a data source is created to store result data. A symbol layer is created and attached to the data source. This layer specifies how the result data in the data source should be rendered. In this case, the result is rendered with a dark blue round pin icon, centered over the results coordinate, and allows other icons to overlap. The result layer is added to the map layers.

<a id="usesearch"></a>

## Add search capabilities

This section shows how to use the Maps [Search API](https://docs.microsoft.com/rest/api/maps/search) to find a point of interest on your map. It's a RESTful API designed for developers to search for addresses, points of interest, and other geographical information. The Search service assigns a latitude and longitude information to a specified address. The **Service Module** explained below can be used to search for a location using the Maps Search API.

### Service Module

1. In the map `ready` event handler, construct the search service URL by adding the following Javascript code.

    ```JavaScript
   // Use SubscriptionKeyCredential with a subscription key
   var subscriptionKeyCredential = new atlas.service.SubscriptionKeyCredential(atlas.getSubscriptionKey());

   // Use subscriptionKeyCredential to create a pipeline
   var pipeline = atlas.service.MapsURL.newPipeline(subscriptionKeyCredential);

   // Construct the SearchURL object
   var searchURL = new atlas.service.SearchURL(pipeline); 
   ```

   The `SubscriptionKeyCredential` creates a `SubscriptionKeyCredentialPolicy` to authenticate HTTP requests to Azure Maps with the subscription key. The `atlas.service.MapsURL.newPipeline()` takes in the `SubscriptionKeyCredential` policy and creates a [Pipeline](https://docs.microsoft.com/javascript/api/azure-maps-rest/atlas.service.pipeline?view=azure-maps-typescript-latest) instance. The `searchURL` represents a URL to Azure Maps [Search](https://docs.microsoft.com/rest/api/maps/search) operations.

2. Next add the following script block to build the search query. It uses the Fuzzy Search Service, which is a basic search API of the Search Service. Fuzzy Search Service handles most fuzzy inputs like addresses, places, and points of interest (POI). This code searches for nearby Gasoline Stations within the specified radius of the provided latitude and longitude. A GeoJSON feature collection from the response is then extracted using the `geojson.getFeatures()` method and added to the data source, which automatically results in the data being rendered on the map via the symbol layer. The last part of the script sets the maps camera view using the bounding box of the results using the Map's [setCamera](/javascript/api/azure-maps-control/atlas.map#setcamera-cameraoptions---cameraboundsoptions---animationoptions-) property.

    ```JavaScript
    var query =  'gasoline-station';
    var radius = 9000;
    var lat = 47.64452336193245;
    var lon = -122.13687658309935;

    searchURL.searchPOI(atlas.service.Aborter.timeout(10000), query, {
        limit: 10,
        lat: lat,
        lon: lon,
        radius: radius
    }).then((results) => {

        // Extract GeoJSON feature collection from the response and add it to the datasource
        var data = results.geojson.getFeatures();
        datasource.add(data);

        // set camera to bounds to show the results
        map.setCamera({
            bounds: data.bbox,
            zoom: 10
        });
    });
    ```

3. Save the **MapSearch.html** file and refresh your browser. You should see the map centered on Seattle with round-blue pins for locations of gasoline stations in the area.

   ![View the map with search results](./media/tutorial-search-location/pins-map.png)

4. You can see the raw data that the map is rendering by entering the following HTTPRequest in your browser. Replace \<Your Azure Maps Key\> with your primary key.

   ```http
   https://atlas.microsoft.com/search/poi/json?api-version=1.0&query=gasoline%20station&subscription-key=<subscription-key>&lat=47.6292&lon=-122.2337&radius=100000
   ```

At this point, the MapSearch page can display the locations of points of interest that are returned from a fuzzy search query. Let's add some interactive capabilities and more information about the locations.

## Add interactive data

The map that we've made so far only looks at the longitude/latitude data for the search results. However, the raw JSON that the Maps Search service returns contains additional information about each gas station. Including the name and street address. You can incorporate that data into the map with interactive popup boxes.

1. Add the following lines of code in the map `ready` event handler after the code to query the fuzzy search service. This code will create an instance of a Popup and add a mouseover event to the symbol layer.

    ```JavaScript
   //Create a popup but leave it closed so we can update it and display it later.
    popup = new atlas.Popup();

    //Add a mouse over event to the result layer and display a popup when this event fires.
    map.events.add('mouseover', resultLayer, showPopup);
    ```

    The API `*atlas.Popup` provides an information window anchored at the required position on the map. 

2. Add the following code within the `GetMap` function, to show the moused over result information in the popup.

    ```JavaScript
    function showPopup(e) {
        //Get the properties and coordinates of the first shape that the event occurred on.

        var p = e.shapes[0].getProperties();
        var position = e.shapes[0].getCoordinates();

        //Create HTML from properties of the selected result.
        var html = `
          <div style="padding:5px">
            <div><b>${p.poi.name}</b></div>
            <div>${p.address.freeformAddress}</div>
            <div>${position[1]}, ${position[0]}</div>
          </div>`;

        //Update the content and position of the popup.
        popup.setPopupOptions({
            content: html,
            position: position
        });

        //Open the popup.
        popup.open(map);
    }
    ```

3. Save the file and refresh your browser. Now the map in the browser shows information pop-ups when you hover over any of the search pins.

    ![Azure Map Control and Search Service](./media/tutorial-search-location/popup-map.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an account with Azure Maps
> * Get the primary key for your account
> * Create new web page using Map Control API
> * Use Search Service to find nearby point of interest

> [!div class="nextstepaction"]
> [View full source code](https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/Tutorials/search.html)

> [!div class="nextstepaction"]
> [View live sample](https://azuremapscodesamples.azurewebsites.net/?sample=Search%20for%20points%20of%20interest)

The next tutorial demonstrates how to display a route between two locations.

> [!div class="nextstepaction"]
> [Route to a destination](./tutorial-route-location.md)
