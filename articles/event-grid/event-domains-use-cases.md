---
title: Use cases for Event Domains in Azure Event Grid
description: This article describes a few use cases for using event domains in Azure Event Grid. 
ms.topic: conceptual
ms.date: 03/04/2021
---

# Use cases for event domains in Azure Event Grid
This article describes a few use cases for using event domains in Azure Event Grid. 

## Use case 1 
[!INCLUDE [domain-example-use-case.md](./includes/domain-example-use-case.md)]

## Use case 2
There is a limit of 500 event subscriptions when using system topics. If you need more than 500 event subscriptions for a system topic, you could use domains. 

Suppose, you have created a system topic for an Azure Blob Storage and you need to create more than 500 subscriptions to the topic, but it's not possible because of the limitation (500 subscriptions per topic). In this case, you could use the following solution that uses an event domain. 

1. Create a domain, which can support up to 100,000 topics and each domain topic can have 500 event subscriptions. This model would give you 500 * 100,000 event subscriptions. 
1. Create an Azure function subscription for the Azure Storage system topic. When function receives events from Azure storage, it can enrich and publish events to an appropriate domain topic. For example, the function could parse the blob file name to determine the target domain topic and publish the event to domain topic. 

:::image type="content" source="./media/event-domains-use-cases/use-case-2.jpg" alt-text="AzureEvent Grid domains - use case 2":::


## Next steps
To learn about setting up event domains, creating topics, creating event subscriptions, and publishing events, see [Manage event domains](./how-to-event-domains.md).
