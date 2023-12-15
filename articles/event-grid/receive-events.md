---
title: Receive events from Azure Event Grid to an HTTP endpoint
description: Describes how to validate an HTTP endpoint, then receive and deserialize Events from Azure Event Grid
ms.topic: conceptual
ms.date: 11/14/2022
ms.devlang: csharp, javascript
ms.custom: devx-track-csharp
---

# Receive events to an HTTP endpoint

This article describes how to [validate an HTTP endpoint](webhook-event-delivery.md) to receive events from an Event Subscription and then receive and deserialize events. This article uses an Azure Function for demonstration purposes, however the same concepts apply regardless of where the application is hosted.

> [!NOTE]
> It is recommended that you use an [Event Grid Trigger](../azure-functions/functions-bindings-event-grid.md) when triggering an Azure Function with Event Grid. It provides an easier and quicker integration between Event Grid and Azure Functions. However, please note that Azure Functions' Event Grid trigger does not support the scenario where the hosted code needs to control the HTTP status code returned to Event Grid. Given this limitation, your code running on an Azure Function would not be able to return a 5XX error to initiate an event delivery retry by Event Grid, for example.

## Prerequisites

You need a function app with an HTTP triggered function.

## Add dependencies

If you're developing in .NET, [add a dependency](../azure-functions/functions-reference-csharp.md#referencing-custom-assemblies) to your function for the `Azure.Messaging.EventGrid` [NuGet package](https://www.nuget.org/packages/Azure.Messaging.EventGrid).

SDKs for other languages are available via the [Publish SDKs](./sdk-overview.md#data-plane-sdks) reference. These packages have the models for native event types such as `EventGridEvent`, `StorageBlobCreatedEventData`, and `EventHubCaptureFileCreatedEventData`.

## Endpoint validation

The first thing you want to do is handle `Microsoft.EventGrid.SubscriptionValidationEvent` events. Every time someone subscribes to an event, Event Grid sends a validation event to the endpoint with a `validationCode` in the data payload. The endpoint is required to echo this back in the response body to [prove the endpoint is valid and owned by you](webhook-event-delivery.md). If you're using an [Event Grid Trigger](../azure-functions/functions-bindings-event-grid.md) rather than a WebHook triggered Function, endpoint validation is handled for you. If you use a third-party API service (like [Zapier](https://zapier.com/) or [IFTTT](https://ifttt.com/)), you might not be able to programmatically echo the validation code. For those services, you can manually validate the subscription by using a validation URL that is sent in the subscription validation event. Copy that URL in the `validationUrl` property and send a GET request either through a REST client or your web browser.

In C#, the `ParseMany()` method is used to deserialize a `BinaryData` instance containing 1 or more events into an array of `EventGridEvent`. If you knew ahead of time that you are deserializing only a single event, you could use the `Parse` method instead.

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

When you select Run, the Output should be 200 OK and `{"validationResponse":"512d38b6-c7b8-40c8-89fe-f46f9e9622b6"}` in the body:

:::image type="content" source="./media/receive-events/validation-request.png" alt-text="Validation request":::

:::image type="content" source="./media/receive-events/validation-output.png" alt-text="Validation output":::

## Handle Blob storage events

Now, let's extend the function to handle the `Microsoft.Storage.BlobCreated` system event:

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
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "api": "PutBlockList",
    "clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760",
    "requestId": "831e1650-001e-001b-66ab-eeb76e000000",
    "eTag": "0x8D4BCC2E4835CD0",
    "contentType": "text/plain",
    "contentLength": 524288,
    "blobType": "BlockBlob",
    "url": "https://example.blob.core.windows.net/testcontainer/testfile.txt",
    "sequencer": "00000000000004420000000000028963",
    "storageDiagnostics": {
      "batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"
    }
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

You should see the blob URL output in the function log:

```
2022-11-14T22:40:45.978 [Information] Executing 'Function1' (Reason='This function was programmatically called via the host APIs.', Id=8429137d-9245-438c-8206-f9e85ef5dd61)
2022-11-14T22:40:46.012 [Information] C# HTTP trigger function processed a request.
2022-11-14T22:40:46.017 [Information] Received events: [{"topic": "/subscriptions/{subscription-id}/resourceGroups/Storage/providers/Microsoft.Storage/storageAccounts/xstoretestaccount","subject": "/blobServices/default/containers/testcontainer/blobs/testfile.txt","eventType": "Microsoft.Storage.BlobCreated","eventTime": "2017-06-26T18:41:00.9584103Z","id": "831e1650-001e-001b-66ab-eeb76e069631","data": {"api": "PutBlockList","clientRequestId": "6d79dbfb-0e37-4fc4-981f-442c9ca65760","requestId": "831e1650-001e-001b-66ab-eeb76e000000","eTag": "0x8D4BCC2E4835CD0","contentType": "text/plain","contentLength": 524288,"blobType": "BlockBlob","url": "https://example.blob.core.windows.net/testcontainer/testfile.txt","sequencer": "00000000000004420000000000028963","storageDiagnostics": {"batchId": "b68529f3-68cd-4744-baa4-3c0498ec19f0"}},"dataVersion": "","metadataVersion": "1"}]
2022-11-14T22:40:46.335 [Information] Got BlobCreated event data, blob URI https://example.blob.core.windows.net/testcontainer/testfile.txt
2022-11-14T22:40:46.346 [Information] Executed 'Function1' (Succeeded, Id=8429137d-9245-438c-8206-f9e85ef5dd61, Duration=387ms)
```

You can also test by creating a Blob storage account or General Purpose V2 (GPv2) Storage account, [adding an event subscription](../storage/blobs/storage-blob-event-quickstart.md), and setting the endpoint to the function URL:

![Function URL](./media/receive-events/function-url.png)

## Handle Custom events

Finally, lets extend the function once more so that it can also handle custom events. 

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

Finally, test that your function can now handle your custom event type:

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

You can also test this functionality live by [sending a custom event with CURL from the Portal](./custom-event-quickstart-portal.md) or by [posting to a custom topic](./post-to-custom-topic.md)  using any service or application that can POST to an endpoint such as [Postman](https://www.getpostman.com/). Create a custom topic and an event subscription with the endpoint set as the Function URL.

[!INCLUDE [message-headers](./includes/message-headers.md)]

## Next steps

* Explore the [Azure Event Grid Management and Publish SDKs](./sdk-overview.md)
* Learn how to [post to a custom topic](./post-to-custom-topic.md)
* Try one of the in-depth Event Grid and Functions tutorials such as [resizing images uploaded to Blob storage](resize-images-on-storage-blob-upload-event.md)
