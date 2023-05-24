---
title: Quickstart - Deploy your first web application to Azure Spring Apps
description: Describes how to deploy a web application to Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 06/21/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
ms.author: xiada
zone_pivot_groups: spring-apps-plan-selection
---

# Quickstart: Deploy your first web application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This quickstart shows how to deploy a Spring Boot web application to Azure Spring Apps. The sample project is a simple ToDo application to add tasks, mark when they're complete, and then delete them. The following screenshot shows the application:

:::image type="content" source="./media/quickstart-deploy-web-app/todo-app.png" alt-text="Screenshot of a sample web application in Azure Spring Apps." lightbox="./media/quickstart-deploy-web-app/todo-app.png":::

This application is a typical three-layers web application with the following layers:

- A frontend bounded [React](https://reactjs.org/) application.
- A backend Spring web application that uses Spring Data JPA to access a relational database.
- A relational database. For localhost, the application uses [H2 Database Engine](https://www.h2database.com/html/main.html). For Azure Spring Apps, the application uses Azure Database for PostgreSQL. For more information about Azure Database for PostgreSQL, see [Flexible Server documentation](../postgresql/flexible-server/overview.md).

The following diagram shows the architecture of the system:

:::image type="content" source="media/quickstart-deploy-web-app/diagram.png" alt-text="Image that shows the architecture of a Spring web application.":::

::: zone pivot="sc-standard"

This article provides 2 options for deploying to Azure Spring Apps:

- Azure portal - This is a more conventional way to create resources and deploy applications step by step. It's suitable for Spring developers who are using Azure cloud services for the first time.
- Azure Developer CLI: This is a more efficient way to automatically create resources and deploy applications through simple commands, and it covers application code, infrastructure as code files needed to provision the Azure resources. It's suitable for Spring developers who are familiar with Azure cloud services.

::: zone-end

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

::: zone pivot="sc-enterprise"

- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [View Azure Spring Apps Enterprise tier offering in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [deploy-to-azure-spring-apps-standard-plan](includes/quickstart-deploy-web-app/deploy-standard-plan.md)]

::: zone-end

::: zone pivot="sc-enterprise"

[!INCLUDE [deploy-to-azure-spring-apps-enterprise-plan](includes/quickstart-deploy-web-app/deploy-enterprise-plan.md)]

::: zone-end

::: zone pivot="sc-consumption-plan"

[!INCLUDE [deploy-to-azure-spring-apps-conusumption-plan](includes/quickstart-deploy-web-app/deploy-conusumption-plan.md)]

::: zone-end

## Validate the web app

## Clean up resources

::: zone pivot="sc-standard"

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-web-app/clean-up-resources.md)]

::: zone-end

::: zone pivot="sc-enterprise, sc-consumption-plan"

[!INCLUDE [clean-up-resources-portal](includes/quickstart-deploy-web-app/clean-up-resources-portal.md)]

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Create a service connection in Azure Spring Apps with the Azure CLI](../service-connector/quickstart-cli-spring-cloud-connection.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
