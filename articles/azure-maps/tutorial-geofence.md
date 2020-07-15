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

This tutorial walks you through the basics of creating and using Azure Maps Geofence services in the context of the following scenario:

*A construction Site Manager has to monitor potential hazardous equipment. The manager needs to ensure that the equipment stays in the chosen overall construction areas, which are defined by hard perimeters. Regulations require equipment to stay within this parameter and, therefore, all violations are reported via email to the Operations Manager.*

Azure Maps provides a number of services to support the tracking of equipment entering and exiting the construction area in the above scenario. In this tutorial we cover how to:

> [!div class="checklist"]
> * Upload geofences that define the construction site. We'll use the [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview) to upload geofences as polygon coordinates to your Azure Maps account.
> * Set up two [Logic App](https://docs.microsoft.com/azure/event-grid/handler-webhooks#logic-apps) that, when triggered, will send email notifications to the construction site Operations Manager when equipment enters and exits the geofence area.
> * Use the [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview) to subscribe to Azure Maps geofence enter and exit events. We'll setup two Web Hook event subscriptions that will call the HTTP endpoints defined in your two Logic Apps. The Logic Apps will then send the appropriate email notifications of equipment moving beyond or entering the geofence.

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

    ```http
    https://atlas.microsoft.com/mapData/operations/<operationId>?api-version=1.0
    ```

7. To check the status of the API call, create a **GET** HTTP request on the `status URL`. You'll need to append your primary subscription key to the URL for authentication. The **GET** request should like the following URL:

   ```HTTP
   https://atlas.microsoft.com/mapData/<operationId>/status?api-version=1.0&subscription-key={Subscription-key}
   ```

8. When the **GET** HTTP request completes successfully, it will return a `resourceLocation`. The `resourceLocation` contains the unique `udid` for the uploaded content. Optionally, you can use the `resourceLocation` URL to retrieve metadata from this resource in the next step.

      ```json
      {
          "status": "Succeeded",
          "resourceLocation": "https://atlas.microsoft.com/mapData/metadata/{udid}?api-version=1.0"
      }
      ```

9. To retrieve content metadata, create a **GET** HTTP request on the `resourceLocation` URL that was retrieved in step 7. Make sure to append your primary subscription key to the URL for authentication. The **GET** request should like the following URL:

    ```http
   https://atlas.microsoft.com/mapData/metadata/{udid}?api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

10. When the **GET** HTTP request completes successfully, the response body will contain the `udid` specified in the `resourceLocation` of step 7, the location to access/download the content in the future, and some other metadata about the content like created/updated date, size, and so on. An example of the overall response is:

    ```json
    {
        "udid": "{udid}",
        "location": "https://atlas.microsoft.com/mapData/{udid}?api-version=1.0",
        "created": "7/15/2020 6:11:43 PM +00:00",
        "updated": "7/15/2020 6:11:45 PM +00:00",
        "sizeInBytes": 1962,
        "uploadStatus": "Completed"
    }
    ```

## Set up Logic App HTTP triggers

In this section, we'll create two [Logic App](https://docs.microsoft.com/azure/event-grid/handler-webhooks#logic-apps) endpoints that will trigger an email notification. We'll show you how to create the first trigger that'll send email notifications whenever its endpoint is called. In the next section, we'll use the Events Grid to call into the Logic App endpoint when a geofence has been entered or exited.

1. Sign in to the [Azure portal](https://portal.azure.com)

2. In the upper left-hand corner of the [Azure portal](https://portal.azure.com), click **Create a resource**.

3. In the *Search the Marketplace* box, type **Logic App**.

4. From the *Results*, select **Logic App**. Click **Create** button.

5. On the **Logic App** page, enter the following values:
    * The *Subscription* that you want to use for this logic app.
    * The *Resource group* name for this logic app. You may choose to *Create new* or *Use existing* resource group.
    * The *Logic App name* of your logic app. In this case, we'll use `Equipment-Enter` as the name.

    For the purposes of this tutorial, keep the rest of the values on their default settings.

    :::image type="content" source="./media/tutorial-geofence/logic-app-create.png" alt-text="Create a logic app":::

6. Click the **Review + Create** button. Review your settings and click **Create** to submit deployment. When the deployment successfully completes, click on **Go to resource**. You'll be taken to the **Logic App Designer**

7. Now, we'll select a trigger type. Scroll down a bit to the *Start with a common trigger** section. Click on **When a HTTP request is received**.

     :::image type="content" source="./media/tutorial-geofence/logic-app-trigger.png" alt-text="Create a logic app HTTP trigger":::

8. Click **Save** in the upper right hand corner of the Designer. The **HTTP POST URL** will be automatically generated. Save the URL, as you will need it in the next section to create an event endpoint.

9. Select **+ New Step**. Now we'll choose an action. Type `outlook.com email` in the search box. In the **Actions** list, scroll down and click on **Send an email (V2)**.
  
    :::image type="content" source="./media/tutorial-geofence/logic-app-designer.png" alt-text="Create a logic app designer":::

10. Sign-in to you Outlook.com account. Make sure to click **Yes** to allow the Logic App to access your Outlook.com account. Fill in the fields for sending an email.

    :::image type="content" source="./media/tutorial-geofence/logic-app-email.png" alt-text="Create a logic app send email step":::

11. Click **Save** on the upper left hand corner of the Logic Apps Designer.

12. Repeat steps 3-11 to create a second Logic App to notify the manager when equipment exits the construction site. Name the Logic App `Equipment-Exit`.

## Create Azure Maps Events subscriptions

Azure Maps supports three event types. You can have a look at the Azure Maps supported event types [here](https://docs.microsoft.com/azure/event-grid/event-schema-azure-maps).  We'll need to create two different event subscriptions: one for geofence enter events and one for the geofence exit events.

Follow the steps below to create an event subscription for the geofence enter events. You can subscribe to geofence exit events by repeating the steps in a similar manner.

1. Navigate to your Azure Maps account. In the dashboard, select **Subscriptions**. Click on your subscription name and select **events** from the settings menu.

    :::image type="content" source="./media/tutorial-geofence/events-tab.png" alt-text="Navigate to Azure Maps account Events":::

2. To create an event subscription, select **+ Event Subscription** from the events page.

    :::image type="content" source="./media/tutorial-geofence/create-event-subscription.png" alt-text="Create an Azure Maps Events subscription":::

3. On the **Create Event Subscription** page, enter the following values:
    * The *Name* of the event subscription.
    * The *Event Schema* should be *Event Grid Schema*.
    * The *System Topic Name* for this event subscription. In this case, we'll use `Contoso-Construction`.
    * On the *Filter to Event Types*, choose `Geofence Entered` as the event type.
    * For the *Endpoint Type*, choose `Web Hook`.
    * For *Endpoint*, copy the HTTP POST URL for the Logic App Enter endpoint you created in the previous section. If you forgot to save it, you can just go back into the Logic App Designer and copy it from the HTTP trigger step.

    :::image type="content" source="./media/tutorial-geofence/events-subscription.png" alt-text="Azure Maps Events subscription details":::

4. Click **Create**.

5. Repeat steps 1-4 for the Logic App Exit endpoint you created in the previous section. On step 3, make sure to choose `Geofence Exited` as the event type.


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
