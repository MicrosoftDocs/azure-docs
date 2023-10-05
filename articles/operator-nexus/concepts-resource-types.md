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

:::image type="content" source="media/resource-types.png" alt-text="Screenshot of Resource Types.":::

Figure: Resource model

## Platform components

The Operator Nexus Cluster (or Instance) platform components include the infrastructure and the platform components used to manage these infrastructure resources.

### Network Fabric Controller

Network Fabric Controller (NFC) is an Operator Nexus resource that runs in your subscription in your desired resource group and [Virtual Network](../virtual-network/virtual-networks-overview.md). The Network Fabric Controller acts as a bridge between the Azure control plane and your on-premises infrastructure to manage the lifecycle and configuration of the Network Devices in a Network Fabric instance.

The Network Fabric Controller achieves this by establishing a private connectivity channel between your Azure environment and on-premises using [Azure ExpressRoute](../expressroute/expressroute-introduction.md) and other supporting resources which are deployed in a managed resource group. The NFC is typically the first resource that you would create to establish this connectivity to bootstrap and configure your management and workload networks.

The Network Fabric Controller enables you to manage all the Network resources within your Operator Nexus instance like Network Fabric, Network Racks, Network Devices, Isolation Domains, Route Policies, etc.

You can manage the lifecycle of a Network Fabric Controller via Azure using any of the supported interfaces - Azure CLI, REST API, etc. See [how to create a Network Fabric Controller](./howto-configure-network-fabric-controller.md) to learn more.

### Network Fabric

Network Fabric (NF) resource is a representation of your on-premises network topology in Azure. Every Network Fabric must be associated with and controlled by a Network Fabric Controller that is deployed in the same Azure region. You can associate multiple Network Fabric resources per Network Fabric Controller, see [Nexus Limits and Quotas](./reference-limits-and-quotas.md). A single deployment of the infrastructure is considered a Network Fabric instance.

Operator Nexus allows you to create Network Fabrics based on specific SKU types, where each SKU represents the number of network racks and compute servers in each rack deployed on-premises.

Each Network Fabric resource can contain a collection of network racks, network devices, and isolation domains for their interconnections. Once a Network Fabric is created and you've validated that your network devices are connected, then it can be Provisioned. Provisioning a Network Fabric is the process of bootstrapping the Network Fabric instance to get the management network up.

You can manage the lifecycle of a Network Fabric via Azure using any of the supported interfaces - Azure CLI, REST API, etc. See [how to create and provision a Network Fabric](./howto-configure-network-fabric.md) to learn more.

### Network racks

Network Rack resource is a representation of your on-premises racks from the networking perspective. The number of network racks in an Operator Nexus instance depends on the Network Fabric SKU that was chosen during creation. 

Each network rack consists of Network Devices that are part of that rack. For example - Customer Edge (CE) routers, Top of Rack (ToR) Switches, Management Switches, and Network Packet Brokers (NPB).

The Network Rack also models the connectivity to the operator's Physical Edge switches (PEs) and the ToRs on the other racks via Network to Network Interconnect (NNI) resource.

The lifecycle of Network Rack resources is tied to the Network Fabric resource. The Network Racks are automatically created when you create the Network Fabric and the number of racks depends on the SKU that was chosen. When the Network Fabric resource is deleted, all the associated Network Racks are also deleted along with it.

### Network devices

Network Devices represent the Customer Edge (CE) routers, Top of Rack (ToR) Switches, Management Switches, and Network Packet Brokers (NPB) which are deployed as part of the Network Fabric instance. Each Network Device resource is associated with a specific Network Rack where it is deployed.

Each network device resource has a SKU, Role, Host Name, and Serial Number as properties, and can have multiple network interfaces associated. Network Interfaces contain the IPv4 and IPv6 addresses, physical identifier, interface type, and the associated connections. Network Interfaces also have the `administrativeState` property that indicates whether the interface is enabled or disabled.

The lifecycle of the Network Interface depends on the Network Device and can exist as long as the parent network device resource exists. However, you can perform certain operations on a network interface resource like enable/disable the `administrativeState` via Azure using any of the supported interfaces - Azure CLI, REST API, etc.

The lifecycle of the Network Device resources depends on the network rack resource and will exist as long as the parent Network Fabric resource exists. However, before provisioning the Network Fabric, you can perform certain operations on a network device like setting a custom hostname and updating the serial number of the device via Azure using any of the supported interfaces - Azure CLI, REST API, etc.

