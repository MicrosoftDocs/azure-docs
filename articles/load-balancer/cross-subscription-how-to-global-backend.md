---
title: Create a global load balancer with cross-subscription backends
titleSuffix: Azure Load Balancer
description: Learn how to create a global load balancer with cross-subscription backends by connecting a virtual network in a subscription to a load balancer in a different subscription.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 06/18/2024
ms.author: mbender
ms.custom: devx-track-azurepowershell
---

# Create a global load balancer with cross-subscription backends

In this article, you learn how to create a global load balancer with cross-subscription backends.

A [cross-subscription load balancer](cross-subscription-overview.md) can reference a virtual network that resides in a different subscription other than the load balancers. This feature allows you to deploy a load balancer in one subscription and reference a virtual network in another subscription.

[!INCLUDE [load-balancer-cross-subscription-preview](../../includes/load-balancer-cross-subscription-preview.md)]

## Prerequisites

# [Azure PowerShell](#tab/azurepowershell)

- Two Azure subscriptions. 
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/free/)
- A global public IP address deployed in **Azure Subscription A**.
- A regional load balancer deployed in **Azure Subscription B**.
- Azure PowerShell installed locally or Azure Cloud Shell.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see Install Azure PowerShell module. If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

> [!IMPORTANT]
> All of the code samples will use example names and placeholders. Be sure to replace these with the values from your environment.
> The values needing replacement will be enclosed in angle brackets, like this: `<example value>`.
> 
  
# [Azure CLI](#tab/azurecli/)

