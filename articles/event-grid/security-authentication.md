---
title: Authenticate Event Delivery in Azure Event Grid
description: Learn how to authenticate event delivery to event handlers in Azure Event Grid using access keys, managed identities, and secure webhooks.
#customer intent: As a developer, I want to understand how to authenticate event delivery to event handlers so that I can secure my applications effectively.
ms.topic: concept-article
ms.date: 02/17/2026
# Customer intent: I want to learn how to authenticate delivery of events to event handlers. 
---

# Authenticate event delivery to event handlers (Azure Event Grid)
This article provides information on authenticating event delivery to event handlers. 

## Overview
Azure Event Grid uses different authentication methods to deliver events to event handlers. `

| Authentication method | Supported event handlers | Description  |
|--|--|--|
Access key | <ul><li>Event Hubs</li><li>Service Bus</li><li>Storage Queues</li><li>Relay Hybrid Connections</li><li>Azure Functions</li><li>Storage Blobs (Deadletter)</li></ul> | Event Grid service principal credentials fetch access keys. When you register the Event Grid resource provider in your Azure subscription, you grant Event Grid the necessary permissions. |  
Managed System Identity <br/>&<br/> Role-based access control | <ul><li>Event Hubs</li><li>Service Bus</li><li>Storage Queues</li><li>Storage  Blobs (Deadletter)</li></ul> | Enable managed system identity for the topic and add it to the appropriate role on the destination. For details, see [Use system-assigned identities for event delivery](#use-system-assigned-identities-for-event-delivery). |
|Bearer token authentication with Microsoft Entra protected webhook | Webhook | See the [Authenticate event delivery to webhook endpoints](#authenticate-event-delivery-to-webhook-endpoints) section for details. |
Client secret as a query parameter | Webhook | See the [Use client secret as a query parameter](#use-client-secret-as-a-query-parameter) section for details. |

> [!NOTE]
> If you protect your Azure function with a Microsoft Entra app, you need to take the generic webhook approach by using the HTTP trigger. Use the Azure function endpoint as a webhook URL when adding the subscription.

## Use system-assigned identities for event delivery
You can enable a system-assigned managed identity for a topic or domain and use the identity to forward events to supported destinations such as Service Bus queues and topics, event hubs, and storage accounts.

Follow these steps: 

1. Create a topic or domain with a system-assigned identity, or enable identity on an existing topic or domain. For more information, see [Enable managed identity for a system topic](enable-identity-system-topics.md) or [Enable managed identity for a custom topic or a domain](enable-identity-custom-topics-domains.md).
1. Add the identity to an appropriate role (for example, Service Bus Data Sender) on the destination (for example, a Service Bus queue). For more information, see [Grant identity the access to Event Grid destination](add-identity-roles.md).
1. When you create event subscriptions, enable the usage of the identity to deliver events to the destination. For more information, see [Create an event subscription that uses the identity](managed-service-identity.md). 

For detailed step-by-step instructions, see [Event delivery with a managed identity](managed-service-identity.md).


## Authenticate event delivery to webhook endpoints
The following sections describe how to authenticate event delivery to webhook endpoints. Use a validation handshake mechanism regardless of the method you use. See [Webhook event delivery](end-point-validation-cloud-events-schema.md) for details.  


### Use Microsoft Entra ID
You can secure the webhook endpoint that receives events from Event Grid by using Microsoft Entra ID. Create a Microsoft Entra application, create a role and a service principal in your application that authorizes Event Grid, and configure the event subscription to use the Microsoft Entra application. Learn how to [Configure Microsoft Entra ID with Event Grid](secure-webhook-delivery.md).

### Use client secret as a query parameter
You can also secure your webhook endpoint by adding query parameters to the webhook destination URL specified as part of creating an Event Subscription. Set one of the query parameters to be a client secret such as an [access token](https://en.wikipedia.org/wiki/Access_token) or a shared secret. Event Grid service includes all the query parameters in every event delivery request to the webhook. The webhook service can retrieve and validate the secret. If you update the client secret, you also need to update the event subscription. To avoid delivery failures during this secret rotation, make the webhook accept both old and new secrets for a limited duration before updating the event subscription with the new secret. 

Because query parameters can contain client secrets, handle them with extra care. They're stored as encrypted and aren't accessible to service operators. They aren't logged as part of the service logs or traces. When you retrieve event subscription properties, destination query parameters aren't returned by default. For example, you need to use the [`--include-full-endpoint-url`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-show) parameter in Azure [CLI](/cli/azure).

For more information on delivering events to webhooks, see [Webhook event delivery](end-point-validation-cloud-events-schema.md).

> [!IMPORTANT]
> Azure Event Grid only supports **HTTPS** webhook endpoints. 

## Endpoint validation with CloudEvents v1.0
If you're already familiar with Event Grid, you might be aware of the endpoint validation handshake for preventing abuse. CloudEvents v1.0 implements its own [abuse protection semantics](end-point-validation-cloud-events-schema.md) by using the **HTTP OPTIONS** method. To read more about it, see [HTTP 1.1 Web Hooks for event delivery - Version 1.0](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection). When you use the CloudEvents schema for output, Event Grid uses the CloudEvents v1.0 abuse protection in place of the Event Grid validation event mechanism. For more information, see [Use CloudEvents v1.0 schema with Event Grid](cloud-event-schema.md). 


## Related content
To learn about authenticating clients that publish events to topics or domains, see [Authenticate publishing clients](security-authenticate-publishing-clients.md).
