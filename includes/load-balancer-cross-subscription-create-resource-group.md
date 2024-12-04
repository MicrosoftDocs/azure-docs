---
 title: include file
 description: include file
 services: load-balancer
 author: mbender
 ms.service: load-balancer
 ms.topic: include
 ms.date: 05/31/2024
 ms.author: mbender-ms
ms.custom: include-file
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
