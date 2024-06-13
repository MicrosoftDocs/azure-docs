---
title: Configure Virtual Machine Scale Set with an existing Azure Load Balancer - Azure portal/CLI/PowerShell
description: Learn to configure a Virtual Machine Scale Set with an existing Azure standard Load Balancer using the Azure portal, Azure CLI or Azure PowerShell.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to
ms.date: 01/11/2024
ms.custom: template-quickstart, engagement-fy23, devx-track-azurecli, devx-track-azurepowershell
---

# Configure a Virtual Machine Scale Set with an existing Azure Standard Load Balancer

In this article, you'll learn how to configure a Virtual Machine Scale Set with an existing Azure Load Balancer. With an existing virtual network and standard sku load balancer, you can deploy a Virtual Machine Scale Set with a few clicks in the Azure portal, or with a few lines of code in the Azure CLI or Azure PowerShell using the tabs below.

# [Azure Portal](#tab/portal)

## Prerequisites

- An Azure subscription.
- An existing standard sku load balancer in the subscription where the Virtual Machine Scale Set will be deployed.
- An Azure Virtual Network for the Virtual Machine Scale Set.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Deploy Virtual Machine Scale Set with existing load balancer

In this section, you'll create a Virtual Machine Scale Set in the Azure portal with an existing Azure load balancer.

> [!NOTE]
> The following steps assume a virtual network named **myVNet** and an Azure load balancer named **myLoadBalancer** has been previously deployed.

1. On the top left-hand side of the screen, select **Create a resource** and search for **Virtual Machine Scale Set** in the marketplace search.

1. Select **Virtual machine scale set** and Select **Create**.

1. In **Create a virtual machine scale set**, enter, or select this information in the **Basics** tab:

    | Setting                        | Value                                                                                                 |
    |--------------------------------|-------------------------------------------------------------------------------------------------------|
    | **Project details**            |                                                                                                       |
    | Subscription                   | Select your Azure subscription                                                                        |
    | Resource Group                 | Select  Create new, enter **myResourceGroup**, then select OK, or select an existing  resource group. |
    | **Scale set details**          |                                                                                                       |
    | Virtual Machine Scale Set name | Enter **myVMSS**                                                                                      |
    | Region                         | Select **East US 2**                                                                                  |
    | Availability zone              | Select **None**                                                                                       |
    | **Orchestration** |                    |
    | Orchestration mode | Select **Uniform** |
    | Security type | Select **Standard** |
    | **Instance details**           |                                                                                                       |
    | Image                          | Select **Ubuntu Server 18.04 LTS**                                                                    |
    | Azure Spot instance            | Select **No**                                                                                         |
    | Size                           | Leave at default                                                                                      |
    | **Administrator account**      |                                                                                                       |
    | Authentication type            | Select **Password**                                                                                   |
    | Username                       | Enter your admin username        |
    | Password                       | Enter your admin password    |
    | Confirm password               | Reenter your admin password |

    :::image type="content" source="media/vm-scale-sets/create-virtual-machine-scale-set-thumb.png" alt-text="Screenshot of Create a Virtual Machine Scale Set page." lightbox="media/vm-scale-sets/create-virtual-machine-scale-set.png":::

4. Select the **Networking** tab.

5. Enter or select this information in the **Networking** tab:

    | Setting                           | Value                                                    |
    |-----------------------------------|----------------------------------------------------------|
    | **Virtual Network Configuration** |                                                          |
    | Virtual network                   | Select **myVNet** or your existing virtual network.      |
    | **Load balancing**                |                                                          |
    | Use a load balancer               | Select **Yes**                                           |
    | **Load balancing settings**       |                                                          |
    | Load balancing options            | Select **Azure load balancer**                           |
    | Select a load balancer            | Select **myLoadBalancer** or your existing load balancer |
    | Select a backend pool             | Select **myBackendPool** or your existing backend pool.  |

    :::image type="content" source="media/vm-scale-sets/create-virtual-machine-scale-set-network-thumb.png" alt-text="Screenshot shows the Create Virtual Machine Scale Set Networking tab." lightbox="media/vm-scale-sets/create-virtual-machine-scale-set-network.png":::

6. Select the **Management** tab.

7. In the **Management** tab, set **Boot diagnostics** to **Off**.

8. Select the blue **Review + create** button.

9. Review the settings and select the **Create** button.

# [Azure CLI](#tab/cli)

## Prerequisites 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- You need an existing standard sku load balancer in the subscription where the Virtual Machine Scale Set will be deployed.

