---
title: Search with Azure Location Based Services | Microsoft Docs
description: Search nearby point of interest using Azure Location Based Services
services: location-based-services
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 11/14/2017
ms.topic: tutorial
ms.service: location-based-services

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Search nearby point of interest using Azure Location Based Services

This tutorial shows how to set up an account with Azure Location Based Services, and then use the provided APIs to search for a point of interest. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an account with Azure Location Based Services
> * Get the subscription key for your account
> * Create new web page using Map Control API
> * Use Search Service to find nearby point of interest

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

# Log in to the Azure portal
Log in to the [Azure portal](https://portal.azure.com).

<a id="createaccount"></a>

## Create an account with Azure Location Based Services

Follow these steps to create a new Location Based Services account.

1. In the upper left-hand corner of the [Azure portal](https://portal.azure.com), click **Create a resource**.
2. In the *Search the Marketplace* box, type **location based services**.
3. From the *Results*, click the **Location Based Services (preview)**. Click **Create** button that appears below the map. 
4. On the **Create Location Based Services Account** page, enter the following values:
    - The *Name* of your new account. 
    - The *Subscription* that you want to use for this account.
    - The *Resource group* name for this account. You may choose to *Create new* or *Use existing* resource group.
    - Select the *Resource group location*. At present, the default option is **Global**.
    - Select the *Pricing tier*.
    - Read the *Preview Terms* and check the checkbox to accept the terms. 
    - Finally, click the **Create** button.
   
    ![Create Location Based Services account in portal](./media/tutorial-search-location/create-lbs-account.png)


<a id="getkey"></a>

## Get the subscription key for your account

Once your Location Based Services account is successfully created, follow the steps to link it to its map search APIs:

1. Open your Location Based Services account in the portal.
2. Navigate to your account's **SETTINGS**, and then select **Keys**.
3. Copy the **Primary Key** to your clipboard. Save it locally to use in the proceeding steps. 

    ![Get Primary Key in portal](./media/tutorial-search-location/lbs-get-key.png)

## Create new web page using Map Control API
The following steps will show you how to create a static HTML page embedded with the Location Based Services' Map Control API. 

1. On your local machine, create a new file and name it **staticSearch.html**. 
2. Add the following HTML header to the file:

    ```HTML
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <title>Static Search</title>

        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1.0" type="text/css" />
        <script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1.0"></script>

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
    ``` 
    
    Notice that the HTML header includes the CSS and JavaScript resource files hosted separately by the Azure Map Control library.
3. Add the following HTML block that will contain embedded CSS and Java Script code to access the Azure Map Control API. 

    ```HTML
    <body>

        <div id="map"></div>

        // Script will go here
    </body>
    ```
4. Add the following script segment inside the HTML *body*. Replace the placeholder *<insert-key>* with your Location Based Services account's primary key. 

    ```HTML
        <script>
            // Instantiate map to the div with id "map"
            var subscriptionKey = "<insert-key>";
            var map = new atlas.Map("map", {
                "subscription-key": subscriptionKey
                });

    ```
    This segment initiates the Map Control API for your subscription key. **Atlas** is the namespace that contains the Azure Map Control API and related visual components. **atlas.Map** provides the control for a visual and interactive web map. 

5. Add the following snippet to the _script_ module after the Map is initiated:

    ```HTML
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
    The API **atlas.Popup** provides an information window anchored at the required position on the map. This code snippet sets the content and position for the popup, as well as adds an event listener to the `map` control, waiting for the _mouse_ to roll over the popup. 

6. Save the file locally. 


## Use Search Service to find nearby point of interest

This section shows how to use the Azure Location Based Services' Search Service API to find a point of interest on your map. It is a RESTful API designed for developers to search for addresses, points of interest and other geographical information. The Search Service assigns a latitude and longitude information to a specified address. 

1. In the local HTML file created in the preceding section, add the following code that illustrates the Search Service. 
    ```HTML
       // Perform a request to the search service and create a pin on the map for each result
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var searchPins = [];

            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);

                var poiResults = response.results.filter((result) => { return result.type === "POI" }) || [];

                searchPins = poiResults.map((poiResult) => {
                    var poiPosition = [poiResult.position.lon, poiResult.position.lat];
                    return new atlas.data.Feature(new atlas.data.Point(poiPosition), {
                        name: poiResult.poi.name,
                        address: poiResult.address.freeformAddress,
                        position: poiResult.position.lat + ", " + poiResult.position.lon
                    });
                });

                map.addPins(searchPins, {
                    name: searchLayerName
                });

                var lons = searchPins.map((pin) => { return pin.geometry.coordinates[0] });
                var lats = searchPins.map((pin) => { return pin.geometry.coordinates[1] });

                var swLon = Math.min.apply(null, lons);
                var swLat = Math.min.apply(null, lats);
                var neLon = Math.max.apply(null, lons);
                var neLat = Math.max.apply(null, lats);

                map.setCameraBounds({
                    bounds: [swLon, swLat, neLon, neLat],
                    padding: 50
                });
            }
        };
    ```
    This code snippet creates an [XMLHttpRequest](https://xhr.spec.whatwg.org/), and adds an event handler to parse the incoming response. For a successful response, it collects the addresses, names, latitude and logitude information for each location returned, in the `searchPins` variable. Finally, it adds this collection of location points to the `map` control as pins. 

2. Add the following code to send the XMLHttpRequest to the Azure Location Based Services' Search Service:

    ```HTML
            var url = "https://atlas.microsoft.com/search/fuzzy/json?";
            url += "&api-version=1.0";
            url += "&query=gasoline%20station";
            url += "&subscription-key=" + subscriptionKey;
            url += "&lat=47.6292";
            url += "&lon=-122.2337";
            url += "&radius=100000"

            xhttp.open("GET", url, true);
            xhttp.send();
    ``` 
    This snippet uses the basic search API of the Search Service, called the **Fuzzy Search**. It handles the most fuzzy of inputs handling any combination of address or *POI* tokens. It searches for the nearby **gasoline station**, for the given address in latitude and longitude, and within the specified radius. It uses your account's subscription key provided earlier in the sample file, to make the call to the Location Based Services. 

3. Finally, close the *script*, *body* and *html* blocks by adding the following lines of code and save the file. 

    ```HTML
        </script>
    </body>

    </html>
    ```

4. Open the **staticSearch.html** file in a web browser of your choice and observe the result. For a successful connection with the Location Based Services' APIs, you should see a map similar to the following. 

    ![Azure Map Control and Search Service](./media/tutorial-search-location/lbs-map-search.png)

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an account with Azure Location Based Services
> * Get the subscription key for your account
> * Create new web page using Map Control API
> * Use Search Service to find nearby point of interest

Proceed to the next tutorial to learn how to use the Azure Location Based Services to route to your point of interest. 
