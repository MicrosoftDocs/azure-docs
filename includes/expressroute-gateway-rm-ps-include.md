---
 title: include file
 description: include file
 services: expressroute
 author: cherylmc
 ms.service: expressroute
 ms.topic: include
 ms.date: 02/21/2019
 ms.author: cherylmc
 ms.custom: include file
---

The steps for this task use a VNet based on the values in the following configuration reference list. Additional settings and names are also outlined in this list. We don't use this list directly in any of the steps, although we do add variables based on the values in this list. You can copy the list to use as a reference, replacing the values with your own.

* Virtual Network Name = "TestVNet"
* Virtual Network address space = 192.168.0.0/16
* Resource Group = "TestRG"
* Subnet1 Name = "FrontEnd" 
* Subnet1 address space = "192.168.1.0/24"
* Gateway Subnet name: "GatewaySubnet" You must always name a gateway subnet *GatewaySubnet*.
* Gateway Subnet address space = "192.168.200.0/26"
* Region = "East US"
* Gateway Name = "GW"
* Gateway IP Name = "GWIP"
* Gateway IP configuration Name = "gwipconf"
* Type = "ExpressRoute" This type is required for an ExpressRoute configuration.
* Gateway Public IP Name = "gwpip"

## Add a gateway
1. Connect to your Azure Subscription.

   [!INCLUDE [Sign in](expressroute-cloud-shell-connect.md)]
2. Declare your variables for this exercise. Be sure to edit the sample to reflect the settings that you want to use.

   ```azurepowershell-interactive 
   $RG = "TestRG"
   $Location = "East US"
   $GWName = "GW"
   $GWIPName = "GWIP"
   $GWIPconfName = "gwipconf"
   $VNetName = "TestVNet"
   ```
3. Store the virtual network object as a variable.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $RG
   ```
4. Add a gateway subnet to your Virtual Network. The gateway subnet must be named "GatewaySubnet". You should create a gateway subnet that is /27 or larger (/26, /25, etc.).

   ```azurepowershell-interactive
   Add-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix 192.168.200.0/26
   ```
5. Set the configuration.

   ```azurepowershell-interactive
   $vnet = Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```
6. Store the gateway subnet as a variable.

   ```azurepowershell-interactive
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
   ```
7. Request a public IP address. The IP address is requested before creating the gateway. You cannot specify the IP address that you want to use; it’s dynamically allocated. You'll use this IP address in the next configuration section. The AllocationMethod must be Dynamic.

   ```azurepowershell-interactive
   $pip = New-AzPublicIpAddress -Name $GWIPName  -ResourceGroupName $RG -Location $Location -AllocationMethod Dynamic
   ```
8. Create the configuration for your gateway. The gateway configuration defines the subnet and the public IP address to use. In this step, you are specifying the configuration that will be used when you create the gateway. This step does not actually create the gateway object. Use the sample below to create your gateway configuration.

   ```azurepowershell-interactive
   $ipconf = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet -PublicIpAddress $pip
   ```
9. Create the gateway. In this step, the **-GatewayType** is especially important. You must use the value **ExpressRoute**. After running these cmdlets, the gateway can take 45 minutes or more to create.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location -IpConfigurations $ipconf -GatewayType Expressroute -GatewaySku Standard
   ```

## Verify the gateway was created
Use the following commands to verify that the gateway has been created:

```azurepowershell-interactive
Get-AzVirtualNetworkGateway -ResourceGroupName $RG
```

## Resize a gateway
There are a number of [Gateway SKUs](../articles/expressroute/expressroute-about-virtual-network-gateways.md). You can use the following command to change the Gateway SKU at any time.

> [!IMPORTANT]
> This command doesn't work for UltraPerformance gateway. To change your gateway to an UltraPerformance gateway, first remove the existing ExpressRoute gateway, and then create a new UltraPerformance gateway. To downgrade your gateway from an UltraPerformance gateway, first remove the UltraPerformance gateway, and then create a new gateway.
> 
> 

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
Resize-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku HighPerformance
```

## Remove a gateway
Use the following command to remove a gateway:

```azurepowershell-interactive
Remove-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
```
