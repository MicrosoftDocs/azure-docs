---
title: "Azure Operator Nexus: Compute"
description: Overview of compute resources for Azure Operator Nexus.
author: mukeshdua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 05/22/2023
ms.custom: template-concept
---

# Azure Operator Nexus compute

Azure Operator Nexus is built on some basic constructs like compute servers, storage appliance, and network fabric devices. These compute servers, also referred to as BareMetal Machines (BMMs), represent the physical machines in the rack. They run the CBL-Mariner operating system and provide closed integration support for high-performance workloads.

These BareMetal Machine gets deployed as part of the Azure Operator Nexus automation suite and live as nodes in a Kubernetes cluster to serve various virtualized and containerized workloads in the ecosystem.

Each BareMetal Machine within an Azure Operator Nexus instance is represented as an Azure resource and Operators (end users) get access to perform various operations to manage its lifecycle like any other Azure resource.

## Key capabilities offered in Azure Operator Nexus compute

- **NUMA Alignment** Nonuniform memory access (NUMA) alignment is a technique to optimize performance and resource utilization in multi-socket servers. It involves aligning memory and compute resources to reduce latency and improve data access within a server system. The strategic placement of software components and workloads in a NUMA-aware manner, Operators can enhance the performance of network functions, such as virtualized routers and firewalls. This placement leads to improved service delivery and responsiveness in their Telco cloud environments. By default, all the workloads deployed in an Azure Operator Nexus instance are NUMA-aligned.
- **CPU Pinning** CPU pinning is a technique to allocate specific CPU cores to dedicated tasks or workloads, ensuring consistent performance and resource isolation. Pinning critical network functions or real-time applications to specific CPU cores allows Operators to minimize latency and improve predictability in their infrastructure. This approach is useful in scenarios where strict quality-of-service requirements exist, ensuring that these tasks receive dedicated processing power for optimal performance. All of the virtual machines created for Virtual Network Function (VNF) or Containerized Network Function (CNF) workloads on Nexus compute are pinned to specific virtual cores. This pinning provides better performance and avoids CPU stealing.
- **CPU Isolation** CPU isolation provides a clear separation between the CPUs allocated for workloads from the CPUs allocated for control plane and platform activities. CPU isolation prevents interference and limits the performance predictability for critical workloads. By isolating CPU cores or groups of cores, we can mitigate the effect of noisy neighbors. It guarantees the required processing power for latency-sensitive applications. Azure Operator Nexus reserves a small set of CPUs for the host operating system and other platform applications. The remaining CPUs are available for running actual workloads.
- **Huge Page Support** Huge page usage in Telco workloads refers to the utilization of large memory pages, typically 2 MB or 1 GB in size, instead of the standard 4-KB pages. This approach helps reduce memory overhead and improves the overall system performance. It reduces the translation look-aside buffer (TLB) miss rate and improves memory access efficiency. Telco workloads that involve large data sets or intensive memory operations, such as network packet processing can benefit from huge page usage as it enhances memory performance and reduces memory-related bottlenecks. As a result, users see improved throughput and reduced latency. All virtual machines created on Azure Operator Nexus can make use of either 2 MB or 1-GB huge pages depending on the flavor of the virtual machine.
- **Dual Stack Support** Dual stack support refers to the ability of networking equipment and protocols to simultaneously handle both IPv4 and IPv6 traffic. With the depletion of available IPv4 addresses and the growing adoption of IPv6, dual stack support is crucial for seamless transition and coexistence between the two protocols. Telco operators utilize dual stack support to ensure compatibility, interoperability, and future-proofing of their networks, allowing them to accommodate both IPv4 and IPv6 devices and services while gradually transitioning towards full IPv6 deployment. Dual stack support ensures uninterrupted connectivity and smooth service delivery to customers regardless of their network addressing protocols. Azure Operator Nexus provides support for both IPV4 and IPV6 configuration across all layers of the stack.
- **Network Interface Cards** Computes in Azure Operator Nexus are designed to meet the requirements for running critical applications that are Telco-grade and can perform fast and efficient data transfer between servers and networks. Workloads can make use of SR-IOV (Single Root I/O Virtualization) that enables the direct assignment of physical I/O resources, such as network interfaces, to virtual machines. This direct assignment bypasses the hypervisor's virtual switch layer. This direct hardware access improves network throughput, reduces latency, and enables more efficient utilization of resources. It makes it an ideal choice for Operators running virtualized and containerized network functions.

## BareMetal machine status

There are multiple properties, which reflects the operational state of BareMetal Machines. Some of these include:
- Power state
- Ready state
- Cordon status
- Detailed status 

_`Power state`_ field indicates the state as derived from BareMetal Controller (BMC). The state can be either 'On' or 'Off'.

The _`Ready State`_ field provides an overall assessment of the BareMetal Machine readiness. It looks at a combination of Detailed Status, Power State and provisioning state of the resource to determine whether the BareMetal Machine is ready or not. When _Ready State_ is 'True', the BareMetal Machine is powered on, the _Detailed Status_ is 'Provisioned' and the node representing the BareMetal Machine has successfully joined the Undercloud Kubernetes cluster. If any of those conditions aren't met, the _Ready State_ is set to 'False'.

The _`Cordon State`_ reflects the ability to run any workloads on machine. Valid values include 'Cordoned' and 'Uncordoned'. "Cordoned' seizes creation of any new workloads on the machine, whereas "Uncordoned' ensures that workloads can now run on this BareMetal Machine.

The BareMetal Machine _`Detailed Status`_ field reflects the current status of the machine.

- Preparing - Preparing for provisioning of the machine
- Provisioning - Provisioning in progress
- **Provisioned** - The OS is provisioned to the machine
- **Available** - Available to participate in the cluster
- **Error** - Unable to provision the machine

Bold indicates an end state status.
_Preparing_ and _Provisioning_ are transitory states. _Available_ indicates the machine has successfully provisioned but is currently powered off.


## BareMetal machine operations

- **Update/Patch BareMetal Machine** Update the bare metal machine resource properties.
- **List/Show BareMetal Machine** Retrieve bare metal machine information.
- **Reimage BareMetal Machine** Reprovision a bare metal machine matching the image version being used across the Cluster.
- **Replace BareMetal Machine** Replace a bare metal machine as part of an effort to service the machine.
- **Restart BareMetal Machine** Reboots a bare metal machine.
- **Power Off BareMetal Machine** Power off a bare metal machine.
- **Start BareMetal Machine** Power on a bare metal machine.
- **Cordon BareMetal Machine** Prevents scheduling of workloads on the specified bare metal machine's Kubernetes node. Optionally allows for evacuation of the workloads from the node.
- **Uncordon BareMetal Machine** Allows scheduling of workloads on the specified bare metal machine's Kubernetes node.
- **BareMetalMachine Validate** Triggers hardware validation of a bare metal machine.
- **BareMetalMachine Run** Allows the customer to run a script specified directly in the input on the targeted bare metal machine.
- **BareMetalMachine Run Data Extract** Allows the customer to run one or more data extractions against a bare metal machine.
- **BareMetalMachine Run Read-only** Allows the customer to run one or more read-only commands against a bare metal machine.

> [!NOTE]
> * Customers cannot explicitly create or delete BareMetal Machines directly. These machines are only created as the realization of the Cluster lifecycle. Implementation will block any creation or delete requests from any user, and only allow internal/application driven creates or deletes.

## Form-factor specific information

Azure Operator Nexus offers a group of on-premises cloud solutions catering to both [Near Edge](reference-near-edge-compute.md) and Far-Edge environments. For more information about the compute offerings and the respective configurations, see the following reference links for more details. 
