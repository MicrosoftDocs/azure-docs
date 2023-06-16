---
title: 'Tutorial: Create a container app on Azure Arc'
description: Get started with Azure Container Apps on Azure Arc-enabled Kubernetes deploying your first app.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 3/20/2023
ms.author: cshoe
---

# Tutorial: Create an Azure Container App on Azure Arc-enabled Kubernetes (Preview)

In this tutorial, you create a [Container app to an Azure Arc-enabled Kubernetes cluster](azure-arc-enable-cluster.md) (Preview) and learn to:

> [!div class="checklist"]
> * Create a container app on Azure Arc
> * View your application's diagnostics

## Prerequisites

Before you proceed to create a container app, you first need to set up an [Azure Arc-enabled Kubernetes cluster to run Azure Container Apps](azure-arc-enable-cluster.md).

## Add Azure CLI extensions

Launch the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

[![Launch Cloud Shell in a new window.](media/azure-cloud-shell-button.png)](https://shell.azure.com)

Next, add the required Azure CLI extensions.

> [!WARNING]
> The following command installs a custom Container Apps extension that can't be used with the public cloud service. You need to uninstall the extension if you switch back to the Azure public cloud.

```azurecli-interactive
az extension add --upgrade --yes --name customlocation
az extension remove --name containerapp
az extension add -s https://aka.ms/acaarccli/containerapp-latest-py2.py3-none-any.whl --yes
```

## Create a resource group

Create a resource group for the services created in this tutorial.

```azurecli-interactive
myResourceGroup="my-container-apps-resource-group"
az group create --name $myResourceGroup --location eastus 
```

## Get custom location information

Get the following location group, name, and ID from your cluster administrator. See [Create a custom location](azure-arc-enable-cluster.md) for details.

```azurecli-interactive
customLocationGroup="<RESOURCE_GROUP_CONTAINING_CUSTOM_LOCATION>"
```

```azurecli-interactive
customLocationName="<NAME_OF_CUSTOM_LOCATION>"
```

Get the custom location ID.

```azurecli-interactive
customLocationId=$(az customlocation show \
    --resource-group $customLocationGroup \
    --name $customLocationName \
    --query id \
    --output tsv)
```

## Retrieve connected environment ID

Now that you have the custom location ID, you can query for the connected environment.

A connected environment is largely the same as a standard Container Apps environment, but network restrictions are controlled by the underlying Arc-enabled Kubernetes cluster.

```azure-interactive
myContainerApp="my-container-app"
myConnectedEnvironment=$(az containerapp connected-env list --custom-location $customLocationId -o tsv --query '[].id')
```

## Create an app

The following example creates a Node.js app.

```azurecli-interactive
 az containerapp create \
    --resource-group $myResourceGroup \
    --name $myContainerApp \
    --environment $myConnectedEnvironment \
    --environment-type connected \
    --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
    --target-port 80 \
    --ingress 'external'

az containerapp browse --resource-group $myResourceGroup --name $myContainerApp
```

## Get diagnostic logs using Log Analytics

> [!NOTE]
> A Log Analytics configuration is required as you [install the Container Apps extension](azure-arc-enable-cluster.md) to view diagnostic information. If you installed the extension without Log Analytics, skip this step.

Navigate to the [Log Analytics workspace that's configured with your Container Apps extension](azure-arc-enable-cluster.md), then select **Logs** in the left navigation.

Run the following sample query to show logs over the past 72 hours.

If there's an error when running a query, try again in 10-15 minutes. There may be a delay for Log Analytics to start receiving logs from your application.

```kusto
let StartTime = ago(72h);
let EndTime = now();
ContainerAppConsoleLogs_CL
| where TimeGenerated between (StartTime .. EndTime)
| where ContainerAppName_s =~ "my-container-app"
```

The application logs for all the apps hosted in your Kubernetes cluster are logged to the Log Analytics workspace in the custom log table named `ContainerAppConsoleLogs_CL`.

* **Log_s** contains application logs for a given Container Apps extension
* **AppName_s** contains the Container App app name. In addition to logs you write via your application code, the *Log_s* column also contains logs on container startup and shutdown.

You can learn more about log queries in [getting started with Kusto](../azure-monitor/logs/get-started-queries.md).

## Next steps

- [Communication between microservices](communicate-between-microservices.md)
