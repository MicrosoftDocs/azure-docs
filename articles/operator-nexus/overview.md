---
title: Introduction to Operator Nexus 
description: High level information about the Operator Nexus product.
author: scottsteinbrueck
ms.author: ssteinbrueck
ms.date: 02/26/2023
ms.topic: overview
ms.service: azure-operator-nexus
---

# What is Azure Operator Nexus?

Azure Operator Nexus is a carrier-grade, next-generation hybrid cloud platform for telecommunication operators.
Operator Nexus is purpose-built for operators' network-intensive workloads and mission-critical applications.
Operator Nexus supports both Microsoft and a wide variety of partner virtualized and containerized network functions.
The platform automates lifecycle management of the infrastructure, including: network fabric, bare metal hosts, and storage appliances, as well as tenant workloads for Container Network Functions and Virtualized Network Functions.
Operator Nexus meets operators' security, resiliency, observability, and performance requirements to achieve meaningful business results.
The platform seamlessly integrates compute, network, and storage.
Operator Nexus is self service and uses the Azure portal, CLI, SDKs, and other tools to interact with the platform. 

:::image type="content" source="media/hl-architecture.png" alt-text="Figure of Operator Nexus overview.":::

Figure: Operator Nexus Overview

## Key benefits

Operator Nexus includes the following benefits for operating secure carrier-grade network functions at scale:

* **Reduced operational complexity and costs** – Operators have the ability to manage their Operator Nexus infrastructure and tenants from Azure. Automation can be built to streamline deployment, allowing for operators to have faster time to market and innovate to provide value add services to their customers. 
* **Integrated platform for compute, network, and storage** – Operators no longer need to provision compute, network, and storage separately as Operator Nexus provides an end-to-end (E2E) platform from the infrastructure to the tenant for applications.
For example, the networks associated to the compute infrastructure can automatically be provisioned across the compute and network infrastructure without requiring additional teams. 
* **Expanding Network Function (NF) ecosystem** – Operator Nexus supports a wide variety of Microsoft's own NFs and partners NFs via the Operator Nexus Ready program. 
These NFs are tested for deployment and lifecycle management on Operator Nexus before they're made available in Azure Marketplace.
* **Access to key Azure services** – Operator Nexus being connected to Azure, operators can seamlessly access most Azure services through the same connection as the on-premises network.
Operators can monitor logs and metrics via Azure Monitor, and analyze telemetry data using Log Analytics or Azure AI/Machine Learning framework.
* **Unified governance and compliance** – Operator Nexus extends Azure management and services to operator's premises.
Operators can unify data governance and enforce security and compliance policies by [Azure Role based Access Control](../role-based-access-control/overview.md) and [Azure Policy](../governance/policy/overview.md).

## How Operator Nexus works

Operator Nexus utilizes a curated and certified hardware Bill of Materials (BOM). It is composed of commercially available off-the-shelf servers, network switches, and storage arrays. The infrastructure is deployed in operator's on-premises data center. Operators or System Integrators must make sure they [meet the prerequisites and follow the guidance](./howto-azure-operator-nexus-prerequisites.md). 

The service that manages the Operator Nexus infrastructure is hosted in Azure. Operators can choose an Azure region that supports Operator Nexus for any on-premises Operator Nexus instance.  The diagram illustrates the architecture of the Operator Nexus service.

:::image type="content" source="media/architecture-overview.png" alt-text="Screenshot of how Operator Nexus works.":::

Figure: How Operator Nexus works

1. The management layer of Operator Nexus is built on Azure Resource Manager (ARM), that provides consistent user experience in the Azure portal and Azure APIs
2. Azure Resource Providers provide modeling and lifecycle management of [Operator Nexus resources](./concepts-resource-types.md) such as bare metal machines, clusters, network devices, etc.
3. Operator Nexus controllers: Cluster Manager and Network Fabric Controller, are deployed in a managed Virtual Network (VNet) connected to operator's on-premises network. The controllers enable functionalities such as infrastructure bootstrapping, configurations, service upgrades etc.
4. Operator Nexus is integrated with many Azure services such as Azure Monitor, Azure Container Registry, and Azure Kubernetes Services.
6. ExpressRoute is a network connectivity service that bridges Azure regions and operators' locations.

