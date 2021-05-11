---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 05/05/2021
ms.author: msmbaldwin

# Used by articles that register native client applications in the B2C tenant.

---

### Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Use the Azure CLI [az group create](/cli/azure/group#az_group_create) command or the Azure PowerShell [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a resource group named *myResourceGroup* in the *eastus* location.

# [Azure CLI](#tab/azure-cli)
```azurecli
az group create --name "myResourceGroup" -l "EastUS"
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
New-AzResourceGroup -Name myResourceGroup -Location eastus
```
---

### Register the microsoft.ConfidentialLedger resoure provider

A resource provider is a service that supplies Azure resources. The Confidential Ledger resource provider is 'microsoft.ConfidentialLedger'. Use the Azure CLI [az provider register](/powershell/module/az.resources/new-azresourcegroup) command or the Azure PowerShell [Register-AzureRmResourceProvider](/powershell/module/azurerm.resources/register-azurermresourceprovider) cmdlet to register the Confidential Ledger resource provider, u.

# [Azure CLI](#tab/azure-cli)
```azurecli
az provider register -namespace "microsoft.ConfidentialLedger"
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Register-AzureRmResourceProvider -ProviderNamespace "microsoft.ConfidentialLedger"
```
---
