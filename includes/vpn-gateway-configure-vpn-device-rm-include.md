Site-to-Site connections to an on-premises network require a VPN device. While we don't provide configuration steps for all VPN devices, you may find the information in the following links helpful:

- For information about compatible VPN devices, see [VPN Devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md). 
- For links to device configuration settings, see [Validated VPN Devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#devicetable). The device configuration links are provided on a best-effort basis. It's always best to check with your device manufacturer for the latest configuration information.
- For information about editing device configuration samples, see [Editing samples](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#editing).
- For IPsec/IKE parameters, see [Parameters](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#ipsec).
- Before configuring your VPN device, check for any [Known device compatibility issues](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#known) for the VPN device that you want to use.

When configuring your VPN device, you will need the following items:

- The Public IP address of your virtual network gateway.

	-  To find the Public IP address using the Azure portal, navigate to **Virtual network gateways**, then click the name of your gateway. 
	- To find the Public IP address of your virtual network gateway using PowerShell, use the following example, replacing the values with your own.

    		Get-AzureRmPublicIpAddress -Name GW1PublicIP -ResourceGroupName TestRG
- A shared key. This is the same shared key that you specify when creating your Site-to-Site VPN connection. In our examples, we use a very basic shared key. You should generate a more complex key to use.




