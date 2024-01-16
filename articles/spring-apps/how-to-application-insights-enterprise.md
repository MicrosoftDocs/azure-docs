---
title: How to use Application Insights Java In-Process Agent in Azure Spring Apps
description: How to monitor apps using Application Insights Java In-Process Agent in Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 06/20/2022
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
zone_pivot_groups: spring-apps-tier-selection
---

# Use Application Insights Java In-Process Agent in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

This article explains how to monitor applications by using the Application Insights Java agent in Azure Spring Apps.

With this feature you can:

* Search tracing data with different filters.
* View a dependency map of Spring applications.
* Check request performance.
* Monitor real-time live metrics.
* Check request failures.
* Check application metrics.
* Check application logs.

Application Insights can provide many observable perspectives, including:

* Application map
* Performance
* Failures
* Metrics
* Live Metrics
* Availability
* Logs

## Using the Application Insights feature

When the **Application Insights** feature is enabled, you can:

* In the navigation pane, select **Application Insights** to view the **Overview** page of Application Insights. The **Overview** page shows you an overview of all running applications.
* Select **Application Map** to see the status of calls between applications.

   :::image type="content" source="media/how-to-application-insights/insights-process-agent-map.png" alt-text="Screenshot of Azure portal Application Insights with Application map page showing." lightbox="media/how-to-application-insights/insights-process-agent-map.png":::

* Select the link between customers-service and `petclinic` to see more details such as a query from SQL.
* Select an endpoint to see all the applications making requests to the endpoint.

* In the navigation pane, select **Performance** to see the performance data of all applications' operations, dependencies, and roles.

   :::image type="content" source="media/how-to-application-insights/insights-process-agent-performance.png" alt-text="Screenshot of Azure portal Application Insights with Performance page showing." lightbox="media/how-to-application-insights/insights-process-agent-performance.png":::

* In the navigation pane, select **Failures** to see any unexpected failures or exceptions from your applications.

   :::image type="content" source="media/how-to-application-insights/insights-process-agent-failures.png" alt-text="Screenshot of Azure portal Application Insights with Failures page showing." lightbox="media/how-to-application-insights/insights-process-agent-failures.png":::

* In the navigation pane, select **Metrics** and select the namespace to see both Spring Boot metrics and custom metrics, if any.

   :::image type="content" source="media/how-to-application-insights/insights-process-agent-metrics.png" alt-text="Screenshot of Azure portal Application Insights with Metrics page showing." lightbox="media/how-to-application-insights/insights-process-agent-metrics.png":::

* In the navigation pane, select **Live Metrics** to see the real-time metrics for different dimensions.

   :::image type="content" source="media/how-to-application-insights/petclinic-microservices-live-metrics.png" alt-text="Screenshot of Azure portal Application Insights with Live Metrics page showing." lightbox="media/how-to-application-insights/petclinic-microservices-live-metrics.png":::

* In the navigation pane, select **Availability** to monitor the availability and responsiveness of Web apps by creating [Availability tests in Application Insights](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability).

   :::image type="content" source="media/how-to-application-insights/petclinic-microservices-availability.png" alt-text="Screenshot of Azure portal Application Insights with Availability page showing." lightbox="media/how-to-application-insights/petclinic-microservices-availability.png":::

* In the navigation pane, select **Logs** to view all applications' logs, or one application's logs when filtering by `cloud_RoleName`.

   :::image type="content" source="media/how-to-application-insights/application-insights-application-logs.png" alt-text="Screenshot of Azure portal Application Insights with Logs page showing." lightbox="media/how-to-application-insights/application-insights-application-logs.png":::

## Manage Application Insights using the Azure portal

You can use the Portal to check or update the current settings in Application Insights.

### Enable Application Insights using the Azure portal

1. Select **Application Insights**.
1. Enable Application Insights by selecting **Edit binding**, or the **Unbound** hyperlink.

   :::image type="content" source="media/how-to-application-insights/application-insights-binding-enable.png" alt-text="Screenshot of Azure portal Azure Spring Apps instance with Application Insights page showing and drop-down menu visible with 'Edit binding' option.":::

1. Edit **Application Insights** or **Sampling rate**, then select **Save**.

### Disable Application Insights

1. Select **Application Insights**.
1. Select **Unbind binding** to disable Application Insights.

   :::image type="content" source="media/how-to-application-insights/application-insights-unbind-binding.png" alt-text="Screenshot of Azure portal Azure Spring Apps instance with Application Insights page showing and drop-down menu visible with 'Unbind binding' option.":::

### Change Application Insights Settings

Select the name under the *Application Insights* column to open the Application Insights section.

:::image type="content" source="media/how-to-application-insights/application-insights-change-settings.png" alt-text="Screenshot of Azure portal Azure Spring Apps instance with Application Insights page showing.":::

### Edit Application Insights buildpack bindings in Build Service

To check and update the current settings for the Application Insights buildpack bindings in Build Service, follow these steps:

1. Select **Build Service**.
1. Choose your builder.
1. Select **Edit** under the Bindings column.

Application Insights settings are found in the *ApplicationInsights* item listed under the *Binding type* column.

1. Select the **Bound** hyperlink, or select **Edit Binding** under the ellipse, to open and edit the Application Insights buildpack bindings.

   :::image type="content" source="media/how-to-application-insights/application-insights-builder-settings.png" alt-text="Screenshot of Azure portal 'Edit bindings for default builder' pane.":::

1. Edit the binding settings, then select **Save**.

   :::image type="content" source="media/how-to-application-insights/application-insights-edit-binding.png" alt-text="Screenshot of Azure portal 'Edit binding' pane.":::

## Manage Application Insights using Azure CLI

