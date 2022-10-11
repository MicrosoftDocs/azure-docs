---
title: 'Tutorial: View and configure DDoS protection telemetry for Azure DDoS Protection Standard'
description: Learn how to view and configure DDoS protection telemetry for Azure DDoS Protection Standard.
services: ddos-protection
documentationcenter: na
author: AbdullahBell
ms.service: ddos-protection
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/14/2022
ms.author: abell

---
# Tutorial: View and configure DDoS protection telemetry

Azure DDoS Protection standard provides detailed attack insights and visualization with DDoS Attack Analytics. Customers protecting their virtual networks against DDoS attacks have detailed visibility into attack traffic and actions taken to mitigate the attack via attack mitigation reports & mitigation flow logs. Rich telemetry is exposed via Azure Monitor including detailed metrics during the duration of a DDoS attack. Alerting can be configured for any of the Azure Monitor metrics exposed by DDoS Protection. Logging can be further integrated with [Microsoft Sentinel](../sentinel/data-connectors-reference.md#azure-ddos-protection), Splunk (Azure Event Hubs), OMS Log Analytics, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * View DDoS protection telemetry
> * View DDoS mitigation policies
> * Validate and test DDoS protection telemetry


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Prerequisites

- Before you can complete the steps in this tutorial, you must first create a [Azure DDoS Standard protection plan](manage-ddos-protection.md) and DDoS Protection Standard must be enabled on a virtual network.
- DDoS monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address. You can monitor the public IP address of all resources deployed through Resource Manager (not classic) listed in [Virtual network for Azure services](../virtual-network/virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network) (including Azure Load Balancers where the backend virtual machines are in the virtual network), except for Azure App Service Environments. To continue with this tutorial, you can quickly create a [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine.  

## View DDoS protection telemetry

Telemetry for an attack is provided through Azure Monitor in real time. While [mitigation triggers](#view-ddos-mitigation-policies) for TCP SYN, TCP & UDP are available during peace-time, other telemetry is available only when a public IP address has been under mitigation.

You can view DDoS telemetry for a protected public IP address through three different resource types: DDoS protection plan, virtual network, and public IP address.


### Metrics

The metric names present different packet types, and bytes vs. packets, with a basic construct of tag names on each metric as follows:
- **Dropped tag name** (for example, **Inbound Packets Dropped DDoS**): The number of packets dropped/scrubbed by the DDoS protection system.
- **Forwarded tag name** (for example **Inbound Packets Forwarded DDoS**): The number of packets forwarded by the DDoS system to the destination VIP – traffic that was not filtered.
- **No tag name** (for example **Inbound Packets DDoS**): The total number of packets that came into the scrubbing system – representing the sum of the packets dropped and forwarded.
> [!NOTE]
> While multiple options for **Aggregation** are displayed on Azure portal, only the aggregation types listed in the table below are supported for each metric. We apologize for this confusion and we are working to resolve it.
The following [metrics](../azure-monitor/essentials/metrics-supported.md#microsoftnetworkpublicipaddresses) are available for Azure DDoS Protection Standard. These metrics are also exportable via diagnostic settings (see [View and configure DDoS diagnostic logging](diagnostic-logging.md)).

| Metric | Metric Display Name | Unit | Aggregation Type | Description |
| --- | --- | --- | --- | --- |
| BytesDroppedDDoS​ | Inbound bytes dropped DDoS​ | BytesPerSecond​ | Maximum​ | Inbound bytes dropped DDoS​| 
| BytesForwardedDDoS​ | Inbound bytes forwarded DDoS​ | BytesPerSecond​ | Maximum​ | Inbound bytes forwarded DDoS​ |
| BytesInDDoS​ | Inbound bytes DDoS​ | BytesPerSecond​ | Maximum​ | Inbound bytes DDoS​ |
| DDoSTriggerSYNPackets​ | Inbound SYN packets to trigger DDoS mitigation​ | CountPerSecond​ | Maximum​ | Inbound SYN packets to trigger DDoS mitigation​ |
| DDoSTriggerTCPPackets​ | Inbound TCP packets to trigger DDoS mitigation​ | CountPerSecond​ | Maximum​ | Inbound TCP packets to trigger DDoS mitigation​ |
| DDoSTriggerUDPPackets​ | Inbound UDP packets to trigger DDoS mitigation​ | CountPerSecond​ | Maximum​ | Inbound UDP packets to trigger DDoS mitigation​ |
| IfUnderDDoSAttack​ | Under DDoS attack or not​ | Count​ | Maximum​ | Under DDoS attack or not​ |
| PacketsDroppedDDoS​ | Inbound packets dropped DDoS​ | CountPerSecond​ | Maximum​ | Inbound packets dropped DDoS​ |
| PacketsForwardedDDoS​ | Inbound packets forwarded DDoS​ | CountPerSecond​ | Maximum​ | Inbound packets forwarded DDoS​ |
| PacketsInDDoS​ | Inbound packets DDoS​ | CountPerSecond​ | Maximum​ | Inbound packets DDoS​ |
| TCPBytesDroppedDDoS​ | Inbound TCP bytes dropped DDoS​ | BytesPerSecond​ | Maximum​ | Inbound TCP bytes dropped DDoS​ |
| TCPBytesForwardedDDoS​ | Inbound TCP bytes forwarded DDoS​ | BytesPerSecond​ | Maximum​ | Inbound TCP bytes forwarded DDoS​ |
| TCPBytesInDDoS​ | Inbound TCP bytes DDoS​ | BytesPerSecond​ | Maximum​ | Inbound TCP bytes DDoS​ |
| TCPPacketsDroppedDDoS​ | Inbound TCP packets dropped DDoS​ | CountPerSecond​ | Maximum​ | Inbound TCP packets dropped DDoS​ |
| TCPPacketsForwardedDDoS​ | Inbound TCP packets forwarded DDoS​ | CountPerSecond​ | Maximum​ | Inbound TCP packets forwarded DDoS​ |
| TCPPacketsInDDoS​ | Inbound TCP packets DDoS​ | CountPerSecond​ | Maximum​ | Inbound TCP packets DDoS​ |
| UDPBytesDroppedDDoS​ | Inbound UDP bytes dropped DDoS​ | BytesPerSecond​ | Maximum​ | Inbound UDP bytes dropped DDoS​ |
| UDPBytesForwardedDDoS​ | Inbound UDP bytes forwarded DDoS​ | BytesPerSecond​ | Maximum​ | Inbound UDP bytes forwarded DDoS​ |
| UDPBytesInDDoS​ | Inbound UDP bytes DDoS​ | BytesPerSecond​ | Maximum​ | Inbound UDP bytes DDoS​ |
| UDPPacketsDroppedDDoS​ | Inbound UDP packets dropped DDoS​ | CountPerSecond​ | Maximum​ | Inbound UDP packets dropped DDoS​ |
| UDPPacketsForwardedDDoS​ | Inbound UDP packets forwarded DDoS​ | CountPerSecond​ | Maximum​ | Inbound UDP packets forwarded DDoS​ |
| UDPPacketsInDDoS​ | Inbound UDP packets DDoS​ | CountPerSecond​ | Maximum​ | Inbound UDP packets DDoS​ |


### View metrics from DDoS protection plan

1. Sign in to the [Azure portal](https://portal.azure.com/) and select your DDoS protection plan.
1. On the Azure portal menu, select or search for and select **DDoS protection plans** then select your DDoS protection plan.
1. Under **Monitoring**, select **Metrics**.
1. Click **Add metric** then click **Scope**.
1. In the **Select a scope** menu select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. For **Metric** select **Under DDoS attack or not**.
1. Select the **Aggregation** type as **Max**.

:::image type="content" source="./media/ddos-attack-telemetry/ddos-metrics-menu.png" alt-text="Screenshot of creating DDoS protection metrics menu." lightbox="./media/ddos-attack-telemetry/ddos-metrics-menu.png":::

### View metrics from virtual network 

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to your virtual network that has DDoS protection enabled.
1. Under **Monitoring**, select **Metrics**.
1. Click **Add metric** then click **Scope**.
1. In the **Select a scope** menu select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. Under **Metric** select your chosen metric then under **Aggregation** select type as **Max**.

>[!NOTE]
>To filter IP Addresses select **Add filter**. Under **Property**, select **Protected IP Address**, and the operator should be set to **=**. Under **Values**, you will see a dropdown of public IP addresses, associated with the virtual network, that are protected by DDoS protection.

:::image type="content" source="./media/ddos-attack-telemetry/vnet-ddos-metrics.png" alt-text="Screenshot of DDoS diagnostic settings." lightbox="./media/ddos-attack-telemetry/vnet-ddos-metrics.png":::

### View metrics from Public IP address

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to your public IP address.
1. On the Azure portal menu, select or search for and select **Public IP addresses** then select your public IP address.
1. Under **Monitoring**, select **Metrics**.
1. Click **Add metric** then click **Scope**.
1. In the **Select a scope** menu select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. Under **Metric** select your chosen metric then under **Aggregation** select type as **Max**.

## View DDoS mitigation policies

DDoS Protection Standard applies three auto-tuned mitigation policies (TCP SYN, TCP & UDP) for each public IP address of the protected resource, in the virtual network that has DDoS protection enabled. You can view the policy thresholds by selecting the  **Inbound TCP packets to trigger DDoS mitigation** and **Inbound UDP packets to trigger DDoS mitigation** metrics with **aggregation** type as 'Max', as shown in the following picture:


:::image type="content" source="./media/manage-ddos-protection/view-mitigation-policies.png" alt-text="Screenshot of viewing mitigation policies." lightbox="./media/manage-ddos-protection/view-mitigation-policies.png":::
## Validate and test

To simulate a DDoS attack to validate DDoS protection telemetry, see [Validate DDoS detection](test-through-simulations.md).

## Next steps

In this tutorial, you learned how to:

- Configure alerts for DDoS protection metrics
- View DDoS protection telemetry
- View DDoS mitigation policies
- Validate and test DDoS protection telemetry

To learn how to configure attack mitigation reports and flow logs, continue to the next tutorial.

> [!div class="nextstepaction"]
> [View and configure DDoS diagnostic logging](diagnostic-logging.md)
