---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 05/05/2021
ms.author: msmbaldwin

---

A resource provider is a service that supplies Azure resources. Use the Azure CLI [az provider register](/cli/azure/provider#az_provider_register) command or the Azure PowerShell [Register-AzureRmResourceProvider](/powershell/module/azurerm.resources/register-azurermresourceprovider) cmdlet to register the Confidential Ledger resource provider, 'microsoft.ConfidentialLedger'.

# [Azure CLI](#tab/azure-cli)
```azurecli
az provider register --namespace "microsoft.ConfidentialLedger"
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Register-AzureRmResourceProvider -ProviderNamespace "microsoft.ConfidentialLedger"
```
---

You can verify that registration is complete with the Azure CLI [az provider register](/cli/azure/provider#az_provider_show) command or the Azure PowerShell [Get-AzureRmResourceProvider](/powershell/module/azurerm.resources/get-azurermresourceprovider) cmdlet.

# [Azure CLI](#tab/azure-cli)
```azurecli
az provider show --namespace "microsoft.ConfidentialLedger"
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzureRmResourceProvider -ProviderNamespace "microsoft.ConfidentialLedger"
```
---