You can manage Application Insights using Azure CLI commands. In the following commands, be sure to replace the *\<placeholder>* text with the values described. The *\<service-instance-name>* placeholder refers to the name of your Azure Spring Apps instance.

### Enable Application Insights

To configure Application Insights when creating an Azure Spring Apps instance, use the following command. For the `app-insights` argument, you can specify an Application Insights name or resource ID.

```azurecli
az spring create \
    --resource-group <resource-group-name> \
    --name "service-instance-name" \
    --app-insights <name-or-resource-ID> \
    --sampling-rate <sampling-rate>
    --sku Enterprise
```

You can also use an Application Insights connection string (preferred) or instrumentation key, as shown in the following example.

```azurecli
az spring create \
    --resource-group <resource-group-name> \
    --name <service-instance-name> \
    --app-insights-key <connection-string-or-instrumentation-key> \
    --sampling-rate <sampling-rate>
    --sku Enterprise
```

### Disable Application Insights

To disable Application Insights when creating an Azure Spring Apps instance, use the following command:

```azurecli
az spring create \
    --resource-group <resource-group-name> \
    --name <service-instance-name> \
    --disable-app-insights
    --sku Enterprise
```

### Manage Application Insights buildpack bindings

This section applies to the Enterprise plan only, and provides instructions that supplement the previous section.

The Azure Spring Apps Enterprise plan uses buildpack bindings to integrate [Azure Application Insights](../azure-monitor/app/app-insights-overview.md) with the type `ApplicationInsights`. For more information, see [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-integration-and-ca-certificates.md).

To create an Application Insights buildpack binding, use the following command:

```azurecli
az spring build-service builder buildpack-binding create \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
    --type ApplicationInsights \
    --properties sampling-percentage=<your-sampling-percentage> \
                 connection-string=<your-connection-string>
```

To list all buildpack bindings, and find Application Insights bindings the type `ApplicationInsights`, use the following command:

```azurecli
az spring build-service builder buildpack-binding list \
    --resource-group <your-resource-group-name> \
    --service <your-service-resource-name> \
    --builder-name <your-builder-name>
```

To replace an Application Insights buildpack binding, use the following command:

```azurecli
az spring build-service builder buildpack-binding set \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
    --type ApplicationInsights \
    --properties sampling-percentage=<your-sampling-percentage> \
                 connection-string=<your-connection-string>
```

To get an Application Insights buildpack binding, use the following command:

```azurecli
az spring build-service builder buildpack-binding show \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
```

To delete an Application Insights buildpack binding, use the following command:

```azurecli
az spring build-service builder buildpack-binding delete \
    --resource-group <your-resource-group-name> \
    --service <your-service-instance-name> \
    --name <your-binding-name> \
    --builder-name <your-builder-name> \
```

## Automation

Automation in the Enterprise plan is pending support. Documentation is added as soon as it's available.

## Java agent update/upgrade

The Java agent is updated/upgraded when the buildpack is updated.

## Concept matching between Azure Spring Apps and Application Insights

| Azure Spring Apps | Application Insights                                         |
| ------------------ | ------------------------------------------------------------ |
| `App`              | * __Application Map__/Role<br />* __Live Metrics__/Role<br />* __Failures__/Roles/Cloud Role<br />* __Performance__/Roles/Could Role |
| `App Instance`     | * __Application Map__/Role Instance<br />* __Live Metrics__/Service Name<br />* __Failures__/Roles/Cloud Instance<br />* __Performance__/Roles/Could Instance |

The name `App Instance` from Azure Spring Apps is changed or generated in the following scenarios:

* You create a new application.
* You deploy a JAR file or source code to an existing application.
* You initiate a blue/green deployment.
* You restart the application.
* You stop the deployment of an application, and then restart it.

When data is stored in Application Insights, it contains the history of Azure Spring Apps app instances created or deployed since the Java agent was enabled. For example, in the Application Insights portal, you can see application data created yesterday, but then deleted within a specific time range, like the last 24 hours. The following scenarios show how this works:

* You created an application around 8:00 AM today from Azure Spring Apps with the Java agent enabled, and then you deployed a JAR file to this application around 8:10 AM today. After some testing, you change the code and deploy a new JAR file to this application at 8:30 AM today. Then, you take a break, and when you come back around 11:00 AM, you check some data from Application Insights. You see:
  * Three instances in Application Map with time ranges in the last 24 hours, and Failures, Performance, and Metrics.
  * One instance in Application Map with a time range in the last hour, and Failures, Performance, and Metrics.
  * One instance in Live Metrics.
* You created an application around 8:00 AM today from Azure Spring Apps with the Java agent enabled, and then you deployed a JAR file to this application around 8:10 AM today. Around 8:30 AM today, you try a blue/green deployment with another JAR file. Currently, you have two deployments for this application. After a break around 11:00 AM today, you want to check some data from Application Insights. You see:
  * Three instances in Application Map with time ranges in the last 24 hours, and Failures, Performance, and Metrics.
  * Two instances in Application Map with time ranges in last hour, and Failures, Performance, and Metrics.
  * Two instances in Live Metrics.

## Next steps

* [Use Application Insights Java In-Process Agent in Azure Spring Apps](./how-to-application-insights.md)
* [Analyze logs and metrics](diagnostic-services.md)
* [Stream logs in real time](./how-to-log-streaming.md)
* [Application Map](../azure-monitor/app/app-map.md)
* [Live Metrics](../azure-monitor/app/live-stream.md)
* [Performance](../azure-monitor/app/tutorial-performance.md)
* [Failures](../azure-monitor/app/tutorial-runtime-exceptions.md)
* [Metrics](../azure-monitor/essentials/tutorial-metrics.md)
* [Logs](../azure-monitor/logs/data-platform-logs.md)
