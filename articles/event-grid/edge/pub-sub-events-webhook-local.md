---
title: Publish, subscribe to events locally - Azure Event Grid IoT Edge | Microsoft Docs 
description: Publish, subscribe to events locally using Webhook with Event Grid on IoT Edge
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/23/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Publish, subscribe to events locally

This article walks through all the steps needed to publish  and subscribe to events using Event Grid on IoT Edge.

Refer to [Event Grid Concepts](concepts.md) documentation to understand what an event grid topic, subscription is before proceeding.

## Prerequisites

In order to complete this tutorial, you will need:-

* **Azure Event Grid module on IoT Edge Device** - Follow the steps in described [here](deploy-event-grid-portal.md) on how to do that if not already done.

* **Azure Function subscriber module on the same IoT Edge Device** - Follow the steps in described [here](deploy-func-webhook-module-portal.md) on how to do that if not already done.

## Step1: Create Topic

As a publisher of an event, you need to create an event grid topic. Topic refers to an "endpoint" where publishers can then send events to. Subscribers will have to subscribe to a topic to receive events of interest.

1. Create topic.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
   {
       "name": "sampleTopic1",
       "properties" : {
          "inputschema": "customeventschema",
       },
   }
   ```

1. Run the following command to create the topic. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01
    ```

## Create Event Subscription

    Any module interested in receiving events will create an Event grid subscription on a topic of interest.

1. Create subscription.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

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
   > The **endpointType** specifies that the subscriber is a Webhook.  The **endpointUrl** specifies the URL at which the subscriber is listening for events. This URL corresponds to the Azure Function sample we deployed earlier.

2. Run the following command to create the subscription. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/eventSubscriptions/sampleSubscription1?api-version=2019-01-01
    ```

## Publish Event

1. Create event.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

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
    curl -k -H "Content-Type: application/json" -X POST -g -d @event.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/events?api-version=2019-01-01
    ```

## Verify Event Delivery

1. SSH or RDP into your IoT Edge VM.
1. Run the following command to check the logs on the subscriber to confirm delivery.

On Windows,

```sh
docker -H npipe:////./pipe/iotedge_moby_engine container logs subscriber
```

On Linux,

```sh
sudo docker logs subscriber
```

Sample Output: -

```json
 Received event data [
        {
          "data": {
            "make": "Ducati",
            "model": "Monster"
          }
        }
      ]
```

## Next steps

In this tutorial, you created an event grid topic, subscription, and published events. Now that you know the basic steps:

* Try publishing events with different schemas
* Try creating multiple subscriptions
* Try creating/updating subscription with filters
* Try creating/updating subscription with retry policy
