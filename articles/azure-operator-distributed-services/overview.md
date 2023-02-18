---
title: Introduction to Operator Nexus 
description: High level information about the Operator Nexus product.
author: scottsteinbrueck
ms.author: ssteinbrueck
ms.date: 01/30/2023
ms.topic: overview
ms.service: azure
---

# What is Azure Operator Nexus?

Azure Operator Nexus is the next-generation hybrid cloud platform for telecommunication operators.
Operator Nexus is purpose-built for operators' network-intensive workloads and mission-critical applications.
Operator Nexus supports both our first-party and a wide variety of third party virtualized or containerized telco network functions.
The platform automates life cycle management of network fabric, bare metal hosts, storage appliances, and both infrastructure and tenant Kubernetes clusters.
Operator Nexus meets operators' security, resiliency, observability and performance requirements to achieve meaningful business results.
The platform seamlessly integrates compute, network, and storage.
The user can operate and deploy the platform end-to-end via Azure portal, CLI, or APIs.

<!--- IMG ![Operator Nexus Overview diagram](Docs/media/architecture-overview.png) IMG --->
:::image type="content" source="media/architecture-overview.png" alt-text="Operator Nexus Overview diagram":::
Figure: Operator Nexus Overview

## Key benefits

Operator Nexus includes the following benefits for operating secure carrier-grade network functions at scale:

* **Reduced operational complexity and costs** – Operators decide in which Azure regions to deploy Operator Nexus.
One set of Operator Nexus controllers can scale automatically to support multiple instances of on-premises Operator Nexus deployment.
Operators can use the same APIs or automation to operationalize their on-premises services and their cloud native services.
* **Integrated platform for compute, network, and storage** – Operators no longer need to provision compute, network, and storage separately as Operator Nexus integrates the stacks.
For example, the elastic network fabric is designed to let compute and storage scale up or down.
The solution simplifies operators' capacity planning and deployment.
* **Expanding Network Function (NF) ecosystem** – Operator Nexus supports a wide variety of Microsoft's own NFs and third-party partners' NFs via an NF certification program.
These NFs are tested for deployment and lifecycle management on Operator Nexus before they're made available in Azure Marketplace.
* **Access to key Azure services** – Operator Nexus being connected to Azure, operators can seamlessly access most Azure services through the same connection as the on-premises network.
For example, you can provision and manage Operator Nexus through Azure portal or Azure CLI.
Operators can monitor logs and metrics via Azure Monitor, and analyze telemetry data using Log Analytics or Azure AI/Machine Learning framework.
* **Unified governance and compliance** – As an Azure service, Operator Nexus extends Azure management and services to operator's premises.
Operators can unify data governance and enforce security and compliance policies by [Azure Role based Access Control](/azure/role-based-access-control/overview) and [Azure Policy](/azure/governance/policy/overview).

## How Operator Nexus works

Operator Nexus requires curated hardware Bill of Materials. It is comprised of commercially available off-the-shelf servers, network switches, and storage arrays. The infrastructure is deployed in operator's on-premises data center. Operators or System Integrators must make sure they [meet the prerequisites and follow the guidance](quickstarts-platform-deployment.md). 

The service that manages the Operator Nexus infrastructure is hosted in Azure. Operators can choose an Azure region that supports Operator Nexus for any on-premises Operator Nexus infrastructure or deployment.  The diagram illustrates the architecture of the Operator Nexus service.

<!--- IMG ![How Operator Nexus works diagram](Docs/media/architecture-overview.png) IMG --->
:::image type="content" source="media/architecture-overview.png" alt-text="How Operator Nexus works diagram":::
Figure: How Operator Nexus works

1. The management layer of Operator Nexus is built on Azure Resource Manager (ARM), that provides consistent user experience in Azure portal and API.
2. Azure Resource Providers provide modeling and lifecycle management of [Operator Nexus resources](./concepts-resource-types.md) such as bare metal machines, clusters, network devices, etc.
3. Operator Nexus controllers, that is, Cluster Manager and Network Fabric Controller, are deployed in a managed Virtual Network (vNET) connected to operator's on-premises network. The controllers enable functionalities such as infrastructure bootstrapping, configurations, service upgrades etc.
4. Operator Nexus is integrated with many Azure services such as Azure Monitor, Azure Container Registries, and Azure Kubernetes Services.
5. Azure Arc enables a seamless integration of Azure cloud services and on-premises environments, translating between the ARM models and the Kubernetes resource definitions.
6. ExpressRoute is a network connectivity service that bridges Azure regions and operators' locations.

