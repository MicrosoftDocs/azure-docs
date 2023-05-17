---
title: Quickstart - Deploy microservice applications to Azure Spring Apps
description: Learn how to deploy microservice applications to Azure Spring Apps
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 03/21/2023
ms.author: rujche
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy microservice applications to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Standard consumption (Preview) ✔️ Basic/Standard ❌ Enterprise

This article explains how to deploy microservice applications to Azure Spring Apps using the well-known sample app [PetClinic](https://github.com/spring-petclinic/spring-petclinic-microservices). The **Pet Clinic** sample demonstrates the microservice architecture pattern. The following diagram shows the architecture of the PetClinic application.

![Architecture of PetClinic](media/quickstart-deploy-microservice-apps/microservices-architecture-diagram.jpg)

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

[!INCLUDE [quickstart-two-options](includes/quickstart-two-options.md)]

[!INCLUDE [deploy-microservice-apps-with-basic-standard-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-basic-standard-plan.md)]

## Validate the microservice applications

According to the content echoed by the deployment, open the URL exposed by the app `api-gateway`, for example, `https://<your-Azure-Spring-Apps-instance-name>-api-gateway.azuremicroservices.io`.

:::image type="content" source="media/quickstart-deploy-microservice-apps/application-screenshot.png" alt-text="Screenshot of PetClinic application running on Azure Spring Apps" lightbox="media/quickstart-deploy-microservice-apps/application-screenshot.png":::

[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Set up Log Analytics](./quickstart-setup-log-analytics.md)

> [!div class="nextstepaction"]
> [Quickstart: Use logs, metrics and tracing](./quickstart-logs-metrics-tracing.md)

> [!div class="nextstepaction"]
> [Quickstart: Integrate with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md)

For more information, see the following articles:

- [Simple Todo Event Driven App](https://github.com/Azure-Samples/ASA-Samples-Event-Driven-Application)
- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples)
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
