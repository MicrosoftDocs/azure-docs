---
title: 'Tutorial: Create a geofence and track devices on a Microsoft Azure Map'
description: Tutorial on how to set up a geofence. See how to track devices relative to the geofence by using the Azure Maps Spatial service
author: eriklindeman
ms.author: eriklind
ms.date: 09/14/2023
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
ms.custom: mvc
---

# Tutorial: Set up a geofence by using Azure Maps

This tutorial walks you through the basics of creating and using Azure Maps geofence services.

Consider the following scenario:

*A construction site manager must track equipment as it enters and leaves the perimeters of a construction area. Whenever a piece of equipment exits or enters these perimeters, an email notification is sent to the Operations Manager.*

Azure Maps provides services to support the tracking of equipment entering and exiting the construction area. In this tutorial, you will:

> [!div class="checklist"]
>
> * Create an Azure Maps account with a global region.
> * Upload [Geofencing GeoJSON data] that defines the construction site areas you want to monitor. You'll upload geofences as polygon coordinates to your Azure storage account, then use the [data registry] service to register that data with your Azure Maps account.
> * Set up two [logic apps] that, when triggered, send email notifications to the construction site operations manager when equipment enters and exits the geofence area.
> * Use [Azure Event Grid] to subscribe to enter and exit events for your Azure Maps geofence. You set up two webhook event subscriptions that call the HTTP endpoints defined in your two logic apps. The logic apps then send the appropriate email notifications of equipment moving beyond or entering the geofence.
> * Use [Search Geofence Get API] to receive notifications when a piece of equipment exits and enters the geofence areas.

## Prerequisites

* This tutorial uses the [Postman] application, but you can use a different API development environment.

>[!IMPORTANT]
>
> * In the URL examples, replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key.

## Create an Azure Maps account with a global region

The Geofence API async event requires the region property of your Azure Maps account be set to ***Global***. This setting isn't given as an option when creating an Azure Maps account in the Azure portal, however you do have several other options for creating a new Azure Maps account with the *global* region setting. This section lists the three methods that can be used to create an Azure Maps account with the region set to *global*.

> [!NOTE]
> The `location` property in both the ARM template and PowerShell `New-AzMapsAccount` command refer to the same property as the `Region` field in the Azure portal.

### Use an ARM template to create an Azure Maps account with a global region

[Create your Azure Maps account using an ARM template], making sure to set `location` to `global` in the `resources` section of the ARM template.

### Use PowerShell to create an Azure Maps account with a global region

```powershell
New-AzMapsAccount -ResourceGroupName your-Resource-Group -Name name-of-maps-account -SkuName g2 -Location global
```

### Use Azure CLI to create an Azure Maps account with a global region

The Azure CLI command [az maps account create] doesn’t have a location property, but defaults to `global`, making it useful for creating an Azure Maps account with a global region setting for use with the Geofence API async event.

## Upload geofencing GeoJSON data

This tutorial demonstrates how to upload geofencing GeoJSON data that contains a `FeatureCollection`. The `FeatureCollection` contains two geofences that define polygonal areas within the construction site. The first geofence has no time expiration or restrictions. The second can only be queried against during business hours (9:00 AM-5:00 PM in the Pacific Time zone), and will no longer be valid after January 1, 2022. For more information on the GeoJSON format, see [Geofencing GeoJSON data].

Create the geofence JSON file using the following geofence data. You'll upload this file into your Azure storage account next.

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

Follow the steps outlined in the [How to create data registry] article to upload the geofence JSON file into your Azure storage account then register it in your Azure Maps account.

> [!IMPORTANT]
> Make sure to make a note of the unique identifier (`udid`) value, you will need it. The `udid` is how you reference the geofence you uploaded into your Azure storage account from your source code and HTTP requests.

## Create workflows in Azure Logic Apps

Next, create two [logic app] endpoints that trigger an email notification.

To create the logic apps:

1. Sign in to the [Azure portal].

2. In the upper-left corner of the Azure portal, select **Create a resource**.

3. In the **Search the Marketplace** box, type **Logic App**.

4. From the results, select **Logic App**. Then, select **Create**.

5. On the **Logic App** page, enter the following values:
    * The **Subscription** that you want to use for this logic app.
    * The **Resource group** name for this logic app. You can choose to **Create new** or **Use existing** resource group.
    * The **Logic App name** of your logic app. In this case, use `Equipment-Enter` as the name.

    For the purposes of this tutorial, keep all other values on their default settings.

    :::image type="content" source="./media/tutorial-geofence/logic-app-create.png" alt-text="Screenshot of create a logic app.":::

6. Select **Review + Create**. Review your settings and select **Create**.

7. When the deployment completes successfully, select **Go to resource**.

8. In the **Logic App Designer**, scroll down to the **Start with a common trigger** section. Select **When an HTTP request is received**.

     :::image type="content" source="./media/tutorial-geofence/logic-app-trigger.png" alt-text="Screenshot of create a logic app HTTP trigger.":::

