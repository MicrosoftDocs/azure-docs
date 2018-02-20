---
title: Network Performance Monitor solution in Azure Log Analytics | Microsoft Docs
description: Network Performance Monitor in Azure Log Analytics helps you monitor the performance of your networks-in near real-time-to detect and locate network performance bottlenecks.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: 5b9c9c83-3435-488c-b4f6-7653003ae18a
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/18/2017
ms.author: magoedte

---
# Network Performance Monitor solution in Azure

![Network Performance Monitor symbol](./media/log-analytics-network-performance-monitor/npm-symbol.png)


## Overview  

Network Performance Monitor (NPM) is a cloud-based hybrid network monitoring solution that helps you monitor network performance between various points in your network infrastructure, monitor network connectivity to service/application endpoints and monitor the performance of your Azure ExpressRoute.  

NPM detects network issues like traffic blackholing, routing errors, and issues that conventional network monitoring methods are not able to detect. The solution generates alerts, notifies when a threshold is breached for a network link, ensures timely detection of network performance issues and localizes the source of the problem to a particular network segment or device. 

NPM offers three broad capabilities: 

**Performance Monitor:** Monitor network connectivity across cloud deployments and on-premises locations, multiple data centers and branch offices, mission critical multi-tier applications/micro-services. With Performance Monitor, you can detect network issues before your users complain.  

**Service Endpoint Monitor:** You can monitor the connectivity from your users to the services you care about, determine what infrastructure is in the path, and where network bottlenecks are occurring. Know about outages before your users and see the exact location of the issues along your network path. 

This capability will help you perform http, https, tcp and icmp based tests to monitor in near real-time or historically the availability and response time of your service, and the contribution of the network in packet loss and latency. With network topology map, you will be able to isolate network slowdowns by identifying problem spots that occur along the network path from the node to the service, with latency data on each hop. With Built-in tests, monitor network connectivity to Office365 and Dynamics CRM without any pre-configuration. With this capability, you can monitor network connectivity to any TCP capable endpoint such as websites, SaaS, PaaS applications, SQL databases, etc.  

**￼ExpressRoute Monitor:** Monitor end-to-end connectivity and performance between your branch offices and Azure, over Azure ExpressRoute.  
 

## Setup 

### Install OMS agents 

OMS agents are required to be installed on your computers in order to work with the various capabilities of Network Performance Monitor. Use the basic processes to install agents at Connect Windows computers to Log Analytics and Connect Operations Manager to Log Analytics 

### Where to install the agents 

**Performance Monitor: **Install OMS agents on at least one node connected to each subnetwork from which you want to monitor network connectivity to other subnetworks.  

If you are unsure about the topology of your network, install the agents on servers with critical workloads between which you want to monitor the network performance. For example, if you want to monitor network connection between a Web server and a server running SQL, install an agent on both servers. Agents monitor network connectivity (links) between hosts  not the hosts themselves. So, to monitor a network link, you must install agents on both endpoints of that link.  

Service Endpoint Monitor: Install OMS agent on each node from which you want to monitor the network connectivity to the service endpoint. For example, if you intend to monitor network connectivity to Office365 from your office site O1, O2 and O3, then install the OMS agent on at least one node each in O1, O2 and O3. 

**ExpressRoute Monitor:** Install at least one OMS agent in your Azure VNET and at least one agent in your on-premises subnetwork which are connected through the ExpressRoute Private Peering.  

### Configure OMS agents for the monitoring  

NPM uses synthetic transactions to monitor network performance between source and destination agents. The solution offers a choice between TCP and ICMP as the protocol for monitoring in case of Performance Monitor and Service Endpoint Monitor capabilities, whereas TCP is used for ExpressRoute Monitor. You need to ensure that the firewall allows communication between the OMS agents being used for monitoring on the protocol you’ve chosen for monitoring.  

TCP protocol- If you’ve chosen TCP as the protocol for monitoring, open the Firewall port on the agents being used for Performance Monitor and ExpressRoute Monitor capabilities, to ensure that the agents can connect to each other. To do this, run the EnableRules.ps1 PowerShell script without any parameters in a power shell window with administrative privileges.  

The script creates registry keys required by the solution and it creates Windows firewall rules to allow agents to create TCP connections with each other. The registry keys created by the script also specify whether to log the debug logs and the path for the logs file. It also defines the agent TCP port used for communication. The values for these keys are automatically set by the script, so you should not manually change these keys. The port opened by default is 8084. You can use a custom port by providing the parameter portNumber to the script. However, the same port should be used on all the computers where the script is run. 

> ![NOTE]
> The script will configure only windows firewall locally. If you have a network firewall you should make sure that it is allowing traffic destined for the TCP port being used by NPM 

