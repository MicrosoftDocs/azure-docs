---
title: Deploy and configure Azure Firewall in a hybrid network by using PowerShell
description: Deploy and configure Azure Firewall in a hybrid network by using Azure PowerShell.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: devx-track-azurepowershell
# Customer intent: "As a network administrator, I want to deploy and configure Azure Firewall in a hybrid network using PowerShell, so that I can control access between on-premises and Azure virtual networks effectively."
---

# Deploy and configure Azure Firewall in a hybrid network by using Azure PowerShell

When you connect your on-premises network to an Azure virtual network to create a hybrid network, the ability to control access to your Azure network resources is an important part of an overall security plan.

You can use Azure Firewall to control network access in a hybrid network by using rules that define allowed and denied network traffic.

For this article, you create three virtual networks:

- **VNet-Hub**: The firewall is in this virtual network.
- **VNet-Spoke**: The spoke virtual network represents the workload located on Azure.
- **VNet-Onprem**: The on-premises virtual network represents an on-premises network. In an actual deployment, you can connect to it by using either a virtual private network (VPN) connection or an Azure ExpressRoute connection. For simplicity, this article uses a VPN gateway connection, and an Azure-located virtual network represents an on-premises network.

:::image type="content" source="media/tutorial-hybrid-ps/hybrid-network-firewall.png" alt-text="Diagram that shows a firewall in a hybrid network." lightbox="media/tutorial-hybrid-ps/hybrid-network-firewall.png":::

If you want to use the Azure portal instead to complete the procedures in this article, see [Deploy and configure Azure Firewall in a hybrid network by using the Azure portal](tutorial-hybrid-portal.md).

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Prerequisites

This article requires that you run PowerShell locally. You must have the Azure PowerShell module installed. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell). After you verify the PowerShell version, run `Connect-AzAccount` to create a connection with Azure.

Three key requirements ensure this scenario works correctly:

- A user-defined route (UDR) on the spoke subnet points to the Azure Firewall IP address as the default gateway. You must *disable* virtual network gateway route propagation on this route table.
- A UDR on the hub gateway subnet points to the firewall IP address as the next hop to the spoke networks.

- No UDR is required on the Azure Firewall subnet, because it learns routes from Border Gateway Protocol (BGP).
- Set `AllowGatewayTransit` when you're peering **VNet-Hub** to **VNet-Spoke**. Set `UseRemoteGateways` when you're peering **VNet-Spoke** to **VNet-Hub**.

