---
title: "Tutorial: Connect to a managed Admin for Spring in Azure Container Apps"
description: Learn to use a managed Admin for Spring in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 07/15/2024
ms.author: cshoe
---

# Tutorial: Connect to a managed Admin for Spring in Azure Container Apps

The Admin for Spring managed component offers an administrative interface for Spring Boot web applications that expose actuator endpoints. As a managed component in Azure Container Apps, you can easily bind your container app to Admin for Spring for seamless integration and management.

This tutorial shows you how to create an Admin for Spring Java component and bind it to your container app so you can monitor and manage your Spring applications with ease.

:::image type="content" source="media/java-components/spring-boot-admin-overview.png" alt-text="Screenshot of overview of the Admin for Spring insights dashboard."  lightbox="media/java-components/spring-boot-admin-overview.png":::

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create an Admin for Spring Java component
> * Bind your container app to Admin for Spring Java component

> [!NOTE]
> If you want to integrate Admin for Spring with Eureka Server for Spring, see [Integrate Admin for Spring with Eureka Server for Spring in Azure Container Apps](java-admin-eureka-integration.md) instead.

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along step-by-step, make sure you delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| [Azure account](https://azure.microsoft.com/free/) | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| [Azure CLI](/cli/azure/install-azure-cli) | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Considerations

When running Admin for Spring in Azure Container Apps, be aware of the following details:

[!INCLUDE [container-apps/component-considerations.md](../../includes/container-apps/component-considerations.md)]

## Setup

Before you begin to work with the Admin for Spring, you first need to create the required resources.

The following commands help you create your resource group and Container Apps environment.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-demo-resource-group
    export ENVIRONMENT=my-environment
    export JAVA_COMPONENT_NAME=admin
    export APP_NAME=sample-admin-client
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-admin-for-spring-client:latest"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java component. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `JAVA_COMPONENT_NAME` | The name of the Java component created for your container app. In this case, you create an Admin for Spring Java component.  |
    | `IMAGE` | The container image used in your container app. |

1. Log in to Azure with the Azure CLI.

    ```azurecli
    az login
    ```

1. Create a resource group.

    ```azurecli
    az group create \
      --name $RESOURCE_GROUP \
      --location $LOCATION \
      --query "properties.provisioningState"
    ```

    Using the `--query` parameter filters the response down to a simple success or failure message.

1. Create your container apps environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```

## Use the component

Now that you have an existing environment, you can create your container app and bind it to a Java component instance of Admin for Spring component.

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

    This property indicates that the Admin for Spring component client should prefer the IP address of the container app instance when connecting to the Admin for Spring server.

    You can also [remove a binding](java-admin-for-spring-usage.md#unbind) from your application.

## View the dashboard

> [!IMPORTANT]
> To view the dashboard, you need to have at least the `Microsoft.App/managedEnvironments/write` role assigned to your account on the managed environment resource. You can either explicitly assign `Owner` or `Contributor` role on the resource or follow the steps to create a custom role definition and assign it to your account.

1. Create the custom role definition.

    ```azurecli
    az role definition create --role-definition '{
        "Name": "<ROLE_NAME>",
        "IsCustom": true,
        "Description": "Can access managed Java Component dashboards in managed environments",
        "Actions": [
            "Microsoft.App/managedEnvironments/write"
        ],
        "AssignableScopes": ["/subscriptions/<SUBSCRIPTION_ID>"]
    }'
    ```

    Make sure to replace the placeholders in between the `<>` brackets with your values.

1. Assign the custom role to your account on managed environment resource.

    Get the resource id of the managed environment:

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
      --role "<ROLE_NAME>" \
      --scope $ENVIRONMENT_ID
    ```

    > [!NOTE]
    > <USER_OR_SERVICE_PRINCIPAL_ID> usually should be the identity that you use to access Azure Portal. <ROLE_NAME> is the name you assigned in step 1.

1. Get the URL of the Admin for Spring dashboard.

    ```azurecli
    az containerapp env java-component admin-for-spring show \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $JAVA_COMPONENT_NAME \
      --query properties.ingress.fqdn -o tsv
    ```

    This command returns the URL you can use to access the Admin for Spring dashboard. Through the dashboard, your container app is also to you as shown in the following screenshot.

    :::image type="content" source="media/java-components/spring-boot-admin-alone.png" alt-text="Screenshot of the overview the Admin for Spring dashboard."  lightbox="media/java-components/spring-boot-admin-alone.png":::

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Configure Admin for Spring settings](java-admin-for-spring-usage.md)

## Related content

- [Integrate the managed Admin for Spring with Eureka Server for Spring](java-admin-eureka-integration.md)
