---
title: Add a dual-stack network to an existing virtual machine
titleSuffix: Azure Virtual Network
description: Learn how to add a dual stack network to an existing virtual machine using the Azure portal, Azure CLI, or Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 07/24/2024
ms.custom: template-how-to, powershell, cli
---

# Add a dual-stack network to an existing virtual machine

In this article, you add IPv6 support to an existing virtual network. You configure an existing virtual machine with both IPv4 and IPv6 addresses. When completed, the existing virtual network supports private IPv6 addresses. The existing virtual machine network configuration contains a public and private IPv4 and IPv6 address. You choose from the Azure portal, Azure CLI, or Azure PowerShell to complete the steps in this article.

## Prerequisites

# [Azure portal](#tab/azureportal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing virtual network, public IP address, and virtual machine in your subscription that is configured for IPv4 support only. For more information about creating a virtual network, public IP address, and a virtual machine, see [Quickstart: Create a Linux virtual machine in the Azure portal](/azure/virtual-machines/linux/quick-create-portal).

    - The example virtual network used in this article is named **myVNet**. Replace this value with the name of your virtual network.
    
    - The example virtual machine used in this article is named **myVM**. Replace this value with the name of your virtual machine.
    
    - The example public IP address used in this article is named **myPublicIP**. Replace this value with the name of your public IP address.

# [Azure CLI](#tab/azurecli/)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- An existing virtual network, public IP address, and virtual machine in your subscription that is configured for IPv4 support only. For more information about creating a virtual network, public IP address, and a virtual machine, see [Quickstart: Create a Linux virtual machine with the Azure CLI](/azure/virtual-machines/linux/quick-create-cli).

    - The example virtual network used in this article is named **myVNet**. Replace this value with the name of your virtual network.
    
    - The example virtual machine used in this article is named **myVM**. Replace this value with the name of your virtual machine.
    
    - The example public IP address used in this article is named **myPublicIP**. Replace this value with the name of your public IP address.

# [Azure PowerShell](#tab/azurepowershell/)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

- An existing virtual network, public IP address, and virtual machine in your subscription that is configured for IPv4 support only. For more information about creating a virtual network, public IP address, and a virtual machine, see [Quickstart: Create a Linux virtual machine in Azure with PowerShell](/azure/virtual-machines/linux/quick-create-powershell).

    - The example virtual network used in this article is named **myVNet**. Replace this value with the name of your virtual network.
    
    - The example virtual machine used in this article is named **myVM**. Replace this value with the name of your virtual machine.
    
    - The example public IP address used in this article is named **myPublicIP**. Replace this value with the name of your public IP address.
  
---

## Add IPv6 to virtual network

# [Azure portal](#tab/azureportal)

In this section, you add an IPv6 address space and subnet to your existing virtual network.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **myVNet** in **Virtual networks**.

4. Select **Address space** in **Settings**.

5. Select the box **Add additional address range**. Enter **2404:f800:8000:122::/63**.

6. Select **Save**.

7. Select **Subnets** in **Settings**.

8. In **Subnets**, select your subnet name from the list. In this example, the subnet name is **default**. 

9. In the subnet configuration, select the box **Add IPv6 address space**.

10. In **IPv6 address space**, enter **2404:f800:8000:122::/64**.

11. Select **Save**.

# [Azure CLI](#tab/azurecli/)

In this section, you add an IPv6 address space and subnet to your existing virtual network.

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to update the virtual network.

```azurecli-interactive
az network vnet update \
    --address-prefixes 10.0.0.0/16 2404:f800:8000:122::/63 \
    --resource-group myResourceGroup \
    --name myVNet
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) to create the subnet.

```azurecli-interactive
az network vnet subnet update \
    --address-prefixes 10.0.0.0/24 2404:f800:8000:122::/64 \
    --name myBackendSubnet \
    --resource-group myResourceGroup \
    --vnet-name myVNet
```

# [Azure PowerShell](#tab/azurepowershell/)

In this section, you add an IPv6 address space and subnet to your existing virtual network.

Use [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) to update the virtual network.

```azurepowershell-interactive
## Place your virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Place address space into a variable. ##
$IPAddressRange = '2404:f800:8000:122::/63'

## Add the address space to the virtual network configuration. ##
$vnet.AddressSpace.AddressPrefixes.Add($IPAddressRange)

## Save the configuration to the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to add the new IPv6 subnet to the virtual network.

