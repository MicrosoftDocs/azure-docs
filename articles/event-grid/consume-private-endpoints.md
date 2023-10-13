---
title: Deliver events using private link service
description: This article describes how to work around the limitation of not able to deliver events using private link service. 
ms.topic: how-to
ms.date: 08/16/2023
---

# Deliver events using private link service
Currently, it's not possible to deliver events using [private endpoints](../private-link/private-endpoint-overview.md). That is, there's no support if you have strict network isolation requirements where your delivered events traffic must not leave the private IP space. 

## Use managed identity
However, if your requirements call for a secure way to send events using an encrypted channel and a known identity of the sender (in this case, Event Grid) using public IP space, you could deliver events to Event Hubs, Service Bus, or Azure Storage service using an Azure Event Grid custom topic or a domain with system-assigned or user-assigned managed identity. For details about delivering events using managed identity, see [Event delivery using a managed identity](managed-service-identity.md). 

Then, you can use a private link configured in Azure Functions or your webhook deployed on your virtual network to pull events. See the sample: [Connect to private endpoints with Azure Functions](/samples/azure-samples/azure-functions-private-endpoints/connect-to-private-endpoints-with-azure-functions/).


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
