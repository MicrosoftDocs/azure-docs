---
title: Use rule-based routing in Azure Container Apps (preview)
description: Learn how to use rule-based routing in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-bicep
ms.topic: tutorial
ms.date: 04/16/2025
ms.author: cshoe
zone_pivot_groups: azure-cli-bicep
---

# Use rule-based routing with Azure Container Apps (preview)

In this article, you learn how to use rule-based routing with Azure Container Apps. With rule-based routing, you create a fully qualified domain name (FQDN) on your container apps environment. You then use rules to route requests for this FQDN to different container apps, depending on the path of each request.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).

- Install the [Azure CLI](/cli/azure/install-azure-cli).

::: zone pivot="bicep"

- [Bicep](/azure/azure-resource-manager/bicep/install)

::: zone-end

## Setup

::: zone pivot="azure-cli"

1. Run the following command so sign in to Azure from the CLI.

    ```azurecli
    az login
    ```

1. To ensure you're running the latest version of the CLI, run the upgrade command.

    ```azurecli
    az upgrade
    ```

    Ignore any warnings about modules currently in use.

    Install or update the Azure Container Apps extension for the CLI.

    If you receive errors about missing parameters when you run `az containerapp` commands in Azure CLI or cmdlets from the `Az.App` module in PowerShell, be sure you have the latest version of the Azure Container Apps extension installed.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

    > [!NOTE]
    > Starting in May 2024, Azure CLI extensions no longer enable preview features by default. To access Container Apps [preview features](whats-new.md), install the Container Apps extension with `--allow-preview true`.
    >
    > ```azurecli
    > az extension add --name containerapp --upgrade --allow-preview true
    > ```

1. Now that the current extension or module is installed, register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces.

    ```azurecli
    az provider register --namespace Microsoft.App
    ```

    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

## Create environment variables

Create the following environment variables.

```bash
CONTAINER_APP_1_NAME="my-container-app-1"
CONTAINER_APP_1_IMAGE="mcr.microsoft.com/k8se/quickstart:latest"
CONTAINER_APP_1_TARGET_PORT="80"
CONTAINER_APP_2_NAME="my-container-app-2"
CONTAINER_APP_2_IMAGE="mcr.microsoft.com/dotnet/samples:aspnetapp"
CONTAINER_APP_2_TARGET_PORT="8080"
LOCATION="eastus"
RESOURCE_GROUP="my-container-apps"
ENVIRONMENT_NAME="my-container-apps-env"
ROUTE_CONFIG_NAME="my-route-config"
```

## Create container apps

1. Run the following command to create your first container app. This container app uses the Container Apps quickstart image.

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

1. Run the following command to create your second container app. This container app uses the ASP.NET quickstart image.

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

1. Create HTTP route configuration.

    Create the following file and save it as `routing.yml`.

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
          - match:
              path: /
        targets:
          - containerApp: my-container-app-2
    ```

    This configuration defines two routing rules for HTTP traffic.

    | Property | Description |
    |---|---|
    | `description` | Human-readable label for the rule |
    | `routes.match.prefix` | URL path prefix to match. For example, `/api`. |
    | `routes.action.prefixRewrite` | What to replace the matched prefix with before forwarding. |
    | `targets.containerApp` | The name of the container app where matching route request are sent. |

    These rules allow different paths on your domain to route to different container apps while also modifying the request path before it reaches the destination app.

    Other properties not listed that may affect your routes include the following.

    | Property | Description |
    |---|---|
    | `route.match.path` | Exact match path definition. |
    | `route.match.pathSeparatedPrefix` | Matches routes on '/' boundaries rather than any text. For example, if you set the value to `/product`, then it will match on `/product/1`, but not `/product1`. |
    | `route.match.caseSensitive` | Controls whether or not route patterns match with case sensitivity. |
    | `target.label` | Route to a specific labeled revision within a container app. |
    | `target.revision` | Route to a specific revision within a container app. |

1. Run the following command to create the HTTP route configuration.

    ```azurecli
    az containerapp env http-route-config create \
      --http-route-config-name $ROUTE_CONFIG_NAME \
      --resource-group $RESOURCE_GROUP \
      --name $ENVIRONMENT_NAME \
      --yaml routing.yml \
      --query properties.fqdn
    ```

    Your HTTP route configuration's fully qualified domain name (FQDN) looks like this example: `my-route-config.ambitiouspebble-11ba6155.eastus.azurecontainerapps.io`

::: zone-end

::: zone pivot="bicep"

1. Ensure both container apps already exist.

1. Create the following Bicep file and save it as `routing.bicep`.

    ```bicep
    resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2024-10-02-preview' = {
      name: 'my-container-apps-env'
      location: 'eastus'
      tags: {}
      properties: {
        workloadProfiles: [
            {
                workloadProfileType: 'Consumption'
                name: 'Consumption'
            }
        ]
      }
    }

    resource httpRouteConfig 'Microsoft.App/managedEnvironments/httpRouteConfigs@2024-10-02-preview' = {
      parent: containerAppsEnvironment
      name: 'my-route-config'
      location: 'eastus'
      properties: {
        rules: [
            {
                description: 'App 1 rule'
                routes: [
                    {
                        match: {
                            prefix: '/app1'
                        }
                        action: {
                            prefixRewrite: '/'
                        }
                    }
                ]
                targets: [
                    {
                        containerApp: 'my-container-app-1'
                    }
                ]
            }
            {
                description: 'App 2 rule'
                routes: [
                    {
                        match: {
                            path: '/app2'
                        }
                        action: {
                            prefixRewrite: '/'
                        }
                    }
                    {
                        match: {
                            path: '/'
                        }
                    }
                ]
                targets: [
                    {
                        containerApp: 'my-container-app-2'
                    }
                ]
            }
        ]
      }
    }

    output fqdn string = httpRouteConfig.properties.fqdn
    ```

1. Deploy the Bicep file with the following command:

    ```azurecli
    az deployment group create `
      --name $ROUTE_CONFIG_NAME `
      --resource-group $RESOURCE_GROUP `
      --template-file routing.bicep
    ```

1. In the output, find `outputs`, which contains your HTTP route configuration's fully qualified domain name (FQDN). For example:

    ```json
        "outputs": {
          "fqdn": {
            "type": "String",
            "value": "my-route-config.ambitiouspebble-11ba6155.eastus.azurecontainerapps.io"
          }
        },
    ```

::: zone-end

## Verify HTTP route configuration

1. Browse to your HTTP route configuration FQDN with the path `/app1`.

    For example: `my-route-config.ambitiouspebble-11ba6155.eastus.azurecontainerapps.io/app1`.

    You see the Container Apps quickstart image.

1. Browse to your HTTP route configuration FQDN with the path `/app2`. 

    For example: `my-route-config.ambitiouspebble-11ba6155.eastus.azurecontainerapps.io/app2`.

    You see the ASP.NET quickstart image.

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this quickstart.

> [!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they'll also be deleted.

```azurecli
az group delete --name my-container-apps
```

## Related content

- [Azure CLI reference](/cli/azure/containerapp/env/http-route-config)
- [Bicep reference](/azure/templates/microsoft.app/2024-10-02-preview/managedenvironments/httprouteconfigs?pivots=deployment-language-bicep)
- [ARM template reference](/azure/templates/microsoft.app/2024-10-02-preview/managedenvironments/httprouteconfigs?pivots=deployment-language-arm-template)
