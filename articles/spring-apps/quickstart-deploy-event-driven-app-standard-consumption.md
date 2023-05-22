---
title: Quickstart - Deploy event-driven application to Azure Spring Apps
description: Learn how to deploy an event-driven application to Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 03/21/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
zone_pivot_groups: spring-apps-plan-selection
---

# Quickstart: Deploy an event-driven application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This article explains how to deploy a Spring Boot event-driven application to Azure Spring Apps.

The sample project is an event-driven application that subscribes to a [Service Bus queue](../service-bus-messaging/service-bus-queues-topics-subscriptions.md#queues) named `lower-case`, and then handles the message and sends another message to another queue named `upper-case`. To make the app simple, message processing just converts the message to uppercase. The following diagram depicts this process:

:::image type="content" source="media/quickstart-deploy-event-driven-app-standard-consumption/diagram.png" alt-text="Diagram of Azure Spring Apps event-driven app architecture." lightbox="media/quickstart-deploy-event-driven-app-standard-consumption/diagram.png" border="false":::

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

::: zone pivot="sc-enterprise"

- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise tier in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

::: zone-end

- [Azure CLI](/cli/azure/install-azure-cli). Version 2.45.0 or greater. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

## Clone and build the sample project

Use the following steps to prepare the sample locally.

1. The sample project is ready on GitHub. Clone sample project by using the following command:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application.git
   ```

1. Build the sample project by using the following commands:

   ```bash
   cd ASA-Samples-Event-Driven-Application
   ./mvnw clean package -DskipTests
   ```

## Prepare the cloud environment

The main resources you need to run this sample is an Azure Spring Apps instance and an Azure Service Bus instance. Use the following steps to create these resources.

::: zone pivot="sc-consumption-plan"

1. Use the following commands to create variables for the names of your resources and for other settings as needed. Resource names in Azure must be unique.

   ```azurecli
   RESOURCE_GROUP=<event-driven-app-resource-group-name>
   LOCATION=<desired-region>
   SERVICE_BUS_NAME_SPACE=<event-driven-app-service-bus-namespace>
   AZURE_CONTAINER_APPS_ENVIRONMENT=<Azure-Container-Apps-environment-name>
   AZURE_SPRING_APPS_INSTANCE=<Azure-Spring-Apps-instance-name>
   APP_NAME=<event-driven-app-name>
   ```

::: zone-end

::: zone pivot="sc-standard,sc-enterprise"

1. Use the following commands to create variables for the names of your resources and for other settings as needed. Resource names in Azure must be unique.

   ```azurecli
   RESOURCE_GROUP=<event-driven-app-resource-group-name>
   LOCATION=<desired-region>
   SERVICE_BUS_NAME_SPACE=<event-driven-app-service-bus-namespace>
   AZURE_SPRING_APPS_INSTANCE=<Azure-Spring-Apps-instance-name>
   APP_NAME=<event-driven-app-name>
   ```

::: zone-end

2. Use the following command to sign in to Azure:

   ```azurecli
   az login
   ```

1. Use the following command to set the default location:

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Use the following command to list all available subscriptions, then determine the ID for the subscription you want to use.

   ```azurecli
   az account list --output table
   ```

1. Use the following command to set your default subscription:

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to create a resource group:

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group.

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

## Create a Service Bus instance

Use the following command to create a Service Bus namespace:

```azurecli
az servicebus namespace create --name ${SERVICE_BUS_NAME_SPACE}
```

## Create queues in your Service Bus instance

Use the following commands to create two queues named `lower-case` and `upper-case`:

```azurecli
az servicebus queue create \
    --namespace-name ${SERVICE_BUS_NAME_SPACE} \
    --name lower-case
az servicebus queue create \
    --namespace-name ${SERVICE_BUS_NAME_SPACE} \
    --name upper-case
```

::: zone pivot="sc-consumption-plan"

## Create an Azure Container Apps environment

The Azure Container Apps environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

Use the following steps to create the environment:

1. Use the following command to install the Azure Container Apps extension for the Azure CLI:

   ```azurecli
   az extension add --name containerapp --upgrade
   ```

1. Use the following command to register the `Microsoft.App` namespace:

   ```azurecli
   az provider register --namespace Microsoft.App
   ```

1. If you haven't previously used the Azure Monitor Log Analytics workspace, register the `Microsoft.OperationalInsights` provider by using the following command:

   ```azurecli
   az provider register --namespace Microsoft.OperationalInsights
   ```

1. Use the following command to create the environment:

   ```azurecli
   az containerapp env create --name ${AZURE_CONTAINER_APPS_ENVIRONMENT} --enable-workload-profiles
   ```

::: zone-end

## Create the Azure Spring Apps instance

An Azure Spring Apps service instance hosts the Spring event-driven app. Use the following steps to create the service instance and then create an app inside the instance.

1. Use the following command to install the Azure CLI extension designed for Azure Spring Apps:

   ```azurecli
   az extension remove --name spring && \
   az extension add --name spring
   ```

::: zone pivot="sc-consumption-plan"

2. Use the following command to register the `Microsoft.AppPlatform` provider for Azure Spring Apps:

   ```azurecli
   az provider register --namespace Microsoft.AppPlatform
   ```

1. Get the Azure Container Apps environment resource ID by using the following command:

   ```azurecli
   MANAGED_ENV_RESOURCE_ID=$(az containerapp env show \
       --name ${AZURE_CONTAINER_APPS_ENVIRONMENT} \
       --query id \
       --output tsv)
   ```

1. Use the following command to create your Azure Spring Apps instance, specifying the resource ID of the Azure Container Apps environment you created.

   ```azurecli
   az spring create \
       --name ${AZURE_SPRING_APPS_INSTANCE} \
       --managed-environment ${MANAGED_ENV_RESOURCE_ID} \
       --sku standardGen2
   ```

::: zone-end

::: zone pivot="sc-standard"

2. Use the following command to create your Azure Spring Apps instance:

   ```azurecli
   az spring create --name ${AZURE_SPRING_APPS_INSTANCE}
   ```

::: zone-end

::: zone pivot="sc-enterprise"

2. Use the following command to create your Azure Spring Apps instance:

   ```azurecli
   az spring create \
       --name ${AZURE_SPRING_APPS_INSTANCE} \
       --sku Enterprise
   ```

::: zone-end

## Create an app in your Azure Spring Apps instance

::: zone pivot="sc-consumption-plan"

The following sections show you how to create an app in either the standard consumption or dedicated workload profiles.

> [!IMPORTANT]
> The Consumption workload profile has a pay-as-you-go billing model, with no starting cost. You're billed for the dedicated workload profile based on the provisioned resources. For more information, see [Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps (preview)](../container-apps/workload-profiles-overview.md) and [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

### Create an app with the consumption workload profile

Use the following command to create an app in the Azure Spring Apps instance:

```azurecli
az spring app create \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --cpu 1 \
    --memory 2 \
    --min-replicas 2 \
    --max-replicas 2 \
    --runtime-version Java_17 \
    --assign-endpoint true
```

### Create an app with the dedicated workload profile

Dedicated workload profiles support running apps with customized hardware and increased cost predictability.

Use the following command to create a dedicated workload profile:

```azurecli
az containerapp env workload-profile set \
    --name ${AZURE_CONTAINER_APPS_ENVIRONMENT} \
    --workload-profile-name my-wlp \
    --workload-profile-type D4 \
    --min-nodes 1 \
    --max-nodes 2
```

Then, use the following command to create an app with the dedicated workload profile:

```azurecli
az spring app create \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --cpu 1 \
    --memory 2Gi \
    --min-replicas 2 \
    --max-replicas 2 \
    --runtime-version Java_17 \
    --assign-endpoint true \
    --workload-profile my-wlp
```

::: zone-end

::: zone pivot="sc-standard,sc-enterprise"

Create an app in the Azure Spring Apps instance by using the following command:

::: zone-end

::: zone pivot="sc-standard"

```azurecli
az spring app create \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --runtime-version Java_17 \
    --assign-endpoint true
```

::: zone-end

::: zone pivot="sc-enterprise"

```azurecli
az spring app create \
    --service ${AZURE_SPRING_APPS_INSTANCE} \
    --name ${APP_NAME} \
    --assign-endpoint true
```

::: zone-end

## Bind the Service Bus to Azure Spring Apps and deploy the app

You've now created both the Service Bus and the app in Azure Spring Apps, but the app can't connect to the Service Bus. Use the following steps to enable the app to connect to the Service Bus, and then deploy the app.

1. Get the Service Bus's connection string by using the following command:

   ```azurecli
   SERVICE_BUS_CONNECTION_STRING=$(az servicebus namespace authorization-rule keys list \
       --namespace-name ${SERVICE_BUS_NAME_SPACE} \
       --name RootManageSharedAccessKey \
       --query primaryConnectionString \
       --output tsv)
   ```

1. Use the following command to provide the connection string to the app through an environment variable.

   ```azurecli
   az spring app update \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name ${APP_NAME} \
       --env SERVICE_BUS_CONNECTION_STRING=${SERVICE_BUS_CONNECTION_STRING}
   ```

1. Now the cloud environment is ready. Deploy the app by using the following command.

   ```azurecli
   az spring app deploy \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name ${APP_NAME} \
       --artifact-path target/simple-event-driven-app-0.0.1-SNAPSHOT.jar
   ```

## Validate the event-driven app

Use the following steps to confirm that the event-driven app works correctly. You can validate the app by sending a message to the `lower-case` queue, then confirming that there's a message in the `upper-case` queue.

1. Send a message to `lower-case` queue with Service Bus Explorer. For more information, see the [Send a message to a queue or topic](../service-bus-messaging/explorer.md#send-a-message-to-a-queue-or-topic) section of [Use Service Bus Explorer to run data operations on Service Bus](../service-bus-messaging/explorer.md).

1. Confirm that there's a new message sent to the `upper-case` queue. For more information, see the [Peek a message](../service-bus-messaging/explorer.md#peek-a-message) section of [Use Service Bus Explorer to run data operations on Service Bus](../service-bus-messaging/explorer.md).

## Clean up resources

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternatively, to delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

::: zone pivot="sc-standard,sc-enterprise"

To learn how to use more Azure Spring capabilities, advance to the quickstart series that deploys a sample application to Azure Spring Apps:

> [!div class="nextstepaction"]
> [Introduction to the sample app](./quickstart-sample-app-introduction.md)

::: zone-end

::: zone pivot="sc-consumption-plan"

To learn how to set up autoscale for applications in Azure Spring Apps Standard consumption plan, advance to this next quickstart:

> [!div class="nextstepaction"]
> [Set up autoscale for applications in Azure Spring Apps Standard consumption and dedicated plan](./quickstart-apps-autoscale-standard-consumption.md)

::: zone-end

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
