---
title: Introduction to Azure Operator Nexus 
description: Get high-level information about the Azure Operator Nexus product.
author: scottsteinbrueck
ms.author: ssteinbrueck
ms.date: 02/26/2023
ms.topic: overview
ms.service: azure-operator-nexus
---

# What is Azure Operator Nexus?

Azure Operator Nexus is a carrier-grade, next-generation hybrid cloud platform for telecommunication operators. Azure Operator Nexus is purpose-built for operators' network-intensive workloads and mission-critical applications.

Azure Operator Nexus supports a wide variety of virtualized and containerized network functions from both Microsoft and partners. The platform automates the lifecycle management (LCM) of the infrastructure, including network fabric, bare-metal hosts, and storage appliances. It also automates the LCM of tenant workloads for containerized network functions (CNFs) and virtualized network functions (VNFs).

Azure Operator Nexus meets operators' security, resiliency, observability, and performance requirements to achieve meaningful business results. The platform seamlessly integrates compute, network, and storage.

The platform is self-service. Operators use the Azure portal, the Azure CLI, SDKs, and other tools to interact with it.

:::image type="content" source="media/hl-architecture.png" alt-text="Diagram that shows an overview of Azure Operator Nexus.":::

## Key benefits

Azure Operator Nexus includes the following benefits for operating secure carrier-grade network functions at scale:

* **Reduced operational complexity and costs**: Operators can manage their Azure Operator Nexus infrastructure and tenants from Azure. They can build automation to streamline deployment, which helps them decrease time to market and innovate to provide value-add services to their customers.
* **Integrated platform for compute, network, and storage**: Operators no longer need to provision compute, network, and storage separately. Azure Operator Nexus provides an end-to-end platform from the infrastructure to the tenant for applications. For example, the networks associated with the compute infrastructure can be provisioned automatically across the compute and network infrastructure without requiring more teams.
* **Expanding network function (NF) ecosystem**: Azure Operator Nexus supports Microsoft and partner NFs via the Azure Operator Nexus Ready program. These NFs are tested for deployment and LCM on Azure Operator Nexus before they become available in Azure Marketplace.
* **Access to key Azure services**: Because Azure Operator Nexus is connected to Azure, operators can access most Azure services through the same connection as the on-premises network. Operators can monitor logs and metrics via Azure Monitor. They can analyze telemetry data by using Log Analytics or the Azure Machine Learning framework.
* **Unified governance and compliance**: Azure Operator Nexus extends Azure management and services to operators' premises. Operators can unify data governance and enforce security and compliance policies by using [Azure role-based access control](../role-based-access-control/overview.md) and [Azure Policy](../governance/policy/overview.md).

## How Azure Operator Nexus works

Azure Operator Nexus uses a curated and certified hardware bill of materials (BOM). It consists of commercially available off-the-shelf (COTS) servers, network switches, and storage arrays. The infrastructure is deployed in an operator's on-premises datacenter. Operators or system integrators must make sure that they [meet the prerequisites and follow the guidance](./howto-azure-operator-nexus-prerequisites.md).

The service that manages the Azure Operator Nexus infrastructure is hosted in Azure. Operators can choose an Azure region that supports Azure Operator Nexus for any on-premises instance of the service. The following diagram illustrates the architecture of the Azure Operator Nexus service.

:::image type="content" source="media/architecture-overview.png" alt-text="Diagram that shows how Azure Operator Nexus works.":::

Here are important points about the architecture:

* The management layer of Azure Operator Nexus is built on Azure Resource Manager to provide a consistent user experience in the Azure portal and Azure APIs.
* Azure resource providers provide modeling and LCM of [Azure Operator Nexus resources](./concepts-resource-types.md) such as bare-metal machines, clusters, and network devices.
* Azure Operator Nexus controllers include a cluster manager and a network fabric controller, which are deployed in a managed virtual network that's connected to an operator's on-premises network. These controllers enable functionalities such as infrastructure bootstrapping, configurations, and service upgrades.
* Azure Operator Nexus is integrated with many Azure services, such as Azure Monitor, Azure Container Registry, and Azure Kubernetes Service (AKS).
* Azure ExpressRoute is a network connectivity service that bridges Azure regions and operators' locations.

## Key features

Here are some key features of Azure Operator Nexus.

