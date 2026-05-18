---
title: Supercomputer in Microsoft Discovery
description: Conceptual overview of high-performance computing in Microsoft Discovery.
author: richardpaw
ms.author: richardpaw
ms.service: azure
ms.topic: concept-article
ms.date: 04/01/2026
---

# Microsoft Discovery Supercomputer

The Microsoft Discovery service integrates agentic AI, data, and high-performance computing (HPC) into a single research platform. The Microsoft Discovery Supercomputer provides the HPC layer of this platform. Together with its node pools, the Supercomputer runs simulations, large-scale data processing, and other compute-intensive workloads on behalf of Discovery agents and human users.

## Overview

Microsoft Discovery Supercomputer provides access to Microsoft HPC resources spanning thousands of cores across multiple architectures, including CPUs and GPUs. Node pools group these resources so that workloads can be scheduled on hardware suited to workload requirements. Discovery agents submit workloads to the Supercomputer, which selects an appropriate node pool and manages execution.

### Key capabilities

- **Parallel execution.** Supercomputer runs workloads concurrently up to a configurable limit. Later jobs are queued and dispatched as capacity becomes available.
- **Enterprise security and compliance.** All jobs run inside your Azure tenant and inherit your existing compliance and security controls. Source data, models, and intermediate results remain in your subscription.
- **Elastic capacity.** Resources scale on demand within limits that you define, from a few concurrent jobs to tens of thousands.
- **Hardware diversity.** Supported hardware includes GPUs, x86 processors from Intel and AMD, and ARM-based processors. New Azure processor types become available without procurement delays.

### Node pools

A node pool is the granular unit Discovery uses to organize a set of similar compute resources. Each node pool defines the compute and memory configuration of its members so that Discovery can place workloads on the appropriate cluster. Each pool also sets the parallelism limit for workloads scheduled on it.

A node pool specifies the following attributes:

- **Hardware profile (size)** denotes the Azure virtual machine (VM) types used by all nodes in the pool. For example, a GPU pool might use ND-series VMs with NVIDIA Blackwell Ultra GPUs and Grace CPUs for AI workloads, while a CPU pool might use AMD, Intel, or Cobalt ARM processors for traditional HPC. Discovery Supercomputer supports a broad range of Azure HPC for specialized workloads such as GPU-, high-memory workloads, and light scale-out VM types.
- **Capacity** indicates the maximum number of VMs that the pool can run. A pool can have zero nodes when idle and scale up to the configured maximum. Capacity is subject to the quotas of your subscription.
- **Networking and location** defines how nodes in a pool attach to a designated virtual network subnet that allows them to reach platform services, such as storage, and the Supercomputer orchestration system. A node pool resides in the same Azure region and virtual network as the Supercomputer to provide low-latency interconnect for Message Passing Interface (MPI) workloads and data sharing.
- **Workload assignment.** A node pool can be dedicated to a specific workload, team, or project to support isolation and job tracking.

Because Azure resources are virtual, sizing a pool for a peak workload doesn't waste resources when the pool is idle. Administrators can apply concurrency limits per pool, and users and agents dispatch workloads to the pool that best fits their requirements.

## Node pool configurations

Workloads have different processing characteristics. Some are optimized for vector or tensor operations; others are optimized for scalar computation. Node pools allow you to match hardware to workload.

### Hardware categories

- **GPU-accelerated node pools** VMs equipped with GPUs, suited to deep learning training, molecular dynamics, and other algorithms that benefit from GPU acceleration. An ND-series pool with NVIDIA Blackwell GPUs, for example, provides high throughput on matrix computations and is well suited to computational chemistry, genomics, and image processing.
- **CPU-optimized node pools** High-performance CPU VMs for workloads that scale with cores or memory but don't benefit from GPUs, such as traditional HPC and Electronic Design Automation (EDA) workloads, statistical analysis, and data processing. Lower-cost CPU VMs are also appropriate for preprocessing, orchestration, and control workloads.
- **Specialized node pools.** VM sizes that meet specialized hardware requirements, such as FPGAs.

A single Supercomputer can combine multiple hardware categories to support diverse scientific computing on one platform. For example, a pharmaceutical organization might operate one GPU pool for AI-driven molecule generation, a second GPU pool for simulation, and a CPU pool for processing experimental data. A silicon engineering team might pair a GPU pool for electromagnetic simulation with a CPU pool for design verification.

### Scaling models

- **Autoscaling (on-demand) node pools.** The default configuration. The pool has no running nodes when idle. Nodes are provisioned when workloads are dispatched and deallocated when jobs complete, up to the configured maximum. This model is cost-effective for bursty or infrequent workloads.
- **Persistent (always-on) node pools.** Configured with a minimum node count greater than zero. Persistent pools guarantee available capacity for latency-sensitive workloads at the cost of idle VM consumption.

## Prerequisites and artifacts

A Supercomputer deployment requires the following artifacts: virtual network and subnets, managed identities, container images, and resource definitions for tools.

### Network infrastructure

