---
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: include
ms.date: 10/09/2023
---

- In most cases, we recommend using Microsoft Azure Peering Service (MAPS) to connect your network to Azure Communications Gateway.
- Alternatively, you can use an Azure ExpressRoute circuit for Microsoft Peering and connect your network to Azure Communications Gateway. For more information, and examples of why you might want to use ExpressRoute Microsoft Peering, see [Using ExpressRoute for Microsoft PSTN Services](/azure/expressroute/using-expressroute-for-microsoft-pstn).
- For Microsoft Teams Direct Routing, you can also use the public internet, although we strongly recommend MAPS or ExpressRoute.

For Operator Connect or Teams Phone Mobile, you must use MAPS or ExpressRoute.