---
title: Monitoring data reference for Azure Firewall
description: This article contains important reference material you need when you monitor Azure Firewall by using Azure Monitor.
ms.date: 09/29/2025
ms.custom: horz-monitor
ms.topic: reference
author: duongau
ms.author: duau
ms.service: azure-firewall
# Customer intent: As a network administrator, I want to monitor metrics and logs for Azure Firewall, so that I can ensure its performance and proactively identify any issues affecting traffic management.
---
# Azure Firewall monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Firewall](monitor-firewall.md) for details on the data you can collect for Azure Firewall and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Network/azureFirewalls

The following table lists the metrics available for the Microsoft.Network/azureFirewalls resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Network/azureFirewalls](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-network-azurefirewalls-metrics-include.md)]


### Observed capacity

The Observed Capacity metric is the primary tool for understanding how your firewall is scaling in practice.

#### Best practices for using Observed Capacity

- **Validate your prescaling setup:** Confirm that your firewall consistently maintains the minCapacity you defined.
- **Track real-time scaling behavior:** Use the Avg aggregation to see real-time capacity units.
- **Forecast future needs:** Combine historical Observed Capacity with traffic trends (for example, monthly spikes or seasonal events) to refine your capacity planning.
- **Set proactive alerts:** Configure Azure Monitor alerts on Observed Capacity thresholds (for example, alert when scaling exceeds 80% of maxCapacity).
- **Correlate with performance metrics:** Pair Observed Capacity with Throughput, Latency Probe, and SNAT Port Utilization to diagnose whether scaling keeps up with demand.


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

