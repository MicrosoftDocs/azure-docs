---
title: Quickstart - Deploy event driven application to Azure Spring Apps
description: Learn how to deploy an event driven application to Azure Spring Apps
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 02/23/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy an event driven application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption (Preview) ✔️ Basic/Standard

This article explains how to deploy a Spring Boot event driven application to Azure Spring Apps. The sample project is an event driven application that subscribes to a [Service Bus queue](/azure/service-bus-messaging/service-bus-queues-topics-subscriptions#queues) named `lower-case`, and then handles the message and sends another message to another queue named `upper-case`. To make the app simple, message processing just converts the message to uppercase. The following diagram depicts this process:

:::image type="content" source="media/quickstart-for-event-driven-app/diagram.png" alt-text="Screenshot of Spring event driven app architecture." lightbox="media/quickstart-for-event-driven-app/diagram.png":::

## Prerequisites

- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/). Version 17.
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Version 2.45.0 or greater.

## Clone and build sample project

1. The sample project is ready on GitHub. Clone sample project with this command:

   ```shell
   git clone https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git
   ```

1. Build the sample project.

   ```shell
   cd ASA-Samples-Event-Driven-Application
   ./mvnw clean package -DskipTests
   ```

## Prepare the cloud environment

The main resources needed to run this sample is an Azure Spring Apps instance and an Azure Service Bus instance. This section provides the steps to create these resources.

### Step 1 - Set names for resources

Set variables to the names of your resources, and to values for other settings as needed. Names of resources in Azure must be unique.

```azurecli-interactive
RESOURCE_GROUP=<event-driven-app-resource-group>
LOCATION=<desired-region>
SERVICE_BUS_NAME_SPACE=<event-driven-app-service-bus-namespace>
MANAGED_ENVIRONMENT=<Azure-Container-Apps-environment>
AZURE_SPRING_APPS_NAME=<Azure-Spring-Apps-instance>
APP_NAME=<event-driven-app>
```

### Step 2 - Create a new resource group

To manage the resources easily, create a resource group to hold these resources. Follow the following steps to create a new resource group.

1. Sign-in Azure CLI.

   ```azurecli-interactive
   az login
   ```

1. Set default location.

   ```azurecli-interactive
   az configure --defaults location=${LOCATION}
   ```

1. Set your default subscription. Firstly, list all available subscriptions:

   ```azurecli-interactive
   az account list --output table
   ```

   Determine the ID op the subscription you want to set and use it with the following command to set your default subscription.

   ```azurecli-interactive
   az account set --subscription <subscription-ID>
   ```

1. Create a resource group.

   ```azurecli-interactive
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Set the newly created resource group as default resource group.

   ```azurecli-interactive
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### Step 3 - Create a Service Bus instance

1. Run the following command to create a Service Bus namespace.

   ```azurecli-interactive
   az servicebus namespace create --name ${SERVICE_BUS_NAME_SPACE}
   ```

1. Run the following command to create two queues named `lower-case` and `upper-case`.

   ```azurecli-interactive
   az servicebus queue create \
       --namespace-name ${SERVICE_BUS_NAME_SPACE} \
       --name lower-case
   az servicebus queue create \
       --namespace-name ${SERVICE_BUS_NAME_SPACE} \
       --name upper-case
   ```

### Step 4 - Create an Azure Spring Apps Consumption plan instance

An Azure Spring Apps Consumption plan hosts the spring event driven app. This section provides the steps of to create an instance of an Azure Spring Apps Consumption plan and then creates an app inside the plan.

#### Step 4.1 - Create an Azure Container Apps environment

The Azure Container Apps environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

1. Install the Azure Container Apps extension for the CLI.

   ```azurecli-interactive
   az extension add --name containerapp --upgrade
   ```

1. Register the `Microsoft.App` namespace.

   ```azurecli-interactive
   az provider register --namespace Microsoft.App
   ```

1. If you haven't previously used the Azure Monitor Log Analytics workspace, register the `Microsoft.OperationalInsights` provider.

   ```azurecli-interactive
   az provider register --namespace Microsoft.OperationalInsights
   ```

1. Create the environment by this command:

   ```azurecli-interactive
   az containerapp env create --name ${MANAGED_ENVIRONMENT}
   ```

#### Step 4.2 - Create Azure Spring Apps instance

1. Install the spring extension designed for StandardGen2 Azure Spring Apps.

   ```azurecli-interactive
   az extension remove -n spring && \
   az extension add \
       --source https://ascprivatecli.blob.core.windows.net/cli-extension/spring-1.8.0-py3-none-any.whl \
       --yes
   ```

1. Register the Microsoft.AppPlatform provider for the Azure Spring Apps.

   ```azurecli-interactive
   az provider register --namespace Microsoft.AppPlatform
   ```

1. Get Azure Container Apps environment resource ID.

   ```azurecli-interactive
   MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
       --name ${MANAGED_ENVIRONMENT} \
       --query id -o tsv)
   ```

1. Create your Azure Spring Apps instance by specifying the resource ID of the Azure Container Apps environment you created.

   ```azurecli-interactive
   az spring create \
       --name ${AZURE_SPRING_APPS_NAME} \
       --managed-environment ${MANAGED_ENV_RESOURCE_ID} \
       --sku standardGen2
   ```

#### Step 4.3 - Create an app in Azure Spring Apps

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

### Step 5 - Bind Service Bus to Azure Spring Apps

Now both the Service Bus and the app in Azure Spring Apps have been created. But the app cannot connect to the Service Bus. This section provides the steps to enable the app to connect to the Service Bus.

#### Step 5.1 - Get a connection string

To enable the app to connect to the Service Bus, get the Service Bus's connection string.

```azurecli-interactive
SERVICE_BUS_CONNECTION_STRING=$(az servicebus namespace authorization-rule keys list \
    --namespace-name ${SERVICE_BUS_NAME_SPACE} \
    --name RootManageSharedAccessKey \
    --query primaryConnectionString \
    -o tsv)
```

#### Step 5.2 - Set environment variable in app

Provide the connecting string to the app by adding an environment variable.

```azurecli-interactive
az spring app update \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${APP_NAME} \
    --env SERVICE_BUS_CONNECTION_STRING=${SERVICE_BUS_CONNECTION_STRING}
```

## Deploy the app to Azure Spring Apps

Now the cloud environment is ready. Deploy the app with the following command.

```azurecli-interactive
az spring app deploy \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${APP_NAME} \
    --artifact-path target/simple-event-driven-app-0.0.1-SNAPSHOT.jar
```

## Validate the event driven app

To check whether the event driven app works well, validate it by sending a message to the `lower-case` queue and check whether there's a message in the `upper-case`queue.

1. Send a message to `lower-case` queue with Service Bus Explorer. For details see [Send a message to a queue or topic](/azure/service-bus-messaging/explorer#send-a-message-to-a-queue-or-topic).
1. Check whether there is a new message sent to the `upper-case` queue. For details see [Peek a message](/azure/service-bus-messaging/explorer#peek-a-message).

## Next steps

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
