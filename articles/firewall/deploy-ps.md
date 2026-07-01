---
title: 'Deploy and configure Azure Firewall using Azure PowerShell'
description: Deploy and configure Azure Firewall using Azure PowerShell.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: devx-track-azurepowershell
# Customer intent: As a network administrator, I want to deploy and configure Azure Firewall using PowerShell, so that I can control outbound network access from an Azure subnet to enhance overall network security
---

# Deploy and configure Azure Firewall by using Azure PowerShell

Controlling outbound network access is an important part of an overall network security plan. For example, you might want to limit access to websites. Or, you might want to limit the outbound IP addresses and ports that can be accessed.

You can control outbound network access from an Azure subnet by using Azure Firewall. By using Azure Firewall, you can configure:

- Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet.
- Network rules that define source address, protocol, destination port, and destination address.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

In this article, you create a simplified single virtual network with three subnets for easy deployment. For production deployments, use a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke), where the firewall is in its own virtual network. The workload servers are in peered virtual networks in the same region with one or more subnets.

- **AzureFirewallSubnet** - the firewall is in this subnet.
- **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.
- **AzureBastionSubnet** - the subnet used for Azure Bastion, which is used to connect to the workload server.

For more information about Azure Bastion, see [What is Azure Bastion?](../bastion/bastion-overview.md)

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

:::image type="content" source="media/deploy-ps/tutorial-network.png" alt-text="Diagram that shows a firewall network infrastructure." lightbox="media/deploy-ps/tutorial-network.png":::

In this article, you learn how to:

- Set up a test network environment
- Deploy a firewall
- Create a default route
- Configure an application rule to allow access to `www.google.com`
- Configure a network rule to allow access to external DNS servers
- Test the firewall

If you prefer, you can complete this procedure by using the [Azure portal](tutorial-firewall-deploy-portal.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

This procedure requires that you run PowerShell locally. You must have the Azure PowerShell module installed. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). After you verify the PowerShell version, run `Connect-AzAccount` to create a connection with Azure.

## Set up the network

First, create a resource group to contain the resources needed to deploy the firewall. Then create a virtual network, subnets, and test servers.

### Create a resource group

Use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) to create a resource group for the deployment:

```azurepowershell
New-AzResourceGroup -Name Test-FW-RG -Location "East US"
```

### Create a virtual network and Azure Bastion host

This virtual network has three subnets. Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to define them:

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

```azurepowershell
$Bastionsub = New-AzVirtualNetworkSubnetConfig `
    -Name AzureBastionSubnet `
    -AddressPrefix 10.0.0.0/27
$FWsub = New-AzVirtualNetworkSubnetConfig `
    -Name AzureFirewallSubnet `
    -AddressPrefix 10.0.1.0/26
$Worksub = New-AzVirtualNetworkSubnetConfig `
    -Name Workload-SN `
    -AddressPrefix 10.0.2.0/24
```

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the virtual network:

```azurepowershell
$testVnet = New-AzVirtualNetwork `
    -Name Test-FW-VN `
    -ResourceGroupName Test-FW-RG `
    -Location "East US" `
    -AddressPrefix 10.0.0.0/16 `
    -Subnet $Bastionsub, $FWsub, $Worksub
```

### Create public IP address for Azure Bastion host

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a static public IP address for the Bastion host:

```azurepowershell
$publicip = New-AzPublicIpAddress `
    -ResourceGroupName Test-FW-RG `
    -Location "East US" `
    -Name Bastion-pip `
    -AllocationMethod static `
    -Sku standard
```

### Create Azure Bastion host

Use [New-AzBastion](/powershell/module/az.network/new-azbastion) to create the Bastion host:

```azurepowershell
New-AzBastion `
    -ResourceGroupName Test-FW-RG `
    -Name Bastion-01 `
    -PublicIpAddress $publicip `
    -VirtualNetwork $testVnet
```

### Create a virtual machine

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create the workload virtual machine. When prompted, type a user name and password:

```azurepowershell
# Create the NIC
$wsn = Get-AzVirtualNetworkSubnetConfig `
    -Name Workload-SN `
    -VirtualNetwork $testVnet
$NIC01 = New-AzNetworkInterface `
    -Name Srv-Work `
    -ResourceGroupName Test-FW-RG `
    -Location "East US" `
    -Subnet $wsn

# Define the virtual machine
$SecurePassword = ConvertTo-SecureString "<choose a password>" -AsPlainText -Force
$Credential = New-Object System.Management.Automation.PSCredential ("<choose a user name>", $SecurePassword);
$VirtualMachine = New-AzVMConfig `
    -VMName Srv-Work `
    -VMSize "Standard_DS2"
$VirtualMachine = Set-AzVMOperatingSystem `
    -VM $VirtualMachine `
    -Windows `
    -ComputerName Srv-Work `
    -ProvisionVMAgent `
    -EnableAutoUpdate `
    -Credential $Credential
$VirtualMachine = Add-AzVMNetworkInterface `
    -VM $VirtualMachine `
    -Id $NIC01.Id
$VirtualMachine = Set-AzVMSourceImage `
    -VM $VirtualMachine `
    -PublisherName 'MicrosoftWindowsServer' `
    -Offer 'WindowsServer' `
    -Skus '2019-Datacenter' `
    -Version latest

# Create the virtual machine
New-AzVM `
    -ResourceGroupName Test-FW-RG `
    -Location "East US" `
    -VM $VirtualMachine `
    -Verbose