> ![NOTE]
> You do not need to run the EnableRules.ps1 PowerShell script for Service Endpoint Monitor 

 

**ICMP protocol- **If you’ve chosen ICMP as the protocol for monitoring, enable the following firewall rules for reliably utilizing ICMP: 

 
```
netsh advfirewall firewall add rule name="NPMDICMPV4Echo" protocol="icmpv4:8,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV6Echo" protocol="icmpv6:128,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV4DestinationUnreachable" protocol="icmpv4:3,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV6DestinationUnreachable" protocol="icmpv6:1,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV4TimeExceeded" protocol="icmpv4:11,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV6TimeExceeded" protocol="icmpv6:3,any" dir=in action=allow 
```
 

### Configure the solution 

1. Add the Network Performance Monitor solution to your workspace from Azure marketplace or by using the process described in Add Log Analytics solutions from the Solutions Gallery. 
2. Navigate to the NetworkMonitoring(<WorkspaceName>) resource that you created. Click on the tile titled Network Performance Monitor with the message Solution requires additional configuration. 
3. On the SETUP page, you will see the option to install OMS agents and Configure the agents for monitoring in the Common Settings SETUP View. As explained in the earlier step, If you’ve already installed and configured OMS agents, then click on the SETUP View for configuring the capability you are interested in using.  

    1. Performance Monitor View- Choose what protocol should be used for synthetic transactions in the Default performance monitor rule and click on Save and Continue. Note that this protocol selection only holds for the system-generated default rule, and you will need to choose the protocol each time you create a Performance Monitor rule explicitly. You can always move to the Default rule settings in the Performance Monitor tab (this will appear after you complete your day-0 configuration) and change the protocol later. In case you aren’t interested in the Perfromance Monitor capability, you can disable the default rule from the Default rule settings in the Performance Monitor tab. 
    2. Service Endpoint Monitor View- The capability provides built-in preconfigured tests to monitor network connectivity to Office365 and Dynamcis365 from your agents. Choose the Office365 and Dynamcis365 services that you are interested in monitoring by checking the checkbox beside them. Choose the agents from which you want to monitor, by clicking on the Add Agents button. If you don’t want to use this capability or want to set it up later, you can choose to skip this and directly click on Save and Continue without choosing anything.  

 

 

ExpressRoute Monitor View- Click on the Discover Now button to discover all the ExpressRoute private peerings that are connected to the VNETs in the Azure subscription linked with this OMS workspace.  

> ![NOTE] 
> The ExpressRoute peering discovery works only in the Azure portal. In case you are accessing the solution from OMS portal, you will need to open the Azure portal and trigger discovery from there. Once the ExpressRoute peerings are discovered, you can continue to use the solution from either of the two portals.  

The solution currently discovers only ExpressRoute private peerings. 

Only those private peerings are discovered which are connected to the VNETs associated with the subscription linked with this OMS workspace. If your ExpressRoute is connected to VNETs outside of the subscription linked to this workspace, you will need to create an OMS workspace in those subscriptions and use NPM to monitor those peerings. 

 

Once the discovery is complete, the discovered private peerings will be listed in a table.  

 

The monitoring for these peerings will initially be in disabled state. Click on each peering that you are interested in monitoring and configure monitoring for them from the right hand side (RHS) details view.  Click on Save button to save the configuration. View Configure ExpressRoute monitoring to learn more.  

Once the setup is complete, it takes 30 minutes to an hour for the data to populate. While the solution is aggregating data from your network, you will see ‘Solution requires additional configuration’ on the NPM overview tile. Once the data is collected and indexed, the overview tile will change and inform you the summary of the health of your network. You can then choose to edit the monitoring of the nodes on which OMS agents are installed, as well as the subnets discovered from your environment 

Edit monitoring settings for subnets and nodes 

All subnets where at least one agent was installed are listed on the Subnetworks tab in the configuration page. 

To enable or disable monitoring of particular subnetworks 

Select or clear the box next to the subnetwork ID and then ensure that Use for Monitoring is selected or cleared, as appropriate. You can select or clear multiple subnets. When disabled, subnetworks are not monitored as the agents will be updated to stop pinging other agents. 

Choose the nodes that you want to monitor in a particular subnetwork by selecting the subnetwork from the list and moving the required nodes between the lists containing unmonitored and monitored nodes. You can add a custom description to the subnetwork. 

Click Save to save the configuration. 

Choose nodes to monitor 

All the nodes that have an agent installed on them are listed in the Nodes tab. 

Select or clear the nodes that you want to monitor or stop monitoring. 

Click Use for Monitoring, or clear it, as appropriate. 

Click Save. 

 

Configure the capability(s) you are interested in: 

Configure Performance Monitor 

