---
title: Publish, subscribe to events locally - Azure Event Grid IoT Edge | Microsoft Docs 
description: Publish, subscribe to events locally using Webhook with Event Grid on IoT Edge
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Publish, subscribe to events locally

This article walks you through all the steps needed to publish and subscribe to events using Event Grid on IoT Edge.

> [!NOTE]
> To learn about Azure Event Grid topics and subscriptions, see [Event Grid Concepts](concepts.md).

## Prerequisites

To complete this tutorial, you'll need:

- **Azure Event Grid module on An IoT Edge device**. If you don't have this set up already, follow steps in the [Deploy Event Grid IoT Edge module](deploy-event-grid-portal.md) article.
- **Azure Function subscriber module on the same IoT Edge Device**. If you haven't deployed this module already, follow steps in the [Deploy Azure Function IoT Edge module](deploy-func-webhook-module-portal.md) article. 

## Create a topic

As a publisher of an event, you need to create an event grid topic. In Azure Event Grid, a topic refers to an endpoint where publishers can send events to.

1. Create topic.json with the following content. For details about the payload, see our [API documentation](api.md).

    ```json
        {
          "name": "sampleTopic1",
          "properties": {
            "inputschema": "eventGridSchema"
          }
        }
    ```

1. Run the following command to create an event grid topic. Confirm that you see the HTTP status code is `200 OK`.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01-preview
    ```

1. Run the following command to verify topic was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01-preview
    ```

   Sample output:

   ```json
        [
          {
            "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic1",
            "name": "sampleTopic1",
            "type": "Microsoft.EventGrid/topics",
            "properties": {
              "endpoint": "https://<edge-vm-ip>:4438/topics/sampleTopic1/events?api-version=2019-01-01-preview",
              "inputSchema": "EventGridSchema"
            }
          }
        ]
   ```

## Create an event subscription

Subscribers can register for events published to a topic. To receive any event, you'll need to create an Event Grid subscription for a topic of interest.

1. Create subscription.json with the following content. For details about the payload, see our [API documentation](api.md)

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "http://subscriber:80/api/subscriber"
              }
            }
          }
        }
    ```

    >[!NOTE]
    > The **endpointType** property specifies that the subscriber is a **Webhook**.  The **endpointUrl** specifies the URL at which the subscriber is listening for events. This URL corresponds to the Azure Function sample you deployed earlier.
2. Run the following command to create a subscription for the topic. Confirm that you see the HTTP status code is `200 OK`.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/eventSubscriptions/sampleSubscription1?api-version=2019-01-01-preview
    ```
3. Run the following command to verify subscription was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/eventSubscriptions/sampleSubscription1?api-version=2019-01-01-preview
    ```

    Sample output:

   ```json
        {
          "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic1/eventSubscriptions/sampleSubscription1",
          "type": "Microsoft.EventGrid/eventSubscriptions",
          "name": "sampleSubscription1",
          "properties": {
            "Topic": "sampleTopic1",
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "http://subscriber:80/api/subscriber"
              }
            }
          }
        }
    ```

## Publish an event

1. Create event.json with the following content. For details about the payload, see our [API documentation](api.md).

    ```json
        [
          {
            "id": "eventId-func-0",
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
1. Run the following command to publish an event.

    ```sh
    curl -k -H "Content-Type: application/json" -X POST -g -d @event.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/events?api-version=2019-01-01-preview
    ```

## Verify event delivery

1. SSH or RDP into your IoT Edge VM.
1. Check the subscriber logs:

    On Windows, run the following command:

    ```sh
    docker -H npipe:////./pipe/notedly_moby_engine container logs subscriber
    ```

   On Linux, run the following command:

    ```sh
    sudo docker logs subscriber
    ```

    Sample output:

    ```sh
        Received event data [
            {
              "id": "eventId-func-0",
              "topic": "sampleTopic1",
              "subject": "myapp/vehicles/motorcycles",
              "eventType": "recordInserted",
              "eventTime": "2019-07-28T21:03:07+00:00",
              "dataVersion": "1.0",
              "metadataVersion": "1",
              "data": {
                "make": "Ducati",
                "model": "Monster"
              }
            }
          ]
    ```

## Cleanup resources

* Run the following command to delete the topic and all its subscriptions.

    ```sh
    curl -k -H "Content-Type: application/json" -X DELETE https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01-preview
    ```
* Delete the subscriber module from your IoT Edge device.

## Next steps

In this tutorial, you created an event grid topic, subscription, and published events. Now that you know the basic steps, see the following articles: 

*Create/update subscription with [filters](advanced-filtering.md).
*Enable persistence of Event Grid module on [Linux](persist-state-linux.md) or [Windows](persist-state-windows.md)
*Follow [documentation](configure-client-auth.md) to configure client authentication
*Forward events to Azure Functions in the cloud by following this [tutorial](pub-sub-events-webhook-cloud.md)
