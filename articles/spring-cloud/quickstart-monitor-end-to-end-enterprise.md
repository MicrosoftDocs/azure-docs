---
title: "Quickstart - Monitor Applications End-to-End"
description: Explains how to monitor apps running Azure Spring Apps Enterprise tier using Application Insights and Log Analytics.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java
---

# Quickstart: Monitor application end-to-end

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how monitor apps running Azure Spring Apps Enterprise tier using Application Insights and Log Analytics.

> [!NOTE]
> You can monitor your Spring workloads end-to-end using any tool and platform of your choice, including App Insights, Log Analytics, New Relic, Dynatrace, AppDynamics, Elastic, or Splunk. For more information, see [Working with other monitoring tools](#working-with-other-monitoring-tools) later in this article.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Apps Enterprise tier. For more information, see [View Azure Spring Apps Enterprise tier Offer in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Resources to monitor, such as the ones created in the following quickstarts:
  - [Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md)
  - [Integrate with Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
  - [Securely Load Application Secrets using Key Vault](quickstart-key-vault-enterprise.md)

## Update applications

The Application Insights connection string must be provided manually to the Order Service (ASP.NET core) and Cart Service (python) applications. The following instructions describe how to provide this connection string and increase the sampling rate to Application Insights.

> [!NOTE]
> Currently only the buildpacks for Java and NodeJS applications support Application Insights instrumentation. This will be changed in future iterations.

1. Retrieve the Application Insights connection string and set it in Key Vault using the following commands:

   ```azurecli
   INSTRUMENTATION_KEY=$(az monitor app-insights component show \
       --resource-group=<resource-group-name>
       --app <app-insights-name> | jq -r '.connectionString')

   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "ApplicationInsights--ConnectionString" --value ${INSTRUMENTATION_KEY}
   ```

> [!NOTE]
> By default, the Application Insights service instance has the same name as the Azure Spring Apps service instance.

1. Update the sampling rate for the Application Insights binding to increase the amount of data available using the following command:

   ```azurecli
   az spring build-service builder buildpack-binding set \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --builder-name default \
       --name default \
       --type ApplicationInsights \
       --properties sampling-rate=100 connection_string=${INSTRUMENTATION_KEY}
   ```

1. Restart applications to reload configuration using the following commands:

   ```azurecli
   az spring app restart \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --name cart-service

   az spring app restart \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --name order-service

   az spring app restart \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --name catalog-service

   az spring app restart \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --name frontend

   az spring app restart \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --name identity-service
   ```

   For the Java and NodeJS applications, this will allow the new sampling rate to take effect. For the non-java applications, this will allow them to access the newly added Instrumentation Key from the Key Vault.

## View logs

There are two ways to see logs on Azure Spring Apps: **Log Streaming** of real-time logs per app instance or **Log Analytics** for aggregated logs with advanced query capability

### Use log streaming

Generate traffic in the Application by moving through the application, viewing the catalog, and placing orders. Use the following commands to generate traffic continuously, until canceled:

```azurecli
GATEWAY_URL=$(az spring gateway show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

cd traffic-generator
GATEWAY_URL=https://${GATEWAY_URL} ./gradlew gatlingRun-com.vmware.acme.simulation.GuestSimulation
```

Use the following command to get the latest 100 lines of application console logs from the Catalog Service:

```azurecli
az spring app logs \
    --resource-group <resource-group-name> \
    --name catalog-service \
    --service <Azure-Spring-Apps-service-instance-name> \
    --lines 100
```

By adding the `--follow` option, you can get real-time log streaming from an app. Try log streaming for the Catalog Service by using the following command:

```azurecli
az spring app logs \
    --resource-group <resource-group-name> \
    --name catalog-service \
    --service <Azure-Spring-Apps-service-instance-name> \
    --follow
```

> [!TIP]
> You can use az spring app logs `--help` to explore more parameters and log stream functionalities.

### Use Log Analytics

Open the Log Analytics that you created - you can find the Log Analytics in the same Resource Group where you created an Azure Spring Apps service instance.

In the Log Analytics page, select the **Logs** pane and run any of the following sample queries for Azure Spring Apps.

Type and run the following Kusto query to see application logs:

```kusto
AppPlatformLogsforSpring
| where TimeGenerated > ago(24h)
| limit 500
| sort by TimeGenerated
| project TimeGenerated, AppName, Log
```

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/all-app-logs-in-log-analytics.png" alt-text="Screenshot of Azure portal showing example output from all application logs query.":::

Type and run the following Kusto query to see `catalog-service` application logs:

```kusto
AppPlatformLogsforSpring
| where AppName has "catalog-service"
| limit 500
| sort by TimeGenerated
| project TimeGenerated, AppName, Log
```

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/catalog-app-logs-in-log-analytics.png" alt-text="Screenshot of Azure portal showing example output from catalog service logs.":::

Type and run the following Kusto query to see errors and exceptions thrown by each app:

```kusto
AppPlatformLogsforSpring
| where Log contains "error" or Log contains "exception"
| extend FullAppName = strcat(ServiceName, "/", AppName)
| summarize count_per_app = count() by FullAppName, ServiceName, AppName, _ResourceId
| sort by count_per_app desc
| render piechart
```

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/ingress-logs-in-log-analytics.png" alt-text="Screenshot of Azure portal showing example output from the Ingress Logs.":::

Type and run the following Kusto query to see all in the inbound calls into Azure Spring Apps:

```kusto
AppPlatformIngressLogs
| project TimeGenerated, RemoteAddr, Host, Request, Status, BodyBytesSent, RequestTime, ReqId, RequestHeaders
| sort by TimeGenerated
```

Type and run the following Kusto query to see all the logs from the managed Spring Cloud
Config Gateway managed by Azure Spring Apps:

```kusto
AppPlatformSystemLogs
| where LogType contains "SpringCloudGateway"
| project TimeGenerated,Log
```

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/spring-cloud-gateway-logs-in-log-analytics.png" alt-text="Screenshot of Azure portal showing example output from the Spring Cloud Gateway Logs.":::

Type and run the following Kusto query to see all the logs from the managed Spring Cloud
Service Registry managed by Azure Spring Apps:

```kusto
AppPlatformSystemLogs
| where LogType contains "ServiceRegistry"
| project TimeGenerated, Log
```

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/service-registry-logs-in-log-analytics.png" alt-text="Screenshot of Azure portal showing example output from service registry logs.":::

## Use tracing

Open the Application Insights created by Azure Spring Apps and start monitoring Spring Boot applications. You can find the Application Insights in the same Resource Group where you created an Azure Spring Apps service instance.

Navigate to the **Application Map** pane:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/fitness-store-application-map.png" alt-text="Screenshot of Azure portal showing the Application Map of Azure Application Insights.":::

Navigate to the **Performance** pane:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/performance.png" alt-text="Screenshot of Azure portal showing the Performance pane of Azure Application Insights.":::

Navigate to the **Performance/Dependencies** pane. Here you can see the performance number for dependencies, particularly SQL calls, as shown in the following screenshot:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/performance_dependencies.png" alt-text="Screenshot of Azure portal showing the Dependencies section of the Performance pane of Azure Application Insights.":::

Navigate to the **Performance/Roles** pane. Here you can see the performance metrics for individual instances or roles, as shown in the following screenshot:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/fitness-store-roles-in-performance-blade.png" alt-text="Screenshot of Azure portal showing the Roles section of the Performance pane of Azure Application Insights.":::

Select a SQL call to see the end-to-end transaction in context, as shown in the following screenshot:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/fitness-store-end-to-end-transaction-details.png" alt-text="Screenshot of Azure portal showing the end-to-end transaction of an S Q L call.":::

Navigate to the **Failures/Exceptions** pane. Here you can see a collection of exceptions, as shown in the following screenshot:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/fitness-store-exceptions.png" alt-text="Screenshot of Azure portal showing application failures graphed.":::

## View metrics

Navigate to the **Metrics** pane. Here you can see metrics contributed by Spring Boot apps, Spring Cloud modules, and dependencies. The chart in the following screenshot shows **http_server_requests** and **Heap Memory Used**:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/metrics.png" alt-text="Screenshot of Azure portal showing metrics over time graph.":::

Spring Boot registers a lot number of core metrics: JVM, CPU, Tomcat, Logback, etc.
The Spring Boot auto-configuration enables the instrumentation of requests handled by Spring MVC.
The REST controllers `ProductController`, and `PaymentController` have been instrumented by the `@Timed` Micrometer annotation at class level.

- `acme-catalog` application has the following custom metrics enabled:
  - @Timed: `store.products`
- `acem-payment` application has the following custom metrics enabled:
  - @Timed: `store.payment`

You can see these custom metrics in the **Metrics** pane:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/fitness-store-custom-metrics-with-payments-2.png" alt-text="Screenshot showing custom metrics instrumented by Micrometer.":::

Navigate to the **Live Metrics** pane. Here you can see live metrics on screen with low latencies < 1 second, as shown in the following screenshot:

:::image type="content" source="media/quickstart-monitor-end-to-end-enterprise/live-metrics.png" alt-text="Screenshot showing the live metrics of all applications.":::

## Working with other monitoring tools

In addition to Application Insights, Azure Spring Apps enterprise tier supports exporting metrics to other tools including:

- AppDynamics
- ApacheSkyWalking
- Dynatrace
- ElasticAPM
- NewRelic

You can add more bindings to a builder in Tanzu Build Service by using the following command:

```azurecli
az spring build-service builder buildpack-binding create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --builder-name <builder-name> \
    --name <binding-name> \
    --type <ApplicationInsights|AppDynamics|ApacheSkyWalking|Dynatrace|ElasticAPM|NewRelic> \
    --properties <connection-properties>
    --secrets <secret-properties>
```

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

Continue on to any of the following optional quickstarts:

- [Configure single sign-on](quickstart-configure-single-sign-on-enterprise.md)
- [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
- [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
- [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
- [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)
