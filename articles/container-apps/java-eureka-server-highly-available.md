---
title: "Tutorial: Create a highly-available Eureka server component cluster in Azure Container Apps"
description: Learn to create a highly-available Eureka service in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: tutorial
ms.date: 08/16/2024
ms.author: cshoe
#customer intent: As a developer, I want to create an Eureka server cluster so that I can ensure there is no downtime of my service registries regardless of load and failures.
---

# Tutorial: Create a highly-available Eureka server component cluster in Azure Container Apps

In this tutorial, you learn to create a Eureka service designed to remain operational in the face of failures and high demand. Building a highly available Eureka service ensures the service registry is always available to clients regardless of demand.

Achieving high availability status for Eureka includes linking multiple Eureka server instances together forming a cluster. The cluster provides resources so that if one Eureka server fails, the other services remain available for requests.

In this tutorial, you:

> [!div class="checklist"]
> * Create a Eureka server for Spring components.
> * Bind two Eureka servers for Spring components together into a cluster.
> * Bind applications to both Eureka servers for highly available service discovery.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When running managed Java components in Azure Container Apps, be aware of the following details:

[!INCLUDE [container-apps/component-considerations.md](../../includes/container-apps/component-considerations.md)]

## Setup

Use the following steps to create your Eureka service cluster.

1. Create variables that hold application configuration values.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-services-resource-group
    export ENVIRONMENT=my-environment
    export EUREKA_COMPONENT_FIRST=eureka01
    export EUREKA_COMPONENT_SECOND=eureka02
    export APP_NAME=sample-service-eureka-client
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-service-eureka-client:latest"
    ```

1. Sign in to Azure with the Azure CLI.

    ```azurecli
    az login
    ```

1. Create a resource group.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create your Container Apps environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```

## Create a cluster

Next, create two Eureka server instances and link them together as a cluster.

1. Create two Eureka Server for Spring components.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring create \
        --environment $ENVIRONMENT \
        --resource-group $RESOURCE_GROUP \
        --name $EUREKA_COMPONENT_FIRST
    ```

    ```azurecli
    az containerapp env java-component eureka-server-for-spring create \
        --environment $ENVIRONMENT \
        --resource-group $RESOURCE_GROUP \
        --name $EUREKA_COMPONENT_SECOND
    ```

## Bind components together

For the Eureka servers to work in a high-availability configuration, they need to be linked together.

1. Bind the first Eureka server to the second.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring update \
        --environment $ENVIRONMENT \
        --resource-group $RESOURCE_GROUP \
        --name $EUREKA_COMPONENT_FIRST \
        --bind $EUREKA_COMPONENT_SECOND
    ```

1. Bind the second Eureka server to the first.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring update \
        --environment $ENVIRONMENT \
        --resource-group $RESOURCE_GROUP \
        --name $EUREKA_COMPONENT_SECOND \
        --bind $EUREKA_COMPONENT_FIRST
    ```

## Deploy and bind the application

With the server components linked together, you can create the container app and binding it to the two Eureka components.

1. Create the container app.

    ```azurecli
    az containerapp create \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --environment $ENVIRONMENT \
        --image $IMAGE \
        --min-replicas 1 \
        --max-replicas 1 \
        --ingress external \
        --target-port 8080
    ```

1. Bind the container app to the first Eureka server component.

    ```azurecli
    az containerapp update \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --bind $EUREKA_COMPONENT_FIRST 
    ```

1. Bind the container app to the second Eureka server component.

    ```azurecli
    az containerapp update \
        --name $APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --bind $EUREKA_COMPONENT_SECOND
    ```

## View the dashboards

> [!IMPORTANT]
> To view the dashboard, you need to have at least the `Microsoft.App/managedEnvironments/write` role assigned to your account on the managed environment resource. You can either explicitly assign `Owner` or `Contributor` role on the resource or follow the steps to create a custom role definition and assign it to your account.

1. Create the custom role definition.

    ```azurecli
    az role definition create --role-definition '{
        "Name": "Java Component Dashboard Access",
        "IsCustom": true,
        "Description": "Can access managed Java Component dashboards in managed environments",
        "Actions": [
            "Microsoft.App/managedEnvironments/write"
        ],
        "AssignableScopes": ["/subscriptions/<SUBSCRIPTION_ID>"]
    }'
    ```

    Make sure to replace placeholder in between the `<>` brackets in the `AssignableScopes` value with your subscription ID.

1. Assign the custom role to your account on managed environment resource.

    Get the resource ID of the managed environment.

    ```azurecli
    export ENVIRONMENT_ID=$(az containerapp env show \
      --name $ENVIRONMENT --resource-group $RESOURCE_GROUP \
      --query id -o tsv)
    ```

1. Assign the role to your account.

    Before running this command, replace the placeholder in between the `<>` brackets with your user or service principal ID.

    ```azurecli
    az role assignment create \
      --assignee <USER_OR_SERVICE_PRINCIPAL_ID> \
      --role "Java Component Dashboard Access" \
      --scope $ENVIRONMENT_ID
    ```

1. Get the URL of the Eureka Server for Spring dashboard.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring show \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_COMPONENT_FIRST \
      --query properties.ingress.fqdn -o tsv
    ```

    This command returns the URL you can use to access the Eureka Server for Spring dashboard. Through the dashboard, you can verify that the Eureka server setup consists of two replicas.

    :::image type="content" source="media/java-components/eureka-highly-available.png" alt-text="Screenshot of the High available Eureka Server for Spring dashboard."  lightbox="media/java-components/eureka-highly-available.png":::

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
    --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Configure Eureka Server for Spring settings](java-eureka-server-usage.md)