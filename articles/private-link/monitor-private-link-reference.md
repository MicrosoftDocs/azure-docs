---
title: Monitoring data reference for Azure Private Link
description: This article contains important reference material you need when you monitor Azure Private Link by using Azure Monitor.
ms.date: 12/16/2024
ms.custom: horz-monitor
ms.topic: reference
author: davidsmatlak
ms.author: davidsmatlak
ms.service: azure-private-link
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
   - TOC title: "Monitor [TODO-replace-with-service-name]"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"
2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Azure Private Link monitoring data reference

<!-- Intro. -->
[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Private Link](monitor-private-link.md) for details on the data you can collect for Private Link and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

<!-- Repeat the following section for each resource type/namespace in your service. Replace the <ResourceType/namespace> placeholders with the resource type name. -->

### Supported metrics for Microsoft.Network/privateLinkServices

The following table lists the metrics available for the Microsoft.Network/privateLinkServices resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [<ResourceType/namespace>](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-privatelinkservices-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- PrivateLinkServiceIPAddress

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

<!-- Repeat the following section for each resource type/namespace in your service. Find the table(s) for your service at https://learn.microsoft.com/azure/azure-monitor/reference/tables-index. 
Replace the <ResourceType/namespace> and tablename placeholders with the namespace name. -->

### Private Link <ResourceType/namespace>
- [TableName](/azure/azure-monitor/reference/tables/tablename#columns)

<!-- ## Activity log
[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
Refer to https://learn.microsoft.com/azure/role-based-access-control/resource-provider-operations and add the operations for your service. Repeat the link for each resource type/namespace in your service. Replace the <Namespace> and namespace placeholders with the namespace name or link. -->
- [<Namespace> resource provider operations](/azure/role-based-access-control/resource-provider-operations#namespace)

## Related content

- See [Monitor Azure Private Link](monitor-private-link.md) for a description of monitoring Private Link.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.