The Supercomputer runs in your Azure environment, so you supply the networking configuration that integrates the HPC cluster with your enterprise network and security controls.

The Supercomputer requires an Azure virtual network and uses two subnets, one for system orchestration and management components, and a second for the compute nodes. Both subnets must reside in the same virtual network, and the system subnet must have connectivity to the node pool subnets so that the control plane can coordinate scheduling and health checks.

### Security and identity

The Supercomputer uses Azure managed identities to interact with other Azure services and to manage VMs.

- **Cluster identity.** A user-assigned managed identity that you assign to the Supercomputer at deployment. The control plane uses this identity to perform cluster operations such as mounting storage and pulling container images from Azure Container Registry (ACR).
- **Node (kubelet) identity.** A second managed identity, assigned to the node VMs, that grants them access to resources such as ACR for tool images. The kubelet identity can have a narrower scope than the cluster identity, but it must hold the Managed Identity Operator role on the cluster identity. This arrangement allows node VMs to use cluster-identity privileges for specific operations without exposing credentials, maintaining separation between the control plane and the node plane.
- **Workload identities.** Discovery supports separate identities for the Supercomputer's computation, administration, and management planes. Workload identities allow the tools to use Azure identity management without having to manage secrets. 
- **Image registry access.** Tool container images are typically stored in ACR or another container registry. The Supercomputer identities require pull access. Configure ACR to trust the Supercomputer's managed identity through Microsoft Entra ID rather than managing Docker credentials directly.
- **Managed resource group.** Creating a Supercomputer creates a managed resource group in your subscription that holds the underlying Azure resources, such as Virtual Machine Scale Sets. Discovery manages this resource group on your behalf, separate from your other resource groups. Ensure that your subscription has sufficient quota for the VM sizes you plan to use. Deleting the Supercomputer removes the managed resource group.

### Tool container images and software environment

Discovery Tools run on Supercomputer using Docker containers. The image must contain the binaries, libraries, and code required by a tool. Images must be compatible with the node operating system, which is Linux by default. When a tool runs, the platform pulls its image from the configured registry onto the assigned node. Bring-your-own tools must include any drivers that aren't present in the base image.

### Deployment sequence

The following sequence outlines how the components are deployed and used.

1. **Create the Supercomputer (control plane).** An administrator deploys a Supercomputer resource through the Azure portal, the Azure CLI, or an ARM template. The deployment specifies a name and region, links the required subnet, and assigns the managed identities.
1. **Provision the HPC cluster (data plane).** Discovery automatically creates a managed resource group and deploys  resources for the cluster, prompts for the subnet configuration, and the baseline environment.
1. **Define node pools (control plane).** The administrator creates one or more node pools for the Supercomputer, specifying the VM size, node subnet, and scaling parameters. Discovery manages the corresponding Virtual Machine Scale Sets in the managed resource group. Pools can start with zero nodes when autoscaling is enabled or with the configured minimum when persistent.
1. **Register tools and agents (control plane).** Tool authors register tools in the Discovery catalog, providing each tool's container image location and resource requirements. Agents can then invoke the registered tools.
1. **Execute workloads (data plane).** When a user starts a job through Copilot or an agent workflow, Discovery orchestrates the run and invokes the required tools on appropriate node pools.
1. **Monitor and complete jobs.** The control plane monitors running jobs through job queues, logs, and health checks. Users receive status updates through Copilot. When a job finishes, results are written to the designated storage and the container terminates. Idle nodes are deallocated on autoscaling pools.
1. **Iterate and scale.** Users can review results and dispatch follow-up runs if needed. Node pools scale on demand, and administrators can resize existing pools or add new ones as workloads evolve.

## Integration with Microsoft.Discovery/storages

Discovery integrates Supercomputer with Azure HPC storage through the `Microsoft.Discovery/storages` resource type. For workloads that require high-performance file storage, Azure NetApp Files is a suitable option.

### DataContainers and data assets

Beyond storage infrastructure, Discovery manages scientific data through DataContainers and data assets. Both are integral to the tool execution pipeline and are defined in Discovery Projects.

#### DataContainers

A DataContainer is a logical data store that abstracts the underlying storage technology and presents a consistent interface to AI agents across Azure Blob Storage, Discovery Storage, and other backends. DataContainers provide:

- **Storage abstraction.** Unified access across storage backends.
- **Access control.** Credential management for secure access.
- **Integration.** A defined integration point between storage resources and research tools.

DataContainers are represented as `Microsoft.Discovery.DataContainer` resources linked to specific storage accounts or volumes.

#### Data assets

A data asset represents an individual file, dataset, or collection inside a DataContainer. Data assets provide:

- **Organization.** Grouping by task, job, or project.
- **Provenance.** A record of data origin and transformations.
- **Metadata.** Descriptive attributes that improve discoverability.
- **Tool I/O.** A structured mechanism for tools to consume and produce data.

Data asset metadata describes the contents, format, and relationships of an asset, allowing assets to participate in complex workflows.


## Next step

> [!div class="nextstepaction"]
> [Create a Supercomputer](how-to-manage-supercomputers.md)
