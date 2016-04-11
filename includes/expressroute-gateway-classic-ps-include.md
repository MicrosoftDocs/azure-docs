You must create a VNet and a gateway subnet first, before working on the following tasks. See the article [Configure a Virtual Network using the classic portal](../articles/expressroute/expressroute-howto-vnet-portal-classic.md) for more information.   

## Add a gateway

Use the command below to create a gateway. Be sure to substitute any values for your own.

	New-AzureVirtualNetworkGateway -VNetName "MyAzureVNET" -GatewayName "ERGateway" -GatewayType DynamicRouting -GatewaySKU  Standard

## Verify the gateway was created

Use the command below to verify that the gateway has been created. This command also retrieves the gateway ID, which you need for other operations.

	Get-AzureVirtualNetworkGateway

## Resize a gateway

There are three [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md). You can use the following command to change the Gateway SKU at any time.

	Resize-AzureVirtualNetworkGateway -GatewayId <Gateway ID> -GatewaySKU HighPerformance

## Remove a gateway

Use the command below to remove a gateway

	Remove-AzureVirtualNetworkGateway -GatewayId <Gateway ID>