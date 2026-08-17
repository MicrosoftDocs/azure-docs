---
title: Securely Deliver Events with Managed Identities
description: Securely deliver Azure Event Grid events to Event Hubs, Service Bus, and Storage by using system-assigned or user-assigned managed identities.
ms.topic: how-to
ms.date: 07/23/2026
ai-usage: ai-assisted
ms.custom:
  - build-2025
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/28/2025

#customer intent: As an Event Grid administrator, I want to deliver events to a destination by using a managed identity so that I can send events securely without managing credentials.
---

# Deliver events securely by using managed identities

When you use Event Grid basic, you can deliver events to Azure Event Hubs, Azure Service Bus, or Azure Storage over an encrypted channel that uses a known sender identity (Event Grid) on public IP space. To do so, use an Event Grid custom topic or domain that has a system-assigned or user-assigned managed identity. For details about delivering events by using a managed identity, see [Event delivery using a managed identity](managed-service-identity.md).

:::image type="content" source="./media/consume-private-endpoints/deliver-private-link-service.png" alt-text="Diagram that shows the delivery of events via the Private Link service.":::

With this configuration, the secured traffic from Event Grid to Event Hubs, Service Bus, or Azure Storage [stays on the Microsoft backbone](../networking/microsoft-global-network.md#get-the-premium-cloud-network) and uses a managed identity of Event Grid. When you configure your Azure function or webhook from within your virtual network to reach Event Hubs, Service Bus, or Azure Storage over a private link, the traffic between those services and your function or webhook stays within your virtual network perimeter.

## Deliver events to Event Hubs by using managed identity

> [!NOTE]
> This section applies to both Event Grid basic and standard tiers. 

To deliver events to event hubs in your Event Hubs namespace by using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [system topics](enable-identity-system-topics.md), [custom topics and domains](enable-identity-custom-topics-domains.md).
1. [Add the identity to the **Azure Event Hubs Data Sender** role on the Event Hubs namespace](../event-hubs/authenticate-managed-identity.md#to-assign-azure-roles-using-the-azure-portal).
1. [Enable the **Allow trusted Microsoft services to bypass this firewall** setting on your Event Hubs namespace](../event-hubs/event-hubs-service-endpoints.md#trusted-microsoft-services). 
1. [Configure the event subscription](managed-service-identity.md#create-event-subscriptions-that-use-an-identity) that uses an event hub as an endpoint to use the system-assigned or user-assigned managed identity.

## Deliver events to Service Bus by using managed identity

> [!NOTE]
> This section applies to the Event Grid basic tier only. 

To deliver events to Service Bus queues or topics in your Service Bus namespace by using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [system topics](enable-identity-system-topics.md), [custom topics and domains](enable-identity-custom-topics-domains.md).
1. [Add the identity to the **Azure Service Bus Data Sender**](../service-bus-messaging/service-bus-managed-service-identity.md#assign-a-service-bus-role-to-the-managed-identity) role on the Service Bus namespace.
1. [Enable the **Allow trusted Microsoft services to bypass this firewall** setting on your Service Bus namespace](../service-bus-messaging/service-bus-service-endpoints.md#trusted-microsoft-services).
1. [Configure the event subscription](managed-service-identity.md) that uses a Service Bus queue or topic as an endpoint to use the system-assigned or user-assigned managed identity.

## Deliver events to Storage queues by using managed identity

> [!NOTE]
> This section applies to the Event Grid basic tier only. 

To deliver events to Storage queues by using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [system topics](enable-identity-system-topics.md), [custom topics and domains](enable-identity-custom-topics-domains.md).
1. [Add the identity to the **Storage Queue Data Message Sender**](../storage/queues/assign-azure-role-data-access.md) role on the Azure Storage queue.
1. [Configure the event subscription](managed-service-identity.md#create-event-subscriptions-that-use-an-identity) that uses a Storage queue as an endpoint to use the system-assigned or user-assigned managed identity.

## Deliver events to webhooks by using managed identity

> [!NOTE]
> This section applies to both Event Grid basic and standard tiers.

To deliver events to a webhook by using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [system topics](enable-identity-system-topics.md), [custom topics and domains](enable-identity-custom-topics-domains.md), and [namespaces](event-grid-namespace-managed-identity.md).
1. Create a single-tenant or multitenant application to set the audience for the token.
1. [Configure the event subscription](create-view-manage-event-subscriptions.md) that uses a webhook as an endpoint to use the system-assigned or user-assigned managed identity. After you select the type of managed identity, enter the application ID and the tenant ID. In the cross-tenant scenario, the application ID must be from an application created in the destination tenant.

## Firewall and virtual network rules

If you don't configure firewall or virtual network rules for the destination Storage account, Event Hubs namespace, or Service Bus namespace, you can use both user-assigned and system-assigned identities to deliver events.

If you configure a firewall or virtual network rule for the destination Storage account, Event Hubs namespace, or Service Bus namespace, you can use only the system-assigned managed identity if **Allow Azure services on the trusted service list to access the storage account** is also enabled on the destinations. You can't use user-assigned managed identity whether this option is enabled or not.

## Related content

For more information about delivering events by using a managed identity, see [Event delivery using a managed identity](managed-service-identity.md).
