---
title: 'Tutorial: Create a geofence and track devices on a Microsoft Azure Map'
description: Tutorial on how to set up a geofence. See how to track devices relative to the geofence by using the Azure Maps Spatial service
author: anastasia-ms
ms.author: v-stharr
ms.date: 8/20/2020
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Tutorial: Set up a geofence by using Azure Maps

This tutorial walks you through the basics of creating and using Azure Maps geofence services. You'll do this in the context of the following scenario:

*A construction site manager must track equipment as it enters and leaves the perimeters of a construction area. Whenever a piece of equipment exits or enters these perimeters, an email notification is sent to the operations manager.*

Azure Maps provides a number of services to support the tracking of equipment entering and exiting the construction area. In this tutorial, you:

> [!div class="checklist"]
> * Upload [Geofencing GeoJSON data](geofence-geojson.md) that defines the construction site areas you want to monitor. You'll use the [Data Upload API](/rest/api/maps/data/uploadpreview) to upload geofences as polygon coordinates to your Azure Maps account.
> * Set up two [logic apps](../event-grid/handler-webhooks.md#logic-apps) that, when triggered, send email notifications to the construction site operations manager when equipment enters and exits the geofence area.
> * Use [Azure Event Grid](../event-grid/overview.md) to subscribe to enter and exit events for your Azure Maps geofence. You set up two webhook event subscriptions that call the HTTP endpoints defined in your two logic apps. The logic apps then send the appropriate email notifications of equipment moving beyond or entering the geofence.
> * Use [Search Geofence Get API](/rest/api/maps/spatial/getgeofence) to receive notifications when a piece of equipment exits and enters the geofence areas.

## Prerequisites

1. [Create an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account).
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.

This tutorial uses the [Postman](https://www.postman.com/) application, but you can choose a different API development environment.

## Upload geofencing GeoJSON data

For this tutorial, you upload geofencing GeoJSON data that contains a `FeatureCollection`. The `FeatureCollection` contains two geofences that define polygonal areas within the construction site. The first geofence has no time expiration or restrictions. The second one can only be queried against during business hours (9:00 AM-5:00 PM in the Pacific Time zone), and will no longer be valid after January 1, 2022. For more information on the GeoJSON format, see [Geofencing GeoJSON data](geofence-geojson.md).

>[!TIP]
>You can update your geofencing data at any time. For more information, see [Data Upload API](/rest/api/maps/data/uploadpreview).

1. Open the Postman app. Near the top, select **New**. In the **Create New** window, select **Collection**. Name the collection and select **Create**.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **POST** HTTP method in the builder tab, and enter the following URL to upload the geofencing data to Azure Maps. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```HTTP
    https://atlas.microsoft.com/mapData/upload?subscription-key={Azure-Maps-Primary-Subscription-key}&api-version=1.0&dataFormat=geojson
    ```

    The `geojson` parameter in the URL path represents the data format of the data being uploaded.

4. Select the **Body** tab. Select **raw**, and then **JSON** as the input format. Copy and paste the following GeoJSON data into the **Body** text area:

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

5. Select **Send**, and wait for the request to process. When the request completes, go to the **Headers** tab of the response. Copy the value of the **Location** key, which is the `status URL`.

    ```http
    https://atlas.microsoft.com/mapData/operations/<operationId>?api-version=1.0
    ```

6. To check the status of the API call, create a **GET** HTTP request on the `status URL`. You'll need to append your primary subscription key to the URL for authentication. The **GET** request should like the following URL:

   ```HTTP
   https://atlas.microsoft.com/mapData/<operationId>/status?api-version=1.0&subscription-key={Subscription-key}
   ```

7. When the **GET** HTTP request completes successfully, it returns a `resourceLocation`. The `resourceLocation` contains the unique `udid` for the uploaded content. Save this `udid` to query the Get Geofence API in the last section of this tutorial. Optionally, you can use the `resourceLocation` URL to retrieve metadata from this resource in the next step.

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

9. When the **GET** HTTP request completes successfully, the response body will contain the `udid` specified in the `resourceLocation` of step 7. It will also contain the location to access and download the content in the future, and other metadata about the content. An example of the overall response is:

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

## Create workflows in Azure Logic Apps

Next, you create two [logic app](../event-grid/handler-webhooks.md#logic-apps) endpoints that trigger an email notification. Here's how to create the first one:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the upper-left corner of the Azure portal, select **Create a resource**.

3. In the **Search the Marketplace** box, type **Logic App**.

4. From the results, select **Logic App** > **Create**.

5. On the **Logic App** page, enter the following values:
    * The **Subscription** that you want to use for this logic app.
    * The **Resource group** name for this logic app. You can choose to **Create new** or **Use existing** resource group.
    * The **Logic App name** of your logic app. In this case, use `Equipment-Enter` as the name.

    For the purposes of this tutorial, keep all other values on their default settings.

    :::image type="content" source="./media/tutorial-geofence/logic-app-create.png" alt-text="Screenshot of create a logic app.":::

6. Select **Review + Create**. Review your settings and select **Create** to submit the deployment. When the deployment successfully completes, select **Go to resource**. You're taken to **Logic App Designer**.

7. Select a trigger type. Scroll down to the **Start with a common trigger** section. Select **When an HTTP request is received**.

     :::image type="content" source="./media/tutorial-geofence/logic-app-trigger.png" alt-text="Screenshot of create a logic app HTTP trigger.":::

8. In the upper-right corner of Logic App Designer, select **Save**. The **HTTP POST URL** is automatically generated. Save the URL. You need it in the next section to create an event endpoint.

    :::image type="content" source="./media/tutorial-geofence/logic-app-httprequest.png" alt-text="Screenshot of Logic App HTTP Request URL and JSON.":::

9. Select **+ New Step**. Now you'll choose an action. Type `outlook.com email` in the search box. In the **Actions** list, scroll down and select **Send an email (V2)**.
  
    :::image type="content" source="./media/tutorial-geofence/logic-app-designer.png" alt-text="Screenshot of create a logic app designer.":::

10. Sign in to your Outlook account. Make sure to select **Yes** to allow the logic app to access the account. Fill in the fields for sending an email.

    :::image type="content" source="./media/tutorial-geofence/logic-app-email.png" alt-text="Screenshot of create a logic app send email step.":::

    >[!TIP]
    > You can retrieve GeoJSON response data, such as `geometryId` or `deviceId`, in your email notifications. You can configure Logic Apps to read the data sent by Event Grid. For information on how to configure Logic Apps to consume and pass event data into email notifications, see [Tutorial: Send email notifications about Azure IoT Hub events using Event Grid and Logic Apps](../event-grid/publish-iot-hub-events-to-logic-apps.md).

11. In the upper-left corner of Logic App Designer, select **Save**.

To create a second logic app to notify the manager when equipment exits the construction site, repeat steps 3-11. Name the logic app `Equipment-Exit`.

## Create Azure Maps events subscriptions

Azure Maps supports [three event types](../event-grid/event-schema-azure-maps.md). Here, you need to create two different event subscriptions: one for geofence enter events, and one for geofence exit events.

The following steps show how to create an event subscription for the geofence enter events. You can subscribe to geofence exit events by repeating the steps in a similar manner.

1. Go to your Azure Maps account. In the dashboard, select **Subscriptions**. Select your subscription name, and select **events** from the settings menu.

    :::image type="content" source="./media/tutorial-geofence/events-tab.png" alt-text="Screenshot of go to Azure Maps account events.":::

2. To create an event subscription, select **+ Event Subscription** from the events page.

    :::image type="content" source="./media/tutorial-geofence/create-event-subscription.png" alt-text="Screenshot of create an Azure Maps events subscription.":::

3. On the **Create Event Subscription** page, enter the following values:
    * The **Name** of the event subscription.
    * The **Event Schema** should be *Event Grid Schema*.
    * The **System Topic Name** for this event subscription, which in this case is `Contoso-Construction`.
    * For **Filter to Event Types**, choose `Geofence Entered` as the event type.
    * For **Endpoint Type**, choose `Web Hook`.
    * For **Endpoint**, copy the HTTP POST URL for the logic app enter endpoint that you created in the previous section. If you forgot to save it, you can just go back into Logic App Designer and copy it from the HTTP trigger step.

    :::image type="content" source="./media/tutorial-geofence/events-subscription.png" alt-text="Screenshot of Azure Maps events subscription details.":::

4. Select **Create**.

Repeat steps 1-4 for the logic app exit endpoint that you created in the previous section. On step 3, make sure to choose `Geofence Exited` as the event type.

## Use Spatial Geofence Get API

Use [Spatial Geofence Get API](/rest/api/maps/spatial/getgeofence) to send email notifications to the operations manager when a piece of equipment enters or exits the geofences.

Each piece of equipment has a `deviceId`. In this tutorial,  you're tracking a single piece of equipment, with a unique ID of `device_1`.

The following diagram shows the five locations of the equipment over time, beginning at the *Start* location, which is somewhere outside the geofences. For the purposes of this tutorial, the *Start* location is undefined, because you won't query the device at that location.

When you query the [Spatial Geofence Get API](/rest/api/maps/spatial/getgeofence) with an equipment location that indicates initial geofence entry or exit, Event Grid calls the appropriate logic app endpoint to send an email notification to the operations manager.

Each of the following sections makes API requests by using the five different location coordinates of the equipment.

![Diagram of geofence map in Azure Maps](./media/tutorial-geofence/geofence.png)

### Equipment location 1 (47.638237,-122.132483)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Make it *Location 1*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab, and enter the following URL. Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key, and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udid={udid}&lat=47.638237&lon=-122.1324831&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```

3. Select **Send**. The following GeoJSON appears in the response window.

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

In the preceding GeoJSON response, the negative distance from the main site geofence means that the equipment is inside the geofence. The positive distance from the subsite geofence means that the equipment is outside the subsite geofence. Because this is the first time this device has been located inside the main site geofence, the `isEventPublished` parameter is set to `true`. The operations manager receives an email notification that equipment has entered the geofence.

### Location 2 (47.63800,-122.132531)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Make it *Location 2*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab, and enter the following URL. Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key, and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

   ```HTTP
   https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udId={udId}&lat=47.63800&lon=-122.132531&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```

3. Select **Send**. The following GeoJSON appears in the response window:

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

In the preceding GeoJSON response, the equipment has remained in the main site geofence and hasn't entered the subsite geofence. As a result, the `isEventPublished` parameter is set to `false`, and the operations manager doesn't receive any email notifications.

### Location 3 (47.63810783315048,-122.13336020708084)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Make it *Location 3*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab, and enter the following URL. Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key, and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

    ```HTTP
      https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udid={udid}&lat=47.63810783315048&lon=-122.13336020708084&searchBuffer=5&isAsync=True&mode=EnterAndExit
      ```

3. Select **Send**. The following GeoJSON appears in the response window:

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

In the preceding GeoJSON response, the equipment has remained in the main site geofence, but has entered the subsite geofence. As a result, the `isEventPublished` parameter is set to `true`. The operations manager receives an email notification indicating that the equipment has entered a geofence.

>[!NOTE]
>If the equipment had moved into the subsite after business hours, no event would be published and the operations manager wouldn't receive any notifications.  

### Location 4 (47.637988,-122.1338344)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Make it *Location 4*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab, and enter the following URL. Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key, and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

    ```HTTP
    https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udid={udid}&lat=47.637988&userTime=2023-01-16&lon=-122.1338344&searchBuffer=5&isAsync=True&mode=EnterAndExit
    ```

3. Select **Send**. The following GeoJSON appears in the response window:

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

In the preceding GeoJSON response, the equipment has remained in the main site geofence, but has exited the subsite geofence. Notice, however, that the `userTime` value is after the `expiredTime` as defined in the geofence data. As a result, the `isEventPublished` parameter is set to `false`, and the operations manager doesn't receive an email notification.

### Location 5 (47.63799, -122.134505)

1. Near the top of the Postman app, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Make it *Location 5*. Select the collection you created in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data), and then select **Save**.

2. Select the **GET** HTTP method in the builder tab, and enter the following URL. Make sure to replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key, and `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section](#upload-geofencing-geojson-data).

    ```HTTP
    https://atlas.microsoft.com/spatial/geofence/json?subscription-key={subscription-key}&api-version=1.0&deviceId=device_01&udid={udid}&lat=47.63799&lon=-122.134505&searchBuffer=5&isAsync=True&mode=EnterAndExit
    ```

3. Select **Send**. The following GeoJSON appears in the response window:

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

In the preceding GeoJSON response, the equipment has exited the main site geofence. As a result, the `isEventPublished` parameter is set to `true`, and the operations manager receives an email notification indicating that the equipment has exited a geofence.


You can also [Send email notifications using Event Grid and Logic Apps](../event-grid/publish-iot-hub-events-to-logic-apps.md) and check [Supported Events Handlers in Event Grid](../event-grid/event-handlers.md) using Azure Maps.

## Next steps

> [!div class="nextstepaction"]
> [Handle content types in Azure Logic Apps](../logic-apps/logic-apps-content-type.md)