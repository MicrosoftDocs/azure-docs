---
title: Traffic analytics usage scenarios
titleSuffix: Azure Network Watcher
description: Learn about Azure Network Watcher traffic analytics and the insights it can provide in different usage scenarios.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date: 10/18/2024
ms.custom: references_regions
---

# Traffic analytics usage scenarios

In this article, you learn how to get insights about your traffic after configuring traffic analytics in different scenarios.

## Find traffic hotspots

**Look for**

- Which hosts, subnets, virtual networks, and virtual machine scale set are sending or receiving the most traffic, traversing maximum malicious traffic and blocking significant flows?
    - Check comparative chart for hosts, subnet, virtual network, and virtual machine scale set. Understanding, which hosts, subnets, virtual networks and virtual machine scale set are sending or receiving the most traffic can help you identify the hosts that are processing the most traffic, and whether the traffic distribution is done properly.
    - You can evaluate if the volume of traffic is appropriate for a host. Is the volume of traffic normal behavior, or does it merit further investigation?
- How much inbound/outbound traffic is there?
    -   Is the host expected to receive more inbound traffic than outbound, or vice-versa?
- Statistics of blocked traffic.
    - Why is a host blocking a significant volume of benign traffic? This behavior requires further investigation and probably optimization of configuration
- Statistics of malicious allowed/blocked traffic
  - Why is a host receiving malicious traffic and why are flows from malicious sources allowed? This behavior requires further investigation and probably optimization of configuration.

    Select **See all** under **IP** as shown in the following image to see time trending for the top five talking hosts and the flow-related details (allowed – inbound/outbound and denied - inbound/outbound flows) for a host:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/dashboard-host-most-traffic-details.png" alt-text="Screenshot of dashboard showcasing host with most traffic details." lightbox="./media/traffic-analytics-usage-scenarios/dashboard-host-most-traffic-details.png":::

**Look for**

- Which are the most conversing host pairs?
    - Expected behavior like front-end or back-end communication or irregular behavior, like back-end internet traffic.
- Statistics of allowed/blocked traffic
    - Why a host is allowing or blocking significant traffic volume
- Most frequently used application protocol among most conversing host pairs:
    - Are these applications allowed on this network?
    - Are the applications configured properly? Are they using the appropriate protocol for communication? Select **See all** under **Frequent conversation**, as show in the following image:

        :::image type="content" source="./media/traffic-analytics-usage-scenarios/dashboard-most-frequent-conversations.png" alt-text="Screenshot of dashboard showcasing most frequent conversations." lightbox="./media/traffic-analytics-usage-scenarios/dashboard-most-frequent-conversations.png":::

- The following image shows time trending for the top five conversations and the flow-related details such as allowed and denied inbound and outbound flows for a conversation pair:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/top-five-chatty-conversation-details-and-trend.png" alt-text="Screenshot of top five chatty conversation details and trends." lightbox="./media/traffic-analytics-usage-scenarios/top-five-chatty-conversation-details-and-trend.png":::

**Look for**

- Which application protocol is most used in your environment, and which conversing host pairs are using the application protocol the most?
    - Are these applications allowed on this network?
    - Are the applications configured properly? Are they using the appropriate protocol for communication? Expected behavior is common ports such as 80 and 443. For standard communication, if any unusual ports are displayed, they might require a configuration change. Select **See all** under **Application port**, in the following image:

        :::image type="content" source="./media/traffic-analytics-usage-scenarios/dashboard-top-application-protocols.png" alt-text="Screenshot of dashboard showcasing top application protocols." lightbox="./media/traffic-analytics-usage-scenarios/dashboard-top-application-protocols.png":::

- The following images show time trending for the top five L7 protocols and the flow-related details (for example, allowed and denied flows) for an L7 protocol:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/top-five-layer-seven-protocols-details-and-trend.png" alt-text="Screenshot of top five layer 7 protocols details and trends." lightbox="./media/traffic-analytics-usage-scenarios/top-five-layer-seven-protocols-details-and-trend.png":::

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/log-search-flow-details-for-application-protocol.png" alt-text="Screenshot of the flow details for application protocol in log search." lightbox="./media/traffic-analytics-usage-scenarios/log-search-flow-details-for-application-protocol.png":::

**Look for**

- Capacity utilization trends of a VPN gateway in your environment.
    - Each VPN SKU allows a certain amount of bandwidth. Are the VPN gateways underutilized?
    - Are your gateways reaching capacity? Should you upgrade to the next higher SKU?
- Which are the most conversing hosts, via which VPN gateway, over which port?
    - Is this pattern normal? Select **See all** under **VPN gateway**, as shown in the following image:

        :::image type="content" source="./media/traffic-analytics-usage-scenarios/dashboard-top-active-vpn-connections.png" alt-text="Screenshot of dashboard showcasing top active VPN connections." lightbox="./media/traffic-analytics-usage-scenarios/dashboard-top-active-vpn-connections.png":::

- The following image shows time trending for capacity utilization of an Azure VPN Gateway and the flow-related details (such as allowed flows and ports):

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/vpn-gateway-utilization-trend-and-flow-details.png" alt-text="Screenshot of VPN gateway utilization trend and flow details." lightbox="./media/traffic-analytics-usage-scenarios/vpn-gateway-utilization-trend-and-flow-details.png":::

## Visualize traffic distribution by geography

**Look for**

- Traffic distribution per data center such as top sources of traffic to a datacenter, top rogue networks conversing with the data center, and top conversing application protocols.
  - If you observe more load on a data center, you can plan for efficient traffic distribution.
  - If rogue networks are conversing in the data center, then you can set network security group rules to block them.

    Select **View map** under **Your environment**, as shown in the following image:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/dashboard-traffic-distribution.png" alt-text="Screenshot of dashboard showcasing traffic distribution." lightbox="./media/traffic-analytics-usage-scenarios/dashboard-traffic-distribution.png":::

- The geo-map shows the top ribbon for selection of parameters such as data centers (Deployed/No-deployment/Active/Inactive/Traffic Analytics Enabled/Traffic Analytics Not Enabled) and countries/regions contributing Benign/Malicious traffic to the active deployment:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/geo-map-view-active-deployment.png" alt-text="Screenshot of geo map view showcasing active deployment." lightbox="./media/traffic-analytics-usage-scenarios/geo-map-view-active-deployment.png":::

- The geo-map shows the traffic distribution to a data center from countries/regions and continents communicating to it in blue (Benign traffic) and red (malicious traffic) colored lines:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/geo-map-view-traffic-distribution-to-countries-and-continents.png" alt-text="Screenshot of geo map view showcasing traffic distribution to countries/regions and continents." lightbox="./media/traffic-analytics-usage-scenarios/geo-map-view-traffic-distribution-to-countries-and-continents.png":::
	
- The **More Insight** blade of an Azure region also shows the total traffic remaining inside that region (that is, source and destination in same region). It further gives insights about traffic exchanged between availability zones of a datacenter.

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/inter-zone-and-intra-region-traffic.png" alt-text="Screenshot of Inter Zone and Intra region traffic." lightbox="./media/traffic-analytics-usage-scenarios/inter-zone-and-intra-region-traffic.png":::

## Visualize traffic distribution by virtual networks

**Look for**

- Traffic distribution per virtual network, topology, top sources of traffic to the virtual network, top rogue networks conversing to the virtual network, and top conversing application protocols.
  - Knowing which virtual network is conversing to which virtual network. If the conversation isn't expected, it can be corrected.
  - If rogue networks are conversing with a virtual network, you can correct network security group rules to block the rogue networks.
 
    Select **View VNets** under **Your environment** as shown in the following image:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/dashboard-virtual-network-distribution.png" alt-text="Screenshot of dashboard showcasing virtual network distribution." lightbox="./media/traffic-analytics-usage-scenarios/dashboard-virtual-network-distribution.png":::

- The Virtual Network Topology shows the top ribbon for selection of parameters like a virtual network's (Inter virtual network Connections/Active/Inactive), External Connections, Active Flows, and Malicious flows of the virtual network.
- You can filter the Virtual Network Topology based on subscriptions, workspaces, resource groups and time interval. Extra filters that help you understand the flow are:
  Flow Type (InterVNet, IntraVNET, and so on), Flow Direction (Inbound, Outbound), Flow Status (Allowed, Blocked), VNETs (Targeted and Connected), Connection Type (Peering or Gateway - P2S and S2S), and NSG. Use these filters to focus on VNets that you want to examine in detail.
- You can zoom-in and zoom-out while viewing Virtual Network Topology using mouse scroll wheel. Left-click and moving the mouse lets you drag the topology in desired direction. You can also use keyboard shortcuts to achieve these actions: A (to drag left), D (to drag right), W (to drag up), S (to drag down), + (to zoom in), - (to zoom out), R (to zoom reset).
- The Virtual Network Topology shows the traffic distribution to a virtual network  to flows (Allowed/Blocked/Inbound/Outbound/Benign/Malicious), application protocol, and network security groups, for example:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/virtual-network-topology-traffic-distribution-and-flow-details.png" alt-text="Screenshot of virtual network topology showcasing traffic distribution and flow details." lightbox="./media/traffic-analytics-usage-scenarios/virtual-network-topology-traffic-distribution-and-flow-details.png":::
    
    :::image type="content" source="./media/traffic-analytics-usage-scenarios/virtual-network-filters.png" alt-text="Screenshot of virtual network topology showcasing top level and more filters." lightbox="./media/traffic-analytics-usage-scenarios/virtual-network-filters.png":::

**Look for**

- Traffic distribution per subnet, topology, top sources of traffic to the subnet, top rogue networks conversing to the subnet, and top conversing application protocols.
    - Knowing which subnet is conversing to which subnet. If you see unexpected conversations, you can correct your configuration.
    - If rogue networks are conversing with a subnet, you're able to correct it by configuring NSG rules to block the rogue networks.
- The Subnets Topology shows the top ribbon for selection of parameters such as Active/Inactive subnet, External Connections, Active Flows, and Malicious flows of the subnet.
- You can zoom-in and zoom-out while viewing Virtual Network Topology using mouse scroll wheel. Left-click and moving the mouse lets you drag the topology in desired direction. You can also use keyboard shortcuts to achieve these actions: A (to drag left), D (to drag right), W (to drag up), S (to drag down), + (to zoom in), - (to zoom out), R (to zoom reset).
- The Subnet Topology shows the traffic distribution to a virtual network regarding flows (Allowed/Blocked/Inbound/Outbound/Benign/Malicious), application protocol, and NSGs, for example:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/topology-subnet-to-subnet-traffic-distribution.png" alt-text="Screenshot of subnet topology showcasing traffic distribution to a virtual network subnet with regards to flows." lightbox="./media/traffic-analytics-usage-scenarios/topology-subnet-to-subnet-traffic-distribution.png":::

**Look for**

Traffic distribution per Application gateway & Load Balancer, topology, top sources of traffic, top rogue networks conversing to the Application gateway & Load Balancer, and top conversing application protocols. 
    
 - Knowing which subnet is conversing to which Application gateway or Load Balancer. If you observe unexpected conversations, you can correct your configuration.
 - If rogue networks are conversing with an Application gateway or Load Balancer, you're able to correct it by configuring NSG rules to block the rogue networks. 

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/topology-subnet-traffic-distribution-to-application-gateway-subnet.png" alt-text="Screenshot shows a subnet topology with traffic distribution to an application gateway subnet regarding flows." lightbox="./media/traffic-analytics-usage-scenarios/topology-subnet-traffic-distribution-to-application-gateway-subnet.png":::

## View ports and virtual machines receiving traffic from the internet

**Look for**

- Which open ports are conversing over the internet?
  - If unexpected ports are found open, you can correct your configuration:

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/dashboard-ports-receiving-and-sending-traffic-to-internet.png" alt-text="Screenshot of dashboard showcasing ports receiving and sending traffic to the internet." lightbox="./media/traffic-analytics-usage-scenarios/dashboard-ports-receiving-and-sending-traffic-to-internet.png":::

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/azure-destination-ports-and-hosts-details.png" alt-text="Screenshot of Azure destination ports and hosts details." lightbox="./media/traffic-analytics-usage-scenarios/azure-destination-ports-and-hosts-details.png":::

## View information about public IPs interacting with your deployment

**Look for**

- Which public IPs are communicating with my network? What is the WHOIS data and geographic location of all public IPs?
- Which malicious IPs are sending traffic to my deployments? What is the threat type and threat description for malicious IPs?

The Public IP Information section, gives a summary of all types of public IPs present in your network traffic. Select the public IP type of interest to view details. On the traffic analytics dashboard, select any IP to view its information. For more information about the data fields presented, see [Public IP details schema](traffic-analytics-schema.md#public-ip-details-schema) .
	  
:::image type="content" source="./media/traffic-analytics-usage-scenarios/public-ip-information.png" alt-text="Screenshot that displays the public IP information section." lightbox="./media/traffic-analytics-usage-scenarios/public-ip-information.png":::

## Visualize the trends in network security group (NSG)/NSG rules hits

**Look for**

- Which NSG/NSG rules have the most hits in comparative chart with flows distribution?
- What are the top source and destination conversation pairs per NSG/NSG rules?

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/dashboard-nsg-hits-statistics.png" alt-text="Screenshot that shows NSG hits statistics in the dashboard." lightbox="./media/traffic-analytics-usage-scenarios/dashboard-nsg-hits-statistics.png":::

- The following images show time trending for hits of NSG rules and source-destination flow details for a network security group:

  - Quickly detect which NSGs and NSG rules are traversing malicious flows and which are the top malicious IP addresses accessing your cloud environment
  - Identify which NSG/NSG rules are allowing/blocking significant network traffic
  - Select top filters for granular inspection of an NSG or NSG rules

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/time-trending-for-nsg-rule-hits-and-top-nsg-rules.png" alt-text="Screenshot showcasing time trending for NSG rule hits and top NSG rules." lightbox="./media/traffic-analytics-usage-scenarios/time-trending-for-nsg-rule-hits-and-top-nsg-rules.png":::

    :::image type="content" source="./media/traffic-analytics-usage-scenarios/top-nsg-rules-statistics-details-in-log-search.png" alt-text="Screenshot of top NSG rules statistics details in log search." lightbox="./media/traffic-analytics-usage-scenarios/top-nsg-rules-statistics-details-in-log-search.png":::
    
## Next step

> [!div class="nextstepaction"]
> [Traffic analytics schema and data aggregation](traffic-analytics-schema.md)
