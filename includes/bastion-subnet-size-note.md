---
author: cherylmc
ms.author: cherylmc
ms.date: 07/01/2021
ms.service: bastion
ms.topic: include

---

> [!IMPORTANT]
> When creating the AzureBastionSubnet, consider the scaling feature. In order to scale up to the max (50 scale units), the AzureBastionSubnet must be a /26 or greater (/25,/24, etc.). A /27 subnet will limit the number of scale units.
>