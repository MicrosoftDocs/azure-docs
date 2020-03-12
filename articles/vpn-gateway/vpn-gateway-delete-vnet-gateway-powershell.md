---
title: 'Azure VPN Gateway: Delete a gateway: PowerShell'
description: Delete a virtual network gateway using PowerShell in the Resource Manager deployment model. 
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.date: 02/07/2019
ms.author: cherylmc
ms.topic: conceptual
---
# Delete a virtual network gateway using PowerShell
> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-delete-vnet-gateway-portal.md)
> * [PowerShell](vpn-gateway-delete-vnet-gateway-powershell.md)
> * [PowerShell (classic)](vpn-gateway-delete-vnet-gateway-classic-powershell.md)
>
>

There are a couple of different approaches you can take when you want to delete a virtual network gateway for a VPN gateway configuration.

- If you want to delete everything and start over, as in the case of a test environment, you can delete the resource group. When you delete a resource group, it deletes all the resources within the group. This is method is only recommended if you don't want to keep any of the resources in the resource group. You can't selectively delete only a few resources using this approach.

- If you want to keep some of the resources in your resource group, deleting a virtual network gateway becomes slightly more complicated. Before you can delete the virtual network gateway, you must first delete any resources that are dependent on the gateway. The steps you follow depend on the type of connections that you created and the dependent resources for each connection.

## Before beginning



### 1. Download the latest Azure Resource Manager PowerShell cmdlets.

Download and install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information about downloading and installing PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

### 2. Connect to your Azure account.

Open your PowerShell console and connect to your account. Use the following example to help you connect:

```powershell
Connect-AzAccount
```

Check the subscriptions for the account.

```powershell
Get-AzSubscription
```

If you have more than one subscription, specify the subscription that you want to use.

```powershell
Select-AzSubscription -SubscriptionName "Replace_with_your_subscription_name"
```

## <a name="S2S"></a>Delete a Site-to-Site VPN gateway

To delete a virtual network gateway for a S2S configuration, you must first delete each resource that pertains to the virtual network gateway. Resources must be deleted in a certain order due to dependencies. When working with the examples below, some of the values must be specified, while other values are an output result. We use the following specific values in the examples for demonstration purposes:

VNet name: VNet1<br>
Resource Group name: RG1<br>
Virtual network gateway name: GW1<br>

The following steps apply to the Resource Manager deployment model.

### 1. Get the virtual network gateway that you want to delete.

```powershell
$GW=get-Azvirtualnetworkgateway -Name "GW1" -ResourceGroupName "RG1"
```

### 2. Check to see if the virtual network gateway has any connections.

```powershell
get-Azvirtualnetworkgatewayconnection -ResourceGroupName "RG1" | where-object {$_.VirtualNetworkGateway1.Id -eq $GW.Id}
$Conns=get-Azvirtualnetworkgatewayconnection -ResourceGroupName "RG1" | where-object {$_.VirtualNetworkGateway1.Id -eq $GW.Id}
```

### 3. Delete all connections.

You may be prompted to confirm the deletion of each of the connections.

```powershell
$Conns | ForEach-Object {Remove-AzVirtualNetworkGatewayConnection -Name $_.name -ResourceGroupName $_.ResourceGroupName}
```

### 4. Delete the virtual network gateway.

You may be prompted to confirm the deletion of the gateway. If you have a P2S configuration to this VNet in addition to your S2S configuration, deleting the virtual network gateway will automatically disconnect all P2S clients without warning.


```powershell
Remove-AzVirtualNetworkGateway -Name "GW1" -ResourceGroupName "RG1"
```

At this point, your virtual network gateway has been deleted. You can use the next steps to delete any resources that are no longer being used.

### 5 Delete the local network gateways.

Get the list of the corresponding local network gateways.

```powershell
$LNG=Get-AzLocalNetworkGateway -ResourceGroupName "RG1" | where-object {$_.Id -In $Conns.LocalNetworkGateway2.Id}
```

Delete the local network gateways. You may be prompted to confirm the deletion of each of the local network gateway.

```powershell
$LNG | ForEach-Object {Remove-AzLocalNetworkGateway -Name $_.Name -ResourceGroupName $_.ResourceGroupName}
```

