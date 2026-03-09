---
 title: Include file
 description: Include file
 services: vpn-gateway
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 11/27/2023
 ms.author: cherylmc
 ms.custom: include file
---

If you're working with the Azure Resource Manager deployment model, you can change to the new gateway SKUs. When you change from a legacy gateway SKU to a new SKU, you delete the existing VPN gateway and create a new VPN gateway.

Workflow:

1. Remove any connections to the virtual network gateway.
1. Delete the old VPN gateway.
1. Create the new VPN gateway.
1. Update your on-premises VPN devices with the new VPN gateway IP address (for site-to-site connections).
1. Update the gateway IP address value for any network-to-network local network gateways that connect to this gateway.
1. Download new client VPN configuration packages for point-to-site clients that connect to the virtual network through this VPN gateway.
1. Re-create the connections to the virtual network gateway.

Considerations:

* To move to the new SKUs, your VPN gateway must be in the Resource Manager deployment model.
* If you have a classic VPN gateway, you must continue to use the older legacy SKUs for that gateway. You can resize between the legacy SKUs. You can't change to the new SKUs.
* When you change from a legacy SKU to a new SKU, you'll have connectivity downtime.
* When you change to a new gateway SKU, the public IP address for your VPN gateway changes. This change happens even if you specified the same public IP address object that you used previously.
