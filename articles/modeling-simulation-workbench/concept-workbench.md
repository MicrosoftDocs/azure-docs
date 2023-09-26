---
title: "Workbench: Azure Modeling and Simulation Workbench"
description: Overview of Azure Modeling and Simulation Workbench workbench component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench user, I want to understand the workbench component.
---

# Workbench: Azure Modeling and Simulation Workbench

An Azure Modeling and Simulation Workbench is a placeholder for housing several workbench components for users. A workbench refers to a series of supporting services that optimize workload performance in Azure Modeling and Simulation Workbench, such as: computing, storage, and networking.

## Workbench components

A workbench hosts Azure resources in a closed environment of virtual machines, storage devices, and databases. A workbench is the parent container for [chamber](./concept-chamber.md) objects that run engineering applications and workloads in isolated environments.

Multiple teams can work on shared projects within a workbench using Modeling and Simulation Workbench's collaborative and secure design environment.

The chamber and [connector](./concept-connector.md) have its own admin that manages the space, the components, and its users. Authorized users can access and modify systems and transform the components and services as per their project requirements. Users can also delete high-performance VMs after use to save on costs.

## Workbench infrastructure

The infrastructure of the Azure Modeling and Simulation Workbench is optimized for compute and memory intensive applications. The workbenches ensure maximum throughput and performance for engineering workloads, supported by high performance file systems and efficient job scheduling.

The workbench includes the following types of components:

### Compute

Azure offers varied classes of virtual machines (VMs) that span diverse memory-to-core ratios and suit different workload requirements. Some of the VMs include General purpose VMs, Compute optimized VMs, and Memory optimized VMs.

### Storage

Key storage components work together to provide high performance for engineering workflows. The storage service enables you to migrate and run enterprise file applications.

### Networking

The Azure virtual network enables over-provisioned network resources with high bandwidth and low latency. Network quality and throughput impacts job runtime drastically. Azure offers built-in, custom options for fast, scalable, and secure connectivity aided by its wide and private optical-fiber capacity, enabling low-latency access globally. Azure also offers accelerated networking to reduce the number of hops and deliver improved performance.

- [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) - The network service creates private connections between the infrastructure on-premises without traversing the public internet. The service offers immense reliability, quicker speeds, and lower latencies than regular internet connections.

- [Azure VPN](/azure/vpn-gateway/vpn-gateway-about-vpngateways) - A VPN gateway is a specific type of virtual network gateway, sending encrypted traffic between an Azure virtual network and an on-premises network over the public network.

- Remote desktop service - As robust security is mandatory to protect IP within and outside chambers, remote desktop access needs to be secured, with custom restrictions on data transfer through the sessions. Customer IT admins can enable multifactor authentication through [Azure Active Directory](/azure/active-directory/) and provision role assignments to Modeling and Simulation Workbench users.

## Next steps

- [User personas](./concept-user-personas.md)
