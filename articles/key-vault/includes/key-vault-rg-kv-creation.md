---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 06/12/2024
ms.author: msmbaldwin 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli

# Used by articles that register native client applications in the B2C tenant.

---

This quickstart uses a precreated Azure key vault. You can create a key vault by following the steps in the [Azure CLI quickstart](/azure/key-vault/general/quick-create-cli), [Azure PowerShell quickstart](/azure/key-vault/general/quick-create-powershell), or [Azure portal quickstart](/azure/key-vault/general/quick-create-portal). 

Alternatively, you can run these Azure CLI or Azure PowerShell commands.

> [!Important]
> Each key vault must have a unique name. Replace \<your-unique-keyvault-name\> with the name of your key vault in the following examples.

# [Azure CLI](#tab/azure-cli)
```azurecli
az group create --name "myResourceGroup" -l "EastUS"

az keyvault create --name "<your-unique-keyvault-name>" -g "myResourceGroup" --enable-rbac-authorization
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
New-AzResourceGroup -Name myResourceGroup -Location eastus

New-AzKeyVault -Name <your-unique-keyvault-name> -ResourceGroupName myResourceGroup -Location eastus
```
---
