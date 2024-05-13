---
title: Monitoring data reference for Azure Communications Gateway
description: This article contains important reference material you need when you monitor Azure Communications Gateway.
ms.date: 05/13/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
---

# Azure Communications Gateway monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

Learn about the data and resources collected by Azure Monitor from your Azure Communications Gateway workspace. See [Monitor Azure Communications Gateway](monitor-azure-communications-gateway.md) for details on collecting and analyzing monitoring data for Azure Communications Gateway.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

<a name="connectivity-metrics"></a>

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

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- BotType

- Region

  The Service Locations defined in your Azure Communications Gateway resource.

- OPTIONS or INVITE

  The SIP method for responses being sent and received:

  - SIP OPTIONS responses sent and received by your Azure Communications Gateway resource to monitor its connectivity to its peers
  - SIP INVITE responses sent and received by your Azure Communications Gateway resource

## Resource logs

Azure Communications Gateway doesn't collect logs.

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

## Related content

- See [Monitor Azure Communications Gateway](monitor-azure-communications-gateway.md) for a description of monitoring Communications Gateway.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
