---
Title: Introduction to Azure Operator Distributed Services (AODS)
Description: High level information about the Azure Operator Distributed Services (AODS) product.
Author: scottsteinbrueck
ms.author: ssteinbrueck
ms.date: 01/30/2023
ms.topic: overview
ms.service: Azure Operator Distributed Services
---

# What is Azure Operator Distributed Services?

Azure Operator Distributed Services (AODS) is the next-generation hybrid cloud platform for telecommunication operators.
AODS is purpose-built for operators' network-intensive workloads and mission-critical applications.
AODS supports both our first-party and a wide variety of third party virtualized or containerized telco network functions.
The platform automates life cycle management of:

* network fabric
* bare metal hosts
* storage appliances.

This automation applies to both infrastructure and tenant Kubernetes clusters.
AODS meets operators' security, resiliency, observability and performance requirements to achieve meaningful business results.
The platform seamlessly integrates compute, network, and storage.
The user can operate and deploy the platform end-to-end via Azure portal, CLI, or APIs.

:::image type="content" source="media/AODS-Platform-for Operator-Core-ORAN.png" alt-text="Azure Operator Distributed Services Overview diagram":::
Figure: Azure Operator Distributed Services Overview

## Key benefits

AODS includes the following benefits for operating secure carrier-grade network functions at scale:

* **Reduced operational complexity and costs** – Operators decide in which Azure regions to deploy AODS.
One set of AODS controllers can scale automatically to support multiple instances of on-premises AODS deployment.
Operators can use the same APIs or automation to operationalize their on-premises services and their cloud native services.
* **Integrated platform for compute, network, and storage** – Operators no longer need to provision compute, network, and storage separately as AODS integrates the stacks.
For example, the elastic network fabric is designed to let compute and storage scale up or down.
The solution simplifies operators' capacity planning and deployment.
* **Expanding Network Function (NF) ecosystem** – AODS supports a wide variety of Microsoft's own NFs and third-party partners' NFs via an NF certification program.
These NFs are tested for deployment and lifecycle management on AODS before they're made available in Azure Marketplace.
* **Access to key Azure services** – AODS being connected to Azure, operators can seamlessly access most Azure services through the same connection as the on-premises network.
For example, you can provision and manage AODS through Azure portal or Azure CLI.
Operators can monitor logs and metrics via Azure Monitor, and analyze telemetry data using Log Analytics or Azure AI/Machine Learning framework.
* **Unified governance and compliance** – As an Azure service, AODS extends Azure management and services to operator's premises.
Operators can unify data governance and enforce security and compliance policies by [Azure Role based Access Control](../role-based-access-control/overview) and [Azure Policy](../governance/policy/overview).

## How AODS works

AODS requires curated hardware Bill of Materials, comprised of commercially available off-the-shelf servers, network switches, and storage arrays. The infrastructure, deployed in operators' on-premises data center, is Linux-based, in alignment with Network Function needs, telecommunications industry trends, and relevant open-source communities. AODS supports both virtualized network functions (VNFs) and containerized network functions (CNFs).

The diagram below illustrates the AODS architecture. 

:::image type="content" source="media/architecture-overview.png" alt-text="How AODS works diagram":::
Figure: How AODS works
1. The management layer of AODS is built on Azure Resource Mananager (ARM), which provides consistent user experience in Azure Portal and API. 
2. A number of Azure Resource Providers provide modeling and lifecycle management of AODS resources such as bare metal machines, clusters, network fabrics, etc.
3. AODS controllers, i.e., Cluster Manager and Network Fabric Controller, are deployed in a managed VNet connected to operators' on-premises network. They enable functionalities such as infrastructure bootstrapping, configurations etc.
4. AODS is built on many other Azure services such as Azure Active Directory, Azure Monitor, Azure Keyvault, Azure Container Registries, Azure Kubernetes Services, etc.
5. Azure Arc enables a seamless integration of Azure cloud services and on-premises environments, translating between the ARM models and the Kubernetes resource definitions.
6. ExpressRoute is a network connectivity service that bridges Azure regions and operators' locations. 

