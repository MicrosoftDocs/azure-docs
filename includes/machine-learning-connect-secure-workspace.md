---
author: Blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 08/26/2021
ms.author: larryfr
---

To connect to a workspace that's secured behind a VNet, use one of the following methods:

* [Azure VPN gateway](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md) - Connects on-premises networks to the VNet over a private connection. Connection is made over the public internet. There are two types of VPN gateways that you might use:

    * [Point-to-site](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md): Each client computer uses a VPN client to connect to the VNet.
    * [Site-to-site](../articles/vpn-gateway/tutorial-site-to-site-portal.md): A VPN device connects the VNet to your on-premises network.

* [ExpressRoute](https://azure.microsoft.com/services/expressroute/) - Connects on-premises networks into the cloud over a private connection. Connection is made using a connectivity provider.
* [Azure Bastion](../articles/bastion/bastion-overview.md) - In this scenario, you create an Azure Virtual Machine (sometimes called a jump box) inside the VNet. You then connect to the VM using Azure Bastion. Bastion allows you to connect to the VM using either an RDP or SSH session from your local web browser. You then use the jump box as your development environment. Since it is inside the VNet, it can directly access the workspace. For an example of using a jump box, see [Tutorial: Create a secure workspace](../articles/machine-learning/tutorial-create-secure-workspace.md).

> [!IMPORTANT]
> When using a __VPN gateway__ or __ExpressRoute__, you will need to plan how name resolution works between your on-premises resources and those in the VNet. For more information, see [Use a custom DNS server](../articles/machine-learning/how-to-custom-dns.md).

If you have problems connecting to the workspace, see [Troubleshoot secure workspace connectivity](../articles/machine-learning/how-to-troubleshoot-secure-connection-workspace.md).