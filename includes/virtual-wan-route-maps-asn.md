---
author: cherylmc
ms.author: cherylmc
ms.date: 03/04/2024
ms.service: azure-virtual-wan
ms.topic: include
---

When using Route-maps, don't use private ASNs (Autonomous System Numbers) for AS prepending. If you're using ExpressRoute, the gateway strips private ASNs. 

Don't use ASNs reserved by Azure for AS prepending:

* Public ASNs: 8074, 8075, 12076

* Private ASNs: 65515, 65517, 65518, 65519, 65520 

