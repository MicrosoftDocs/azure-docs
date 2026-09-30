---
title: "Receive Azure Event Grid Events to an HTTP Endpoint"
description: "Azure Event Grid HTTP endpoint events - validate your endpoint, then receive and deserialize events using C# or JavaScript. Follow this step-by-step guide to get started."
#customer intent: As a developer, I want to set up an HTTP endpoint to receive events from Azure Event Grid so that my application can react to events in real time.
ms.topic: how-to
ms.date: 03/27/2026
author: spelluru
ms.author: spelluru
ms.reviewer: spelluru
ms.devlang: csharp
# ms.devlang: csharp, javascript
ms.custom: devx-track-csharp
# Customer intent: As a developer, I want to learn how to receive events from Azure Event Grid to an HTTP endpoint. 
---

# Receive Azure Event Grid events to an HTTP endpoint

This article describes how to set up an HTTP endpoint to receive events from Azure Event Grid. You learn how to validate your endpoint, receive events, and deserialize them using C# or JavaScript. The article uses an Azure Function for demonstration purposes, but the same concepts apply to any hosted application.

The article covers the following tasks:

- Validate an HTTP endpoint to receive events from an event subscription
- Handle subscription validation events
- Process Azure Blob Storage events
- Handle custom events

> [!NOTE]
> We recommend that you use an [Event Grid Trigger](../azure-functions/functions-bindings-event-grid.md) to trigger an Azure Function with Event Grid. It provides an easier and quicker integration between Event Grid and Azure Functions. However, Azure Functions' Event Grid trigger doesn't support the scenario where the hosted code needs to control the HTTP status code returned to Event Grid. Given this limitation, your code running on an Azure Function can't return a 5XX error to initiate an event delivery retry by Event Grid, for example.

## Prerequisites

- You need a function app with an HTTP triggered function.

## Add dependencies

If you're developing in .NET, [add a dependency](../azure-functions/functions-reference-csharp.md#referencing-custom-assemblies) to your function for the `Azure.Messaging.EventGrid` [NuGet package](https://www.nuget.org/packages/Azure.Messaging.EventGrid).

