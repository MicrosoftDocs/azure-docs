---
title: Create an Azure virtual machine with a dual-stack network - PowerShell
titleSuffix: Azure Virtual Network
description: In this article, learn how to use PowerShell to create a virtual machine with a dual-stack virtual network in Azure.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 08/24/2023
ms.custom: template-how-to, devx-track-azurepowershell
---

# Create an Azure Virtual Machine with a dual-stack network using PowerShell

In this article, you'll create a virtual machine in Azure with PowerShell. The virtual machine is created along with the dual-stack network as part of the procedures.  When completed, the virtual machine supports IPv4 and IPv6 communication.  

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell.
- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).
- Ensure your Az. Network module is 4.3.0 or later. To verify the installed module, use the command Get-InstalledModule -Name "Az.Network". If the module requires an update, use the command Update-Module -Name "Az. Network" if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **myResourceGroup** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

## Create a virtual network

In this section, you'll create a dual-stack virtual network for the virtual machine.

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) and [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create a virtual network.

```azurepowershell-interactive
## Create backend subnet config ##
$subnet = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.0.0.0/24','2404:f800:8000:122::/64'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create the virtual network ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    AddressPrefix = '10.0.0.0/16','2404:f800:8000:122::/63'
    Subnet = $subnetConfig
}
New-AzVirtualNetwork @net

```

## Create public IP addresses

You'll create two public IP addresses in this section, IPv4 and IPv6. 

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the public IP addresses.

```azurepowershell-interactive
$ip4 = @{
    Name = 'myPublicIP-IPv4'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip4

$ip6 = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv6'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip6
```
## Create a network security group

In this section, you'll create a network security group for the virtual machine and virtual network.

Use [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup) and [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig) to create the network security group and rules.

```azurepowershell-interactive
## Create rule for network security group and place in variable. ##
$nsgrule1 = @{
    Name = 'myNSGRuleSSH'
    Description = 'Allow SSH'
    Protocol = '*'
    SourcePortRange = '*'
    DestinationPortRange = '22'
    SourceAddressPrefix = 'Internet'
    DestinationAddressPrefix = '*'
    Access = 'Allow'
    Priority = '200'
    Direction = 'Inbound'
}
$rule1 = New-AzNetworkSecurityRuleConfig @nsgrule1

$nsgrule2 = @{
    Name = 'myNSGRuleAllOUT'
    Description = 'Allow All out'
    Protocol = '*'
    SourcePortRange = '*'
    DestinationPortRange = '*'
    SourceAddressPrefix = 'Internet'
    DestinationAddressPrefix = '*'
    Access = 'Allow'
    Priority = '201'
    Direction = 'Outbound'
}
$rule2 = New-AzNetworkSecurityRuleConfig @nsgrule2

## Create network security group ##
$nsg = @{
    Name = 'myNSG'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    SecurityRules = $rule1,$rule2
}
New-AzNetworkSecurityGroup @nsg
```

## Create virtual machine

In this section, you'll create the virtual machine and its supporting resources.

### Create network interface

You'll use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) and [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create the network interface for the virtual machine. The public IP addresses and the NSG created previously are associated with the NIC. The network interface is attached to the virtual network you created previously.

```azurepowershell-interactive
## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place the network security group into a variable. ##
$ns = @{
    Name = 'myNSG'
    ResourceGroupName = 'myResourceGroup'
}
$nsg = Get-AzNetworkSecurityGroup @ns

## Place the IPv4 public IP address into a variable. ##
$pub4 = @{
    Name = 'myPublicIP-IPv4'
    ResourceGroupName = 'myResourceGroup'
}
$pubIPv4 = Get-AzPublicIPAddress @pub4

## Place the IPv6 public IP address into a variable. ##
$pub6 = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'myResourceGroup'
}
$pubIPv6 = Get-AzPublicIPAddress @pub6

## Create IPv4 configuration for NIC. ##
$IP4c = @{
    Name = 'ipconfig-ipv4'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv4'
    PublicIPAddress = $pubIPv4
}
$IPv4Config = New-AzNetworkInterfaceIpConfig @IP4c

## Create IPv6 configuration for NIC. ##
$IP6c = @{
    Name = 'ipconfig-ipv6'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv6'
    PublicIPAddress = $pubIPv6
}
$IPv6Config = New-AzNetworkInterfaceIpConfig @IP6c

## Command to create network interface for VM ##
$nic = @{
    Name = 'myNIC1'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    NetworkSecurityGroup = $nsg
    IpConfiguration = $IPv4Config,$IPv6Config   
}
New-AzNetworkInterface @nic
```

### Create virtual machine

Use the following commands to create the virtual machine:
    
* [New-AzVM](/powershell/module/az.compute/new-azvm)
    
* [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
    
* [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
    
* [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
    
* [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

```azurepowershell-interactive
$cred = Get-Credential

## Place network interface into a variable. ##
$nic = @{
    Name = 'myNIC1'
    ResourceGroupName = 'myResourceGroup'
}
$nicVM = Get-AzNetworkInterface @nic

## Create a virtual machine configuration for VMs ##
$vmsz = @{
    VMName = 'myVM'
    VMSize = 'Standard_DS1_v2'  
}
$vmos = @{
    ComputerName = 'myVM'
    Credential = $cred
}
$vmimage = @{
    PublisherName = 'Debian'
    Offer = 'debian-11'
    Skus = '11'
    Version = 'latest'    
}
$vmConfig = New-AzVMConfig @vmsz `
      | Set-AzVMOperatingSystem @vmos -Linux `
      | Set-AzVMSourceImage @vmimage `
      | Add-AzVMNetworkInterface -Id $nicVM.Id

## Create the virtual machine for VMs ##
$vm = @{
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    VM = $vmConfig
    SshKeyName = 'mySSHKey'
    }
New-AzVM @vm -GenerateSshKey
```

## Test SSH connection

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to display the IP addresses of the virtual machine.

```azurepowershell-interactive
$ip4 = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myPublicIP-IPv4'
}  
Get-AzPublicIPAddress @ip4 | select IpAddress
```

```azurepowershell-interactive
PS /home/user> Get-AzPublicIPAddress @ip4 | select IpAddress

IpAddress
---------
20.72.115.187
```

```azurepowershell-interactive
$ip6 = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myPublicIP-IPv6'
}  
Get-AzPublicIPAddress @ip6 | select IpAddress
```

```azurepowershell-interactive
PS /home/user> Get-AzPublicIPAddress @ip6 | select IpAddress

IpAddress
---------
2603:1030:403:3::1ca
```

Open an SSH connection to the virtual machine by using the following command. Replace the IP address with the IP address of your virtual machine.

```azurepowershell-interactive
ssh azureuser@20.72.115.187
```

## Clean up resources

When no longer needed, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, virtual machine, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'myResourceGroup'
```

## Next steps

In this article, you learned how to create an Azure Virtual machine with a dual-stack network.

For more information about IPv6 and IP addresses in Azure, see:

- [Overview of IPv6 for Azure Virtual Network.](ipv6-overview.md)

- [What is Azure Virtual Network IP Services?](ip-services-overview.md)
