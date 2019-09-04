---
title: Forward Event Grid events to IoTHub - Azure Event Grid IoT Edge | Microsoft Docs 
description: Forward Event Grid events to IoTHub
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/25/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Forward events to IoTHub

This article walks through all the steps needed to forward Event Grid events to other IoT Edge modules, IoTHub using routes. You might want to do this for the following reasons:

* Continue to use any existing investments already in place with edgeHub's routing
* Prefer to route all events from a device only via IoTHub

To complete this tutorial an understanding of [Event Grid Concepts](concepts.md), [edgeHub](https://docs.microsoft.com/azure/iot-edge/module-composition) and [IoTHub](https://docs.microsoft.com/azure/iot-edge/module-composition) routing will be required.

## Prerequisites

In order to complete this tutorial, you will need:-

* **Azure Event Grid module on IoT Edge Device** - Follow the steps in described [here](deploy-event-grid-portal.md) on how to do that if not already done.

## Step 1: Create topic

As a publisher of an event, you need to create an event grid topic. Topic refers to an "endpoint" where publishers can then send events to.

1. Create topic4.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

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

## Step 2: Create event subscription

   Subscribers can register for events published to a topic. In order to receive any event, they will need to create an Event grid subscription on a topic of interest.

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
   > The **endpointType** specifies that the subscriber is edgeHub. The **outputName** specifies the output on which the Event Grid module will route events that match this subscription to edgeHub. For example, events that match the above subscription will be written to **/messages/modules/eventgridmodule/outputs/sampleSub4**.

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

## Step 3: Setup edgeHub route

   Update edgeHub route to forward event subscription's events to be forwarded to IoTHub as follows:

   1. Sign in to the [Azure portal](https://ms.portal.azure.com)
   1. Navigate to the IoT Hub
   1. Select **IoT Edge** from the menu
   1. Click on the ID of the target device from the list of devices
   1. Select **Set Modules**
   1. Select **Next** and to the routes section
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
   > The above route will forward any events matched for this subscription to be forwarded to IoTHub. You can use edgeHub [routing](https://docs.microsoft.com/azure/iot-edge/module-composition) features to further filter, route the Event Grid events to other IoT Edge modules.

## Step 4: Setup IoTHub route

  Refer to IoT Hub [routing tutorial](https://docs.microsoft.com/azure/iot-hub/tutorial-routing) to set up a route from IoTHub, so that you can view the events forwarded from Event Grid module.

## Step 5: Publish event

1. Create event4.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

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

1. Run the following command to publish event

    ```sh
    curl -k -H "Content-Type: application/json" -X POST -g -d @event4.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic4/events?api-version=2019-01-01-preview
    ```

## Step 6: Verify event delivery

Refer to IoT Hub [routing tutorial](https://docs.microsoft.com/azure/iot-hub/tutorial-routing) to view the events.

## Cleanup resources

* Run the following command to delete the topic and all its subscriptions in the edge

    ```sh
    curl -k -H "Content-Type: application/json" -X DELETE https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic4?api-version=2019-01-01-preview
    ```

* Delete any resources created while setting up IoTHub routing in the cloud as well.

## Next steps

In this tutorial, you created an event grid topic, edgeHub subscription, and published events. Now that you know the basic steps to forward to edgeHub:

* Use edgeHub route filters to partition events
* Set up persistence of Event Grid module on [linux](persist-state-linux.md) or [Windows](persist-state-windows.md)
* Follow [documentation](configure-client-auth.md) to configure client authentication
* Forward events to Azure Event Grid in the cloud by following this [tutorial](forward-events-event-grid-cloud.md)