## Key features

Here are some of the key features of Operator Nexus.

### CBL-Mariner

Operator Nexus runs Microsoft's own Linux distribution "CBL-Mariner" on the bare metal hosts in the operator's facilities.
The same Linux distribution supports Azure cloud infrastructure and edge services.
It includes a small set of core packages by default, whereas each service running on top of it can install more packages.
[CBL-Mariner](https://microsoft.github.io/CBL-Mariner/docs/) is a lightweight OS and consumes limited system resources. It's engineered to be efficient.
For example, it has a fast boot time. Small footprints with locked-down packages also mean minimal attack surface.
On identifying a security vulnerability, the CBL-Mariner team makes the latest security patches and fixes available with the goal of fast turn-around time. Running the infrastructure on Linux aligns with Network Function needs, telecommunication industry trends, and relevant open-source communications. Operator Nexus supports both virtualized network functions (VNFs) and containerized network functions (CNFs).

### Bare metal and cluster management

Operator Nexus includes a service that manages the bare metal hosts in operators' premises.
Operators can provision the bare metal hosts using Azure APIs for tasks such as "restart a host" or "reimage a host".
One important component of the service is Cluster Manager.
[Cluster Manager](./howto-cluster-manager.md) provides the lifecycle management of Kubernetes clusters that are made of the bare metal hosts.  

### Network fabric automation

Operator Nexus goes beyond compute and includes Network Fabric Automation (NFA). The [NFA](./howto-configure-networkfabric.md) service enables operators to build, operate and manage carrier grade network fabric. The reliable and distributed cloud services model supports the operators' telco network functions. For example, to bootstrap network devices in Operator Nexus, operators just need to call an Azure API to trigger the Zero Touch Provisioning (ZTP) process. ZTP downloads the configuration templates from a terminal server, which is built in Operator Nexus design, to all the network devices and provisions them to the initial known state.

### Network packet broker

Network Packet Broker (NPB) is an integral part of the network fabric in Operator Nexus. NPB enables multiple scenarios from network performance monitoring to security intrusion detection. Operators can monitor every single packet in Operator Nexus and replicate it. They can apply packet filters dynamically and send filtered packets to multiple destinations for further processing.

### Azure Hybrid Kubernetes Service

Azure Kubernetes Service (AKS) is a managed Kubernetes service on Azure. It lets users focus on developing and deploying their workloads while letting Azure handle the management and operational overheads. In [AKS-Hybrid](/azure/aks/hybrid/) the Kubernetes cluster is deployed on-premises. Azure still performs the traditional operational management activities such as updates, certificate rotations, etc.

### Network Functions Virtualization Infrastructure capabilities

As a platform, Operator Nexus is designed for telco network functions and optimized for carrier-grade performance and resiliency. It has many built-in Network Functions Virtualization Infrastructure (NFVI) capabilities:

* Compute: NUMA aligned VMs with dedicated cores (both SMT siblings), backed by huge pages ensures consistent performance. There's no impact from other workloads running on the same hypervisor host.
* Networking: SR-IOV & DPDK for low latency and high throughput. Highly available VFs to VMs with redundant physical paths provide links to all workloads. APIs are used to control access and trunk port consumption in both VNFs and CNFs.
* Storage: Filesystem storage for CNFs backed by high performance storage arrays

### Network function management

Azure Network Function Manager (ANFM) is a service that allows Network Equipment Providers (NEP) to publish their NFs in Azure Marketplace. Operators can deploy them using familiar Azure APIs. ANFM provides a framework for NEPs and Microsoft to test and validate the basic functionality of the NFs. The validation includes lifecycle management of an NF on Operator Nexus.

### Observability

After bootstrap, Operator Nexus automatically streams the metrics and logs from the operator's premises to Azure Monitor and Log Analytics workspace of:

* the infrastructure stack (compute, network and storage), and
* the workload stacks (for example, AKS-Hybrid).

Log Analytics has a rich analytical tool-set that operators can use for troubleshooting or correlating for operational insights. And, Azure Monitor lets operators specify alerts.

## Next steps

* Learn more about Operator Nexus [resource models](./concepts-resource-types.md)
* Review [Operator Nexus deployment prerequisites and steps](./quickstarts-platform-prerequisites.md)