If your firewall is running into SNAT port exhaustion, you should add at least five public IP addresses. This increases the number of SNAT ports available. For more information, see [Azure Firewall features](features.md#multiple-public-ip-addresses).

#### AZFW Latency Probe

The AZFW Latency Probe metric measures the overall or average latency of Azure Firewall in milliseconds. Administrators can use this metric for the following purposes:

- Diagnose whether Azure Firewall causes latency in the network
- Monitor and alert for latency or performance issues, so IT teams can proactively engage
- Identify various factors that can cause high latency in Azure Firewall, such as high CPU utilization, high throughput, or networking issues

#### What the AZFW Latency Probe metric measures

- **Measures:** The latency of Azure Firewall within the Azure platform
- **Doesn't measure:** End-to-end latency for the entire network path. The metric reflects the performance within the firewall rather than the latency Azure Firewall introduces into the network
- **Error reporting:** If the latency metric isn't functioning correctly, it reports a value of 0 in the metrics dashboard, indicating a probe failure or interruption

#### Factors that impact latency

Several factors can affect firewall latency:

- High CPU utilization
- High throughput or traffic load
- Networking issues within the Azure platform

#### Latency probes: From ICMP to TCP

The latency probe currently uses Microsoft's Ping Mesh technology, which is based on ICMP (Internet Control Message Protocol). ICMP is suitable for quick health checks, such as ping requests, but it might not accurately represent real-world application traffic, which typically relies on TCP. However, ICMP probes prioritize differently across the Azure platform, which can result in variation across SKUs. To reduce these discrepancies, Azure Firewall plans to transition to TCP-based probes.

**Important considerations:**

- **Latency spikes:** With ICMP probes, intermittent spikes are normal and part of the host network's standard behavior. Don't misinterpret these spikes as firewall issues unless they persist.
- **Average latency:** On average, Azure Firewall latency ranges from 1 ms to 10 ms, depending on the Firewall SKU and deployment size.

#### Best practices for monitoring latency
- Set a baseline: Establish a latency baseline under light traffic conditions for accurate comparisons during normal or peak usage.

  > [!NOTE]
  > When establishing your baseline, expect occasional metric spikes due to recent infrastructure changes. These temporary spikes are normal and result from metric reporting adjustments, not actual issues. Only submit a support request if spikes persist over time.
  
- Monitor for patterns: Expect occasional latency spikes as part of normal operations. If high latency persists beyond these normal variations, it may indicate a deeper issue requiring investigation.
- Recommended latency threshold: A recommended guideline is that latency should not exceed 3x the baseline. If this threshold is crossed, further investigation is recommended.
- Check the rule limit: Ensure that the network rules are within the 20K rule limit. Exceeding this limit can affect performance. 
- New application onboarding: Check for any newly onboarded applications that could be adding significant load or causing latency issues.
- Support request: If you observe continuous latency degradation that does not align with expected behavior, consider filing a support ticket for further assistance. 

  :::image type="content" source="media/metrics/latency-probe.png" alt-text="Screenshot showing the Azure Firewall Latency Probe metric.":::

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- Protocol
- Reason
- Status

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Network/azureFirewalls

[!INCLUDE [Microsoft.Network/azureFirewalls](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-network-azurefirewalls-logs-include.md)]

## DNS Flow Trace Logs

The DNS Flow Trace logs provide deeper visibility into DNS activity, helping administrators troubleshoot resolution issues and verify traffic behavior.

Previously, DNS Proxy logging was limited to:

- **AZFWDNSQuery** - the initial client query
- **AZFWInternalFqdnResolutionFailure** - FQDN resolution failures

With the DNS flow trace logs, administrators can trace the complete DNS resolution flow from the client query through Azure Firewall as a DNS proxy, to the external DNS server, and back to the client.

### DNS resolution stages

The logs capture the following stages:

1. **Client query**: The initial DNS query sent by the client
2. **Forwarder query**: Azure Firewall forwarding the query to an external DNS server (if not cached)
3. **Forwarder response**: The DNS server's response to Azure Firewall
4. **Client response**: The final resolved response from Azure Firewall back to the client

The following diagram shows a high-level visual representation of the DNS query flow:

:::image type="content" source="media/dns-proxy/dns-query-flow.png" alt-text="Diagram showing DNS query flow from client through Azure Firewall to external DNS server and back.":::

These logs provide valuable insights, such as:

- The DNS server queried
- Resolved IP addresses
- Whether the Azure Firewall cache was used

### Enabling DNS Flow Trace Logs

Before setting up DNS Flow Trace Logs, you must first enable the feature using Azure PowerShell.

#### Enable logs (prerequisite)

Run the following commands in Azure PowerShell, replacing placeholders with your values:

```powershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableDnstapLogging = $true
Set-AzFirewall -AzureFirewall $firewall
```

#### Disable logs (optional)

To disable the logs, use the same previous Azure PowerShell command and set the value to *False*:

```powershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableDnstapLogging = $false
Set-AzFirewall -AzureFirewall $firewall
```

### Configure DNS proxy and DNS flow trace logs

Use the following steps to configure DNS proxy and enable DNS flow trace logs:

1. **Enable DNS proxy:**
    1. Navigate to Azure Firewall DNS settings and enable DNS Proxy.
    2. Configure a custom DNS server or use the default Azure DNS.
    3. Navigate to Virtual Network DNS settings and set the Firewall's private IP as the primary DNS server.

2. **Enable DNS flow trace logs:**
    1. Navigate to Azure Firewall in the Azure portal.
    2. Select **Diagnostic settings** under **Monitoring**.
    3. Choose an existing diagnostic setting or create a new one.
    4. Under the **Log** section, select **DNS Flow Trace Logs**.
    5. Choose your desired destination (Log Analytics or Storage Account).
    
    > [!NOTE]
    > DNS Flow Trace Logs are not supported with Event Hub as a destination.
    
    6. Save the settings.

3. **Test the configuration:**
    1. Generate DNS queries from clients and verify the logs in the chosen destination.

### Understand the logs

Each log entry corresponds to a specific stage in the DNS resolution process. The following table describes the log types and key fields:

Type | Description | Key Fields
--- | --- | ---
`Client Query` | The initial DNS query sent by the client. | `SourceIp`: The client's internal IP address making the DNS request, `QueryMessage`: The full DNS query payload, including the requested domain
`Forwarder Query` | Azure Firewall forwarding the DNS query to an external DNS server (if not cached). | `ServerIp`: The IP address of the external DNS server that receives the query, `QueryMessage`: The forwarded DNS query payload, identical or based on the client request    
`Forwarder Response` | The DNS server's response to Azure Firewall. | `ServerMessage`: The DNS response payload from the external server., `AnswerSection`: Contains resolved IP addresses, CNAMEs, and any DNSSEC validation results (if applicable).
`Client Response` | The final resolved response from Azure Firewall back to the client. | `ResolvedIp`: The IP address (or addresses) resolved for the queried domain., `ResponseTime`: The total time taken to resolve the query, measured from the client’s request to the returned answer

The above fields are only a subset of the available fields in each log entry.

Key notes:
- If the DNS cache is used, only **Client Query** and **Client Response** entries are generated.
- Logs include standard metadata such as timestamps, source/destination IPs, protocols, and DNS message content.
- To avoid excessive log volume in environments with many short-lived queries, enable additional DNS Proxy logs only when deeper DNS troubleshooting is required.


## Top flows

The top flows log is known in the industry as *fat flow log* and in the preceding table as *Azure Firewall Fat Flow Log*. The top flows log shows the top connections that contribute to the highest throughput through the firewall.

> [!TIP]
> Activate Top flows logs only when troubleshooting a specific issue to avoid excessive CPU usage of Azure Firewall.

The flow rate is defined as the data transmission rate in megabits per second units. It's a measure of the amount of digital data that can be transmitted over a network in a period of time through the firewall. The Top Flows protocol runs periodically every three minutes. The minimum threshold to be considered a Top Flow is 1 Mbps.

#### Enable Top flows logs

Use the following Azure PowerShell commands to enable Top flows logs:

```powershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $true
Set-AzFirewall -AzureFirewall $firewall
```

#### Disable Top flows logs

To disable the logs, use the same Azure PowerShell command and set the value to *False*. For example:

```powershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $false
Set-AzFirewall -AzureFirewall $firewall
```

#### Verify the configuration

There are multiple ways to verify the update was successful. Navigate to the firewall **Overview** and select **JSON view** on the top right corner. Here's an example:

:::image type="content" source="media/enable-top-ten-and-flow-trace/firewall-log-verification.png" alt-text="Screenshot of JSON showing additional log verification.":::

To create a diagnostic setting and enable Resource Specific Table, see [Create diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/create-diagnostic-settings).

## Flow trace

The firewall logs show traffic through the firewall in the first attempt of a TCP connection, known as the *SYN* packet. However, such an entry doesn't show the full journey of the packet in the TCP handshake. As a result, it's difficult to troubleshoot if a packet is dropped or asymmetric routing occurred. The Azure Firewall Flow Trace Log addresses this concern.

> [!TIP]
> To avoid excessive disk usage caused by Flow trace logs in Azure Firewall with many short-lived connections, activate the logs only when troubleshooting a specific issue for diagnostic purposes.

#### Flow trace properties

The following properties can be added:

- **SYN-ACK**: ACK flag that indicates acknowledgment of SYN packet.
- **FIN**: Finished flag of the original packet flow. No more data is transmitted in the TCP flow.
- **FIN-ACK**: ACK flag that indicates acknowledgment of FIN packet.
- **RST**: The Reset flag indicates the original sender doesn't receive more data.
- **INVALID (flows)**: Indicates packet can't be identified or doesn't have any state.

  For example:

  - A TCP packet lands on a Virtual Machine Scale Sets instance, which doesn't have any prior history for this packet
  - Bad CheckSum packets
  - Connection Tracking table entry is full and new connections can't be accepted
  - Overly delayed ACK packets

#### Enable Flow trace logs

Use the following Azure PowerShell commands to enable Flow trace logs. Alternatively, navigate in the portal and search for **Enable TCP Connection Logging**:

```powershell
Connect-AzAccount 
Select-AzSubscription -Subscription <subscription_id> or <subscription_name>
Register-AzProviderFeature -FeatureName AFWEnableTcpConnectionLogging -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

It can take several minutes for this change to take effect. Once the feature is registered, consider performing an update on Azure Firewall for the change to take effect immediately.

#### Check registration status

To check the status of the AzResourceProvider registration, run the following Azure PowerShell command:

```powershell
Get-AzProviderFeature -FeatureName "AFWEnableTcpConnectionLogging" -ProviderNamespace "Microsoft.Network"
```

#### Disable Flow trace logs

To disable the log, use the following Azure PowerShell commands:

```powershell
Connect-AzAccount 
Select-AzSubscription -Subscription <subscription_id> or <subscription_name>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableTcpConnectionLogging = $false
Set-AzFirewall -AzureFirewall $firewall
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
- See [Track rule set changes](rule-set-change-tracking.md) for detailed Azure Resource Graph queries to track firewall rule modifications.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
