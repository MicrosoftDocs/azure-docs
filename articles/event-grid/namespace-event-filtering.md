---
title: Event filtering for Azure Event Grid namespaces
description: Describes how to filter events when creating an Azure Event Grid namespace subscription.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 09/09/2022
---

# Understand event filtering for Event Grid namespace subscriptions

This article describes the different ways to filter which events are sent to your endpoint. When creating an event subscription, you have three options for filtering:

* Event types
* Subject begins with or ends with
* Advanced fields and operators

[!INCLUDE [event-filtering](./includes/event-filtering.md)]

## Next steps

- [Create, view, and manage namespaces](create-view-manage-namespaces.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
- [Control plane and data plane SDKs](sdk-overview.md)
- [Quotas and limits](quotas-limits.md)