Configure Service Endpoint Monitor 

Configure ExpressRoute Monitor 

 

## Data collection details
Network Performance Monitor uses TCP SYN-SYNACK-ACK handshake packets when TCP is chosen and ICMP ECHO ICMP ECHO REPLY when ICMP is chosen as the protocol to collect loss and latency information. Traceroute is also used to get topology information.

The following table shows data collection methods and other details about how data is collected for Network Performance Monitor.

| platform | Direct Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
| --- | --- | --- | --- | --- | --- | --- |
| Windows | &#8226; | &#8226; |  |  |  |TCP handshakes/ICMP ECHO messages every 5 seconds, data sent every 3 minutes |
 

 
The solution uses synthetic transactions to assess the health of the network. OMS agents installed at various points in the network exchange TCP packets or ICMP Echo (depending on the protocol selected for monitoring) with one another. In the process, agents learn the round-trip time and packet loss, if any. Periodically, each agent also performs a trace route to other agents to find all the various routes in the network that must be tested. Using this data, the agents can deduce the network latency and packet loss figures. The tests are repeated every five seconds and data is aggregated for a period of three minutes by the agents before uploading it to the Log Analytics service. 



> [!NOTE]
> Although agents communicate with each other frequently, they do not generate a lot of network traffic while conducting the tests. Agents rely only on TCP SYN-SYNACK-ACK handshake packets to determine the loss and latency -- no data packets are exchanged. During this process, agents communicate with each other only when needed and the agent communication topology is optimized to reduce network traffic.

## Using the solution 

### NPM Overview tile 

After you've enabled the Network Performance Monitor solution, the solution tile on the Overview page provides a quick overview of the network health. 

 

### Network Performance Monitor dashboard 

The **Top Network Health Events **blade provides a list of most recent health events and alerts in the system and the time since the event has been active. A health event or alert is generated whenever the value of the chosen metric (loss, latency, response time or bandwidth utilization) for the monitoring rule exceeds the threshold. 

The **Performance Monitor** blade provides you a summary of the health of the Network links and Subnetwork links being monitored by the solution. The Topology tile informs the number of network paths being monitored in your network. Clicking on this tile will directly navigate you to the Topology view 

The **Service Endpoint Monitor** blade provides you a summary of the health of the different tests you’ve created. The Topology tile informs the number of endpoints being monitored. Clicking on this tile will directly navigate you to the Topology view 

The **ExpressRoute Monitor** blade provides you a summary of the health of the various ExpressRoute peering connections being monitored by the solution. The Topology tile informs the number of network paths through the ExpressRoute circuit(s) being monitored in your network. Clicking on this tile will directly navigate you to the Topology view 

The **Common Queries** blade contains a set of search queries that fetch raw network monitoring data directly. You can use these queries as a starting point for creating your own queries for customized reporting. 

 

 

### Drill down for depth 

You can click various links on the solution dashboard to drill down deeper into any area of interest. For example, when you see an alert or an unhealthy network link appear on the dashboard, you can click it to investigate further. You are taken to a page that lists all the subnetwork links for the particular network link. You are able to see the loss, latency and health status of each subnetwork link and quickly find out what subnetwork links are causing the problem. You can then click **View node links** to see all the node links for the unhealthy subnet link. Then, you can see individual node-to-node links and find the unhealthy node links. 

You can click **View topology** to view the hop-by-hop topology of the routes between the source and destination nodes. The unhealthy routes are shown in red and you can view the latency contributed by each hop so that you can quickly identify the problem to a particular portion of the network. 

 

### Network State Recorder 

Each view displays a snapshot of your network health at a particular point in time. By default, the most recent state is shown. The bar at the top of the page shows the point in time for which the state is being displayed. You can choose to go back in time and view the snapshot of your network health by clicking on the bar on Actions. You can also choose to enable or disable auto-refresh for any page while you view the latest state. 

 

 

### Trend charts 

At each level that you drill down, you can see the trend of the applicable metric – loss, latency, response time, bandwidth utilization. You can change the time interval for the trend by using the time control at the top of the chart. 

Trend charts show you a historical perspective of the performance of a performance metric. Some network issues are transient in nature and would be hard to catch only by looking at the current state of the network. This is because issues can surface quickly and disappear before anyone notices, only to reappear at a later point in time. Such transient issues can also be difficult for application administrators because those issues often surface as unexplained increases in application response time, even when all application components appear to run smoothly. 

You can easily detect those kinds of issues by looking at a trend chart where the issue will appear as a sudden spike in network latency or packet loss. You can then investigate the issue by using the network state recorder to view the network snapshot and topology for that point in time when the issue had occurred. 

 

 

### Topology Map 

NPM shows you the hop-by-hop topology of routes between the source and destination endpoint, on an interactive topology map. You can view the topology map by clicking on the **Topology** tile on the solution dashboard or by clicking on **View topology** link on the drill down pages.  

The topology map displays how many routes are between the source and destination and what paths the data packets take. The latency contributed by each network hop is also visible. All the paths for which the total path latency is above the threshold (set in the corresponding monitoring rule) are shown in red.  

When you click a node or hover over it on the topology map, you see the properties of the node like FQDN and IP address. Click a hop to see its IP address. You can identify the troublesome network hop by noticing the latency being contributed by it. You can choose to filter particular routes by using the filters in the collapsible action pane. You can also simplify the network topologies by hiding the intermediate hops using the slider in the action pane. You can zoom-in or out of the topology map by using your mouse wheel. 

Note that the topology shown in the map is layer 3 topology and doesn't contain layer 2 devices and connections. 

 

 

## Log Analytics Search 

All data that is exposed graphically through the NPM dashboard and drill down pages is also available natively in Log Analytics search. You can perform interactive analysis of data in the repository, corelate data from different sources, create custom alerts, create custom views and export the data to Excel, PowerBI or a shareable link. The Common Queries area in the dashboard has some useful queries that you can use as the starting point for creating your own queries and reports. 

 

Provide feedback 

UserVoice - You can post your ideas for Network Performance Monitor features that you want us to work on. Visit our UserVoice page. 

Join our cohort - We’re always interested in having new customers join our cohort. As part of it, you get early access to new features and help us improve Network Performance Monitor. If you're interested in joining, fill-out this quick survey. 

Next steps 

Learn more about Performance Monitor, Service Endpoint Monitor and ExpressRoute Monitor 

Search logs to view detailed network performance data records. 

 

## Performance Monitor 
NPM’s Performance Monitor capability helps you monitor network connectivity across various points in your network, such as cloud deployments and on-premises locations, multiple data centers and branch offices, mission critical multi-tier applications/micro-services. With Performance Monitor, you can detect network issues before your users complain. Key advantages are: 

-Monitor loss and latency across various subnets and set alerts 
-Monitor all paths (including redundant paths) on the network 
-Troubleshoot transient & point-in-time network issues, which are difficult to replicate 
-Determine the specific segment on the network, which is responsible for degraded performance 
-Monitor the health of the network, without the need for SNMP 
 

Configuration 

Install OMS Agents 

View this section for details 

￼Configure OMS agents for the monitoring  

View this section for details 

￼Create new Networks 

Move to NPM’s Configuration page by clicking on the Configuration  button located on the upper left side corner of the solution dashboard.  

 

 

Click on the Networks tab. A Network in NPM is a logical container for subnets. It helps you organize the monitoring of your network infrastructure as per your monitoring needs. You can create a Network with a friendly name and add subnets to it according to your business logic. For example, you can create a network named London and add all the subnets in your London datacenter, or a network named ContosoFrontEnd and add all subnets serving the front end of your app named Contoso to this network. The solution automatically creates a Default network which contains all the subnets discovered in your environment. Whenever you create a network, you add a subnet to it and that subnet is removed from the Default network. If you delete a network, all its subnets are automatically returned to the Default network. Thus, the Default network acts as a container for all the subnets that are not contained in any user-defined network. You cannot edit or delete the Default network. It always remains in the system. However, you can create as many custom networks as you need. In most cases, the subnets in your organization will be arranged in more than one network and you should create one or more networks to group your subnets as per your business logic 

To create a new network 

Click Add network and then type the network name and description. 

Select one or more subnets, and then click Add. 

Click Save to save the configuration. 

Create monitoring rules 

Performance Monitor generates health events when the threshold of the performance of network connections between 2 subnetworks or between 2 networks is breached. These thresholds can be learned automatically by the system or you can provide custom thresholds. The system automatically creates a Default rule which generates a health event whenever loss or latency between any pair of network/subnetwork links breaches the system-learned threshold. This helps the solution monitor your network infrastructure until you haven’t created any monitoring rules explicitly. If the Default rule is enabled, all the nodes send synthetic transactions to all the other nodes that you have enabled for monitoring. The default rule is useful in case of small networks, for example, in a scenario where you have a small number of servers running a microservice and you want to make sure that all the servers have connectivity to each other. 

Note 

It is highly recommended that you disable the Default rule and create custom monitoring rules, especially in case of large networks where you are using a large number of nodes for monitoring. This will reduce the traffic generated by the solution and help you organize the monitoring of your network. 

Create monitoring rules according to your business logic. For example, if you want to monitor performance of the network connectivity of two office sites to headquarter, then group all the subnets in office site1 in network O1, all the subnets in office site2 in network O2 and all the subnets in the headquarter in network H. Create 2 monitoring rules-one between O1 and H and the other between O2 and H. 

