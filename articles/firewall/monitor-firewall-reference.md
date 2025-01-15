---
title: Monitoring data reference for Azure Firewall
description: This article contains important reference material you need when you monitor Azure Firewall by using Azure Monitor.
ms.date: 10/26/2024
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

If SNAT ports are used more than 95%, they're considered exhausted and the health is 50% with status=*Degraded* and reason=*SNAT port*. The firewall keeps processing traffic and existing connections aren't affected. However, new connections might not be established intermittently.

If SNAT ports are used less than 95%, then firewall is considered healthy and health is shown as 100%.

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

**What the AZFW Latency Probe Metric Measures (and Doesn't):**

- What it measures: The latency of the Azure Firewall within the Azure platform
- What it doesn't measure: The metric does not capture end-to-end latency for the entire network path. Instead, it reflects the performance within the firewall, rather than how much latency Azure Firewall introduces into the network. 
- Error reporting: If the latency metric isn't functioning correct, it reports a value of 0 in the metrics dashboard, indicating a probe failure or interruption.

**Factors that impact latency:**
- High CPU utilization
- High throughput or traffic load
- Networking issues within the Azure platform

**Latency Probes: From ICMP to TCP**
The latency probe currently uses Microsoft's Ping Mesh technology, which is based on ICMP (Internet Control Message Protocol). ICMP is suitable for quick health checks, like ping requests, but it may not accurately represent real-world application traffic, which typically relis on TCP.However, ICMP probes prioritize differently across the Azure platform, which can result in variation across SKUs. To reduce these discrepancies, Azure Firewall plans to transition to TCP-based probes. 

- Latency spikes: With ICMP probes, intermittent spikes are normal and are part of the host network's standard behavior. These should not be misinterpreted as firewall issues unless they are persistent.
- Average latency: On average, the latency of Azure Firewall is expected to range from 1ms to 10 ms, depending on the Firewall SKU and deployment size.

**Best Practices for Monitoring Latency**
- Set a baseline: Establish a latency baseline under light traffic conditions for accurate comparisons during normal or peak usage.
- Monitor for patterns: Expect occasional latency spikes as part of normal operations. If high latency persists beyond these normal variations, it may indicate a deeper issue requiring investigation.
- Recommended latency threshold: A recommended guideline is that latency should not exceed 3x the baseline. If this threshold is crossed, further investigation is recommended.
- Check the rule limit: Ensure that the network rules are within the 20K rule limit. Exceeding this limit can affect performance. 
- New application onboarding: Check for any newly onboarded applications that could be adding significant load or causing latency issues.
- Support request: If you observe continuous latency degredation that does not align with expected behavior, consider filing a support ticket for further assistance. 

  :::image type="content" source="media/metrics/latency-probe.png" alt-text="Screenshot showing the Azure Firewall Latency Probe metric.":::

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- Protocol
- Reason
- Status

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/azureFirewalls

[!INCLUDE [Microsoft.Network/azureFirewalls](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-azurefirewalls-logs-include.md)]

Azure Firewall has two new diagnostic logs that can help monitor your firewall, but these logs currently do not show application rule details.
- Top flows
- Flow trace



## Top flows

The top flows log is known in the industry as *fat flow log* and in the preceding table as *Azure Firewall Fat Flow Log*. The top flows log shows the top connections that are contributing to the highest throughput through the firewall.

> [!TIP]
> Activate Top flows logs only when troubleshooting a specific issue to avoid excessive CPU usage of Azure Firewall.
>

The flow rate is defined as the data transmission rate in megabits per second units. It's a measure of the amount of digital data that can be transmitted over a network in a period of time through the firewall. The Top Flows protocol runs periodically every three minutes. The minimum threshold to be considered a Top Flow is 1 Mbps.

Enable the Top flows log using the following Azure PowerShell commands:

```powershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $true
Set-AzFirewall -AzureFirewall $firewall
```

To disable the logs, use the same previous Azure PowerShell command and set the value to *False*. 

For example:

```powershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $false
Set-AzFirewall -AzureFirewall $firewall
```

There are a few ways to verify the update was successful, but you can navigate to firewall **Overview** and select **JSON view** on the top right corner. Here’s an example:

:::image type="content" source="media/enable-top-ten-and-flow-trace/firewall-log-verification.png" alt-text="Screenshot of JSON showing additional log verification.":::

To create a diagnostic setting and enable Resource Specific Table, see [Create diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/create-diagnostic-settings).

## Flow trace

The firewall logs show traffic through the firewall in the first attempt of a TCP connection, known as the *SYN* packet. However, such an entry doesn't show the full journey of the packet in the TCP handshake. As a result, it's difficult to troubleshoot if a packet is dropped, or asymmetric routing occurred. The Azure Firewall Flow Trace Log addresses this concern.

> [!TIP]
> To avoid excessive disk usage caused by Flow trace logs in Azure Firewall with many short-lived connections, activate the logs only when troubleshooting a specific issue for diagnostic purposes.

The following properties can be added:

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

It can take several minutes for this change to take effect. Once the feature is registered, consider performing an update on Azure Firewall for the change to take effect immediately.

To check the status of the AzResourceProvider registration, you can run the Azure PowerShell command:

```powershell
Get-AzProviderFeature -FeatureName "AFWEnableTcpConnectionLogging" -ProviderNamespace "Microsoft.Network"
```

To disable the log, you can unregister it using the following command or select unregister in the previous portal example.

```powershell
Unregister-AzProviderFeature -FeatureName AFWEnableTcpConnectionLogging -ProviderNamespace Microsoft.Network
```

To create a diagnostic setting and enable Resource Specific Table, see [Create diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/create-diagnostic-settings).

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
