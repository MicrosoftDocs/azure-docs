---
title: "Frequently asked questions - Azure Kubernetes Fleet Manager"
description: This article covers the frequently asked questions for Azure Kubernetes Fleet Manager
ms.date: 10/03/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: ignite-2022
ms.topic: conceptual
---

# Frequently Asked Questions - Azure Kubernetes Fleet Manager

This article covers the frequently asked questions for Azure Kubernetes Fleet Manager.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Relationship to Azure Kubernetes Service clusters

Azure Kubernetes Service (AKS) simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. As a hosted Kubernetes service, Azure handles critical tasks, like health monitoring and maintenance. Since the Kubernetes control plane is managed by Azure, you only manage and maintain the agent nodes. You run your actual workloads on the AKS clusters.

Azure Kubernetes Fleet Manager (Fleet) will help you address at-scale and multi-cluster scenarios for Azure Kubernetes Service clusters. Azure Kubernetes Fleet Manager only provides a group representation for your AKS clusters and helps users with orchestrating Kubernetes resource propagation and multi-cluster load balancing. User workloads can't be run on the fleet cluster itself. 

## Creation of AKS clusters from fleet resource

The current preview of Azure Kubernetes Fleet Manager resource supports joining only existing AKS clusters as member. Creation and lifecycle management of new AKS clusters from fleet cluster is in the [roadmap](https://aka.ms/fleet/roadmap).

## Number of clusters

During preview, you can join up to 20 AKS clusters as member clusters to the same fleet resource.

## AKS clusters that can be joined as members

Fleet supports joining the following types of AKS clusters as member clusters:

* AKS clusters across same or different resource groups within same subscription
* AKS clusters across different subscriptions of the same Azure AD tenant
* AKS clusters from different regions but within the same tenant

## Relationship to Azure-Arc enabled Kubernetes

The current preview of Azure Kubernetes Fleet Manager resource supports joining only AKS clusters as member clusters. Support for joining member clusters to the fleet resource is in the [roadmap](https://aka.ms/fleet/roadmap).

## Regional or global

Azure Kubernetes Fleet Manager resource is a regional resource. Support for region failover for disaster recovery use cases is in the [roadmap](https://aka.ms/fleet/roadmap).

## What happens when the user changes the cluster identity of a joined cluster?
Changing the identity of a joined cluster will break the communication between fleet hub and member clusters. \
The member agent will automatically pick up the new identity and communicate with the hub using the new token.  \
However, the fleet hub is unaware of the new identity, and needs to be reconfigured to authorize the member. \
You can join the member cluster to the fleet again by performing an update operation to notify the fleet hub to pick up the new identity. \ 
If using Azure CLI, you can run "az fleet member create".

## Roadmap

The roadmap for Azure Kubernetes Fleet Manager resource is available [here](https://aka.ms/fleet/roadmap).

## Next steps

* Create an [Azure Kuberntes Fleet Manager resource and join member clusters](./quickstart-create-fleet-and-members.md)
