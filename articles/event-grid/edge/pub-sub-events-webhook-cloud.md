---
title: Publish, subscribe to events in cloud - Azure Event Grid IoT Edge | Microsoft Docs 
description: Publish, subscribe to events in cloud using Webhook with Event Grid on IoT Edge
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/29/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Publish, subscribe to events in cloud

This article walks through all the steps needed to publish and subscribe to events using Event Grid on IoT Edge. This tutorial uses and Azure Function as the Event Handler. For additional destination types, see [event handlers](event-handlers.md).

See [Event Grid Concepts](concepts.md) to understand what an event grid topic and subscription are before proceeding.

## Prerequisites 
In order to complete this tutorial, you will need:

* **Azure subscription** - Create a [free account](https://azure.microsoft.com/free) if you don't already have one. 
* **Azure IoT Hub and IoT Edge device** - Follow the steps in the quick start for [Linux](../../iot-edge/quickstart-linux.md) or [Windows devices](../../iot-edge/quickstart.md) if you don't already have one.

[!INCLUDE [event-grid-deploy-iot-edge](../../../includes/event-grid-deploy-iot-edge.md)]

## Create an Azure function in the Azure portal

Follow the steps outlined in the [tutorial](../../azure-functions/functions-create-first-azure-function.md) to create an Azure function. 

Replace the code snippet with the following code:

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

In your new function, select **Get function URL** at the top right, select default (**Function key**), and then select **Copy**. You will use the function URL value later in the tutorial.

> [!NOTE]
> Refer to the [Azure Functions](../../azure-functions/functions-overview.md) documentation for more samples and tutorials on reacting to events an using EventGrid event triggers.

## Create a topic

As a publisher of an event, you need to create an event grid topic. Topic refers to an end point where publishers can send events to.

1. Create topic2.json with the following content. See our [API documentation](api.md) for details about the payload.

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

## Create an event subscription

Subscribers can register for events published to a topic. To receive any event, the subscribers will need to create an Event grid subscription on a topic of interest.

[!INCLUDE [event-grid-deploy-iot-edge](../../../includes/event-grid-edge-persist-event-subscriptions.md)]

1. Create subscription2.json with the following content. Refer to our [API documentation](api.md) for details about the payload.

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

## Publish an event

1. Create event2.json with the following content. Refer to our [API documentation](api.md) for details about the payload.

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

## Verify event delivery

You can view the event delivered in the Azure portal under the **Monitor** option of your function.

## Cleanup resources

* Run the following command to delete the topic and all its subscriptions

    ```sh
    curl -k -H "Content-Type: application/json" -X DELETE https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic2?api-version=2019-01-01-preview
    ```

* Delete the Azure function created in the Azure portal.

## Next steps

In this tutorial, you created an event grid topic, subscription, and published events. Now that you know the basic steps, see the following articles:

* To troubleshoot issues with using Azure Event Grid on IoT Edge, see [Troubleshooting guide](troubleshoot.md).
* Create/update subscription with [filters](advanced-filtering.md).
* Set up persistence of Event Grid module on [linux](persist-state-linux.md) or [Windows](persist-state-windows.md)
* Follow [documentation](configure-client-auth.md) to configure client authentication
* Forward events to Azure Event Grid in the cloud by following this [tutorial](forward-events-event-grid-cloud.md)
* [Monitor topics and subscriptions on the edge](monitor-topics-subscriptions.md)
