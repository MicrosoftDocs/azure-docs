
To configure your VPN device, you'll need the public IP address of the virtual network gateway for configuring your on-premises VPN device. Work with your device manufacturer for specific configuration information and configure your device. Refer to the [VPN Devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md) for more information about VPN devices that work well with Azure.

To find the public IP address of your virtual network gateway using PowerShell, use the following sample:

	Get-AzureRmPublicIpAddress -Name GW1PublicIP -ResourceGroupName TestRG

You can also view the public IP address for your virtual network gateway by using the Azure portal. Navigate to **Virtual network gateways**, then click the name of your gateway.