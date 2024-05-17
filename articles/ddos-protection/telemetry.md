---
title: 'Tutorial: View and configure DDoS protection telemetry'
description: Learn how to view and configure the DDoS protection telemetry and metrics for Azure DDoS Protection.
#customer intent: I want to learn how to view and configure DDoS protection telemetry for Azure DDoS Protection.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: tutorial
ms.date: 05/09/2024
ms.author: abell
---

# Tutorial: View and configure Azure DDoS protection telemetry

Azure DDoS Protection offers in-depth insights and visualizations of attack patterns through DDoS Attack Analytics. It provides customers with comprehensive visibility into attack traffic and mitigation actions via reports and flow logs. During a DDoS attack, detailed metrics are available through Azure Monitor, which also allows alert configurations based on these metrics.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * View Azure DDoS Protection telemetry
> * View Azure DDoS Protection mitigation policies
> * Validate and test Azure DDoS Protection telemetry

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.



## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* Before you can complete the steps in this tutorial, you must first create a DDoS simulation attack to generate the telemetry. Telemetry data is recorded during an attack. For more information, see [Test DDoS Protection through simulation](test-through-simulations.md).

## View Azure DDoS Protection telemetry

Telemetry for an attack is provided through Azure Monitor in real time. While [mitigation triggers](#view-ddos-mitigation-policies) for TCP SYN, TCP & UDP are available during peace-time, other telemetry is available only when a public IP address has been under mitigation.

You can view DDoS telemetry for a protected public IP address through three different resource types: DDoS protection plan, virtual network, and public IP address.

Logging can be further integrated with [Microsoft Sentinel](../sentinel/data-connectors/azure-ddos-protection.md), Splunk (Azure Event Hubs), OMS Log Analytics, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

For more information on metrics, see [Monitoring Azure DDoS Protection](monitor-ddos-protection-reference.md) for details on DDoS Protection monitoring logs.

### View metrics from DDoS protection plan

1. Sign in to the [Azure portal](https://portal.azure.com/) and select your DDoS protection plan.
1. On the Azure portal menu, select or search for and select **DDoS protection plans** then select your DDoS protection plan.
1. Under **Monitoring**, select **Metrics**.
1. Select **Add metric** then select **Scope**.
1. In the Select a scope menu, select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. For **Metric** select **Under DDoS attack or not**.
1. Select the **Aggregation** type as **Max**.

:::image type="content" source="./media/ddos-attack-telemetry/ddos-metrics-menu.png" alt-text="Screenshot of creating DDoS protection metrics menu." lightbox="./media/ddos-attack-telemetry/ddos-metrics-menu.png":::

### View metrics from virtual network

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to your virtual network that has DDoS protection enabled.
1. Under **Monitoring**, select **Metrics**.
1. Select **Add metric** then select **Scope**.
1. In the Select a scope menu, select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. Under **Metric** select your chosen metric then under **Aggregation** select type as **Max**.

>[!NOTE]
>To filter IP Addresses select **Add filter**. Under **Property**, select **Protected IP Address**, and the operator should be set to **=**. Under **Values**, you will see a dropdown of public IP addresses, associated with the virtual network, that are protected by Azure DDoS Protection.

:::image type="content" source="./media/ddos-attack-telemetry/vnet-ddos-metrics.png" alt-text="Screenshot of DDoS diagnostic settings." lightbox="./media/ddos-attack-telemetry/vnet-ddos-metrics.png":::

### View metrics from Public IP address

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to your public IP address.
1. On the Azure portal menu, select or search for and select **Public IP addresses** then select your public IP address.
1. Under **Monitoring**, select **Metrics**.
1. Select **Add metric** then select **Scope**.
1. In the Select a scope menu, select the **Subscription** that contains the public IP address you want to log.  
1. Select **Public IP Address** for **Resource type** then select the specific public IP address you want to log metrics for, and then select **Apply**.
1. Under **Metric** select your chosen metric then under **Aggregation** select type as **Max**.

>[!NOTE]
>When changing DDoS IP protection from **enabled** to **disabled**, telemetry for the public IP resource will not be available.

### View DDoS mitigation policies

Azure DDoS Protection uses three automatically adjusted mitigation policies (TCP SYN, TCP, and UDP) for each public IP address of the resource being protected. This applies to any virtual network with DDoS protection enabled. 


You can see the policy limits within your public IP address metrics by choosing the *Inbound SYN packets to trigger DDoS mitigation*, *Inbound TCP packets to trigger DDoS mitigation*, and *Inbound UDP packets to trigger DDoS mitigation* metrics. Make sure to set the aggregation type to *Max*.

:::image type="content" source="./media/manage-ddos-protection/view-mitigation-policies.png" alt-text="Screenshot of viewing mitigation policies." lightbox="./media/manage-ddos-protection/view-mitigation-policies.png":::

### View peace time traffic telemetry

It's important to keep an eye on the metrics for TCP SYN, UDP, and TCP detection triggers. These metrics help you know when DDoS protection starts. Make sure these triggers reflect the normal traffic levels when there's no attack. 

You can make a chart for the public IP address resource. In this chart, include the Packet Count and SYN Count metrics. The Packet count includes both TCP and UDP Packets. This shows you the sum of traffic. 

:::image type="content" source="./media/manage-ddos-protection/ddos-baseline-metrics.png" alt-text="Screenshot of viewing peace time telemetry." lightbox="./media/manage-ddos-protection/ddos-baseline-metrics.png":::

>[!NOTE]
> To make a fair comparison, you need to convert the data to packets-per-second. You can do this by dividing the number you see by 60, as the data represents the number of packets, bytes, or SYN packets collected over 60 seconds. For example, if you have 91,000 packets collected over 60 seconds, divide 91,000 by 60 to get approximately 1,500 packets-per-second (pps).

## Validate and test

To simulate a DDoS attack to validate DDoS protection telemetry, see [Validate DDoS detection](test-through-simulations.md).


## Next steps

In this tutorial, you learned how to:

* Configure alerts for DDoS protection metrics
* View DDoS protection telemetry
* View DDoS mitigation policies
* Validate and test DDoS protection telemetry

To learn how to configure attack mitigation reports and flow logs, continue to the next tutorial.

> [!div class="nextstepaction"]
> [View and configure DDoS diagnostic logging](diagnostic-logging.md)
