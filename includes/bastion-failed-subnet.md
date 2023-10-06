---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 10/03/2023
ms.author: cherylmc
---

If you get a message saying "Failed to add subnet", you can work around this issue that sometimes occurs in some regions. Go to the **Subnets** page for your VNet and add a subnet. The subnet name must be **AzureBastionSubnet**. The subnet address range specified must be /26 or larger. (/25, /24 etc.) After you add the subnet, you can **Deploy Bastion**.