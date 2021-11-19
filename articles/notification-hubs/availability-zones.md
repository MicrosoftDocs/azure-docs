---
title: Availability zones in Azure Notification Hubs
description: Learn about availability zones and high availability with Azure Notification Hubs. 
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
ms.topic: conceptual
ms.date: 11/19/2021
ms.custom: template-concept
---

# Availability zones

Azure Notification Hubs now supports [availability zones](/azure/availability-zones/az-overview), providing fault-isolated locations within the same Azure region. To ensure resiliency, three separate availability zones are present in all availability zone-enabled regions. When you use availability zones, both data and metadata are replicated across data centers in the availability zone.

## Feature availability

Availability zones support will be included as part of an Azure Notification Hubs Premium SKU set to be released in 2022. It will only be available in [Azure regions](/azure/availability-zones/az-region) where availability zones are present.

> [!NOTE]
> Until Azure Notification Hubs Premium is released, availability zones is by invitation only. If you are interested in using this feature, contact your customer success manager at Microsoft, or create an Azure support ticket which will be triaged by the support team.

## Enable availability zones

At this time you can only enable availability zones on new namespaces. Notification Hubs does not support migration of existing namespaces. You cannot disable zone redundancy after enabling it on your namespace.

## Next steps

- [Azure availability zones](/azure/availability-zones/az-overview)
- [Azure services that support availability zones](/azure/availability-zones/az-region)
