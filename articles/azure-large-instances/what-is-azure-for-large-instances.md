---
title: What is Azure for Large Instances?
description: Provides an overview of the Azure for Large Instances.
ms.author: jacobjaygbay
ms.custom: references_regions
ms.topic: conceptual
author: jjaygbay
ms.date: 06/01/2023
---

#  What is Azure for Large Instances?

Microsoft Azure offers a cloud infrastructure with a wide range of integrated cloud services to meet your business needs. In some cases, though, you may need to run services on Azure Large servers without a virtualization layer. You may need root access and control over the operating system (OS). To meet this need, Azure offers Azure Large instances for several high-value, mission-critical applications. 

Azure Large instances Infrastructure (ALI) is made up of dedicated large instances (compute instances). It features: 

High-performance storage appropriate to the application (Fiber Channel). Storage can also be shared across Azure Large instances to enable features like scale-out clusters or high availability pairs with failed-node-fencing capability. 

A set of function-specific virtual LANs (VLANs) in an isolated environment. 

This environment also has special VLANs you can access if you're running virtual machines (VMs) on one or more Azure Virtual Networks (VNets) in your Azure subscription. The entire environment is represented as a resource group in your Azure subscription. 

Azure Large instances is offered in over 30 SKUs from 2-socket to 24-socket servers and memory ranging from 1.5 TBs up to 24 TBs. A large set of SKUs is also available with Optane memory. Azure offers the largest range of Azure Large instances in a hyperscale cloud. 

## Why Azure Large instances? 

Some workloads in the enterprise consist of technologies that just aren't designed to run in a typical virtualized cloud setting. 
They require special architecture, certified hardware, or extraordinarily large sizes. 
Although those technologies have the most sophisticated data protection and business continuity features, those features aren't built for the virtualized cloud. 
They're more sensitive to latencies and noisy neighbors and require more control over change management and maintenance activity. 

Azure Large instances are built, certified, and tested for a select set of such applications. 
Azure was the first to offer such solutions and has since led with the largest portfolio and most sophisticated systems. 

## Azure Large instances benefits 

Azure Large instances are intended for critical workloads that require certification to run your enterprise applications. 
The Azure Large instances are dedicated only to you, and you'll have full access (root access) to the operating system (OS). 
You manage OS and application installation according to your needs. For security, the instances are provisioned within your Azure Virtual Network (VNet) with no internet connectivity. 
Only services running on your virtual machines (VMs), and other Azure services in same Tier 2 network, can communicate with your Azure Large instances. 

Azure Large instances offers these benefits: 

* Non-hypervised Azure Large instances, single tenant ownership 
* Low latency between Azure hosted application VMs to BareMetal instances (0.35 ms) 
* All Flash SSD and NVMe 
* Up to 1 PB/tenant 
* IOPS up to 1.2 million/tenant 
* 40/100-GB network bandwidth 
Accessible via FC 
* Redundant power, power supplies, NICs, TORs, ports, WANs, storage, and management 
* Hot spares for replacement on a failure (without the need for reconfiguring) 
* Customer coordinated maintenance windows 
* Application aware snapshots, archive, mirroring, and cloning 

## SKU availability in Azure regions 
Azure Large instances offers multiple SKUs certified for specialized workloads. Use the workload-specific SKUs to meet your needs. 
Large instances – Ranging from two-socket to four-socket systems. 
Very Large instances – Ranging from 4-socket to 20-socket systems. 

Azure Large instances for specialized workloads is available in the following Azure regions: 
* East US *zones support 
* West US 2 *zones support 
* South Central US 

>[!NOTE]
>If the resource provider isn't registered, select **Register**.

Zones support refers to availability zones within a region where Azure Large instances can be deployed across zones for high resiliency and availability. 
This capability enables support for multi-site active-active scaling. 

## Managing Azure Large instances in Azure 

Depending on your needs, the application topologies of Azure Large instances can be complex. You may deploy multiple instances in one or more locations. The instances can have shared or dedicated storage, and specialized LAN and WAN connections. So for Azure Large instances, Azure offers a consultation by a CSA/GBB in the field to work with you. 

By the time your Azure Large instances are provisioned, the OS, networks, storage volumes, placements in zones and regions, and WAN connections between locations have already been configured. You're set to register your OS licenses (BYOL), configure the OS, and install the application layer. 

You'll see all the Azure Large instance resources, and their state and attributes, in the Azure portal. You can also operate the instances and open service requests and support tickets from there. 

## Operational model 

Azure Large instances are ISO 27001, ISO 27017, SOC 1, and SOC 2 compliant. It also uses a bring-your-own-license (BYOL) model: OS, specialized workload, and third-party applications. 

As soon as you receive root access and full control, you assume responsibility for: 

Designing and implementing backup and recovery solutions, high availability, and disaster recovery. 

Licensing, security, and support for the OS and third-party software. 

Microsoft is responsible for: 

Providing the hardware for specialized workloads. 

Provisioning the OS. 