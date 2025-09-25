---
title: Deliver events using private link service
description: This article describes how to work around push delivery's limitation to deliver events using private link service.
ms.topic: how-to
ms.date: 12/16/2024
# Customer intent: I would like to know if delivering events using private link service is supported in the Push model.
ms.custom:
  - build-2025
---

# Deliver events securely over a private link
This article describes how Azure Event Grid supports delivering events over a private link.

## Pull delivery
**Pull** delivery supports consuming events using private links. Pull delivery is a feature of Event Grid namespaces. Once you add a private endpoint connection to a namespace, your consumer application can connect to Event Grid on a private endpoint to receive events. For more information, see [configure private endpoints for namespaces](configure-private-endpoints-pull.md) and [pull delivery overview](pull-delivery-overview.md).

## Push delivery
With **push** delivery isn't possible to deliver events using [private endpoints](../private-link/private-endpoint-overview.md). That is, with push delivery, either in Event Grid basic or Event Grid namespaces, your application can't receive events over private IP space. However, there's a secure alternative using managed identities with public endpoints. Use the link in the next section to navigate to the article that shows how to use managed identities to deliver events. 

## Related content
For more information about delivering events using a managed identity, see [Deliver events securely using managed identities](deliver-events-using-managed-identity.md).
