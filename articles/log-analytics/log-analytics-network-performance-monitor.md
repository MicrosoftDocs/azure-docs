---
title: Network Performance Monitor solution in Azure | Microsoft Docs
description: Network Performance Monitor in Azure helps you monitor the performance of your networks-in near real time-to detect and locate network performance bottlenecks.
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
# Network Performance Monitor solution in Azure

![Network Performance Monitor symbol](./media/log-analytics-network-performance-monitor/npm-symbol.png)


Network Performance Monitor (NPM) is a cloud-based hybrid network monitoring solution that helps you monitor network performance between various points in your network infrastructure, monitor network connectivity to service/application endpoints and monitor the performance of your Azure ExpressRoute.  

NPM detects network issues like traffic blackholing, routing errors, and issues that conventional network monitoring methods are not able to detect. The solution generates alerts, notifies when a threshold is breached for a network link, ensures timely detection of network performance issues, and localizes the source of the problem to a particular network segment or device. 

NPM offers three broad capabilities: 

[Performance Monitor](log-analytics-network-performance-monitor-performance-monitor.md): Monitor network connectivity across cloud deployments and on-premises locations, multiple data centers, and branch offices, mission critical multi-tier applications/micro-services. With Performance Monitor, you can detect network issues before your users complain.  

[Service Endpoint Monitor](log-analytics-network-performance-monitor-service-endpoint.md): You can monitor the connectivity from your users to the services you care about, determine what infrastructure is in the path, and where network bottlenecks are occurring. Know about outages before your users and see the exact location of the issues along your network path. 

This capability helps you perform http, HTTPS, TCP, and ICMP based tests to monitor in near real time or historically the availability and response time of your service, and the contribution of the network in packet loss and latency. With network topology map, you can isolate network slowdowns by identifying problem spots that occur along the network path from the node to the service, with latency data on each hop. With Built-in tests, monitor network connectivity to Office365 and Dynamics CRM without any pre-configuration. With this capability, you can monitor network connectivity to any TCP capable endpoint such as websites, SaaS, PaaS applications, SQL databases, etc.  

[￼ExpressRoute Monitor](log-analytics-network-performance-monitor-expressroute.md): Monitor end-to-end connectivity and performance between your branch offices and Azure, over Azure ExpressRoute.  
 

## Set up and configure

### Install and configure agents 

Use the basic processes to install agents at [Connect Windows computers to Log Analytics](log-analytics-windows-agents.md) and [Connect Operations Manager to Log Analytics](log-analytics-om-agents.md).

### Where to install the agents 

**Performance Monitor:** Install OMS agents on at least one node connected to each subnetwork from which you want to monitor network connectivity to other subnetworks.  

To monitor a network link, you must install agents on both endpoints of that link.  If you are unsure about the topology of your network, install the agents on servers with critical workloads between which you want to monitor the network performance. For example, if you want to monitor network connection between a Web server and a server running SQL, install an agent on both servers. Agents monitor network connectivity (links) between hosts  not the hosts themselves. 

**Service Endpoint Monitor:** Install OMS agent on each node from which you want to monitor the network connectivity to the service endpoint. For example, if you intend to monitor network connectivity to Office365 from your office site O1, O2, and O3, then install the OMS agent on at least one node each in O1, O2, and O3. 

**ExpressRoute Monitor:** Install at least one OMS agent in your Azure VNET and at least one agent in your on-premises subnetwork, which is connected through the ExpressRoute Private Peering.  

### Configure OMS agents for monitoring  

NPM uses synthetic transactions to monitor network performance between source and destination agents. The solution offers a choice between TCP and ICMP as the protocol for monitoring in  Performance Monitor and Service Endpoint Monitor capabilities, whereas TCP is used for ExpressRoute Monitor. Ensure that the firewall allows communication between the OMS agents being used for monitoring on the protocol you’ve chosen for monitoring.  

**TCP protocol:**  If you’ve chosen TCP as the protocol for monitoring, open the Firewall port on the agents being used for Performance Monitor and ExpressRoute Monitor capabilities, to ensure that the agents can connect to each other. To do this, run the EnableRules.ps1 PowerShell script without any parameters in a power shell window with administrative privileges.  

The script creates registry keys required by the solution and it creates Windows firewall rules to allow agents to create TCP connections with each other. The registry keys created by the script also specify whether to log the debug logs and the path for the logs file. It also defines the agent TCP port used for communication. The values for these keys are automatically set by the script, so you should not manually change these keys. The port opened by default is 8084. You can use a custom port by providing the parameter portNumber to the script. However, the same port should be used on all the computers where the script is run. 