The [Create the routes](#create-the-routes) section later in this article shows how to create these routes.

> [!NOTE]
> Azure Firewall must have direct internet connectivity. If your **AzureFirewallSubnet** subnet learns a default route to your on-premises network via BGP, you must configure Azure Firewall in forced tunneling mode. If this is an existing Azure Firewall instance that can't be reconfigured in forced tunneling mode, add a 0.0.0.0/0 UDR on the **AzureFirewallSubnet** subnet with the `NextHopType` value set as `Internet` to maintain direct internet connectivity.
>
> For more information, see [Azure Firewall forced tunneling](forced-tunneling.md).

Traffic between directly peered virtual networks is routed directly, even if a UDR points to Azure Firewall as the default gateway. To send subnet-to-subnet traffic to the firewall in this scenario, a UDR must contain the target subnet network prefix explicitly on both subnets.

Use [New-AzFirewall](/powershell/module/az.network/new-azfirewall) as the primary cmdlet to deploy and configure the firewall throughout this article.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Declare the variables

The following example declares the variables by using the values for this article. In some cases, you might need to replace some values with your own values to work in your subscription. Modify the variables if needed, and then copy and paste them into your PowerShell console.

```azurepowershell
$RG1 = "FW-Hybrid-Test"
$Location1 = "East US"

# Variables for the firewall hub virtual network

$VNetnameHub = "VNet-Hub"
$SNnameHub = "AzureFirewallSubnet"
$VNetHubPrefix = "10.5.0.0/16"
$SNHubPrefix = "10.5.0.0/24"
$SNGWHubPrefix = "10.5.1.0/24"
$GWHubName = "GW-hub"
$GWHubpipName = "VNet-Hub-GW-pip"
$GWIPconfNameHub = "GW-ipconf-hub"
$ConnectionNameHub = "hub-to-Onprem"

# Variables for the spoke virtual network

$VnetNameSpoke = "VNet-Spoke"
$SNnameSpoke = "SN-Workload"
$VNetSpokePrefix = "10.6.0.0/16"
$SNSpokePrefix = "10.6.0.0/24"
$SNSpokeGWPrefix = "10.6.1.0/24"

# Variables for the on-premises virtual network

$VNetnameOnprem = "Vnet-Onprem"
$SNNameOnprem = "SN-Corp"
$VNetOnpremPrefix = "192.168.0.0/16"
$SNOnpremPrefix = "192.168.1.0/24"
$SNGWOnpremPrefix = "192.168.2.0/24"
$GWOnpremName = "GW-Onprem"
$GWIPconfNameOnprem = "GW-ipconf-Onprem"
$ConnectionNameOnprem = "Onprem-to-hub"
$GWOnprempipName = "VNet-Onprem-GW-pip"

$SNnameGW = "GatewaySubnet"
```

## Create the virtual networks

### Create the hub virtual network

Use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to create the resource group for this article:

```azurepowershell
New-AzResourceGroup `
    -Name $RG1 `
    -Location $Location1
```

Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) and [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to define the subnets and create the hub virtual network:

```azurepowershell
$FWsub = New-AzVirtualNetworkSubnetConfig `
    -Name $SNnameHub `
    -AddressPrefix $SNHubPrefix

$GWsub = New-AzVirtualNetworkSubnetConfig `
    -Name $SNnameGW `
    -AddressPrefix $SNGWHubPrefix

$VNetHub = New-AzVirtualNetwork `
    -Name $VNetnameHub `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -AddressPrefix $VNetHubPrefix `
    -Subnet $FWsub,$GWsub
```

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to request a public IP address for the VPN gateway. Set the `AllocationMethod` value to `Dynamic`, which means Azure dynamically allocates the address.

```azurepowershell
$gwpip1 = New-AzPublicIpAddress `
    -Name $GWHubpipName `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -AllocationMethod Dynamic
```

### Create the spoke virtual network

Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) and [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to define the subnets and create the spoke virtual network:

```azurepowershell
$Spokesub = New-AzVirtualNetworkSubnetConfig `
    -Name $SNnameSpoke `
    -AddressPrefix $SNSpokePrefix
$GWsubSpoke = New-AzVirtualNetworkSubnetConfig `
    -Name $SNnameGW `
    -AddressPrefix $SNSpokeGWPrefix
$VNetSpoke = New-AzVirtualNetwork `
    -Name $VnetNameSpoke `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -AddressPrefix $VNetSpokePrefix `
    -Subnet $Spokesub,$GWsubSpoke
```

### Create the on-premises virtual network

Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) and [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to define the subnets and create the on-premises virtual network:

```azurepowershell
$Onpremsub = New-AzVirtualNetworkSubnetConfig `
    -Name $SNNameOnprem `
    -AddressPrefix $SNOnpremPrefix
$GWOnpremsub = New-AzVirtualNetworkSubnetConfig `
    -Name $SNnameGW `
    -AddressPrefix $SNGWOnpremPrefix
$VNetOnprem = New-AzVirtualNetwork `
    -Name $VNetnameOnprem `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -AddressPrefix $VNetOnpremPrefix `
    -Subnet $Onpremsub,$GWOnpremsub
```

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to request a public IP address for the on-premises virtual network gateway:

```azurepowershell
$gwOnprempip = New-AzPublicIpAddress `
    -Name $GWOnprempipName `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -AllocationMethod Dynamic
```

## Configure and deploy the firewall

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) and [New-AzFirewall](/powershell/module/az.network/new-azfirewall) to deploy the firewall into the hub virtual network:

```azurepowershell
# Get a public IP for the firewall
$FWpip = New-AzPublicIpAddress `
    -Name "fw-pip" `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -AllocationMethod Static `
    -Sku Standard
# Create the firewall
$Azfw = New-AzFirewall `
    -Name AzFW01 `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -VirtualNetworkName $VNetnameHub `
    -PublicIpName fw-pip

# Save the firewall private IP address for future use
$AzfwPrivateIP = $Azfw.IpConfigurations.privateipaddress
$AzfwPrivateIP
```

Use [New-AzFirewallNetworkRule](/powershell/module/az.network/new-azfirewallnetworkrule) and [New-AzFirewallNetworkRuleCollection](/powershell/module/az.network/new-azfirewallnetworkrulecollection) to configure network rules. Then, use [Set-AzFirewall](/powershell/module/az.network/set-azfirewall) to apply them:

```azurepowershell
$Rule1 = New-AzFirewallNetworkRule `
    -Name "AllowWeb" `
    -Protocol TCP `
    -SourceAddress $SNOnpremPrefix `
    -DestinationAddress $VNetSpokePrefix `
    -DestinationPort 80

$Rule2 = New-AzFirewallNetworkRule `
    -Name "AllowRDP" `
    -Protocol TCP `
    -SourceAddress $SNOnpremPrefix `
    -DestinationAddress $VNetSpokePrefix `
    -DestinationPort 3389

$Rule3 = New-AzFirewallNetworkRule `
    -Name "AllowPing" `
    -Protocol ICMP `
    -SourceAddress $SNOnpremPrefix `
    -DestinationAddress $VNetSpokePrefix `
    -DestinationPort *

$NetRuleCollection = New-AzFirewallNetworkRuleCollection `
    -Name RCNet01 `
    -Priority 100 `
    -Rule $Rule1,$Rule2,$Rule3 `
    -ActionType "Allow"
$Azfw.NetworkRuleCollections = $NetRuleCollection
Set-AzFirewall -AzureFirewall $Azfw
```

## Create and connect the VPN gateways

You connect the hub and on-premises virtual networks through VPN gateways.

### Create a VPN gateway for the hub virtual network

Use [New-AzVirtualNetworkGatewayIpConfig](/powershell/module/az.network/new-azvirtualnetworkgatewayipconfig) to create the VPN gateway configuration for the hub virtual network. The configuration defines the subnet and the public IP address to use.

```azurepowershell
$vnet1 = Get-AzVirtualNetwork `
    -Name $VNetnameHub `
    -ResourceGroupName $RG1
$subnet1 = Get-AzVirtualNetworkSubnetConfig `
    -Name "GatewaySubnet" `
    -VirtualNetwork $vnet1
$gwipconf1 = New-AzVirtualNetworkGatewayIpConfig `
    -Name $GWIPconfNameHub `
    -Subnet $subnet1 `
    -PublicIpAddress $gwpip1
```

Use [New-AzVirtualNetworkGateway](/powershell/module/az.network/new-azvirtualnetworkgateway) to create the VPN gateway for the hub virtual network. Network-to-network configurations require a `VpnType` value of `RouteBased`. Creating a VPN gateway can often take 45 minutes or more, depending on the SKU that you select.

```azurepowershell
New-AzVirtualNetworkGateway `
    -Name $GWHubName `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -IpConfigurations $gwipconf1 `
    -GatewayType Vpn `
    -VpnType RouteBased `
    -GatewaySku basic
```

### Create a VPN gateway for the on-premises virtual network

Use [New-AzVirtualNetworkGatewayIpConfig](/powershell/module/az.network/new-azvirtualnetworkgatewayipconfig) to create the VPN gateway configuration for the on-premises virtual network. The configuration defines the subnet and the public IP address to use.

```azurepowershell
$vnet2 = Get-AzVirtualNetwork `
    -Name $VNetnameOnprem `
    -ResourceGroupName $RG1
$subnet2 = Get-AzVirtualNetworkSubnetConfig `
    -Name "GatewaySubnet" `
    -VirtualNetwork $vnet2
$gwipconf2 = New-AzVirtualNetworkGatewayIpConfig `
    -Name $GWIPconfNameOnprem `
    -Subnet $subnet2 `
    -PublicIpAddress $gwOnprempip
```

Use [New-AzVirtualNetworkGateway](/powershell/module/az.network/new-azvirtualnetworkgateway) to create the VPN gateway for the on-premises virtual network:

```azurepowershell
New-AzVirtualNetworkGateway `
    -Name $GWOnpremName `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -IpConfigurations $gwipconf2 `
    -GatewayType Vpn `
    -VpnType RouteBased `
    -GatewaySku basic
```

### Create the VPN connections

Create the VPN connections between the hub and on-premises gateways.

#### Create the connections

Use [Get-AzVirtualNetworkGateway](/powershell/module/az.network/get-azvirtualnetworkgateway) to retrieve the gateway objects, then use [New-AzVirtualNetworkGatewayConnection](/powershell/module/az.network/new-azvirtualnetworkgatewayconnection) to create the connections. The examples show a shared key, but you can use your own values. The important thing is that the shared key matches for both connections. Creating a connection can take a short while to complete.

```azurepowershell
$vnetHubgw = Get-AzVirtualNetworkGateway `
    -Name $GWHubName `
    -ResourceGroupName $RG1
$vnetOnpremgw = Get-AzVirtualNetworkGateway `
    -Name $GWOnpremName `
    -ResourceGroupName $RG1
New-AzVirtualNetworkGatewayConnection `
    -Name $ConnectionNameHub `
    -ResourceGroupName $RG1 `
    -VirtualNetworkGateway1 $vnetHubgw `
    -VirtualNetworkGateway2 $vnetOnpremgw `
    -Location $Location1 `
    -ConnectionType Vnet2Vnet `
    -SharedKey 'AzureA1b2C3'
```

Create the virtual network connection from on-premises to the hub. This step is similar to the previous one, except that you create the connection from **VNet-Onprem** to **VNet-Hub**. Make sure that the shared keys match. The connection is established after a few minutes.

```azurepowershell
New-AzVirtualNetworkGatewayConnection `
    -Name $ConnectionNameOnprem `
    -ResourceGroupName $RG1 `
    -VirtualNetworkGateway1 $vnetOnpremgw `
    -VirtualNetworkGateway2 $vnetHubgw `
    -Location $Location1 `
    -ConnectionType Vnet2Vnet `
    -SharedKey 'AzureA1b2C3'
```

#### Verify the connection

You can verify a successful connection by using the `Get-AzVirtualNetworkGatewayConnection` cmdlet, with or without `-Debug`.

Use the following cmdlet example, but configure the values to match your own. If you're prompted, select `A` to run `All`. In the example, `-Name` refers to the name of the connection that you want to test.

```azurepowershell
Get-AzVirtualNetworkGatewayConnection `
    -Name $ConnectionNameHub `
    -ResourceGroupName $RG1
```

After the cmdlet finishes, view the values. The following example shows a connection status of `Connected`, along with ingress and egress bytes:

```output
"connectionStatus": "Connected",
"ingressBytesTransferred": 33509044,
"egressBytesTransferred": 4142431
```

## Peer the hub and spoke virtual networks

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to peer the hub and spoke virtual networks:

```azurepowershell
# Peer hub to spoke
Add-AzVirtualNetworkPeering `
    -Name HubtoSpoke `
    -VirtualNetwork $VNetHub `
    -RemoteVirtualNetworkId $VNetSpoke.Id `
    -AllowGatewayTransit

# Peer spoke to hub
Add-AzVirtualNetworkPeering `
    -Name SpoketoHub `
    -VirtualNetwork $VNetSpoke `
    -RemoteVirtualNetworkId $VNetHub.Id `
    -AllowForwardedTraffic `
    -UseRemoteGateways
```

## Create the routes

Use the following commands to create these routes:

- A route from the hub gateway subnet to the spoke subnet through the firewall IP address
- A default route from the spoke subnet through the firewall IP address

Use [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) and [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig) to create the route table and route for the hub gateway subnet. Then, use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to associate it with the subnet:

```azurepowershell
$routeTableHubSpoke = New-AzRouteTable `
    -Name 'UDR-Hub-Spoke' `
    -ResourceGroupName $RG1 `
    -Location $Location1

Get-AzRouteTable `
    -ResourceGroupName $RG1 `
    -Name UDR-Hub-Spoke `
    | Add-AzRouteConfig `
    -Name "ToSpoke" `
    -AddressPrefix $VNetSpokePrefix `
    -NextHopType "VirtualAppliance" `
    -NextHopIpAddress $AzfwPrivateIP `
    | Set-AzRouteTable

Set-AzVirtualNetworkSubnetConfig `
    -VirtualNetwork $VNetHub `
    -Name $SNnameGW `
    -AddressPrefix $SNGWHubPrefix `
    -RouteTable $routeTableHubSpoke `
    | Set-AzVirtualNetwork
```

Use [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) and [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig) to create the default route table for the spoke subnet. The `-DisableBgpRoutePropagation` parameter disables virtual network gateway route propagation on this route table. Then, use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to associate it with the subnet:

```azurepowershell
$routeTableSpokeDG = New-AzRouteTable `
    -Name 'UDR-DG' `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -DisableBgpRoutePropagation

Get-AzRouteTable `
    -ResourceGroupName $RG1 `
    -Name UDR-DG `
    | Add-AzRouteConfig `
    -Name "ToFirewall" `
    -AddressPrefix 0.0.0.0/0 `
    -NextHopType "VirtualAppliance" `
    -NextHopIpAddress $AzfwPrivateIP `
    | Set-AzRouteTable

Set-AzVirtualNetworkSubnetConfig `
    -VirtualNetwork $VNetSpoke `
    -Name $SNnameSpoke `
    -AddressPrefix $SNSpokePrefix `
    -RouteTable $routeTableSpokeDG `
    | Set-AzVirtualNetwork
```

## Create virtual machines

Create the spoke workload and on-premises virtual machines, and place them in the appropriate subnets.

### Create the workload virtual machine

Create a virtual machine in the spoke virtual network that runs Internet Information Services (IIS), has no public IP address, and allows pings in. When you're prompted, enter a username and password for the virtual machine.

Use [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) and [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) to create the inbound rules and security group:

```azurepowershell
# Create inbound network security group rules for ports 3389 and 80
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig `
    -Name Allow-RDP `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 200 `
    -SourceAddressPrefix * `
    -SourcePortRange * `
    -DestinationAddressPrefix $SNSpokePrefix `
    -DestinationPortRange 3389 `
    -Access Allow
$nsgRuleWeb = New-AzNetworkSecurityRuleConfig `
    -Name Allow-web `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 202 `
    -SourceAddressPrefix * `
    -SourcePortRange * `
    -DestinationAddressPrefix $SNSpokePrefix `
    -DestinationPortRange 80 `
    -Access Allow

# Create the network security group
$nsg = New-AzNetworkSecurityGroup `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -Name NSG-Spoke02 `
    -SecurityRules $nsgRuleRDP,$nsgRuleWeb
```

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) to create the NIC and attach it to the security group:

```azurepowershell
$NIC = New-AzNetworkInterface `
    -Name spoke-01 `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -SubnetId $VnetSpoke.Subnets[0].Id `
    -NetworkSecurityGroupId $nsg.Id
```

Use [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig), [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem), and [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface) to define the virtual machine configuration, then use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the virtual machine:

```azurepowershell
$VirtualMachine = New-AzVMConfig `
    -VMName VM-Spoke-01 `
    -VMSize "Standard_DS2"
$VirtualMachine = Set-AzVMOperatingSystem `
    -VM $VirtualMachine `
    -Windows `
    -ComputerName Spoke-01 `
    -ProvisionVMAgent `
    -EnableAutoUpdate
$VirtualMachine = Add-AzVMNetworkInterface `
    -VM $VirtualMachine `
    -Id $NIC.Id
$VirtualMachine = Set-AzVMSourceImage `
    -VM $VirtualMachine `
    -PublisherName 'MicrosoftWindowsServer' `
    -Offer 'WindowsServer' `
    -Skus '2016-Datacenter' `
    -Version latest

New-AzVM `
    -ResourceGroupName $RG1 `
    -Location $Location1 `
    -VM $VirtualMachine `
    -Verbose
```

Use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) to install IIS and create a Windows Firewall rule to allow pings:

```azurepowershell
# Install IIS
Set-AzVMExtension `
    -ResourceGroupName $RG1 `
    -ExtensionName IIS `
    -VMName VM-Spoke-01 `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.4 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server"}' `
    -Location $Location1

