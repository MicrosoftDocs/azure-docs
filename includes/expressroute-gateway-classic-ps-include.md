You must create a VNet and a gateway subnet first, before working on the following tasks. See the article [Configure a Virtual Network using the classic portal](../articles/expressroute/expressroute-howto-vnet-portal-classic.md) for more information.   

## Add a gateway
Use the command below to create a gateway. Be sure to substitute any values for your own.

    New-AzureVirtualNetworkGateway -VNetName "MyAzureVNET" -GatewayName "ERGateway" -GatewayType Dedicated -GatewaySKU  Standard

## Verify the gateway was created
Use the command below to verify that the gateway has been created. This command also retrieves the gateway ID, which you need for other operations.

    Get-AzureVirtualNetworkGateway

## Resize a gateway
There are a number of [Gateway SKUs](../articles/expressroute/expressroute-about-virtual-network-gateways.md). You can use the following command to change the Gateway SKU at any time.

> [!IMPORTANT]
> This command doesn't work for UltraPerformance gateway. To change your gateway to an UltraPerformance gateway, first remove the existing ExpressRoute gateway, and then create a new UltraPerformance gateway. To downgrade your gateway from an UltraPerformance gateway, first remove the UltraPerformance gateway, and then create a new gateway. 
> 
> 

    Resize-AzureVirtualNetworkGateway -GatewayId <Gateway ID> -GatewaySKU HighPerformance

## Remove a gateway
Use the command below to remove a gateway

    Remove-AzureVirtualNetworkGateway -GatewayId <Gateway ID>