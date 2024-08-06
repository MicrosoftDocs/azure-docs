---
title: Monitoring data reference for Azure Firewall
description: This article contains important reference material you need when you monitor Azure Firewall by using Azure Monitor.
ms.date: 08/08/2024
ms.custom: horz-monitor
ms.topic: reference
author: vhorne
ms.author: victorh
ms.service: azure-firewall
---
# Azure Firewall monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Firewall](monitor-firewall.md) for details on the data you can collect for Azure Firewall and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/azureFirewalls

The following table lists the metrics available for the Microsoft.Network/azureFirewalls resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/azureFirewalls](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-azurefirewalls-metrics-include.md)]

### Firewall health state

In the preceding table, the *Firewall health state* metric has two dimensions:

- Status: Possible values are *Healthy*, *Degraded*, *Unhealthy*.
- Reason: Indicates the reason for the corresponding status of the firewall.

If SNAT ports are used > 95%, they're considered exhausted and the health is 50% with status=*Degraded* and reason=*SNAT port*. The firewall keeps processing traffic and existing connections aren't affected. However, new connections might not be established intermittently.

If SNAT ports are used < 95%, then firewall is considered healthy and health is shown as 100%.

If no SNAT ports usage is reported, health is shown as 0%. 

#### SNAT port utilization

For the *SNAT port utilization* metric, when you add more public IP addresses to your firewall, more SNAT ports are available, reducing the SNAT ports utilization. Additionally, when the firewall scales out for different reasons (for example, CPU or throughput) more SNAT ports also become available.

Effectively, a given percentage of SNAT ports utilization might go down without you adding any public IP addresses, just because the service scaled out. You can directly control the number of public IP addresses available to increase the ports available on your firewall. But, you can't directly control firewall scaling.

If your firewall is running into SNAT port exhaustion, you should add at least five public IP address. This increases the number of SNAT ports available. For more information, see [Azure Firewall features](features.md#multiple-public-ip-addresses).

#### AZFW Latency Probe

The *AZFW Latency Probe* metric measures the overall or average latency of Azure Firewall in milliseconds. Administrators can use this metric for the following purposes:

- Diagnose if Azure Firewall is the cause of latency in the network
- Monitor and alert if there are any latency or performance issues, so IT teams can proactively engage.  
- There might be various reasons that can cause high latency in Azure Firewall. For example, high CPU utilization, high throughput, or a possible networking issue.

  This metric doesn't measure end-to-end latency of a given network path. In other words, this latency health probe doesn't measure how much latency Azure Firewall adds.

- When the latency metric isn't functioning as expected, a value of 0 appears in the metrics dashboard.
- As a reference, the average expected latency for a firewall is approximately 1 ms. This value might vary depending on deployment size and environment.
- The latency probe is based on Microsoft's Ping Mesh technology. So, intermittent spikes in the latency metric are to be expected. These spikes are normal and don't signal an issue with the Azure Firewall. They're part of the standard host networking setup that supports the system.

  As a result, if you experience consistent high latency that last longer than typical spikes, consider filing a Support ticket for assistance.

  :::image type="content" source="media/metrics/latency-probe.png" alt-text="Screenshot showing the Azure Firewall Latency Probe metric.":::

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- Protocol
- Reason
- Status

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/azureFirewalls

[!INCLUDE [Microsoft.Network/azureFirewalls](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-azurefirewalls-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure Firewall Microsoft.Network/azureFirewalls 

- [AZFWNetworkRule](/azure/azure-monitor/reference/tables/azfwnetworkrule#columns)
- [AZFWFatFlow](/azure/azure-monitor/reference/tables/azfwfatflow#columns)
- [AZFWFlowTrace](/azure/azure-monitor/reference/tables/azfwflowtrace#columns)
- [AZFWApplicationRule](/azure/azure-monitor/reference/tables/azfwapplicationrule#columns)
- [AZFWThreatIntel](/azure/azure-monitor/reference/tables/azfwthreatintel#columns)
- [AZFWNatRule](/azure/azure-monitor/reference/tables/azfwnatrule#columns)
- [AZFWIdpsSignature](/azure/azure-monitor/reference/tables/azfwidpssignature#columns)
- [AZFWDnsQuery](/azure/azure-monitor/reference/tables/azfwdnsquery#columns)
- [AZFWInternalFqdnResolutionFailure](/azure/azure-monitor/reference/tables/azfwinternalfqdnresolutionfailure#columns)
- [AZFWNetworkRuleAggregation](/azure/azure-monitor/reference/tables/azfwnetworkruleaggregation#columns)
- [AZFWApplicationRuleAggregation](/azure/azure-monitor/reference/tables/azfwapplicationruleaggregation#columns)
- [AZFWNatRuleAggregation](/azure/azure-monitor/reference/tables/azfwnatruleaggregation#columns)
- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Networking resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftnetwork)

## Related content

- See [Monitor Azure Firewall](monitor-firewall.md) for a description of monitoring Azure Firewall.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
