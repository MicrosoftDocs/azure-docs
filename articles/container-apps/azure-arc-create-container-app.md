---
title: 'Tutorial: Create a container app on Azure Arc'
description: Get started with Azure Container Apps on Azure Arc-enabled Kubernetes by deploying your first app.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - devx-track-azurecli
  - build-2025
ms.topic: tutorial
ms.date: 09/15/2026
ms.author: cshoe
---

# Tutorial: Create a container app on Azure Arc-enabled Kubernetes

In this tutorial, you deploy a container app to an existing Container Apps connected environment on an Azure Arc-enabled Kubernetes cluster. You then verify provisioning, DNS, ingress, application response, and logs.

> [!div class="checklist"]
>
> * Retrieve a specific connected environment by name.
> * Create a container app with external ingress.
> * Verify the application revision and fully qualified domain name.
> * Send a request to the application.
> * View application logs in Log Analytics, if configured.
> * Delete the tutorial application.

## Prerequisites

Before you begin, verify the following requirements:

* A connected environment created by completing [Enable Azure Container Apps on Azure Arc-enabled Kubernetes](azure-arc-enable-cluster.md).
* Azure CLI access to the subscription that contains the connected environment.
* Azure permission to create container apps in the target resource group and connected environment.
* The connected environment's resource group and name.
* Network and DNS access from your workstation to the connected environment's ingress address.
* Optional permission to query the Log Analytics workspace configured during extension installation.

Before deploying a production application, review [Azure Container Apps on Azure Arc](azure-arc-overview.md). If the application doesn't provision or become reachable, see [Troubleshoot Azure Container Apps on Azure Arc-enabled Kubernetes](azure-arc-troubleshoot.md).

## Add the Azure CLI extension

Launch the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

[![Launch Cloud Shell in a new window.](media/azure-cloud-shell-button.png)](https://shell.azure.com)

Next, add the required Azure CLI extension.

```azurecli
az extension add --name containerapp --upgrade --yes
```

## Create a resource group for the application

The container app can use a different resource group from the connected environment. Set the application resource group and the Azure region used to store its resource metadata. The application container runs in the Kubernetes cluster associated with the connected environment.

```azurecli
APP_RESOURCE_GROUP="my-container-apps-resource-group"
AZURE_LOCATION="eastus"
az group create --name $APP_RESOURCE_GROUP --location $AZURE_LOCATION
```

## Get the connected environment

Set the resource group and name of the connected environment:

```azurecli
CONNECTED_ENVIRONMENT_RESOURCE_GROUP="<CONNECTED_ENVIRONMENT_RESOURCE_GROUP>"
CONNECTED_ENVIRONMENT_NAME="<CONNECTED_ENVIRONMENT_NAME>"
```

Retrieve that specific connected environment and verify that it's ready:

```azurecli
CONNECTED_ENVIRONMENT_ID=$(az containerapp connected-env show \
  --resource-group $CONNECTED_ENVIRONMENT_RESOURCE_GROUP \
  --name $CONNECTED_ENVIRONMENT_NAME \
  --query id \
  --output tsv)

az containerapp connected-env show \
  --resource-group $CONNECTED_ENVIRONMENT_RESOURCE_GROUP \
  --name $CONNECTED_ENVIRONMENT_NAME \
  --query "{Id:id,State:properties.provisioningState,Domain:properties.defaultDomain}" \
  --output yaml
```

Continue only when `State` is `Succeeded`.

## Create and verify the app

Create the sample application:

```azurecli
CONTAINER_APP_NAME="my-container-app"

az containerapp create \
  --resource-group $APP_RESOURCE_GROUP \
  --name $CONTAINER_APP_NAME \
  --environment $CONNECTED_ENVIRONMENT_ID \
  --environment-type connected \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 80 \
  --ingress external
```

Wait for provisioning to succeed:

```azurecli
CONTAINER_APP_ID=$(az containerapp show \
  --resource-group $APP_RESOURCE_GROUP \
  --name $CONTAINER_APP_NAME \
  --query id \
  --output tsv)

az resource wait --ids $CONTAINER_APP_ID --created --timeout 600

az containerapp show \
  --resource-group $APP_RESOURCE_GROUP \
  --name $CONTAINER_APP_NAME \
  --query "{State:properties.provisioningState,Revision:properties.latestReadyRevisionName,FQDN:properties.configuration.ingress.fqdn}" \
  --output yaml

APP_FQDN=$(az containerapp show \
  --resource-group $APP_RESOURCE_GROUP \
  --name $CONTAINER_APP_NAME \
  --query properties.configuration.ingress.fqdn \
  --output tsv)
```

Continue only when `State` is `Succeeded`, `Revision` isn't empty, and `FQDN` contains the connected-environment domain. Test DNS and the application response from a network that can reach the connected environment's ingress address:

```bash
nslookup $APP_FQDN
curl --fail --show-error "https://$APP_FQDN"
```

You can also open the application in a browser:

```azurecli
az containerapp browse \
  --resource-group $APP_RESOURCE_GROUP \
  --name $CONTAINER_APP_NAME
```

If DNS doesn't resolve, the request times out, or the response isn't successful, see [Application ingress isn't reachable](azure-arc-troubleshoot.md#application-ingress-isnt-reachable).

## Get diagnostic logs using Log Analytics

> [!NOTE]
> This section applies only when you configure Log Analytics during [Container Apps extension installation](azure-arc-enable-cluster.md#install-the-container-apps-extension). If you didn't configure Log Analytics, skip this section.

Open the Log Analytics workspace configured for the Container Apps extension and select **Logs**. Run the following query to show logs from the past 72 hours. Initial ingestion can take 10–15 minutes.

```kusto
let StartTime = ago(72h);
let EndTime = now();
ContainerAppConsoleLogs_CL
| where TimeGenerated between (StartTime .. EndTime)
| where ContainerAppName_s =~ "my-container-app"
```

The application logs for all the apps hosted in your Kubernetes cluster are logged to the Log Analytics workspace in the custom log table named `ContainerAppConsoleLogs_CL`.

* `Log_s` contains application log messages and container lifecycle messages.
* `ContainerAppName_s` identifies the container app. This field is used by the preceding query.

You can learn more about log queries in [getting started with Kusto](/azure/azure-monitor/logs/get-started-queries).

## Clean up the tutorial application

Delete the sample container app:

```azurecli
az containerapp delete \
  --resource-group $APP_RESOURCE_GROUP \
  --name $CONTAINER_APP_NAME \
  --yes
```

If you created the application resource group only for this tutorial and it doesn't contain any other resources, delete it.

```azurecli
az group delete --name $APP_RESOURCE_GROUP --yes --no-wait
```

Don't delete the connected environment, custom location, extension, or connected cluster because other applications can share these resources.

## Next steps

* [Communication between microservices](communicate-between-microservices.md)
