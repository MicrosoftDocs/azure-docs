---
title: Configure routing preference for a public IP address
description: Learn how to create a public IP with an Internet traffic routing preference using the Azure portal, Azure PowerShell, or Azure CLI.
services: virtual-network
ms.date: 07/25/2024
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.topic: how-to
---

# Configure routing preference for a public IP address

This article shows you how to configure [routing preference](routing-preference-overview.md) via ISP network (**Internet** option) for a public IP address using the Azure portal, Azure PowerShell, or Azure CLI. After creating the public IP address, you can associate it with the following Azure resources for inbound and outbound traffic to the internet:

* Virtual machine
* Virtual machine scale set
* Azure Kubernetes Service (AKS)
* Internet-facing load balancer
* Application Gateway
* Azure Firewall

By default, the routing preference for public IP address is set to the Microsoft global network for all Azure services and can be associated with any Azure service.

## Prerequisites

# [Azure portal](#tab/azureportal)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

# [Azure CLI](#tab/azurecli/)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.49 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

# [Azure PowerShell](#tab/azurepowershell/)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]
If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 6.9.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

---

## Create a public IP address with a routing preference

# [Azure portal](#tab/azureportal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource**.
3. In the search box, type *Public IP address*.
3. In the search results, select **Public IP address**. Next, in the **Public IP address** page, select **Create**.
1. For SKU, select **Standard**.
1. For **Routing preference**, select **Internet**.

      ![Create a public ip address](./media/routing-preference-portal/public-ip-new.png)
1. In the **IPv4 IP Address Configuration** section, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription.|
    | Resource group | Select **Create new**, enter *RoutingPreferenceResourceGroup*, then select **OK**. |
    | Location | Select **East US**.|
    | Availability zone | Keep the default value - **Zone-redundant**. |
1. Select **Create**.

    > [!NOTE]
    > Public IP addresses are created with an IPv4 or IPv6 address. However, routing preference only supports IPV4 currently.

You can associate the above created public IP address with a [Windows](../../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md) to associate the public IP to your VM. You can also associate the public IP address created above with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

# [Azure CLI](#tab/azurecli/)

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group in the **East US** Azure region:

```azurecli
  az group create --name myResourceGroup --location eastus
```
## Create a public IP address

Create a Public IP Address with routing preference of **Internet** type using command [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create), with the format as shown below.

The following command creates a new public IP with **Internet** routing preference in the **East US** Azure region.

```azurecli
az network public-ip create \
--name MyRoutingPrefIP \
--resource-group MyResourceGroup \
--location eastus \
--ip-tags 'RoutingPreference=Internet' \
--sku STANDARD \
--allocation-method static \
--version IPv4
```

> [!NOTE]
>  Currently, routing preference only supports IPV4 public IP addresses.

You can associate the above created public IP address with a [Windows](../../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md) to associate the Public IP to your VM. You can also associate the public IP address created above with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

# [Azure PowerShell](#tab/azurepowershell/)

The following command creates a new public IP with a routing preference type as *Internet* in the *East US* Azure region:

```azurepowershell
$iptagtype="RoutingPreference"
$tagName = "Internet"
$ipTag = New-AzPublicIpTag -IpTagType $iptagtype -Tag $tagName 
# attach the tag
$publicIp = New-AzPublicIpAddress  `
-Name "MyPublicIP" `
-ResourceGroupName $rg.ResourceGroupName `
-Location $rg.Location `
-IpTag $ipTag `
-AllocationMethod Static `
-Sku Standard `
-IpAddressVersion IPv4
```

You can associate the above created public IP address with a [Windows](../../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md) to associate the Public IP to your VM. You can also associate the public IP address created above with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

---


## Next steps
- Learn more about [public IP with routing preference](routing-preference-overview.md).
- [Configure routing preference for a VM](./tutorial-routing-preference-virtual-machine-portal.md).
- [Configure routing preference for a VM using the Azure CLI](./configure-routing-preference-virtual-machine-cli.md).
- [Configure routing preference for a VM using the Azure PowerShell](./configure-routing-preference-virtual-machine-powershell.md).
