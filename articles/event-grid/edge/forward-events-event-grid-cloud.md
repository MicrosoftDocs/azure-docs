---
title: Forward edge events to Event Grid cloud - Azure Event Grid IoT Edge | Microsoft Docs 
description: Forward edge events to Event Grid cloud
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/26/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Forward edge events to Event Grid cloud

This article walks through all the steps needed to forward edge events to Event Grid in cloud. You might want to do this for the following reasons:

* React to edge events in the cloud
* Forward events to Event Grid in Cloud and use Event Hubs, Storage Queues to buffer events before processing them in the cloud

To complete this tutorial an understanding of Event Grid concepts on [edge](concepts.md)  and in [cloud](https://docs.microsoft.com/azure/event-grid/concepts) will be required.

## Prerequisites

In order to complete this tutorial, you will need:

**Azure Event Grid module on IoT Edge Device** - Follow the steps in described [here](deploy-event-grid-portal.md) on how to do that if not already done.

## Step 1: Create event grid topic and subscription in cloud

Create an event grid topic and subscription in the cloud by following the [tutorial](https://docs.microsoft.com/azure/event-grid/custom-event-quickstart-portal). You will need *topicURL*, *sasKey*, and *topicName* of the newly created topic for use later in the tutorial.

For example, if we created a topic **testegcloudtopic** in west US the values would look something like:

* **TopicUrl**: https://testegcloudtopic.westus2-1.eventgrid.azure.net/api/events
* **TopicName**: testegcloudtopic
* **SasKey**: Available under **AccessKey** of your topic. Use **key1**.

## Step 2: Create event grid topic in edge

Create an event grid topic in the edge,

1. Create topic3.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
   {
       "name": "sampleTopic3",
       "properties" : {
          "inputschema": "eventGridSchema",
       },
   }
   ```

1. Run the following command to create the topic. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic3.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3?api-version=2019-01-01-preview
    ```

## Step 3: Create Event Grid subscription in edge

Create an event grid subscription in the edge,

1. Create subscription3.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
    {
      "properties": {
        "destination": {
          "endpointType": "eventGrid",
          "properties": {
            "endpointUrl": "<your-event-grid-cloud-topic-endpoint-url>",
             "sasKey": "<your-event-grid-topic-saskey>",
             "topicName": null,
          }
        }
      }
    }
    ```

    For example,

    ```json
    {
      "properties": {
        "destination": {
          "endpointType": "eventGrid",
          "properties": {
            "endpointUrl": "https://testegcloudtopic.westus2-1.eventgrid.azure.net/api/events",
             "sasKey": "<your-event-grid-topic-saskey>",
             "topicName": "testegcloudtopic.westus2-1",
          }
        }
      }
    }
    ```

   >[!NOTE]
   > The **endpointUrl** specifies that the Event Grid topic URL in the cloud. The **sasKey** refers to Event Grid cloud topic's key. The value in **topicName** will used to stamp all outgoing events to Event Grid. This can be useful when posting to an Event Grid Domain Topic. For more information about Event Grid Domain Topic, see the [documentation](https://docs.microsoft.com/azure/event-grid/event-domains)

2. Run the following command to create the subscription. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription3.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3/eventSubscriptions/sampleSubscription3?api-version=2019-01-01-preview
    ```

## Step 4: Publish event in edge

To publish an event in edge,

1. Create event3.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
   [{
       "id": "eventId-0",
       "eventType": "recordInserted",
       "subject": "myapp/vehicles/motorcycles",
       "eventTime": "2019-07-28T21:03:07+00:00",
       "dataVersion": "1.0"
       "data": {
            "make": "Ducati",
            "model": "Monster"
        },
    }]
    ```

1. Run the following command:

    ```sh
    curl -k -H "Content-Type: application/json" -X POST -g -d @event3.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic3/events?api-version=2019-01-01-preview
    ```

## Step 5: Verify edge event in cloud

For information on viewing events delivered by the cloud topic, see the [tutorial](https://docs.microsoft.com/azure/event-grid/custom-event-quickstart-portal).

## Next steps

In this tutorial, you published event on the edge and forwarded to Event Grid in cloud. Now that you know the basic steps to forward to Event Grid in cloud:

* Vary the input schema on the edge and cloud
* Explore the various destination types offered by Event Grid cloud
* Post to Event Grid Domain Topics in the cloud
