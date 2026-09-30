---
title: Create a global load balancer with cross-subscription backends
titleSuffix: Azure Load Balancer
description: Learn how to create a global load balancer with cross-subscription backends by connecting a virtual network in a subscription to a load balancer in a different subscription.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 08/06/2026
ms.author: mbender
ms.custom: devx-track-azurepowershell
# Customer intent: As a cloud architect, I want to configure a global load balancer with backends across multiple subscriptions, so that I can optimize traffic management and resource utilization across different Azure environments.
---

# Create a global load balancer with cross-subscription backends

In this article, you learn how to create a global load balancer with cross-subscription backends.

A [cross-subscription load balancer](cross-subscription-overview.md) can reference a virtual network that resides in a different subscription other than the load balancers. This feature allows you to deploy a load balancer in one subscription and reference a virtual network in another subscription.

## Prerequisites

# [Azure PowerShell](#tab/azurepowershell)

- Two Azure subscriptions. One subscription for the regional load balancer and its virtual network (**Azure Subscription A**) and another subscription for the global load balancer (**Azure Subscription B**).
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A regional load balancer deployed in **Azure Subscription A**.
- Azure PowerShell installed locally or Azure Cloud Shell.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!IMPORTANT]
> All of the code samples use example names and placeholders. Be sure to replace these values with the values from your environment.
> The values needing replacement are enclosed in angle brackets, like this: `<example value>`.
> 
  
# [Azure CLI](#tab/azurecli)

- Two Azure subscriptions. Use one subscription for the virtual network (**Azure Subscription A**) and another subscription for the load balancer (**Azure Subscription B**).
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A regional load balancer deployed in **Azure Subscription A**. For this example, the load balancer is called **load-balancer-regional** in a resource group called **resource-group-a**.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

> [!IMPORTANT]
> All of the code samples use example names and placeholders. Be sure to replace these values with the values from your environment.
> The values needing replacement are enclosed in angle brackets, like this: `<example value>`.

---

## Sign in to Azure

# [Azure PowerShell](#tab/azurepowershell)

