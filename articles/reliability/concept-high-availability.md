---
title: High availability on the Azure cloud platform
description: Learn about how Azure provides high availability for your applications and services.
author: anaharris-ms
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 12/10/2024
ms.author: anaharris
ms.custom: subject-reliability
---

# What is high availability?

High availability (HA) is defined by your entire workload's ability to maintain uptime on a daily basis, even during transient faults and intermittent failures. For example, in a cloud environment it's common for there to be server crashes, brief network outages, equipment restarts due to patches, and so on. Because these events happen regularly, it's important that workloads be designed and configured for high availability in accordance with the requirements of the specific application or service and customer expectations.  

Because HA can vary with each workload, it's important to understand the requirements and customer expectations when determining high availability. For example, a web application might require 99.7000% uptime, while a critical financial application might require 99.9999% uptime. It is also important to understand that HA is not measured by the uptime of a single node, but by the overall availability of the entire workload. 

When defining high availability, a workload architect typically defines a service level objective (SLO) that describes the percentage of time the workload should be available to users. The SLO is typically defined in terms of the number of nines, such as 99.9% availability (three nines) or 99.999% availability (five nines). For more detailed information on how to define and measure high availability, see [Recommendations for defining reliability targets](/azure/well-architected/reliability/metrics).

To achieve high availability, a workload may use include the following design elements:

- **Use service SKUS that support high availability**. For example, Azure offers a variety of services that are designed to be highly available, such as Azure Virtual Machines, Azure App Service, and Azure SQL Database. These services are designed to provide high availability by default, and can be used to build highly available workloads.
 - **Redundancy** is the practice of duplicating instances or data to increase he reliability of the workload. For example, a web application might use multiple instances of a web server to ensure that the application remains available even if one instance fails. A database may have a multiple replicas to ensure that the data remains available even if one replica fails. Redundancy can vary by scope and can be either at the data center, zonal, or regional level.
 - **Fault tolerance** is the ability of a system to continue operating in the event of a failure. For example, a web application might be designed to continue operating even if a web server fails. Fault tolerance can be achieved through redundancy, failover, and other techniques.
 - **Scalability and elasticity** are the abilities of a system to handle increased load by adding resources. For example, a web application might be designed to automatically add additional web servers as traffic increases. Scalability and elasticity can help a system maintain availability during peak loads. For more information on how to design a scalable and elastic system, see [Scalability and elasticity](/azure/well-architected/reliability/scaling).
 - **Monitoring and alerting** let's you know the health of your system, even when automated mitigations take place. Use Azure Service Health, Azure Resource Health, and Azure Monitor, as well as Scheduled Events for virtual machines. For more information on how to design a reliability monitoring and alerting strategy, see [Monitoring and alerting](/azure/well-architected/reliability/monitoring-alerting-strategy).

 <!-- 
 If you have stringent requirements, HA might also include a multi-region active/active design. This is very costly and complex to implement, but if done well it can result in a very resilient solution. Normally, though, regional failures are considered disasters and are part of your disaster recovery planning.
 -->
 