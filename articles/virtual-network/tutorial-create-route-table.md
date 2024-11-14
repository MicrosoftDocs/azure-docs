---
title: 'Tutorial: Route network traffic with a route table'
titlesuffix: Azure Virtual Network
description: In this tutorial, learn how to route network traffic with a route table.
author: asudbring
ms.service: azure-virtual-network
ms.date: 10/31/2024
ms.author: allensu
ms.topic: tutorial
ms.custom: 
  - template-tutorial
  - devx-track-azurecli
  - devx-track-azurepowershell
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
# Customer intent: I want to route traffic from one subnet, to a different subnet, through a network virtual appliance.
---

# Tutorial: Route network traffic with a route table

Azure routes traffic between all subnets within a virtual network, by default. You can create your own routes to override Azure's default routing. Custom routes are helpful when, for example, you want to route traffic between subnets through a network virtual appliance (NVA).

:::image type="content" source="./media/tutorial-create-route-table-portal/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-create-route-table-portal/resources-diagram.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and subnets
> * Create an NVA that routes traffic
> * Deploy virtual machines (VMs) into different subnets
> * Create a route table
> * Create a route
> * Associate a route table to a subnet
> * Route traffic from one subnet to another through an NVA

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

## Create subnets

A **DMZ** and **Private** subnet are needed for this tutorial. The **DMZ** subnet is where you deploy the NVA, and the **Private** subnet is where you deploy the virtual machines that you want to route traffic to. The **subnet-1** is the subnet created in the previous steps. Use **subnet-1** for the public virtual machine.

### [Portal](#tab/portal)

[!INCLUDE [virtual-network-create-with-bastion.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create-with-bastion.md)]

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. In **Virtual networks**, select **vnet-1**.

1. In **vnet-1**, select **Subnets** from the **Settings** section.

1. In the virtual network's subnet list, select **+ Subnet**.

1. In **Add subnet**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Leave the default of **Default**. |
    | Name | Enter **subnet-private**. |
    | **IPv4** |
    | IPv4 address range | Leave the default of **10.0.0.0/16**. |
    | Starting address | Enter **10.0.2.0**. |
    | Size | Leave the default of **/24 (256 addresses)**. |

    :::image type="content" source="./media/tutorial-create-route-table-portal/create-private-subnet.png" alt-text="Screenshot of private subnet creation in virtual network.":::

1. Select **Add**.

1. Select **+ Subnet**.

1. In **Add subnet**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet purpose | Leave the default of **Default**. |
    | Name | Enter **subnet-dmz**. |
    | **IPv4** |
    | IPv4 address range | Leave the default of **10.0.0.0/16**. |
    | Starting address | Enter **10.0.3.0**. |
    | Size | Leave the default of **/24 (256 addresses)**. |

    :::image type="content" source="./media/tutorial-create-route-table-portal/create-dmz-subnet.png" alt-text="Screenshot of DMZ subnet creation in virtual network.":::

1. Select **Add**.

### [PowerShell](#tab/powershell)

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named *test-rg* for all resources created in this article.

```azurepowershell-interactive
$rg = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
}
New-AzResourceGroup @rg
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named *vnet-1* with the address prefix *10.0.0.0/16*.

```azurepowershell-interactive
$vnet = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    Name = "vnet-1"
    AddressPrefix = "10.0.0.0/16"
}

$virtualNetwork = New-AzVirtualNetwork @vnet
```

Create four subnets by creating four subnet configurations with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). The following example creates four subnet configurations for *Public*, *Private*, *DMZ*, and Azure Bastion subnets.

```azurepowershell-interactive
$subnetConfigPublicParams = @{
    Name = "subnet-1"
    AddressPrefix = "10.0.0.0/24"
    VirtualNetwork = $virtualNetwork
}

$subnetConfigBastionParams = @{
    Name = "AzureBastionSubnet"
    AddressPrefix = "10.0.1.0/24"
    VirtualNetwork = $virtualNetwork
}

$subnetConfigPrivateParams = @{
    Name = "subnet-private"
    AddressPrefix = "10.0.2.0/24"
    VirtualNetwork = $virtualNetwork
}

$subnetConfigDmzParams = @{
    Name = "subnet-dmz"
    AddressPrefix = "10.0.3.0/24"
    VirtualNetwork = $virtualNetwork
}

