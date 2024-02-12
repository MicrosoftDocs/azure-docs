---
title: 'Tutorial: Secure your virtual hub using Azure PowerShell'
description: This article describes how to create an Azure Virtual WAN in one region with Azure Firewall enabled in the hub.
services: firewall-manager
author: jomore
ms.topic: tutorial
ms.service: firewall-manager
ms.date: 10/22/2020
ms.author: victorh
ms.custom: devx-track-azurepowershell
---

# Tutorial: Secure your virtual hub using Azure PowerShell

In this tutorial, you create a Virtual WAN instance with a Virtual Hub in one region, and you deploy an Azure Firewall in the Virtual Hub to secure connectivity. In this example, you demonstrate secure connectivity between Virtual Networks. Traffic between virtual networks and site-to-site, point-to-site, or ExpressRoute branches are supported by Virtual Secure Hub as well.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy the virtual WAN
> * Deploy Azure Firewall and configure custom routing
> * Test connectivity

> [!IMPORTANT]
> A Virtual WAN is a collection of hubs and services made available inside the hub. You can deploy as many Virtual WANs that you need. In a Virtual WAN hub, there are multiple services such as VPN, ExpressRoute, and so on. Each of these services is automatically deployed across **Availability Zones** *except* Azure Firewall, if the region supports Availability Zones. To upgrade an existing Azure Virtual WAN Hub to a Secure Hub and have the Azure Firewall use Availability Zones, you must use Azure PowerShell, as described later in this article.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- PowerShell 7

   This tutorial requires that you run Azure PowerShell locally on PowerShell 7. To install PowerShell 7, see [Migrating from Windows PowerShell 5.1 to PowerShell 7](/powershell/scripting/install/migrating-from-windows-powershell-51-to-powershell-7).

- "Az.Network" module version must be 4.17.0 or higher.

## Sign in to Azure

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## Initial Virtual WAN deployment

As a first step, you need to set some variables and create the resource group, the virtual WAN instance, and the virtual hub:

```azurepowershell
# Variable definition
$RG = "vwan-rg"
$Location = "westeurope"
$VwanName = "vwan"
$HubName =  "hub1"
$FirewallTier = "Standard" # or "Premium"

# Create Resource Group, Virtual WAN and Virtual Hub
New-AzResourceGroup -Name $RG -Location $Location
$Vwan = New-AzVirtualWan -Name $VwanName -ResourceGroupName $RG -Location $Location -AllowVnetToVnetTraffic -AllowBranchToBranchTraffic -VirtualWANType "Standard"
$Hub = New-AzVirtualHub -Name $HubName -ResourceGroupName $RG -VirtualWan $Vwan -Location $Location -AddressPrefix "192.168.1.0/24" -Sku "Standard"
```

Create two virtual networks and connect them to the hub as spokes:

```azurepowershell
# Create Virtual Network
$Spoke1 = New-AzVirtualNetwork -Name "spoke1" -ResourceGroupName $RG -Location $Location -AddressPrefix "10.1.1.0/24"
$Spoke2 = New-AzVirtualNetwork -Name "spoke2" -ResourceGroupName $RG -Location $Location -AddressPrefix "10.1.2.0/24"
# Connect Virtual Network to Virtual WAN
$Spoke1Connection = New-AzVirtualHubVnetConnection -ResourceGroupName $RG -ParentResourceName  $HubName -Name "spoke1" -RemoteVirtualNetwork $Spoke1 -EnableInternetSecurityFlag $True
$Spoke2Connection = New-AzVirtualHubVnetConnection -ResourceGroupName $RG -ParentResourceName  $HubName -Name "spoke2" -RemoteVirtualNetwork $Spoke2 -EnableInternetSecurityFlag $True
```

At this point, you have a fully functional Virtual WAN providing any-to-any connectivity. To enhance it with security, you need to deploy an Azure Firewall to each Virtual Hub. Firewall Policies can be used to efficiently manage the virtual WAN Azure Firewall instance. So a firewall policy is created as well in this example:

