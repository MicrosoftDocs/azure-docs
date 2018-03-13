---
title: Network Performance Monitor solution in Azure Log Analytics | Microsoft Docs
description: The ExpressRoute Manager capability in Network Performance Monitor allows you to monitor end-to-end connectivity and performance between your branch offices and Azure, over Azure ExpressRoute.
services: log-analytics
documentationcenter: ''
author: abshamsft
manager: carmonm
editor: ''
ms.assetid: 5b9c9c83-3435-488c-b4f6-7653003ae18a
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/20/2018
ms.author: abshamsft

---
# ExpressRoute Manager

The ExpressRoute Manager capability in [Network Performance Monitor](log-analytics-network-performance-monitor.md) allows you to monitor end-to-end connectivity and performance between your branch offices and Azure, over Azure ExpressRoute. Key advantages are: 

- Auto-detection of ExpressRoute circuits associated with your subscription 
- Tracking of bandwidth utilization, loss and latency at the circuit, peering and VNet level for your ExpressRoute 
- Discovery of network topology of your ExpressRoute circuits 

![ExpressRoute Monitor](media/log-analytics-network-performance-monitor/expressroute-intro.png)

## Configuration 
To open the configuration for Network Performance Monitor, open the [Network Performance Monitor solution](log-analytics-network-performance-monitor.md) and click the **Configure** button.

### Configure NSG rules 
For the servers in Azure that are being used for the monitoring via NPM, you must configure network security group (NSG) rules to allow TCP traffic on the port used by NPM for synthetic transactions. The default port is 8084. This allows the OMS agent installed on Azure VM to communicate with an on-premises monitoring agent. 

For more information about NSG, see [Network Security Groups](../virtual-network/virtual-networks-create-nsg-arm-pportal.md). 

>[!NOTE]
> Make sure that you have installed the agents (both the on-premises server agent and the Azure server agent) and have run the EnableRules.ps1 PowerShell script before proceeding with this step. 

 
### Discover ExpressRoute Peering connections 
 
1. Click on the **ExpressRoute Peerings** view.  
2. Click on the **Discover Now** button to discover all the ExpressRoute private peerings that are connected to the VNETs in the Azure subscription linked with this Log Analytics workspace.  

>[!NOTE]  
> The solution currently discovers only ExpressRoute private peerings. 

>[!NOTE]  
> Only those private peerings are discovered which are connected to the VNETs associated with the subscription linked with this Log Analytics workspace. If your ExpressRoute is connected to VNETs outside of the subscription linked to this workspace, you need to create a Log Analytics workspace in those subscriptions and use NPM to monitor those peerings. 

 ![ExpressRoute Monitor Configure](media/log-analytics-network-performance-monitor/expressroute-configure.png)
 
 Once the discovery is complete, the discovered private peering connections are listed in a table. The monitoring for these peerings will initially be in disabled state. 

### Enable monitoring of the ExpressRoute peering connections 

1. Click on the private peering connecting you are interested in monitoring.  
2. On the RHS pane, click on the checkbox for **Monitor this Peering**. 
3. If you intend to create health events for this connection, then check **Enable Health Monitoring for this peering**. 
4. Choose monitoring conditions. You can set custom thresholds for health event generation by typing threshold values. Whenever the value of the condition goes above its selected threshold for the peering connection, a health event is  generated. 
5. Click on **Add Agents** to choose the monitoring agents you intend to use for monitoring this peering connection. You need to ensure that you add agents on both the ends of the connection, at least one agent in the Azure VNET connected to this peering as well as at least one on-premises agent connected to this peering. 
6. Click **Save** to save the configuration. 

![ExpressRoute Monitor Configure](media/log-analytics-network-performance-monitor/expressroute-configure-discovery.png)


After enabling the rules and selecting the values and agents you want to monitor, there is a wait of approximately 30-60 minutes for the values to begin populating and the **ExpressRoute Monitoring** tiles to become available. Once you see the monitoring tiles, your ExpressRoute circuits and connection resources are being monitored by NPM. 

