---
title: How to use Azure Maps Indoor module with dynamic styling.  | Microsoft Docs 
description: Learn how to use Azure Maps Indoor module with dynamic styling
author: walsehgal
ms.author: v-musehg
ms.date: 09/26/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Azure Maps Indoor module with dynamic styling

The Azure Maps Web SDK provides an Indoor maps module. This module is a helper library that makes it easy to render the Indoor maps. Dynamic styling is an option inside indoor module. You can use this option to rendered features dynamically based on feature states associated with them. In this article you will learn, how to use Azure map Indoor module with dynamic styling.


## Prerequisites

To make any calls to the Maps service APIs, you need a Maps account and key. For information on creating an account, follow instructions in [manage account](https://docs.microsoft.com/azure/azure-maps/how-to-manage-account-keys#create-a-new-account) and follow the steps in [get primary key](./tutorial-search-location.md#getkey) to retrieve a primary subscription key for your account.

> [!Tip]
> To query the search service, you can use the [Postman app](https://www.getpostman.com/apps) to build REST calls or you can use any API development environment that you prefer.


## What is a feature state for dynamic styling? 

The Feature State lets you update the "state" of the feature using Azure Maps feature state REST API, allowing control over the style of the individual feature without the map rendering engine (Mapbox GL) having to reparse the underlying geometry and data. This offers a significant boost in performance, especially in scenarios when visualizing live data, such as live election data.

For the purpose of demonstration, we will take an example of a use case scenario for an indoor map of a building with meeting rooms and use the Azure Maps Dynamic styling feature to render the meeting rooms dynamically based on their occupancy status. The meeting rooms with a "busy" state will be rendered as red and those with "free" state will be rendered green.

## Create a state set

In order to render meeting rooms with their most current state, we need to get a state set id of the state set containing the feature states. To get the statesetId,** we will call the Azure Maps **createStateSet** API. Follow the steps below to get the **"statesetId"**. 

1. Create a collection in which to store the requests. In the Postman app, select New. In the Create New window, select Collection. Name the collection and select the Create button.

2. To create the request, select **New** again. In the Create New window, select **Request**. Enter a **Request name**, select the collection you created in the previous step as the location in which to save the request, and then select **Save**.

3. Select the POST HTTP method on the builder tab and enter the following URL to create a GET request to the createStateSet API.

    ```HTTP
    https://atlas.microsoft.com/featureState/stateset?subscription-key={Your Azure Maps primary subscription key}&datasetid={your datasetId}
    ```

4. After a successful request, the **Location** header will contain the status URI to check the current status of the upload request. The status URI will of the following format:

    ```HTTP
    https://atlas.microsoft.com/mapData/spatialIndexing/{statusId}/status?api-version=1.0
    ```

5. To check the status of the upload, make a new GET request to the status URI.

6. If the indexing request is still being processed by Azure Maps, the response body will contains status for the request and if the request is successful the response will contain **statesetId** in the response. The successful response schema will look like the one below.

    ```JSON
    {
        "status": "Succeeded",
        "statesetId" : "a1b2cde3-4567-8910-f321-1bb12aa101c3"         
    }


## Turn on dynamic styling

To render the indoor maps with dynamic styling, we will use the indoor module of the Azure Maps web SDK. In the following steps, we will develop an application to visualize the indoor map.

1. On your local machine, create a new file and name it DynamicIndoorMap.html.

2. Add the following HTML components to the file:

    ```HTML
    <!DOCTYPE html>
     <html>
     <head>
         <title>Dynamic indoor map</title>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
         <!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
         <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css">
         <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>
    
  
         <script>
         function GetMap(){
             //Add JavaScript code here.
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
    
             #map {
                 width: 100%;
                 height: 100%;
             }
         </style>
     </head>
     <body onload="GetMap()">
         <div id="map"></div>
     </body>
     </html>

3. We will load the Azure Maps web SDK's indoor module. There are two ways to load the indoor module. We discuss both below.
    
    * Use the globally hosted, Azure Content Delivery Network version of the Azure Maps services module. To do so add the following script reference to the <head> element of HTML file created in the previous step: 

        ```HTML
        <script src="https://atlas.microsoft.com/sdk/javascript/service/2/atlas-indoor.min.js"></script>
        ```
    * Alternatively you can load the Azure Maps web SDK source code locally by using the [azure-maps-rest npm](https://www.npmjs.com/package/azure-maps-rest) npm package, and then host it with your application. This package also includes Typescript definitions. Use the following command to install the npm package.
    
        ```azurepowershell-interactive
        npm install azure-maps-rest
        ```

    And then add the following script reference to the <head> element of HTML file.
    
        ```HTML
        <script src="node_modules/azure-maps-rest/dist/js/atlas-indoor.min.js"></script>
        ```
    
4. Add the following JavaScript code to the **GetMap** function to create a map instance.
   
    ```Javascript
    //URL to custom endpoint to fetch Access token
    var url = 'https://adtokens.azurewebsites.net/api/HttpTrigger1?code=dv9Xz4tZQthdufbocOV9RLaaUhQoegXQJSeQQckm6DZyG/1ymppSoQ==';
    
    //Initialize a map instance.
    var map = new atlas.Map('map', {
        view: "Auto",
        //Add your Azure Maps subscription client ID to the map SDK. Get an Azure Maps client ID at https://azure.com/maps
        authOptions: {
            authType: "anonymous",
            clientId: "35267128-0f1e-41de-aa97-f7a7ec8c2dbd",
            getToken: function(resolve, reject, map) {
                fetch(url).then(function(response) {
                    return response.text();
                }).then(function(token) {
                    resolve(token);
                });
            }
        }
    });
    ```

5. After creating an instance of the map, we will create an instance of the Indoor manager with **tilesetId** and **stateSetId** value. Copy the code below into the HTML file after the map initialization code. 
    
    ```Javascript
    // Creates an instance of the Indoor Manager
    styleManager = new atlas.indoor.IndoorManager(map, {
        tilesetId = "{Your tilesetId}",
        statesetId = "{Your statesetId}"
    });
    ```

6. The following script adds the ability to click on a point on the map to get the **featureId** for the clicked point. Insert it below the code that instantiates the IndoorManager.

    ```Javascript
    // Set bounding box as 1px recatangle area around the clicked point
    var bbox = [[e.pixel[0]-1, e.pixel[1]-1], [e.pixel[0]+1, e.pixel[1]+1]];
    
    var features = map._getMap().queryRenderedFeatures(bbox);

    var result = features.reduce(function (ids, feature) {
        
        // "Indoor unit" is the feature type for tables and chairs
        if (feature.properties.feature_type == "Indoor unit") {
            ids.push(feature.id); 
        }
    }, []);
    ```

7. Click the meeting room to get the **featureId** for that room. The result will have all of the featureIds of the clicked point location. As long as the bounding box for the clicked point is small enough, you will only get one element in the result. Copy the resulting **featureId** we will use it later.


## Update meeting room occupancy

Now that we have an application rendering an indoor map. We will update the feature state of the "occupied" feature of meeting room to see dynamic styling in action. Follow the steps below to update the feature state for the meeting rooms.

1. We will use the **featureId** received in the previous section to query the occupancy state for the room associated with the featureId. In the postman application, make a new GET request to the getFeatureState API using the following URI. Replace the subscription-key, statesetid, and dataseid with your values for these.

    ```HTTP
    https://atlas.microsoft.com/featureState/state?subscription-key={Your Azure Maps subscription key}&statesetid={Your state set Id}&datasetid={Your data set Id}
    ```
    
    Upon a successful request, the response structure will look like the one below:
    
    ```Json
    {
        "states":[{
            "keyname": "occupancy",
            "value":"free",
            "eventtimestamp":"2019-09-27 14:22" 
        }]
    }
    ```
2. Once we get the value for the occupancy state, we will update the occupancy value to "busy" by making a request to the updateFeatureStates API. In the postman application, use the following URI to make a POST request.


    ```HTTP
    https://atlas.microsoft.com/featureState/state?subscription-key={Your Azure Maps subscription key}&statesetid={Your state set Id}&datasetid={Your data set Id}&featureid={FeatureId you copied from the indoor map}
    ```
    
    Click **Body** then select **raw** input format and choose **JSON (application/text)** as the input format from the dropdown list. Copy the following Json reflecting the feature change, into the body section in the Postman app and click **Send**.

    >[!Note]
    > Note that the state value supplied with a timestamp same or older than the existing value will be ignored.

    ```Json
    {
        "states":[{
            "keyname": "occupancy",
            "value":"busy",
            "eventtimestamp":"2019-09-28 15:30" 
        }]
    }
    ```
    
If you observe the Indoor Map rendered by the application, you will notice that the color of the meeting room will change to red automatically after the state has changed.
