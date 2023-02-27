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

This quickstart explains how to deploy a Spring Boot event driven application to Azure Spring Apps. The sample project is a event driven application that subscribe to a [Service Bus queue](/azure/service-bus-messaging/service-bus-queues-topics-subscriptions#queues) named `lower-case`, then handle the message and send another message to another queue named `upper-case`. To make the app simple, message processing is just converting the message to uppercase. Here is the diagram about the system:

:::image type="content" source="media/quickstart-for-event-driven-app/diagram.png" alt-text="Screenshot of Spring event driven app architecture." lightbox="media/quickstart-for-event-driven-app/diagram.png":::

## Prerequisites

- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/). Version = 17.
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Version >= 2.45.0.

## Clone and build sample project
1. The sample project is ready on GitHub. Just clone sample project by this command:
    ```shell
    git clone https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git
    ```
2. Build the sample project.
    ```shell
    cd ASA-Samples-Web-Application
    ./mvnw clean package -DskipTests
    ```

## Prepare the cloud environment

The main resources needed to run this sample is an Azure Spring Apps instance and an Azure Service Bus instance. This section will give the steps to create these resources. 

### 1. Set name for each resource
To make the steps easier to proceed, let's set the name at the beginning. 
```azurecli-interactive
RESOURCE_GROUP=EventDrivenAppResourceGroup
LOCATION=eastus
SERVICE_BUS_NAME_SPACE=EventDrivenAppServiceBusNamespace
MANAGED_ENVIRONMENT=EventDrivenAppManagedEnvironment
AZURE_SPRING_APPS_NAME=event-driven-azure-spring-apps
APP_NAME=EventDrivenApp
```
If some of above name already been taken in your cloud environment, it will have error when you execute the commands in the following part of this article. If it happens, just set another name and continue.

### 2. Create a new resource group

To easier to manage the resources, create a resource group to hold these resources. Follow the following steps to create a new resource group.

1. Login Azure CLI.
    ```azurecli-interactive
    az login
    ```
2. Set Default location.
    ```azurecli-interactive
    az configure --defaults location=${LOCATION}
    ```
3. Set default subscription. Firstly, list all available subscriptions:
    ```azurecli-interactive
    az account list --output table
    ```
    Then choose one subscription and set it as default subscription. Replace `<SubscriptionId>` with your chosen subscription id before run this command:
    ```azurecli-interactive
    az account set --subscription <SubscriptionId>
    ```
4. Create a resource group.
    ```azurecli-interactive
    az group create --resource-group ${RESOURCE_GROUP}
    ```
5. Set the new created resource group as default resource group.
    ```azurecli-interactive
    az configure --defaults group=${RESOURCE_GROUP}5
    ```

### 3. Create Service Bus instance
1. Run the following command to create a Service Bus messaging namespace.
    ```azurecli-interactive
    az servicebus namespace create --name ${SERVICE_BUS_NAME_SPACE}
    ```
2. Run the following command to create 2 queues named `lower-case` and `upper-case`. 
    ```azurecli-interactive
    az servicebus queue create \
        --namespace-name ${SERVICE_BUS_NAME_SPACE} \
        --name lower-case
    az servicebus queue create \
        --namespace-name ${SERVICE_BUS_NAME_SPACE} \
        --name upper-case
    ```

### 4. Create Azure Spring Apps Consumption plan instance

Azure Spring Apps Consumption plan will be used to host the spring event driven app. Let's create an Azure Spring Apps Consumption plan instance and create an app inside it.

#### 4.1. Create a Managed Environment
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
    az containerapp env create --name ${MANAGED_ENVIRONMENT}
    ```

#### 4.2. Create Azure Spring Apps Consumption plan instance

1. Install the spring extension specifically designed for StandardGen2 Azure Spring Apps.
    ```azurecli-interactive
    az extension remove -n spring && \
    az extension add \
        --source https://ascprivatecli.blob.core.windows.net/cli-extension/spring-1.1.11-py3-none-any.whl
    ```
    Input `y` when a prompt ask you to confirm like this:
    ```text
    Are you sure you want to install this extension? (y/n): y
    ```
2. Register the Microsoft.AppPlatform provider for the Azure Spring Apps.
    ```azurecli-interactive
    az provider register --namespace Microsoft.AppPlatform
    ```
3. Get managed environment resource id.
    ```azurecli-interactive
    MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
        --name ${MANAGED_ENVIRONMENT} \
        --query id -o tsv)
    ```
4. Create your Azure Spring Apps instance by specifying the resource id of the Managed Environment you just created
    ```azurecli-interactive
    az spring create \
        --name ${AZURE_SPRING_APPS_NAME} \
        --managed-environment ${MANAGED_ENV_RESOURCE_ID} \
        --sku standardGen2
    ```

#### 4.3. Create an app in Azure Spring Apps
Create an app in the Azure Spring Apps instance.
```azurecli-interactive
az spring app create \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${APP_NAME} \
    --cpu 1 \
    --memory 2 \
    --instance-count 2 \
    --runtime-version Java_17 \
    --assign-endpoint true
```

### 5. Bind Service Bus to Azure Spring Apps
Now both Service Bus and app in Azure Spring Apps have been created. But the app can not connect to Service Bus. This section will give steps about how to make the app can connect to Service Bus.

#### 5.1. Get connection string

To make the app can connect to the Service Bus, get the Service Bus's connection string first.
```azurecli-interactive
SERVICE_BUS_CONNECTION_STRING=$(az servicebus namespace authorization-rule keys list \
    --namespace-name ${SERVICE_BUS_NAME_SPACE} \
    --name RootManageSharedAccessKey \
    --query primaryConnectionString \
    -o tsv)
```

#### 5.2. Set environment variable in app

Provide the connecting string to app by adding an environment variable.
```azurecli-interactive
az spring app update \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${APP_NAME} \
    --env SERVICE_BUS_CONNECTION_STRING=${SERVICE_BUS_CONNECTION_STRING}
```

## Deploy the app to Azure Spring Apps

Now the cloud environment is ready. Deploy the app by this command:
```azurecli-interactive
az spring app deploy \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${APP_NAME} \
    --artifact-path target/simple-event-driven-app-0.0.1-SNAPSHOT.jar
```

## Validate the event driven app
To check whether the event driven app work well, let's validate it by sending a message to `lower-case` queue and check whether there is a message in `upper-case`.

1. Send a message to `lower-case` queue by Service Bus Explorer. You can refer to [Send a message to a queue or topic](/azure/service-bus-messaging/explorer#send-a-message-to-a-queue-or-topic) to get more information about how to do this.
1. Check whether there is a new message send to `upper-case` queue. You can refer to [Peek a message](/azure/service-bus-messaging/explorer#peek-a-message) to get more information about how to do this.


## Clean up resources
To avoid unnecessary cost, use the following commands to delete the resource group.
```azurecli-interactive
az group delete --name ${RESOURCE_GROUP}
```

## Next steps
1. [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
2. [Spring on Azure](/azure/developer/java/spring/)
3. [Spring Cloud Azure](/azure/developer/java/spring-framework/)