# Create a Windows Firewall rule to allow pings
Set-AzVMExtension `
    -ResourceGroupName $RG1 `
    -ExtensionName AllowPing `
    -VMName VM-Spoke-01 `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.4 `
    -SettingString '{"commandToExecute":"powershell New-NetFirewallRule -DisplayName \"Allow ICMPv4-In\" -Protocol ICMPv4"}' `
    -Location $Location1
```

### Create the on-premises virtual machine

Use [New-AzVm](/powershell/module/az.compute/new-azvm) to create a simple virtual machine that you can use to connect through remote access to the public IP address. From there, you can connect to the on-premises server through the firewall. When prompted, enter a username and password for the virtual machine.

```azurepowershell
New-AzVm `
    -ResourceGroupName $RG1 `
    -Name "VM-Onprem" `
    -Location $Location1 `
    -VirtualNetworkName $VNetnameOnprem `
    -SubnetName $SNNameOnprem `
    -OpenPorts 3389 `
    -Size "Standard_DS2"
```

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Test the firewall

1. Get and note the private IP address for the **VM-spoke-01** virtual machine:

   ```azurepowershell
   $NIC.IpConfigurations.privateipaddress
   ```

1. From the Azure portal, connect to the **VM-Onprem** virtual machine.

1. Open a Windows PowerShell command prompt on **VM-Onprem**, and ping the private IP for **VM-spoke-01**. You get a reply.

1. Open a web browser on **VM-Onprem**, and browse to `http://<VM-spoke-01 private IP>`. The IIS default page should open.

1. From **VM-Onprem**, open a remote access connection to **VM-spoke-01** at the private IP address. Your connection should succeed, and you should be able to sign in by using your chosen username and password.

After you verify that the firewall rules are working, you can:

- Ping the server on the spoke virtual network.
- Browse to the web server on the spoke virtual network.
- Connect to the server on the spoke virtual network by using RDP.

Next, run the following script to change the action for the collection of firewall network rules to `Deny`:

```azurepowershell
$rcNet = $Azfw.GetNetworkRuleCollectionByName("RCNet01")
$rcNet.action.type = "Deny"

Set-AzFirewall -AzureFirewall $Azfw
```

Close any existing remote access connections. Run the tests again to test the changed rules. They should all fail this time.

## Clean up resources

You can keep your firewall resources for the next tutorial. If you no longer need them, delete the **FW-Hybrid-Test** resource group to delete all firewall-related resources.

## Next steps

[Monitor Azure Firewall logs](./firewall-diagnostics.md)
