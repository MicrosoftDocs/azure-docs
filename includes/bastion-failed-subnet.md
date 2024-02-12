---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 01/18/2024
ms.author: cherylmc
---

If you get a message that says "Failed to add subnet", you need to add the **AzureBastionSubnet** subnet to your virtual network before deploying Bastion. Go to the **Subnets** page for your virtual network and add the AzureBastionSubnet. The subnet name must be **AzureBastionSubnet**. The subnet address range that you specify must be /26 or larger (for example, /25 or /24). After adding this subnet to your virtual network, you can deploy Bastion.