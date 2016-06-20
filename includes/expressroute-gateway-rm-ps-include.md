The steps for this task use a VNet based on the values below. Additional settings and names are also outlined in this list. We don't use this list directly in any of the steps, although we do add variables based on the values in this list. You can copy the list to use as a reference, replacing the values with your own.

Configuration reference list:
	
- Virtual Network Name = "TestVNet"
- Virtual Network address space = 192.168.0.0/16
- Resource Group = "TestRG"
- Subnet1 Name = "FrontEnd" 
- Subnet1 address space = "192.168.0.0/16"
- Gateway Subnet name: "GatewaySubnet" You must always name a gateway subnet *GatewaySubnet*.
- Gateway Subnet address space = "192.168.200.0/26"
- Region = "East US"
- Gateway Name = "GW"
- Gateway IP Name = "GWIP"
- Gateway IP configuration Name = "gwipconf"
-  Type = "ExpressRoute" This type is required for an ExpressRoute configuration.
- Gateway Public IP Name = "gwpip"


## Add a gateway

1. Connect to your Azure Subscription. 

		Login-AzureRmAccount
		Get-AzureRmSubscription 
		Select-AzureRmSubscription -SubscriptionName "Name of subscription"

2. Declare your variables for this exercise. This example will use the use the variables in the sample below. Be sure to edit this to reflect the settings that you want to use. 
		
		$RG = "TestRG"
		$Location = "East US"
		$GWName = "GW"
		$GWIPName = "GWIP"
		$GWIPconfName = "gwipconf"
		$VNetName = "TestVNet"

3. Store the virtual network object as a variable.

		$vnet = Get-AzureRmVirtualNetwork -Name $VNetName -ResourceGroupName $RG

4. Add a gateway subnet to your Virtual Network. The gateway subnet must be named "GatewaySubnet". You'll want to create a gateway that is /27 or larger (/26, /25, etc.).
			
		Add-AzureRmVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix 192.168.200.0/26

5. Set the configuration.

			Set-AzureRmVirtualNetwork -VirtualNetwork $vnet

6. Store the gateway subnet as a variable.

		$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet

7. Request a public IP address. The IP address is requested before creating the gateway. You cannot specify the IP address that you want to use; it’s dynamically allocated. You'll use this IP address in the next configuration section. The AllocationMethod must be Dynamic.

		$pip = New-AzureRmPublicIpAddress -Name gwpip -ResourceGroupName $RG -Location $Location -AllocationMethod Dynamic

8. Create the configuration for your gateway. The gateway configuration defines the subnet and the public IP address to use. In this step, you are specifying the configuration that will be used when you create the gateway. This step does not actually create the gateway object. Use the sample below to create your gateway configuration. 

		$ipconf = New-AzureRmVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet -PublicIpAddress $pip

9. Create the gateway. In this step, the **-GatewayType** is especially important. You must use the value **ExpressRoute**. Note that after running these cmdlets, the gateway can take 20 minutes or more to create.

		New-AzureRmVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location -IpConfigurations $ipconf -GatewayType Expressroute -GatewaySku Standard

## Verify the gateway was created

Use the command below to verify that the gateway has been created.

	Get-AzureRmVirtualNetworkGateway -ResourceGroupName $RG

## Resize a gateway

There are three [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md). You can use the following command to change the Gateway SKU at any time.

	$gw = Get-AzureRmVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
	Resize-AzureRmVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku HighPerformance

## Remove a gateway

Use the command below to remove a gateway

	Remove-AzureRmVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG  
