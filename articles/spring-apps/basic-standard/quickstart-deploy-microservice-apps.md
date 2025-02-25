---
title: Quickstart - Deploy Microservice Applications to Azure Spring Apps
description: Learn how to deploy microservice applications to Azure Spring Apps.
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: quickstart
ms.date: 01/19/2024
ms.author: v-shilichen
ms.custom: devx-track-java, devx-track-extended-java, mode-other, engagement-fy23, devx-track-extended-azdevcli, devx-track-azurecli
zone_pivot_groups: spring-apps-tier-selection
---

# Quickstart: Deploy microservice applications to Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

This article explains how to deploy microservice applications to Azure Spring Apps using the well-known sample app [PetClinic](https://github.com/spring-petclinic/spring-petclinic-microservices).

::: zone pivot="sc-enterprise"

The Pet Clinic sample demonstrates the microservice architecture pattern. The following diagram shows the architecture of the PetClinic application on the Azure Spring Apps Enterprise plan.

:::image type="content" source="media/quickstart-deploy-microservice-apps/petclinic-enterprise-architecture.png" alt-text="Diagram that shows the architecture of the PetClinic sample on the Azure Spring Apps Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/petclinic-enterprise-architecture.png" border="false":::

The diagram shows the following architectural flows and relationships of the Pet Clinic sample:

- Uses Azure Spring Apps to manage the frontend and backend apps. The backend apps are built with Spring Boot and each app uses HSQLDB as the persistent store. The reforged frontend app builds upon Pet Clinic API Gateway App with Node.js serving as a standalone frontend web application.
- Uses the managed components on Azure Spring Apps, including Service Registry, Application Configuration Service, Spring Cloud Gateway, and Application Live View. The Application Configuration Service reads the Git repository configuration.
- Exposes the URL of Spring Cloud Gateway to route request to backend service apps, and exposes the URL of the Application Live View to monitor the backend apps.
- Analyzes logs using the Log Analytics workspace.
- Monitors performance with Application Insights.

> [!NOTE]
> This article uses a simplified version of PetClinic, using an in-memory database that isn't production-ready to quickly deploy to Azure Spring Apps.
>
> The Tanzu Developer Tools exposes public access for Application Live View, which is a risk point. The production environment needs to secure the access. For more information, see the [Configure Dev Tools Portal](../enterprise/how-to-use-dev-tool-portal.md#configure-dev-tools-portal) section of [Configure Tanzu Dev Tools in the Azure Spring Apps Enterprise plan](../enterprise/how-to-use-dev-tool-portal.md).

::: zone-end

::: zone pivot="sc-standard"

The Pet Clinic sample demonstrates the microservice architecture pattern. The following diagram shows the architecture of the PetClinic application on the Azure Spring Apps Standard plan.

:::image type="content" source="media/quickstart-deploy-microservice-apps/petclinic-standard-architecture.png" alt-text="Diagram that shows the architecture of the PetClinic sample on the Azure Spring Apps standard plan." lightbox="media/quickstart-deploy-microservice-apps/petclinic-standard-architecture.png" border="false":::

The diagram shows the following architectural flows and relationships of the Pet Clinic sample:

- Uses Azure Spring Apps to manage the Spring Boot apps. Each app uses HSQLDB as the persistent store.
- Uses the managed components Spring Cloud Config Server and Eureka Service Registry on Azure Spring Apps. The Config Server reads the Git repository configuration.
- Exposes the URL of API Gateway to load balance requests to service apps, and exposes the URL of the Admin Server to manage the applications.
- Analyzes logs using the Log Analytics workspace.
- Monitors performance with Application Insights.

> [!NOTE]
> This article uses a simplified version of PetClinic, using an in-memory database that isn't production-ready to quickly deploy to Azure Spring Apps.
>
> The deployed app `admin-server` exposes public access, which is a risk point. The production environment needs to secure the Spring Boot Admin application.

::: zone-end

This article provides the following options for deploying to Azure Spring Apps:

::: zone pivot="sc-enterprise"

- The **Azure portal** option is the easiest and the fastest way to create resources and deploy applications with a single click. This option is suitable for Spring developers who want to quickly deploy applications to Azure cloud services.
- The **Azure portal + Maven plugin** option is a more conventional way to create resources and deploy applications step by step. This option is suitable for Spring developers using Azure cloud services for the first time.
- The **Azure CLI** option uses a powerful command line tool to manage Azure resources. This option is suitable for Spring developers who are familiar with Azure cloud services.

::: zone-end

::: zone pivot="sc-standard"

- The **Azure portal + Maven plugin** option is a more conventional way to create resources and deploy applications step by step. This option is suitable for Spring developers using Azure cloud services for the first time.
- The **Azure Developer CLI** option is a more efficient way to automatically create resources and deploy applications through simple commands. The Azure Developer CLI uses a template to provision the Azure resources needed and to deploy the application code. This option is suitable for Spring developers who are familiar with Azure cloud services.

::: zone-end

## 1. Prerequisites

::: zone pivot="sc-standard"

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin)

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
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

### [Azure portal](#tab/Azure-portal-ent)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](../enterprise/how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](../enterprise/how-to-enterprise-marketplace-offer.md).
- (Optional) [Git](https://git-scm.com/downloads).
- (Optional) [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](../enterprise/how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](../enterprise/how-to-enterprise-marketplace-offer.md).
- [Git](https://git-scm.com/downloads).
- (Optional) [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- (Optional) [Node.js](https://nodejs.org/en/download), version 16.20 or higher.
- [Azure CLI](/cli/azure/install-azure-cli), version 2.45.0 or higher.

### [Azure CLI](#tab/Azure-CLI-ent)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](../enterprise/how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](../enterprise/how-to-enterprise-marketplace-offer.md).
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure CLI](/cli/azure/install-azure-cli), version 2.55.0 or higher.

---

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [deploy-microservice-apps-with-basic-standard-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-basic-standard-plan.md)]

::: zone-end

::: zone pivot="sc-enterprise"

[!INCLUDE [deploy-microservice-apps-with-enterprise-plan](includes/quickstart-deploy-microservice-apps/deploy-microservice-apps-with-enterprise-plan.md)]

::: zone-end

## 5. Validate the apps

The following sections describe how to validate the deployment.

::: zone pivot="sc-enterprise"

### [Azure portal](#tab/Azure-portal-ent)

### 5.1. Access the applications

After the deployment finishes, you can find the Spring Cloud Gateway URL from the deployment outputs, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/deployment-output-enterprise-plan.png" alt-text="Screenshot of the Azure portal that shows the Deployment Outputs page." lightbox="media/quickstart-deploy-microservice-apps/deployment-output-enterprise-plan.png":::

Open the gateway URL. The application should look similar to the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/application-enterprise.png" alt-text="Screenshot of the PetClinic application running on Azure Spring Apps Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/application-enterprise.png":::

### 5.2. Query the application logs

After you browse each function of the Pet Clinic, the Log Analytics workspace collects logs of each application. You can check the logs by using custom queries, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query-enterprise.png" alt-text="Screenshot of the Azure portal that shows the Logs page of the query on PetClinic application and the results for the Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query-enterprise.png":::

### 5.3. Monitor the applications

Application Insights monitors the application dependencies, as shown by the following application tracing map:

:::image type="content" source="media/quickstart-deploy-microservice-apps/enterprise-application-insights-map.png" alt-text="Screenshot of the Azure portal that shows the Application map page for Azure Spring Apps Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/enterprise-application-insights-map.png":::

You can find the Application Live View URL from the deployment outputs. Open the Application Live View URL to monitor application runtimes, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/application-live-view.png" alt-text="Screenshot of the Application Live View for the PetClinic application." lightbox="media/quickstart-deploy-microservice-apps/application-live-view.png":::

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

### 5.1. Access the applications

Use the endpoint assigned from Spring Cloud Gateway - for example, `https://<your-Azure-Spring-Apps-instance-name>-gateway-xxxxx.svc.azuremicroservices.io`. The application should look similar to the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/application-enterprise.png" alt-text="Screenshot of the PetClinic application running on the Azure Spring Apps Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/application-enterprise.png":::

### 5.2. Query the application logs

After you browse each function of the Pet Clinic, the Log Analytics workspace collects logs of each application. You can check the logs by using custom queries, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query-enterprise.png" alt-text="Screenshot of the Azure portal that shows the Logs page of the query on PetClinic application and the results for the Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query-enterprise.png":::

### 5.3. Monitor the applications

Application Insights monitors the application dependencies, as shown by the following application tracing map:

:::image type="content" source="media/quickstart-deploy-microservice-apps/enterprise-application-insights-map.png" alt-text="Screenshot of the Azure portal that shows the Application map page for the Azure Spring Apps Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/enterprise-application-insights-map.png":::

Open the Application Live View URL exposed by the Developer Tools to monitor application runtimes, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/application-live-view.png" alt-text="Screenshot of the Application Live View for the PetClinic application." lightbox="media/quickstart-deploy-microservice-apps/application-live-view.png":::

### [Azure CLI](#tab/Azure-CLI-ent)

### 5.1. Access the applications

Use the following commands to retrieve the URL for Spring Cloud Gateway:

```azurecli
export GATEWAY_URL=$(az spring gateway show \
    --service ${SPRING_APPS} \
    --query properties.url \
    --output tsv)
echo "https://${GATEWAY_URL}"
```

The application should look similar to the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/application-enterprise.png" alt-text="Screenshot of the PetClinic application running on Azure Spring Apps Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/application-enterprise.png":::

### 5.2. Query the application logs

After you browse each function of the Pet Clinic, the Log Analytics workspace collects logs of each application. You can check the logs by using custom queries, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query-enterprise.png" alt-text="Screenshot of the Azure portal that shows the Logs page of the query on PetClinic application and the results for the Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query-enterprise.png":::

### 5.3. Monitor the applications

Application Insights monitors the application dependencies, as shown by the following application tracing map:

:::image type="content" source="media/quickstart-deploy-microservice-apps/enterprise-application-insights-map.png" alt-text="Screenshot of the Azure portal that shows the Application map page for Azure Spring Apps Enterprise plan." lightbox="media/quickstart-deploy-microservice-apps/enterprise-application-insights-map.png":::

Use the following commands to retrieve the URL for Application Live View:

```azurecli
export DEV_TOOL_URL=$(az spring dev-tool show \
    --service ${SPRING_APPS} \
    --query properties.url \
    --output tsv)
echo "https://${DEV_TOOL_URL}/app-live-view"
```

Open the Application Live View URL to monitor application runtimes, as shown in the following screenshot:

:::image type="content" source="media/quickstart-deploy-microservice-apps/application-live-view.png" alt-text="Screenshot of the Application Live View for the PetClinic application." lightbox="media/quickstart-deploy-microservice-apps/application-live-view.png":::

---

::: zone-end

::: zone pivot="sc-standard"

[!INCLUDE [validate-the-apps](includes/quickstart-deploy-microservice-apps/validate-the-apps.md)]

::: zone-end

## 6. Clean up resources

::: zone pivot="sc-standard"

[!INCLUDE [clean-up-resources](includes/quickstart-deploy-microservice-apps/clean-up-resources.md)]

::: zone-end

::: zone pivot="sc-enterprise"

Be sure to delete the resources you created in this article when you no longer need them. You can delete the Azure resource group, which includes all the resources in the resource group.

### [Azure portal](#tab/Azure-portal-ent)

Use the following steps to delete the entire resource group:

1. Locate your resource group in the Azure portal. On the navigation menu, select **Resource groups**, and then select the name of your resource group.

1. On the **Resource group** page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion, then select **Delete**.

### [Azure portal + Maven plugin](#tab/Azure-portal-maven-plugin-ent)

Use the following steps to delete the entire resource group:

1. Locate your resource group in the Azure portal. On the navigation menu, select **Resource groups**, and then select the name of your resource group.

1. On the **Resource group** page, select **Delete**. Enter the name of your resource group in the text box to confirm deletion, then select **Delete**.

### [Azure CLI](#tab/Azure-CLI-ent)

Use the following command to delete the resource group:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

---

::: zone-end

## 7. Next steps

> [!div class="nextstepaction"]
> [Quickstart: Integrate Azure Spring Apps with Azure Database for MySQL](quickstart-integrate-azure-database-mysql.md)

> [!div class="nextstepaction"]
> [Use Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Automate application deployments to Azure Spring Apps](./how-to-cicd.md)

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](./how-to-use-managed-identities.md)

> [!div class="nextstepaction"]
> [Quickstart: Set up a Log Analytics workspace](quickstart-setup-log-analytics.md)

> [!div class="nextstepaction"]
> [Quickstart: Monitoring Azure Spring Apps apps with logs, metrics, and tracing](quickstart-logs-metrics-tracing.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./how-to-custom-domain.md)

> [!div class="nextstepaction"]
> [Quickstart: Introduction to the sample app](./quickstart-sample-app-introduction.md)

> [!div class="nextstepaction"]
> [Introduction to the Fitness Store sample app](../enterprise/quickstart-sample-app-acme-fitness-store-introduction.md)

For more information, see the following articles:

- [Azure Pet Clinic microservices](https://github.com/Azure-Samples/spring-petclinic-microservices)
- [Azure Spring Apps Samples](https://github.com/Azure-Samples/azure-spring-apps-samples)
- [Azure for Spring developers](/azure/developer/java/spring/)
- [Spring Cloud Azure documentation](/azure/developer/java/spring-framework/)
