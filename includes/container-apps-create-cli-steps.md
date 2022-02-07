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
az extension add \
  --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.2-py2.py3-none-any.whl 
```

# [PowerShell](#tab/powershell)

```azurecli
az extension add `
  --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.2-py2.py3-none-any.whl 
```

---

Now that the extension is installed, register the `Microsoft.Web` namespace.

# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.Web
```

# [PowerShell](#tab/powershell)

```azurecli
az provider register --namespace Microsoft.Web
```

---

Next, set the following environment variables:

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="my-container-apps"
LOCATION="canadacentral"
LOG_ANALYTICS_WORKSPACE="my-container-apps-logs"
CONTAINERAPPS_ENVIRONMENT="my-environment"
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP="my-container-apps"
$LOCATION="canadacentral"
$LOG_ANALYTICS_WORKSPACE="my-container-apps-logs"
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

Container apps are monitored with Azure Log Analytics, which is required when you create a Container Apps environment.

Create a Log Analytics workspace with the following command:

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics workspace create \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $LOG_ANALYTICS_WORKSPACE
```

# [PowerShell](#tab/powershell)

```azurecli
az monitor log-analytics workspace create `
  --resource-group $RESOURCE_GROUP `
  --workspace-name $LOG_ANALYTICS_WORKSPACE
```

---

Next, retrieve the Log Analytics Client ID and client secret.

# [Bash](#tab/bash)

```bash
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az monitor log-analytics workspace show --query customerId -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE -o tsv | tr -d '[:space:]'`
```

```bash
LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=`az monitor log-analytics workspace get-shared-keys --query primarySharedKey -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE -o tsv | tr -d '[:space:]'`
```

# [PowerShell](#tab/powershell)

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_ID=(az monitor log-analytics workspace show --query customerId -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE --out tsv)
```

```powershell
$LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=(az monitor log-analytics workspace get-shared-keys --query primarySharedKey -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE --out tsv)
```

---

The Log Analytics values are used as you create the Container Apps environment.
