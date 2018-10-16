---
title: Frequently asked questions for Azure Kubernetes Service (AKS)
description: Provides answers to some of the common questions about Azure Kubernetes Service (AKS).
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 08/17/2018
ms.author: iainfou
---

# Frequently asked questions about Azure Kubernetes Service (AKS)

This article addresses frequent questions about Azure Kubernetes Service (AKS).

## Which Azure regions provide the Azure Kubernetes Service (AKS) today?

For a complete list of available regions, see [AKS Regions and availability][aks-regions].

## Does AKS support node autoscaling?

Yes, autoscaling is available via the [Kubernetes autoscaler][auto-scaler] as of Kubernetes 1.10. For more information on how to configure and use the cluster autoscaler, see [Cluster autoscale on AKS][aks-cluster-autoscale].

## Does AKS support Kubernetes role-based access control (RBAC)?

Yes, Kubernetes RBAC is enabled by default when clusters are created with the Azure CLI. RBAC can be enabled for clusters created using the Azure portal or templates.

## Can I deploy AKS into my existing virtual network?

Yes, you can deploy an AKS cluster into an existing virtual network using the [advanced networking feature][aks-advanced-networking].

## Can I restrict the Kubernetes API server to only be accessible within my virtual network?

Not at this time. The Kubernetes API server is exposed as a public fully qualified domain name (FQDN). You can control access to your cluster using [Kubernetes role-based access control (RBAC) and Azure Active Directory (AAD)][aks-rbac-aad]

## Are security updates applied to AKS agent nodes?

Yes, Azure automatically applies security patches to the nodes in your cluster on a nightly schedule. However, you are responsible for ensuring that nodes are rebooted as required. You have several options for performing node reboots:

- Manually, through the Azure portal or the Azure CLI.
- By upgrading your AKS cluster. Cluster upgrades automatically [cordon and drain nodes][cordon-drain], then bring each node back up with the latest Ubuntu image and a new patch version or a minor Kubernetes version. For more information, see [Upgrade an AKS cluster][aks-upgrade].
- Using [Kured](https://github.com/weaveworks/kured), an open-source reboot daemon for Kubernetes. Kured runs as a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) and monitors each node for the presence of a file indicating that a reboot is required. OS reboots are managed across the cluster using the same [cordon and drain process][cordon-drain] as a cluster upgrade.

## Why are two resource groups created with AKS?

Each AKS deployment spans two resource groups:

- The first resource group is created by you and contains only the Kubernetes service resource. The AKS resource provider automatically creates the second one during deployment, such as *MC_myResourceGroup_myAKSCluster_eastus*.
- This second resource group, such as *MC_myResourceGroup_myAKSCluster_eastus*, contains all of the infrastructure resources associated with the cluster. These resources include the Kubernetes node VMs, virtual networking, and storage. This separate resource group is created to simplify resource cleanup.

If you create resources for use with your AKS cluster, such as storage accounts or reserved public IP addresses, place them in the automatically generated resource group.

## Can I modify tags and other properties of the AKS resources in the MC_* resource group?

Modifying and deleting the Azure-created tags and other properties of resources in the *MC_** resource group can lead to unexpected results such as scaling and upgrading errors. It is supported to create and modify additional custom tags, such as to assign a business unit or cost center. Modifying the resources under the *MC_** in the AKS cluster breaks the SLO.

## What Kubernetes admission controllers does AKS support? Can admission controllers be added or removed?

AKS supports the following [admission controllers][admission-controllers]:

- *NamespaceLifecycle*
- *LimitRanger*
- *ServiceAccount*
- *DefaultStorageClass*
- *DefaultTolerationSeconds*
- *MutatingAdmissionWebhook*
- *ValidatingAdmissionWebhook*
- *ResourceQuota*
- *DenyEscalatingExec*
- *AlwaysPullImages*

It is not currently possible to modify the list of admission controllers in AKS.

## Is Azure Key Vault integrated with AKS?

AKS is not currently natively integrated with Azure Key Vault. However, the [Azure Key Vault FlexVolume for Kubernetes project][keyvault-flexvolume] enables direct integration from Kubernetes pods to KeyVault secrets.

## Can I run Windows Server containers on AKS?

To run Windows Server containers, you need to run Windows Server-based nodes. Windows Server-based nodes are not available in AKS at this time. You can, however, use Virtual Kubelet to schedule Windows containers on Azure Container Instances and manage them as part of your AKS cluster. For more information, see [Use Virtual Kubelet with AKS][virtual-kubelet].

## Does AKS offer a service level agreement?

In a service level agreement (SLA), the provider agrees to reimburse the customer for the cost of the service if the published service level isn't met. Since AKS itself is free, there is no cost available to reimburse and thus no formal SLA. However, AKS seeks to maintain availability of at least 99.5% for the Kubernetes API server.

<!-- LINKS - internal -->

[aks-regions]: ./container-service-quotas.md#region-availability
[aks-upgrade]: ./upgrade-cluster.md
[aks-cluster-autoscale]: ./autoscaler.md
[virtual-kubelet]: virtual-kubelet.md
[aks-advanced-networking]: ./networking-overview.md#advanced-networking
[aks-rbac-aad]: ./aad-integration.md

<!-- LINKS - external -->

[auto-scaler]: https://github.com/kubernetes/autoscaler
[cordon-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[hexadite]: https://github.com/Hexadite/acs-keyvault-agent
[admission-controllers]: https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/
[keyvault-flexvolume]: https://github.com/Azure/kubernetes-keyvault-flexvol
