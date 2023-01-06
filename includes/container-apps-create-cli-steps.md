---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 01/26/2022
ms.author: cshoe
---

## Setup

To begin, sign in to Azure. Run the following command, and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

---

# [Bash](#tab/bash)

Next, install the Azure Container Apps extension for the CLI.

```azurecli
az extension add --name containerapp --upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

You must have the latest Az module installed.  Ignore any warnings about modules currently in use.

```azurepowershell
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
```

Now install the Az.App module.

```azurepowershell
Install-Module -Name Az.App
```

---

Now that the current extension or module is installed, register the `Microsoft.App` namespace.

> [!NOTE]
> Azure Container Apps resources have migrated from the `Microsoft.Web` namespace to the `Microsoft.App` namespace. Refer to [Namespace migration from Microsoft.Web to Microsoft.App in March 2022](https://github.com/microsoft/azure-container-apps/issues/109) for more details.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.App
```

---

Register the `Microsoft.OperationalInsights` provider for the Azure Monitor Log Analytics workspace if you have not used it before.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.OperationalInsights
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.OperationalInsights
```

---

Next, set the following environment variables:

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="canadacentral"
CONTAINERAPPS_ENVIRONMENT="my-environment"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$ResourceGroupName = 'my-container-apps'
$Location = 'canadacentral'
$ContainerAppsEnvironment = 'my-environment'
```

---

With these variables defined, you can create a resource group to organize the services related to your new container app.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Location $Location -Name $ResourceGroupName
```

---

With the CLI upgraded and a new resource group available, you can create a Container Apps environment and deploy your container app.

## Create an environment

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.
