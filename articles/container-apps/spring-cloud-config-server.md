---
title: "Tutorial: Connect to a managed Spring Cloud Config Server in Azure Container Apps (preview)"
description: Learn how to connect a Spring Cloud Config Server to your container app.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: tutorial
ms.date: 03/13/2024
ms.author: cshoe
---

# Tutorial: Connect to a managed Spring Cloud Config Server in Azure Container Apps (preview)

Spring Cloud Config Server provides a centralized location to make configuration data available to multiple applications. In this article, you learn to connect an app hosted in Azure Container Apps to a Java Spring Cloud Config Server instance.

The Spring Cloud Config Server component uses a GitHub repository as the source for configuration settings. Configuration values are made available to your container app via a binding between the component and your container app. As values change in the configuration server, they automatically flow to your application, all without requiring you to recompile or redeploy your application.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a Spring Cloud Config Server Java component
> * Bind the Spring Cloud Config Server to your container app
> * Observe configuration values before and after connecting the config server to your application
> * Encrypt and decrypt configuration values with a symmetric key

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along step-by-step, make sure you delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When running in Spring Cloud Config Server in Azure Container Apps, be aware of the following details:

| Item | Explanation |
|---|---|
| **Scope** | The Spring Cloud Config Server runs in the same environment as the connected container app. |
| **Scaling** | To maintain a single source of truth, the Spring Cloud Config Server doesn't scale. The scaling properties `minReplicas` and `maxReplicas` are both set to `1`. |
| **Resources** | The container resource allocation for Spring Cloud Config Server is fixed, the number of the CPU cores is 0.5, and the memory size is 1Gi. |
| **Pricing** | The Spring Cloud Config Server billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at the active/idle rates. You may delete components that are no longer in use to stop billing. |
| **Binding** | The container app connects to a Spring Cloud Config Server via a binding. The binding injects configurations into container app environment variables. Once a binding is established, the container app can read configuration values from environment variables. |

## Setup

Before you begin to work with the Spring Cloud Config Server, you first need to create the required resources.

Execute the following commands to create your resource group and Container Apps environment.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-spring-cloud-resource-group
    export ENVIRONMENT=my-spring-cloud-environment
    export JAVA_COMPONENT_NAME=myconfigserver
    export APP_NAME=my-config-client
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-service-config-client:latest"
    export URI="https://github.com/Azure-Samples/azure-spring-cloud-config-java-aca.git"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java component. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `JAVA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create a Spring Cloud Config Server Java component.  |
    | `IMAGE` | The container image used in your container app. |
    | `URI` | You can replace the URI with your git repo url, if it's private, add the related authentication configurations such as `spring.cloud.config.server.git.username` and `spring.cloud.config.server.git.password`. |

1. Log in to Azure with the Azure CLI.

    ```azurecli
    az login
    ```

1. Create a resource group.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create your container apps environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```

    This environment is used to host both the Spring Cloud Config Server component and your container app.

## Use the Spring Cloud Config Server Java component

Now that you have a Container Apps environment, you can create your container app and bind it to a Spring Cloud Config Server component. When you bind your container app, configuration values automatically synchronize from the Config Server component to your application.

1. Create the Spring Cloud Config Server Java component.

    ```azurecli
    az containerapp env java-component spring-cloud-config create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME \
      --configuration spring.cloud.config.server.git.uri=$URI
    ```

1. Update the Spring Cloud Config Server Java component.

    ```azurecli
    az containerapp env java-component spring-cloud-config update \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME \
      --configuration spring.cloud.config.server.git.uri=$URI spring.cloud.config.server.git.refresh-rate=60
    ```

    Here, you're telling the component where to find the repository that holds your configuration information via the `uri` property. The `refresh-rate` property tells Container Apps how often to check for changes in your git repository.

1. Create the container app that consumes configuration data.

    ```azurecli
    az containerapp create \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT \
      --image $IMAGE \
      --min-replicas 1 \
      --max-replicas 1 \
      --ingress external \
      --target-port 8080 \
      --query properties.configuration.ingress.fqdn
    ```

    This command returns the URL of your container app that consumes configuration data. Copy the URL to a text editor so you can use it in a coming step.

    If you visit your app in a browser, the `connectTimeout` value returned is the default value of `0`.

1. Bind to the Spring Cloud Config Server.

    Now that the container app and Config Server are created, you bind them together with the `update` command to your container app.

    ```azurecli
    az containerapp update \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --bind $JAVA_COMPONENT_NAME
    ```

    The `--bind $JAVA_COMPONENT_NAME` parameter creates the link between your container app and the configuration component.

    Once the container app and the Config Server component are bound together, configuration changes are automatically synchronized to the container app.

    When you visit the app's URL again, the value of `connectTimeout` is now `10000`. This value comes from the git repo set in the `$URI` variable originally set as the source of the configuration component. Specifically, this value is drawn from the `connectionTimeout` property in the repo's *application.yml* file.

    The bind request injects configuration setting into the application as environment variables. These values are now available to the application code to use when fetching configuration settings from the config server.

    In this case, the following environment variables are available to the application:

    ```bash
    SPRING_CLOUD_CONFIG_URI=http://$JAVA_COMPONENT_NAME:80
    SPRING_CLOUD_CONFIG_COMPONENT_URI=http://$JAVA_COMPONENT_NAME:80
    SPRING_CONFIG_IMPORT=optional:configserver:$SPRING_CLOUD_CONFIG_URI
    ```

    If you want to customize your own `SPRING_CONFIG_IMPORT`, you can refer to the environment variable `SPRING_CLOUD_CONFIG_COMPONENT_URI`, for example, you can override by command line arguments, like `Java -Dspring.config.import=optional:configserver:${SPRING_CLOUD_CONFIG_COMPONENT_URI}?fail-fast=true`.

    You can also remove a binding from your application.

1. Unbind the Spring Cloud Config Server Java component.

    To remove a binding from a container app, use the `--unbind` option.

    ``` azurecli
    az containerapp update \
      --name $APP_NAME \
      --unbind $JAVA_COMPONENT_NAME \
      --resource-group $RESOURCE_GROUP
    ```

    When you visit the app's URL again, the value of `connectTimeout` changes to back to `0`.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Customize Spring Cloud Config Server settings](spring-cloud-config-server-usage.md)
