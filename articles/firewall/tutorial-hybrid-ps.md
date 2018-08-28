---
title: Deploy and configure Azure Firewall in a hybid network using Azure PowerShell
description: In this tutorial, you learn how to deploy and configure Azure Firewall using the Azure portal. 
services: firewall
author: vhorne
ms.service: firewall
ms.topic: tutorial
ms.date: 9/25/2018
ms.author: victorh
#Customer intent: As an administrator, I want to deploy and configure Azure Firewall in a hybrid network so that I can control access from an on-premise newtork to an Azure VNet.
---
# Tutorial: Deploy and configure Azure Firewall in a hybrid network using Azure PowerShell


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the network environment
> * Configure and deploy the firewall
> * Create the routes
> * Create the virtual machines
> * Test the firewall

For this tutorial, you create three VNets:
- **VNet-FW** - the firewall is in this Vnet.
- **VNet-Workload** - the workload VNet represents the workload located on Azure.
- **VNet-On-prem** - The On-prem VNet represents an on-premise network. In an actual deployment, it can be connected by either a VPN or Express Route connection. For simplicity, this tutorial uses a VPN connection, and an Azure-located VNet is used to represent on on-premise network.

<!-- Network diagram here -->

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

## Declare the variables
The following example declares the variables using the values for this tutorial. In most cases, you should replace the values with your own. However, you can use these variables if you are running through the steps to become familiar with this type of configuration. Modify the variables if needed, then copy and paste them into your PowerShell console.

```azurepowewrshell
$RG1 = "FW-Hybrid-Test"
$Location1 = "East US"

# Variables for the firewall hub VNet

$VNetname-hub = "VNet-hub"
$SNname-hub = "AzureFirewallSubnet"
$VNet-hub-prefix = "10.5.0.0/16"
$SN-hub-prefix = "10.5.0.0/24"
$SN-GW-hub-prefix = "10.5.1.0/24"
$GW-hub-name = "GW-hub"
$GW-hub-pip-name = "VNet-hub-GW-pip"
$GWIPconfName-hub = "GW-ipconf-hub"
$Connection-name-hub = "hub-to-Onprem"

# Variables for the spoke VNet

$Vnetname-Spoke = "VNet-Spoke"
$SNname-Spoke = "SN-Workload"
$VNet-Spoke-prefix = "10.6.0.0/16"
$SN-Spoke-prefix = "10.6.0.0/24
$SN-Spoke-GW-prefix = "10.6.1.0/24"

# Variables for the On-prem VNet

$VNetname-Onprem = "Vnet-Onprem"
$SNName-Onprem = "SN-Corp"
$VNet-Onprem-prefix = "192.168.1.0/16"
$SN-Onprem-prefix = "192.168.1.0/24"
$SN-GW-Onprem-prefix = "192.168.2.0/24"
$GW-Onprem-name = "GW-Onprem"
$GWIPconfName-Onprem = ""GW-ipconf-Onprem"
$Connection-name-Onprem = "Onprem-to-hub"
$GW-Onprem-pip-name = "VNet-Onprem-GW-pip"

$SNname-GW = "GatewaySubnet"
```

## Set up the network environment

First, you create all the required network infrastructure.

### Create a resource group
Create a resource group to contain all the resources required for this tutorial:

```azurepowershell
  New-AzureRmResourceGroup -Name $RG1 -Location $Location1
  ```
### Create and configure the firewall hub Vnet

Define the subnets to be included in the VNet:

```azurepowershell
$FWsub = New-AzureRmVirtualNetworkSubnetConfig -Name $SNname-hub -AddressPrefix $SN-hub-prefix
$GWsub = New-AzureRmVirtualNetworkSubnetConfig -Name $SNname-GW -AddressPrefix $SN-GW-hub-prefix
```

Now, create the firewall hub VNet:

