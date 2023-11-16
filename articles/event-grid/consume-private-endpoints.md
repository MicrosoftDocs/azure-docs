---
title: Deliver events using private link service
description: This article describes how to work around push delivery's limitation to deliver events using private link service.
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/02/2023
---

# Deliver events using private link service

**Pull** delivery supports consuming events using private links. Pull delivery is a feature of Event Grid namespaces. Once you have added a private endpoint connection to a namespace, your consumer application can connect to Event Grid on a private endpoint to receive events. For more information, see [configure private endpoints for namespaces](configure-private-endpoints-pull.md) and [pull delivery overview](pull-delivery-overview.md).

With **push** delivery isn't possible to deliver events using [private endpoints](../private-link/private-endpoint-overview.md). That is, with push delivery, either in Event Grid basic or Event Grid namespaces, your application can't receive events over private IP space. However, there's a secure alternative using managed identities with public endpoints.

## Use managed identity

If you're using Event Grid basic and your requirements call for a secure way to send events using an encrypted channel and a known identity of the sender (in this case, Event Grid) using public IP space, you could deliver events to Event Hubs, Service Bus, or Azure Storage service using an Azure Event Grid custom topic or a domain with system-assigned or user-assigned managed identity. For details about delivering events using managed identity, see [Event delivery using a managed identity](managed-service-identity.md).

:::image type="content" source="./media/consume-private-endpoints/deliver-private-link-service.svg" alt-text="Deliver via private link service":::


Under this configuration, the secured traffic from Event Grid to Event Hubs, Service Bus, or Azure Storage, [stays on the Microsoft backbone](../networking/microsoft-global-network.md#get-the-premium-cloud-network) and a managed identity of Event Grid is used. Configuring your Azure Function or webhook from within your virtual network to use an Event Hubs, Service Bus, or Azure Storage via private link ensures the traffic between those services and your function or webhook stays within your virtual network perimeter.

## Deliver events to Event Hubs using managed identity
To deliver events to event hubs in your Event Hubs namespace using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [system topics](enable-identity-system-topics.md), [custom topics, and domains](enable-identity-custom-topics-domains.md).  
1. [Add the identity to the **Azure Event Hubs Data Sender** role  on the Event Hubs namespace](../event-hubs/authenticate-managed-identity.md#to-assign-azure-roles-using-the-azure-portal).
1. [Enable the **Allow trusted Microsoft services to bypass this firewall** setting on your Event Hubs namespace](../event-hubs/event-hubs-service-endpoints.md#trusted-microsoft-services). 
1. [Configure the event subscription](managed-service-identity.md#create-event-subscriptions-that-use-an-identity) that uses an event hub as an endpoint to use the system-assigned or user-assigned managed identity.

## Deliver events to Service Bus using managed identity
To deliver events to Service Bus queues or topics in your Service Bus namespace using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [system topics](enable-identity-system-topics.md), [custom topics, and domains](enable-identity-custom-topics-domains.md). 
1. [Add the identity to the **Azure Service Bus Data Sender**](../service-bus-messaging/service-bus-managed-service-identity.md#azure-built-in-roles-for-azure-service-bus) role on the Service Bus namespace
1. [Enable the **Allow trusted Microsoft services to bypass this firewall** setting on your Service Bus namespace](../service-bus-messaging/service-bus-service-endpoints.md#trusted-microsoft-services). 
1. [Configure the event subscription](managed-service-identity.md) that uses a Service Bus queue or topic as an endpoint to use the system-assigned or user-assigned managed identity.

## Deliver events to Storage using managed identity
To deliver events to Storage queues using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [system topics](enable-identity-system-topics.md), [custom topics, and domains](enable-identity-custom-topics-domains.md). 
1. [Add the identity to the **Storage Queue Data Message Sender**](../storage/blobs/assign-azure-role-data-access.md) role on Azure Storage queue.
1. [Configure the event subscription](managed-service-identity.md#create-event-subscriptions-that-use-an-identity) that uses a Storage queue as an endpoint to use the system-assigned or user-assigned managed identity.

## Firewall and virtual network rules
If there's no firewall or virtual network rules configured for the destination Storage account, Event Hubs namespace, or Service Bus namespace, you can use both user-assigned and system-assigned identities to deliver events. 

If a firewall or virtual network rule is configured for the destination Storage account, Event Hubs namespace, or Service Bus namespace, you can use only the system-assigned managed identity if **Allow Azure services on the trusted service list to access the storage account** is also enabled on the destinations. You can't use user-assigned managed identity whether this option is enabled or not. 

## Next steps
For more information about delivering events using a managed identity, see [Event delivery using a managed identity](managed-service-identity.md).
