---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 01/26/2022
ms.author: cshoe
---

## Setup

First, sign in to Azure from the CLI. Run the following command, and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [PowerShell](#tab/powershell)

```azurecli
az login
```

---

Next, install the Azure Container Apps extension for the CLI.

# [Bash](#tab/bash)

```azurecli
az extension add --name containerapp --upgrade
```

# [PowerShell](#tab/powershell)

```azurecli
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

```azurecli
az provider register --namespace Microsoft.App
```

---

Register the `Microsoft.OperationalInsights` provider for the [Azure Monitor Log Analytics Workspace](../articles/container-apps/log-monitoring.md) if you haven't used it before.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.OperationalInsights
```

# [PowerShell](#tab/powershell)

```azurecli
az provider register --namespace Microsoft.OperationalInsights
```

---

Next, set the following environment variables:

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="canadacentral"
CONTAINERAPPS_ENVIRONMENT="my-environment"
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP="my-container-apps"
$LOCATION="canadacentral"
$CONTAINERAPPS_ENVIRONMENT="my-environment"
```

---

With these variables defined, you can create a resource group to organize the services related to your new container app.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

# [PowerShell](#tab/powershell)

```azurecli
az group create `
  --name $RESOURCE_GROUP `
  --location $LOCATION
```

---

With the CLI upgraded and a new resource group available, you can create a Container Apps environment and deploy your container app.

## Create an environment

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.
