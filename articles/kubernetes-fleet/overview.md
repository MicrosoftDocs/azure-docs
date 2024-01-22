---
title: "Overview of Azure Kubernetes Fleet Manager"
services: kubernetes-fleet
ms.service: kubernetes-fleet
ms.custom:
  - ignite-2022
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

* Create a Fleet resource and group AKS clusters as member clusters.

* Orchestrate Kubernetes version and node image upgrades across multiple clusters by using update runs, stages, and groups.

* Create Kubernetes resource objects on the Fleet resource's hub cluster and control their propagation to member clusters (preview).

* Export and import services between member clusters, and load balance incoming L4 traffic across service endpoints on multiple clusters (preview).

## Next steps

[Create an Azure Kubernetes Fleet Manager resource and group multiple AKS clusters as member clusters of the fleet](./quickstart-create-fleet-and-members.md).
