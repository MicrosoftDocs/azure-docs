---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 04/08/2022
ms.author: cshoe
---

## Setup

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [PowerShell](#tab/powershell)

```powershell
Connect-AzAccount
```

---

Ensure you're running the latest version of the CLI via the upgrade command.

# [Bash](#tab/bash)

```azurecli
az upgrade
```

# [PowerShell](#tab/powershell)

```azurecli
az upgrade
```

---

Next, install or update the Azure Container Apps extension for the CLI.

# [Bash](#tab/bash)

```azurecli
az extension add --name containerapp --upgrade
```

# [PowerShell](#tab/powershell)

```powershell
az extension add --name containerapp --upgrade
```

---

Now that the extension is installed, register the `Microsoft.App` namespace.

> [!NOTE]
> Azure Container Apps resources have migrated from the `Microsoft.Web` namespace to the `Microsoft.App` namespace. Refer to [Namespace migration from Microsoft.Web to Microsoft.App in March 2022](https://github.com/microsoft/azure-container-apps/issues/109) for more details.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
```

# [PowerShell](#tab/powershell)

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.App
```

---
