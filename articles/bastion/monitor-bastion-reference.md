---
title: Monitoring data reference for Azure Bastion
description: This article contains important reference material you need when you monitor Azure Bastion by using Azure Monitor.
ms.date: 08/02/2024
ms.custom: horz-monitor
ms.topic: reference
author: cherylmc
ms.author: cherylmc
ms.service: bastion
---

<!-- 
IMPORTANT 
According to the Content Pattern guidelines all comments must be removed before publication!!!
To make this template easier to use, first:
1. Search and replace [TODO-replace-with-service-name] with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_01
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- All sections are required unless otherwise noted. Add service-specific information after the includes.
Your service should have the following two articles:
1. The primary monitoring article (based on the template monitor-service-template.md)
   - Title: "Monitor [TODO-replace-with-service-name]"
   - TOC title: "Monitor"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"
2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-bastion-reference.md".
-->

# Azure Bastion monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor [TODO-replace-with-service-name]](monitor-[TODO-replace-with-service-filename].md) for details on the data you can collect for [TODO-replace-with-service-name] and how to use it.

<!-- ## Metrics -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

<!-- Repeat the following section for each resource type/namespace in your service. Replace the <ResourceType/namespace> placeholders with the resource type name. -->
### Supported metrics for \<ResourceType/namespace>
The following table lists the metrics available for the \<ResourceType/namespace> resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
<!-- Find the table(s) for the resource type in the Metrics column at https://review.learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/metrics-index?branch=main#supported-metrics-and-log-categories-by-resource-type.
Uncomment the following line. Replace the <ResourceType/namespace> and <resourcetype> placeholders with the namespace name or address. -->
<!-- [!INCLUDE [<ResourceType/namespace>](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/<resourcetype>-metrics-include.md)]
<!-- ## Metric dimensions -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

<!-- Follow with one of the following includes, depending on whether any of your metrics have dimensions 
If you have metrics with dimensions, use the following include and add a list and descriptions of the dimensions. -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]
<!-- If you DON'T have metrics with dimensions, use the following include instead: 
[!INCLUDE [horz-monitor-ref-no-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-no-metrics-dimensions.md)] -->

<!-- ## Resource logs -->
[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

<!-- Repeat the following section for each resource type/namespace in your service. 
<!-- Find the table(s) for the resource type in the Log Categories column at https://review.learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/metrics-index?branch=main#supported-metrics-and-log-categories-by-resource-type.
-->
### Supported resource logs for \<ResourceType/namespace>
<!-- Uncomment the following line. Replace the <ResourceType/namespace> and <resourcetype> placeholders with the namespace name or address. -->
<!-- [!INCLUDE [<ResourceType/namespace>](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/<resourcetype>-logs-include.md)]
<!-- ## Log tables -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

<!-- Repeat the following section for each resource type/namespace in your service. Find the table(s) for your service at https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype. 
Replace the <ResourceType/namespace> and tablename placeholders with the namespace name. -->

### [TODO-replace-with-service-name]
<ResourceType/namespace>
- [TableName](/azure/azure-monitor/reference/tables/tablename#columns)

<!-- ## Activity log
[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
Refer to https://learn.microsoft.com/azure/role-based-access-control/resource-provider-operations and add the operations for your service. Repeat the link for each resource type/namespace in your service. Replace the <Namespace> and namespace placeholders with the namespace name or link. -->
- [<Namespace> resource provider operations](/azure/role-based-access-control/resource-provider-operations#namespace)

## Related content

- See [Monitor [TODO-replace-with-service-name]](monitor-[TODO-replace-with-service-filename].md) for a description of monitoring [TODO-replace-with-service-name].
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.