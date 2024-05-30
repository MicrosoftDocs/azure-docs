---
title: "Tutorial: Connect to a managed Admin for Spring in Azure Container Apps"
description: Learn to use a managed Admin for Spring in Azure Container Apps.
services: container-apps
author: 
ms.service: container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 05/24/2024
ms.author: 
---

# Tutorial: Connect to a managed Admin for Spring in Azure Container Apps (preview)

The Admin for Spring managed component offers an administrative interface for Spring Boot web applications that expose actuator endpoints. As a managed component in Azure Container Apps, you can easily bind your container app to Admin for Spring for seamless integration and management.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create an Admin for Spring Java component
> * Bind your container app to Admin for Spring Java component

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along step-by-step, make sure you delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When running Admin for Spring in Azure Container Apps, be aware of the following details:

| Item | Explanation |
|---|---|
| **Scope** | The Admin for Spring component runs in the same environment as the connected container app. |
| **Scaling** | The Admin for Spring can’t scale. The scaling properties `minReplicas` and `maxReplicas` are both set to `1`. |
| **Resources** | The container resource allocation for Admin for Spring is fixed. The number of the CPU cores is 0.5, and the memory size is 1Gi. |
| **Pricing** | The Admin for Spring billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at the active/idle rates. You can delete components that are no longer in use to stop billing. |
| **Binding** | Container apps connect to a Admin for Spring component via a binding. The bindings inject configurations into container app environment variables. Once a binding is established, the container app can read the configuration values from environment variables and connect to the Admin for Spring. |

## Setup

Before you begin to work with the Admin for Spring, you first need to create the required resources.

Execute the following commands to create your resource group, container apps environment.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-services-resource-group
    export ENVIRONMENT=my-environment
    export JAVA_COMPONENT_NAME=admin
    export APP_NAME=sample-admin-client
    export IMAGE="caoxuyang/sba-test-client:0.0.3"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java component. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `JAVA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create a Admin for Spring Java component.  |
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

## Use the Admin for Spring Java component

Now that you have an existing environment, you can create your container app and bind it to a Java component instance of Admin for Spring.

1. Create the Admin for Spring Java component.

    ```azurecli
    az containerapp env java-component admin-for-spring create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME
    ```

1. Create the container app and bind to the Admin for Spring.

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
      --bind $JAVA_COMPONENT_NAME
    ```

    The `--bind` parameter binds the container app to the Admin for Spring Java component. The container app can now read the configuration values from environment variables, primarily the `SPRING_BOOT_ADMIN_CLIENT_URL` property and connect to the Admin for Spring.

    The binding also injects the following property:

    ```bash
    "SPRING_BOOT_ADMIN_CLIENT_INSTANCE_PREFER-IP": "true",
    ```

    This property indicates that the Admin for Spring client should prefer the IP address of the container app instance when connecting to the Admin for Spring server.

    You can also [remove a binding](admin-for-spring-usage.md#unbind) from your application.

## View the application in Admin for Spring dashboards

1. Create the custom role definition.

    ```azurecli
    az role definition create --role-definition '{
        "Name": "Java Component Dashboard Access",
        "IsCustom": true,
        "Description": "Can access managed Java Component dashboards in managed environments",
        "Actions": [
            "Microsoft.App/managedEnvironments/write"
        ],
        "AssignableScopes": ["/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"]
    }'
    ```
    

1. Assign the Custom Role to your accound on managed environment resource.

    Get the resource id of the managed environment:

    ```azurecli
        export ENVIRONMENT_ID=$(az containerapp env show \
         --name $ENVIRONMENT --resource-group $RESOURCE_GROUP \ 
         --query id -o tsv)
    ```

1. Assign the role to the your account.
    
    ```azurecli
        az role assignment create \
        --assignee <user-or-service-principal-id> \
        --role "Java Component Dashboard Access" \
        --scope $ENVIRONMENT_ID
    ```

1. Get the URL of the Admin for Spring dashboard.

    ```azurecli
        az containerapp env java-component admin-for-spring show \
        --environment $ENVIRONMENT \
        --resource-group $RESOURCE_GROUP \
        --name $JAVA_COMPONENT_NAME \
        --query properties.ingress.fqdn -o tsv
    ```

    You should be able to access the Admin for Spring dashboard using the URL provided. And the container app should be visible in the dashboard like the screenshot below:

    :::image type="content" source="media/java-components/sba-alone.png" alt-text="Screenshot of the Admin for Spring dashboard."  lightbox="media/java-components/sba-alone.png":::

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
  az group delete \
    --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Configure Admin for Spring settings](java-admin-for-spring-usage.md)
> [Tutorial: Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md)