---
title: Monitor Azure Bastion
description: Start here to learn how to monitor Azure Bastion by using Azure Monitor. Learn about collecting data and tools you can use to analyze data.
ms.date: 12/02/2024
ms.custom: horz-monitor
ms.topic: concept-article
author: abell
ms.author: abell
ms.service: azure-bastion
# Customer intent: As a cloud administrator, I want to monitor Azure Bastion using Azure Monitor so that I can collect and analyze performance data and logs to ensure system reliability and optimize resource management.
---

# Monitor  Azure Bastion

[!INCLUDE [azmon-horz-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-intro.md)]

## Collect data with Azure Monitor

This table describes how you can collect data to monitor your service, and what you can do with the data once collected:

|Data to collect|Description|How to collect and route the data|Where to view the data|Supported data|
|---------|---------|---------|---------|---------|
|Metric data|Metrics are numerical values that describe an aspect of a system at a particular point in time. Metrics can be aggregated using algorithms, compared to other metrics, and analyzed for trends over time.|[- Collected automatically at regular intervals.</br> - You can route some platform metrics to a Log Analytics workspace to query with other data. Check the **DS export** setting for each metric to see if you can use a diagnostic setting to route the metric data.]|[Metrics explorer](/azure/azure-monitor/essentials/metrics-getting-started)| [Azure Bastion metrics supported by Azure Monitor](monitor-bastion-reference.md#metrics)|
|Resource log data|Logs are recorded system events with a timestamp. Logs can contain different types of data, and be structured or free-form text. You can route resource log data to Log Analytics workspaces for querying and analysis.|[Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to collect and route resource log data.| [Log Analytics](/azure/azure-monitor/learn/quick-create-workspace)|[Azure Bastion resource log data supported by Azure Monitor](monitor-bastion-reference.md#resource-logs)  |
|Activity log data|The Azure Monitor activity log provides insight into subscription-level events. The activity log includes information like when a resource is modified or a virtual machine is started.|- Collected automatically.</br> - [Create a diagnostic setting](/azure/azure-monitor/essentials/create-diagnostic-settings) to a Log Analytics workspace at no charge.|[Activity log](/azure/azure-monitor/essentials/activity-log)|  |

[!INCLUDE [azmon-horz-supported-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-supported-data.md)]

[!INCLUDE [azmon-horz-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-tools.md)]

[!INCLUDE [azmon-horz-export-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-export-data.md)]

[!INCLUDE [azmon-horz-kusto](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-kusto.md)]

[!INCLUDE [azmon-horz-alerts-part-one](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-one.md)]

[!INCLUDE [azmon-horz-alerts-part-two](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-alerts-part-two.md)]

[!INCLUDE [azmon-horz-advisor](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/azmon-horz-advisor.md)]

## Related content

- See [Azure Bastion monitoring data reference](monitor-bastion-reference.md) for a reference of the metrics, logs, and other important values created for Azure Bastion.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
