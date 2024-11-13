---
title: 'Tutorial: Connect virtual networks with peering'
description: In this tutorial, you learn how to connect virtual networks with virtual network peering.
author: asudbring
ms.service: azure-virtual-network
ms.topic: tutorial
ms.date: 11/11/2024
ms.author: allensu
ms.custom: 
  - template-tutorial
  - devx-track-azurecli
  - devx-track-azurepowershell
  - linux-related-content
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted

# Customer intent: I want to connect two virtual networks so that virtual machines in one virtual network can communicate with virtual machines in the other virtual network.
---

# Tutorial: Connect virtual networks with virtual network peering

You can connect virtual networks to each other with virtual network peering. These virtual networks can be in the same region or different regions (also known as global virtual network peering). Once virtual networks are peered, resources in both virtual networks can communicate with each other over a low-latency, high-bandwidth connection using Microsoft backbone network.

:::image type="content" source="./media/tutorial-connect-virtual-networks-portal/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-connect-virtual-networks-portal/resources-diagram.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create virtual networks
> * Connect two virtual networks with a virtual network peering
> * Deploy a virtual machine (VM) into each virtual network
> * Communicate between VMs

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

### [Portal](#tab/portal)

[!INCLUDE [virtual-network-create-with-bastion.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create-with-bastion.md)]
   
Repeat the previous steps to create a second virtual network with the following values:

>[!NOTE]
>The second virtual network can be in the same region as the first virtual network or in a different region. You can skip the **Security** tab and the Bastion deployment for the second virtual network. After the network peer, you can connect to both virtual machines with the same Bastion deployment.

| Setting | Value |
| --- | --- |
| Name | **vnet-2** |
| Address space | **10.1.0.0/16** |
| Resource group | **test-rg** |
| Subnet name | **subnet-1** |
| Subnet address range | **10.1.0.0/24** |

### [PowerShell](#tab/powershell)

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named **test-rg** in the **eastus** location.

