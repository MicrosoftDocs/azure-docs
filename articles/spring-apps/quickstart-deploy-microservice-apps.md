---
title: Quickstart - Deploy microservice applications to Azure Spring Apps
description: Learn how to deploy microservice applications to Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 06/21/2023
ms.author: v-shilichen
ms.custom: devx-track-java, devx-track-extended-java, mode-other, event-tier1-build-2022, engagement-fy23
zone_pivot_groups: spring-apps-tier-selection
---

# Quickstart: Deploy microservice applications to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This article explains how to deploy microservice applications to Azure Spring Apps using the well-known sample app [PetClinic](https://github.com/spring-petclinic/spring-petclinic-microservices). The Pet Clinic sample demonstrates the microservice architecture pattern. The following diagram shows the architecture of the PetClinic application on Azure Spring Apps.

:::image type="content" source="media/quickstart-deploy-microservice-apps/petclinic-architecture.png" alt-text="Diagram showing the architecture of the PetClinic sample on Azure Spring Apps." lightbox="media/quickstart-deploy-microservice-apps/petclinic-architecture.png" border="false":::

The diagram shows the following architectural flows and relationships of the Pet Clinic sample:

- Uses Azure Spring Apps to manage the Spring Boot apps. Each app uses HSQLDB as the persistent store.
- Uses the managed components Spring Cloud Config Server and Eureka Service Discovery on Azure Spring Apps. The Config Server reads Git repository configuration.
- Exposes the URL of API Gateway to load balance requests to service apps, and exposes the URL of the Admin Server to manage the applications.
- Analyzes logs using the Log Analytics workspace.
- Monitors performance with Application Insights.

> [!NOTE]
> This article uses a simplified version of PetClinic, using an in-memory database that is not production-ready to quickly deploy to Azure Spring Apps.
> 
> The deployed app `admin-server` exposes public access, which is a risk point. The production environment needs to secure the Spring Boot Admin application.

::: zone pivot="sc-standard"

This article provides the following options for deploying to Azure Spring Apps:

- The **Azure portal and Maven plugin** option provides a more conventional way to create resources and deploy applications step by step. This option is suitable for Spring developers using Azure cloud services for the first time.
- The **Azure Developer CLI** option is a more efficient way to automatically create resources and deploy applications through simple commands. The Azure Developer CLI uses a template to provision the Azure resources needed and to deploy the application code. This option is suitable for Spring developers who are familiar with Azure cloud services.

::: zone-end

## 1. Prerequisites

::: zone pivot="sc-standard"

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure Developer CLI](https://aka.ms/azd-install), version 1.2.0 or higher.

---

::: zone-end

::: zone pivot="sc-enterprise"

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- (Optional) [Git](https://git-scm.com/downloads).
- (Optional) [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [deploy-microservice-apps-with-basic-standard-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-basic-standard-plan.md)]

::: zone-end

::: zone pivot="sc-enterprise"

[!INCLUDE [deploy-microservice-apps-with-enterprise-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-enterprise-plan.md)]

::: zone-end

## 5. Validate the apps

The following sections describe how to validate the deployment.

### 5.1. Access the applications

Using the URL information in the deployment log output, open the URL exposed by the app named `api-gateway` - for example, `https://<your-Azure-Spring-Apps-instance-name>-api-gateway.azuremicroservices.io`. The application should look similar to the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/application.png" alt-text="Screenshot of the PetClinic application running on Azure Spring Apps." lightbox="media/quickstart-deploy-microservice-apps/application.png":::

### 5.2. Query the application logs

After you browse each function of the Pet Clinic, the Log Analytics workspace collects logs of each application. You can check the logs by using custom queries, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query.png" alt-text="Screenshot of the Azure portal showing the Logs page of the query on PetClinic application and the results." lightbox="media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query.png":::

### 5.3. Monitor the applications

Application Insights monitors the application dependencies, as shown by the following application tracing map:

:::image type="content" source="media/quickstart-deploy-microservice-apps/application-insights-map.png" alt-text="Screenshot of the Azure portal showing the Application map page for an Application Insights." lightbox="media/quickstart-deploy-microservice-apps/application-insights-map.png":::

Open the URL exposed by the app `admin-server` to manage the applications through the Spring Boot Admin Server, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/admin-server.png" alt-text="Screenshot of the Admin Server for the PetClinic application listing the current application instances." lightbox="media/quickstart-deploy-microservice-apps/admin-server.png":::

## 6. Clean up resources

::: zone pivot="sc-standard"

[!INCLUDE [clean-up-resources](includes/quickstart-deploy-microservice-apps/clean-up-resources.md)]

::: zone-end

::: zone pivot="sc-enterprise"

Be sure to delete the resources you created in this article when you no longer need them. You can delete the Azure resource group, which includes all the resources in the resource group.

Use the following steps to delete the entire resource group, including the newly created service instance:

1. Locate your resource group in the Azure portal. On the navigation menu, select **Resource groups**, and then select the name of your resource group.

1. On the **Resource group** page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion, then select **Delete**.

::: zone-end

## 7. Next steps

> [!div class="nextstepaction"]
> [Quickstart: Integrate Azure Spring Apps with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md)

> [!div class="nextstepaction"]
> [Use Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Automate application deployments to Azure Spring Apps](./how-to-cicd.md)

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](./how-to-use-managed-identities.md)

> [!div class="nextstepaction"]
> [Quickstart: Set up a Log Analytics workspace](./quickstart-setup-log-analytics.md)

> [!div class="nextstepaction"]
> [Quickstart: Monitoring Azure Spring Apps apps with logs, metrics, and tracing](./quickstart-logs-metrics-tracing.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./how-to-custom-domain.md)

> [!div class="nextstepaction"]
> [Quickstart: Introduction to the sample app](./quickstart-sample-app-introduction.md)

> [!div class="nextstepaction"]
> [Introduction to the Fitness Store sample app](./quickstart-sample-app-acme-fitness-store-introduction.md)

For more information, see the following articles:

- [Azure Pet Clinic microservices](https://github.com/Azure-Samples/spring-petclinic-microservices)
- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples)
- [Azure for Spring developers](/azure/developer/java/spring/)
- [Spring Cloud Azure documentation](/azure/developer/java/spring-framework/)