- Two Azure subscriptions. One subscription for the virtual network (**Azure Subscription A**) and another subscription for the load balancer(**Azure Subscription B**).
- An Azure account with active subscriptions. [Create an account for free](https://azure.microsoft.com/free/)
- A global public IP address deployed in **Azure Subscription A**.
- A regional load balancer deployed in **Azure Subscription B**.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

If you choose to install and use the CLI locally, this quickstart requires Azure CLI version 2.60 or later. To find the version, run az --version. If you need to install or upgrade, see Install the Azure CLI.

> [!IMPORTANT]
> All of the code samples will use example names and placeholders. Be sure to replace these with the values from your environment.
> The values needing replacement will be enclosed in angle brackets, like this: `<example value>`.

---

## Sign in to Azure

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you sign into Azure with [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount), and change your subscription context with [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) to **Azure Subscription A**. Then get the regional load balancer information with [`Get-AzLoadBalancer`](/powershell/module/az.network/get-azloadbalancer) and [`Get-AzLoadBalancerFrontendIpConfig](/powershell/module/az.network/get-azloadbalancerfrontendipconfig). You need the Azure subscription ID, resource group name, and virtual network name from your environment.
 

```azurepowershell

# Sign in to Azure
Connect-AzAccount

# Set the subscription context to Azure Subscription A
Set-AzContext -Subscription '<Azure Subscription A>'     

# Get the Virtual Network information with Get-AzVirtualNetwork
$rlb= @{
    Name = '<regional load balancer name>'
    ResourceGroupName = '<Resource Group Subscription A>'
}
$RLB-info = Get-AzLoadBalancer @rlb
$RLBFE = Get-AzLoadBalancerFrontendIpConfig @ RLB-info

```

# [Azure CLI](#tab/azurecli/)

```azurecli

With Azure CLI, you'll sign into Azure with [az login](/cli/azure/reference-index#az-login), and change your subscription context with [`az account set`](/cli/azure/account#az_account_set) to **Azure Subscription A**.

```azurecli

# Sign in to Azure CLI and change subscription to Azure Subscription B
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

## Create a global load balancer

In this section, you create the resources needed for the cross-region load balancer.
A global standard sku public IP is used for the frontend of the cross-region load balancer.

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
    Name = 'myPublicIP-CR'
    ResourceGroupName = ‘ Resource Group B’
    Location = 'eastus2'
    Sku = 'Standard'
    Tier = 'Global'
    AllocationMethod = 'Static'
}
$publicIP = New-AzPublicIpAddress @ip

# Create frontend configuration
$fe = @{
    Name = 'myFrontEnd-CR'
    PublicIpAddress = $publicIP
}
$feip = New-AzLoadBalancerFrontendIpConfig @fe

# Create backend address pool
$be = @{
    Name = 'myBackEndPool-CR'
}
$bepool = New-AzLoadBalancerBackendAddressPoolConfig @be

# Create the load balancer rule
$rul = @{
    Name = 'myHTTPRule-CR'
    Protocol = 'tcp'
    FrontendPort = '80'
    BackendPort = '80'
    FrontendIpConfiguration = $feip
    BackendAddressPool = $bepool
}
$rule = New-AzLoadBalancerRuleConfig @rul

# Create cross-region load balancer resource
$lbp = @{
    ResourceGroupName = ‘ Resource Group B’
    Name = 'myLoadBalancer-CR'
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

- Create a cross-region load balancer with [`az network cross-region-lb create`](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-create).
- Create a load balancer rule with [`az network cross-region-lb rule create`](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-rule-create).

```azurecli

# Create cross-region load balancer
az network cross-region-lb create --name myLoadBalancer-CR --resource-group myResourceGroupLB-CR --frontend-ip-name myFrontEnd-CR --backend-pool-name myBackEndPool-CR

# create a load balancer rule
az network cross-region-lb rule create --backend-port 80 --frontend-port 80 --lb-name myLoadBalancer-CR --name myHTTPRule-CR --protocol tcp --resource-group myResourceGroupLB-CR --backend-pool-name myBackEndPool-CR --frontend-ip-name myFrontEnd-CR

```
---

## Add load balancer frontends to cross-region load balancer

In this section, you add a frontend IP configuration to the cross-region load balancer.

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you:

- Use [`Set-AzLoadBalancerFrontendIpConfig`](/powershell/module/az.network/set-azloadbalancerfrontendipconfig) to add the regional load balancer frontend to the cross-region backend pool.
- Use [`New-AzLoadBalancerBackendAddressConfig`](/powershell/module/az.network/new-azloadbalancerbackendaddressconfig) to create the backend address pool configuration for the load balancer.

```azurepowershell

## Create the cross-region backend address pool configuration for region 2 ##
$RLB-BAF = @{
    Name = 'MyBackendPoolConfig-RLB'
    LoadBalancerFrontendIPConfigurationId = $RLBFE.Id
}
$beaddressconfigRLB = New-AzLoadBalancerBackendAddressConfig @region2ap

## Apply the backend address pool configuration for the cross-region load balancer ##
$bepoolcr = @{
    ResourceGroupName = ‘ Resource Group B’
    LoadBalancerName = 'myLoadBalancer-CR'
    Name = 'myBackEndPool-CR'
    LoadBalancerBackendAddress = $beaddressconfigRLB
}
Set-AzLoadBalancerBackendAddressPool @bepoolcr

```

# [Azure CLI](#tab/azurecli/)

With Azure CLI, you add the frontends you placed in variables in the backend pool of the cross-region load balancer with use [`az network cross-region-lb address-pool`](/cli/azure/network/cross-region-lb#az-network-cross-region-lb-address-pool).

```azurecli

az network cross-region-lb address-pool address add \
    --frontend-ip-address ‘/subscriptions/Subscription A/resourceGroups/rg-name/providers/Microsoft.Network/loadBalancers/RLB-name /frontendIPConfigurations/RLB-LB Frontend Name’ 
    --lb-name myLoadBalancer-CR \
    --name myFrontEnd-R2 \
    --pool-name myBackEndPool-CR \
    --resource-group myResourceGroupLB-CR
```

## Next steps

> [!div class="nextstepaction"]
> [Create a cross-subscription internal load balancer](./cross-subscription-how-to-internal-load-balancer.md)
