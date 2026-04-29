---
title: Visualize Flow Logs with Power BI
titleSuffix: Azure Network Watcher
description: Learn how to use Power BI to visualize flow logs to view information about your IP traffic.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 03/31/2026
zone_pivot_groups: flow-log-types

# Customer intent: As a network administrator, I want to visualize flow logs in a business intelligence tool, so that I can gain insights into IP traffic patterns and enhance network security management.
---

# Visualize flow logs with Power BI

::: zone pivot="virtual-network"

Virtual Network flow logs allow you to view information about ingress and egress IP traffic on Virtual Networks. These flow logs show outbound and inbound flows on a per rule basis, the network interface (NIC) the flow applies to, 5-tuple information about the flow (Source/Destination IP, Source/Destination Port, Protocol), and if the traffic was allowed or denied.

It can be difficult to gain insights into flow logging data by manually searching the log files. In this article, you learn how to visualize your most recent flow logs to learn more about traffic on your network.

::: zone-end

::: zone pivot="network-security-group"

[!INCLUDE [NSG flow logs retirement](../../includes/network-watcher-nsg-flow-logs-retirement.md)]

Network security group flow logs allow you to view information about ingress and egress IP traffic on network security groups. These flow logs show outbound and inbound flows on a per rule basis, the NIC the flow applies to, 5-tuple information about the flow (Source/Destination IP, Source/Destination Port, Protocol), and if the traffic was allowed or denied.

It can be difficult to gain insights into flow logging data by manually searching the log files. In this article, you learn how to visualize your most recent flow logs to learn more about traffic on your network.

> [!Warning]  
> The following steps work with flow logs version 1. For details, see [Introduction to flow logging for network security groups](nsg-flow-logs-overview.md). The following instructions will not work with version 2 of the log files, without modification.

::: zone-end

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

::: zone pivot="virtual-network"
- Flow logging enabled on one or more virtual networks in your account. For more information, see [Manage virtual network flow logs](vnet-flow-logs-manage.md).
::: zone-end

::: zone pivot="network-security-group"
- Flow logging enabled on one or more network security groups in your account. For more information, see [Manage network security group flow logs](nsg-flow-logs-manage.md).
::: zone-end

- Power BI Desktop installed on your machine with enough free space to download and load the log data that exists in your storage account. For more information, see [Get started with Power BI Desktop](/power-bi/fundamentals/desktop-getting-started).

## Scenario

In the following scenario, you connect Power BI desktop to your storage account configured as the sink for your flow logging data. After you connect to the storage account, Power BI downloads and parses the logs to provide a visual representation of logged traffic.

:::image type="content" source="./media/flow-logs-power-bi/scenario.png" alt-text="Diagram of the scenario.":::

Using the visuals supplied in the template you can examine:

- Top talkers

- Time series flow data by direction and rule decision

- Flows by network interface MAC address

- Flows by destination port
::: zone pivot="virtual-network"
- Flows by virtual network and rule
::: zone-end
::: zone pivot="network-security-group"
- Flows by network security group and rule
::: zone-end

The template is editable so you can modify it to add new data, visuals, or edit queries to suit your needs.

### Set up your Power BI dashboard

