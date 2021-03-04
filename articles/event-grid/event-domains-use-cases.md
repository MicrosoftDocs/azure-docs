---
title: Use cases for Event Domains in Azure Event Grid
description: This article describes a few use cases for using event domains in Azure Event Grid. 
ms.topic: conceptual
ms.date: 03/04/2021
---

# Use cases for event domains in Azure Event Grid
This article describes a few use cases for using event domains in Azure Event Grid. 

### Use case 1 
Event domains are most easily explained using an example. Let's say you run Contoso Construction Machinery, where you manufacture tractors, digging equipment, and other heavy machinery. As a part of running the business, you push real-time information to customers about equipment maintenance, systems health, and contract updates. All of this information goes to various endpoints including your app, customer endpoints, and other infrastructure that customers have set up.

Event domains allow you to model Contoso Construction Machinery as a single eventing entity. Each of your customers is represented as a topic within the domain. Authentication and authorization are handled using Azure Active Directory. Each of your customers can subscribe to their topic and get their events delivered to them. Managed access through the event domain ensures they can only access their topic.

It also gives you a single endpoint, which you can publish all of your customer events to. Event Grid will take care of making sure each topic is only aware of events scoped to its tenant.

![Contoso Construction Example](./media/event-domains/contoso-construction-example.png)

## Use case 2
There is a limit of 500 event subscriptions when using system topics. If you need more than 500 event subscriptions for a system topic, you could use domains. 

1. Create a domain, which can support up to 100,000 topics and each domain topic can have 500 event subscriptions. This model would give you 500 * 100,000 event subscriptions. 
1. Create an Azure function subscription for the Azure Storage system topic. When function receives events from Azure storage, it can enrich and publish events to an appropriate domain topic. For example, the function could parse the blob file name to determine the target domain topic and publish the event to domain topic. 

:::image type="content" source="./media/event-domains-use-cases/use-case-2.jpg" alt-text="AzureEvent Grid domains - use case 2":::


## Next steps
To learn about setting up event domains, creating topics, creating event subscriptions, and publishing events, see [Manage event domains](./how-to-event-domains.md).
