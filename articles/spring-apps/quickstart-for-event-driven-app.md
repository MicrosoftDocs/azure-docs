---
title: "Quickstart - Deploy your first event driven application to Azure Spring Apps"
description: Describes how to deploy a event driven application to Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 02/23/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy your first event driven application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier

This quickstart explains how to deploy a Spring Boot event driven application to Azure Spring Apps.

Here is the diagram about the system:

:::image type="content" source="media/quickstart-for-event-driven-app/diagram.png" alt-text="Screenshot of Spring event driven app architecture." lightbox="media/quickstart-for-event-driven-app/diagram.png":::

## Prerequisites

- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 17 or above.
- [Maven](https://maven.apache.org/).
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli).

## Clone and build sample project
1. The sample project is ready on GitHub. Just clone sample project by this command:
    ```shell
    git clone https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git
    ```
    The sample project is a event driven application that subscribe to a Service Bus queue named `lower-case`, then handle the message and send another message to another queue named `upper-case`. To simply the app, messaging handle is just convert the message to uppercase.
2. Build the sample project.
    ```shell
    cd ASA-Samples-Web-Application
    ./mvnw clean package -DskipTests
    ```

## Prepare the cloud environment

The main resources needed to run this sample is an Azure Spring Apps instance and an Azure Service Bus instance. This section will give you the steps to create these resources. 

### 1. Create a new resource group

To easier to manage the resources, create a resource group to hold these resources. Follow the following steps to create a new resource group.

1. Login Azure CLI.
    ```azurecli-interactive
    az login
    ```
2. List available subscriptions.
    ```azurecli-interactive
    az account list --output table
    ```
3. Set default subscription.
    ```azurecli-interactive
    az account set --subscription <subscription-id>
    ```
4. Create a resource group.
    ```azurecli-interactive
    RESOURCE_GROUP=<name-of-resource-group>
    LOCATION=eastus
    az group create \
        --resource-group ${RESOURCE_GROUP} \
        --location ${LOCATION}
    ```

### 2. Create Service Bus instance
1. Run the following command to create a Service Bus messaging namespace.
    ```azurecli-interactive
    SERVICE_BUS_NAME_SPACE=<name-of-service-bus-namespace>
    az servicebus namespace create \
        --resource-group ${RESOURCE_GROUP} \
        --name ${SERVICE_BUS_NAME_SPACE} \
        --location ${LOCATION}
    ```
2. Run the following command to create 2 queues named `lower-case` and `upper-case`. 
    ```azurecli-interactive
    az servicebus queue create \
        --resource-group ${RESOURCE_GROUP} \
        --namespace-name ${SERVICE_BUS_NAME_SPACE} \
        --name lower-case
    az servicebus queue create \
        --resource-group ${RESOURCE_GROUP} \
        --namespace-name ${SERVICE_BUS_NAME_SPACE} \
        --name upper-case
    ```

### 3. Create Azure Spring Apps Consumption plan instance

Azure Spring Apps will be used to host the spring event driven app. Let's create an Azure Spring Apps instance and create an app inside it.

#### 3.1. Create a Managed Environment
A Managed Environment creates a secure boundary around a group apps. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

1. Install the Azure Container Apps extension for the CLI
    ```azurecli-interactive
    az extension add --name containerapp --upgrade
    ```
2. Register the Microsoft.App namespace
    ```azurecli-interactive
    az provider register --namespace Microsoft.App
    ```
3. Register the Microsoft.OperationalInsights provider for the Azure Monitor Log Analytics workspace if you have not used it before.
    ```azurecli-interactive
    az provider register --namespace Microsoft.OperationalInsights
    ```
4. A Managed Environment creates a secure boundary around a group apps. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. To create the environment, run the following command:
    ```azurecli-interactive
    MANAGED_ENVIRONMENT=<name-of-managed-environment>
    az containerapp env create \
        --resource-group ${RESOURCE_GROUP} \
        --name ${MANAGED_ENVIRONMENT} \
        --location ${LOCATION}
    ```

#### 3.2. Create Azure Spring Apps instance

1. Install the spring extension specifically designed for StandardGen2 Azure Spring Apps.
    ```azurecli-interactive
    az extension remove -n spring && \
    az extension add \
        --source https://ascprivatecli.blob.core.windows.net/cli-extension/spring-1.1.11-py3-none-any.whl
    ```
2. Register the Microsoft.AppPlatform provider for the Azure Spring Apps.
    ```azurecli-interactive
    az provider register --namespace Microsoft.AppPlatform
    ```
3. Get managed environment resource id.
    ```azurecli-interactive
    MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
        --name ${MANAGED_ENVIRONMENT} \
        --resource-group ${RESOURCE_GROUP} \
        --query id -o tsv)
    ```
4. Create your Azure Spring Apps instance by specifying the resource id of the Managed Environment you just created
    ```azurecli-interactive
    AZURE_SPRING_APPS_NAME=<name-of-azure-spring-apps-instance>
    az spring create \
        --resource-group ${RESOURCE_GROUP} \
        --name ${AZURE_SPRING_APPS_NAME} \
        --managed-environment ${MANAGED_ENV_RESOURCE_ID} \
        --sku standardGen2 \
        --location ${LOCATION}
    ```

#### 3.3. Create an app in Azure Spring Apps

1. Create an app in the Azure Spring Apps instance you just created.
    ```azurecli-interactive
    APP_NAME=<name-of-app>
    az spring app create \
        --resource-group ${RESOURCE_GROUP} \
        --service ${AZURE_SPRING_APPS_NAME} \
        --name ${APP_NAME} \
        --cpu 1 \
        --memory 2 \
        --instance-count 2 \
        --runtime-version Java_17 \
        --assign-endpoint true \
        --env SERVICE_BUS_NAME_SPACE=${SERVICE_BUS_NAME_SPACE}
    ```

#### 3.4. Assign role to the app

To read and write message in Azure Service Bus, `Azure Service Bus Data Owner` role is necessary for the app.

1. Get object id of the app's managed identity.
1. Assign role.


## Deploy the app to Azure Spring Apps
1. Now the cloud environment is ready. Deploy the app by this command:
    ```azurecli-interactive
    az spring app deploy \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --name <name-of-app> \
        --artifact-path web/target/simple-todo-web-0.0.1-SNAPSHOT.jar
    ```
2. Once deployment has completed, you can access the app at `https://<name-of-azure-spring-apps-instance>-<name-of-app>.azuremicroservices.io/`. If everything goes well, you can see the page just like you have seen in localhost.
3. If there is some problem when deploy the app, you can check the app's log to do some investigation by this command:
    ```azurecli-interactive
    az spring app logs \
        --resource-group <name-of-resource-group> \
        --service <name-of-azure-spring-apps-instance> \
        --name <name-of-app>
    ```

## Clean up resources
1. To avoid unnecessary cost, use the following commands to delete the resource group.
    ```azurecli-interactive
    az group delete --name <name-of-resource-group>
    ```

## Next steps
1. [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](/azure/spring-apps/how-to-bind-postgres?tabs=Secrets).
2. [Create a service connection in Azure Spring Apps with the Azure CLI](/azure/service-connector/quickstart-cli-spring-cloud-connection).
3. [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
4. [Spring on Azure](/azure/developer/java/spring/)
5. [Spring Cloud Azure](/azure/developer/java/spring-framework/)