To create custom monitoring rules 

Click Add Rule in the Monitor tab and enter the rule name and description. 

Select the pair of network or subnetwork links to monitor from the lists. 

First select the network in which the first subnetwork/s of interest is contained from the network dropdown, and then select the subnetwork/s from the corresponding subnetwork dropdown. Select All subnetworks if you want to monitor all the subnetworks in a network link. Similarly select the other subnetwork/s of interest. And, you can click Add Exception to exclude monitoring for particular subnetwork links from the selection you've made. 

Choose between ICMP and TCP protocols for executing synthetic transactions. 

If you don't want to create health events for the items you've selected, then clear Enable health monitoring on the links covered by this rule. 

Choose monitoring conditions. You can set custom thresholds for health event generation by typing threshold values. Whenever the value of the condition goes above its selected threshold for the selected network/subnetwork pair, a health event is generated. 

Click Save to save the configuration. 

After you save a monitoring rule, you can integrate that rule with Alert Management by clicking Create Alert. An alert rule is automatically created with the search query and other required parameters automatically filled-in. Using an alert rule, you can receive email-based alerts, in addition to the existing alerts within NPM. Alerts can also trigger remedial actions with runbooks or they can integrate with existing service management solutions using webhooks. You can click Manage Alert to edit the alert settings. 

You can now create more Performance Monitor rules or move to the solution dashboard to start using the capability 

Choose the right protocol-ICMP or TCP 

Network Performance Monitor (NPM) uses synthetic transactions to calculate network performance metrics like packet loss and link latency. To understand this better, consider an NPM agent connected to one end of a network link. This NPM agent sends probe packets to a second NPM agent connected to another end of the network. The second agent replies with response packets. This process is repeated a few times. By measuring the number of replies and time taken to receive each reply, the first NPM agent assesses link latency and packet drops. 

The format, size and sequence of these packets is determined by the protocol that you choose when you create monitoring rules. Based on protocol of the packets, the intermediate network devices (routers, switches etc.) might process these packets differently. Consequently, your protocol choice affects the accuracy of the results. And, your protocol choice also determines whether you must take any manual steps after you deploy the NPM solution. 

NPM offers you the choice between ICMP and TCP protocols for executing synthetic transactions. If you choose ICMP when you create a synthetic transaction rule, the NPM agents use ICMP ECHO messages to calculate the network latency and packet loss. ICMP ECHO uses the same message that is sent by the conventional Ping utility. When you use TCP as the protocol, NPM agents send TCP SYN packet over the network. This is followed by a TCP handshake completion and then removing the connection using RST packets. 

Points to consider before choosing the protocol 

Consider the following information before you choose a protocol to use: 

Discovering multiple network routes- 

 TCP is more accurate when discovering multiple routes and it needs fewer agents in each subnet. For example, one or two agents using TCP can discover all redundant paths between subnets. However, you need several agents using ICMP to achieve similar results. Using ICMP, if you have Nnumber of routes between two subnets you need more than 5N agents in either a source or destination subnet. 

Accuracy of results-  

Routers and switches tend to assign lower priority to ICMP ECHO packets compared to TCP packets. In certain situations, when network devices are heavily loaded, the data obtained by TCP more closely reflects the loss and latency experienced by applications. This occurs because most of the application traffic flows over TCP. In such cases, ICMP provides less accurate results compared to TCP. 

Firewall configuration-  

TCP protocol requires that TCP packets are sent to a destination port. The default port used by NPM agents is 8084, however you can change this when you configure agents. So, you need to ensure that your network firewalls or NSG rules (in Azure) are allowing traffic on the port. You also need to make sure that the local firewall on the computers where agents are installed is configured to allow traffic on this port. You can use PowerShell scripts to configure firewall rules on your computers running Windows, however you need to configure your network firewall manually. In contrast, ICMP does not operate using port. In most enterprise scenarios, ICMP traffic is permitted through the firewalls to allow you to use network diagnostics tools like the Ping utility. So, if you can Ping one machine from another, then you can use the ICMP protocol without having to configure firewalls manually. 

Note 

Some firewalls may block ICMP, which may lead to retransmission resulting in large number of events in your security information and event management system. Make sure the protocol that you choose is not blocked by a network firewall/NSG, otherwise NPM will not be able to monitor the network segment. Because of this, we recommended that you use TCP for monitoring. You should use ICMP in scenarios where you are not able to use TCP, such as when: 

You are using Windows client based nodes, since TCP raw sockets are not allowed in Windows client 

Your network firewall/NSG blocks TCP 

How to switch the protocol 

