---
title: WebHook event delivery
description: This article describes WebHook event delivery and endpoint validation when using webhooks. 
services: event-grid
author: femila
manager: timlt

ms.service: event-grid
ms.topic: conceptual
ms.date: 03/06/2020
ms.author: femila
---


# Webhook Event delivery
Webhooks are one of the many ways to receive events from Azure Event Grid. When a new event is ready, Event Grid service POSTs an HTTP request to the configured endpoint with the event in the request body.

Like many other services that support webhooks, Event Grid requires you to prove ownership of your Webhook endpoint before it starts delivering events to that endpoint. This requirement prevents a malicious user from flooding your endpoint with events. When you use any of the three Azure services listed below, the Azure infrastructure automatically handles this validation:

- Azure Logic Apps with [Event Grid Connector](https://docs.microsoft.com/connectors/azureeventgrid/)
- Azure Automation via [webhook](../event-grid/ensure-tags-exists-on-new-virtual-machines.md)
- Azure Functions with [Event Grid Trigger](../azure-functions/functions-bindings-event-grid.md)

## Endpoint validation with Event Grid events
If you're using any other type of endpoint, such as an HTTP trigger based Azure function, your endpoint code needs to participate in a validation handshake with Event Grid. Event Grid supports two ways of validating the subscription.

1. **Synchronous handshake**: At the time of event subscription creation, Event Grid sends a subscription validation event to your endpoint. The schema of this event is similar to any other Event Grid event. The data portion of this event includes a `validationCode` property. Your application verifies that the validation request is for an expected event subscription, and returns the validation code in the response synchronously. This handshake mechanism is supported in all Event Grid versions.

2. **Asynchronous handshake**: In certain cases, you can't return the ValidationCode in response synchronously. For example, if you use a third-party service (like [`Zapier`](https://zapier.com) or [IFTTT](https://ifttt.com/)), you can't programmatically respond with the validation code.

   Starting with version 2018-05-01-preview, Event Grid supports a manual validation handshake. If you're creating an event subscription with an SDK or tool that uses API version 2018-05-01-preview or later, Event Grid sends a `validationUrl` property in the data portion of the subscription validation event. To complete the handshake, find that URL in the event data and do a GET request to it. You can use either a REST client or your web browser.

   The provided URL is valid for **5 minutes**. During that time, the provisioning state of the event subscription is `AwaitingManualAction`. If you don't complete the manual validation within 5 minutes, the provisioning state is set to `Failed`. You'll have to create the event subscription again before starting the manual validation.

   This authentication mechanism also requires the webhook endpoint to return an HTTP status code of 200 so that it knows that the POST for the validation event was accepted before it can be put in the manual validation mode. In other words, if the endpoint returns 200 but doesn't return back a validation response synchronously, the mode is transitioned to the manual validation mode. If there's a GET on the validation URL within 5 minutes, the validation handshake is considered to be successful.

> [!NOTE]
> Using self-signed certificates for validation isn't supported. Use a signed certificate from a commercial certificate authority (CA) instead.

### Validation details

- At the time of event subscription creation/update, Event Grid posts a subscription validation event to the target endpoint.
- The event contains a header value "aeg-event-type: SubscriptionValidation".
- The event body has the same schema as other Event Grid events.
- The eventType property of the event is `Microsoft.EventGrid.SubscriptionValidationEvent`.
- The data property of the event includes a `validationCode` property with a randomly generated string. For example, "validationCode: acb13…".
- The event data also includes a `validationUrl` property with a URL for manually validating the subscription.
- The array contains only the validation event. Other events are sent in a separate request after you echo back the validation code.
- The EventGrid DataPlane SDKs have classes corresponding to the subscription validation event data and subscription validation response.

An example SubscriptionValidationEvent is shown in the following example:

```json
[
  {
    "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
    "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "subject": "",
    "data": {
      "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6",
      "validationUrl": "https://rp-eastus2.eventgrid.azure.net:553/eventsubscriptions/estest/validate?id=512d38b6-c7b8-40c8-89fe-f46f9e9622b6&t=2018-04-26T20:30:54.4538837Z&apiVersion=2018-05-01-preview&token=1A1A1A1A"
    },
    "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
    "eventTime": "2018-01-25T22:12:19.4556811Z",
    "metadataVersion": "1",
    "dataVersion": "1"
  }
]
```

To prove endpoint ownership, echo back the validation code in the validationResponse property, as shown in the following example:

```json
{
  "validationResponse": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
}
```

You must return an HTTP 200 OK response status code. HTTP 202 Accepted is not recognized as a valid Event Grid subscription validation response. The http request must complete within 30 seconds. If the operation doesn't finish within 30 seconds, then the operation will be canceled and it may be reattempted after 5 seconds. If all the attempts fail, then it will be treated as validation handshake error.

Or, you can manually validate the subscription by sending a GET request to the validation URL. The event subscription stays in a pending state until validated. The validation Url uses port 553. If your firewall rules block port 553 then rules may need to be updated for successful manual handshake.

For an example of handling the subscription validation handshake, see a [C# sample](https://github.com/Azure-Samples/event-grid-dotnet-publish-consume-events/blob/master/EventGridConsumer/EventGridConsumer/Function1.cs).

## Endpoint validation with CloudEvents v1.0
If you are already familiar with Event Grid, you may be aware of Event Grid's endpoint validation handshake for preventing abuse. CloudEvents v1.0 implements its own [abuse protection semantics](webhook-event-delivery.md) using the HTTP OPTIONS method. You can read more about it [here](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection). When using the CloudEvents schema for output, Event Grid uses with the CloudEvents v1.0 abuse protection in place of the Event Grid validation event mechanism.

## Next steps
See the following article to learn how to troubleshoot event subscription validations: 

[Troubleshoot event subscription validations](troubleshoot-subscription-validation.md)
