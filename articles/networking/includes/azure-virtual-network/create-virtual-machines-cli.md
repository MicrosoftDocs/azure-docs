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

Create a virtual machine with [az vm create](/cli/azure/vm#az-vm-create). The following example creates a virtual machine named **\<virtual-machine-1\>** in the **\<virtual-network\>** virtual network. If SSH keys don't already exist in a default key location, the command creates them. The `--no-wait` option creates the virtual machine in the background, so you can continue to the next step.

```azurecli-interactive
# Variable declarations
resourceGroupName="test-rg"       # <resource-group>
vm1Name="vm-1"                    # <virtual-machine-1>
virtualNetworkName="vnet-1"       # <virtual-network>
subnetName="subnet-1"             # <subnet>

az vm create \
    --resource-group $resourceGroupName \
    --name $vm1Name \
    --image Ubuntu2204 \
    --vnet-name $virtualNetworkName \
    --subnet $subnetName \
    --public-ip-address "" \
    --admin-username azureuser \
    --generate-ssh-keys \
    --no-wait
```

### Create the second virtual machine

Create a virtual machine named **\<virtual-machine-2\>** in the **\<virtual-network\>** virtual network.

```azurecli-interactive
# Variable declarations
resourceGroupName="test-rg"       # <resource-group>
vm2Name="vm-2"                    # <virtual-machine-2>
virtualNetworkName="vnet-1"       # <virtual-network>
subnetName="subnet-1"             # <subnet>

az vm create \
    --resource-group $resourceGroupName \
    --name $vm2Name \
    --image Ubuntu2204 \
    --vnet-name $virtualNetworkName \
    --subnet $subnetName \
    --public-ip-address "" \
    --admin-username azureuser \
    --generate-ssh-keys
```

The virtual machine takes a few minutes to create.

> [!NOTE]
> Virtual machines in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the virtual machines use private IPs to communicate within the network. You can remove the public IPs from any virtual machines in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](~/articles/virtual-network/ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]
