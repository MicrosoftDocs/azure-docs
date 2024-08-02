---
ms.author: cherylmc
author: cherylmc
ms.date: 07/08/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

The virtual network gateway requires a specific subnet named **GatewaySubnet**. The gateway subnet is part of the IP address range for your virtual network and contains the IP addresses that the virtual network gateway resources and services use.

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The number of IP addresses needed depends on the VPN gateway configuration that you want to create. Some configurations require more IP addresses than others. It's best to specify /27 or larger (/26, /25, etc.) for your gateway subnet.