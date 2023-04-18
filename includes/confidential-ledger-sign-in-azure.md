---
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: include
ms.date: 05/05/2021
ms.author: msmbaldwin

# Used by articles that register native client applications in the B2C tenant.

---

Sign in to Azure using the Azure CLI [az login](/cli/azure/reference-index#az-login) command or the Azure PowerShell [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az login
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell-interactive
Connect-AzAccount
```
---

If the CLI or PowerShell can open your default browser, it will do so and load an Azure sign-in page. Otherwise, visit [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the authorization code displayed in your terminal.

If prompted, sign in with your account credentials in the browser.
