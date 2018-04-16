---
title: Frequently asked questions for Azure Container Service
description: Provides answers to some of the common questions about Azure Container Service.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 2/14/2018
ms.author: nepeters
---

# Frequently asked questions about Azure Container Service (AKS)

This article addresses frequent questions about Azure Container Service (AKS).

> [!IMPORTANT]
> Azure Container Service (AKS) is currently in **preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).
>

## Which Azure regions provide the Azure Container Service (AKS) today?

- Canada Central
- Canada East
- Central US
- East US
- South East Asia
- West Europe
- West US 2

## When will additional regions be added?

Additional regions are added as demand increases.

## Are security updates applied to AKS agent nodes?

Azure automatically applies security patches to the nodes in your cluster on a nightly schedule. However, you are responsible for ensuring that nodes are rebooted as required. You have several options for performing node reboots:

- Manually, through the Azure portal or the Azure CLI.
- By upgrading your AKS cluster. Cluster upgrades automatically [cordon and drain nodes](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/), then bring them back up with the latest Ubuntu image. Update the OS image on your nodes without changing Kubernetes versions by specifying the current cluster version in `az aks upgrade`.
- Using [Kured](https://github.com/weaveworks/kured), an open-source reboot daemon for Kubernetes. Kured runs as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) and monitors each node for the presence of a file indicating that a reboot is required. It then orchestrates those reboots across the cluster, following the same cordon and drain process described earlier.

## Do you recommend customers use ACS or AKS?

While AKS remains in preview, we recommend creating production clusters using ACS-Kubernetes or [acs-engine](https://github.com/azure/acs-engine). Use AKS for proof-of-concept deployments, and dev/test environments.

## When will ACS be deprecated?

ACS will be deprecated around the time AKS becomes GA. You will have 12 months after that date to migrate clusters to AKS. During the 12-month period, you can run all ACS operations.

## Does AKS support node autoscaling?

Node autoscaling is not supported but is on the roadmap. You might want to take a look at this open-sourced [autoscaling implementation][auto-scaler].

## Does AKS support Kubernetes role-based access control (RBAC)?

No, RBAC is currently not supported in AKS but will be available soon.

## Can I deploy AKS into my existing virtual network?

No, this is not yet available but will be available soon.

## Is Azure Key Vault integrated with AKS?

No, it is not but this integration is planned. In the meantime, try out the following solution from [Hexadite][hexadite].

## Can I run Windows Server containers on AKS?

No, AKS does not currently provide Windows Server-based agent nodes, so you cannot run Windows Server containers. If you need to run Windows Server containers on Kubernetes in Azure, please see the [documentation for acs-engine](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes/windows.md).

## Why are two resource groups created with AKS?

Each AKS deployment spans two resource groups. The first is created by you and contains only the AKS resource. The AKS resource provider automatically creates the second one during deployment with a name like *MC_myResourceGRoup_myAKSCluster_eastus*. The second resource group contains all of the infrastructure resources associated with the cluster, such as VMs, networking, and storage. It is created to simplify resource cleanup.

If you are creating resources that will be used with your AKS cluster, such as storage accounts or reserved public IP address, you should place them in the automatically generated resource group.

<!-- LINKS - external -->
[auto-scaler]: https://github.com/kubernetes/autoscaler
[hexadite]: https://github.com/Hexadite/acs-keyvault-agent