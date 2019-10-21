---
title: 'Internet Connectivity Monitoring Overview  | Microsoft Docs'
description: In this article, better understand how Internet Analyzer and Network Watcher can address your user performance questions.  
services: internet-analyzer
author: megan-beatty; mattcalder; diego-perez-botero

ms.service: internet-analyzer
ms.topic: tutorial
ms.date: 10/16/2019
ms.author: mebeatty
# Customer intent: As someone interested in the internet monitoring/ connectivity space, I want to better understand the difference between Internet Analyzer and Network Watcher. 

---
# Internet Connectivity Monitoring Overview 

Internet Analyzer and Network Watcher can both contribute to your performance management strategy with Azure. This guide is designed to help you choose the right solution for your scenario. 

Internet Analyzer measures the performance between your end users' Web application and an endpoint through a series of dual-endpoint tests. Internet Analyzer aggregates and analyzes your data and helps you understand the performance of various cloud solutions before you migrate. Internet Analyzer can be used to understand both your **current and future workloads**. 

Network Watcher provides tools to monitor, diagnose, and gain insight into your Azure Virtual Network. Network Watcher can be used to understand your **current and historical workloads**. 



![internet analyzer vs. network watcher](./media/ia-networkwatcher.png)


## Internet Analyzer scenarios 

Some of the questions Internet Analyzer can answer are: 
* What is the impact of migrating to the cloud? 
* What is the best cloud for your end-user population in each region?
* What is the value of putting my data at the edge vs. in a data center? 
* What is the performance benefit of Azure Front Door?
* What is the performance benefit of Azure CDN from Microsoft? 
* What is the performance benefit of ExpressRoute? 
* How does Azure CDN from Microsoft stack up? 
* How do different network architectures impact your end user performance? 

## Network Watcher scenarios

Some of the questions Network Watcher can answer are: 
* How can I monitor connectivity between two networks? 
* How can I monitor connectivity over an ExpressRoute circuit? 
* How can I troubleshoot connectivity issues between two points in a network (i.e. VMs)?
* How can I troubleshoot connectivity issues between a Web application and various locations on the network? 
* How can I compare my current network topology and performance to my historical topology?
* How can I trouble shoot my existing cloud topologies (involving VMs, VNETs, VPNs, and VWANs)? 


## Next steps

* Read the [Internet Analyzer overview](internet-analyzer-overview.md)
* Read the [Network Watcher overview](https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-monitoring-overview)
