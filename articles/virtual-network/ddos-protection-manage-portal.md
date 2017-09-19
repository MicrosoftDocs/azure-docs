---
title: Manage DDoS Protection using the Azure portal | Microsoft Docs
description: Learn how to use the Azure DDoS Protection service telemetry while under an attack using the Azure Monitor.
services: virtual-network
documentationcenter: na
author: kumudD
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/15/2017
ms.author: kumud

---

# Manage DDoS Protection using the Azure portal

This article shows you how to use the Azure portal to enable DDoS Protection, disable DDoS Protection, and use telemetry to mitigate an attack. 

>[!IMPORTANT]
>DDoS Protection is currently in preview. A limited number of Azure resources support DDoS Protection, and in a select number of regions. You need to [register for the service](http://aka.ms/ddosprotection) during the limited preview to get the DDoS Protection service enabled for your subscription. You are contacted by the Azure DDoS team upon registration to guide you through the enablement process. Azure DDoS Protection service is available in US East, US West, and US Central regions. During preview, you are not charged for using the service.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Enable DDoS Protection

Enable DDoS Protection on a new or existing virtual network.

### Create a new virtual network and enable DDoS Protection

1. Click the **New** button found on the upper left-hand corner of the Azure portal.
2. Select **Networking**, and then select **Virtual Network**.
3. Enter the virtual network information. Under *DDoS protection*, click **Enabled**, and then click **Create**.

    ![Create virtual network](./media/ddos-protection-manage-portal/ddos-create-vnet.png)   

A warning states that enabling DDoS Protection incurs charges. No charges for DDoS Protection are incurred during preview. Charges are incurred at General Availability (GA) and customers will receive 30 days notice prior to the start of charges and GA.

### Enable DDoS Protection on an existing virtual network 

1. Click **Virtual networks** in the Azure portal menu, and then select your virtual network.
2. Click **DDoS Protection**, click **Enabled** on the *DDoS Protection* screen, and then click **Save**. 

A warning states that enabling DDoS Protection incurs charges. No charges for DDoS Protection are incurred during preview. Charges are incurred at General Availability (GA) and customers will receive 30 days notice prior to the start of charges and GA.

## Disable DDoS Protection

1. Click **Virtual networks** in the Azure portal menu, and then select your virtual network.
2. Click **DDoS Protection**, click **Disabled** on the *DDoS Protection* screen, and then click **Save**.

## Configure alerts on DDoS Protection metrics

Leveraging the Azure Monitor alert configuration, you can select any of the available DDoS Protection metrics to alert when there’s an active mitigation during an attack. When the conditions are met, you receive an alert email on the address specified.

1. Click **Monitor**, and then click **Metrics**.
2. On the *Metrics* screen, select the resource group, resource type of **Public IP Address**, and your Azure public IP.
3. To configure an email alert for a metric, click **Click to add an alert**. An email alert can be created on any metric, but the most obvious metric is **Under DDoS attack or not**. This is a boolean value 1 or 0. A **1** means you are under attack. A **0** means you are not under attack.
4. To be emailed when under attack, set the metric for **Under DDoS attack or not** and **Condition to Greater than zero (0) over the last 5 minutes**. Similar alerts can be set up for other metrics.

    ![Configure metrics](./media/ddos-protection-manage-portal/ddos-metrics.png)

You can also learn more about [configuring webhooks](../monitoring-and-diagnostics/insights-webhooks-alerts.md) and [logic apps](../logic-apps/logic-apps-what-are-logic-apps.md) for creating alerts.

## Configure logging on DDoS Protection metrics

1. Click **Monitor**, and then click **Diagnostic Settings**.
2. On the *Metrics* screen, select the resource group, resource type of **Public IP Address**, and your Azure public IP.
3. Click **Turn on diagnostics to collect the following data**.

There are three options available for logging:

- **Archive to a storage account** – Writes logs to a storage account.
- **Stream to an event hub** –  Allows a log receiver to pick up logs using an event hub. This enables integration with Splunk or other SIEM systems.
- **Send to Log Analytics** – Writes logs to Azure OMS Log Analytics service.

## Use DDoS Protection telemetry

Telemetry for an attack is provided through Azure Monitor in real time. The telemetry is available only for the duration that a public IP address is under mitigation. You will not see telemetry before or after an attack is mitigated.

1. Click **Monitor**, and then click **Metrics**. 
2. On the *Metrics* screen, select the resource group, resource type of **Public IP Address**, and your Azure public IP. A series of Available Metrics appears on the left side of the screen. These metrics when selected, are graphed in the Azure Monitor Metrics Chart on the overview screen. 

The metric names present different packet types and bytes vs. packets, with a basic construct of tag names on each metric as follows:

- **Dropped tag name (e.g. Inbound Packets Dropped DDoS):** The number of packets dropped/scrubbed by the DDoS protection system.
- **Forwarded tag name (e.g: Inbound Packets Forwarded DDoS):** The number of packets forwarded by the DDoS system to the destination VIP – traffic that was not filtered.
- **No tag name (e.g:  Inbound Packets DDoS):** The total number of packets that came into the scrubbing system – representing the sum of the packets dropped and forwarded.

## Next steps

- [Read more about Azure Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md)
- [Analyze logs from Azure storage with Log Analytics](../log-analytics/log-analytics-azure-storage.md)
- [Get started with Event Hubs](../event-hubs/event-hubs-csharp-ephcs-getstarted.md)