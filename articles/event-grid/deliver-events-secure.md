---
title: Securely deliver events to Event Hubs, Service Bus, or Functions 
description: This article describes how to securely deliver events to Event Hubs, Service Bus, or Functions. 
ms.topic: how-to
ms.date: 10/19/2020
---

# Securely deliver events to Event Hubs, Service Bus, or Functions 
Currently, it's not possible to deliver events to Event Hubs, Service Bus, or Functions using [private endpoints](../private-link/private-endpoint-overview.md). You can enable a [managed service identity](../active-directory/managed-identities-azure-resources/overview.md) for an Azure event grid topic or a domain and use it to forward events to supported destinations such as Service Bus queues and topics, event hubs, and storage accounts. For details, see [Event delivery with a managed identity](managed-service-identity.md). Note that the traffic goes over public IP/internet, but it's secured via managed identity. 

Use managed identity to deliver events to a Storage queue or a Service Bus queue, or an event hub. Then, you can have a private link configured in Azure Functions. 
See the sample: [Connect to private endpoints with Azure Functions](https://docs.microsoft.com/samples/azure-samples/azure-functions-private-endpoints/connect-to-private-endpoints-with-azure-functions/).

## Next steps
For more information about managed service identities, see [What are managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md). 