$subnetConfigPublic = Add-AzVirtualNetworkSubnetConfig @subnetConfigPublicParams
$subnetConfigBastion = Add-AzVirtualNetworkSubnetConfig @subnetConfigBastionParams
$subnetConfigPrivate = Add-AzVirtualNetworkSubnetConfig @subnetConfigPrivateParams
$subnetConfigDmz = Add-AzVirtualNetworkSubnetConfig @subnetConfigDmzParams
```

Write the subnet configurations to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork), which creates the subnets in the virtual network:

```azurepowershell-interactive
$virtualNetwork | Set-AzVirtualNetwork
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

### [CLI](#tab/cli)

Create a resource group with [az group create](/cli/azure/group) for all resources created in this article.

```azurecli-interactive
# Create a resource group.
az group create \
    --name test-rg \
    --location eastus2
```

Create a virtual network with one subnet with [az network vnet create](/cli/azure/network/vnet).

```azurecli-interactive
az network vnet create \
    --name vnet-1 \
    --resource-group test-rg \
    --address-prefix 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefix 10.0.0.0/24
```

Create two more subnets with [az network vnet subnet create](/cli/azure/network/vnet/subnet).

```azurecli-interactive
# Create a bastion subnet.
az network vnet subnet create \
    --vnet-name vnet-1 \
    --resource-group test-rg \
    --name AzureBastionSubnet \
    --address-prefix 10.0.1.0/24

# Create a private subnet.
az network vnet subnet create \
    --vnet-name vnet-1 \
    --resource-group test-rg \
    --name subnet-private \
    --address-prefix 10.0.2.0/24

# Create a DMZ subnet.
az network vnet subnet create \
    --vnet-name vnet-1 \
    --resource-group test-rg \
    --name subnet-dmz \
    --address-prefix 10.0.3.0/24
```

### Create Azure Bastion

Create a public IP address for the Azure Bastion host with [az network public-ip create](/cli/azure/network/public-ip). The following example creates a public IP address named *public-ip-bastion* in the *vnet-1* virtual network.

```azurecli-interactive
az network public-ip create \
    --resource-group test-rg \
    --name public-ip-bastion \
    --location eastus2 \
    --allocation-method Static \
    --sku Standard
```

Create an Azure Bastion host with [az network bastion create](/cli/azure/network/bastion). The following example creates an Azure Bastion host named *bastion* in the *AzureBastionSubnet* subnet of the *vnet-1* virtual network. Azure Bastion is used to securely connect Azure virtual machines without exposing them to the public internet.

```azurecli-interactive
az network bastion create \
    --resource-group test-rg \
    --name bastion \
    --vnet-name vnet-1 \
    --public-ip-address public-ip-bastion \
    --location eastus2
    --no-wait
```

---

## Create an NVA virtual machine

