---
title: React to Azure Maps events by using Event Grid 
description: Find out how to react to Azure Maps events involving geofences. See how to listen to map events and how to use Event Grid to reroute events to event handlers.
author: eriklindeman
ms.author: eriklind
ms.date: 07/16/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps

ms.custom: mvc
---

# React to Azure Maps events by using Event Grid

Azure Maps integrates with Azure Event Grid, so that users can send event notifications to other services and trigger downstream processes. The purpose of this article is to help you configure your business applications to listen to Azure Maps events. This allows users to react to critical events in a reliable, scalable, and secure manner. For example, users can build an application to update a database, create a ticket, and deliver an email notification, every time a device enters a geofence.

> [!NOTE]
> The Geofence API async event requires the region property of your Azure Maps account be set to ***Global***. When creating an Azure Maps account in the Azure portal, this isn't given as an option. For more information, see [Create an Azure Maps account with a global region].

Azure Event Grid is a fully managed event routing service, which uses a publish-subscribe model. Event Grid has built-in support for Azure services like [Azure Functions] and [Azure Logic Apps]. It can deliver event alerts to non-Azure services using webhooks. For a complete list of the event handlers that Event Grid supports, see [An introduction to Azure Event Grid].

![Azure Event Grid functional model](./media/azure-maps-event-grid-integration/azure-event-grid-functional-model.png)

## Azure Maps events types

Event Grid uses [event subscriptions] to route event messages to subscribers. An Azure Maps account emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Maps.GeofenceEntered | Raised when received coordinates have moved from outside of a given geofence to within |
| Microsoft.Maps.GeofenceExited | Raised when received coordinates have moved from within a given geofence to outside |
| Microsoft.Maps.GeofenceResult | Raised every time a geofencing query returns a result, regardless of the state |

## Event schema

The following example shows the schema for GeofenceResult:

```JSON
{
    "id":"451675de-a67d-4929-876c-5c2bf0b2c000",
    "topic":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Maps/accounts/{accountName}",
    "subject":"/spatial/geofence/udid/{udid}/id/{eventId}",
    "data":{
        "geometries":[
            {
                "deviceId":"device_1",
                "udId":"1a13b444-4acf-32ab-ce4e-9ca4af20b169",
                "geometryId":"1",
                "distance":999.0,
                "nearestLat":47.609833,
                "nearestLon":-122.148274
            }
        ],
        "expiredGeofenceGeometryId":[
        ],
        "invalidPeriodGeofenceGeometryId":[
        ]
    },
    "eventType":"Microsoft.Maps.GeofenceResult",
    "eventTime":"2018-11-08T00:52:08.0954283Z",
    "metadataVersion":"1",
    "dataVersion":"1.0"
}

```

## Tips for consuming events

Applications that handle Azure Maps geofence events should follow a few recommended practices:

* The Geofence API async event requires the region property of your Azure Maps account be set to ***Global***. When creating an Azure Maps account in the Azure portal, this isn't given as an option. For more information, see [Create an Azure Maps account with a global region].
* Configure multiple subscriptions to route events to the same event handler. It's important not to assume that events are from a particular source. Always check the message topic to ensure that the message came from the source that you expect.
* Use the `X-Correlation-id` field in the response header to understand if your information about objects is up to date. Messages can arrive out of order or after a delay.
* When a GET or a POST request in the Geofence API is called with the mode parameter set to `EnterAndExit`, then an Enter or Exit event is generated for each geometry in the geofence for which the status has changed from the previous Geofence API call.

## Next steps

For details about all the events supported by Azure Maps and the schema, see [Azure Maps as an Event Grid source].

To learn more about how to use geofencing to control operations at a construction site, see:

> [!div class="nextstepaction"]
> [Set up a geofence by using Azure Maps]

[An introduction to Azure Event Grid]: ../event-grid/overview.md
[Azure Functions]: ../azure-functions/functions-overview.md
[Azure Logic Apps]: ../azure-functions/functions-overview.md
[Azure Maps as an Event Grid source]: ../event-grid/event-schema-azure-maps.md
[Create an Azure Maps account with a global region]: tutorial-geofence.md#create-an-azure-maps-account-with-a-global-region
[event subscriptions]: ../event-grid/concepts.md#event-subscriptions
[Set up a geofence by using Azure Maps]: tutorial-geofence.md
