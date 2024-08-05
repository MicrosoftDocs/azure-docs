---
title: "Tutorial: Integrate Admin for Spring with Eureka Server for Spring in Azure Container Apps"
description: Learn to integrate Admin for Spring with Eureka Server for Spring in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 07/15/2024
ms.author: cshoe
---

# Tutorial: Integrate Admin for Spring with Eureka Server for Spring in Azure Container Apps

This tutorial will guide you through the process of integrating a managed Admin for Spring with a Eureka Server for Spring within Azure Container Apps.

This article contains some content similar to the "Connect to a managed Admin for Spring in Azure Container Apps" tutorial, but with Eureka Server for Spring, you can bind Admin for Spring to Eureka Server for Spring, so that it can get application information through Eureka, instead of having to bind individual applications to Admin for Spring.

By following this guide, you'll set up a Eureka Server for service discovery and then create an Admin for Spring to manage and monitor your Spring applications registered with the Eureka Server. This setup ensures that other applications only need to bind to the Eureka Server, simplifying the management of your microservices.

In this tutorial, you will learn to:

1. Create a Eureka Server for Spring.
2. Create an Admin for Spring and link it to the Eureka Server.
3. Bind other applications to the Eureka Server for streamlined service discovery and management.

## Prerequisites

To complete this tutorial, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | An active subscription is required. If you don't have one, you [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| An existing Eureka Server for Spring Java component | If you don't have one, follow the [Create the Eureka Server for Spring](java-eureka-server.md#create-the-eureka-server-for-spring-java-component) section to create one. |

## Considerations

When running managed Java components in Azure Container Apps, be aware of the following details:

[!INCLUDE [container-apps/component-considerations.md](../../includes/container-apps/component-considerations.md)]

## Setup

Before you begin, create the necessary resources by executing the following commands.

1. Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.

    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-services-resource-group
    export ENVIRONMENT=my-environment
    export EUREKA_COMPONENT_NAME=eureka
    export ADMIN_COMPONENT_NAME=admin
    export CLIENT_APP_NAME=sample-service-eureka-client
    export CLIENT_IMAGE="mcr.microsoft.com/javacomponents/samples/sample-admin-for-spring-client:latest"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java components. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `EUREKA_COMPONENT_NAME` | The name of the Eureka Server Java component. |
    | `ADMIN_COMPONENT_NAME` | The name of the Admin for Spring Java component. |
    | `CLIENT_APP_NAME` | The name of the container app that will bind to the Eureka Server. |
    | `CLIENT_IMAGE` | The container image used in your Eureka Server container app. |

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
      --location $LOCATION \
      --query "properties.provisioningState"
    ```

    Using the `--query` parameter filters the response down to a simple success or failure message.

## Optional: Create the Eureka Server for Spring

If you don't have an existing Eureka Server for Spring, follow the command below to create the Eureka Server Java component. For more information, see [Create the Eureka Server for Spring](java-eureka-server.md#create-the-eureka server-for-spring-java-component).

```azurecli
az containerapp env java-component eureka-server-for-spring create \
  --environment $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $EUREKA_COMPONENT_NAME
```

## Bind the components together

Create the Admin for Spring Java component.

```azurecli
az containerapp env java-component admin-for-spring create \
  --environment $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $ADMIN_COMPONENT_NAME \
  --bind $EUREKA_COMPONENT_NAME
```

## Bind other apps to the Eureka Server

With the Eureka Server set up, you can now bind other applications to it for service discovery. And you can also monitor and manage these applications in the dashboard of Admin for Spring. Follow the steps below to create and bind a container app to the Eureka Server:

Create the container app and bind it to the Eureka Server.

```azurecli
az containerapp create \
  --name $CLIENT_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image $CLIENT_IMAGE \
  --min-replicas 1 \
  --max-replicas 1 \
  --ingress external \
  --target-port 8080 \
  --bind $EUREKA_COMPONENT_NAME 
```

> [!TIP]
> Since the previous steps bound the Admin for Spring component to the Eureka Server for Spring component, the Admin component enables service discovery and allows you to manage it through the Admin for Spring dashboard at the same time.

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

    Get the resource id of the managed environment.

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

1. Get the URL of the Admin for Spring dashboard.

    ```azurecli
    az containerapp env java-component admin-for-spring show \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $ADMIN_COMPONENT_NAME \
      --query properties.ingress.fqdn -o tsv
    ```

1. Get the URL of the Eureka Server for Spring dashboard.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring show \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_COMPONENT_NAME \
      --query properties.ingress.fqdn -o tsv
    ```

    This command returns the URL you can use to access the Eureka Server for Spring dashboard. Through the dashboard, your container app is also to you as shown in the following screenshot.

    :::image type="content" source="media/java-components/spring-boot-admin.png" alt-text="Screenshot of the Admin for Spring dashboard."  lightbox="media/java-components/spring-boot-admin.png":::

    :::image type="content" source="media/java-components/eureka.png" alt-text="Screenshot of the Eureka Server for Spring dashboard."  lightbox="media/java-components/eureka.png":::

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
    --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Configure Eureka Server for Spring settings](java-eureka-server-usage.md)
> [Configure Admin for Spring settings](java-admin-for-spring-usage.md)
