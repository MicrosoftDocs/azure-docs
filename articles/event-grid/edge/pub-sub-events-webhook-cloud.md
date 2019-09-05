---
title: Publish, subscribe to events in cloud - Azure Event Grid IoT Edge | Microsoft Docs 
description: Publish, subscribe to events in cloud using Webhook with Event Grid on IoT Edge
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/29/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Publish, subscribe to events in cloud

This article walks through all the steps needed to publish  and subscribe to events using Event Grid on IoT Edge.

Refer to [Event Grid Concepts](concepts.md) documentation to understand what an event grid topic, subscription is before proceeding.

## Prerequisites

In order to complete this tutorial, you will need an

**Azure Event Grid module on IoT Edge Device** - Follow the steps in described [here](deploy-event-grid-portal.md) on how to do that if not already done.

## Step 1: Create Azure Function in Cloud via portal

Follow the steps outlined in the [tutorial](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function) to create an Azure Function in cloud. 

Replace the code snippet like below:

```csharp
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);

    log.LogInformation($"C# HTTP trigger received {data}.");
    return data != null
        ? (ActionResult)new OkResult()
        : new BadRequestObjectResult("Please pass in the request body");
}
```

In your new function, click </> Get function URL at the top right, select default (Function key), and then click Copy. You will need to use the function URL value later in the tutorial.

> [!NOTE]
> Refer to [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/) documentation for more samples and tutorials on reacting to events and how to use EventGridEvent triggers instead of HTTP Triggers.

## Step 2: Create topic

As a publisher of an event, you need to create an event grid topic. Topic refers to an "endpoint" where publishers can then send events to.

1. Create topic2.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

    ```json
         {
          "name": "sampleTopic2",
          "properties": {
            "inputschema": "eventGridSchema"
          }
        }
    ```

1. Run the following command to create the topic. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic2.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2?api-version=2019-01-01-preview
    ```

1. Run the following command to verify topic was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2?api-version=2019-01-01-preview
    ```

   Sample output:

   ```json
        [
          {
            "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic2",
            "name": "sampleTopic2",
            "type": "Microsoft.EventGrid/topics",
            "properties": {
              "endpoint": "https://<edge-vm-ip>:4438/topics/sampleTopic2/events?api-version=2019-01-01-preview",
              "inputSchema": "EventGridSchema"
            }
          }
        ]
   ```

## Step 3: Create event subscription

   Subscribers can register for events published to a topic. In order to receive any event, they will need to create an Event grid subscription on a topic of interest.

1. Create subscription2.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "<your-az-func-cloud-url>"
              }
            }
          }
        }
    ```

   >[!NOTE]
   > The **endpointType** specifies that the subscriber is a Webhook.  The **endpointUrl** specifies the URL at which the subscriber is listening for events. This URL corresponds to the Azure Function sample you setup earlier.

2. Run the following command to create the subscription. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription2.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2/eventSubscriptions/sampleSubscription2?api-version=2019-01-01-preview
    ```

3. Run the following command to verify subscription was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2/eventSubscriptions/sampleSubscription2?api-version=2019-01-01-preview
    ```

    Sample output:

   ```json
        {
          "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic2/eventSubscriptions/sampleSubscription2",
          "type": "Microsoft.EventGrid/eventSubscriptions",
          "name": "sampleSubscription2",
          "properties": {
            "Topic": "sampleTopic2",
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "<your-az-func-cloud-url>"
              }
            }
          }
        }
    ```

## Step 4: Publish event

1. Create event2.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

    ```json
        [
          {
            "id": "eventId-func-1",
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
    curl -k -H "Content-Type: application/json" -X POST -g -d @event2.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2/events?api-version=2019-01-01-preview
    ```

## Step 5: Verify event delivery

You can view the event delivered in the Azure portal under the **Monitor** option of your function.

## Cleanup resources

* Run the following command to delete the topic and all its subscriptions

    ```sh
    curl -k -H "Content-Type: application/json" -X DELETE https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2?api-version=2019-01-01-preview
    ```

* Delete the Azure Function created in the cloud.

## Next steps

In this tutorial, you created an event grid topic, subscription, and published events. Now that you know the basic steps:

* Create/update subscription with filters
* Set up persistence of Event Grid module on [linux](persist-state-linux.md) or [Windows](persist-state-windows.md)
* Follow [documentation](configure-client-auth.md) to configure client authentication
* Forward events to Azure Event Grid in the cloud by following this [tutorial](forward-events-event-grid-cloud.md)
