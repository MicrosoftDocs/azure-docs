---
title: 'Delete a virtual network gateway: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to delete a virtual network gateway using PowerShell.
author: cherylmc
ms.service: vpn-gateway
ms.date: 08/23/2023
ms.author: cherylmc
ms.topic: how-to 
ms.custom: devx-track-azurepowershell
---
# Delete a virtual network gateway using PowerShell
> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-delete-vnet-gateway-portal.md)
> * [PowerShell](vpn-gateway-delete-vnet-gateway-powershell.md)
> * [PowerShell (classic)](vpn-gateway-delete-vnet-gateway-classic-powershell.md)
>

There are a couple of different approaches you can take when you want to delete a virtual network gateway for a VPN gateway configuration.

* If you want to delete everything and start over, as in the case of a test environment, you can delete the resource group. When you delete a resource group, it deletes all the resources within the group. This is method is only recommended if you don't want to keep any of the resources in the resource group. You can't selectively delete only a few resources using this approach.

* If you want to keep some of the resources in your resource group, deleting a virtual network gateway becomes slightly more complicated. Before you can delete the virtual network gateway, you must first delete any resources that are dependent on the gateway. The steps you follow depend on the type of connections that you created and the dependent resources for each connection.

## <a name="S2S"></a>Delete a site-to-site VPN gateway

To delete a virtual network gateway for a S2S configuration, you must first delete each resource that pertains to the virtual network gateway. Resources must be deleted in a certain order due to dependencies. In the following examples, some of the values must be specified, while other values are an output result. We use the following specific values in the examples for demonstration purposes:

* VNet name: VNet1
* Resource Group name: TestRG1
* Virtual network gateway name: VNet1GW

1. Get the virtual network gateway that you want to delete.

   ```azurepowershell-interactive
   $GW=get-Azvirtualnetworkgateway -Name "VNet1GW" -ResourceGroupName "TestRG1"
   ```

1. Check to see if the virtual network gateway has any connections.

   ```azurepowershell-interactive
   get-Azvirtualnetworkgatewayconnection -ResourceGroupName "TestRG1" | where-object {$_.VirtualNetworkGateway1.Id -eq $GW.Id}
   $Conns=get-Azvirtualnetworkgatewayconnection -ResourceGroupName "TestRG1" | where-object {$_.VirtualNetworkGateway1.Id -eq $GW.Id}
   ```

1. Delete all connections. You may be prompted to confirm the deletion of each of the connections.

   ```azurepowershell-interactive
   $Conns | ForEach-Object {Remove-AzVirtualNetworkGatewayConnection -Name $_.name -ResourceGroupName $_.ResourceGroupName}
   ```

1. Delete the virtual network gateway. You may be prompted to confirm the deletion of the gateway. If you have a P2S configuration to this VNet in addition to your S2S configuration, deleting the virtual network gateway will automatically disconnect all P2S clients without warning.

   ```azurepowershell-interactive
   Remove-AzVirtualNetworkGateway -Name "VNet1GW" -ResourceGroupName "TestRG1"
   ```

   At this point, your virtual network gateway has been deleted. You can use the next steps to delete any resources that are no longer being used.

1. To delete the local network gateways, first get the list of the corresponding local network gateways.

   ```azurepowershell-interactive
   $LNG=Get-AzLocalNetworkGateway -ResourceGroupName "TestRG1" | where-object {$_.Id -In $Conns.LocalNetworkGateway2.Id}
   ```

   Next, delete the local network gateways. You may be prompted to confirm the deletion of each of the local network gateway.

   ```azurepowershell-interactive
   $LNG | ForEach-Object {Remove-AzLocalNetworkGateway -Name $_.Name -ResourceGroupName $_.ResourceGroupName}
   ```

1. To delete the Public IP address resources, first get the IP configurations of the virtual network gateway.

   ```azurepowershell-interactive
   $GWIpConfigs = $Gateway.IpConfigurations
   ```

   Next, get the list of Public IP address resources used for this virtual network gateway. If the virtual network gateway was active-active, you'll see two Public IP addresses.

   ```azurepowershell-interactive
   $PubIP=Get-AzPublicIpAddress | where-object {$_.Id -In $GWIpConfigs.PublicIpAddress.Id}
   ```

   Delete the Public IP resources.

   ```azurepowershell-interactive
   $PubIP | foreach-object {remove-AzpublicIpAddress -Name $_.Name -ResourceGroupName "TestRG1"}
   ```