By using Azure PowerShell, you sign in to Azure by using [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount), and change your subscription context by using [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) to **Azure Subscription A**. Then get the regional load balancer information by using [`Get-AzLoadBalancer`](/powershell/module/az.network/get-azloadbalancer) and [`Get-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/get-azloadbalancerfrontendipconfig). You need the Azure subscription ID, resource group name, and load balancer name from your environment.
 

```azurepowershell

# Sign in to Azure
Connect-AzAccount

# Set the subscription context to Azure Subscription A
Set-AzContext -Subscription '<Subscription ID of Subscription A>'     

# Get the regional load balancer information with Get-AzLoadBalancer
$rlb = @{
    Name = 'load-balancer-regional'
    ResourceGroupName = 'resource-group-a'
}
$rlbinfo = Get-AzLoadBalancer @rlb
$rlbfe = Get-AzLoadBalancerFrontendIpConfig -LoadBalancer $rlbinfo

```

# [Azure CLI](#tab/azurecli)

By using Azure CLI, you sign in to Azure by using [`az login`](/cli/azure/reference-index#az-login), and change your subscription context by using [`az account set`](/cli/azure/account#az-account-set) to **Azure Subscription B**.

```azurecli
# Sign in to Azure CLI and change subscription to Azure Subscription B
az login
az account set --subscription '<Subscription ID of Subscription B>'
```

---

## Create a resource group

In this section, you create a resource group in **Azure Subscription B**. This resource group is for all of your resources associated with your load balancer.

# [Azure PowerShell](#tab/azurepowershell)

By using Azure PowerShell, you switch the subscription context by using [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) and create a resource group by using [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup).

```azurepowershell

# Set the subscription context to Azure Subscription B
Set-AzContext -Subscription '<Azure Subscription B>'  

# Create a resource group  
$rg = @{
    Name = 'resource-group-b'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```
> [!NOTE]
> When you create the resource group for your global load balancer, use a [Global load balancer home region](cross-region-overview.md#home-regions-in-azure).

# [Azure CLI](#tab/azurecli)

By using Azure CLI, you can switch the subscription context by using [`az account set`](/cli/azure/account#az-account-set) and create a resource group by using [`az group create`](/cli/azure/group#az-group-create).

```azurecli
# Create a resource group in Azure Subscription B
az group create --name resource-group-b --location eastus2
```

> [!NOTE]
> When you create the resource group for your global load balancer, use a [Global load balancer home region](cross-region-overview.md#home-regions-in-azure).

---

## Create a global load balancer

In this section, you create the resources needed for the global load balancer.
The frontend of the global load balancer uses a global standard SKU public IP. Because Azure global Load Balancer doesn't support cross-subscription frontends, you deploy this public IP address in **Azure Subscription B** along with the global load balancer.

# [Azure PowerShell](#tab/azurepowershell)

By using Azure PowerShell, you:

- Create the public IP address by using [`New-AzPublicIpAddress`](/powershell/module/az.network/new-azpublicipaddress).
- Create a frontend IP configuration by using [`New-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/new-azloadbalancerfrontendipconfig).
- Create a backend address pool by using [`New-AzLoadBalancerBackendAddressPoolConfig`](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig).
- Create a load balancer rule by using [`Add-AzLoadBalancerRuleConfig`](/powershell/module/az.network/add-azloadbalancerruleconfig).
- Create a global load balancer by using [`New-AzLoadBalancer`](/powershell/module/az.network/new-azloadbalancer).

```azurepowershell
# Create global IP address for load balancer
$ip = @{
    Name = 'public-IP-global'
    ResourceGroupName = 'resource-group-b'
    Location = 'eastus2'
    Sku = 'Standard'
    Tier = 'Global'
    AllocationMethod = 'Static'
}
$publicIP = New-AzPublicIpAddress @ip

# Create frontend configuration
$fe = @{
    Name = 'front-end-config-global'
    PublicIpAddress = $publicIP
}
$feip = New-AzLoadBalancerFrontendIpConfig @fe

# Create backend address pool
$be = @{
    Name = 'backend-pool-global'
}
$bepool = New-AzLoadBalancerBackendAddressPoolConfig @be

# Create the load balancer rule
$rul = @{
    Name = 'HTTP-rule-global'
    Protocol = 'tcp'
    FrontendPort = '80'
    BackendPort = '80'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bepool
}
$rule = New-AzLoadBalancerRuleConfig @rul

# Create global load balancer resource
$lbp = @{
    ResourceGroupName = 'resource-group-b'
    Name = 'load-balancer-global'
    Location = 'eastus2'
    Sku = 'Standard'
    Tier = 'Global'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bepool
    LoadBalancingRule = $rule
}
$lb = New-AzLoadBalancer @lbp
```

# [Azure CLI](#tab/azurecli)

By using Azure CLI, you:

- Create a global load balancer by using [`az network cross-region-lb create`](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-create).
- Create a load balancer rule by using [`az network cross-region-lb rule create`](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-rule-create).

```azurecli

# Create global load balancer
az network cross-region-lb create --name load-balancer-global --resource-group resource-group-b --frontend-ip-name front-end-config-global --backend-pool-name backend-pool-global

# create a load balancer rule
az network cross-region-lb rule create --backend-port 80 --frontend-port 80 --lb-name load-balancer-global --name HTTP-rule-global --protocol tcp --resource-group resource-group-b --backend-pool-name backend-pool-global --frontend-ip-name front-end-config-global

```
---

## Add load balancer frontends to global load balancer

In this section, you add a regional load balancer's frontend IP configuration as a backend address in the global load balancer's backend pool. Because the regional load balancers are in a different subscription than the global load balancer, this configuration is a cross-subscription backend configuration.

# [Azure PowerShell](#tab/azurepowershell)

By using Azure PowerShell, you:

- Create a backend address that references the regional load balancer's frontend IP configuration by using [`New-AzLoadBalancerBackendAddressConfig`](/powershell/module/az.network/new-azloadbalancerbackendaddressconfig).
- Apply the backend address to the global load balancer's backend pool by using [`Set-AzLoadBalancerBackendAddressPool`](/powershell/module/az.network/set-azloadbalancerbackendaddresspool).

```azurepowershell

## Create the backend address configuration from the regional load balancer frontend ##
$rlbbaf = @{
    Name = 'backend-pool-config-regional'
    LoadBalancerFrontendIPConfigurationId = $rlbfe.Id
}
$beaddressconfigRLB = New-AzLoadBalancerBackendAddressConfig @rlbbaf

## Apply the backend address pool configuration for the global load balancer ##
$bepoolcr = @{
    ResourceGroupName = 'resource-group-b'
    LoadBalancerName = 'load-balancer-global'
    Name = 'backend-pool-global'
    LoadBalancerBackendAddress = $beaddressconfigRLB
}
Set-AzLoadBalancerBackendAddressPool @bepoolcr

```

# [Azure CLI](#tab/azurecli)

By using Azure CLI, you can add the regional load balancer frontend to the backend pool of the global load balancer by using [`az network cross-region-lb address-pool address add`](/cli/azure/network/cross-region-lb/address-pool/address#az-network-cross-region-lb-address-pool-address-add).

```azurecli
az network cross-region-lb address-pool address add \
    --frontend-ip-address '/subscriptions/<Subscription ID of Subscription A>/resourceGroups/resource-group-a/providers/Microsoft.Network/loadBalancers/load-balancer-regional/frontendIPConfigurations/<regional frontend IP configuration name>' \
    --lb-name load-balancer-global \
    --name myFrontEnd-R2 \
    --pool-name backend-pool-global \
    --resource-group resource-group-b
```

---

## Next steps

> [!div class="nextstepaction"]
> [Create a cross-subscription internal load balancer](./cross-subscription-how-to-internal-load-balancer.md)
