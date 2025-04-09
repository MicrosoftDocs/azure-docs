---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 04/09/2025
ms.author: danlep
---

This policy tracks calls independently at each gateway where it is applied, including regional gateways in a [multi-region deployment](../articles/api-management/api-management-howto-deploy-multi-region.md) and [workspace gateways](../articles/api-management/workspaces-overview.md#workspace-gateway). It doesn't aggregate call data across the entire instance. 
