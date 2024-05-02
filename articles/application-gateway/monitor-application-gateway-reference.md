---
title: Monitoring data reference for Azure Application Gateway
description: This article contains important reference material you need when you monitor Azure Application Gateway.
ms.date: 05/06/2024
ms.custom: horz-monitor
ms.topic: reference
author: greg-lindsay
ms.author: greglin
ms.service: application-gateway
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
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Azure Application Gateway monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Application Gateway](monitor-application-gateway.md) for details on the data you can collect for Application Gateway and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/applicationGateways

The following table lists the metrics available for the Microsoft.Network/applicationGateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE[Microsoft.Network/applicationgateways](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-network-applicationgateways-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

<!-- Follow with one of the following includes, depending on whether any of your metrics have dimensions 
If you have metrics with dimensions, use the following include and add a list and descriptions of the dimensions. -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]



[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/applicationGateways

[!INCLUDE [Microsoft.Network/applicationgateways](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-network-applicationgateways-logs-include.md)]

## Log tables

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Application Gateway Microsoft.Network/applicationGateways

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AGWAccessLogs](/azure/azure-monitor/reference/tables/agwaccesslogs#columns)
- [AGWPerformanceLogs](/azure/azure-monitor/reference/tables/agwperformancelogs#columns)
- [AGWFirewallLogs](/azure/azure-monitor/reference/tables/agwfirewalllogs#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [applicationGateways resource provider operations](/azure/role-based-access-control/resource-provider-operations#networking)

## Related content

- See [Monitor Azure Application Gateway](monitor-application-gateway.md) for a description of monitoring Application Gateway.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
