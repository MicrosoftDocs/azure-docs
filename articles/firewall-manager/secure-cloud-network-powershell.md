---
title: 'Tutorial: Secure your virtual hub using Azure PowerShell'
description: This article describes how to create an Azure Virtual WAN in one region with Azure Firewall enabled in the hub.
services: firewall-manager
author: jomore
ms.topic: tutorial
ms.service: azure-firewall-manager
ms.date: 01/29/2026
ms.author: duau
ms.custom:
  - devx-track-azurepowershell
  - sfi-image-nochange
---

# Tutorial: Secure your virtual hub using Azure PowerShell

In this tutorial, you create a Virtual WAN instance with a Virtual Hub in one region, and you deploy an Azure Firewall in the Virtual Hub to secure connectivity. In this example, you demonstrate secure connectivity between Virtual Networks. Traffic between virtual networks and site-to-site, point-to-site, or ExpressRoute branches are supported by Virtual Secure Hub as well.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy the virtual WAN
> * Deploy Azure Firewall and configure custom routing
> * Test connectivity

> [!IMPORTANT]
> A Virtual WAN is a collection of hubs and services made available inside the hub. You can deploy as many Virtual WANs that you need. In a Virtual WAN hub, there are multiple services such as VPN, ExpressRoute, and so on. Each of these services is automatically deployed across **availability zones** *except* Azure Firewall, if the region supports availability zones. To upgrade an existing Azure Virtual WAN Hub to a Secure Hub and have the Azure Firewall use availability zones, you must use Azure PowerShell, as described later in this article.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

- PowerShell 7 or higher

   This tutorial requires that you run Azure PowerShell locally on PowerShell 7 or higher. To install PowerShell 7, see [Migrating from Windows PowerShell 5.1 to PowerShell 7](/powershell/scripting/install/migrating-from-windows-powershell-51-to-powershell-7).

- "Az.Network" module version must be 4.17.0 or higher.

## Sign in to Azure

```azurepowershell-interactive
Connect-AzAccount
Select-AzSubscription -Subscription "<sub name>"
```

## Initial Virtual WAN deployment
To begin, you need to set variables and create the resource group, the virtual WAN instance, and the virtual hub:

```azurepowershell-interactive
# Variable definition
$RG = "vwan-rg"
$Location = "westeurope"
$VwanName = "vwan"
$HubName =  "hub1"
$FirewallTier = "Standard" # or "Premium"

# Create Resource Group, Virtual WAN and Virtual Hub using the New-AzVirtualWan and New-AzVirtualHub cmdlets
New-AzResourceGroup -Name $RG -Location $Location
$Vwan = New-AzVirtualWan -Name $VwanName -ResourceGroupName $RG -Location $Location -AllowVnetToVnetTraffic -AllowBranchToBranchTraffic -VirtualWANType "Standard"
$Hub = New-AzVirtualHub -Name $HubName -ResourceGroupName $RG -VirtualWan $Vwan -Location $Location -AddressPrefix "192.168.1.0/24" -Sku "Standard"
```

- Create two virtual networks and connect them to the hub as spokes using the `New-AzVirtualHubVnetConnection` cmdlet. The virtual networks are created with the address prefixes `10.1.1.0/24` and `10.1.2.0/24`.

```azurepowershell-interactive
# Create Virtual Network
$Spoke1 = New-AzVirtualNetwork -Name "spoke1" -ResourceGroupName $RG -Location $Location -AddressPrefix "10.1.1.0/24"
Add-AzVirtualNetworkSubnetConfig -Name "AzureBastionSubnet" -VirtualNetwork $Spoke1 -AddressPrefix "10.1.1.64/26"
$Spoke1 | Set-AzVirtualNetwork
$Spoke2 = New-AzVirtualNetwork -Name "spoke2" -ResourceGroupName $RG -Location $Location -AddressPrefix "10.1.2.0/24"
# Connect Virtual Network to Virtual WAN
$Spoke1Connection = New-AzVirtualHubVnetConnection -ResourceGroupName $RG -ParentResourceName  $HubName -Name "spoke1" -RemoteVirtualNetwork $Spoke1 -EnableInternetSecurityFlag $True
$Spoke2Connection = New-AzVirtualHubVnetConnection -ResourceGroupName $RG -ParentResourceName  $HubName -Name "spoke2" -RemoteVirtualNetwork $Spoke2 -EnableInternetSecurityFlag $True
```

