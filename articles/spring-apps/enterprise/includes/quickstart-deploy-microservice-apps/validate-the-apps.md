---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 01/10/2024
---

<!--
For clarity of structure, a separate markdown file is used to describe how to validate the apps without managed gateway component.

[!INCLUDE [validate-the-apps](includes/quickstart-deploy-microservice-apps/validate-the-apps.md)]

-->

### 5.1. Access the applications

Using the URL information in the deployment log output, open the URL exposed by the app named `api-gateway` - for example, `https://<your-Azure-Spring-Apps-instance-name>-api-gateway.azuremicroservices.io`. The application should look similar to the following screenshot:

:::image type="content" source="../../media/quickstart-deploy-microservice-apps/application.png" alt-text="Screenshot of the PetClinic application running on Azure Spring Apps." lightbox="../../media/quickstart-deploy-microservice-apps/application.png":::

### 5.2. Query the application logs

After you browse each function of the Pet Clinic, the Log Analytics workspace collects logs of each application. You can check the logs by using custom queries, as shown in the following screenshot:

:::image type="content" source="../../media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query.png" alt-text="Screenshot of the Azure portal that shows the Logs page of the query on PetClinic application and the results." lightbox="../../media/quickstart-deploy-microservice-apps/azure-spring-apps-log-query.png":::

### 5.3. Monitor the applications

Application Insights monitors the application dependencies, as shown by the following application tracing map:

:::image type="content" source="../../media/quickstart-deploy-microservice-apps/application-insights-map.png" alt-text="Screenshot of the Azure portal that shows the Application map page for an Application Insights instance." lightbox="../../media/quickstart-deploy-microservice-apps/application-insights-map.png":::

Open the URL exposed by the app `admin-server` to manage the applications through the Spring Boot Admin Server, as shown in the following screenshot:

:::image type="content" source="../../media/quickstart-deploy-microservice-apps/admin-server.png" alt-text="Screenshot of the Spring Boot Admin Server page for the PetClinic application listing the current application instances." lightbox="../../media/quickstart-deploy-microservice-apps/admin-server.png":::
