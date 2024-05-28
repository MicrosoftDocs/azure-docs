---
title: "Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps"
description: Learn to use a managed Eureka Server for Spring in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 03/15/2024
ms.author: cshoe
---

# Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps (preview)

Eureka Server for Spring is a service registry that allows microservices to register themselves and discover other services. Available as an Azure Container Apps component, you can bind your container app to a Eureka Server for Spring for automatic registration with the Eureka server.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a Eureka Server for Spring Java component
> * Bind your container app to Eureka Server for Spring Java component

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along step-by-step, make sure you delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When running in Eureka Server for Spring in Azure Container Apps, be aware of the following details:

| Item | Explanation |
|---|---|
| **Scope** | The Eureka Server for Spring component runs in the same environment as the connected container app. |
| **Scaling** | The Eureka Server for Spring can’t scale. The scaling properties `minReplicas` and `maxReplicas` are both set to `1`. |
| **Resources** | The container resource allocation for Eureka Server for Spring is fixed. The number of the CPU cores is 0.5, and the memory size is 1Gi. |
| **Pricing** | The Eureka Server for Spring billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at the active/idle rates. You can delete components that are no longer in use to stop billing. |
| **Binding** | Container apps connect to a Eureka Server for Spring component via a binding. The bindings inject configurations into container app environment variables. Once a binding is established, the container app can read the configuration values from environment variables and connect to the Eureka Server for Spring. |

## Setup

Before you begin to work with the Eureka Server for Spring, you first need to create the required resources.

Execute the following commands to create your resource group, container apps environment.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-services-resource-group
    export ENVIRONMENT=my-environment
    export JAVA_COMPONENT_NAME=eureka
    export APP_NAME=sample-service-eureka-client
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-service-eureka-client:latest"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java component. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `JAVA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create a Eureka Server for Spring Java component.  |
    | `IMAGE` | The container image used in your container app. |

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

## Use the Eureka Server for Spring Java component

Now that you have an existing environment, you can create your container app and bind it to a Java component instance of Eureka Server for Spring.

1. Create the Eureka Server for Spring Java component.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME
    ```

1. Update the Eureka Server for Spring Java component configuration.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring update \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME 
      --configuration eureka.server.renewal-percent-threshold=0.85 eureka.server.eviction-interval-timer-in-ms=10000
    ```

1. Create the container app and bind to the Eureka Server for Spring.

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
      --bind $JAVA_COMPONENT_NAME \
      --query properties.configuration.ingress.fqdn
    ```

    This command returns the URL of your container app that consumes registers with the Eureka server component. Copy the URL to a text editor so you can use it in a coming step.

    Navigate top the `/allRegistrationStatus` route view all applications registered with the Eureka Server for Spring.

    The binding injects several configurations into the application as environment variables, primarily the `eureka.client.service-url.defaultZone` property. This property indicates the internal endpoint of the Eureka Server Java component.

    The binding also injects the following properties:

    ```bash
    "eureka.client.register-with-eureka":    "true"
    "eureka.instance.prefer-ip-address":     "true"
    ```

    The `eureka.client.register-with-eureka` property is set to `true` to enforce registration with the Eureka server. This registration overwrites the local setting in `application.properties`, from the config server and so on. If you want to set it to `false`, you can overwrite it by setting an environment variable in your container app.

    The `eureka.instance.prefer-ip-address` is set to `true` due to the specific DNS resolution rule in the container app environment. Don't modify this value so you don't break the binding.

    You can also [remove a binding](java-eureka-server-usage.md#unbind) from your application.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Configure Eureka Server for Spring settings](java-eureka-server-usage.md)
