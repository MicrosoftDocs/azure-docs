---
title: Secure Event Delivery with Private Links
description: Private link event delivery in Azure Event Grid supports pull delivery but not push delivery. Learn how to configure private endpoints and explore secure alternatives.
#customer intent: As a solutions architect, I want to know if Azure Event Grid push delivery supports private link so that I can determine the right event delivery approach for my secure network environment.
ms.topic: how-to
ms.date: 03/27/2026
author: spelluru
ms.author: spelluru
ms.reviewer: spelluru
# Customer intent: I would like to know if delivering events using private link service is supported in the Push model.
---

# Deliver events securely over a private link
This article describes how Azure Event Grid supports delivering events over a private link.

## Pull delivery
**Pull** delivery supports consuming events by using private links. Pull delivery is a feature of Event Grid namespaces. When you add a private endpoint connection to a namespace, your consumer application can connect to Event Grid on a private endpoint to receive events. For more information, see [configure private endpoints for namespaces](configure-private-endpoints-pull.md) and [pull delivery overview](pull-delivery-overview.md).

## Push delivery
With **push** delivery, you can't deliver events by using [private endpoints](../private-link/private-endpoint-overview.md). That is, with push delivery, either in Event Grid basic or Event Grid namespaces, your application can't receive events over private IP space. However, there's a secure alternative that uses managed identities with public endpoints. Use the link in the next section to go to the article that shows how to use managed identities to deliver events. 

## Related content
For more information about delivering events by using a managed identity, see [Deliver events securely using managed identities](deliver-events-using-managed-identity.md).
