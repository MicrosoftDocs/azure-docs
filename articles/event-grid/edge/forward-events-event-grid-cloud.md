---
title: Forward edge events to Event Grid cloud - Azure Event Grid IoT Edge | Microsoft Docs 
description: Forward edge events to Event Grid cloud
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/29/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Forward events to Event Grid cloud

This article walks through all the steps needed to forward edge events to Event Grid in the Azure cloud. You might want to do it for the following reasons:

* React to edge events in the cloud.
* Forward events to Event Grid in the cloud and use Azure Event Hubs or Azure Storage queues to buffer events before processing them in the cloud.

 To complete this tutorial, you need have an understanding of Event Grid concepts on [edge](concepts.md) and [Azure](../concepts.md). For additional destination types, see [event handlers](event-handlers.md). 

## Prerequisites 
In order to complete this tutorial, you will need:

* **Azure subscription** - Create a [free account](https://azure.microsoft.com/free) if you don't already have one. 
* **Azure IoT Hub and IoT Edge device** - Follow the steps in the quick start for [Linux](../../iot-edge/quickstart-linux.md) or [Windows devices](../../iot-edge/quickstart.md) if you don't already have one.

[!INCLUDE [event-grid-deploy-iot-edge](../../../includes/event-grid-deploy-iot-edge.md)] 
## Create event grid topic and subscription in cloud

Create an event grid topic and subscription in the cloud by following [this tutorial](../custom-event-quickstart-portal.md). Note down `topicURL`, `sasKey`, and `topicName` of the newly created topic that you'll use later in the tutorial.

For example, if you created a topic named `testegcloudtopic` in West US, the values would look something like:

* **TopicUrl**: `https://testegcloudtopic.westus2-1.eventgrid.azure.net/api/events`
* **TopicName**: `testegcloudtopic`
* **SasKey**: Available under **AccessKey** of your topic. Use **key1**.

## Create event grid topic at the edge

1. Create topic3.json with the following content. See our [API documentation](api.md) for details about the payload.

    ```json
        {
          "name": "sampleTopic3",
          "properties": {
            "inputschema": "eventGridSchema"
          }
        }
    ```
1. Run the following command to create the topic. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic3.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3?api-version=2019-01-01-preview
    ```
1. Run the following command to verify topic was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3?api-version=2019-01-01-preview
    ```

   Sample output:

   ```json
        [
          {
            "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic3",
            "name": "sampleTopic3",
            "type": "Microsoft.EventGrid/topics",
            "properties": {
              "endpoint": "https://<edge-vm-ip>:4438/topics/sampleTopic3/events?api-version=2019-01-01-preview",
              "inputSchema": "EventGridSchema"
            }
          }
        ]
   ```
  
## Create Event Grid subscription at the edge

[!INCLUDE [event-grid-deploy-iot-edge](../../../includes/event-grid-edge-persist-event-subscriptions.md)]

1. Create subscription3.json with the following content. See our [API documentation](api.md) for details about the payload.

   ```json
        {
          "properties": {
            "destination": {
              "endpointType": "eventGrid",
              "properties": {
                        "endpointUrl": "<your-event-grid-cloud-topic-endpoint-url>?api-version=2018-01-01",
                        "sasKey": "<your-event-grid-topic-saskey>",
                        "topicName": null
              }
            }
          }
    }
   ```

   >[!NOTE]
   > The **endpointUrl** specifies that the Event Grid topic URL in the cloud. The **sasKey** refers to Event Grid cloud topic's key. The value in **topicName** will be used to stamp all outgoing events to Event Grid. This can be useful when posting to an Event Grid domain topic. For more information about Event Grid domain topic, see [Event domains](../event-domains.md)

    For example,
  
    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "eventGrid",
              "properties": {
                "endpointUrl": "https://testegcloudtopic.westus2-1.eventgrid.azure.net/api/events?api-version=2018-01-01",
                 "sasKey": "<your-event-grid-topic-saskey>",
                 "topicName": null
              }
            }
          }
        }
    ```

2. Run the following command to create the subscription. HTTP Status Code of 200 OK should be returned.

     ```sh
     curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription3.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3/eventSubscriptions/sampleSubscription3?api-version=2019-01-01-preview
     ```

3. Run the following command to verify subscription was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3/eventSubscriptions/sampleSubscription3?api-version=2019-01-01-preview
    ```

    Sample output:

    ```json
         {
          "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic3/eventSubscriptions/sampleSubscription3",
          "type": "Microsoft.EventGrid/eventSubscriptions",
          "name": "sampleSubscription3",
          "properties": {
            "Topic": "sampleTopic3",
            "destination": {
              "endpointType": "eventGrid",
              "properties": {
                "endpointUrl": "https://testegcloudtopic.westus2-1.eventgrid.azure.net/api/events?api-version=2018-01-01",
                "sasKey": "<your-event-grid-topic-saskey>",
                "topicName": null
              }
            }
          }
        }
    ```

## Publish an event at the edge

1. Create event3.json with the following content. See [API documentation](api.md) for details about the payload.

    ```json
        [
          {
            "id": "eventId-egcloud-0",
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

1. Run the following command:

    ```sh
    curl -k -H "Content-Type: application/json" -X POST -g -d @event3.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3/events?api-version=2019-01-01-preview
    ```

## Verify edge event in cloud

For information on viewing events delivered by the cloud topic, see the [tutorial](../custom-event-quickstart-portal.md).

## Cleanup resources

* Run the following command to delete the topic and all its subscriptions

    ```sh
    curl -k -H "Content-Type: application/json" -X DELETE https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3?api-version=2019-01-01-preview
    ```

* Delete topic and subscriptions created in the cloud (Azure Event Grid) as well.

## Next steps

In this tutorial, you published an event on the edge and forwarded to Event Grid in the Azure cloud. Now that you know the basic steps to forward to Event Grid in cloud:

* To troubleshoot issues with using Azure Event Grid on IoT Edge, see [Troubleshooting guide](troubleshoot.md).
* Forward events to IoTHub by following this [tutorial](forward-events-iothub.md)
* Forward events to Webhook in the cloud by following this [tutorial](pub-sub-events-webhook-cloud.md)
* [Monitor topics and subscriptions on the edge](monitor-topics-subscriptions.md)