>[!NOTE]
> The script configures only windows firewall locally. If you have a network firewall, you should make sure that it is allowing traffic destined for the TCP port being used by NPM 

>[!NOTE]
> You do not need to run the EnableRules.ps1 PowerShell script for Service Endpoint Monitor 

 

**ICMP protocol** - If you’ve chosen ICMP as the protocol for monitoring, enable the following firewall rules for reliably utilizing ICMP: 

 
```
netsh advfirewall firewall add rule name="NPMDICMPV4Echo" protocol="icmpv4:8,any" dir=in action=allow 
netsh advfirewall firewall add rule name="NPMDICMPV6Echo" protocol="icmpv6:128,any" dir=in action=allow 
netsh advfirewall firewall add rule name="NPMDICMPV4DestinationUnreachable" protocol="icmpv4:3,any" dir=in action=allow 
netsh advfirewall firewall add rule name="NPMDICMPV6DestinationUnreachable" protocol="icmpv6:1,any" dir=in action=allow 
netsh advfirewall firewall add rule name="NPMDICMPV4TimeExceeded" protocol="icmpv4:11,any" dir=in action=allow 
netsh advfirewall firewall add rule name="NPMDICMPV6TimeExceeded" protocol="icmpv6:3,any" dir=in action=allow 
```
 

### Configure the solution 

1. Add the Network Performance Monitor solution to your workspace from [Azure marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.NetworkMonitoringOMS?tab=Overview) or by using the process described in [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md). 
2. Open your Log Analytics workspace and click on the **Overview** tile.  
3. Click on the tile titled **Network Performance Monitor** with the message *Solution requires additional configuration*.

    ![NPM Tile](media/log-analytics-network-performance-monitor/npm-config.png)

3. On the **Setup** page, you see the option to install OMS agents and configure the agents for monitoring in the **Common Settings** view. As explained above, if you’ve already installed and configured OMS agents, then click on the **Setup** View for configuring the capability you are interested in using.  

    **Performance Monitor View** - Choose what protocol should be used for synthetic transactions in the Default performance monitor rule and click on Save and Continue. This protocol selection only holds for the system-generated default rule, and you need to choose the protocol each time you create a Performance Monitor rule explicitly. You can always move to the Default rule settings in the Performance Monitor tab (this appears after you complete your day-0 configuration) and change the protocol later. In case you aren’t interested in the rPerfomance Monitor capability, you can disable the default rule from the Default rule settings in the Performance Monitor tab. 

    ![NPM Configuration](media/log-analytics-network-performance-monitor/npm-synthetic-transactions.png)
    
    **Service Endpoint Monitor View** - The capability provides built-in preconfigured tests to monitor network connectivity to Office365 and Dynamcis365 from your agents. Choose the Office365 and Dynamcis365 services that you are interested in monitoring by checking the checkbox beside them. Choose the agents from which you want to monitor, by clicking on the Add Agents button. If you don’t want to use this capability or want to set it up later, you can choose to skip this and directly click on **Save** and **Continue** without choosing anything.  

    ![NPM Configuration](media/log-analytics-network-performance-monitor/npm-service-endpoint-monitor.png)

    **ExpressRoute Monitor View** - Click on the **Discover Now** button to discover all the ExpressRoute private peerings that are connected to the VNETs in the Azure subscription linked with this Log Analytics workspace.  


    >[!NOTE] 
    > The solution currently discovers only ExpressRoute private peerings. 

    >[!NOTE] 
    > Only those private peerings are discovered which are connected to the VNETs associated with the subscription linked with this Log Analytics workspace. If your ExpressRoute is connected to VNETs outside of the subscription linked to this workspace, you need to create a Log Analytics workspace in those subscriptions and use NPM to monitor those peerings. 

    ![NPM Configuration](media/log-analytics-network-performance-monitor/npm-express-route.png)

    Once the discovery is complete, the discovered private peerings are listed in a table.  

    ![NPM Configuration](media/log-analytics-network-performance-monitor/npm-private-peerings.png)
    
    The monitoring for these peerings are initially in disabled state. Click on each peering that you are interested in monitoring and configure monitoring for them from the right-hand side (RHS) details view.  Click on Save button to save the configuration. See [Configure ExpressRoute monitoring]() to learn more.  

    Once the setup is complete, it takes 30 minutes to an hour for the data to populate. While the solution is aggregating data from your network, you see *Solution requires additional configuration* on the NPM overview tile. Once the data is collected and indexed, the overview tile changes and informs you the summary of the health of your network. You can then choose to edit the monitoring of the nodes on which OMS agents are installed, as well as the subnets discovered from your environment 

