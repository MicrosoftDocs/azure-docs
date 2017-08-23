---
title: Manage network security group flow logs with Azure Network Watcher | Microsoft Docs
description: This page explains how to manage Network Security Group flow logs in Azure Network Watcher
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: 01606cbf-d70b-40ad-bc1d-f03bb642e0af
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---

# Manage network security group flow logs in the Azure portal

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-nsg-flow-logging-portal.md)
> - [PowerShell](network-watcher-nsg-flow-logging-powershell.md)
> - [CLI 1.0](network-watcher-nsg-flow-logging-cli-nodejs.md)
> - [CLI 2.0](network-watcher-nsg-flow-logging-cli.md)
> - [REST API](network-watcher-nsg-flow-logging-rest.md)

Network security group flow logs are a feature of Network Watcher that enables you to view information about ingress and egress IP traffic through a network security group. These flow logs are written in JSON format and provide important information, including: 

- Outbound and inbound flows on a per-rule basis.
- The NIC that the flow applies to.
- 5-tuple information about the flow (source/destination IP, source/destination port, protocol).
- Information about whether traffic was allowed or denied.

## Before you begin

This scenario assumes you have already followed the steps in [Create a Network Watcher instance](network-watcher-create.md). The scenario also assumes that a you have a resource group with a valid virtual machine.

## Register Insights provider

For flow logging to work successfully, the **Microsoft.Insights** provider must be registered. To register the provider, take the following steps: 

1. Go to **Subscriptions**, and then select the subscription for which you want to enable flow logs. 
2. On the **Subscription** blade, select **Resource Providers**. 
3. Look at the list of providers, and verify that the **microsoft.insights** provider is registered. If not, then select **Register**.

![View providers][providers]

## Enable flow logs

These steps take you through the process of enabling flow logs on a network security group.

### Step 1

Go to a Network Watcher instance, and then select **NSG Flow logs**.

![Flow logs overview][1]

### Step 2

Select a network security group from the list.

![Flow logs overview][2]

### Step 3 

On the **Flow logs settings** blade, set the status to **On**, and then configure a storage account.  When you're done, select **OK**. Then select **Save**.

![Flow logs overview][3]

## Download flow logs

Flow logs are saved in a storage account. Download your flow logs to view them.

### Step 1

To download flow logs, select **You can download flow logs from configured storage accounts**. This step takes you to a storage account view where you can choose which logs to download.

![Flow logs settings][4]

### Step 2

Go to the correct storage account. Then select **Containers** > **insights-log-networksecuritygroupflowevent**.

![Flow logs settings][5]

### Step 3

Go to the location of the flow log, select it, and then select **Download**.

![Flow logs settings][6]

For information about the structure of the log, visit [Network security group flow log overview](network-watcher-nsg-flow-logging-overview.md).

## Next steps

Learn how to [visualize your NSG flow logs with PowerBI](network-watcher-visualize-nsg-flow-logs-power-bi.md).

<!-- Image references -->
[1]: ./media/network-watcher-nsg-flow-logging-portal/figure1.png
[2]: ./media/network-watcher-nsg-flow-logging-portal/figure2.png
[3]: ./media/network-watcher-nsg-flow-logging-portal/figure3.png
[4]: ./media/network-watcher-nsg-flow-logging-portal/figure4.png
[5]: ./media/network-watcher-nsg-flow-logging-portal/figure5.png
[6]: ./media/network-watcher-nsg-flow-logging-portal/figure6.png
[providers]: ./media/network-watcher-nsg-flow-logging-portal/providers.png
