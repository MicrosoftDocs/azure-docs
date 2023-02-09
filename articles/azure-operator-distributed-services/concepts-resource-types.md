---
title: Azure Operator Distributed Services resource types
description: Azure Operator Distributed Services platform and tenant resource types
author: jashobhit #Required; your GitHub user alias, with correct capitalization.
ms.author: shobhitjain #Required; microsoft alias of author; optional team alias.
ms.service: Azure Operator Distributed Services
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 01/25/2023 #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Azure Operator Distributed Services resource types

This article introduces you to the Azure Operator Distributed Services (AODS) components represented as Azure resources in Azure Resource Manager.

:::image type="content" source="media/resource-types.png" alt-text="Resource Types":::
Figure: Resource model

## Platform components

Your AODS Cluster (or simply instance) platform components include the infrastructure resources and the platform software resources used to manage these infrastructure resources.

### Network Fabric Controller

The Network Fabric Controller (NFC) is a resource that automates the life cycle management of all network devices (including storage appliance) deployed in an AODS instance.
The NFC resource is created in the Resource group specified by you in your Azure subscription.
NFC is hosted in a [Microsoft Azure Virtual Network](../virtual-network/virtual-networks-overview.md) in an Azure region.
The region should be connected to your on-premises network via [Microsoft Azure ExpressRoute](../expressroute/expressroute-introduction.md).
An NFC can manage the network fabric of up to 32 AODS instances.

### Network Fabric

The Network Fabric resource models a collection of network devices, compute servers, and storage appliances, and their interconnections. The network fabric resource also includes the networking required for your Network Functions and workloads. Each AODS instance has one Network Fabric.

The Network Fabric Controller (NFC) performs the lifecycle management of the network fabric.
It configures and bootstraps the network fabric resources. 

### Cluster Manager

A Cluster Manager (CM) is hosted on Azure and manages the lifecycle of all on-premises clusters. Like NFC, a CM can manage multiple AODS instances. For a given AODS instance, the CM and the NFC are hosted in the same Azure Virtual Network.

### Azure Operator Distributed Services Cluster

An AODS cluster models a collection of racks, bare metal machines, storage and workload networking. Each AODS cluster (sometimes also referred as AODS instance) is mapped to the on-premises Network Fabric. An AODS cluster provides a holistic view of the deployed capacity. AODS cluster capacity examples include the number of vCPUs, the amount of memory, and the amount of storage space. An AODS cluster is also the basic unit for compute and storage upgrades.

### Network Rack

The Network rack consists of Consumer Edge (CE) routers, Top of Rack switches (ToRs), storage appliance, Network Packet Broker (NPB), and the Terminal Server.
The rack also models the connectivity to the operator's Physical Edge switches (PEs) and the ToRs on the other racks.

### Rack

The Rack (or a compute rack) resource represents the compute servers (Bare Metal Machines), management servers, management switch and ToRs. The Rack is created, updated or deleted as part of the Cluster lifecycle management.

### Storage Appliance

Storage Appliances represent storage arrays used for persistent data storage in the AODS instance. All user and consumer data is stored in these appliances local to your premises. This local storage complies with some of the most stringent local data storage requirements.

### Bare Metal Machine

Bare Metal Machines represent the physical servers in a rack. They're lifecycle managed by the Cluster Manager.
Bare Metal Machines are used by workloads to host Virtual Machines and AKS-Hybrid clusters.

## Workload components

Workload components are resources that you use in hosting your workloads.

### Network resources

The Network resources represent the virtual networking in support of your workloads hosted on  VMs or AKS-Hybrid clusters. 
There are five Network resource types that represent a network attachment to an underlying isolation domain. 

- **Cloud Services Network Resource**: provides VMs/AKS-Hybrid clusters access to cloud services such as DNS, NTP, and user-specified Azure PaaS services. You must create at least one Cloud Services Network in each of your AODS instances. Each Cloud Service Network can be reused by many VMs and/or AKS-Hybrid clusters.

- **Default CNI Network Resource**: supports configuring of the AKS-Hybrid cluster network resources.

- **Layer 2 Network Resource**: enables "East-West" communication between VMs or AKS-Hybrid clusters.

- **Layer 3 Network Resource**: facilitate "North-South" communication between your VMs/AKS-Hybrid clusters and the external network.

- **Trunked Network Resource**: provides a VM or an AKS-Hybrid cluster access to multiple layer 3 networks and/or multiple layer 2 networks.

### Virtual Machine

You can use VMs to host your Virtualized Network Function (VNF) workloads.

### AKS-Hybrid cluster

An AKS-Hybrid cluster is Azure Kubernetes Service cluster modified to run on your on-premises AODS instance. The AKS-Hybrid cluster is designed to host your Containerized Network Function (CNF) workloads.
