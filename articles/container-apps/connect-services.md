---
title: 'Tutorial: Connect services in Azure Container Apps (preview)'
description: Connect a service in development and then promote to production in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 06/13/2023
ms.author: cshoe
---

# Tutorial: Connect services in Azure Container Apps (preview)

Azure Container Apps allows you to connect to services that support your app that run in the same environment as your container app.

When in development, your application can quickly create and connect to [dev services](services.md). These services are easy to create and are development-grade services designed for nonproduction environments.

As you move to production, your application can connect production-grade managed services.

This tutorial shows you how to connect both dev and production grade services to your container app.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a new Redis development service
> * Connect a container app to the Redis dev service
> * Disconnect the service from the application
> * Inspect the service running an in-memory cache

## Prerequisites

| Resource | Description |
|---|---|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli) if you don't have it on your machine. |
| Azure resource group | Create a resource group named **my-services-resource-group** in the **East US** region. |
| Azure Cache for Redis | Create an instance of [Azure Cache for Redis](/cli/azure/redis) in the **my-services-resource-group**.  |

## Set up

1. Sign in to the Azure CLI.

    ``` azurecli
    az login
    ```

1. Upgrade the Container Apps CLI extension.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

1. Register the `Microsoft.App` namespace.

    ```azurecli
    az provider register --namespace Microsoft.App
    ```

1. Register the `Microsoft.ServiceLinker` namespace.

    ```azurecli
    az provider register --namespace Microsoft.ServiceLinker
    ```

1. Set up the resource group variable.

    ```azurecli
    RESOURCE_GROUP="my-services-resource-group"
    ```

1. Create a variable for the Azure Cache for Redis DNS name.

    To display a list of the Azure Cache for Redis instances, run the following command.

    ```azurecli
    az redis list --resource-group "$RESOURCE_GROUP" --query "[].name" -o table
    ```

1. Create a variable to hold your environment name.

    Replace `<MY_ENVIRONMENT_NAME>` with the name of your container apps environment.

    ```azurecli
    ENVIRONMENT=<MY_ENVIRONMENT_NAME>
    ```

1. Set up the location variable.

    ```azurecli
    LOCATION="eastus"
    ```

1. Create a new environment.
  
    ```azurecli
    az containerapp env create \
      --location "$LOCATION" \
      --resource-group "$RESOURCE_GROUP" \
      --name "$ENVIRONMENT"
    ```

With the CLI configured and an environment created, you can now create an application and dev service.

## Create a dev service

The sample application manages a set of strings, either in-memory, or in Redis cache.

Create the Redis dev service and name it `myredis`.

``` azurecli
az containerapp service redis create \
  --name myredis \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENVIRONMENT"
```

## Create a container app

Next, create your internet-accessible container app.

1. Create a new container app and bind it to the Redis service.

    ``` azurecli
    az containerapp create \
      --name myapp \
      --image mcr.microsoft.com/k8se/samples/sample-service-redis:latest \
      --ingress external \
      --target-port 8080 \
      --bind myredis \
      --environment "$ENVIRONMENT" \
      --resource-group "$RESOURCE_GROUP" \
      --query properties.configuration.ingress.fqdn
    ```

    This command returns the fully qualified domain name (FQDN). Paste this location into a web browser so you can inspect the application'e behavior throughout this tutorial.

    :::image type="content" source="media/services/azure-container-apps-cache-service.png" alt-text="Screenshot of container app running a Redis cache service.":::

    The `containerapp create` command uses the `--bind` option to create a link between the container app and the Redis dev service.

    The bind request gathers connection information, including credentials and  connection strings, and injects it into the application as environment variables. These values are now available to the application code to use in order to create a connection to the service.

    In this case, the following environment variables are available to the application:

    ```bash
    REDIS_ENDPOINT=myredis:6379
    REDIS_HOST=myredis
    REDIS_PASSWORD=...
    REDIS_PORT=6379
    ```

    If you access the application via a browser, you can add and remove strings from the Redis database. The Redis cache is responsible for storing application data, so data is available even after the application is restarted after scaling to zero.

    You can also remove a binding from your application.

1. Unbind the Redis dev service.

    To remove a binding from a container app, use the `--unbind` option.

    ``` azurecli
    az containerapp update \
      --name myapp \
      --unbind myredis \
      --resource-group "$RESOURCE_GROUP"
    ```

    The application is written so that if the environment variables aren't defined, then the text strings are stored in memory.

    In this state, if the application scales to zero, then data is lost.

    You can verify this change by returning to your web browser and refreshing the web application. You can now see the configuration information displayed indicates data is stored in-memory.

    Now you can rebind the application to the Redis service, to see your previously stored data.

1. Rebind the Redis dev service.

    ``` azurecli
    az containerapp update \
      --name myapp \
      --bind myredis \
      --resource-group "$RESOURCE_GROUP"
    ```

    With the service reconnected, you can refresh the web application to see data stored in Redis.

## Connecting to a managed service

When your application is ready to move to production, you can bind your application to a managed service instead of a dev service.

The following steps bind your application to an existing instance of Azure Cache for Redis.

1. Create a variable for your DNS name.

    Make sure to replace `<YOUR_DNS_NAME>` with the DNS name of your instance of Azure Cache for Redis.

    ```azurecli
    AZURE_REDIS_DNS_NAME=<YOUR_DNS_NAME>
    ```

1. Bind to Azure Cache for Redis.

    ``` azurecli
    az containerapp update \
      --name myapp \
      --unbind myredis \
      --bind "$AZURE_REDIS_DNS_NAME" \
      --resource-group "$RESOURCE_GROUP"
    ```

    This command simultaneously removes the development binding and establishes the binding to the production-grade managed service.

1. Return to your browser and refresh the page.

    The console prints up values like the following example.

    ```bash
    AZURE_REDIS_DATABASE=0
    AZURE_REDIS_HOST=azureRedis.redis.cache.windows.net
    AZURE_REDIS_PASSWORD=il6HI...
    AZURE_REDIS_PORT=6380
    AZURE_REDIS_SSL=true
    ```

    > [!NOTE]
    > Environment variable names used for [add-ons](services.md) and managed services vary slightly.
    >
    > If you'd like to see the sample code used for this tutorial please see https://github.com/Azure-Samples/sample-service-redis.

    Now when you add new strings, the values are stored in an instance Azure Cache for Redis instead of the dev service.

## Clean up resources

If you don't plan to continue to use the resources created in this tutorial, you can delete the application and the Redis service.

The application and the service are independent. This independence means the service can be connected to any number of applications in the environment and exists until explicitly deleted, even if all applications are disconnect from it.

Run the following commands to delete your container app and the dev service.

``` azurecli
az containerapp delete --name myapp
az containerapp service redis delete --name myredis
```

Alternatively you can delete the resource group to remove the container app and all services.

```azurecli
az group delete \
  --resource-group "$RESOURCE_GROUP"
```

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