At this stage, your Virtual WAN is fully operational and provides any-to-any connectivity. To secure this environment, deploy an Azure Firewall in each Virtual Hub. You can centrally manage these firewalls using Firewall Policies. 

In this example, you'll also create a firewall policy to manage the Azure Firewall instance in the Virtual WAN hub using the `New-AzFirewallPolicy` cmdlet. The Azure Firewall will be deployed in the hub using the `New-AzFirewall` cmdlet.

```azurepowershell-interactive    
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
> The following Firewall creation command does **not** use availability zones. If you want to use this feature, an additional parameter **-Zone** is required. An example is provided in the upgrade section at the end of this article.

Enabling logging from Azure Firewall to Azure Monitor is optional. In this example, you use firewall logs to verify that traffic is passing through the firewall. First, create a Log Analytics workspace to store the logs. Then, use the `Set-AzDiagnosticSetting` cmdlet to configure diagnostic settings and send the logs to the workspace.

```azurepowershell-interactive
# Optionally, enable logging of Azure Firewall to Azure Monitor
$LogWSName = "vwan-" + (Get-Random -Maximum 99999) + "-" + $RG
$LogWS = New-AzOperationalInsightsWorkspace -Location $Location -Name $LogWSName -Sku Standard -ResourceGroupName $RG
Set-AzDiagnosticSetting -ResourceId $AzFW.Id -Enabled $True -Category AzureFirewallApplicationRule, AzureFirewallNetworkRule -WorkspaceId $LogWS.ResourceId
```

## Deploy Azure Firewall and configure custom routing

> [!NOTE]
> This is the configuration deployed when securing connectivity from the Azure Portal with Azure Firewall Manager when the "Inter-hub" setting is set to **disabled**. For instructions on how to configure routing using PowerShell when "Inter-hub" is set to **enabled**, see [Enabling routing intent](#routingintent).

Now you have an Azure Firewall in the hub, but you still need to modify routing so the Virtual WAN sends the traffic from the virtual networks and from the branches through the firewall. You do this in two steps:

1. Configure all virtual network connections (and branch connections if there were any) to propagate to the `None` Route Table. The effect of this configuration is that other virtual networks and branches won't learn their prefixes, and so has no routing to reach them.
1. Now you can insert static routes in the `Default` Route Table (where all virtual networks and branches are associated by default), so that all traffic is sent to the Azure Firewall.



Begin by configuring your virtual network connections to propagate to the `None` Route Table. This step ensures that the virtual networks do not learn each other's address prefixes, preventing direct communication between them. As a result, all inter-virtual network traffic must pass through the Azure Firewall.

To do this, use the `Get-AzVhubRouteTable` cmdlet to retrieve the `None` Route Table, and then update each virtual network connection's routing configuration with the `Update-AzVirtualHubVnetConnection` cmdlet.

```azurepowershell-interactive
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

Next, proceed to the second step: adding static routes to the `Default` route table. The following example uses the default configuration that Azure Firewall Manager applies when securing connectivity in a Virtual WAN. You can customize the list of prefixes in the static route as needed by using the `New-AzVHubRoute` cmdlet. In this example, all traffic is routed through the Azure Firewall, which is the recommended default.