#### Edit monitoring settings for subnets and nodes 

All subnets with at least one agent installed are listed on the Subnetworks tab in the configuration page. 


To enable or disable monitoring of particular subnetworks 

1. Select or clear the box next to the **subnetwork ID** and then ensure that **Use for Monitoring** is selected or cleared, as appropriate. You can select or clear multiple subnets. When disabled, subnetworks are not monitored as the agents are updated to stop pinging other agents. 
2. Choose the nodes that you want to monitor in a particular subnetwork by selecting the subnetwork from the list and moving the required nodes between the lists containing unmonitored and monitored nodes. You can add a **custom description to** the subnetwork. 
3. Click **Save** to save the configuration. 

#### Choose nodes to monitor

All the nodes that have an agent installed on them are listed in the **Nodes** tab. 

1. Select or clear the nodes that you want to monitor or stop monitoring. 
2. Click **Use for Monitoring**, or clear it, as appropriate. 
3. Click **Save**. 


Configure the capability(s) you are interested in: 
- Configure [Performance Monitor](log-analytics-network-performance-monitor-performance-monitor.md#configuration)
- Configure [Service Endpoint Monitor](log-analytics-network-performance-monitor-performance-monitor.md#configuration)
- Configure [ExpressRoute Monitor](log-analytics-network-performance-monitor-expressroute.md#configuration)

 

## Data collection details
Network Performance Monitor uses TCP SYN-SYNACK-ACK handshake packets when TCP is chosen and ICMP ECHO ICMP ECHO REPLY when ICMP is chosen as the protocol to collect loss and latency information. Traceroute is also used to get topology information.

The following table shows data collection methods and other details about how data is collected for Network Performance Monitor.

| platform | Direct Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- |
| Windows | &#8226; | &#8226; |  |  |  |TCP handshakes/ICMP ECHO messages every 5 seconds, data sent every 3 minutes |
 

 
The solution uses synthetic transactions to assess the health of the network. OMS agents installed at various points in the network exchange TCP packets or ICMP Echo (depending on the protocol selected for monitoring) with one another. In the process, agents learn the round-trip time and packet loss, if any. Periodically, each agent also performs a trace route to other agents to find all the various routes in the network that must be tested. Using this data, the agents can deduce the network latency and packet loss figures. The tests are repeated every five seconds and data is aggregated for a period of three minutes by the agents before uploading it to the Log Analytics service. 



>[!NOTE]
> Although agents communicate with each other frequently, they do not generate significant of network traffic while conducting the tests. Agents rely only on TCP SYN-SYNACK-ACK handshake packets to determine the loss and latency -- no data packets are exchanged. During this process, agents communicate with each other only when needed and the agent communication topology is optimized to reduce network traffic.

## Using the solution 

### NPM Overview tile 

After you've enabled the Network Performance Monitor solution, the solution tile on the Overview page provides a quick overview of the network health. 

 ![NPM Overview Tile](media/log-analytics-network-performance-monitor/npm-overview-tile.png)

### Network Performance Monitor dashboard 

The **Top Network Health Events** page provides a list of most recent health events and alerts in the system and the time since the event has been active. A health event or alert is generated whenever the value of the chosen metric (loss, latency, response time, or bandwidth utilization) for the monitoring rule exceeds the threshold. 

The **Performance Monitor** page provides you a summary of the health of the Network links and Subnetwork links being monitored by the solution. The Topology tile informs the number of network paths being monitored in your network. Clicking on this tile directly navigates you to the Topology view. 

The **Service Endpoint Monitor** page provides you a summary of the health of the different tests you’ve created. The Topology tile informs the number of endpoints being monitored. Clicking on this tile directly navigates you to the Topology view.

The **ExpressRoute Monitor** page provides you a summary of the health of the various ExpressRoute peering connections being monitored by the solution. The Topology tile informs the number of network paths through the ExpressRoute circuit(s) being monitored in your network. Clicking on this tile directly navigates you to the Topology view.

The **Common Queries** page contains a set of search queries that fetch raw network monitoring data directly. You can use these queries as a starting point for creating your own queries for customized reporting. 

![NPM Dashboard](media/log-analytics-network-performance-monitor/npm-dashboard.png)

 

### Drill down for depth 

You can click various links on the solution dashboard to drill down deeper into any area of interest. For example, when you see an alert or an unhealthy network link appear on the dashboard, you can click it to investigate further. You are taken to a page that lists all the subnetwork links for the particular network link. You are able to see the loss, latency, and health status of each subnetwork link and quickly find out what subnetwork links are causing the problem. You can then click **View node links** to see all the node links for the unhealthy subnet link. Then, you can see individual node-to-node links and find the unhealthy node links. 

You can click **View topology** to view the hop-by-hop topology of the routes between the source and destination nodes. The unhealthy routes are shown in red and you can view the latency contributed by each hop so that you can quickly identify the problem to a particular portion of the network. 

 

### Network State Recorder 

Each view displays a snapshot of your network health at a particular point in time. By default, the most recent state is shown. The bar at the top of the page shows the point in time for which the state is being displayed. You can choose to go back in time and view the snapshot of your network health by clicking on the bar on Actions. You can also choose to enable or disable auto-refresh for any page while you view the latest state. 

 ![Network State Recorder](media/log-analytics-network-performance-monitor/network-state-recorder.png)

 

### Trend charts 

At each level that you drill down, you can see the trend of the applicable metric – loss, latency, response time, bandwidth utilization. You can change the time interval for the trend by using the time control at the top of the chart. 

Trend charts show you a historical perspective of the performance of a performance metric. Some network issues are transient in nature and would be hard to catch only by looking at the current state of the network. This is because issues can surface quickly and disappear before anyone notices, only to reappear at a later point in time. Such transient issues can also be difficult for application administrators because those issues often surface as unexplained increases in application response time, even when all application components appear to run smoothly. 

You can easily detect those kinds of issues by looking at a trend chart where the issue appears as a sudden spike in network latency or packet loss. You can then investigate the issue by using the network state recorder to view the network snapshot and topology for that point in time when the issue had occurred. 

 
![Trend Charts](media/log-analytics-network-performance-monitor/trend-charts.png)
 

### Topology Map 

NPM shows you the hop-by-hop topology of routes between the source and destination endpoint, on an interactive topology map. You can view the topology map by clicking on the **Topology** tile on the solution dashboard or by clicking on **View topology** link on the drill-down pages.  

The topology map displays how many routes are between the source and destination and what paths the data packets take. The latency contributed by each network hop is also visible. All the paths for which the total path latency is above the threshold (set in the corresponding monitoring rule) are shown in red.  

When you click a node or hover over it on the topology map, you see the properties of the node like FQDN and IP address. Click a hop to see its IP address. You can identify the troublesome network hop by noticing the latency being contributed by it. You can choose to filter particular routes by using the filters in the collapsible action pane. You can also simplify the network topologies by hiding the intermediate hops using the slider in the action pane. You can zoom-in or out of the topology map by using your mouse wheel. 

Note that the topology shown in the map is layer 3 topology and doesn't contain layer 2 devices and connections. 

 
![Topology Map](media/log-analytics-network-performance-monitor/topology-map.png)
 

## Log Analytics Search 

All data that is exposed graphically through the NPM dashboard and drill-down pages is also available natively in [Log Analytics search](log-analytics-log-search-new.md). You can perform interactive analysis of data in the repository, correlate data from different sources, create custom alerts, create custom views, and export the data to Excel, PowerBI, or a shareable link. The Common Queries area in the dashboard has some useful queries that you can use as the starting point for creating your own queries and reports. 

 

## Provide feedback 

**UserVoice** - You can post your ideas for Network Performance Monitor features that you want us to work on. Visit our [UserVoice page](https://feedback.azure.com/forums/267889-log-analytics/category/188146-network-monitoring). 

**Join our cohort** - We’re always interested in having new customers join our cohort. As part of it, you get early access to new features and help us improve Network Performance Monitor. If you're interested in joining, fill-out this [quick survey](https://aka.ms/npmcohort). 

## Next steps 
- Learn more about [Performance Monitor](log-analytics-network-performance-monitor-performance-monitor.md), [Service Endpoint Monitor](log-analytics-network-performance-monitor-performance-monitor.md), and [ExpressRoute Monitor](log-analytics-network-performance-monitor-expressroute.md). 
