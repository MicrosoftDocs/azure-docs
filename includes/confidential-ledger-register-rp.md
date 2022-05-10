---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 05/05/2021
ms.author: msmbaldwin

---

A resource provider is a service that supplies Azure resources. Use the Azure CLI [az provider register](/cli/azure/provider#az-provider-register) command or the Azure PowerShell [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) cmdlet to register the Azure confidential ledger resource provider, 'microsoft.ConfidentialLedger'.

# [Azure CLI](#tab/azure-cli)
```azurecli
az provider register --namespace "microsoft.ConfidentialLedger"
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Register-AzResourceProvider -ProviderNamespace "microsoft.ConfidentialLedger"
```
---

You can verify that registration is complete with the Azure CLI [az provider register](/cli/azure/provider#az-provider-show) command or the Azure PowerShell [Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider) cmdlet.

# [Azure CLI](#tab/azure-cli)
```azurecli
az provider show --namespace "microsoft.ConfidentialLedger"
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzResourceProvider -ProviderNamespace "microsoft.ConfidentialLedger"
```
---
