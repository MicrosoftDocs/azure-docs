---
title: Azure Operator Nexus resource types
description: Operator Nexus platform and tenant resource types
author: jashobhit
ms.author: shobhitjain
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 03/06/2023
ms.custom: template-concept
---

# Azure Operator Nexus resource types

This article introduces you to the Operator Nexus components represented as Azure resources in Azure Resource Manager.

<!--- IMG ![Resource Types](Docs/media/resource-types.png) IMG --->
:::image type="content" source="media/resource-types.png" alt-text="Screenshot of Resource Types.":::

Figure: Resource model

## Platform components

The Operator Nexus Cluster (or Instance) platform components include the infrastructure and the platform components used to manage these infrastructure resources.

### Network Fabric Controller

The Network Fabric Controller (NFC) is a resource that automates the life cycle management of all network devices deployed in an Operator Nexus instance.
NFC is hosted in a [Microsoft Azure Virtual Network](../virtual-network/virtual-networks-overview.md) in an Azure region.
The region should be connected to your on-premises network via [Microsoft Azure ExpressRoute](../expressroute/expressroute-introduction.md).
An NFC can manage the Network Fabric of many (subject to limits) Operator Nexus instances.

### Network Fabric

The Network Fabric resource models a collection of network devices, compute servers, and storage appliances, and their interconnections. The Network Fabric resource also includes the networking required for your network functions and workloads. Each Operator Nexus instance has one Network Fabric.

The Network Fabric Controller (NFC) performs the lifecycle management of the Network Fabric.
It configures and bootstraps the Network Fabric resources.

### Cluster manager

The Cluster Manager (CM) is hosted on Azure and manages the lifecycle of all on-premises clusters.
Like NFC, a CM can manage multiple Operator Nexus instances.
The CM and the NFC are hosted in the same Azure subscription.

### Cluster

The Cluster (or Compute Cluster) resource models a collection of racks, bare metal machines, storage, and networking.
Each cluster is mapped to the on-premises Network Fabric. A cluster provides a holistic view of the deployed compute capacity.
Cluster capacity examples include the number of vCPUs, the amount of memory, and the amount of storage space. A cluster is also the basic unit for compute and storage upgrades.

### Network Rack

The Network Rack consists of Consumer Edge (CE) routers, Top of Rack switches (ToRs), storage appliance, Network Packet Broker (NPB), and the Terminal Server (TS).
The Rack also models the connectivity to the operator's Physical Edge switches (PEs) and the ToRs on the other Racks.

### Rack

The Rack (or a compute rack) resource represents the compute servers (Bare Metal Machines), management servers, management switch and ToRs. The Rack is created, updated or deleted as part of the Cluster lifecycle management.

### Storage appliance

Storage Appliances represent storage arrays used for persistent data storage in the Operator Nexus instance. All user and consumer data is stored in these appliances local to your premises. This local storage complies with some of the most stringent local data storage requirements.

### Bare Metal Machine

Bare Metal Machines represent the physical servers in a rack. They're lifecycle managed by the Cluster Manager.
Bare Metal Machines are used by workloads to host Virtual Machines and AKS-Hybrid clusters.

## Workload components

Workload components are resources that you use in hosting your workloads.

### Network resources

The Network resources represent the virtual networking in support of your workloads hosted on  VMs or AKS-Hybrid clusters. 
There are five Network resource types that represent a network attachment to an underlying isolation-domain. 

- **Cloud Services Network Resource**: provides VMs/AKS-Hybrid clusters access to cloud services such as DNS, NTP, and user-specified Azure PaaS services. You must create at least one Cloud Services Network (CSN) in each of your Operator Nexus instances. Each CSN can be reused by many VMs and/or AKS-Hybrid clusters.

- **Default CNI Network Resource**: supports configuring of the AKS-Hybrid cluster network resources.

- **Layer 2 Network Resource**: enables "East-West" communication between VMs or AKS-Hybrid clusters.

- **Layer 3 Network Resource**: facilitate "North-South" communication between your VMs/AKS-Hybrid clusters and the external network.

- **Trunked Network Resource**: provides a VM or an AKS-Hybrid cluster access to multiple layer 3 networks and/or multiple layer 2 networks.

### Virtual machine

You can use VMs to host your Virtualized Network Function (VNF) workloads.

### AKS-hybrid cluster

An AKS-Hybrid cluster is Azure Kubernetes Service cluster modified to run on your on-premises Operator Nexus instance. The AKS-Hybrid cluster is designed to host your Containerized Network Function (CNF) workloads.