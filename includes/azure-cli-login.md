---
ms.topic: include
ms.date: 07/25/2022
author: dbradish-microsoft
ms.author: dbradish
manager: barbkess
ms.custom: devx-track-azurecli
---

##### [Bash](#tab/az-login-terminal-bash) 

A developer should install [Azure CLI](/cli/azure/install-azure-cli) and sign in interactively with the [az login](/cli/azure/authenticate-azure-cli#sign-in-interactively) command to log in to Azure before use the DefaultAzureCredential in code. 

```bash
az login
```

##### [PowerShell](#tab/az-login-terminal-ps)

To authenticate with Azure PowerShell users can run the Connect-AzAccount cmdlet. By default, like the Azure CLI, Connect-AzAccount will launch the default web browser to authenticate a user account.

```powershell
Connect-AzAccount
```

##### [Visual Studio Code](#tab/az-login-vscode)

If you're using Visual Studio Code, you can also sign in to Azure with the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account).

---