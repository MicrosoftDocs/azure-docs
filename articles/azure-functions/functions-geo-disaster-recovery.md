---
title: Azure Functions geo-disaster recovery and reliability 
description: How to use geographical regions for redundancy and to fail over in Azure Functions.
ms.assetid: 9058fb2f-8a93-4036-a921-97a0772f503c
ms.topic: conceptual
ms.date: 08/27/2021

---

# Azure Functions geo-disaster recovery

When entire Azure regions or datacenters experience downtime, your mission-critical code needs to continue processing in a different region. This article explains some of the strategies that you can use to deploy functions to allow for disaster recovery.

## Basic concepts

Functions run in a function app in a specific Azure region. There's no built-in redundancy available. To avoid loss of execution during outages, you can redundantly deploy the same functions to function apps in multiple regions.  

When you run the same function code in multiple regions, there are two patterns to consider:

| Pattern | Description |
| --- | --- |
|**Active/active** | Functions in both regions are actively running and processing events, either in a duplicate manner or in rotation. We recommend using an active/active pattern in combination with [Azure Front Door](../frontdoor/front-door-overview.md) for your critical HTTP triggered functions. |
|**Active/passive** | Functions run actively in region receiving events, while the same functions in a second region remain idle.  When failover is required, the second region is activated and takes over processing. We recommend this pattern for your event-driven, non-HTTP triggered functions, such as Service Bus and Event Hubs triggered functions.

To learn more about multi-region deployments, see the guidance in [Highly available multi-region web application](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

## Redundancy for HTTP trigger functions

The active/active pattern is the best deployment model for HTTP trigger functions. In this case, you need to use [Azure Front Door](../frontdoor/front-door-overview.md) to coordinate requests between both regions. Azure Front Door can route and round-robin HTTP requests between functions running in multiple regions. It also periodically checks the health of each endpoint. When a function in one region stops responding to health checks, Azure Front Door takes it out of rotation, and only forwards traffic to the remaining healthy functions.  

![Architecture for Azure Front Door and Function](media/functions-geo-dr/front-door.png)  

## Redundancy for non-HTTP trigger functions

Redundancy for functions that consume events from other services requires a different pattern, which works with the failover pattern of the related services. 

### Active/passive redundancy for non-HTTP trigger functions

Active/passive provides a way for only a single function to process each message while providing a mechanism to fail over to a secondary region in a disaster. Function apps work with the failover behaviors of the partner services, such as [Azure Service Bus geo-recovery](../service-bus-messaging/service-bus-geo-dr.md) and [Azure Event Hubs geo-recovery](../event-hubs/event-hubs-geo-dr.md). The secondary function app is considered _passive_ because the failover service to which it's connected isn't currently active, so the function app remains _idle_.

Consider an example topology using an Azure Event Hubs trigger. In this case, the active/passive pattern requires involve the following components:

* Azure Event Hubs deployed to both a primary and secondary region.
* [Geo-disaster enabled](../service-bus-messaging/service-bus-geo-dr.md) to pair the primary and secondary event hubs. This also creates an _alias_ you can use to connect to event hubs and switch from primary to secondary without changing the connection info.
* Function apps are deployed to both the primary and secondary (failover) region, with the app in the secondary region essentially being idle because messages aren't being sent there.
* Function app triggers on the *direct* (non-alias) connection string for its respective event hub. 
* Publishers to the event hub should publish to the alias connection string. 

![Active-passive example architecture](media/functions-geo-dr/active-passive.png)

Before failover, publishers sending to the shared alias route to the primary event hub. The primary function app is listening exclusively to the primary event hub. The secondary function app is passive and idle. As soon as failover is initiated, publishers sending to the shared alias are routed to the secondary event hub. The secondary function app now becomes active and starts triggering automatically.  Effective failover to a secondary region can be driven entirely from the event hub, with the functions becoming active only when the respective event hub is active.

Read more on information and considerations for failover with [Service Bus](../service-bus-messaging/service-bus-geo-dr.md) and [Event Hubs](../event-hubs/event-hubs-geo-dr.md).

### Active/active redundancy for non-HTTP trigger functions

You can still achieve active/active deployments for non-HTTP triggered functions. However, you need to consider how the two active regions interact or coordinate with one another. When you deploy the same function app to two regions with each triggering on the same Service Bus queue, they would act as competing consumers on de-queueing that queue. While this means each message is only being processed by either one of the instances, it also means there's still a single point of failure on the single Service Bus instance. 

You could instead deploy two Service Bus queues, with one in a primary region, one in a secondary region. In this case, you could have two function apps, with each pointed to the Service Bus queue active in their region. The challenge with this topology is how the queue messages are distributed between the two regions.  Often, this means that each publisher attempts to publish a message to *both* regions, and each message is processed by both active function apps. While this creates the desired active/active pattern, it also creates other challenges around duplication of compute and when or how data is consolidated. Because of these challenges, we recommend using the active/passive pattern for non-HTTPS trigger functions.

## Next steps

* [Create Azure Front Door](../frontdoor/quickstart-create-front-door.md)
* [Event Hubs failover considerations](../event-hubs/event-hubs-geo-dr.md#considerations)
