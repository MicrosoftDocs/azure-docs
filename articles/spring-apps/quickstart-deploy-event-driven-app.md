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

::: zone pivot="sc-consumption-plan,sc-enterprise"

This article explains how to deploy a Spring Boot event-driven application to Azure Spring Apps.

The sample project is an event-driven application that subscribes to a [Service Bus queue](../service-bus-messaging/service-bus-queues-topics-subscriptions.md#queues) named `lower-case`, and then handles the message and sends another message to another queue named `upper-case`. To make the app simple, message processing just converts the message to uppercase. The following diagram depicts this process:

:::image type="content" source="media/quickstart-deploy-event-driven-app/diagram.png" alt-text="Diagram of Azure Spring Apps event-driven app architecture." lightbox="media/quickstart-deploy-event-driven-app/diagram.png" border="false":::

::: zone-end

::: zone pivot="sc-standard"

This article explains how to deploy a Spring Boot event-driven application to Azure Spring Apps. The sample project is an event-driven application, which utilizes the following Azure resources:

:::image type="content" source="media/quickstart-deploy-event-driven-app/diagram-v2.png" alt-text="Diagram of Spring event-driven app architecture." lightbox="media/quickstart-deploy-event-driven-app/diagram-v2.png" border="false":::

Diagram of Spring event-driven app architecture:
- Use Azure Spring Apps to host the Spring Boot app.
- Use Key Vault secret as property source for securing secrets.
- Subscribe to a [Service Bus queue](../service-bus-messaging/service-bus-queues-topics-subscriptions.md#queues) named `lower-case`, and then handles the message and sends another message to another queue named `upper-case`. To make the app simple, message processing just converts the message to uppercase.
- Use Azure Monitor for monitoring and logging.

::: zone-end

## 1 Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Apache Maven](https://maven.apache.org/download.cgi)

::: zone pivot="sc-consumption-plan"

- [Azure CLI](/cli/azure/install-azure-cli). Install the Azure CLI extension for Azure Spring Apps Standard consumption and dedicated plan by using the following command:

  ```azurecli-interactive
  az extension remove --name spring && \
  az extension add --name spring
  ```

- Use the following commands to install the Azure Container Apps extension for the Azure CLI and register these namespaces: `Microsoft.App`, `Microsoft.OperationalInsights`, and `Microsoft.AppPlatform`:

  ```azurecli-interactive
  az extension add --name containerapp --upgrade
  az provider register --namespace Microsoft.App
  az provider register --namespace Microsoft.OperationalInsights
  az provider register --namespace Microsoft.AppPlatform
  ```

::: zone-end

::: zone pivot="sc-standard,sc-enterprise"

- [Azure CLI](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --name spring`

::: zone-end

::: zone pivot="sc-enterprise"

- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [View Azure Spring Apps Enterprise tier offering in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [quickstart-tool-introduction](includes/quickstart-deploy-event-driven-app/quickstart-tool-introduction.md)]

::: zone-end

::: zone pivot="sc-consumption-plan"

[!INCLUDE [deploy-event-driven-app-with-standard-consumption-plan](includes/quickstart-deploy-event-driven-app/deploy-event-driven-app-with-standard-consumption-plan.md)]

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [deploy-event-driven-app-with-basic-standard-plan](includes/quickstart-deploy-event-driven-app/deploy-event-driven-app-with-basic-standard-plan.md)]

::: zone-end

::: zone pivot="sc-enterprise"

[!INCLUDE [deploy-event-driven-app-with-enterprise-plan](includes/quickstart-deploy-event-driven-app/deploy-event-driven-app-with-enterprise-plan.md)]

::: zone-end

## 5 Validation

Use the following steps to confirm that the event-driven app works correctly. You can validate the app by sending a message to the `lower-case` queue, then confirming that there's a message in the `upper-case` queue.

1. Send a message to `lower-case` queue with Service Bus Explorer. For more information, see the [Send a message to a queue or topic](../service-bus-messaging/explorer.md#send-a-message-to-a-queue-or-topic) section of [Use Service Bus Explorer to run data operations on Service Bus](../service-bus-messaging/explorer.md).

1. Confirm that there's a new message sent to the `upper-case` queue. For more information, see the [Peek a message](../service-bus-messaging/explorer.md#peek-a-message) section of [Use Service Bus Explorer to run data operations on Service Bus](../service-bus-messaging/explorer.md).

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-event-driven-app/clean-up-resources.md)]

## 7 Next steps

> [!div class="nextstepaction"]
> [Set up autoscale for applications in Azure Spring Apps Standard consumption plan](./quickstart-apps-autoscale-standard-consumption.md)

For more information, see the following articles:

- [Azure Developer CLI](/azure/developer/azure-developer-cli/overview)
- [Simple Todo Event Driven App](https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application).
- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