## Key features

Here are some of the key features of AODS.

### CBL-Mariner

AODS runs Microsoft's own Linux distribution "CBL-Mariner" on the bare metal hosts in the operator's facilities.
The same Linux distribution supports Azure cloud infrastructure and edge services.
It includes a small set of core packages by default, whereas each service running on top of it can install more packages.
[CBL-Mariner](https://microsoft.github.io/CBL-Mariner/docs/) is a lightweight OS and consumes limited system resources. It's engineered to be efficient.
For example, it has a fast boot time. Small footprints with locked-down packages also mean minimal attack surface.
On identifying a security vulnerability, the CBL-Mariner team makes the latest security patches and fixes available with the goal of fast turn-around time.

### Bare metal and cluster management

AODS includes a service that manages the bare metal hosts in operators' premises.
Operators can provision the bare metal hosts using Azure APIs for tasks such as "restart a host" or "reimage a host".
One important component of the service is Cluster Manager.
[Cluster Manager](./howto-cluster-manager.md) provides the lifecycle management of Kubernetes clusters that are made of the bare metal hosts.  

### Network fabric automation

AODS goes beyond compute and includes Network Fabric Automation (NFA). The [NFA](./howto-configure-networkfabric.md) service enables operators to build, operate and manage carrier grade network fabric. The reliable and distributed cloud services model supports the operators' telco network functions. For example, to bootstrap network devices in AODS, operators just need to call an Azure API to trigger the Zero Touch Provisioning (ZTP) process. ZTP downloads the configuration templates from a terminal server, which is built in AODS design, to all the network devices and provisions them to the initial known state.

### Network packet broker

Network Packet Broker (NPB) is an integral part of the network fabric in AODS. NPB enables multiple scenarios from network performance monitoring to security intrusion detection. Operators can monitor every single packet in AODS and replicate it. They can apply packet filters dynamically and send filtered packets to multiple destinations for further processing.

### Azure Hybrid Kubernetes Service

Azure Kubernetes Service (AKS) is a managed Kubernetes service on Azure. It lets users focus on developing and deploying their own workloads while letting Azure handle the management and operational overheads. [AKS-Hybrid](https://learn.microsoft.com/en-us/azure/aks/hybrid/) is a new mode designed for AODS. While Azure still manages the core infrastructure of the cluster including the control plane, the cluster itself runs on an operator's facility.

### Network Functions Virtualization Infrastructure capabilities

As a platform, AODS is designed for telco network functions and optimized for carrier-grade performance and resiliency. It has many built-in Network Functions Virtualization Infrastructure (NFVI) capabilities:

* Compute: NUMA aligned VMs with dedicated cores (both SMT siblings), backed by huge pages ensures consistent performance. There's no impact from other workloads running on the same hypervisor host.
* Networking: SR-IOV & DPDK for low latency and high throughput. Highly available VFs to VMs with redundant physical paths provide links to all workloads. APIs are used to control access and trunk port consumption in both VNFs and CNFs.
* Storage: Filesystem storage for CNFs backed by high performance storage arrays

### Network function management

Azure Network Function Manager (ANFM) is a service that allows Network Equipment Providers (NEP) to publish their NFs in Azure Marketplace. Operators can deploy them using familiar Azure APIs. ANFM provides a framework for NEPs and Microsoft to test and validate the basic functionality of the NFs. The validation includes lifecycle management of an NF on AODS.

### Observability

After bootstrap, AODS automatically streams the metrics and logs from the operator's premises to Azure Monitor and Log Analytics workspace of:

* the infrastructure stack (compute, network and storage), and
* the workload stacks (for example, AKS-Hybrid). 

Log Analytics has a rich analytical tool-set that operators can use for troubleshooting or correlating for operational insights. And, Azure Monitor lets operators specify alerts. 
