---
title: Monitor Azure Front Door
description: Learn how to monitor Azure Front Door using Azure Monitor, including data collection, analysis, and alerting.
ms.date: 01/21/2025
ms.custom: horz-monitor
ms.topic: conceptual
author: duongau
ms.author: duau
ms.service: azure-frontdoor
---

<!-- 
According to the Content Pattern guidelines, all comments must be removed before publication!!!
IMPORTANT 
When using this template, first:
1. Search and replace [TODO-replace-with-service-name] with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 4.0 November 2024
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- Add service-specific information after the includes.
Your service should have the following two articles:
1. The overview monitoring article (based on this template)
   - Title: "Monitor [TODO-replace-with-service-name]"
   - TOC title: "Monitor [TODO-replace-with-service-name]"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"
2. A reference article that lists all the metrics and logs for your service (based on the template data-reference-template.md).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Monitor Azure Front Door

[!INCLUDE [azmon-horz-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-intro.md)]

## Collect data with Azure Monitor

This table describes how you can collect data to monitor your service, and what you can do with the data once collected:

|Data to collect|Description|How to collect and route the data|Where to view the data|Supported data|
|---------|---------|---------|---------|---------|
|Metric data|Metrics are numerical values that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|- Collected automatically at regular intervals.</br> - You can route some platform metrics to a Log Analytics workspace to query with other data. Check the **DS export** setting for each metric to see if you can use a diagnostic setting to route the metric data.|[Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started)| [Azure Front Door metrics supported by Azure Monitor](monitor-front-door-reference.md#metrics)|
|Resource log data|Logs are recorded system events with a timestamp. Logs can contain different types of data, and be structured or free-form text. You can route resource log data to Log Analytics workspaces for querying and analysis.|[Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect and route resource log data.| [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace)|[Azure Front Door resource log data supported by Azure Monitor](monitor-front-door-reference.md#resource-logs)  |
|Activity log data|The Azure Monitor activity log provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|- Collected automatically.</br> - [Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to a Log Analytics workspace at no charge.|[Activity log](/azure/azure-monitor/essentials/activity-log)|  |

[!INCLUDE [azmon-horz-supported-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-supported-data.md)]

## Built in monitoring for Azure Front Door

<!-- Add any monitoring mechanisms build in to your service here. -->

<!--## Use Azure Monitor tools to analyze the data-->
[!INCLUDE [azmon-horz-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-tools.md)]

<!--## Export Azure Monitor data -->
[!INCLUDE [azmon-horz-export-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-export-data.md)]

<!--## Use Kusto queries to analyze log data -->
[!INCLUDE [azmon-horz-kusto](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-kusto.md)]

### Recommended Kusto queries for Azure Front Door

<!-- Add any recommended Kusto queries here. -->

<!-- Add any links to community resources with sample Kusto queries here. -->

<!-- ## Use Azure Monitor alerts to notify you of issues -->
[!INCLUDE [azmon-horz-alerts-part-one](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-one.md)]

<!-- Add any recommended alert rules here. -->
### Recommended Azure Monitor alert rules for Azure Front Door

The following table lists common and recommended alert rules for Azure Front Door.

| Alert type | Condition | Examples  |
|:---|:---|:---|
| Metric | |  |
| Log search |  | |
| Activity Log | | |
| Service Health | | |
| Resource Health | | |

[!INCLUDE [azmon-horz-alerts-part-two](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-two.md)]

<!-- ## Get personalized recommendations using Azure Advisor -->
[!INCLUDE [azmon-horz-advisor](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-advisor.md)]

## Related content

- [Azure Front Door monitoring data reference](monitor-front-door-reference.md) 
- [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource)
