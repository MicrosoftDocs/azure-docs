---
title: Create a global load balancer with cross-subscription backends
titleSuffix: Azure Load Balancer
description: Learn how to create a global load balancer with cross-subscription backends by connecting a virtual network in a subscription to a load balancer in a different subscription.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 02/20/2025
ms.author: mbender
ms.custom: devx-track-azurepowershell
# Customer intent: As a cloud architect, I want to configure a global load balancer with backends across multiple subscriptions, so that I can optimize traffic management and resource utilization across different Azure environments.
---

# Create a global load balancer with cross-subscription backends

In this article, you learn how to create a global load balancer with cross-subscription backends.

A [cross-subscription load balancer](cross-subscription-overview.md) can reference a virtual network that resides in a different subscription other than the load balancers. This feature allows you to deploy a load balancer in one subscription and reference a virtual network in another subscription.

## Prerequisites

# [Azure PowerShell](#tab/azurepowershell)

- Two Azure subscriptions. 
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/free/)
- A global public IP address deployed in **Azure Subscription A** located in a [Global load balancer home region](cross-subscription-how-to-global-backend.md).
- A regional load balancer deployed in **Azure Subscription A**.
- Azure PowerShell installed locally or Azure Cloud Shell.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see Install Azure PowerShell module. If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!IMPORTANT]
> All of the code samples will use example names and placeholders. Be sure to replace these with the values from your environment.
> The values needing replacement will be enclosed in angle brackets, like this: `<example value>`.
> 
  
# [Azure CLI](#tab/azurecli/)

- Two Azure subscriptions. One subscription for the virtual network (**Azure Subscription A**) and another subscription for the load balancer(**Azure Subscription B**).
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/free/)
- A global public IP address deployed in **Azure Subscription A** located in a [Global load balancer home region](cross-subscription-how-to-global-backend.md).
- A regional load balancer deployed in **Azure Subscription A**. For this example, the load balancer is called **load-balancer-regional** in a resource group called **resource-group-a**.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.60 or later. To find the version, run az --version. If you need to install or upgrade, see Install the Azure CLI.

> [!IMPORTANT]
> All of the code samples will use example names and placeholders. Be sure to replace these with the values from your environment.
> The values needing replacement will be enclosed in angle brackets, like this: `<example value>`.

---

