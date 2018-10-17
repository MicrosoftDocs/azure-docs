---
title: 'About Network Monitoring in Log Analytics | Microsoft Docs'
description: Overview of network monitoring solutions, including NPM, to manage networks across cloud, on-premises, and hybrid environments.
services: monitoring-and-diagnostics
documentationcenter: na
author: agummadi
manager: ''
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: monitoring-and-diagnostics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2018
ms.author: ajaycode

---
# Network monitoring solutions 

Azure offers a host of solutions to monitor your networking assets. Azure has solutions and utilities to monitor network connectivity, the health of ExpressRoute circuits, and analyze network traffic in the cloud.

## Network Performance Monitor (NPM)

Network Performance Monitor (NPM) is a suite of capabilities, each of which is geared towards monitoring the health of your network, network connectivity to your applications, and provides insights into the performance of your network. NPM is cloud-based and provides a hybrid network monitoring solution that monitors connectivity between:
 
* Cloud deployments and on-premises locations
* Multiple data centers and branch offices
* Mission critical multi-tier applications/micro-services
* User locations and web-based applications (HTTP/HTTPs) 

Performance Monitor, ExpressRoute Monitor, and Service Connectivity Monitor are monitoring capabilities within NPM and are described below.

## Performance Monitor

Performance Monitor is part of NPM and is network monitoring for cloud, hybrid, and on-premises environments. You can monitor network connectivity across remote branch and field offices, store locations, data centers, and clouds. You can detect network issues before your users complain. The key advantages are:

* Monitor loss and latency across various subnets and set alerts
* Monitor all paths (including redundant paths) on the network
* Troubleshoot transient and point-in-time network issues, that are difficult to replicate
* Determine the specific segment on the network, that is responsible for degraded performance
* Monitor the health of the network, without the need for SNMP

![NPM topology map](./media/network-monitoring-overview/npm-topology-map.png) 

For more information, view the following articles:

* [Configure a Network Performance Monitor Solution in Log Analytics](../log-analytics/log-analytics-network-performance-monitor.md) 
* [Use cases](https://blogs.technet.microsoft.com/msoms/2016/08/30/monitor-on-premises-cloud-iaas-and-hybrid-networks-using-oms-network-performance-monitor/)
*  Product Updates: [February 2017](https://blogs.technet.microsoft.com/msoms/2017/02/27/oms-network-performance-monitor-is-now-generally-available/), [August 2017](https://blogs.technet.microsoft.com/msoms/2017/08/14/improvements-to-oms-network-performance-monitor/)

## ExpressRoute Monitor

NPM for ExpressRoute offers comprehensive ExpressRoute monitoring for Azure Private peering and Microsoft peering connections. You can monitor E2E connectivity and performance between your branch offices and Azure over ExpressRoute. The key capabilities are:

* Auto-detection of ER circuits associated with your subscription
* Detection of network topology  from on-premises to your cloud applications
* Capacity planning,  bandwidth utilization analysis
* Monitoring and alerting on both primary and secondary paths
* Monitoring connectivity to Azure services such as Office 365, Dynamics 365, ... over ExpressRoute
* Detect degradation of connectivity to VNets

![Geo-map showing traffic across regions](./media/network-monitoring-overview/expressroute-topology-map.png) 

For more information, see the following articles:

* [Configure Network Performance Monitor for ExpressRoute](../expressroute/how-to-npm.md)
* [Blog post](https://aka.ms/NPMExRmonitorGA)

## Service Connectivity Monitor

With Service Connectivity monitoring, you can now test reachability of applications and detect performance bottlenecks across on-premises, carrier networks and cloud/private data centers.

* Monitor end-to-end network connectivity to applications
* Correlate application delivery with network performance, detect precise location of degradation along the path between the user and the application
* Test application reachability from multiple user locations across the globe
* Determine network latency and packet loss for your line of business and SaaS applications
* Determine hot spots on the network, that may be causing poor application performance
* Monitor reachability to  Office 365 applications, using built-in tests for Microsoft Office 365, Dynamics 365, Skype for Business and other Microsoft services

For more information, see the following articles:

* [Configure Network Performance Monitor for monitoring Service Endpoints](https://aka.ms/applicationconnectivitymonitorguide)
* [Blog post](https://aka.ms/svcendptmonitor)

## Traffic Analytics
Traffic Analytics is a cloud-based solution that provides  visibility into user and application activity on your cloud networks. NSG Flow logs are analyzed to provide insights into:

* Traffic flows across your networks between Azure and Internet,  public cloud regions, VNETs, and subnets
* Applications and protocols on your network, without the need for sniffers or dedicated flow collector appliances
* Top talkers, chatty applications, VM conversations in the cloud, traffic hotspots
* Sources and destinations of traffic across VNETs, inter-relationships between critical business services and applications
* Security – malicious traffic, ports open to the Internet,  applications or VMs attempting Internet access…
* Capacity utilization - helps you eliminate issues of over-provisioning or underutilization by monitoring utilization trends of VPN gateways and other services

Traffic Analytics equips you with actionable information that helps you audit your organization’s network activity, secure applications and data,  optimize workload performance and stay compliant.

![Geo-map showing traffic across regions](../network-watcher/media/traffic-analytics/geo-map-view-showcasing-traffic-distribution-to-countries-and-continents.png) 

Related links:
* [Blog post](https://aka.ms/trafficanalytics), [Documentation](https://aka.ms/trafficanalyticsdocs), [FAQ](https://docs.microsoft.com/azure/network-watcher/traffic-analytics-faq)

## DNS Analytics
Built for DNS Administrators, this solution collects, analyzes, and correlates DNS logs to provide security, operations, and performance-related insights.  Some of the capabilities are:

* Identification of clients that try to resolve to malicious domains
* Identification of stale resource records
* Visibility into frequently queried domain names and talkative DNS clients
* Visibility into the request load on DNS servers
* Monitoring of dynamic DNS registration failures

![DNS Analytics Dashboard](./media/network-monitoring-overview/dns-analytics-overview.png) 

Related links:
* [Blog post](https://blogs.technet.microsoft.com/msoms/2017/04/19/introducing-oms-dns-analytics/), [Documentation](https://docs.microsoft.com/azure/log-analytics/log-analytics-dns)

## Miscellaneous

* [New Pricing](https://docs.microsoft.com/azure/log-analytics/log-analytics-network-performance-monitor-pricing-faq)
