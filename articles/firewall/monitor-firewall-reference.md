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

Azure Firewall has two new diagnostics logs you can use to help monitor your firewall:

- Top flows
- Flow trace

## Top flows

The top flows log, known in the industry and in the preceding table as *Azure Firewall Fat Flow Log*, shows the top connections that are contributing to the highest throughput through the firewall.

> [!TIP]
> Activate Top flows logs only when troubleshooting a specific issue to avoid excessive CPU usage of Azure Firewall.
>

The flow rate is defined as the data transmission rate in megabits per second units. It's a measure of the amount of digital data that can be transmitted over a network in a period of time through the firewall. The Top Flows protocol runs periodically every three minutes. The minimum threshold to be considered a Top Flow is 1 Mbps.

Enable the Top flows log using the following Azure PowerShell commands:

```azurepowershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $true
Set-AzFirewall -AzureFirewall $firewall
```

To disable the logs, use the same previous Azure PowerShell command and set the value to *False*. 

For example:

```azurepowershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $false
Set-AzFirewall -AzureFirewall $firewall
```

There are a few ways to verify the update was successful, but you can navigate to firewall **Overview** and select **JSON view** on the top right corner. Here’s an example:

:::image type="content" source="media/enable-top-ten-and-flow-trace/firewall-log-verification.png" alt-text="Screenshot of JSON showing additional log verification.":::

To create a diagnostic setting and enable Resource Specific Table, see [Create diagnostic settings in Azure Monitor](../azure-monitor/essentials/create-diagnostic-settings.md).

The firewall logs show traffic through the firewall in the first attempt of a TCP connection, known as the *SYN* packet. However, this doesn't show the full journey of the packet in the TCP handshake. As a result, it's difficult to troubleshoot if a packet is dropped, or asymmetric routing occurred. The Azure Firewall Flow Trace Log addresses this concern.

> [!TIP]
> To avoid excessive disk usage caused by Flow trace logs in Azure Firewall with many short-lived connections, activate the logs only when troubleshooting a specific issue for diagnostic purposes.

The following additional properties can be added:

- SYN-ACK: ACK flag that indicates acknowledgment of SYN packet.

- FIN: Finished flag of the original packet flow. No more data is transmitted in the TCP flow.

- FIN-ACK: ACK flag that indicates acknowledgment of FIN packet.

- RST: The Reset the flag indicates the original sender doesn't receive more data.

- INVALID (flows): Indicates packet can’t be identified or don't have any state.

  For example:

  - A TCP packet lands on a Virtual Machine Scale Sets instance, which doesn't have any prior history for this packet
  - Bad CheckSum packets
  - Connection Tracking table entry is full and new connections can't be accepted
  - Overly delayed ACK packets

Enable the Flow trace log using the following Azure PowerShell commands or navigate in the portal and search for **Enable TCP Connection Logging**:

```powershell
Connect-AzAccount 
Select-AzSubscription -Subscription <subscription_id> or <subscription_name>
Register-AzProviderFeature -FeatureName AFWEnableTcpConnectionLogging -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

It can take several minutes for this to take effect. Once the feature is registered, consider performing an update on Azure Firewall for the change to take effect immediately.

To check the status of the AzResourceProvider registration, you can run the Azure PowerShell command:

```powershell
Get-AzProviderFeature -FeatureName "AFWEnableTcpConnectionLogging" -ProviderNamespace "Microsoft.Network"
```

To disable the log, you can unregister it using the following command or select unregister in the previous portal example.

```powershell
Unregister-AzProviderFeature -FeatureName AFWEnableTcpConnectionLogging -ProviderNamespace Microsoft.Network
```

To create a diagnostic setting and enable Resource Specific Table, see [Create diagnostic settings in Azure Monitor](../azure-monitor/essentials/create-diagnostic-settings.md).

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
