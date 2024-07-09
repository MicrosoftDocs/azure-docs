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

## Sign in to Azure

# [Azure PowerShell](#tab/azurepowershell)

With Azure PowerShell, you sign into Azure with [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount), and change your subscription context with [`Set-AzContext`](/powershell/module/az.accounts/set-azcontext) to **Azure Subscription A**. Then get the virtual network information with [`Get-AzVirtualNetwork`](/powershell/module/az.network/get-azvirtualnetwork). You need the Azure subscription ID, resource group name, and virtual network name from your environment.
 

```azurepowershell

# Sign in to Azure
Connect-AzAccount

# Set the subscription context to Azure Subscription A
Set-AzContext -Subscription '<Azure Subscription A>'     

# Get the Virtual Network information with Get-AzVirtualNetwork
$net = @{
    Name = '<vnet name>'
    ResourceGroupName = '<Resource Group Subscription A>'
}
$vnet = Get-AzVirtualNetwork @net
```

# [Azure CLI](#tab/azurecli/)

```azurecli

With Azure CLI, you'll sign into Azure with [az login](/cli/azure/reference-index#az-login), and change your subscription context with [`az account set`](/cli/azure/account#az_account_set) to **Azure Subscription A**.

```azurecli

# Sign in to Azure CLI and change subscription to Azure Subscription A
Az login
Az account set –subscription <Azure Subscription A>
```

---