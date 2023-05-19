---
title: 'Tutorial: Connect services in Azure Container Apps'
description: Connect a service in development and then promote to production in Azure Container Apps.
services: container-apps
author: dougdavis
ms.service: container-apps
ms.topic: tutorial
ms.date: 05/19/2023
ms.author: dougdavis
---

# Tutorial: Connect services in Azure Container Apps

Azure Container Apps allows you to connect to services that support your app that run in the same environment as your container app.

When in development, your application can quickly create and connect to [dev mode services](services.md). These services easy to create and are development-grade services designed for nonproduction environments.

As you move to production, your application can connect production-grade managed services.

This tutorial shows you how to connect both dev mode and production grade services to your container app.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a new Redis development service
> * Connect a container app to the Redis dev mode service
> * Disconnect the service from the application
> * Inspect the service running an in-memory cache

## Prerequisites

| Resource | Description |
|---|---|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli) if you don't have it on your machine. |

## Set up

1. Set up resource group and location variables.

    ```azurecli
    RESOURCE_GROUP="my-container-apps"
    LOCATION="eastus"
    ```

1. Create a variable to hold your environment name.

    Replace `<MY_ENVIRONMENT_NAME>` with the name of your container apps environment.

    ```azurecli
    ENVIRONMENT=<MY_ENVIRONMENT_NAME>
    ```

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

1. Set the location.
  
    ```azurecli
    az config set defaults.location=$LOCATION
    ```

1. Set the resource group.
  
    ```azurecli
    az config set defaults.group=$RESOURCE_GROUP
    ```

1. Create a new environment.
  
    ```azurecli
    az containerapp env create --name $ENVIRONMENT
    ```

With the CLI configured and an environment created, you can now create an application and dev mode service.

## Create a dev mode service

The sample application manages a set of strings, either in-memory, or in Redis cache.

Create the Redis dev mode service and name it `myredis`.

``` azurecli
az containerapp service redis create \
  --name myredis \
  --environment $ENVIRONMENT
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
      --bind myredis
      --query properties.configuration.ingress.fqdn
    ```

    This command returns the fully qualified domain name (FQDN). Paste this value into a web browser so you can inspect the application'e behavior throughout this tutorial.

    The `containerapp create` command uses the `--bind` option to create a link between the container app and the Redis dev mode service.

    The bind request gathers connection information, including credentials and  connection strings, and injects it into the application as environment variables. These values are now available to the application code via environment variables.

    In this case, the following environment variables are available to the application:

    ```bash
    REDIS_ENDPOINT=myredis:6379
    REDIS_HOST=myredis
    REDIS_PASSWORD=...
    REDIS_PORT=6379
    ```

    If you access the application via a browser, you can add and remove strings from the Redis database. The Redis cache is responsible for storing application data, so data is available even after the application is restarted after scaling in to zero.

    The application is written such that if these environment variables aren't
    defined then the text strings are stored in memory. Meaning, if the
    application scales in to zero then the data is lost. So, let's
    unbind the application from Redis.

1. Unbind the Redis dev mode service.

    ``` azurecli
    az containerapp update --name myapp --unbind myredis
    ```

    Now that the service is disconnected, data is now stored in an in-memory cache instead. You can verify location of the data by returning to your web browser and refreshing the web application.

    If you then rebind the application back to the Redis service, you should see
    that all of the previously stored text strings are still there.

1. Rebind the Redis dev mode service.

    ``` azurecli
    az containerapp update --name myapp --bind myredis
    ```

    Now that the service is reconnected, the web application displays the data stored in Redis.

## Connecting to a managed service

When your application is ready to move to production, you can bind your application to a managed service instead of a dev mode service.

The following steps bind your application to Azure Cache for Redis.

1. Bind to Azure Cache for Redis.

    ``` azurecli
    az containerapp update --name myapp --unbind myredis --bind azureRedis
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

    Now when you add new strings, the values are stored in an instance Azure Cache for Redis instead of the dev mode service.

## Clean up resources

If you don't plan to continue to use the resources created in this tutorial, you can delete the application and the Redis service.

The application and the service are independent. This independence means the service can be connected to any number of applications in the environment and exists until explicitly deleted, even if all applications are disconnect from it.

Run the following commands to delete your container app and the dev mode service.

``` azurecli
az containerapp delete --name myapp
az containerapp service redis delete --name myredis
```

## Next steps

> [!div class="nextstepaction"]
> [Application lifecycle management](application-lifecycle-management.md)
