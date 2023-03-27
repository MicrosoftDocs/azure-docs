---
title: Enable Top 10 flows and Flow trace logs in Azure Firewall 
description: Learn how to enable the Top 10 flows and Flow trace logs in Azure Firewall
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 03/27/2023
ms.author: victorh 
---

# Enable Top 10 flows (preview) and Flow trace logs (preview) in Azure Firewall

Azure Firewall has two new diagnostics logs you can use to help monitor your firewall:

- Top 10 flows
- Flow trace

## Top 10 flows

The Top 10 flows log (known in the industry as Fat Flows), shows the top connections that are contributing to the highest throughput through the firewall.

### Prerequisites

- Enable [structured logs](firewall-structured-logs.md#enabledisable-structured-logs)
- Use the Azure Resource Specific Table format in [Diagnostic Settings](firewall-diagnostics.md#enable-diagnostic-logging-through-the-azure-portal).

### Enable the log

Enable the log using the following Azure PowerShell commands:

```azurepowershell
Set-AzContext -SubscriptionName <SubscriptionName>
$firewall = Get-AzFirewall- ResourceGroupName <ResourceGroupName> -Name <FirewallName>
$firewall.EnableFatFlowLogging = $true
Set-AzFirewall -AzureFirewall $firewall
```
### Verify the update

There are a few ways to verify the update was successful, but you can navigate to firewall **Overview** and select **JSON view** on the top right corner. Here’s an example:

:::image type="content" source="media/enable-top-ten-and-flow-trace/firewall-log-verification.png" alt-text="Screenshot of JSON showing additional log verification.":::

### Create a diagnostic setting and enable Resource Specific Table

1. In the Diagnostic settings tab, select **Add diagnostic setting**.
2. Type a Diagnostic setting name.
3. Select **Azure Firewall Fat Flow Log** under **Categories** and any other logs you want to be supported in the firewall.
4. In Destination details, select  **Send to Log Analytics** workspace
   1. Choose your desired Subscription and preconfigured Log Analytics workspace.
   1. Enable **Resource specific**.
   :::image type="content" source="media/enable-top-ten-and-flow-trace/log-destination-details.png" alt-text="Screenshot showing log destination details.":::

### View and analyze Azure Firewall logs

1. On a firewall resource, navigate to **Logs** under the **Monitoring** tab.
2. Select **Queries**, then load **Azure Firewall Top Flow Logs** by hovering over the option and selecting **Load to editor**.
3. When the query loads, select **Run**.

   :::image type="content" source="media/enable-top-ten-and-flow-trace/top-ten-flow-log.png" alt-text="Screenshot showing the Top 10 flow log." lightbox="media/enable-top-ten-and-flow-trace/top-ten-flow-log.png":::

## Flow trace

Currently, the firewall logs show traffic through the firewall in the first attempt of a TCP connection, known as the *syn* packet. However, this doesn't show the full journey of the packet in the TCP handshake. As a result, it's difficult to troubleshoot if a packet is dropped, or asymmetric routing has occurred. 

The following additional properties can be added: 
- SYN-ACK 
- FIN 
- FIN-ACK 
- RST 
- INVALID (flows)

### Prerequisites

- Enable [structured logs](firewall-structured-logs.md#enabledisable-structured-logs)
- Use the Azure Resource Specific Table format in [Diagnostic Settings](firewall-diagnostics.md#enable-diagnostic-logging-through-the-azure-portal).

### Enable the log

Enable the log using the following Azure PowerShell commands:

```azurepowershell
Connect-AzAccount 
Select-AzSubscription -Subscription <subscription_id> or <subscription_name>
Register-AzProviderFeature -FeatureName AFWEnableTcpConnectionLogging -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```
### Create a diagnostic setting and enable Resource Specific Table

1. In the Diagnostic settings tab, select **Add diagnostic setting**.
2. Type a Diagnostic setting name.
3. Select **Azure Firewall Fat Flow Log** under **Categories** and any other logs you want to be supported in the firewall.
4. In Destination details, select  **Send to Log Analytics** workspace
   1. Choose your desired Subscription and preconfigured Log Analytics workspace.
   1. Enable **Resource specific**.
   :::image type="content" source="media/enable-top-ten-and-flow-trace/log-destination-details.png" alt-text="Screenshot showing log destination details.":::

### View and analyze Azure Firewall Flow trace logs

1. On a firewall resource, navigate to **Logs** under the **Monitoring** tab.
2. Select **Queries**, then load **Azure Firewall flow trace logs** by hovering over the option and selecting **Load to editor**.
3. When the query loads, select **Run**.

   :::image type="content" source="media/enable-top-ten-and-flow-trace/trace-flow-logs.png" alt-text="Screenshot showing the Trace flow log." lightbox="media/enable-top-ten-and-flow-trace/trace-flow-logs.png":::


## Next steps

- [Azure Structured Firewall Logs (preview)](firewall-structured-logs.md)
