Site-to-Site connections to an on-premises network require a VPN device. There are many different VPN devices that will work with Azure. For information about VPN devices and configuration settings, see [VPN Devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md). Before configuring your VPN device, check for any [Known device compatibility issues](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#known) for the VPN device that you want to use. For specific VPN device configuration information, work with your device manufacturer.

When configuring your VPN device, you will need the following items:

- **The Public IP address** of your virtual network gateway.

	-  To find the Public IP address using the Azure portal, navigate to **Virtual network gateways**, then click the name of your gateway. 

	- To find the Public IP address of your virtual network gateway using PowerShell, use the following example, replacing the values with your own.

    		Get-AzureRmPublicIpAddress -Name GW1PublicIP -ResourceGroupName TestRG
- **A shared key**. This is the same shared key that you will specify when creating your Site-to-Site VPN connection. In our examples, we use a very basic shared key. You should generate a more complex key to use.