- You need an Azure Virtual Network for the Virtual Machine Scale Set.
 
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Deploy a Virtual Machine Scale Set with existing load balancer

Deploy a Virtual Machine Scale Set with [`az vmss create`](/cli/azure/vmss#az-vmss-create).
Replace the values in brackets with the names of the resources in your configuration.

```azurecli-interactive
az vmss create \
    --resource-group <resource-group> \
    --name <vmss-name>\
    --image <your-image> \
    --admin-username <admin-username> \
    --generate-ssh-keys  \
    --upgrade-policy-mode Automatic \
    --instance-count 3 \
    --vnet-name <virtual-network-name> \
    --subnet <subnet-name> \
    --lb <load-balancer-name> \
    --backend-pool-name <backend-pool-name>
```

The below example deploys a Virtual Machine Scale Set with:

- Virtual Machine Scale Set named **myVMSS**
- Azure Load Balancer named **myLoadBalancer**
- Load balancer backend pool named **myBackendPool**
- Azure Virtual Network named **myVnet**
- Subnet named **mySubnet**
- Resource group named **myResourceGroup**
- Ubuntu Server image for the Virtual Machine Scale Set

```azurecli-interactive
az vmss create \
    --resource-group myResourceGroup \
    --name myVMSS \
    --image Canonical:UbuntuServer:18.04-LTS:latest \
    --admin-username adminuser \
    --generate-ssh-keys \
    --upgrade-policy-mode Automatic \
    --instance-count 3 \
    --vnet-name myVnet\
    --subnet mySubnet \
    --lb myLoadBalancer \
    --backend-pool-name myBackendPool
```
> [!NOTE]
> After the scale set has been created, the backend port cannot be modified for a load balancing rule used by a health probe of the load balancer. To change the port, you can remove the health probe by updating the Azure virtual machine scale set, update the port and then configure the health probe again.


# [Azure PowerShell](#tab/powershell)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing resource group for all resources.
- An existing standard sku load balancer in the subscription where the Virtual Machine Scale Set will be deployed.
- An Azure Virtual Network for the Virtual Machine Scale Set.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Sign in to Azure CLI

Sign into Azure with [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount#example-1-connect-to-an-azure-account)

```azurepowershell-interactive
Connect-AzAccount
```

## Deploy a Virtual Machine Scale Set with existing load balancer
Deploy a Virtual Machine Scale Set with [`New-AzVMss`](/powershell/module/az.compute/new-azvmss). Replace the values in brackets with the names of the resources in your configuration.

```azurepowershell-interactive

$rsg = <resource-group>
$loc = <location>
$vms = <vm-scale-set-name>
$vnt = <virtual-network>
$sub = <subnet-name>
$lbn = <load-balancer-name>
$pol = <upgrade-policy-mode>
$img = <image-name>
$bep = <backend-pool-name>

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn

New-AzVmss -ResourceGroupName $rsg -Location $loc -VMScaleSetName $vms -VirtualNetworkName $vnt -SubnetName $sub -LoadBalancerName $lb -UpgradePolicyMode $pol

```

The below example deploys a Virtual Machine Scale Set with the following values:

- Virtual Machine Scale Set named **myVMSS**
- Azure Load Balancer named **myLoadBalancer**
- Load balancer backend pool named **myBackendPool**
- Azure Virtual Network named **myVnet**
- Subnet named **mySubnet**
- Resource group named **myResourceGroup**

```azurepowershell-interactive

$rsg = "myResourceGroup"
$loc = "East US 2"
$vms = "myVMSS"
$vnt = "myVnet"
$sub = "mySubnet"
$pol = "Automatic"
$lbn = "myLoadBalancer"
$bep = "myBackendPool"

$lb = Get-AzLoadBalancer -ResourceGroupName $rsg -Name $lbn

New-AzVmss -ResourceGroupName $rsg -Location $loc -VMScaleSetName $vms -VirtualNetworkName $vnt -SubnetName $sub -LoadBalancerName $lb -UpgradePolicyMode $pol -BackendPoolName $bep

```
> [!NOTE]
> After the scale set has been created, the backend port cannot be modified for a load balancing rule used by a health probe of the load balancer. To change the port, you can remove the health probe by updating the Azure virtual machine scale set, update the port and then configure the health probe again.

## Next steps

In this article, you deployed a Virtual Machine Scale Set with an existing Azure Load Balancer.  To learn more about Virtual Machine Scale Sets and load balancer, see:

- [What is Azure Load Balancer?](load-balancer-overview.md)
- [What are Virtual Machine Scale Sets?](../virtual-machine-scale-sets/overview.md)