```

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Deploy the firewall

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) and [New-AzFirewall](/powershell/module/az.network/new-azfirewall) to deploy the firewall into the virtual network:

```azurepowershell
# Get a Public IP for the firewall
$FWpip = New-AzPublicIpAddress `
    -Name "fw-pip" `
    -ResourceGroupName Test-FW-RG `
    -Location "East US" `
    -AllocationMethod Static `
    -Sku Standard
# Create the firewall
$Azfw = New-AzFirewall `
    -Name Test-FW01 `
    -ResourceGroupName Test-FW-RG `
    -Location "East US" `
    -VirtualNetwork $testVnet `
    -PublicIpAddress $FWpip

# Save the firewall private IP address for future use

$AzfwPrivateIP = $Azfw.IpConfigurations.privateipaddress
$AzfwPrivateIP
```

Note the private IP address. You use it later when you create the default route.

## Create a default route

Use [New-AzRouteTable](/powershell/module/az.network/new-azroutetable) and [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig) to create a route table with a default route that points to the firewall, then associate it with the workload subnet:

```azurepowershell
$routeTableDG = New-AzRouteTable `
  -Name Firewall-rt-table `
  -ResourceGroupName Test-FW-RG `
  -location "East US" `
  -DisableBgpRoutePropagation

# Create a route
Add-AzRouteConfig `
  -Name "DG-Route" `
  -RouteTable $routeTableDG `
  -AddressPrefix 0.0.0.0/0 `
  -NextHopType "VirtualAppliance" `
  -NextHopIpAddress $AzfwPrivateIP
Set-AzRouteTable

# Associate the route table to the subnet

Set-AzVirtualNetworkSubnetConfig `
  -VirtualNetwork $testVnet `
  -Name Workload-SN `
  -AddressPrefix 10.0.2.0/24 `
  -RouteTable $routeTableDG | Set-AzVirtualNetwork
```

## Configure an application rule

Use [New-AzFirewallApplicationRule](/powershell/module/az.network/new-azfirewallapplicationrule) and [New-AzFirewallApplicationRuleCollection](/powershell/module/az.network/new-azfirewallapplicationrulecollection) to create an application rule that grants outbound access to `www.google.com`:

```azurepowershell
$AppRule1 = New-AzFirewallApplicationRule `
    -Name Allow-Google `
    -SourceAddress 10.0.2.0/24 `
    -Protocol http, https `
    -TargetFqdn www.google.com
$AppRuleCollection = New-AzFirewallApplicationRuleCollection `
    -Name App-Coll01 `
    -Priority 200 `
    -ActionType Allow `
    -Rule $AppRule1
$Azfw.ApplicationRuleCollections.Add($AppRuleCollection)
Set-AzFirewall -AzureFirewall $Azfw
```

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific to the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](rule-processing.md#infrastructure-rule-collection).

## Configure a network rule

Use [New-AzFirewallNetworkRule](/powershell/module/az.network/new-azfirewallnetworkrule) and [New-AzFirewallNetworkRuleCollection](/powershell/module/az.network/new-azfirewallnetworkrulecollection) to create a network rule that grants outbound access to two IP addresses at port 53 (DNS):

```azurepowershell
$NetRule1 = New-AzFirewallNetworkRule `
    -Name "Allow-DNS" `
    -Protocol UDP `
    -SourceAddress 10.0.2.0/24 `
    -DestinationAddress 209.244.0.3,209.244.0.4 `
    -DestinationPort 53
$NetRuleCollection = New-AzFirewallNetworkRuleCollection `
    -Name RCNet01 `
    -Priority 200 `
    -Rule $NetRule1 `
    -ActionType "Allow"
$Azfw.NetworkRuleCollections.Add($NetRuleCollection)
Set-AzFirewall -AzureFirewall $Azfw
```

### Change the primary and secondary DNS address for the **Srv-Work** network interface

For testing purposes in this procedure, configure the server's primary and secondary DNS addresses. This configuration isn't a general Azure Firewall requirement.

```azurepowershell
$NIC01.DnsSettings.DnsServers.Add("209.244.0.3")
$NIC01.DnsSettings.DnsServers.Add("209.244.0.4")
$NIC01 | Set-AzNetworkInterface
```

## Test the firewall

Now, test the firewall to confirm that it works as expected.

1. Connect to the **Srv-Work** virtual machine by using Bastion, and sign in.

   :::image type="content" source="media/deploy-ps/bastion.png" alt-text="Screenshot showing connection to Srv-Work virtual machine using Azure Bastion.":::

1. On **Srv-Work**, open a PowerShell window and run the following commands:

   ```
   nslookup www.google.com
   nslookup www.microsoft.com
   ```

   Both commands return answers, showing that your DNS queries get through the firewall.

1. Run the following commands:

   ```
   Invoke-WebRequest -Uri https://www.google.com

   Invoke-WebRequest -Uri https://www.microsoft.com
   ```

   The `www.google.com` requests succeed, and the `www.microsoft.com` requests fail. This result demonstrates that your firewall rules are operating as expected.

Now you verified that the firewall rules are working:

- You can resolve DNS names by using the configured external DNS server.
- You can browse to the one allowed FQDN, but not to any others.

## Clean up resources

You can keep your firewall resources for the next tutorial. If you no longer need them, delete the **Test-FW-RG** resource group to delete all firewall-related resources:

```azurepowershell
Remove-AzResourceGroup -Name Test-FW-RG
```

## Next steps

- [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
