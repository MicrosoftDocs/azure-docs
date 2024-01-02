---
title: Assign multiple IP addresses to VMs - Azure PowerShell
titleSuffix: Azure Virtual Network
description: Learn how to create a virtual machine with multiple IP addresses using Azure PowerShell.
services: virtual-network
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, engagement-fy23, devx-track-azurepowershell
---

# Assign multiple IP addresses to virtual machines using Azure PowerShell

An Azure Virtual Machine (VM) has one or more network interfaces (NIC) attached to it. Any NIC can have one or more static or dynamic public and private IP addresses assigned to it.

Assigning multiple IP addresses to a VM enables the following capabilities:

* Hosting multiple websites or services with different IP addresses and TLS/SSL certificates on a single server.

* Serve as a network virtual appliance, such as a firewall or load balancer.

* The ability to add any of the private IP addresses for any of the NICs to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary NIC could be added to a back-end pool. For more information about load balancing multiple IP configurations, see [Load balancing multiple IP configurations](../../load-balancer/load-balancer-multiple-ip.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Every NIC attached to a VM has one or more IP configurations associated to it. Each configuration is assigned one static or dynamic private IP address. Each configuration may also have one public IP address resource associated to it. To learn more about IP addresses in Azure, see [IP addresses in Azure](../../virtual-network/ip-services/public-ip-addresses.md).

> [!NOTE]
> All IP configurations on a single NIC must be associated to the same subnet.  If multiple IPs on different subnets are desired, multiple NICs on a VM can be used.  To learn more about multiple NICs on a VM in Azure, see [Create VM with Multiple NICs](../../virtual-machines/windows/multiple-nics.md).

There's a limit to how many private IP addresses can be assigned to a NIC. There's also a limit to how many public IP addresses that can be used in an Azure subscription. See the [Azure limits](../../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits) article for details.

This article explains how to add multiple IP addresses to a virtual machine using PowerShell.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- PowerShell environment in [Azure Cloud Shell](https://shell.azure.com/powershell) or Azure PowerShell installed locally. To learn more about using PowerShell in Azure Cloud Shell, see [Azure Cloud Shell Quickstart](/azure/cloud-shell/quickstart?tabs=powershell).

    - If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-InstalledModule -Name Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). Ensure your Az.Network module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name "Az.Network"` if necessary.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

> [!NOTE]
> Though the steps in this article assigns all IP configurations to a single NIC, you can also assign multiple IP configurations to any NIC in a multi-NIC VM. To learn how to create a VM with multiple NICs, see [Create a VM with multiple NICs](../../virtual-machines/windows/multiple-nics.md).

  :::image type="content" source="./media/virtual-network-multiple-ip-addresses-portal/multiple-ipconfigs.png" alt-text="Diagram of network configuration resources created in How-to article.":::

  *Figure: Diagram of network configuration resources created in this How-to article.*

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)  named **myResourceGroup** in the **eastus2** location.

```azurepowershell-interactive
$rg =@{
    Name = 'myResourceGroup'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```

## Create a virtual network

In this section, you create a virtual network for the virtual machine.

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) and [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create a virtual network with one subnet.

```azurepowershell-interactive
## Create backend subnet config ##
$subnet = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.1.0.0/24'
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet

## Create the virtual network ##
$vnet = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    AddressPrefix = '10.1.0.0/16'
    Subnet = $subnetConfig
}
New-AzVirtualNetwork @vnet

```

## Create a primary public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a primary public IP address.

```azurepowershell-interactive
$ip1 = @{
    Name = 'myPublicIP-1'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip1
```

## Create a network security group

In this section, you create a network security group for the virtual machine and virtual network. You create a rule to allow connections to the virtual machine on port 22 for SSH.

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

## Create network security group ##
$nsg = @{
    Name = 'myNSG'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    SecurityRules = $rule1
}
New-AzNetworkSecurityGroup @nsg
```

## Create a network interface

Use [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) and [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create a network interface (NIC) for the virtual machine. The public IP address and network security group created previously are associated with the network interface. The network interface is attached to the virtual network you created previously.

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

## Place the primary public IP address into a variable. ##
$pub1 = @{
    Name = 'myPublicIP-1'
    ResourceGroupName = 'myResourceGroup'
}
$pubIP1 = Get-AzPublicIPAddress @pub1

## Create a primary IP configuration for the network interface. ##
$IP1 = @{
    Name = 'ipconfig1'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv4'
    PublicIPAddress = $pubIP1
}
$IP1Config = New-AzNetworkInterfaceIpConfig @IP1 -Primary

## Create a secondary IP configuration for the network interface. ##
$IP3 = @{
    Name = 'ipconfig3'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv4'
    PrivateIpAddress = '10.1.0.6'
}
$IP3Config = New-AzNetworkInterfaceIpConfig @IP3

## Command to create a network interface. ##
$nic = @{
    Name = 'myNIC1'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    NetworkSecurityGroup = $nsg
    IpConfiguration = $IP1Config,$IP3Config
}
New-AzNetworkInterface @nic
```

> [!NOTE]
> When adding a static IP address, you must specify an unused, valid address on the subnet the NIC is connected to.

## Create a virtual machine

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

## Add secondary private and public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a secondary public IP address.

```azurepowershell-interactive
$ip2 = @{
    Name = 'myPublicIP-2'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    Zone = 1,2,3
}
New-AzPublicIpAddress @ip2
```

Use [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create the secondary IP configuration for the virtual machine.

```azurepowershell-interactive
## Place the virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place your virtual network subnet into a variable. ##
$sub = @{
    Name = 'myBackendSubnet'
    VirtualNetwork = $vnet
}
$subnet = Get-AzVirtualNetworkSubnetConfig @sub

## Place the secondary public IP address you created previously into a variable. ##
$pip = @{
    Name = 'myPublicIP-2'
    ResourceGroupName = 'myResourceGroup'
}
$pubIP2 = Get-AzPublicIPAddress @pip

## Place the network interface into a variable. ##
$net = @{
    Name = 'myNIC1'
    ResourceGroupName = 'myResourceGroup'
}
$nic = Get-AzNetworkInterface @net

## Create a secondary IP configuration for the network interface. ##
$IPc2 = @{
    Name = 'ipconfig2'
    Subnet = $vnet.Subnets[0]
    PrivateIpAddressVersion = 'IPv4'
    PrivateIpAddress = '10.1.0.5'
    PublicIPAddress = $pubIP2
}
$IP2Config = New-AzNetworkInterfaceIpConfig @IPc2

## Add the IP configuration to the network interface. ##
$nic.IpConfigurations.Add($IP2Config)

## Save the configuration to the network interface. ##
$nic | Set-AzNetworkInterface
```

[!INCLUDE [virtual-network-multiple-ip-addresses-os-config.md](../../../includes/virtual-network-multiple-ip-addresses-os-config.md)]

## Next steps

- Learn more about [public IP addresses](public-ip-addresses.md) in Azure.
- Learn more about [private IP addresses](private-ip-addresses.md) in Azure.
- Learn how to [Configure IP addresses for an Azure network interface](virtual-network-network-interface-addresses.md?tabs=nic-address-powershell).
