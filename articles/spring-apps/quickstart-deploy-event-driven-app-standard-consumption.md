---
title: Quickstart - Deploy event-driven application to Azure Spring Apps with the Standard consumption plan
description: Learn how to deploy an event-driven application to Azure Spring Apps with the Standard consumption plan.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 03/21/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy an event-driven application to Azure Spring Apps with the Standard consumption plan

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

This article explains how to deploy a Spring Boot event-driven application to Azure Spring Apps with the Standard consumption plan.

The sample project is an event-driven application that subscribes to a [Service Bus queue](../service-bus-messaging/service-bus-queues-topics-subscriptions.md#queues) named `lower-case`, and then handles the message and sends another message to another queue named `upper-case`. To make the app simple, message processing just converts the message to uppercase. The following diagram depicts this process:

:::image type="content" source="media/quickstart-deploy-event-driven-app-standard-consumption/diagram.png" alt-text="Diagram of Spring event-driven app architecture." lightbox="media/quickstart-deploy-event-driven-app-standard-consumption/diagram.png" border="false":::

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Version 2.45.0 or greater.
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

1. Use the following commands to create variables for the names of your resources and for other settings as needed. Resource names in Azure must be unique.

   ```azurecli
   RESOURCE_GROUP=<event-driven-app-resource-group-name>
   LOCATION=<desired-region>
   SERVICE_BUS_NAME_SPACE=<event-driven-app-service-bus-namespace>
   AZURE_CONTAINER_APPS_ENVIRONMENT=<Azure-Container-Apps-environment-name>
   AZURE_SPRING_APPS_INSTANCE=<Azure-Spring-Apps-instance-name>
   APP_NAME=<event-driven-app-name>
   ```

1. Sign in to Azure by using the following command:

   ```azurecli
   az login
   ```

1. Set the default location by using the following command:

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Set your default subscription. First, list all available subscriptions:

   ```azurecli
   az account list --output table
   ```

1. Determine the ID of the subscription you want to set and use it with the following command to set your default subscription.

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

1. Create a resource group by using the following command:

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group.

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

## Create a Service Bus instance

Create a Service Bus instance by using the following steps.

1. Use the following command to create a Service Bus namespace.

   ```azurecli
   az servicebus namespace create --name ${SERVICE_BUS_NAME_SPACE}
   ```

1. Use the following commands to create two queues named `lower-case` and `upper-case`.

   ```azurecli
   az servicebus queue create \
       --namespace-name ${SERVICE_BUS_NAME_SPACE} \
       --name lower-case
   az servicebus queue create \
       --namespace-name ${SERVICE_BUS_NAME_SPACE} \
       --name upper-case
   ```

## Create an Azure Container Apps environment

The Azure Container Apps environment creates a secure boundary around a group of applications. Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

Use the following steps to create the environment:

1. Install the Azure Container Apps extension for the CLI by using the following command:

   ```azurecli
   az extension add --name containerapp --upgrade
   ```

1. Register the `Microsoft.App` namespace by using the following command:

   ```azurecli
   az provider register --namespace Microsoft.App
   ```

1. If you haven't previously used the Azure Monitor Log Analytics workspace, register the `Microsoft.OperationalInsights` provider by using the following command:

   ```azurecli
   az provider register --namespace Microsoft.OperationalInsights
   ```

1. Create the environment by using the following command:

   ```azurecli
   az containerapp env create --name ${AZURE_CONTAINER_APPS_ENVIRONMENT}
   ```

## Create the Azure Spring Apps instance

An Azure Spring Apps Standard consumption plan instance hosts the Spring event-driven app. Use the following steps to create the service instance and then create an app inside the instance.

1. Install the Azure CLI extension designed for Azure Spring Apps Standard consumption by using the following command:

   ```azurecli
   az extension remove --name spring && \
   az extension add --name spring
   ```

1. Register the `Microsoft.AppPlatform` provider for the Azure Spring Apps by using the following command:

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

1. Create an app in the Azure Spring Apps instance by using the following command:

   ```azurecli
   az spring app create \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name ${APP_NAME} \
       --cpu 1 \
       --memory 2 \
       --instance-count 2 \
       --runtime-version Java_17 \
       --assign-endpoint true
   ```

## Bind the Service Bus to Azure Spring Apps and deploy the app

Now both the Service Bus and the app in Azure Spring Apps have been created, but the app can't connect to the Service Bus. Use the following steps to enable the app to connect to the Service Bus, and then deploy the app.

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

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternately, to delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Set up autoscale for applications in Azure Spring Apps Standard consumption plan](./quickstart-apps-autoscale-standard-consumption.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