```azurepowershell-interactive
# Create static routes in default Route table
$AzFWId = $(Get-AzVirtualHub -ResourceGroupName $RG -name  $HubName).AzureFirewall.Id
$AzFWRoute = New-AzVHubRoute -Name "all_traffic" -Destination @("0.0.0.0/0", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16") -DestinationType "CIDR" -NextHop $AzFWId -NextHopType "ResourceId"
$DefaultRT = Update-AzVHubRouteTable -Name "defaultRouteTable" -ResourceGroupName $RG -VirtualHubName  $HubName -Route @($AzFWRoute)
```
> [!NOTE]
> String "***all_traffic***" as value for parameter "-Name" in the New-AzVHubRoute command above has a special meaning: if you use this exact string, the configuration applied in this article will be properly reflected in the Azure portal (Firewall Manager --> Virtual hubs --> [Your Hub] --> Security Configuration). If a different name will be used, the desired configuration will be applied, but will not be reflected in the Azure portal.

##  <a name="routingintent"></a> Enabling routing intent

If you want to send inter-hub and inter-region traffic via Azure Firewall deployed in the Virtual WAN hub, you can instead enable the routing intent feature. For more information on routing intent, see [Routing Intent documentation](../virtual-wan/how-to-routing-policies.md).

> [!NOTE]
> This is the configuration deployed when securing connectivity from the Azure portal with Azure Firewall Manager when the "Interhub" setting is set to **enabled**.

```azurepowershell
# Get the Azure Firewall resource ID
$AzFWId = $(Get-AzVirtualHub -ResourceGroupName <thname> -name  $HubName).AzureFirewall.Id

# Create routing policy and routing intent
$policy1 = New-AzRoutingPolicy -Name "PrivateTraffic" -Destination @("PrivateTraffic") -NextHop $firewall.Id
$policy2 = New-AzRoutingPolicy -Name "PublicTraffic" -Destination @("Internet") -NextHop $firewall.Id
New-AzRoutingIntent -ResourceGroupName "<rgname>" -VirtualHubName "<hubname>" -Name "hubRoutingIntent" -RoutingPolicy @($policy1, $policy2)
If your Virtual WAN uses non-RFC1918 address prefixes (for example, `40.0.0.0/24` in a virtual network or on-premises), you should add an extra route to the `defaultRouteTable` after completing the routing intent configuration. Name this route **private_traffic**. If you use a different name, the route will work as expected, but the configuration will not be reflected in the Azure portal.

```azurepowershell-interactive
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

Now that your secure hub is fully operational, you can test connectivity by deploying a virtual machine in each spoke virtual network connected to the hub.

First, create SSH keys for authentication:

```azurepowershell-interactive
# Generate SSH key pair for VM authentication
ssh-keygen -t rsa -b 4096 -f ~/.ssh/vwan-lab-key -N ""
$sshPublicKey = Get-Content ~/.ssh/vwan-lab-key.pub
```

Now create the virtual machines without public IP addresses:

```azurepowershell-interactive
# Create VMs in spokes for testing
$VMLocalAdminUser = "azureuser"
$VMSize = "Standard_B2ms"
# Spoke1
$Spoke1 = Get-AzVirtualNetwork -ResourceGroupName $RG -Name "spoke1"
Add-AzVirtualNetworkSubnetConfig -Name "vm" -VirtualNetwork $Spoke1 -AddressPrefix "10.1.1.0/26"
$Spoke1 | Set-AzVirtualNetwork
$VM1 = New-AzVM -Name "spoke1-vm" -ResourceGroupName $RG -Location $Location `
            -Image "Ubuntu2204" -Size $VMSize `
            -VirtualNetworkName "spoke1" -SubnetName "vm" `
            -PublicIpAddressName "" -OpenPorts 22,80 `
            -GenerateSshKey -SshKeyName "spoke1-ssh-key"
$NIC1 = Get-AzNetworkInterface -ResourceId $($VM1.NetworkProfile.NetworkInterfaces[0].Id)
$Spoke1VMPrivateIP = $NIC1.IpConfigurations[0].PrivateIpAddress
# Spoke2
$Spoke2 = Get-AzVirtualNetwork -ResourceGroupName $RG -Name "spoke2"
Add-AzVirtualNetworkSubnetConfig -Name "vm" -VirtualNetwork $Spoke2 -AddressPrefix "10.1.2.0/26"
$Spoke2 | Set-AzVirtualNetwork
$VM2 = New-AzVM -Name "spoke2-vm" -ResourceGroupName $RG -Location $Location `
            -Image "Ubuntu2204" -Size $VMSize `
            -VirtualNetworkName "spoke2" -SubnetName "vm" `
            -PublicIpAddressName "" -OpenPorts 22,80 `
            -GenerateSshKey -SshKeyName "spoke2-ssh-key"
$NIC2 = Get-AzNetworkInterface -ResourceId $($VM2.NetworkProfile.NetworkInterfaces[0].Id)
$Spoke2VMPrivateIP = $NIC2.IpConfigurations[0].PrivateIpAddress
```

