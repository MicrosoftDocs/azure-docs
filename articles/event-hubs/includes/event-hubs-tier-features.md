---
title: include file
description: include file
author: spelluru
ms.service: azure-event-hubs
ms.topic: include
ms.date: 02/15/2024
ms.author: spelluru
ms.custom: "include file","fasttrack-edit","iot","event-hubs"

---

The following table shows the list of features that are available (or not available) in a specific tier of Azure Event Hubs.

| Feature | Basic | Standard | Premium | Dedicated |
| ------- | ------| -------- | ------- | --------- |
| Tenancy | Multitenant | Multitenant | Multitenant with resource isolation | Exclusive single tenant |
| Private link | N/A | Yes | Yes | Yes |
| Customer-managed key <br/>(bring your own key) | N/A | N/A | Yes | Yes |
| Capture | N/A | Priced separately | Included | Included |
| Dynamic partition scale-out | N/A | N/A | Yes | Yes |
| Ingress events | Pay per million events | Pay per million events | Included | Included |
| Runtime audit logs | N/A | N/A | Yes | Yes |
| Availability zone | Yes | Yes | Yes | Yes |
| Geo-disaster | N/A | Yes | Yes | Yes |
| IP firewall | N/A | Yes | Yes | Yes |

> [!NOTE]
> *Included* in the table means the feature is available and there's no separate charge for using it.







 
