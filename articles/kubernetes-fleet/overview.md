---
title: "Overview of Azure Kubernetes Fleet Manager"
services: kubernetes-fleet
ms.service: kubernetes-fleet
ms.custom:
  - ignite-2023
ms.date: 11/06/2023
ms.topic: overview
author: shashankbarsin
ms.author: shasb
description: "This article provides an overview of Azure Kubernetes Fleet Manager."
keywords: "Kubernetes, Azure, multi-cluster, multi, containers"
---

# What is Azure Kubernetes Fleet Manager?

Azure Kubernetes Fleet Manager (Fleet) enables at-scale management of multiple Azure Kubernetes Service (AKS) clusters. Fleet supports the following scenarios:

* Create a Fleet resource and join AKS clusters across regions and subscriptions as member clusters.

* Orchestrate Kubernetes version upgrades and node image upgrades across multiple clusters by using update runs, stages, and groups.

* Create Kubernetes resource objects on the Fleet resource's hub cluster and control their propagation to member clusters (preview).

* Export and import services between member clusters, and load balance incoming layer-4 traffic across service endpoints on multiple clusters (preview).

## Next steps

* [Conceptual overview of Fleets and member clusters](./concepts-fleet.md).
* [Conceptual overview of Update orchestration across multiple member clusters](./concepts-update-orchestration.md).
* [Conceptual overview of Kubernetes resource propagation from hub cluster to member clusters](./concepts-resource-propagation.md).
* [Conceptual overview of Multi-cluster layer-4 load balancing](./concepts-l4-load-balancing.md).
* [Create a fleet and join member clusters](./quickstart-create-fleet-and-members.md).