---
title: "Workbench: Azure Modeling and Simulation Workbench"
description: Overview of Azure Modeling and Simulation Workbench workbench component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: azure-modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench user, I want to understand workbench components.
---
# Workbench: Azure Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench is a Platform-as-a-Service (PaaS) that provides a secure environment for managed, cloud-based collaboration and access to large-scale compute infrastructure. The Modeling and Simulation Workbench provides conventional cloud resources, such as computing, storage, and networking, in an isolated, managed environment. The components are arranged as a hierarchy of containers, presented in the user's subscription but deployed in Microsoft's manged environment. Multiple enterprises can collaboratively work on projects within a workbench using Modeling and Simulation Workbench's secure design environment.

This article presents an overview of the individual components, which make up the Azure Modeling and Simulation Workbench.

## Workbench

A Workbench is the top-level container for the Azure Modeling and Simulation Workbench. It hosts conventional Azure resources in a closed environment. Workbenches house user and data isolation chambers, virtual machines, and networking infrastructure. A Workbench has no managing controls and only a Workbench Owner can deploy.

## Chambers

[Chambers](./concept-chamber.md) are contained within a Workbench object and contain user data and workloads in an isolated environment. Users assigned to a chamber only have visibility to users and resources in that same chamber. Compute resources are deployed into a chamber as Workload VMs and several classes of storage are available.

### Compute

Chamber Workload VMs are the Workbench's compute resource and the encapsulating container for traditional VMs. Unlike traditional Infrastructure-as-a-Service offerings, Workload VMs are created with a sensible set of defaults, eliminating the expertise required to securely deploy a VM into a cloud environment. Workload VMs are isolated from the internet and VMs in other chambers, but have access to all VMs in the same chamber. User provisioning is automated at the chamber level. Chamber VMs offer a select set of the Azure virtual machine (VM) offerings that span diverse memory-to-core ratios and suit different workload requirements. VM offerings include general purpose, compute optimized memory optimized VMs.

## Storage

Storage components work together to provide high performance for engineering workflows. The storage service enables you to migrate and run enterprise file applications. Modeling and Simulation Workbench offers a range of storage configurations that offer high-performance, shared, or isolated access. Storage is preconfigured to be accessible to chambers or between a select set of chambers.

## Networking

Networking is presented as a [Connector](./concept-connector.md) object that attaches to a chamber. Connectors can be provisioned to allow connection directly from the internet or an Azure virtual network. Azure virtual network connections enable over-provisioned network resources with high bandwidth and low latency. Network quality and throughput impacts job runtime drastically. Azure offers built-in, custom options for fast, scalable, and secure connectivity aided by its wide and private optical-fiber capacity, enabling low-latency access globally. Azure also offers accelerated networking to reduce the number of hops and deliver improved performance.

<!-- 
- [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) - The network service creates private connections between the infrastructure on-premises without traversing the public internet. The service offers immense reliability, quicker speeds, and lower latencies than regular internet connections.

- [Azure VPN](/azure/vpn-gateway/vpn-gateway-about-vpngateways) - A VPN gateway is a specific type of virtual network gateway, sending encrypted traffic between an Azure virtual network and an on-premises network over the public network.

- Remote desktop service - As robust security is mandatory to protect IP within and outside chambers, remote desktop access needs to be secured, with custom restrictions on data transfer through the sessions. Customer IT admins can enable multifactor authentication through [Microsoft Entra ID](/azure/active-directory/) and provision role assignments to Modeling and Simulation Workbench users. -->

## Related content

* [Storage](./concept-storage.md)
* [User personas](./concept-user-personas.md)
* [Chambers](./concept-chamber.md)