### 6. Delete the Public IP address resources.

Get the IP configurations of the virtual network gateway.

```powershell
$GWIpConfigs = $Gateway.IpConfigurations
```

Get the list of Public IP address resources used for this virtual network gateway. If the virtual network gateway was active-active, you will see two Public IP addresses.

```powershell
$PubIP=Get-AzPublicIpAddress | where-object {$_.Id -In $GWIpConfigs.PublicIpAddress.Id}
```

Delete the Public IP resources.

```powershell
$PubIP | foreach-object {remove-AzpublicIpAddress -Name $_.Name -ResourceGroupName "RG1"}
```

### 7. Delete the gateway subnet and set the configuration.

```powershell
$GWSub = Get-AzVirtualNetwork -ResourceGroupName "RG1" -Name "VNet1" | Remove-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet"
Set-AzVirtualNetwork -VirtualNetwork $GWSub
```

## <a name="v2v"></a>Delete a VNet-to-VNet VPN gateway

To delete a virtual network gateway for a V2V configuration, you must first delete each resource that pertains to the virtual network gateway. Resources must be deleted in a certain order due to dependencies. When working with the examples below, some of the values must be specified, while other values are an output result. We use the following specific values in the examples for demonstration purposes:

VNet name: VNet1<br>
Resource Group name: RG1<br>
Virtual network gateway name: GW1<br>

The following steps apply to the Resource Manager deployment model.

### 1. Get the virtual network gateway that you want to delete.

```powershell
$GW=get-Azvirtualnetworkgateway -Name "GW1" -ResourceGroupName "RG1"
```

### 2. Check to see if the virtual network gateway has any connections.

```powershell
get-Azvirtualnetworkgatewayconnection -ResourceGroupName "RG1" | where-object {$_.VirtualNetworkGateway1.Id -eq $GW.Id}
```
 
There may be other connections to the virtual network gateway that are part of a different resource group. Check for additional connections in each additional resource group. In this example, we are checking for connections from RG2. Run this for each resource group that you have which may have a connection to the virtual network gateway.

```powershell
get-Azvirtualnetworkgatewayconnection -ResourceGroupName "RG2" | where-object {$_.VirtualNetworkGateway2.Id -eq $GW.Id}
```

### 3. Get the list of connections in both directions.

Because this is a VNet-to-VNet configuration, you need the list of connections in both directions.

```powershell
$ConnsL=get-Azvirtualnetworkgatewayconnection -ResourceGroupName "RG1" | where-object {$_.VirtualNetworkGateway1.Id -eq $GW.Id}
```
 
In this example, we are checking for connections from RG2. Run this for each resource group that you have which may have a connection to the virtual network gateway.

```powershell
 $ConnsR=get-Azvirtualnetworkgatewayconnection -ResourceGroupName "<NameOfResourceGroup2>" | where-object {$_.VirtualNetworkGateway2.Id -eq $GW.Id}
 ```

### 4. Delete all connections.

You may be prompted to confirm the deletion of each of the connections.

```powershell
$ConnsL | ForEach-Object {Remove-AzVirtualNetworkGatewayConnection -Name $_.name -ResourceGroupName $_.ResourceGroupName}
$ConnsR | ForEach-Object {Remove-AzVirtualNetworkGatewayConnection -Name $_.name -ResourceGroupName $_.ResourceGroupName}
```

### 5. Delete the virtual network gateway.

You may be prompted to confirm the deletion of the virtual network gateway. If you have P2S configurations to your VNets in addition to your V2V configuration, deleting the virtual network gateways will automatically disconnect all P2S clients without warning.

```powershell
Remove-AzVirtualNetworkGateway -Name "GW1" -ResourceGroupName "RG1"
```

At this point, your virtual network gateway has been deleted. You can use the next steps to delete any resources that are no longer being used.

### 6. Delete the Public IP address resources

Get the IP configurations of the virtual network gateway.

```powershell
$GWIpConfigs = $Gateway.IpConfigurations
```

Get the list of Public IP address resources used for this virtual network gateway. If the virtual network gateway was active-active, you will see two Public IP addresses.