```azurepowershell
$VNet-Hub = New-AzureRmVirtualNetwork -Name $VNetname-hub -ResourceGroupName $RG1 `
-Location $Location1 -AddressPrefix $VNet-hub-prefix -Subnet $FWsub,$GWsub
```
Request a public IP address to be allocated to the gateway you will create for your VNet. Notice that the *AllocationMethod* is **Dynamic**. You cannot specify the IP address that you want to use. It's dynamically allocated to your gateway. 

  ```powershell
  $gwpip1 = New-AzureRmPublicIpAddress -Name $GW-hub-pip-name -ResourceGroupName $RG1 `
  -Location $Location1 -AllocationMethod Dynamic
```

Create the gateway configuration. The gateway configuration defines the subnet and the public IP address to use. Use the example to create your gateway configuration.

  ```azurepowershell
  $vnet1 = Get-AzureRmVirtualNetwork -Name $VNetname-hub -ResourceGroupName $RG1
  $subnet1 = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet1
  $gwipconf1 = New-AzureRmVirtualNetworkGatewayIpConfig -Name $GWIPconfName-hub `
  -Subnet $subnet1 -PublicIpAddress $gwpip1
  ```

Now you can create the virtual network gateway for firewall hub VNet. VNet-to-VNet configurations require a RouteBased VpnType. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

```azurepowershell
New-AzureRmVirtualNetworkGateway -Name $GW-hub-name -ResourceGroupName $RG1 `
-Location $Location1 -IpConfigurations $gwipconf1 -GatewayType Vpn `
-VpnType RouteBased -GatewaySku basic
```
### Create and configure the spoke Vnet

Define the subnets to be included in the spoke VNet:

```azurepowershell
$Spokesub = New-AzureRmVirtualNetworkSubnetConfig -Name $SNname-Spoke -AddressPrefix $SN-Spoke-prefix
$GWsub-spoke = New-AzureRmVirtualNetworkSubnetConfig -Name $SNname-GW -AddressPrefix $SN-Spoke-GW-prefix
```

Create the spoke VNet:

```azurepowershell
$VNet-Spoke = New-AzureRmVirtualNetwork -Name $Vnetname-Spoke -ResourceGroupName $RG1 `
-Location $Location1 -AddressPrefix $VNet-Spoke-prefix -Subnet $Spokesub,$GWsub-spoke
```
### Peer the hub and spoke VNets

Now you can peer spoke and hub VNets.

```azurepowershell
# Peer hub to spoke
Add-AzureRmVirtualNetworkPeering -Name HubtoSpoke -VirtualNetwork $VNet-Hub -RemoteVirtualNetworkId $VNet-Spoke.Id -AllowGatewayTransit

# Peer spoke to hub
Add-AzureRmVirtualNetworkPeering -Name SpoketoHub -VirtualNetwork $VNet-Spoke -RemoteVirtualNetworkId $VNet-Hub.Id -AllowForwardedTraffic -UseRemoteGateways
```

### Create and configure the on-prem VNet

Define the subnets to be included in the VNet:

```azurepowershell
$Onpremsub = New-AzureRmVirtualNetworkSubnetConfig -Name $SNName-Onprem -AddressPrefix $SN-Onprem-prefix
$GWOnpremsub = New-AzureRmVirtualNetworkSubnetConfig -Name $SNname-GW -AddressPrefix $SN-GW-Onprem-prefix
```

Now, create the on-prem VNet:

```azurepowershell
$VNet-Hub = New-AzureRmVirtualNetwork -Name $VNetname-Onprem -ResourceGroupName $RG1 `
-Location $Location1 -AddressPrefix $VNet-Onprem-prefix -Subnet $Onpremsub,$GWOnpremsub
```
Request a public IP address to be allocated to the gateway you will create for your VNet. Notice that the *AllocationMethod* is **Dynamic**. You cannot specify the IP address that you want to use. It's dynamically allocated to your gateway. 

  ```azurepowershell
  $gwOnprem-pip = New-AzureRmPublicIpAddress -Name $GW-Onprem-pip-name -ResourceGroupName $RG1 `
  -Location $Location1 -AllocationMethod Dynamic
```

