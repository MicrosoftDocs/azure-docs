---
title: "Tutorial: Connect to a managed Gateway for Spring in Azure Container Apps (preview)"
description: Learn how to connect a Gateway for Spring to your container app.
services: container-apps
author: wenhaozhang
ms.service: azure-container-apps
ms.custom: devx-track-azurecli, devx-track-extended-java
ms.topic: tutorial
ms.date: 09/30/2024
ms.author: wenhaozhang
---

# Tutorial: Connect to a managed Gateway for Spring in Azure Container Apps (preview)

Gateway for Spring offers an efficient solution to route API requests and address cross-cutting concerns including security, monitoring/metrics, and resiliency. In this article, you will learn how to create a gateway that directs requests to your container apps.

In this tutorial, you will learn to:

> [!div class="checklist"]
> * Create a Gateway for Spring Java component
> * Update the gateway for spring with custom routes to redirect requests to container apps

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along step-by-step, make sure you delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When running in Gateway for Spring in Azure Container Apps, be aware of the following details:

| Item | Explanation |
|---|---|
| **Scope** | The Gateway for Spring runs in the same environment as the connected container app. |
| **Resources** | The container resource allocation for Gateway for Spring is fixed, the number of the CPU cores is 0.5, and the memory size is 1Gi. |
| **Pricing** | The Gateway for Spring billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at the active/idle rates. You may delete components that are no longer in use to stop billing. |

## Setup

Before you begin to work with the Gateway for Spring, you first need to create the required resources.

Execute the following commands to create your resource group and Container Apps environment.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-spring-cloud-resource-group
    export ENVIRONMENT=my-spring-cloud-environment
    export JAVA_COMPONENT_NAME=mygateway
    export APP_NAME=myapp
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-admin-for-spring-client:latest"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java component. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `JAVA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create a Gateway for Spring Java component.  |
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

    This environment is used to host both the Gateway for Spring component and your container app.

## Use the Gateway for Spring Java component

Now that you have a Container Apps environment, you can create your container app use a gateway for spring java compoments to route request to them.

1. Create the Gateway for Spring Java component.

    ```azurecli
    az containerapp env java-component gateway-for-spring create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME \
    ```

1. Create the container app that have fqdn

    ```azurecli
    az containerapp create \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT \
      --image $IMAGE \
      --ingress external \
      --target-port 8080 \
      --query properties.configuration.ingress.fqdn
    ```

    This command returns the URL of your container app that consumes configuration data. Copy the URL to a text editor so you can use it in next step.

## Update the Gateway Routes to route requests

1. Create a YAML file with the following content. Replace <MYAPP_URL> with the container app fqdn from the previous step.

    ```yaml
    springCloudGatewayRoutes:
    - id: "route1"
      uri: "<MYAPP_URL>"
      predicates:
        - "Path=/myapp/{path}"
      filters:
        - "SetPath=/actuator/{path}"
    ```

1. Run the following command to update the Gateway for Spring component with your route configuration.

    ```azurecli
    az containerapp env java-component gateway-for-spring update \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME \ 
      --route-yaml <PTAH_TO_ROUTE_YAML_FILE> \
      --query properties.ingress.fqdn
    ```
    This command will update the gateway route and returns the URL of your gateway that consumes configuration data. 

    The command returns the gateway's URL. Visiting this URL with the path `/myapp/health` should route the request to your app’s `actuator/health` endpoint, returning {"status":"UP","groups":["liveness","readiness"]}.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Configure the Gateway for Spring component in Azure Container Apps (preview)](java-gateway-for-spring-usage.md)