```azurepowershell-interactive
$resourceGroup = @{
    Name = "test-rg"
    Location = "EastUS2"
}
New-AzResourceGroup @resourceGroup
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named **vnet-1** with the address prefix **10.0.0.0/16**.

```azurepowershell-interactive
$vnet1 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    Name = "vnet-1"
    AddressPrefix = "10.0.0.0/16"
}
$virtualNetwork1 = New-AzVirtualNetwork @vnet1
```

Create a subnet configuration with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). The following example creates a subnet configuration with a **10.0.0.0/24** address prefix:

```azurepowershell-interactive
$subConfig = @{
    Name = "subnet-1"
    AddressPrefix = "10.0.0.0/24"
    VirtualNetwork = $virtualNetwork1
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subConfig
```

Create a subnet configuration for Azure Bastion with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). The following example creates a subnet configuration with a **10.0.1.0/24** address prefix:

```azurepowershell-interactive
$subConfig = @{
    Name = "AzureBastionSubnet"
    AddressPrefix = "10.0.1.0/24"
    VirtualNetwork = $virtualNetwork1
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subConfig
```

Write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork), which creates the subnet:

```azurepowershell-interactive
$virtualNetwork1 | Set-AzVirtualNetwork
```

### Create Azure Bastion

Create a public IP address for the Azure Bastion host with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress). The following example creates a public IP address named *public-ip-bastion* in the *vnet-1* virtual network.

```azurepowershell-interactive
$publicIpParams = @{
    ResourceGroupName = "test-rg"
    Name = "public-ip-bastion"
    Location = "EastUS2"
    AllocationMethod = "Static"
    Sku = "Standard"
}
New-AzPublicIpAddress @publicIpParams
```

Create an Azure Bastion host with [New-AzBastion](/powershell/module/az.network/new-azbastion). The following example creates an Azure Bastion host named *bastion* in the *AzureBastionSubnet* subnet of the *vnet-1* virtual network. Azure Bastion is used to securely connect Azure virtual machines without exposing them to the public internet.

```azurepowershell-interactive
$bastionParams = @{
    ResourceGroupName = "test-rg"
    Name = "bastion"
    VirtualNetworkName = "vnet-1"
    PublicIpAddressName = "public-ip-bastion"
    PublicIpAddressRgName = "test-rg"
    VirtualNetworkRgName = "test-rg"
}
New-AzBastion @bastionParams -AsJob
```

### Create a second virtual network

Create a second virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named **vnet-1** with the address prefix **10.1.0.0/16**.

>[!NOTE]
>The second virtual network can be in the same region as the first virtual network or in a different region. You don't need a Bastion deployment for the second virtual network. After the network peer, you can connect to both virtual machines with the same Bastion deployment.

```azurepowershell-interactive
$vnet1 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    Name = "vnet-2"
    AddressPrefix = "10.1.0.0/16"
}
$virtualNetwork1 = New-AzVirtualNetwork @vnet1
```

Create a subnet configuration with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). The following example creates a subnet configuration with a **10.1.0.0/24** address prefix:

```azurepowershell-interactive
$subConfig = @{
    Name = "subnet-1"
    AddressPrefix = "10.1.0.0/24"
    VirtualNetwork = $virtualNetwork1
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subConfig
```

### [CLI](#tab/cli)

---

### [Portal](#tab/portal)

<a name="peer-virtual-networks"></a>

[!INCLUDE [virtual-network-create-network-peer.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create-network-peer.md)]

### [PowerShell](#tab/powershell)

## Peer virtual networks

Create a peering with [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering). The following example peers **vnet-1** to **vnet-2**.

```azurepowershell-interactive
$peerConfig1 = @{
    Name = "vnet-1-to-vnet-2"
    VirtualNetwork = $virtualNetwork1
    RemoteVirtualNetworkId = $virtualNetwork2.Id
}
Add-AzVirtualNetworkPeering @peerConfig1
```

In the output returned after the previous command executes, you see that the **PeeringState** is **Initiated**. The peering remains in the **Initiated** state until you create the peering from **vnet-2** to **vnet-1**. Create a peering from **vnet-2** to **vnet-1**.

```azurepowershell-interactive
$peerConfig2 = @{
    Name = "vnet-2-to-vnet-1"
    VirtualNetwork = $virtualNetwork2
    RemoteVirtualNetworkId = $virtualNetwork1.Id
}
Add-AzVirtualNetworkPeering @peerConfig2
```

In the output returned after the previous command executes, you see that the **PeeringState** is **Connected**. Azure also changed the peering state of the **vnet-1-to-vnet-2** peering to **Connected**. Confirm that the peering state for the **vnet-1-to-vnet-2** peering changed to **Connected** with [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering).

```azurepowershell-interactive
$peeringState = @{
    ResourceGroupName = "test-rg"
    VirtualNetworkName = "vnet-1"
}
Get-AzVirtualNetworkPeering @peeringState | Select PeeringState
```

Resources in one virtual network cannot communicate with resources in the other virtual network until the **PeeringState** for the peerings in both virtual networks is **Connected**.

### [CLI](#tab/cli)

---

## Create virtual machines

Create a virtual machine in each virtual network to test the communication between them.

### [Portal](#tab/portal)

[!INCLUDE [create-test-virtual-machine-linux.md](~/reusable-content/ce-skilling/azure/includes/create-test-virtual-machine-linux.md)]

Repeat the previous steps to create a second virtual machine in the second virtual network with the following values:

| Setting | Value |
| --- | --- |
| Virtual machine name | **vm-2** |
| Region | **East US 2** or same region as **vnet-2**. |
| Virtual network | Select **vnet-2**. |
| Subnet | Select **subnet-1 (10.1.0.0/24)**. |
| Public IP | **None** |
| Network security group name | **nsg-2** |

### [PowerShell](#tab/powershell)

### Create the first VM

Create a VM with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates a VM named **vm-1** in the **vnet-1** virtual network. The `-AsJob` option creates the VM in the background, so you can continue to the next step. When prompted, enter the user name and password for the virtual machine.

```azurepowershell-interactive
$vm1 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    VirtualNetworkName = "vnet-1"
    SubnetName = "subnet-1"
    ImageName = "Win2019Datacenter"
    Name = "vm-1"
}
New-AzVm @vm1 -AsJob
```

### Create the second VM

```azurepowershell-interactive
$vm2 = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    VirtualNetworkName = "vnet-2"
    SubnetName = "subnet-1"
    ImageName = "Win2019Datacenter"
    Name = "vm-2"
}
New-AzVm @vm2
```

The VM takes a few minutes to create. Don't continue with the later steps until Azure creates **vm-2** and returns output to PowerShell.

### [CLI](#tab/cli)

---

Wait for the virtual machines to be created before continuing with the next steps.

## Connect to a virtual machine

Use `ping` to test the communication between the virtual machines.

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect**.

1. In the **Connect to virtual machine** page, select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password you created when you created the VM, and then select **Connect**.

## Communicate between VMs

1. At the bash prompt for **vm-1**, enter `ping -c 4 vm-2`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-1:~$ ping -c 4 vm-2
    PING vm-2.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.1.0.4) 56(84) bytes of data.
    64 bytes from vm-2.internal.cloudapp.net (10.1.0.4): icmp_seq=1 ttl=64 time=1.83 ms
    64 bytes from vm-2.internal.cloudapp.net (10.1.0.4): icmp_seq=2 ttl=64 time=0.987 ms
    64 bytes from vm-2.internal.cloudapp.net (10.1.0.4): icmp_seq=3 ttl=64 time=0.864 ms
    64 bytes from vm-2.internal.cloudapp.net (10.1.0.4): icmp_seq=4 ttl=64 time=0.890 ms
    ```

1. Close the Bastion connection to **vm-1**.

1. Repeat the steps in [Connect to a virtual machine](#connect-to-a-virtual-machine) to connect to **vm-2**.

1. At the bash prompt for **vm-2**, enter `ping -c 4 vm-1`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-2:~$ ping -c 4 vm-1
    PING vm-1.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.4) 56(84) bytes of data.
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=1 ttl=64 time=0.695 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=2 ttl=64 time=0.896 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=3 ttl=64 time=3.43 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=4 ttl=64 time=0.780 ms
    ```

1. Close the Bastion connection to **vm-2**.

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

### [CLI](#tab/cli)

---

## Next steps

In this tutorial, you:

* Created virtual network peering between two virtual networks.

* Tested the communication between two virtual machines over the virtual network peering with `ping`.

To learn more about a virtual network peering:

> [!div class="nextstepaction"]
> [Virtual network peering](virtual-network-peering-overview.md)