If you chose to use ICMP during deployment, you can switch to TCP at any time by editing the default monitoring rule. 

To edit the default monitoring rule 

Navigate to Network Performance > Monitor > Configure > Monitor and then click Default rule. 

Scroll to the Protocol section and select the protocol that you want to use. 

Click Save to apply the setting. 

Even if the default rule is using a specific protocol, you can create new rules with a different protocol. You can even create a mix of rules where some of the rules use ICMP and another uses TCP. 

 

Walkthrough 

Investigate the root cause of a health alert 

Now that you've read about Performance Monitor, let's look at a simple investigation into the root-cause for a health event. 
Shape 

On the solution dashboard, you notice that there is a health event – a network link is unhealthy. You decide to investigate the issue and click on Network links being monitored tile  

On the drilldown page, you observe that the DMZ2-DMZ1 network link is unhealthy. You click on the View subnet links link for this network link. 
Shape 

The drill down page shows all the subnetwork links in DMZ2-DMZ1 network link. You notice that for both the subnetwork links, the latency has crossed the threshold making the network link unhealthy. You can also see the latency trends of both the subnetwork links. You can use the time selection control in the graph to focus on the required time range. You can see the time of the day when latency has reached its peak. You can later search the logs for this time period to investigate the issue. Click View node links to drill down further. 
 
Shape 

Similar to the previous page, the drill down page for the particular subnetwork link lists down its constituent node links. You can perform similar actions here as you did in the previous step. Click View topology to view the topology between the 2 nodes. 

 
 
Shape 

All the paths between the 2 selected nodes are plotted in the topology map. You can visualize the hop-by-hop topology of routes between two nodes on the topology map. It gives you a clear picture of how many routes exist between the two nodes and what paths the data packets are taking. Network performance bottlenecks are marked in red color. You can locate a faulty network connection or a faulty network device by looking at red colored elements on the topology map. 

 
 
Shape 

The loss, latency, and the number of hops in each path can be reviewed in the Action pane. Use the scrollbar to view the details of those unhealthy paths. Use the filters to select the paths with the unhealthy hop so that the topology for only the selected paths is plotted. You can use your mouse wheel to zoom in or out of the topology map. 

In the below image you can clearly see the root-cause of the problem areas to the specific section of the network by looking at the paths and hops in red color. Clicking on a node in the topology map reveals the properties of the node, including the FQDN, and IP address. Clicking on a hop shows the IP address of the hop. 
 
Shape 

 

Service Endpoint Monitor 

Introduction 

With this capability, you can monitor network connectivity to any endpoint that has an open TCP port. Such endpoints include websites, SaaS applications, PaaS applications, SQL databases, etc. With Service Endpoint Monitor, you can: 

Monitor the network connectivity to your applications and network services (such as Office 365, Dynamics CRM, internal line of business applications, SQL database, etc) from multiple branch offices/locations 

Built-in tests to monitor network connectivity to Office365 and Dynamics365 endpoints 

Determine the response time, network latency, packet loss experienced when connecting to the endpoint 

Determine whether poor application performance is because of the network or because of some issue at the application provider’s end 

Identify hot spots on the network that may be causing poor application performance by viewing the latency contributed by each hop on a topology map. 

 

 

Configuration 

Install OMS Agents 

View this section for more details 

Configure OMS agents for the monitoring  

Enable the following firewall rules on the nodes used for monitoring so that the solution can discover the topology from your nodes to the service endpoint: 

netsh advfirewall firewall add rule name="NPMDICMPV4Echo" protocol="icmpv4:8,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV6Echo" protocol="icmpv6:128,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV4DestinationUnreachable" protocol="icmpv4:3,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV6DestinationUnreachable" protocol="icmpv6:1,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV4TimeExceeded" protocol="icmpv4:11,any" dir=in action=allow 

netsh advfirewall firewall add rule name="NPMDICMPV6TimeExceeded" protocol="icmpv6:3,any" dir=in action 

Create Service Endpoint Monitor tests 

Move to NPM’s Configuration page by clicking on the Configuration  button located on the upper left side corner of the solution dashboard.  

 

Start creating your tests to monitor network connectivity to the service endpoints 

Click on the Service Endpoint Monitor tab 

Click Add Test and enter the Test name and description 

Select the type of test:  

Select Web test if you are monitoring connectivity to a service that responds to HTTP/S requests, such as outlook.office365.com, bing.com 

Select Network test if you are monitoring connectivity to a service that responds to TCP request but does not respond to HTTP/S request, such as a SQL server, FTP server, SSH port etc. 

 If you do not wish to perform network measurements (network latency, packet loss, topology discovery), then uncheck the textbox. We recommend you keep it checked to get maximum benefit from the capability. 

