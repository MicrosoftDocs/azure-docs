---
title: Enable Top flows and Flow trace logs in Azure Firewall 
description: Learn how to enable the Top flows and Flow trace logs in Azure Firewall
services: firewall
author: vhorne
ms.service: firewall
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 05/12/2023
ms.author: victorh 
---

# Enable Top flows (preview) and Flow trace logs (preview) in Azure Firewall

Azure Firewall has two new diagnostics logs you can use to help monitor your firewall:

- Top flows
- Flow trace

## Top flows

The Top flows log (known in the industry as Fat Flows), shows the top connections that are contributing to the highest throughput through the firewall.

It's suggested to activate Top flows logs only when troubleshooting a specific issue to avoid excessive CPU usage of Azure Firewall.


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

   :::image type="content" source="media/enable-top-ten-and-flow-trace/top-ten-flow-log.png" alt-text="Screenshot showing the Top flow log." lightbox="media/enable-top-ten-and-flow-trace/top-ten-flow-log.png":::

## Flow trace

Currently, the firewall logs show traffic through the firewall in the first attempt of a TCP connection, known as the *syn* packet. However, this doesn't show the full journey of the packet in the TCP handshake. As a result, it's difficult to troubleshoot if a packet is dropped, or asymmetric routing has occurred.

To avoid excessive disk usage caused by Flow trace logs in Azure Firewall with many short-lived connections, it's recommended to activate the logs only when troubleshooting a specific issue for diagnostic purposes.

The following additional properties can be added: 
- SYN-ACK

   Ack flag that indicates acknowledgment of SYN packet. 
- FIN

   Finished flag of the original packet flow. No more data is transmitted in the TCP flow. 
- FIN-ACK

   Ack flag that indicates acknowledgment of FIN packet. 

- RST

   The Reset the flag indicates the original sender doesn't receive more data.

- INVALID (flows)

   Indicates packet can’t be identified or don't have any state; TCP packet is landing on a Virtual Machine Scale Sets instance, which doesn't have any prior history to this packet.

### Prerequisites

- Enable [structured logs](firewall-structured-logs.md#enable-structured-logs)
- Use the Azure Resource Specific Table format in [Diagnostic Settings](firewall-diagnostics.md#enable-diagnostic-logging-through-the-azure-portal).

### Enable the log

Enable the log using the following Azure PowerShell commands:

```azurepowershell
Connect-AzAccount 
Select-AzSubscription -Subscription <subscription_id> or <subscription_name>
Register-AzProviderFeature -FeatureName AFWEnableTcpConnectionLogging -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```

It can take several minutes for this to take effect. Once the feature is completely registered, consider performing an update on Azure Firewall for the change to take effect immediately.

To check the status of the AzResourceProvider registration, you can run the Azure PowerShell command:

`Get-AzProviderFeature -FeatureName "AFWEnableTcpConnectionLogging" -ProviderNamespace "Microsoft.Network"`

### Create a diagnostic setting and enable Resource Specific Table

1. In the Diagnostic settings tab, select **Add diagnostic setting**.
2. Type a Diagnostic setting name.
3. Select **Azure Firewall Flow Trace Log** under **Categories** and any other logs you want to be supported in the firewall.
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