9. In the upper-right corner of Logic App Designer, select **Save**. The **HTTP POST URL** is automatically generated. Save the URL. You need it in the next section to create an event endpoint.

    :::image type="content" source="./media/tutorial-geofence/logic-app-httprequest.png" alt-text="Screenshot of Logic App HTTP Request URL and JSON.":::

10. Select **+ New Step**.

11. In the search box, type `outlook.com email`. In the **Actions** list, scroll down and select **Send an email (V2)**.
  
    :::image type="content" source="./media/tutorial-geofence/logic-app-designer.png" alt-text="Screenshot of create a logic app designer.":::

12. Sign in to your Outlook account. Make sure to select **Yes** to allow the logic app to access the account. Fill in the fields for sending an email.

    :::image type="content" source="./media/tutorial-geofence/logic-app-email.png" alt-text="Screenshot of create a logic app send email step.":::

    >[!TIP]
    > You can retrieve GeoJSON response data, such as `geometryId` or `deviceId`, in your email notifications. You can configure Logic Apps to read the data sent by Event Grid. For information on how to configure Logic Apps to consume and pass event data into email notifications, see [Tutorial: Send email notifications about Azure IoT Hub events using Event Grid and Logic Apps].

13. In the upper-left corner of **Logic App Designer**, select **Save**.

14. To create a second logic app to notify the manager when equipment exits the construction site, repeat the same process. Name the logic app `Equipment-Exit`.

## Create Azure Maps events subscriptions

Azure Maps supports [three event types]. This tutorial demonstrates how to create subscriptions to the following two events:

* Geofence enter events
* Geofence exit events

Create geofence exit and enter event subscriptions:

1. In your Azure Maps account, select **Subscriptions**.

2. Select your subscription name.

3. In the settings menu, select **events**.

    :::image type="content" source="./media/tutorial-geofence/events-tab.png" alt-text="Screenshot of go to Azure Maps account events.":::

4. In the events page, Select **+ Event Subscription**.

    :::image type="content" source="./media/tutorial-geofence/create-event-subscription.png" alt-text="Screenshot of create an Azure Maps events subscription.":::

5. On the **Create Event Subscription** page, enter the following values:
    * The **Name** of the event subscription.
    * The **Event Schema** should be *Event Grid Schema*.
    * The **System Topic Name** for this event subscription, which in this case is `Contoso-Construction`.
    * For **Filter to Event Types**, choose `Geofence Entered` as the event type.
    * For **Endpoint Type**, choose `Web Hook`.
    * For **Endpoint**, copy the HTTP POST URL for the logic app enter endpoint that you created in the previous section. If you forgot to save it, you can just go back into Logic App Designer and copy it from the HTTP trigger step.

    :::image type="content" source="./media/tutorial-geofence/events-subscription.png" alt-text="Screenshot of Azure Maps events subscription details.":::

6. Select **Create**.

7. Repeat the same process for the geofence exit event. Make sure to choose `Geofence Exited` as the event type.

## Use Spatial Geofence Get API

Next, we use the [Spatial Geofence Get API] to send email notifications to the Operations Manager when a piece of equipment enters or exits the geofences.

Each piece of equipment has a `deviceId`. In this tutorial,  you're tracking a single piece of equipment, with a unique ID of `device_1`.

The following diagram shows the five locations of the equipment over time, beginning at the *Start* location, which is somewhere outside the geofences. For the purposes of this tutorial, the *Start* location is undefined, because you don't query the device at that location.

When you query the [Spatial Geofence Get API] with an equipment location that indicates initial geofence entry or exit, Event Grid calls the appropriate logic app endpoint to send an email notification to the Operations Manager.

Each of the following sections makes API requests by using the five different location coordinates of the equipment.

![Diagram of geofence map in Azure Maps](./media/tutorial-geofence/geofence.png)

### Equipment location 1 (47.638237,-122.132483)

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *Location 1*.

4. Select the **GET** HTTP method.