Enter the target URL/FQDN/IP Address to which you want to monitor network connectivity.   

Enter the port number of the target service. 

Enter the frequency with which you want the test to run. 

Select the nodes from which you want to monitor the network connectivity to service. 

Note 

For Windows server based nodes, the capability uses TCP based requests to perform the network measurements. For Windows client based nodes, the capability uses ICMP based requests to perform the network measurements. In some cases, the target application blocks incoming ICMP based request due to which when the nodes are Windows client based, the solution is unable to perform network measurements. Therefore, it is recommended you use Windows server based nodes in such cases. 

If you don't want to create health events for the items you've selected, then clear Enable health monitoring on the targets covered by this test. 

Choose monitoring conditions. You can set custom thresholds for health event generation by typing threshold values. Whenever the value of the condition goes above its selected threshold for the selected network/subnetwork pair, a health event is generated. 

Click Save to save the configuration. 

 

You can click Manage Alert to edit the alert settings. It can take some time for the changes to take place. Move to the Network Performance Monitor dashboard to see the Service Endpoint Monitoring blade. You can now click on the blade and start using the preview capability. 

Walkthrough 

Move to the NPM dashboard view and observe the Service Endpoint Monitor blade to get a summary of the health of the different tests you’ve created.  

 

Click on the tile to drill-down and view the details of the tests on the Tests page. On the LHS table, you can view the point-in-time health and value of the service response time, network latency and packet loss for all the tests. You can use the Network State Recorder control to view the network snapshot at another time in past. Click on the test in the table which you want to investigate. You can view the historical trend of the loss, latency and response time values from the charts in the RHS pane. Click on the Test Details link to view the performance from each node. 

 

On the Test Nodes view, you can observe the network connectivity from each node. Click on the node having performance degradation, i.e., the node from where the application is observed to be running slow. 

Determine whether poor application performance is because of the network or because of some issue at the application provider’s end by observing the correlation between the response time of the application and the network latency- 

Application issue- If there is a spike in the response time, but the network latency is consistent, then this suggests that the network is working fine and the problem is due to an issue at the application end.  

 

Network issue- If a spike in response time is accompanied with a corresponding spike in the network latency, then this suggests that the increase in response time is due to an increase in network latency.  

 

Once you’ve determined that the problem is because of the network, you can click on the Topology view link to identify the troublesome hop on the Topology Map. For example, in the image below you can see that out of the 105 ms total latency between the node and the application endpoint, 96 ms is because of the hop marked in red. Once you’ve identified the troublesome hop, you can take corrective action.  

 

Diagnostics 

The following steps are recommended, if you observe an abnormality: 

If the service response time, network loss as well as latency are shown as NA, then it can be because of one or more of the below reasons- 

The application is down 

The node being used for checking network connectivity to the service is down 

The target entered in the test configuration is incorrect 

The node does not have any network connectivity  

If a valid service response time is shown but network loss as well as latency are shown as NA, then it can be because of one or more of the below reasons- 

If the node used for checking network connectivity to the service is Windows client machine- 

The target service is blocking ICMP requests 

A network firewall is blocking ICMP requests originating from the node 

The checkbox for ‘Perform network measurements’ has been unchecked in the test configuration. 

If the service response time is ‘NA’ but network loss as well as latency are valid, then it suggests that the target service is not a web application. Please edit the test configuration and choose the test type as Network test instead of Web test. 

If the application is running slow, you should determine whether poor application performance is because of the network or because of some issue at the application provider’s end 

ExpressRoute Monitor 

Introduction 

Monitor end-to-end connectivity and performance between your branch offices and Azure, over Azure ExpressRoute. Key advantages: 

•Auto-detection of ExpressRoute circuits associated with your subscription 

•Tracking of bandwidth utilization, loss and latency at the circuit, peering and VNet level for your ExpressRoute 

•Discovery of network topology of your ExpressRoute circuits 

 

Configuration 

Install OMS Agents 

View this section for more details 

Configure OMS agents for the monitoring  

View this section for more details 

Configure NSG rules 

For the servers in Azure that are being used for the monitoring via NPM, you must configure network security group (NSG) rules to allow TCP traffic on the port used by NPM for synthetic transactions. The default port is 8084. This allows the OMS agent installed on Azure VM to communicate with an on-premises monitoring agents. 

For more information about NSG, see Network Security Groups. 

Note 

Make sure that you have installed the agents (both the on-premises server agent and the Azure server agent) and have run the EnableRules.ps1 PowerShell script before proceeding with this step. 

 

Discover ExpressRoute Peering connections 

Move to NPM’s Configuration page by clicking on the Configuration button located on the upper left side corner of the solution dashboard.  

 

Click on the ExpressRoute Peerings view.  

