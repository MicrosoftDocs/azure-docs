---
title: "Tutorial - Observability of Azure Spring Apps applications"
description: Learn how to observe the application of Azure Spring Apps.
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: tutorial
ms.date: 06/20/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Tutorial: Observability of Azure Spring Apps applications

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ❌ Enterprise

This article shows you how to observe your production applications deployed on Azure Spring Apps, 
as well as diagnose and investigate production environment issues. 
We use the well-known sample app [PetClinic](https://github.com/azure-samples/spring-petclinic-microservices) as a production program, 
the following is a further explanation in conjunction with [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md) 
and [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md).
[Log Analytics](../azure-monitor/logs/log-analytics-overview.md) and [Application Insights](../azure-monitor/insights/insights-overview.md) 
are deeply integrated with Azure Spring Apps, you can use Log Analytics to diagnose your application with variously log queries, 
and use Application Insights to investigate production issues.

## 1. Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Complete the previous quickstart in this series: [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md) and [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md).

  1. Make sure that both the `Enable logs of Diagnostic settings` and `Application Insights` functions are enabled on the Azure Spring Apps instance.

  1. Make sure that applications `customers-service`, `vets-service` and `visits-service` are all configured with a validated service connector linking to an Azure Database for MySQL instance.

  1. Make sure that the applications that need to link to the database have activated the mysql profile through the environment variable:
     - On the **Configuration** page of app **customers-service**, select **Environment variables** tab page, enter `SPRING_PROFILES_ACTIVE` for **Key**, enter `mysql` for **Value**, then select **Save**

       :::image type="content" source="media/tutorial-applications-observability/app-customers-service-config-env.png" alt-text="Screenshot of Azure portal showing config env for customers-service app" lightbox="media/tutorial-applications-observability/app-customers-service-config-env.png":::

     - Repeat the configuration steps of `customers-service` above to configure the following applications:
     
         - `vets-service`
         - `visits-service`

[!INCLUDE [tutorial-applications-observability-with-basic-standard-plan](includes/tutorial-applications-observability/applications-observability-with-basic-standard-plan.md)]

## 4. Query logs to diagnose an application problem

This section illustrates how to query the application logs and investigate request failures.

This section provides samples of querying your application logs and special error logs, see more from [Kusto Query Language](/azure/data-explorer/kusto/query/).

### Log queries

Run the following query to review a list of application logs from Azure Spring Apps, sorted by time with the most recent logs shown first.

```sql
AppPlatformLogsforSpring
| project TimeGenerated , ServiceName , AppName , InstanceName , Log
| sort by TimeGenerated desc
```

:::image type="content" source="media/tutorial-applications-observability/show-application-logs.png" alt-text="Screenshot of Azure portal showing application logs for Azure Spring Apps instance" lightbox="media/tutorial-applications-observability/show-application-logs.png":::


Run the following query to review a list of error logs from Azure Spring Apps, custom your query script with the keyword which you are looking for, see more from [Kusto Query Language](/azure/data-explorer/kusto/query/).

```sql
AppPlatformLogsforSpring
| where AppName == "customers-service"
| where Log contains "root cause"
| project-keep InstanceName, Log
```

:::image type="content" source="media/tutorial-applications-observability/show-error-logs.png" alt-text="Screenshot of Azure portal showing error logs for Azure Spring Apps instance" lightbox="media/tutorial-applications-observability/show-error-logs.png":::

### Investigate request failures

1. Go to the Azure Spring Apps instance overview page.

1. Select **Application Insights** in the left navigation menu, select the **Application Insights** to go to the Application Insights overview page, and select **Failures** in the left navigation menu.

   :::image type="content" source="media/tutorial-applications-observability/ai-failures.png" alt-text="Screenshot of the Azure portal with failures." lightbox="media/tutorial-applications-observability/ai-failures.png":::

1. Select the `PUT` operation with the most failed requests count, select **1 Samples** to drill into the details, and then select the suggested sample in the right panel.

   :::image type="content" source="media/tutorial-applications-observability/ai-failure-suggested-sample.png" alt-text="Screenshot of the Azure portal with failure suggested sample." lightbox="media/tutorial-applications-observability/ai-failure-suggested-sample.png":::

1. On the **End-to-end transaction details** page, then you can view the full call stack strace in the right panel.

   :::image type="content" source="media/tutorial-applications-observability/ai-e2e-exception.png" alt-text="Screenshot of the Azure portal with failure exception." lightbox="media/tutorial-applications-observability/ai-e2e-exception.png":::

## 5. Improve the application performance using Application Insights

This section illustrates how to investigate the performance issues, see more details in [Application Map in Application Insights](../azure-monitor/app/app-map.md).

1. Go to the Azure Spring Apps instance overview page.

1. Select **Application Insights** in the left navigation menu, select the **Application Insights** to go to the Application Insights overview page, and select **Performance** in the left navigation menu.

   :::image type="content" source="media/tutorial-applications-observability/ai-performance.png" alt-text="Screenshot of the Azure portal with performance." lightbox="media/tutorial-applications-observability/ai-performance.png":::

1. On the **Performance** page, select the slowest `GET /api/gateway/owners/{ownerId}` operation, select **3 Samples** to drill into the details, and then select the suggested sample in the right panel.

   :::image type="content" source="media/tutorial-applications-observability/ai-performance-suggested-sample.png" alt-text="Screenshot of the Azure portal with performance suggested sample." lightbox="media/tutorial-applications-observability/ai-performance-suggested-sample.png":::

1. On the **End-to-end transaction details** page, then you can view the full call stack strace in the right panel, and you can see the processing logic that takes the longest.

   :::image type="content" source="media/tutorial-applications-observability/ai-e2e-performance.png" alt-text="Screenshot of the Azure portal with performance issue." lightbox="media/tutorial-applications-observability/ai-e2e-performance.png":::

[!INCLUDE [clean-up-resources-portal](includes/tutorial-applications-observability/clean-up-resources.md)]

## 7. Next steps

> [!div class="nextstepaction"]
> [Set up a staging environment](../spring-apps/how-to-staging-environment.md)

> [!div class="nextstepaction"]
> [Custom DNS name](./tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Use TLS/SSL certificates](./how-to-use-tls-certificate.md)