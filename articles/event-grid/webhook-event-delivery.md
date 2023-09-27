---
title: WebHook event delivery
description: This article describes WebHook event delivery and endpoint validation when using webhooks. 
ms.topic: conceptual
ms.date: 09/25/2023
---


# Webhook event delivery
Webhooks are one of the many ways to receive events from Azure Event Grid. When a new event is ready, Event Grid service POSTs an HTTP request to the configured endpoint with the event information in the request body.

Like many other services that support webhooks, Event Grid requires you to prove ownership of your Webhook endpoint before it starts delivering events to that endpoint. This requirement prevents a malicious user from flooding your endpoint with events. 

## Endpoint validation with Event Grid events
When you use any of the following three Azure services, the Azure infrastructure automatically handles this validation:

- Azure Logic Apps with [Event Grid Connector](/connectors/azureeventgrid/)
- Azure Automation via [webhook](../event-grid/ensure-tags-exists-on-new-virtual-machines.md)
- Azure Functions with [Event Grid Trigger](../azure-functions/functions-bindings-event-grid.md)

If you're using any other type of endpoint, such as an HTTP trigger based Azure function, your endpoint code needs to participate in a validation handshake with Event Grid. Event Grid supports two ways of validating the subscription.

- **Synchronous handshake**: At the time of event subscription creation, Event Grid sends a subscription validation event to your endpoint. The schema of this event is similar to any other Event Grid event. The data portion of this event includes a `validationCode` property. Your application verifies that the validation request is for an expected event subscription, and returns the validation code in the response synchronously. This handshake mechanism is supported in all Event Grid versions.

- **Asynchronous handshake**: In certain cases, you can't return the `validationCode` in response synchronously. For example, if you use a third-party service (like [`Zapier`](https://zapier.com) or [IFTTT](https://ifttt.com/)), you can't programmatically respond with the validation code.

   Event Grid supports a manual validation handshake. If you're creating an event subscription with an SDK or tool that uses API version 2018-05-01-preview or later, Event Grid sends a `validationUrl` property in the data portion of the subscription validation event. To complete the handshake, find that URL in the event data and do a GET request to it. You can use either a REST client or your web browser.

   The provided URL is valid for **5 minutes**. During that time, the provisioning state of the event subscription is `AwaitingManualAction`. If you don't complete the manual validation within 5 minutes, the provisioning state is set to `Failed`. You have to create the event subscription again before starting the manual validation.

   This authentication mechanism also requires the webhook endpoint to return an HTTP status code of 200 so that it knows that the POST for the validation event was accepted before it can be put in the manual validation mode. In other words, if the endpoint returns 200 but doesn't return back a validation response synchronously, the mode is transitioned to the manual validation mode. If there's a GET on the validation URL within 5 minutes, the validation handshake is considered to be successful.

> [!NOTE]
> Using self-signed certificates for validation isn't supported. Use a signed certificate from a commercial certificate authority (CA) instead.

### Validation details

- At the time of event subscription creation/update, Event Grid posts a subscription validation event to the target endpoint.
- The event contains a header value `aeg-event-type: SubscriptionValidation`.
- The event body has the same schema as other Event Grid events.
- The `eventType` property of the event is `Microsoft.EventGrid.SubscriptionValidationEvent`.
- The `data` property of the event includes a `validationCode` property with a randomly generated string. For example, `validationCode: acb13…`.
- The event data also includes a `validationUrl` property with a URL for manually validating the subscription.
- The array contains only the validation event. Other events are sent in a separate request after you echo back the validation code.
- The EventGrid data plane SDKs have classes corresponding to the subscription validation event data and subscription validation response.

An example SubscriptionValidationEvent is shown in the following example:

```json
[
  {
    "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
    "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "subject": "",
    "data": {
      "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6",
      "validationUrl": "https://rp-eastus2.eventgrid.azure.net:553/eventsubscriptions/myeventsub/validate?id=0000000000-0000-0000-0000-00000000000000&t=2022-10-28T04:23:35.1981776Z&apiVersion=2018-05-01-preview&token=1A1A1A1A"
    },
    "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
    "eventTime": "2022-10-28T04:23:35.1981776Z",
    "metadataVersion": "1",
    "dataVersion": "1"
  }
]
```

To prove endpoint ownership, echo back the validation code in the `validationResponse` property, as shown in the following example:

```json
{
  "validationResponse": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
}
```

And, follow one of these steps: 

- You must return an **HTTP 200 OK** response status code. **HTTP 202 Accepted** isn't recognized as a valid Event Grid subscription validation response. The HTTP request must complete within 30 seconds. If the operation doesn't finish within 30 seconds, then the operation will be canceled and it may be reattempted after 5 seconds. If all the attempts fail, then it's treated as validation handshake error.

    The fact that your application is prepared to handle and return the validation code indicates that you created the event subscription and expected to receive the event. Imagine the scenario that there's no handshake validation supported and a hacker gets to know your application URL. The hacker can create a topic and an event subscription with your application's URL, and start conducting a DoS attack to your application by sending a lot of events. The handshake validation prevents that to happen. 

    Imagine that you already have the validation implemented in your app because you created your own event subscriptions. Even if a hacker creates an event subscription with your app URL, your correct implementation of the validation request event checks for the `aeg-subscription-name` header in the request to ascertain that it's an event subscription that you recognize. 
    
    Even after that correct handshake implementation, a hacker can flood your app (it already validated the event subscription) by replicating a request that seems to be coming from Event Grid. To prevent that, you must secure your webhook with AAD authentication. For more information, see [Deliver events to Azure Active Directory protected endpoints](secure-webhook-delivery.md). 
- Or, you can manually validate the subscription by sending a GET request to the validation URL. The event subscription stays in a pending state until validated. The validation Url uses **port 553**. If your firewall rules block port 553, you need to update rules for a successful manual handshake.

    In your validation of the subscription validation event, if you identify that it isn't an event subscription for which you're expecting events, you wouldn't return a 200 response or no response at all. Hence, the validation fails.    

For an example of handling the subscription validation handshake, see a [C# sample](https://github.com/Azure-Samples/event-grid-dotnet-publish-consume-events/blob/master/EventGridConsumer/EventGridConsumer/Function1.cs).

## Endpoint validation with CloudEvents v1.0
CloudEvents v1.0 implements its own abuse protection semantics using the **HTTP OPTIONS** method. You can read more about it [here](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection). When you use the CloudEvents schema for output, Event Grid uses the CloudEvents v1.0 abuse protection in place of the Event Grid validation event mechanism.

## Event schema compatibility
When a topic is created, an incoming event schema is defined. And, when a subscription is created, an outgoing event schema is defined. The following table shows you the compatibility allowed when creating a subscription. 

| Incoming event schema | Outgoing event schema | Supported |
| ---- | ---- | ---- |
| Event Grid schema | Event Grid schema | Yes |
| | Cloud Events v1.0 schema | Yes |
| | Custom input schema | No |
| Cloud Events v1.0 schema | Event Grid schema | No |
| | Cloud Events v1.0 schema | Yes |
| | Custom input schema | No |
| Custom input schema | Event Grid schema | Yes |
| | Cloud Events v1.0 schema | Yes |
| | Custom input schema | Yes |

## Next steps
See the following article to learn how to troubleshoot event subscription validations: [Troubleshoot event subscription validations](troubleshoot-subscription-validation.md).