Click on the Discover Now button to discover all the ExpressRoute private peerings that are connected to the VNETs in the Azure subscription linked with this OMS workspace.  

Note-  

The ExpressRoute peering discovery works only in the Azure portal. In case you are accessing the solution from OMS portal, you will need to open the Azure portal and trigger discovery from there. Once the ExpressRoute peerings are discovered, you can continue to use the solution from either of the two portals.  

The solution currently discovers only ExpressRoute private peerings. 

Only those private peerings are discovered which are connected to the VNETs associated with the subscription linked with this OMS workspace. If your ExpressRoute is connected to VNETs outside of the subscription linked to this workspace, you will need to create an OMS workspace in those subscriptions and use NPM to monitor those peerings. 

 

 

Once the discovery is complete, the discovered private peering connections will be listed in a table. The monitoring for these peerings will initially be in disabled state. 

Enable monitoring of the ExpressRoute peering connections 

Click on the private peering connecting you are interested in monitoring.  

On the RHS pane, click on the checkbox Monitor this Peering. 

If you intend to create health events for this connection, then check Enable Health Monitoring for this peering. 

Choose monitoring conditions. You can set custom thresholds for health event generation by typing threshold values. Whenever the value of the condition goes above its selected threshold for the peering connection, a health event will be  generated. 

Click on +Add Agents to choose the monitoring agents you intend to use for monitoring this peering connection. You need to ensure that you add agents on both the ends of the connection, i.e., at least one agent in the Azure VNET connected to this peering as well as at least one on-premises agent connected to this peering. 

Click Save to save the configuration. 

 

After enabling the rules and selecting the values and agents you want to monitor, there is a wait of approximately 30-60 minutes for the values to begin populating and the ExpressRoute Monitoring tiles to become available. Once you see the monitoring tiles, your ExpressRoute circuits and connection resources are being monitored by NPM. 

Note- This capability works reliable on workspaces that have upgraded to the new query language.  

Walkthrough 

The NPM dashboard shows an overview of the health of ExpressRoute circuits and peering connections. 

 

Shape 

Circuits list 

To see a list of all monitored ExpressRoute circuits, click on the ExpressRoute circuits tile. You can select a circuit and view its health state, trend charts for packet loss, bandwidth utilization, and latency. The charts are interactive. You can select a custom time window for plotting the charts. You can drag the mouse over an area on the chart to zoom in and see fine-grained data points. 

 

Shape 

Trend of Loss, Latency, and Throughput 

The bandwidth, latency, and loss charts are interactive. You can zoom into any section of these charts, using mouse controls. You can also see the bandwidth, latency, and loss data for other intervals by clicking Date/Time, located below the Actions button on the upper left. 

 

Shape 

Peerings list 

Clicking on the Private Peerings tile on the dashboard brings up a list of all connections to virtual networks over private peering. Here, you can select a virtual network connection and view its health state, trend charts for packet loss, bandwidth utilization, and latency. 

 

Shape 

Circuit topology 

To view circuit topology, click on the Topology tile. This takes you to the topology view of the selected circuit or peering. The topology diagram provides the latency for each segment on the network and each layer 3 hop is represented by a node of the diagram. Clicking on a hop reveals more details about the hop. You can increase the level of visibility to include on-premises hops by moving the slider bar below Filters. Moving the slider bar to the left or right, increases/decreases the number of hops in the topology graph. The latency across each segment is visible, which allows for faster isolation of high latency segments on your network. 

Shape  

Detailed Topology view of a circuit 

This view shows VNet connections. Shape 

 

 

 

Diagnostics 

NPM helps you diagnose several circuit connectivity issues. Some of the issues are listed below 

Circuit is down- NPM notifies you as soon as the connectivity between your on-premises resources and Azure VNETs is lost. This will help you take proactive action before receiving user escalations and reduce the down time 

 

 

Traffic not flowing through intended circuit-NPM can notify you whenever the traffic is unexpectedly not flowing through the intended ExpressRoute circuit. This can happen if the circuit is down and the traffic is flowing through the backup route, or if there is a routing issue. This information will help you proactively manage any configuration issues in your routing policies and ensure that the most optimal and secure route is used. 

 

 

Traffic not flowing through primary circuit- The capability notifies you when the traffic is flowing through the secondary ExpressRoute circuit. Even though you will not experience any connectivity issues in this case, but proactively troubleshooting the issues with the primary circuit will make you better prepared. 

 

 

Degradation due to peak utilization- You can correlate the bandwidth utilization trend with the latency trend to identify whether the Azure workload degradation is due to a peak in bandwidth utilization or not and take action accordingly.  

 

 

## Next steps
* [Search logs](log-analytics-log-searches.md) to view detailed network performance data records.