Software Development Kits (SDKs for other languages are available via the [Publishing SDKs](./sdk-overview.md#data-plane-sdks) reference. These packages have the models for native event types such as `EventGridEvent`, `StorageBlobCreatedEventData`, and `EventHubCaptureFileCreatedEventData`.

## Endpoint validation

First, handle `Microsoft.EventGrid.SubscriptionValidationEvent` events. Every time someone subscribes to an event, Event Grid sends a validation event to the endpoint with a `validationCode` in the data payload. The endpoint must echo this code back in the response body to [prove the endpoint is valid and owned by you](end-point-validation-cloud-events-schema.md). If you use an [Event Grid Trigger](../azure-functions/functions-bindings-event-grid.md) rather than a WebHook triggered Function, the trigger handles endpoint validation for you. If you use a third-party API service (like [Zapier](https://zapier.com/) or [IFTTT](https://ifttt.com/)), you might not be able to programmatically echo the validation code. For those services, you can manually validate the subscription by using a validation URL that is sent in the subscription validation event. Copy that URL in the `validationUrl` property and send a GET request either through a REST client or your web browser.

In C#, use the `ParseMany()` method to deserialize a `BinaryData` instance containing one or more events into an array of `EventGridEvent`. If you know ahead of time that you're deserializing only a single event, you can use the `Parse` method instead.

To programmatically echo the validation code, use the following code.

```c#
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using Azure.Messaging.EventGrid;
using Azure.Messaging.EventGrid.SystemEvents;

namespace Function1
{
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            string response = string.Empty;
            BinaryData events = await BinaryData.FromStreamAsync(req.Body);
            log.LogInformation($"Received events: {events}");

            EventGridEvent[] eventGridEvents = EventGridEvent.ParseMany(events);

            foreach (EventGridEvent eventGridEvent in eventGridEvents)
            {
                // Handle system events
                if (eventGridEvent.TryGetSystemEventData(out object eventData))
                {
                    // Handle the subscription validation event
                    if (eventData is SubscriptionValidationEventData subscriptionValidationEventData)
                    {
                        log.LogInformation($"Got SubscriptionValidation event data, validation code: {subscriptionValidationEventData.ValidationCode}, topic: {eventGridEvent.Topic}");
                        // Do any additional validation (as required) and then return back the below response
                        var responseData = new
                        {
                            ValidationResponse = subscriptionValidationEventData.ValidationCode
                        };

                        return new OkObjectResult(responseData);
                    }
                }
            }
            return new OkObjectResult(response);
        }
    }
}
```

```javascript
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function begun');
    var validationEventType = "Microsoft.EventGrid.SubscriptionValidationEvent";

    for (var events in req.body) {
        var body = req.body[events];
        // Deserialize the event data into the appropriate type based on event type
        if (body.data && body.eventType == validationEventType) {
            context.log("Got SubscriptionValidation event data, validation code: " + body.data.validationCode + " topic: " + body.topic);

            // Do any additional validation (as required) and then return back the below response
            var code = body.data.validationCode;
            context.res = { status: 200, body: { "ValidationResponse": code } };
        }
    }
    context.done();
};
```

### Test validation response

Test the validation response function by pasting the sample event into the test field for the function:

```json
[{
  "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
  "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "subject": "",
  "data": {
    "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
  },
  "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
  "eventTime": "2018-01-25T22:12:19.4556811Z",
  "metadataVersion": "1",
  "dataVersion": "1"
}]
```

When you select **Run**, the **Output** shows `200 OK` and `{"validationResponse":"512d38b6-c7b8-40c8-89fe-f46f9e9622b6"}` in the body:

:::image type="content" source="./media/receive-events/validation-request.png" alt-text="Screenshot of the Event Grid validation request JSON in the Azure Function test field.":::

:::image type="content" source="./media/receive-events/validation-output.png" alt-text="Screenshot of the Event Grid subscription validation output showing a 200 OK response.":::

## Handle Blob storage events

Now, extend the function to handle the `Microsoft.Storage.BlobCreated` system event:

```c#
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using Azure.Messaging.EventGrid;
using Azure.Messaging.EventGrid.SystemEvents;

namespace Function1
{
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            string response = string.Empty;
            BinaryData events = await BinaryData.FromStreamAsync(req.Body);
            log.LogInformation($"Received events: {events}");

            EventGridEvent[] eventGridEvents = EventGridEvent.ParseMany(events);

            foreach (EventGridEvent eventGridEvent in eventGridEvents)
            {
                // Handle system events
                if (eventGridEvent.TryGetSystemEventData(out object eventData))
                {
                    // Handle the subscription validation event
                    if (eventData is SubscriptionValidationEventData subscriptionValidationEventData)
                    {
                        log.LogInformation($"Got SubscriptionValidation event data, validation code: {subscriptionValidationEventData.ValidationCode}, topic: {eventGridEvent.Topic}");
                        // Do any additional validation (as required) and then return back the below response

                        var responseData = new
                        {
                            ValidationResponse = subscriptionValidationEventData.ValidationCode
                        };
                        return new OkObjectResult(responseData);
                    }
                    // Handle the storage blob created event
                    else if (eventData is StorageBlobCreatedEventData storageBlobCreatedEventData)
                    {
                        log.LogInformation($"Got BlobCreated event data, blob URI {storageBlobCreatedEventData.Url}");
                    }
                }
            }
            return new OkObjectResult(response);
        }
    }
}
```

```javascript
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function begun');
    var validationEventType = "Microsoft.EventGrid.SubscriptionValidationEvent";
    var storageBlobCreatedEvent = "Microsoft.Storage.BlobCreated";

    for (var events in req.body) {
        var body = req.body[events];
        // Deserialize the event data into the appropriate type based on event type  
        if (body.data && body.eventType == validationEventType) {
            context.log("Got SubscriptionValidation event data, validation code: " + body.data.validationCode + " topic: " + body.topic);

            // Do any additional validation (as required) and then return back the below response
            var code = body.data.validationCode;
            context.res = { status: 200, body: { "ValidationResponse": code } };
        }

        else if (body.data && body.eventType == storageBlobCreatedEvent) {
            var blobCreatedEventData = body.data;
            context.log("Relaying received blob created event payload:" + JSON.stringify(blobCreatedEventData));
        }
    }
    context.done();
};

```

### Test Blob Created event handling

Test the new functionality of the function by putting a [Blob storage event](./event-schema-blob-storage.md#example-events) into the test field and running:

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/xstoretestaccount",
  "subject": "/blobServices/default/containers/testcontainer/blobs/testfile.txt",
  "eventType": "Microsoft.Storage.BlobCreated",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
  "data": {
    "api": "PutBlockList",
    "clientRequestId": "bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f",
    "requestId": "cccc2c2c-dd3d-ee4e-ff5f-aaaaaa6a6a6a",
    "eTag": "0x8D4BCC2E4835CD0",
    "contentType": "text/plain",
    "contentLength": 524288,
    "blobType": "BlockBlob",
    "url": "https://example.blob.core.windows.net/testcontainer/testfile.txt",
    "sequencer": "00000000000004420000000000028963",
    "storageDiagnostics": {
      "batchId": "dddd3d3d-ee4e-ff5f-aa6a-bbbbbb7b7b7b"
    }
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

You see the blob URL output in the function log:

```bash
2022-11-14T22:40:45.978 [Information] Executing 'Function1' (Reason='This function was programmatically called via the host APIs.', Id=8429137d-9245-438c-8206-f9e85ef5dd61)
2022-11-14T22:40:46.012 [Information] C# HTTP trigger function processed a request.
2022-11-14T22:40:46.017 [Information] Received events: [{"topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/xstoretestaccount","subject": "/blobServices/default/containers/testcontainer/blobs/testfile.txt","eventType": "Microsoft.Storage.BlobCreated","eventTime": "2017-06-26T18:41:00.9584103Z","id": "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e","data": {"api": "PutBlockList","clientRequestId": "bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f","requestId": "cccc2c2c-dd3d-ee4e-ff5f-aaaaaa6a6a6a","eTag": "0x8D4BCC2E4835CD0","contentType": "text/plain","contentLength": 524288,"blobType": "BlockBlob","url": "https://example.blob.core.windows.net/testcontainer/testfile.txt","sequencer": "00000000000004420000000000028963","storageDiagnostics": {"batchId": "dddd3d3d-ee4e-ff5f-aa6a-bbbbbb7b7b7b"}},"dataVersion": "","metadataVersion": "1"}]
2022-11-14T22:40:46.335 [Information] Got BlobCreated event data, blob URI https://example.blob.core.windows.net/testcontainer/testfile.txt
2022-11-14T22:40:46.346 [Information] Executed 'Function1' (Succeeded, Id=8429137d-9245-438c-8206-f9e85ef5dd61, Duration=387ms)
```

You can also test by creating a Blob storage account or General Purpose V2 Storage account, [adding an event subscription](../storage/blobs/storage-blob-event-quickstart.md), and setting the endpoint to the function URL:

:::image type="content" source="./media/receive-events/function-url.png" alt-text="Screenshot of the Azure Function URL used as the Event Grid event subscription endpoint in the Azure portal.":::

## Handle custom events

Finally, extend the function so that it can also handle custom events. 

Add a check for your event `Contoso.Items.ItemReceived`. Your final code should look like:

```c#
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using Azure.Messaging.EventGrid;
using Azure.Messaging.EventGrid.SystemEvents;

namespace Function1
{
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            string response = string.Empty;
            BinaryData events = await BinaryData.FromStreamAsync(req.Body);
            log.LogInformation($"Received events: {events}");

            EventGridEvent[] eventGridEvents = EventGridEvent.ParseMany(events);

            foreach (EventGridEvent eventGridEvent in eventGridEvents)
            {
                // Handle system events
                if (eventGridEvent.TryGetSystemEventData(out object eventData))
                {
                    // Handle the subscription validation event
                    if (eventData is SubscriptionValidationEventData subscriptionValidationEventData)
                    {
                        log.LogInformation($"Got SubscriptionValidation event data, validation code: {subscriptionValidationEventData.ValidationCode}, topic: {eventGridEvent.Topic}");
                        // Do any additional validation (as required) and then return back the below response

                        var responseData = new
                        {
                            ValidationResponse = subscriptionValidationEventData.ValidationCode
                        };
                        return new OkObjectResult(responseData);
                    }
                    // Handle the storage blob created event
                    else if (eventData is StorageBlobCreatedEventData storageBlobCreatedEventData)
                    {
                        log.LogInformation($"Got BlobCreated event data, blob URI {storageBlobCreatedEventData.Url}");
                    }
                }
                // Handle the custom contoso event
                else if (eventGridEvent.EventType == "Contoso.Items.ItemReceived")
                {
                    var contosoEventData = eventGridEvent.Data.ToObjectFromJson<ContosoItemReceivedEventData>();
                    log.LogInformation($"Got ContosoItemReceived event data, item SKU {contosoEventData.ItemSku}");
                }
            }
            return new OkObjectResult(response);
        }
    }
}
```

```javascript
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function begun');
    var validationEventType = "Microsoft.EventGrid.SubscriptionValidationEvent";
    var storageBlobCreatedEvent = "Microsoft.Storage.BlobCreated";
    var customEventType = "Contoso.Items.ItemReceived";

    for (var events in req.body) {
        var body = req.body[events];
        // Deserialize the event data into the appropriate type based on event type
        if (body.data && body.eventType == validationEventType) {
            context.log("Got SubscriptionValidation event data, validation code: " + body.data.validationCode + " topic: " + body.topic);

            // Do any additional validation (as required) and then return back the below response
            var code = body.data.validationCode;
            context.res = { status: 200, body: { "ValidationResponse": code } };
        }

        else if (body.data && body.eventType == storageBlobCreatedEvent) {
            var blobCreatedEventData = body.data;
            context.log("Relaying received blob created event payload:" + JSON.stringify(blobCreatedEventData));
        }

        else if (body.data && body.eventType == customEventType) {
            var payload = body.data;
            context.log("Relaying received custom payload:" + JSON.stringify(payload));
        }
    }
    context.done();
};
```

### Test custom event handling

Finally, test that your function can now handle your custom event type.

```json
[{
    "subject": "Contoso/foo/bar/items",
    "eventType": "Contoso.Items.ItemReceived",
    "eventTime": "2017-08-16T01:57:26.005121Z",
    "id": "602a88ef-0001-00e6-1233-1646070610ea",
    "data": { 
            "itemSku": "Standard"
            },
    "dataVersion": "",
    "metadataVersion": "1"
}]
```

You can also test this functionality live by [sending a custom event with CURL from the Portal](./custom-event-quickstart-portal.md) or by [posting to a custom topic](./post-to-custom-topic.md) using any service or application that can POST to an endpoint. Create a custom topic and an event subscription with the endpoint set as the Function URL.

[!INCLUDE [message-headers](./includes/message-headers.md)]

## Related content

* Explore the [Azure Event Grid Management and Publish SDKs](./sdk-overview.md)
* Learn how to [post to a custom topic](./post-to-custom-topic.md)
