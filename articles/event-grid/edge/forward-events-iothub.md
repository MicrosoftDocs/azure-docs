---
title: Forward Event Grid events to IoTHub - Azure Event Grid IoT Edge | Microsoft Docs 
description: Forward Event Grid events to IoTHub
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/29/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Forward events to IoTHub

This article walks through all the steps needed to forward Event Grid events to other IoT Edge modules, IoTHub using routes. You might want to do it for the following reasons:

* Continue to use any existing investments already in place with edgeHub's routing
* Prefer to route all events from a device only via IoT Hub

To complete this tutorial, you need to understand the following concepts:

- [Event Grid Concepts](concepts.md)
- [IoT Edge hub](../../iot-edge/module-composition.md) 

## Prerequisites 
In order to complete this tutorial, you will need:

* **Azure subscription** - Create a [free account](https://azure.microsoft.com/free) if you don't already have one. 
* **Azure IoT Hub and IoT Edge device** - Follow the steps in the quick start for [Linux](../../iot-edge/quickstart-linux.md) or [Windows devices](../../iot-edge/quickstart.md) if you don't already have one.

[!INCLUDE [event-grid-deploy-iot-edge](../../../includes/event-grid-deploy-iot-edge.md)]

## Create topic

As a publisher of an event, you need to create an event grid topic. The topic refers to an end point where publishers can then send events to.

1. Create topic4.json with the following content. See our [API documentation](api.md) for details about the payload.

   ```json
    {
          "name": "sampleTopic4",
          "properties": {
            "inputschema": "eventGridSchema"
          }
    }
    ```
1. Run the following command to create the topic. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic4.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic4?api-version=2019-01-01-preview
    ```

1. Run the following command to verify topic was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic4?api-version=2019-01-01-preview
    ```

   Sample output:

   ```json
        [
          {
            "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic4",
            "name": "sampleTopic4",
            "type": "Microsoft.EventGrid/topics",
            "properties": {
              "endpoint": "https://<edge-vm-ip>:4438/topics/sampleTopic4/events?api-version=2019-01-01-preview",
              "inputSchema": "EventGridSchema"
            }
          }
        ]
   ```

## Create event subscription

Subscribers can register for events published to a topic. To receive any event, they'll need to create an Event grid subscription on a topic of interest.

[!INCLUDE [event-grid-deploy-iot-edge](../../../includes/event-grid-edge-persist-event-subscriptions.md)]

1. Create subscription4.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
    {
          "properties": {
                "destination": {
                      "endpointType": "edgeHub",
                      "properties": {
                            "outputName": "sampleSub4"
                      }
                }
          }
    }
   ```

   >[!NOTE]
   > The `endpointType` specifies that the subscriber is `edgeHub`. The `outputName` specifies the output on which the Event Grid module will route events that match this subscription to edgeHub. For example, events that match the above subscription will be written to `/messages/modules/eventgridmodule/outputs/sampleSub4`.
2. Run the following command to create the subscription. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription4.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic4/eventSubscriptions/sampleSubscription4?api-version=2019-01-01-preview
    ```
3. Run the following command to verify subscription was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic4/eventSubscriptions/sampleSubscription4?api-version=2019-01-01-preview
    ```

    Sample output:

   ```json
        {
          "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic4/eventSubscriptions/sampleSubscription4",
          "type": "Microsoft.EventGrid/eventSubscriptions",
          "name": "sampleSubscription4",
          "properties": {
            "Topic": "sampleTopic4",
            "destination": {
                      "endpointType": "edgeHub",
                      "properties": {
                            "outputName": "sampleSub4"
                      }
                }
          }
        }
    ```

## Set up an edge hub route

Update the edge hub's route to forward event subscription's events to be forwarded to IoTHub as follows:

1. Sign in to the [Azure portal](https://ms.portal.azure.com)
1. Navigate to the **IoT Hub**.
1. Select **IoT Edge** from the menu
1. Select the ID of the target device from the list of devices.
1. Select **Set Modules**.
1. Select **Next** and to the routes section.
1. In the routes, add a new route

  ```sh
  "fromEventGridToIoTHub":"FROM /messages/modules/eventgridmodule/outputs/sampleSub4 INTO $upstream"
  ```

  For example,

  ```json
  {
      "routes": {
        "fromEventGridToIoTHub": "FROM /messages/modules/eventgridmodule/outputs/sampleSub4 INTO $upstream"
      }
  }
  ```

   >[!NOTE]
   > The above route will forward any events matched for this subscription to be forwarded to the IoT hub. You can use the [Edge hub routing](../../iot-edge/module-composition.md) features to further filter, and route the Event Grid events to other IoT Edge modules.

## Setup IoT Hub route

See the [IoT Hub routing tutorial](../../iot-hub/tutorial-routing.md) to set up a route from the IoT hub so that you can view events forwarded from the Event Grid module. Use `true` for the query to keep the tutorial simple.  



## Publish an event

1. Create event4.json with the following content. See our [API documentation](api.md) for details about the payload.

    ```json
        [
          {
            "id": "eventId-iothub-1",
            "eventType": "recordInserted",
            "subject": "myapp/vehicles/motorcycles",
            "eventTime": "2019-07-28T21:03:07+00:00",
            "dataVersion": "1.0",
            "data": {
              "make": "Ducati",
              "model": "Monster"
            }
          }
        ]
    ```

1. Run the following command to publish event:

    ```sh
    curl -k -H "Content-Type: application/json" -X POST -g -d @event4.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic4/events?api-version=2019-01-01-preview
    ```

## Verify event delivery

See the IoT Hub [routing tutorial](../../iot-hub/tutorial-routing.md) for the steps to view the events.

## Cleanup resources

* Run the following command to delete the topic and all its subscriptions at the edge:

    ```sh
    curl -k -H "Content-Type: application/json" -X DELETE https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic4?api-version=2019-01-01-preview
    ```
* Delete any resources created while setting up IoTHub routing in the cloud as well.

## Next steps

In this tutorial, you created an event grid topic, edge hub subscription, and published events. Now that you know the basic steps to forward to an edge hub, see the following articles:

* To troubleshoot issues with using Azure Event Grid on IoT Edge, see [Troubleshooting guide](troubleshoot.md).
* Use [edge hub](../../iot-edge/module-composition.md) route filters to partition events
* Set up persistence of Event Grid module on [linux](persist-state-linux.md) or [Windows](persist-state-windows.md)
* Follow [documentation](configure-client-auth.md) to configure client authentication
* Forward events to Azure Event Grid in the cloud by following this [tutorial](forward-events-event-grid-cloud.md)
* [Monitor topics and subscriptions on the edge](monitor-topics-subscriptions.md)