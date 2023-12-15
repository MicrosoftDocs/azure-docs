---
title: "Azure Operator Nexus: Nexus Kubernetes cluster"
description: Introduction ou to Nexus Kubernetes cluster.
author: jashobhit
ms.author: shobhitjain
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 06/28/2023
ms.custom: template-concept
---

# Nexus Kubernetes cluster overview

This article introduces you to Nexus Kubernetes cluster.

## What is Kubernetes?

Kubernetes is a rapidly evolving platform that manages container-based
applications and their associated networking and storage components.
Kubernetes focuses on the application workloads, not the underlying
infrastructure components. It provides a declarative approach to
deployments, backed by a robust set of APIs for management operations.
See [What is Kubernetes](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-kubernetes/#overview)
to learn about Kubernetes.

## Nexus Kubernetes cluster

Nexus Kubernetes cluster (NKS) is an Operator Nexus version of Kubernetes for on-premises use. It is optimized to automate creation of containers to run tenant network function workloads.

Like any Kubernetes cluster, Nexus Kubernetes cluster has two
components:

• Control plane: provides core Kubernetes services and orchestration of
application workloads.

• Nodes: There are two difference node pools in Nexus Kubernetes
Clusters - System node pools and user node pools. System node pools host
critical system pods. User node pools host application pods. However,
application pods can be scheduled on system node pools if user wants
only one pool in their cluster. Every Nexus Kubernetes Cluster must
contain at least one system node pool with at least one node.

## Failure domain

Operator Nexus ensures that the Nexus Kubernetes Cluster VMs are
distributed across nodes and failure domains (physical racks). This distribution is done in a way that improves the resilience and availability of the
cluster. Operator Nexus uses Kubernetes affinity rules to schedule
clusters in specific zones. This ensures that VMs aren't placed on
the same node or in the same failure domain, improving the cluster's
fault tolerance. The utilization of the failure domains is
especially advantageous when operators have diverse performance
requirements for racks. Or when they aim to guarantee that certain workloads
remain isolated to specific racks.

## Next steps

* [Guide to deploy Nexus kubernetes cluster](./quickstarts-kubernetes-cluster-deployment-bicep.md)
* [Supported Kubernetes versions](./reference-nexus-kubernetes-cluster-supported-versions.md)
