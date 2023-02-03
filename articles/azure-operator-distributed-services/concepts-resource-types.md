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

## Platform components

Your AODS instance platform components include the infrastructure resources and the platform software resources used to manage these infrastructure resources.

### Network Fabric Controller

The Network Fabric Controller (NFC) resource is created in the Resource Group specified by you in your Azure subscription. It automates the life cycle management of all network devices deployed in an AODS instance. NFC is hosted in a Microsoft Azure Virtual Network in an Azure region. The region should be connected to your on-premises network via Microsoft Azure ExpressRoute. An NFC can manage multiple AODS instances. And, you can create many Network Fabric Controllers in your subscription. (See limits)

### Network Fabric

Each AODS instance has one Network Fabric. The Network Fabric resource models a physical network fabric. The network fabric is a collection of network devices,  compute servers, and storage appliances, and their interconnections. The Network Fabric Controller (NFC) performs the lifecycle management of the network fabric. The NFC
configures and bootstraps to bring up the network fabric. The network fabric activities also include the networking required for your Network Functions (or tenant workloads).

### Network Manifest

Your intentions for the hardware in a rack are represented in the network manifest resource. The Network Fabric Controller is responsible for the network manifest lifecycle.

### Cluster Manager

A Cluster Manager (CM) is hosted on Azure and manages the lifecycle of all on-premises clusters. Like NFC, a CM can manage multiple AODS instances. For a given AODS instance, the CM and the NFC are hosted in the same Azure VNet.

### Azure Operator Distributed Services Cluster

An AODS cluster models a collection of racks, bare metal machines, and storage appliance. Each AODS cluster is mapped to one Network Fabric. An AODS cluster provides a holistic view of the deployed capacity. AODS cluster capacity examples include the number of CPU cores, the amount of memory, and the amount of storage space. An AODS cluster is also the basic unit for compute and storage upgrades.

### Rack SKU

The Rack SKU resource describes the AODS compute-related hardware on a rack. The SKU supports both aggregator and compute racks. The Rack SKU resource is read-only, and the APIs are subscription based, not resource group based.

### Rack

The Rack resource represents a physical rack. It's created, updated or deleted as part of the Cluster lifecycle management.

### Storage Appliance

Storage Appliances represent storage arrays in the on-premises data centers. There are no user-facing scenarios for configuring storage appliances, however administrative access to configure the storage appliance is necessary. The appliance will be opaquely represented behind predefined storage classes.

### Bare Metal Machine

Bare Metal Machines represent the physical machines in a rack. They're the building block of a Cluster, supporting the bare metal Kubernetes cluster. They're not created, updated or deleted directly. Instead, they're part of the Cluster lifecycle management. For example, they're onboarded when a Cluster is created.

## Tenant components

Tenant components are resources that you use in running and managing your workloads.

### Network resources

The Network resources tie network fabric with your (tenant) VMs or AKS-Hybrid clusters.
Your AKS-Hybrid cluster or VM can use many network resources, where each network resource represents a network attachment to an underlying isolation domain. There are five Network resource types.

- **Cloud Services Network Resource**: this network resource provides VMs/AKS-Hybrid clusters access to cloud services such as DNS, NTP, and user-specified Azure PaaS services. You must create at least one Cloud Services Network in each of your AODS instances. Each Cloud Service Network can be reused by many VMs and/or AKS-Hybrid clusters.

- **Default CNI Network Resource**: this network resource provides the Container Network Interface support for the AKS--Hybrid clusters.

- **Layer 2 Network Resource**: this network resource provides access to a layer 2 network. You can configure a layer 2 network for "East-West" communication between VMs or AKS-Hybrid clusters.

- **Layer 3 Network Resource**: this network resource provides access to a layer 3 network. You can configure a layer 3 network to facilitate "North-South" communication between your VMs/AKS-Hybrid clusters and the external network. You can configure another layer 3 network for communication between VMs/AKS-Hybrid clusters in different layer 2 networks.

- **Trunked Network Resource**: this network resource provides a VM or an AKS-Hybrid cluster access to multiple layer 3 networks and/or multiple layer 2 networks.

### Virtual Machine

You create and manage Virtual Machines (VM) resources. You can use VMs to host your Virtualized Network Function (VNF) workloads.

### AKS-Hybrid cluster

An AKS-Hybrid cluster is Azure Kubernetes Service cluster modified to run on your on-premises AODS instance. The AKS-Hybrid cluster is designed to host your Containerized Network Function (CNF) workloads.