### Deploy Azure Bastion

Deploy Azure Bastion in the Spoke-01 virtual network to securely connect to the virtual machines without requiring public IP addresses or DNAT rules.

```azurepowershell-interactive
# Deploy Azure Bastion for secure VM access
$BastionPip = New-AzPublicIpAddress -ResourceGroupName $RG -Name "bastion-pip" `
    -Location $Location -AllocationMethod Static -Sku Standard
$Spoke1 = Get-AzVirtualNetwork -ResourceGroupName $RG -Name "spoke1"
$BastionSubnet = Get-AzVirtualNetworkSubnetConfig -Name "AzureBastionSubnet" -VirtualNetwork $Spoke1
New-AzBastion -ResourceGroupName $RG -Name "spoke1-bastion" `
    -PublicIpAddress $BastionPip -VirtualNetwork $Spoke1 -Sku "Basic"
```

> [!NOTE]
> Azure Bastion deployment can take approximately 10 minutes to complete.

By default, the firewall policy blocks all traffic. To allow access between spoke virtual machines and to the internet, you must configure firewall rules. First, create a network rule to allow SSH traffic between the virtual networks. Then, add an application rule to permit Internet access only to the Fully Qualified Domain Name (FQDN) `ifconfig.co`, which returns the source IP address seen in the HTTP request:

```azurepowershell-interactive
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

Before sending any traffic, check the effective routes for each virtual machine. The route tables should show the prefixes learned from the Virtual WAN (`0.0.0.0/0` and RFC1918 ranges), but should not include the address prefix of the other spoke virtual network.

```azurepowershell-interactive
# Check effective routes in the VM NIC in spoke 1
# Note that 10.1.2.0/24 (the prefix for spoke2) should not appear
Get-AzEffectiveRouteTable -ResourceGroupName $RG -NetworkInterfaceName $NIC1.Name | ft
# Check effective routes in the VM NIC in spoke 2
# Note that 10.1.1.0/24 (the prefix for spoke1) should not appear
Get-AzEffectiveRouteTable -ResourceGroupName $RG -NetworkInterfaceName $NIC2.Name | ft
```

Generate traffic from one virtual machine to the other and verify that it is filtered by Azure Firewall. Use Azure Bastion to connect to the virtual machines. In this example, you will:

- Connect to spoke1-vm using Azure Bastion through the Azure portal
- Send five ICMP echo requests (pings) from the VM in spoke1 to the VM in spoke2
- Attempt a TCP connection on port 22 using the `nc` (netcat) utility with the `-vz` flags, which checks connectivity without sending data

You should observe that the ping requests fail (blocked by the firewall), while the TCP connection on port 22 succeeds, as allowed by the previously configured network rule.

To test connectivity:

1. In the Azure portal, navigate to the **spoke1-vm** virtual machine.
2. Select **Connect** > **Connect via Bastion**.
3. Provide the username **azureuser** and upload the private key file generated earlier.
4. Select **Connect** to open an SSH session.
5. In the SSH session, run the following commands:

```bash
# Ping should fail (blocked by firewall)
ping $Spoke2VMPrivateIP -c 5
# SSH connectivity check should succeed (allowed by firewall)
nc -vz $Spoke2VMPrivateIP 22
```

Replace `$Spoke2VMPrivateIP` with the actual private IP address of spoke2-vm (displayed in the PowerShell output).

You can also test Internet access through the firewall. HTTP requests using the `curl` utility to the allowed FQDN (`ifconfig.co`) should succeed, while requests to other destinations (such as `bing.com`) should be blocked by the firewall policy.

From the same SSH session on spoke1-vm:

```bash
# This HTTP request should succeed, since it is allowed in an app rule in the AzFW, and return the public IP of the FW
curl -s4 ifconfig.co
# This HTTP request should fail, since the FQDN bing.com is not in any app rule in the firewall policy
curl -s4 bing.com
```

To confirm that the firewall is dropping packets as expected, review the logs sent to Azure Monitor. Since Azure Firewall is configured to send diagnostic logs to Azure Monitor, you can use Kusto Query Language (KQL) to query and analyze the relevant log entries:

> [!NOTE]
> It can take around 1 minute for the logs to appear to be sent to Azure Monitor

```azurepowershell-interactive
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

