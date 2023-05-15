---
 title: include file
 description: include file
 services: virtual-machines
 author: msmbaldwin
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/06/2019
 ms.author: mbaldwin
 ms.custom: include file, devx-track-azurepowershell
---
Azure Disk Encryption can be enabled and managed through the [Azure CLI](/cli/azure) and [Azure PowerShell](/powershell/azure/new-azureps-module-az). To do so you must install the tools locally and connect to your Azure subscription.

### Azure CLI

The [Azure CLI 2.0](/cli/azure) is a command-line tool for managing Azure resources. The CLI is designed to flexibly query data, support long-running operations as non-blocking processes, and make scripting easy. You can install it locally by following the steps in [Install the Azure CLI](/cli/azure/install-azure-cli).

To [Sign in to your Azure account with the Azure CLI](/cli/azure/authenticate-azure-cli), use the [az login](/cli/azure/reference-index#az-login) command.

```azurecli
az login
```

If you would like to select a tenant to sign in under, use:
    
```azurecli
az login --tenant <tenant>
```

If you have multiple subscriptions and want to specify a specific one, get your subscription list with [az account list](/cli/azure/account#az-account-list) and specify with [az account set](/cli/azure/account#az-account-set).
     
```azurecli
az account list
az account set --subscription "<subscription name or ID>"
```

For more information, see [Get started with Azure CLI 2.0](/cli/azure/get-started-with-azure-cli). 

### Azure PowerShell
The [Azure PowerShell az module](/powershell/azure/new-azureps-module-az) provides a set of cmdlets that uses the [Azure Resource Manager](../articles/azure-resource-manager/management/overview.md) model for managing your Azure resources. You can use it in your browser with [Azure Cloud Shell](../articles/cloud-shell/overview.md), or you can install it on your local machine using the instructions in [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell). 

If you already have it installed locally, make sure you use the latest version of Azure PowerShell SDK version to configure Azure Disk Encryption. Download the latest version of [Azure PowerShell release](https://github.com/Azure/azure-powershell/releases).

To [Sign in to your Azure account with Azure PowerShell](/powershell/azure/authenticate-azureps), use the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

```powershell
Connect-AzAccount
```

If you have multiple subscriptions and want to specify one, use the [Get-AzSubscription](/powershell/module/Az.Accounts/Get-AzSubscription) cmdlet to list them, followed by the [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet:

```powershell
Set-AzContext -Subscription <SubscriptionId>
```

Running the [Get-AzContext](/powershell/module/Az.Accounts/Get-AzContext) cmdlet will verify that the correct subscription has been selected.

To confirm the Azure Disk Encryption cmdlets are installed, use the [Get-command](/powershell/module/microsoft.powershell.core/get-command) cmdlet:
     
```powershell
Get-command *diskencryption*
```
For more information, see [Getting started with Azure PowerShell](/powershell/azure/get-started-azureps).
