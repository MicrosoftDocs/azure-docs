---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 10/03/2023
ms.author: cherylmc
---

If you get a message that says "Failed to add subnet," you can work around this problem. It sometimes occurs in some regions.

1. Go to the **Subnets** page for your virtual network and add a subnet. The subnet name must be **AzureBastionSubnet**. The subnet address range that you specify must be /26 or larger (for example, /25 or /24).
1. Select **Deploy Bastion**.
