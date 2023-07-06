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

Observability is the ability to provide insights, analytics and actionable intelligence through the logs, metrics, traces and alerts.
As a distributed application manager in production, you should focus on the following areas to ensure the states of all applications meet expectations and to discover and predict issues in all applications:
- **Availability**: Check that the application is available and accessible to the user.
- **Reliability**: Check that the application is reliable and can be used normally.
- **Failure**: Understand that the application isn't working properly and further fixes are required.
- **Performance**: Understand which performance issue the application encounters, need further attention, and find out the root cause of the problem.
- **Alerts**: Know the current state of the application. Proactively notify managers and perform associated actionable actions when the application is abnormal.

This article shows you how to observe your production applications deployed on Azure Spring Apps, 
as well as diagnose and investigate production issues.
We use the well-known sample app [PetClinic](https://github.com/azure-samples/spring-petclinic-microservices) as a production program.
You can follow [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md) 
and [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md) quickstarts to deploy the PetClinic project to Azure Spring Apps and use MySQL as the persistent store.
[Log Analytics](../azure-monitor/logs/log-analytics-overview.md) and [Application Insights](../azure-monitor/insights/insights-overview.md) 
are deeply integrated with Azure Spring Apps, you can use Log Analytics to diagnose your application with variously log queries, 
and use Application Insights to investigate production issues.

## 1. Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [tutorial-applications-observability-with-basic-standard-plan](includes/tutorial-applications-observability/applications-observability-with-basic-standard-plan.md)]

## 4. Query logs to diagnose an application problem

It's inevitable to encounter production issues, and then need to do root cause analysis.
Finding logs is an important part, especially for distributed applications whose logs are spread across multiple applications.
The trace data collected by Application Insight can help find the log information of all related links,
even the exception stack information.

This section illustrates how to use Log Analytics to query the application logs, 
and use Application Insights to investigate request failures, 
see more details in [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md) 
and [Application Map in Application Insights](../azure-monitor/app/app-map.md)

### Log queries

This section illustrates how to query application logs from the table `AppPlatformLogsforSpring` hosted by Azure Spring Apps, you can use [Kusto Query Language](/azure/data-explorer/kusto/query/) customize your queries to query application logs.

Open the **Logs** menu of Azure Spring Apps instance, and you can refer to the built-in example query statements or write your own queries.

#### Show the application logs which contain the "error" or "exception" terms

On the opened **Queries** window, select **Alerts** menu in the left panel, then select the **Run** inside **Show the application logs which contain the "error" or "exception" terms** section.

:::image type="content" source="media/tutorial-applications-observability/example-query.png" alt-text="Screenshot of Azure portal showing example queries" lightbox="media/tutorial-applications-observability/example-query.png":::

This query shows the application logs that contain the "error" or "exception" terms in the last hour by default, 
you may customize the query with any keyword you want to search for.

```sqle
AppPlatformLogsforSpring
| where TimeGenerated > ago(1h)
| where Log contains "error" or Log contains "exception"
| project TimeGenerated , ServiceName , AppName , InstanceName , Log , _ResourceId 
```

:::image type="content" source="media/tutorial-applications-observability/show-application-logs-abnormal.png" alt-text="Screenshot of Azure portal showing abnormal logs for Azure Spring Apps instance" lightbox="media/tutorial-applications-observability/show-application-logs-abnormal.png":::

#### Show the error and exception number of each application

Same with previous section, select **Run** inside **Show the error and exception number of each application** section.

This query shows a pie chart of the number of the logs containing the "error" or "exception" terms in the last 24 hours, per application by default, 
also you can select **Result** tab to view the result in a table.

```sql
AppPlatformLogsforSpring
| where TimeGenerated > ago(24h)
| where Log contains "error" or Log contains "exception"
| extend FullAppName = strcat(ServiceName, "/", AppName)
| summarize count_per_app = count() by FullAppName, ServiceName, AppName, _ResourceId
| sort by count_per_app desc 
| render piechart
```

:::image type="content" source="media/tutorial-applications-observability/show-application-logs-abnormal-num.png" alt-text="Screenshot of Azure portal showing abnormal logs number for Azure Spring Apps instance" lightbox="media/tutorial-applications-observability/show-application-logs-abnormal-num.png":::

#### Query the customers service log with a key word

Create a new tab and write the following query to review a list of logs with `root cause` in the app `customers-service`,
update your query with the keyword that you're looking for.

```sql
AppPlatformLogsforSpring
| where AppName == "customers-service"
| where Log contains "root cause"
| project-keep InstanceName, Log
```

:::image type="content" source="media/tutorial-applications-observability/show-error-logs.png" alt-text="Screenshot of Azure portal showing error logs for Azure Spring Apps instance" lightbox="media/tutorial-applications-observability/show-error-logs.png":::

### Investigate request failures

This section illustrates how to investigate request failures in the application cluster, view the failed request list leaderboard and specific examples of failed requests, and you can drill down to query failed stack information.

1. Go to the Azure Spring Apps instance overview page.

1. Select **Application Insights** in the left navigation menu, select the **Application Insights** to go to the Application Insights overview page, and select **Failures** in the left navigation menu.

   :::image type="content" source="media/tutorial-applications-observability/ai-failures.png" alt-text="Screenshot of the Azure portal with failures." lightbox="media/tutorial-applications-observability/ai-failures.png":::

1. Select the `PUT` operation with the most failed requests count, select **1 Samples** to drill into the details, and then select the suggested sample in the right panel.

   :::image type="content" source="media/tutorial-applications-observability/ai-failure-suggested-sample.png" alt-text="Screenshot of the Azure portal with failure suggested sample." lightbox="media/tutorial-applications-observability/ai-failure-suggested-sample.png":::

1. On the **End-to-end transaction details** page, then you can view the full call stack strace in the right panel.

   :::image type="content" source="media/tutorial-applications-observability/ai-e2e-exception.png" alt-text="Screenshot of the Azure portal with failure exception." lightbox="media/tutorial-applications-observability/ai-e2e-exception.png":::

## 5. Improve the application performance using Application Insights

Performance issues are also common. The trace data collected by Application Insight can help find the log information of all relevant links, 
including the execution time of each link, so that we can find out where the performance bottleneck is.

This section illustrates how to use Application Insights to investigate the performance issues.

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