## Sign in to Azure

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you sign into Azure with [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount), and change your subscription context with [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) to **Azure Subscription A**. Then get the regional load balancer information with [`Get-AzLoadBalancer`](/powershell/module/az.network/get-azloadbalancer) and [`Get-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/get-azloadbalancerfrontendipconfig). You need the Azure subscription ID, resource group name, and virtual network name from your environment.
 

```azurepowershell

# Sign in to Azure
Connect-AzAccount

# Set the subscription context to Azure Subscription A
Set-AzContext -Subscription '<Subscription ID of Subscription A>'     

# Get the Virtual Network information with Get-AzVirtualNetwork
$rlb= @{
    Name = 'load-balancer-regional'
    ResourceGroupName = 'resource-group-a'
}
$rlbinfo = Get-AzLoadBalancer @rlb
$rlbfe = Get-AzLoadBalancerFrontendIpConfig @rlbinfo

```

# [Azure CLI](#tab/azurecli/)

```azurecli

With Azure CLI, you'll sign into Azure with [az login](/cli/azure/reference-index#az-login), and change your subscription context with [`az account set`](/cli/azure/account#az_account_set) to **Azure Subscription A**.

```azurecli

# Sign in to Azure CLI and change subscription to Azure Subscription B
Az login
Az account set –subscription '<Subscription ID of Subscription B>' 
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
    Name = 'resource-group-b'
    Location = 'eastus2'
}
New-AzResourceGroup @rg
```
> [!NOTE]
> When creating the resource group for your load balancer, use the same Azure region as the virtual network in **Azure Subscription A**.

# [Azure CLI](#tab/azurecli/)

With Azure CLI, you switch the subscription context with [`az account set`](/cli/azure/account#az_account_set) and create a resource group with [`az group create`](/cli/azure/group#az_group_create).

```azurecli
# Create a resource group in Azure Subscription B
az group create --name resource-group-b --location eastus2
```

> [!NOTE]
> When create the resource group for your load balancer, use the same Azure region as the virtual network in **Azure Subscription A**.

---

## Create a global load balancer

In this section, you create the resources needed for the global load balancer.
A global standard sku public IP is used for the frontend of the global load balancer.

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you:

- Use [`New-AzPublicIpAddress`](/powershell/module/az.network/new-azpublicipaddress) to create the public IP address.
- Create a frontend IP configuration with [`New-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/new-azloadbalancerfrontendipconfig).
- Create a backend address pool with [`New-AzLoadBalancerBackendAddressPoolConfig`](/powershell/module/az.network/new-azloadbalancerbackendaddresspoolconfig).
- Create a load balancer rule with [`Add-AzLoadBalancerRuleConfig`](/powershell/module/az.network/add-azloadbalancerruleconfig).
- Create a global load Balancer with [`New-AzLoadBalancer`](/powershell/module/az.network/new-azloadbalancer).

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
    Location = ‘eastus2’
    Sku = 'Standard'
    Tier = 'Global'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bepool
    LoadBalancingRule = $rule
}
$lb = New-AzLoadBalancer @lbp
```

# [Azure CLI](#tab/azurecli/)

With Azure CLI, you:

- Create a global load balancer with [`az network cross-region-lb create`](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-create).
- Create a load balancer rule with [`az network cross-region-lb rule create`](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-rule-create).

```azurecli

# Create global load balancer
az network cross-region-lb create --name load-balancer-global --resource-group resource-group-b --frontend-ip-name front-end-config-global --backend-pool-name backend-pool-global

# create a load balancer rule
az network cross-region-lb rule create --backend-port 80 --frontend-port 80 --lb-name load-balancer-global --name HTTP-rule-global --protocol tcp --resource-group resource-group-b --backend-pool-name backend-pool-global --frontend-ip-name front-end-config-global

```
---

## Add load balancer frontends to global load balancer

In this section, you add a frontend IP configuration to the global load balancer.

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you:

- Use [`Set-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/set-azloadbalancerfrontendipconfig) to add the regional load balancer frontend to the global backend pool.
- Use [`New-AzLoadBalancerBackendAddressConfig`](/powershell/module/az.network/new-azloadbalancerbackendaddressconfig) to create the backend address pool configuration for the load balancer.

```azurepowershell

## Create the global backend address pool configuration for region 2 ##
$rlbbaf = @{
    Name = 'backend-pool-config-regional'
    LoadBalancerFrontendIPConfigurationId = $rlbfe.Id
}
$beaddressconfigRLB = New-AzLoadBalancerBackendAddressConfig @region2ap

## Apply the backend address pool configuration for the global load balancer ##
$bepoolcr = @{
    ResourceGroupName = 'resource-group-b'
    LoadBalancerName = 'load-balancer-global'
    Name = 'backend-pool-global'
    LoadBalancerBackendAddress = $beaddressconfigRLB
}
Set-AzLoadBalancerBackendAddressPool @bepoolcr

```

# [Azure CLI](#tab/azurecli/)

With Azure CLI, you add the frontends you placed in variables in the backend pool of the global load balancer with use [`az network cross-region-lb address-pool`](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-address-pool).

```azurecli

az network cross-region-lb address-pool address add \
    --frontend-ip-address ‘/subscriptions/Subscription A/resourceGroups/rg-name/providers/Microsoft.Network/loadBalancers/rlb-name /frontendIPConfigurations/rlb-lb Frontend Name’ 
    --lb-name load-balancer-global \
    --name myFrontEnd-R2 \
    --pool-name backend-pool-global \
    --resource-group resource-group-b
```

## Next steps

> [!div class="nextstepaction"]
> [Create a cross-subscription internal load balancer](./cross-subscription-how-to-internal-load-balancer.md)
