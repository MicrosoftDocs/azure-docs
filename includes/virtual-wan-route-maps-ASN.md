---
author: cherylmc
ms.author: cherylmc
ms.date: 03/04/2024
ms.service: azure-virtual-wan
ms.topic: include
---

When using Route-maps, do not use private ASNs for AS prepending. If you are using ExpressRoute, the gateway will strip private ASNs. 

Do not use ASN's reserved by Azure for AS prepending:

Public ASNs: 8074, 8075, 12076

Private ASNs: 65515, 65517, 65518, 65519, 65520 

