---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/07/2023
 ms.author: cherylmc
 ms.custom: include file
---

If you're working with the Resource Manager deployment model, you can change to the new gateway SKUs. When you change from a legacy gateway SKU to a new SKU, you delete the existing VPN gateway and create a new VPN gateway.

Workflow:

1. Remove any connections to the virtual network gateway.
2. Delete the old VPN gateway.
3. Create the new VPN gateway.
4. Update your on-premises VPN devices with the new VPN gateway IP address (for Site-to-Site connections).
5. Update the gateway IP address value for any VNet-to-VNet local network gateways that connect to this gateway.
6. Download new client VPN configuration packages for P2S clients connecting to the virtual network through this VPN gateway.
7. Recreate the connections to the virtual network gateway.

Considerations:

* To move to the new SKUs, your VPN gateway must be in the Resource Manager deployment model.
* If you have a classic VPN gateway, you must continue using the older legacy SKUs for that gateway, however, you can resize between the legacy SKUs. You can't change to the new SKUs.
* When you change from a legacy SKU to a new SKU, you'll have connectivity downtime.
* When changing to a new gateway SKU, the public IP address for your VPN gateway changes. This happens even if you specify the same public IP address object that you used previously.