```azurepowershell
# New Firewall Policy
$FWPolicy = New-AzFirewallPolicy -Name "VwanFwPolicy" -ResourceGroupName $RG -Location $Location
# New Firewall Public IP
$AzFWPIPs = New-AzFirewallHubPublicIpAddress -Count 1
$AzFWHubIPs = New-AzFirewallHubIpAddress -PublicIP $AzFWPIPs
# New Firewall
$AzFW = New-AzFirewall -Name "azfw1" -ResourceGroupName $RG -Location $Location `
            -VirtualHubId $Hub.Id -FirewallPolicyId $FWPolicy.Id `
            -SkuName "AZFW_Hub" -HubIPAddress $AzFWHubIPs `
            -SkuTier $FirewallTier
```

> [!NOTE]
> The following Firewall creation command does **not** use Availability Zones. If you want to use this feature, an additional parameter **-Zone** is required. An example is provided in the upgrade section at the end of this article.

Enabling logging from the Azure Firewall to Azure Monitor is optional, but in this example you use the Firewall logs to prove that traffic is traversing the firewall:

```azurepowershell
# Optionally, enable looging of Azure Firewall to Azure Monitor
$LogWSName = "vwan-" + (Get-Random -Maximum 99999) + "-" + $RG
$LogWS = New-AzOperationalInsightsWorkspace -Location $Location -Name $LogWSName -Sku Standard -ResourceGroupName $RG
Set-AzDiagnosticSetting -ResourceId $AzFW.Id -Enabled $True -Category AzureFirewallApplicationRule, AzureFirewallNetworkRule -WorkspaceId $LogWS.ResourceId
```

## Deploy Azure Firewall and configure custom routing

> [!NOTE]
> This is the configuration deployed when securing connectivity from the Azure Portal with Azure Firewall Manager when the "Inter-hub" setting is set to **disabled**. For instructions on how to configure routing using powershell when "Inter-hub" is set to **enabled**, see [Enabling routing intent](#routingintent).

Now you have an Azure Firewall in the hub, but you still need to modify routing so the Virtual WAN sends the traffic from the virtual networks and from the branches through the firewall. You do this in two steps:

1. Configure all virtual network connections (and branch connections if there were any) to propagate to the `None` Route Table. The effect of this configuration is that other virtual networks and branches won't learn their prefixes, and so has no routing to reach them.
1. Now you can insert static routes in the `Default` Route Table (where all virtual networks and branches are associated by default), so that all traffic is sent to the Azure Firewall.



Start with the first step, to configure your virtual network connections to propagate to the `None` Route Table:

```azurepowershell
# Configure Virtual Network connections in hub to propagate to None
$VnetRoutingConfig = $Spoke1Connection.RoutingConfiguration    # We take $Spoke1Connection as baseline for the future vnet config, all vnets will have an identical config
$NoneRT = Get-AzVhubRouteTable -ResourceGroupName $RG -HubName $HubName -Name "noneRouteTable"
$NewPropRT = @{}
$NewPropRT.Add('Id', $NoneRT.Id)
$PropRTList = @()
$PropRTList += $NewPropRT
$VnetRoutingConfig.PropagatedRouteTables.Ids = $PropRTList
$VnetRoutingConfig.PropagatedRouteTables.Labels = @()
$Spoke1Connection = Update-AzVirtualHubVnetConnection -ResourceGroupName $RG -ParentResourceName  $HubName -Name "spoke1" -RoutingConfiguration $VnetRoutingConfig
$Spoke2Connection = Update-AzVirtualHubVnetConnection -ResourceGroupName $RG -ParentResourceName  $HubName -Name "spoke2" -RoutingConfiguration $VnetRoutingConfig
```

Now you can continue with the second step, to add the static routes to the `Default` route table. In this example, you apply the default configuration that Azure Firewall Manager would generate when securing connectivity in a Virtual WAN, but you can change the list of prefixes in the static route to fit your specific requirements:

```azurepowershell
# Create static routes in default Route table
$AzFWId = $(Get-AzVirtualHub -ResourceGroupName $RG -name  $HubName).AzureFirewall.Id
$AzFWRoute = New-AzVHubRoute -Name "all_traffic" -Destination @("0.0.0.0/0", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16") -DestinationType "CIDR" -NextHop $AzFWId -NextHopType "ResourceId"
$DefaultRT = Update-AzVHubRouteTable -Name "defaultRouteTable" -ResourceGroupName $RG -VirtualHubName  $HubName -Route @($AzFWRoute)
```
> [!NOTE]
> String "***all_traffic***" as value for parameter "-Name" in the New-AzVHubRoute command above has a special meaning: if you use this exact string, the configuration applied in this article will be properly reflected in the Azure Portal (Firewall Manager --> Virtual hubs --> [Your Hub] --> Security Configuration). If a different name will be used, the desired configuration will be applied, but will not be reflected in the Azure Portal.

##  <a name="routingintent"></a> Enabling routing intent

If you want to send inter-hub and inter-region traffic via Azure Firewall deployed in the Virtual WAN hub, you can instead enable the routing intent feature. For more information on routing intent, see [Routing Intent documentation](../virtual-wan/how-to-routing-policies.md).

> [!NOTE]
> This is the configuration deployed when securing connectivity from the Azure Portal with Azure Firewall Manager when the "Interhub" setting is set to **enabled**.

```azurepowershell
# Get the Azure Firewall resource ID
$AzFWId = $(Get-AzVirtualHub -ResourceGroupName <thname> -name  $HubName).AzureFirewall.Id

# Create routing policy and routing intent
$policy1 = New-AzRoutingPolicy -Name "PrivateTraffic" -Destination @("PrivateTraffic") -NextHop $firewall.Id
$policy2 = New-AzRoutingPolicy -Name "PublicTraffic" -Destination @("Internet") -NextHop $firewall.Id
New-AzRoutingIntent -ResourceGroupName "<rgname>" -VirtualHubName "<hubname>" -Name "hubRoutingIntent" -RoutingPolicy @($policy1, $policy2)
```

If you are using non-RFC1918 prefixes in your Virtual WAN such as  40.0.0.0/24 in your Virtual Network or on-premises, add an additional route in the defaultRouteTable after routing intent configuration completes. Make sure you name this route as **private_traffic**. If the route is named otherwise, the desired configuration will apply but it will not be reflected in Azure Portal.

```azurepowershell
# Get the defaultRouteTable
$defaultRouteTable = Get-AzVHubRouteTable -ResourceGroupName routingIntent-Demo -HubName wus_hub1 -Name defaultRouteTable

# Get the routes automatically created by routing intent. If private routing policy is enabled, this is the route named _policy_PrivateTraffic. If internet routing policy is enabled, this is the route named _policy_InternetTraffic. 
$privatepolicyroute = $defaultRouteTable.Routes[1]


# Create new route named private_traffic for non-RFC1918 prefixes
$private_traffic = New-AzVHubRoute -Name "private-traffic" -Destination @("30.0.0.0/24") -DestinationType "CIDR" -NextHop $AzFWId -NextHopType ResourceId

# Create new routes for route table
$newroutes = @($privatepolicyroute, $private_traffic)

# Update route table
Update-AzVHubRouteTable -ResourceGroupName <rgname> -ParentResourceName <hubname> -Name defaultRouteTable -Route $newroutes

````
 
## Test connectivity

Now you have a fully operational secure hub. To test connectivity, you need one virtual machine in each spoke virtual network connected to the hub:

```azurepowershell
# Create VMs in spokes for testing
$VMLocalAdminUser = "lab-user"
$VMLocalAdminSecurePassword = ConvertTo-SecureString -AsPlainText -Force
$VMCredential = New-Object System.Management.Automation.PSCredential ($VMLocalAdminUser, $VMLocalAdminSecurePassword);
$VMSize = "Standard_B2ms"
# Spoke1
$Spoke1 = Get-AzVirtualNetwork -ResourceGroupName $RG -Name "spoke1"
Add-AzVirtualNetworkSubnetConfig -Name "vm" -VirtualNetwork $Spoke1 -AddressPrefix "10.1.1.0/26"
$Spoke1 | Set-AzVirtualNetwork
$VM1 = New-AzVM -Name "spoke1-vm" -ResourceGroupName $RG -Location $Location `
            -Image "UbuntuLTS" -credential $VMCredential `
            -VirtualNetworkName "spoke1" -SubnetName "vm" -PublicIpAddressName "spoke1-pip"
$NIC1 = Get-AzNetworkInterface -ResourceId $($VM1.NetworkProfile.NetworkInterfaces[0].Id)
$Spoke1VMPrivateIP = $NIC1.IpConfigurations[0].PrivateIpAddress
$Spoke1VMPIP = $(Get-AzPublicIpAddress -ResourceGroupName $RG -Name "spoke1-pip")
# Spoke2
$Spoke2 = Get-AzVirtualNetwork -ResourceGroupName $RG -Name "spoke2"
Add-AzVirtualNetworkSubnetConfig -Name "vm" -VirtualNetwork $Spoke2 -AddressPrefix "10.1.2.0/26"
$Spoke2 | Set-AzVirtualNetwork
$VM2 = New-AzVM -Name "spoke2-vm" -ResourceGroupName $RG -Location $Location `
            -Image "UbuntuLTS" -credential $VMCredential `
            -VirtualNetworkName "spoke2" -SubnetName "vm" -PublicIpAddressName "spoke2-pip"
$NIC2 = Get-AzNetworkInterface -ResourceId $($VM2.NetworkProfile.NetworkInterfaces[0].Id)
$Spoke2VMPrivateIP = $NIC2.IpConfigurations[0].PrivateIpAddress
$Spoke2VMPIP = $(Get-AzPublicIpAddress -ResourceGroupName $RG -Name "spoke2-pip")
```

The default configuration in the firewall policy is to drop everything. So you need to configure some rules. Start with DNAT rules, so that the test virtual machines are accessible over the Firewall's public IP address:

```azurepowershell
# Adding DNAT rules for virtual machines in the spokes
$AzFWPublicAddress = $AzFW.HubIPAddresses.PublicIPs.Addresses[0].Address
$NATRuleSpoke1 = New-AzFirewallPolicyNatRule -Name "Spoke1SSH" -Protocol "TCP" `
        -SourceAddress "*" -DestinationAddress $AzFWPublicAddress -DestinationPort 10001 `
        -TranslatedAddress $Spoke1VMPrivateIP -TranslatedPort 22
$NATRuleSpoke2 = New-AzFirewallPolicyNatRule -Name "Spoke2SSH" -Protocol "TCP" `
        -SourceAddress "*" -DestinationAddress $AzFWPublicAddress -DestinationPort 10002 `
        -TranslatedAddress $Spoke2VMPrivateIP -TranslatedPort 22
$NATCollection = New-AzFirewallPolicyNatRuleCollection -Name "SSH" -Priority 100 `
        -Rule @($NATRuleSpoke1, $NATRuleSpoke2) -ActionType "Dnat"
$NATGroup = New-AzFirewallPolicyRuleCollectionGroup -Name "NAT" -Priority 100 -RuleCollection $NATCollection -FirewallPolicyObject $FWPolicy
```

Now you can configure some example rules. Define a network rule that allows SSH traffic, plus an application rule that allows Internet access to the Fully Qualified Domain Name `ifconfig.co`. This URL returns the source IP address it sees in the HTTP request:

```azurepowershell
# Add Network Rule
$SSHRule = New-AzFirewallPolicyNetworkRule -Name PermitSSH -Protocol TCP `
        -SourceAddress "10.0.0.0/8" -DestinationAddress "10.0.0.0/8" -DestinationPort 22
$NetCollection = New-AzFirewallPolicyFilterRuleCollection -Name "Management" -Priority 100 -ActionType Allow -Rule $SSHRule
$NetGroup = New-AzFirewallPolicyRuleCollectionGroup -Name "Management" -Priority 200 -RuleCollection $NetCollection -FirewallPolicyObject $FWPolicy
# Add Application Rule
$ifconfigRule = New-AzFirewallPolicyApplicationRule -Name PermitIfconfig -SourceAddress "10.0.0.0/8" -TargetFqdn "ifconfig.co" -Protocol "http:80","https:443"
$AppCollection = New-AzFirewallPolicyFilterRuleCollection -Name "TargetURLs" -Priority 300 -ActionType Allow -Rule $ifconfigRule
$NetGroup = New-AzFirewallPolicyRuleCollectionGroup -Name "TargetURLs" -Priority 300 -RuleCollection $AppCollection -FirewallPolicyObject $FWPolicy
```

Before actually sending any traffic, you can inspect the effective routes of the virtual machines. They should contain the prefixes learned from the Virtual WAN (`0.0.0.0/0` plus RFC1918), but not the prefix of the other spoke:

```azurepowershell
# Check effective routes in the VM NIC in spoke 1
# Note that 10.1.2.0/24 (the prefix for spoke2) should not appear
Get-AzEffectiveRouteTable -ResourceGroupName $RG -NetworkInterfaceName $NIC1.Name | ft
# Check effective routes in the VM NIC in spoke 2
# Note that 10.1.1.0/24 (the prefix for spoke1) should not appear
Get-AzEffectiveRouteTable -ResourceGroupName $RG -NetworkInterfaceName $NIC2.Name | ft
```

Now generate traffic from one Virtual Machine to the other, and verify that it's dropped in the Azure Firewall. In the following SSH commands you need to accept the virtual machines fingerprints, and provide the password that you defined when you created the virtual machines. In this example, you're going to send five ICMP echo request packets from the virtual machine in spoke1 to spoke2, plus a TCP connection attempt on port 22 using the Linux utility `nc` (with the `-vz` flags it just sends a connection request and shows the result). You should see the ping failing, and the TCP connection attempt on port 22 succeeding, since it's allowed by the network rule you configured previously:

```azurepowershell
# Connect to one VM and ping the other. It should not work, because the firewall should drop the traffic, since no rule for ICMP is configured
ssh $AzFWPublicAddress -p 10001 -l $VMLocalAdminUser "ping $Spoke2VMPrivateIP -c 5"
# Connect to one VM and send a TCP request on port 22 to the other. It should work, because the firewall is configured to allow SSH traffic (port 22)
ssh $AzFWPublicAddress -p 10001 -l $VMLocalAdminUser "nc -vz $Spoke2VMPrivateIP 22"
```

You can also verify Internet traffic. HTTP requests via the utility `curl` to the FQDN you allowed in the firewall policy (`ifconfig.co`) should work, but HTTP requests to any other destination should fail (in this example you test with `bing.com`):

```azurepowershell
# This HTTP request should succeed, since it is allowed in an app rule in the AzFW, and return the public IP of the FW
ssh $AzFWPublicAddress -p 10001 -l $VMLocalAdminUser "curl -s4 ifconfig.co"
# This HTTP request should fail, since the FQDN bing.com is not in any app rule in the firewall policy
ssh $AzFWPublicAddress -p 10001 -l $VMLocalAdminUser "curl -s4 bing.com"
```

The easiest way to verify the packets are dropped by the firewall is to check the logs. Since you configured the Azure Firewall to send logs to Azure Monitor, you can use the Kusto Query Language to retrieve the relevant logs from Azure Monitor:

> [!NOTE]
> It can take around 1 minute for the logs to appear to be sent to Azure Monitor

```azurepowershell
# Getting Azure Firewall network rule Logs
$LogWS = Get-AzOperationalInsightsWorkspace -ResourceGroupName $RG
$LogQuery = 'AzureDiagnostics
| where Category == "AzureFirewallNetworkRule"
| where TimeGenerated >= ago(5m)
| parse msg_s with Protocol " request from " SourceIP ":" SourcePortInt:int " to " TargetIP ":" TargetPortInt:int *
| parse msg_s with * ". Action: " Action1a
| parse msg_s with * " was " Action1b " to " NatDestination
| parse msg_s with Protocol2 " request from " SourceIP2 " to " TargetIP2 ". Action: " Action2
| extend SourcePort = tostring(SourcePortInt),TargetPort = tostring(TargetPortInt)
| extend Action = case(Action1a == "", case(Action1b == "",Action2,Action1b), Action1a),Protocol = case(Protocol == "", Protocol2, Protocol),SourceIP = case(SourceIP == "", SourceIP2, SourceIP),TargetIP = case(TargetIP == "", TargetIP2, TargetIP),SourcePort = case(SourcePort == "", "N/A", SourcePort),TargetPort = case(TargetPort == "", "N/A", TargetPort),NatDestination = case(NatDestination == "", "N/A", NatDestination)
| project TimeGenerated, Protocol, SourceIP,SourcePort,TargetIP,TargetPort,Action, NatDestination, Resource
| take 25 '
$(Invoke-AzOperationalInsightsQuery -Workspace $LogWS -Query $LogQuery).Results | ft
```

In the previous command you should see different entries:

* Your SSH connection being DNAT'ed
* Dropped ICMP packets between the VMs in the spokes (10.1.1.4 and 10.1.2.4)
* Allowed SSH connections between the VMs in the spokes

Here a sample output produced by the command above:

```
TimeGenerated            Protocol    SourceIP       SourcePort TargetIP      TargetPort Action  NatDestination Resource
-------------            --------    --------       ---------- --------      ---------- ------  -------------- --------
2020-10-04T20:53:02.41Z  TCP         109.125.122.99 62281      51.105.224.44 10001      DNAT'ed 10.1.1.4:22    AZFW1
2020-10-04T20:53:07.045Z TCP         10.1.1.4       35932      10.1.2.4      22         Allow   N/A            AZFW1
2020-10-04T20:53:50.119Z TCP         109.125.122.99 62293      51.105.224.44 10001      DNAT'ed 10.1.2.4:22    AZFW1
2020-10-04T20:52:47.475Z TCP         109.125.122.99 62273      51.105.224.44 10001      DNAT'ed 10.1.2.4:22    AZFW1
2020-10-04T20:51:04.682Z TCP         109.125.122.99 62200      51.105.224.44 10001      DNAT'ed 10.1.2.4:22    AZFW1
2020-10-04T20:51:17.031Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:18.049Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:19.075Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:20.097Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:21.121Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:52:52.356Z TCP         10.1.1.4       53748      10.1.2.4      22         Allow   N/A            AZFW1
```

If you want to see the logs for the application rules (describing allowed and denied HTTP connections) or change the way that the logs are displayed, you can try with other KQL queries. You can find some examples in [Azure Monitor logs for Azure Firewall](../firewall/firewall-workbook.md).


## Clean up resources

To delete the test environment, you can remove the resource group with all contained objects:

```azurepowershell
# Delete resource group and all contained resources
Remove-AzResourceGroup -Name $RG
```

## Upgrade an existing Hub with Availability Zones

The previous procedure uses Azure PowerShell to create a **new** Azure Virtual WAN Hub, and then immediately converts it to a Secured Hub using Azure Firewall.
A similar approach can be applied to an **existing** Azure Virtual WAN Hub. Firewall Manager can be also used for the conversion, but it isn't possible to deploy Azure Firewall across Availability Zones without a script-based approach.
You can use the following code snippet to convert an existing Azure Virtual WAN Hub to a Secured Hub, using an Azure Firewall deployed across all three Availability Zones.

```azurepowershell
# Variable definition
$RG = "vwan-rg"
$Location = "westeurope"
$VwanName = "vwan"
$HubName =  "hub1"
$FirewallName = "azfw1"
$FirewallTier = "Standard" # or "Premium"
$FirewallPolicyName = "VwanFwPolicy"

# Get references to vWAN and vWAN Hub to convert #
$Vwan = Get-AzVirtualWan -ResourceGroupName $RG -Name $VwanName
$Hub = Get-AzVirtualHub -ResourceGroupName  $RG -Name $HubName

# Create a new Firewall Policy #
$FWPolicy = New-AzFirewallPolicy -Name $FirewallPolicyName -ResourceGroupName $RG -Location $Location

# Create a new Firewall Public IP #
$AzFWPIPs = New-AzFirewallHubPublicIpAddress -Count 1
$AzFWHubIPs = New-AzFirewallHubIpAddress -PublicIP $AzFWPIPs

# Create Firewall instance #
$AzFW = New-AzFirewall -Name $FirewallName -ResourceGroupName $RG -Location $Location `
            -VirtualHubId $Hub.Id -FirewallPolicyId $FWPolicy.Id `
            -SkuName "AZFW_Hub" -HubIPAddress $AzFWHubIPs `
            -SkuTier $FirewallTier `
            -Zone 1,2,3
```
After you run this script, Availability Zones should appear in the secured hub properties as shown in the following screenshot:

:::image type="content" source="./media/secure-cloud-network/vwan-firewall-hub-az-correct7.png" alt-text="Screenshot of Secured virtual hub availability zones." lightbox="./media/secure-cloud-network/vwan-firewall-hub-az-correct7.png":::

After the Azure Firewall is deployed, a configuration procedure must be completed as described in the previous *Deploy Azure Firewall and configure custom routing* section.

## Next steps

> [!div class="nextstepaction"]
> [Learn about trusted security partners](trusted-security-partners.md)
