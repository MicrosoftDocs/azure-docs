---
author: cherylmc
ms.author: cherylmc
ms.date: 05/06/2024
ms.service: bastion
ms.topic: include

---

* Private-only Bastion is configured at the time of deployment and requires the Premium SKU Tier.

* You can't change from a regular Bastion deployment to a private-only deployment.

* To deploy private-only Bastion to a virtual network that already has a Bastion deployment, first remove Bastion from your virtual network, then deploy Bastion back to the virtual network as private-only. You don't need to delete and recreate the AzureBastionSubnet.

* If you want to create end-to-end private connectivity, connect using the native client instead of connecting via the Azure portal.

* If you're using ExpressRoute or VPN, enable **IP-based connection** on the Bastion resource when you deploy your bastion host. 