### CBL-Mariner

Azure Operator Nexus runs Microsoft's own Linux distribution called [CBL-Mariner](https://microsoft.github.io/CBL-Mariner/docs/) on the bare-metal hosts in the operator's facilities. The same Linux distribution supports Azure cloud infrastructure and edge services. It includes a small set of core packages by default.

CBL-Mariner is a lightweight operating system. It consumes limited system resources and is engineered to be efficient. For example, it has a fast startup time with a small footprint and locked-down packages to reduce the threat landscape.

When Microsoft identifies a security vulnerability, it makes the latest security patches and fixes available with the goal of fast turnaround time. Running the infrastructure on Linux aligns with NF needs, telecommunication industry trends, and relevant open-source communications.

### Bare metal and cluster management

Azure Operator Nexus includes capabilities to manage the bare-metal hosts in operators' premises. Operators can provision the bare-metal hosts by using Azure Operator Nexus. They can interact to restart, shut down, or reimage, for example.

One important component of the service is the [cluster manager](./howto-cluster-manager.md). It provides the LCM of Kubernetes clusters that are made of the bare-metal hosts.  

### Network fabric automation

Azure Operator Nexus includes [network fabric automation](./howto-configure-network-fabric-controller.md), which enables operators to build, operate, and manage carrier-grade network fabrics.

The reliable and distributed cloud services model supports the operators' telco network functions. Operators can interact with Azure Operator Nexus to provision the network fabric via zero-touch provisioning (ZTP). They can also perform complex network implementations via a workflow-driven API model.

### Network packet broker

The network packet broker is an integral part of the network fabric in Azure Operator Nexus. The network packet broker enables scenarios like network performance monitoring and security intrusion detection.

Operators can monitor every packet in Azure Operator Nexus and replicate it. They can apply packet filters dynamically and send filtered packets to multiple destinations for more processing.

### Nexus Kubernetes

[Nexus Kubernetes](./concepts-nexus-kubernetes-cluster.md) is an Azure Operator Nexus version of AKS for on-premises use. It's optimized to automate the creation of containers to run tenant network function workloads.

A Nexus Kubernetes cluster is deployed on-premises. Operators handle the traditional operational management activities of create, read, update, and delete (CRUD) via Azure.

### NFVI capabilities

As a platform, Azure Operator Nexus is designed for telco network functions and optimized for carrier-grade performance and resiliency. It has built-in network functions virtualization infrastructure (NFVI) capabilities:

* **Compute**: NUMA-aligned virtual machines (VMs) with dedicated cores backed by huge pages for consistent performance. The dedicated cores are simultaneous multithreading (SMT) siblings. There's no impact from other workloads that run on the same hypervisor host.
* **Networking**: Single-root I/O virtualization (SR-IOV) and Data Plane Development Kit (DPDK) for low latency and high throughput. Highly available VFs to VMs with redundant physical paths provide links to all workloads. Operators use APIs to control access and trunk port consumption in both VNFs and CNFs.
* **Storage**: File system storage for CNFs backed by high-performance storage arrays.

### Azure Operator Service Manager

[Azure Operator Service Manager](../operator-service-manager/azure-operator-service-manager-overview.md) is a service that allows network equipment providers (NEPs) to publish their NFs in Azure Marketplace. Operators can deploy the NFs by using familiar Azure APIs.

Operator Service Manager provides a framework for NEPs and Microsoft to test and validate the basic functionality of the NFs. The validation includes lifecycle management of an NF on Azure Operator Nexus.

### Observability

Azure Operator Nexus automatically streams the metrics and logs from the operator's premises to Azure Monitor and the Log Analytics workspace of:

* Infrastructure (compute, network, and storage).
* Tenant infrastructure (for example, VNF VMs).

Log Analytics has rich analytical tools that operators can use for troubleshooting or correlating for operational insights. Operators can also use Azure Monitor to specify alerts.

## Next steps

* Learn more about Azure Operator Nexus [resource models](./concepts-resource-types.md).
* Review [Azure Operator Nexus deployment prerequisites and steps](./howto-azure-operator-nexus-prerequisites.md).
* Learn [how to deploy a Nexus Kubernetes cluster](./quickstarts-kubernetes-cluster-deployment-bicep.md).
