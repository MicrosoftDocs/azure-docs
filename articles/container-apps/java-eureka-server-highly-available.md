---
title: "Tutorial: Create a Highly Available Eureka Server Component Cluster in Azure Container Apps"
description: Find out how to create a highly available Eureka service in Azure Container Apps. Go through steps for linking Eureka server instances to form a cluster.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: tutorial
ms.date: 11/13/2025
ms.author: cshoe
#customer intent: As a developer, I want to create a Eureka server cluster so that I can make my service registries highly available regardless of load and failures.
---

# Tutorial: Create a highly available Eureka server component cluster in Azure Container Apps

In this tutorial, you find out how to create a Eureka service that's designed to remain operational in the face of failures and high demand. Building a highly available Eureka service helps ensure the service registry that you use for Azure Container Apps is always available to clients regardless of demand.

Achieving high availability status for Eureka includes linking multiple Eureka server instances together so they form a cluster. The cluster provides resources so that if one Eureka server fails, the other services remain available for requests.

In this tutorial, you:

> [!div class="checklist"]
> * Create Eureka servers for Spring components.
> * Bind two Eureka servers for Spring components together into a cluster.
> * Bind a container app to both Eureka servers for highly available service discovery.

## Prerequisites

* An Azure account with an active subscription. If you don't already have one, you can [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* The [Azure CLI](/cli/azure/install-azure-cli).

## Considerations

When you run managed Java components in Container Apps, be aware of the following details:

[!INCLUDE [container-apps/component-considerations.md](../../includes/container-apps/component-considerations.md)]

## Set up initial resources

Use the following steps to create some resources that you need for your Eureka service cluster.

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

1. Use the Azure CLI to sign in to Azure.

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

## Create servers for a cluster

Create two Eureka Server for Spring components.

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

## Bind components together to form a cluster

For the Eureka servers to work in a high-availability configuration, they need to be linked together as a cluster.

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

With the server components linked together, you can create the container app and bind it to the two Eureka components.

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

## View the dashboard

> [!IMPORTANT]
> To view the Eureka Server for Spring dashboard, you need to have the `Microsoft.App/managedEnvironments/write`, `Owner`, or `Contributor` role assigned to your account for the Container Apps environment resource.
>
> * If you already have one of these roles, skip to the [Get the dashboard URL](#get-the-dashboard-url) section to get the URL and view the dashboard.
> * If you want to create a custom role definition and assign it to your account, take the steps in the following section, [Create and assign a custom role](#create-and-assign-a-custom-role).
> * If you want to assign your account the `Owner` or `Contributor` role for the resource, make that assignment, and then skip to the [Get the dashboard URL](#get-the-dashboard-url) section.

### Create and assign a custom role

1. Create the custom role definition. Before you run this command, replace the placeholder in the `AssignableScopes` value with your subscription ID.

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

1. Get the resource ID of the Container Apps environment.

   ```azurecli
   export ENVIRONMENT_ID=$(az containerapp env show \
       --name $ENVIRONMENT --resource-group $RESOURCE_GROUP \
       --query id \
       --output tsv)
   ```

1. Assign the custom role to your account for the Container Apps environment resource. Before you run this command, replace the placeholder in the `assignee` value with your user object ID or service principal ID.

   ```azurecli
   az role assignment create \
       --assignee <USER_OR_SERVICE_PRINCIPAL_ID> \
       --role "Java Component Dashboard Access" \
       --scope $ENVIRONMENT_ID
   ```

### Get the dashboard URL

Get the URL of the Eureka Server for Spring dashboard.

```azurecli
az containerapp env java-component eureka-server-for-spring show \
    --environment $ENVIRONMENT \
    --resource-group $RESOURCE_GROUP \
    --name $EUREKA_COMPONENT_FIRST \
    --query properties.ingress.fqdn \
    --output tsv
```

This command returns the URL you can use to access the Eureka Server for Spring dashboard. Through the dashboard, you can verify that the Eureka server setup consists of two replicas.

:::image type="content" source="media/java-components/eureka-highly-available.png" alt-text="Screenshot of a Eureka for Spring dashboard. The registered instances section lists a container app and two Eureka servers, all with a status of up." lightbox="media/java-components/eureka-highly-available.png":::

## Clean up resources

The resources created in this tutorial affect your Azure bill. If you aren't going to use these services in the long term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Related content

> [!div class="nextstepaction"]
> [Tutorial: Connect to a managed Eureka Server for Spring in Azure Container Apps](java-eureka-server.md)