* Dropped ICMP packets between the VMs in the spokes (10.1.1.4 and 10.1.2.4)
* Allowed SSH connections between the VMs in the spokes

Here a sample output produced by the command above:

```
TimeGenerated            Protocol    SourceIP       SourcePort TargetIP      TargetPort Action  NatDestination Resource
-------------            --------    --------       ---------- --------      ---------- ------  -------------- --------
2020-10-04T20:53:07.045Z TCP         10.1.1.4       35932      10.1.2.4      22         Allow   N/A            AZFW1
2020-10-04T20:52:47.475Z TCP         10.1.1.4       53748      10.1.2.4      22         Allow   N/A            AZFW1
2020-10-04T20:51:04.682Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:17.031Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:18.049Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:19.075Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:20.097Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
2020-10-04T20:51:21.121Z ICMP Type=8 10.1.1.4       N/A        10.1.2.4      N/A        Deny    N/A            AZFW1
```

If you want to see the logs for the application rules (describing allowed and denied HTTP connections) or change the way that the logs are displayed, you can try with other KQL queries. You can find some examples in [Azure Monitor logs for Azure Firewall](../firewall/firewall-workbook.md).


To clean up the test environment, delete the resource group and all associated resources by using the `Remove-AzResourceGroup` cmdlet. This will remove the Virtual WAN, Virtual Hub, Azure Firewall, and any other resources created during this tutorial.

```azurepowershell
# Delete resource group and all contained resources
Remove-AzResourceGroup -Name $RG
```

## Deploy a new Azure Firewall with availability zones to an existing hub

The previous steps showed how to use Azure PowerShell to create a **new** Azure Virtual WAN Hub and secure it with Azure Firewall. You can also secure an **existing** Azure Virtual WAN Hub using a similar script-based approach. While Firewall Manager can convert a hub to a Secured Hub, it does not support deploying Azure Firewall across availability zones through the portal. To deploy Azure Firewall in all three availability zones, use the following PowerShell script to convert your existing Virtual WAN Hub to a Secured Hub.

> [!NOTE]
> This procedure deploys a new Azure Firewall. You can't upgrade an existing Azure Firewall without availability zones to one with availability zones. You must first delete the existing Azure Firewall in the hub and create it again using this procedure.

```azurepowershell-interactive
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
After you run this script, availability zones should appear in the secured hub properties as shown in the following screenshot:

:::image type="content" source="./media/secure-cloud-network/vwan-firewall-hub-az-correct7.png" alt-text="Screenshot of Secured virtual hub availability zones." lightbox="./media/secure-cloud-network/vwan-firewall-hub-az-correct7.png":::

After deploying Azure Firewall, you must complete the configuration steps outlined in the earlier **Deploy Azure Firewall and configure custom routing** section to ensure proper routing and security.

## Next steps

> [!div class="nextstepaction"]
> [Learn about trusted security partners](trusted-security-partners.md)
