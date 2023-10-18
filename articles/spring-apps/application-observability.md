---
title: Optimize application observability for Azure Spring Apps
description: Learn how to observe the application of Azure Spring Apps.
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/02/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Optimize application observability for Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** <br>
❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ❌ Enterprise

This article shows you how to observe your production applications deployed on Azure Spring Apps and diagnose and investigate production issues. Observability is the ability to collect insights, analytics, and actionable intelligence through the logs, metrics, traces, and alerts.

To find out if your applications meet expectations and to discover and predict issues in all applications, focus on the following areas:

- **Availability**: Check that the application is available and accessible to the user.
- **Reliability**: Check that the application is reliable and can be used normally.
- **Failure**: Understand that the application isn't working properly and further fixes are required.
- **Performance**: Understand which performance issues the application encounters that need further attention and find out the root cause of the problem.
- **Alerts**: Know the current state of the application. Proactively notify others and take necessary actions when the application isn't working properly.

This article uses the well-known [PetClinic](https://github.com/azure-samples/spring-petclinic-microservices) sample app as the production application. For more information on how to deploy PetClinic to Azure Spring Apps and use MySQL as the persistent store, see the following articles:

- [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md)
- [Integrate Azure Spring Apps with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md)

Log Analytics and Application Insights are deeply integrated with Azure Spring Apps. You can use Log Analytics to diagnose your application with various log queries and use Application Insights to investigate production issues. For more information, see the following articles:

- [Overview of Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md)
- [Azure Monitor Insights overview](../azure-monitor/insights/insights-overview.md)

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [application-observability-with-basic-standard-plan](includes/application-observability/application-observability-with-basic-standard-plan.md)]

## Query logs to diagnose an application problem

If you encounter production issues, you need to do a root cause analysis. Finding logs is an important part of this analysis, especially for distributed applications with logs spread across multiple applications. The trace data collected by Application Insights can help you find the log information for all related links, including the exception stack information.

This section explains how to use Log Analytics to query the application logs and use Application Insights to investigate request failures. For more information, see the following articles:

- [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md)
- [Application Map: Triage distributed applications](../azure-monitor/app/app-map.md)

### Log queries

This section explains how to query application logs from the `AppPlatformLogsforSpring` table hosted by Azure Spring Apps. You can use the [Kusto Query Language](/azure/data-explorer/kusto/query/) to customize your queries for application logs.

To see the built-in example query statements or to write your own queries, open the Azure Spring Apps instance and go to the **Logs** menu.

#### Show the application logs that contain the "error" or "exception" terms

To see the application logs containing the terms "error" or "exception", select **Alerts** on the **Queries** page, and then select **Run** in the **Show the application logs which contain the "error" or "exception" terms** section.

The following query shows the application logs from the last hour that contains the terms "error" or "exception". You can customize the query with any keyword you want to search for.

```sql
AppPlatformLogsforSpring
| where TimeGenerated > ago(1h)
| where Log contains "error" or Log contains "exception"
| project TimeGenerated , ServiceName , AppName , InstanceName , Log , _ResourceId
```

:::image type="content" source="media/application-observability/show-application-logs-abnormal.png" alt-text="Screenshot of the Azure portal that shows the Logs page with the example query and query results." lightbox="media/application-observability/show-application-logs-abnormal.png":::

#### Show the error and exception number of each application

To see the error and exception number of an application, select **Alerts** on the **Queries** page, and then select **Run** in the **Show the error and exception number of each application** section.

The following query shows a pie chart of the number of the logs in the last 24 hours that contain the terms "error" or "exception". To view the results in a table format, select **Result**.

```sql
AppPlatformLogsforSpring
| where TimeGenerated > ago(24h)
| where Log contains "error" or Log contains "exception"
| extend FullAppName = strcat(ServiceName, "/", AppName)
| summarize count_per_app = count() by FullAppName, ServiceName, AppName, _ResourceId
| sort by count_per_app desc
| render piechart
```

:::image type="content" source="media/application-observability/show-application-logs-abnormal-number.png" alt-text="Screenshot of the Azure portal that shows abnormal logs number for the Azure Spring Apps instance." lightbox="media/application-observability/show-application-logs-abnormal-number.png":::

#### Query the customers service log with a key word

Use the following query to see a list of logs in the `customers-service` app that contain the term "root cause". Update the query to use the keyword that you're looking for.

```sql
AppPlatformLogsforSpring
| where AppName == "customers-service"
| where Log contains "root cause"
| project-keep InstanceName, Log
```

:::image type="content" source="media/application-observability/show-error-logs.png" alt-text="Screenshot of the Azure portal that shows the Logs page with the example query and root cause logs." lightbox="media/application-observability/show-error-logs.png":::

### Investigate request failures

Use the following steps to investigate request failures in the application cluster and to view the failed request list and specific examples of the failed requests:

1. Go to the Azure Spring Apps instance overview page.

1. On the navigation menu, select **Application Insights** to go to the Application Insights overview page. Then, select **Failures**.

   :::image type="content" source="media/application-observability/application-insights-failures.png" alt-text="Screenshot of the Azure portal that shows the Application Insights Failures page." lightbox="media/application-observability/application-insights-failures.png":::

1. On the **Failure** page, select the `PUT` operation that has the most failed requests count, select **1 Samples** to go into the details, and then select the suggested sample.

   :::image type="content" source="media/application-observability/application-insights-failure-suggested-sample.png" alt-text="Screenshot of the Azure portal that shows the Select a sample operation pane with the suggested failure sample." lightbox="media/application-observability/application-insights-failure-suggested-sample.png":::

1. Go to the **End-to-end transaction details** page to view the full call stack in the right panel.

   :::image type="content" source="media/application-observability/application-insights-e2e-exception.png" alt-text="Screenshot of the Azure portal that shows the End-to-end transaction details page with Application Insights failures." lightbox="media/application-observability/application-insights-e2e-exception.png":::

## Improve the application performance using Application Insights

If there's a performance issue, the trace data collected by Application Insights can help find the log information of all relevant links, including the execution time of each link, to help find the location of the performance bottleneck.

To use Application Insights to investigate the performance issues, use the following steps:

1. Go to the Azure Spring Apps instance overview page.

1. On the navigation menu, select **Application Insights** to go to the Application Insights overview page. Then, select **Performance**.

   :::image type="content" source="media/application-observability/application-insights-performance.png" alt-text="Screenshot of the Azure portal that shows the Application Insights Performance page." lightbox="media/application-observability/application-insights-performance.png":::

1. On the **Performance** page, select the slowest `GET /api/gateway/owners/{ownerId}` operation, select **3 Samples** to go into the details, and then select the suggested sample.

   :::image type="content" source="media/application-observability/application-insights-performance-suggested-sample.png" alt-text="Screenshot of the Azure portal that shows the Select a sample operation pane with the suggested performance sample." lightbox="media/application-observability/application-insights-performance-suggested-sample.png":::

1. Go to the **End-to-end transaction details** page to view the full call stack in the right panel.

   :::image type="content" source="media/application-observability/application-insights-e2e-performance.png" alt-text="Screenshot of the Azure portal that shows the End-to-end transaction details page with the Application Insights performance issue." lightbox="media/application-observability/application-insights-e2e-performance.png":::

[!INCLUDE [clean-up-resources-portal](includes/application-observability/clean-up-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Set up a staging environment](../spring-apps/how-to-staging-environment.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Use TLS/SSL certificates](./how-to-use-tls-certificate.md)
