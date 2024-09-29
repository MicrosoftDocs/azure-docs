---
title: Attach a cross-subscription frontend to an Azure Load Balancer
titleSuffix: Azure Load Balancer
description: Learn how to create a load balancer in one Azure subscription and attach a frontend IP address from another subscription in Azure Load Balancer.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 06/18/2024
ms.author: mbender
ms.custom: devx-track-azurepowershell
---

# Attach a cross-subscription frontend to an Azure Load Balancer

In this article, you learn how to create a load balancer in one Azure subscription and attach a frontend IP address from another subscription. You create a resource group for the load balancer and then create a load balancer with a frontend IP address. You also create a backend address pool, health probe, and load balancer rule.

A [cross-subscription load balancer](cross-subscription-overview.md) can reference a virtual network that resides in a different subscription other than the load balancers. This feature allows you to deploy a load balancer in one subscription and reference a virtual network in another subscription.

[!INCLUDE [load-balancer-cross-subscription-preview](../../includes/load-balancer-cross-subscription-preview.md)]

## Prerequisites

# [Azure PowerShell](#tab/azurepowershell)

- Two Azure subscriptions. One subscription for the virtual network and another subscription for the load balancer.
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/free/)
- A public IP address deployed in one of the subscriptions. For this example, the public IP address is in **Azure Subscription A**.
- An existing [Virtual Network](../virtual-network/quick-create-powershell.md). deployed in one of the subscriptions. For this example, the virtual network is in **Azure Subscription B**.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see Install Azure PowerShell module. If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!IMPORTANT]
> All of the code samples will use example names and placeholders. Be sure to replace these with the values from your environment.
> The values needing replacement will be enclosed in angle brackets, like this: `<example value>`.
> 
  
# [Azure CLI](#tab/azurecli/)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- Two Azure subscriptions. One subscription for the virtual network (**Azure Subscription A**) and another subscription for the load balancer(**Azure Subscription B**).
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/free/)
- A public IP address deployed in one of the subscriptions. For this example, the public IP address is in **Azure Subscription A**.
- An existing [Virtual Network](../virtual-network/quick-create-cli.md). deployed in one of the subscriptions. For this example, the virtual network is in **Azure Subscription B**.

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.60 or later. To find the version, run az --version. If you need to install or upgrade, see Install the Azure CLI.

> [!IMPORTANT]
> All of the code samples will use example names and placeholders. Be sure to replace these with the values from your environment.
> The values needing replacement will be enclosed in angle brackets, like this: `<example value>`.

---

## Sign in to Azure

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you sign into Azure with [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount), and change your subscription context with [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) to **Azure Subscription A**. Then get the public IP address information with [`Get-AzPublicIpAddress`](/powershell/module/az.network/get-azpublicipaddress). You need the Azure subscription ID, resource group name, and virtual network name from your environment.
 

```azurepowershell

# Sign in to Azure
Connect-AzAccount

# Set the subscription context to Azure Subscription A
Set-AzContext -Subscription '<Azure Subscription A>'     

# Get the Public IP address information with Get-AzPublicIpAddress
$publicIp = Get-AzPublicIpAddress @pip
```

# [Azure CLI](#tab/azurecli/)

With Azure CLI, you'll sign into Azure with [az login](/cli/azure/reference-index#az-login), and change your subscription context with [`az account set`](/cli/azure/account#az_account_set) to **Azure Subscription A**.

```azurecli

# Sign in to Azure CLI and change subscription to Azure Subscription A
Az login
Az account set –subscription <Azure Subscription A>
```

---

## Create a resource group

In this section, you create a resource group in **Azure Subscription B**. This resource group is for all of your resources associate with your load balancer.

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you switch the subscription context with [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) and create a resource group with [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup).

```azurepowershell

# Set the subscription context to Azure Subscription B
Set-AzContext -Subscription '<Azure Subscription B>'  

# Create a resource group  
$rg = @{
    Name = 'myResourceGroupLB'
    Location = 'westus'
}
New-AzResourceGroup @rg

```
> [!NOTE]
> When create the resource group for your load balancer, use the same Azure region as the virtual network in **Azure Subscription A**.

# [Azure CLI](#tab/azurecli/)

