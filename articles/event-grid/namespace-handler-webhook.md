---
title: Webhooks as event handler for namespace topics' push delivery
description: Describes how you can use webhooks as event handlers for Azure Event Grid namespace topics'push delivery.
ms.topic: conceptual
ms.custom:
  - build-2024
ms.date: 05/21/2024
ms.author: robece
---

# Webhook event handler for namespace topic's push delivery (Preview)

You can set up a webhook endpoint to handle events on a specific namespace topic by subscribing to it. Any public endpoint can be used as an event handler if it uses encryption in transit (`HTTPS`), can read events that use a supported [CloudEvents metadata format](concepts-event-grid-namespaces.md#cloudevents-support), and handle the webhook validation. 

You don't have to host your webhook on Azure, which means that you can use a webhook that's hosted elsewhere to handle events in your application. It gives you the flexibility to choose a webhook in any service provider that best fits your specific needs and requirements. 

## Webhook validation

If your webhook endpoint is known by malicious actors, they could exploit attack vectors and, for example, launch denial-of-service-attacks. To protect your webhook from unexpected event delivery, your webhook needs to indicate if it agrees with the event delivery. Unexpected deliveries can even happen someone who inadvertently creates an event subscription to your endpoint. To that end, your endpoint must handle the webhook validation using the [CloudEvents' abuse protection for webhooks](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection). Following that approach and as part of the event subscription creation, Event Grid sends a validation request that is followed by a proper validation response. If the validation doesn't pass, the event subscription creation fails.

>[!IMPORTANT]
>Event Grid doesn't support the following functionality when [validating webhooks](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#41-validation-request):
>- `WebHook-Request-Callback`. That means that you or your webhook cannot respond asyncronously to Event Grid's validation request.
>- `WebHook-Request-Rate`. That is, Event Grid does not request a data rate at which it communicates with your webhook endpoint. If your webhook responds with a `WebHook-Allowed-Rate`header, it is ignored.

## Webhooks
See [Deliver events to webhooks using namespace topics - Azure CLI](publish-deliver-events-with-namespace-topics-webhook.md), which provides step-by-step instructions to publish events to Azure Event Grid in the CloudEvents JSON format and deliver those events by using the push delivery model.


## Next steps

- See Event Grid's [push delivery and retry](namespace-delivery-retry.md) to understand the event retry schedule in case your webhook isn't available.
- [Deliver events to webhooks using namespace topics](publish-deliver-events-with-namespace-topics-webhook.md)
