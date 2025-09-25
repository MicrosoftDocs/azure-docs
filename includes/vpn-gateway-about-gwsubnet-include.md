---
 ms.topic: include
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 06/30/2025
 ms.author: cherylmc
---

Virtual network gateway resources are deployed to a specific subnet named **GatewaySubnet**. The gateway subnet is part of the virtual network IP address range that you specify when you configure your virtual network.

If you don't have a subnet named **GatewaySubnet**, when you create your VPN gateway, it fails. We recommend that you create a gateway subnet that uses a /27 (or larger). For example, /27 or /26. For more information about the gateway subnet, see [VPN Gateway settings - Gateway Subnet](../articles/vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsub).