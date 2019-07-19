---
title: FAQs - Network Performance Monitor solution in Azure | Microsoft Docs
description: This article captures the frequently asked questions about Network Performance Monitor in Azure. Network Performance Monitor (NPM) helps you monitor the performance of your networks in near real time and detect and locate network performance bottlenecks.
services: log-analytics
documentationcenter: ''
author: vinynigam
manager: agummadi
editor: ''
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 10/12/2018
ms.author: vinigam
---
# Network Performance Monitor solution FAQ

![Network Performance Monitor symbol](media/network-performance-monitor-faq/npm-symbol.png)

This article captures the frequently asked questions (FAQs) about Network Performance Monitor (NPM) in Azure

[Network Performance Monitor](/azure/networking/network-monitoring-overview) is a cloud-based [hybrid network monitoring](../../azure-monitor/insights/network-performance-monitor-performance-monitor.md) solution that helps you monitor network performance between various points in your network infrastructure. It also helps you monitor network connectivity to [service and application endpoints](../../azure-monitor/insights/network-performance-monitor-service-connectivity.md) and [monitor the performance of Azure ExpressRoute](../../azure-monitor/insights/network-performance-monitor-expressroute.md). 

Network Performance Monitor detects network issues like traffic blackholing, routing errors, and issues that conventional network monitoring methods aren't able to detect. The solution generates alerts and notifies you when a threshold is breached for a network link. It also ensures timely detection of network performance issues and localizes the source of the problem to a particular network segment or device. 

More information on the various capabilities supported by [Network Performance Monitor](https://docs.microsoft.com/azure/networking/network-monitoring-overview) is available online.

## Set up and configure agents

### What are the platform requirements for the nodes to be used for monitoring by NPM?
Listed below are the platform requirements for NPM's various capabilities:

- NPM's Performance Monitor and Service Connectivity Monitor capabilities support both Windows server and Windows desktops/client operating systems. Windows server OS versions supported are 2008 SP1 or later. Windows desktops/client versions supported are Windows 10, Windows 8.1, Windows 8 and Windows 7. 
- NPM's ExpressRoute Monitor capability supports only Windows server (2008 SP1 or later) operating system.

### Can I use Linux machines as monitoring nodes in NPM?
The capability to monitor networks using Linux-based nodes is currently in preview. Reach out to your Account Manager to know more. Linux agents provide monitoring capability only for NPM's Performance Monitor capability, and are not available for the Service Connectivity Monitor and ExpressRoute Monitor capabilities

### What are the size requirements of the nodes to be used for monitoring by NPM?
For running the NPM solution on node VMs to monitor networks, the nodes should have at least 500-MB memory and one core. You do'nt need to use separate nodes for running NPM. The solution can run on nodes that have other workloads running on it. The solution has the capability to stop the monitoring process if it uses more than 5% CPU.

### To use NPM, should I connect my nodes as Direct agent or through System Center Operations Manager?
Both the Performance Monitor and the Service Connectivity Monitor capabilities support nodes [connected as Direct Agents](../../azure-monitor/platform/agent-windows.md) and [connected through Operations Manager](../../azure-monitor/platform/om-agents.md).

For ExpressRoute Monitor capability, the Azure nodes should be connected as Direct Agents only. Azure nodes, which are connected through Operations Manager are not supported. For on-premises nodes, the nodes connected as Direct Agents and through Operations Manager are supported for monitoring an ExpressRoute circuit.

### Which protocol among TCP and ICMP should be chosen for monitoring?
If you're monitoring your network using Windows server-based nodes, we recommend you use TCP as the monitoring protocol since it provides better accuracy. 

ICMP is recommended for Windows desktops/client operating system-based nodes. This platform does'nt allow TCP data to be sent over raw sockets, which NPM uses to discover network topology.

You can get more details on the relative advantages of each protocol [here](../../azure-monitor/insights/network-performance-monitor-performance-monitor.md#choose-the-protocol).

### How can I configure a node to support monitoring using TCP protocol?
For the node to support monitoring using TCP protocol: 
* Ensure that the node platform is Windows Server (2008 SP1 or later).
* Run [EnableRules.ps1](https://aka.ms/npmpowershellscript) Powershell script on the node. See [instructions](../../azure-monitor/insights/network-performance-monitor.md#configure-log-analytics-agents-for-monitoring) for more details.


### How can I change the TCP port being used by NPM for monitoring?
You can change the TCP port used by NPM for monitoring, by running the [EnableRules.ps1](https://aka.ms/npmpowershellscript) script. You need enter the port number you intend to use as a parameter. For example, to enable TCP on port 8060, run `EnableRules.ps1 8060`. Ensure that you use the same TCP port on all the nodes being used for monitoring.

The script configures only Windows Firewall locally. If you have network firewall or Network Security Group (NSG) rules, make sure that they allow the traffic destined for the TCP port used by NPM.

### How many agents should I use?
You should use at least one agent for each subnet that you want to monitor.

### What is the maximum number of agents I can use or I see error ".... you've reached your Configuration limit"?
NPM limits the number of IPs to 5000 IPs per workspace. If a node has both IPv4 and IPv6 addresses, this will count as 2 IPs for that node. Hence, this limit of 5000 IPs would decide the upper limit on the number of agents. You can delete the inactive agents from Nodes tab in NPM >> Configure. NPM also maintains history of all the IPs that were ever assigned to the VM hosting the agent and each is counted as separate IP contributing to that upper limit of 5000 IPs. To free up IPs for your workspace, you can use the Nodes page to delete the IPs that are not in use.

## Monitoring

### How are loss and latency calculated
Source agents send either TCP SYN requests (if TCP is chosen as the protocol for monitoring) or ICMP ECHO requests (if ICMP is chosen as the protocol for monitoring) to destination IP at regular intervals to ensure that all the paths between the source-destination IP combination are covered. The percentage of packets received and packet round-trip time is measured to calculate the loss and latency of each path. This data is aggregated over the polling interval and over all the paths to get the aggregated values of loss and latency for the IP combination for the particular polling interval.

### With what frequency does the source agent send packets to the destination for monitoring?
For Performance Monitor and ExpressRoute Monitor capabilities, the source sends packets every 5 seconds and records the network measurements. This data is aggregated over a 3-minute polling interval to calculate the average and peak values of loss and latency. For Service Connectivity Monitor capability, the frequency of sending the packets for network measurement is determined by the frequency entered by the user for the specific test while configuring the test.

### How many packets are sent for monitoring?
The number of packets sent by the source agent to destination in a polling is adaptive and is decided by our proprietary algorithm, which can be different for different network topologies. More the number of network paths between the source-destination IP combination, more is the number of packets that are sent. The system ensures that all paths between the source-destination IP combination are covered.

### How does NPM discover network topology between source and destination?
NPM uses a proprietary algorithm based on Traceroute to discover all the paths and hops between source and destination.

### Does NPM provide routing and switching level info 
Though NPM can detect all the possible routes between the source agent and the destination, it does not provide visibility into which route was taken by the packets sent by your specific workloads. The solution can help you identify the paths and underlying network hops, which are adding more latency than you expected.

### Why are some of the paths unhealthy?
Different network paths can exist between the source and destination IPs and each path can have a different value of loss and latency. NPM marks those paths as unhealthy (denoted with red color) for which the values of loss and/or latency is greater than the respective threshold set in the monitoring configuration.

### What does a hop in red color signify in the network topology map?
If a hop is red, it signifies that it is part of at-least one unhealthy path. NPM only marks the paths as unhealthy, it does not segregate the health status of each path. To identify the troublesome hops, you can view the hop-by-hop latency and segregate the ones adding more than expected latency.

### How does fault localization in Performance Monitor work?
NPM uses a probabilistic mechanism to assign fault-probabilities to each network path, network segment, and the constituent network hops based on the number of unhealthy paths they are a part of. As the network segments and hops become part of more number of unhealthy paths, the fault-probability associated with them increases. This algorithm works best when you have many nodes with NPM agent connected to each other as this increases the data points for calculating the fault-probabilities.

### How can I create alerts in NPM?
Refer to [alerts section in the documentation](https://docs.microsoft.com/azure/log-analytics/log-analytics-network-performance-monitor#alerts) for step-by-step instructions.

### Can NPM monitor routers and servers as individual devices?
NPM only identifies the IP and host name of underlying network hops (switches, routers, servers, etc.) between the source and destination IPs. It also identifies the latency between these identified hops. It does not individually monitor these underlying hops.

### Can NPM be used to monitor network connectivity between Azure and AWS?
Yes. Refer to the article [Monitor Azure, AWS, and on-premises networks using NPM](https://blogs.technet.microsoft.com/msoms/2016/08/30/monitor-on-premises-cloud-iaas-and-hybrid-networks-using-oms-network-performance-monitor/) for details.

### Is the ExpressRoute bandwidth usage incoming or outgoing?
Bandwidth usage is the total of incoming and outgoing bandwidth. It is expressed in Bits/sec.

### Can we get incoming and outgoing bandwidth information for the ExpressRoute?
Incoming and outgoing values for both Primary and Secondary bandwidth can be captured.

For peering level information, use the below mentioned query in Log Search

	NetworkMonitoring 
    | where SubType == "ExpressRoutePeeringUtilization"
    | project CircuitName,PeeringName,PrimaryBytesInPerSecond,PrimaryBytesOutPerSecond,SecondaryBytesInPerSecond,SecondaryBytesOutPerSecond
  
For circuit level information, use the below mentioned query 

	NetworkMonitoring 
    | where SubType == "ExpressRouteCircuitUtilization"
    | project CircuitName,PrimaryBytesInPerSecond, PrimaryBytesOutPerSecond,SecondaryBytesInPerSecond,SecondaryBytesOutPerSecond

### Which regions are supported for NPM's Performance Monitor?
NPM can monitor connectivity between networks in any part of the world, from a workspace that is hosted in one of the [supported regions](../../azure-monitor/insights/network-performance-monitor.md#supported-regions)

### Which regions are supported for NPM's Service Connectivity Monitor?
NPM can monitor connectivity to services in any part of the world, from a workspace that is hosted in one of the [supported regions](../../azure-monitor/insights/network-performance-monitor.md#supported-regions)

### Which regions are supported for NPM's ExpressRoute Monitor?
NPM can monitor your ExpressRoute circuits located in any Azure region. To onboard to NPM, you will require a Log Analytics workspace that must be hosted in one of the [supported regions](/azure/expressroute/how-to-npm)

## Troubleshoot

### Why are some of the hops marked as unidentified in the network topology view?
NPM uses a modified version of traceroute to discover the topology from the source agent to the destination. 
An unidentified hop represents that the network hop did not respond to the source agent's traceroute request. 
If three consecutive network hops do not respond to the agent's traceroute, the solution marks the unresponsive hops as unidentified and does not try to discover more hops.

A hop may not respond to a traceroute in one or more of the below scenarios:

* The routers have been configured to not reveal their identity.
* The network devices are not allowing ICMP_TTL_EXCEEDED traffic.
* A firewall is blocking the ICMP_TTL_EXCEEDED response from the network device.

### Why does my link show unhealthy but the topology does not 
NPM monitors end-to-end loss, latency, and topology at different intervals. Loss and latency are measured once every 5 seconds and aggregated every three minutes (for Performance Monitor and Express Route Monitor) while topology is calculated using traceroute once every 10 minutes. For example, between 3:44 and 4:04, topology may be updated three times (3:44, 3:54, 4:04) , but loss and latency are updated about seven times (3:44, 3:47, 3:50, 3:53, 3:56, 3:59, 4:02). The topology generated at 3:54 will be rendered for the loss and latency that gets calculated at 3:56, 3:59 and 4:02. Suppose you get an alert that your ER circuit was unhealthy at 3:59. You log on to NPM and try to set the topology time to 3:59. NPM will render the topology generated at 3:54. To understand the last known topology of your network, compare the fields TimeProcessed (time at which loss and latency was calculated) and TracerouteCompletedTime(time at which topology was calculated). 

### What is the difference between the fields E2EMedianLatency and AvgHopLatencyList in the NetworkMonitoring table
E2EMedianLatency is the latency updated every three minutes after aggregating the results of tcp ping tests, whereas AvgHopLatencyList is updated every 10 mins based on traceroute. To understand the exact time at which E2EMedianLatency was calculated, use the field TimeProcessed. To understand the exact time at which traceroute completed and updated AvgHopLatencyList, use the field TracerouteCompletedTime

### Why does hop-by-hop latency numbers differ from HopLatencyValues 
HopLatencyValues are source to endpoint.
For Example: Hops - A,B,C. AvgHopLatency - 10,15,20. This means source to A latency = 10, source to B latency = 15  and source to C latency is 20. 
UI will calculate A-B hop latency as 5 in the topology

### The solution shows 100% loss but there is connectivity between the source and destination
This can happen if either the host firewall or the intermediate firewall (network firewall or Azure NSG) is blocking the communication between the source agent and the destination over the port being used for monitoring by NPM (by default the port is 8084, unless the customer has changed this).

* To verify that the host firewall is not blocking the communication on the required port, view the health status of the source and destination nodes from the following view: 
  Network Performance Monitor -> Configuration -> Nodes. 
  If they are unhealthy, view the instructions and take corrective action. If the nodes are healthy, move to the step b. below.
* To verify that an intermediate network firewall or Azure NSG is not blocking the communication on the required port, use the third-party PsPing utility using the below instructions:
  * psping utility is available for download [here](https://technet.microsoft.com/sysinternals/psping.aspx) 
  * Run following command from the source node.
    * psping -n 15 \<destination node IPAddress\>:portNumber 
    By default NPM uses 8084 port. In case you have explicitly changed this by using the EnableRules.ps1 script, enter the custom port number you are using). This is a ping from Azure machine to on-premises
* Check if the pings are successful. If not, then it indicates that an intermediate network firewall or Azure NSG is blocking the traffic on this port.
* Now, run the command from destination node to source node IP.


### There is loss from node A to B, but not from node B to A. Why?
As the network paths between A to B can be different from the network paths between B to A, different values for loss and latency can be observed.

### Why are all my ExpressRoute circuits and peering connections not being discovered?
NPM now discovers ExpressRoute circuits and peering connections in all subscriptions to which the user has access. Choose all the subscriptions where your Express Route resources are linked and enable monitoring for each discovered resource. NPM looks for connection objects when discovering a private peering, so please check if a VNET is associated with your peering.

### The ER Monitor capability has a diagnostic message "Traffic is not passing through ANY circuit". What does that mean?

There can be a scenario where there is a healthy connection between the on-premises and Azure nodes but the traffic is not going over the ExpressRoute circuit configured to be monitored by NPM. 

This can happen if:

* The ER circuit is down.
* The route filters are configured in such a manner that they give priority to other routes (such as a VPN connection or another ExpressRoute circuit) over the intended ExpressRoute circuit. 
* The on-premises and Azure nodes chosen for monitoring the ExpressRoute circuit in the monitoring configuration, do not have connectivity to each other over the intended ExpressRoute circuit. Ensure that you have chosen correct nodes that have connectivity to each other over the ExpressRoute circuit you intend to monitor.

### While configuring monitoring of my ExpressRoute circuit, the Azure nodes are not being detected.
This can happen if the Azure nodes are connected through Operations Manager. The ExpressRoute Monitor capability supports only those Azure nodes that are connected as Direct Agents.

### I cannot Discover by ExpressRoute circuits in the OMS portal
Though NPM can be used both from the Azure portal as well as the OMS portal, the circuit discovery in the ExpressRoute Monitor capability works only through the Azure portal. Once the circuits are discovered through the Azure portal, you can then use the capability in either of the two portals. 

### In the Service Connectivity Monitor capability, the service response time, network loss, as well as latency are shown as NA
This can happen if one or more is true:

* The service is down.
* The node used for checking network connectivity to the service is down.
* The target entered in the test configuration is incorrect.
* The node doesn't have any network connectivity.

### In the Service Connectivity Monitor capability, a valid service response time is shown but network loss as well as latency are shown as NA
 This can happen if one or more is true:

* If the node used for checking network connectivity to the service is a Windows client machine, either the target service is blocking ICMP requests or a network firewall is blocking ICMP requests that originate from the node.
* The Perform network measurements check box is blank in the test configuration.

### In the Service Connectivity Monitor capability, the service response time is NA but network loss as well as latency are valid
This can happen if the target service is not a web application but the test is configured as a Web test. Edit the test configuration, and choose the test type as Network instead of Web.

## Miscellaneous

### Is there a performance impact on the node being used for monitoring?
NPM process is configured to stop if it utilizes more than 5% of the host CPU resources. This is to ensure that you can keep using the nodes for their usual workloads without impacting performance.

### Does NPM edit firewall rules for monitoring?
NPM only creates a local Windows Firewall rule on the nodes on which the EnableRules.ps1 Powershell script is run to allow the agents to create TCP connections with each other on the specified port. The solution does not modify any network firewall or Network Security Group (NSG) rules.

### How can I check the health of the nodes being used for monitoring?
You can view the health status of the nodes being used for monitoring from the following view: Network Performance Monitor -> Configuration -> Nodes. If a node is unhealthy, you can view the error details and take the suggested action.

### Can NPM report latency numbers in microseconds?
NPM rounds the latency numbers in the UI and in milliseconds. The same data is stored at a higher granularity (sometimes up to four decimal places).

## Next steps

- Learn more about Network Performance Monitor by referring to [Network Performance Monitor solution in Azure](../../azure-monitor/insights/network-performance-monitor.md).