```azurepowershell-interactive
## Place your virtual network into a variable. ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroup'
}
$vnet = Get-AzVirtualNetwork @net

## Create the subnet configuration. ##
$sub = @{
    Name = 'myBackendSubnet'
    AddressPrefix = '10.0.0.0/24','2404:f800:8000:122::/64'
    VirtualNetwork = $vnet
}
Set-AzVirtualNetworkSubnetConfig @sub

## Save the configuration to the virtual network. ##
Set-AzVirtualNetwork -VirtualNetwork $vnet
```

---

## Create IPv6 public IP address

# [Azure portal](#tab/azureportal)


In this section, you create a IPv6 public IP address for the virtual machine.

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

2. Select **+ Create**.

3. Enter or select the following information in **Create public IP address**.

    | Setting | Value |
    | ------- | ----- |
    | IP version | Select IPv6. |
    | SKU | Select **Standard**. |
    | **IPv6 IP Address Configuration** |  |
    | Name | Enter **myPublicIP-IPv6**. |
    | Idle timeout (minutes) | Leave the default of **4**. |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. In this example, the resource group is named **myResourceGroup**. |
    | Location | Select your location. In this example, the location is **East US 2**. |
    | Availability zone | Select **Zone-redundant**. |

4. Select **Create**.

# [Azure CLI](#tab/azurecli/)

In this section, you create a IPv6 public IP address for the virtual machine.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create the public IP address.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myPublicIP-Ipv6 \
    --sku Standard \
    --version IPv6 \
    --zone 1 2 3
```

# [Azure PowerShell](#tab/azurepowershell/)

In this section, you create a IPv6 public IP address for the virtual machine.

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create the public IP address.

```azurepowershell-interactive
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

---

## Add IPv6 configuration to virtual machine

# [Azure portal](#tab/azureportal)

In this section, you will configure your virtual machine’s network interface to include both a private and a public IPv6 address.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

2. Select **myVM** or your existing virtual machine name.

3. Select **Networking** in **Settings**.

4. Select your network interface name next to **Network Interface:**. In this example, the network interface is named **myvm404**.

5. Select **IP configurations** in **Settings** of the network interface.

6. In **IP configurations**, select **+ Add**.

7. Enter or select the following information in **Add IP configuration**.

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **Ipv6config**. |
    | IP version | Select **IPv6**. |
    | **Private IP address settings** |  |
    | Allocation | Leave the default of **Dynamic**. |
    | Public IP address | Select **Associate**. |
    | Public IP address | Select **myPublic-IPv6**. |

9. Select **OK**.

# [Azure CLI](#tab/azurecli/)

Use [az network nic ip-config create](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-create) to create the IPv6 configuration for the network interface. The **`--nic-name`** used in the example is **myvm569**. Replace this value with the name of the network interface in your virtual machine.

```azurecli-interactive
  az network nic ip-config create \
    --resource-group myResourceGroup \
    --name Ipv6config \
    --nic-name myvm569 \
    --private-ip-address-version IPv6 \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --public-ip-address myPublicIP-IPv6
```


# [Azure PowerShell](#tab/azurepowershell/)

Use [New-AzNetworkInterfaceIpConfig](/powershell/module/az.network/new-aznetworkinterfaceipconfig) to create the IPv6 configuration for the network interface. The **`-Name`** used in the example is **myvm569**. Replace this value with the name of the network interface in your virtual machine.

```azurepowershell-interactive
## Place your virtual network into a variable. ##
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

## Place the IPv6 public IP address you created previously into a variable. ##
$pip = @{
    Name = 'myPublicIP-IPv6'
    ResourceGroupName = 'myResourceGroup'
}
$publicIP = Get-AzPublicIPAddress @pip

## Place the network interface into a variable. ##
$net = @{
    Name = 'myvm569'
    ResourceGroupName = 'myResourceGroup'
}
$nic = Get-AzNetworkInterface @net

## Create the configuration for the network interface. ##
$ipc = @{
    Name = 'Ipv6config'
    Subnet = $subnet
    PublicIpAddress = $publicIP
    PrivateIpAddressVersion = 'IPv6'
}
$ipconfig = New-AzNetworkInterfaceIpConfig @ipc

## Add the IP configuration to the network interface. ##
$nic.IpConfigurations.Add($ipconfig)

## Save the configuration to the network interface. ##
$nic | Set-AzNetworkInterface
```
---

## Next steps

In this article, you learned how to add a dual stack IP configuration to an existing virtual network and virtual machine.

For more information about IPv6 and IP addresses in Azure, see:

- [Overview of IPv6 for Azure Virtual Network.](ipv6-overview.md)

- [What is Azure Virtual Network IP Services?](ip-services-overview.md)
