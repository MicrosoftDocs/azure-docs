---
title: Region - region-down notifications (Service Health + Resource Health)
description: Include file for the region-down behavior section's *Notification* bullet that describes how Service Health and Resource Health can be used together.
author: anaharris-ms
ms.service: azure
ms.topic: include
ms.date: 10/21/2025
ms.author: anaharris
ms.custom: include file
---

- **Notification**: Microsoft doesn't automatically notify you when a region is down. However:

    - You can use [Azure Resource Health](/azure/service-health/resource-health-overview) to monitor for the health of an individual resource, and you can set up [Resource Health alerts](/azure/service-health/resource-health-alert-arm-template-guide) to notify you of problems.
    
    - You can use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the service, including any region failures, and you can set up [Service Health alerts](/azure/service-health/resource-health-alert-arm-template-guide) to notify you of problems.
