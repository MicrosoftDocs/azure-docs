---
title: Authenticate event delivery to event handlers (Azure Event Grid)
description: This article describes different ways of authenticating delivery to event handlers in Azure Event Grid. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 06/25/2020
ms.author: spelluru
---

# Authenticate event delivery to event handlers (Azure Event Grid)
This article provides information on authenticating event delivery to event handlers. It also shows how to secure the webhook endpoints that are used to receive events from Event Grid using Azure Active Directory (Azure AD) or a shared secret.

## Use system-assigned identities for event delivery
You can enable a system-assigned managed identity for a topic or domain and use the identity to forward events to supported destinations such as Service Bus queues and topics, event hubs, and storage accounts.

Here are the steps: 

1. Create a topic or domain with a system-assigned identity, or update an existing topic or domain to enable identity. 
1. Add the identity to an appropriate role (for example, Service Bus Data Sender) on the destination (for example, a Service Bus queue).
1. When you create event subscriptions, enable the usage of the identity to deliver events to the destination. 

For detailed step-by-step instructions, see [Event delivery with a managed identity](managed-service-identity.md).


## Authenticate event delivery to webhook endpoints
The following sections describe how to authenticate event delivery to webhook endpoints. You need to use a validation handshake mechanism irrespective of the method you use. See [Webhook event delivery](webhook-event-delivery.md) for details. 


### Using Azure Active Directory (Azure AD)
You can secure the webhook endpoint that's used to receive events from Event Grid by using Azure AD. You'll need to create an Azure AD application, create a role and service principal in your application authorizing Event Grid, and configure the event subscription to use the Azure AD application. Learn how to [Configure Azure Active Directory with Event Grid](secure-webhook-delivery.md).

### Using client secret as a query parameter
You can also secure your webhook endpoint by adding query parameters to the webhook destination URL specified as part of creating an Event Subscription. Set one of the query parameters to be a client secret such as an [access token](https://en.wikipedia.org/wiki/Access_token) or a shared secret. Event Grid service includes all the query parameters in every event delivery request to the webhook. The webhook service can retrieve and validate the secret. If the client secret is updated, event subscription also needs to be updated. To avoid delivery failures during this secret rotation, make the webhook accept both old and new secrets for a limited duration before updating the event subscription with the new secret. 

As query parameters could contain client secrets, they are handled with extra care. They are stored as encrypted and are not accessible to service operators. They are not logged as part of the service logs/traces. When retrieving the Event Subscription properties, destination query parameters aren't returned by default. For example: [--include-full-endpoint-url](https://docs.microsoft.com/cli/azure/eventgrid/event-subscription?view=azure-cli-latest#az-eventgrid-event-subscription-show) parameter is to be used in Azure [CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest).

For more information on delivering events to webhooks, see [Webhook event delivery](webhook-event-delivery.md)

> [!IMPORTANT]
Azure Event Grid only supports **HTTPS** webhook endpoints. 


## Next steps
See [Authenticate publishing clients](security-authenticate-publishing-clients.md) to learn about authenticating clients publishing events to topics or domains. 