With Azure CLI, you switch the subscription context with [`az account set`](/cli/azure/account#az_account_set) and create a resource group with [`az group create`](/cli/azure/group#az_group_create).

```azurecli
# Create a resource group in Azure Subscription B
az group create --name 'myResourceGroupLB' --location westus
```

> [!NOTE]
> When create the resource group for your load balancer, use the same Azure region as the virtual network in **Azure Subscription A**.

---

## Create a load balancer 

In this section, you create a load balancer in **Azure Subscription B**. You create a load balancer with a frontend IP address.

# [Azure PowerShell](#tab/azurepowershell)

Create a load balancer with [`New-AzLoadBalancer`](/powershell/module/az.network/new-azloadbalancer), add a frontend IP configuration with [`Add-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/add-azloadbalancerfrontendipconfig), and then create a backend address pool with [`New-AzLoadBalancerBackendAddressPool`](/powershell/module/az.network/new-azloadbalancerbackendaddresspool).

```azurepowershell
# Create a load balancer

$tags = @{
'IsRemoteFrontend'= 'true'
}

$loadbalancer = @{
    ResourceGroupName = 'myResourceGroupLB'
    Name = 'myLoadBalancer'
    Location = 'westus'
    Sku = 'Standard'
    Tag = $tags
}


$LB = New-AzLoadBalancer @loadbalancer
 
$LBinfo = @{
    ResourceGroupName = 'myResourceGroupLB'
    Name = 'myLoadBalancer'
}


$fip = @{
    Name = 'Frontend Name'
    PublicIpAddress = $publicip
}
$LB = $LB | Add-AzLoadBalancerFrontendIpConfig @fip
$LB = $LB | Set-AzLoadBalancer

## Create backend address pool configuration and place in variable. 
$net = @{
    Name = 'vnet name'
    ResourceGroupName = 'myResourceGroupLB'
}
$vnet = Get-AzVirtualNetwork @net

$be = @{
    ResourceGroupName= "myResourceGroupLB"
    Name= "myBackEndPool"
    LoadBalancerName= "myLoadBalancer"
    VirtualNetwork=$vnet.id
    SyncMode= "Automatic"
}
 
#create the backend pool
$backend = New-AzLoadBalancerBackendAddressPool @be
$LB = Get-AzLoadBalancer @LBinfo

```
# [Azure CLI](#tab/azurecli/)

With Azure CLI, you create a load balancer with [`az network lb create`](/cli/azure/network/lb#az_network_lb_create) and update the backend pool. This example configures the following resources:

- A frontend IP address that receives the incoming network traffic on the load balancer.
  - The public IP address is pulled from subscription A, and the load balancer is deployed in subscription B.
  - The `IsRemoteFrontend:True` tag is added since the IP address is cross-subscription.
- A backend address pool where the frontend IP sends the load balanced network traffic.

```azurecli

# Create a load balancer

az network lb create --resource-group myResourceGroupLB --name myLoadBalancer --sku Standard --public-ip-address '/subscriptions/<subscription A ID>/resourceGroups/{resource group name} /providers/Microsoft.Network/publicIPAddresses/{public IP address name}’  --frontend-ip-name myFrontEnd --backend-pool-name MyBackendPool --tags 'IsRemoteFrontend=true'
```

In order to utilize the cross-subscription feature of Azure load balancer, backend pools need to have the syncMode property enabled and a virtual network reference. This section updates the backend pool created prior by attaching the cross-subscription virtual network and enabling the syncMode property. 

```azurecli
## Configure the backend address pool and syncMode property
az network lb address-pool update --lb-name myLoadBalancer --resource-group myResourceGroupLB -n myResourceGroupLB --vnet ‘/subscriptions/<subscription A ID>/resourceGroups/{resource group name}/providers/Microsoft.Network/virtualNetwork/{VNet name}’ --sync-mode Automatic
```

---

[!INCLUDE [load-balancer-cross-subscription-health-probe-rules](../../includes/load-balancer-cross-subscription-health-probe-rules.md)]

[!INCLUDE [load-balancer-cross-subscription-clean-up](../../includes/load-balancer-cross-subscription-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create a cross-subscription internal load balancer](./cross-subscription-how-to-internal-load-balancer.md)