Create the gateway configuration. The gateway configuration defines the subnet and the public IP address to use. Use the example to create your gateway configuration.

  ```azurepowershell
$vnet2 = Get-AzureRmVirtualNetwork -Name $VNetname-Onprem -ResourceGroupName $RG1
$subnet2 = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet2
$gwipconf2 = New-AzureRmVirtualNetworkGatewayIpConfig -Name $GWIPconfName-Onprem `
  -Subnet $subnet2 -PublicIpAddress $gwOnprem-pip
  ```

Now you can create the virtual network gateway for spoke VNet. VNet-to-VNet configurations require a RouteBased VpnType. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

```azurepowershell
New-AzureRmVirtualNetworkGateway -Name $GW-Onprem-name -ResourceGroupName $RG1 `
-Location $Location1 -IpConfigurations $gwipconf2 -GatewayType Vpn `
-VpnType RouteBased -GatewaySku basic
```
### Create the VPN connections
Now you can create the VPN connections between the hub and on-prem gateways

#### Get the gateways
```azurepowershell
$vnetHubgw = Get-AzureRmVirtualNetworkGateway -Name $GW-hub-name -ResourceGroupName $RG1
$vnetSpokegw = Get-AzureRmVirtualNetworkGateway -Name $GW-Onprem-name -ResourceGroupName $RG1
```

#### Create the connections

In this step, you create the connection from VNET-FW to Vnet-Onprem. You'll see a shared key referenced in the examples. You can use your own values for the shared key. The important thing is that the shared key must match for both connections. Creating a connection can take a short while to complete.

```azurepowershell
New-AzureRmVirtualNetworkGatewayConnection -Name $Connection-name-hub -ResourceGroupName $RG1 `
-VirtualNetworkGateway1 $vnetHubgw -VirtualNetworkGateway2 $vnetSpokegw -Location $Location1 `
-ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3'
```
Create the Vnet-Onprem to VNET-FW connection. This step is similar to the previous one, except you create the connection from Vnet-Onprem to VNET-FW. Make sure the shared keys match. The connection will be established after a few minutes.

  ```azurepowershell
  New-AzureRmVirtualNetworkGatewayConnection -Name $Connection-name-Onprem -ResourceGroupName $RG1 `
  -VirtualNetworkGateway1 $vnetSpokegw -VirtualNetworkGateway2 $vnetHubgw -Location $Location1 `
  -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3'
  ```
#### Verify the connection
 
You can verify a successful connection by using the *Get-AzureRmVirtualNetworkGatewayConnection* cmdlet, with or without *-Debug*. 
Use the following cmdlet example, configuring the values to match your own. If prompted, select **A** to run **All**. In the example, *-Name* refers to the name of the connection that you want to test.

```azurepowershell
Get-AzureRmVirtualNetworkGatewayConnection -Name $Connection-name-hub -ResourceGroupName $RG1
```

After the cmdlet finishes, view the values. In the following example, the connection status shows as *Connected* and you can see ingress and egress bytes.

```
"connectionStatus": "Connected",
"ingressBytesTransferred": 33509044,
"egressBytesTransferred": 4142431
```

## Configure and deploy the firewall

Now deploy the firewall into the hub VNet.

```azurepowershell
# Get a Public IP for the firewall
$fw-pip = New-AzureRmPublicIpAddress -Name fw-pip -ResourceGroupName $RG1 `
  -Location $Location1 -AllocationMethod Dynamic -Sku Standard
# Create the firewall
$Azfw = New-AzureRmFirewall -Name AzFW01 -ResourceGroupName $RG1 -Location $Location1 -VirtualNetworkName $VNetname-hub -PublicIpName fw-pip

#Save the firewall private IP address for future use

$AzfwPrivateIP = $Azfw.IpConfigurations.privateipaddress
```

### Configure network rules

```azurepowershell
$Rule1 = New-AzureRmFirewallNetworkRule -Name "AllowWeb" -Protocol TCP -SourceAddress $SN-Onprem-prefix `
   -DestinationAddress 10.6.0.0/16 -DestinationPort 80
$Rule2 = New-AzureRmFirewallNetworkRule -Name "AllowPing" -Protocol ICMP -SourceAddress $SN-Onprem-prefix `
   -DestinationAddress 10.6.0.0/16 -DestinationPort *
$Rule3 = New-AzureRmFirewallNetworkRule -Name "AllowRDP" -Protocol TCP -SourceAddress $SN-Onprem-prefix `
   -DestinationAddress 10.6.0.0/16 -DestinationPort 3389

