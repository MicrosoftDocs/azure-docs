---
title: Event filtering for Azure Event Grid namespaces
description: Describes how to filter events when creating subscriptions to Azure Event Grid namespace topics.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
---

# Event filters for subscriptions to Azure Event Grid namespace topics

This article describes different ways to specify filters on event subscriptions to namespace topics. The filters allow you to send only a subset of events that publisher sends to Event Grid to the destination endpoint. When creating an event subscription, you have three options for filtering:

* Event types
* Subject begins with or ends with
* Advanced fields and operators

[!INCLUDE [event-filtering](./includes/event-filtering.md)]

## Next steps

- [Create, view, and manage namespaces](create-view-manage-namespaces.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
- [Control plane and data plane SDKs](sdk-overview.md)
- [Quotas and limits](quotas-limits.md)
