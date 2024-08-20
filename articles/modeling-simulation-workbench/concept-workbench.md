---
title: "Workbench: Azure Modeling and Simulation Workbench"
description: Overview of Azure Modeling and Simulation Workbench workbench component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench user, I want to understand  workbench components.
---
# Workbench: Azure Modeling and Simulation Workbench

An Azure Modeling and Simulation Workbench is a collection of cloud resources combined and presented to be a easy to manage Platform-as-a-Service for secure, cloud-based collaboration. At the top level, a Workbench object is a grouping that encapsulates supporting services deployed in a Microsoft-managed environment.  Workbenches provide user, data, and workload isolation with full auditability and can be deployed and scaled on-demand.  The Modeling and Simulation Workbench provides conventional cloud resources, such as computing, storage, and networking, in an isolated, managed environment.

This article presents the components which make up the Azure Modeling and Simulation Workbench.

## Workbench

A Workbench is the top-level container for the Azure Modeling and Simulation Workbench.  It hosts conventional Azure resources in a closed environment.  Workbenches house user and data isolation Chambers, virtual machines, and networking infrastructure.  The Workbench is the parent container for [Chamber](./concept-chamber.md) objects that host user data and workloads in isolated environments.  A Workbench is deployed by a special user role known as Workbench Owner and has no managing controls.

Multiple teams can work on shared projects within a workbench using Modeling and Simulation Workbench's collaborative and secure design environment.

The chamber and [connector](./concept-connector.md) have its own admin that manages the space, the components, and its users. Authorized users can access and modify systems and transform the components and services as per their project requirements. Users can also delete high-performance VMs after use to save on costs.

## Workbench infrastructure

The infrastructure of the Azure Modeling and Simulation Workbench is optimized for compute and memory intensive applications. Workbenches ensure maximum throughput and performance for engineering workloads, supported by high performance file systems and efficient job scheduling.

A Workbench includes the following types of components:

### Compute

Workbenches host a select set of the Azure virtual machine (VM) offerings that span diverse memory-to-core ratios and suit different workload requirements. VM offerings include general purpose, compute optimized memory optimized VMs.

### Storage

Storage components work together to provide high performance for engineering workflows. The storage service enables you to migrate and run enterprise file applications.  Modeling and Simulation Workbench offers a selection of storage configurations that offer high-performance, shared or isolated access.

### Networking

The Azure virtual network enables over-provisioned network resources with high bandwidth and low latency. Network quality and throughput impacts job runtime drastically. Azure offers built-in, custom options for fast, scalable, and secure connectivity aided by its wide and private optical-fiber capacity, enabling low-latency access globally. Azure also offers accelerated networking to reduce the number of hops and deliver improved performance.
<!-- 
- [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) - The network service creates private connections between the infrastructure on-premises without traversing the public internet. The service offers immense reliability, quicker speeds, and lower latencies than regular internet connections.

- [Azure VPN](/azure/vpn-gateway/vpn-gateway-about-vpngateways) - A VPN gateway is a specific type of virtual network gateway, sending encrypted traffic between an Azure virtual network and an on-premises network over the public network.

- Remote desktop service - As robust security is mandatory to protect IP within and outside chambers, remote desktop access needs to be secured, with custom restrictions on data transfer through the sessions. Customer IT admins can enable multifactor authentication through [Microsoft Entra ID](/azure/active-directory/) and provision role assignments to Modeling and Simulation Workbench users. -->

## Next step


- [User personas](./concept-user-personas.md)
