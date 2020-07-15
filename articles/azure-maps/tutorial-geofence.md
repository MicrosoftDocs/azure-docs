---
title: 'Tutorial: Create a geofence and track devices on an Microsoft Azure Map'
description: Learn how to set up a geofence and track devices relative to the geofence using Microsoft Azure Maps Spatial Service.
author: anastasia-ms
ms.author: v-stharr
ms.date: 7/15/2020
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Tutorial: Set up a geofence by using Azure Maps

This tutorial walks you through the basics steps to set up geofence by using Azure Maps. Consider the following scenario:

*A construction Site Manager has to monitor potential hazardous equipment. The manager needs to ensure that the equipment stays in the chosen overall construction area, which is a hard perimeter. Regulations require equipment to stay within this parameter and violations are reported to the operations manager.*

Azure Maps provides three main services to support the containment of equipment in the above scenario:

* [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview) is used to upload and store a geofence that defines the hard perimeter of the construction area.

* [Search Geofence Get API](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence) is used to check any tracked equipment locations relative to the geofence.

* [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview) is used to provide notifications of equipment moving beyond or entering the geofence. For more information, see [Azure Maps as an Event Grid source](https://docs.microsoft.com/azure/event-grid/event-schema-azure-maps).

In this tutorial we cover how to:

> [!div class="checklist"]
> * Upload a geofence area using the [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview).
> * Set up an [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview) to handle geofence events.
> * Set up alerts in response to geofence events using Logic Apps.
> * Use [Search Geofence Get API](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence) to track whether any equipment is within the geofence or not.

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Upload geofences

We assume that the main geofence is subsite1, which has a set expiration time. You can create more nested geofences as per your requirements. These sets of fences can be used to track different construction areas within the overall construction area. For example, subsite1 could be where work is taking place during week 1 to 4 of the schedule. subsite2 could be where work takes place during week 5 to 7. All such fences can be loaded as a single dataset at the beginning of the project. These fences are used to track rules based on time and space.

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **POST** HTTP method in the builder tab and enter the following URL to upload the geofence to the Azure Maps service. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```HTTP
    https://atlas.microsoft.com/mapData/upload?subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=1.0&dataFormat=geojson
    ```

    The _geojson_ parameter in the URL path represents the data format of the data being uploaded.

4. In the **Headers** tab, specify a value for the `Content-Type` key. The Drawing package is a zipped folder, so use the `application/octet-stream` value. In the **Body** tab, select **binary**. 

5. Click on the **Body** tab. Select **raw**, and then **JSON** as the input format. Copy and paste the following JSON into the **Body** textarea:

   ```JSON
   {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -122.13393688201903,
                  47.63829579223815
                ],
                [
                  -122.13389128446579,
                  47.63782047131512
                ],
                [
                  -122.13240802288054,
                  47.63783312249837
                ],
                [
                  -122.13238388299942,
                  47.63829037035086
                ],
                [
                  -122.13393688201903,
                  47.63829579223815
                ]
              ]
            ]
          },
          "properties": {
            "geometryId": "1"
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -122.13374376296996,
                  47.63784758098976
                ],
                [
                  -122.13277012109755,
                  47.63784577367854
                ],
                [
                  -122.13314831256866,
                  47.6382813338708
                ],
                [
                  -122.1334782242775,
                  47.63827591198201
                ],
                [
                  -122.13374376296996,
                  47.63784758098976
                ]
              ]
            ]
          },
          "properties": {
            "geometryId": "2",
            "validityTime": {
              "expiredTime": "2022-01-15T00:00:00",
              "validityPeriod": [
                {
                  "startTime": "2019-01-08T01:00:00",
                  "endTime": "2022-01-08T17:00:00",
                  "recurrenceType": "Daily",
                  "recurrenceFrequency": 1,
                  "businessDayOnly": true
                }
              ]
            }
          }
        }
      ]
   }
   ```

6. Click the blue **Send** button and wait for the request to process. Once the request completes, go to the **Headers** tab of the response. Copy the value of the **Location** key, which is the `status URL`.

   ```HTTP
   https://atlas.microsoft.com/mapData/{uploadStatusId}/status?api-version=1.0
   ```

7. To check the status of the API call, create a **GET** HTTP request on the `status URL`. You'll need to append your primary subscription key to the URL for authentication. The **GET** request should like the following URL:

   ```HTTP
   https://atlas.microsoft.com/mapData/{uploadStatusId}/status?api-version=1.0&subscription-key={Subscription-key}
   ```

8. To get the `udId`,  open a new tab in the Postman app and select GET HTTP method on the builder tab. Make a GET request at the status URI from the previous step. If your data upload was successful, you'll receive the udId in the response body. Copy the udId for later use.

   ```JSON
   {
    "status": "Succeeded",
    "resourceLocation": "https://atlas.microsoft.com/mapData/metadata/{udId}?api-version=1.0"
   }
   ```

## Set up an event handler

In this section, We create an event handler that receives notifications. This event handler should notify the Operations Manager about enter and exit events of any equipment.

We make two [Logic Apps](https://docs.microsoft.com/azure/event-grid/event-handlers#logic-apps) services to handle enter and exit events. When the events in the Logic Apps trigger, more events trigger in sequence. The idea is to send alerts, in this case emails, to the Operations Manager. The following figure illustrates creation of a Logic App for geofence enter event. Similarly, you can create another one for exit event. You can see all [supported event handlers](https://docs.microsoft.com/azure/event-grid/event-handlers) for more info.

1. Create a Logic App in Azure portal. Select the Logic App in Azure Marketplace. Then, select the **Create** button.

   ![Create Azure Logic Apps to handle geofence events](./media/tutorial-geofence/logic-app.png)

2. On the settings menu for the Logic App, navigate to **Logic App Designer**

3. Select an HTTP request trigger and then select "New Step". In the outlook connector, select "send an email" as an action
  
   ![Logic Apps schema](./media/tutorial-geofence/logic-app-schema.png)

4. Fill in the fields for sending an email. Leave the HTTP URL, it will automatically generate after you click "save"

   ![Generate a Logic Apps endpoint](./media/tutorial-geofence/logic-app-endpoint.png)

5. Save the logic app to generate the HTTP URL endpoint and copy the HTTP URL.

## Create an Azure Maps Events subscription

Azure Maps supports three event types. You can have a look at the Azure Maps supported event types [here](https://docs.microsoft.com/azure/event-grid/event-schema-azure-maps). We need two different event subscriptions, one for the enter event and one for the exit events.

Follow the steps below to create an event subscription for the geofence enter events. You can subscribe to geofence exit events in a similar manner.

1. Navigate to your Azure Maps account. In the dashboard, select Subscriptions. Click on your subscription name and select **events** from the settings menu.

   ![Navigate to Azure Maps account Events](./media/tutorial-geofence/events-tab.png)

2. To create an event subscription, select Event Subscription from the events page.

   ![Create an Azure Maps Events subscription](./media/tutorial-geofence/create-event-subscription.png)

3. Name the events subscription, and subscribe to the Enter event type. Now, select Web Hook as "Endpoint Type". Click on "Select an endpoint" and copy your Logic App HTTP URL endpoint into "{Endpoint}"

   ![Azure Maps Events subscription details](./media/tutorial-geofence/events-subscription.png)


## Use Geofence API

You can use the Geofence API to check whether a **device**, in this case equipment, is inside or outside a geofence. Lets query the Geofence GET API against different locations, where a particular equipment has moved over time. The following figure illustrates five locations with five construction equipment. 

> [!Note]
> The scenario and behavior is based on the same **device id** so that it reflects the five different locations as in the figure below.

The "deviceId" is a unique ID that you provide for your device in the GET request, when querying for its location. When you make an asynchronous request to the **search geofence - GET API**, the "deviceId" helps in publishing geofence events for that device, relative to the specified geofence. In this tutorial, we have made asynchronous requests to the API with a unique "deviceId". The requests in the tutorial are made in chronological order, as in the diagram. The "isEventPublished" property in the response gets published whenever a device enters or exits the geofence. You do not have to register a device to follow with this tutorial.

Lets look back at the diagram. Each of these five locations is used to assess the geofence enter and exit status change against the fence. If a state change occurs, the geofence service triggers an event, which is sent to the Logic App by the Event Grid. As a result, the operation's manager will receive the corresponding enter or exit notification via an email.

![Geofence Map in Azure Maps](./media/tutorial-geofence/geofence.png)

In the Postman app, open a new tab in the same collection you created above. Select GET HTTP method on the builder tab:

The following are five HTTP GET Geofencing API requests, with different location coordinates of the equipment. The coordinates are as observed in chronological order. Each request is followed by the response body.
 
1. Location 1:
    
   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udId={udId}&lat=47.638237&lon=-122.1324831&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```
   ![Geofence query 1](./media/tutorial-geofence/geofence-query1.png)

   In the response above, the negative distance from the main geofence means the equipment is inside the geofence. The positive distance from the subsite geofence means the equipment is outside the subsite geofence. 

2. Location 2: 
   
   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udId={udId}&lat=47.63800&lon=-122.132531&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```
    
   ![Geofence query 2](./media/tutorial-geofence/geofence-query2.png)

   If you look at the preceding JSON response carefully the equipment is outside the subsite, but it is inside the main fence. No event is triggered and no email is sent.

3. Location 3: 
  
   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udId={udId}&lat=47.63810783315048&lon=-122.13336020708084&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```

   ![Geofence query 3](./media/tutorial-geofence/geofence-query3.png)

   A state change has occurred and now the equipment is within both the main and subsite geofences. This change causes an event to publish and a notification email will be sent to the Operations Manager.

4. Location 4: 

   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udId={udId}&lat=47.637988&lon=-122.1338344&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```
  
   ![Geofence query 4](./media/tutorial-geofence/geofence-query4.png)

   By observing the corresponding response carefully, you can note that no event gets published here even though the equipment has exited the subsite geofence. If you look at the user's specified time in the GET request, you can see that the subsite geofence has expired for this time. The equipment is still in the main geofence. You can also see the geometry ID of the subsite geofence under `expiredGeofenceGeometryId` in the response body.


5. Location 5:
      
   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udId={udId}&lat=47.63799&lon=-122.134505&userTime=2019-01-16&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```

   ![Geofence query 5](./media/tutorial-geofence/geofence-query5.png)

   You can see that the equipment has left the main construction site geofence. An event is published and an alert email is sent to the Operations Manager.

## Next steps

In this tutorial you learned: how to set up geofence by uploading it in the Azure Maps and Data service using the Data Upload API. You also learned how to use Azure Maps Events Grid to subscribe to and handle geofence events. 

* See [Handle content types in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-content-type), to learn how to use Logic Apps to parse JSON to build a more complex logic.
* To know more about event handlers in Event Grid, see [supported Events Handlers in Event Grid](https://docs.microsoft.com/azure/event-grid/event-handlers).
