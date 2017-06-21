You cannot resize your Azure VPN gateways directly between the old (Basic/Standard/HighPerformance) and the new (VpnGw1/VpnGw2/VpnGw3) SKU families. To change to the new SKU family, you need to delete the existing (Basic/Standard/HighPerformance) virtual network gateway, and then create a new gateway using the new SKUs. When you create a new gateway, the public IP address will change as a result.

The workflow is:

1. Remove any connections to the virtual network gateway.
2. Delete the old VPN gateway.
3. Create a new VPN gateway.
4. Update your on-premises VPN devices with the new gateway IP (for Site-to-Site).
5. Update the gateway IP address value for any VNet-to-VNet local network gateways that will connect to this gateway.
6. Download new client VPN configuration packages for Point-to-Site clients connecting to the virtual network through this VPN gateway.
7. Create the connections to the virtual network gateway.