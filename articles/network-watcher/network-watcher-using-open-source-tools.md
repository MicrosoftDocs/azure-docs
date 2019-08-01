---
title: Visualize network traffic patterns with Azure Network Watcher and open source tools | Microsoft Docs
description: This page describes how to use Network Watcher packet capture with Capanalysis to visualize traffic patterns to and from your VMs.
services: network-watcher
documentationcenter: na
author: KumudD
manager: twooley
editor:

ms.assetid: 936d881b-49f9-4798-8e45-d7185ec9fe89
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: kumud
---

# Visualize network traffic patterns to and from your VMs using open-source tools

Packet captures contain network data that allow you to perform network forensics and deep packet inspection. There are many opens source tools you can use to analyze packet captures to gain insights about your network. One such tool is CapAnalysis, an open-source packet capture visualization tool. Visualizing packet capture data is a valuable way to quickly derive insights on patterns and anomalies within your network. Visualizations also provide a means of sharing such insights in an easily consumable manner.

Azure’s Network Watcher provides you the ability to capture data by allowing you to perform packet captures on your network. This article, provides a walk through of how to visualize and gain insights from packet captures using CapAnalysis with Network Watcher.

## Scenario

You have a simple web application deployed on a VM in Azure want to use open-source tools to visualize its network traffic to quickly identify flow patterns and any possible anomalies. With Network Watcher, you can obtain a packet capture of your network environment and directly store it on your storage account. CapAnalysis can then ingest the packet capture directly from the storage blob and visualize its contents.

![scenario][1]

## Steps

### Install CapAnalysis

To install CapAnalysis on a virtual machine, you can refer to the official instructions here https://www.capanalysis.net/ca/how-to-install-capanalysis.
In order access CapAnalysis remotely, you need to open port 9877 on your VM by adding a new inbound security rule. For more about creating rules in Network Security Groups, refer to [Create rules in an existing NSG](../virtual-network/manage-network-security-group.md#create-a-security-rule). Once the rule has been successfully added, you should be able to access CapAnalysis from `http://<PublicIP>:9877`

### Use Azure Network Watcher to start a packet capture session

Network Watcher allows you to capture packets to track traffic in and out of a virtual machine. You can refer to the instructions at [Manage packet captures with Network Watcher](network-watcher-packet-capture-manage-portal.md) to start a packet capture session. A packet capture can be stored in a storage blob to be accessed by CapAnalysis.

### Upload a packet capture to CapAnalysis
You can directly upload a packet capture taken by network watcher using the “Import from URL” tab and providing a link to the storage blob where the packet capture is stored.

When providing a link to CapAnalysis, make sure to append a SAS token to the storage blob URL.  To do this, navigate to Shared access signature from the storage account, designate the allowed permissions, and press the Generate SAS button to create a token. You can then append the SAS token to the packet capture storage blob URL.

The resulting URL will look something like the following URL: http://storageaccount.blob.core.windows.net/container/location?addSASkeyhere


### Analyzing packet captures

CapAnalysis offers various options to visualize your packet capture, each providing analysis from a different perspective. With these visual summaries, you can understand your network traffic trends and quickly spot any unusual activity. A few of these features are shown in the following list:

1. Flow Tables

    This table gives you the list of flows in the packet data, the time stamp associated with the flows and the various protocols associated with the flow, as well as source and destination IP.

    ![capanalysis flow page][5]

1. Protocol Overview

    This pane allows you to quickly see the distribution of network traffic over the various protocols and geographies.

    ![capanalysis protocol overview][6]

1. Statistics

    This pane allows you to view network traffic statistics – bytes sent and received from source and destination IPs, flows for each of the source and destination IPs, protocol used for various flows, and the duration of flows.

    ![capanalysis statistics][7]

1. Geomap

    This pane provides you with a map view of your network traffic, with colors scaling to the volume of traffic from each country/region. You can select highlighted countries/regions to view additional flow statistics such as the proportion of data sent and received from IPs in that country/region.

    ![geomap][8]

1. Filters

    CapAnalysis provides a set of filters for quick analysis of specific packets. For example, you can choose to filter the data by protocol to gain specific insights on that subset of traffic.

    ![filters][11]

    Visit [https://www.capanalysis.net/ca/#about](https://www.capanalysis.net/ca/#about) to learn more about all CapAnalysis' capabilities.

## Conclusion

Network Watcher’s packet capture feature allows you to capture the data necessary to perform network forensics and better understand your network traffic. In this scenario, we showed how packet captures from Network Watcher can easily be integrated with open-source visualization tools. By using open-source tools such as CapAnalysis to visualize packets captures, you can perform deep packet inspection and quickly identify trends within your network traffic.

## Next steps

To learn more about NSG flow logs, visit [NSG Flow logs](network-watcher-nsg-flow-logging-overview.md)

Learn how to visualize your NSG flow logs with Power BI by visiting [Visualize NSG flows logs with Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)
<!--Image references-->

[1]: ./media/network-watcher-using-open-source-tools/figure1.png
[2]: ./media/network-watcher-using-open-source-tools/figure2.png
[3]: ./media/network-watcher-using-open-source-tools/figure3.png
[4]: ./media/network-watcher-using-open-source-tools/figure4.png
[5]: ./media/network-watcher-using-open-source-tools/figure5.png
[6]: ./media/network-watcher-using-open-source-tools/figure6.png
[7]: ./media/network-watcher-using-open-source-tools/figure7.png
[8]: ./media/network-watcher-using-open-source-tools/figure8.png
[9]: ./media/network-watcher-using-open-source-tools/figure9.png
[10]: ./media/network-watcher-using-open-source-tools/figure10.png
[11]: ./media/network-watcher-using-open-source-tools/figure11.png
