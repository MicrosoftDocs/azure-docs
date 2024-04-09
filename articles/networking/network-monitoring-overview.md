---
title: Network Monitoring in Azure Monitor logs
description: Overview of network monitoring solutions, including network performance monitor, to manage networks across cloud, on-premises, and hybrid environments.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 10/30/2023
ms.author: allensu
---
# Network monitoring solutions 

Azure offers a host of solutions to monitor your networking assets. Azure has solutions and utilities to monitor network connectivity, the health of ExpressRoute circuits, and analyze network traffic in the cloud.

> [!IMPORTANT]
> As of July 1, 2021, you can no longer add new tests in an existing workspace or enable a new workspace in Network Performance Monitor (NPM). You're also no longer able to add new connection monitors in Connection Monitor (Classic). You can continue to use the tests and connection monitors that you've created prior to July 1, 2021. 
> 
> To minimize service disruption to your current workloads, [migrate your tests from Network Performance Monitor](/azure/network-watcher/migrate-to-connection-monitor-from-network-performance-monitor), or  [migrate from Connection Monitor (Classic)](/azure/network-watcher/migrate-to-connection-monitor-from-connection-monitor-classic) to the new Connection Monitor in Azure Network Watcher before February 29, 2024.

## Network Performance Monitor

Network Performance Monitor is a suite of capabilities that is geared towards monitoring the health of your network. Network Performance Monitor monitors network connectivity to your applications, and provides insights into the performance of your network. Network Performance Monitor is cloud-based and provides a hybrid network monitoring solution that monitors connectivity between:
 
* Cloud deployments and on-premises locations

* Multiple data centers and branch offices

* Mission critical multi-tier applications/micro-services

* User locations and web-based applications (HTTP/HTTPs) 

Performance Monitor, ExpressRoute Monitor, and Service Connectivity Monitor are monitoring capabilities within Network Performance Monitor and are described in the following sections.

## Performance Monitor

Performance Monitor is part of Network Performance Monitor and is network monitoring for cloud, hybrid, and on-premises environments. You can monitor network connectivity across remote branch and field offices, store locations, data centers, and clouds. You can detect network issues before your users complain. The key advantages are:

* Monitor loss and latency across various subnets and set alerts

* Monitor all paths (including redundant paths) on the network

* Troubleshoot transient and point-in-time network issues, that's difficult to replicate

* Determine the specific segment on the network that is responsible for degraded performance

* Monitor the health of the network, without the need for SNMP

:::image type="content" source="./media/network-monitoring-overview/npm-topology-map.png" alt-text="Diagram Network Performance Monitor topology map.":::

For more information, view the following articles:

* [Configure a Network Performance Monitor Solution in Azure Monitor logs](/previous-versions/azure/azure-monitor/insights/network-performance-monitor) 

* [Use cases](/archive/blogs/msoms/monitor-on-premises-cloud-iaas-and-hybrid-networks-using-oms-network-performance-monitor)

* Product Updates:

  * [February 2017](/archive/blogs/msoms/oms-network-performance-monitor-is-now-generally-available)

  * [August 2017](/archive/blogs/msoms/improvements-to-oms-network-performance-monitor)

## ExpressRoute Monitor

Network Performance Monitor for ExpressRoute offers comprehensive ExpressRoute monitoring for Azure Private peering and Microsoft peering connections. You can monitor E2E connectivity and performance between your branch offices and Azure over ExpressRoute. The key capabilities are:

* Autodetection of ER circuits associated with your subscription

* Detection of network topology from on-premises to your cloud applications

* Capacity planning, bandwidth utilization analysis

* Monitoring and alerting on both primary and secondary paths

* Monitoring connectivity to Azure services such as Microsoft 365, Dynamics 365, ... over ExpressRoute

* Detect degradation of connectivity to virtual networks

:::image type="content" source="./media/network-monitoring-overview/expressroute-topology-map.png" alt-text="Diagram of geo-map showing traffic across regions.":::

For more information, see the following articles:

* [Configure Network Performance Monitor for ExpressRoute](../expressroute/how-to-npm.md)

## Service Connectivity Monitor

With Service Connectivity monitoring, you can now test reachability of applications and detect performance bottlenecks across on-premises, carrier networks and cloud/private data centers.

* Monitor end-to-end network connectivity to applications

* Correlate application delivery with network performance, detect precise location of degradation along the path between the user and the application

* Test application reachability from multiple user locations across the globe

* Determine network latency and packet loss for your line of business and SaaS applications

* Determine hot spots on the network that may be causing poor application performance

* Monitor reachability to Microsoft 365 applications, using built-in tests for Microsoft 365, Dynamics 365, Skype for Business and other Microsoft services

For more information, see the following articles:

* [Configure Network Performance Monitor for monitoring Service Endpoints](/previous-versions/azure/azure-monitor/insights/network-performance-monitor-service-connectivity#configuration)

* [Blog post](https://aka.ms/svcendptmonitor)

## Traffic Analytics

Traffic Analytics is a cloud-based solution that provides  visibility into user and application activity on your cloud networks. NSG Flow logs are analyzed to provide insights into:

* Traffic flows across your networks between Azure and Internet, public cloud regions, virtual networks, and subnets

* Applications and protocols on your network, without the need for sniffers or dedicated flow collector appliances

* Top talkers, chatty applications, VM conversations in the cloud, traffic hotspots

* Sources and destinations of traffic across virtual networks, inter-relationships between critical business services and applications

* Security – malicious traffic, ports open to the Internet, applications or VMs attempting Internet access…

* Capacity utilization - helps you eliminate issues of over-provisioning or underutilization by monitoring utilization trends of VPN gateways and other services

Traffic Analytics equips you with information that helps you audit your organization’s network activity, secure applications and data, and optimize workload performance and stay compliant.

:::image type="content" source="../network-watcher/media/traffic-analytics/geo-map-view-showcasing-traffic-distribution-to-countries-and-continents.png" alt-text="Diagram of geo-map showing traffic across regions 2.":::

Related links:

* [Blog post](https://aka.ms/trafficanalytics)

* [Documentation](../network-watcher/traffic-analytics.md)

* [FAQ](../network-watcher/traffic-analytics-faq.yml)

## DNS Analytics

DNS Analytics is built for DNS Administrators, this solution collects, analyzes, and correlates DNS logs to provide security, operations, and performance-related insights.  Some of the capabilities are:

* Identification of clients that try to resolve to malicious domains

* Identification of stale resource records

* Visibility into frequently queried domain names and talkative DNS clients

* Visibility into the request load on DNS servers

* Monitoring of dynamic DNS registration failures

:::image type="content" source="./media/network-monitoring-overview/dns-analytics-overview.png" alt-text="Diagram of DNS Analytics Dashboard.":::

Related links:

* [Blog post](/archive/blogs/msoms/introducing-oms-dns-analytics)

* [Documentation](/previous-versions/azure/azure-monitor/insights/dns-analytics)

## Miscellaneous

* [New Pricing](/previous-versions/azure/azure-monitor/insights/network-performance-monitor-pricing-faq)