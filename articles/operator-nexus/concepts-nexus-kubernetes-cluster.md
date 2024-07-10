---
title: "Azure Operator Nexus: Nexus Kubernetes Cluster Service"
description: Introduction to Nexus Kubernetes Cluster Service.
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

Kubernetes is a rapidly evolving platform that manages container-based applications and their associated networking and storage components.
Kubernetes focuses on the application workloads, not the underlying infrastructure components. It provides a declarative approach to
deployments, backed by a robust set of APIs for management operations. See [What is Kubernetes](../aks/concepts-clusters-workloads.md#what-is-kubernetes) to learn about Kubernetes.

## Nexus Kubernetes Service

Nexus Kubernetes Cluster Service is a Kubernetes distribution designed for on-premises deployment over Nexus instances. It's engineered to streamline the automated creation of containers, and is optimized to run workloads associated for data-intensive network functions.

Like any Kubernetes cluster, Nexus Kubernetes cluster has two components:

* Control plane: provides core Kubernetes services and manages the life cycle of application workloads.

* Nodes: To run your applications and supporting services, you need a Kubernetes node. It provides the container runtime environment.
Each NKS cluster has at least one node. Node is hosted in virtual machine (VM) that runs the [Kubernetes node components](../aks/concepts-clusters-workloads.md#nodes). 
VM is created as part of NKS cluster deployment on Nexus instance. There are two types of node pools in Nexus Kubernetes Clusters

  * When you create an AKS cluster, you define the initial number of nodes and their size (SKU), which creates a system node pool. System node pools host critical system pods.
  * On the other hand, to support applications that have different compute or storage demands, you can create user node pools, also known as Nexus Agent pool. Each VM in a Nexus Agent pool adheres to a uniform configuration, such as CPU, memory, disk and so on. Once an Agent pool is established, the number of VMs within it remains fixed. To scale the capacity of a Nexus Kubernetes cluster, more Agent pools can be created and integrated into the existing cluster. In other words, the Nexus Agent pool supports horizontal scaling by allowing the addition or removal of Agent pools within the Nexus Kubernetes cluster.

However, application pods can be scheduled on system node pools in case user wants only one node pool in their cluster. Every Nexus Kubernetes Cluster must
contain at least one system node pool with at least one node.

## Nexus Kubernetes Cluster Add-ons

Nexus Kubernetes Cluster Add-ons is a feature of the Nexus platform that allows customers to enhance their Nexus Kubernetes clusters with extra packages or features. The Add-ons are categorized into two types: required and optional.

* Required Add-ons: Add-ons are automatically deployed into provisioned Nexus Kubernetes clusters. Core add-ons such as Calico, MetalLB, Nexus Storage CSI, IPAM plugins, metrics-server, node-local-dns, Arc for Kubernetes,
and Arc for Servers are included by default when clusters are created. The successful completion of the cluster provisioning process depends on these add-ons being installed successfully. If a required add-on installation fails and can't be fixed, the cluster status is marked as failed.

* Optional Add-ons: Add-ons are supplementary services associated with a Kubernetes Cluster resource. Customers can choose to activate or deactivate these add-ons on demand.
Example for supplementary services could include deployment of cluster-level local image caching registry within the NKS cluster to support for disconnected scenarios. NKS enables the customer to observe the status, health,
and version of each required and optional add-on, which can be monitored on Azure portal, or the state can be fetched using Azure Resource Manager APIs.

Add-ons are installed once and can only be updated or upgraded when the customer upgrades the Nexus Kubernetes cluster. It enables customers to apply critical production hotfixes without interference from the underlying infrastructure operations, which could otherwise overwrite their cluster modifications.

## Nexus Available Zones

Nexus has introduced a concept of Availability Zone. It's delineated at a Rack level and allows customers to spread their workloads across the instance to achieve better availability. For a Nexus instance with eight racks, customers get eight Availability zones.
Each Zone comprises a pair of management servers with redundancy and a collection of compute servers that function as a resource pool.
During multi-rack deployments in Nexus and when performing runtime bundle upgrades, Availability zones provide the added benefit of acting as an upgrade domain. This ensures that, at most, only the servers within a single rack are taken offline for these upgrades.

## Failure domain

Operator Nexus ensures that the Nexus Kubernetes Cluster nodes are distributed across upgrade domains. This distribution is done in a way that improves the resilience and availability of the cluster. Operator Nexus uses Kubernetes affinity rules to schedule nodes in specific zones. It ensures that the underlying VMs aren't placed on the same physical server or in the same upgrade domain, improving the cluster's fault tolerance.

## Next steps

  * [Guide to deploy Nexus kubernetes cluster](./quickstarts-kubernetes-cluster-deployment-bicep.md)
  * [Supported Kubernetes versions](./reference-nexus-kubernetes-cluster-supported-versions.md)
