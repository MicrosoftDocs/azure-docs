---
title: Azure Event Grid partner topics
description: Send events from third-party Event Grid SaaS and PaaS partners directly to Azure services with Azure Event Grid.
services: event-grid
author: femila

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/18/2020
ms.author: femila
---

# Partner topics in Azure Event Grid (preview)
By using partner topics, you can connect third-party event sources directly to Azure Event Grid. This integration allows you to subscribe to events from partners in the same way you subscribe to events from Azure services. 

## Available partners
The first partner available through Event Grid partner topics is Auth0. You can use the [Auth0 partner topic](auth0-overview.md) to connect your Auth0 and Azure accounts. The integration allows you to react to, log, and monitor Auth0 events in real time.

[To try it out](auth0-how-to.md), sign in to your Auth0 account and create an Event Grid integration. After you select **Create** in Auth0, you see a pending Auth0 topic in your Azure account. Select **Activate**, and you can create Event Grid subscriptions to route, filter, and deliver your events just as you do any other event source.

## Pricing
Partner topics are charged at the same operation rate as system topics.

## Limits
Partner topics are in public preview. During public preview, partner topics are subject to the [same limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#event-grid-limits) as system topics and custom topics.

## How do I become an Event Grid partner?
The infrastructure created to support this launch makes it easy and quick for new partners to integrate their eventing capabilities with Event Grid. For more information, see the [partner onboarding documentation](partner-onboarding-overview.md).

## Next steps

- [Auth0 partner topic](auth0-overview.md)
- [How to use the Auth0 partner topic](auth0-how-to.md)
- [Become an Event Grid partner](partner-onboarding-overview.md)