::: zone pivot="virtual-network"
1. Download and open the following Power BI template in your Power BI Desktop [Network Watcher Power BI flow logs template](https://github.com/Azure/NWPublicScripts/raw/main/nw-public-docs-artifacts/vnet-flow-logs/PowerBI_VNetFlowLogs_Storage_Template.pbit)
::: zone-end

::: zone pivot="network-security-group"
1. Download and open the following Power BI template in your Power BI Desktop [Network Watcher Power BI flow logs template](https://github.com/Azure/NWPublicScripts/raw/main/nw-public-docs-artifacts/nsg-flow-logs/PowerBI_FlowLogs_Storage_Template.pbit)
::: zone-end

::: zone pivot="virtual-network"
2. Enter the required query parameters:

   - **StorageAccountName:** the name of the storage account containing the flow logs that you want to load and visualize.

   - **NumberOfLogFiles:** the number of log files that you want to download and visualize in Power BI. For example, if you enter 50, then you can view the latest 50 log files. If you have two virtual networks enabled and configured to send flow logs to this account, then you can view the past 25 hours of logs.
::: zone-end
::: zone pivot="network-security-group"
2. Enter the required query parameters:

   - **StorageAccountName:** the name of the storage account containing the flow logs that you want to load and visualize.

   - **NumberOfLogFiles:** the number of log files that you want to download and visualize in Power BI. For example, if you enter 50, then you can view the latest 50 log files. If you have two network security groups enabled and configured to send flow logs to this account, then you can view the past 25 hours of logs.
::: zone-end

3. Enter the access key for your storage account. You can find valid access keys by going to your storage account in the Azure portal and selecting **Access keys** under **Security + networking**.

4. Select **Connect** then apply changes.

5. Use the precreated visuals to view your logs.

## Understand the visuals

The template includes a set of visuals that help you analyze your flow log data. The following sections describe each visual in detail, with sample images showing what the dashboard looks like when populated with data.

### Dashboard
::: zone pivot="virtual-network"
:::image type="content" source="./media/flow-logs-power-bi/power-bi-dashboard1.png" alt-text="Screenshot of the Power BI dashboard loaded with virtual network flow logs data." lightbox="./media/flow-logs-power-bi/power-bi-dashboard1.png":::
::: zone-end

::: zone pivot="network-security-group"
:::image type="content" source="./media/flow-logs-power-bi/power-bi-dashboard2.png" alt-text="Screenshot of the Power BI dashboard loaded with network security group flow logs data." lightbox="./media/flow-logs-power-bi/power-bi-dashboard2.png":::
::: zone-end

### Top talkers
 
The top talkers visual shows the IPs that have initiated the most connections over the period specified. The size of the boxes corresponds to the relative number of connections. 

::: zone pivot="virtual-network"
:::image type="content" source="./media/flow-logs-power-bi/top-talkers1.png" alt-text="Screenshot of virtual network flow logs top talkers." lightbox="./media/flow-logs-power-bi/top-talkers1.png":::
::: zone-end

::: zone pivot="network-security-group"
:::image type="content" source="./media/flow-logs-power-bi/top-talkers2.png" alt-text="Screenshot of network security group flow logs top talkers." lightbox="./media/flow-logs-power-bi/top-talkers2.png":::
::: zone-end

### Flows over time and by direction/decision

The following time series graphs show the number of flows over the period. The first graph is segmented by the flow direction, and the second one is segmented by the decision made (allow or deny). With this visual, you can examine your traffic trends over time, and spot any abnormal spikes or decline in traffic or traffic segmentation.

::: zone pivot="virtual-network"
:::image type="content" source="./media/flow-logs-power-bi/flows-time1.png" alt-text="Screenshot of virtual network flows over time and by direction/decision." lightbox="./media/flow-logs-power-bi/flows-time1.png":::
::: zone-end

::: zone pivot="network-security-group"
:::image type="content" source="./media/flow-logs-power-bi/flows-time2.png" alt-text="Screenshot of network security group flows over time and by direction/decision." lightbox="./media/flow-logs-power-bi/flows-time2.png":::
::: zone-end

### Flows by network interface

The following graphs show the flows per network interface. The first graph is segmented by flow direction and the second one is segmented by decision made. With this information, you can gain insights into which of your virtual machines (VMs) communicated the most relative to others, and if traffic to a specific VM is being allowed or denied.

::: zone pivot="virtual-network"
:::image type="content" source="./media/flow-logs-power-bi/flows-time1.png" alt-text="Screenshot of virtual network flows over time and by direction/decision." lightbox="./media/flow-logs-power-bi/flows-time1.png":::
::: zone-end

::: zone pivot="network-security-group"
:::image type="content" source="./media/flow-logs-power-bi/flows-network-interface2.png" alt-text="Screenshot of network security group flows per network interface." lightbox="./media/flow-logs-power-bi/flows-network-interface2.png":::
::: zone-end

### Flows by destination port

The following wheel chart shows a breakdown of flows by destination port. With this information, you can view the most commonly used destination ports used within the specified period.

::: zone pivot="virtual-network"
:::image type="content" source="./media/flow-logs-power-bi/flows-destination-port1.png" alt-text="Screenshot of virtual network flows by destination port." lightbox="./media/flow-logs-power-bi/flows-destination-port1.png":::
::: zone-end

::: zone pivot="network-security-group"
:::image type="content" source="./media/flow-logs-power-bi/flows-destination-port2.png" alt-text="Screenshot of network security group flows by destination port." lightbox="./media/flow-logs-power-bi/flows-destination-port2.png":::
::: zone-end

::: zone pivot="virtual-network"

### Flows by virtual network and rule

The following bar chart shows the flow by virtual network and rule. With this information, you can see the virtual networks responsible for the most traffic, and the breakdown of traffic on a virtual network by rule.

:::image type="content" source="./media/flow-logs-power-bi/flows-rule1.png" alt-text="Screenshot of flows by virtual network and rule." lightbox="./media/flow-logs-power-bi/flows-rule1.png":::

::: zone-end

::: zone pivot="network-security-group"

### Flows by network security group and rule

The following bar chart shows the flow by network security group and rule. With this information, you can see the network security groups responsible for the most traffic, and the breakdown of traffic on a network security group by rule.

:::image type="content" source="./media/flow-logs-power-bi/flows-rule2.png" alt-text="Screenshot of flows by network security group and rule." lightbox="./media/flow-logs-power-bi/flows-rule2.png":::

::: zone-end

## Considerations

::: zone pivot="virtual-network"
- Logs by default are stored in `https://{storageAccountName}.blob.core.windows.net/insights-logs-insights-logs-flowlogflowevent/`

    - Modify the queries if your data exists in a different directory.
::: zone-end

::: zone pivot="network-security-group"
- Logs by default are stored in `https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/`

    - Modify the queries if your data exists in a different directory.
::: zone-end

- The provided template isn't recommended for use with more than 1 GB of logs.

- If you have a large amount of log data, we recommend that you investigate a solution using another data store like Data Lake or SQL server.

## Next step

> [!div class="nextstepaction"]
> [Read flow logs](flow-logs-read.md)