>[!NOTE]
> This capability works reliable on workspaces that have upgraded to the new query language.  

## Walkthrough 

The Network Performance Monitoring dashboard shows an overview of the health of ExpressRoute circuits and peering connections. 

![NPM Dashboard ExpressRoute](media/log-analytics-network-performance-monitor/npm-dashboard-expressroute.png) 

### Circuits list 

To see a list of all monitored ExpressRoute circuits, click on the ExpressRoute circuits tile. You can select a circuit and view its health state, trend charts for packet loss, bandwidth utilization, and latency. The charts are interactive. You can select a custom time window for plotting the charts. You can drag the mouse over an area on the chart to zoom in and see fine-grained data points. 

![ExpressRoute Circuits List](media/log-analytics-network-performance-monitor/expressroute-circuits.png) 

### Trend of Loss, Latency, and Throughput 

The bandwidth, latency, and loss charts are interactive. You can zoom into any section of these charts, using mouse controls. You can also see the bandwidth, latency, and loss data for other intervals by clicking Date/Time, located below the Actions button on the upper left. 

![ExpressRoute Latency](media/log-analytics-network-performance-monitor/expressroute-latency.png) 

### Peerings list 

Clicking on the **Private Peerings** tile on the dashboard brings up a list of all connections to virtual networks over private peering. Here, you can select a virtual network connection and view its health state, trend charts for packet loss, bandwidth utilization, and latency. 

![ExpressRoute Peerings](media/log-analytics-network-performance-monitor/expressroute-peerings.png) 

### Circuit topology 

To view circuit topology, click on the **Topology** tile. This takes you to the topology view of the selected circuit or peering. The topology diagram provides the latency for each segment on the network and each layer 3 hop is represented by a node of the diagram. Clicking on a hop reveals more details about the hop. You can increase the level of visibility to include on-premises hops by moving the slider bar below **Filters**. Moving the slider bar to the left or right, increases/decreases the number of hops in the topology graph. The latency across each segment is visible, which allows for faster isolation of high latency segments on your network. 

![ExpressRoute Topology](media/log-analytics-network-performance-monitor/expressroute-topology.png)  

### Detailed Topology view of a circuit 

This view shows VNet connections. 

![ExpressRoute VNet](media/log-analytics-network-performance-monitor/expressroute-vnet.png)
 

### Diagnostics 

Network Performance Monitor helps you diagnose several circuit connectivity issues. Some of the issues are listed below 

**Circuit is down.** NPM notifies you as soon as the connectivity between your on-premises resources and Azure VNETs is lost. This helps you take proactive action before receiving user escalations and reduce the down time 

![ExpressRoute Circuit Down](media/log-analytics-network-performance-monitor/expressroute-circuit-down.png)
 

**Traffic not flowing through intended circuit.** NPM can notify you whenever the traffic is unexpectedly not flowing through the intended ExpressRoute circuit. This can happen if the circuit is down and the traffic is flowing through the backup route, or if there is a routing issue. This information helps you proactively manage any configuration issues in your routing policies and ensure that the most optimal and secure route is used. 

 

**Traffic not flowing through primary circuit.** The capability notifies you when the traffic is flowing through the secondary ExpressRoute circuit. Even though you will not experience any connectivity issues in this case, but proactively troubleshooting the issues with the primary circuit make you better prepared. 

 
![ExpressRoute Traffic Flow](media/log-analytics-network-performance-monitor/expressroute-traffic-flow.png)


**Degradation due to peak utilization.** You can correlate the bandwidth utilization trend with the latency trend to identify whether the Azure workload degradation is due to a peak in bandwidth utilization or not and take action accordingly.  

![ExpressRoute Monitor](media/log-analytics-network-performance-monitor/expressroute-peak-utilization.png)

 

## Next steps
* [Search logs](log-analytics-log-searches.md) to view detailed network performance data records.
