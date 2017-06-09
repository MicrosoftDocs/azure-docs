You cannot resize your Azure VPN gateways directly between the old (Basic/Standard/HighPerformance) and the new (VpnGw1/VpnGw2/VpnGw3) SKU families. You need to delete the existing (Basic/Standard/HighPerformance) gateway and create a new (VpnGw1/VpnGw2/VpnGw3) gateway with the new SKUs. Note that your Azure Gateway public IP address will change as a result.

1. [Delete the old gateway](../articles/vpn-gateway/vpn-gateway-delete-vnet-gateway-portal.md).
2. [Create the new gateway] (../articles/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md).
3. Update your [on-premises VPN devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md) with the new Azure VPN gateway public IP address.