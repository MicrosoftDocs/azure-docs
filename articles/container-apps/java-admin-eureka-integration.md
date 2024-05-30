---
title: "Tutorial: Integrate Admin for Spring with Eureka Server for Spring in Azure Container Apps"
description: Learn to integrate Admin for Spring with Eureka Server for Spring in Azure Container Apps.
services: container-apps
author: 
ms.service: container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 05/24/2024
ms.author: 
---

# Tutorial: Integrate Admin for Spring with Eureka Server for Spring in Azure Container Apps (Preview)

This tutorial will guide you through the process of integrating a managed Admin for Spring with a Eureka Server for Spring within Azure Container Apps. By following this guide, you'll set up a Eureka Server for service discovery and then create an Admin for Spring to manage and monitor your Spring applications registered with the Eureka Server. This setup ensures that other applications only need to bind to the Eureka Server, simplifying the management of your microservices.

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

## Considerations

When running managed Java components in Azure Container Apps, be aware of the following details:

| Item | Explanation |
|---|---|
| **Scope** | The Java components run in the same environment as the connected container apps. |
| **Scaling** | Both the Eureka Server and Admin for Spring have fixed scaling properties (`minReplicas` and `maxReplicas` set to `1`). |
| **Resources** | The resource allocation for both components is fixed. Each is allocated 0.5 CPU cores and 1Gi of memory. |
| **Pricing** | Billing falls under consumption-based pricing. Resources consumed by managed Java components are billed at active/idle rates. You can delete components that are no longer in use to stop billing. |
| **Binding** | Container apps connect to managed Java components via a binding, which injects configurations into container app environment variables. |

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
    export EUREKA_CLIENT_IMAGE="caoxuyang/sba-test-client:0.0.3"
    ```

    | Variable | Description |
    |---|---|
    | `LOCATION` | The Azure region location where you create your container app and Java components. |
    | `RESOURCE_GROUP` | The Azure resource group name for your demo application. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `EUREKA_COMPONENT_NAME` | The name of the Eureka Server Java component. |
    | `ADMIN_COMPONENT_NAME` | The name of the Admin for Spring Java component. |
    | `CLIENT_APP_NAME` | The name of the container app that will bind to the Eureka Server. |
    | `EUREKA_CLIENT_IMAGE` | The container image used in your Eureka Server container app. |

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

## Create the Eureka Server for Spring

1. Create the Eureka Server Java component.

    ```azurecli
    az containerapp env java-component eureka-server-for-spring create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $EUREKA_COMPONENT_NAME
    ```

## Create the Admin for Spring and bind it to the Eureka Server for Spring

1. Create the Admin for Spring Java component.

    ```azurecli
    az containerapp env java-component admin-for-spring create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $ADMIN_COMPONENT_NAME \
      --bind $EUREKA_COMPONENT_NAME
    ```


## Bind Other Applications to the Eureka Server

With the Eureka Server set up, you can now bind other applications to it for service discovery. And you can also monitor and manage these applications in the dashboard of Admin for Spring. Follow the steps below to create and bind a container app to the Eureka Server:


1. Create the container app and bind it to the Eureka Server.

    ```azurecli
    az containerapp create \
      --name $CLIENT_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT \
      --image $EUREKA_CLIENT_IMAGE \
      --min-replicas 1 \
      --max-replicas 1 \
      --ingress external \
      --target-port 8080 \
      --bind $EUREKA_COMPONENT_NAME 
    ```

    > [!TIP] Since the Admin for Spring has been binded to the Eureka Server for Spring in previous steps. Bind the container app to the Eureka Server Java component will enable service discovery and allow to be managed through the Admin for Spring dashboard at the same time.

## View the application in both Admin for Spring and Eureka Server for Spring dashboards


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
    

1. Assign the Custom Role to your accound on managed environment resource:

    Get the resource id of the managed environment:

    ```azurecli
        export ENVIRONMENT_ID=$(az containerapp env show \
         --name $ENVIRONMENT --resource-group $RESOURCE_GROUP \ 
         --query id -o tsv)
    ```

1. Assign the role to the your account:
    
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

    You should be able to access the Admin for Spring dashboard and the Eureka Server for Spring dashboard using the URLs provided. And the container app as well as the Admin for Spring server should be visible in both dashboards.

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP


