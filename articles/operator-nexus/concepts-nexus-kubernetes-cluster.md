---
title: "Azure Operator Nexus: Nexus Kubernetes cluster"
description: Introduction to Nexus Kubernetes cluster.
author: jashobhit
ms.author: shobhitjain
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 06/28/2023
ms.custom: template-concept
---

# Nexus Kubernetes cluster overview

This article describes core concepts of Nexus Kubernetes Cluster, a managed Kubernetes service that you can use to deploy and operate containerized applications on [Azure Operator Nexus Platform](./overview.md)

## What is Kubernetes?

Kubernetes is a rapidly evolving platform that manages container-based
applications and their associated networking and storage components.
Kubernetes focuses on the application workloads, not the underlying
infrastructure components. It provides a declarative approach to
deployments, backed by a robust set of APIs for management operations.
See [What is Kubernetes](../aks/concepts-clusters-workloads.md#what-is-kubernetes)
to learn about Kubernetes.

## Nexus Kubernetes cluster

Nexus Kubernetes cluster (NKS) is an Operator Nexus version of Kubernetes for on-premises use. It's optimized to automate creation of containers to run tenant network function workloads.

Like any Kubernetes cluster, Nexus Kubernetes cluster has two
components:

* Control plane: provides core Kubernetes services and orchestration of
application workloads.

* Nodes: To run your applications and supporting services, you need a Kubernetes node. 
Each NKS cluster has at least one node, a virtual machine (VM) that runs the [Kubernetes node components](../aks/concepts-clusters-workloads.md#nodes).
There are two different node pools in Nexus Kubernetes Clusters 

     * System node pools host critical system pods. 
     * User node pools host application pods. 

However, application pods can be scheduled on system node pools if user wants
only one node pool in their cluster. Every Nexus Kubernetes Cluster must
contain at least one system node pool with at least one node.


## Nexus Kubernetes Cluster Addons

Nexus Kubernetes Cluster Addons is a feature of the Nexus platform that allows customers to enhance their Nexus Kubernetes clusters with extra packages or features. The addons are categorized into two types: required and optional.

* Required Addons: Addons are automatically deployed into provisioned Nexus Kubernetes clusters. Core addons such as Calico, MetalLB, Nexus Storage CSI, IPAM plugins, metrics-server, node-local-dns, Arc for Kubernetes,
and Arc for Servers are included by default when clusters are created. The successful completion of the cluster provisioning process depends on these addons being installed successfully. If a required addon installation fails and can't be fixed, the cluster status is marked as failed.

* Optional Addons: These are supplementary services associated with a Kubernetes Cluster resource. Customers can choose to activate or deactivate these addons on demand. 
Example for supplementary services could include deployment of cluster-level local image caching registry within the NKS cluster to support for disconnected scenarios. NKS enables the customer to observe the status, health, 
and version of each required and optional addon, which can be monitored on Azure Portal, or the state can be fetched using Azure Resource Manager APIs.

Addons are installed once and can only be updated or upgraded when the customer upgrades the Nexus Kubernetes cluster. This enables customers to apply critical production hotfixes without interference from the underlying infra operators, which could otherwise overwrite their cluster modifications.

## Nexus Available Zones

Nexus has introduced a concept of Availability Zone which ideally is delineated at a Rack level and allows customers to spread their workloads across the instance to achieve better availability. For a Nexus instance with eight racks, customers get eight Availability zones. 
Each Zone comprises a pair of management servers with redundancy and a collection of compute servers that function as a resource pool. Fully redundant Top-of-Rack (ToR) switches are implemented to ensure transport layer resilience. 
During multi-rack deployments in Nexus and when performing runtime bundle upgrades, Availability zones provide the added benefit of acting as an upgrade domain. This ensures that, at most, only the servers within a single rack are taken offline for these upgrades."

## Nexus Agent pool and scalability

The Nexus Agent pool consists of a collection of virtual machines (VMs) that function as worker nodes within a Nexus Kubernetes cluster. Each VM in a Nexus Agent pool adheres to a uniform configuration, such as CPU, memory, disk, etc. Once an Agent pool is established, the number of VMs within it remains fixed. To scale the capacity of a Nexus Kubernetes cluster, more Agent pools can be created and integrated into the existing cluster. In other words, the Nexus Agent pool supports horizontal scaling by allowing the addition or removal of Agent pools within the Nexus Kubernetes cluster.

## Failure domain

Operator Nexus ensures that the Nexus Kubernetes Cluster nodes are
distributed across failure servers and failure domains (physical racks). This distribution is done in a way that improves the resilience and availability of the
cluster. Operator Nexus uses Kubernetes affinity rules to schedule
nodes in specific zones. It ensures that the underlying VMs aren't placed on
the same physical server or in the same upgrade domain, improving the cluster's
fault tolerance. The using of the failure domains is
especially advantageous when operators have diverse performance
requirements for racks. Or when they aim to guarantee that certain workloads
remain isolated in specific racks.

## Next steps

* [Guide to deploy Nexus kubernetes cluster](./quickstarts-kubernetes-cluster-deployment-bicep.md)
* [Supported Kubernetes versions](./reference-nexus-kubernetes-cluster-supported-versions.md)
