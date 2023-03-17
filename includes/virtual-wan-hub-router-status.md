---
author: cherylmc
ms.author: cherylmc
ms.date: 05/20/2022
ms.service: virtual-wan
ms.topic: include
---

A hub router can have four routing statuses: Provisioned, Provisioning, Failed, or None. The **Routing status** is located in the Azure portal by navigating to the Virtual Hub page.

* A **None** status indicates that the virtual hub didn't provision the router. This can happen if the Virtual WAN is of type *Basic*, or if the virtual hub was deployed prior to the service being made available.
* A **Failed** status indicates failure during instantiation. In order to instantiate or reset the router, you can locate the **Reset Router** option by navigating to the virtual hub Overview page in the Azure portal.