---
title: Monitoring data reference for Azure Communications Gateway
description: This article contains important reference material you need when you monitor Azure Communications Gateway.
ms.date: 05/08/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
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

# Azure Communications Gateway monitoring data reference

<!-- Intro. -->
[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

Learn about the data and resources collected by Azure Monitor from your Azure Communications Gateway workspace. See [Monitor Azure Communications Gateway](monitor-azure-communications-gateway.md) for details on collecting and analyzing monitoring data for Azure Communications Gateway.

<!-- ## Metrics -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.VoiceServices/communicationsGateways

The following table lists the metrics available for the Microsoft.VoiceServices/communicationsGateways resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.VoiceServices/communicationsGateways](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-voiceservices-communicationsgateways-metrics-include.md)]

The automatically collected metrics for Azure Communications Gateway include the following types:

- Error metrics: Errors.

  - Active Call Failures

- Traffic metrics: Metrics related to traffic.

  - Active Calls
  - Active Emergency Calls

- Connectivity metrics: Metrics related to the connection between your network and the Communications Gateway resource.

  - SIP 2xx Responses Received
  - SIP 2xx Responses Sent
  - SIP 3xx Responses Received
  - SIP 3xx Responses Sent
  - SIP 4xx Responses Received
  - SIP 4xx Responses Sent
  - SIP 5xx Responses Received
  - SIP 5xx Responses Sent
  - SIP 6xx Responses Received
  - SIP 6xx Responses Sent

<!-- ## Metric dimensions -->
[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]


[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

 <!-- not what the table says - no OPTIONS or INVITE -->

| Dimension name | Description |
| ------------------- | ----------------- |
| **Region** | The Service Locations defined in your Azure Communications Gateway resource. |
| **OPTIONS or INVITE** | The SIP method for responses being sent and received:<br>- SIP OPTIONS responses sent and received by your Azure Communications Gateway resource to monitor its connectivity to its peers<br>- SIP INVITE responses sent and received by your Azure Communications Gateway resource. |

<!-- ## Resource logs -->

## Resource logs

Azure Communications Gateway doesn't collect logs.

<!-- 
[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

<!-- Repeat the following section for each resource type/namespace in your service. 
<!-- Find the table(s) for the resource type in the Log Categories column at https://review.learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/metrics-index?branch=main#supported-metrics-and-log-categories-by-resource-type.
-->

<!-- NO LOG CATEGORIES FOR THIS SERVICE IN TABLE. 
### Supported resource logs for \<ResourceType/namespace>  -->
<!-- Uncomment the following line. Replace the <ResourceType/namespace> and <resourcetype> placeholders with the namespace name or address. -->
<!-- [!INCLUDE [<ResourceType/namespace>](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/<resourcetype>-logs-include.md)]

<!-- ## Log tables -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

<!-- Repeat the following section for each resource type/namespace in your service. Find the table(s) for your service at https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype. 
Replace the <ResourceType/namespace> and tablename placeholders with the namespace name. -->
<!-- NO LOG TABLES 
### [TODO-replace-with-service-name]
<ResourceType/namespace>
- [TableName](/azure/azure-monitor/reference/tables/tablename#columns)

<!-- ## Activity log 

NO ACTIVITY LOG

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

Refer to https://learn.microsoft.com/azure/role-based-access-control/resource-provider-operations and add the operations for your service. Repeat the link for each resource type/namespace in your service. Replace the <Namespace> and namespace placeholders with the namespace name or link. -->
<!-- [<Namespace> resource provider operations](/azure/role-based-access-control/resource-provider-operations#namespace)
--> 
## Related content

- See [Monitor Azure Communications Gateway](monitor-azure-communications-gateway.md) for a description of monitoring Communications Gateway.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
