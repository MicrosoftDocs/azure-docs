---
title: "Tutorial: Optimize application observability for Azure Spring Apps"
description: Learn how to observe the application of Azure Spring Apps.
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: tutorial
ms.date: 09/15/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Tutorial: Optimize application observability for Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ❌ Enterprise

This quickstart shows you how to observe your production applications deployed on Azure Spring Apps, and diagnose and investigate production issues. You can provide insights, analytics, and actionable intelligence through the logs, metrics, traces, and alerts by observing your applications in Azure Spring Apps. To find out if your applications meet expectations and discover and predict issues in all applications, focus on the following areas:

- **Availability**: Check that the application is available and accessible to the user.
- **Reliability**: Check that the application is reliable and can be used normally.
- **Failure**: Understand that the application isn't working properly and further fixes are required.
- **Performance**: Understand which performance issue the application encounters, need further attention, and find out the root cause of the problem.
- **Alerts**: Know the current state of the application. Proactively notify others and take necessary actions when the application isn't working properly.

In this quickstart, we use the well-known sample app [PetClinic](https://github.com/azure-samples/spring-petclinic-microservices) as the production application. For more information on how to deploy the PetClinic sample app to Azure Spring Apps, see the following articles:

- [Deploy microservice applications to Azure Spring Apps](./quickstart-deploy-microservice-apps.md)
- [Run microservice apps(Pet Clinic) with Azure Database for MySQL](./quickstart-integrate-azure-database-mysql.md)

Log Analytics and application insights are deeply integrated with Azure Spring Apps. You can use Log Analytics to diagnose your application with various log queries, and use Application Insights to investigate production issues. For more information, see the following articles:

- [Log Analytics](../azure-monitor/logs/log-analytics-overview.md)
- [Application Insights](../azure-monitor/insights/insights-overview.md) 

## 1. Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [tutorial-applications-observability-with-basic-standard-plan](includes/tutorial-applications-observability/applications-observability-with-basic-standard-plan.md)]

## 4. Query logs to diagnose an application problem

If you encounter production issues, find query logs for distributed applications that are spread across multiple applications. The trace data collected by Application Insights can help find the log information of all related links, including the exception stack information.

This section explains how to use Log Analytics to query the application logs, and use Application Insights to investigate request failures. For more information, see the following articles:

- [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md)
- [Application Map in Application Insights](../azure-monitor/app/app-map.md)

### 4.1. Log queries

This section explains how to query application logs from the table `AppPlatformLogsforSpring` hosted by the Azure Spring Apps. You can use [Kusto Query Language](/azure/data-explorer/kusto/query/) to customize your queries for application logs. 

To see the built-in example query statements or to write your own queries, open the Azure Spring Apps instance and go to the **Logs** menu.

#### Show the application logs which contain the "error" or "exception" terms

Use the following steps to see the application logs containing the terms "error" or "exception":

1. On the **Queries** page, select **Alerts**, and then select **Run** in the **Show the application logs which contain the "error" or "exception" terms** section. 

The application logs that contain the "error" or "exception" terms within the last hour opens up by default.

1. To customize the query with any keyword you want, enter the following commands:

```sql
AppPlatformLogsforSpring
| where TimeGenerated > ago(1h)
| where Log contains "error" or Log contains "exception"
| project TimeGenerated , ServiceName , AppName , InstanceName , Log , _ResourceId 
```

#### Show the error and exception number of each application

Use the following step to see the error and exception number of an application:

1. On the **Queries** page, select **Alerts**, and then select **Run** in the **Show the error and exception number of each application** section.

A pie chart of the number of the logs containing the "error" or "exception" terms in the last 24 hours opens up. To view the results in a table format, select **Result**.

1. To customize the query with any keyword you want, enter the following commands:

```sql
AppPlatformLogsforSpring
| where TimeGenerated > ago(24h)
| where Log contains "error" or Log contains "exception"
| extend FullAppName = strcat(ServiceName, "/", AppName)
| summarize count_per_app = count() by FullAppName, ServiceName, AppName, _ResourceId
| sort by count_per_app desc 
| render piechart
```

:::image type="content" source="media/tutorial-applications-observability/show-application-logs-abnormal-num.png" alt-text="Screenshot of the Azure portal that shows abnormal logs number for the Azure Spring Apps instance." lightbox="media/tutorial-applications-observability/show-application-logs-abnormal-num.png":::

#### Query the customers service log with a key word

To review a list of logs with `root cause` in the app `customers-service` and to customize your query with the keyword you want, enter the following commands:

```sql
AppPlatformLogsforSpring
| where AppName == "customers-service"
| where Log contains "root cause"
| project-keep InstanceName, Log
```

### 4.2. Investigate request failures

To investigate request failures in the application cluster and to view the failed request list and the specific examples of the failed requests, use the following steps:

1. Go to the Azure Spring Apps instance overview page.

1. On the left navigation menu, select **Application Insights** to go to the Application Insights overview page, and select **Failures**.

   :::image type="content" source="media/tutorial-applications-observability/application-insights-failures.png" alt-text="Screenshot of the Azure portal that shows the failures." lightbox="media/tutorial-applications-observability/application-insights-failures.png":::

1. On the **Failure** page, select the `PUT` operation that has the most failed requests count, select **1 Samples** to go into the details, and then select the suggested sample in the right panel.

1. Go to the **End-to-end transaction details** page to view the full call stack in the right panel.

## 5. Improve the application performance using Application Insights

If there's a performance issue, the trace data collected by Application Insights can help find the log information of all relevant links, including the execution time of each link.

To use Application Insights to investigate the performance issues, use the following steps:

1. Go to the Azure Spring Apps instance overview page.

1. On the left navigation menu, select **Application Insights** to go to the Application Insights overview page, and select **Performance**.

   :::image type="content" source="media/tutorial-applications-observability/application-insights-performance.png" alt-text="Screenshot of the Azure portal that shows the performance page." lightbox="media/tutorial-applications-observability/application-insights-performance.png":::

1. On the **Performance** page, select the slowest `GET /api/gateway/owners/{ownerId}` operation, select **3 Samples** to go into the details, and then select the suggested sample in the right panel.

1. Go to the **End-to-end transaction details** page to view the full call stack in the right panel. 

[!INCLUDE [clean-up-resources-portal](includes/tutorial-applications-observability/clean-up-resources.md)]

## 7. Next steps

> [!div class="nextstepaction"]
> [Set up a staging environment](../spring-apps/how-to-staging-environment.md)

> [!div class="nextstepaction"]
> [Custom DNS name](./tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Use TLS/SSL certificates](./how-to-use-tls-certificate.md)
