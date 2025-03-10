---
title: Visualizing Azure NSG flow logs - Power BI
titleSuffix: Azure Network Watcher
description: Learn how to use Power BI to visualize network security group flow logs to allow you to view information about your IP traffic.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 10/23/2024
---

# Visualizing network security group flow logs with Power BI

[!INCLUDE [NSG flow logs retirement](../../includes/network-watcher-nsg-flow-logs-retirement.md)]

Network security group flow logs allow you to view information about ingress and egress IP traffic on network security groups. These flow logs show outbound and inbound flows on a per rule basis, the NIC the flow applies to, 5-tuple information about the flow (Source/Destination IP, Source/Destination Port, Protocol), and if the traffic was allowed or denied.

It can be difficult to gain insights into flow logging data by manually searching the log files. In this article, we provide a solution to visualize your most recent flow logs and learn about traffic on your network.

> [!Warning]  
> The following steps work with flow logs version 1. For details, see [Introduction to flow logging for network security groups](nsg-flow-logs-overview.md). The following instructions will not work with version 2 of the log files, without modification.

## Scenario

In the following scenario, we connect Power BI desktop to the storage account we have configured as the sink for our NSG Flow Logging data. After we connect to our storage account, Power BI downloads and parses the logs to provide a visual representation of the traffic that is logged by Network Security groups.

Using the visuals supplied in the template you can examine:

* Top Talkers
* Time Series Flow Data by direction and rule decision
* Flows by Network Interface MAC address
* Flows by NSG and Rule
* Flows by Destination Port

The template provided is editable so you can modify it to add new data, visuals, or edit queries to suit your needs.

## Setup

Before you begin, you must have network security group Flow Logging enabled on one or many network security groups in your account. For instructions on enabling Network Security flow logs, refer to the following article: [Introduction to flow logging for network security groups](nsg-flow-logs-overview.md).

You must also have the Power BI Desktop client installed on your machine, and enough free space on your machine to download and load the log data that exists in your storage account.

![Visio diagram][1]

### Steps

1. Download and open the following Power BI template in the Power BI Desktop application [Network Watcher Power BI flow logs template](https://github.com/Azure/NWPublicScripts/raw/main/nw-public-docs-artifacts/nsg-flow-logs/PowerBI_FlowLogs_Storage_Template.pbit)
1. Enter the required Query parameters
   1. **StorageAccountName** – Specifies to the name of the storage account containing the NSG flow logs that you would like to load and visualize.
   1. **NumberOfLogFiles** – Specifies the number of log files that you would like to download and visualize in Power BI. For example, if 50 is specified, the 50 latest log files. If we have 2 NSGs enabled and configured to send NSG flow logs to this account, then the past 25 hours of logs can be viewed.

      ![power BI main][2]

1. Enter the access key for your storage account. You can find valid access keys by going to your storage account in the Azure portal and selecting **Access keys** under **Security + networking**. Select **Connect** then apply changes.

    ![access key 2][4]

4. Your logs are downloaded and parsed and you can now utilize the pre-created visuals.

## Understanding the visuals

Provided in the template are a set of visuals that help make sense of the NSG Flow Log data. The following images show a sample of what the dashboard looks like when populated with data. Below we examine each visual in greater detail. 

![powerbi][5]
 
The Top Talkers visual shows the IPs that have initiated the most connections over the period specified. The size of the boxes corresponds to the relative number of connections. 

![toptalkers][6]

The following time series graphs show the number of flows over the period. The upper graph is segmented by the flow direction, and the lower is segmented by the decision made (allow or deny). With this visual, you can examine your traffic trends over time, and spot any abnormal spikes or decline in traffic or traffic segmentation.

![flowsoverperiod][7]

The following graphs show the flows per Network interface, with the upper segmented by flow direction and the lower segmented by decision made. With this information, you can gain insights into which of your VMs communicated the most relative to others, and if traffic to a specific VM is being allowed or denied.

![flowspernic][8]

The following donut wheel chart shows a breakdown of Flows by Destination Port. With this information, you can view the most commonly used destination ports used within the specified period.

![donut][9]

The following bar chart shows the Flow by NSG and Rule. With this information, you can see the NSGs responsible for the most traffic, and the breakdown of traffic on an NSG by rule.

![barchart][10]
 
The following informational charts display information about the NSGs present in the logs, the number of Flows captured over the period, and the date of the earliest log captured. This information gives you an idea of what NSGs are being logged and the date range of flows.

![infochart1][11]

![infochart2][12]

This template includes the following slicers to allow you to view only the data you're most interested in. You can filter on your resource groups, NSGs, and rules. You can also filter on 5-tuple information, decision, and the time the log was written.

![slicers][13]

## Conclusion

We showed in this scenario that by using network security group Flow logs provided by Network Watcher and Power BI, we are able to visualize and understand the traffic. Using the provided template, Power BI downloads the logs directly from storage and processes them locally. Time taken to load the template varies depending on the number of files requested and total size of files downloaded.

Feel free to customize this template for your needs. There are many numerous ways that you can use Power BI with network security group Flow Logs. 

## Notes

* Logs by default are stored in `https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/`

    * If other data exists in another directory they the queries to pull and process the data must be modified.

* The provided template isn't recommended for use with more than 1 GB of logs.

* If you have a large amount of logs, we recommend that you investigate a solution using another data store like Data Lake or SQL server.

## Next steps

Learn how to visualize your NSG flow logs with the Elastic Stack by visiting [Visualize Azure Network Watcher NSG flow logs using open source tools](network-watcher-visualize-nsg-flow-logs-open-source-tools.md)

[1]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure1.png
[2]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure2.png
[4]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure4.png
[5]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure5.png
[6]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure6.png
[7]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure7.png
[8]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure8.png
[9]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure9.png
[10]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure10.png
[11]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure11.png
[12]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure12.png
[13]: ./media/network-watcher-visualize-nsg-flow-logs-power-bi/figure13.png