1. Delete the gateway subnet and set the configuration.

   ```azurepowershell-interactive
   $GWSub = Get-AzVirtualNetwork -ResourceGroupName "TestRG1" -Name "VNet1" | Remove-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet"
   Set-AzVirtualNetwork -VirtualNetwork $GWSub
   ```

## <a name="v2v"></a>Delete a VNet-to-VNet VPN gateway

To delete a virtual network gateway for a V2V configuration, you must first delete each resource that pertains to the virtual network gateway. Resources must be deleted in a certain order due to dependencies. In the following examples, some of the values must be specified, while other values are an output result. We use the following specific values in the examples for demonstration purposes:

* VNet name: VNet1
* Resource Group name: TestRG1
* Virtual network gateway name: VNet1GW

1. Get the virtual network gateway that you want to delete.

   ```azurepowershell-interactive
   $GW=get-Azvirtualnetworkgateway -Name "VNet1GW" -ResourceGroupName "TestRG1"
   ```

1. Check to see if the virtual network gateway has any connections.

   ```azurepowershell-interactive
   get-Azvirtualnetworkgatewayconnection -ResourceGroupName "TestRG1" | where-object {$_.VirtualNetworkGateway1.Id -eq $GW.Id}
   ```

1. There may be other connections to the virtual network gateway that are part of a different resource group. Check for additional connections in each additional resource group. In this example, we're checking for connections from RG2. Run this for each resource group that you have which may have a connection to the virtual network gateway.

   ```azurepowershell-interactive
   get-Azvirtualnetworkgatewayconnection -ResourceGroupName "RG2" | where-object {$_.VirtualNetworkGateway2.Id -eq $GW.Id}
   ```

1. Get the list of connections in both directions. Because this is a VNet-to-VNet configuration, you need the list of connections in both directions.

   ```azurepowershell-interactive
   $ConnsL=get-Azvirtualnetworkgatewayconnection -ResourceGroupName "TestRG1" | where-object {$_.VirtualNetworkGateway1.Id -eq $GW.Id}
   ```

1. In this example, we're checking for connections from RG2. Run this for each resource group that you have which may have a connection to the virtual network gateway.

   ```azurepowershell-interactive
    $ConnsR=get-Azvirtualnetworkgatewayconnection -ResourceGroupName "<NameOfResourceGroup2>" | where-object {$_.VirtualNetworkGateway2.Id -eq $GW.Id}
   ```

1. Delete all connections. You may be prompted to confirm the deletion of each of the connections.

   ```azurepowershell-interactive
   $ConnsL | ForEach-Object {Remove-AzVirtualNetworkGatewayConnection -Name $_.name -ResourceGroupName $_.ResourceGroupName}
   $ConnsR | ForEach-Object {Remove-AzVirtualNetworkGatewayConnection -Name $_.name -ResourceGroupName $_.ResourceGroupName}
   ```

1. Delete the virtual network gateway. You may be prompted to confirm the deletion of the virtual network gateway. If you have P2S configurations to your VNets in addition to your V2V configuration, deleting the virtual network gateways will automatically disconnect all P2S clients without warning.

   ```azurepowershell-interactive
   Remove-AzVirtualNetworkGateway -Name "VNet1GW" -ResourceGroupName "TestRG1"
   ```

   At this point, your virtual network gateway has been deleted. You can use the next steps to delete any resources that are no longer being used.

1. To delete the Public IP address resources, get the IP configurations of the virtual network gateway.

   ```azurepowershell-interactive
   $GWIpConfigs = $Gateway.IpConfigurations
   ```

1. Next, get the list of Public IP address resources used for this virtual network gateway. If the virtual network gateway was active-active, you'll see two Public IP addresses.

   ```azurepowershell-interactive
   $PubIP=Get-AzPublicIpAddress | where-object {$_.Id -In $GWIpConfigs.PublicIpAddress.Id}
   ```

1. Delete the Public IP resources. You may be prompted to confirm the deletion of the Public IP.

   ```azurepowershell-interactive
   $PubIP | foreach-object {remove-AzpublicIpAddress -Name $_.Name -ResourceGroupName "<NameOfResourceGroup1>"}
   ```