### Isolation domains

Isolation Domains enable east-west or north-south connectivity across Operator Nexus instance. They provide the required network connectivity between infrastructure components and also workload components. In principle, there are two types of networks that are established by isolation domains - management network and workload or tenant network. 

A management network provides private connectivity that enables communication between the Network Fabric instance that is deployed on-premises and Azure Virtual Network. You can create workload or tenant networks to enable communication between the workloads that are deployed across the Operator Nexus instance.

Each isolation domain is associated with a specific Network Fabric resource and has the option to be enabled/disabled. Only when an isolation domain is enabled, it's configured on the network devices, and the configuration is removed once the isolation domain is removed.

Primarily, there are two types of isolation domains:

* Layer 2 or L2 Isolation Domains
* Layer 3 or L3 Isolation Domains

Layer 2 isolation domains enable your infrastructure and workloads communicate with each other within or across racks over a Layer 2 network. Layer 2 networks enable east-west communication within your Operator Nexus instance. You can configure an L2 isolation domain with a desired Vlan ID and MTU size, see [Nexus Limits and Quotas](./reference-limits-and-quotas.md) for MTU limits.

Layer 3 isolation domains enable your infrastructure and workloads communicate with each other within or across racks over a Layer 3 network. Layer 3 networks enable east-west and north-south communication within and outside your Operator Nexus instance.

There are two types of Layer 3 networks that you can create:

* Internal Network
* External Network

Internal networks enable layer 3 east-west connectivity across racks within the Operator Nexus instance and external networks enable layer 3 north-south connectivity from the Operator Nexus instance to networks outside the instance. A Layer 3 isolation domain must be configured with at least one internal network; external networks are optional.

### Cluster manager

The Cluster Manager (CM) is hosted on Azure and manages the lifecycle of all on-premises infrastructure (also referred to as infra clusters).
Like NFC, a CM can manage multiple Operator Nexus instances.
The CM and the NFC are hosted in the same Azure subscription.

### Infrastructure Cluster

The Infrastructure Cluster (or Compute Cluster or infra cluster) resource models a collection of racks, bare metal machines, storage, and networking.
Each infra cluster is mapped to the on-premises Network Fabric. The cluster provides a holistic view of the deployed compute capacity.
Infra cluster capacity examples include the number of vCPUs, the amount of memory, and the amount of storage space. A cluster is also the basic unit for compute and storage upgrades.

### Rack

The Rack (or a compute rack) resource represents the compute servers (Bare Metal Machines), management servers, management switches, and ToRs. The Rack is created, updated, or deleted as part of the infra cluster lifecycle management.

### Storage appliance

Storage Appliances represent storage arrays used for persistent data storage in the Operator Nexus instance. All user and consumer data is stored in these local on-premises appliances. This local storage complies with some of the most stringent local data storage requirements.

### Bare Metal Machine

Bare Metal Machines represent the physical servers in a rack. They are lifecycle managed by the Cluster Manager.
Bare Metal Machines are used by workloads to host Virtual Machines and Kubernetes clusters.

## Workload components

Workload components are resources that you use in hosting your workloads.

### Network resources

The Network resources represent the virtual networking in support of your workloads hosted on VMs or Kubernetes clusters. 
There are five Network resource types that represent a network attachment to an underlying isolation-domain. 

- **Cloud Services Network Resource**: provides VMs/Kubernetes clusters access to cloud services such as DNS, NTP, and user-specified Azure PaaS services. You must create at least one Cloud Services Network (CSN) in each of your Operator Nexus instances. Each CSN can be reused by many VMs and/or tenant clusters.

- **Layer 2 Network Resource**: enables "East-West" communication between VMs or tenant clusters.

- **Layer 3 Network Resource**: facilitate "North-South" communication between your VMs/tenant clusters and the external network.

- **Trunked Network Resource**: provides a VM or a tenant cluster access to multiple layer 3 networks and/or multiple layer 2 networks.

### Virtual machine

You can use VMs to host your Virtualized Network Function (VNF) workloads.

### Nexus Kubernetes cluster

Nexus Kubernetes cluster is a Kubernetes cluster modified to run on your on-premises Operator Nexus instance. The Nexus Kubernetes cluster is designed to host your Containerized Network Function (CNF) workloads.
