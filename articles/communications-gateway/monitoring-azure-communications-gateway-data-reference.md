---
title: Monitoring data reference for Azure Communications Gateway
description: This article contains important reference material you need when you monitor Azure Communications Gateway.
ms.date: 06/17/2024
ms.custom: horz-monitor
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

[!INCLUDE [Microsoft.VoiceServices/communicationsGateways](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-voiceservices-communicationsgateways-metrics-include.md)]

Of the metrics described in the preceding table, the following are automatically collected for Azure Communications Gateway:

| Metric | Description |
|:-------|:------------|
| Active Call Failures | Percentage of active calls that fail. This metric includes, for example, calls where the media is dropped and calls that are torn down unexpectedly. |
| Active Calls | Count of the total number of active calls. |
| Active Emergency Calls |Count of the total number of active emergency calls.|
| SIP 2xx Responses Received | Count of the total number of SIP 2xx responses received for OPTIONS and INVITEs.|
| SIP 2xx Responses Sent | Count of the total number of SIP 2xx responses sent for OPTIONS and INVITEs.|
| SIP 3xx Responses Received | Count of the total number of SIP 3xx responses received for OPTIONS and INVITEs.|
| SIP 3xx Responses Sent | Count of the total number of SIP 3xx responses sent for OPTIONS and INVITEs.|
| SIP 4xx Responses Received | Count of the total number of SIP 4xx responses received for OPTIONS and INVITEs.|
| SIP 4xx Responses Sent | Count of the total number of SIP 4xx responses sent for OPTIONS and INVITEs.|
| SIP 5xx Responses Received | Count of the total number of SIP 5xx responses received for OPTIONS and INVITEs.|
| SIP 5xx Responses Sent | Count of the total number of SIP 5xx responses sent for OPTIONS and INVITEs.|
| SIP 6xx Responses Received | Count of the total number of SIP 6xx responses received for OPTIONS and INVITEs.|
| SIP 6xx Responses Sent | Count of the total number of SIP 6xx responses sent for OPTIONS and INVITEs.|

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
