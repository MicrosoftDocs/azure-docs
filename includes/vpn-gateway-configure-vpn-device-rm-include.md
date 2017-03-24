To configure your VPN device, you'll need the public IP address of the virtual network gateway. To find the public IP address of your virtual network gateway using PowerShell, use the following sample:

    Get-AzureRmPublicIpAddress -Name GW1PublicIP -ResourceGroupName TestRG

You can also view the public IP address for your virtual network gateway by using the Azure portal. Navigate to **Virtual network gateways**, then click the name of your gateway.

For specific VPN device configuration information, work with your device manufacturer.

- For more information about VPN devices that work well with Azure, see [VPN Devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md).
- Check for any [Known device compatibility issues](..articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#known) for the VPN device that you want to use.


