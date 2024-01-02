---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 11/08/2022
ms.author: cshoe
---

## Setup

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

---

Ensure you're running the latest version of the CLI via the upgrade command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

You must have the latest Az module installed.  Ignore warnings about modules currently in use.

```azurepowershell
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
```

---

# [Bash](#tab/bash)

Next, install or update the Azure Container Apps extension for the CLI.

```azurecli
az extension add --name containerapp --upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

Install the Az.App module if it isn't installed.

```azurepowershell
Install-Module -Name Az.App
```

If you have an older version of the Az.App module installed, update it.

```azurepowershell
Update-Module -Name Az.App
```

---

Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces if you haven't already registered them in your Azure subscription.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
```

```azurecli
az provider register --namespace Microsoft.OperationalInsights
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.App
```

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.OperationalInsights
```

---
