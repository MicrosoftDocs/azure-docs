---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 04/30/2024
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

To ensure you're running the latest version of the CLI, run the upgrade command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
```

Ignore any warnings about modules currently in use.

---

Next, install or update the Azure Container Apps extension for the CLI.

# [Bash](#tab/bash)

```azurecli
az extension add --name containerapp --upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Install-Module -Name Az.App
```

If you have an older version of the Az.App module installed, update it.

```azurepowershell
Update-Module -Name Az.App
```

---

Now that the current extension or module is installed, register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces.

> [!NOTE]
> Azure Container Apps resources have migrated from the `Microsoft.Web` namespace to the `Microsoft.App` namespace. Refer to [Namespace migration from Microsoft.Web to Microsoft.App in March 2022](https://github.com/microsoft/azure-container-apps/issues/109) for more details.

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
