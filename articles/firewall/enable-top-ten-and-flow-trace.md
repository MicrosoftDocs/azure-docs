---
title: Enable Top flows and Flow trace logs in Azure Firewall 
description: Learn how to enable the Top flows and Flow trace logs in Azure Firewall.
services: firewall
author: vhorne
ms.service: firewall
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 05/12/2023
ms.author: victorh 
---

# Enable Top flows and Flow trace logs in Azure Firewall

Azure Firewall has two new diagnostics logs you can use to help monitor your firewall:

- Top flows
- Flow trace

## Top flows

The Top flows log (known in the industry as Fat Flows), shows the top connections that are contributing to the highest throughput through the firewall.

> [!TIP]
> Activate Top flows logs only when troubleshooting a specific issue to avoid excessive CPU usage of Azure Firewall.
> 

The flow rate is defined as the data transmission rate (in Megabits per second units). In other words, it's a measure of the amount of digital data that can be transmitted over a network in a period of time through the firewall. The Top Flows protocol runs periodically every three minutes. The minimum threshold to be considered a Top Flow is 1 Mbps.

### Prerequisites

- Enable [structured logs](firewall-structured-logs.md#enable-structured-logs)
- Use the Azure Resource Specific Table format in [Diagnostic Settings](firewall-diagnostics.md#enable-diagnostic-logging-through-the-azure-portal).

### Enable the log

Enable the log using the following Azure PowerShell commands:

```azurepowershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $true
Set-AzFirewall -AzureFirewall $firewall
```

### Disable the log

To disable the logs, use the same previous Azure PowerShell command and set the value to *False*. 

For example:

```azurepowershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall -ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $false
Set-AzFirewall -AzureFirewall $firewall
```

### Verify the update

There are a few ways to verify the update was successful, but you can navigate to firewall **Overview** and select **JSON view** on the top right corner. Here’s an example:

:::image type="content" source="media/enable-top-ten-and-flow-trace/firewall-log-verification.png" alt-text="Screenshot of JSON showing additional log verification.":::

### Create a diagnostic setting and enable Resource Specific Table

1. In the Diagnostic settings tab, select **Add diagnostic setting**.
2. Type a Diagnostic setting name.
3. Select **Azure Firewall Fat Flow Log** under **Categories** and any other logs you want to be supported in the firewall.
4. In Destination details, select  **Send to Log Analytics** workspace.
   1. Choose your desired Subscription and preconfigured Log Analytics workspace.
   1. Enable **Resource specific**.
   :::image type="content" source="media/enable-top-ten-and-flow-trace/log-destination-details.png" alt-text="Screenshot showing log destination details.":::

### View and analyze Azure Firewall logs

1. On a firewall resource, navigate to **Logs** under the **Monitoring** tab.
2. Select **Queries**, then load **Azure Firewall Top Flow Logs** by hovering over the option and selecting **Load to editor**.
3. When the query loads, select **Run**.

   :::image type="content" source="media/enable-top-ten-and-flow-trace/top-ten-flow-log.png" alt-text="Screenshot showing the Top flow log." lightbox="media/enable-top-ten-and-flow-trace/top-ten-flow-log.png":::

## Flow trace

Currently, the firewall logs show traffic through the firewall in the first attempt of a TCP connection, known as the *SYN* packet. However, this doesn't show the full journey of the packet in the TCP handshake. As a result, it's difficult to troubleshoot if a packet is dropped, or asymmetric routing occurred.


> [!TIP]
> To avoid excessive disk usage caused by Flow trace logs in Azure Firewall with many short-lived connections, activate the logs only when troubleshooting a specific issue for diagnostic purposes.

The following additional properties can be added: 
- SYN-ACK

   ACK flag that indicates acknowledgment of SYN packet. 
- FIN

   Finished flag of the original packet flow. No more data is transmitted in the TCP flow. 
- FIN-ACK

   ACK flag that indicates acknowledgment of FIN packet. 

- RST

   The Reset the flag indicates the original sender doesn't receive more data.

- INVALID (flows)

   Indicates packet can’t be identified or don't have any state. 

   For example: 
   - A TCP packet lands on a Virtual Machine Scale Sets instance, which doesn't have any prior history for this packet
   - Bad CheckSum packets
   - Connection Tracking table entry is full and new connections can't be accepted
   - Overly delayed ACK packets

Flow Trace logs, such as SYN-ACK and ACK, are exclusively logged for network traffic. In addition, SYN packets aren't logged by default. However, you can access the initial SYN packets within the network rule logs.

### Prerequisites

- Enable [structured logs](firewall-structured-logs.md#enable-structured-logs).
- Use the Azure Resource Specific Table format in [Diagnostic Settings](firewall-diagnostics.md#enable-diagnostic-logging-through-the-azure-portal).

### Enable the log

Enable the log using the following Azure PowerShell commands or navigate in the portal and search for **Enable TCP Connection Logging**:

```azurepowershell
Connect-AzAccount 
Select-AzSubscription -Subscription <subscription_id> or <subscription_name>
Register-AzProviderFeature -FeatureName AFWEnableTcpConnectionLogging -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

It can take several minutes for this to take effect. Once the feature is registered, consider performing an update on Azure Firewall for the change to take effect immediately.

To check the status of the AzResourceProvider registration, you can run the Azure PowerShell command:

`Get-AzProviderFeature -FeatureName "AFWEnableTcpConnectionLogging" -ProviderNamespace "Microsoft.Network"`

### Disable the log

To disable the log, you can unregister it using the following command or select unregister in the previous portal example.
 
`Unregister-AzProviderFeature -FeatureName AFWEnableTcpConnectionLogging -ProviderNamespace Microsoft.Network`


### Create a diagnostic setting and enable Resource Specific Table

1. In the Diagnostic settings tab, select **Add diagnostic setting**.
2. Type a Diagnostic setting name.
3. Select **Azure Firewall Flow Trace Log** under **Categories** and any other logs you want to be supported in the firewall.
4. In Destination details, select  **Send to Log Analytics** workspace.
   1. Choose your desired Subscription and preconfigured Log Analytics workspace.
   1. Enable **Resource specific**.
   :::image type="content" source="media/enable-top-ten-and-flow-trace/log-destination-details.png" alt-text="Screenshot showing log destination details.":::

### View and analyze Azure Firewall Flow trace logs

1. On a firewall resource, navigate to **Logs** under the **Monitoring** tab.
2. Select **Queries**, then load **Azure Firewall flow trace logs** by hovering over the option and selecting **Load to editor**.
3. When the query loads, select **Run**.

   :::image type="content" source="media/enable-top-ten-and-flow-trace/trace-flow-logs.png" alt-text="Screenshot showing the Trace flow log." lightbox="media/enable-top-ten-and-flow-trace/trace-flow-logs.png":::


## Next steps

- [Azure Structured Firewall Logs](firewall-structured-logs.md)