## Key features

Here are some of the key features of Operator Nexus.

### CBL-Mariner

Operator Nexus runs Microsoft's own Linux distribution "CBL-Mariner" on the bare metal hosts in the operator's facilities.
The same Linux distribution supports Azure cloud infrastructure and edge services.
It includes a small set of core packages by default. 
[CBL-Mariner](https://microsoft.github.io/CBL-Mariner/docs/) is a lightweight OS and consumes limited system resources and is engineered to be efficient.
For example, it has a fast boot time with a small footprint with locked-down packages, resulting in the reduction of the threat landscape.
On identifying a security vulnerability, Microsoft makes the latest security patches and fixes available with the goal of fast turn-around time. Running the infrastructure on Linux aligns with Network Function needs, telecommunication industry trends, and relevant open-source communications. Operator Nexus supports both virtualized network functions (VNFs) and containerized network functions (CNFs).

### Bare metal and cluster management

Operator Nexus includes capabilities to manage the bare metal hosts in operators' premises.
Operators can provision the bare metal hosts using Operator Nexus and can interact to restart, shutdown, or re-image, for example. 
One important component of the service is Cluster Manager.
[Cluster Manager](./howto-cluster-manager.md) provides the lifecycle management of Kubernetes clusters that are made of the bare metal hosts.  

### Network Fabric Automation

Operator Nexus includes [Network Fabric Automation (NFA)](./howto-configure-network-fabric-controller.md) which enables operators to build, operate and manage carrier grade network fabrics. The reliable and distributed cloud services model supports the operators' telco network functions. Operators have the ability to interact with Operator Nexus to provision the network fabric via Zero-Touch Provisioning (ZTP), and perform complex network implementations via a workflow driven, API model. 

### Network Packet Broker

Network Packet Broker (NPB) is an integral part of the network fabric in Operator Nexus. NPB enables multiple scenarios from network performance monitoring to security intrusion detection. Operators can monitor every single packet in Operator Nexus and replicate it. They can apply packet filters dynamically and send filtered packets to multiple destinations for further processing.

### Nexus Kubernetes

Nexus Kubernetes is an Operator Nexus version of Azure Kubernetes Service (AKS) for on-premises use. It's optimized to automate creation of containers to run tenant network function workloads. A Nexus Kubernetes cluster is deployed on-premises and the traditional operational management activities (CRUD) are managed via Azure. See [Nexus Kubernetes](./concepts-nexus-kubernetes-cluster.md) to learn more.

### Network functions virtualization infrastructure capabilities

As a platform, Operator Nexus is designed for telco network functions and optimized for carrier-grade performance and resiliency. It has many built-in Network Functions Virtualization Infrastructure (NFVI) capabilities:

* Compute: NUMA aligned VMs with dedicated cores (both SMT siblings), backed by huge pages ensures consistent performance. There's no impact from other workloads running on the same hypervisor host.
* Networking: SR-IOV & DPDK for low latency and high throughput. Highly available VFs to VMs with redundant physical paths provide links to all workloads. APIs are used to control access and trunk port consumption in both VNFs and CNFs.
* Storage: Filesystem storage for CNFs backed by high performance storage arrays

### Azure Operator Service Manager

Azure Operator Service Manager is a service that allows Network Equipment Providers (NEP) to publish their NFs in Azure Marketplace. Operators can deploy them using familiar Azure APIs. Operator Service Manager provides a framework for NEPs and Microsoft to test and validate the basic functionality of the NFs. The validation includes lifecycle management of an NF on Operator Nexus.

### Observability

Operator Nexus automatically streams the metrics and logs from the operator's premises to Azure Monitor and Log Analytics workspace of:

* Infrastructure (compute, network and storage)
* Tenant Infrastructure (ex. VNF VMs).

Log Analytics has a rich analytical tool-set that operators can use for troubleshooting or correlating for operational insights. And, Azure Monitor lets operators specify alerts.

## Next steps

* Learn more about Operator Nexus [resource models](./concepts-resource-types.md)
* Review [Operator Nexus deployment prerequisites and steps](./howto-azure-operator-nexus-prerequisites.md)
* Learn [how to deploy a Nexus Kubernetes cluster](./quickstarts-kubernetes-cluster-deployment-bicep.md)