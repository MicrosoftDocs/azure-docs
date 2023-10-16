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

This quickstart shows how to deploy a Spring Boot web application to Azure Spring Apps. The sample project is a simple ToDo application to add tasks, mark when they're complete, and then delete them. The following screenshot shows the application:

:::image type="content" source="./media/quickstart-deploy-web-app/todo-app.png" alt-text="Screenshot of a sample web application in Azure Spring Apps." lightbox="./media/quickstart-deploy-web-app/todo-app.png":::

This application is a typical three-layers web application with the following layers:

- A frontend bounded [React](https://reactjs.org/) application.
- A backend Spring web application that uses Spring Data JPA to access a relational database.
- A relational database. For localhost, the application uses [H2 Database Engine](https://www.h2database.com/html/main.html). For Azure Spring Apps, the application uses Azure Database for PostgreSQL. For more information about Azure Database for PostgreSQL, see [Flexible Server documentation](../postgresql/flexible-server/overview.md).

The following diagram shows the architecture of the system:

:::image type="content" source="media/quickstart-deploy-web-app/diagram.png" alt-text="Diagram that shows the architecture of a Spring web application." border="false":::

::: zone pivot="sc-consumption-plan,sc-standard"

This article provides the following options for deploying to Azure Spring Apps:

- The **Azure portal** option is the easiest and the fastest way to create resources and deploy applications with a single click. This option is suitable for Spring developers who want to quickly deploy applications to Azure cloud services.
- The **Azure portal + Maven plugin** option provides a more conventional way to create resources and deploy applications step by step. This option is suitable for Spring developers using Azure cloud services for the first time.
- The **Azure Developer CLI** option is a more efficient way to automatically create resources and deploy applications through simple commands. The Azure Developer CLI uses a template to provision the Azure resources needed and to deploy the application code. This option is suitable for Spring developers who are familiar with Azure cloud services.

::: zone-end

::: zone pivot="sc-enterprise"

This article provides the following options for deploying to Azure Spring Apps:

- The Azure portal is the easiest and fastest way to create resources and deploy applications with a single click. This option is suitable for Spring developers who want to quickly deploy applications to Azure cloud services.
- The Azure CLI is a powerful command line tool to manage Azure resources. This option is suitable for Spring developers who are familiar with Azure cloud services.

::: zone-end

## 1. Prerequisites

::: zone pivot="sc-consumption-plan,sc-standard"

### [Azure portal](#tab/Azure-portal)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

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

### [Azure portal](#tab/Azure-portal-ent)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### [Azure CLI](#tab/Azure-CLI)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

---

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

### [Azure portal](#tab/Azure-portal-ent)

1. After the deployment finishes, you can find the application URL from the deployment outputs:

   :::image type="content" source="media/quickstart-deploy-web-app/web-app-url-standard.png" alt-text="Diagram that shows the enterprise app URL of the ARM deployment outputs." border="false" lightbox="media/quickstart-deploy-web-app/web-app-url-standard.png":::

1. Access the application with the output application URL. The page should appear as you saw in localhost.

1. Check the details for each resource deployment, which are useful for investigating any deployment issues.

### [Azure CLI](#tab/Azure-CLI)

1. After the deployment finishes, you can access the app with this URL: `https://${AZURE_SPRING_APPS_NAME}-${APP_NAME}.azuremicroservices.io/`. The page should appear as you saw in localhost.

1. To check the app's log to investigate any deployment issue, use the following command:

   ```azurecli
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${APP_NAME}
   ```

---

::: zone-end

::: zone pivot="sc-consumption-plan"

### [Azure portal](#tab/Azure-portal)

1. After the deployment finishes, you can find the application URL from the deployment outputs:

   :::image type="content" source="media/quickstart-deploy-web-app/web-app-url-consumption.png" alt-text="Diagram that shows the consumption app URL of the ARM deployment outputs." border="false" lightbox="media/quickstart-deploy-web-app/web-app-url-consumption.png":::

1. Access the application URL. The page should appear as you saw in localhost.

1. Check the details for each resource deployment, which are useful for investigating any deployment issues.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

Access the application with the output application URL. The page should appear as you saw in localhost.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Access the application with the output endpoint. The page should appear as you saw in localhost.

---

::: zone-end

::: zone pivot="sc-standard"

### [Azure portal](#tab/Azure-portal)

1. After the deployment finishes, find the application URL from the deployment outputs:

   :::image type="content" source="media/quickstart-deploy-web-app/web-app-url-standard.png" alt-text="Diagram that shows the standard app URL of the ARM deployment outputs." border="false" lightbox="media/quickstart-deploy-web-app/web-app-url-standard.png":::

1. Access the application URL. The page should appear as you saw in localhost.

1. Check the details for each resource deployment, which are useful for investigating any deployment issues.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

Access the application with the output application URL. The page should appear as you saw in localhost.

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

Access the application with the output endpoint. The page should appear as you saw in localhost.

---

::: zone-end

## 6. Clean up resources

You can delete the Azure resource group, which includes all the resources in the resource group.

::: zone pivot="sc-standard, sc-consumption-plan"

[!INCLUDE [clean-up-resources-portal-or-azd](includes/quickstart-deploy-web-app/clean-up-resources.md)]

::: zone-end

::: zone pivot="sc-enterprise"

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [clean-up-resources-via-resource-group](includes/quickstart-deploy-web-app/clean-up-resources-via-resource-group.md)]

### [Azure CLI](#tab/Azure-CLI)

Use the following command to delete the entire resource group, including the newly created service:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

---

::: zone-end

## 7. Next steps

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Automate application deployments to Azure Spring Apps](./how-to-cicd.md)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](./how-to-use-managed-identities.md)

> [!div class="nextstepaction"]
> [Quickstart: Create a service connection in Azure Spring Apps with the Azure CLI](../service-connector/quickstart-cli-spring-cloud-connection.md)

::: zone pivot="sc-standard, sc-consumption-plan"

> [!div class="nextstepaction"]
> [Introduction to the sample app](./quickstart-sample-app-introduction.md)

::: zone-end

::: zone pivot="sc-enterprise"

> [!div class="nextstepaction"]
> [Introduction to the Fitness Store sample app](./quickstart-sample-app-acme-fitness-store-introduction.md)

::: zone-end

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Azure for Spring developers](/azure/developer/java/spring/)
- [Spring Cloud Azure documentation](/azure/developer/java/spring-framework/)
