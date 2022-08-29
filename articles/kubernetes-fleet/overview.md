---
title: "Overview of Azure Kubernetes Fleet Manager"
services: kubernetes-fleet
ms.service: kubernetes-fleet
ms.date: 08/29/2022
ms.topic: overview
description: "This article provides an overview of Azure Kubernetes Fleet Manager."
keywords: "Kubernetes, Azure, multi-cluster, multi, containers"
---

# What is Azure Kubernetes Fleet Manager?

Azure Kubernetes Fleet Manager enables multi-cluster and at-scale scenarios for Azure Kubernetes Service (AKS) clusters. 

Azure Kubernetes Fleet Manager supports the following scenarios:

* Create fleet resource and group AKS clusters as member clusters of the fleet.

* Create Kubernetes objects on fleet cluster and control their proagatation to all or a subset of all member clusters.

* Export a service from one member cluster to the fleet. Once successfully exported, the service and its endpoints are synced the hub, which other member clusters (or any fleet-scoped load balancer) can consume.


## Next steps

Create an Azure Kubernetes Fleet Manager resource and group multiple AKS clusters as member clusters of the fleet.
