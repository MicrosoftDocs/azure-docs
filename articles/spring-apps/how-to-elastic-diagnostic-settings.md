---
title: Analyze logs with Elastic Cloud from Azure Spring Apps
description: Learn how to analyze diagnostics logs in Azure Spring Apps using Elastic
author: KarlErickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 12/07/2021
ms.author: karler
ms.custom: devx-track-java, event-tier1-build-2022
---

# Analyze logs with Elastic (ELK) using diagnostics settings

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to use the diagnostics functionality of Azure Spring Apps to analyze logs with Elastic (ELK).

The following video introduces unified observability for Spring Boot applications using Elastic.

<br>

> [!VIDEO https://www.youtube.com/embed/KjmQX1SxZdA]

## Configure diagnostics settings

To configure diagnostics settings, use the following steps:

1. In the Azure portal, go to your Azure Spring Apps instance.
1. Select **diagnostics settings** option, then select **Add diagnostics setting**.
1. Enter a name for the setting, choose **Send to partner solution**, then select **Elastic** and an Elastic deployment where you want to send the logs.
1. Select **Save**.

:::image type="content" source="media/how-to-elastic-diagnostic-settings/diagnostic-settings-asc-2.png" alt-text="Screenshot of Azure portal showing the Diagnostic setting page with selected options and the name specified for the setting." lightbox="media/how-to-elastic-diagnostic-settings/diagnostic-settings-asc-2.png":::

> [!NOTE]
> There might be a gap of up to 15 minutes between when logs are emitted and when they appear in your Elastic deployment.
> If the Azure Spring Apps instance is deleted or moved, the operation won't cascade to the diagnostics settings resources. You have to manually delete the diagnostics settings resources before you perform the operation against its parent, the Azure Spring Apps instance. Otherwise, if you provision a new Azure Spring Apps instance with the same resource ID as the deleted one, or if you move the Azure Spring Apps instance back, the previous diagnostics settings resources will continue to extend it.

## Analyze the logs with Elastic

To learn more about deploying Elastic on Azure, see [How to deploy and manage Elastic on Microsoft Azure](https://www.elastic.co/blog/getting-started-with-the-azure-integration-enhancement).

Use the following steps to analyze the logs:

1. From the Elastic deployment overview page in the Azure portal, open **Kibana**.

   :::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-on-azure-native-microsoft-azure.png" alt-text="Screenshot of Azure portal showing 'Elasticsearch (Elastic Cloud)' page with Deployment U R L / Kibana highlighted." lightbox="media/how-to-elastic-diagnostic-settings/elastic-on-azure-native-microsoft-azure.png":::

1. In Kibana, in the **Search** bar at top, type *Spring Cloud type:dashboard*.

   :::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-spring-cloud-dashboard.png" alt-text="Elastic / Kibana screenshot showing 'Spring Cloud type:dashboard' search results." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-spring-cloud-dashboard.png":::

1. Select **[Logs Azure] Azure Spring Apps logs Overview** from the results.

   :::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-asc-dashboard-full.png" alt-text="Elastic / Kibana screenshot showing Azure Spring Apps Application Console Logs." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-asc-dashboard-full.png":::

1. Search on out-of-the-box Azure Spring Apps dashboards by using the queries such as the following:

   ```query
   azure.springcloudlogs.properties.app_name : "visits-service"
   ```

## Analyze the logs with Kibana Query Language in Discover

Application logs provide critical information and verbose logs about your application's health, performance, and more. Use the following steps to analyze the logs:

1. In Kibana, in the **Search** bar at top, type *Discover*, then select the result.

   :::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-go-discover.png" alt-text="Elastic / Kibana screenshot showing 'Discover' search results." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-go-discover.png":::

1. In the **Discover** app, select the **logs-** index pattern if it's not already selected.

   :::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-index-pattern.png" alt-text="Elastic / Kibana screenshot showing logs in the Discover app." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-index-pattern.png":::

1. Use queries such as the ones in the following sections to help you understand your application's current and past states.

For more information about different queries, see [Guide to Kibana Query Language](https://www.elastic.co/guide/en/kibana/current/kuery-query.html).

### Show all logs from Azure Spring Apps

To review a list of application logs from Azure Spring Apps, sorted by time with the most recent logs shown first, run the following query in the **Search** box:

```query
azure_log_forwarder.resource_type : "Microsoft.AppPlatform/Spring"
```

:::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-asc-logs.png" alt-text="Elastic / Kibana screenshot showing Discover app with all logs displayed." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-asc-logs.png":::

### Show specific log types from Azure Spring Apps

To review a list of application logs from Azure Spring Apps, sorted by time with the most recent logs shown first, run the following query in the **Search** box:

```query
azure.springcloudlogs.category : "ApplicationConsole"
```

:::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-asc-app-console.png" alt-text="Elastic / Kibana screenshot showing Discover app with specific logs displayed." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-asc-app-console.png":::

### Show log entries containing errors or exceptions

To review unsorted log entries that mention an error or exception, run the following query:

```query
azure_log_forwarder.resource_type : "Microsoft.AppPlatform/Spring" and (log.level : "ERROR" or log.level : "EXCEPTION")
```

:::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-asc-error-exception.png" alt-text="Elastic / Kibana screenshot showing Discover app with error and exception logs displayed." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-asc-error-exception.png":::

The Kibana Query Language helps you form queries by providing autocomplete and suggestions to help you gain insights from the logs. Use your query to find errors, or modify the query terms to find specific error codes or exceptions.

### Show log entries from a specific service

To review log entries that are generated by a specific service, run the following query:

```query
azure.springcloudlogs.properties.service_name : "sa-petclinic-service"
```

:::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-specific-service.png" alt-text="Elastic / Kibana screenshot showing Discover app with specific-service logs displayed." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-specific-service.png":::

### Show Config Server logs containing warnings or errors

To review logs from Config Server, run the following query:

```query
azure.springcloudlogs.properties.type : "ConfigServer" and (log.level : "ERROR" or log.level : "WARN")
```

:::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-config-error-exception.png" alt-text="Elastic / Kibana screenshot showing Discover app with Config Server logs displayed." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-config-error-exception.png":::

### Show Service Registry logs

To review logs from Service Registry, run the following query:

```query
azure.springcloudlogs.properties.type : "ServiceRegistry"
```

:::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-service-registry.png" alt-text="Elastic / Kibana screenshot showing Discover app with Service Registry logs displayed." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-kql-service-registry.png":::

## Visualizing logs from Azure Spring Apps with Elastic

Kibana allows you to visualize data with Dashboards and a rich ecosystem of visualizations. For more information, see [Dashboard and Visualization](https://www.elastic.co/guide/en/kibana/current/dashboard.html).

Use the following steps to show the various log levels in your logs so you can assess the overall health of the services.

1. From the available fields list on left in **Discover**, search for *log.level* in the search box under the **logs-** index pattern.

1. Select the **log.level** field. From the floating informational panel about **log.level**, select **Visualize**.

   :::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-asc-visualize.png" alt-text="Elastic / Kibana screenshot showing Discover app showing log levels." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-asc-visualize.png":::

1. From here, you can choose to add more data from the left pane, or choose from multiple suggestions how you would like to visualize your data.

   :::image type="content" source="media/how-to-elastic-diagnostic-settings/elastic-kibana-visualize-lens.png" alt-text="Elastic / Kibana screenshot showing Discover app showing visualization options." lightbox="media/how-to-elastic-diagnostic-settings/elastic-kibana-visualize-lens.png":::

## Next steps

* [Quickstart: Deploy your first Spring Boot app in Azure Spring Apps](quickstart.md)
* [Deploy Elastic on Azure](https://www.elastic.co/blog/getting-started-with-the-azure-integration-enhancement)
