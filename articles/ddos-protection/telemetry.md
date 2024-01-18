---
title: 'Tutorial: View and configure DDoS protection telemetry for Azure DDoS Protection'
description: Learn how to view and configure DDoS protection telemetry for Azure DDoS Protection.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: tutorial
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 11/06/2023
ms.author: abell
---
# Tutorial: View and configure Azure DDoS protection telemetry

Azure DDoS Protection provides detailed attack insights and visualization with DDoS Attack Analytics. Customers protecting their virtual networks against DDoS attacks have detailed visibility into attack traffic and actions taken to mitigate the attack via attack mitigation reports & mitigation flow logs. Rich telemetry is exposed via Azure Monitor including detailed metrics during the duration of a DDoS attack. Alerting can be configured for any of the Azure Monitor metrics exposed by DDoS Protection. Logging can be further integrated with [Microsoft Sentinel](../sentinel/data-connectors/azure-ddos-protection.md), Splunk (Azure Event Hubs), OMS Log Analytics, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

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
## View DDoS mitigation policies

Azure DDoS Protection applies three auto-tuned mitigation policies (TCP SYN, TCP & UDP) for each public IP address of the protected resource, in the virtual network that has DDoS protection enabled. You can view the policy thresholds by selecting the  **Inbound TCP packets to trigger DDoS mitigation** and **Inbound UDP packets to trigger DDoS mitigation** metrics with **aggregation** type as 'Max', as shown in the following picture:

:::image type="content" source="./media/manage-ddos-protection/view-mitigation-policies.png" alt-text="Screenshot of viewing mitigation policies." lightbox="./media/manage-ddos-protection/view-mitigation-policies.png":::
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