1. Delete the gateway subnet and set the configuration.

   ```azurepowershell-interactive
   $GWSub = Get-AzVirtualNetwork -ResourceGroupName "TestRG1" -Name "VNet1" | Remove-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet"
   Set-AzVirtualNetwork -VirtualNetwork $GWSub
   ```

## <a name="deletep2s"></a>Delete a point-to-site VPN gateway

To delete a virtual network gateway for a P2S configuration, you must first delete each resource that pertains to the virtual network gateway. Resources must be deleted in a certain order due to dependencies. When you work with the examples below, some of the values must be specified, while other values are an output result. We use the following specific values in the examples for demonstration purposes:

* VNet name: VNet1
* Resource Group name: TestRG1
* Virtual network gateway name: VNet1GW

>[!NOTE]
> When you delete the VPN gateway, all connected clients will be disconnected from the VNet without warning.

1. Get the virtual network gateway that you want to delete.

   ```azurepowershell-interactive
   GW=get-Azvirtualnetworkgateway -Name "VNet1GW" -ResourceGroupName "TestRG1"
   ```

1. Delete the virtual network gateway. You may be prompted to confirm the deletion of the virtual network gateway.

   ```azurepowershell-interactive
   Remove-AzVirtualNetworkGateway -Name "VNet1GW" -ResourceGroupName "TestRG1"
   ```

   At this point, your virtual network gateway has been deleted. You can use the next steps to delete any resources that are no longer being used.

1. To delete the Public IP address resources, first get the IP configurations of the virtual network gateway.

   ```azurepowershell-interactive
   $GWIpConfigs = $Gateway.IpConfigurations
   ```

   Next, get the list of Public IP addresses used for this virtual network gateway. If the virtual network gateway was active-active, you'll see two Public IP addresses.

   ```azurepowershell-interactive
   $PubIP=Get-AzPublicIpAddress | where-object {$_.Id -In $GWIpConfigs.PublicIpAddress.Id}
   ```

1. Delete the Public IPs. You may be prompted to confirm the deletion of the Public IP.

   ```azurepowershell-interactive
   $PubIP | foreach-object {remove-AzpublicIpAddress -Name $_.Name -ResourceGroupName "<NameOfResourceGroup1>"}
   ```

1. Delete the gateway subnet and set the configuration.

   ```azurepowershell-interactive
   $GWSub = Get-AzVirtualNetwork -ResourceGroupName "TestRG1" -Name "VNet1" | Remove-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet"
   Set-AzVirtualNetwork -VirtualNetwork $GWSub
   ```

## <a name="delete"></a>Delete a VPN gateway by deleting the resource group

If you aren't concerned about keeping any of your resources in the resource group and you just want to start over, you can delete an entire resource group. This is a quick way to remove everything.

1. Get a list of all the resource groups in your subscription.

   ```azurepowershell-interactive
   Get-AzResourceGroup
   ```

1. Locate the resource group that you want to delete.

   Locate the resource group that you want to delete and view the list of resources in that resource group. In the example, the name of the resource group is TestRG1. Modify the example to retrieve a list of all the resources.

   ```azurepowershell-interactive
   Find-AzResource -ResourceGroupNameContains TestRG1
   ```

1. Verify the resources in the list.

   When the list is returned, review it to verify that you want to delete all the resources in the resource group, and the resource group itself. If you want to keep some of the resources in the resource group, use the steps in the earlier sections of this article to delete your gateway.

1. Delete the resource group and resources. To delete the resource group and all the resource contained in the resource group, modify the example and run.

   ```azurepowershell-interactive
   Remove-AzResourceGroup -Name TestRG1
   ```

1. Check the status. It takes some time for Azure to delete all the resources. You can check the status of your resource group by using this cmdlet.

   ```azurepowershell-interactive
   Get-AzResourceGroup -ResourceGroupName TestRG1
   ```

   The result that is returned shows 'Succeeded'.

   ```azurepowershell-interactive
   ResourceGroupName : TestRG1
   Location          : eastus
   ProvisioningState : Succeeded
   ```

## Next steps

For FAQ information, see the [Azure VPN Gateway FAQ](vpn-gateway-vpn-faq.md).