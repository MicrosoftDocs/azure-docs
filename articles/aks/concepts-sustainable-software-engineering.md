---
title: Concepts - Sustainable software engineering in Azure Kubernetes Services (AKS)
description: Learn about sustainable software engineering in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 03/29/2021
---

# Sustainable software engineering principles in Azure Kubernetes Service (AKS)


The [sustainability guidance in the Microsoft Azure Well-Architected Framework](/azure/architecture/framework/sustainability/sustainability-get-started) aims to address the challenges of building sustainable workloads on Azure. This article provides practical guidance for applying Well-Architected best practices as a technical foundation for building and operating sustainable solutions on AKS.


Sustainable software engineering is a shift in priorities and focus. In many cases, the way most software is designed and run highlights fast performance and low latency. Meanwhile, sustainable software engineering focuses on reducing as much carbon emission as possible. Consider:

* Applying sustainable software engineering principles can give you faster performance or lower latency, such as by lowering total network travel. 
* Reducing carbon emissions may cause slower performance or increased latency, such as delaying low-priority workloads. 

Before applying sustainable software engineering principles to your application, review the priorities, needs, and trade-offs of your application.

## Get started with sustainability software engineering

* What is a [sustainability software engineering](/azure/architecture/framework/sustainability/sustainability-get-started)
* Design Methodology for building sustainable workloads
* Design principles of a sustainable workload

## Key sustainability Design Areas

Sustainable guidance in the Well Architected Framework series is composed of architectural considerations and recommendations oriented around these key design areas.

Decisions made in one design area can impact or influence decisions across the entire design. The focus is ultimately on building a sustainable solution to minimize the footprint and impact on the environment.

|Design area|Description|
|---|---|
|[Application design](sustainability-application-design.md)|Cloud application patterns that allow for designing sustainable workloads.|
|[Application platform](sustainability-application-platform.md)|Choices around hosting environment, dependencies, frameworks, and libraries.|
|[Testing](sustainability-testing.md)|Strategies for CI/CD pipelines and automation, and how to deliver more sustainable software testing.|
|[Operational procedures](sustainability-operational-procedures.md)|Processes related to sustainable operations.|
|[Storage](sustainability-storage.md)|Design choices for making the data storage options more sustainable.|
|[Network and connectivity](sustainability-networking.md)|Networking considerations that can help reduce traffic and amount of data transmitted to and from the application.|
|[Security](sustainability-security.md)|Relevant recommendations to design more efficient security solutions on Azure.|

We recommend that readers familiarize themselves with these design areas, reviewing provided considerations and recommendations to better understand the consequences of encompassed decisions.

## Design areas for AKS clusters

* **Application Platform**: AKS is the Platform
* **Security**: regarding cluster security configuration and integration with Monitoring & SIEM.
* Storage : regarding implementation of storage classes & Backup retention policies.
* Testing : regarding Testing procedures for Cluster development lifecycle
* Network and connectivity : regarding cluster network design (availability zones, Network routing, etc.) and configuration (service mesh,..)


## Design areas for AKS workloads

* **Application Design** : regarding code optimization recommendations for applications.
* Storage : regarding application design (stateful Vs Stateless) ; and defining storage requirements
* Testing : regarding Testing procedures for Application development lifecycle
* Network and connectivity : regarding overall networking architecture (use of CDNs, caching mecanisms, etc.)


## Operational Procedures
Are considerations for sustainable workloads on Azure (not specific to a given service). The procedures will guide you through setting up an environment for measuring and continuously improving your Azure workloads' cost and carbon efficiency


## Next steps

Learn more about the features of AKS mentioned in this article:

* [Multiple node pools][multiple-node-pools]
* [Node sizing][node-sizing]
* [Scaling a cluster][scale]
* [Horizontal pod autoscaler][scale-horizontal]
* [Cluster autoscaler][scale-auto]
* [Spot pools][spot-pools]
* [System pools][system-pools]
* [Resource reservations][resource-reservations]
* [Proximity placement groups][proiximity-placement-groups]
* [Availability Zones][availability-zones]

[availability-zones]: availability-zones.md
[azure-monitor]: ../azure-monitor/containers/container-insights-overview.md
[azure-traffic-manager]: ../traffic-manager/traffic-manager-overview.md
[proiximity-placement-groups]: reduce-latency-ppg.md
[regions]: faq.md#which-azure-regions-currently-provide-aks
[resource-reservations]: concepts-clusters-workloads.md#resource-reservations
[scale]: concepts-scale.md
[scale-auto]: concepts-scale.md#cluster-autoscaler
[scale-horizontal]: concepts-scale.md#horizontal-pod-autoscaler
[spot-pools]: spot-node-pool.md
[multiple-node-pools]: use-multiple-node-pools.md
[node-sizing]: use-multiple-node-pools.md#specify-a-vm-size-for-a-node-pool
[sustainability-calculator]: https://azure.microsoft.com/blog/microsoft-sustainability-calculator-helps-enterprises-analyze-the-carbon-emissions-of-their-it-infrastructure/
[system-pools]: use-system-pools.md
[principles-sse]: /training/modules/sustainable-software-engineering-overview/
