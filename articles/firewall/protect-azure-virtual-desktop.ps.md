# Use Azure Firewall to protect Azure Virtual Desktop deployments

Windows Virtual Desktop is a desktop and app virtualization service that runs on Azure. When an end user connects to a Windows Virtual Desktop environment, their session is run by a host pool. A host pool is a collection of Azure virtual machines that register to Windows Virtual Desktop as session hosts. These virtual machines run in your virtual network and are subject to the virtual network security controls. They need outbound Internet access to the Windows Virtual Desktop service to operate properly and might also need outbound Internet access for end users. Azure Firewall can help you lock down your environment and filter outbound traffic.

Follow the guidelines in this article to provide additional protection for your Azure Virtual Desktop host pool using Azure Firewall.

## Prerequisites

 - A deployed Azure Virtual Desktop environment and host pool.
 - A deployed Azure Firewall

   For more information, see [Tutorial: Create a host pool by using the Azure Marketplace](../virtual-desktop/create-host-pools-azure-marketplace.md) and [Create a host pool with an Azure Resource Manager template](../virtual-desktop/virtual-desktop-fall-2019/create-host-pools-arm-template.md).

To learn more about Windows Virtual Desktop environments see [Windows Virtual Desktop environment](../virtual-desktop/environment-setup.md).

### Connect to Azure

```azurepowershell-interactive
Connect-AzAccount
```
### Set your Parameters
```azurepowershell-interactive

$Subscription = "<Enter Subscription id>"
$ResourceGroupName = "<Enter ResourceGroup name>"
$Location = "<Enter Location>"
$avdvnet = "<Enter VNet where your Session hosts are located>"
$AVDSubnet = "<Enter your subnet for Session Host VMs>" 
$AzFwPrivateIP = "<Enter Private IP of AFW>"
$fwsku = "<Standard or Premium>"

Select-AzSubscription $Subscription
```
### Create Route
```azurepowershell-interactive
$routeTableFW = New-AzRouteTable `
 -Name "<Enter name of your route table>" `
 -ResourceGroupName $ResourceGroupName `
 -Location $Location `
 -DisableBGPRoutePropagation

Add-AzRouteConfig `
 -Name "<Enter route name>" `
 -RouteTable $routeTableFW `
 -AddressPrefix 0.0.0.0/0 `
 -NextHopType "VirtualAppliance" `
 -NextHopIpAddress $AzFwPrivateIP
#Set-AzRouteTable

$virtualNetwork = Get-AzVirtualNetwork `
 -Name $avdvnet `
 -ResourceGroupName $ResourceGroupName

$avdsubnetprefix = ($virtualnetwork.Subnets | where-object -property name -match $avdsubnet).AddressPrefix

Set-AzVirtualNetworkSubnetConfig `
  -Name $AVDSubnet `
  -AddressPrefix $avdsubnetprefix `
  -VirtualNetwork $virtualNetwork `
  -RouteTable $routeTableFW
```
### Create a Firewall Policy

```azurepowershell-interactive
$firewallpolicy = New-AzFirewallPolicy `
 -Name "<Enter name of firewall policy>" `
 -ResourceGroupName $ResourceGroupName `
 -Location $Location `
 -SkuTier $fwsku
```

### Create Application Rule Collection Group

```azurepowershell-interactive
$apprule1 = New-AzFirewallPolicyApplicationRule `
 -Name "fqdntags" `
 -FqdnTag WindowsVirtualDesktop,WindowsUpdate,WindowsDiagnostics,MicrosoftActiveProtectionService `
 -SourceAddress 10.2.0.0/24 `

$apprule2 = New-AzFirewallPolicyApplicationRule `
  -Name "kmsfqdn" `
  -SourceAddress 10.2.0.0/24 `
  -Protocol "https:1688" `
  -TargetFqdn "kms.core.windows.net"

$AppRuleCollection = New-AzFirewallPolicyFilterRuleCollection `
  -Name "AVDAppRuleCollection" `
  -Priority 102 `
  -Rule $apprule1, $apprule2 `
  -ActionType "Allow"
```
### Create a Network Rule Collection Group

```azurepowershell-interactive
$netrule1 = New-AzFirewallPolicyNetworkRule `
 -Name "MetaData/Service Health" `
 -Description "Traffic for metadata and session host health monitoring"  `
 -Protocol TCP -SourceAddress 10.2.0.0/24 `
 -DestinationAddress 168.254.169.254,168.63.129.16 `
 -DestinationPort "80"

 $netrule2 = New-AzFirewallPolicyNetworkRule `
  -Name "AVD" `
  -Description "Sending AVD and Azure traffic" `
  -Protocol TCP -SourceAddress 10.2.0.0/24 `
  -DestinationAddress AzureCloud,WindowsVirtualDesktop `
  -DestinationPort "443"

$netrule3 = New-AzFirewallPolicyNetworkRule `
  -Name "DNS" `
  -Description "Route DNS Traffic" `
  -Protocol TCP,UDP `
  -SourceAddress 10.2.0.0/24 `
  -DestinationAddress "*" `
  -DestinationPort "53"

 $NetRuleCollection = New-AzFirewallPolicyFilterRuleCollection `
   -Name "NetRuleCollection" `
   -Priority 100 `
   -Rule $netrule1, $netrule2, $netrule3 `
   -ActionType "Allow"

New-AzFirewallPolicyRuleCollectionGroup `
  -Name "NetRuleApplicationGroup" `
  -ResourceGroupName $ResourceGroupName `
  -Priority 100 `
  -RuleCollection $NetRuleCollection `
  -FirewallPolicyName $firewallpolicy
```
