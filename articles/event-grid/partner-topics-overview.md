---
title: Azure Event Grid partner topics
description: Send events from third-party Event Grid SaaS and PaaS partners directly to Azure services with Azure Event Grid.
services: event-grid
author: banisadr

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/18/2020
ms.author: babanisa
---

# Partner Topics in Azure Event Grid (Preview)
Partner Topics allow you to connect third-party event sources directly to Event Grid. This integration allows you to subscribe to events from partners in the same way you subscribe to events from Azure services. 

## Available Partners
The first partner available through Event Grid Partner Topics is Auth0. The [Auth0 partner topic](auth0-overview.md) enables you to connect your Auth0 and Azure accounts. The the integration to react to, log, and monitor Auth0 events in real time.

[Try it out](auth0-how-to.md) today by logging in to your Auth0 account and creating an Event Grid integration. Once you click create in Auth0, you’ll see a pending Auth0 Topic in your Azure account. Click activate and you can create Event Subscriptions, route, filter, and deliver your events just as you do any other event source.

## Pricing
Partner topics are charged at the same operation rate as system topics.

## Limits
Partner Topics are in Public Preview. During public preview, Partner topics are subject to the [same limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#event-grid-limits) as system topics and custom topics.

## How do I become an Event Grid partner?
The infrastructure created to support this launch makes it easy and quick for new partners to integrate their eventing capabilities with Event Grid. Read the [partner onboarding documentation](partner-onboarding-overview.md) for more.

## Next steps

- [Auth0 Partner Topic](auth0-overview.md)
- [How to use the Auth0 Partner Topic](auth0-how-to.md)
- [Become an Event Grid partner](partner-onboarding-overview.md)