Network virtual appliances (NVAs) are virtual machines that help with network functions, such as routing and firewall optimization. In this section, create an NVA using an **Ubuntu 24.04** virtual machine.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-nva**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-dmz (10.0.3.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Advanced**. |
    | Configure network security group | Select **Create new**. </br> In **Name** enter **nsg-nva**. </br> Select **OK**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Create the VM with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates a VM named *vm-nva*.

```azurepowershell-interactive
# Create a credential object
$cred = Get-Credential

# Define the VM parameters
$vmParams = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    Name = "vm-nva"
    ImageName = "Canonical:ubuntu-24_04-lts:server-gen1:latest"
    Size = "Standard_DS1_v2"
    Credential = $cred
    VirtualNetworkName = "vnet-1"
    SubnetName = "subnet-dmz"
    PublicIpAddressName = $null  # No public IP address
}

# Create the VM
New-AzVM @vmParams
```

### [CLI](#tab/cli)

Create a VM to be used as the NVA in the *subnet-dmz* subnet with [az vm create](/cli/azure/vm). 

```azurecli-interactive
az vm create \
    --resource-group test-rg \
    --name vm-nva \
    --image Ubuntu2204 \
    --public-ip-address "" \
    --subnet subnet-dmz \
    --vnet-name vnet-1 \
    --admin-username azureuser \
    --authentication-type password
```

The VM takes a few minutes to create. Don't continue to the next step until Azure finishes creating the VM and returns output about the VM.

---

## Create public and private virtual machines

Create two virtual machines in the **vnet-1** virtual network. One virtual machine is in the **subnet-1** subnet, and the other virtual machine is in the **subnet-private** subnet. Use the same virtual machine image for both virtual machines.

### Create public virtual machine

The public virtual machine is used to simulate a machine in the public internet. The public and private virtual machine are used to test the routing of network traffic through the NVA virtual machine.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-public**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

### Create private virtual machine

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In **Create a virtual machine** enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **vm-private**. |
    | Region | Select **(US) East US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Ubuntu Server 24.04 LTS - x64 Gen2**. |
    | VM architecture | Leave the default of **x64**. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |  |
    | Public inbound ports | Select **None**. |

1. Select **Next: Disks** then **Next: Networking**.

1. In the Networking tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-private (10.0.2.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Leave the rest of the options at the defaults and select **Review + create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Create a VM in the *subnet-1* subnet with [New-AzVM](/powershell/module/az.compute/new-azvm). The following example creates a VM named *vm-public* in the *subnet-public* subnet of the *vnet-1* virtual network.

```azurepowershell-interactive
# Create a credential object
$cred = Get-Credential

# Define the VM parameters
$vmParams = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    Name = "vm-public"
    ImageName = "Canonical:ubuntu-24_04-lts:server-gen1:latest"
    Size = "Standard_DS1_v2"
    Credential = $cred
    VirtualNetworkName = "vnet-1"
    SubnetName = "subnet-1"
    PublicIpAddressName = $null  # No public IP address
}

# Create the VM
New-AzVM @vmParams
```

Create a VM in the *subnet-private* subnet.

```azurepowershell-interactive
# Create a credential object
$cred = Get-Credential

# Define the VM parameters
$vmParams = @{
    ResourceGroupName = "test-rg"
    Location = "EastUS2"
    Name = "vm-private"
    ImageName = "Canonical:ubuntu-24_04-lts:server-gen1:latest"
    Size = "Standard_DS1_v2"
    Credential = $cred
    VirtualNetworkName = "vnet-1"
    SubnetName = "subnet-private"
    PublicIpAddressName = $null  # No public IP address
}

# Create the VM
New-AzVM @vmParams
```

The VM takes a few minutes to create. Don't continue with the next step until the VM is created and Azure returns output to PowerShell.

### [CLI](#tab/cli)

Create a VM in the *subnet-1* subnet with [az vm create](/cli/azure/vm). The `--no-wait` parameter enables Azure to execute the command in the background so you can continue to the next command.

```azurecli-interactive
az vm create \
    --resource-group test-rg \
    --name vm-public \
    --image Ubuntu2204 \
    --vnet-name vnet-1 \
    --subnet subnet-1 \
    --public-ip-address "" \
    --admin-username azureuser \
    --authentication-type password \
    --no-wait
```

Create a VM in the *subnet-private* subnet.

```azurecli-interactive
az vm create \
    --resource-group test-rg \
    --name vm-private \
    --image Ubuntu2204 \
    --vnet-name vnet-1 \
    --subnet subnet-private \
    --public-ip-address "" \
    --admin-username azureuser \
    --authentication-type password
```
---

## Enable IP forwarding

To route traffic through the NVA, turn on IP forwarding in Azure and in the operating system of **vm-nva**. When IP forwarding is enabled, any traffic received by **vm-nva** that's destined for a different IP address, isn't dropped and is forwarded to the correct destination.

### Enable IP forwarding in Azure

In this section, you turn on IP forwarding for the network interface of the **vm-nva** virtual machine.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-nva**.

1. In **vm-nva**, expand **Networking** then select **Network settings**.

1. Select the name of the interface next to **Network Interface:**. The name begins with **vm-nva** and has a random number assigned to the interface. The name of the interface in this example is **vm-nva313**.

    :::image type="content" source="./media/tutorial-create-route-table-portal/nva-network-interface.png" alt-text="Screenshot of network interface of NVA virtual machine.":::

1. In the network interface overview page, select **IP configurations** from the **Settings** section.

1. In **IP configurations**, select the box next to **Enable IP forwarding**.

    :::image type="content" source="./media/tutorial-create-route-table-portal/enable-ip-forwarding.png" alt-text="Screenshot of enablement of IP forwarding.":::

1. Select **Apply**.

### [PowerShell](#tab/powershell)

Enable IP forwarding for the network interface of the **vm-nva** virtual machine with [Set-AzNetworkInterface](/powershell/module/az.network/set-aznetworkinterface). The following example enables IP forwarding for the network interface named *vm-nva313*.

```azurepowershell-interactive
$nicParams = @{
  Name = "vm-nva"
  ResourceGroupName = "test-rg"
}
$nic = Get-AzNetworkInterface @nicParams

$nic.EnableIPForwarding = $true

Set-AzNetworkInterface -NetworkInterface $nic
```

### [CLI](#tab/cli)

Enable IP forwarding for the network interface of the **vm-nva** virtual machine with [az network nic update](/cli/azure/network/nic). The following example enables IP forwarding for the network interface named *vm-nvaVMNic*.

```azurecli-interactive
az network nic update \
    --name vm-nvaVMNic \
    --resource-group test-rg \
    --ip-forwarding true
```

---

## Enable IP forwarding in the operating system

In this section, turn on IP forwarding for the operating system of the **vm-nva** virtual machine to forward network traffic. Use the Azure Bastion service to connect to the **vm-nva** virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-nva**.

1. Select **Connect**, then **Connect via Bastion** in the **Overview** section.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. Enter the following information at the prompt of the virtual machine to enable IP forwarding:

    ```bash
    sudo vim /etc/sysctl.conf
    ``` 

1. In the Vim editor, remove the **`#`** from the line **`net.ipv4.ip_forward=1`**:

    Press the **Insert** key.

    ```bash
    # Uncomment the next line to enable packet forwarding for IPv4
    net.ipv4.ip_forward=1
    ```

    Press the **Esc** key.

    Enter **`:wq`** and press **Enter**.

1. Close the Bastion session.

1. Restart the virtual machine.

## Create a route table

In this section, create a route table to define the route of the traffic through the NVA virtual machine. The route table is associated to the **subnet-1** subnet where the **vm-public** virtual machine is deployed.

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In **Create Route table** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |   |
    | Region | Select **East US 2**. |
    | Name | Enter **route-table-public**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**. 

1. Select **Create**.

## Create a route

In this section, create a route in the route table that you created in the previous steps.

1. In the search box at the top of the portal, enter **Route table**. Select **Route tables** in the search results.

1. Select **route-table-public**.

1. Expand **Settings** then select **Routes**.

1. Select **+ Add** in **Routes**.

1. Enter or select the following information in **Add route**:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **to-private-subnet**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **10.0.2.0/24**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.3.4**. </br> **_This is the IP address of the vm-nva you created in the earlier steps._**. |

    :::image type="content" source="./media/tutorial-create-route-table-portal/add-route.png" alt-text="Screenshot of route creation in route table.":::

1. Select **Add**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. Enter or select the following information in **Associate subnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Subnet | Select **subnet-1**. |

1. Select **OK**.

### [PowerShell](#tab/powershell)

Create a route table with [New-AzRouteTable](/powershell/module/az.network/new-azroutetable). The following example creates a route table named *route-table-public*.

```azurepowershell-interactive
$routeTableParams = @{
    Name = 'route-table-public'
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
}
$routeTablePublic = New-AzRouteTable @routeTableParams
```

Create a route by retrieving the route table object with [Get-AzRouteTable](/powershell/module/az.network/get-azroutetable), create a route with [Add-AzRouteConfig](/powershell/module/az.network/add-azrouteconfig), then write the route configuration to the route table with [Set-AzRouteTable](/powershell/module/az.network/set-azroutetable).

```azurepowershell-interactive
$routeTableParams = @{
    ResourceGroupName = "test-rg"
    Name = "route-table-public"
}

$routeConfigParams = @{
    Name = "to-private-subnet"
    AddressPrefix = "10.0.2.0/24"
    NextHopType = "VirtualAppliance"
    NextHopIpAddress = "10.0.3.4"
}

$routeTable = Get-AzRouteTable @routeTableParams
$routeTable | Add-AzRouteConfig @routeConfigParams | Set-AzRouteTable
```

Associate the route table with the **subnet-1** subnet with [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig). The following example associates the *route-table-public* route table with the *subnet-1* subnet.

```azurepowershell-interactive
$vnetParams = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$virtualNetwork = Get-AzVirtualNetwork @vnetParams

$subnetParams = @{
    VirtualNetwork = $virtualNetwork
    Name = 'subnet-1'
    AddressPrefix = '10.0.0.0/24'
    RouteTable = $routeTablePublic
}
Set-AzVirtualNetworkSubnetConfig @subnetParams | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Create a route table with [az network route-table create](/cli/azure/network/route-table#az-network-route-table-create). The following example creates a route table named *route-table-public*.

```azurecli-interactive
# Create a route table
az network route-table create \
    --resource-group test-rg \
    --name route-table-public
```

Create a route in the route table with [az network route-table route create](/cli/azure/network/route-table/route#az-network-route-table-route-create).

```azurecli-interactive
az network route-table route create \
    --name to-private-subnet \
    --resource-group test-rg \
    --route-table-name route-table-public \
    --address-prefix 10.0.2.0/24 \
    --next-hop-type VirtualAppliance \
    --next-hop-ip-address 10.0.3.4
```

Associate the *route-table-subnet-public* route table to the *subnet-1* subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet).

```azurecli-interactive
az network vnet subnet update \
    --vnet-name vnet-1 \
    --name subnet-1 \
    --resource-group test-rg \
    --route-table route-table-public
```

---

## Test the routing of network traffic

Test routing of network traffic from **vm-public** to **vm-private**. Test routing of network traffic from **vm-private** to **vm-public**.

### Test network traffic from vm-public to vm-private

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-public**.

1. Select **Connect** then **Connect via Bastion** in the **Overview** section.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. In the prompt, enter the following command to trace the routing of network traffic from **vm-public** to **vm-private**:

    ```bash
    tracepath vm-private
    ```

    The response is similar to the following example:

    ```output
    azureuser@vm-public:~$ tracepath vm-private
     1?: [LOCALHOST]                      pmtu 1500
     1:  vm-nva.internal.cloudapp.net                          1.766ms 
     1:  vm-nva.internal.cloudapp.net                          1.259ms 
     2:  vm-private.internal.cloudapp.net                      2.202ms reached
     Resume: pmtu 1500 hops 2 back 1 
    ```
    
    You can see that there are two hops in the above response for **`tracepath`** ICMP traffic from **vm-public** to **vm-private**. The first hop is **vm-nva**. The second hop is the destination **vm-private**.

    Azure sent the traffic from **subnet-1** through the NVA and not directly to **subnet-private** because you previously added the **to-private-subnet** route to **route-table-public** and associated it to **subnet-1**.

1. Close the Bastion session.

### Test network traffic from vm-private to vm-public

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **vm-private**.

1. Select **Connect** then **Connect via Bastion** in the **Overview** section.

1. Enter the username and password you entered when the virtual machine was created.

1. Select **Connect**.

1. In the prompt, enter the following command to trace the routing of network traffic from **vm-private** to **vm-public**:

    ```bash
    tracepath vm-public
    ```

    The response is similar to the following example:

    ```output
    azureuser@vm-private:~$ tracepath vm-public
     1?: [LOCALHOST]                      pmtu 1500
     1:  vm-public.internal.cloudapp.net                       2.584ms reached
     1:  vm-public.internal.cloudapp.net                       2.147ms reached
     Resume: pmtu 1500 hops 1 back 2 
    ```

    You can see that there's one hop in the above response, which is the destination **vm-public**.

    Azure sent the traffic directly from **subnet-private** to **subnet-1**. By default, Azure routes traffic directly between subnets.

1. Close the Bastion session.


### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

When no longer needed, use [Remove-AzResourcegroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains.

```azurepowershell-interactive
$rgParams = @{
    Name = "test-rg"
}
Remove-AzResourceGroup @rgParams -Force
```

### [CLI](#tab/cli)

When no longer needed, use [az group delete](/cli/azure/group) to remove the resource group and all of the resources it contains.

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes \
    --no-wait
```

---

## Next steps

In this tutorial, you:

* Created a route table and associated it to a subnet.

* Created a simple NVA that routed traffic from a public subnet to a private subnet. 

You can deploy different preconfigured NVAs from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking), which provide many useful network functions. 

To learn more about routing, see [Routing overview](virtual-networks-udr-overview.md) and [Manage a route table](manage-route-table.yml).

To learn how to restrict network access to PaaS resources with virtual network service endpoints, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Restrict network access using service endpoints](tutorial-restrict-network-access-to-resources.md)
