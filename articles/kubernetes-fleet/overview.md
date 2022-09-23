---
title: "Overview of Azure Kubernetes Fleet Manager (preview)"
services: kubernetes-fleet
ms.service: kubernetes-fleet
ms.date: 08/29/2022
ms.topic: overview
author: shashankbarsin
ms.author: shasb
description: "This article provides an overview of Azure Kubernetes Fleet Manager."
keywords: "Kubernetes, Azure, multi-cluster, multi, containers"
---

# What is Azure Kubernetes Fleet Manager (preview)?

Azure Kubernetes Fleet Manager enables multi-cluster and at-scale scenarios for Azure Kubernetes Service (AKS) clusters. An Azure Kubernetes Fleet Manager resource, called a fleet, creates a cluster that can be used to manage other member clusters.

Azure Kubernetes Fleet Manager supports the following scenarios:

* Create a fleet resource and group AKS clusters as member clusters of the fleet.

* Create Kubernetes objects on fleet cluster and control their propagation to all or a subset of all member clusters.

* Export a service from one member cluster to the fleet. Once successfully exported, the service and its endpoints are synced to the hub, which other member clusters (or any fleet-scoped load balancer) can consume.

<!-- need clarity on this final point. Is "the hub" referring to the fleet cluster? -->

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Next steps

[Create an Azure Kubernetes Fleet Manager resource and group multiple AKS clusters as member clusters of the fleet](./quickstart-create-fleet-and-members.md).
