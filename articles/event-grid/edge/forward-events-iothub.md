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

# Tutorial: Forward Event Grid events to IoTHub

This article walks through all the steps needed to forward Event Grid events to other IoT Edge modules, IoTHub using routes. You might want to do this for the following reasons:

* Continue to use any existing investments already in place with edgeHub's routing
* Prefer to route all events from a device only via IoTHub

To complete this tutorial an understanding of [Event Grid Concepts](concepts.md), [edgeHub](https://docs.microsoft.com/en-us/azure/iot-edge/module-composition) and [IoTHub](https://docs.microsoft.com/en-us/azure/iot-edge/module-composition) routing will be required.

## Prerequisites

In order to complete this tutorial, you will need:-

* **Azure Event Grid module on IoT Edge Device** - Follow the steps in described [here](deploy-event-grid-portal.md) on how to do that if not already done.

## Step 1: Create topic

As a publisher of an event, you need to create an event grid topic. Topic refers to an "endpoint" where publishers can then send events to.

1. Create topic2.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
   {
       "name": "sampleTopic2",
       "properties" : {
          "inputschema": "customeventschema",
       },
   }
   ```

1. Run the following command to create the topic. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic2.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2?api-version=2019-01-01-preview
    ```

## Step 2: Create event subscription

   Subscribers can register for events published to a topic. In order to receive any event, they will need to create an Event grid subscription on a topic of interest. 

1. Create subscription2.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
    {
      "properties": {
        "destination": {
          "endpointType": "edgeHub",
          "properties": {
            "outputName": "sampleSub2"
          }
        }
      }
    }
    ```

   >[!NOTE]
   > The **endpointType** specifies that the subscriber is edgeHub. The **outputName** specifies the output through which the Event Grid module will route events that match this subscription to edgeHub.
  
    Events that match the above subscription will be written to **/messages/modules/eventgridmodule/outputs/sampleSub2**.

2. Run the following command to create the subscription. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription2.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2/eventSubscriptions/sampleSubscription2?api-version=2019-01-01-preview
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
      "FROM /messages/modules/eventgridmodule/outputs/sampleSub2 INTO $upstream"
      ```

      For example,

      ```json
      {
          "routes": {
            "fromEventGridToIoTHub": "FROM /messages/modules/eventgridmodule/outputs/sampleSub2 INTO $upstream"
          }
      }
      ```

   >[!NOTE]
   > The above route will forward any events that match the subscription to be forwarded from Event Grid module to IoTHub. You can use edgeHub [routing](https://docs.microsoft.com/en-us/azure/iot-edge/module-composition) featuers to further filter, route the Event Grid events to other IoT Edge modules.

## Step 4: Setup IoTHub route

  Refer to IoT Hub [routing tutorial](https://docs.microsoft.com/en-us/azure/iot-hub/tutorial-routing) to set up a route from IoTHub, so that you can view the events forwarded from Event Grid module.

## Step 5: Publish event

1. Create event2.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
   [{
       "data": {
            "make": "Ducati",
            "model": "Monster"
        }
    }]
    ```

1. Run the following command to publish event

    ```sh
    curl -k -H "Content-Type: application/json" -X POST -g -d @event2.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2/events?api-version=2019-01-01-preview
    ```

## Step 6: Verify event delivery

Refer to IoT Hub [routing tutorial](https://docs.microsoft.com/en-us/azure/iot-hub/tutorial-routing) to view the events.

## Next steps

In this tutorial, you created an event grid topic, edgeHub subscription, and published events. Now that you know the basic steps to forward to edgeHub:

* Forwarding all events emitted by Event Grid module's subscription to edgeHub
* Try consuming events from other IoT Edge Modules such as Azure Function using EdgeHubTrigger
* Use edgeHub route filters to partition events  