```powershell
$PubIP=Get-AzPublicIpAddress | where-object {$_.Id -In $GWIpConfigs.PublicIpAddress.Id}
```

Delete the Public IP resources. You may be prompted to confirm the deletion of the Public IP.

```powershell
$PubIP | foreach-object {remove-AzpublicIpAddress -Name $_.Name -ResourceGroupName "<NameOfResourceGroup1>"}
```

### 7. Delete the gateway subnet and set the configuration.

```powershell
$GWSub = Get-AzVirtualNetwork -ResourceGroupName "RG1" -Name "VNet1" | Remove-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet"
Set-AzVirtualNetwork -VirtualNetwork $GWSub
```

## <a name="deletep2s"></a>Delete a Point-to-Site VPN gateway

To delete a virtual network gateway for a P2S configuration, you must first delete each resource that pertains to the virtual network gateway. Resources must be deleted in a certain order due to dependencies. When working with the examples below, some of the values must be specified, while other values are an output result. We use the following specific values in the examples for demonstration purposes:

VNet name: VNet1<br>
Resource Group name: RG1<br>
Virtual network gateway name: GW1<br>

The following steps apply to the Resource Manager deployment model.


>[!NOTE]
> When you delete the VPN gateway, all connected clients will be disconnected from the VNet without warning.
>
>

### 1. Get the virtual network gateway that you want to delete.

```powershell
$GW=get-Azvirtualnetworkgateway -Name "GW1" -ResourceGroupName "RG1"
```

### 2. Delete the virtual network gateway.

You may be prompted to confirm the deletion of the virtual network gateway.

```powershell
Remove-AzVirtualNetworkGateway -Name "GW1" -ResourceGroupName "RG1"
```

At this point, your virtual network gateway has been deleted. You can use the next steps to delete any resources that are no longer being used.

### 3. Delete the Public IP address resources

Get the IP configurations of the virtual network gateway.

```powershell
$GWIpConfigs = $Gateway.IpConfigurations
```

Get the list of Public IP addresses used for this virtual network gateway. If the virtual network gateway was active-active, you will see two Public IP addresses.

```powershell
$PubIP=Get-AzPublicIpAddress | where-object {$_.Id -In $GWIpConfigs.PublicIpAddress.Id}
```

Delete the Public IPs. You may be prompted to confirm the deletion of the Public IP.

```powershell
$PubIP | foreach-object {remove-AzpublicIpAddress -Name $_.Name -ResourceGroupName "<NameOfResourceGroup1>"}
```

### 4. Delete the gateway subnet and set the configuration.

```powershell
$GWSub = Get-AzVirtualNetwork -ResourceGroupName "RG1" -Name "VNet1" | Remove-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet"
Set-AzVirtualNetwork -VirtualNetwork $GWSub
```

## <a name="delete"></a>Delete a VPN gateway by deleting the resource group

If you are not concerned about keeping any of your resources in the resource group and you just want to start over, you can delete an entire resource group. This is a quick way to remove everything. The following steps apply only to the Resource Manager deployment model.

### 1. Get a list of all the resource groups in your subscription.

```powershell
Get-AzResourceGroup
```

### 2. Locate the resource group that you want to delete.

Locate the resource group that you want to delete and view the list of resources in that resource group. In the example, the name of the resource group is RG1. Modify the example to retrieve a list of all the resources.

```powershell
Find-AzResource -ResourceGroupNameContains RG1
```

### 3. Verify the resources in the list.

When the list is returned, review it to verify that you want to delete all the resources in the resource group, as well as the resource group itself. If you want to keep some of the resources in the resource group, use the steps in the earlier sections of this article to delete your gateway.

### 4. Delete the resource group and resources.

To delete the resource group and all the resource contained in the resource group, modify the example and run.

```powershell
Remove-AzResourceGroup -Name RG1
```

### 5. Check the status.

It takes some time for Azure to delete all the resources. You can check the status of your resource group by using this cmdlet.

```powershell
Get-AzResourceGroup -ResourceGroupName RG1
```

The result that is returned shows 'Succeeded'.

```
ResourceGroupName : RG1
Location          : eastus
ProvisioningState : Succeeded
```