$NetRuleCollection = New-AzureRmFirewallNetworkRuleCollection -Name RCNet01 -Priority 100 `
   -Rule $Rule1,$Rule2,$Rule3 -ActionType "Allow"
$Azfw.NetworkRuleCollections = $NetRuleCollection
Set-AzureRmFirewall -AzureFirewall $Azfw
```
### Configure application rule

```azurepowershell
$Rule4 = New-AzureRmFirewallApplicationRule -Name "AllowBing" -Protocol "Http:80",Https:443" `
   -SourceAddress $SN-Onprem-prefix -TargetFqdn "bing.com"

$AppRuleCollection = New-AzureRmFirewallApplicationRuleCollection -Name RCApp01 -Priority 100 `
   -Rule $Rule4 -ActionType "Allow"
$Azfw.ApplicationRuleCollections = $AppRuleCollection
Set-AzureRmFirewall -AzureFirewall $Azfw

```

## Create routes

Next, you create a couple routes: 
- A route from the hub gateway subnet to the spoke subnet through the firewall IP address
- A default route from the spoke subnet through the firewall IP address

```azurepowershell
#Create a route table
$routeTableHub-Spoke = New-AzureRmRouteTable `
  -Name 'UDR-Hub-Spoke' `
  -ResourceGroupName $RG1 `
  -location $Location1

#Create a route
Get-AzureRmRouteTable `
  -ResourceGroupName $RG1 `
  -Name UDR-Hub-Spoke `
  | Add-AzureRmRouteConfig `
  -Name "ToSpoke" `
  -AddressPrefix $VNet-Spoke-prefix `
  -NextHopType "VirtualAppliance" `
  -NextHopIpAddress $AzfwPrivateIP `
 | Set-AzureRmRouteTable

#Associate the route table to the subnet

Set-AzureRmVirtualNetworkSubnetConfig `
  -VirtualNetwork $VNetname-hub `
  -Name $SNname-GW `
  -AddressPrefix $SN-GW-hub-prefix `
  -RouteTable $routeTableHub-Spoke | `
Set-AzureRmVirtualNetwork

#Now create the default route

#Create a table, with BGP route propagation disabled
$routeTableSpokeDG = New-AzureRmRouteTable `
  -Name 'UDR-DG' `
  -ResourceGroupName $RG1 `
  -location $Location1 `
  -DisableBgpRoutePropagation

#Create a route
Get-AzureRmRouteTable `
  -ResourceGroupName $RG1 `
  -Name Spoke-DG `
  | Add-AzureRmRouteConfig `
  -Name "ToSpoke" `
  -AddressPrefix 0.0.0.0/0 `
  -NextHopType "VirtualAppliance" `
  -NextHopIpAddress $AzfwPrivateIP `
 | Set-AzureRmRouteTable

#Associate the route table to the subnet

Set-AzureRmVirtualNetworkSubnetConfig `
  -VirtualNetwork $VNetname-hub `
  -Name $SNname-Spoke `
  -AddressPrefix $SN-Spoke-prefix `
  -RouteTable $routeTableSpokeDG | `
Set-AzureRmVirtualNetwork
```
## Create virtual machines

Now create the spoke workload and on-prem virtual machines, and place them in the appropriate subnets.

### Create the workload VM
Create a VM in the spoke VNet, running IIS, with no public IP address, and allows pings in.
When prompted, type a user name and password for the virtual machine.

```azurepowershell
# Create an inbound network security group rule for port 3389
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name Allow-RDP  -Protocol Tcp `
  -Direction Inbound -Priority 200 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix $SN-Spoke-prefix -DestinationPortRange 3389 -Access Allow
$nsgRuleWeb = New-AzureRmNetworkSecurityRuleConfig -Name Allow-web  -Protocol Tcp `
  -Direction Inbound -Priority 202 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix $SN-Spoke-prefix -DestinationPortRange 80 -Access Allow

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $RG1 -Location $Location1 -Name NSG-Spoke02 -SecurityRules $nsgRuleRDP,$nsgRuleWeb

