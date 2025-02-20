---
title: Use path-based routing in Azure Container Apps (preview)
description: Learn how to use path-based routing Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-bicep
ms.topic: how-to
ms.date: 02/20/2025
ms.author: cshoe
zone_pivot_groups: azure-cli-bicep
---

# Use path-based routing with Azure Container Apps (preview)

In this article, you learn how to use path-based routing with Azure Container Apps.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).

- Install the [Azure CLI](/cli/azure/install-azure-cli).

::: zone pivot="bicep"

- [Bicep](/azure/azure-resource-manager/bicep/install)

::: zone-end

## Setup

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

```azurecli
az login
```

To ensure you're running the latest version of the CLI, run the upgrade command.

```azurecli
az upgrade
```

Ignore any warnings about modules currently in use.

Next, install or update the Azure Container Apps extension for the CLI.

If you receive errors about missing parameters when you run `az containerapp` commands in Azure CLI or cmdlets from the `Az.App` module in PowerShell, be sure you have the latest version of the Azure Container Apps extension installed.

```azurecli
az extension add --name containerapp --upgrade
```

> [!NOTE]
> Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](../articles/container-apps/whats-new.md), install the Container Apps extension with `--allow-preview true`.
> ```azurecli
> az extension add --name containerapp --upgrade --allow-preview true
> ```

Now that the current extension or module is installed, register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces.

```azurecli
az provider register --namespace Microsoft.App
```

```azurecli
az provider register --namespace Microsoft.OperationalInsights
```

::: zone pivot="azure-cli"

## Create environment variables

Create the following environment variables.

```bash
$CONTAINER_APP_1_NAME="my-container-app-1"
$CONTAINER_APP_1_IMAGE="mcr.microsoft.com/k8se/quickstart:latest"
$CONTAINER_APP_1_TARGET_PORT="80"
$CONTAINER_APP_2_NAME="my-container-app-2"
$CONTAINER_APP_2_IMAGE="mcr.microsoft.com/dotnet/samples:aspnetapp"
$CONTAINER_APP_2_TARGET_PORT="8080"
$LOCATION="eastus"
$RESOURCE_GROUP="my-container-apps"
$ENVIRONMENT_NAME="my-container-apps-env"
$ROUTE_CONFIG_NAME="my-route-config"
```

## Create container apps

Run the following command to create your first container app. This container app uses the Container Apps quickstart image.

```azurecli
az containerapp up \
  --name $CONTAINER_APP_1_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT_NAME \
  --image $CONTAINER_APP_1_IMAGE \
  --target-port $CONTAINER_APP_1_TARGET_PORT \
  --ingress external \
  --query properties.configuration.ingress.fqdn
```

Run the following command to create your second container app. This container app uses the ASP.NET quickstart image.

```azurecli
az containerapp up \
  --name $CONTAINER_APP_2_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT_NAME \
  --image $CONTAINER_APP_2_IMAGE \
  --target-port $CONTAINER_APP_2_TARGET_PORT \
  --ingress external \
  --query properties.configuration.ingress.fqdn
```

## Create HTTP route configuration

1. Create the following YAML file and save it as `routing.yml`.

```yaml
rules:
  - description: App 1 rule
    routes:
      - match:
          prefix: /app1
        action:
          prefixRewrite: /
    targets:
      - containerApp: my-container-app-1
  - description: App 2 rule
    routes:
      - match:
          path: /app2
        action:
          prefixRewrite: /
    targets:
      - containerApp: my-container-app-2
```

1. Run the following command to create the HTTP route configuration.

```azurecli
az containerapp env http-route-config create \
  --http-route-config-name $ROUTE_CONFIG_NAME \
  --resource-group $RESOURCE_GROUP \
  --name $ENVIRONMENT_NAME \
  --yaml routing.yml \
  --query properties.fqdn
```

    Your HTTP route configuration fully qualified domain name (FQDN) looks like this example: `my-route-config.ambitiouspebble-11ba6155.eastus.azurecontainerapps.io`

::: zone-end

::: zone pivot="bicep"

::: zone-end

## Test HTTP route configuration

1. Browse to your HTTP route configuration FQDN with the path `/app1`. For example: `my-route-config.ambitiouspebble-11ba6155.eastus.azurecontainerapps.io/app1`. You see the Container Apps quickstart image.

1. Browse to your HTTP route configuration FQDN with the path `/app2`. For example: `my-route-config.ambitiouspebble-11ba6155.eastus.azurecontainerapps.io/app2`. You see the ASP.NET quickstart image.

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

```azurecli
az group delete --name my-container-apps
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Related content

- [Quickstart and samples](https://github.com/Tratcher/HttpRouteConfigBicep/tree/master)
- [Azure CLI reference](/cli/azure/containerapp/env/http-route-config?view=azure-cli-latest)