5. Enter the following URL. The request should look like the following URL (replace `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section]).

   ```HTTP
   https://{geography}.atlas.microsoft.com/spatial/geofence/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2022-08-01&deviceId=device_01&udid={udid}&lat=47.638237&lon=-122.1324831&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```

   > [!NOTE]
   > Replace {geography} with your geographic scope. For more information, see [Azure Maps service geographic scope] and the [Spatial Geofence Get API].

6. Select **Send**.

7. The response should like the following GeoJSON fragment:

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

In the preceding GeoJSON response, the negative distance from the main site geofence means that the equipment is inside the geofence. The positive distance from the subsite geofence means that the equipment is outside the subsite geofence. Because this is the first time this device has been located inside the main site geofence, the `isEventPublished` parameter is set to `true`. The Operations Manager receives an email notification that equipment has entered the geofence.

### Location 2 (47.63800,-122.132531)

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *Location 2*.

4. Select the **GET** HTTP method.

5. Enter the following URL. The request should look like the following URL (replace `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section]).

   ```HTTP
   https://{geography}.atlas.microsoft.com/spatial/geofence/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2022-08-01&deviceId=device_01&udId={udId}&lat=47.63800&lon=-122.132531&searchBuffer=5&isAsync=True&mode=EnterAndExit
   ```

6. Select **Send**.

7. The response should like the following GeoJSON fragment:

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

In the preceding GeoJSON response, the equipment has remained in the main site geofence and hasn't entered the subsite geofence. As a result, the `isEventPublished` parameter is set to `false`, and the Operations Manager doesn't receive any email notifications.

### Location 3 (47.63810783315048,-122.13336020708084)

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *Location 3*.

4. Select the **GET** HTTP method.

5. Enter the following URL. The request should look like the following URL (replace `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section]).

    ```HTTP
      https://{geography}.atlas.microsoft.com/spatial/geofence/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2022-08-01&deviceId=device_01&udid={udid}&lat=47.63810783315048&lon=-122.13336020708084&searchBuffer=5&isAsync=True&mode=EnterAndExit
      ```

6. Select **Send**.

7. The response should like the following GeoJSON fragment:

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

In the preceding GeoJSON response, the equipment has remained in the main site geofence, but has entered the subsite geofence. As a result, the `isEventPublished` parameter is set to `true`. The Operations Manager receives an email notification indicating that the equipment has entered a geofence.

>[!NOTE]
>If the equipment had moved into the subsite after business hours, no event would be published and the operations manager wouldn't receive any notifications.  

### Location 4 (47.637988,-122.1338344)

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *Location 4*.

4. Select the **GET** HTTP method.

5. Enter the following URL. The request should look like the following URL (replace `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section]).

    ```HTTP
    https://{geography}.atlas.microsoft.com/spatial/geofence/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2022-08-01&deviceId=device_01&udid={udid}&lat=47.637988&userTime=2023-01-16&lon=-122.1338344&searchBuffer=5&isAsync=True&mode=EnterAndExit
    ```

6. Select **Send**.

7. The response should like the following GeoJSON fragment:

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

In the preceding GeoJSON response, the equipment has remained in the main site geofence, but has exited the subsite geofence. Notice, however, that the `userTime` value is after the `expiredTime` as defined in the geofence data. As a result, the `isEventPublished` parameter is set to `false`, and the Operations Manager doesn't receive an email notification.

### Location 5 (47.63799, -122.134505)

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *Location 5*.

4. Select the **GET** HTTP method.

5. Enter the following URL. The request should look like the following URL (replace `{udid}` with the `udid` you saved in the [Upload Geofencing GeoJSON data section]).

    ```HTTP
    https://{geography}.atlas.microsoft.com/spatial/geofence/json?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2022-08-01&deviceId=device_01&udid={udid}&lat=47.63799&lon=-122.134505&searchBuffer=5&isAsync=True&mode=EnterAndExit
    ```

6. Select **Send**.

7. The response should like the following GeoJSON fragment:

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

In the preceding GeoJSON response, the equipment has exited the main site geofence. As a result, the `isEventPublished` parameter is set to `true`, and the Operations Manager receives an email notification indicating that the equipment has exited a geofence.

You can also [Send email notifications using Event Grid and Logic Apps] and check [Supported Events Handlers in Event Grid] using Azure Maps.

## Clean up resources

There are no resources that require cleanup.

## Next steps

> [!div class="nextstepaction"]
> [Handle content types in Azure Logic Apps]

[az maps account create]: /cli/azure/maps/account?view=azure-cli-latest&preserve-view=true#az-maps-account-create
[Azure Event Grid]: ../event-grid/overview.md
[Azure Maps service geographic scope]: geographic-scope.md
[Azure portal]: https://portal.azure.com
[Create your Azure Maps account using an ARM template]: how-to-create-template.md
[data registry]: /rest/api/maps/data-registry
[Geofencing GeoJSON data]: geofence-geojson.md
[Handle content types in Azure Logic Apps]: ../logic-apps/logic-apps-content-type.md
[How to create data registry]: how-to-create-data-registries.md
[logic app]: ../event-grid/handler-webhooks.md#logic-apps
[logic apps]: ../event-grid/handler-webhooks.md#logic-apps
[Postman]: https://www.postman.com
[Search Geofence Get API]: /rest/api/maps/spatial/getgeofence
[Send email notifications using Event Grid and Logic Apps]: ../event-grid/publish-iot-hub-events-to-logic-apps.md
[Spatial Geofence Get API]: /rest/api/maps/spatial/getgeofence
[Supported Events Handlers in Event Grid]: ../event-grid/event-handlers.md
[three event types]: ../event-grid/event-schema-azure-maps.md
[Tutorial: Send email notifications about Azure IoT Hub events using Event Grid and Logic Apps]: ../event-grid/publish-iot-hub-events-to-logic-apps.md
[Upload Geofencing GeoJSON data section]: #upload-geofencing-geojson-data
