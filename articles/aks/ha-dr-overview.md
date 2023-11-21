---
title: High availability and disaster recovery overview for Azure Kubernetes Service (AKS)
description: Learn about the high availability and disaster recovery options for Azure Kubernetes Service (AKS) clusters.
author: schaffererin
ms.author: schaffererin
ms.topic: concept-article
ms.service: azure-kubernetes-service
ms.date: 11/21/2023
---

# High availability and disaster recovery overview for Azure Kubernetes Service (AKS)

When creating and managing applications in the cloud, there's always a risk of disruption from outages and disasters. To ensure business continuity (BC), you need to plan for high availability (HA) and disaster recovery (DR).

HA refers to the design and implementation of a system or service that's highly reliable and experiences minimal downtime. HA is a combination of tools, technologies, and processes that ensure a system or service is available to perform its intended function. HA is a critical component of DR planning. DR is the process of recovering from a disaster and restoring business operations to a normal state. DR is a subset of BC, which is the process of maintaining business functions or quickly resuming them in the event of a major disruption.

This article covers some recommended practices for applications deployed to AKS, but is by no means meant as an exhaustive list of possible solutions.

## Technology overview

A Kubernetes cluster is divided into two components:

- The **control plane**, which provides the core Kubernetes services and orchestration of application workloads, and
- The **nodes**, which run your application workloads.

![Kubernetes control plane and node components](media/concepts-clusters-workloads/control-plane-and-nodes.png)

When you create an AKS cluster, the Azure platform automatically creates and configures a control plane. AKS offers two pricing tiers for cluster management: the **Free tier** and the **Standard tier**. For more information, see [Free and Standard pricing tiers for AKS cluster management](./free-standard-pricing-tiers.md).

The control plane and its resources reside only in the region where you created the cluster. AKS provides a single-tenant control plane with a dedicated API server, scheduler, etc. You define the number and size of the nodes, and the Azure platform configures the secure communication between the control plane and nodes. Interaction with the control plane occurs through Kubernetes APIs, such as `kubectl` or the Kubernetes dashboard.

To run your applications and supporting services, you need a Kubernetes *node*. An AKS cluster has at least one node, an Azure virtual machine (VM) that runs the Kubernetes node components and container runtime. The Azure VM size for your nodes defines CPUs, memory, size, and the storage type available (such as high-performance SSD or regular HDD). Plan the VM and storage size around whether your applications may require large amounts of CPU and memory or high-performance storage. In AKS, the VM image for your cluster's nodes is based on Ubuntu Linux, [Azure Linux](./use-azure-linux.md), or Windows Server 2022. When you create an AKS cluster or scale out the number of nodes, the Azure platform automatically creates and configures the requested number of VMs.

For more information on cluster and workload components in AKS, see [Kubernetes core concepts for AKS](./concepts-clusters-workloads.md).

## Reference architecture

IMAGE

## Scope definition

Application uptime becomes important as you manage AKS clusters. By default, AKS provides high availability by using multiple nodes in a [Virtual Machine Scale Set](../virtual-machine-scale-sets/overview.md), but these nodes don’t protect your system from a region failure. To maximize your uptime, plan ahead to maintain business continuity and prepare for disaster recovery using the following best practices:

- Plan for AKS clusters in multiple regions.
- Route traffic across multiple clusters using Azure Traffic Manager.
- Use geo-replication for your container image registries.
- Plan for application state across multiple clusters.
- Replicate storage across multiple regions.

### Deployment model implementations

| Deployment model | Pros | Cons |
| ---------------- | ---- | ---- |
| [Active-active][active-active] | 