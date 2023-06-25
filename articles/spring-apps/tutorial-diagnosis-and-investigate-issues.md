---
title: "Tutorial - Diagnosis and investigate issues on Azure Spring Apps"
description: Learn how to diagnosis and investigate issues on Azure Spring Apps.
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: tutorial
ms.date: 06/20/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Tutorial: Diagnosis and investigate issues on Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ❌ Enterprise

This article shows you how to diagnosis your production services and investigate production issues on Azure Spring Apps, we use the well-known sample app [PetClinic](https://github.com/azure-samples/spring-petclinic-microservices) as a production program, the following is a further explanation in conjunction with [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md) and [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md).
[Log Analytics](../azure-monitor/logs/log-analytics-overview.md) and [Application Insights](../azure-monitor/insights/insights-overview.md) are deeply integrated with Azure Spring Apps, 
you can use Log Analytics diagnosis your application with variously log queries, and use Application Insights investigate production issues.

## 1. Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Complete the previous quickstart in this series: [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md) and [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md).

  1. Make sure that both the `Enable logs of Diagnostic settings` and `Application Insights` functions are enabled on the Azure Spring Apps instance.

  1. Make sure that the applications that need to link to the database have activated the mysql profile through the environment variable:
     - On the **Configuration** page, select **Environment variables** tab page, enter `SPRING_PROFILES_ACTIVE` for **Key**, enter `mysql` for **Value**, then select **Save**

     :::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/app-config-env.png" alt-text="Screenshot of Azure portal showing config env for Azure Spring Apps instance" lightbox="media/tutorial-diagnosis-and-investigate-issues/app-config-env.png":::

     - Repeat the configuration steps of `customers-service` above to configure the following applications:
     
         - `vets-service`
         - `visits-service`

  1. Make sure that applications `customers-service`, `vets-service` and `visits-service` are all configured with a validated service connector linking to a Azure Database for MySQL instance.

[!INCLUDE [diagnosis-and-investigate-issues-with-basic-standard-plan](includes/tutorial-diagnosis-and-investigate-issues/diagnosis-and-investigate-issues-with-basic-standard-plan.md)]

## 6. Diagnosis your application with Log Analytics

This section provides samples of querying your application logs, and special error can be queried through the custom [Azure Monitor log queries](/azure/data-explorer/kusto/query/).

To review a list of application logs from Azure Spring Apps, sorted by time with the most recent logs shown first, run the following query:

```sql
AppPlatformLogsforSpring
| project TimeGenerated , ServiceName , AppName , InstanceName , Log
| sort by TimeGenerated desc
```

:::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/show-application-logs.png" alt-text="Screenshot of Azure portal showing application logs for Azure Spring Apps instance" lightbox="media/tutorial-diagnosis-and-investigate-issues/show-application-logs.png":::


To review a list of error logs from Azure Spring Apps, replace the keyword and which you are looking for, run the following query:

```sql
AppPlatformLogsforSpring
| where AppName == "customers-service"
| where Log contains "root cause"
| project-keep InstanceName, Log
```

:::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/show-error-logs.png" alt-text="Screenshot of Azure portal showing error logs for Azure Spring Apps instance" lightbox="media/tutorial-diagnosis-and-investigate-issues/show-error-logs.png":::

## 7. Investigate production issues with Application Insights

This section demonstrates how to investigate specific request failures and performance issues, see more details in [Application Map in Application Insights](../azure-monitor/app/app-map.md).

### 7.1. Investigate request failures

1. Go to the Azure Spring Apps instance overview page.

1. Select **Application Insights** in the left navigational menu, select the **Application Insights** to go to the Application Insights overview page, and select **Failures** in the left navigational menu.

   :::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/ai-failures.png" alt-text="Screenshot of the Azure portal with failures." lightbox="media/tutorial-diagnosis-and-investigate-issues/ai-failures.png":::

1. Select the `PUT` operation with the most failed requests count, select **1 Samples** to drill into the details, and then select the suggested sample in the right panel.

   :::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/ai-failure-suggested-sample.png" alt-text="Screenshot of the Azure portal with failure suggested sample." lightbox="media/tutorial-diagnosis-and-investigate-issues/ai-failure-suggested-sample.png":::

1. On the **End-to-end transaction details** page, then you can view the full call stack strace in the right panel.

   :::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/ai-e2e-exception.png" alt-text="Screenshot of the Azure portal with failure exception." lightbox="media/tutorial-diagnosis-and-investigate-issues/ai-e2e-exception.png":::

### 7.2. Investigate request performance issues

1. Go to the Azure Spring Apps instance overview page.

1. Select **Application Insights** in the left navigational menu, select the **Application Insights** to go to the Application Insights overview page, and select **Performance** in the left navigational menu.

   :::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/ai-performance.png" alt-text="Screenshot of the Azure portal with performance." lightbox="media/tutorial-diagnosis-and-investigate-issues/ai-performance.png":::

1. Select the slowest `GET /api/gateway/owners/{ownerId}` operation, select **3 Samples** to drill into the details, and then select the suggested sample in the right panel.

   :::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/ai-performance-suggested-sample.png" alt-text="Screenshot of the Azure portal with performance suggested sample." lightbox="media/tutorial-diagnosis-and-investigate-issues/ai-performance-suggested-sample.png":::

1. On the **End-to-end transaction details** page, then you can view the full call stack strace in the right panel, and you can see the processing logic that takes the longest.

   :::image type="content" source="media/tutorial-diagnosis-and-investigate-issues/ai-e2e-performance.png" alt-text="Screenshot of the Azure portal with performance issue." lightbox="media/tutorial-diagnosis-and-investigate-issues/ai-e2e-performance.png":::

[!INCLUDE [clean-up-resources-portal](includes/tutorial-diagnosis-and-investigate-issues/clean-up-resources.md)]

## 9. Next steps

> [!div class="nextstepaction"]
> [Set up a staging environment](../spring-apps/how-to-staging-environment.md)

> [!div class="nextstepaction"]
> [Use TLS/SSL certificates](./how-to-use-tls-certificate.md)