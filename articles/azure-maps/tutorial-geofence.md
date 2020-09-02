---
title: 'Tutorial: Create a geofence and track devices on a Microsoft Azure Map'
description: Learn how to set up a geofence. See how to track devices relative to the geofence by using the Azure Maps Spatial service.
author: anastasia-ms
ms.author: v-stharr
ms.date: 8/11/2020
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Tutorial: Set up a geofence by using Azure Maps

This tutorial walks you through the basics of creating and using Azure Maps Geofence services in the context of the following scenario:

*A construction Site Manager must track equipment as it enters and leaves the perimeters of a construction area. Whenever a piece of equipment exits or enters these perimeters, an email notification will be sent to the Operations Manager.*

Azure Maps provides a number of services to support the tracking of equipment entering and exiting the construction area in the above scenario. In this tutorial we cover how to:

> [!div class="checklist"]
> * Upload [Geofencing GeoJSON data](geofence-geojson.md) that defines  the construction site areas we wish to monitor. We'll use the [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview) to upload geofences as polygon coordinates to your Azure Maps account.
> * Set up two [Logic App](https://docs.microsoft.com/azure/event-grid/handler-webhooks#logic-apps) that, when triggered, will send email notifications to the construction site Operations Manager when equipment enters and exits the geofence area.
> * Use the [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview) to subscribe to Azure Maps geofence enter and exit events. We'll setup two Web Hook event subscriptions that will call the HTTP endpoints defined in your two Logic Apps. The Logic Apps will then send the appropriate email notifications of equipment moving beyond or entering the geofence.
> * Use [Search Geofence Get API](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence) to receive notifications when a piece of equipment exits and enters the geofence areas.

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Upload Geofencing GeoJSON data

In this tutorial, we'll upload Geofencing GeoJSON data that contains a `FeatureCollection`. The `FeatureCollection` contains two geofences that define polygonal areas within the construction site. The first geofence has no time expiration or restrictions. The second one can only be queried against during business hours (9-5 P.M. PST), and will no longer be valid after January 1, 2022. For more information on the GeoJSON format, see [Geofencing GeoJSON data](geofence-geojson.md).

>[!TIP]
>You can update your Geofencing data at any time. For more information on how to update your data, see [Data Upload API](https://docs.microsoft.com/rest/api/maps/data/uploadpreview)

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **POST** HTTP method in the builder tab and enter the following URL to upload the geofencing data to the Azure Maps service. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```HTTP
    https://atlas.microsoft.com/mapData/upload?subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=1.0&dataFormat=geojson
    ```

    The _geojson_ parameter in the URL path represents the data format of the data being uploaded.

4. Click on the **Body** tab. Select **raw**, and then **JSON** as the input format. Copy and paste the following GeoJSON data into the **Body** text area:

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
            "expiredTime": "2022-01-01T00:00:00",
            "validityPeriod": [
                {
                  "startTime": "2020-07-15T16:00:00",
                  "endTime": "2020-07-15T24:00:00",
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

5. Click the blue **Send** button and wait for the request to process. Once the request completes, go to the **Headers** tab of the response. Copy the value of the **Location** key, which is the `status URL`.

    ```http
    https://atlas.microsoft.com/mapData/operations/<operationId>?api-version=1.0
    ```

6. To check the status of the API call, create a **GET** HTTP request on the `status URL`. You'll need to append your primary subscription key to the URL for authentication. The **GET** request should like the following URL:

   ```HTTP
   https://atlas.microsoft.com/mapData/<operationId>/status?api-version=1.0&subscription-key={Subscription-key}
   ```

7. When the **GET** HTTP request completes successfully, it will return a `resourceLocation`. The `resourceLocation` contains the unique `udid` for the uploaded content. You'll need to save this `udid` to query the Get Geofence API in the last section of this tutorial. Optionally, you can use the `resourceLocation` URL to retrieve metadata from this resource in the next step.

      ```json
      {
          "status": "Succeeded",
          "resourceLocation": "https://atlas.microsoft.com/mapData/metadata/{udid}?api-version=1.0"
      }
      ```

8. To retrieve content metadata, create a **GET** HTTP request on the `resourceLocation` URL that was retrieved in step 7. Make sure to append your primary subscription key to the URL for authentication. The **GET** request should like the following URL:

    ```http
   https://atlas.microsoft.com/mapData/metadata/{udid}?api-version=1.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

9. When the **GET** HTTP request completes successfully, the response body will contain the `udid` specified in the `resourceLocation` of step 7, the location to access/download the content in the future, and some other metadata about the content like created/updated date, size, and so on. An example of the overall response is:

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

## Create Logic App workflows

In this section, we'll create two [Logic App](https://docs.microsoft.com/azure/event-grid/handler-webhooks#logic-apps) endpoints that will trigger an email notification. We'll show you how to create the first trigger that will send email notifications whenever its endpoint is called.

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

7. Now, we'll select a trigger type. Scroll down a bit to the *Start with a common trigger** section. Click on **When an HTTP request is received**.

     :::image type="content" source="./media/tutorial-geofence/logic-app-trigger.png" alt-text="Create a logic app HTTP trigger":::

8. Click **Save** in the upper right-hand corner of the Designer. The **HTTP POST URL** will be automatically generated. Save the URL, as you'll need it in the next section to create an event endpoint.

    :::image type="content" source="./media/tutorial-geofence/logic-app-httprequest.png" alt-text="Logic App HTTP Request URL and JSON":::

9. Select **+ New Step**. Now we'll choose an action. Type `outlook.com email` in the search box. In the **Actions** list, scroll down and click on **Send an email (V2)**.
  
    :::image type="content" source="./media/tutorial-geofence/logic-app-designer.png" alt-text="Create a logic app designer":::

10. Sign in to your Outlook.com account. Make sure to click **Yes** to allow the Logic App to access the account. Fill in the fields for sending an email.

    :::image type="content" source="./media/tutorial-geofence/logic-app-email.png" alt-text="Create a logic app send email step":::

    >[!TIP]
    > You can retrieve GeoJSON response data, such as `geometryId` or `deviceId` in your email notifications by configuring Logic App to read the data sent by the Event Grid. For information on how to configure Logic App to consume and pass event data into email notifications, see [Tutorial: Send email notifications about Azure IoT Hub events using Event Grid and Logic Apps](https://docs.microsoft.com/azure/event-grid/publish-iot-hub-events-to-logic-apps).

11. Click **Save** on the upper left-hand corner of the Logic Apps Designer.

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

## Use Spatial Geofence Get API

Now, we'll use the [Spatial Geofence Get API](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence) to send email notifications to the Operations Manager, when a piece of equipment enters or exits the geofences.

Each equipment has a `deviceId`. In this tutorial,  we'll be tracking a single piece of equipment, whose unique ID is `device_1`.

For clarity, the following diagram shows the five locations of the equipment over time, beginning at the *Start* location, which is somewhere outside the geofences. For the purposes of this tutorial, the *Start* location is undefined, since we won't query the device at that location.

When we query the [Spatial Geofence Get API](https://docs.microsoft.com/rest/api/maps/spatial/getgeofence) with an equipment location that indicates initial geofence entry or exit, the Event Grid will call the appropriate Logic App endpoint to send an email notification to the Operations Manager.

Each of the following sections makes HTTP GET Geofencing API requests using the five different location coordinates of the equipment.

![Geofence Map in Azure Maps](./media/tutorial-geofence/geofence.png)

### Equipment Location 1 (47.638237,-122.132483)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**.  Enter a **Request name** for the request. We'll use the name, *Location 1*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udid={udid}&lat=47.638237&lon=-122.1324831&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```

3. Click the **Send** button. The following GeoJSON will appear in the response window.

    ```json
    {
      "geometries": [
        {
          "deviceId": "device_1",
          "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
          "geometryId": "1",
          "distance": -999.0,
          "nearestLat": 47.638291,
          "nearestLon": -122.132483
        },
        {
          "deviceId": "device_1",
          "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
          "geometryId": "2",
          "distance": 999.0,
          "nearestLat": 47.638053,
          "nearestLon": -122.13295
        }
      ],
      "expiredGeofenceGeometryId": [],
      "invalidPeriodGeofenceGeometryId": [],
      "isEventPublished": true
    }
    ```

4. In the GeoJSON response above, the negative distance from the main site geofence means that the equipment is inside the geofence. The positive distance from the subsite geofence means the equipment is outside the subsite geofence. Since this is the first time this device has been located inside the main site geofence, the `isEventPublished` parameter is set to `true` and the Operations Manager would have received an email notification that equipment has entered the geofence.

### Location 2 (47.63800,-122.132531)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**.  Enter a **Request name** for the request. We'll use the name, *Location 2*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udId={udId}&lat=47.63800&lon=-122.132531&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```

3. Click the **Send** button. The following GeoJSON will appear in the response window:

    ```json
    {
      "geometries": [
        {
          "deviceId": "device_01",
          "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
          "geometryId": "1",
          "distance": -999.0,
          "nearestLat": 47.637997,
          "nearestLon": -122.132399
        },
        {
          "deviceId": "device_01",
          "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
          "geometryId": "2",
          "distance": 999.0,
          "nearestLat": 47.63789,
          "nearestLon": -122.132809
        }
      ],
      "expiredGeofenceGeometryId": [],
      "invalidPeriodGeofenceGeometryId": [],
      "isEventPublished": false
    }
    ````

4. In the GeoJSON response above, the equipment has remained in the main site geofence and hasn't entered the subsite geofence. As a result, the `isEventPublished` parameter is set to `false` and the Operations Manager won't receive any email notifications.

### Location 3 (47.63810783315048,-122.13336020708084)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**.  Enter a **Request name** for the request. We'll use the name, *Location 3*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

    ```HTTP
      https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udid={udid}&lat=47.63810783315048&lon=-122.13336020708084&searchBuffer=5&isAsync=True&mode=EnterAndExit
      ```

3. Click the **Send** button. The following GeoJSON will appear in the response window:

    ```json
    {
      "geometries": [
        {
          "deviceId": "device_01",
          "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
          "geometryId": "1",
          "distance": -999.0,
          "nearestLat": 47.638294,
          "nearestLon": -122.133359
        },
        {
          "deviceId": "device_01",
          "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
          "geometryId": "2",
          "distance": -999.0,
          "nearestLat": 47.638161,
          "nearestLon": -122.133549
        }
      ],
      "expiredGeofenceGeometryId": [],
      "invalidPeriodGeofenceGeometryId": [],
      "isEventPublished": true
    }
    ````

4. In the GeoJSON response above, the equipment has remained in the main site geofence, but has entered the subsite geofence. As a result, the `isEventPublished` parameter is set to `true` and the Operations Manager will receive an email notification indicating that the equipment has entered a geofence.

    >[!NOTE]
    >If the equipment had moved into the subsite after business hours, no event would be published and the Operations Manager would not receive any notifications.  

### Location 4 (47.637988,-122.1338344)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**.  Enter a **Request name** for the request. We'll use the name, *Location 4*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key and `{udid}`  with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

    ```HTTP
    https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udid={udid}&lat=47.637988&userTime=2023-01-16&lon=-122.1338344&searchBuffer=5&isAsync=True&mode=EnterAndExit
    ```

3. Click the **Send** button. The following GeoJSON will appear in the response window:

    ```json
    {
      "geometries": [
        {
          "deviceId": "device_01",
          "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
          "geometryId": "1",
          "distance": -999.0,
          "nearestLat": 47.637985,
          "nearestLon": -122.133907
        }
      ],
      "expiredGeofenceGeometryId": [
        "2"
      ],
      "invalidPeriodGeofenceGeometryId": [],
      "isEventPublished": false
    }
    ````

4. In the GeoJSON response above, the equipment has remained in the main site geofence, but has exited the subsite geofence. However, if you notice, the `userTime` value is after the `expiredTime` as defined in the geofence data. As a result, the `isEventPublished` parameter is set to `false` and the Operations Manager won't receive an email notification.

### Location 5(47.637988,-122.1338344)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**.  Enter a **Request name** for the request. We'll use the name, *Location 4*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

    ```HTTP
    https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udid={udid}&lat=47.637988&lon=-122.1338344&searchBuffer=5&isAsync=True&mode=EnterAndExit
    ```

3. Click the **Send** button. The following GeoJSON will appear in the response window:

    ```json
    {
      "geometries": [
      {
        "deviceId": "device_01",
        "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
        "geometryId": "1",
        "distance": -999.0,
        "nearestLat": 47.637985,
        "nearestLon": -122.133907
      },
      {
        "deviceId": "device_01",
        "udId": "64f71aa5-bbee-942d-e351-651a6679a7da",
        "geometryId": "2",
        "distance": 999.0,
        "nearestLat": 47.637945,
        "nearestLon": -122.133683
      }
      ],
      "expiredGeofenceGeometryId": [],
      "invalidPeriodGeofenceGeometryId": [],
      "isEventPublished": true
    }
    ````

4. In the GeoJSON response above, the equipment has exited the main site geofence. As a result, the `isEventPublished` parameter is set to `true` and the Operations Manager will receive an email notification indicating that the equipment has exited a geofence.

## Next steps

> [!div class="nextstepaction"]
> [Handle content types in Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-content-type)

> [!div class="nextstepaction"]
> [Send email notifications using Event Grid and Logic Apps](https://docs.microsoft.com/azure/event-grid/publish-iot-hub-events-to-logic-apps)

> [!div class="nextstepaction"]
> [Supported Events Handlers in Event Grid](https://docs.microsoft.com/azure/event-grid/event-handlers).
