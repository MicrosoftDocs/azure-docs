---
title: include file
description: include file
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: include
ms.date: 03/26/2026
ms.author: allensu
ms.custom: include file
---

## Create virtual machines

### Create the first virtual machine

Create a virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates a virtual machine named **\<virtual-machine-1\>** in the **\<virtual-network\>** virtual network.

```azurepowershell-interactive
# Variable declarations
$resourceGroupName = 'test-rg'       # <resource-group>
$location = 'eastus2'                # <region>
$vm1Name = 'vm-1'                    # <virtual-machine-1>
$virtualNetworkName = 'vnet-1'       # <virtual-network>
$subnetName = 'subnet-1'             # <subnet>

# Create a credential object
$cred = Get-Credential

# Define the virtual machine parameters
$vmParams = @{
    ResourceGroupName = $resourceGroupName
    Location = $location
    Name = $vm1Name
    Image = "Ubuntu2204"
    Size = "Standard_DS1_v2"
    Credential = $cred
    VirtualNetworkName = $virtualNetworkName
    SubnetName = $subnetName
    PublicIpAddressName = ""  # No public IP address
    SshKeyName = "$vm1Name-ssh-key"
    GenerateSshKey = $true
}

# Create the virtual machine
New-AzVM @vmParams
```

### Create the second virtual machine

```azurepowershell-interactive
# Variable declarations
$resourceGroupName = 'test-rg'       # <resource-group>
$location = 'eastus2'                # <region>
$vm2Name = 'vm-2'                    # <virtual-machine-2>
$virtualNetworkName = 'vnet-1'       # <virtual-network>
$subnetName = 'subnet-1'             # <subnet>

# Create a credential object
$cred = Get-Credential

# Define the virtual machine parameters
$vmParams = @{
    ResourceGroupName = $resourceGroupName
    Location = $location
    Name = $vm2Name
    Image = "Ubuntu2204"
    Size = "Standard_DS1_v2"
    Credential = $cred
    VirtualNetworkName = $virtualNetworkName
    SubnetName = $subnetName
    PublicIpAddressName = ""  # No public IP address
    SshKeyName = "$vm2Name-ssh-key"
    GenerateSshKey = $true
}

# Create the virtual machine
New-AzVM @vmParams
```

Azure takes a few minutes to create the virtual machines. When Azure finishes creating the virtual machines, it returns the output to PowerShell.

> [!NOTE]
> Virtual machines in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the virtual machines use private IPs to communicate within the network. You can remove the public IPs from any virtual machines in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure Virtual Machine](~/articles/virtual-network/ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]
