---
title: Pricing FAQ for Azure Network Performance Monitor | Microsoft Docs
description: Frequently asked questions - Azure Network Performance Monitor
services: monitoring-and-diagnostics
documentationcenter: na
author: agummadi
manager: cherylmc
editor: ''
tags: azure-resource-manager
ms.assetid: 
ms.service: log-analytics
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/02/2018
ms.author: ajaycode
ms.component: 
---

# Pricing changes for Azure Network Performance Monitor

We have listened to your feedback and recently introduced a [new pricing experience](https://azure.microsoft.com/blog/introducing-a-new-way-to-purchase-azure-monitoring-services/) for various monitoring services across Azure. 
This article captures the pricing changes related to Azure [Network Performance Monitor](https://docs.microsoft.com/azure/networking/network-monitoring-overview) (NPM) in an easy-to-read question and answer format.

Network Performance Monitor consists of three components:
* [Performance Monitor](https://docs.microsoft.com/azure/networking/network-monitoring-overview#performance-monitor)
* [Service Endpoint Monitor](https://docs.microsoft.com/azure/networking/network-monitoring-overview#service-endpoint-monitor)
* [ExpressRoute Monitor](https://docs.microsoft.com/azure/networking/network-monitoring-overview#expressroute-monitor)

The following sections explain the pricing changes for the NPM components.

## Performance Monitor

**How was usage of Performance Monitor billed in the old model?**

The billing for NPM was based on the usage and consumption of two components:
* **Nodes**: All synthetic transactions originate and terminate at the nodes. Nodes are also referred to as agents or Microsoft Management Agents.
* **Data**: The results of the various network tests are stored in the Azure Log Analytics repository.

Under the old model, the bill was computed based on the number of nodes and the volume of data generated. 

**How is usage of Performance Monitor charged under the new model?**

The Performance Monitor feature in NPM is now billed based on a combination of: 

* Subnet links monitored
* Data volume

**What is a subnet link?**

Performance Monitor monitors connectivity between two or more locations on the network. The connection between a group of nodes or agents on one subnet, and a group of nodes on another subnet, is called a subnet link.

**I have two subnets (A and B), and I have several agents on each subnet. Performance Monitor monitors connectivity from all agents on subnet A to all agents on subnet B. Will I be charged based on the number of inter-subnet connections?**

No. For billing purposes, all connections from subnet A to subnet B are grouped together into one subnet link. You're billed for a single connection. Performance Monitor continues to monitor connectivity between various agents on each subnet.

**What are the costs for monitoring a subnet link?**

For the cost of monitoring a single subnet link for the entire month, see the [Ping Mesh](https://azure.microsoft.com/pricing/details/network-watcher/) section.

**What are the charges for data that Performance Monitor generates?**

The charge for ingestion (data upload to Log Analytics, processing, and indexing) is available on the [pricing page](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics, in the Data Ingestion section. The charge for data retention (that is, data retained at customer's option, beyond the first month) is also available on the [pricing page](https://azure.microsoft.com/pricing/details/log-analytics/), in the Data Retention section.


## ExpressRoute Monitor

**What are the charges for usage of ExpressRoute Monitor?**

Charges for ExpressRoute Monitor are billed based on the volume of data generated during monitoring. For more information, see "What are the charges for data that Performance Monitor generates?"

**I use ExpressRoute Monitor to monitor multiple ExpressRoute circuits. Am I charged based on the number of circuits being monitored?**

You are not charged based on either the number of circuits or the type of peering (for example, private peering, Microsoft peering). You are charged based on the volume of data, as explained previously.

**What is the volume of data generated when ExpressRoute monitors a single circuit?**

The volume of data generated per month, when ExpressRoute monitors a private peering connection, is as follows:

|Percentile      |Data/month (MB)|
| :---:          |           ---:|
|50<sup>th</sup> |            192|
|60<sup>th</sup> |            256|
|70<sup>th</sup> |            360|
|80<sup>th</sup> |            498|
|90<sup>th</sup> |            870|
|95<sup>th</sup> |           1560|


According to this table, customers at the 50th percentile pay for 192 MB of data. At USD $2.30/GB for the first month, the cost incurred for monitoring a circuit is USD $0.43 (= 192 * 2.30 / 1024).

**What are some reasons for variations in the volume of data?**

The volume of monitoring data generated depends on several factors, such as:
* Number of agents. The accuracy of fault isolation increases with an increase in the number of agents.
* Number of hops on the network.
* Number of paths between the source and the destination.

Customers at the higher percentiles (in the preceding table) usually monitor their circuits from several vantage points on their on-premises network. Multiple agents are also placed deeper in the network, farther from the service provider edge router. The agents are often placed at several user sites, branches, and racks in datacenters.

## Service Endpoint Monitor

**What are the charges for usage of Service Endpoint Monitor?**

Charges for usage of Service Endpoint Monitor are computed based on:
* Number of connections
* Volume of data

**What is a connection?**

A connection is a test of reachability to one endpoint (URL or network service) from a single agent for the entire month. For example, monitoring a connection to bing.com from three agents constitutes three connections.

**What are the costs for Service Endpoint Monitor?**

Refer to the [Connection Monitoring](https://azure.microsoft.com/pricing/details/network-watcher/) section for the cost of monitoring an endpoint for the entire month. The charge for data is available on the [pricing page](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics, in the Data Ingestion section.

## References

[Log Analytics Pricing FAQ](https://azure.microsoft.com/pricing/details/log-analytics/): The FAQ section has information on free tier, per node pricing and other pricing details.

