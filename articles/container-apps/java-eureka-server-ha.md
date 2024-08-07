---
title: "Tutorial: Create a Highly Available Eureka Service in Azure Container Apps"
description: Learn to create a highly available Eureka service in Azure Container Apps.
services: container-apps
author: wenhaozhang
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 08/05/2024
ms.author: wenhaozhang
---

# Tutorial: Create a Highly Available Eureka Service in Azure Container Apps

In this tutorial, we will walk you through the process of creating a highly available Eureka service using in Container Apps. By leveraging Azure Container Apps, you can ensure that your Eureka service is highly available.

A Highly Available service is one designed to be operational and accessible without significant downtime. For Eureka, this means ensuring the service registry is always available to client services for both registering themselves and discovering other services. Achieving HA for Eureka involves running multiple instances of the Eureka server and configuring them to be aware of each other, forming a cluster. This setup ensures that if one Eureka server fails, the others continue to operate, preventing a single point of failure.

In this tutorial, you will learn to:

1. Create Eureka Server for Spring components.
2. Bind two Eureka Server for Spring components together to provide high available service.
3. Bind applications to both two Eureka Server for high available service discovery.

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

Before you begin, create the necessary resources by executing the following commands.

1.  Create variables to support your application configuration. These values are provided for you for the purposes of this lesson.
 
    ```bash
    export LOCATION=eastus
    export RESOURCE_GROUP=my-services-resource-group
    export ENVIRONMENT=my-environment
    export EUREKA_COMPONENT_NAME_01=eureka01
    export EUREKA_COMPONENT_NAME_02=eureka02
    export APP_NAME=sample-service-eureka-client
    export IMAGE="mcr.microsoft.com/javacomponents/samples/sample-service-eureka-client:latest"
    ```
2. Log in to Azure with the Azure CLI.

    ```azurecli
    az login
    ```

3. Create a resource group.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

4. Create your container apps environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```

## Create two Eureka Server for Spring Java component

Now that you have an existing environment, to create high available Eureka service, you should at least create two Eureka Server for Spring java components. These components will form the core of your Eureka service.

1. Create two Eureka Server for Spring component.

```azurecli
az containerapp env java-component eureka-server-for-spring create \
    --environment $ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --name $EUREKA_COMPONENT_NAME_01
```

```azurecli
az containerapp env java-component eureka-server-for-spring create \
    --environment $ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --name $EUREKA_COMPONENT_NAME_02
```

## Bind the components with each other

For the Eureka servers to work in a high-availability configuration, they must be aware of each other. This is achieved by binding the two Eureka components together.

1. Bind the Eureka Server for Spring components with each other.

```azurecli
az containerapp env java-component eureka-server-for-spring update \
    --environment $ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --name $EUREKA_COMPONENT_NAME_01 \
    --bind $EUREKA_COMPONENT_NAME_02
```

```azurecli
az containerapp env java-component eureka-server-for-spring update \
    --environment $ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --name $EUREKA_COMPONENT_NAME_02 \
    --bind $EUREKA_COMPONENT_NAME_01
```

## Deploy and bind your application

Finally, deploy your application as a container app and bind it to the Eureka servers. This step involves creating the container app and binding it to the two Eureka components to ensure it can register with and discover services from the Eureka service.

1. Create the container app 

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

1. Bind the container app to the two Eureka Server for Spring components.

```azurecli
az containerapp update \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --bind $EUREKA_COMPONENT_NAME_01 
```

```azurecli
az containerapp update \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --bind $EUREKA_COMPONENT_NAME_02
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

1. Get the URL of the Eureka Server for Spring dashboard.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring show \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_COMPONENT_NAME_01 \
      --query properties.ingress.fqdn -o tsv
    ```

    This command returns the URL you can use to access the Eureka Server for Spring dashboard. Through the dashboard, you could find the eureka server setup consists of two replicas.

    :::image type="content" source="media/java-components/eureka-ha.png" alt-text="Screenshot of the High available Eureka Server for Spring dashboard."  lightbox="media/java-components/eureka-ha.png":::

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
    --resource-group $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Configure Eureka Server for Spring settings](java-eureka-server-usage.md)