#Get the VNet
$Vnet = Get-AzureRmVirtualNetwork -Name $Vnetname-Spoke -ResourceGroupName $RG1

#Create the NIC
$NIC = New-AzureRmNetworkInterface -Name spoke-01 -ResourceGroupName $RG1 -Location $Location1 -SubnetId $Vnet.Subnets[0].Id -NetworkSecurityGroupId $nsg.Id

#Define the virtual machine
$VirtualMachine = New-AzureRmVMConfig -VMName VM-Spoke-01 -VMSize "Standard_DS2"
$VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName Spoke-01 -ProvisionVMAgent -EnableAutoUpdate
$VirtualMachine = Add-AzureRmVMNetworkInterface -VM $VirtualMachine -Id $NIC.Id
$VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -PublisherName 'MicrosoftWindowsServer' -Offer 'WindowsServer' -Skus '2016-Datacenter' -Version latest

#Create the virtual machine
New-AzureRmVM -ResourceGroupName $RG1 -Location $Location1 -VM $VirtualMachine -Verbose

#Install IIS on the VM
Set-AzureRmVMExtension `
    -ResourceGroupName $RG1 `
    -ExtensionName IIS `
    -VMName VM-Spoke-01 `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.4 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server"}' `
    -Location $Location1

#Create a host firewall rule to allow ping in
Set-AzureRmVMExtension `
    -ResourceGroupName $RG1 `
    -ExtensionName IIS `
    -VMName VM-Spoke-01 `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.4 `
    -SettingString '{"commandToExecute":"powershell New-NetFirewallRule –DisplayName “Allow ICMPv4-In” –Protocol ICMPv4"}' `
    -Location $Location1
```

### Create the on-prem virtual machine
A simple virtual machine that you can connect to using the public IP, and then connect to the on-prem server through the firewall. When prompted, type user name and password for the virtual machine.
```azurepowershell
New-AzureRmVm `
    -ResourceGroupName $RG1 `
    -Name "VM-Onprem" `
    -Location $Location1 `
    -VirtualNetworkName $VNetname-Onprem `
    -SubnetName $SNName-Onprem `
    -OpenPorts 3389 `
    -Size "Standard_DS2"
```

## Test the firewall
First, get and note the private IP address for **VM-spoke-01** virtual machine.

```azurepowershell
$NIC.IpConfigurations.privateipaddress
```

1. From the Azure portal, connect to the **VM-Onprem** virtual machine.
2. Open a Windows PowerShell command prompt on **VM-Onprem**, and ping the private IP for **VM-spoke-01**.

   You should get a reply.
1. Open a web browser on **VM-Onprem**, and browse to http://\<VM-spoke-01 private IP\>

   You should see the Internet Information Services default page.

3. From **VM-Onprem**, open a remote desktop to **VM-spoke-01** at the private IP address.

   You connection should succeed, and you should be able to log on using your chosen  username and password.

Change the firewall network rule collection action to deny, to verify that the firewall rules work as expected. Run the following Azure PowerShell to change the network rule collection action to **Deny**.

```azurepowershell
$fw = Get-AzureRmFirewall -ResourceGroupName $RG1 -Name $Azfw
$rcNet = $fw.GetNetworkRuleCollectionByName("RCNet01")
$rcNet.action.type = "Deny"

$rcApp = $fw.ApplicationRuleCollectionByName("RCApp01")
$rcApp.action.type = "Deny"

Set-AzureRmFirewall -AzureFirewall $fw
```
Now run the tests again. They should all fail this time. Close any existing remote desktops before testing the changed rules.

So now you have verified that the firewall rules are working:

- You can ping the server on the spoke VNet.
- You can browse web server on the spoke VNet.
- You can connect to the server on the spoke VNet using RDP.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources.


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up the network environment
> * Configure and deploy the firewall
> * Create the routes
> * Create the virtual machines
> * Test the firewall

Next, you can monitor the Azure Firewall logs.

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
