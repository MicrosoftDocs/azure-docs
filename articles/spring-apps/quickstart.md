---
title: Quickstart - Deploy your first application to Azure Spring Apps
description: Describes how to deploy an application to Azure Spring Apps.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 03/21/2022
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
zone_pivot_groups: spring-apps-plan-selection
---

# Quickstart: Deploy your first application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This article explains how to deploy a small application to run on Azure Spring Apps.

The application code used in this tutorial is a simple app. When you've completed this example, the application is accessible online, and you can manage it through the Azure portal.

::: zone pivot="sc-standard"

[!INCLUDE [quickstart-tool-introduction](includes/quickstart/quickstart-tool-introduction.md)]

::: zone-end

## 1. Prerequisites

::: zone pivot="sc-consumption-plan"

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.

::: zone-end

::: zone pivot="sc-standard"

Select an option to set prerequisites:

### [Azure portal](#tab/Azure-portal)

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure Developer CLI(AZD)](https://aka.ms/azd-install), version 1.0.1 or higher.

---

::: zone-end

::: zone pivot="sc-enterprise"

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [View Azure Spring Apps Enterprise tier offering in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.

::: zone-end

::: zone pivot="sc-consumption-plan"

[!INCLUDE [deploy-app-with-standard-consumption-plan](includes/quickstart/deploy-app-with-standard-consumption-plan.md)]

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [deploy-app-with-basic-standard-plan](includes/quickstart/deploy-app-with-basic-standard-plan.md)]

::: zone-end

::: zone pivot="sc-enterprise"

[!INCLUDE [deploy-app-with-enterprise-plan](includes/quickstart/deploy-app-with-enterprise-plan.md)]

::: zone-end

## 5. Validate the app

After deployment, you can access the app at `https://<your-Azure-Spring-Apps-instance-name>-demo.azuremicroservices.io`, then you will get the response `Hello World`.

::: zone pivot="sc-consumption-plan,sc-enterprise"

Use the following command to check the app's log to investigate any deployment issue:

```azurecli
az spring app logs \
    --service ${SERVICE_NAME} \
    --name ${APP_NAME}
```

::: zone-end

::: zone pivot="sc-standard"

From the navigation pane of the Azure Spring Apps instance overview page, select **Logs** to check the app's logs:

:::image type="content" source="media/quickstart/13-asa-logs.png" alt-text="Azure Spring Apps logs.":::

::: zone-end

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart/clean-up-resources.md)]

## 7. Next steps

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](./how-to-use-managed-identities.md)

> [!div class="nextstepaction"]
> [Create a service connection in Azure Spring Apps with the Azure CLI](../service-connector/quickstart-cli-spring-cloud-connection.md)

::: zone pivot="sc-standard, sc-consumption-plan"

> [!div class="nextstepaction"]
> [Run microservice apps(Pet Clinic)](./quickstart-sample-app-introduction.md)

::: zone-end

::: zone pivot="sc-enterprise"

> [!div class="nextstepaction"]
> [Run polyglot apps on Enterprise plan(ACME Fitness Store)](./quickstart-sample-app-acme-fitness-store-introduction.md)

::: zone-end

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
