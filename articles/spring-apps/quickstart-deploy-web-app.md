---
title: Quickstart - Deploy your first web application to Azure Spring Apps
description: Describes how to deploy a web application to Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 07/11/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23, references_regions
ms.author: xiada
zone_pivot_groups: spring-apps-plan-selection
---

# Quickstart: Deploy your first web application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

This quickstart shows how to deploy a Spring Boot web application to Azure Spring Apps. The sample project is a simple ToDo application to add tasks, mark when they're complete, and then delete them. The following screenshot shows the application:

:::image type="content" source="./media/quickstart-deploy-web-app/todo-app.png" alt-text="Screenshot of a sample web application in Azure Spring Apps." lightbox="./media/quickstart-deploy-web-app/todo-app.png":::

This application is a typical three-layers web application with the following layers:

- A frontend bounded [React](https://reactjs.org/) application.
- A backend Spring web application that uses Spring Data JPA to access a relational database.
- A relational database. For localhost, the application uses [H2 Database Engine](https://www.h2database.com/html/main.html). For Azure Spring Apps, the application uses Azure Database for PostgreSQL. For more information about Azure Database for PostgreSQL, see [Flexible Server documentation](../postgresql/flexible-server/overview.md).

The following diagram shows the architecture of the system:

:::image type="content" source="media/quickstart-deploy-web-app/diagram.png" alt-text="Diagram that shows the architecture of a Spring web application." border="false":::

::: zone pivot="sc-consumption-plan,sc-standard"

This article describes the following options for creating resources and deploying them to Azure Spring Apps:

- Azure portal: Use the Azure portal to create resources and deploy applications step by step. The Azure portal is suitable for developers who are using Azure cloud services for the first time.
- Azure Developer CLI: Use the Azure Developer CLI to create resources and deploy applications through simple commands, and to cover application code and infrastructure as code files needed to provision the Azure resources. The Azure Developer CLI is suitable for developers who are familiar with Azure cloud services.

::: zone-end

## 1. Prerequisites

::: zone pivot="sc-consumption-plan,sc-standard"

### [Azure portal](#tab/Azure-portal)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure Developer CLI (AZD)](/azure/developer/azure-developer-cli/install-azd), version 1.2.0 or higher.

---

::: zone-end

::: zone pivot="sc-enterprise"

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [deploy-to-azure-spring-apps-standard-plan](includes/quickstart-deploy-web-app/deploy-standard-plan.md)]

::: zone-end

::: zone pivot="sc-enterprise"

[!INCLUDE [deploy-to-azure-spring-apps-enterprise-plan](includes/quickstart-deploy-web-app/deploy-enterprise-plan.md)]

::: zone-end

::: zone pivot="sc-consumption-plan"

[!INCLUDE [deploy-to-azure-spring-apps-consumption-plan](includes/quickstart-deploy-web-app/deploy-consumption-plan.md)]

::: zone-end

## 5. Validate the web app

Now you can access the deployed app to see whether it works. Use the following steps to validate:

::: zone pivot="sc-enterprise"

1. After the deployment is complete, you can access the app with this URL: `https://${AZURE_SPRING_APPS_NAME}-${APP_NAME}.azuremicroservices.io/`. The page should appear as you saw in localhost.

1. To check the app's log to investigate any deployment issue, use the following command:

   ```azurecli
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME}
   ```

::: zone-end

::: zone pivot="sc-consumption-plan,sc-standard"

1. Access the application with the output application URL. The page should appear as you saw in localhost.

1. From the navigation menu of the Azure Spring Apps instance overview page, select **Logs** to check the app's logs.

   :::image type="content" source="media/quickstart-deploy-web-app/logs.png" alt-text="Screenshot of the Azure portal showing the Azure Spring Apps logs page." lightbox="media/quickstart-deploy-web-app/logs.png":::

::: zone-end

## 6. Clean up resources

::: zone pivot="sc-standard, sc-consumption-plan"

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-web-app/clean-up-resources.md)]

::: zone-end

::: zone pivot="sc-enterprise"

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, delete them by deleting the resource group. To delete the resource group, use the following command:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

::: zone-end

## 7. Next steps

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with Azure DevOps](./how-to-cicd.md)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](./how-to-use-managed-identities.md)

> [!div class="nextstepaction"]
> [Create a service connection in Azure Spring Apps with the Azure CLI](../service-connector/quickstart-cli-spring-cloud-connection.md)

::: zone pivot="sc-standard, sc-consumption-plan"

> [!div class="nextstepaction"]
> [Run the Pet Clinic microservice on Azure Spring Apps](./quickstart-sample-app-introduction.md)

::: zone-end

::: zone pivot="sc-enterprise"

> [!div class="nextstepaction"]
> [Run the polyglot ACME fitness store apps on Azure Spring Apps](./quickstart-sample-app-acme-fitness-store-introduction.md)

::: zone-end

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
